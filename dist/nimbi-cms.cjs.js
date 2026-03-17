"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const Rt={onPageLoad:[],onNavBuild:[],transformHtml:[]};function sn(t,e){if(!Object.prototype.hasOwnProperty.call(Rt,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");Rt[t].push(e)}function es(t){sn("onPageLoad",t)}function ts(t){sn("onNavBuild",t)}function ns(t){sn("transformHtml",t)}async function En(t,e){const n=Rt[t]||[];for(const s of n)try{await s(e)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function rs(){Object.keys(Rt).forEach(t=>{Rt[t].length=0})}function Or(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var wn,gr;function is(){if(gr)return wn;gr=1;function t(w){return w instanceof Map?w.clear=w.delete=w.set=function(){throw new Error("map is read-only")}:w instanceof Set&&(w.add=w.clear=w.delete=function(){throw new Error("set is read-only")}),Object.freeze(w),Object.getOwnPropertyNames(w).forEach(x=>{const R=w[x],Q=typeof R;(Q==="object"||Q==="function")&&!Object.isFrozen(R)&&t(R)}),w}class e{constructor(x){x.data===void 0&&(x.data={}),this.data=x.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(w){return w.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(w,...x){const R=Object.create(null);for(const Q in w)R[Q]=w[Q];return x.forEach(function(Q){for(const ke in Q)R[ke]=Q[ke]}),R}const r="</span>",i=w=>!!w.scope,a=(w,{prefix:x})=>{if(w.startsWith("language:"))return w.replace("language:","language-");if(w.includes(".")){const R=w.split(".");return[`${x}${R.shift()}`,...R.map((Q,ke)=>`${Q}${"_".repeat(ke+1)}`)].join(" ")}return`${x}${w}`};class o{constructor(x,R){this.buffer="",this.classPrefix=R.classPrefix,x.walk(this)}addText(x){this.buffer+=n(x)}openNode(x){if(!i(x))return;const R=a(x.scope,{prefix:this.classPrefix});this.span(R)}closeNode(x){i(x)&&(this.buffer+=r)}value(){return this.buffer}span(x){this.buffer+=`<span class="${x}">`}}const l=(w={})=>{const x={children:[]};return Object.assign(x,w),x};class h{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(x){this.top.children.push(x)}openNode(x){const R=l({scope:x});this.add(R),this.stack.push(R)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(x){return this.constructor._walk(x,this.rootNode)}static _walk(x,R){return typeof R=="string"?x.addText(R):R.children&&(x.openNode(R),R.children.forEach(Q=>this._walk(x,Q)),x.closeNode(R)),x}static _collapse(x){typeof x!="string"&&x.children&&(x.children.every(R=>typeof R=="string")?x.children=[x.children.join("")]:x.children.forEach(R=>{h._collapse(R)}))}}class c extends h{constructor(x){super(),this.options=x}addText(x){x!==""&&this.add(x)}startScope(x){this.openNode(x)}endScope(){this.closeNode()}__addSublanguage(x,R){const Q=x.root;R&&(Q.scope=`language:${R}`),this.add(Q)}toHTML(){return new o(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(w){return w?typeof w=="string"?w:w.source:null}function p(w){return g("(?=",w,")")}function f(w){return g("(?:",w,")*")}function u(w){return g("(?:",w,")?")}function g(...w){return w.map(R=>d(R)).join("")}function m(w){const x=w[w.length-1];return typeof x=="object"&&x.constructor===Object?(w.splice(w.length-1,1),x):{}}function b(...w){return"("+(m(w).capture?"":"?:")+w.map(Q=>d(Q)).join("|")+")"}function y(w){return new RegExp(w.toString()+"|").exec("").length-1}function S(w,x){const R=w&&w.exec(x);return R&&R.index===0}const T=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function M(w,{joinWith:x}){let R=0;return w.map(Q=>{R+=1;const ke=R;let xe=d(Q),z="";for(;xe.length>0;){const N=T.exec(xe);if(!N){z+=xe;break}z+=xe.substring(0,N.index),xe=xe.substring(N.index+N[0].length),N[0][0]==="\\"&&N[1]?z+="\\"+String(Number(N[1])+ke):(z+=N[0],N[0]==="("&&R++)}return z}).map(Q=>`(${Q})`).join(x)}const W=/\b\B/,F="[a-zA-Z]\\w*",ee="[a-zA-Z_]\\w*",K="\\b\\d+(\\.\\d+)?",Y="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",_="\\b(0b[01]+)",D="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",O=(w={})=>{const x=/^#![ ]*\//;return w.binary&&(w.begin=g(x,/.*\b/,w.binary,/\b.*/)),s({scope:"meta",begin:x,end:/$/,relevance:0,"on:begin":(R,Q)=>{R.index!==0&&Q.ignoreMatch()}},w)},oe={begin:"\\\\[\\s\\S]",relevance:0},Z={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[oe]},v={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[oe]},se={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},te=function(w,x,R={}){const Q=s({scope:"comment",begin:w,end:x,contains:[]},R);Q.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const ke=b("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return Q.contains.push({begin:g(/[ ]+/,"(",ke,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),Q},A=te("//","$"),P=te("/\\*","\\*/"),L=te("#","$"),C={scope:"number",begin:K,relevance:0},B={scope:"number",begin:Y,relevance:0},k={scope:"number",begin:_,relevance:0},I={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[oe,{begin:/\[/,end:/\]/,relevance:0,contains:[oe]}]},ne={scope:"title",begin:F,relevance:0},ue={scope:"title",begin:ee,relevance:0},fe={begin:"\\.\\s*"+ee,relevance:0};var ye=Object.freeze({__proto__:null,APOS_STRING_MODE:Z,BACKSLASH_ESCAPE:oe,BINARY_NUMBER_MODE:k,BINARY_NUMBER_RE:_,COMMENT:te,C_BLOCK_COMMENT_MODE:P,C_LINE_COMMENT_MODE:A,C_NUMBER_MODE:B,C_NUMBER_RE:Y,END_SAME_AS_BEGIN:function(w){return Object.assign(w,{"on:begin":(x,R)=>{R.data._beginMatch=x[1]},"on:end":(x,R)=>{R.data._beginMatch!==x[1]&&R.ignoreMatch()}})},HASH_COMMENT_MODE:L,IDENT_RE:F,MATCH_NOTHING_RE:W,METHOD_GUARD:fe,NUMBER_MODE:C,NUMBER_RE:K,PHRASAL_WORDS_MODE:se,QUOTE_STRING_MODE:v,REGEXP_MODE:I,RE_STARTERS_RE:D,SHEBANG:O,TITLE_MODE:ne,UNDERSCORE_IDENT_RE:ee,UNDERSCORE_TITLE_MODE:ue});function de(w,x){w.input[w.index-1]==="."&&x.ignoreMatch()}function Be(w,x){w.className!==void 0&&(w.scope=w.className,delete w.className)}function Qe(w,x){x&&w.beginKeywords&&(w.begin="\\b("+w.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",w.__beforeBegin=de,w.keywords=w.keywords||w.beginKeywords,delete w.beginKeywords,w.relevance===void 0&&(w.relevance=0))}function cn(w,x){Array.isArray(w.illegal)&&(w.illegal=b(...w.illegal))}function ki(w,x){if(w.match){if(w.begin||w.end)throw new Error("begin & end are not supported with match");w.begin=w.match,delete w.match}}function xi(w,x){w.relevance===void 0&&(w.relevance=1)}const Si=(w,x)=>{if(!w.beforeMatch)return;if(w.starts)throw new Error("beforeMatch cannot be used with starts");const R=Object.assign({},w);Object.keys(w).forEach(Q=>{delete w[Q]}),w.keywords=R.keywords,w.begin=g(R.beforeMatch,p(R.begin)),w.starts={relevance:0,contains:[Object.assign(R,{endsParent:!0})]},w.relevance=0,delete R.beforeMatch},vi=["of","and","for","in","not","or","if","then","parent","list","value"],Ai="keyword";function Jn(w,x,R=Ai){const Q=Object.create(null);return typeof w=="string"?ke(R,w.split(" ")):Array.isArray(w)?ke(R,w):Object.keys(w).forEach(function(xe){Object.assign(Q,Jn(w[xe],x,xe))}),Q;function ke(xe,z){x&&(z=z.map(N=>N.toLowerCase())),z.forEach(function(N){const G=N.split("|");Q[G[0]]=[xe,Ei(G[0],G[1])]})}}function Ei(w,x){return x?Number(x):Li(w)?0:1}function Li(w){return vi.includes(w.toLowerCase())}const er={},nt=w=>{console.error(w)},tr=(w,...x)=>{console.log(`WARN: ${w}`,...x)},ct=(w,x)=>{er[`${w}/${x}`]||(console.log(`Deprecated as of ${w}. ${x}`),er[`${w}/${x}`]=!0)},zt=new Error;function nr(w,x,{key:R}){let Q=0;const ke=w[R],xe={},z={};for(let N=1;N<=x.length;N++)z[N+Q]=ke[N],xe[N+Q]=!0,Q+=y(x[N-1]);w[R]=z,w[R]._emit=xe,w[R]._multi=!0}function Ti(w){if(Array.isArray(w.begin)){if(w.skip||w.excludeBegin||w.returnBegin)throw nt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),zt;if(typeof w.beginScope!="object"||w.beginScope===null)throw nt("beginScope must be object"),zt;nr(w,w.begin,{key:"beginScope"}),w.begin=M(w.begin,{joinWith:""})}}function Ci(w){if(Array.isArray(w.end)){if(w.skip||w.excludeEnd||w.returnEnd)throw nt("skip, excludeEnd, returnEnd not compatible with endScope: {}"),zt;if(typeof w.endScope!="object"||w.endScope===null)throw nt("endScope must be object"),zt;nr(w,w.end,{key:"endScope"}),w.end=M(w.end,{joinWith:""})}}function Ri(w){w.scope&&typeof w.scope=="object"&&w.scope!==null&&(w.beginScope=w.scope,delete w.scope)}function Mi(w){Ri(w),typeof w.beginScope=="string"&&(w.beginScope={_wrap:w.beginScope}),typeof w.endScope=="string"&&(w.endScope={_wrap:w.endScope}),Ti(w),Ci(w)}function _i(w){function x(z,N){return new RegExp(d(z),"m"+(w.case_insensitive?"i":"")+(w.unicodeRegex?"u":"")+(N?"g":""))}class R{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(N,G){G.position=this.position++,this.matchIndexes[this.matchAt]=G,this.regexes.push([G,N]),this.matchAt+=y(N)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const N=this.regexes.map(G=>G[1]);this.matcherRe=x(M(N,{joinWith:"|"}),!0),this.lastIndex=0}exec(N){this.matcherRe.lastIndex=this.lastIndex;const G=this.matcherRe.exec(N);if(!G)return null;const Ee=G.findIndex((mt,hn)=>hn>0&&mt!==void 0),Se=this.matchIndexes[Ee];return G.splice(0,Ee),Object.assign(G,Se)}}class Q{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(N){if(this.multiRegexes[N])return this.multiRegexes[N];const G=new R;return this.rules.slice(N).forEach(([Ee,Se])=>G.addRule(Ee,Se)),G.compile(),this.multiRegexes[N]=G,G}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(N,G){this.rules.push([N,G]),G.type==="begin"&&this.count++}exec(N){const G=this.getMatcher(this.regexIndex);G.lastIndex=this.lastIndex;let Ee=G.exec(N);if(this.resumingScanAtSamePosition()&&!(Ee&&Ee.index===this.lastIndex)){const Se=this.getMatcher(0);Se.lastIndex=this.lastIndex+1,Ee=Se.exec(N)}return Ee&&(this.regexIndex+=Ee.position+1,this.regexIndex===this.count&&this.considerAll()),Ee}}function ke(z){const N=new Q;return z.contains.forEach(G=>N.addRule(G.begin,{rule:G,type:"begin"})),z.terminatorEnd&&N.addRule(z.terminatorEnd,{type:"end"}),z.illegal&&N.addRule(z.illegal,{type:"illegal"}),N}function xe(z,N){const G=z;if(z.isCompiled)return G;[Be,ki,Mi,Si].forEach(Se=>Se(z,N)),w.compilerExtensions.forEach(Se=>Se(z,N)),z.__beforeBegin=null,[Qe,cn,xi].forEach(Se=>Se(z,N)),z.isCompiled=!0;let Ee=null;return typeof z.keywords=="object"&&z.keywords.$pattern&&(z.keywords=Object.assign({},z.keywords),Ee=z.keywords.$pattern,delete z.keywords.$pattern),Ee=Ee||/\w+/,z.keywords&&(z.keywords=Jn(z.keywords,w.case_insensitive)),G.keywordPatternRe=x(Ee,!0),N&&(z.begin||(z.begin=/\B|\b/),G.beginRe=x(G.begin),!z.end&&!z.endsWithParent&&(z.end=/\B|\b/),z.end&&(G.endRe=x(G.end)),G.terminatorEnd=d(G.end)||"",z.endsWithParent&&N.terminatorEnd&&(G.terminatorEnd+=(z.end?"|":"")+N.terminatorEnd)),z.illegal&&(G.illegalRe=x(z.illegal)),z.contains||(z.contains=[]),z.contains=[].concat(...z.contains.map(function(Se){return $i(Se==="self"?z:Se)})),z.contains.forEach(function(Se){xe(Se,G)}),z.starts&&xe(z.starts,N),G.matcher=ke(G),G}if(w.compilerExtensions||(w.compilerExtensions=[]),w.contains&&w.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return w.classNameAliases=s(w.classNameAliases||{}),xe(w)}function rr(w){return w?w.endsWithParent||rr(w.starts):!1}function $i(w){return w.variants&&!w.cachedVariants&&(w.cachedVariants=w.variants.map(function(x){return s(w,{variants:null},x)})),w.cachedVariants?w.cachedVariants:rr(w)?s(w,{starts:w.starts?s(w.starts):null}):Object.isFrozen(w)?s(w):w}var Pi="11.11.1";class Ii extends Error{constructor(x,R){super(x),this.name="HTMLInjectionError",this.html=R}}const un=n,ir=s,sr=Symbol("nomatch"),Ni=7,ar=function(w){const x=Object.create(null),R=Object.create(null),Q=[];let ke=!0;const xe="Could not find the language '{}', did you forget to load/include a language module?",z={disableAutodetect:!0,name:"Plain text",contains:[]};let N={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:c};function G(E){return N.noHighlightRe.test(E)}function Ee(E){let H=E.className+" ";H+=E.parentNode?E.parentNode.className:"";const ie=N.languageDetectRe.exec(H);if(ie){const pe=Xe(ie[1]);return pe||(tr(xe.replace("{}",ie[1])),tr("Falling back to no-highlight mode for this block.",E)),pe?ie[1]:"no-highlight"}return H.split(/\s+/).find(pe=>G(pe)||Xe(pe))}function Se(E,H,ie){let pe="",ve="";typeof H=="object"?(pe=E,ie=H.ignoreIllegals,ve=H.language):(ct("10.7.0","highlight(lang, code, ...args) has been deprecated."),ct("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),ve=E,pe=H),ie===void 0&&(ie=!0);const Oe={code:pe,language:ve};Ot("before:highlight",Oe);const Ke=Oe.result?Oe.result:mt(Oe.language,Oe.code,ie);return Ke.code=Oe.code,Ot("after:highlight",Ke),Ke}function mt(E,H,ie,pe){const ve=Object.create(null);function Oe($,q){return $.keywords[q]}function Ke(){if(!X.keywords){Te.addText(ge);return}let $=0;X.keywordPatternRe.lastIndex=0;let q=X.keywordPatternRe.exec(ge),J="";for(;q;){J+=ge.substring($,q.index);const he=Ue.case_insensitive?q[0].toLowerCase():q[0],Ce=Oe(X,he);if(Ce){const[Fe,Vi]=Ce;if(Te.addText(J),J="",ve[he]=(ve[he]||0)+1,ve[he]<=Ni&&(Ht+=Vi),Fe.startsWith("_"))J+=q[0];else{const Ji=Ue.classNameAliases[Fe]||Fe;He(q[0],Ji)}}else J+=q[0];$=X.keywordPatternRe.lastIndex,q=X.keywordPatternRe.exec(ge)}J+=ge.substring($),Te.addText(J)}function qt(){if(ge==="")return;let $=null;if(typeof X.subLanguage=="string"){if(!x[X.subLanguage]){Te.addText(ge);return}$=mt(X.subLanguage,ge,!0,pr[X.subLanguage]),pr[X.subLanguage]=$._top}else $=dn(ge,X.subLanguage.length?X.subLanguage:null);X.relevance>0&&(Ht+=$.relevance),Te.__addSublanguage($._emitter,$.language)}function Pe(){X.subLanguage!=null?qt():Ke(),ge=""}function He($,q){$!==""&&(Te.startScope(q),Te.addText($),Te.endScope())}function ur($,q){let J=1;const he=q.length-1;for(;J<=he;){if(!$._emit[J]){J++;continue}const Ce=Ue.classNameAliases[$[J]]||$[J],Fe=q[J];Ce?He(Fe,Ce):(ge=Fe,Ke(),ge=""),J++}}function hr($,q){return $.scope&&typeof $.scope=="string"&&Te.openNode(Ue.classNameAliases[$.scope]||$.scope),$.beginScope&&($.beginScope._wrap?(He(ge,Ue.classNameAliases[$.beginScope._wrap]||$.beginScope._wrap),ge=""):$.beginScope._multi&&(ur($.beginScope,q),ge="")),X=Object.create($,{parent:{value:X}}),X}function dr($,q,J){let he=S($.endRe,J);if(he){if($["on:end"]){const Ce=new e($);$["on:end"](q,Ce),Ce.isMatchIgnored&&(he=!1)}if(he){for(;$.endsParent&&$.parent;)$=$.parent;return $}}if($.endsWithParent)return dr($.parent,q,J)}function Gi($){return X.matcher.regexIndex===0?(ge+=$[0],1):(mn=!0,0)}function Qi($){const q=$[0],J=$.rule,he=new e(J),Ce=[J.__beforeBegin,J["on:begin"]];for(const Fe of Ce)if(Fe&&(Fe($,he),he.isMatchIgnored))return Gi(q);return J.skip?ge+=q:(J.excludeBegin&&(ge+=q),Pe(),!J.returnBegin&&!J.excludeBegin&&(ge=q)),hr(J,$),J.returnBegin?0:q.length}function Xi($){const q=$[0],J=H.substring($.index),he=dr(X,$,J);if(!he)return sr;const Ce=X;X.endScope&&X.endScope._wrap?(Pe(),He(q,X.endScope._wrap)):X.endScope&&X.endScope._multi?(Pe(),ur(X.endScope,$)):Ce.skip?ge+=q:(Ce.returnEnd||Ce.excludeEnd||(ge+=q),Pe(),Ce.excludeEnd&&(ge=q));do X.scope&&Te.closeNode(),!X.skip&&!X.subLanguage&&(Ht+=X.relevance),X=X.parent;while(X!==he.parent);return he.starts&&hr(he.starts,$),Ce.returnEnd?0:q.length}function Ki(){const $=[];for(let q=X;q!==Ue;q=q.parent)q.scope&&$.unshift(q.scope);$.forEach(q=>Te.openNode(q))}let Dt={};function fr($,q){const J=q&&q[0];if(ge+=$,J==null)return Pe(),0;if(Dt.type==="begin"&&q.type==="end"&&Dt.index===q.index&&J===""){if(ge+=H.slice(q.index,q.index+1),!ke){const he=new Error(`0 width match regex (${E})`);throw he.languageName=E,he.badRule=Dt.rule,he}return 1}if(Dt=q,q.type==="begin")return Qi(q);if(q.type==="illegal"&&!ie){const he=new Error('Illegal lexeme "'+J+'" for mode "'+(X.scope||"<unnamed>")+'"');throw he.mode=X,he}else if(q.type==="end"){const he=Xi(q);if(he!==sr)return he}if(q.type==="illegal"&&J==="")return ge+=`
`,1;if(gn>1e5&&gn>q.index*3)throw new Error("potential infinite loop, way more iterations than matches");return ge+=J,J.length}const Ue=Xe(E);if(!Ue)throw nt(xe.replace("{}",E)),new Error('Unknown language: "'+E+'"');const Yi=_i(Ue);let pn="",X=pe||Yi;const pr={},Te=new N.__emitter(N);Ki();let ge="",Ht=0,rt=0,gn=0,mn=!1;try{if(Ue.__emitTokens)Ue.__emitTokens(H,Te);else{for(X.matcher.considerAll();;){gn++,mn?mn=!1:X.matcher.considerAll(),X.matcher.lastIndex=rt;const $=X.matcher.exec(H);if(!$)break;const q=H.substring(rt,$.index),J=fr(q,$);rt=$.index+J}fr(H.substring(rt))}return Te.finalize(),pn=Te.toHTML(),{language:E,value:pn,relevance:Ht,illegal:!1,_emitter:Te,_top:X}}catch($){if($.message&&$.message.includes("Illegal"))return{language:E,value:un(H),illegal:!0,relevance:0,_illegalBy:{message:$.message,index:rt,context:H.slice(rt-100,rt+100),mode:$.mode,resultSoFar:pn},_emitter:Te};if(ke)return{language:E,value:un(H),illegal:!1,relevance:0,errorRaised:$,_emitter:Te,_top:X};throw $}}function hn(E){const H={value:un(E),illegal:!1,relevance:0,_top:z,_emitter:new N.__emitter(N)};return H._emitter.addText(E),H}function dn(E,H){H=H||N.languages||Object.keys(x);const ie=hn(E),pe=H.filter(Xe).filter(cr).map(Pe=>mt(Pe,E,!1));pe.unshift(ie);const ve=pe.sort((Pe,He)=>{if(Pe.relevance!==He.relevance)return He.relevance-Pe.relevance;if(Pe.language&&He.language){if(Xe(Pe.language).supersetOf===He.language)return 1;if(Xe(He.language).supersetOf===Pe.language)return-1}return 0}),[Oe,Ke]=ve,qt=Oe;return qt.secondBest=Ke,qt}function zi(E,H,ie){const pe=H&&R[H]||ie;E.classList.add("hljs"),E.classList.add(`language-${pe}`)}function fn(E){let H=null;const ie=Ee(E);if(G(ie))return;if(Ot("before:highlightElement",{el:E,language:ie}),E.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",E);return}if(E.children.length>0&&(N.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(E)),N.throwUnescapedHTML))throw new Ii("One of your code blocks includes unescaped HTML.",E.innerHTML);H=E;const pe=H.textContent,ve=ie?Se(pe,{language:ie,ignoreIllegals:!0}):dn(pe);E.innerHTML=ve.value,E.dataset.highlighted="yes",zi(E,ie,ve.language),E.result={language:ve.language,re:ve.relevance,relevance:ve.relevance},ve.secondBest&&(E.secondBest={language:ve.secondBest.language,relevance:ve.secondBest.relevance}),Ot("after:highlightElement",{el:E,result:ve,text:pe})}function Bi(E){N=ir(N,E)}const Oi=()=>{Bt(),ct("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function qi(){Bt(),ct("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let lr=!1;function Bt(){function E(){Bt()}if(document.readyState==="loading"){lr||window.addEventListener("DOMContentLoaded",E,!1),lr=!0;return}document.querySelectorAll(N.cssSelector).forEach(fn)}function Di(E,H){let ie=null;try{ie=H(w)}catch(pe){if(nt("Language definition for '{}' could not be registered.".replace("{}",E)),ke)nt(pe);else throw pe;ie=z}ie.name||(ie.name=E),x[E]=ie,ie.rawDefinition=H.bind(null,w),ie.aliases&&or(ie.aliases,{languageName:E})}function Hi(E){delete x[E];for(const H of Object.keys(R))R[H]===E&&delete R[H]}function Ui(){return Object.keys(x)}function Xe(E){return E=(E||"").toLowerCase(),x[E]||x[R[E]]}function or(E,{languageName:H}){typeof E=="string"&&(E=[E]),E.forEach(ie=>{R[ie.toLowerCase()]=H})}function cr(E){const H=Xe(E);return H&&!H.disableAutodetect}function ji(E){E["before:highlightBlock"]&&!E["before:highlightElement"]&&(E["before:highlightElement"]=H=>{E["before:highlightBlock"](Object.assign({block:H.el},H))}),E["after:highlightBlock"]&&!E["after:highlightElement"]&&(E["after:highlightElement"]=H=>{E["after:highlightBlock"](Object.assign({block:H.el},H))})}function Wi(E){ji(E),Q.push(E)}function Fi(E){const H=Q.indexOf(E);H!==-1&&Q.splice(H,1)}function Ot(E,H){const ie=E;Q.forEach(function(pe){pe[ie]&&pe[ie](H)})}function Zi(E){return ct("10.7.0","highlightBlock will be removed entirely in v12.0"),ct("10.7.0","Please use highlightElement now."),fn(E)}Object.assign(w,{highlight:Se,highlightAuto:dn,highlightAll:Bt,highlightElement:fn,highlightBlock:Zi,configure:Bi,initHighlighting:Oi,initHighlightingOnLoad:qi,registerLanguage:Di,unregisterLanguage:Hi,listLanguages:Ui,getLanguage:Xe,registerAliases:or,autoDetection:cr,inherit:ir,addPlugin:Wi,removePlugin:Fi}),w.debugMode=function(){ke=!1},w.safeMode=function(){ke=!0},w.versionString=Pi,w.regex={concat:g,lookahead:p,either:b,optional:u,anyNumberOfTimes:f};for(const E in ye)typeof ye[E]=="object"&&t(ye[E]);return Object.assign(w,ye),w},ut=ar({});return ut.newInstance=()=>ar({}),wn=ut,ut.HighlightJS=ut,ut.default=ut,wn}var ss=is();const me=Or(ss),as="11.11.1",re=new Map,ls="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Ie={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Ie.html="xml";Ie.xhtml="xml";Ie.markup="xml";const Nn=new Set(["magic","undefined"]);let Je=null;const bn=new Map,os=300*1e3;async function zn(t=ls){if(t)return Je||(Je=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const s=(await e.text()).split(/\r?\n/);let r=-1;for(let h=0;h<s.length;h++)if(/\|\s*Language\s*\|/i.test(s[h])){r=h;break}if(r===-1)return;const i=s[r].replace(/^\||\|$/g,"").split("|").map(h=>h.trim().toLowerCase());let a=i.findIndex(h=>/alias|aliases|equivalent|alt|alternates?/i.test(h));a===-1&&(a=1);let o=i.findIndex(h=>/file|filename|module|module name|module-name|short|slug/i.test(h));if(o===-1){const h=i.findIndex(c=>/language/i.test(c));o=h!==-1?h:0}let l=[];for(let h=r+1;h<s.length;h++){const c=s[h].trim();if(!c||!c.startsWith("|"))break;const d=c.replace(/^\||\|$/g,"").split("|").map(m=>m.trim());if(d.every(m=>/^-+$/.test(m)))continue;const p=d;if(!p.length)continue;const u=(p[o]||p[0]||"").toString().trim().toLowerCase();if(!u||/^-+$/.test(u))continue;re.set(u,u);const g=p[a]||"";if(g){const m=String(g).split(",").map(b=>b.replace(/`/g,"").trim()).filter(Boolean);if(m.length){const y=m[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(re.set(y,y),l.push(y))}}}try{const h=[];for(const c of l){const d=String(c||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");d&&/[a-z0-9]/i.test(d)?h.push(d):re.delete(c)}l=h}catch(h){console.warn("[codeblocksManager] cleanup aliases failed",h)}try{let h=0;for(const c of Array.from(re.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){re.delete(c),h++;continue}if(/^[:]+/.test(c)){const d=c.replace(/^[:]+/,"");if(d&&/[a-z0-9]/i.test(d)){const p=re.get(c);re.delete(c),re.set(d,p)}else re.delete(c),h++}}for(const[c,d]of Array.from(re.entries()))(!d||/^-+$/.test(d)||!/[a-z0-9]/i.test(d))&&(re.delete(c),h++);try{const c=":---------------------";re.has(c)&&(re.delete(c),h++)}catch(c){console.warn("[codeblocksManager] remove sep key failed",c)}try{const c=Array.from(re.keys()).sort()}catch(c){console.warn("[codeblocksManager] compute supported keys failed",c)}}catch(h){console.warn("[codeblocksManager] ignored error",h)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),Je)}const wt=new Set;async function pt(t,e){if(Je||(async()=>{try{await zn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Je)try{await Je}catch{}if(t=t==null?"":String(t),t=t.trim(),!t)return!1;const n=t.toLowerCase();if(Nn.has(n))return!1;if(re.size&&!re.has(n)){const r=Ie;if(!r[n]&&!r[t])return!1}if(wt.has(t))return!0;const s=Ie;try{const r=(e||t||"").toString().replace(/\.js$/i,"").trim(),i=(s[t]||t||"").toString(),a=(s[r]||r||"").toString();let o=Array.from(new Set([i,a,r,t,s[r],s[t]].filter(Boolean))).map(c=>String(c).toLowerCase()).filter(c=>c&&c!=="undefined");re.size&&(o=o.filter(c=>{if(re.has(c))return!0;const d=Ie[c];return!!(d&&re.has(d))}));let l=null,h=null;for(const c of o)try{const d=Date.now();let p=bn.get(c);if(p&&p.ok===!1&&d-(p.ts||0)>=os&&(bn.delete(c),p=void 0),p){if(p.module)l=p.module;else if(p.promise)try{l=await p.promise}catch{l=null}}else{const f={promise:null,module:null,ok:null,ts:0};bn.set(c,f),f.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${c}.js`)}catch{return await import(`highlight.js/lib/languages/${c}`)}}catch{try{const g=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;return await new Function("u","return import(u)")(g)}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;return await new Function("u","return import(u)")(m)}catch{return null}}}}catch{return null}})();try{l=await f.promise,f.module=l,f.ok=!!l,f.ts=Date.now()}catch{f.module=null,f.ok=!1,f.ts=Date.now(),l=null}}if(l){const f=l.default||l;try{const u=re.size&&re.get(t)||c||t;return me.registerLanguage(u,f),wt.add(u),u!==t&&(me.registerLanguage(t,f),wt.add(t)),!0}catch(u){h=u}}else try{if(re.has(c)||re.has(t)){const f=()=>({});try{me.registerLanguage(c,f),wt.add(c)}catch{}try{c!==t&&(me.registerLanguage(t,f),wt.add(t))}catch{}return!0}}catch{}}catch(d){h=d}if(h)throw h;return!1}catch{return!1}}let Ut=null;function qr(t=document){Je||(async()=>{try{await zn()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const e=Ie,s=Ut||(typeof IntersectionObserver>"u"?null:(Ut=new IntersectionObserver((i,a)=>{i.forEach(o=>{if(!o.isIntersecting)return;const l=o.target;try{a.unobserve(l)}catch(h){console.warn("[codeblocksManager] observer unobserve failed",h)}(async()=>{try{const h=l.getAttribute&&l.getAttribute("class")||l.className||"",c=h.match(/language-([a-zA-Z0-9_+-]+)/)||h.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const d=(c[1]||"").toLowerCase(),p=e[d]||d,f=re.size&&(re.get(p)||re.get(String(p).toLowerCase()))||p;try{await pt(f)}catch(u){console.warn("[codeblocksManager] registerLanguage failed",u)}try{try{const u=l.textContent||l.innerText||"";u!=null&&(l.textContent=u)}catch{}try{l&&l.dataset&&l.dataset.highlighted&&delete l.dataset.highlighted}catch{}me.highlightElement(l)}catch(u){console.warn("[codeblocksManager] hljs.highlightElement failed",u)}}else try{const d=l.textContent||"";try{if(me&&typeof me.getLanguage=="function"&&me.getLanguage("plaintext")){const p=me.highlight(d,{language:"plaintext"});p&&p.value&&(l.innerHTML=p.value)}}catch{try{me.highlightElement(l)}catch(f){console.warn("[codeblocksManager] fallback highlightElement failed",f)}}}catch(d){console.warn("[codeblocksManager] auto-detect plaintext failed",d)}}catch(h){console.warn("[codeblocksManager] observer entry processing failed",h)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Ut)),r=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!s){r.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",o=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const l=(o[1]||"").toLowerCase(),h=e[l]||l,c=re.size&&(re.get(h)||re.get(String(h).toLowerCase()))||h;try{await pt(c)}catch(d){console.warn("[codeblocksManager] registerLanguage failed (no observer)",d)}}try{try{const l=i.textContent||i.innerText||"";l!=null&&(i.textContent=l)}catch{}try{i&&i.dataset&&i.dataset.highlighted&&delete i.dataset.highlighted}catch{}me.highlightElement(i)}catch(l){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function cs(t,{useCdn:e=!0}={}){const n=document.querySelector("link[data-hl-theme]"),s=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=t==null?"default":String(t),i=r&&String(r).toLowerCase()||"";if(i==="default"||i==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(s&&s.toLowerCase()===i)return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");return}const a=i,o=`https://cdn.jsdelivr.net/npm/highlight.js@${as}/styles/${a}.css`,l=document.createElement("link");l.rel="stylesheet",l.href=o,l.setAttribute("data-hl-theme",a),l.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(l)}let st="light";function us(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=t,Object.entries(e).forEach(([s,r])=>n.setAttribute(s,r)),document.head.appendChild(n),e["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let s=Number(n.getAttribute("data-bulmaswatch-move-count")||0),r=!1;const i=new MutationObserver(()=>{try{if(r)return;const o=n.parentNode;if(!o||o.lastElementChild===n)return;if(s>=1e3){n.setAttribute("data-bulmaswatch-move-stopped","1");return}r=!0;try{o.appendChild(n)}catch{}s+=1,n.setAttribute("data-bulmaswatch-move-count",String(s)),r=!1}catch{}});try{i.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(s))}catch{}const a=document.head;a&&a.lastElementChild!==n&&a.appendChild(n)}catch{}}function mr(){try{const t=Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));for(const e of t)e&&e.parentNode&&e.parentNode.removeChild(e)}catch{}try{const t=Array.from(document.querySelectorAll("style[data-bulma-override]"));for(const e of t)e&&e.parentNode&&e.parentNode.removeChild(e)}catch{}}async function Dr(t="none",e="/"){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.debug("[bulmaManager] ensureBulma called",{bulmaCustomize:t,pageDir:e})}catch{}if(!t)return;if(t==="none"){try{const i=[location&&location.protocol&&location.protocol==="file:"?"https://unpkg.com/bulma/css/bulma.min.css":"//unpkg.com/bulma/css/bulma.min.css","https://unpkg.com/bulma/css/bulma.min.css"];let a=!1;for(const o of i)try{if(document.querySelector(`link[href="${o}"]`)){a=!0;break}}catch{}if(!a){const o=i[0],l=document.createElement("link");l.rel="stylesheet",l.href=o,l.setAttribute("data-bulma-base","1");const h=document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');h&&h.parentNode?h.parentNode.insertBefore(l,h):document.head.appendChild(l)}}catch{}try{const i=Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));for(const a of i)a&&a.parentNode&&a.parentNode.removeChild(a)}catch{}try{const i=Array.from(document.querySelectorAll("style[data-bulma-override]"));for(const a of i)a&&a.parentNode&&a.parentNode.removeChild(a)}catch{}return}const s=[e+"bulma.css","/bulma.css"],r=Array.from(new Set(s));if(t==="local"){if(mr(),document.querySelector("style[data-bulma-override]"))return;for(const i of r)try{const a=await fetch(i,{method:"GET"});if(a.ok){const o=await a.text(),l=document.createElement("style");l.setAttribute("data-bulma-override",i),l.appendChild(document.createTextNode(`
/* bulma override: ${i} */
`+o)),document.head.appendChild(l);return}}catch(a){console.warn("[bulmaManager] fetch local bulma candidate failed",a)}return}try{const i=String(t).trim();if(!i)return;mr();const a=`https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`;us(a,{"data-bulmaswatch-theme":i})}catch(i){console.warn("[bulmaManager] ensureBulma failed",i)}}function Hr(t){st=t==="dark"?"dark":t==="system"?"system":"light";try{const e=Array.from(document.querySelectorAll(".nimbi-mount"));if(e.length>0)for(const n of e)st==="dark"?n.setAttribute("data-theme","dark"):st==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;st==="dark"?n.setAttribute("data-theme","dark"):st==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function hs(t){const e=document.documentElement;for(const[n,s]of Object.entries(t||{}))try{e.style.setProperty(`--${n}`,s)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function Ur(t){if(!t||!(t instanceof HTMLElement))return()=>{};const e=t.closest&&t.closest(".nimbi-mount")||null;try{e&&(st==="dark"?e.setAttribute("data-theme","dark"):st==="light"?e.setAttribute("data-theme","light"):e.removeAttribute("data-theme"))}catch{}return()=>{}}const jr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},ft=JSON.parse(JSON.stringify(jr));let Xt="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";Xt=String(t).split("-")[0].toLowerCase()}jr[Xt]||(Xt="en");let et=Xt;function ht(t,e={}){const n=ft[et]||ft.en;let s=n&&n[t]?n[t]:ft.en[t]||"";for(const r of Object.keys(e))s=s.replace(new RegExp(`{${r}}`,"g"),String(e[r]));return s}async function Bn(t,e){if(!t)return;let n=t;try{/^https?:\/\//.test(t)||(n=new URL(t,location.origin+e).toString());const s=await fetch(n);if(!s.ok)return;const r=await s.json();for(const i of Object.keys(r||{}))ft[i]=Object.assign({},ft[i]||{},r[i])}catch{}}function On(t){const e=String(t).split("-")[0].toLowerCase();et=ft[e]?e:"en"}const ds=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return et},loadL10nFile:Bn,setLang:On,t:ht},Symbol.toStringTag,{value:"Module"})),fs=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function Wr(t,e="worker"){let n=null;function s(){if(!n)try{const o=t();n=o||null,o&&o.addEventListener("error",()=>{try{n===o&&(n=null,o.terminate&&o.terminate())}catch(l){console.warn("["+e+"] worker termination failed",l)}})}catch(o){n=null,console.warn("["+e+"] worker init failed",o)}return n}function r(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(o){console.warn("["+e+"] worker termination failed",o)}}function i(o,l=1e3){return new Promise((h,c)=>{const d=s();if(!d)return c(new Error("worker unavailable"));const p=String(Math.random());o.id=p;let f=null;const u=()=>{f&&clearTimeout(f),d.removeEventListener("message",g),d.removeEventListener("error",m)},g=b=>{const y=b.data||{};y.id===p&&(u(),y.error?c(new Error(y.error)):h(y.result))},m=b=>{u(),console.warn("["+e+"] worker error event",b);try{n===d&&(n=null,d.terminate&&d.terminate())}catch(y){console.warn("["+e+"] worker termination failed",y)}c(new Error(b&&b.message||"worker error"))};f=setTimeout(()=>{u(),console.warn("["+e+"] worker timed out");try{n===d&&(n=null,d.terminate&&d.terminate())}catch(b){console.warn("["+e+"] worker termination on timeout failed",b)}c(new Error("worker timeout"))},l),d.addEventListener("message",g),d.addEventListener("error",m);try{d.postMessage(o)}catch(b){u(),c(b)}})}return{get:s,send:i,terminate:r}}function ps(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),n=URL.createObjectURL(e);return new Worker(n,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const We=new Set;function qn(t){gs(),We.clear();for(const e of Ne)e&&We.add(e);wr(V),wr(U),qn._refreshed=!0}function wr(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&We.add(e)}function br(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(n,s){return s&&We.add(s),e.call(this,n,s)}}let yr=!1;function gs(){yr||(br(V),br(U),yr=!0)}function Fr(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function be(t){return String(t||"").replace(/^[.\/]+/,"")}function _t(t){return String(t||"").replace(/\/+$/,"")}function Mt(t){return _t(t)+"/"}function ms(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=t,document.head.appendChild(n)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function jt(t,e=0,n=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const s=Array.from(t.querySelectorAll("img"));if(!s.length)return;const r=t,i=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,o=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=i?Math.max(a,i.top):a,c=(i?Math.min(o,i.bottom):o)+Number(e||0);let d=0;r&&(d=r.clientHeight||(i?i.height:0)),d||(d=o-a);let p=.6;try{const m=r&&window.getComputedStyle?window.getComputedStyle(r):null,b=m&&m.getPropertyValue("--nimbi-image-max-height-ratio"),y=b?parseFloat(b):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(p=y)}catch(m){console.warn("[helpers] read CSS ratio failed",m)}const f=Math.max(200,Math.floor(d*p));let u=!1,g=null;if(s.forEach(m=>{try{const b=m.getAttribute?m.getAttribute("loading"):void 0;b!=="eager"&&m.setAttribute&&m.setAttribute("loading","lazy");const y=m.getBoundingClientRect?m.getBoundingClientRect():null,S=m.src||m.getAttribute&&m.getAttribute("src"),T=y&&y.height>1?y.height:f,M=y?y.top:0,W=M+T;y&&T>0&&M<=c&&W>=l&&(m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high"),ms(S),u=!0),!g&&y&&y.top<=c&&(g={img:m,src:S,rect:y,beforeLoading:b})}catch(b){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",b)}}),!u&&g){const{img:m,src:b,rect:y,beforeLoading:S}=g;try{m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high")}catch(T){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",T)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function we(t,e=null,n){try{const s=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",r=new URLSearchParams(s.startsWith("?")?s.slice(1):s),i=String(t||"");r.delete("page");const a=new URLSearchParams;a.set("page",i);for(const[h,c]of r.entries())a.append(h,c);const o=a.toString();let l=o?`?${o}`:"";return e&&(l+=`#${encodeURIComponent(e)}`),l||`?page=${encodeURIComponent(i)}`}catch{const r=`?page=${encodeURIComponent(String(t||""))}`;return e?`${r}#${encodeURIComponent(e)}`:r}}function Kt(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Kt)}catch(t){console.warn("[helpers] global attach failed",t)}const V=new Map;let Me=[],Dn=!1;function ws(t){Dn=!!t}function Zr(t){Me=Array.isArray(t)?t.slice():[]}function bs(){return Me}const Gr=Wr(()=>ps(fs),"slugManager");function Hn(){return Gr.get()}function Qr(t){return Gr.send(t)}async function ys(t,e=1,n=void 0){if(!Hn())return Jt(t,e,n);try{return await Qr({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:n})}catch(r){try{return await Jt(t,e,n)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),r}}}async function ks(t,e,n){return Hn()?Qr({type:"crawlForSlug",slug:t,base:e,maxQueue:n}):Un(t,e,n)}function Ye(t,e){if(t)if(Me&&Me.length){const s=e.split("/")[0],r=Me.includes(s);let i=V.get(t);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),r?i.langs[s]=e:i.default=e,V.set(t,i)}else V.set(t,e)}const an=new Set;function xs(t){typeof t=="function"&&an.add(t)}function Ss(t){typeof t=="function"&&an.delete(t)}const U=new Map;let Ln={},Ne=[],gt="_404.md",dt="_home.md";function Tn(t){t!=null&&(gt=String(t||""))}function vs(t){t!=null&&(dt=String(t||""))}function As(t){Ln=t||{}}const vt=new Map,Yt=new Set;function Es(){vt.clear(),Yt.clear()}function Ls(t){if(!t||t.length===0)return"";let e=t[0];for(let s=1;s<t.length;s++){const r=t[s];let i=0;const a=Math.min(e.length,r.length);for(;i<a&&e[i]===r[i];)i++;e=e.slice(0,i)}const n=e.lastIndexOf("/");return n===-1?e:e.slice(0,n+1)}function Vt(t){V.clear(),U.clear(),Ne=[],Me=Me||[];const e=Object.keys(Ln||{});if(!e.length)return;let n="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?n=new URL(String(t)).pathname:n=String(t||"")}catch(s){n=String(t||""),console.warn("[slugManager] parse contentBase failed",s)}n=Mt(n)}}catch(s){n="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}n||(n=Ls(e));for(const s of e){let r=s;n&&s.startsWith(n)?r=be(s.slice(n.length)):r=be(s),Ne.push(r);try{qn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=Ln[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const o=ce(a[1].trim());if(o)try{let l=o;if((!Me||!Me.length)&&(l=Xr(l,new Set(V.keys()))),Me&&Me.length){const c=r.split("/")[0],d=Me.includes(c);let p=V.get(l);(!p||typeof p=="string")&&(p={default:typeof p=="string"?p:void 0,langs:{}}),d?p.langs[c]=r:p.default=r,V.set(l,p)}else V.set(l,r);U.set(r,l)}catch(l){console.warn("[slugManager] set slug mapping failed",l)}}}}}try{Vt()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function ce(t){let n=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function Xr(t,e){if(!e.has(t))return t;let n=2,s=`${t}-${n}`;for(;e.has(s);)n+=1,s=`${t}-${n}`;return s}function Ts(t){return $t(t,void 0)}function $t(t,e){if(!t)return!1;if(t.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(t)){if(e&&typeof e=="string")try{const n=new URL(t),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(t.startsWith("/")&&e&&typeof e=="string")try{const n=new URL(t,e),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!1}function Ft(t){return t==null?t:String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(e,n)=>n)}function Pt(t){if(!t||!V.has(t))return null;const e=V.get(t);if(!e)return null;if(typeof e=="string")return e;if(Me&&Me.length&&et&&e.langs&&e.langs[et])return e.langs[et];if(e.default)return e.default;if(e.langs){const n=Object.keys(e.langs);if(n.length)return e.langs[n[0]]}return null}const At=new Map;function Cs(){At.clear()}let Le=async function(t,e){if(!t)throw new Error("path required");try{const i=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&V.has(i)){const a=Pt(i)||V.get(i);a&&a!==t&&(t=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const n=e==null?"":_t(String(e));let s="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else if(n.startsWith("/"))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=n.startsWith("/")?n:"/"+n;s=i+a.replace(/\/$/,"")+"/"+t.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+t.replace(/^\//,"")}catch{s="/"+t.replace(/^\//,"")}if(At.has(s))return At.get(s);const r=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const d=`${n}/${gt}`,p=await globalThis.fetch(d);if(p&&typeof p.ok=="boolean"&&p.ok)return{raw:await p.text(),status:404}}catch(d){console.warn("[slugManager] fetching fallback 404 failed",d)}let c="";try{i&&typeof i.clone=="function"?c=await i.clone().text():i&&typeof i.text=="function"?c=await i.text():c=""}catch(d){c="",console.warn("[slugManager] reading error body failed",d)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:c.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),o=a.trim().slice(0,16).toLowerCase(),l=o.startsWith("<!doctype")||o.startsWith("<html"),h=l||String(t||"").toLowerCase().endsWith(".html");if(l&&String(t||"").toLowerCase().endsWith(".md")){try{const c=`${n}/${gt}`,d=await globalThis.fetch(c);if(d.ok)return{raw:await d.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return h?{raw:a,isHtml:!0}:{raw:a}})();return At.set(s,r),r};function Rs(t){typeof t=="function"&&(Le=t)}const Zt=new Map;function Ms(t){if(!t||typeof t!="string")return"";let e=t.replace(/```[\s\S]*?```/g,"");return e=e.replace(/<pre[\s\S]*?<\/pre>/gi,""),e=e.replace(/<code[\s\S]*?<\/code>/gi,""),e=e.replace(/<!--([\s\S]*?)-->/g,""),e=e.replace(/^ {4,}.*$/gm,""),e=e.replace(/`[^`]*`/g,""),e}let Ze=[],bt=null;async function Jt(t,e=1,n=void 0){const s=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>be(String(r||""))))):[];try{const r=be(String(gt||""));r&&!s.includes(r)&&s.push(r)}catch{}if(Ze&&Ze.length&&e===1&&!Ze.some(i=>{try{return s.includes(be(String(i.path||"")))}catch{return!1}}))return Ze;if(bt)return bt;bt=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(h=>be(String(h||""))))):[];try{const h=be(String(gt||""));h&&!r.includes(h)&&r.push(h)}catch{}const i=h=>{if(!r||!r.length)return!1;for(const c of r)if(c&&(h===c||h.startsWith(c+"/")))return!0;return!1};let a=[];if(Ne&&Ne.length&&(a=Array.from(Ne)),!a.length)for(const h of V.values())h&&a.push(h);try{const h=await Jr(t);h&&h.length&&(a=a.concat(h))}catch(h){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",h)}try{const h=new Set(a),c=[...a];for(h.size;c.length&&h.size<=It;){const d=c.shift();try{const p=await Le(d,t);if(p&&p.raw){if(p.status===404)continue;let f=p.raw;const u=[],g=String(d||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(g)&&Dn&&(!d||!d.includes("/")))continue;const m=Ms(f),b=/\[[^\]]+\]\(([^)]+)\)/g;let y;for(;y=b.exec(m);)u.push(y[1]);const S=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;y=S.exec(m);)u.push(y[1]);const T=d&&d.includes("/")?d.substring(0,d.lastIndexOf("/")+1):"";for(let M of u)try{if($t(M,t)||M.startsWith("..")||M.indexOf("/../")!==-1||(T&&!M.startsWith("./")&&!M.startsWith("/")&&!M.startsWith("../")&&(M=T+M),M=be(M),!/\.(md|html?)(?:$|[?#])/i.test(M))||(M=M.split(/[?#]/)[0],i(M)))continue;h.has(M)||(h.add(M),c.push(M),a.push(M))}catch(W){console.warn("[slugManager] href processing failed",M,W)}}}catch(p){console.warn("[slugManager] discovery fetch failed for",d,p)}}}catch(h){console.warn("[slugManager] discovery loop failed",h)}const o=new Set;a=a.filter(h=>!h||o.has(h)||i(h)?!1:(o.add(h),!0));const l=[];for(const h of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(h))try{const c=await Le(h,t);if(c&&c.raw){if(c.status===404)continue;let d="",p="";if(c.isHtml)try{const g=new DOMParser().parseFromString(c.raw,"text/html"),m=g.querySelector("title")||g.querySelector("h1");m&&m.textContent&&(d=m.textContent.trim());const b=g.querySelector("p");if(b&&b.textContent&&(p=b.textContent.trim()),e>=2)try{const y=g.querySelector("h1"),S=y&&y.textContent?y.textContent.trim():d||"",T=(()=>{try{if(U.has(h))return U.get(h)}catch{}return ce(d||h)})(),M=Array.from(g.querySelectorAll("h2"));for(const W of M)try{const F=(W.textContent||"").trim();if(!F)continue;const ee=W.id?W.id:ce(F),K=T?`${T}::${ee}`:`${ce(h)}::${ee}`;let Y="",_=W.nextElementSibling;for(;_&&_.tagName&&_.tagName.toLowerCase()==="script";)_=_.nextElementSibling;_&&_.textContent&&(Y=String(_.textContent).trim()),l.push({slug:K,title:F,excerpt:Y,path:h,parentTitle:S})}catch(F){console.warn("[slugManager] indexing H2 failed",F)}if(e===3)try{const W=Array.from(g.querySelectorAll("h3"));for(const F of W)try{const ee=(F.textContent||"").trim();if(!ee)continue;const K=F.id?F.id:ce(ee),Y=T?`${T}::${K}`:`${ce(h)}::${K}`;let _="",D=F.nextElementSibling;for(;D&&D.tagName&&D.tagName.toLowerCase()==="script";)D=D.nextElementSibling;D&&D.textContent&&(_=String(D.textContent).trim()),l.push({slug:Y,title:ee,excerpt:_,path:h,parentTitle:S})}catch(ee){console.warn("[slugManager] indexing H3 failed",ee)}}catch(W){console.warn("[slugManager] collect H3s failed",W)}}catch(y){console.warn("[slugManager] collect H2s failed",y)}}catch(u){console.warn("[slugManager] parsing HTML for index failed",u)}else{const u=c.raw,g=u.match(/^#\s+(.+)$/m);d=g?g[1].trim():"";try{d=Ft(d)}catch{}const m=u.split(/\r?\n\s*\r?\n/);if(m.length>1)for(let b=1;b<m.length;b++){const y=m[b].trim();if(y&&!/^#/.test(y)){p=y.replace(/\r?\n/g," ");break}}if(e>=2){let b="",y="";try{const S=(u.match(/^#\s+(.+)$/m)||[])[1];b=S?S.trim():"",y=(function(){try{if(U.has(h))return U.get(h)}catch{}return ce(d||h)})();const T=/^##\s+(.+)$/gm;let M;for(;M=T.exec(u);)try{const W=(M[1]||"").trim(),F=Ft(W);if(!W)continue;const ee=ce(W),K=y?`${y}::${ee}`:`${ce(h)}::${ee}`,_=u.slice(T.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),D=_&&_[1]?String(_[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";l.push({slug:K,title:F,excerpt:D,path:h,parentTitle:b})}catch(W){console.warn("[slugManager] indexing markdown H2 failed",W)}}catch(S){console.warn("[slugManager] collect markdown H2s failed",S)}if(e===3)try{const S=/^###\s+(.+)$/gm;let T;for(;T=S.exec(u);)try{const M=(T[1]||"").trim(),W=Ft(M);if(!M)continue;const F=ce(M),ee=y?`${y}::${F}`:`${ce(h)}::${F}`,Y=u.slice(S.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),_=Y&&Y[1]?String(Y[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";l.push({slug:ee,title:W,excerpt:_,path:h,parentTitle:b})}catch(M){console.warn("[slugManager] indexing markdown H3 failed",M)}}catch(S){console.warn("[slugManager] collect markdown H3s failed",S)}}}let f="";try{U.has(h)&&(f=U.get(h))}catch(u){console.warn("[slugManager] mdToSlug access failed",u)}f||(f=ce(d||h)),l.push({slug:f,title:d,excerpt:p,path:h})}}catch(c){console.warn("[slugManager] buildSearchIndex: entry fetch failed",c)}try{Ze=l.filter(c=>{try{return!i(String(c.path||""))}catch{return!0}})}catch(h){console.warn("[slugManager] filtering index by excludes failed",h),Ze=l}return Ze})();try{await bt}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return bt=null,Ze}const Kr=1e3;let It=Kr;function _s(t){typeof t=="number"&&t>=0&&(It=t)}const Yr=new DOMParser,Vr="a[href]";let Un=async function(t,e,n=It){if(Zt.has(t))return Zt.get(t);let s=null;const r=new Set,i=[""];for(;i.length&&!s&&!(i.length>n);){const a=i.shift();if(r.has(a))continue;r.add(a);let o=e;o.endsWith("/")||(o+="/"),o+=a;try{let l;try{l=await globalThis.fetch(o)}catch(p){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:o,error:p});continue}if(!l||!l.ok){l&&!l.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:o,status:l.status});continue}const h=await l.text(),d=Yr.parseFromString(h,"text/html").querySelectorAll(Vr);for(const p of d)try{let f=p.getAttribute("href")||"";if(!f||$t(f,e)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const u=a+f;r.has(u)||i.push(u);continue}if(f.toLowerCase().endsWith(".md")){const u=be(a+f);try{if(U.has(u))continue;for(const g of V.values());}catch(g){console.warn("[slugManager] slug map access failed",g)}try{const g=await Le(u,e);if(g&&g.raw){const m=(g.raw||"").match(/^#\s+(.+)$/m);if(m&&m[1]&&ce(m[1].trim())===t){s=u;break}}}catch(g){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",g)}}}catch(f){console.warn("[slugManager] crawlForSlug: link iteration failed",f)}}catch(l){console.warn("[slugManager] crawlForSlug: directory fetch failed",l)}}return Zt.set(t,s),s};async function Jr(t,e=It){const n=new Set,s=new Set,r=[""];for(;r.length&&!(r.length>e);){const i=r.shift();if(s.has(i))continue;s.add(i);let a=t;a.endsWith("/")||(a+="/"),a+=i;try{let o;try{o=await globalThis.fetch(a)}catch(d){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:d});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:o.status});continue}const l=await o.text(),c=Yr.parseFromString(l,"text/html").querySelectorAll(Vr);for(const d of c)try{let p=d.getAttribute("href")||"";if(!p||$t(p,t)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const u=i+p;s.has(u)||r.push(u);continue}const f=(i+p).replace(/^\/+/,"");/\.(md|html?)$/i.test(f)&&n.add(f)}catch(p){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",p)}}catch(o){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",o)}}return Array.from(n)}async function ei(t,e,n){if(t&&typeof t=="string"&&(t=be(t),t=_t(t)),V.has(t))return Pt(t)||V.get(t);for(const r of an)try{const i=await r(t,e);if(i)return Ye(t,i),U.set(i,t),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(Ne&&Ne.length){if(vt.has(t)){const r=vt.get(t);return V.set(t,r),U.set(r,t),r}for(const r of Ne)if(!Yt.has(r))try{const i=await Le(r,e);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const o=ce(a[1].trim());if(Yt.add(r),o&&vt.set(o,r),o===t)return Ye(t,r),U.set(r,t),r}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const r=await Jt(e);if(r&&r.length){const i=r.find(a=>a.slug===t);if(i)return Ye(t,i.path),U.set(i.path,t),i.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await Un(t,e,n);if(r)return Ye(t,r),U.set(r,t),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const s=[`${t}.html`,`${t}.md`];for(const r of s)try{const i=await Le(r,e);if(i&&i.raw)return Ye(t,r),U.set(r,t),r}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(Ne&&Ne.length)for(const r of Ne)try{const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ce(i)===t)return Ye(t,r),U.set(r,t),r}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const r=[];dt&&typeof dt=="string"&&dt.trim()&&r.push(dt),r.includes("_home.md")||r.push("_home.md");for(const i of r)try{const a=await Le(i,e);if(a&&a.raw){const o=(a.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]&&ce(o[1].trim())===t)return Ye(t,i),U.set(i,t),i}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const Gt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:Kr,_setAllMd:As,_storeSlugMapping:Ye,addSlugResolver:xs,get allMarkdownPaths(){return Ne},get availableLanguages(){return Me},buildSearchIndex:Jt,buildSearchIndexWorker:ys,clearFetchCache:Cs,clearListCaches:Es,crawlAllMarkdown:Jr,crawlCache:Zt,crawlForSlug:Un,crawlForSlugWorker:ks,get defaultCrawlMaxQueue(){return It},ensureSlug:ei,fetchCache:At,get fetchMarkdown(){return Le},getLanguages:bs,get homePage(){return dt},initSlugWorker:Hn,isExternalLink:Ts,isExternalLinkWithBase:$t,listPathsFetched:Yt,listSlugCache:vt,mdToSlug:U,get notFoundPage(){return gt},removeSlugResolver:Ss,resolveSlugPath:Pt,get searchIndex(){return Ze},setContentBase:Vt,setDefaultCrawlMaxQueue:_s,setFetchMarkdown:Rs,setHomePage:vs,setLanguages:Zr,setNotFoundPage:Tn,setSkipRootReadme:ws,get skipRootReadme(){return Dn},slugResolvers:an,slugToMd:V,slugify:ce,unescapeMarkdown:Ft,uniqueSlug:Xr},Symbol.toStringTag,{value:"Module"}));let ti=100;function kr(t){ti=t}let Et=300*1e3;function xr(t){Et=t}const ze=new Map;function $s(t){if(!ze.has(t))return;const e=ze.get(t),n=Date.now();if(e.ts+Et<n){ze.delete(t);return}return ze.delete(t),ze.set(t,e),e.value}function Ps(t,e){if(Sr(),Sr(),ze.delete(t),ze.set(t,{value:e,ts:Date.now()}),ze.size>ti){const n=ze.keys().next().value;n!==void 0&&ze.delete(n)}}function Sr(){if(!Et||Et<=0)return;const t=Date.now();for(const[e,n]of ze.entries())n.ts+Et<t&&ze.delete(e)}async function Is(t,e){const n=new Set(We),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(s||[])){const i=r.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const o=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(o){let d=be(o[1]);d&&n.add(d);continue}const l=(r.textContent||"").trim(),h=(a.pathname||"").replace(/^.*\//,"");if(l&&ce(l)===t||h&&ce(h.replace(/\.(html?|md)$/i,""))===t)return a.toString();if(/\.(html?)$/i.test(a.pathname)){let d=a.pathname.replace(/^\//,"");n.add(d);continue}const c=a.pathname||"";if(c){const d=new URL(e),p=Mt(d.pathname);if(c.indexOf(p)!==-1){let f=c.startsWith(p)?c.slice(p.length):c;f=be(f),f&&n.add(f)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const i=await Le(r,e);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const o=(a[1]||"").trim();if(o&&ce(o)===t)return r}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function Ns(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const n=decodeURIComponent(String(t||""));if(V.has(n)){const s=Pt(n)||V.get(n);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||e.push(s):(e.push(s),e.push(s+".html")))}else{if(We&&We.size)for(const s of We){const r=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ce(r)===n&&!/index\.html$/i.test(s)){e.push(s);break}}!e.length&&n&&!/\.(md|html?)$/i.test(n)&&(e.push(n+".html"),e.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return e}async function zs(t,e){const n=t||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=t||"",i=null;if(r&&String(r).includes("::")){const u=String(r).split("::",2);r=u[0],i=u[1]||null}const o=`${t}|||${typeof ds<"u"&&et?et:""}`,l=$s(o);if(l)r=l.resolved,i=l.anchor||i;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let u=decodeURIComponent(String(r||""));if(u&&typeof u=="string"&&(u=be(u),u=_t(u)),V.has(u))r=Pt(u)||V.get(u);else{let g=await Is(u,e);if(g)r=g;else if(qn._refreshed&&We&&We.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const m=await ei(u,e);m&&(r=m)}}}Ps(o,{resolved:r,anchor:i})}!i&&s&&(i=s);try{if(r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const u=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const g=await fetch(u);if(g&&g.ok){const m=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",y=(m||"").toLowerCase();if(b&&b.indexOf&&b.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1)return{data:{raw:m,isHtml:!0},pagePath:u.replace(/^\//,""),anchor:i}}}catch{}}}catch{}const h=Ns(r),c=String(n||"").includes(".md")||String(n||"").includes(".html");if(c&&h.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&h.push(r),h.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&h.push(r),h.length===1&&/index\.html$/i.test(h[0])&&!c&&!V.has(r)&&!V.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let d=null,p=null,f=null;for(const u of h)if(u)try{const g=be(u);d=await Le(g,e),p=g;break}catch(g){f=g;try{console.warn("[router] candidate fetch failed",{candidate:u,contentBase:e,err:g&&g.message||g})}catch{}}if(!d){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:h,contentBase:e,fetchError:f&&(f.message||String(f))||null})}catch{}try{if(c&&String(n||"").toLowerCase().includes(".html"))try{const u=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",u);const g=await fetch(u);if(g&&g.ok){const m=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",y=(m||"").toLowerCase(),S=b&&b.indexOf&&b.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1;if(S||console.warn("[router] absolute fetch returned non-HTML",{abs:u,contentType:b,snippet:y.slice(0,200)}),S)try{const T=u,M=new URL(".",T).toString();try{const F=typeof DOMParser<"u"?new DOMParser:null;if(F){const ee=F.parseFromString(m||"","text/html"),K=(O,oe)=>{try{const Z=oe.getAttribute(O)||"";if(!Z||/^(https?:)?\/\//i.test(Z)||Z.startsWith("/")||Z.startsWith("#"))return;try{const v=new URL(Z,T).toString();oe.setAttribute(O,v)}catch(v){console.warn("[router] rewrite attribute failed",O,v)}}catch(Z){console.warn("[router] rewrite helper failed",Z)}},Y=ee.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),_=[];for(const O of Array.from(Y||[]))try{const oe=O.tagName?O.tagName.toLowerCase():"";if(oe==="a")continue;if(O.hasAttribute("src")){const Z=O.getAttribute("src");K("src",O);const v=O.getAttribute("src");Z!==v&&_.push({attr:"src",tag:oe,before:Z,after:v})}if(O.hasAttribute("href")&&oe==="link"){const Z=O.getAttribute("href");K("href",O);const v=O.getAttribute("href");Z!==v&&_.push({attr:"href",tag:oe,before:Z,after:v})}if(O.hasAttribute("href")&&oe!=="link"){const Z=O.getAttribute("href");K("href",O);const v=O.getAttribute("href");Z!==v&&_.push({attr:"href",tag:oe,before:Z,after:v})}if(O.hasAttribute("xlink:href")){const Z=O.getAttribute("xlink:href");K("xlink:href",O);const v=O.getAttribute("xlink:href");Z!==v&&_.push({attr:"xlink:href",tag:oe,before:Z,after:v})}if(O.hasAttribute("poster")){const Z=O.getAttribute("poster");K("poster",O);const v=O.getAttribute("poster");Z!==v&&_.push({attr:"poster",tag:oe,before:Z,after:v})}if(O.hasAttribute("srcset")){const se=(O.getAttribute("srcset")||"").split(",").map(te=>te.trim()).filter(Boolean).map(te=>{const[A,P]=te.split(/\s+/,2);if(!A||/^(https?:)?\/\//i.test(A)||A.startsWith("/"))return te;try{const L=new URL(A,T).toString();return P?`${L} ${P}`:L}catch{return te}}).join(", ");O.setAttribute("srcset",se)}}catch{}const D=ee.documentElement&&ee.documentElement.outerHTML?ee.documentElement.outerHTML:m;try{_&&_.length&&console.warn("[router] rewritten asset refs",{abs:u,rewritten:_})}catch{}return{data:{raw:D,isHtml:!0},pagePath:String(n||""),anchor:i}}}catch{}let W=m;return/<base\s+[^>]*>/i.test(m)||(/<head[^>]*>/i.test(m)?W=m.replace(/(<head[^>]*>)/i,`$1<base href="${M}">`):W=`<base href="${M}">`+m),{data:{raw:W,isHtml:!0},pagePath:String(n||""),anchor:i}}catch{return{data:{raw:m,isHtml:!0},pagePath:String(n||""),anchor:i}}}}catch(u){console.warn("[router] absolute HTML fetch fallback failed",u)}}catch{}try{const u=decodeURIComponent(String(r||""));if(u&&!/\.(md|html?)$/i.test(u)){const g=[`/assets/${u}.html`,`/assets/${u}/index.html`];for(const m of g)try{const b=await fetch(m,{method:"GET"});if(b&&b.ok)return{data:{raw:await b.text(),isHtml:!0},pagePath:m.replace(/^\//,""),anchor:i}}catch{}}}catch(u){console.warn("[router] assets fallback failed",u)}throw new Error("no page data")}return{data:d,pagePath:p,anchor:i}}function jn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ot=jn();function ni(t){ot=t}var at={exec:()=>null};function ae(t,e=""){let n=typeof t=="string"?t:t.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(_e.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,e)};return s}var Bs=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),_e={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},Os=/^(?:[ \t]*(?:\n|$))+/,qs=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ds=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Nt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Hs=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Wn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,ri=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,ii=ae(ri).replace(/bull/g,Wn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Us=ae(ri).replace(/bull/g,Wn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Fn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,js=/^[^\n]+/,Zn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Ws=ae(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Zn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Fs=ae(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Wn).getRegex(),ln="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Gn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Zs=ae("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Gn).replace("tag",ln).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),si=ae(Fn).replace("hr",Nt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ln).getRegex(),Gs=ae(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",si).getRegex(),Qn={blockquote:Gs,code:qs,def:Ws,fences:Ds,heading:Hs,hr:Nt,html:Zs,lheading:ii,list:Fs,newline:Os,paragraph:si,table:at,text:js},vr=ae("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Nt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ln).getRegex(),Qs={...Qn,lheading:Us,table:vr,paragraph:ae(Fn).replace("hr",Nt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",vr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",ln).getRegex()},Xs={...Qn,html:ae(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Gn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:at,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ae(Fn).replace("hr",Nt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",ii).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ks=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ys=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ai=/^( {2,}|\\)\n(?!\s*$)/,Vs=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,on=/[\p{P}\p{S}]/u,Xn=/[\s\p{P}\p{S}]/u,li=/[^\s\p{P}\p{S}]/u,Js=ae(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Xn).getRegex(),oi=/(?!~)[\p{P}\p{S}]/u,ea=/(?!~)[\s\p{P}\p{S}]/u,ta=/(?:[^\s\p{P}\p{S}]|~)/u,ci=/(?![*_])[\p{P}\p{S}]/u,na=/(?![*_])[\s\p{P}\p{S}]/u,ra=/(?:[^\s\p{P}\p{S}]|[*_])/u,ia=ae(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Bs?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ui=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,sa=ae(ui,"u").replace(/punct/g,on).getRegex(),aa=ae(ui,"u").replace(/punct/g,oi).getRegex(),hi="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",la=ae(hi,"gu").replace(/notPunctSpace/g,li).replace(/punctSpace/g,Xn).replace(/punct/g,on).getRegex(),oa=ae(hi,"gu").replace(/notPunctSpace/g,ta).replace(/punctSpace/g,ea).replace(/punct/g,oi).getRegex(),ca=ae("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,li).replace(/punctSpace/g,Xn).replace(/punct/g,on).getRegex(),ua=ae(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ci).getRegex(),ha="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",da=ae(ha,"gu").replace(/notPunctSpace/g,ra).replace(/punctSpace/g,na).replace(/punct/g,ci).getRegex(),fa=ae(/\\(punct)/,"gu").replace(/punct/g,on).getRegex(),pa=ae(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ga=ae(Gn).replace("(?:-->|$)","-->").getRegex(),ma=ae("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ga).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),en=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,wa=ae(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",en).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),di=ae(/^!?\[(label)\]\[(ref)\]/).replace("label",en).replace("ref",Zn).getRegex(),fi=ae(/^!?\[(ref)\](?:\[\])?/).replace("ref",Zn).getRegex(),ba=ae("reflink|nolink(?!\\()","g").replace("reflink",di).replace("nolink",fi).getRegex(),Ar=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Kn={_backpedal:at,anyPunctuation:fa,autolink:pa,blockSkip:ia,br:ai,code:Ys,del:at,delLDelim:at,delRDelim:at,emStrongLDelim:sa,emStrongRDelimAst:la,emStrongRDelimUnd:ca,escape:Ks,link:wa,nolink:fi,punctuation:Js,reflink:di,reflinkSearch:ba,tag:ma,text:Vs,url:at},ya={...Kn,link:ae(/^!?\[(label)\]\((.*?)\)/).replace("label",en).getRegex(),reflink:ae(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",en).getRegex()},Cn={...Kn,emStrongRDelimAst:oa,emStrongLDelim:aa,delLDelim:ua,delRDelim:da,url:ae(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Ar).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ae(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Ar).getRegex()},ka={...Cn,br:ae(ai).replace("{2,}","*").getRegex(),text:ae(Cn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Wt={normal:Qn,gfm:Qs,pedantic:Xs},yt={normal:Kn,gfm:Cn,breaks:ka,pedantic:ya},xa={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Er=t=>xa[t];function je(t,e){if(e){if(_e.escapeTest.test(t))return t.replace(_e.escapeReplace,Er)}else if(_e.escapeTestNoEncode.test(t))return t.replace(_e.escapeReplaceNoEncode,Er);return t}function Lr(t){try{t=encodeURI(t).replace(_e.percentDecode,"%")}catch{return null}return t}function Tr(t,e){let n=t.replace(_e.findPipe,(i,a,o)=>{let l=!1,h=a;for(;--h>=0&&o[h]==="\\";)l=!l;return l?"|":" |"}),s=n.split(_e.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(_e.slashPipe,"|");return s}function kt(t,e,n){let s=t.length;if(s===0)return"";let r=0;for(;r<s&&t.charAt(s-r-1)===e;)r++;return t.slice(0,s-r)}function Sa(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])n++;else if(t[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function va(t,e=0){let n=e,s="";for(let r of t)if(r==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=r,n++;return s}function Cr(t,e,n,s,r){let i=e.href,a=e.title||null,o=t[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:o,tokens:s.inlineTokens(o)};return s.state.inLink=!1,l}function Aa(t,e,n){let s=t.match(n.other.indentCodeCompensation);if(s===null)return e;let r=s[1];return e.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[o]=a;return o.length>=r.length?i.slice(r.length):i}).join(`
`)}var tn=class{options;rules;lexer;constructor(t){this.options=t||ot}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:kt(n,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],s=Aa(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let s=kt(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:kt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=kt(e[0],`
`).split(`
`),s="",r="",i=[];for(;n.length>0;){let a=!1,o=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))o.push(n[l]),a=!0;else if(!a)o.push(n[l]);else break;n=n.slice(l);let h=o.join(`
`),c=h.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${h}`:h,r=r?`${r}
${c}`:c;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=d,n.length===0)break;let p=i.at(-1);if(p?.type==="code")break;if(p?.type==="blockquote"){let f=p,u=f.raw+`
`+n.join(`
`),g=this.blockquote(u);i[i.length-1]=g,s=s.substring(0,s.length-f.raw.length)+g.raw,r=r.substring(0,r.length-f.text.length)+g.text;break}else if(p?.type==="list"){let f=p,u=f.raw+`
`+n.join(`
`),g=this.list(u);i[i.length-1]=g,s=s.substring(0,s.length-p.raw.length)+g.raw,r=r.substring(0,r.length-f.raw.length)+g.raw,n=u.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;t;){let l=!1,h="",c="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;h=e[0],t=t.substring(h.length);let d=va(e[2].split(`
`,1)[0],e[1].length),p=t.split(`
`,1)[0],f=!d.trim(),u=0;if(this.options.pedantic?(u=2,c=d.trimStart()):f?u=e[1].length+1:(u=d.search(this.rules.other.nonSpaceChar),u=u>4?1:u,c=d.slice(u),u+=e[1].length),f&&this.rules.other.blankLine.test(p)&&(h+=p+`
`,t=t.substring(p.length+1),l=!0),!l){let g=this.rules.other.nextBulletRegex(u),m=this.rules.other.hrRegex(u),b=this.rules.other.fencesBeginRegex(u),y=this.rules.other.headingBeginRegex(u),S=this.rules.other.htmlBeginRegex(u),T=this.rules.other.blockquoteBeginRegex(u);for(;t;){let M=t.split(`
`,1)[0],W;if(p=M,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),W=p):W=p.replace(this.rules.other.tabCharGlobal,"    "),b.test(p)||y.test(p)||S.test(p)||T.test(p)||g.test(p)||m.test(p))break;if(W.search(this.rules.other.nonSpaceChar)>=u||!p.trim())c+=`
`+W.slice(u);else{if(f||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||b.test(d)||y.test(d)||m.test(d))break;c+=`
`+p}f=!p.trim(),h+=M+`
`,t=t.substring(M.length+1),d=W.slice(u)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(h)&&(a=!0)),r.items.push({type:"list_item",raw:h,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),r.raw+=h}let o=r.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l of r.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let h=this.rules.other.listTaskCheckbox.exec(l.raw);if(h){let c={type:"checkbox",raw:h[0]+" ",checked:h[0]!=="[ ]"};l.checked=c.checked,r.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=c.raw+l.tokens[0].raw,l.tokens[0].text=c.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(c)):l.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):l.tokens.unshift(c)}}if(!r.loose){let h=l.tokens.filter(d=>d.type==="space"),c=h.length>0&&h.some(d=>this.rules.other.anyLine.test(d.raw));r.loose=c}}if(r.loose)for(let l of r.items){l.loose=!0;for(let h of l.tokens)h.type==="text"&&(h.type="paragraph")}return r}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:r}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=Tr(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(Tr(a,i.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:i.align[l]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=kt(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=Sa(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Cr(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return Cr(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,o=r,l=0,h=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,e=e.slice(-1*t.length+r);(s=h.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){o+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){l+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+l);let c=[...s[0]][0].length,d=t.slice(0,r+s.index+c+a);if(Math.min(r,a)%2){let f=d.slice(1,-1);return{type:"em",raw:d,text:f,tokens:this.lexer.inlineTokens(f)}}let p=d.slice(2,-2);return{type:"strong",raw:d,text:p,tokens:this.lexer.inlineTokens(p)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,o=r,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+r);(s=l.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){o+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o);let h=[...s[0]][0].length,c=t.slice(0,r+s.index+h+a),d=c.slice(r,-r);return{type:"del",raw:c,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},qe=class Rn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ot,this.options.tokenizer=this.options.tokenizer||new tn,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:_e,block:Wt.normal,inline:yt.normal};this.options.pedantic?(n.block=Wt.pedantic,n.inline=yt.pedantic):this.options.gfm&&(n.block=Wt.gfm,this.options.breaks?n.inline=yt.breaks:n.inline=yt.gfm),this.tokenizer.rules=n}static get rules(){return{block:Wt,inline:yt}}static lex(e,n){return new Rn(n).lex(e)}static lexInline(e,n){return new Rn(n).inlineTokens(e)}lex(e){e=e.replace(_e.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(_e.tabCharGlobal,"    ").replace(_e.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),n.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0,o=e.slice(1),l;this.options.extensions.startBlock.forEach(h=>{l=h.call({lexer:this},o),typeof l=="number"&&l>=0&&(a=Math.min(a,l))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,r=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)l.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=r[2]?r[2].length:0,s=s.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,o="";for(;e;){a||(o=""),a=!1;let l;if(this.options.extensions?.inline?.some(c=>(l=c.call({lexer:this},e,n))?(e=e.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let c=n.at(-1);l.type==="text"&&c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(e,s,o)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(e,s,o)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),n.push(l);continue}let h=e;if(this.options.extensions?.startInline){let c=1/0,d=e.slice(1),p;this.options.extensions.startInline.forEach(f=>{p=f.call({lexer:this},d),typeof p=="number"&&p>=0&&(c=Math.min(c,p))}),c<1/0&&c>=0&&(h=e.substring(0,c+1))}if(l=this.tokenizer.inlineText(h)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),a=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},nn=class{options;parser;constructor(t){this.options=t||ot}space(t){return""}code({text:t,lang:e,escaped:n}){let s=(e||"").match(_e.notSpaceStart)?.[0],r=t.replace(_e.endingNewline,"")+`
`;return s?'<pre><code class="language-'+je(s)+'">'+(n?r:je(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:je(r,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,s="";for(let a=0;a<t.items.length;a++){let o=t.items[a];s+=this.listitem(o)}let r=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${je(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let s=this.parser.parseInline(n),r=Lr(t);if(r===null)return s;t=r;let i='<a href="'+t+'"';return e&&(i+=' title="'+je(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=Lr(t);if(r===null)return je(n);t=r;let i=`<img src="${t}" alt="${je(n)}"`;return e&&(i+=` title="${je(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:je(t.text)}},Yn=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},De=class Mn{options;renderer;textRenderer;constructor(e){this.options=e||ot,this.options.renderer=this.options.renderer||new nn,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Yn}static parse(e,n){return new Mn(n).parse(e)}static parseInline(e,n){return new Mn(n).parseInline(e)}parse(e){let n="";for(let s=0;s<e.length;s++){let r=e[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=o||"";continue}}let i=r;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,n=this.renderer){let s="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let o=this.options.extensions.renderers[i.type].call({parser:this},i);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=o||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return s}},xt=class{options;block;constructor(t){this.options=t||ot}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?qe.lex:qe.lexInline}provideParser(){return this.block?De.parse:De.parseInline}},Ea=class{defaults=jn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=De;Renderer=nn;TextRenderer=Yn;Lexer=qe;Tokenizer=tn;Hooks=xt;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{let r=s;n=n.concat(this.walkTokens(r.items,e));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...a){let o=r.renderer.apply(this,a);return o===!1&&(o=i.apply(this,a)),o}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),n.renderer){let r=this.defaults.renderer||new nn(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,o=n.renderer[a],l=r[a];r[a]=(...h)=>{let c=o.apply(r,h);return c===!1&&(c=l.apply(r,h)),c||""}}s.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new tn(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,o=n.tokenizer[a],l=r[a];r[a]=(...h)=>{let c=o.apply(r,h);return c===!1&&(c=l.apply(r,h)),c}}s.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new xt;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,o=n.hooks[a],l=r[a];xt.passThroughHooks.has(i)?r[a]=h=>{if(this.defaults.async&&xt.passThroughHooksRespectAsync.has(i))return(async()=>{let d=await o.call(r,h);return l.call(r,d)})();let c=o.call(r,h);return l.call(r,c)}:r[a]=(...h)=>{if(this.defaults.async)return(async()=>{let d=await o.apply(r,h);return d===!1&&(d=await l.apply(r,h)),d})();let c=o.apply(r,h);return c===!1&&(c=l.apply(r,h)),c}}s.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let o=[];return o.push(i.call(this,a)),r&&(o=o.concat(r.call(this,a))),o}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return qe.lex(t,e??this.defaults)}parser(t,e){return De.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let s={...n},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=t),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(e):e,o=await(r.hooks?await r.hooks.provideLexer():t?qe.lex:qe.lexInline)(a,r),l=r.hooks?await r.hooks.processAllTokens(o):o;r.walkTokens&&await Promise.all(this.walkTokens(l,r.walkTokens));let h=await(r.hooks?await r.hooks.provideParser():t?De.parse:De.parseInline)(l,r);return r.hooks?await r.hooks.postprocess(h):h})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let a=(r.hooks?r.hooks.provideLexer():t?qe.lex:qe.lexInline)(e,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let o=(r.hooks?r.hooks.provideParser():t?De.parse:De.parseInline)(a,r);return r.hooks&&(o=r.hooks.postprocess(o)),o}catch(a){return i(a)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+je(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},lt=new Ea;function le(t,e){return lt.parse(t,e)}le.options=le.setOptions=function(t){return lt.setOptions(t),le.defaults=lt.defaults,ni(le.defaults),le};le.getDefaults=jn;le.defaults=ot;le.use=function(...t){return lt.use(...t),le.defaults=lt.defaults,ni(le.defaults),le};le.walkTokens=function(t,e){return lt.walkTokens(t,e)};le.parseInline=lt.parseInline;le.Parser=De;le.parser=De.parse;le.Renderer=nn;le.TextRenderer=Yn;le.Lexer=qe;le.lexer=qe.lex;le.Tokenizer=tn;le.Hooks=xt;le.parse=le;le.options;le.setOptions;le.use;le.walkTokens;le.parseInline;De.parse;qe.lex;const pi=`function j() {
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
const ct = "https://cdn.jsdelivr.net/npm/highlight.js";
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
`,Rr=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",pi],{type:"text/javascript;charset=utf-8"});function La(t){let e;try{if(e=Rr&&(self.URL||self.webkitURL).createObjectURL(Rr),!e)throw"";const n=new Worker(e,{type:"module",name:t?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(pi),{type:"module",name:t?.name})}}function Ta(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const n=t.slice(3,e+0).trim(),s=t.slice(e+4).trimStart(),r={};return n.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:s,data:r}}}return{content:t,data:{}}}const gi=Wr(()=>new La,"markdown"),Mr=typeof DOMParser<"u"?new DOMParser:null;function _n(){return gi.get()}function Ca(t){return gi.send(t,1e3)}const tt=[];function $n(t){if(t&&typeof t=="object"){tt.push(t);try{le.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function Ra(t){tt.length=0,Array.isArray(t)&&tt.push(...t.filter(e=>e&&typeof e=="object"));try{tt.forEach(e=>le.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function rn(t){if(_n&&_n())try{const i=await Ca({type:"render",md:t});if(i&&i.html!==void 0)try{const o=(Mr||new DOMParser).parseFromString(i.html,"text/html"),l=o.querySelectorAll("h1,h2,h3,h4,h5,h6"),h=new Set,c=f=>{f||(f="heading");let u=f,g=2;for(;h.has(u);)u=`${f}-${g}`,g+=1;return h.add(u),u};l.forEach(f=>{if(f.id)f.id=c(f.id);else{const u=ce(f.textContent||"");f.id=c(u)}try{const u=Number(f.tagName.substring(1));if(u>=1&&u<=6){const g={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},m=u<=2?"has-text-weight-bold":u<=4?"has-text-weight-semibold":"has-text-weight-normal";`${g[u]} ${m}`.split(/\s+/).filter(Boolean).forEach(y=>{try{f.classList.add(y)}catch{}})}}catch{}});try{try{const u=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(u){const g=Array.from(o.querySelectorAll("img"));for(const m of g)try{const b=m.getAttribute("src")||"";if(new URL(b,location.href).toString()===u){const S=m.parentElement;m.remove(),S&&S.tagName&&S.tagName.toLowerCase()==="p"&&S.childNodes.length===0&&S.remove();break}}catch{}}}catch{}o.querySelectorAll("img").forEach(u=>{try{u.getAttribute("loading")||u.setAttribute("data-want-lazy","1")}catch(g){console.warn("[markdown] set image loading attribute failed",g)}})}catch(f){console.warn("[markdown] query images failed",f)}try{o.querySelectorAll("pre code").forEach(u=>{try{const g=u.getAttribute&&u.getAttribute("class")||u.className||"",m=String(g||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{u.setAttribute&&u.setAttribute("class",m)}catch(S){console.warn("[markdown] set code class failed",S),u.className=m}else try{u.removeAttribute&&u.removeAttribute("class")}catch(S){console.warn("[markdown] remove code class failed",S),u.className=""}const b=m,y=b.match(/language-([a-zA-Z0-9_+-]+)/)||b.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!y||!y[1])try{const S=u.textContent||"";try{if(me&&typeof me.getLanguage=="function"&&me.getLanguage("plaintext")){const T=me.highlight(S,{language:"plaintext"});T&&T.value&&(u.innerHTML=T.value)}}catch{try{me.highlightElement(u)}catch(M){console.warn("[markdown] hljs.highlightElement failed",M)}}}catch(S){console.warn("[markdown] code auto-detect failed",S)}}catch(g){console.warn("[markdown] processing code blocks failed",g)}})}catch(f){console.warn("[markdown] query code blocks failed",f)}const d=o.body.innerHTML,p=[];return l.forEach(f=>{p.push({level:Number(f.tagName.substring(1)),text:(f.textContent||"").trim(),id:f.id})}),{html:d,meta:i.meta||{},toc:p}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:n,data:s}=Ta(t||"");if(le.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),tt&&tt.length)try{tt.forEach(i=>le.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let r=le.parse(n);try{const a=(Mr||new DOMParser).parseFromString(r,"text/html"),o=a.querySelectorAll("h1,h2,h3,h4,h5,h6");o.forEach(h=>{h.id||(h.id=ce(h.textContent||""));try{const c=Number(h.tagName.substring(1));if(c>=1&&c<=6){const d={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},p=c<=2?"has-text-weight-bold":c<=4?"has-text-weight-semibold":"has-text-weight-normal";`${d[c]} ${p}`.split(/\s+/).filter(Boolean).forEach(u=>{try{h.classList.add(u)}catch{}})}}catch{}});try{try{const c=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(c){const d=Array.from(a.querySelectorAll("img"));for(const p of d)try{const f=p.getAttribute("src")||"";if(new URL(f,location.href).toString()===c){const g=p.parentElement;p.remove(),g&&g.tagName&&g.tagName.toLowerCase()==="p"&&g.childNodes.length===0&&g.remove();break}}catch{}}}catch{}a.querySelectorAll("img").forEach(c=>{try{c.getAttribute("loading")||c.setAttribute("data-want-lazy","1")}catch(d){console.warn("[markdown] set image loading attribute failed",d)}})}catch(h){console.warn("[markdown] query images failed",h)}try{a.querySelectorAll("pre code").forEach(c=>{try{const d=c.getAttribute&&c.getAttribute("class")||c.className||"",p=String(d||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(p)try{c.setAttribute&&c.setAttribute("class",p)}catch(g){console.warn("[markdown] set code class failed",g),c.className=p}else try{c.removeAttribute&&c.removeAttribute("class")}catch(g){console.warn("[markdown] remove code class failed",g),c.className=""}const f=p,u=f.match(/language-([a-zA-Z0-9_+-]+)/)||f.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!u||!u[1])try{const g=c.textContent||"";try{if(me&&typeof me.getLanguage=="function"&&me.getLanguage("plaintext")){const m=me.highlight(g,{language:"plaintext"});m&&m.value&&(c.innerHTML=m.value)}}catch{try{me.highlightElement(c)}catch(b){console.warn("[markdown] hljs.highlightElement failed",b)}}}catch(g){console.warn("[markdown] code auto-detect failed",g)}}catch(d){console.warn("[markdown] processing code blocks failed",d)}})}catch(h){console.warn("[markdown] query code blocks failed",h)}r=a.body.innerHTML;const l=[];return o.forEach(h=>{l.push({level:Number(h.tagName.substring(1)),text:(h.textContent||"").trim(),id:h.id})}),{html:a.body.innerHTML,meta:s||{},toc:l}}catch(i){console.warn("post-process markdown failed",i)}return{html:r,meta:s||{},toc:[]}}function Pn(t,e){const n=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(t);)if(a[1]){const o=a[1].toLowerCase();if(Nn.has(o)||e&&e.size&&o.length<3&&!e.has(o)&&!(Ie&&Ie[o]&&e.has(Ie[o])))continue;if(e&&e.size){if(e.has(o)){const h=e.get(o);h&&n.add(h);continue}if(Ie&&Ie[o]){const h=Ie[o];if(e.has(h)){const c=e.get(h)||h;n.add(c);continue}}}(i.has(o)||o.length>=5&&o.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(o)&&!r.has(o))&&n.add(o)}return n}const Ma=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:$n,detectFenceLanguages:Pn,initRendererWorker:_n,markdownPlugins:tt,parseMarkdownToHtml:rn,setMarkdownExtensions:Ra},Symbol.toStringTag,{value:"Module"}));function _a(t,e){try{return new URL(t,e).pathname}catch{try{return new URL(t,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(e||"").replace(/\/$/,"")+"/"+String(t||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(t||"")}}}}function $a(t,e){const n=document.createElement("aside");n.className="menu box nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=t("navigation"),n.appendChild(s);const r=document.createElement("ul");return r.className="menu-list",e.forEach(i=>{const a=document.createElement("li"),o=document.createElement("a");if(o.href="#"+i.path,o.textContent=i.name,a.appendChild(o),i.children&&i.children.length){const l=document.createElement("ul");i.children.forEach(h=>{const c=document.createElement("li"),d=document.createElement("a");d.href="#"+h.path,d.textContent=h.name,c.appendChild(d),l.appendChild(c)}),a.appendChild(l)}r.appendChild(a)}),n.appendChild(r),n}function Pa(t,e,n=""){const s=document.createElement("aside");s.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=t("onThisPage"),s.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const o={};(e||[]).forEach(l=>{try{if(!l||l.level===1)return;const h=Number(l.level)>=2?Number(l.level):2,c=document.createElement("li"),d=document.createElement("a"),p=l.id||ce(l.text||"");d.textContent=l.text||"";try{const m=String(n||"").replace(/^[\\.\\/]+/,""),b=m&&U&&U.has&&U.has(m)?U.get(m):m;b?d.href=we(b,p):d.href=`#${encodeURIComponent(p)}`}catch(m){console.warn("[htmlBuilder] buildTocElement href normalization failed",m),d.href=`#${encodeURIComponent(p)}`}if(c.appendChild(d),h===2){i.appendChild(c),o[2]=c,Object.keys(o).forEach(m=>{Number(m)>2&&delete o[m]});return}let f=h-1;for(;f>2&&!o[f];)f--;f<2&&(f=2);let u=o[f];if(!u){i.appendChild(c),o[h]=c;return}let g=u.querySelector("ul");g||(g=document.createElement("ul"),u.appendChild(g)),g.appendChild(c),o[h]=c}catch(h){console.warn("[htmlBuilder] buildTocElement item failed",h,l)}})}catch(o){console.warn("[htmlBuilder] buildTocElement failed",o)}return s.appendChild(i),i.querySelectorAll("li").length<=1?null:s}function mi(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=ce(n.textContent||""))})}function Ia(t,e,n){try{const s=t.querySelectorAll("img");if(s&&s.length){const r=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const o=new URL(r+a,n).toString();i.src=o;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] set image loading attribute failed",l)}}catch(o){console.warn("[htmlBuilder] resolve image src failed",o)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function _r(t,e,n){try{const s=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";let r=null;try{const a=new URL(n,location.href);r=new URL(s||".",a).toString()}catch{try{r=new URL(s||".",location.href).toString()}catch{r=s||"./"}}const i=t.querySelectorAll("*");for(const a of Array.from(i||[]))try{const o=a.tagName?a.tagName.toLowerCase():"",l=h=>{try{const c=a.getAttribute(h)||"";if(!c||/^(https?:)?\/\//i.test(c)||c.startsWith("/")||c.startsWith("#"))return;try{a.setAttribute(h,new URL(c,r).toString())}catch(d){console.warn("[htmlBuilder] rewrite asset attribute failed",h,c,d)}}catch(c){console.warn("[htmlBuilder] rewriteAttr failed",c)}};if(a.hasAttribute&&a.hasAttribute("src")&&l("src"),a.hasAttribute&&a.hasAttribute("href")&&o!=="a"&&l("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&l("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&l("poster"),a.hasAttribute("srcset")){const d=(a.getAttribute("srcset")||"").split(",").map(p=>p.trim()).filter(Boolean).map(p=>{const[f,u]=p.split(/\s+/,2);if(!f||/^(https?:)?\/\//i.test(f)||f.startsWith("/"))return p;try{const g=new URL(f,r).toString();return u?`${g} ${u}`:g}catch{return p}}).join(", ");a.setAttribute("srcset",d)}}catch(o){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",o)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let $r="",yn=null,Pr="";async function wi(t,e,n){try{const s=t.querySelectorAll("a");if(!s||!s.length)return;let r,i;if(e===$r&&yn)r=yn,i=Pr;else{try{r=new URL(e,location.href),i=Mt(r.pathname)}catch{try{r=new URL(e,location.href),i=Mt(r.pathname)}catch{r=null,i="/"}}$r=e,yn=r,Pr=i}const a=new Set,o=[],l=new Set,h=[];for(const c of Array.from(s))try{const d=c.getAttribute("href")||"";if(!d||Fr(d))continue;try{if(d.startsWith("?")||d.indexOf("?")!==-1)try{const f=new URL(d,e||location.href),u=f.searchParams.get("page");if(u&&u.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const m=be(g+u);c.setAttribute("href",we(m,f.hash?f.hash.replace(/^#/,""):null));continue}}}catch{}}catch{}if(d.startsWith("/")&&!d.endsWith(".md"))continue;const p=d.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(p){let f=p[1];const u=p[2];!f.startsWith("/")&&n&&(f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+f);try{const g=new URL(f,e).pathname;let m=g.startsWith(i)?g.slice(i.length):g;m=be(m),o.push({node:c,mdPathRaw:f,frag:u,rel:m}),U.has(m)||a.add(m)}catch(g){console.warn("[htmlBuilder] resolve mdPath failed",g)}continue}try{let f=d;!d.startsWith("/")&&n&&(d.startsWith("#")?f=n+d:f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+d);const g=new URL(f,e).pathname||"";if(g&&g.indexOf(i)!==-1){let m=g.startsWith(i)?g.slice(i.length):g;if(m=be(m),m=_t(m),m||(m="_home"),!m.endsWith(".md")){let b=null;try{if(U&&U.has&&U.has(m))b=U.get(m);else try{const y=String(m||"").replace(/^.*\//,"");y&&U.has&&U.has(y)&&(b=U.get(y))}catch(y){console.warn("[htmlBuilder] mdToSlug baseName check failed",y)}}catch(y){console.warn("[htmlBuilder] mdToSlug access check failed",y)}if(!b)try{const y=String(m||"").replace(/^.*\//,"");for(const[S,T]of V||[])if(T===m||T===y){b=S;break}}catch{}b?c.setAttribute("href",we(b)):(l.add(m),h.push({node:c,rel:m}))}}}catch(f){console.warn("[htmlBuilder] resolving href to URL failed",f)}}catch(d){console.warn("[htmlBuilder] processing anchor failed",d)}a.size&&await Promise.all(Array.from(a).map(async c=>{try{try{const p=String(c).match(/([^\/]+)\.md$/),f=p&&p[1];if(f&&V.has(f)){try{const u=V.get(f);if(u)try{U.set(u,f)}catch(g){console.warn("[htmlBuilder] mdToSlug.set failed",g)}}catch(u){console.warn("[htmlBuilder] reading slugToMd failed",u)}return}}catch(p){console.warn("[htmlBuilder] basename slug lookup failed",p)}const d=await Le(c,e);if(d&&d.raw){const p=(d.raw||"").match(/^#\s+(.+)$/m);if(p&&p[1]){const f=ce(p[1].trim());if(f)try{V.set(f,c),U.set(c,f)}catch(u){console.warn("[htmlBuilder] setting slug mapping failed",u)}}}}catch(d){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",d)}})),l.size&&await Promise.all(Array.from(l).map(async c=>{try{const d=await Le(c,e);if(d&&d.raw)try{const f=(Vn||new DOMParser).parseFromString(d.raw,"text/html"),u=f.querySelector("title"),g=f.querySelector("h1"),m=u&&u.textContent&&u.textContent.trim()?u.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(m){const b=ce(m);if(b)try{V.set(b,c),U.set(c,b)}catch(y){console.warn("[htmlBuilder] setting html slug mapping failed",y)}}}catch(p){console.warn("[htmlBuilder] parse fetched HTML failed",p)}}catch(d){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",d)}}));for(const c of o){const{node:d,frag:p,rel:f}=c;let u=null;try{U.has(f)&&(u=U.get(f))}catch(g){console.warn("[htmlBuilder] mdToSlug access failed",g)}u?d.setAttribute("href",we(u,p)):d.setAttribute("href",we(f,p))}for(const c of h){const{node:d,rel:p}=c;let f=null;try{U.has(p)&&(f=U.get(p))}catch(u){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",u)}if(!f)try{const u=String(p||"").replace(/^.*\//,"");U.has(u)&&(f=U.get(u))}catch(u){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",u)}f?d.setAttribute("href",we(f)):d.setAttribute("href",we(p))}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function Na(t,e,n,s){const r=e.querySelector("h1"),i=r?(r.textContent||"").trim():"";let a="";try{let o="";try{t&&t.meta&&t.meta.title&&(o=String(t.meta.title).trim())}catch{}if(!o&&i&&(o=i),!o)try{const l=e.querySelector("h2");l&&l.textContent&&(o=String(l.textContent).trim())}catch{}!o&&n&&(o=String(n)),o&&(a=ce(o)),a||(a="_home");try{n&&(V.set(a,n),U.set(n,a))}catch(l){console.warn("[htmlBuilder] computeSlug set slug mapping failed",l)}try{const l=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");try{history.replaceState({page:a},"",we(a,l))}catch(h){console.warn("[htmlBuilder] computeSlug history replace failed",h)}}catch(l){console.warn("[htmlBuilder] computeSlug inner failed",l)}}catch(o){console.warn("[htmlBuilder] computeSlug failed",o)}try{if(t&&t.meta&&t.meta.title&&r){const o=String(t.meta.title).trim();if(o&&o!==i){try{a&&(r.id=a)}catch{}try{if(Array.isArray(t.toc))for(const l of t.toc)try{if(l&&Number(l.level)===1&&String(l.text).trim()===(i||"").trim()){l.id=a;break}}catch{}}catch{}}}}catch{}return{topH1:r,h1Text:i,slugKey:a}}async function za(t,e){if(!t||!t.length)return;const n=new Set;for(const l of Array.from(t||[]))try{const h=l.getAttribute("href")||"";if(!h)continue;let p=be(h).split(/::|#/,2)[0];try{const u=p.indexOf("?");u!==-1&&(p=p.slice(0,u))}catch{}if(!p||(p.includes(".")||(p=p+".html"),!/\.html(?:$|[?#])/.test(p)&&!p.toLowerCase().endsWith(".html")))continue;const f=p;try{if(U&&U.has&&U.has(f))continue}catch(u){console.warn("[htmlBuilder] mdToSlug check failed",u)}try{let u=!1;for(const g of V.values())if(g===f){u=!0;break}if(u)continue}catch(u){console.warn("[htmlBuilder] slugToMd iteration failed",u)}n.add(f)}catch(h){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",h)}if(!n.size)return;const s=async l=>{try{const h=await Le(l,e);if(h&&h.raw)try{const d=(Vn||new DOMParser).parseFromString(h.raw,"text/html"),p=d.querySelector("title"),f=d.querySelector("h1"),u=p&&p.textContent&&p.textContent.trim()?p.textContent.trim():f&&f.textContent?f.textContent.trim():null;if(u){const g=ce(u);if(g)try{V.set(g,l),U.set(l,g)}catch(m){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",m)}}}catch(c){console.warn("[htmlBuilder] parse HTML title failed",c)}}catch(h){console.warn("[htmlBuilder] fetchAndExtract failed",h)}},r=5,i=Array.from(n);let a=0;const o=[];for(;a<i.length;){const l=i.slice(a,a+r);o.push(Promise.all(l.map(s))),a+=r}await Promise.all(o)}async function Ba(t,e){if(!t||!t.length)return;const n=[],s=new Set;let r="";try{const i=new URL(e,typeof location<"u"?location.href:"http://localhost/");r=Mt(i.pathname)}catch(i){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(t||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const o=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(o){let l=be(o[1]);try{let h;try{h=_a(l,e)}catch(d){h=l,console.warn("[htmlBuilder] resolve mdPath URL failed",d)}const c=h&&r&&h.startsWith(r)?h.slice(r.length):String(h||"").replace(/^\//,"");n.push({rel:c}),U.has(c)||s.add(c)}catch(h){console.warn("[htmlBuilder] rewriteAnchors failed",h)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),o=a&&a[1];if(o&&V.has(o)){try{const l=V.get(o);l&&U.set(l,o)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",l)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await Le(i,e);if(a&&a.raw){const o=(a.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]){const l=ce(o[1].trim());if(l)try{V.set(l,i),U.set(i,l)}catch(h){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",h)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const Vn=typeof DOMParser<"u"?new DOMParser:null;function kn(t){try{const n=(Vn||new DOMParser).parseFromString(t||"","text/html");mi(n);try{n.querySelectorAll("img").forEach(l=>{try{l.getAttribute("loading")||l.setAttribute("data-want-lazy","1")}catch(h){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",h)}})}catch(o){console.warn("[htmlBuilder] parseHtml query images failed",o)}n.querySelectorAll("pre code, code[class]").forEach(o=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",h=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(h&&h[1]){const c=(h[1]||"").toLowerCase(),d=re.size&&(re.get(c)||re.get(String(c).toLowerCase()))||c;try{(async()=>{try{await pt(d)}catch(p){console.warn("[htmlBuilder] registerLanguage failed",p)}})()}catch(p){console.warn("[htmlBuilder] schedule registerLanguage failed",p)}}else try{if(me&&typeof me.getLanguage=="function"&&me.getLanguage("plaintext")){const c=me.highlight?me.highlight(o.textContent||"",{language:"plaintext"}):null;c&&c.value&&(o.innerHTML=c.value)}}catch(c){console.warn("[htmlBuilder] plaintext highlight fallback failed",c)}}catch(l){console.warn("[htmlBuilder] code element processing failed",l)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(o=>{r.push({level:Number(o.tagName.substring(1)),text:(o.textContent||"").trim(),id:o.id})});const a={};try{const o=n.querySelector("title");o&&o.textContent&&String(o.textContent).trim()&&(a.title=String(o.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:a,toc:r}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function Oa(t){const e=Pn?Pn(t||"",re):new Set,n=new Set(e),s=[];for(const r of n)try{const i=re.size&&(re.get(r)||re.get(String(r).toLowerCase()))||r;try{s.push(pt(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(i))try{s.push(pt(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function qa(t){if(await Oa(t),rn){const e=await rn(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function Da(t,e,n,s,r){let i=null;if(e.isHtml)try{const d=typeof DOMParser<"u"?new DOMParser:null;if(d){const p=d.parseFromString(e.raw||"","text/html");try{_r(p.body,n,r)}catch(f){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",f)}i=kn(p.documentElement&&p.documentElement.outerHTML?p.documentElement.outerHTML:e.raw||"")}else i=kn(e.raw||"")}catch{i=kn(e.raw||"")}else i=await qa(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{_r(a,n,r)}catch(d){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",d)}try{mi(a)}catch(d){console.warn("[htmlBuilder] addHeadingIds failed",d)}try{a.querySelectorAll("pre code, code[class]").forEach(p=>{try{const f=p.getAttribute&&p.getAttribute("class")||p.className||"",u=String(f||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(u)try{p.setAttribute&&p.setAttribute("class",u)}catch(g){p.className=u,console.warn("[htmlBuilder] set element class failed",g)}else try{p.removeAttribute&&p.removeAttribute("class")}catch(g){p.className="",console.warn("[htmlBuilder] remove element class failed",g)}}catch(f){console.warn("[htmlBuilder] code element cleanup failed",f)}})}catch(d){console.warn("[htmlBuilder] processing code elements failed",d)}try{qr(a)}catch(d){console.warn("[htmlBuilder] observeCodeBlocks failed",d)}Ia(a,n,r);try{(a.querySelectorAll&&a.querySelectorAll("img")||[]).forEach(p=>{try{const f=p.parentElement;if(!f||f.tagName.toLowerCase()!=="p"||f.childNodes.length!==1)return;const u=document.createElement("figure");u.className="image",f.replaceWith(u),u.appendChild(p)}catch{}})}catch(d){console.warn("[htmlBuilder] wrap images in Bulma image helper failed",d)}try{(a.querySelectorAll&&a.querySelectorAll("table")||[]).forEach(p=>{try{if(p.classList)p.classList.contains("table")||p.classList.add("table");else{const f=p.getAttribute&&p.getAttribute("class")?p.getAttribute("class"):"",u=String(f||"").split(/\s+/).filter(Boolean);u.indexOf("table")===-1&&u.push("table");try{p.setAttribute&&p.setAttribute("class",u.join(" "))}catch{p.className=u.join(" ")}}}catch{}})}catch(d){console.warn("[htmlBuilder] add Bulma table class failed",d)}const{topH1:o,h1Text:l,slugKey:h}=Na(i,a,n,s);try{if(o&&i&&i.meta&&(i.meta.author||i.meta.date)&&!(o.parentElement&&o.parentElement.querySelector&&o.parentElement.querySelector(".nimbi-article-subtitle"))){const p=i.meta.author?String(i.meta.author).trim():"",f=i.meta.date?String(i.meta.date).trim():"";let u="";try{const m=new Date(f);f&&!isNaN(m.getTime())?u=m.toLocaleDateString():u=f}catch{u=f}const g=[];if(p&&g.push(p),u&&g.push(u),g.length){const m=document.createElement("p"),b=g[0]?String(g[0]).replace(/\"/g,"").trim():"",y=g.slice(1),S=[];b&&S.push(b),y.length&&S.push(y.join(" • ")),m.className="nimbi-article-subtitle is-6 has-text-grey-light",m.textContent=S.join(" • ");try{o.parentElement.insertBefore(m,o.nextSibling)}catch{try{o.insertAdjacentElement("afterend",m)}catch{}}}}}catch{}try{await Ua(a,r,n)}catch(d){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",d),await wi(a,r,n)}const c=Pa(t,i.toc,n);return{article:a,parsed:i,toc:c,topH1:o,h1Text:l,slugKey:h}}function Ha(t){if(!(!t||!t.querySelectorAll))try{const e=Array.from(t.querySelectorAll("script"));for(const n of e)try{const s=document.createElement("script");for(const i of Array.from(n.attributes||[]))try{s.setAttribute(i.name,i.value)}catch{}if(!n.src){const i=n.textContent||"";let a=!1;try{new Function(i)(),a=!0}catch{a=!1}if(a){n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed inline script via Function")}catch{}continue}try{s.type="module"}catch{}s.textContent=i}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";s.addEventListener("error",i=>{try{console.warn("[htmlBuilder] injected script error",{src:r,ev:i})}catch{}}),s.addEventListener("load",()=>{try{console.info("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(s)}catch{try{try{s.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(s)}catch(a){try{console.warn("[htmlBuilder] injected script append failed, skipping",{src:r,err:a})}catch{}}}n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed injected script",r)}catch{}}catch(s){console.warn("[htmlBuilder] execute injected script failed",s)}}catch{}}function Ir(t,e,n){t&&(t.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=e&&e("notFound")||"Page not found";const i=document.createElement("p");i.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",s.appendChild(r),s.appendChild(i),t&&t.appendChild&&t.appendChild(s)}async function Ua(t,e,n){return wi(t,e,n)}function ja(t){try{t.addEventListener("click",e=>{const n=e.target&&e.target.closest?e.target.closest("a"):null;if(!n)return;const s=n.getAttribute("href")||"";try{const r=new URL(s,location.href),i=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!i&&!a)return;e.preventDefault();let o=null;try{history&&history.state&&history.state.page&&(o=history.state.page)}catch(l){o=null,console.warn("[htmlBuilder] access history.state failed",l)}try{o||(o=new URL(location.href).searchParams.get("page"))}catch(l){console.warn("[htmlBuilder] parse current location failed",l)}if(!i&&a||i&&o&&String(i)===String(o)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:o||i},"",we(o||i,a))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}}catch(l){console.warn("[htmlBuilder] update history for anchor failed",l)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(l){console.warn("[htmlBuilder] stopPropagation failed",l)}try{In(a)}catch(l){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:i},"",we(i,a));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(l){console.warn("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){console.warn("[htmlBuilder] dispatch popstate failed",l)}else try{renderByQuery()}catch(l){console.warn("[htmlBuilder] renderByQuery failed",l)}}catch(l){console.warn("[htmlBuilder] SPA navigation invocation failed",l)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function In(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const n=document.getElementById(t);if(n)try{const s=()=>{try{if(e&&e.scrollTo&&e.contains(n)){const r=n.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(s,50)}}catch(s){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",n)}}function Wa(t,e,{mountOverlay:n=null,container:s=null,mountEl:r=null,navWrap:i=null,t:a=null}={}){try{const o=a||(g=>typeof g=="string"?g:""),l=s||document.querySelector(".nimbi-cms"),h=r||document.querySelector(".nimbi-mount"),c=n||document.querySelector(".nimbi-overlay"),d=i||document.querySelector(".nimbi-nav-wrap");let f=document.querySelector(".nimbi-scroll-top");if(!f){f=document.createElement("button"),f.className="nimbi-scroll-top button is-primary is-rounded is-small",f.setAttribute("aria-label",o("scrollToTop")),f.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{c&&c.appendChild?c.appendChild(f):l&&l.appendChild?l.appendChild(f):h&&h.appendChild?h.appendChild(f):document.body.appendChild(f)}catch{try{document.body.appendChild(f)}catch(m){console.warn("[htmlBuilder] append scroll top button failed",m)}}try{try{Ur(f)}catch{}}catch(g){console.warn("[htmlBuilder] set scroll-top button theme registration failed",g)}f.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback container scrollTop failed",m)}try{r&&(r.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",m)}try{document.documentElement.scrollTop=0}catch(m){console.warn("[htmlBuilder] fallback document scrollTop failed",m)}}})}const u=d&&d.querySelector?d.querySelector(".menu-label"):null;if(e){if(!f._nimbiObserver){const g=new IntersectionObserver(m=>{for(const b of m)b.target instanceof Element&&(b.isIntersecting?(f.classList.remove("show"),u&&u.classList.remove("show")):(f.classList.add("show"),u&&u.classList.add("show")))},{root:s instanceof Element?s:r instanceof Element?r:null,threshold:0});f._nimbiObserver=g}try{f._nimbiObserver.disconnect()}catch(g){console.warn("[htmlBuilder] observer disconnect failed",g)}try{f._nimbiObserver.observe(e)}catch(g){console.warn("[htmlBuilder] observer observe failed",g)}try{const g=()=>{try{const m=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},b=e.getBoundingClientRect();!(b.bottom<m.top||b.top>m.bottom)?(f.classList.remove("show"),u&&u.classList.remove("show")):(f.classList.add("show"),u&&u.classList.add("show"))}catch(m){console.warn("[htmlBuilder] checkIntersect failed",m)}};g(),"IntersectionObserver"in window||setTimeout(g,100)}catch(g){console.warn("[htmlBuilder] checkIntersect outer failed",g)}}else{f.classList.remove("show"),u&&u.classList.remove("show");const g=s instanceof Element?s:r instanceof Element?r:window,m=()=>{try{(g===window?window.scrollY:g.scrollTop||0)>10?(f.classList.add("show"),u&&u.classList.add("show")):(f.classList.remove("show"),u&&u.classList.remove("show"))}catch(b){console.warn("[htmlBuilder] onScroll handler failed",b)}};Kt(()=>g.addEventListener("scroll",m)),m()}}catch(o){console.warn("[htmlBuilder] ensureScrollTopButton failed",o)}}function Nr(t,e){try{if(!t)return;try{const n=t[e];if(typeof n<"u")return n}catch{}try{if(t.default)return t.default[e]}catch{}return}catch{return}}async function Fa(t,e,n,s,r,i,a,o,l="eager",h=1,c=void 0,d="favicon"){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const p=typeof DOMParser<"u"?new DOMParser:null,f=p?p.parseFromString(n||"","text/html"):null,u=f?f.querySelectorAll("a"):[];await Kt(()=>za(u,s)),await Kt(()=>Ba(u,s));let g=null,m=null,b=null,y=null,S=null,T=null;function M(){try{const A=document.querySelector(".navbar-burger"),P=A&&A.dataset?A.dataset.target:null,L=P?document.getElementById(P):null;A&&A.classList.contains("is-active")&&(A.classList.remove("is-active"),A.setAttribute("aria-expanded","false"),L&&L.classList.remove("is-active"))}catch(A){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",A)}}const W=()=>g||(g=(async()=>{try{const A=await Promise.resolve().then(()=>Gt),P=Nr(A,"buildSearchIndex")||(typeof globalThis<"u"?globalThis.buildSearchIndex:void 0),L=Nr(A,"buildSearchIndexWorker")||(typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0);if(l==="lazy"&&typeof L=="function")try{const C=await L(s,h,c);if(C&&C.length)return C}catch(C){console.warn&&console.warn("[nimbi-cms] worker builder threw",C)}return typeof P=="function"?await P(s,h,c):[]}catch(A){return console.warn("[nimbi-cms] buildSearchIndex failed",A),[]}finally{if(m){try{m.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}}})(),g.then(A=>{try{const P=String(m&&m.value||"").trim().toLowerCase();if(!P||!Array.isArray(A)||!A.length)return;const L=A.filter(B=>B.title&&B.title.toLowerCase().includes(P)||B.excerpt&&B.excerpt.toLowerCase().includes(P));if(!L||!L.length)return;const C=document.getElementById("nimbi-search-results");if(!C)return;C.innerHTML="";try{const B=document.createElement("div");B.className="panel nimbi-search-panel",L.slice(0,10).forEach(k=>{try{if(k.parentTitle){const ue=document.createElement("p");ue.className="panel-heading nimbi-search-title nimbi-search-parent",ue.textContent=k.parentTitle,B.appendChild(ue)}const I=document.createElement("a");I.className="panel-block nimbi-search-result",I.href=we(k.slug),I.setAttribute("role","button");try{if(k.path&&typeof k.slug=="string"){try{V.set(k.slug,k.path)}catch{}try{U.set(k.path,k.slug)}catch{}}}catch{}const ne=document.createElement("div");ne.className="is-size-6 has-text-weight-semibold",ne.textContent=k.title,I.appendChild(ne),I.addEventListener("click",()=>{try{C.style.display="none"}catch{}}),B.appendChild(I)}catch{}}),C.appendChild(B);try{C.style.display="block"}catch{}}catch{}}catch{}}).catch(()=>{}),g),F=document.createElement("nav");F.className="navbar",F.setAttribute("role","navigation"),F.setAttribute("aria-label","main navigation");const ee=document.createElement("div");ee.className="navbar-brand";const K=u[0],Y=document.createElement("a");if(Y.className="navbar-item",K){const A=K.getAttribute("href")||"#";try{const L=new URL(A,location.href).searchParams.get("page");if(L){const C=decodeURIComponent(L);Y.href=we(C)}else Y.href=we(r),Y.textContent=i("home")}catch{Y.href=we(r),Y.textContent=i("home")}}else Y.href=we(r),Y.textContent=i("home");async function _(A){try{if(!A||A==="none")return null;if(A==="favicon")try{const P=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!P)return null;const L=P.getAttribute("href")||"";return L&&/\.png(?:\?|$)/i.test(L)?new URL(L,location.href).toString():null}catch{return null}if(A==="copy-first"||A==="move-first")try{const P=await Le(r,s);if(!P||!P.raw)return null;const B=new DOMParser().parseFromString(P.raw,"text/html").querySelector("img");if(!B)return null;const k=B.getAttribute("src")||"";if(!k)return null;const I=new URL(k,location.href).toString();if(A==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",I)}catch{}return I}catch{return null}try{return new URL(A,location.href).toString()}catch{return null}}catch{return null}}let D=null;try{D=await _(d)}catch{D=null}if(D)try{const A=document.createElement("img");A.className="nimbi-navbar-logo";const P=i&&typeof i=="function"&&(i("home")||i("siteLogo"))||"";A.alt=P,A.title=P,A.src=D;try{A.style.marginRight="0.5em"}catch{}try{(!Y.textContent||!String(Y.textContent).trim())&&(Y.textContent=P)}catch{}try{Y.insertBefore(A,Y.firstChild)}catch{try{Y.appendChild(A)}catch{}}}catch{}ee.appendChild(Y),Y.addEventListener("click",function(A){const P=Y.getAttribute("href")||"";if(P.startsWith("?page=")){A.preventDefault();const L=new URL(P,location.href),C=L.searchParams.get("page"),B=L.hash?L.hash.replace(/^#/,""):null;history.pushState({page:C},"",we(C,B));try{a()}catch(k){console.warn("[nimbi-cms] renderByQuery failed",k)}try{M()}catch{}}});const O=document.createElement("a");O.className="navbar-burger",O.setAttribute("role","button"),O.setAttribute("aria-label","menu"),O.setAttribute("aria-expanded","false");const oe="nimbi-navbar-menu";O.dataset.target=oe,O.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',ee.appendChild(O);try{O.addEventListener("click",A=>{try{const P=O.dataset&&O.dataset.target?O.dataset.target:null,L=P?document.getElementById(P):null;O.classList.contains("is-active")?(O.classList.remove("is-active"),O.setAttribute("aria-expanded","false"),L&&L.classList.remove("is-active")):(O.classList.add("is-active"),O.setAttribute("aria-expanded","true"),L&&L.classList.add("is-active"))}catch(P){console.warn("[nimbi-cms] navbar burger toggle failed",P)}})}catch(A){console.warn("[nimbi-cms] burger event binding failed",A)}const Z=document.createElement("div");Z.className="navbar-menu",Z.id=oe;const v=document.createElement("div");v.className="navbar-start";let se=null,te=null;if(!o)se=null,m=null,y=null,S=null,T=null;else{se=document.createElement("div"),se.className="navbar-end",te=document.createElement("div"),te.className="navbar-item",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=i("searchPlaceholder")||"",m.id="nimbi-search",l==="eager"&&(m.disabled=!0),b=document.createElement("div"),b.className="control",l==="eager"&&b.classList.add("is-loading"),b.appendChild(m),te.appendChild(b),y=document.createElement("div"),y.className="dropdown is-right",y.id="nimbi-search-dropdown";const A=document.createElement("div");A.className="dropdown-trigger",A.appendChild(te);const P=document.createElement("div");P.className="dropdown-menu",P.setAttribute("role","menu"),S=document.createElement("div"),S.id="nimbi-search-results",S.className="dropdown-content nimbi-search-results",T=S,P.appendChild(S),y.appendChild(A),y.appendChild(P),se.appendChild(y);const L=B=>{if(S){if(S.innerHTML="",!B.length){y&&y.classList.remove("is-active");try{S.style.display="none"}catch{}try{S.classList.remove("is-open")}catch{}return}try{const k=document.createElement("div");k.className="panel nimbi-search-panel",B.forEach(I=>{if(I.parentTitle){const fe=document.createElement("p");fe.textContent=I.parentTitle,fe.className="panel-heading nimbi-search-title nimbi-search-parent",k.appendChild(fe)}const ne=document.createElement("a");ne.className="panel-block nimbi-search-result",ne.href=we(I.slug),ne.setAttribute("role","button");try{if(I.path&&typeof I.slug=="string"){try{V.set(I.slug,I.path)}catch{}try{U.set(I.path,I.slug)}catch{}}}catch{}const ue=document.createElement("div");ue.className="is-size-6 has-text-weight-semibold",ue.textContent=I.title,ne.appendChild(ue),ne.addEventListener("click",()=>{y&&y.classList.remove("is-active");try{S.style.display="none"}catch{}try{S.classList.remove("is-open")}catch{}}),k.appendChild(ne)}),S.appendChild(k)}catch{}y&&y.classList.add("is-active");try{S.style.display="block"}catch{}try{S.classList.add("is-open")}catch{}}},C=(B,k)=>{let I=null;return(...ne)=>{I&&clearTimeout(I),I=setTimeout(()=>B(...ne),k)}};if(m){const B=C(async()=>{const k=document.querySelector("input#nimbi-search"),I=String(k&&k.value||"").trim().toLowerCase();if(!I){L([]);return}try{await W();const ue=(await g).filter(fe=>fe.title&&fe.title.toLowerCase().includes(I)||fe.excerpt&&fe.excerpt.toLowerCase().includes(I));L(ue.slice(0,10))}catch(ne){console.warn("[nimbi-cms] search input handler failed",ne),L([])}},50);try{m.addEventListener("input",B)}catch{}try{document.addEventListener("input",k=>{try{k&&k.target&&k.target.id==="nimbi-search"&&B(k)}catch{}},!0)}catch{}}if(l==="eager"){try{g=W()}catch(B){console.warn("[nimbi-cms] eager search index init failed",B),g=Promise.resolve([])}g.finally(()=>{const B=document.querySelector("input#nimbi-search");if(B){try{B.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}})}try{const B=k=>{try{const I=k&&k.target;if(!T||!T.classList.contains("is-open")&&T.style&&T.style.display!=="block"||I&&(T.contains(I)||m&&(I===m||m.contains&&m.contains(I))))return;y&&y.classList.remove("is-active");try{T.style.display="none"}catch{}try{T.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",B,!0),document.addEventListener("touchstart",B,!0)}catch{}}for(let A=0;A<u.length;A++){const P=u[A];if(A===0)continue;const L=P.getAttribute("href")||"#",C=document.createElement("a");C.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(L)||L.endsWith(".md")){const k=be(L).split(/::|#/,2),I=k[0],ne=k[1];C.href=we(I,ne)}else if(/\.html(?:$|[#?])/.test(L)||L.endsWith(".html")){const k=be(L).split(/::|#/,2);let I=k[0];I&&!I.toLowerCase().endsWith(".html")&&(I=I+".html");const ne=k[1];try{const ue=await Le(I,s);if(ue&&ue.raw)try{const $e=new DOMParser().parseFromString(ue.raw,"text/html"),ye=$e.querySelector("title"),de=$e.querySelector("h1"),Be=ye&&ye.textContent&&ye.textContent.trim()?ye.textContent.trim():de&&de.textContent?de.textContent.trim():null;if(Be){const Qe=ce(Be);if(Qe){try{V.set(Qe,I),U.set(I,Qe)}catch(cn){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",cn)}C.href=we(Qe,ne)}else C.href=we(I,ne)}else C.href=we(I,ne)}catch{C.href=we(I,ne)}else C.href=L}catch{C.href=L}}else C.href=L}catch(B){console.warn("[nimbi-cms] nav item href parse failed",B),C.href=L}try{const B=P.textContent&&String(P.textContent).trim()?String(P.textContent).trim():null;if(B)try{const k=ce(B);if(k){const I=C.getAttribute&&C.getAttribute("href")?C.getAttribute("href"):"";try{const ue=new URL(I,location.href).searchParams.get("page");if(ue){const fe=decodeURIComponent(ue);try{V.set(k,fe),U.set(fe,k)}catch($e){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",$e)}}}catch(ne){console.warn("[nimbi-cms] nav slug mapping failed",ne)}}}catch(k){console.warn("[nimbi-cms] nav slug mapping failed",k)}}catch(B){console.warn("[nimbi-cms] nav slug mapping failed",B)}C.textContent=P.textContent||L,v.appendChild(C)}Z.appendChild(v),se&&Z.appendChild(se),F.appendChild(ee),F.appendChild(Z),t.appendChild(F);try{const A=P=>{try{const L=F&&F.querySelector?F.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!L||!L.classList.contains("is-active"))return;const C=L&&L.closest?L.closest(".navbar"):F;if(C&&C.contains(P.target))return;M()}catch{}};document.addEventListener("click",A,!0),document.addEventListener("touchstart",A,!0)}catch{}try{Z.addEventListener("click",A=>{const P=A.target&&A.target.closest?A.target.closest("a"):null;if(!P)return;const L=P.getAttribute("href")||"";try{const C=new URL(L,location.href),B=C.searchParams.get("page"),k=C.hash?C.hash.replace(/^#/,""):null;if(B){A.preventDefault(),history.pushState({page:B},"",we(B,k));try{a()}catch(I){console.warn("[nimbi-cms] renderByQuery failed",I)}}}catch(C){console.warn("[nimbi-cms] navbar click handler failed",C)}try{const C=F&&F.querySelector?F.querySelector(".navbar-burger"):null,B=C&&C.dataset?C.dataset.target:null,k=B?document.getElementById(B):null;C&&C.classList.contains("is-active")&&(C.classList.remove("is-active"),C.setAttribute("aria-expanded","false"),k&&k.classList.remove("is-active"))}catch(C){console.warn("[nimbi-cms] mobile menu close failed",C)}})}catch(A){console.warn("[nimbi-cms] attach content click handler failed",A)}try{e.addEventListener("click",A=>{const P=A.target&&A.target.closest?A.target.closest("a"):null;if(!P)return;const L=P.getAttribute("href")||"";if(L&&!Fr(L))try{const C=new URL(L,location.href),B=C.searchParams.get("page"),k=C.hash?C.hash.replace(/^#/,""):null;if(B){A.preventDefault(),history.pushState({page:B},"",we(B,k));try{a()}catch(I){console.warn("[nimbi-cms] renderByQuery failed",I)}}}catch(C){console.warn("[nimbi-cms] container click URL parse failed",C)}})}catch(A){console.warn("[nimbi-cms] build navbar failed",A)}return{navbar:F,linkEls:u}}try{document.addEventListener("input",t=>{try{if(t&&t.target&&t.target.id==="nimbi-search"){const e=document.getElementById("nimbi-search-results");if(e&&t.target&&t.target.value)try{e.style.display="block"}catch{}}}catch{}},!0)}catch{}var xn,zr;function Za(){if(zr)return xn;zr=1;function t(i,a){return a.some(([o,l])=>o<=i&&i<=l)}function e(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(i,a={}){let o=0,l=0,h=i.length-1;const c=a.wordsPerMinute||200,d=a.wordBound||n;for(;d(i[l]);)l++;for(;d(i[h]);)h--;const p=`${i}
`;for(let m=l;m<=h;m++)if((e(p[m])||!d(p[m])&&(d(p[m+1])||e(p[m+1])))&&o++,e(p[m]))for(;m<=h&&(s(p[m+1])||d(p[m+1]));)m++;const f=o/c,u=Math.round(f*60*1e3);return{text:Math.ceil(f.toFixed(2))+" min read",minutes:f,time:u,words:o}}return xn=r,xn}var Ga=Za();const Qa=Or(Ga);function Br(t,e){let n=document.querySelector(`meta[name="${t}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",t),document.head.appendChild(n)),n.setAttribute("content",e)}function it(t,e,n){let s=`meta[${t}="${e}"]`,r=document.querySelector(s);r||(r=document.createElement("meta"),r.setAttribute(t,e),document.head.appendChild(r)),r.setAttribute("content",n)}function Xa(t,e){try{let n=document.querySelector(`link[rel="${t}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",t),document.head.appendChild(n)),n.setAttribute("href",e)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function Ka(t,e,n,s){const r=e&&String(e).trim()?e:t.title||document.title;it("property","og:title",r);const i=s&&String(s).trim()?s:t.description||"";i&&String(i).trim()&&it("property","og:description",i),i&&String(i).trim()&&it("name","twitter:description",i),it("name","twitter:card",t.twitter_card||"summary_large_image");const a=n||t.image;a&&(it("property","og:image",a),it("name","twitter:image",a))}function Ya(t,e,n,s,r=""){const i=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",o=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";o&&String(o).trim()&&Br("description",o),Br("robots",i.robots||"index,follow"),Ka(i,e,n,o)}function Va(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const n=document.querySelector(e);if(n){const s=n.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function Ja(t,e,n,s,r,i=""){try{const a=t.meta||{},o=n&&String(n).trim()?n:a.title||i||document.title,l=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",h=s||a.image||null;let c="";try{if(e){const u=be(e);try{c=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(u)}catch{c=location.href.split("#")[0]}}else c=location.href.split("#")[0]}catch(u){c=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",u)}c&&Xa("canonical",c);try{it("property","og:url",c)}catch(u){console.warn("[seoManager] upsertMeta og:url failed",u)}const d={"@context":"https://schema.org","@type":"Article",headline:o||"",description:l||"",url:c||location.href.split("#")[0]};h&&(d.image=String(h)),a.date&&(d.datePublished=a.date),a.dateModified&&(d.dateModified=a.dateModified);const p="nimbi-jsonld";let f=document.getElementById(p);f||(f=document.createElement("script"),f.type="application/ld+json",f.id=p,document.head.appendChild(f)),f.textContent=JSON.stringify(d,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function el(t,e,n,s,r,i,a,o,l,h,c){try{if(s&&s.querySelector){const d=s.querySelector(".menu-label");d&&(d.textContent=o&&o.textContent||t("onThisPage"))}}catch(d){console.warn("[seoManager] update toc label failed",d)}try{const d=n.meta&&n.meta.title?String(n.meta.title).trim():"",p=r.querySelector("img"),f=p&&(p.getAttribute("src")||p.src)||null;let u="";try{let b="";try{const y=o||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let S=y.nextElementSibling;const T=[];for(;S&&!(S.tagName&&S.tagName.toLowerCase()==="h2");){try{if(S.classList&&S.classList.contains("nimbi-article-subtitle")){S=S.nextElementSibling;continue}}catch{}const M=(S.textContent||"").trim();M&&T.push(M),S=S.nextElementSibling}T.length&&(b=T.join(" ").replace(/\s+/g," ").trim()),!b&&l&&(b=String(l).trim())}}catch(y){console.warn("[seoManager] compute descOverride failed",y)}b&&String(b).length>160&&(b=String(b).slice(0,157).trim()+"..."),u=b}catch(b){console.warn("[seoManager] compute descOverride failed",b)}let g="";try{d&&(g=d)}catch{}if(!g)try{o&&o.textContent&&(g=String(o.textContent).trim())}catch{}if(!g)try{const b=r.querySelector("h2");b&&b.textContent&&(g=String(b.textContent).trim())}catch{}g||(g=i||"");try{Ya(n,g||void 0,f,u)}catch(b){console.warn("[seoManager] setMetaTags failed",b)}try{Ja(n,h,g||void 0,f,u,e)}catch(b){console.warn("[seoManager] setStructuredData failed",b)}const m=Va();g?m?document.title=`${m} - ${g}`:document.title=`${e||"Site"} - ${g}`:d?document.title=d:document.title=e||document.title}catch(d){console.warn("[seoManager] applyPageMeta failed",d)}try{try{const d=r.querySelectorAll(".nimbi-reading-time");d&&d.forEach(p=>p.remove())}catch{}if(l){const d=Qa(c.raw||""),p=d&&typeof d.minutes=="number"?Math.ceil(d.minutes):0,f=p?t("readingTime",{minutes:p}):"";if(!f)return;const u=r.querySelector("h1");if(u){const g=r.querySelector(".nimbi-article-subtitle");try{if(g){const m=document.createElement("span");m.className="nimbi-reading-time",m.textContent=" • "+f,g.appendChild(m)}else{const m=document.createElement("p");m.className="nimbi-article-subtitle is-6 has-text-grey-light";const b=document.createElement("span");b.className="nimbi-reading-time",b.textContent=f,m.appendChild(b);try{u.parentElement.insertBefore(m,u.nextSibling)}catch{try{u.insertAdjacentElement("afterend",m)}catch{}}}}catch{try{const b=document.createElement("p");b.className="nimbi-article-subtitle is-6 has-text-grey-light";const y=document.createElement("span");y.className="nimbi-reading-time",y.textContent=f,b.appendChild(y),u.insertAdjacentElement("afterend",b)}catch{}}}}}catch(d){console.warn("[seoManager] reading time update failed",d)}}let Re=null,j=null,Ae=1,Ve=(t,e)=>e,Lt=0,Tt=0,Qt=()=>{},St=.25;function tl(){if(Re&&document.contains(Re))return Re;Re=null;const t=document.createElement("dialog");t.className="nimbi-image-preview modal",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Ve("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",v=>{v.target===t&&Sn()}),t.addEventListener("wheel",v=>{if(!Y())return;v.preventDefault();const se=v.deltaY<0?St:-St;Ge(Ae+se),h(),c()},{passive:!1}),t.addEventListener("keydown",v=>{if(v.key==="Escape"){Sn();return}if(Ae>1){const se=t.querySelector(".nimbi-image-preview__image-wrapper");if(!se)return;const te=40;switch(v.key){case"ArrowUp":se.scrollTop-=te,v.preventDefault();break;case"ArrowDown":se.scrollTop+=te,v.preventDefault();break;case"ArrowLeft":se.scrollLeft-=te,v.preventDefault();break;case"ArrowRight":se.scrollLeft+=te,v.preventDefault();break}}}),document.body.appendChild(t),Re=t,j=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),n=t.querySelector("[data-nimbi-preview-original]"),s=t.querySelector("[data-nimbi-preview-zoom-in]"),r=t.querySelector("[data-nimbi-preview-zoom-out]"),i=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),o=t.querySelector("[data-nimbi-preview-zoom-label]"),l=t.querySelector("[data-nimbi-preview-zoom-hud]");function h(){o&&(o.textContent=`${Math.round(Ae*100)}%`)}const c=()=>{l&&(l.textContent=`${Math.round(Ae*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};Qt=h,s.addEventListener("click",()=>{Ge(Ae+St),h(),c()}),r.addEventListener("click",()=>{Ge(Ae-St),h(),c()}),e.addEventListener("click",()=>{Ct(),h(),c()}),n.addEventListener("click",()=>{Ge(1),h(),c()}),i.addEventListener("click",()=>{Ct(),h(),c()}),a.addEventListener("click",Sn),e.title=Ve("imagePreviewFit","Fit to screen"),n.title=Ve("imagePreviewOriginal","Original size"),r.title=Ve("imagePreviewZoomOut","Zoom out"),s.title=Ve("imagePreviewZoomIn","Zoom in"),a.title=Ve("imagePreviewClose","Close"),a.setAttribute("aria-label",Ve("imagePreviewClose","Close"));let d=!1,p=0,f=0,u=0,g=0;const m=new Map;let b=0,y=1;const S=(v,se)=>{const te=v.x-se.x,A=v.y-se.y;return Math.hypot(te,A)},T=()=>{d=!1,m.clear(),b=0,j&&(j.classList.add("is-panning"),j.classList.remove("is-grabbing"))};let M=0,W=0,F=0;const ee=v=>{const se=Date.now(),te=se-M,A=v.clientX-W,P=v.clientY-F;M=se,W=v.clientX,F=v.clientY,te<300&&Math.hypot(A,P)<30&&(Ge(Ae>1?1:2),h(),v.preventDefault())},K=v=>{Ge(Ae>1?1:2),h(),v.preventDefault()},Y=()=>Re?typeof Re.open=="boolean"?Re.open:Re.classList.contains("is-active"):!1,_=(v,se,te=1)=>{if(m.has(te)&&m.set(te,{x:v,y:se}),m.size===2){const C=Array.from(m.values()),B=S(C[0],C[1]);if(b>0){const k=B/b;Ge(y*k)}return}if(!d)return;const A=j.closest(".nimbi-image-preview__image-wrapper");if(!A)return;const P=v-p,L=se-f;A.scrollLeft=u-P,A.scrollTop=g-L},D=(v,se,te=1)=>{if(!Y())return;if(m.set(te,{x:v,y:se}),m.size===2){const L=Array.from(m.values());b=S(L[0],L[1]),y=Ae;return}const A=j.closest(".nimbi-image-preview__image-wrapper");!A||!(A.scrollWidth>A.clientWidth||A.scrollHeight>A.clientHeight)||(d=!0,p=v,f=se,u=A.scrollLeft,g=A.scrollTop,j.classList.add("is-panning"),j.classList.remove("is-grabbing"),window.addEventListener("pointermove",O),window.addEventListener("pointerup",oe),window.addEventListener("pointercancel",oe))},O=v=>{d&&(v.preventDefault(),_(v.clientX,v.clientY,v.pointerId))},oe=()=>{T(),window.removeEventListener("pointermove",O),window.removeEventListener("pointerup",oe),window.removeEventListener("pointercancel",oe)};j.addEventListener("pointerdown",v=>{v.preventDefault(),D(v.clientX,v.clientY,v.pointerId)}),j.addEventListener("pointermove",v=>{(d||m.size===2)&&v.preventDefault(),_(v.clientX,v.clientY,v.pointerId)}),j.addEventListener("pointerup",v=>{v.preventDefault(),v.pointerType==="touch"&&ee(v),T()}),j.addEventListener("dblclick",K),j.addEventListener("pointercancel",T),j.addEventListener("mousedown",v=>{v.preventDefault(),D(v.clientX,v.clientY,1)}),j.addEventListener("mousemove",v=>{d&&v.preventDefault(),_(v.clientX,v.clientY,1)}),j.addEventListener("mouseup",v=>{v.preventDefault(),T()});const Z=t.querySelector(".nimbi-image-preview__image-wrapper");return Z&&(Z.addEventListener("pointerdown",v=>{if(D(v.clientX,v.clientY,v.pointerId),v&&v.target&&v.target.tagName==="IMG")try{v.target.classList.add("is-grabbing")}catch{}}),Z.addEventListener("pointermove",v=>{_(v.clientX,v.clientY,v.pointerId)}),Z.addEventListener("pointerup",T),Z.addEventListener("pointercancel",T),Z.addEventListener("mousedown",v=>{if(D(v.clientX,v.clientY,1),v&&v.target&&v.target.tagName==="IMG")try{v.target.classList.add("is-grabbing")}catch{}}),Z.addEventListener("mousemove",v=>{_(v.clientX,v.clientY,1)}),Z.addEventListener("mouseup",T)),t}function Ge(t){if(!j)return;const e=Number(t);Ae=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const s=j.getBoundingClientRect(),r=Lt||j.naturalWidth||j.width||s.width||0,i=Tt||j.naturalHeight||j.height||s.height||0;if(r&&i){j.style.setProperty("--nimbi-preview-img-max-width","none"),j.style.setProperty("--nimbi-preview-img-max-height","none"),j.style.setProperty("--nimbi-preview-img-width",`${r*Ae}px`),j.style.setProperty("--nimbi-preview-img-height",`${i*Ae}px`),j.style.setProperty("--nimbi-preview-img-transform","none");try{j.style.width=`${r*Ae}px`,j.style.height=`${i*Ae}px`,j.style.transform="none"}catch{}}else{j.style.setProperty("--nimbi-preview-img-max-width",""),j.style.setProperty("--nimbi-preview-img-max-height",""),j.style.setProperty("--nimbi-preview-img-width",""),j.style.setProperty("--nimbi-preview-img-height",""),j.style.setProperty("--nimbi-preview-img-transform",`scale(${Ae})`);try{j.style.transform=`scale(${Ae})`}catch{}}j&&(j.classList.add("is-panning"),j.classList.remove("is-grabbing"))}function Ct(){if(!j)return;const t=j.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const n=Lt||j.naturalWidth||e.width,s=Tt||j.naturalHeight||e.height;if(!n||!s)return;const r=e.width/n,i=e.height/s,a=Math.min(r,i,1);Ge(Number.isFinite(a)?a:1)}function nl(t,e="",n=0,s=0){const r=tl();Ae=1,Lt=n||0,Tt=s||0,j.src=t,j.alt=e,j.style.transform="scale(1)";const i=()=>{Lt=j.naturalWidth||j.width||0,Tt=j.naturalHeight||j.height||0};if(i(),Ct(),Qt(),requestAnimationFrame(()=>{Ct(),Qt()}),!Lt||!Tt){const a=()=>{i(),requestAnimationFrame(()=>{Ct(),Qt()}),j.removeEventListener("load",a)};j.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function Sn(){if(Re){typeof Re.close=="function"&&Re.open&&Re.close(),Re.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function rl(t,{t:e,zoomStep:n=.25}={}){if(!t||!t.querySelectorAll)return;Ve=(f,u)=>(typeof e=="function"?e(f):void 0)||u,St=n,t.addEventListener("click",f=>{const u=f.target;if(!u||u.tagName!=="IMG")return;const g=u;if(!g.src)return;const m=g.closest("a");m&&m.getAttribute("href")||nl(g.src,g.alt||"",g.naturalWidth||0,g.naturalHeight||0)});let s=!1,r=0,i=0,a=0,o=0;const l=new Map;let h=0,c=1;const d=(f,u)=>{const g=f.x-u.x,m=f.y-u.y;return Math.hypot(g,m)};t.addEventListener("pointerdown",f=>{const u=f.target;if(!u||u.tagName!=="IMG")return;const g=u.closest("a");if(g&&g.getAttribute("href")||!Re||!Re.open)return;if(l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){const b=Array.from(l.values());h=d(b[0],b[1]),c=Ae;return}const m=u.closest(".nimbi-image-preview__image-wrapper");if(m&&!(Ae<=1)){f.preventDefault(),s=!0,r=f.clientX,i=f.clientY,a=m.scrollLeft,o=m.scrollTop,u.setPointerCapture(f.pointerId);try{u.classList.add("is-grabbing")}catch{}}}),t.addEventListener("pointermove",f=>{if(l.has(f.pointerId)&&l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){f.preventDefault();const S=Array.from(l.values()),T=d(S[0],S[1]);if(h>0){const M=T/h;Ge(c*M)}return}if(!s)return;f.preventDefault();const u=f.target,g=u.closest&&u.closest("a");if(g&&g.getAttribute&&g.getAttribute("href"))return;const m=u.closest(".nimbi-image-preview__image-wrapper");if(!m)return;const b=f.clientX-r,y=f.clientY-i;m.scrollLeft=a-b,m.scrollTop=o-y});const p=()=>{s=!1,l.clear(),h=0;try{const f=document.querySelector("[data-nimbi-preview-image]");f&&(f.classList.add("is-panning"),f.classList.remove("is-grabbing"))}catch{}};t.addEventListener("pointerup",p),t.addEventListener("pointercancel",p)}function il(t){const{contentWrap:e,navWrap:n,container:s,mountOverlay:r=null,t:i,contentBase:a,homePage:o,initialDocumentTitle:l,runHooks:h}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let c=null;const d=$a(i,[{path:o,name:i("home"),isIndex:!0,children:[]}]);async function p(b,y){let S,T,M;try{({data:S,pagePath:T,anchor:M}=await zs(b,a))}catch(D){console.error("[nimbi-cms] fetchPageData failed",D),Ir(e,i,D);return}!M&&y&&(M=y);try{In(null)}catch(D){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",D)}e.innerHTML="";const{article:W,parsed:F,toc:ee,topH1:K,h1Text:Y,slugKey:_}=await Da(i,S,T,M,a);el(i,l,F,ee,W,T,M,K,Y,_,S),n.innerHTML="",ee&&(n.appendChild(ee),ja(ee));try{await h("transformHtml",{article:W,parsed:F,toc:ee,pagePath:T,anchor:M,topH1:K,h1Text:Y,slugKey:_,data:S})}catch(D){console.warn("[nimbi-cms] transformHtml hooks failed",D)}e.appendChild(W);try{Ha(W)}catch(D){console.warn("[nimbi-cms] executeEmbeddedScripts failed",D)}try{rl(W,{t:i})}catch(D){console.warn("[nimbi-cms] attachImagePreview failed",D)}try{jt(s,100,!1),requestAnimationFrame(()=>jt(s,100,!1)),setTimeout(()=>jt(s,100,!1),250)}catch(D){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",D)}In(M),Wa(W,K,{mountOverlay:r,container:s,navWrap:n,t:i});try{await h("onPageLoad",{data:S,pagePath:T,anchor:M,article:W,toc:ee,topH1:K,h1Text:Y,slugKey:_,contentWrap:e,navWrap:n})}catch(D){console.warn("[nimbi-cms] onPageLoad hooks failed",D)}c=T}async function f(){let b=new URLSearchParams(location.search).get("page")||o;const y=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await p(b,y)}catch(S){console.warn("[nimbi-cms] renderByQuery failed for",b,S),Ir(e,i,S)}}window.addEventListener("popstate",f);const u=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,g=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const y={top:b.scrollTop||0,left:b.scrollLeft||0};sessionStorage.setItem(u(),JSON.stringify(y))}catch{}},m=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const y=sessionStorage.getItem(u());if(!y)return;const S=JSON.parse(y);S&&typeof S.top=="number"&&b.scrollTo({top:S.top,left:S.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",b=>{if(b.persisted)try{m(),jt(s,100,!1)}catch(y){console.warn("[nimbi-cms] bfcache restore failed",y)}}),window.addEventListener("pagehide",()=>{try{g()}catch(b){console.warn("[nimbi-cms] save scroll position failed",b)}}),{renderByQuery:f,siteNav:d,getCurrentPagePath:()=>c}}function sl(t){try{let e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e&&typeof window<"u"&&window.location&&window.location.hash){const i=window.location.hash,a=i.indexOf("?");a!==-1&&(e=i.slice(a))}if(!e)return{};const n=new URLSearchParams(e.startsWith("?")?e.slice(1):e),s={},r=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(s.contentPath=n.get("contentPath")),n.has("searchIndex")){const i=r(n.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(n.has("searchIndexMode")){const i=n.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(n.has("defaultStyle")){const i=n.get("defaultStyle");(i==="light"||i==="dark"||i==="system")&&(s.defaultStyle=i)}if(n.has("bulmaCustomize")&&(s.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(s.lang=n.get("lang")),n.has("l10nFile")){const i=n.get("l10nFile");s.l10nFile=i==="null"?null:i}if(n.has("cacheTtlMinutes")){const i=Number(n.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(n.has("cacheMaxEntries")){const i=Number(n.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(n.has("homePage")&&(s.homePage=n.get("homePage")),n.has("navigationPage")&&(s.navigationPage=n.get("navigationPage")),n.has("notFoundPage")&&(s.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(s.availableLanguages=n.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),n.has("indexDepth")){const i=Number(n.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(o=>o.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function al(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function vn(t){if(typeof t!="string")return!1;const e=t.trim();if(!e||e.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e)||e.startsWith("//")||e.startsWith("/")||/^[A-Za-z]:\\/.test(e))return!1;const n=e.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}let An="";async function bi(t={}){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.info("[nimbi-cms] initCMS called",{options:t})}catch{}if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const n=sl();if(n&&(n.contentPath||n.homePage||n.notFoundPage||n.navigationPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch(_){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",_)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch(_){console.warn("[nimbi-cms] logging ignore of URL overrides failed",_)}delete n.contentPath,delete n.homePage,delete n.notFoundPage,delete n.navigationPage}const s=Object.assign({},n,t);n&&typeof n.bulmaCustomize=="string"&&n.bulmaCustomize.trim()&&(s.bulmaCustomize=n.bulmaCustomize);let{el:r,contentPath:i="/content",crawlMaxQueue:a=1e3,searchIndex:o=!0,searchIndexMode:l="eager",indexDepth:h=1,noIndexing:c=void 0,defaultStyle:d="light",bulmaCustomize:p="none",lang:f=void 0,l10nFile:u=null,cacheTtlMinutes:g=5,cacheMaxEntries:m,markdownExtensions:b,availableLanguages:y,homePage:S="_home.md",notFoundPage:T="_404.md",navigationPage:M="_navigation.md"}=s;try{typeof S=="string"&&S.startsWith("./")&&(S=S.replace(/^\.\//,""))}catch{}try{typeof T=="string"&&T.startsWith("./")&&(T=T.replace(/^\.\//,""))}catch{}try{typeof M=="string"&&M.startsWith("./")&&(M=M.replace(/^[.]\//,""))}catch{}const{navbarLogo:W="favicon"}=s,{skipRootReadme:F=!1}=s,ee=_=>{try{const D=document.querySelector(r);D&&D instanceof Element&&(D.innerHTML=`<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(_)}</pre></div>`)}catch{}};if(s.contentPath!=null&&!al(s.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(S!=null&&!vn(S))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(T!=null&&!vn(T))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if(M!=null&&!vn(M))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!r)throw new Error("el is required");let K=r;if(typeof r=="string"){if(K=document.querySelector(r),!K)throw new Error(`el selector "${r}" did not match any element`)}else if(!(r instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof i!="string"||!i.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof o!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(l!=null&&l!=="eager"&&l!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(h!=null&&h!==1&&h!==2&&h!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(d!=="light"&&d!=="dark"&&d!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(u!=null&&typeof u!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(g!=null&&(typeof g!="number"||!Number.isFinite(g)||g<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(b!=null&&(!Array.isArray(b)||b.some(_=>!_||typeof _!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some(_=>typeof _!="string"||!_.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(c!=null&&(!Array.isArray(c)||c.some(_=>typeof _!="string"||!_.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(F!=null&&typeof F!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(S!=null&&(typeof S!="string"||!S.trim()||!/\.(md|html)$/.test(S)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(T!=null&&(typeof T!="string"||!T.trim()||!/\.(md|html)$/.test(T)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const Y=!!o;try{Promise.resolve().then(()=>Gt).then(_=>{try{_&&typeof _.setSkipRootReadme=="function"&&_.setSkipRootReadme(!!F)}catch(D){console.warn("[nimbi-cms] setSkipRootReadme failed",D)}}).catch(_=>{})}catch(_){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",_)}try{await(async()=>{try{K.classList.add("nimbi-mount")}catch(k){console.warn("[nimbi-cms] mount element setup failed",k)}const _=document.createElement("section");_.className="section";const D=document.createElement("div");D.className="container nimbi-cms";const O=document.createElement("div");O.className="columns";const oe=document.createElement("div");oe.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",oe.setAttribute("role","navigation");try{const k=typeof ht=="function"?ht("navigation"):null;k&&oe.setAttribute("aria-label",k)}catch(k){console.warn("[nimbi-cms] set nav aria-label failed",k)}O.appendChild(oe);const Z=document.createElement("main");Z.className="column nimbi-content",Z.setAttribute("role","main"),O.appendChild(Z),D.appendChild(O),_.appendChild(D);const v=oe,se=Z;K.appendChild(_);let te=null;try{te=K.querySelector(".nimbi-overlay"),te||(te=document.createElement("div"),te.className="nimbi-overlay",K.appendChild(te))}catch(k){te=null,console.warn("[nimbi-cms] mount overlay setup failed",k)}const A=location.pathname||"/",P=A.endsWith("/")?A:A.substring(0,A.lastIndexOf("/")+1);try{An=document.title||""}catch(k){An="",console.warn("[nimbi-cms] read initial document title failed",k)}let L=i;(L==="."||L==="./")&&(L=""),L.startsWith("./")&&(L=L.slice(2)),L.startsWith("/")&&(L=L.slice(1)),L!==""&&!L.endsWith("/")&&(L=L+"/");const C=new URL(P+L,location.origin).toString();try{Promise.resolve().then(()=>Gt).then(k=>{try{k&&typeof k.setHomePage=="function"&&k.setHomePage(S)}catch(I){console.warn("[nimbi-cms] setHomePage failed",I)}}).catch(k=>{})}catch(k){console.warn("[nimbi-cms] setHomePage dynamic import failed",k)}u&&await Bn(u,P),y&&Array.isArray(y)&&Zr(y),f&&On(f);const B=il({contentWrap:se,navWrap:v,container:D,mountOverlay:te,t:ht,contentBase:C,homePage:S,initialDocumentTitle:An,runHooks:En});if(typeof g=="number"&&g>=0&&typeof xr=="function"&&xr(g*60*1e3),typeof m=="number"&&m>=0&&typeof kr=="function"&&kr(m),b&&Array.isArray(b)&&b.length)try{b.forEach(k=>{typeof k=="object"&&Ma&&typeof $n=="function"&&$n(k)})}catch(k){console.warn("[nimbi-cms] applying markdownExtensions failed",k)}try{typeof a=="number"&&Promise.resolve().then(()=>Gt).then(({setDefaultCrawlMaxQueue:k})=>{try{k(a)}catch(I){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",I)}})}catch(k){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",k)}try{Vt(C)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{Tn(T)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{Vt(C)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{Tn(T)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{await Le(S,C)}catch(k){throw S==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${S} not found at ${C}${S}: ${k.message}`)}Hr(d),await Dr(p,P);try{const k=document.createElement("header");k.className="nimbi-site-navbar",K.insertBefore(k,_);const I=await Le(M,C),ne=await rn(I.raw||""),{navbar:ue,linkEls:fe}=await Fa(k,D,ne.html||"",C,S,ht,B.renderByQuery,Y,l,h,c,W);try{await En("onNavBuild",{navWrap:v,navbar:ue,linkEls:fe,contentBase:C})}catch($e){console.warn("[nimbi-cms] onNavBuild hooks failed",$e)}try{const $e=()=>{const ye=k&&k.getBoundingClientRect&&Math.round(k.getBoundingClientRect().height)||k&&k.offsetHeight||0;if(ye>0){try{K.style.setProperty("--nimbi-site-navbar-height",`${ye}px`)}catch(de){console.warn("[nimbi-cms] set CSS var failed",de)}try{D.style.paddingTop=""}catch(de){console.warn("[nimbi-cms] set container paddingTop failed",de)}try{const de=K&&K.getBoundingClientRect&&Math.round(K.getBoundingClientRect().height)||K&&K.clientHeight||0;if(de>0){const Be=Math.max(0,de-ye);try{D.style.setProperty("--nimbi-cms-height",`${Be}px`)}catch(Qe){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Qe)}}else try{D.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(Be){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Be)}}catch(de){console.warn("[nimbi-cms] compute container height failed",de)}try{k.style.setProperty("--nimbi-site-navbar-height",`${ye}px`)}catch(de){console.warn("[nimbi-cms] set navbar CSS var failed",de)}}};$e();try{if(typeof ResizeObserver<"u"){const ye=new ResizeObserver(()=>$e());try{ye.observe(k)}catch(de){console.warn("[nimbi-cms] ResizeObserver.observe failed",de)}}}catch(ye){console.warn("[nimbi-cms] ResizeObserver setup failed",ye)}}catch($e){console.warn("[nimbi-cms] compute navbar height failed",$e)}}catch(k){console.warn("[nimbi-cms] build navigation failed",k)}await B.renderByQuery();try{Promise.resolve().then(()=>ll).then(({getVersion:k})=>{typeof k=="function"&&k().then(I=>{try{const ne=I||"0.0.0";try{const ue=ye=>{const de=document.createElement("a");de.className="nimbi-version-label tag is-small",de.textContent=`Ninbi CMS v. ${ne}`,de.href=ye||"#",de.target="_blank",de.rel="noopener noreferrer nofollow",de.setAttribute("aria-label",`Ninbi CMS version ${ne}`);try{Ur(de)}catch{}try{K.appendChild(de)}catch(Be){console.warn("[nimbi-cms] append version label failed",Be)}},fe="https://abelvm.github.io/nimbiCMS/",$e=(()=>{try{if(fe&&typeof fe=="string")return new URL(fe).toString()}catch{}return"#"})();ue($e)}catch(ue){console.warn("[nimbi-cms] building version label failed",ue)}}catch(ne){console.warn("[nimbi-cms] building version label failed",ne)}}).catch(I=>{console.warn("[nimbi-cms] getVersion() failed",I)})}).catch(k=>{console.warn("[nimbi-cms] import version module failed",k)})}catch(k){console.warn("[nimbi-cms] version label setup failed",k)}})()}catch(_){throw ee(_),_}}async function yi(){try{if("1.0.2".trim())return"1.0.2"}catch{}return"0.0.0"}const ll=Object.freeze(Object.defineProperty({__proto__:null,getVersion:yi},Symbol.toStringTag,{value:"Module"}));exports.BAD_LANGUAGES=Nn;exports.SUPPORTED_HLJS_MAP=re;exports._clearHooks=rs;exports.addHook=sn;exports.default=bi;exports.ensureBulma=Dr;exports.getVersion=yi;exports.initCMS=bi;exports.loadL10nFile=Bn;exports.loadSupportedLanguages=zn;exports.observeCodeBlocks=qr;exports.onNavBuild=ts;exports.onPageLoad=es;exports.registerLanguage=pt;exports.runHooks=En;exports.setHighlightTheme=cs;exports.setLang=On;exports.setStyle=Hr;exports.setThemeVars=hs;exports.t=ht;exports.transformHtml=ns;
