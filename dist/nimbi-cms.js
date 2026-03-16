(function(de,We){typeof exports=="object"&&typeof module<"u"?We(exports):typeof define=="function"&&define.amd?define(["exports"],We):(de=typeof globalThis<"u"?globalThis:de||self,We(de.nimbiCMS={}))})(this,(function(de){"use strict";const We={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Nt(t,e){if(!Object.prototype.hasOwnProperty.call(We,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");We[t].push(e)}function ki(t){Nt("onPageLoad",t)}function xi(t){Nt("onNavBuild",t)}function Si(t){Nt("transformHtml",t)}async function un(t,e){const n=We[t]||[];for(const s of n)try{await s(e)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function vi(){Object.keys(We).forEach(t=>{We[t].length=0})}function Jn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var hn,er;function Ai(){if(er)return hn;er=1;function t(w){return w instanceof Map?w.clear=w.delete=w.set=function(){throw new Error("map is read-only")}:w instanceof Set&&(w.add=w.clear=w.delete=function(){throw new Error("set is read-only")}),Object.freeze(w),Object.getOwnPropertyNames(w).forEach(x=>{const R=w[x],K=typeof R;(K==="object"||K==="function")&&!Object.isFrozen(R)&&t(R)}),w}class e{constructor(x){x.data===void 0&&(x.data={}),this.data=x.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(w){return w.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(w,...x){const R=Object.create(null);for(const K in w)R[K]=w[K];return x.forEach(function(K){for(const be in K)R[be]=K[be]}),R}const r="</span>",i=w=>!!w.scope,a=(w,{prefix:x})=>{if(w.startsWith("language:"))return w.replace("language:","language-");if(w.includes(".")){const R=w.split(".");return[`${x}${R.shift()}`,...R.map((K,be)=>`${K}${"_".repeat(be+1)}`)].join(" ")}return`${x}${w}`};class c{constructor(x,R){this.buffer="",this.classPrefix=R.classPrefix,x.walk(this)}addText(x){this.buffer+=n(x)}openNode(x){if(!i(x))return;const R=a(x.scope,{prefix:this.classPrefix});this.span(R)}closeNode(x){i(x)&&(this.buffer+=r)}value(){return this.buffer}span(x){this.buffer+=`<span class="${x}">`}}const l=(w={})=>{const x={children:[]};return Object.assign(x,w),x};class u{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(x){this.top.children.push(x)}openNode(x){const R=l({scope:x});this.add(R),this.stack.push(R)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(x){return this.constructor._walk(x,this.rootNode)}static _walk(x,R){return typeof R=="string"?x.addText(R):R.children&&(x.openNode(R),R.children.forEach(K=>this._walk(x,K)),x.closeNode(R)),x}static _collapse(x){typeof x!="string"&&x.children&&(x.children.every(R=>typeof R=="string")?x.children=[x.children.join("")]:x.children.forEach(R=>{u._collapse(R)}))}}class o extends u{constructor(x){super(),this.options=x}addText(x){x!==""&&this.add(x)}startScope(x){this.openNode(x)}endScope(){this.closeNode()}__addSublanguage(x,R){const K=x.root;R&&(K.scope=`language:${R}`),this.add(K)}toHTML(){return new c(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(w){return w?typeof w=="string"?w:w.source:null}function p(w){return g("(?=",w,")")}function f(w){return g("(?:",w,")*")}function h(w){return g("(?:",w,")?")}function g(...w){return w.map(R=>d(R)).join("")}function m(w){const x=w[w.length-1];return typeof x=="object"&&x.constructor===Object?(w.splice(w.length-1,1),x):{}}function b(...w){return"("+(m(w).capture?"":"?:")+w.map(K=>d(K)).join("|")+")"}function y(w){return new RegExp(w.toString()+"|").exec("").length-1}function A(w,x){const R=w&&w.exec(x);return R&&R.index===0}const C=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function I(w,{joinWith:x}){let R=0;return w.map(K=>{R+=1;const be=R;let ye=d(K),B="";for(;ye.length>0;){const z=C.exec(ye);if(!z){B+=ye;break}B+=ye.substring(0,z.index),ye=ye.substring(z.index+z[0].length),z[0][0]==="\\"&&z[1]?B+="\\"+String(Number(z[1])+be):(B+=z[0],z[0]==="("&&R++)}return B}).map(K=>`(${K})`).join(x)}const j=/\b\B/,Z="[a-zA-Z]\\w*",W="[a-zA-Z_]\\w*",he="\\b\\d+(\\.\\d+)?",_="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",O="\\b(0b[01]+)",Q="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",N=(w={})=>{const x=/^#![ ]*\//;return w.binary&&(w.begin=g(x,/.*\b/,w.binary,/\b.*/)),s({scope:"meta",begin:x,end:/$/,relevance:0,"on:begin":(R,K)=>{R.index!==0&&K.ignoreMatch()}},w)},oe={begin:"\\\\[\\s\\S]",relevance:0},X={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[oe]},S={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[oe]},V={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},re=function(w,x,R={}){const K=s({scope:"comment",begin:w,end:x,contains:[]},R);K.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const be=b("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return K.contains.push({begin:g(/[ ]+/,"(",be,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),K},v=re("//","$"),L=re("/\\*","\\*/"),T=re("#","$"),$={scope:"number",begin:he,relevance:0},k={scope:"number",begin:_,relevance:0},P={scope:"number",begin:O,relevance:0},q={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[oe,{begin:/\[/,end:/\]/,relevance:0,contains:[oe]}]},ne={scope:"title",begin:Z,relevance:0},Le={scope:"title",begin:W,relevance:0},ke={begin:"\\.\\s*"+W,relevance:0};var ce=Object.freeze({__proto__:null,APOS_STRING_MODE:X,BACKSLASH_ESCAPE:oe,BINARY_NUMBER_MODE:P,BINARY_NUMBER_RE:O,COMMENT:re,C_BLOCK_COMMENT_MODE:L,C_LINE_COMMENT_MODE:v,C_NUMBER_MODE:k,C_NUMBER_RE:_,END_SAME_AS_BEGIN:function(w){return Object.assign(w,{"on:begin":(x,R)=>{R.data._beginMatch=x[1]},"on:end":(x,R)=>{R.data._beginMatch!==x[1]&&R.ignoreMatch()}})},HASH_COMMENT_MODE:T,IDENT_RE:Z,MATCH_NOTHING_RE:j,METHOD_GUARD:ke,NUMBER_MODE:$,NUMBER_RE:he,PHRASAL_WORDS_MODE:V,QUOTE_STRING_MODE:S,REGEXP_MODE:q,RE_STARTERS_RE:Q,SHEBANG:N,TITLE_MODE:ne,UNDERSCORE_IDENT_RE:W,UNDERSCORE_TITLE_MODE:Le});function Ne(w,x){w.input[w.index-1]==="."&&x.ignoreMatch()}function pt(w,x){w.className!==void 0&&(w.scope=w.className,delete w.className)}function gt(w,x){x&&w.beginKeywords&&(w.begin="\\b("+w.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",w.__beforeBegin=Ne,w.keywords=w.keywords||w.beginKeywords,delete w.beginKeywords,w.relevance===void 0&&(w.relevance=0))}function jn(w,x){Array.isArray(w.illegal)&&(w.illegal=b(...w.illegal))}function Ra(w,x){if(w.match){if(w.begin||w.end)throw new Error("begin & end are not supported with match");w.begin=w.match,delete w.match}}function Ca(w,x){w.relevance===void 0&&(w.relevance=1)}const Ma=(w,x)=>{if(!w.beforeMatch)return;if(w.starts)throw new Error("beforeMatch cannot be used with starts");const R=Object.assign({},w);Object.keys(w).forEach(K=>{delete w[K]}),w.keywords=R.keywords,w.begin=g(R.beforeMatch,p(R.begin)),w.starts={relevance:0,contains:[Object.assign(R,{endsParent:!0})]},w.relevance=0,delete R.beforeMatch},_a=["of","and","for","in","not","or","if","then","parent","list","value"],$a="keyword";function ii(w,x,R=$a){const K=Object.create(null);return typeof w=="string"?be(R,w.split(" ")):Array.isArray(w)?be(R,w):Object.keys(w).forEach(function(ye){Object.assign(K,ii(w[ye],x,ye))}),K;function be(ye,B){x&&(B=B.map(z=>z.toLowerCase())),B.forEach(function(z){const G=z.split("|");K[G[0]]=[ye,Pa(G[0],G[1])]})}}function Pa(w,x){return x?Number(x):Ia(w)?0:1}function Ia(w){return _a.includes(w.toLowerCase())}const si={},at=w=>{console.error(w)},ai=(w,...x)=>{console.log(`WARN: ${w}`,...x)},mt=(w,x)=>{si[`${w}/${x}`]||(console.log(`Deprecated as of ${w}. ${x}`),si[`${w}/${x}`]=!0)},rn=new Error;function li(w,x,{key:R}){let K=0;const be=w[R],ye={},B={};for(let z=1;z<=x.length;z++)B[z+K]=be[z],ye[z+K]=!0,K+=y(x[z-1]);w[R]=B,w[R]._emit=ye,w[R]._multi=!0}function za(w){if(Array.isArray(w.begin)){if(w.skip||w.excludeBegin||w.returnBegin)throw at("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),rn;if(typeof w.beginScope!="object"||w.beginScope===null)throw at("beginScope must be object"),rn;li(w,w.begin,{key:"beginScope"}),w.begin=I(w.begin,{joinWith:""})}}function Ba(w){if(Array.isArray(w.end)){if(w.skip||w.excludeEnd||w.returnEnd)throw at("skip, excludeEnd, returnEnd not compatible with endScope: {}"),rn;if(typeof w.endScope!="object"||w.endScope===null)throw at("endScope must be object"),rn;li(w,w.end,{key:"endScope"}),w.end=I(w.end,{joinWith:""})}}function Na(w){w.scope&&typeof w.scope=="object"&&w.scope!==null&&(w.beginScope=w.scope,delete w.scope)}function Oa(w){Na(w),typeof w.beginScope=="string"&&(w.beginScope={_wrap:w.beginScope}),typeof w.endScope=="string"&&(w.endScope={_wrap:w.endScope}),za(w),Ba(w)}function qa(w){function x(B,z){return new RegExp(d(B),"m"+(w.case_insensitive?"i":"")+(w.unicodeRegex?"u":"")+(z?"g":""))}class R{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(z,G){G.position=this.position++,this.matchIndexes[this.matchAt]=G,this.regexes.push([G,z]),this.matchAt+=y(z)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const z=this.regexes.map(G=>G[1]);this.matcherRe=x(I(z,{joinWith:"|"}),!0),this.lastIndex=0}exec(z){this.matcherRe.lastIndex=this.lastIndex;const G=this.matcherRe.exec(z);if(!G)return null;const Ee=G.findIndex((Bt,Wn)=>Wn>0&&Bt!==void 0),xe=this.matchIndexes[Ee];return G.splice(0,Ee),Object.assign(G,xe)}}class K{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(z){if(this.multiRegexes[z])return this.multiRegexes[z];const G=new R;return this.rules.slice(z).forEach(([Ee,xe])=>G.addRule(Ee,xe)),G.compile(),this.multiRegexes[z]=G,G}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(z,G){this.rules.push([z,G]),G.type==="begin"&&this.count++}exec(z){const G=this.getMatcher(this.regexIndex);G.lastIndex=this.lastIndex;let Ee=G.exec(z);if(this.resumingScanAtSamePosition()&&!(Ee&&Ee.index===this.lastIndex)){const xe=this.getMatcher(0);xe.lastIndex=this.lastIndex+1,Ee=xe.exec(z)}return Ee&&(this.regexIndex+=Ee.position+1,this.regexIndex===this.count&&this.considerAll()),Ee}}function be(B){const z=new K;return B.contains.forEach(G=>z.addRule(G.begin,{rule:G,type:"begin"})),B.terminatorEnd&&z.addRule(B.terminatorEnd,{type:"end"}),B.illegal&&z.addRule(B.illegal,{type:"illegal"}),z}function ye(B,z){const G=B;if(B.isCompiled)return G;[pt,Ra,Oa,Ma].forEach(xe=>xe(B,z)),w.compilerExtensions.forEach(xe=>xe(B,z)),B.__beforeBegin=null,[gt,jn,Ca].forEach(xe=>xe(B,z)),B.isCompiled=!0;let Ee=null;return typeof B.keywords=="object"&&B.keywords.$pattern&&(B.keywords=Object.assign({},B.keywords),Ee=B.keywords.$pattern,delete B.keywords.$pattern),Ee=Ee||/\w+/,B.keywords&&(B.keywords=ii(B.keywords,w.case_insensitive)),G.keywordPatternRe=x(Ee,!0),z&&(B.begin||(B.begin=/\B|\b/),G.beginRe=x(G.begin),!B.end&&!B.endsWithParent&&(B.end=/\B|\b/),B.end&&(G.endRe=x(G.end)),G.terminatorEnd=d(G.end)||"",B.endsWithParent&&z.terminatorEnd&&(G.terminatorEnd+=(B.end?"|":"")+z.terminatorEnd)),B.illegal&&(G.illegalRe=x(B.illegal)),B.contains||(B.contains=[]),B.contains=[].concat(...B.contains.map(function(xe){return Da(xe==="self"?B:xe)})),B.contains.forEach(function(xe){ye(xe,G)}),B.starts&&ye(B.starts,z),G.matcher=be(G),G}if(w.compilerExtensions||(w.compilerExtensions=[]),w.contains&&w.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return w.classNameAliases=s(w.classNameAliases||{}),ye(w)}function oi(w){return w?w.endsWithParent||oi(w.starts):!1}function Da(w){return w.variants&&!w.cachedVariants&&(w.cachedVariants=w.variants.map(function(x){return s(w,{variants:null},x)})),w.cachedVariants?w.cachedVariants:oi(w)?s(w,{starts:w.starts?s(w.starts):null}):Object.isFrozen(w)?s(w):w}var Ha="11.11.1";class Ua extends Error{constructor(x,R){super(x),this.name="HTMLInjectionError",this.html=R}}const Fn=n,ci=s,ui=Symbol("nomatch"),ja=7,hi=function(w){const x=Object.create(null),R=Object.create(null),K=[];let be=!0;const ye="Could not find the language '{}', did you forget to load/include a language module?",B={disableAutodetect:!0,name:"Plain text",contains:[]};let z={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:o};function G(E){return z.noHighlightRe.test(E)}function Ee(E){let H=E.className+" ";H+=E.parentNode?E.parentNode.className:"";const ie=z.languageDetectRe.exec(H);if(ie){const pe=et(ie[1]);return pe||(ai(ye.replace("{}",ie[1])),ai("Falling back to no-highlight mode for this block.",E)),pe?ie[1]:"no-highlight"}return H.split(/\s+/).find(pe=>G(pe)||et(pe))}function xe(E,H,ie){let pe="",ve="";typeof H=="object"?(pe=E,ie=H.ignoreIllegals,ve=H.language):(mt("10.7.0","highlight(lang, code, ...args) has been deprecated."),mt("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),ve=E,pe=H),ie===void 0&&(ie=!0);const De={code:pe,language:ve};an("before:highlight",De);const tt=De.result?De.result:Bt(De.language,De.code,ie);return tt.code=De.code,an("after:highlight",tt),tt}function Bt(E,H,ie,pe){const ve=Object.create(null);function De(M,D){return M.keywords[D]}function tt(){if(!Y.keywords){Re.addText(ge);return}let M=0;Y.keywordPatternRe.lastIndex=0;let D=Y.keywordPatternRe.exec(ge),ee="";for(;D;){ee+=ge.substring(M,D.index);const ue=Fe.case_insensitive?D[0].toLowerCase():D[0],Me=De(Y,ue);if(Me){const[Qe,al]=Me;if(Re.addText(ee),ee="",ve[ue]=(ve[ue]||0)+1,ve[ue]<=ja&&(cn+=al),Qe.startsWith("_"))ee+=D[0];else{const ll=Fe.classNameAliases[Qe]||Qe;je(D[0],ll)}}else ee+=D[0];M=Y.keywordPatternRe.lastIndex,D=Y.keywordPatternRe.exec(ge)}ee+=ge.substring(M),Re.addText(ee)}function ln(){if(ge==="")return;let M=null;if(typeof Y.subLanguage=="string"){if(!x[Y.subLanguage]){Re.addText(ge);return}M=Bt(Y.subLanguage,ge,!0,yi[Y.subLanguage]),yi[Y.subLanguage]=M._top}else M=Zn(ge,Y.subLanguage.length?Y.subLanguage:null);Y.relevance>0&&(cn+=M.relevance),Re.__addSublanguage(M._emitter,M.language)}function ze(){Y.subLanguage!=null?ln():tt(),ge=""}function je(M,D){M!==""&&(Re.startScope(D),Re.addText(M),Re.endScope())}function gi(M,D){let ee=1;const ue=D.length-1;for(;ee<=ue;){if(!M._emit[ee]){ee++;continue}const Me=Fe.classNameAliases[M[ee]]||M[ee],Qe=D[ee];Me?je(Qe,Me):(ge=Qe,tt(),ge=""),ee++}}function mi(M,D){return M.scope&&typeof M.scope=="string"&&Re.openNode(Fe.classNameAliases[M.scope]||M.scope),M.beginScope&&(M.beginScope._wrap?(je(ge,Fe.classNameAliases[M.beginScope._wrap]||M.beginScope._wrap),ge=""):M.beginScope._multi&&(gi(M.beginScope,D),ge="")),Y=Object.create(M,{parent:{value:Y}}),Y}function wi(M,D,ee){let ue=A(M.endRe,ee);if(ue){if(M["on:end"]){const Me=new e(M);M["on:end"](D,Me),Me.isMatchIgnored&&(ue=!1)}if(ue){for(;M.endsParent&&M.parent;)M=M.parent;return M}}if(M.endsWithParent)return wi(M.parent,D,ee)}function tl(M){return Y.matcher.regexIndex===0?(ge+=M[0],1):(Kn=!0,0)}function nl(M){const D=M[0],ee=M.rule,ue=new e(ee),Me=[ee.__beforeBegin,ee["on:begin"]];for(const Qe of Me)if(Qe&&(Qe(M,ue),ue.isMatchIgnored))return tl(D);return ee.skip?ge+=D:(ee.excludeBegin&&(ge+=D),ze(),!ee.returnBegin&&!ee.excludeBegin&&(ge=D)),mi(ee,M),ee.returnBegin?0:D.length}function rl(M){const D=M[0],ee=H.substring(M.index),ue=wi(Y,M,ee);if(!ue)return ui;const Me=Y;Y.endScope&&Y.endScope._wrap?(ze(),je(D,Y.endScope._wrap)):Y.endScope&&Y.endScope._multi?(ze(),gi(Y.endScope,M)):Me.skip?ge+=D:(Me.returnEnd||Me.excludeEnd||(ge+=D),ze(),Me.excludeEnd&&(ge=D));do Y.scope&&Re.closeNode(),!Y.skip&&!Y.subLanguage&&(cn+=Y.relevance),Y=Y.parent;while(Y!==ue.parent);return ue.starts&&mi(ue.starts,M),Me.returnEnd?0:D.length}function il(){const M=[];for(let D=Y;D!==Fe;D=D.parent)D.scope&&M.unshift(D.scope);M.forEach(D=>Re.openNode(D))}let on={};function bi(M,D){const ee=D&&D[0];if(ge+=M,ee==null)return ze(),0;if(on.type==="begin"&&D.type==="end"&&on.index===D.index&&ee===""){if(ge+=H.slice(D.index,D.index+1),!be){const ue=new Error(`0 width match regex (${E})`);throw ue.languageName=E,ue.badRule=on.rule,ue}return 1}if(on=D,D.type==="begin")return nl(D);if(D.type==="illegal"&&!ie){const ue=new Error('Illegal lexeme "'+ee+'" for mode "'+(Y.scope||"<unnamed>")+'"');throw ue.mode=Y,ue}else if(D.type==="end"){const ue=rl(D);if(ue!==ui)return ue}if(D.type==="illegal"&&ee==="")return ge+=`
`,1;if(Xn>1e5&&Xn>D.index*3)throw new Error("potential infinite loop, way more iterations than matches");return ge+=ee,ee.length}const Fe=et(E);if(!Fe)throw at(ye.replace("{}",E)),new Error('Unknown language: "'+E+'"');const sl=qa(Fe);let Qn="",Y=pe||sl;const yi={},Re=new z.__emitter(z);il();let ge="",cn=0,lt=0,Xn=0,Kn=!1;try{if(Fe.__emitTokens)Fe.__emitTokens(H,Re);else{for(Y.matcher.considerAll();;){Xn++,Kn?Kn=!1:Y.matcher.considerAll(),Y.matcher.lastIndex=lt;const M=Y.matcher.exec(H);if(!M)break;const D=H.substring(lt,M.index),ee=bi(D,M);lt=M.index+ee}bi(H.substring(lt))}return Re.finalize(),Qn=Re.toHTML(),{language:E,value:Qn,relevance:cn,illegal:!1,_emitter:Re,_top:Y}}catch(M){if(M.message&&M.message.includes("Illegal"))return{language:E,value:Fn(H),illegal:!0,relevance:0,_illegalBy:{message:M.message,index:lt,context:H.slice(lt-100,lt+100),mode:M.mode,resultSoFar:Qn},_emitter:Re};if(be)return{language:E,value:Fn(H),illegal:!1,relevance:0,errorRaised:M,_emitter:Re,_top:Y};throw M}}function Wn(E){const H={value:Fn(E),illegal:!1,relevance:0,_top:B,_emitter:new z.__emitter(z)};return H._emitter.addText(E),H}function Zn(E,H){H=H||z.languages||Object.keys(x);const ie=Wn(E),pe=H.filter(et).filter(pi).map(ze=>Bt(ze,E,!1));pe.unshift(ie);const ve=pe.sort((ze,je)=>{if(ze.relevance!==je.relevance)return je.relevance-ze.relevance;if(ze.language&&je.language){if(et(ze.language).supersetOf===je.language)return 1;if(et(je.language).supersetOf===ze.language)return-1}return 0}),[De,tt]=ve,ln=De;return ln.secondBest=tt,ln}function Fa(E,H,ie){const pe=H&&R[H]||ie;E.classList.add("hljs"),E.classList.add(`language-${pe}`)}function Gn(E){let H=null;const ie=Ee(E);if(G(ie))return;if(an("before:highlightElement",{el:E,language:ie}),E.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",E);return}if(E.children.length>0&&(z.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(E)),z.throwUnescapedHTML))throw new Ua("One of your code blocks includes unescaped HTML.",E.innerHTML);H=E;const pe=H.textContent,ve=ie?xe(pe,{language:ie,ignoreIllegals:!0}):Zn(pe);E.innerHTML=ve.value,E.dataset.highlighted="yes",Fa(E,ie,ve.language),E.result={language:ve.language,re:ve.relevance,relevance:ve.relevance},ve.secondBest&&(E.secondBest={language:ve.secondBest.language,relevance:ve.secondBest.relevance}),an("after:highlightElement",{el:E,result:ve,text:pe})}function Wa(E){z=ci(z,E)}const Za=()=>{sn(),mt("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Ga(){sn(),mt("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let di=!1;function sn(){function E(){sn()}if(document.readyState==="loading"){di||window.addEventListener("DOMContentLoaded",E,!1),di=!0;return}document.querySelectorAll(z.cssSelector).forEach(Gn)}function Qa(E,H){let ie=null;try{ie=H(w)}catch(pe){if(at("Language definition for '{}' could not be registered.".replace("{}",E)),be)at(pe);else throw pe;ie=B}ie.name||(ie.name=E),x[E]=ie,ie.rawDefinition=H.bind(null,w),ie.aliases&&fi(ie.aliases,{languageName:E})}function Xa(E){delete x[E];for(const H of Object.keys(R))R[H]===E&&delete R[H]}function Ka(){return Object.keys(x)}function et(E){return E=(E||"").toLowerCase(),x[E]||x[R[E]]}function fi(E,{languageName:H}){typeof E=="string"&&(E=[E]),E.forEach(ie=>{R[ie.toLowerCase()]=H})}function pi(E){const H=et(E);return H&&!H.disableAutodetect}function Ya(E){E["before:highlightBlock"]&&!E["before:highlightElement"]&&(E["before:highlightElement"]=H=>{E["before:highlightBlock"](Object.assign({block:H.el},H))}),E["after:highlightBlock"]&&!E["after:highlightElement"]&&(E["after:highlightElement"]=H=>{E["after:highlightBlock"](Object.assign({block:H.el},H))})}function Va(E){Ya(E),K.push(E)}function Ja(E){const H=K.indexOf(E);H!==-1&&K.splice(H,1)}function an(E,H){const ie=E;K.forEach(function(pe){pe[ie]&&pe[ie](H)})}function el(E){return mt("10.7.0","highlightBlock will be removed entirely in v12.0"),mt("10.7.0","Please use highlightElement now."),Gn(E)}Object.assign(w,{highlight:xe,highlightAuto:Zn,highlightAll:sn,highlightElement:Gn,highlightBlock:el,configure:Wa,initHighlighting:Za,initHighlightingOnLoad:Ga,registerLanguage:Qa,unregisterLanguage:Xa,listLanguages:Ka,getLanguage:et,registerAliases:fi,autoDetection:pi,inherit:ci,addPlugin:Va,removePlugin:Ja}),w.debugMode=function(){be=!1},w.safeMode=function(){be=!0},w.versionString=Ha,w.regex={concat:g,lookahead:p,either:b,optional:h,anyNumberOfTimes:f};for(const E in ce)typeof ce[E]=="object"&&t(ce[E]);return Object.assign(w,ce),w},wt=hi({});return wt.newInstance=()=>hi({}),hn=wt,wt.HighlightJS=wt,wt.default=wt,hn}var Ei=Ai();const fe=Jn(Ei),Li="11.11.1",te=new Map,Ti="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Pe={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Pe.html="xml",Pe.xhtml="xml",Pe.markup="xml";const dn=new Set(["magic","undefined"]);let Xe=null;const fn=new Map,Ri=300*1e3;async function pn(t=Ti){if(t)return Xe||(Xe=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const s=(await e.text()).split(/\r?\n/);let r=-1;for(let u=0;u<s.length;u++)if(/\|\s*Language\s*\|/i.test(s[u])){r=u;break}if(r===-1)return;const i=s[r].replace(/^\||\|$/g,"").split("|").map(u=>u.trim().toLowerCase());let a=i.findIndex(u=>/alias|aliases|equivalent|alt|alternates?/i.test(u));a===-1&&(a=1);let c=i.findIndex(u=>/file|filename|module|module name|module-name|short|slug/i.test(u));if(c===-1){const u=i.findIndex(o=>/language/i.test(o));c=u!==-1?u:0}let l=[];for(let u=r+1;u<s.length;u++){const o=s[u].trim();if(!o||!o.startsWith("|"))break;const d=o.replace(/^\||\|$/g,"").split("|").map(m=>m.trim());if(d.every(m=>/^-+$/.test(m)))continue;const p=d;if(!p.length)continue;const h=(p[c]||p[0]||"").toString().trim().toLowerCase();if(!h||/^-+$/.test(h))continue;te.set(h,h);const g=p[a]||"";if(g){const m=String(g).split(",").map(b=>b.replace(/`/g,"").trim()).filter(Boolean);if(m.length){const y=m[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(te.set(y,y),l.push(y))}}}try{const u=[];for(const o of l){const d=String(o||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");d&&/[a-z0-9]/i.test(d)?u.push(d):te.delete(o)}l=u}catch(u){console.warn("[codeblocksManager] cleanup aliases failed",u)}try{let u=0;for(const o of Array.from(te.keys())){if(!o||/^-+$/.test(o)||!/[a-z0-9]/i.test(o)){te.delete(o),u++;continue}if(/^[:]+/.test(o)){const d=o.replace(/^[:]+/,"");if(d&&/[a-z0-9]/i.test(d)){const p=te.get(o);te.delete(o),te.set(d,p)}else te.delete(o),u++}}for(const[o,d]of Array.from(te.entries()))(!d||/^-+$/.test(d)||!/[a-z0-9]/i.test(d))&&(te.delete(o),u++);try{const o=":---------------------";te.has(o)&&(te.delete(o),u++)}catch(o){console.warn("[codeblocksManager] remove sep key failed",o)}try{const o=Array.from(te.keys()).sort()}catch(o){console.warn("[codeblocksManager] compute supported keys failed",o)}}catch(u){console.warn("[codeblocksManager] ignored error",u)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),Xe)}const bt=new Set;async function ot(t,e){if(Xe||(async()=>{try{await pn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Xe)try{await Xe}catch{}if(t=t==null?"":String(t),t=t.trim(),!t)return!1;const n=t.toLowerCase();if(dn.has(n))return!1;if(te.size&&!te.has(n)){const r=Pe;if(!r[n]&&!r[t])return!1}if(bt.has(t))return!0;const s=Pe;try{const r=(e||t||"").toString().replace(/\.js$/i,"").trim(),i=(s[t]||t||"").toString(),a=(s[r]||r||"").toString();let c=Array.from(new Set([i,a,r,t,s[r],s[t]].filter(Boolean))).map(o=>String(o).toLowerCase()).filter(o=>o&&o!=="undefined");te.size&&(c=c.filter(o=>{if(te.has(o))return!0;const d=Pe[o];return!!(d&&te.has(d))}));let l=null,u=null;for(const o of c)try{const d=Date.now();let p=fn.get(o);if(p&&p.ok===!1&&d-(p.ts||0)>=Ri&&(fn.delete(o),p=void 0),p){if(p.module)l=p.module;else if(p.promise)try{l=await p.promise}catch{l=null}}else{const f={promise:null,module:null,ok:null,ts:0};fn.set(o,f),f.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${o}.js`)}catch{return await import(`highlight.js/lib/languages/${o}`)}}catch{try{const g=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${o}.js`;return await new Function("u","return import(u)")(g)}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${o}.js`;return await new Function("u","return import(u)")(m)}catch{return null}}}}catch{return null}})();try{l=await f.promise,f.module=l,f.ok=!!l,f.ts=Date.now()}catch{f.module=null,f.ok=!1,f.ts=Date.now(),l=null}}if(l){const f=l.default||l;try{const h=te.size&&te.get(t)||o||t;return fe.registerLanguage(h,f),bt.add(h),h!==t&&(fe.registerLanguage(t,f),bt.add(t)),!0}catch(h){u=h}}else try{if(te.has(o)||te.has(t)){const f=()=>({});try{fe.registerLanguage(o,f),bt.add(o)}catch{}try{o!==t&&(fe.registerLanguage(t,f),bt.add(t))}catch{}return!0}}catch{}}catch(d){u=d}if(u)throw u;return!1}catch{return!1}}let Ot=null;function tr(t=document){Xe||(async()=>{try{await pn()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const e=Pe,s=Ot||(typeof IntersectionObserver>"u"?null:(Ot=new IntersectionObserver((i,a)=>{i.forEach(c=>{if(!c.isIntersecting)return;const l=c.target;try{a.unobserve(l)}catch(u){console.warn("[codeblocksManager] observer unobserve failed",u)}(async()=>{try{const u=l.getAttribute&&l.getAttribute("class")||l.className||"",o=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const d=(o[1]||"").toLowerCase(),p=e[d]||d,f=te.size&&(te.get(p)||te.get(String(p).toLowerCase()))||p;try{await ot(f)}catch(h){console.warn("[codeblocksManager] registerLanguage failed",h)}try{try{const h=l.textContent||l.innerText||"";h!=null&&(l.textContent=h)}catch{}try{l&&l.dataset&&l.dataset.highlighted&&delete l.dataset.highlighted}catch{}fe.highlightElement(l)}catch(h){console.warn("[codeblocksManager] hljs.highlightElement failed",h)}}else try{const d=l.textContent||"";try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const p=fe.highlight(d,{language:"plaintext"});p&&p.value&&(l.innerHTML=p.value)}}catch{try{fe.highlightElement(l)}catch(f){console.warn("[codeblocksManager] fallback highlightElement failed",f)}}}catch(d){console.warn("[codeblocksManager] auto-detect plaintext failed",d)}}catch(u){console.warn("[codeblocksManager] observer entry processing failed",u)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Ot)),r=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!s){r.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",c=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const l=(c[1]||"").toLowerCase(),u=e[l]||l,o=te.size&&(te.get(u)||te.get(String(u).toLowerCase()))||u;try{await ot(o)}catch(d){console.warn("[codeblocksManager] registerLanguage failed (no observer)",d)}}try{try{const l=i.textContent||i.innerText||"";l!=null&&(i.textContent=l)}catch{}try{i&&i.dataset&&i.dataset.highlighted&&delete i.dataset.highlighted}catch{}fe.highlightElement(i)}catch(l){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function Ci(t,{useCdn:e=!0}={}){const n=document.querySelector("link[data-hl-theme]"),s=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=t==null?"default":String(t),i=r&&String(r).toLowerCase()||"";if(i==="default"||i==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(s&&s.toLowerCase()===i)return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");return}const a=i,c=`https://cdn.jsdelivr.net/npm/highlight.js@${Li}/styles/${a}.css`,l=document.createElement("link");l.rel="stylesheet",l.href=c,l.setAttribute("data-hl-theme",a),l.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(l)}let nt="light";function Mi(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=t,Object.entries(e).forEach(([s,r])=>n.setAttribute(s,r)),document.head.appendChild(n),e["data-bulmaswatch-theme"]){const s=new MutationObserver(()=>{try{const r=n.parentNode;if(!r)return;r.lastElementChild!==n&&r.appendChild(n)}catch{}});try{s.observe(document.head,{childList:!0})}catch{}}}async function nr(t="none",e="/"){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.debug("[bulmaManager] ensureBulma called",{bulmaCustomize:t,pageDir:e})}catch{}if(!t||t==="none")return;const s=[e+"bulma.css","/bulma.css"],r=Array.from(new Set(s));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const i of r)try{const a=await fetch(i,{method:"GET"});if(a.ok){const c=await a.text(),l=document.createElement("style");l.setAttribute("data-bulma-override",i),l.appendChild(document.createTextNode(`
/* bulma override: ${i} */
`+c)),document.head.appendChild(l);return}}catch(a){console.warn("[bulmaManager] fetch local bulma candidate failed",a)}return}try{const i=String(t).trim();if(!i)return;const a=`https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`;Mi(a,{"data-bulmaswatch-theme":i})}catch(i){console.warn("[bulmaManager] ensureBulma failed",i)}}function rr(t){nt=t==="dark"?"dark":t==="system"?"system":"light";try{const e=Array.from(document.querySelectorAll(".nimbi-mount"));if(e.length>0)for(const n of e)nt==="dark"?n.setAttribute("data-theme","dark"):nt==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;nt==="dark"?n.setAttribute("data-theme","dark"):nt==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function _i(t){const e=document.documentElement;for(const[n,s]of Object.entries(t||{}))try{e.style.setProperty(`--${n}`,s)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function ir(t){if(!t||!(t instanceof HTMLElement))return()=>{};const e=t.closest&&t.closest(".nimbi-mount")||null;try{e&&(nt==="dark"?e.setAttribute("data-theme","dark"):nt==="light"?e.setAttribute("data-theme","light"):e.removeAttribute("data-theme"))}catch{}return()=>{}}const sr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},ct=JSON.parse(JSON.stringify(sr));let qt="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";qt=String(t).split("-")[0].toLowerCase()}sr[qt]||(qt="en");let Ke=qt;function ut(t,e={}){const n=ct[Ke]||ct.en;let s=n&&n[t]?n[t]:ct.en[t]||"";for(const r of Object.keys(e))s=s.replace(new RegExp(`{${r}}`,"g"),String(e[r]));return s}async function gn(t,e){if(!t)return;let n=t;try{/^https?:\/\//.test(t)||(n=new URL(t,location.origin+e).toString());const s=await fetch(n);if(!s.ok)return;const r=await s.json();for(const i of Object.keys(r||{}))ct[i]=Object.assign({},ct[i]||{},r[i])}catch{}}function mn(t){const e=String(t).split("-")[0].toLowerCase();Ke=ct[e]?e:"en"}const $i=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Ke},loadL10nFile:gn,setLang:mn,t:ut},Symbol.toStringTag,{value:"Module"})),Pi=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function ar(t,e="worker"){let n=null;function s(){if(!n)try{const c=t();n=c||null,c&&c.addEventListener("error",()=>{try{n===c&&(n=null,c.terminate&&c.terminate())}catch(l){console.warn("["+e+"] worker termination failed",l)}})}catch(c){n=null,console.warn("["+e+"] worker init failed",c)}return n}function r(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(c){console.warn("["+e+"] worker termination failed",c)}}function i(c,l=1e3){return new Promise((u,o)=>{const d=s();if(!d)return o(new Error("worker unavailable"));const p=String(Math.random());c.id=p;let f=null;const h=()=>{f&&clearTimeout(f),d.removeEventListener("message",g),d.removeEventListener("error",m)},g=b=>{const y=b.data||{};y.id===p&&(h(),y.error?o(new Error(y.error)):u(y.result))},m=b=>{h(),console.warn("["+e+"] worker error event",b);try{n===d&&(n=null,d.terminate&&d.terminate())}catch(y){console.warn("["+e+"] worker termination failed",y)}o(new Error(b&&b.message||"worker error"))};f=setTimeout(()=>{h(),console.warn("["+e+"] worker timed out");try{n===d&&(n=null,d.terminate&&d.terminate())}catch(b){console.warn("["+e+"] worker termination on timeout failed",b)}o(new Error("worker timeout"))},l),d.addEventListener("message",g),d.addEventListener("error",m);try{d.postMessage(c)}catch(b){h(),o(b)}})}return{get:s,send:i,terminate:r}}function Ii(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),n=URL.createObjectURL(e);return new Worker(n,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const He=new Set;function wn(t){zi(),He.clear();for(const e of Ie)e&&He.add(e);lr(J),lr(F),wn._refreshed=!0}function lr(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&He.add(e)}function or(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(n,s){return s&&He.add(s),e.call(this,n,s)}}let cr=!1;function zi(){cr||(or(J),or(F),cr=!0)}function ur(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function we(t){return String(t||"").replace(/^[.\/]+/,"")}function yt(t){return String(t||"").replace(/\/+$/,"")}function kt(t){return yt(t)+"/"}function Bi(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=t,document.head.appendChild(n)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function Dt(t,e=0,n=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const s=Array.from(t.querySelectorAll("img"));if(!s.length)return;const r=t,i=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,c=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=i?Math.max(a,i.top):a,o=(i?Math.min(c,i.bottom):c)+Number(e||0);let d=0;r&&(d=r.clientHeight||(i?i.height:0)),d||(d=c-a);let p=.6;try{const m=r&&window.getComputedStyle?window.getComputedStyle(r):null,b=m&&m.getPropertyValue("--nimbi-image-max-height-ratio"),y=b?parseFloat(b):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(p=y)}catch(m){console.warn("[helpers] read CSS ratio failed",m)}const f=Math.max(200,Math.floor(d*p));let h=!1,g=null;if(s.forEach(m=>{try{const b=m.getAttribute?m.getAttribute("loading"):void 0;b!=="eager"&&m.setAttribute&&m.setAttribute("loading","lazy");const y=m.getBoundingClientRect?m.getBoundingClientRect():null,A=m.src||m.getAttribute&&m.getAttribute("src"),C=y&&y.height>1?y.height:f,I=y?y.top:0,j=I+C;y&&C>0&&I<=o&&j>=l&&(m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high"),Bi(A),h=!0),!g&&y&&y.top<=o&&(g={img:m,src:A,rect:y,beforeLoading:b})}catch(b){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",b)}}),!h&&g){const{img:m,src:b,rect:y,beforeLoading:A}=g;try{m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high")}catch(C){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",C)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function me(t,e=null,n){try{const s=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",r=new URLSearchParams(s.startsWith("?")?s.slice(1):s),i=String(t||"");r.delete("page");const a=new URLSearchParams;a.set("page",i);for(const[u,o]of r.entries())a.append(u,o);const c=a.toString();let l=c?`?${c}`:"";return e&&(l+=`#${encodeURIComponent(e)}`),l||`?page=${encodeURIComponent(i)}`}catch{const r=`?page=${encodeURIComponent(String(t||""))}`;return e?`${r}#${encodeURIComponent(e)}`:r}}function Ht(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Ht)}catch(t){console.warn("[helpers] global attach failed",t)}const J=new Map;let _e=[],bn=!1;function Ni(t){bn=!!t}function hr(t){_e=Array.isArray(t)?t.slice():[]}function Oi(){return _e}const dr=ar(()=>Ii(Pi),"slugManager");function yn(){return dr.get()}function fr(t){return dr.send(t)}async function qi(t,e=1,n=void 0){if(!yn())return Gt(t,e,n);try{return await fr({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:n})}catch(r){try{return await Gt(t,e,n)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),r}}}async function Di(t,e,n){return yn()?fr({type:"crawlForSlug",slug:t,base:e,maxQueue:n}):Sn(t,e,n)}function Ye(t,e){if(t)if(_e&&_e.length){const s=e.split("/")[0],r=_e.includes(s);let i=J.get(t);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),r?i.langs[s]=e:i.default=e,J.set(t,i)}else J.set(t,e)}const Ut=new Set;function Hi(t){typeof t=="function"&&Ut.add(t)}function Ui(t){typeof t=="function"&&Ut.delete(t)}const F=new Map;let kn={},Ie=[],ht="_404.md",dt="_home.md";function xn(t){t!=null&&(ht=String(t||""))}function ji(t){t!=null&&(dt=String(t||""))}function Fi(t){kn=t||{}}const xt=new Map,jt=new Set;function Wi(){xt.clear(),jt.clear()}function Zi(t){if(!t||t.length===0)return"";let e=t[0];for(let s=1;s<t.length;s++){const r=t[s];let i=0;const a=Math.min(e.length,r.length);for(;i<a&&e[i]===r[i];)i++;e=e.slice(0,i)}const n=e.lastIndexOf("/");return n===-1?e:e.slice(0,n+1)}function Ft(t){J.clear(),F.clear(),Ie=[],_e=_e||[];const e=Object.keys(kn||{});if(!e.length)return;let n="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?n=new URL(String(t)).pathname:n=String(t||"")}catch(s){n=String(t||""),console.warn("[slugManager] parse contentBase failed",s)}n=kt(n)}}catch(s){n="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}n||(n=Zi(e));for(const s of e){let r=s;n&&s.startsWith(n)?r=we(s.slice(n.length)):r=we(s),Ie.push(r);try{wn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=kn[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const c=le(a[1].trim());if(c)try{let l=c;if((!_e||!_e.length)&&(l=pr(l,new Set(J.keys()))),_e&&_e.length){const o=r.split("/")[0],d=_e.includes(o);let p=J.get(l);(!p||typeof p=="string")&&(p={default:typeof p=="string"?p:void 0,langs:{}}),d?p.langs[o]=r:p.default=r,J.set(l,p)}else J.set(l,r);F.set(r,l)}catch(l){console.warn("[slugManager] set slug mapping failed",l)}}}}}try{Ft()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function le(t){let n=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function pr(t,e){if(!e.has(t))return t;let n=2,s=`${t}-${n}`;for(;e.has(s);)n+=1,s=`${t}-${n}`;return s}function Gi(t){return St(t,void 0)}function St(t,e){if(!t)return!1;if(t.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(t)){if(e&&typeof e=="string")try{const n=new URL(t),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(t.startsWith("/")&&e&&typeof e=="string")try{const n=new URL(t,e),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!1}function Wt(t){return t==null?t:String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(e,n)=>n)}function vt(t){if(!t||!J.has(t))return null;const e=J.get(t);if(!e)return null;if(typeof e=="string")return e;if(_e&&_e.length&&Ke&&e.langs&&e.langs[Ke])return e.langs[Ke];if(e.default)return e.default;if(e.langs){const n=Object.keys(e.langs);if(n.length)return e.langs[n[0]]}return null}const At=new Map;function Qi(){At.clear()}let Ae=async function(t,e){if(!t)throw new Error("path required");try{const i=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&J.has(i)){const a=vt(i)||J.get(i);a&&a!==t&&(t=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const n=e==null?"":yt(String(e));let s="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else if(n.startsWith("/"))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=n.startsWith("/")?n:"/"+n;s=i+a.replace(/\/$/,"")+"/"+t.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+t.replace(/^\//,"")}catch{s="/"+t.replace(/^\//,"")}if(At.has(s))return At.get(s);const r=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const d=`${n}/${ht}`,p=await globalThis.fetch(d);if(p&&typeof p.ok=="boolean"&&p.ok)return{raw:await p.text(),status:404}}catch(d){console.warn("[slugManager] fetching fallback 404 failed",d)}let o="";try{i&&typeof i.clone=="function"?o=await i.clone().text():i&&typeof i.text=="function"?o=await i.text():o=""}catch(d){o="",console.warn("[slugManager] reading error body failed",d)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:o.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),c=a.trim().slice(0,16).toLowerCase(),l=c.startsWith("<!doctype")||c.startsWith("<html"),u=l||String(t||"").toLowerCase().endsWith(".html");if(l&&String(t||"").toLowerCase().endsWith(".md")){try{const o=`${n}/${ht}`,d=await globalThis.fetch(o);if(d.ok)return{raw:await d.text(),status:404}}catch(o){console.warn("[slugManager] fetching fallback 404 failed",o)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return u?{raw:a,isHtml:!0}:{raw:a}})();return At.set(s,r),r};function Xi(t){typeof t=="function"&&(Ae=t)}const Zt=new Map;function Ki(t){if(!t||typeof t!="string")return"";let e=t.replace(/```[\s\S]*?```/g,"");return e=e.replace(/<pre[\s\S]*?<\/pre>/gi,""),e=e.replace(/<code[\s\S]*?<\/code>/gi,""),e=e.replace(/<!--([\s\S]*?)-->/g,""),e=e.replace(/^ {4,}.*$/gm,""),e=e.replace(/`[^`]*`/g,""),e}let Ze=[],Et=null;async function Gt(t,e=1,n=void 0){const s=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>we(String(r||""))))):[];try{const r=we(String(ht||""));r&&!s.includes(r)&&s.push(r)}catch{}if(Ze&&Ze.length&&e===1&&!Ze.some(i=>{try{return s.includes(we(String(i.path||"")))}catch{return!1}}))return Ze;if(Et)return Et;Et=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(u=>we(String(u||""))))):[];try{const u=we(String(ht||""));u&&!r.includes(u)&&r.push(u)}catch{}const i=u=>{if(!r||!r.length)return!1;for(const o of r)if(o&&(u===o||u.startsWith(o+"/")))return!0;return!1};let a=[];if(Ie&&Ie.length&&(a=Array.from(Ie)),!a.length)for(const u of J.values())u&&a.push(u);try{const u=await br(t);u&&u.length&&(a=a.concat(u))}catch(u){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",u)}try{const u=new Set(a),o=[...a];for(u.size;o.length&&u.size<=Lt;){const d=o.shift();try{const p=await Ae(d,t);if(p&&p.raw){if(p.status===404)continue;let f=p.raw;const h=[],g=String(d||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(g)&&bn&&(!d||!d.includes("/")))continue;const m=Ki(f),b=/\[[^\]]+\]\(([^)]+)\)/g;let y;for(;y=b.exec(m);)h.push(y[1]);const A=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;y=A.exec(m);)h.push(y[1]);const C=d&&d.includes("/")?d.substring(0,d.lastIndexOf("/")+1):"";for(let I of h)try{if(St(I,t)||I.startsWith("..")||I.indexOf("/../")!==-1||(C&&!I.startsWith("./")&&!I.startsWith("/")&&!I.startsWith("../")&&(I=C+I),I=we(I),!/\.(md|html?)(?:$|[?#])/i.test(I))||(I=I.split(/[?#]/)[0],i(I)))continue;u.has(I)||(u.add(I),o.push(I),a.push(I))}catch(j){console.warn("[slugManager] href processing failed",I,j)}}}catch(p){console.warn("[slugManager] discovery fetch failed for",d,p)}}}catch(u){console.warn("[slugManager] discovery loop failed",u)}const c=new Set;a=a.filter(u=>!u||c.has(u)||i(u)?!1:(c.add(u),!0));const l=[];for(const u of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(u))try{const o=await Ae(u,t);if(o&&o.raw){if(o.status===404)continue;let d="",p="";if(o.isHtml)try{const g=new DOMParser().parseFromString(o.raw,"text/html"),m=g.querySelector("title")||g.querySelector("h1");m&&m.textContent&&(d=m.textContent.trim());const b=g.querySelector("p");if(b&&b.textContent&&(p=b.textContent.trim()),e>=2)try{const y=g.querySelector("h1"),A=y&&y.textContent?y.textContent.trim():d||"",C=(()=>{try{if(F.has(u))return F.get(u)}catch{}return le(d||u)})(),I=Array.from(g.querySelectorAll("h2"));for(const j of I)try{const Z=(j.textContent||"").trim();if(!Z)continue;const W=j.id?j.id:le(Z),he=C?`${C}::${W}`:`${le(u)}::${W}`;let _="",O=j.nextElementSibling;for(;O&&O.tagName&&O.tagName.toLowerCase()==="script";)O=O.nextElementSibling;O&&O.textContent&&(_=String(O.textContent).trim()),l.push({slug:he,title:Z,excerpt:_,path:u,parentTitle:A})}catch(Z){console.warn("[slugManager] indexing H2 failed",Z)}if(e===3)try{const j=Array.from(g.querySelectorAll("h3"));for(const Z of j)try{const W=(Z.textContent||"").trim();if(!W)continue;const he=Z.id?Z.id:le(W),_=C?`${C}::${he}`:`${le(u)}::${he}`;let O="",Q=Z.nextElementSibling;for(;Q&&Q.tagName&&Q.tagName.toLowerCase()==="script";)Q=Q.nextElementSibling;Q&&Q.textContent&&(O=String(Q.textContent).trim()),l.push({slug:_,title:W,excerpt:O,path:u,parentTitle:A})}catch(W){console.warn("[slugManager] indexing H3 failed",W)}}catch(j){console.warn("[slugManager] collect H3s failed",j)}}catch(y){console.warn("[slugManager] collect H2s failed",y)}}catch(h){console.warn("[slugManager] parsing HTML for index failed",h)}else{const h=o.raw,g=h.match(/^#\s+(.+)$/m);d=g?g[1].trim():"";try{d=Wt(d)}catch{}const m=h.split(/\r?\n\s*\r?\n/);if(m.length>1)for(let b=1;b<m.length;b++){const y=m[b].trim();if(y&&!/^#/.test(y)){p=y.replace(/\r?\n/g," ");break}}if(e>=2){let b="",y="";try{const A=(h.match(/^#\s+(.+)$/m)||[])[1];b=A?A.trim():"",y=(function(){try{if(F.has(u))return F.get(u)}catch{}return le(d||u)})();const C=/^##\s+(.+)$/gm;let I;for(;I=C.exec(h);)try{const j=(I[1]||"").trim(),Z=Wt(j);if(!j)continue;const W=le(j),he=y?`${y}::${W}`:`${le(u)}::${W}`,O=h.slice(C.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),Q=O&&O[1]?String(O[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";l.push({slug:he,title:Z,excerpt:Q,path:u,parentTitle:b})}catch(j){console.warn("[slugManager] indexing markdown H2 failed",j)}}catch(A){console.warn("[slugManager] collect markdown H2s failed",A)}if(e===3)try{const A=/^###\s+(.+)$/gm;let C;for(;C=A.exec(h);)try{const I=(C[1]||"").trim(),j=Wt(I);if(!I)continue;const Z=le(I),W=y?`${y}::${Z}`:`${le(u)}::${Z}`,_=h.slice(A.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),O=_&&_[1]?String(_[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";l.push({slug:W,title:j,excerpt:O,path:u,parentTitle:b})}catch(I){console.warn("[slugManager] indexing markdown H3 failed",I)}}catch(A){console.warn("[slugManager] collect markdown H3s failed",A)}}}let f="";try{F.has(u)&&(f=F.get(u))}catch(h){console.warn("[slugManager] mdToSlug access failed",h)}f||(f=le(d||u)),l.push({slug:f,title:d,excerpt:p,path:u})}}catch(o){console.warn("[slugManager] buildSearchIndex: entry fetch failed",o)}try{Ze=l.filter(o=>{try{return!i(String(o.path||""))}catch{return!0}})}catch(u){console.warn("[slugManager] filtering index by excludes failed",u),Ze=l}return Ze})();try{await Et}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return Et=null,Ze}const gr=1e3;let Lt=gr;function Yi(t){typeof t=="number"&&t>=0&&(Lt=t)}const mr=new DOMParser,wr="a[href]";let Sn=async function(t,e,n=Lt){if(Zt.has(t))return Zt.get(t);let s=null;const r=new Set,i=[""];for(;i.length&&!s&&!(i.length>n);){const a=i.shift();if(r.has(a))continue;r.add(a);let c=e;c.endsWith("/")||(c+="/"),c+=a;try{let l;try{l=await globalThis.fetch(c)}catch(p){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:c,error:p});continue}if(!l||!l.ok){l&&!l.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:c,status:l.status});continue}const u=await l.text(),d=mr.parseFromString(u,"text/html").querySelectorAll(wr);for(const p of d)try{let f=p.getAttribute("href")||"";if(!f||St(f,e)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const h=a+f;r.has(h)||i.push(h);continue}if(f.toLowerCase().endsWith(".md")){const h=we(a+f);try{if(F.has(h))continue;for(const g of J.values());}catch(g){console.warn("[slugManager] slug map access failed",g)}try{const g=await Ae(h,e);if(g&&g.raw){const m=(g.raw||"").match(/^#\s+(.+)$/m);if(m&&m[1]&&le(m[1].trim())===t){s=h;break}}}catch(g){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",g)}}}catch(f){console.warn("[slugManager] crawlForSlug: link iteration failed",f)}}catch(l){console.warn("[slugManager] crawlForSlug: directory fetch failed",l)}}return Zt.set(t,s),s};async function br(t,e=Lt){const n=new Set,s=new Set,r=[""];for(;r.length&&!(r.length>e);){const i=r.shift();if(s.has(i))continue;s.add(i);let a=t;a.endsWith("/")||(a+="/"),a+=i;try{let c;try{c=await globalThis.fetch(a)}catch(d){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:d});continue}if(!c||!c.ok){c&&!c.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:c.status});continue}const l=await c.text(),o=mr.parseFromString(l,"text/html").querySelectorAll(wr);for(const d of o)try{let p=d.getAttribute("href")||"";if(!p||St(p,t)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const h=i+p;s.has(h)||r.push(h);continue}const f=(i+p).replace(/^\/+/,"");/\.(md|html?)$/i.test(f)&&n.add(f)}catch(p){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",p)}}catch(c){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",c)}}return Array.from(n)}async function yr(t,e,n){if(t&&typeof t=="string"&&(t=we(t),t=yt(t)),J.has(t))return vt(t)||J.get(t);for(const r of Ut)try{const i=await r(t,e);if(i)return Ye(t,i),F.set(i,t),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(Ie&&Ie.length){if(xt.has(t)){const r=xt.get(t);return J.set(t,r),F.set(r,t),r}for(const r of Ie)if(!jt.has(r))try{const i=await Ae(r,e);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const c=le(a[1].trim());if(jt.add(r),c&&xt.set(c,r),c===t)return Ye(t,r),F.set(r,t),r}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const r=await Gt(e);if(r&&r.length){const i=r.find(a=>a.slug===t);if(i)return Ye(t,i.path),F.set(i.path,t),i.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await Sn(t,e,n);if(r)return Ye(t,r),F.set(r,t),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const s=[`${t}.html`,`${t}.md`];for(const r of s)try{const i=await Ae(r,e);if(i&&i.raw)return Ye(t,r),F.set(r,t),r}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(Ie&&Ie.length)for(const r of Ie)try{const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(i)===t)return Ye(t,r),F.set(r,t),r}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const r=[];dt&&typeof dt=="string"&&dt.trim()&&r.push(dt),r.includes("_home.md")||r.push("_home.md");for(const i of r)try{const a=await Ae(i,e);if(a&&a.raw){const c=(a.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]&&le(c[1].trim())===t)return Ye(t,i),F.set(i,t),i}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const Qt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:gr,_setAllMd:Fi,_storeSlugMapping:Ye,addSlugResolver:Hi,get allMarkdownPaths(){return Ie},get availableLanguages(){return _e},buildSearchIndex:Gt,buildSearchIndexWorker:qi,clearFetchCache:Qi,clearListCaches:Wi,crawlAllMarkdown:br,crawlCache:Zt,crawlForSlug:Sn,crawlForSlugWorker:Di,get defaultCrawlMaxQueue(){return Lt},ensureSlug:yr,fetchCache:At,get fetchMarkdown(){return Ae},getLanguages:Oi,get homePage(){return dt},initSlugWorker:yn,isExternalLink:Gi,isExternalLinkWithBase:St,listPathsFetched:jt,listSlugCache:xt,mdToSlug:F,get notFoundPage(){return ht},removeSlugResolver:Ui,resolveSlugPath:vt,get searchIndex(){return Ze},setContentBase:Ft,setDefaultCrawlMaxQueue:Yi,setFetchMarkdown:Xi,setHomePage:ji,setLanguages:hr,setNotFoundPage:xn,setSkipRootReadme:Ni,get skipRootReadme(){return bn},slugResolvers:Ut,slugToMd:J,slugify:le,unescapeMarkdown:Wt,uniqueSlug:pr},Symbol.toStringTag,{value:"Module"}));let kr=100;function xr(t){kr=t}let Tt=300*1e3;function Sr(t){Tt=t}const Be=new Map;function Vi(t){if(!Be.has(t))return;const e=Be.get(t),n=Date.now();if(e.ts+Tt<n){Be.delete(t);return}return Be.delete(t),Be.set(t,e),e.value}function Ji(t,e){if(vr(),vr(),Be.delete(t),Be.set(t,{value:e,ts:Date.now()}),Be.size>kr){const n=Be.keys().next().value;n!==void 0&&Be.delete(n)}}function vr(){if(!Tt||Tt<=0)return;const t=Date.now();for(const[e,n]of Be.entries())n.ts+Tt<t&&Be.delete(e)}async function es(t,e){const n=new Set(He),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(s||[])){const i=r.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const c=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(c){let d=we(c[1]);d&&n.add(d);continue}const l=(r.textContent||"").trim(),u=(a.pathname||"").replace(/^.*\//,"");if(l&&le(l)===t||u&&le(u.replace(/\.(html?|md)$/i,""))===t)return a.toString();if(/\.(html?)$/i.test(a.pathname)){let d=a.pathname.replace(/^\//,"");n.add(d);continue}const o=a.pathname||"";if(o){const d=new URL(e),p=kt(d.pathname);if(o.indexOf(p)!==-1){let f=o.startsWith(p)?o.slice(p.length):o;f=we(f),f&&n.add(f)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const i=await Ae(r,e);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const c=(a[1]||"").trim();if(c&&le(c)===t)return r}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function ts(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const n=decodeURIComponent(String(t||""));if(J.has(n)){const s=vt(n)||J.get(n);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||e.push(s):(e.push(s),e.push(s+".html")))}else{if(He&&He.size)for(const s of He){const r=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(r)===n&&!/index\.html$/i.test(s)){e.push(s);break}}!e.length&&n&&!/\.(md|html?)$/i.test(n)&&(e.push(n+".html"),e.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return e}async function ns(t,e){const n=t||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=t||"",i=null;if(r&&String(r).includes("::")){const h=String(r).split("::",2);r=h[0],i=h[1]||null}const c=`${t}|||${typeof $i<"u"&&Ke?Ke:""}`,l=Vi(c);if(l)r=l.resolved,i=l.anchor||i;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let h=decodeURIComponent(String(r||""));if(h&&typeof h=="string"&&(h=we(h),h=yt(h)),J.has(h))r=vt(h)||J.get(h);else{let g=await es(h,e);if(g)r=g;else if(wn._refreshed&&He&&He.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const m=await yr(h,e);m&&(r=m)}}}Ji(c,{resolved:r,anchor:i})}!i&&s&&(i=s);try{if(r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const h=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const g=await fetch(h);if(g&&g.ok){const m=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",y=(m||"").toLowerCase();if(b&&b.indexOf&&b.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1)return{data:{raw:m,isHtml:!0},pagePath:h.replace(/^\//,""),anchor:i}}}catch{}}}catch{}const u=ts(r),o=String(n||"").includes(".md")||String(n||"").includes(".html");if(o&&u.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&u.push(r),u.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&u.push(r),u.length===1&&/index\.html$/i.test(u[0])&&!o&&!J.has(r)&&!J.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let d=null,p=null,f=null;for(const h of u)if(h)try{const g=we(h);d=await Ae(g,e),p=g;break}catch(g){f=g;try{console.warn("[router] candidate fetch failed",{candidate:h,contentBase:e,err:g&&g.message||g})}catch{}}if(!d){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:u,contentBase:e,fetchError:f&&(f.message||String(f))||null})}catch{}try{if(o&&String(n||"").toLowerCase().includes(".html"))try{const h=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",h);const g=await fetch(h);if(g&&g.ok){const m=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",y=(m||"").toLowerCase(),A=b&&b.indexOf&&b.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1;if(A||console.warn("[router] absolute fetch returned non-HTML",{abs:h,contentType:b,snippet:y.slice(0,200)}),A)try{const C=h,I=new URL(".",C).toString();try{const Z=typeof DOMParser<"u"?new DOMParser:null;if(Z){const W=Z.parseFromString(m||"","text/html"),he=(N,oe)=>{try{const X=oe.getAttribute(N)||"";if(!X||/^(https?:)?\/\//i.test(X)||X.startsWith("/")||X.startsWith("#"))return;try{const S=new URL(X,C).toString();oe.setAttribute(N,S)}catch(S){console.warn("[router] rewrite attribute failed",N,S)}}catch(X){console.warn("[router] rewrite helper failed",X)}},_=W.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),O=[];for(const N of Array.from(_||[]))try{const oe=N.tagName?N.tagName.toLowerCase():"";if(oe==="a")continue;if(N.hasAttribute("src")){const X=N.getAttribute("src");he("src",N);const S=N.getAttribute("src");X!==S&&O.push({attr:"src",tag:oe,before:X,after:S})}if(N.hasAttribute("href")&&oe==="link"){const X=N.getAttribute("href");he("href",N);const S=N.getAttribute("href");X!==S&&O.push({attr:"href",tag:oe,before:X,after:S})}if(N.hasAttribute("href")&&oe!=="link"){const X=N.getAttribute("href");he("href",N);const S=N.getAttribute("href");X!==S&&O.push({attr:"href",tag:oe,before:X,after:S})}if(N.hasAttribute("xlink:href")){const X=N.getAttribute("xlink:href");he("xlink:href",N);const S=N.getAttribute("xlink:href");X!==S&&O.push({attr:"xlink:href",tag:oe,before:X,after:S})}if(N.hasAttribute("poster")){const X=N.getAttribute("poster");he("poster",N);const S=N.getAttribute("poster");X!==S&&O.push({attr:"poster",tag:oe,before:X,after:S})}if(N.hasAttribute("srcset")){const V=(N.getAttribute("srcset")||"").split(",").map(re=>re.trim()).filter(Boolean).map(re=>{const[v,L]=re.split(/\s+/,2);if(!v||/^(https?:)?\/\//i.test(v)||v.startsWith("/"))return re;try{const T=new URL(v,C).toString();return L?`${T} ${L}`:T}catch{return re}}).join(", ");N.setAttribute("srcset",V)}}catch{}const Q=W.documentElement&&W.documentElement.outerHTML?W.documentElement.outerHTML:m;try{O&&O.length&&console.warn("[router] rewritten asset refs",{abs:h,rewritten:O})}catch{}return{data:{raw:Q,isHtml:!0},pagePath:String(n||""),anchor:i}}}catch{}let j=m;return/<base\s+[^>]*>/i.test(m)||(/<head[^>]*>/i.test(m)?j=m.replace(/(<head[^>]*>)/i,`$1<base href="${I}">`):j=`<base href="${I}">`+m),{data:{raw:j,isHtml:!0},pagePath:String(n||""),anchor:i}}catch{return{data:{raw:m,isHtml:!0},pagePath:String(n||""),anchor:i}}}}catch(h){console.warn("[router] absolute HTML fetch fallback failed",h)}}catch{}try{const h=decodeURIComponent(String(r||""));if(h&&!/\.(md|html?)$/i.test(h)){const g=[`/assets/${h}.html`,`/assets/${h}/index.html`];for(const m of g)try{const b=await fetch(m,{method:"GET"});if(b&&b.ok)return{data:{raw:await b.text(),isHtml:!0},pagePath:m.replace(/^\//,""),anchor:i}}catch{}}}catch(h){console.warn("[router] assets fallback failed",h)}throw new Error("no page data")}return{data:d,pagePath:p,anchor:i}}function vn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var rt=vn();function Ar(t){rt=t}var it={exec:()=>null};function se(t,e=""){let n=typeof t=="string"?t:t.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace($e.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,e)};return s}var rs=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),$e={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},is=/^(?:[ \t]*(?:\n|$))+/,ss=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,as=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Rt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ls=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,An=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Er=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Lr=se(Er).replace(/bull/g,An).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),os=se(Er).replace(/bull/g,An).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),En=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,cs=/^[^\n]+/,Ln=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,us=se(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Ln).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),hs=se(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,An).getRegex(),Xt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Tn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ds=se("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Tn).replace("tag",Xt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Tr=se(En).replace("hr",Rt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Xt).getRegex(),fs=se(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Tr).getRegex(),Rn={blockquote:fs,code:ss,def:us,fences:as,heading:ls,hr:Rt,html:ds,lheading:Lr,list:hs,newline:is,paragraph:Tr,table:it,text:cs},Rr=se("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Rt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Xt).getRegex(),ps={...Rn,lheading:os,table:Rr,paragraph:se(En).replace("hr",Rt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Rr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Xt).getRegex()},gs={...Rn,html:se(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Tn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:it,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:se(En).replace("hr",Rt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Lr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ms=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ws=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Cr=/^( {2,}|\\)\n(?!\s*$)/,bs=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Kt=/[\p{P}\p{S}]/u,Cn=/[\s\p{P}\p{S}]/u,Mr=/[^\s\p{P}\p{S}]/u,ys=se(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Cn).getRegex(),_r=/(?!~)[\p{P}\p{S}]/u,ks=/(?!~)[\s\p{P}\p{S}]/u,xs=/(?:[^\s\p{P}\p{S}]|~)/u,$r=/(?![*_])[\p{P}\p{S}]/u,Ss=/(?![*_])[\s\p{P}\p{S}]/u,vs=/(?:[^\s\p{P}\p{S}]|[*_])/u,As=se(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",rs?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Pr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Es=se(Pr,"u").replace(/punct/g,Kt).getRegex(),Ls=se(Pr,"u").replace(/punct/g,_r).getRegex(),Ir="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ts=se(Ir,"gu").replace(/notPunctSpace/g,Mr).replace(/punctSpace/g,Cn).replace(/punct/g,Kt).getRegex(),Rs=se(Ir,"gu").replace(/notPunctSpace/g,xs).replace(/punctSpace/g,ks).replace(/punct/g,_r).getRegex(),Cs=se("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Mr).replace(/punctSpace/g,Cn).replace(/punct/g,Kt).getRegex(),Ms=se(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,$r).getRegex(),_s="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",$s=se(_s,"gu").replace(/notPunctSpace/g,vs).replace(/punctSpace/g,Ss).replace(/punct/g,$r).getRegex(),Ps=se(/\\(punct)/,"gu").replace(/punct/g,Kt).getRegex(),Is=se(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),zs=se(Tn).replace("(?:-->|$)","-->").getRegex(),Bs=se("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",zs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Yt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Ns=se(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Yt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),zr=se(/^!?\[(label)\]\[(ref)\]/).replace("label",Yt).replace("ref",Ln).getRegex(),Br=se(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ln).getRegex(),Os=se("reflink|nolink(?!\\()","g").replace("reflink",zr).replace("nolink",Br).getRegex(),Nr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Mn={_backpedal:it,anyPunctuation:Ps,autolink:Is,blockSkip:As,br:Cr,code:ws,del:it,delLDelim:it,delRDelim:it,emStrongLDelim:Es,emStrongRDelimAst:Ts,emStrongRDelimUnd:Cs,escape:ms,link:Ns,nolink:Br,punctuation:ys,reflink:zr,reflinkSearch:Os,tag:Bs,text:bs,url:it},qs={...Mn,link:se(/^!?\[(label)\]\((.*?)\)/).replace("label",Yt).getRegex(),reflink:se(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Yt).getRegex()},_n={...Mn,emStrongRDelimAst:Rs,emStrongLDelim:Ls,delLDelim:Ms,delRDelim:$s,url:se(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Nr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:se(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Nr).getRegex()},Ds={..._n,br:se(Cr).replace("{2,}","*").getRegex(),text:se(_n.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Vt={normal:Rn,gfm:ps,pedantic:gs},Ct={normal:Mn,gfm:_n,breaks:Ds,pedantic:qs},Hs={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Or=t=>Hs[t];function Ue(t,e){if(e){if($e.escapeTest.test(t))return t.replace($e.escapeReplace,Or)}else if($e.escapeTestNoEncode.test(t))return t.replace($e.escapeReplaceNoEncode,Or);return t}function qr(t){try{t=encodeURI(t).replace($e.percentDecode,"%")}catch{return null}return t}function Dr(t,e){let n=t.replace($e.findPipe,(i,a,c)=>{let l=!1,u=a;for(;--u>=0&&c[u]==="\\";)l=!l;return l?"|":" |"}),s=n.split($e.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace($e.slashPipe,"|");return s}function Mt(t,e,n){let s=t.length;if(s===0)return"";let r=0;for(;r<s&&t.charAt(s-r-1)===e;)r++;return t.slice(0,s-r)}function Us(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])n++;else if(t[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function js(t,e=0){let n=e,s="";for(let r of t)if(r==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=r,n++;return s}function Hr(t,e,n,s,r){let i=e.href,a=e.title||null,c=t[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:c,tokens:s.inlineTokens(c)};return s.state.inLink=!1,l}function Fs(t,e,n){let s=t.match(n.other.indentCodeCompensation);if(s===null)return e;let r=s[1];return e.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[c]=a;return c.length>=r.length?i.slice(r.length):i}).join(`
`)}var Jt=class{options;rules;lexer;constructor(t){this.options=t||rt}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Mt(n,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],s=Fs(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let s=Mt(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Mt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=Mt(e[0],`
`).split(`
`),s="",r="",i=[];for(;n.length>0;){let a=!1,c=[],l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))c.push(n[l]),a=!0;else if(!a)c.push(n[l]);else break;n=n.slice(l);let u=c.join(`
`),o=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,r=r?`${r}
${o}`:o;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(o,i,!0),this.lexer.state.top=d,n.length===0)break;let p=i.at(-1);if(p?.type==="code")break;if(p?.type==="blockquote"){let f=p,h=f.raw+`
`+n.join(`
`),g=this.blockquote(h);i[i.length-1]=g,s=s.substring(0,s.length-f.raw.length)+g.raw,r=r.substring(0,r.length-f.text.length)+g.text;break}else if(p?.type==="list"){let f=p,h=f.raw+`
`+n.join(`
`),g=this.list(h);i[i.length-1]=g,s=s.substring(0,s.length-p.raw.length)+g.raw,r=r.substring(0,r.length-f.raw.length)+g.raw,n=h.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;t;){let l=!1,u="",o="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;u=e[0],t=t.substring(u.length);let d=js(e[2].split(`
`,1)[0],e[1].length),p=t.split(`
`,1)[0],f=!d.trim(),h=0;if(this.options.pedantic?(h=2,o=d.trimStart()):f?h=e[1].length+1:(h=d.search(this.rules.other.nonSpaceChar),h=h>4?1:h,o=d.slice(h),h+=e[1].length),f&&this.rules.other.blankLine.test(p)&&(u+=p+`
`,t=t.substring(p.length+1),l=!0),!l){let g=this.rules.other.nextBulletRegex(h),m=this.rules.other.hrRegex(h),b=this.rules.other.fencesBeginRegex(h),y=this.rules.other.headingBeginRegex(h),A=this.rules.other.htmlBeginRegex(h),C=this.rules.other.blockquoteBeginRegex(h);for(;t;){let I=t.split(`
`,1)[0],j;if(p=I,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),j=p):j=p.replace(this.rules.other.tabCharGlobal,"    "),b.test(p)||y.test(p)||A.test(p)||C.test(p)||g.test(p)||m.test(p))break;if(j.search(this.rules.other.nonSpaceChar)>=h||!p.trim())o+=`
`+j.slice(h);else{if(f||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||b.test(d)||y.test(d)||m.test(d))break;o+=`
`+p}f=!p.trim(),u+=I+`
`,t=t.substring(I.length+1),d=j.slice(h)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(a=!0)),r.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(o),loose:!1,text:o,tokens:[]}),r.raw+=u}let c=r.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l of r.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let o=this.lexer.inlineQueue.length-1;o>=0;o--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[o].src)){this.lexer.inlineQueue[o].src=this.lexer.inlineQueue[o].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(l.raw);if(u){let o={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};l.checked=o.checked,r.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=o.raw+l.tokens[0].raw,l.tokens[0].text=o.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(o)):l.tokens.unshift({type:"paragraph",raw:o.raw,text:o.raw,tokens:[o]}):l.tokens.unshift(o)}}if(!r.loose){let u=l.tokens.filter(d=>d.type==="space"),o=u.length>0&&u.some(d=>this.rules.other.anyLine.test(d.raw));r.loose=o}}if(r.loose)for(let l of r.items){l.loose=!0;for(let u of l.tokens)u.type==="text"&&(u.type="paragraph")}return r}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:r}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=Dr(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(Dr(a,i.header.length).map((c,l)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:i.align[l]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=Mt(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=Us(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Hr(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return Hr(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,c=r,l=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,e=e.slice(-1*t.length+r);(s=u.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){c+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){l+=a;continue}if(c-=a,c>0)continue;a=Math.min(a,a+c+l);let o=[...s[0]][0].length,d=t.slice(0,r+s.index+o+a);if(Math.min(r,a)%2){let f=d.slice(1,-1);return{type:"em",raw:d,text:f,tokens:this.lexer.inlineTokens(f)}}let p=d.slice(2,-2);return{type:"strong",raw:d,text:p,tokens:this.lexer.inlineTokens(p)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,c=r,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+r);(s=l.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){c+=a;continue}if(c-=a,c>0)continue;a=Math.min(a,a+c);let u=[...s[0]][0].length,o=t.slice(0,r+s.index+u+a),d=o.slice(r,-r);return{type:"del",raw:o,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},Oe=class Yn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||rt,this.options.tokenizer=this.options.tokenizer||new Jt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:$e,block:Vt.normal,inline:Ct.normal};this.options.pedantic?(n.block=Vt.pedantic,n.inline=Ct.pedantic):this.options.gfm&&(n.block=Vt.gfm,this.options.breaks?n.inline=Ct.breaks:n.inline=Ct.gfm),this.tokenizer.rules=n}static get rules(){return{block:Vt,inline:Ct}}static lex(e,n){return new Yn(n).lex(e)}static lexInline(e,n){return new Yn(n).inlineTokens(e)}lex(e){e=e.replace($e.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace($e.tabCharGlobal,"    ").replace($e.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),n.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0,c=e.slice(1),l;this.options.extensions.startBlock.forEach(u=>{l=u.call({lexer:this},c),typeof l=="number"&&l>=0&&(a=Math.min(a,l))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,r=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)l.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=r[2]?r[2].length:0,s=s.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,c="";for(;e;){a||(c=""),a=!1;let l;if(this.options.extensions?.inline?.some(o=>(l=o.call({lexer:this},e,n))?(e=e.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let o=n.at(-1);l.type==="text"&&o?.type==="text"?(o.raw+=l.raw,o.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(e,s,c)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(e,s,c)){e=e.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),n.push(l);continue}let u=e;if(this.options.extensions?.startInline){let o=1/0,d=e.slice(1),p;this.options.extensions.startInline.forEach(f=>{p=f.call({lexer:this},d),typeof p=="number"&&p>=0&&(o=Math.min(o,p))}),o<1/0&&o>=0&&(u=e.substring(0,o+1))}if(l=this.tokenizer.inlineText(u)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(c=l.raw.slice(-1)),a=!0;let o=n.at(-1);o?.type==="text"?(o.raw+=l.raw,o.text+=l.text):n.push(l);continue}if(e){let o="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return n}},en=class{options;parser;constructor(t){this.options=t||rt}space(t){return""}code({text:t,lang:e,escaped:n}){let s=(e||"").match($e.notSpaceStart)?.[0],r=t.replace($e.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Ue(s)+'">'+(n?r:Ue(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:Ue(r,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,s="";for(let a=0;a<t.items.length;a++){let c=t.items[a];s+=this.listitem(c)}let r=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Ue(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let s=this.parser.parseInline(n),r=qr(t);if(r===null)return s;t=r;let i='<a href="'+t+'"';return e&&(i+=' title="'+Ue(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=qr(t);if(r===null)return Ue(n);t=r;let i=`<img src="${t}" alt="${Ue(n)}"`;return e&&(i+=` title="${Ue(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Ue(t.text)}},$n=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},qe=class Vn{options;renderer;textRenderer;constructor(e){this.options=e||rt,this.options.renderer=this.options.renderer||new en,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new $n}static parse(e,n){return new Vn(n).parse(e)}static parseInline(e,n){return new Vn(n).parseInline(e)}parse(e){let n="";for(let s=0;s<e.length;s++){let r=e[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=c||"";continue}}let i=r;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,n=this.renderer){let s="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let c=this.options.extensions.renderers[i.type].call({parser:this},i);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=c||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let c='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}},_t=class{options;block;constructor(t){this.options=t||rt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Oe.lex:Oe.lexInline}provideParser(){return this.block?qe.parse:qe.parseInline}},Ws=class{defaults=vn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=qe;Renderer=en;TextRenderer=$n;Lexer=Oe;Tokenizer=Jt;Hooks=_t;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{let r=s;n=n.concat(this.walkTokens(r.items,e));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...a){let c=r.renderer.apply(this,a);return c===!1&&(c=i.apply(this,a)),c}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),n.renderer){let r=this.defaults.renderer||new en(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,c=n.renderer[a],l=r[a];r[a]=(...u)=>{let o=c.apply(r,u);return o===!1&&(o=l.apply(r,u)),o||""}}s.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Jt(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,c=n.tokenizer[a],l=r[a];r[a]=(...u)=>{let o=c.apply(r,u);return o===!1&&(o=l.apply(r,u)),o}}s.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new _t;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,c=n.hooks[a],l=r[a];_t.passThroughHooks.has(i)?r[a]=u=>{if(this.defaults.async&&_t.passThroughHooksRespectAsync.has(i))return(async()=>{let d=await c.call(r,u);return l.call(r,d)})();let o=c.call(r,u);return l.call(r,o)}:r[a]=(...u)=>{if(this.defaults.async)return(async()=>{let d=await c.apply(r,u);return d===!1&&(d=await l.apply(r,u)),d})();let o=c.apply(r,u);return o===!1&&(o=l.apply(r,u)),o}}s.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let c=[];return c.push(i.call(this,a)),r&&(c=c.concat(r.call(this,a))),c}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Oe.lex(t,e??this.defaults)}parser(t,e){return qe.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let s={...n},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=t),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(e):e,c=await(r.hooks?await r.hooks.provideLexer():t?Oe.lex:Oe.lexInline)(a,r),l=r.hooks?await r.hooks.processAllTokens(c):c;r.walkTokens&&await Promise.all(this.walkTokens(l,r.walkTokens));let u=await(r.hooks?await r.hooks.provideParser():t?qe.parse:qe.parseInline)(l,r);return r.hooks?await r.hooks.postprocess(u):u})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let a=(r.hooks?r.hooks.provideLexer():t?Oe.lex:Oe.lexInline)(e,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let c=(r.hooks?r.hooks.provideParser():t?qe.parse:qe.parseInline)(a,r);return r.hooks&&(c=r.hooks.postprocess(c)),c}catch(a){return i(a)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+Ue(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},st=new Ws;function ae(t,e){return st.parse(t,e)}ae.options=ae.setOptions=function(t){return st.setOptions(t),ae.defaults=st.defaults,Ar(ae.defaults),ae},ae.getDefaults=vn,ae.defaults=rt,ae.use=function(...t){return st.use(...t),ae.defaults=st.defaults,Ar(ae.defaults),ae},ae.walkTokens=function(t,e){return st.walkTokens(t,e)},ae.parseInline=st.parseInline,ae.Parser=qe,ae.parser=qe.parse,ae.Renderer=en,ae.TextRenderer=$n,ae.Lexer=Oe,ae.lexer=Oe.lex,ae.Tokenizer=Jt,ae.Hooks=_t,ae.parse=ae,ae.options,ae.setOptions,ae.use,ae.walkTokens,ae.parseInline,qe.parse,Oe.lex;const Ur=`function j() {
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
`,jr=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Ur],{type:"text/javascript;charset=utf-8"});function Zs(t){let e;try{if(e=jr&&(self.URL||self.webkitURL).createObjectURL(jr),!e)throw"";const n=new Worker(e,{type:"module",name:t?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Ur),{type:"module",name:t?.name})}}function Gs(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const n=t.slice(3,e+0).trim(),s=t.slice(e+4).trimStart(),r={};return n.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:s,data:r}}}return{content:t,data:{}}}const Fr=ar(()=>new Zs,"markdown"),Wr=typeof DOMParser<"u"?new DOMParser:null;function Pn(){return Fr.get()}function Qs(t){return Fr.send(t,1e3)}const Ve=[];function In(t){if(t&&typeof t=="object"){Ve.push(t);try{ae.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function Xs(t){Ve.length=0,Array.isArray(t)&&Ve.push(...t.filter(e=>e&&typeof e=="object"));try{Ve.forEach(e=>ae.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function tn(t){if(Pn&&Pn())try{const i=await Qs({type:"render",md:t});if(i&&i.html!==void 0)try{const c=(Wr||new DOMParser).parseFromString(i.html,"text/html"),l=c.querySelectorAll("h1,h2,h3,h4,h5,h6"),u=new Set,o=f=>{f||(f="heading");let h=f,g=2;for(;u.has(h);)h=`${f}-${g}`,g+=1;return u.add(h),h};l.forEach(f=>{if(f.id)f.id=o(f.id);else{const h=le(f.textContent||"");f.id=o(h)}try{const h=Number(f.tagName.substring(1));if(h>=1&&h<=6){const g={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},m=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal";`${g[h]} ${m}`.split(/\s+/).filter(Boolean).forEach(y=>{try{f.classList.add(y)}catch{}})}}catch{}});try{try{const h=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(h){const g=Array.from(c.querySelectorAll("img"));for(const m of g)try{const b=m.getAttribute("src")||"";if(new URL(b,location.href).toString()===h){const A=m.parentElement;m.remove(),A&&A.tagName&&A.tagName.toLowerCase()==="p"&&A.childNodes.length===0&&A.remove();break}}catch{}}}catch{}c.querySelectorAll("img").forEach(h=>{try{h.getAttribute("loading")||h.setAttribute("data-want-lazy","1")}catch(g){console.warn("[markdown] set image loading attribute failed",g)}})}catch(f){console.warn("[markdown] query images failed",f)}try{c.querySelectorAll("pre code").forEach(h=>{try{const g=h.getAttribute&&h.getAttribute("class")||h.className||"",m=String(g||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{h.setAttribute&&h.setAttribute("class",m)}catch(A){console.warn("[markdown] set code class failed",A),h.className=m}else try{h.removeAttribute&&h.removeAttribute("class")}catch(A){console.warn("[markdown] remove code class failed",A),h.className=""}const b=m,y=b.match(/language-([a-zA-Z0-9_+-]+)/)||b.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!y||!y[1])try{const A=h.textContent||"";try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const C=fe.highlight(A,{language:"plaintext"});C&&C.value&&(h.innerHTML=C.value)}}catch{try{fe.highlightElement(h)}catch(I){console.warn("[markdown] hljs.highlightElement failed",I)}}}catch(A){console.warn("[markdown] code auto-detect failed",A)}}catch(g){console.warn("[markdown] processing code blocks failed",g)}})}catch(f){console.warn("[markdown] query code blocks failed",f)}const d=c.body.innerHTML,p=[];return l.forEach(f=>{p.push({level:Number(f.tagName.substring(1)),text:(f.textContent||"").trim(),id:f.id})}),{html:d,meta:i.meta||{},toc:p}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:n,data:s}=Gs(t||"");if(ae.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Ve&&Ve.length)try{Ve.forEach(i=>ae.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let r=ae.parse(n);try{const a=(Wr||new DOMParser).parseFromString(r,"text/html"),c=a.querySelectorAll("h1,h2,h3,h4,h5,h6");c.forEach(u=>{u.id||(u.id=le(u.textContent||""));try{const o=Number(u.tagName.substring(1));if(o>=1&&o<=6){const d={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},p=o<=2?"has-text-weight-bold":o<=4?"has-text-weight-semibold":"has-text-weight-normal";`${d[o]} ${p}`.split(/\s+/).filter(Boolean).forEach(h=>{try{u.classList.add(h)}catch{}})}}catch{}});try{try{const o=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(o){const d=Array.from(a.querySelectorAll("img"));for(const p of d)try{const f=p.getAttribute("src")||"";if(new URL(f,location.href).toString()===o){const g=p.parentElement;p.remove(),g&&g.tagName&&g.tagName.toLowerCase()==="p"&&g.childNodes.length===0&&g.remove();break}}catch{}}}catch{}a.querySelectorAll("img").forEach(o=>{try{o.getAttribute("loading")||o.setAttribute("data-want-lazy","1")}catch(d){console.warn("[markdown] set image loading attribute failed",d)}})}catch(u){console.warn("[markdown] query images failed",u)}try{a.querySelectorAll("pre code").forEach(o=>{try{const d=o.getAttribute&&o.getAttribute("class")||o.className||"",p=String(d||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(p)try{o.setAttribute&&o.setAttribute("class",p)}catch(g){console.warn("[markdown] set code class failed",g),o.className=p}else try{o.removeAttribute&&o.removeAttribute("class")}catch(g){console.warn("[markdown] remove code class failed",g),o.className=""}const f=p,h=f.match(/language-([a-zA-Z0-9_+-]+)/)||f.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!h||!h[1])try{const g=o.textContent||"";try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const m=fe.highlight(g,{language:"plaintext"});m&&m.value&&(o.innerHTML=m.value)}}catch{try{fe.highlightElement(o)}catch(b){console.warn("[markdown] hljs.highlightElement failed",b)}}}catch(g){console.warn("[markdown] code auto-detect failed",g)}}catch(d){console.warn("[markdown] processing code blocks failed",d)}})}catch(u){console.warn("[markdown] query code blocks failed",u)}r=a.body.innerHTML;const l=[];return c.forEach(u=>{l.push({level:Number(u.tagName.substring(1)),text:(u.textContent||"").trim(),id:u.id})}),{html:a.body.innerHTML,meta:s||{},toc:l}}catch(i){console.warn("post-process markdown failed",i)}return{html:r,meta:s||{},toc:[]}}function zn(t,e){const n=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(t);)if(a[1]){const c=a[1].toLowerCase();if(dn.has(c)||e&&e.size&&c.length<3&&!e.has(c)&&!(Pe&&Pe[c]&&e.has(Pe[c])))continue;if(e&&e.size){if(e.has(c)){const u=e.get(c);u&&n.add(u);continue}if(Pe&&Pe[c]){const u=Pe[c];if(e.has(u)){const o=e.get(u)||u;n.add(o);continue}}}(i.has(c)||c.length>=5&&c.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(c)&&!r.has(c))&&n.add(c)}return n}const Ks=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:In,detectFenceLanguages:zn,initRendererWorker:Pn,markdownPlugins:Ve,parseMarkdownToHtml:tn,setMarkdownExtensions:Xs},Symbol.toStringTag,{value:"Module"}));function Ys(t,e){try{return new URL(t,e).pathname}catch{try{return new URL(t,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(e||"").replace(/\/$/,"")+"/"+String(t||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(t||"")}}}}function Vs(t,e){const n=document.createElement("aside");n.className="menu box nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=t("navigation"),n.appendChild(s);const r=document.createElement("ul");return r.className="menu-list",e.forEach(i=>{const a=document.createElement("li"),c=document.createElement("a");if(c.href="#"+i.path,c.textContent=i.name,a.appendChild(c),i.children&&i.children.length){const l=document.createElement("ul");i.children.forEach(u=>{const o=document.createElement("li"),d=document.createElement("a");d.href="#"+u.path,d.textContent=u.name,o.appendChild(d),l.appendChild(o)}),a.appendChild(l)}r.appendChild(a)}),n.appendChild(r),n}function Js(t,e,n=""){const s=document.createElement("aside");s.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=t("onThisPage"),s.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const c={};(e||[]).forEach(l=>{try{if(!l||l.level===1)return;const u=Number(l.level)>=2?Number(l.level):2,o=document.createElement("li"),d=document.createElement("a"),p=l.id||le(l.text||"");d.textContent=l.text||"";try{const m=String(n||"").replace(/^[\\.\\/]+/,""),b=m&&F&&F.has&&F.has(m)?F.get(m):m;b?d.href=me(b,p):d.href=`#${encodeURIComponent(p)}`}catch(m){console.warn("[htmlBuilder] buildTocElement href normalization failed",m),d.href=`#${encodeURIComponent(p)}`}if(o.appendChild(d),u===2){i.appendChild(o),c[2]=o,Object.keys(c).forEach(m=>{Number(m)>2&&delete c[m]});return}let f=u-1;for(;f>2&&!c[f];)f--;f<2&&(f=2);let h=c[f];if(!h){i.appendChild(o),c[u]=o;return}let g=h.querySelector("ul");g||(g=document.createElement("ul"),h.appendChild(g)),g.appendChild(o),c[u]=o}catch(u){console.warn("[htmlBuilder] buildTocElement item failed",u,l)}})}catch(c){console.warn("[htmlBuilder] buildTocElement failed",c)}return s.appendChild(i),i.querySelectorAll("li").length<=1?null:s}function Zr(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=le(n.textContent||""))})}function ea(t,e,n){try{const s=t.querySelectorAll("img");if(s&&s.length){const r=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const c=new URL(r+a,n).toString();i.src=c;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] set image loading attribute failed",l)}}catch(c){console.warn("[htmlBuilder] resolve image src failed",c)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function Gr(t,e,n){try{const s=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";let r=null;try{const a=new URL(n,location.href);r=new URL(s||".",a).toString()}catch{try{r=new URL(s||".",location.href).toString()}catch{r=s||"./"}}const i=t.querySelectorAll("*");for(const a of Array.from(i||[]))try{const c=a.tagName?a.tagName.toLowerCase():"",l=u=>{try{const o=a.getAttribute(u)||"";if(!o||/^(https?:)?\/\//i.test(o)||o.startsWith("/")||o.startsWith("#"))return;try{a.setAttribute(u,new URL(o,r).toString())}catch(d){console.warn("[htmlBuilder] rewrite asset attribute failed",u,o,d)}}catch(o){console.warn("[htmlBuilder] rewriteAttr failed",o)}};if(a.hasAttribute&&a.hasAttribute("src")&&l("src"),a.hasAttribute&&a.hasAttribute("href")&&c!=="a"&&l("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&l("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&l("poster"),a.hasAttribute("srcset")){const d=(a.getAttribute("srcset")||"").split(",").map(p=>p.trim()).filter(Boolean).map(p=>{const[f,h]=p.split(/\s+/,2);if(!f||/^(https?:)?\/\//i.test(f)||f.startsWith("/"))return p;try{const g=new URL(f,r).toString();return h?`${g} ${h}`:g}catch{return p}}).join(", ");a.setAttribute("srcset",d)}}catch(c){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",c)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let Qr="",Bn=null,Xr="";async function Kr(t,e,n){try{const s=t.querySelectorAll("a");if(!s||!s.length)return;let r,i;if(e===Qr&&Bn)r=Bn,i=Xr;else{try{r=new URL(e,location.href),i=kt(r.pathname)}catch{try{r=new URL(e,location.href),i=kt(r.pathname)}catch{r=null,i="/"}}Qr=e,Bn=r,Xr=i}const a=new Set,c=[],l=new Set,u=[];for(const o of Array.from(s))try{const d=o.getAttribute("href")||"";if(!d||ur(d))continue;try{if(d.startsWith("?")||d.indexOf("?")!==-1)try{const f=new URL(d,e||location.href),h=f.searchParams.get("page");if(h&&h.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const m=we(g+h);o.setAttribute("href",me(m,f.hash?f.hash.replace(/^#/,""):null));continue}}}catch{}}catch{}if(d.startsWith("/")&&!d.endsWith(".md"))continue;const p=d.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(p){let f=p[1];const h=p[2];!f.startsWith("/")&&n&&(f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+f);try{const g=new URL(f,e).pathname;let m=g.startsWith(i)?g.slice(i.length):g;m=we(m),c.push({node:o,mdPathRaw:f,frag:h,rel:m}),F.has(m)||a.add(m)}catch(g){console.warn("[htmlBuilder] resolve mdPath failed",g)}continue}try{let f=d;!d.startsWith("/")&&n&&(d.startsWith("#")?f=n+d:f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+d);const g=new URL(f,e).pathname||"";if(g&&g.indexOf(i)!==-1){let m=g.startsWith(i)?g.slice(i.length):g;if(m=we(m),m=yt(m),m||(m="_home"),!m.endsWith(".md")){let b=null;try{if(F&&F.has&&F.has(m))b=F.get(m);else try{const y=String(m||"").replace(/^.*\//,"");y&&F.has&&F.has(y)&&(b=F.get(y))}catch(y){console.warn("[htmlBuilder] mdToSlug baseName check failed",y)}}catch(y){console.warn("[htmlBuilder] mdToSlug access check failed",y)}if(!b)try{const y=String(m||"").replace(/^.*\//,"");for(const[A,C]of J||[])if(C===m||C===y){b=A;break}}catch{}b?o.setAttribute("href",me(b)):(l.add(m),u.push({node:o,rel:m}))}}}catch(f){console.warn("[htmlBuilder] resolving href to URL failed",f)}}catch(d){console.warn("[htmlBuilder] processing anchor failed",d)}a.size&&await Promise.all(Array.from(a).map(async o=>{try{try{const p=String(o).match(/([^\/]+)\.md$/),f=p&&p[1];if(f&&J.has(f)){try{const h=J.get(f);if(h)try{F.set(h,f)}catch(g){console.warn("[htmlBuilder] mdToSlug.set failed",g)}}catch(h){console.warn("[htmlBuilder] reading slugToMd failed",h)}return}}catch(p){console.warn("[htmlBuilder] basename slug lookup failed",p)}const d=await Ae(o,e);if(d&&d.raw){const p=(d.raw||"").match(/^#\s+(.+)$/m);if(p&&p[1]){const f=le(p[1].trim());if(f)try{J.set(f,o),F.set(o,f)}catch(h){console.warn("[htmlBuilder] setting slug mapping failed",h)}}}}catch(d){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",d)}})),l.size&&await Promise.all(Array.from(l).map(async o=>{try{const d=await Ae(o,e);if(d&&d.raw)try{const f=(Nn||new DOMParser).parseFromString(d.raw,"text/html"),h=f.querySelector("title"),g=f.querySelector("h1"),m=h&&h.textContent&&h.textContent.trim()?h.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(m){const b=le(m);if(b)try{J.set(b,o),F.set(o,b)}catch(y){console.warn("[htmlBuilder] setting html slug mapping failed",y)}}}catch(p){console.warn("[htmlBuilder] parse fetched HTML failed",p)}}catch(d){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",d)}}));for(const o of c){const{node:d,frag:p,rel:f}=o;let h=null;try{F.has(f)&&(h=F.get(f))}catch(g){console.warn("[htmlBuilder] mdToSlug access failed",g)}h?d.setAttribute("href",me(h,p)):d.setAttribute("href",me(f,p))}for(const o of u){const{node:d,rel:p}=o;let f=null;try{F.has(p)&&(f=F.get(p))}catch(h){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",h)}if(!f)try{const h=String(p||"").replace(/^.*\//,"");F.has(h)&&(f=F.get(h))}catch(h){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",h)}f?d.setAttribute("href",me(f)):d.setAttribute("href",me(p))}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function ta(t,e,n,s){const r=e.querySelector("h1"),i=r?(r.textContent||"").trim():"";let a="";try{let c="";try{t&&t.meta&&t.meta.title&&(c=String(t.meta.title).trim())}catch{}if(!c&&i&&(c=i),!c)try{const l=e.querySelector("h2");l&&l.textContent&&(c=String(l.textContent).trim())}catch{}!c&&n&&(c=String(n)),c&&(a=le(c)),a||(a="_home");try{n&&(J.set(a,n),F.set(n,a))}catch(l){console.warn("[htmlBuilder] computeSlug set slug mapping failed",l)}try{const l=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");try{history.replaceState({page:a},"",me(a,l))}catch(u){console.warn("[htmlBuilder] computeSlug history replace failed",u)}}catch(l){console.warn("[htmlBuilder] computeSlug inner failed",l)}}catch(c){console.warn("[htmlBuilder] computeSlug failed",c)}return{topH1:r,h1Text:i,slugKey:a}}async function na(t,e){if(!t||!t.length)return;const n=new Set;for(const l of Array.from(t||[]))try{const u=l.getAttribute("href")||"";if(!u)continue;let p=we(u).split(/::|#/,2)[0];try{const h=p.indexOf("?");h!==-1&&(p=p.slice(0,h))}catch{}if(!p||(p.includes(".")||(p=p+".html"),!/\.html(?:$|[?#])/.test(p)&&!p.toLowerCase().endsWith(".html")))continue;const f=p;try{if(F&&F.has&&F.has(f))continue}catch(h){console.warn("[htmlBuilder] mdToSlug check failed",h)}try{let h=!1;for(const g of J.values())if(g===f){h=!0;break}if(h)continue}catch(h){console.warn("[htmlBuilder] slugToMd iteration failed",h)}n.add(f)}catch(u){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",u)}if(!n.size)return;const s=async l=>{try{const u=await Ae(l,e);if(u&&u.raw)try{const d=(Nn||new DOMParser).parseFromString(u.raw,"text/html"),p=d.querySelector("title"),f=d.querySelector("h1"),h=p&&p.textContent&&p.textContent.trim()?p.textContent.trim():f&&f.textContent?f.textContent.trim():null;if(h){const g=le(h);if(g)try{J.set(g,l),F.set(l,g)}catch(m){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",m)}}}catch(o){console.warn("[htmlBuilder] parse HTML title failed",o)}}catch(u){console.warn("[htmlBuilder] fetchAndExtract failed",u)}},r=5,i=Array.from(n);let a=0;const c=[];for(;a<i.length;){const l=i.slice(a,a+r);c.push(Promise.all(l.map(s))),a+=r}await Promise.all(c)}async function ra(t,e){if(!t||!t.length)return;const n=[],s=new Set;let r="";try{const i=new URL(e,typeof location<"u"?location.href:"http://localhost/");r=kt(i.pathname)}catch(i){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(t||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const c=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(c){let l=we(c[1]);try{let u;try{u=Ys(l,e)}catch(d){u=l,console.warn("[htmlBuilder] resolve mdPath URL failed",d)}const o=u&&r&&u.startsWith(r)?u.slice(r.length):String(u||"").replace(/^\//,"");n.push({rel:o}),F.has(o)||s.add(o)}catch(u){console.warn("[htmlBuilder] rewriteAnchors failed",u)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),c=a&&a[1];if(c&&J.has(c)){try{const l=J.get(c);l&&F.set(l,c)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",l)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await Ae(i,e);if(a&&a.raw){const c=(a.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]){const l=le(c[1].trim());if(l)try{J.set(l,i),F.set(i,l)}catch(u){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",u)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const Nn=typeof DOMParser<"u"?new DOMParser:null;function On(t){try{const n=(Nn||new DOMParser).parseFromString(t||"","text/html");Zr(n);try{n.querySelectorAll("img").forEach(l=>{try{l.getAttribute("loading")||l.setAttribute("data-want-lazy","1")}catch(u){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",u)}})}catch(c){console.warn("[htmlBuilder] parseHtml query images failed",c)}n.querySelectorAll("pre code, code[class]").forEach(c=>{try{const l=c.getAttribute&&c.getAttribute("class")||c.className||"",u=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const o=(u[1]||"").toLowerCase(),d=te.size&&(te.get(o)||te.get(String(o).toLowerCase()))||o;try{(async()=>{try{await ot(d)}catch(p){console.warn("[htmlBuilder] registerLanguage failed",p)}})()}catch(p){console.warn("[htmlBuilder] schedule registerLanguage failed",p)}}else try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const o=fe.highlight?fe.highlight(c.textContent||"",{language:"plaintext"}):null;o&&o.value&&(c.innerHTML=o.value)}}catch(o){console.warn("[htmlBuilder] plaintext highlight fallback failed",o)}}catch(l){console.warn("[htmlBuilder] code element processing failed",l)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(c=>{r.push({level:Number(c.tagName.substring(1)),text:(c.textContent||"").trim(),id:c.id})});const a={};try{const c=n.querySelector("title");c&&c.textContent&&String(c.textContent).trim()&&(a.title=String(c.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:a,toc:r}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function ia(t){const e=zn?zn(t||"",te):new Set,n=new Set(e),s=[];for(const r of n)try{const i=te.size&&(te.get(r)||te.get(String(r).toLowerCase()))||r;try{s.push(ot(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(i))try{s.push(ot(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function sa(t){if(await ia(t),tn){const e=await tn(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function aa(t,e,n,s,r){let i=null;if(e.isHtml)try{const d=typeof DOMParser<"u"?new DOMParser:null;if(d){const p=d.parseFromString(e.raw||"","text/html");try{Gr(p.body,n,r)}catch(f){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",f)}i=On(p.documentElement&&p.documentElement.outerHTML?p.documentElement.outerHTML:e.raw||"")}else i=On(e.raw||"")}catch{i=On(e.raw||"")}else i=await sa(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{Gr(a,n,r)}catch(d){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",d)}try{Zr(a)}catch(d){console.warn("[htmlBuilder] addHeadingIds failed",d)}try{a.querySelectorAll("pre code, code[class]").forEach(p=>{try{const f=p.getAttribute&&p.getAttribute("class")||p.className||"",h=String(f||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(h)try{p.setAttribute&&p.setAttribute("class",h)}catch(g){p.className=h,console.warn("[htmlBuilder] set element class failed",g)}else try{p.removeAttribute&&p.removeAttribute("class")}catch(g){p.className="",console.warn("[htmlBuilder] remove element class failed",g)}}catch(f){console.warn("[htmlBuilder] code element cleanup failed",f)}})}catch(d){console.warn("[htmlBuilder] processing code elements failed",d)}try{tr(a)}catch(d){console.warn("[htmlBuilder] observeCodeBlocks failed",d)}ea(a,n,r);try{(a.querySelectorAll&&a.querySelectorAll("img")||[]).forEach(p=>{try{const f=p.parentElement;if(!f||f.tagName.toLowerCase()!=="p"||f.childNodes.length!==1)return;const h=document.createElement("figure");h.className="image",f.replaceWith(h),h.appendChild(p)}catch{}})}catch(d){console.warn("[htmlBuilder] wrap images in Bulma image helper failed",d)}try{(a.querySelectorAll&&a.querySelectorAll("table")||[]).forEach(p=>{try{if(p.classList)p.classList.contains("table")||p.classList.add("table");else{const f=p.getAttribute&&p.getAttribute("class")?p.getAttribute("class"):"",h=String(f||"").split(/\s+/).filter(Boolean);h.indexOf("table")===-1&&h.push("table");try{p.setAttribute&&p.setAttribute("class",h.join(" "))}catch{p.className=h.join(" ")}}}catch{}})}catch(d){console.warn("[htmlBuilder] add Bulma table class failed",d)}const{topH1:c,h1Text:l,slugKey:u}=ta(i,a,n,s);try{await oa(a,r,n)}catch(d){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",d),await Kr(a,r,n)}const o=Js(t,i.toc,n);return{article:a,parsed:i,toc:o,topH1:c,h1Text:l,slugKey:u}}function la(t){if(!(!t||!t.querySelectorAll))try{const e=Array.from(t.querySelectorAll("script"));for(const n of e)try{const s=document.createElement("script");for(const i of Array.from(n.attributes||[]))try{s.setAttribute(i.name,i.value)}catch{}if(!n.src){try{s.type="module"}catch{}s.textContent=n.textContent||""}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";s.addEventListener("error",i=>{try{console.warn("[htmlBuilder] injected script error",{src:r,ev:i})}catch{}}),s.addEventListener("load",()=>{try{console.info("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}}),(document.head||document.body||document.documentElement).appendChild(s),n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed injected script",r)}catch{}}catch(s){console.warn("[htmlBuilder] execute injected script failed",s)}}catch{}}function Yr(t,e,n){t&&(t.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=e&&e("notFound")||"Page not found";const i=document.createElement("p");i.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",s.appendChild(r),s.appendChild(i),t&&t.appendChild&&t.appendChild(s)}async function oa(t,e,n){return Kr(t,e,n)}function ca(t){try{t.addEventListener("click",e=>{const n=e.target&&e.target.closest?e.target.closest("a"):null;if(!n)return;const s=n.getAttribute("href")||"";try{const r=new URL(s,location.href),i=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!i&&!a)return;e.preventDefault();let c=null;try{history&&history.state&&history.state.page&&(c=history.state.page)}catch(l){c=null,console.warn("[htmlBuilder] access history.state failed",l)}try{c||(c=new URL(location.href).searchParams.get("page"))}catch(l){console.warn("[htmlBuilder] parse current location failed",l)}if(!i&&a||i&&c&&String(i)===String(c)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:c||i},"",me(c||i,a))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}}catch(l){console.warn("[htmlBuilder] update history for anchor failed",l)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(l){console.warn("[htmlBuilder] stopPropagation failed",l)}try{qn(a)}catch(l){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:i},"",me(i,a));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(l){console.warn("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){console.warn("[htmlBuilder] dispatch popstate failed",l)}else try{renderByQuery()}catch(l){console.warn("[htmlBuilder] renderByQuery failed",l)}}catch(l){console.warn("[htmlBuilder] SPA navigation invocation failed",l)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function qn(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const n=document.getElementById(t);if(n)try{const s=()=>{try{if(e&&e.scrollTo&&e.contains(n)){const r=n.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(s,50)}}catch(s){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",n)}}function ua(t,e,{mountOverlay:n=null,container:s=null,mountEl:r=null,navWrap:i=null,t:a=null}={}){try{const c=a||(g=>typeof g=="string"?g:""),l=s||document.querySelector(".nimbi-cms"),u=r||document.querySelector(".nimbi-mount"),o=n||document.querySelector(".nimbi-overlay"),d=i||document.querySelector(".nimbi-nav-wrap");let f=document.querySelector(".nimbi-scroll-top");if(!f){f=document.createElement("button"),f.className="nimbi-scroll-top button is-primary is-rounded is-small",f.setAttribute("aria-label",c("scrollToTop")),f.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{o&&o.appendChild?o.appendChild(f):l&&l.appendChild?l.appendChild(f):u&&u.appendChild?u.appendChild(f):document.body.appendChild(f)}catch{try{document.body.appendChild(f)}catch(m){console.warn("[htmlBuilder] append scroll top button failed",m)}}try{try{ir(f)}catch{}}catch(g){console.warn("[htmlBuilder] set scroll-top button theme registration failed",g)}f.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback container scrollTop failed",m)}try{r&&(r.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",m)}try{document.documentElement.scrollTop=0}catch(m){console.warn("[htmlBuilder] fallback document scrollTop failed",m)}}})}const h=d&&d.querySelector?d.querySelector(".menu-label"):null;if(e){if(!f._nimbiObserver){const g=new IntersectionObserver(m=>{for(const b of m)b.target instanceof Element&&(b.isIntersecting?(f.classList.remove("show"),h&&h.classList.remove("show")):(f.classList.add("show"),h&&h.classList.add("show")))},{root:s instanceof Element?s:r instanceof Element?r:null,threshold:0});f._nimbiObserver=g}try{f._nimbiObserver.disconnect()}catch(g){console.warn("[htmlBuilder] observer disconnect failed",g)}try{f._nimbiObserver.observe(e)}catch(g){console.warn("[htmlBuilder] observer observe failed",g)}try{const g=()=>{try{const m=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},b=e.getBoundingClientRect();!(b.bottom<m.top||b.top>m.bottom)?(f.classList.remove("show"),h&&h.classList.remove("show")):(f.classList.add("show"),h&&h.classList.add("show"))}catch(m){console.warn("[htmlBuilder] checkIntersect failed",m)}};g(),"IntersectionObserver"in window||setTimeout(g,100)}catch(g){console.warn("[htmlBuilder] checkIntersect outer failed",g)}}else{f.classList.remove("show"),h&&h.classList.remove("show");const g=s instanceof Element?s:r instanceof Element?r:window,m=()=>{try{(g===window?window.scrollY:g.scrollTop||0)>10?(f.classList.add("show"),h&&h.classList.add("show")):(f.classList.remove("show"),h&&h.classList.remove("show"))}catch(b){console.warn("[htmlBuilder] onScroll handler failed",b)}};Ht(()=>g.addEventListener("scroll",m)),m()}}catch(c){console.warn("[htmlBuilder] ensureScrollTopButton failed",c)}}function Vr(t,e){try{if(!t)return;try{const n=t[e];if(typeof n<"u")return n}catch{}try{if(t.default)return t.default[e]}catch{}return}catch{return}}async function ha(t,e,n,s,r,i,a,c,l="eager",u=1,o=void 0,d="favicon"){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const p=typeof DOMParser<"u"?new DOMParser:null,f=p?p.parseFromString(n||"","text/html"):null,h=f?f.querySelectorAll("a"):[];await Ht(()=>na(h,s)),await Ht(()=>ra(h,s));let g=null,m=null,b=null,y=null,A=null,C=null;function I(){try{const v=document.querySelector(".navbar-burger"),L=v&&v.dataset?v.dataset.target:null,T=L?document.getElementById(L):null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),T&&T.classList.remove("is-active"))}catch(v){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",v)}}const j=()=>g||(g=(async()=>{try{const v=await Promise.resolve().then(()=>Qt),L=Vr(v,"buildSearchIndex")||(typeof globalThis<"u"?globalThis.buildSearchIndex:void 0),T=Vr(v,"buildSearchIndexWorker")||(typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0);if(l==="lazy"&&typeof T=="function")try{const $=await T(s,u,o);if($&&$.length)return $}catch($){console.warn&&console.warn("[nimbi-cms] worker builder threw",$)}return typeof L=="function"?await L(s,u,o):[]}catch(v){return console.warn("[nimbi-cms] buildSearchIndex failed",v),[]}finally{if(m){try{m.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}}})(),g.then(v=>{try{const L=String(m&&m.value||"").trim().toLowerCase();if(!L||!Array.isArray(v)||!v.length)return;const T=v.filter(k=>k.title&&k.title.toLowerCase().includes(L)||k.excerpt&&k.excerpt.toLowerCase().includes(L));if(!T||!T.length)return;const $=document.getElementById("nimbi-search-results");if(!$)return;$.innerHTML="",T.slice(0,10).forEach(k=>{const P=document.createElement("div");if(P.className="nimbi-search-result",k.parentTitle){const ne=document.createElement("div");ne.textContent=k.parentTitle,ne.className="nimbi-search-title nimbi-search-parent",P.appendChild(ne)}const q=document.createElement("a");q.className="block",q.href=me(k.slug),q.textContent=k.title,q.addEventListener("click",()=>{try{$.style.display="none"}catch{}}),P.appendChild(q),$.appendChild(P)});try{$.style.display="block"}catch{}}catch{}}).catch(()=>{}),g),Z=document.createElement("nav");Z.className="navbar",Z.setAttribute("role","navigation"),Z.setAttribute("aria-label","main navigation");const W=document.createElement("div");W.className="navbar-brand";const he=h[0],_=document.createElement("a");if(_.className="navbar-item",he){const v=he.getAttribute("href")||"#";try{const T=new URL(v,location.href).searchParams.get("page");if(T){const $=decodeURIComponent(T);_.href=me($)}else _.href=me(r),_.textContent=i("home")}catch{_.href=me(r),_.textContent=i("home")}}else _.href=me(r),_.textContent=i("home");async function O(v){try{if(!v||v==="none")return null;if(v==="favicon")try{const L=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!L)return null;const T=L.getAttribute("href")||"";return T&&/\.png(?:\?|$)/i.test(T)?new URL(T,location.href).toString():null}catch{return null}if(v==="copy-first"||v==="move-first")try{const L=await Ae(r,s);if(!L||!L.raw)return null;const k=new DOMParser().parseFromString(L.raw,"text/html").querySelector("img");if(!k)return null;const P=k.getAttribute("src")||"";if(!P)return null;const q=new URL(P,location.href).toString();if(v==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",q)}catch{}return q}catch{return null}try{return new URL(v,location.href).toString()}catch{return null}}catch{return null}}let Q=null;try{Q=await O(d)}catch{Q=null}if(Q)try{const v=document.createElement("img");v.className="nimbi-navbar-logo";const L=i&&typeof i=="function"&&(i("home")||i("siteLogo"))||"";v.alt=L,v.title=L,v.src=Q;try{v.style.marginRight="0.5em"}catch{}try{(!_.textContent||!String(_.textContent).trim())&&(_.textContent=L)}catch{}try{_.insertBefore(v,_.firstChild)}catch{try{_.appendChild(v)}catch{}}}catch{}W.appendChild(_),_.addEventListener("click",function(v){const L=_.getAttribute("href")||"";if(L.startsWith("?page=")){v.preventDefault();const T=new URL(L,location.href),$=T.searchParams.get("page"),k=T.hash?T.hash.replace(/^#/,""):null;history.pushState({page:$},"",me($,k));try{a()}catch(P){console.warn("[nimbi-cms] renderByQuery failed",P)}try{I()}catch{}}});const N=document.createElement("a");N.className="navbar-burger",N.setAttribute("role","button"),N.setAttribute("aria-label","menu"),N.setAttribute("aria-expanded","false");const oe="nimbi-navbar-menu";N.dataset.target=oe,N.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',W.appendChild(N);try{N.addEventListener("click",v=>{try{const L=N.dataset&&N.dataset.target?N.dataset.target:null,T=L?document.getElementById(L):null;N.classList.contains("is-active")?(N.classList.remove("is-active"),N.setAttribute("aria-expanded","false"),T&&T.classList.remove("is-active")):(N.classList.add("is-active"),N.setAttribute("aria-expanded","true"),T&&T.classList.add("is-active"))}catch(L){console.warn("[nimbi-cms] navbar burger toggle failed",L)}})}catch(v){console.warn("[nimbi-cms] burger event binding failed",v)}const X=document.createElement("div");X.className="navbar-menu",X.id=oe;const S=document.createElement("div");S.className="navbar-start";let V=null,re=null;if(!c)V=null,m=null,y=null,A=null,C=null;else{V=document.createElement("div"),V.className="navbar-end",re=document.createElement("div"),re.className="navbar-item",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=i("searchPlaceholder")||"",m.id="nimbi-search",l==="eager"&&(m.disabled=!0),b=document.createElement("div"),b.className="control",l==="eager"&&b.classList.add("is-loading"),b.appendChild(m),re.appendChild(b),y=document.createElement("div"),y.className="dropdown is-right",y.id="nimbi-search-dropdown";const v=document.createElement("div");v.className="dropdown-trigger",v.appendChild(re);const L=document.createElement("div");L.className="dropdown-menu",L.setAttribute("role","menu"),A=document.createElement("div"),A.id="nimbi-search-results",A.className="dropdown-content nimbi-search-results",C=A,L.appendChild(A),y.appendChild(v),y.appendChild(L),V.appendChild(y);const T=k=>{if(A){if(A.innerHTML="",!k.length){y&&y.classList.remove("is-active");try{A.style.display="none"}catch{}try{A.classList.remove("is-open")}catch{}return}k.forEach(P=>{if(P.parentTitle){const ne=document.createElement("p");ne.textContent=P.parentTitle,ne.className="panel-heading nimbi-search-title nimbi-search-parent",A.appendChild(ne)}const q=document.createElement("a");q.className="dropdown-item nimbi-search-result",q.href=me(P.slug),q.textContent=P.title,q.addEventListener("click",()=>{y&&y.classList.remove("is-active");try{A.style.display="none"}catch{}try{A.classList.remove("is-open")}catch{}}),A.appendChild(q)}),y&&y.classList.add("is-active");try{A.style.display="block"}catch{}try{A.classList.add("is-open")}catch{}}},$=(k,P)=>{let q=null;return(...ne)=>{q&&clearTimeout(q),q=setTimeout(()=>k(...ne),P)}};if(m){const k=$(async()=>{const P=document.querySelector("input#nimbi-search"),q=String(P&&P.value||"").trim().toLowerCase();if(!q){T([]);return}try{await j();const Le=(await g).filter(ke=>ke.title&&ke.title.toLowerCase().includes(q)||ke.excerpt&&ke.excerpt.toLowerCase().includes(q));T(Le.slice(0,10))}catch(ne){console.warn("[nimbi-cms] search input handler failed",ne),T([])}},50);try{m.addEventListener("input",k)}catch{}try{document.addEventListener("input",P=>{try{P&&P.target&&P.target.id==="nimbi-search"&&k(P)}catch{}},!0)}catch{}}if(l==="eager"){try{g=j()}catch(k){console.warn("[nimbi-cms] eager search index init failed",k),g=Promise.resolve([])}g.finally(()=>{const k=document.querySelector("input#nimbi-search");if(k){try{k.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}})}try{const k=P=>{try{const q=P&&P.target;if(!C||!C.classList.contains("is-open")&&C.style&&C.style.display!=="block"||q&&(C.contains(q)||m&&(q===m||m.contains&&m.contains(q))))return;y&&y.classList.remove("is-active");try{C.style.display="none"}catch{}try{C.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",k,!0),document.addEventListener("touchstart",k,!0)}catch{}}for(let v=0;v<h.length;v++){const L=h[v];if(v===0)continue;const T=L.getAttribute("href")||"#",$=document.createElement("a");$.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(T)||T.endsWith(".md")){const P=we(T).split(/::|#/,2),q=P[0],ne=P[1];$.href=me(q,ne)}else if(/\.html(?:$|[#?])/.test(T)||T.endsWith(".html")){const P=we(T).split(/::|#/,2);let q=P[0];q&&!q.toLowerCase().endsWith(".html")&&(q=q+".html");const ne=P[1];try{const Le=await Ae(q,s);if(Le&&Le.raw)try{const Te=new DOMParser().parseFromString(Le.raw,"text/html"),ce=Te.querySelector("title"),Ne=Te.querySelector("h1"),pt=ce&&ce.textContent&&ce.textContent.trim()?ce.textContent.trim():Ne&&Ne.textContent?Ne.textContent.trim():null;if(pt){const gt=le(pt);if(gt){try{J.set(gt,q),F.set(q,gt)}catch(jn){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",jn)}$.href=me(gt,ne)}else $.href=me(q,ne)}else $.href=me(q,ne)}catch{$.href=me(q,ne)}else $.href=T}catch{$.href=T}}else $.href=T}catch(k){console.warn("[nimbi-cms] nav item href parse failed",k),$.href=T}try{const k=L.textContent&&String(L.textContent).trim()?String(L.textContent).trim():null;if(k)try{const P=le(k);if(P){const q=$.getAttribute&&$.getAttribute("href")?$.getAttribute("href"):"";try{const Le=new URL(q,location.href).searchParams.get("page");if(Le){const ke=decodeURIComponent(Le);try{J.set(P,ke),F.set(ke,P)}catch(Te){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Te)}}}catch(ne){console.warn("[nimbi-cms] nav slug mapping failed",ne)}}}catch(P){console.warn("[nimbi-cms] nav slug mapping failed",P)}}catch(k){console.warn("[nimbi-cms] nav slug mapping failed",k)}$.textContent=L.textContent||T,S.appendChild($)}X.appendChild(S),V&&X.appendChild(V),Z.appendChild(W),Z.appendChild(X),t.appendChild(Z);try{const v=L=>{try{const T=Z&&Z.querySelector?Z.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!T||!T.classList.contains("is-active"))return;const $=T&&T.closest?T.closest(".navbar"):Z;if($&&$.contains(L.target))return;I()}catch{}};document.addEventListener("click",v,!0),document.addEventListener("touchstart",v,!0)}catch{}try{X.addEventListener("click",v=>{const L=v.target&&v.target.closest?v.target.closest("a"):null;if(!L)return;const T=L.getAttribute("href")||"";try{const $=new URL(T,location.href),k=$.searchParams.get("page"),P=$.hash?$.hash.replace(/^#/,""):null;if(k){v.preventDefault(),history.pushState({page:k},"",me(k,P));try{a()}catch(q){console.warn("[nimbi-cms] renderByQuery failed",q)}}}catch($){console.warn("[nimbi-cms] navbar click handler failed",$)}try{const $=Z&&Z.querySelector?Z.querySelector(".navbar-burger"):null,k=$&&$.dataset?$.dataset.target:null,P=k?document.getElementById(k):null;$&&$.classList.contains("is-active")&&($.classList.remove("is-active"),$.setAttribute("aria-expanded","false"),P&&P.classList.remove("is-active"))}catch($){console.warn("[nimbi-cms] mobile menu close failed",$)}})}catch(v){console.warn("[nimbi-cms] attach content click handler failed",v)}try{e.addEventListener("click",v=>{const L=v.target&&v.target.closest?v.target.closest("a"):null;if(!L)return;const T=L.getAttribute("href")||"";if(T&&!ur(T))try{const $=new URL(T,location.href),k=$.searchParams.get("page"),P=$.hash?$.hash.replace(/^#/,""):null;if(k){v.preventDefault(),history.pushState({page:k},"",me(k,P));try{a()}catch(q){console.warn("[nimbi-cms] renderByQuery failed",q)}}}catch($){console.warn("[nimbi-cms] container click URL parse failed",$)}})}catch(v){console.warn("[nimbi-cms] build navbar failed",v)}return{navbar:Z,linkEls:h}}try{document.addEventListener("input",t=>{try{if(t&&t.target&&t.target.id==="nimbi-search"){const e=document.getElementById("nimbi-search-results");if(e&&t.target&&t.target.value)try{e.style.display="block"}catch{}}}catch{}},!0)}catch{}var Dn,Jr;function da(){if(Jr)return Dn;Jr=1;function t(i,a){return a.some(([c,l])=>c<=i&&i<=l)}function e(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(i,a={}){let c=0,l=0,u=i.length-1;const o=a.wordsPerMinute||200,d=a.wordBound||n;for(;d(i[l]);)l++;for(;d(i[u]);)u--;const p=`${i}
`;for(let m=l;m<=u;m++)if((e(p[m])||!d(p[m])&&(d(p[m+1])||e(p[m+1])))&&c++,e(p[m]))for(;m<=u&&(s(p[m+1])||d(p[m+1]));)m++;const f=c/o,h=Math.round(f*60*1e3);return{text:Math.ceil(f.toFixed(2))+" min read",minutes:f,time:h,words:c}}return Dn=r,Dn}var fa=da();const pa=Jn(fa);function ei(t,e){let n=document.querySelector(`meta[name="${t}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",t),document.head.appendChild(n)),n.setAttribute("content",e)}function ft(t,e,n){let s=`meta[${t}="${e}"]`,r=document.querySelector(s);r||(r=document.createElement("meta"),r.setAttribute(t,e),document.head.appendChild(r)),r.setAttribute("content",n)}function ga(t,e){try{let n=document.querySelector(`link[rel="${t}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",t),document.head.appendChild(n)),n.setAttribute("href",e)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function ma(t,e,n,s){const r=e&&String(e).trim()?e:t.title||document.title;ft("property","og:title",r);const i=s&&String(s).trim()?s:t.description||"";i&&String(i).trim()&&ft("property","og:description",i),ft("name","twitter:card",t.twitter_card||"summary_large_image");const a=n||t.image;a&&(ft("property","og:image",a),ft("name","twitter:image",a))}function wa(t,e,n,s,r=""){const i=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",c=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";c&&String(c).trim()&&ei("description",c),ei("robots",i.robots||"index,follow"),ma(i,e,n,c)}function ba(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const n=document.querySelector(e);if(n){const s=n.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function ya(t,e,n,s,r,i=""){try{const a=t.meta||{},c=n&&String(n).trim()?n:a.title||i||document.title,l=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=s||a.image||null;let o="";try{if(e){const h=we(e);try{o=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(h)}catch{o=location.href.split("#")[0]}}else o=location.href.split("#")[0]}catch(h){o=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",h)}o&&ga("canonical",o);try{ft("property","og:url",o)}catch(h){console.warn("[seoManager] upsertMeta og:url failed",h)}const d={"@context":"https://schema.org","@type":"Article",headline:c||"",description:l||"",url:o||location.href.split("#")[0]};u&&(d.image=String(u)),a.date&&(d.datePublished=a.date),a.dateModified&&(d.dateModified=a.dateModified);const p="nimbi-jsonld";let f=document.getElementById(p);f||(f=document.createElement("script"),f.type="application/ld+json",f.id=p,document.head.appendChild(f)),f.textContent=JSON.stringify(d,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function ka(t,e,n,s,r,i,a,c,l,u,o){try{if(s&&s.querySelector){const d=s.querySelector(".menu-label");d&&(d.textContent=c&&c.textContent||t("onThisPage"))}}catch(d){console.warn("[seoManager] update toc label failed",d)}try{const d=n.meta&&n.meta.title?String(n.meta.title).trim():"",p=r.querySelector("img"),f=p&&(p.getAttribute("src")||p.src)||null;let h="";try{let b="";try{const y=c||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let A=y.nextElementSibling;const C=[];for(;A&&!(A.tagName&&A.tagName.toLowerCase()==="h2");){const I=(A.textContent||"").trim();I&&C.push(I),A=A.nextElementSibling}C.length&&(b=C.join(" ").replace(/\s+/g," ").trim()),!b&&l&&(b=String(l).trim())}}catch(y){console.warn("[seoManager] compute descOverride failed",y)}b&&String(b).length>160&&(b=String(b).slice(0,157).trim()+"..."),h=b}catch(b){console.warn("[seoManager] compute descOverride failed",b)}let g="";try{d&&(g=d)}catch{}if(!g)try{c&&c.textContent&&(g=String(c.textContent).trim())}catch{}if(!g)try{const b=r.querySelector("h2");b&&b.textContent&&(g=String(b.textContent).trim())}catch{}g||(g=i||"");try{wa(n,g||void 0,f,h)}catch(b){console.warn("[seoManager] setMetaTags failed",b)}try{ya(n,u,g||void 0,f,h,e)}catch(b){console.warn("[seoManager] setStructuredData failed",b)}const m=ba();g?m?document.title=`${m} - ${g}`:document.title=`${e||"Site"} - ${g}`:d?document.title=d:document.title=e||document.title}catch(d){console.warn("[seoManager] applyPageMeta failed",d)}try{const d=r.querySelector(".nimbi-reading-time");if(d&&d.remove(),l){const p=pa(o.raw||""),f=p&&typeof p.minutes=="number"?Math.ceil(p.minutes):0,h=document.createElement("p");h.className="nimbi-reading-time",h.textContent=f?t("readingTime",{minutes:f}):"";const g=r.querySelector("h1");g&&g.insertAdjacentElement("afterend",h)}}catch(d){console.warn("[seoManager] reading time update failed",d)}}let Ce=null,U=null,Se=1,Je=(t,e)=>e,$t=0,Pt=0,nn=()=>{},It=.25;function xa(){if(Ce&&document.contains(Ce))return Ce;Ce=null;const t=document.createElement("dialog");t.className="nimbi-image-preview modal",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Je("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",S=>{S.target===t&&Hn()}),t.addEventListener("wheel",S=>{if(!_())return;S.preventDefault();const V=S.deltaY<0?It:-It;Ge(Se+V),u(),o()},{passive:!1}),t.addEventListener("keydown",S=>{if(S.key==="Escape"){Hn();return}if(Se>1){const V=t.querySelector(".nimbi-image-preview__image-wrapper");if(!V)return;const re=40;switch(S.key){case"ArrowUp":V.scrollTop-=re,S.preventDefault();break;case"ArrowDown":V.scrollTop+=re,S.preventDefault();break;case"ArrowLeft":V.scrollLeft-=re,S.preventDefault();break;case"ArrowRight":V.scrollLeft+=re,S.preventDefault();break}}}),document.body.appendChild(t),Ce=t,U=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),n=t.querySelector("[data-nimbi-preview-original]"),s=t.querySelector("[data-nimbi-preview-zoom-in]"),r=t.querySelector("[data-nimbi-preview-zoom-out]"),i=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),c=t.querySelector("[data-nimbi-preview-zoom-label]"),l=t.querySelector("[data-nimbi-preview-zoom-hud]");function u(){c&&(c.textContent=`${Math.round(Se*100)}%`)}const o=()=>{l&&(l.textContent=`${Math.round(Se*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};nn=u,s.addEventListener("click",()=>{Ge(Se+It),u(),o()}),r.addEventListener("click",()=>{Ge(Se-It),u(),o()}),e.addEventListener("click",()=>{zt(),u(),o()}),n.addEventListener("click",()=>{Ge(1),u(),o()}),i.addEventListener("click",()=>{zt(),u(),o()}),a.addEventListener("click",Hn),e.title=Je("imagePreviewFit","Fit to screen"),n.title=Je("imagePreviewOriginal","Original size"),r.title=Je("imagePreviewZoomOut","Zoom out"),s.title=Je("imagePreviewZoomIn","Zoom in"),a.title=Je("imagePreviewClose","Close"),a.setAttribute("aria-label",Je("imagePreviewClose","Close"));let d=!1,p=0,f=0,h=0,g=0;const m=new Map;let b=0,y=1;const A=(S,V)=>{const re=S.x-V.x,v=S.y-V.y;return Math.hypot(re,v)},C=()=>{d=!1,m.clear(),b=0,U&&(U.classList.add("is-panning"),U.classList.remove("is-grabbing"))};let I=0,j=0,Z=0;const W=S=>{const V=Date.now(),re=V-I,v=S.clientX-j,L=S.clientY-Z;I=V,j=S.clientX,Z=S.clientY,re<300&&Math.hypot(v,L)<30&&(Ge(Se>1?1:2),u(),S.preventDefault())},he=S=>{Ge(Se>1?1:2),u(),S.preventDefault()},_=()=>Ce?typeof Ce.open=="boolean"?Ce.open:Ce.classList.contains("is-active"):!1,O=(S,V,re=1)=>{if(m.has(re)&&m.set(re,{x:S,y:V}),m.size===2){const $=Array.from(m.values()),k=A($[0],$[1]);if(b>0){const P=k/b;Ge(y*P)}return}if(!d)return;const v=U.closest(".nimbi-image-preview__image-wrapper");if(!v)return;const L=S-p,T=V-f;v.scrollLeft=h-L,v.scrollTop=g-T},Q=(S,V,re=1)=>{if(!_())return;if(m.set(re,{x:S,y:V}),m.size===2){const T=Array.from(m.values());b=A(T[0],T[1]),y=Se;return}const v=U.closest(".nimbi-image-preview__image-wrapper");!v||!(v.scrollWidth>v.clientWidth||v.scrollHeight>v.clientHeight)||(d=!0,p=S,f=V,h=v.scrollLeft,g=v.scrollTop,U.classList.add("is-panning"),U.classList.remove("is-grabbing"),window.addEventListener("pointermove",N),window.addEventListener("pointerup",oe),window.addEventListener("pointercancel",oe))},N=S=>{d&&(S.preventDefault(),O(S.clientX,S.clientY,S.pointerId))},oe=()=>{C(),window.removeEventListener("pointermove",N),window.removeEventListener("pointerup",oe),window.removeEventListener("pointercancel",oe)};U.addEventListener("pointerdown",S=>{S.preventDefault(),Q(S.clientX,S.clientY,S.pointerId)}),U.addEventListener("pointermove",S=>{(d||m.size===2)&&S.preventDefault(),O(S.clientX,S.clientY,S.pointerId)}),U.addEventListener("pointerup",S=>{S.preventDefault(),S.pointerType==="touch"&&W(S),C()}),U.addEventListener("dblclick",he),U.addEventListener("pointercancel",C),U.addEventListener("mousedown",S=>{S.preventDefault(),Q(S.clientX,S.clientY,1)}),U.addEventListener("mousemove",S=>{d&&S.preventDefault(),O(S.clientX,S.clientY,1)}),U.addEventListener("mouseup",S=>{S.preventDefault(),C()});const X=t.querySelector(".nimbi-image-preview__image-wrapper");return X&&(X.addEventListener("pointerdown",S=>{if(Q(S.clientX,S.clientY,S.pointerId),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),X.addEventListener("pointermove",S=>{O(S.clientX,S.clientY,S.pointerId)}),X.addEventListener("pointerup",C),X.addEventListener("pointercancel",C),X.addEventListener("mousedown",S=>{if(Q(S.clientX,S.clientY,1),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),X.addEventListener("mousemove",S=>{O(S.clientX,S.clientY,1)}),X.addEventListener("mouseup",C)),t}function Ge(t){if(!U)return;const e=Number(t);Se=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const s=U.getBoundingClientRect(),r=$t||U.naturalWidth||U.width||s.width||0,i=Pt||U.naturalHeight||U.height||s.height||0;if(r&&i){U.style.setProperty("--nimbi-preview-img-max-width","none"),U.style.setProperty("--nimbi-preview-img-max-height","none"),U.style.setProperty("--nimbi-preview-img-width",`${r*Se}px`),U.style.setProperty("--nimbi-preview-img-height",`${i*Se}px`),U.style.setProperty("--nimbi-preview-img-transform","none");try{U.style.width=`${r*Se}px`,U.style.height=`${i*Se}px`,U.style.transform="none"}catch{}}else{U.style.setProperty("--nimbi-preview-img-max-width",""),U.style.setProperty("--nimbi-preview-img-max-height",""),U.style.setProperty("--nimbi-preview-img-width",""),U.style.setProperty("--nimbi-preview-img-height",""),U.style.setProperty("--nimbi-preview-img-transform",`scale(${Se})`);try{U.style.transform=`scale(${Se})`}catch{}}U&&(U.classList.add("is-panning"),U.classList.remove("is-grabbing"))}function zt(){if(!U)return;const t=U.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const n=$t||U.naturalWidth||e.width,s=Pt||U.naturalHeight||e.height;if(!n||!s)return;const r=e.width/n,i=e.height/s,a=Math.min(r,i,1);Ge(Number.isFinite(a)?a:1)}function Sa(t,e="",n=0,s=0){const r=xa();Se=1,$t=n||0,Pt=s||0,U.src=t,U.alt=e,U.style.transform="scale(1)";const i=()=>{$t=U.naturalWidth||U.width||0,Pt=U.naturalHeight||U.height||0};if(i(),zt(),nn(),requestAnimationFrame(()=>{zt(),nn()}),!$t||!Pt){const a=()=>{i(),requestAnimationFrame(()=>{zt(),nn()}),U.removeEventListener("load",a)};U.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function Hn(){if(Ce){typeof Ce.close=="function"&&Ce.open&&Ce.close(),Ce.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function va(t,{t:e,zoomStep:n=.25}={}){if(!t||!t.querySelectorAll)return;Je=(f,h)=>(typeof e=="function"?e(f):void 0)||h,It=n,t.addEventListener("click",f=>{const h=f.target;if(!h||h.tagName!=="IMG")return;const g=h;if(g.src){if(f.defaultPrevented!==!0){const m=g.closest("a");m&&m.getAttribute("href")&&f.preventDefault()}Sa(g.src,g.alt||"",g.naturalWidth||0,g.naturalHeight||0)}});let s=!1,r=0,i=0,a=0,c=0;const l=new Map;let u=0,o=1;const d=(f,h)=>{const g=f.x-h.x,m=f.y-h.y;return Math.hypot(g,m)};t.addEventListener("pointerdown",f=>{const h=f.target;if(!h||h.tagName!=="IMG"||!Ce||!Ce.open)return;if(l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){const m=Array.from(l.values());u=d(m[0],m[1]),o=Se;return}const g=h.closest(".nimbi-image-preview__image-wrapper");if(g&&!(Se<=1)){f.preventDefault(),s=!0,r=f.clientX,i=f.clientY,a=g.scrollLeft,c=g.scrollTop,h.setPointerCapture(f.pointerId);try{h.classList.add("is-grabbing")}catch{}}}),t.addEventListener("pointermove",f=>{if(l.has(f.pointerId)&&l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){f.preventDefault();const y=Array.from(l.values()),A=d(y[0],y[1]);if(u>0){const C=A/u;Ge(o*C)}return}if(!s)return;f.preventDefault();const g=f.target.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const m=f.clientX-r,b=f.clientY-i;g.scrollLeft=a-m,g.scrollTop=c-b});const p=()=>{s=!1,l.clear(),u=0;try{const f=document.querySelector("[data-nimbi-preview-image]");f&&(f.classList.add("is-panning"),f.classList.remove("is-grabbing"))}catch{}};t.addEventListener("pointerup",p),t.addEventListener("pointercancel",p)}function Aa(t){const{contentWrap:e,navWrap:n,container:s,mountOverlay:r=null,t:i,contentBase:a,homePage:c,initialDocumentTitle:l,runHooks:u}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let o=null;const d=Vs(i,[{path:c,name:i("home"),isIndex:!0,children:[]}]);async function p(b,y){let A,C,I;try{({data:A,pagePath:C,anchor:I}=await ns(b,a))}catch(Q){console.error("[nimbi-cms] fetchPageData failed",Q),Yr(e,i,Q);return}!I&&y&&(I=y);try{qn(null)}catch(Q){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",Q)}e.innerHTML="";const{article:j,parsed:Z,toc:W,topH1:he,h1Text:_,slugKey:O}=await aa(i,A,C,I,a);ka(i,l,Z,W,j,C,I,he,_,O,A),n.innerHTML="",W&&(n.appendChild(W),ca(W));try{await u("transformHtml",{article:j,parsed:Z,toc:W,pagePath:C,anchor:I,topH1:he,h1Text:_,slugKey:O,data:A})}catch(Q){console.warn("[nimbi-cms] transformHtml hooks failed",Q)}e.appendChild(j);try{la(j)}catch(Q){console.warn("[nimbi-cms] executeEmbeddedScripts failed",Q)}try{va(j,{t:i})}catch(Q){console.warn("[nimbi-cms] attachImagePreview failed",Q)}try{Dt(s,100,!1),requestAnimationFrame(()=>Dt(s,100,!1)),setTimeout(()=>Dt(s,100,!1),250)}catch(Q){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",Q)}qn(I),ua(j,he,{mountOverlay:r,container:s,navWrap:n,t:i});try{await u("onPageLoad",{data:A,pagePath:C,anchor:I,article:j,toc:W,topH1:he,h1Text:_,slugKey:O,contentWrap:e,navWrap:n})}catch(Q){console.warn("[nimbi-cms] onPageLoad hooks failed",Q)}o=C}async function f(){let b=new URLSearchParams(location.search).get("page")||c;const y=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await p(b,y)}catch(A){console.warn("[nimbi-cms] renderByQuery failed for",b,A),Yr(e,i,A)}}window.addEventListener("popstate",f);const h=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,g=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const y={top:b.scrollTop||0,left:b.scrollLeft||0};sessionStorage.setItem(h(),JSON.stringify(y))}catch{}},m=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const y=sessionStorage.getItem(h());if(!y)return;const A=JSON.parse(y);A&&typeof A.top=="number"&&b.scrollTo({top:A.top,left:A.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",b=>{if(b.persisted)try{m(),Dt(s,100,!1)}catch(y){console.warn("[nimbi-cms] bfcache restore failed",y)}}),window.addEventListener("pagehide",()=>{try{g()}catch(b){console.warn("[nimbi-cms] save scroll position failed",b)}}),{renderByQuery:f,siteNav:d,getCurrentPagePath:()=>o}}function Ea(t){try{let e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e&&typeof window<"u"&&window.location&&window.location.hash){const i=window.location.hash,a=i.indexOf("?");a!==-1&&(e=i.slice(a))}if(!e)return{};const n=new URLSearchParams(e.startsWith("?")?e.slice(1):e),s={},r=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(s.contentPath=n.get("contentPath")),n.has("searchIndex")){const i=r(n.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(n.has("searchIndexMode")){const i=n.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(n.has("defaultStyle")){const i=n.get("defaultStyle");(i==="light"||i==="dark"||i==="system")&&(s.defaultStyle=i)}if(n.has("bulmaCustomize")&&(s.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(s.lang=n.get("lang")),n.has("l10nFile")){const i=n.get("l10nFile");s.l10nFile=i==="null"?null:i}if(n.has("cacheTtlMinutes")){const i=Number(n.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(n.has("cacheMaxEntries")){const i=Number(n.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(n.has("homePage")&&(s.homePage=n.get("homePage")),n.has("notFoundPage")&&(s.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(s.availableLanguages=n.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),n.has("indexDepth")){const i=Number(n.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(c=>c.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function La(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function ti(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let Un="";async function ni(t={}){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.info("[nimbi-cms] initCMS called",{options:t})}catch{}if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const n=Ea();if(n&&(n.contentPath||n.homePage||n.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(_){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",_)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(_){console.warn("[nimbi-cms] logging ignore of URL overrides failed",_)}delete n.contentPath,delete n.homePage,delete n.notFoundPage}const s=Object.assign({},n,t);n&&typeof n.bulmaCustomize=="string"&&n.bulmaCustomize.trim()&&(s.bulmaCustomize=n.bulmaCustomize);const{el:r,contentPath:i="/content",crawlMaxQueue:a=1e3,searchIndex:c=!0,searchIndexMode:l="eager",indexDepth:u=1,noIndexing:o=void 0,defaultStyle:d="light",bulmaCustomize:p="none",lang:f=void 0,l10nFile:h=null,cacheTtlMinutes:g=5,cacheMaxEntries:m,markdownExtensions:b,availableLanguages:y,homePage:A="_home.md",notFoundPage:C="_404.md"}=s,{navbarLogo:I="favicon"}=s,{skipRootReadme:j=!1}=s,Z=_=>{try{const O=document.querySelector(r);O&&O instanceof Element&&(O.innerHTML=`<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(_)}</pre></div>`)}catch{}};if(s.contentPath!=null&&!La(s.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(s.homePage!=null&&!ti(s.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(s.notFoundPage!=null&&!ti(s.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!r)throw new Error("el is required");let W=r;if(typeof r=="string"){if(W=document.querySelector(r),!W)throw new Error(`el selector "${r}" did not match any element`)}else if(!(r instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof i!="string"||!i.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof c!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(l!=null&&l!=="eager"&&l!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(u!=null&&u!==1&&u!==2&&u!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(d!=="light"&&d!=="dark"&&d!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(g!=null&&(typeof g!="number"||!Number.isFinite(g)||g<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(b!=null&&(!Array.isArray(b)||b.some(_=>!_||typeof _!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some(_=>typeof _!="string"||!_.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(o!=null&&(!Array.isArray(o)||o.some(_=>typeof _!="string"||!_.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(j!=null&&typeof j!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(A!=null&&(typeof A!="string"||!A.trim()||!/\.(md|html)$/.test(A)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(C!=null&&(typeof C!="string"||!C.trim()||!/\.(md|html)$/.test(C)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const he=!!c;try{Promise.resolve().then(()=>Qt).then(_=>{try{_&&typeof _.setSkipRootReadme=="function"&&_.setSkipRootReadme(!!j)}catch(O){console.warn("[nimbi-cms] setSkipRootReadme failed",O)}}).catch(_=>{})}catch(_){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",_)}try{await(async()=>{try{W.classList.add("nimbi-mount")}catch(k){console.warn("[nimbi-cms] mount element setup failed",k)}const _=document.createElement("section");_.className="section";const O=document.createElement("div");O.className="container nimbi-cms";const Q=document.createElement("div");Q.className="columns";const N=document.createElement("div");N.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",N.setAttribute("role","navigation");try{const k=typeof ut=="function"?ut("navigation"):null;k&&N.setAttribute("aria-label",k)}catch(k){console.warn("[nimbi-cms] set nav aria-label failed",k)}Q.appendChild(N);const oe=document.createElement("main");oe.className="column nimbi-content",oe.setAttribute("role","main"),Q.appendChild(oe),O.appendChild(Q),_.appendChild(O);const X=N,S=oe;W.appendChild(_);let V=null;try{V=W.querySelector(".nimbi-overlay"),V||(V=document.createElement("div"),V.className="nimbi-overlay",W.appendChild(V))}catch(k){V=null,console.warn("[nimbi-cms] mount overlay setup failed",k)}const re=location.pathname||"/",v=re.endsWith("/")?re:re.substring(0,re.lastIndexOf("/")+1);try{Un=document.title||""}catch(k){Un="",console.warn("[nimbi-cms] read initial document title failed",k)}let L=i;(L==="."||L==="./")&&(L=""),L.startsWith("./")&&(L=L.slice(2)),L.startsWith("/")&&(L=L.slice(1)),L!==""&&!L.endsWith("/")&&(L=L+"/");const T=new URL(v+L,location.origin).toString();try{Promise.resolve().then(()=>Qt).then(k=>{try{k&&typeof k.setHomePage=="function"&&k.setHomePage(A)}catch(P){console.warn("[nimbi-cms] setHomePage failed",P)}}).catch(k=>{})}catch(k){console.warn("[nimbi-cms] setHomePage dynamic import failed",k)}h&&await gn(h,v),y&&Array.isArray(y)&&hr(y),f&&mn(f);const $=Aa({contentWrap:S,navWrap:X,container:O,mountOverlay:V,t:ut,contentBase:T,homePage:A,initialDocumentTitle:Un,runHooks:un});if(typeof g=="number"&&g>=0&&typeof Sr=="function"&&Sr(g*60*1e3),typeof m=="number"&&m>=0&&typeof xr=="function"&&xr(m),b&&Array.isArray(b)&&b.length)try{b.forEach(k=>{typeof k=="object"&&Ks&&typeof In=="function"&&In(k)})}catch(k){console.warn("[nimbi-cms] applying markdownExtensions failed",k)}try{typeof a=="number"&&Promise.resolve().then(()=>Qt).then(({setDefaultCrawlMaxQueue:k})=>{try{k(a)}catch(P){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",P)}})}catch(k){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",k)}try{Ft(T)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{xn(C)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{Ft(T)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{xn(C)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{await Ae(A,T)}catch(k){throw A==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${A} not found at ${T}${A}: ${k.message}`)}rr(d),await nr(p,v);try{const k=document.createElement("header");k.className="nimbi-site-navbar",W.insertBefore(k,_);const P=await Ae("_navigation.md",T),q=await tn(P.raw||""),{navbar:ne,linkEls:Le}=await ha(k,O,q.html||"",T,A,ut,$.renderByQuery,he,l,u,o,I);try{await un("onNavBuild",{navWrap:X,navbar:ne,linkEls:Le,contentBase:T})}catch(ke){console.warn("[nimbi-cms] onNavBuild hooks failed",ke)}try{const ke=()=>{const Te=k&&k.getBoundingClientRect&&Math.round(k.getBoundingClientRect().height)||k&&k.offsetHeight||0;if(Te>0){try{W.style.setProperty("--nimbi-site-navbar-height",`${Te}px`)}catch(ce){console.warn("[nimbi-cms] set CSS var failed",ce)}try{O.style.paddingTop=""}catch(ce){console.warn("[nimbi-cms] set container paddingTop failed",ce)}try{const ce=W&&W.getBoundingClientRect&&Math.round(W.getBoundingClientRect().height)||W&&W.clientHeight||0;if(ce>0){const Ne=Math.max(0,ce-Te);try{O.style.setProperty("--nimbi-cms-height",`${Ne}px`)}catch(pt){console.warn("[nimbi-cms] set --nimbi-cms-height failed",pt)}}else try{O.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(Ne){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Ne)}}catch(ce){console.warn("[nimbi-cms] compute container height failed",ce)}try{k.style.setProperty("--nimbi-site-navbar-height",`${Te}px`)}catch(ce){console.warn("[nimbi-cms] set navbar CSS var failed",ce)}}};ke();try{if(typeof ResizeObserver<"u"){const Te=new ResizeObserver(()=>ke());try{Te.observe(k)}catch(ce){console.warn("[nimbi-cms] ResizeObserver.observe failed",ce)}}}catch(Te){console.warn("[nimbi-cms] ResizeObserver setup failed",Te)}}catch(ke){console.warn("[nimbi-cms] compute navbar height failed",ke)}}catch(k){console.warn("[nimbi-cms] build navigation failed",k)}await $.renderByQuery();try{Promise.resolve().then(()=>Ta).then(({getVersion:k})=>{typeof k=="function"&&k().then(P=>{try{const q=P||"0.0.0";try{const ne=Te=>{const ce=document.createElement("a");ce.className="nimbi-version-label tag is-small",ce.textContent=`Ninbi CMS v. ${q}`,ce.href=Te||"#",ce.target="_blank",ce.rel="noopener noreferrer nofollow",ce.setAttribute("aria-label",`Ninbi CMS version ${q}`);try{ir(ce)}catch{}try{W.appendChild(ce)}catch(Ne){console.warn("[nimbi-cms] append version label failed",Ne)}},Le="https://abelvm.github.io/nimbiCMS/",ke=(()=>{try{if(Le&&typeof Le=="string")return new URL(Le).toString()}catch{}return"#"})();ne(ke)}catch(ne){console.warn("[nimbi-cms] building version label failed",ne)}}catch(q){console.warn("[nimbi-cms] building version label failed",q)}}).catch(P=>{console.warn("[nimbi-cms] getVersion() failed",P)})}).catch(k=>{console.warn("[nimbi-cms] import version module failed",k)})}catch(k){console.warn("[nimbi-cms] version label setup failed",k)}})()}catch(_){throw Z(_),_}}async function ri(){try{if("0.1.0".trim())return"0.1.0"}catch{}return"0.0.0"}const Ta=Object.freeze(Object.defineProperty({__proto__:null,getVersion:ri},Symbol.toStringTag,{value:"Module"}));de.BAD_LANGUAGES=dn,de.SUPPORTED_HLJS_MAP=te,de._clearHooks=vi,de.addHook=Nt,de.default=ni,de.ensureBulma=nr,de.getVersion=ri,de.initCMS=ni,de.loadL10nFile=gn,de.loadSupportedLanguages=pn,de.observeCodeBlocks=tr,de.onNavBuild=xi,de.onPageLoad=ki,de.registerLanguage=ot,de.runHooks=un,de.setHighlightTheme=Ci,de.setLang=mn,de.setStyle=rr,de.setThemeVars=_i,de.t=ut,de.transformHtml=Si,Object.defineProperties(de,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
