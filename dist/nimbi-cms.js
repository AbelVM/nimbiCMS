(function(pe,We){typeof exports=="object"&&typeof module<"u"?We(exports):typeof define=="function"&&define.amd?define(["exports"],We):(pe=typeof globalThis<"u"?globalThis:pe||self,We(pe.nimbiCMS={}))})(this,(function(pe){"use strict";const We={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Bt(e,t){if(!Object.prototype.hasOwnProperty.call(We,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");We[e].push(t)}function ki(e){Bt("onPageLoad",e)}function xi(e){Bt("onNavBuild",e)}function Si(e){Bt("transformHtml",e)}async function un(e,t){const n=We[e]||[];for(const s of n)try{await s(t)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function vi(){Object.keys(We).forEach(e=>{We[e].length=0})}function Jn(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var hn,er;function Ei(){if(er)return hn;er=1;function e(w){return w instanceof Map?w.clear=w.delete=w.set=function(){throw new Error("map is read-only")}:w instanceof Set&&(w.add=w.clear=w.delete=function(){throw new Error("set is read-only")}),Object.freeze(w),Object.getOwnPropertyNames(w).forEach(x=>{const C=w[x],K=typeof C;(K==="object"||K==="function")&&!Object.isFrozen(C)&&e(C)}),w}class t{constructor(x){x.data===void 0&&(x.data={}),this.data=x.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(w){return w.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(w,...x){const C=Object.create(null);for(const K in w)C[K]=w[K];return x.forEach(function(K){for(const ke in K)C[ke]=K[ke]}),C}const r="</span>",i=w=>!!w.scope,a=(w,{prefix:x})=>{if(w.startsWith("language:"))return w.replace("language:","language-");if(w.includes(".")){const C=w.split(".");return[`${x}${C.shift()}`,...C.map((K,ke)=>`${K}${"_".repeat(ke+1)}`)].join(" ")}return`${x}${w}`};class o{constructor(x,C){this.buffer="",this.classPrefix=C.classPrefix,x.walk(this)}addText(x){this.buffer+=n(x)}openNode(x){if(!i(x))return;const C=a(x.scope,{prefix:this.classPrefix});this.span(C)}closeNode(x){i(x)&&(this.buffer+=r)}value(){return this.buffer}span(x){this.buffer+=`<span class="${x}">`}}const l=(w={})=>{const x={children:[]};return Object.assign(x,w),x};class h{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(x){this.top.children.push(x)}openNode(x){const C=l({scope:x});this.add(C),this.stack.push(C)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(x){return this.constructor._walk(x,this.rootNode)}static _walk(x,C){return typeof C=="string"?x.addText(C):C.children&&(x.openNode(C),C.children.forEach(K=>this._walk(x,K)),x.closeNode(C)),x}static _collapse(x){typeof x!="string"&&x.children&&(x.children.every(C=>typeof C=="string")?x.children=[x.children.join("")]:x.children.forEach(C=>{h._collapse(C)}))}}class c extends h{constructor(x){super(),this.options=x}addText(x){x!==""&&this.add(x)}startScope(x){this.openNode(x)}endScope(){this.closeNode()}__addSublanguage(x,C){const K=x.root;C&&(K.scope=`language:${C}`),this.add(K)}toHTML(){return new o(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(w){return w?typeof w=="string"?w:w.source:null}function p(w){return g("(?=",w,")")}function f(w){return g("(?:",w,")*")}function u(w){return g("(?:",w,")?")}function g(...w){return w.map(C=>d(C)).join("")}function m(w){const x=w[w.length-1];return typeof x=="object"&&x.constructor===Object?(w.splice(w.length-1,1),x):{}}function b(...w){return"("+(m(w).capture?"":"?:")+w.map(K=>d(K)).join("|")+")"}function y(w){return new RegExp(w.toString()+"|").exec("").length-1}function v(w,x){const C=w&&w.exec(x);return C&&C.index===0}const M=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function I(w,{joinWith:x}){let C=0;return w.map(K=>{C+=1;const ke=C;let xe=d(K),B="";for(;xe.length>0;){const z=M.exec(xe);if(!z){B+=xe;break}B+=xe.substring(0,z.index),xe=xe.substring(z.index+z[0].length),z[0][0]==="\\"&&z[1]?B+="\\"+String(Number(z[1])+ke):(B+=z[0],z[0]==="("&&C++)}return B}).map(K=>`(${K})`).join(x)}const F=/\b\B/,Z="[a-zA-Z]\\w*",W="[a-zA-Z_]\\w*",fe="\\b\\d+(\\.\\d+)?",$="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",q="\\b(0b[01]+)",Q="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",O=(w={})=>{const x=/^#![ ]*\//;return w.binary&&(w.begin=g(x,/.*\b/,w.binary,/\b.*/)),s({scope:"meta",begin:x,end:/$/,relevance:0,"on:begin":(C,K)=>{C.index!==0&&K.ignoreMatch()}},w)},oe={begin:"\\\\[\\s\\S]",relevance:0},X={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[oe]},S={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[oe]},J={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},re=function(w,x,C={}){const K=s({scope:"comment",begin:w,end:x,contains:[]},C);K.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const ke=b("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return K.contains.push({begin:g(/[ ]+/,"(",ke,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),K},E=re("//","$"),L=re("/\\*","\\*/"),T=re("#","$"),P={scope:"number",begin:fe,relevance:0},k={scope:"number",begin:$,relevance:0},R={scope:"number",begin:q,relevance:0},N={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[oe,{begin:/\[/,end:/\]/,relevance:0,contains:[oe]}]},ne={scope:"title",begin:Z,relevance:0},ue={scope:"title",begin:W,relevance:0},he={begin:"\\.\\s*"+W,relevance:0};var ce=Object.freeze({__proto__:null,APOS_STRING_MODE:X,BACKSLASH_ESCAPE:oe,BINARY_NUMBER_MODE:R,BINARY_NUMBER_RE:q,COMMENT:re,C_BLOCK_COMMENT_MODE:L,C_LINE_COMMENT_MODE:E,C_NUMBER_MODE:k,C_NUMBER_RE:$,END_SAME_AS_BEGIN:function(w){return Object.assign(w,{"on:begin":(x,C)=>{C.data._beginMatch=x[1]},"on:end":(x,C)=>{C.data._beginMatch!==x[1]&&C.ignoreMatch()}})},HASH_COMMENT_MODE:T,IDENT_RE:Z,MATCH_NOTHING_RE:F,METHOD_GUARD:he,NUMBER_MODE:P,NUMBER_RE:fe,PHRASAL_WORDS_MODE:J,QUOTE_STRING_MODE:S,REGEXP_MODE:N,RE_STARTERS_RE:Q,SHEBANG:O,TITLE_MODE:ne,UNDERSCORE_IDENT_RE:W,UNDERSCORE_TITLE_MODE:ue});function Be(w,x){w.input[w.index-1]==="."&&x.ignoreMatch()}function pt(w,x){w.className!==void 0&&(w.scope=w.className,delete w.className)}function gt(w,x){x&&w.beginKeywords&&(w.begin="\\b("+w.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",w.__beforeBegin=Be,w.keywords=w.keywords||w.beginKeywords,delete w.beginKeywords,w.relevance===void 0&&(w.relevance=0))}function jn(w,x){Array.isArray(w.illegal)&&(w.illegal=b(...w.illegal))}function Ra(w,x){if(w.match){if(w.begin||w.end)throw new Error("begin & end are not supported with match");w.begin=w.match,delete w.match}}function Ca(w,x){w.relevance===void 0&&(w.relevance=1)}const Ma=(w,x)=>{if(!w.beforeMatch)return;if(w.starts)throw new Error("beforeMatch cannot be used with starts");const C=Object.assign({},w);Object.keys(w).forEach(K=>{delete w[K]}),w.keywords=C.keywords,w.begin=g(C.beforeMatch,p(C.begin)),w.starts={relevance:0,contains:[Object.assign(C,{endsParent:!0})]},w.relevance=0,delete C.beforeMatch},_a=["of","and","for","in","not","or","if","then","parent","list","value"],$a="keyword";function ii(w,x,C=$a){const K=Object.create(null);return typeof w=="string"?ke(C,w.split(" ")):Array.isArray(w)?ke(C,w):Object.keys(w).forEach(function(xe){Object.assign(K,ii(w[xe],x,xe))}),K;function ke(xe,B){x&&(B=B.map(z=>z.toLowerCase())),B.forEach(function(z){const G=z.split("|");K[G[0]]=[xe,Pa(G[0],G[1])]})}}function Pa(w,x){return x?Number(x):Ia(w)?0:1}function Ia(w){return _a.includes(w.toLowerCase())}const si={},at=w=>{console.error(w)},ai=(w,...x)=>{console.log(`WARN: ${w}`,...x)},mt=(w,x)=>{si[`${w}/${x}`]||(console.log(`Deprecated as of ${w}. ${x}`),si[`${w}/${x}`]=!0)},rn=new Error;function li(w,x,{key:C}){let K=0;const ke=w[C],xe={},B={};for(let z=1;z<=x.length;z++)B[z+K]=ke[z],xe[z+K]=!0,K+=y(x[z-1]);w[C]=B,w[C]._emit=xe,w[C]._multi=!0}function za(w){if(Array.isArray(w.begin)){if(w.skip||w.excludeBegin||w.returnBegin)throw at("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),rn;if(typeof w.beginScope!="object"||w.beginScope===null)throw at("beginScope must be object"),rn;li(w,w.begin,{key:"beginScope"}),w.begin=I(w.begin,{joinWith:""})}}function Na(w){if(Array.isArray(w.end)){if(w.skip||w.excludeEnd||w.returnEnd)throw at("skip, excludeEnd, returnEnd not compatible with endScope: {}"),rn;if(typeof w.endScope!="object"||w.endScope===null)throw at("endScope must be object"),rn;li(w,w.end,{key:"endScope"}),w.end=I(w.end,{joinWith:""})}}function Ba(w){w.scope&&typeof w.scope=="object"&&w.scope!==null&&(w.beginScope=w.scope,delete w.scope)}function Oa(w){Ba(w),typeof w.beginScope=="string"&&(w.beginScope={_wrap:w.beginScope}),typeof w.endScope=="string"&&(w.endScope={_wrap:w.endScope}),za(w),Na(w)}function qa(w){function x(B,z){return new RegExp(d(B),"m"+(w.case_insensitive?"i":"")+(w.unicodeRegex?"u":"")+(z?"g":""))}class C{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(z,G){G.position=this.position++,this.matchIndexes[this.matchAt]=G,this.regexes.push([G,z]),this.matchAt+=y(z)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const z=this.regexes.map(G=>G[1]);this.matcherRe=x(I(z,{joinWith:"|"}),!0),this.lastIndex=0}exec(z){this.matcherRe.lastIndex=this.lastIndex;const G=this.matcherRe.exec(z);if(!G)return null;const Le=G.findIndex((Nt,Wn)=>Wn>0&&Nt!==void 0),Se=this.matchIndexes[Le];return G.splice(0,Le),Object.assign(G,Se)}}class K{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(z){if(this.multiRegexes[z])return this.multiRegexes[z];const G=new C;return this.rules.slice(z).forEach(([Le,Se])=>G.addRule(Le,Se)),G.compile(),this.multiRegexes[z]=G,G}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(z,G){this.rules.push([z,G]),G.type==="begin"&&this.count++}exec(z){const G=this.getMatcher(this.regexIndex);G.lastIndex=this.lastIndex;let Le=G.exec(z);if(this.resumingScanAtSamePosition()&&!(Le&&Le.index===this.lastIndex)){const Se=this.getMatcher(0);Se.lastIndex=this.lastIndex+1,Le=Se.exec(z)}return Le&&(this.regexIndex+=Le.position+1,this.regexIndex===this.count&&this.considerAll()),Le}}function ke(B){const z=new K;return B.contains.forEach(G=>z.addRule(G.begin,{rule:G,type:"begin"})),B.terminatorEnd&&z.addRule(B.terminatorEnd,{type:"end"}),B.illegal&&z.addRule(B.illegal,{type:"illegal"}),z}function xe(B,z){const G=B;if(B.isCompiled)return G;[pt,Ra,Oa,Ma].forEach(Se=>Se(B,z)),w.compilerExtensions.forEach(Se=>Se(B,z)),B.__beforeBegin=null,[gt,jn,Ca].forEach(Se=>Se(B,z)),B.isCompiled=!0;let Le=null;return typeof B.keywords=="object"&&B.keywords.$pattern&&(B.keywords=Object.assign({},B.keywords),Le=B.keywords.$pattern,delete B.keywords.$pattern),Le=Le||/\w+/,B.keywords&&(B.keywords=ii(B.keywords,w.case_insensitive)),G.keywordPatternRe=x(Le,!0),z&&(B.begin||(B.begin=/\B|\b/),G.beginRe=x(G.begin),!B.end&&!B.endsWithParent&&(B.end=/\B|\b/),B.end&&(G.endRe=x(G.end)),G.terminatorEnd=d(G.end)||"",B.endsWithParent&&z.terminatorEnd&&(G.terminatorEnd+=(B.end?"|":"")+z.terminatorEnd)),B.illegal&&(G.illegalRe=x(B.illegal)),B.contains||(B.contains=[]),B.contains=[].concat(...B.contains.map(function(Se){return Da(Se==="self"?B:Se)})),B.contains.forEach(function(Se){xe(Se,G)}),B.starts&&xe(B.starts,z),G.matcher=ke(G),G}if(w.compilerExtensions||(w.compilerExtensions=[]),w.contains&&w.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return w.classNameAliases=s(w.classNameAliases||{}),xe(w)}function oi(w){return w?w.endsWithParent||oi(w.starts):!1}function Da(w){return w.variants&&!w.cachedVariants&&(w.cachedVariants=w.variants.map(function(x){return s(w,{variants:null},x)})),w.cachedVariants?w.cachedVariants:oi(w)?s(w,{starts:w.starts?s(w.starts):null}):Object.isFrozen(w)?s(w):w}var Ha="11.11.1";class Ua extends Error{constructor(x,C){super(x),this.name="HTMLInjectionError",this.html=C}}const Fn=n,ci=s,ui=Symbol("nomatch"),ja=7,hi=function(w){const x=Object.create(null),C=Object.create(null),K=[];let ke=!0;const xe="Could not find the language '{}', did you forget to load/include a language module?",B={disableAutodetect:!0,name:"Plain text",contains:[]};let z={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:c};function G(A){return z.noHighlightRe.test(A)}function Le(A){let H=A.className+" ";H+=A.parentNode?A.parentNode.className:"";const ie=z.languageDetectRe.exec(H);if(ie){const me=et(ie[1]);return me||(ai(xe.replace("{}",ie[1])),ai("Falling back to no-highlight mode for this block.",A)),me?ie[1]:"no-highlight"}return H.split(/\s+/).find(me=>G(me)||et(me))}function Se(A,H,ie){let me="",Ee="";typeof H=="object"?(me=A,ie=H.ignoreIllegals,Ee=H.language):(mt("10.7.0","highlight(lang, code, ...args) has been deprecated."),mt("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),Ee=A,me=H),ie===void 0&&(ie=!0);const De={code:me,language:Ee};an("before:highlight",De);const tt=De.result?De.result:Nt(De.language,De.code,ie);return tt.code=De.code,an("after:highlight",tt),tt}function Nt(A,H,ie,me){const Ee=Object.create(null);function De(_,D){return _.keywords[D]}function tt(){if(!Y.keywords){Re.addText(we);return}let _=0;Y.keywordPatternRe.lastIndex=0;let D=Y.keywordPatternRe.exec(we),ee="";for(;D;){ee+=we.substring(_,D.index);const de=Fe.case_insensitive?D[0].toLowerCase():D[0],Me=De(Y,de);if(Me){const[Qe,al]=Me;if(Re.addText(ee),ee="",Ee[de]=(Ee[de]||0)+1,Ee[de]<=ja&&(cn+=al),Qe.startsWith("_"))ee+=D[0];else{const ll=Fe.classNameAliases[Qe]||Qe;je(D[0],ll)}}else ee+=D[0];_=Y.keywordPatternRe.lastIndex,D=Y.keywordPatternRe.exec(we)}ee+=we.substring(_),Re.addText(ee)}function ln(){if(we==="")return;let _=null;if(typeof Y.subLanguage=="string"){if(!x[Y.subLanguage]){Re.addText(we);return}_=Nt(Y.subLanguage,we,!0,yi[Y.subLanguage]),yi[Y.subLanguage]=_._top}else _=Zn(we,Y.subLanguage.length?Y.subLanguage:null);Y.relevance>0&&(cn+=_.relevance),Re.__addSublanguage(_._emitter,_.language)}function ze(){Y.subLanguage!=null?ln():tt(),we=""}function je(_,D){_!==""&&(Re.startScope(D),Re.addText(_),Re.endScope())}function gi(_,D){let ee=1;const de=D.length-1;for(;ee<=de;){if(!_._emit[ee]){ee++;continue}const Me=Fe.classNameAliases[_[ee]]||_[ee],Qe=D[ee];Me?je(Qe,Me):(we=Qe,tt(),we=""),ee++}}function mi(_,D){return _.scope&&typeof _.scope=="string"&&Re.openNode(Fe.classNameAliases[_.scope]||_.scope),_.beginScope&&(_.beginScope._wrap?(je(we,Fe.classNameAliases[_.beginScope._wrap]||_.beginScope._wrap),we=""):_.beginScope._multi&&(gi(_.beginScope,D),we="")),Y=Object.create(_,{parent:{value:Y}}),Y}function wi(_,D,ee){let de=v(_.endRe,ee);if(de){if(_["on:end"]){const Me=new t(_);_["on:end"](D,Me),Me.isMatchIgnored&&(de=!1)}if(de){for(;_.endsParent&&_.parent;)_=_.parent;return _}}if(_.endsWithParent)return wi(_.parent,D,ee)}function tl(_){return Y.matcher.regexIndex===0?(we+=_[0],1):(Kn=!0,0)}function nl(_){const D=_[0],ee=_.rule,de=new t(ee),Me=[ee.__beforeBegin,ee["on:begin"]];for(const Qe of Me)if(Qe&&(Qe(_,de),de.isMatchIgnored))return tl(D);return ee.skip?we+=D:(ee.excludeBegin&&(we+=D),ze(),!ee.returnBegin&&!ee.excludeBegin&&(we=D)),mi(ee,_),ee.returnBegin?0:D.length}function rl(_){const D=_[0],ee=H.substring(_.index),de=wi(Y,_,ee);if(!de)return ui;const Me=Y;Y.endScope&&Y.endScope._wrap?(ze(),je(D,Y.endScope._wrap)):Y.endScope&&Y.endScope._multi?(ze(),gi(Y.endScope,_)):Me.skip?we+=D:(Me.returnEnd||Me.excludeEnd||(we+=D),ze(),Me.excludeEnd&&(we=D));do Y.scope&&Re.closeNode(),!Y.skip&&!Y.subLanguage&&(cn+=Y.relevance),Y=Y.parent;while(Y!==de.parent);return de.starts&&mi(de.starts,_),Me.returnEnd?0:D.length}function il(){const _=[];for(let D=Y;D!==Fe;D=D.parent)D.scope&&_.unshift(D.scope);_.forEach(D=>Re.openNode(D))}let on={};function bi(_,D){const ee=D&&D[0];if(we+=_,ee==null)return ze(),0;if(on.type==="begin"&&D.type==="end"&&on.index===D.index&&ee===""){if(we+=H.slice(D.index,D.index+1),!ke){const de=new Error(`0 width match regex (${A})`);throw de.languageName=A,de.badRule=on.rule,de}return 1}if(on=D,D.type==="begin")return nl(D);if(D.type==="illegal"&&!ie){const de=new Error('Illegal lexeme "'+ee+'" for mode "'+(Y.scope||"<unnamed>")+'"');throw de.mode=Y,de}else if(D.type==="end"){const de=rl(D);if(de!==ui)return de}if(D.type==="illegal"&&ee==="")return we+=`
`,1;if(Xn>1e5&&Xn>D.index*3)throw new Error("potential infinite loop, way more iterations than matches");return we+=ee,ee.length}const Fe=et(A);if(!Fe)throw at(xe.replace("{}",A)),new Error('Unknown language: "'+A+'"');const sl=qa(Fe);let Qn="",Y=me||sl;const yi={},Re=new z.__emitter(z);il();let we="",cn=0,lt=0,Xn=0,Kn=!1;try{if(Fe.__emitTokens)Fe.__emitTokens(H,Re);else{for(Y.matcher.considerAll();;){Xn++,Kn?Kn=!1:Y.matcher.considerAll(),Y.matcher.lastIndex=lt;const _=Y.matcher.exec(H);if(!_)break;const D=H.substring(lt,_.index),ee=bi(D,_);lt=_.index+ee}bi(H.substring(lt))}return Re.finalize(),Qn=Re.toHTML(),{language:A,value:Qn,relevance:cn,illegal:!1,_emitter:Re,_top:Y}}catch(_){if(_.message&&_.message.includes("Illegal"))return{language:A,value:Fn(H),illegal:!0,relevance:0,_illegalBy:{message:_.message,index:lt,context:H.slice(lt-100,lt+100),mode:_.mode,resultSoFar:Qn},_emitter:Re};if(ke)return{language:A,value:Fn(H),illegal:!1,relevance:0,errorRaised:_,_emitter:Re,_top:Y};throw _}}function Wn(A){const H={value:Fn(A),illegal:!1,relevance:0,_top:B,_emitter:new z.__emitter(z)};return H._emitter.addText(A),H}function Zn(A,H){H=H||z.languages||Object.keys(x);const ie=Wn(A),me=H.filter(et).filter(pi).map(ze=>Nt(ze,A,!1));me.unshift(ie);const Ee=me.sort((ze,je)=>{if(ze.relevance!==je.relevance)return je.relevance-ze.relevance;if(ze.language&&je.language){if(et(ze.language).supersetOf===je.language)return 1;if(et(je.language).supersetOf===ze.language)return-1}return 0}),[De,tt]=Ee,ln=De;return ln.secondBest=tt,ln}function Fa(A,H,ie){const me=H&&C[H]||ie;A.classList.add("hljs"),A.classList.add(`language-${me}`)}function Gn(A){let H=null;const ie=Le(A);if(G(ie))return;if(an("before:highlightElement",{el:A,language:ie}),A.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",A);return}if(A.children.length>0&&(z.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(A)),z.throwUnescapedHTML))throw new Ua("One of your code blocks includes unescaped HTML.",A.innerHTML);H=A;const me=H.textContent,Ee=ie?Se(me,{language:ie,ignoreIllegals:!0}):Zn(me);A.innerHTML=Ee.value,A.dataset.highlighted="yes",Fa(A,ie,Ee.language),A.result={language:Ee.language,re:Ee.relevance,relevance:Ee.relevance},Ee.secondBest&&(A.secondBest={language:Ee.secondBest.language,relevance:Ee.secondBest.relevance}),an("after:highlightElement",{el:A,result:Ee,text:me})}function Wa(A){z=ci(z,A)}const Za=()=>{sn(),mt("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Ga(){sn(),mt("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let di=!1;function sn(){function A(){sn()}if(document.readyState==="loading"){di||window.addEventListener("DOMContentLoaded",A,!1),di=!0;return}document.querySelectorAll(z.cssSelector).forEach(Gn)}function Qa(A,H){let ie=null;try{ie=H(w)}catch(me){if(at("Language definition for '{}' could not be registered.".replace("{}",A)),ke)at(me);else throw me;ie=B}ie.name||(ie.name=A),x[A]=ie,ie.rawDefinition=H.bind(null,w),ie.aliases&&fi(ie.aliases,{languageName:A})}function Xa(A){delete x[A];for(const H of Object.keys(C))C[H]===A&&delete C[H]}function Ka(){return Object.keys(x)}function et(A){return A=(A||"").toLowerCase(),x[A]||x[C[A]]}function fi(A,{languageName:H}){typeof A=="string"&&(A=[A]),A.forEach(ie=>{C[ie.toLowerCase()]=H})}function pi(A){const H=et(A);return H&&!H.disableAutodetect}function Ya(A){A["before:highlightBlock"]&&!A["before:highlightElement"]&&(A["before:highlightElement"]=H=>{A["before:highlightBlock"](Object.assign({block:H.el},H))}),A["after:highlightBlock"]&&!A["after:highlightElement"]&&(A["after:highlightElement"]=H=>{A["after:highlightBlock"](Object.assign({block:H.el},H))})}function Va(A){Ya(A),K.push(A)}function Ja(A){const H=K.indexOf(A);H!==-1&&K.splice(H,1)}function an(A,H){const ie=A;K.forEach(function(me){me[ie]&&me[ie](H)})}function el(A){return mt("10.7.0","highlightBlock will be removed entirely in v12.0"),mt("10.7.0","Please use highlightElement now."),Gn(A)}Object.assign(w,{highlight:Se,highlightAuto:Zn,highlightAll:sn,highlightElement:Gn,highlightBlock:el,configure:Wa,initHighlighting:Za,initHighlightingOnLoad:Ga,registerLanguage:Qa,unregisterLanguage:Xa,listLanguages:Ka,getLanguage:et,registerAliases:fi,autoDetection:pi,inherit:ci,addPlugin:Va,removePlugin:Ja}),w.debugMode=function(){ke=!1},w.safeMode=function(){ke=!0},w.versionString=Ha,w.regex={concat:g,lookahead:p,either:b,optional:u,anyNumberOfTimes:f};for(const A in ce)typeof ce[A]=="object"&&e(ce[A]);return Object.assign(w,ce),w},wt=hi({});return wt.newInstance=()=>hi({}),hn=wt,wt.HighlightJS=wt,wt.default=wt,hn}var Ai=Ei();const ge=Jn(Ai),Li="11.11.1",te=new Map,Ti="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Pe={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Pe.html="xml",Pe.xhtml="xml",Pe.markup="xml";const dn=new Set(["magic","undefined"]);let Xe=null;const fn=new Map,Ri=300*1e3;async function pn(e=Ti){if(e)return Xe||(Xe=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const s=(await t.text()).split(/\r?\n/);let r=-1;for(let h=0;h<s.length;h++)if(/\|\s*Language\s*\|/i.test(s[h])){r=h;break}if(r===-1)return;const i=s[r].replace(/^\||\|$/g,"").split("|").map(h=>h.trim().toLowerCase());let a=i.findIndex(h=>/alias|aliases|equivalent|alt|alternates?/i.test(h));a===-1&&(a=1);let o=i.findIndex(h=>/file|filename|module|module name|module-name|short|slug/i.test(h));if(o===-1){const h=i.findIndex(c=>/language/i.test(c));o=h!==-1?h:0}let l=[];for(let h=r+1;h<s.length;h++){const c=s[h].trim();if(!c||!c.startsWith("|"))break;const d=c.replace(/^\||\|$/g,"").split("|").map(m=>m.trim());if(d.every(m=>/^-+$/.test(m)))continue;const p=d;if(!p.length)continue;const u=(p[o]||p[0]||"").toString().trim().toLowerCase();if(!u||/^-+$/.test(u))continue;te.set(u,u);const g=p[a]||"";if(g){const m=String(g).split(",").map(b=>b.replace(/`/g,"").trim()).filter(Boolean);if(m.length){const y=m[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(te.set(y,y),l.push(y))}}}try{const h=[];for(const c of l){const d=String(c||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");d&&/[a-z0-9]/i.test(d)?h.push(d):te.delete(c)}l=h}catch(h){console.warn("[codeblocksManager] cleanup aliases failed",h)}try{let h=0;for(const c of Array.from(te.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){te.delete(c),h++;continue}if(/^[:]+/.test(c)){const d=c.replace(/^[:]+/,"");if(d&&/[a-z0-9]/i.test(d)){const p=te.get(c);te.delete(c),te.set(d,p)}else te.delete(c),h++}}for(const[c,d]of Array.from(te.entries()))(!d||/^-+$/.test(d)||!/[a-z0-9]/i.test(d))&&(te.delete(c),h++);try{const c=":---------------------";te.has(c)&&(te.delete(c),h++)}catch(c){console.warn("[codeblocksManager] remove sep key failed",c)}try{const c=Array.from(te.keys()).sort()}catch(c){console.warn("[codeblocksManager] compute supported keys failed",c)}}catch(h){console.warn("[codeblocksManager] ignored error",h)}}catch(t){console.warn("[codeblocksManager] loadSupportedLanguages failed",t)}})(),Xe)}const bt=new Set;async function ot(e,t){if(Xe||(async()=>{try{await pn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Xe)try{await Xe}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(dn.has(n))return!1;if(te.size&&!te.has(n)){const r=Pe;if(!r[n]&&!r[e])return!1}if(bt.has(e))return!0;const s=Pe;try{const r=(t||e||"").toString().replace(/\.js$/i,"").trim(),i=(s[e]||e||"").toString(),a=(s[r]||r||"").toString();let o=Array.from(new Set([i,a,r,e,s[r],s[e]].filter(Boolean))).map(c=>String(c).toLowerCase()).filter(c=>c&&c!=="undefined");te.size&&(o=o.filter(c=>{if(te.has(c))return!0;const d=Pe[c];return!!(d&&te.has(d))}));let l=null,h=null;for(const c of o)try{const d=Date.now();let p=fn.get(c);if(p&&p.ok===!1&&d-(p.ts||0)>=Ri&&(fn.delete(c),p=void 0),p){if(p.module)l=p.module;else if(p.promise)try{l=await p.promise}catch{l=null}}else{const f={promise:null,module:null,ok:null,ts:0};fn.set(c,f),f.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${c}.js`)}catch{return await import(`highlight.js/lib/languages/${c}`)}}catch{try{const g=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;return await new Function("u","return import(u)")(g)}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;return await new Function("u","return import(u)")(m)}catch{return null}}}}catch{return null}})();try{l=await f.promise,f.module=l,f.ok=!!l,f.ts=Date.now()}catch{f.module=null,f.ok=!1,f.ts=Date.now(),l=null}}if(l){const f=l.default||l;try{const u=te.size&&te.get(e)||c||e;return ge.registerLanguage(u,f),bt.add(u),u!==e&&(ge.registerLanguage(e,f),bt.add(e)),!0}catch(u){h=u}}else try{if(te.has(c)||te.has(e)){const f=()=>({});try{ge.registerLanguage(c,f),bt.add(c)}catch{}try{c!==e&&(ge.registerLanguage(e,f),bt.add(e))}catch{}return!0}}catch{}}catch(d){h=d}if(h)throw h;return!1}catch{return!1}}let Ot=null;function tr(e=document){Xe||(async()=>{try{await pn()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const t=Pe,s=Ot||(typeof IntersectionObserver>"u"?null:(Ot=new IntersectionObserver((i,a)=>{i.forEach(o=>{if(!o.isIntersecting)return;const l=o.target;try{a.unobserve(l)}catch(h){console.warn("[codeblocksManager] observer unobserve failed",h)}(async()=>{try{const h=l.getAttribute&&l.getAttribute("class")||l.className||"",c=h.match(/language-([a-zA-Z0-9_+-]+)/)||h.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const d=(c[1]||"").toLowerCase(),p=t[d]||d,f=te.size&&(te.get(p)||te.get(String(p).toLowerCase()))||p;try{await ot(f)}catch(u){console.warn("[codeblocksManager] registerLanguage failed",u)}try{try{const u=l.textContent||l.innerText||"";u!=null&&(l.textContent=u)}catch{}try{l&&l.dataset&&l.dataset.highlighted&&delete l.dataset.highlighted}catch{}ge.highlightElement(l)}catch(u){console.warn("[codeblocksManager] hljs.highlightElement failed",u)}}else try{const d=l.textContent||"";try{if(ge&&typeof ge.getLanguage=="function"&&ge.getLanguage("plaintext")){const p=ge.highlight(d,{language:"plaintext"});p&&p.value&&(l.innerHTML=p.value)}}catch{try{ge.highlightElement(l)}catch(f){console.warn("[codeblocksManager] fallback highlightElement failed",f)}}}catch(d){console.warn("[codeblocksManager] auto-detect plaintext failed",d)}}catch(h){console.warn("[codeblocksManager] observer entry processing failed",h)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Ot)),r=e&&e.querySelectorAll?e.querySelectorAll("pre code"):[];if(!s){r.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",o=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const l=(o[1]||"").toLowerCase(),h=t[l]||l,c=te.size&&(te.get(h)||te.get(String(h).toLowerCase()))||h;try{await ot(c)}catch(d){console.warn("[codeblocksManager] registerLanguage failed (no observer)",d)}}try{try{const l=i.textContent||i.innerText||"";l!=null&&(i.textContent=l)}catch{}try{i&&i.dataset&&i.dataset.highlighted&&delete i.dataset.highlighted}catch{}ge.highlightElement(i)}catch(l){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function Ci(e,{useCdn:t=!0}={}){const n=document.querySelector("link[data-hl-theme]"),s=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=e==null?"default":String(e),i=r&&String(r).toLowerCase()||"";if(i==="default"||i==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(s&&s.toLowerCase()===i)return;if(!t){console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");return}const a=i,o=`https://cdn.jsdelivr.net/npm/highlight.js@${Li}/styles/${a}.css`,l=document.createElement("link");l.rel="stylesheet",l.href=o,l.setAttribute("data-hl-theme",a),l.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(l)}let nt="light";function Mi(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([s,r])=>n.setAttribute(s,r)),document.head.appendChild(n),t["data-bulmaswatch-theme"]){const s=new MutationObserver(()=>{try{const r=n.parentNode;if(!r)return;r.lastElementChild!==n&&r.appendChild(n)}catch{}});try{s.observe(document.head,{childList:!0})}catch{}}}async function nr(e="none",t="/"){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.debug("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e||e==="none")return;const s=[t+"bulma.css","/bulma.css"],r=Array.from(new Set(s));if(e==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const i of r)try{const a=await fetch(i,{method:"GET"});if(a.ok){const o=await a.text(),l=document.createElement("style");l.setAttribute("data-bulma-override",i),l.appendChild(document.createTextNode(`
/* bulma override: ${i} */
`+o)),document.head.appendChild(l);return}}catch(a){console.warn("[bulmaManager] fetch local bulma candidate failed",a)}return}try{const i=String(e).trim();if(!i)return;const a=`https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`;Mi(a,{"data-bulmaswatch-theme":i})}catch(i){console.warn("[bulmaManager] ensureBulma failed",i)}}function rr(e){nt=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)nt==="dark"?n.setAttribute("data-theme","dark"):nt==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;nt==="dark"?n.setAttribute("data-theme","dark"):nt==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function _i(e){const t=document.documentElement;for(const[n,s]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,s)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function ir(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest&&e.closest(".nimbi-mount")||null;try{t&&(nt==="dark"?t.setAttribute("data-theme","dark"):nt==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}const sr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},ct=JSON.parse(JSON.stringify(sr));let qt="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages&&navigator.languages[0]||"en";qt=String(e).split("-")[0].toLowerCase()}sr[qt]||(qt="en");let Ke=qt;function ut(e,t={}){const n=ct[Ke]||ct.en;let s=n&&n[e]?n[e]:ct.en[e]||"";for(const r of Object.keys(t))s=s.replace(new RegExp(`{${r}}`,"g"),String(t[r]));return s}async function gn(e,t){if(!e)return;let n=e;try{/^https?:\/\//.test(e)||(n=new URL(e,location.origin+t).toString());const s=await fetch(n);if(!s.ok)return;const r=await s.json();for(const i of Object.keys(r||{}))ct[i]=Object.assign({},ct[i]||{},r[i])}catch{}}function mn(e){const t=String(e).split("-")[0].toLowerCase();Ke=ct[t]?t:"en"}const $i=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Ke},loadL10nFile:gn,setLang:mn,t:ut},Symbol.toStringTag,{value:"Module"})),Pi=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function ar(e,t="worker"){let n=null;function s(){if(!n)try{const o=e();n=o||null,o&&o.addEventListener("error",()=>{try{n===o&&(n=null,o.terminate&&o.terminate())}catch(l){console.warn("["+t+"] worker termination failed",l)}})}catch(o){n=null,console.warn("["+t+"] worker init failed",o)}return n}function r(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(o){console.warn("["+t+"] worker termination failed",o)}}function i(o,l=1e3){return new Promise((h,c)=>{const d=s();if(!d)return c(new Error("worker unavailable"));const p=String(Math.random());o.id=p;let f=null;const u=()=>{f&&clearTimeout(f),d.removeEventListener("message",g),d.removeEventListener("error",m)},g=b=>{const y=b.data||{};y.id===p&&(u(),y.error?c(new Error(y.error)):h(y.result))},m=b=>{u(),console.warn("["+t+"] worker error event",b);try{n===d&&(n=null,d.terminate&&d.terminate())}catch(y){console.warn("["+t+"] worker termination failed",y)}c(new Error(b&&b.message||"worker error"))};f=setTimeout(()=>{u(),console.warn("["+t+"] worker timed out");try{n===d&&(n=null,d.terminate&&d.terminate())}catch(b){console.warn("["+t+"] worker termination on timeout failed",b)}c(new Error("worker timeout"))},l),d.addEventListener("message",g),d.addEventListener("error",m);try{d.postMessage(o)}catch(b){u(),c(b)}})}return{get:s,send:i,terminate:r}}function Ii(e){try{if(typeof Blob<"u"&&typeof URL<"u"&&e){const t=new Blob([e],{type:"application/javascript"}),n=URL.createObjectURL(t);return new Worker(n,{type:"module"})}}catch(t){console.warn("[worker-manager] createWorkerFromRaw failed",t)}return null}const He=new Set;function wn(e){zi(),He.clear();for(const t of Ie)t&&He.add(t);lr(V),lr(U),wn._refreshed=!0}function lr(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&He.add(t)}function or(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,s){return s&&He.add(s),t.call(this,n,s)}}let cr=!1;function zi(){cr||(or(V),or(U),cr=!0)}function ur(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}function ye(e){return String(e||"").replace(/^[.\/]+/,"")}function yt(e){return String(e||"").replace(/\/+$/,"")}function kt(e){return yt(e)+"/"}function Ni(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=e,document.head.appendChild(n)}catch(t){console.warn("[helpers] preloadImage failed",t)}}function Dt(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const s=Array.from(e.querySelectorAll("img"));if(!s.length)return;const r=e,i=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,o=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=i?Math.max(a,i.top):a,c=(i?Math.min(o,i.bottom):o)+Number(t||0);let d=0;r&&(d=r.clientHeight||(i?i.height:0)),d||(d=o-a);let p=.6;try{const m=r&&window.getComputedStyle?window.getComputedStyle(r):null,b=m&&m.getPropertyValue("--nimbi-image-max-height-ratio"),y=b?parseFloat(b):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(p=y)}catch(m){console.warn("[helpers] read CSS ratio failed",m)}const f=Math.max(200,Math.floor(d*p));let u=!1,g=null;if(s.forEach(m=>{try{const b=m.getAttribute?m.getAttribute("loading"):void 0;b!=="eager"&&m.setAttribute&&m.setAttribute("loading","lazy");const y=m.getBoundingClientRect?m.getBoundingClientRect():null,v=m.src||m.getAttribute&&m.getAttribute("src"),M=y&&y.height>1?y.height:f,I=y?y.top:0,F=I+M;y&&M>0&&I<=c&&F>=l&&(m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high"),Ni(v),u=!0),!g&&y&&y.top<=c&&(g={img:m,src:v,rect:y,beforeLoading:b})}catch(b){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",b)}}),!u&&g){const{img:m,src:b,rect:y,beforeLoading:v}=g;try{m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high")}catch(M){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",M)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function be(e,t=null,n){try{const s=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",r=new URLSearchParams(s.startsWith("?")?s.slice(1):s),i=String(e||"");r.delete("page");const a=new URLSearchParams;a.set("page",i);for(const[h,c]of r.entries())a.append(h,c);const o=a.toString();let l=o?`?${o}`:"";return t&&(l+=`#${encodeURIComponent(t)}`),l||`?page=${encodeURIComponent(i)}`}catch{const r=`?page=${encodeURIComponent(String(e||""))}`;return t?`${r}#${encodeURIComponent(t)}`:r}}function Ht(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):t}catch(t){console.warn("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Ht)}catch(e){console.warn("[helpers] global attach failed",e)}const V=new Map;let _e=[],bn=!1;function Bi(e){bn=!!e}function hr(e){_e=Array.isArray(e)?e.slice():[]}function Oi(){return _e}const dr=ar(()=>Ii(Pi),"slugManager");function yn(){return dr.get()}function fr(e){return dr.send(e)}async function qi(e,t=1,n=void 0){if(!yn())return Gt(e,t,n);try{return await fr({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n})}catch(r){try{return await Gt(e,t,n)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),r}}}async function Di(e,t,n){return yn()?fr({type:"crawlForSlug",slug:e,base:t,maxQueue:n}):Sn(e,t,n)}function Ye(e,t){if(e)if(_e&&_e.length){const s=t.split("/")[0],r=_e.includes(s);let i=V.get(e);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),r?i.langs[s]=t:i.default=t,V.set(e,i)}else V.set(e,t)}const Ut=new Set;function Hi(e){typeof e=="function"&&Ut.add(e)}function Ui(e){typeof e=="function"&&Ut.delete(e)}const U=new Map;let kn={},Ie=[],ht="_404.md",dt="_home.md";function xn(e){e!=null&&(ht=String(e||""))}function ji(e){e!=null&&(dt=String(e||""))}function Fi(e){kn=e||{}}const xt=new Map,jt=new Set;function Wi(){xt.clear(),jt.clear()}function Zi(e){if(!e||e.length===0)return"";let t=e[0];for(let s=1;s<e.length;s++){const r=e[s];let i=0;const a=Math.min(t.length,r.length);for(;i<a&&t[i]===r[i];)i++;t=t.slice(0,i)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}function Ft(e){V.clear(),U.clear(),Ie=[],_e=_e||[];const t=Object.keys(kn||{});if(!t.length)return;let n="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?n=new URL(String(e)).pathname:n=String(e||"")}catch(s){n=String(e||""),console.warn("[slugManager] parse contentBase failed",s)}n=kt(n)}}catch(s){n="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}n||(n=Zi(t));for(const s of t){let r=s;n&&s.startsWith(n)?r=ye(s.slice(n.length)):r=ye(s),Ie.push(r);try{wn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=kn[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const o=le(a[1].trim());if(o)try{let l=o;if((!_e||!_e.length)&&(l=pr(l,new Set(V.keys()))),_e&&_e.length){const c=r.split("/")[0],d=_e.includes(c);let p=V.get(l);(!p||typeof p=="string")&&(p={default:typeof p=="string"?p:void 0,langs:{}}),d?p.langs[c]=r:p.default=r,V.set(l,p)}else V.set(l,r);U.set(r,l)}catch(l){console.warn("[slugManager] set slug mapping failed",l)}}}}}try{Ft()}catch(e){console.warn("[slugManager] initial setContentBase failed",e)}function le(e){let n=String(e||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function pr(e,t){if(!t.has(e))return e;let n=2,s=`${e}-${n}`;for(;t.has(s);)n+=1,s=`${e}-${n}`;return s}function Gi(e){return St(e,void 0)}function St(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),s=new URL(t);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),s=new URL(t);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!1}function Wt(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function vt(e){if(!e||!V.has(e))return null;const t=V.get(e);if(!t)return null;if(typeof t=="string")return t;if(_e&&_e.length&&Ke&&t.langs&&t.langs[Ke])return t.langs[Ke];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}const Et=new Map;function Qi(){Et.clear()}let Ae=async function(e,t){if(!e)throw new Error("path required");try{const i=(String(e||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&V.has(i)){const a=vt(i)||V.get(i);a&&a!==e&&(e=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const n=t==null?"":yt(String(t));let s="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))s=n.replace(/\/$/,"")+"/"+e.replace(/^\//,"");else if(n.startsWith("/"))s=n.replace(/\/$/,"")+"/"+e.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=n.startsWith("/")?n:"/"+n;s=i+a.replace(/\/$/,"")+"/"+e.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}catch{s="/"+e.replace(/^\//,"")}if(Et.has(s))return Et.get(s);const r=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const d=`${n}/${ht}`,p=await globalThis.fetch(d);if(p&&typeof p.ok=="boolean"&&p.ok)return{raw:await p.text(),status:404}}catch(d){console.warn("[slugManager] fetching fallback 404 failed",d)}let c="";try{i&&typeof i.clone=="function"?c=await i.clone().text():i&&typeof i.text=="function"?c=await i.text():c=""}catch(d){c="",console.warn("[slugManager] reading error body failed",d)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:c.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),o=a.trim().slice(0,16).toLowerCase(),l=o.startsWith("<!doctype")||o.startsWith("<html"),h=l||String(e||"").toLowerCase().endsWith(".html");if(l&&String(e||"").toLowerCase().endsWith(".md")){try{const c=`${n}/${ht}`,d=await globalThis.fetch(c);if(d.ok)return{raw:await d.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return h?{raw:a,isHtml:!0}:{raw:a}})();return Et.set(s,r),r};function Xi(e){typeof e=="function"&&(Ae=e)}const Zt=new Map;function Ki(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}let Ze=[],At=null;async function Gt(e,t=1,n=void 0){const s=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>ye(String(r||""))))):[];try{const r=ye(String(ht||""));r&&!s.includes(r)&&s.push(r)}catch{}if(Ze&&Ze.length&&t===1&&!Ze.some(i=>{try{return s.includes(ye(String(i.path||"")))}catch{return!1}}))return Ze;if(At)return At;At=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(h=>ye(String(h||""))))):[];try{const h=ye(String(ht||""));h&&!r.includes(h)&&r.push(h)}catch{}const i=h=>{if(!r||!r.length)return!1;for(const c of r)if(c&&(h===c||h.startsWith(c+"/")))return!0;return!1};let a=[];if(Ie&&Ie.length&&(a=Array.from(Ie)),!a.length)for(const h of V.values())h&&a.push(h);try{const h=await br(e);h&&h.length&&(a=a.concat(h))}catch(h){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",h)}try{const h=new Set(a),c=[...a];for(h.size;c.length&&h.size<=Lt;){const d=c.shift();try{const p=await Ae(d,e);if(p&&p.raw){if(p.status===404)continue;let f=p.raw;const u=[],g=String(d||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(g)&&bn&&(!d||!d.includes("/")))continue;const m=Ki(f),b=/\[[^\]]+\]\(([^)]+)\)/g;let y;for(;y=b.exec(m);)u.push(y[1]);const v=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;y=v.exec(m);)u.push(y[1]);const M=d&&d.includes("/")?d.substring(0,d.lastIndexOf("/")+1):"";for(let I of u)try{if(St(I,e)||I.startsWith("..")||I.indexOf("/../")!==-1||(M&&!I.startsWith("./")&&!I.startsWith("/")&&!I.startsWith("../")&&(I=M+I),I=ye(I),!/\.(md|html?)(?:$|[?#])/i.test(I))||(I=I.split(/[?#]/)[0],i(I)))continue;h.has(I)||(h.add(I),c.push(I),a.push(I))}catch(F){console.warn("[slugManager] href processing failed",I,F)}}}catch(p){console.warn("[slugManager] discovery fetch failed for",d,p)}}}catch(h){console.warn("[slugManager] discovery loop failed",h)}const o=new Set;a=a.filter(h=>!h||o.has(h)||i(h)?!1:(o.add(h),!0));const l=[];for(const h of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(h))try{const c=await Ae(h,e);if(c&&c.raw){if(c.status===404)continue;let d="",p="";if(c.isHtml)try{const g=new DOMParser().parseFromString(c.raw,"text/html"),m=g.querySelector("title")||g.querySelector("h1");m&&m.textContent&&(d=m.textContent.trim());const b=g.querySelector("p");if(b&&b.textContent&&(p=b.textContent.trim()),t>=2)try{const y=g.querySelector("h1"),v=y&&y.textContent?y.textContent.trim():d||"",M=(()=>{try{if(U.has(h))return U.get(h)}catch{}return le(d||h)})(),I=Array.from(g.querySelectorAll("h2"));for(const F of I)try{const Z=(F.textContent||"").trim();if(!Z)continue;const W=F.id?F.id:le(Z),fe=M?`${M}::${W}`:`${le(h)}::${W}`;let $="",q=F.nextElementSibling;for(;q&&q.tagName&&q.tagName.toLowerCase()==="script";)q=q.nextElementSibling;q&&q.textContent&&($=String(q.textContent).trim()),l.push({slug:fe,title:Z,excerpt:$,path:h,parentTitle:v})}catch(Z){console.warn("[slugManager] indexing H2 failed",Z)}if(t===3)try{const F=Array.from(g.querySelectorAll("h3"));for(const Z of F)try{const W=(Z.textContent||"").trim();if(!W)continue;const fe=Z.id?Z.id:le(W),$=M?`${M}::${fe}`:`${le(h)}::${fe}`;let q="",Q=Z.nextElementSibling;for(;Q&&Q.tagName&&Q.tagName.toLowerCase()==="script";)Q=Q.nextElementSibling;Q&&Q.textContent&&(q=String(Q.textContent).trim()),l.push({slug:$,title:W,excerpt:q,path:h,parentTitle:v})}catch(W){console.warn("[slugManager] indexing H3 failed",W)}}catch(F){console.warn("[slugManager] collect H3s failed",F)}}catch(y){console.warn("[slugManager] collect H2s failed",y)}}catch(u){console.warn("[slugManager] parsing HTML for index failed",u)}else{const u=c.raw,g=u.match(/^#\s+(.+)$/m);d=g?g[1].trim():"";try{d=Wt(d)}catch{}const m=u.split(/\r?\n\s*\r?\n/);if(m.length>1)for(let b=1;b<m.length;b++){const y=m[b].trim();if(y&&!/^#/.test(y)){p=y.replace(/\r?\n/g," ");break}}if(t>=2){let b="",y="";try{const v=(u.match(/^#\s+(.+)$/m)||[])[1];b=v?v.trim():"",y=(function(){try{if(U.has(h))return U.get(h)}catch{}return le(d||h)})();const M=/^##\s+(.+)$/gm;let I;for(;I=M.exec(u);)try{const F=(I[1]||"").trim(),Z=Wt(F);if(!F)continue;const W=le(F),fe=y?`${y}::${W}`:`${le(h)}::${W}`,q=u.slice(M.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),Q=q&&q[1]?String(q[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";l.push({slug:fe,title:Z,excerpt:Q,path:h,parentTitle:b})}catch(F){console.warn("[slugManager] indexing markdown H2 failed",F)}}catch(v){console.warn("[slugManager] collect markdown H2s failed",v)}if(t===3)try{const v=/^###\s+(.+)$/gm;let M;for(;M=v.exec(u);)try{const I=(M[1]||"").trim(),F=Wt(I);if(!I)continue;const Z=le(I),W=y?`${y}::${Z}`:`${le(h)}::${Z}`,$=u.slice(v.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),q=$&&$[1]?String($[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";l.push({slug:W,title:F,excerpt:q,path:h,parentTitle:b})}catch(I){console.warn("[slugManager] indexing markdown H3 failed",I)}}catch(v){console.warn("[slugManager] collect markdown H3s failed",v)}}}let f="";try{U.has(h)&&(f=U.get(h))}catch(u){console.warn("[slugManager] mdToSlug access failed",u)}f||(f=le(d||h)),l.push({slug:f,title:d,excerpt:p,path:h})}}catch(c){console.warn("[slugManager] buildSearchIndex: entry fetch failed",c)}try{Ze=l.filter(c=>{try{return!i(String(c.path||""))}catch{return!0}})}catch(h){console.warn("[slugManager] filtering index by excludes failed",h),Ze=l}return Ze})();try{await At}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return At=null,Ze}const gr=1e3;let Lt=gr;function Yi(e){typeof e=="number"&&e>=0&&(Lt=e)}const mr=new DOMParser,wr="a[href]";let Sn=async function(e,t,n=Lt){if(Zt.has(e))return Zt.get(e);let s=null;const r=new Set,i=[""];for(;i.length&&!s&&!(i.length>n);){const a=i.shift();if(r.has(a))continue;r.add(a);let o=t;o.endsWith("/")||(o+="/"),o+=a;try{let l;try{l=await globalThis.fetch(o)}catch(p){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:o,error:p});continue}if(!l||!l.ok){l&&!l.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:o,status:l.status});continue}const h=await l.text(),d=mr.parseFromString(h,"text/html").querySelectorAll(wr);for(const p of d)try{let f=p.getAttribute("href")||"";if(!f||St(f,t)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const u=a+f;r.has(u)||i.push(u);continue}if(f.toLowerCase().endsWith(".md")){const u=ye(a+f);try{if(U.has(u))continue;for(const g of V.values());}catch(g){console.warn("[slugManager] slug map access failed",g)}try{const g=await Ae(u,t);if(g&&g.raw){const m=(g.raw||"").match(/^#\s+(.+)$/m);if(m&&m[1]&&le(m[1].trim())===e){s=u;break}}}catch(g){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",g)}}}catch(f){console.warn("[slugManager] crawlForSlug: link iteration failed",f)}}catch(l){console.warn("[slugManager] crawlForSlug: directory fetch failed",l)}}return Zt.set(e,s),s};async function br(e,t=Lt){const n=new Set,s=new Set,r=[""];for(;r.length&&!(r.length>t);){const i=r.shift();if(s.has(i))continue;s.add(i);let a=e;a.endsWith("/")||(a+="/"),a+=i;try{let o;try{o=await globalThis.fetch(a)}catch(d){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:d});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:o.status});continue}const l=await o.text(),c=mr.parseFromString(l,"text/html").querySelectorAll(wr);for(const d of c)try{let p=d.getAttribute("href")||"";if(!p||St(p,e)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const u=i+p;s.has(u)||r.push(u);continue}const f=(i+p).replace(/^\/+/,"");/\.(md|html?)$/i.test(f)&&n.add(f)}catch(p){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",p)}}catch(o){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",o)}}return Array.from(n)}async function yr(e,t,n){if(e&&typeof e=="string"&&(e=ye(e),e=yt(e)),V.has(e))return vt(e)||V.get(e);for(const r of Ut)try{const i=await r(e,t);if(i)return Ye(e,i),U.set(i,e),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(Ie&&Ie.length){if(xt.has(e)){const r=xt.get(e);return V.set(e,r),U.set(r,e),r}for(const r of Ie)if(!jt.has(r))try{const i=await Ae(r,t);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const o=le(a[1].trim());if(jt.add(r),o&&xt.set(o,r),o===e)return Ye(e,r),U.set(r,e),r}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const r=await Gt(t);if(r&&r.length){const i=r.find(a=>a.slug===e);if(i)return Ye(e,i.path),U.set(i.path,e),i.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await Sn(e,t,n);if(r)return Ye(e,r),U.set(r,e),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const s=[`${e}.html`,`${e}.md`];for(const r of s)try{const i=await Ae(r,t);if(i&&i.raw)return Ye(e,r),U.set(r,e),r}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(Ie&&Ie.length)for(const r of Ie)try{const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(i)===e)return Ye(e,r),U.set(r,e),r}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const r=[];dt&&typeof dt=="string"&&dt.trim()&&r.push(dt),r.includes("_home.md")||r.push("_home.md");for(const i of r)try{const a=await Ae(i,t);if(a&&a.raw){const o=(a.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]&&le(o[1].trim())===e)return Ye(e,i),U.set(i,e),i}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const Qt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:gr,_setAllMd:Fi,_storeSlugMapping:Ye,addSlugResolver:Hi,get allMarkdownPaths(){return Ie},get availableLanguages(){return _e},buildSearchIndex:Gt,buildSearchIndexWorker:qi,clearFetchCache:Qi,clearListCaches:Wi,crawlAllMarkdown:br,crawlCache:Zt,crawlForSlug:Sn,crawlForSlugWorker:Di,get defaultCrawlMaxQueue(){return Lt},ensureSlug:yr,fetchCache:Et,get fetchMarkdown(){return Ae},getLanguages:Oi,get homePage(){return dt},initSlugWorker:yn,isExternalLink:Gi,isExternalLinkWithBase:St,listPathsFetched:jt,listSlugCache:xt,mdToSlug:U,get notFoundPage(){return ht},removeSlugResolver:Ui,resolveSlugPath:vt,get searchIndex(){return Ze},setContentBase:Ft,setDefaultCrawlMaxQueue:Yi,setFetchMarkdown:Xi,setHomePage:ji,setLanguages:hr,setNotFoundPage:xn,setSkipRootReadme:Bi,get skipRootReadme(){return bn},slugResolvers:Ut,slugToMd:V,slugify:le,unescapeMarkdown:Wt,uniqueSlug:pr},Symbol.toStringTag,{value:"Module"}));let kr=100;function xr(e){kr=e}let Tt=300*1e3;function Sr(e){Tt=e}const Ne=new Map;function Vi(e){if(!Ne.has(e))return;const t=Ne.get(e),n=Date.now();if(t.ts+Tt<n){Ne.delete(e);return}return Ne.delete(e),Ne.set(e,t),t.value}function Ji(e,t){if(vr(),vr(),Ne.delete(e),Ne.set(e,{value:t,ts:Date.now()}),Ne.size>kr){const n=Ne.keys().next().value;n!==void 0&&Ne.delete(n)}}function vr(){if(!Tt||Tt<=0)return;const e=Date.now();for(const[t,n]of Ne.entries())n.ts+Tt<e&&Ne.delete(t)}async function es(e,t){const n=new Set(He),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(s||[])){const i=r.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const o=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(o){let d=ye(o[1]);d&&n.add(d);continue}const l=(r.textContent||"").trim(),h=(a.pathname||"").replace(/^.*\//,"");if(l&&le(l)===e||h&&le(h.replace(/\.(html?|md)$/i,""))===e)return a.toString();if(/\.(html?)$/i.test(a.pathname)){let d=a.pathname.replace(/^\//,"");n.add(d);continue}const c=a.pathname||"";if(c){const d=new URL(t),p=kt(d.pathname);if(c.indexOf(p)!==-1){let f=c.startsWith(p)?c.slice(p.length):c;f=ye(f),f&&n.add(f)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const i=await Ae(r,t);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const o=(a[1]||"").trim();if(o&&le(o)===e)return r}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function ts(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e||""));if(V.has(n)){const s=vt(n)||V.get(n);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||t.push(s):(t.push(s),t.push(s+".html")))}else{if(He&&He.size)for(const s of He){const r=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(r)===n&&!/index\.html$/i.test(s)){t.push(s);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return t}async function ns(e,t){const n=e||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=e||"",i=null;if(r&&String(r).includes("::")){const u=String(r).split("::",2);r=u[0],i=u[1]||null}const o=`${e}|||${typeof $i<"u"&&Ke?Ke:""}`,l=Vi(o);if(l)r=l.resolved,i=l.anchor||i;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let u=decodeURIComponent(String(r||""));if(u&&typeof u=="string"&&(u=ye(u),u=yt(u)),V.has(u))r=vt(u)||V.get(u);else{let g=await es(u,t);if(g)r=g;else if(wn._refreshed&&He&&He.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const m=await yr(u,t);m&&(r=m)}}}Ji(o,{resolved:r,anchor:i})}!i&&s&&(i=s);try{if(r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const u=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const g=await fetch(u);if(g&&g.ok){const m=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",y=(m||"").toLowerCase();if(b&&b.indexOf&&b.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1)return{data:{raw:m,isHtml:!0},pagePath:u.replace(/^\//,""),anchor:i}}}catch{}}}catch{}const h=ts(r),c=String(n||"").includes(".md")||String(n||"").includes(".html");if(c&&h.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&h.push(r),h.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&h.push(r),h.length===1&&/index\.html$/i.test(h[0])&&!c&&!V.has(r)&&!V.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let d=null,p=null,f=null;for(const u of h)if(u)try{const g=ye(u);d=await Ae(g,t),p=g;break}catch(g){f=g;try{console.warn("[router] candidate fetch failed",{candidate:u,contentBase:t,err:g&&g.message||g})}catch{}}if(!d){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:h,contentBase:t,fetchError:f&&(f.message||String(f))||null})}catch{}try{if(c&&String(n||"").toLowerCase().includes(".html"))try{const u=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",u);const g=await fetch(u);if(g&&g.ok){const m=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",y=(m||"").toLowerCase(),v=b&&b.indexOf&&b.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1;if(v||console.warn("[router] absolute fetch returned non-HTML",{abs:u,contentType:b,snippet:y.slice(0,200)}),v)try{const M=u,I=new URL(".",M).toString();try{const Z=typeof DOMParser<"u"?new DOMParser:null;if(Z){const W=Z.parseFromString(m||"","text/html"),fe=(O,oe)=>{try{const X=oe.getAttribute(O)||"";if(!X||/^(https?:)?\/\//i.test(X)||X.startsWith("/")||X.startsWith("#"))return;try{const S=new URL(X,M).toString();oe.setAttribute(O,S)}catch(S){console.warn("[router] rewrite attribute failed",O,S)}}catch(X){console.warn("[router] rewrite helper failed",X)}},$=W.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),q=[];for(const O of Array.from($||[]))try{const oe=O.tagName?O.tagName.toLowerCase():"";if(oe==="a")continue;if(O.hasAttribute("src")){const X=O.getAttribute("src");fe("src",O);const S=O.getAttribute("src");X!==S&&q.push({attr:"src",tag:oe,before:X,after:S})}if(O.hasAttribute("href")&&oe==="link"){const X=O.getAttribute("href");fe("href",O);const S=O.getAttribute("href");X!==S&&q.push({attr:"href",tag:oe,before:X,after:S})}if(O.hasAttribute("href")&&oe!=="link"){const X=O.getAttribute("href");fe("href",O);const S=O.getAttribute("href");X!==S&&q.push({attr:"href",tag:oe,before:X,after:S})}if(O.hasAttribute("xlink:href")){const X=O.getAttribute("xlink:href");fe("xlink:href",O);const S=O.getAttribute("xlink:href");X!==S&&q.push({attr:"xlink:href",tag:oe,before:X,after:S})}if(O.hasAttribute("poster")){const X=O.getAttribute("poster");fe("poster",O);const S=O.getAttribute("poster");X!==S&&q.push({attr:"poster",tag:oe,before:X,after:S})}if(O.hasAttribute("srcset")){const J=(O.getAttribute("srcset")||"").split(",").map(re=>re.trim()).filter(Boolean).map(re=>{const[E,L]=re.split(/\s+/,2);if(!E||/^(https?:)?\/\//i.test(E)||E.startsWith("/"))return re;try{const T=new URL(E,M).toString();return L?`${T} ${L}`:T}catch{return re}}).join(", ");O.setAttribute("srcset",J)}}catch{}const Q=W.documentElement&&W.documentElement.outerHTML?W.documentElement.outerHTML:m;try{q&&q.length&&console.warn("[router] rewritten asset refs",{abs:u,rewritten:q})}catch{}return{data:{raw:Q,isHtml:!0},pagePath:String(n||""),anchor:i}}}catch{}let F=m;return/<base\s+[^>]*>/i.test(m)||(/<head[^>]*>/i.test(m)?F=m.replace(/(<head[^>]*>)/i,`$1<base href="${I}">`):F=`<base href="${I}">`+m),{data:{raw:F,isHtml:!0},pagePath:String(n||""),anchor:i}}catch{return{data:{raw:m,isHtml:!0},pagePath:String(n||""),anchor:i}}}}catch(u){console.warn("[router] absolute HTML fetch fallback failed",u)}}catch{}try{const u=decodeURIComponent(String(r||""));if(u&&!/\.(md|html?)$/i.test(u)){const g=[`/assets/${u}.html`,`/assets/${u}/index.html`];for(const m of g)try{const b=await fetch(m,{method:"GET"});if(b&&b.ok)return{data:{raw:await b.text(),isHtml:!0},pagePath:m.replace(/^\//,""),anchor:i}}catch{}}}catch(u){console.warn("[router] assets fallback failed",u)}throw new Error("no page data")}return{data:d,pagePath:p,anchor:i}}function vn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var rt=vn();function Er(e){rt=e}var it={exec:()=>null};function se(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace($e.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,t)};return s}var rs=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),$e={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},is=/^(?:[ \t]*(?:\n|$))+/,ss=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,as=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Rt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ls=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,En=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Ar=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Lr=se(Ar).replace(/bull/g,En).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),os=se(Ar).replace(/bull/g,En).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),An=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,cs=/^[^\n]+/,Ln=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,us=se(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Ln).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),hs=se(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,En).getRegex(),Xt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Tn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ds=se("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Tn).replace("tag",Xt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Tr=se(An).replace("hr",Rt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Xt).getRegex(),fs=se(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Tr).getRegex(),Rn={blockquote:fs,code:ss,def:us,fences:as,heading:ls,hr:Rt,html:ds,lheading:Lr,list:hs,newline:is,paragraph:Tr,table:it,text:cs},Rr=se("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Rt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Xt).getRegex(),ps={...Rn,lheading:os,table:Rr,paragraph:se(An).replace("hr",Rt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Rr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Xt).getRegex()},gs={...Rn,html:se(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Tn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:it,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:se(An).replace("hr",Rt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Lr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ms=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ws=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Cr=/^( {2,}|\\)\n(?!\s*$)/,bs=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Kt=/[\p{P}\p{S}]/u,Cn=/[\s\p{P}\p{S}]/u,Mr=/[^\s\p{P}\p{S}]/u,ys=se(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Cn).getRegex(),_r=/(?!~)[\p{P}\p{S}]/u,ks=/(?!~)[\s\p{P}\p{S}]/u,xs=/(?:[^\s\p{P}\p{S}]|~)/u,$r=/(?![*_])[\p{P}\p{S}]/u,Ss=/(?![*_])[\s\p{P}\p{S}]/u,vs=/(?:[^\s\p{P}\p{S}]|[*_])/u,Es=se(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",rs?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Pr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,As=se(Pr,"u").replace(/punct/g,Kt).getRegex(),Ls=se(Pr,"u").replace(/punct/g,_r).getRegex(),Ir="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ts=se(Ir,"gu").replace(/notPunctSpace/g,Mr).replace(/punctSpace/g,Cn).replace(/punct/g,Kt).getRegex(),Rs=se(Ir,"gu").replace(/notPunctSpace/g,xs).replace(/punctSpace/g,ks).replace(/punct/g,_r).getRegex(),Cs=se("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Mr).replace(/punctSpace/g,Cn).replace(/punct/g,Kt).getRegex(),Ms=se(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,$r).getRegex(),_s="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",$s=se(_s,"gu").replace(/notPunctSpace/g,vs).replace(/punctSpace/g,Ss).replace(/punct/g,$r).getRegex(),Ps=se(/\\(punct)/,"gu").replace(/punct/g,Kt).getRegex(),Is=se(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),zs=se(Tn).replace("(?:-->|$)","-->").getRegex(),Ns=se("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",zs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Yt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Bs=se(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Yt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),zr=se(/^!?\[(label)\]\[(ref)\]/).replace("label",Yt).replace("ref",Ln).getRegex(),Nr=se(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ln).getRegex(),Os=se("reflink|nolink(?!\\()","g").replace("reflink",zr).replace("nolink",Nr).getRegex(),Br=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Mn={_backpedal:it,anyPunctuation:Ps,autolink:Is,blockSkip:Es,br:Cr,code:ws,del:it,delLDelim:it,delRDelim:it,emStrongLDelim:As,emStrongRDelimAst:Ts,emStrongRDelimUnd:Cs,escape:ms,link:Bs,nolink:Nr,punctuation:ys,reflink:zr,reflinkSearch:Os,tag:Ns,text:bs,url:it},qs={...Mn,link:se(/^!?\[(label)\]\((.*?)\)/).replace("label",Yt).getRegex(),reflink:se(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Yt).getRegex()},_n={...Mn,emStrongRDelimAst:Rs,emStrongLDelim:Ls,delLDelim:Ms,delRDelim:$s,url:se(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Br).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:se(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Br).getRegex()},Ds={..._n,br:se(Cr).replace("{2,}","*").getRegex(),text:se(_n.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Vt={normal:Rn,gfm:ps,pedantic:gs},Ct={normal:Mn,gfm:_n,breaks:Ds,pedantic:qs},Hs={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Or=e=>Hs[e];function Ue(e,t){if(t){if($e.escapeTest.test(e))return e.replace($e.escapeReplace,Or)}else if($e.escapeTestNoEncode.test(e))return e.replace($e.escapeReplaceNoEncode,Or);return e}function qr(e){try{e=encodeURI(e).replace($e.percentDecode,"%")}catch{return null}return e}function Dr(e,t){let n=e.replace($e.findPipe,(i,a,o)=>{let l=!1,h=a;for(;--h>=0&&o[h]==="\\";)l=!l;return l?"|":" |"}),s=n.split($e.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace($e.slashPipe,"|");return s}function Mt(e,t,n){let s=e.length;if(s===0)return"";let r=0;for(;r<s&&e.charAt(s-r-1)===t;)r++;return e.slice(0,s-r)}function Us(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function js(e,t=0){let n=t,s="";for(let r of e)if(r==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=r,n++;return s}function Hr(e,t,n,s,r){let i=t.href,a=t.title||null,o=e[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let l={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:o,tokens:s.inlineTokens(o)};return s.state.inLink=!1,l}function Fs(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let r=s[1];return t.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[o]=a;return o.length>=r.length?i.slice(r.length):i}).join(`
`)}var Jt=class{options;rules;lexer;constructor(e){this.options=e||rt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Mt(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=Fs(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=Mt(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Mt(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=Mt(t[0],`
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
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;e;){let l=!1,h="",c="";if(!(t=i.exec(e))||this.rules.block.hr.test(e))break;h=t[0],e=e.substring(h.length);let d=js(t[2].split(`
`,1)[0],t[1].length),p=e.split(`
`,1)[0],f=!d.trim(),u=0;if(this.options.pedantic?(u=2,c=d.trimStart()):f?u=t[1].length+1:(u=d.search(this.rules.other.nonSpaceChar),u=u>4?1:u,c=d.slice(u),u+=t[1].length),f&&this.rules.other.blankLine.test(p)&&(h+=p+`
`,e=e.substring(p.length+1),l=!0),!l){let g=this.rules.other.nextBulletRegex(u),m=this.rules.other.hrRegex(u),b=this.rules.other.fencesBeginRegex(u),y=this.rules.other.headingBeginRegex(u),v=this.rules.other.htmlBeginRegex(u),M=this.rules.other.blockquoteBeginRegex(u);for(;e;){let I=e.split(`
`,1)[0],F;if(p=I,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),F=p):F=p.replace(this.rules.other.tabCharGlobal,"    "),b.test(p)||y.test(p)||v.test(p)||M.test(p)||g.test(p)||m.test(p))break;if(F.search(this.rules.other.nonSpaceChar)>=u||!p.trim())c+=`
`+F.slice(u);else{if(f||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||b.test(d)||y.test(d)||m.test(d))break;c+=`
`+p}f=!p.trim(),h+=I+`
`,e=e.substring(I.length+1),d=F.slice(u)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(h)&&(a=!0)),r.items.push({type:"list_item",raw:h,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),r.raw+=h}let o=r.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l of r.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let h=this.rules.other.listTaskCheckbox.exec(l.raw);if(h){let c={type:"checkbox",raw:h[0]+" ",checked:h[0]!=="[ ]"};l.checked=c.checked,r.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=c.raw+l.tokens[0].raw,l.tokens[0].text=c.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(c)):l.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):l.tokens.unshift(c)}}if(!r.loose){let h=l.tokens.filter(d=>d.type==="space"),c=h.length>0&&h.some(d=>this.rules.other.anyLine.test(d.raw));r.loose=c}}if(r.loose)for(let l of r.items){l.loose=!0;for(let h of l.tokens)h.type==="text"&&(h.type="paragraph")}return r}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Dr(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(Dr(a,i.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:i.align[l]})));return i}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=Mt(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=Us(t[2],"()");if(i===-2)return;if(i>-1){let a=(t[0].indexOf("!")===0?5:4)+t[1].length+i;t[2]=t[2].substring(0,i),t[0]=t[0].substring(0,a).trim(),t[3]=""}}let s=t[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Hr(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return Hr(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,o=r,l=0,h=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(h.lastIndex=0,t=t.slice(-1*e.length+r);(s=h.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){o+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){l+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+l);let c=[...s[0]][0].length,d=e.slice(0,r+s.index+c+a);if(Math.min(r,a)%2){let f=d.slice(1,-1);return{type:"em",raw:d,text:f,tokens:this.lexer.inlineTokens(f)}}let p=d.slice(2,-2);return{type:"strong",raw:d,text:p,tokens:this.lexer.inlineTokens(p)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,o=r,l=this.rules.inline.delRDelim;for(l.lastIndex=0,t=t.slice(-1*e.length+r);(s=l.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){o+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o);let h=[...s[0]][0].length,c=e.slice(0,r+s.index+h+a),d=c.slice(r,-r);return{type:"del",raw:c,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},Oe=class Yn{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||rt,this.options.tokenizer=this.options.tokenizer||new Jt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:$e,block:Vt.normal,inline:Ct.normal};this.options.pedantic?(n.block=Vt.pedantic,n.inline=Ct.pedantic):this.options.gfm&&(n.block=Vt.gfm,this.options.breaks?n.inline=Ct.breaks:n.inline=Ct.gfm),this.tokenizer.rules=n}static get rules(){return{block:Vt,inline:Ct}}static lex(t,n){return new Yn(n).lex(t)}static lexInline(t,n){return new Yn(n).inlineTokens(t)}lex(t){t=t.replace($e.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace($e.tabCharGlobal,"    ").replace($e.spaceLine,""));t;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},t,n))?(t=t.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(t)){t=t.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(t)){t=t.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(t)){t=t.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(t)){t=t.substring(r.raw.length),n.push(r);continue}let i=t;if(this.options.extensions?.startBlock){let a=1/0,o=t.slice(1),l;this.options.extensions.startBlock.forEach(h=>{l=h.call({lexer:this},o),typeof l=="number"&&l>=0&&(a=Math.min(a,l))}),a<1/0&&a>=0&&(i=t.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==t.length,t=t.substring(r.raw.length);continue}if(r=this.tokenizer.text(t)){t=t.substring(r.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(t){let a="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,r=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)l.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=r[2]?r[2].length:0,s=s.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,o="";for(;t;){a||(o=""),a=!1;let l;if(this.options.extensions?.inline?.some(c=>(l=c.call({lexer:this},t,n))?(t=t.substring(l.raw.length),n.push(l),!0):!1))continue;if(l=this.tokenizer.escape(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.tag(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.link(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(l.raw.length);let c=n.at(-1);l.type==="text"&&c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(l=this.tokenizer.emStrong(t,s,o)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.codespan(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.br(t)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.del(t,s,o)){t=t.substring(l.raw.length),n.push(l);continue}if(l=this.tokenizer.autolink(t)){t=t.substring(l.raw.length),n.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(t))){t=t.substring(l.raw.length),n.push(l);continue}let h=t;if(this.options.extensions?.startInline){let c=1/0,d=t.slice(1),p;this.options.extensions.startInline.forEach(f=>{p=f.call({lexer:this},d),typeof p=="number"&&p>=0&&(c=Math.min(c,p))}),c<1/0&&c>=0&&(h=t.substring(0,c+1))}if(l=this.tokenizer.inlineText(h)){t=t.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(o=l.raw.slice(-1)),a=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=l.raw,c.text+=l.text):n.push(l);continue}if(t){let c="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},en=class{options;parser;constructor(e){this.options=e||rt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match($e.notSpaceStart)?.[0],r=e.replace($e.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Ue(s)+'">'+(n?r:Ue(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:Ue(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let a=0;a<e.items.length;a++){let o=e.items[a];s+=this.listitem(o)}let r=t?"ol":"ul",i=t&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
`+s+"</"+r+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let r=0;r<e.header.length;r++)n+=this.tablecell(e.header[r]);t+=this.tablerow({text:n});let s="";for(let r=0;r<e.rows.length;r++){let i=e.rows[r];n="";for(let a=0;a<i.length;a++)n+=this.tablecell(i[a]);s+=this.tablerow({text:n})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+s+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Ue(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),r=qr(e);if(r===null)return s;e=r;let i='<a href="'+e+'"';return t&&(i+=' title="'+Ue(t)+'"'),i+=">"+s+"</a>",i}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=qr(e);if(r===null)return Ue(n);e=r;let i=`<img src="${e}" alt="${Ue(n)}"`;return t&&(i+=` title="${Ue(t)}"`),i+=">",i}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Ue(e.text)}},$n=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},qe=class Vn{options;renderer;textRenderer;constructor(t){this.options=t||rt,this.options.renderer=this.options.renderer||new en,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new $n}static parse(t,n){return new Vn(n).parse(t)}static parseInline(t,n){return new Vn(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let r=t[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=o||"";continue}}let i=r;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(t,n=this.renderer){let s="";for(let r=0;r<t.length;r++){let i=t[r];if(this.options.extensions?.renderers?.[i.type]){let o=this.options.extensions.renderers[i.type].call({parser:this},i);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=o||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return s}},_t=class{options;block;constructor(e){this.options=e||rt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?Oe.lex:Oe.lexInline}provideParser(){return this.block?qe.parse:qe.parseInline}},Ws=class{defaults=vn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=qe;Renderer=en;TextRenderer=$n;Lexer=Oe;Tokenizer=Jt;Hooks=_t;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,t));for(let i of r.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,t));break}case"list":{let r=s;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,t))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=t.renderers[r.name];i?t.renderers[r.name]=function(...a){let o=r.renderer.apply(this,a);return o===!1&&(o=i.apply(this,a)),o}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=t[r.level];i?i.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),s.extensions=t),n.renderer){let r=this.defaults.renderer||new en(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,o=n.renderer[a],l=r[a];r[a]=(...h)=>{let c=o.apply(r,h);return c===!1&&(c=l.apply(r,h)),c||""}}s.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Jt(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,o=n.tokenizer[a],l=r[a];r[a]=(...h)=>{let c=o.apply(r,h);return c===!1&&(c=l.apply(r,h)),c}}s.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new _t;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,o=n.hooks[a],l=r[a];_t.passThroughHooks.has(i)?r[a]=h=>{if(this.defaults.async&&_t.passThroughHooksRespectAsync.has(i))return(async()=>{let d=await o.call(r,h);return l.call(r,d)})();let c=o.call(r,h);return l.call(r,c)}:r[a]=(...h)=>{if(this.defaults.async)return(async()=>{let d=await o.apply(r,h);return d===!1&&(d=await l.apply(r,h)),d})();let c=o.apply(r,h);return c===!1&&(c=l.apply(r,h)),c}}s.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let o=[];return o.push(i.call(this,a)),r&&(o=o.concat(r.call(this,a))),o}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Oe.lex(e,t??this.defaults)}parser(e,t){return qe.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=e),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(t):t,o=await(r.hooks?await r.hooks.provideLexer():e?Oe.lex:Oe.lexInline)(a,r),l=r.hooks?await r.hooks.processAllTokens(o):o;r.walkTokens&&await Promise.all(this.walkTokens(l,r.walkTokens));let h=await(r.hooks?await r.hooks.provideParser():e?qe.parse:qe.parseInline)(l,r);return r.hooks?await r.hooks.postprocess(h):h})().catch(i);try{r.hooks&&(t=r.hooks.preprocess(t));let a=(r.hooks?r.hooks.provideLexer():e?Oe.lex:Oe.lexInline)(t,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let o=(r.hooks?r.hooks.provideParser():e?qe.parse:qe.parseInline)(a,r);return r.hooks&&(o=r.hooks.postprocess(o)),o}catch(a){return i(a)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+Ue(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},st=new Ws;function ae(e,t){return st.parse(e,t)}ae.options=ae.setOptions=function(e){return st.setOptions(e),ae.defaults=st.defaults,Er(ae.defaults),ae},ae.getDefaults=vn,ae.defaults=rt,ae.use=function(...e){return st.use(...e),ae.defaults=st.defaults,Er(ae.defaults),ae},ae.walkTokens=function(e,t){return st.walkTokens(e,t)},ae.parseInline=st.parseInline,ae.Parser=qe,ae.parser=qe.parse,ae.Renderer=en,ae.TextRenderer=$n,ae.Lexer=Oe,ae.lexer=Oe.lex,ae.Tokenizer=Jt,ae.Hooks=_t,ae.parse=ae,ae.options,ae.setOptions,ae.use,ae.walkTokens,ae.parseInline,qe.parse,Oe.lex;const Ur=`function j() {
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
`,jr=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Ur],{type:"text/javascript;charset=utf-8"});function Zs(e){let t;try{if(t=jr&&(self.URL||self.webkitURL).createObjectURL(jr),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Ur),{type:"module",name:e?.name})}}function Gs(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),s=e.slice(t+4).trimStart(),r={};return n.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:s,data:r}}}return{content:e,data:{}}}const Fr=ar(()=>new Zs,"markdown"),Wr=typeof DOMParser<"u"?new DOMParser:null;function Pn(){return Fr.get()}function Qs(e){return Fr.send(e,1e3)}const Ve=[];function In(e){if(e&&typeof e=="object"){Ve.push(e);try{ae.use(e)}catch(t){console.warn("[markdown] failed to apply plugin",t)}}}function Xs(e){Ve.length=0,Array.isArray(e)&&Ve.push(...e.filter(t=>t&&typeof t=="object"));try{Ve.forEach(t=>ae.use(t))}catch(t){console.warn("[markdown] failed to apply markdown extensions",t)}}async function tn(e){if(Pn&&Pn())try{const i=await Qs({type:"render",md:e});if(i&&i.html!==void 0)try{const o=(Wr||new DOMParser).parseFromString(i.html,"text/html"),l=o.querySelectorAll("h1,h2,h3,h4,h5,h6"),h=new Set,c=f=>{f||(f="heading");let u=f,g=2;for(;h.has(u);)u=`${f}-${g}`,g+=1;return h.add(u),u};l.forEach(f=>{if(f.id)f.id=c(f.id);else{const u=le(f.textContent||"");f.id=c(u)}try{const u=Number(f.tagName.substring(1));if(u>=1&&u<=6){const g={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},m=u<=2?"has-text-weight-bold":u<=4?"has-text-weight-semibold":"has-text-weight-normal";`${g[u]} ${m}`.split(/\s+/).filter(Boolean).forEach(y=>{try{f.classList.add(y)}catch{}})}}catch{}});try{try{const u=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(u){const g=Array.from(o.querySelectorAll("img"));for(const m of g)try{const b=m.getAttribute("src")||"";if(new URL(b,location.href).toString()===u){const v=m.parentElement;m.remove(),v&&v.tagName&&v.tagName.toLowerCase()==="p"&&v.childNodes.length===0&&v.remove();break}}catch{}}}catch{}o.querySelectorAll("img").forEach(u=>{try{u.getAttribute("loading")||u.setAttribute("data-want-lazy","1")}catch(g){console.warn("[markdown] set image loading attribute failed",g)}})}catch(f){console.warn("[markdown] query images failed",f)}try{o.querySelectorAll("pre code").forEach(u=>{try{const g=u.getAttribute&&u.getAttribute("class")||u.className||"",m=String(g||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{u.setAttribute&&u.setAttribute("class",m)}catch(v){console.warn("[markdown] set code class failed",v),u.className=m}else try{u.removeAttribute&&u.removeAttribute("class")}catch(v){console.warn("[markdown] remove code class failed",v),u.className=""}const b=m,y=b.match(/language-([a-zA-Z0-9_+-]+)/)||b.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!y||!y[1])try{const v=u.textContent||"";try{if(ge&&typeof ge.getLanguage=="function"&&ge.getLanguage("plaintext")){const M=ge.highlight(v,{language:"plaintext"});M&&M.value&&(u.innerHTML=M.value)}}catch{try{ge.highlightElement(u)}catch(I){console.warn("[markdown] hljs.highlightElement failed",I)}}}catch(v){console.warn("[markdown] code auto-detect failed",v)}}catch(g){console.warn("[markdown] processing code blocks failed",g)}})}catch(f){console.warn("[markdown] query code blocks failed",f)}const d=o.body.innerHTML,p=[];return l.forEach(f=>{p.push({level:Number(f.tagName.substring(1)),text:(f.textContent||"").trim(),id:f.id})}),{html:d,meta:i.meta||{},toc:p}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:n,data:s}=Gs(e||"");if(ae.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Ve&&Ve.length)try{Ve.forEach(i=>ae.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let r=ae.parse(n);try{const a=(Wr||new DOMParser).parseFromString(r,"text/html"),o=a.querySelectorAll("h1,h2,h3,h4,h5,h6");o.forEach(h=>{h.id||(h.id=le(h.textContent||""));try{const c=Number(h.tagName.substring(1));if(c>=1&&c<=6){const d={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},p=c<=2?"has-text-weight-bold":c<=4?"has-text-weight-semibold":"has-text-weight-normal";`${d[c]} ${p}`.split(/\s+/).filter(Boolean).forEach(u=>{try{h.classList.add(u)}catch{}})}}catch{}});try{try{const c=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(c){const d=Array.from(a.querySelectorAll("img"));for(const p of d)try{const f=p.getAttribute("src")||"";if(new URL(f,location.href).toString()===c){const g=p.parentElement;p.remove(),g&&g.tagName&&g.tagName.toLowerCase()==="p"&&g.childNodes.length===0&&g.remove();break}}catch{}}}catch{}a.querySelectorAll("img").forEach(c=>{try{c.getAttribute("loading")||c.setAttribute("data-want-lazy","1")}catch(d){console.warn("[markdown] set image loading attribute failed",d)}})}catch(h){console.warn("[markdown] query images failed",h)}try{a.querySelectorAll("pre code").forEach(c=>{try{const d=c.getAttribute&&c.getAttribute("class")||c.className||"",p=String(d||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(p)try{c.setAttribute&&c.setAttribute("class",p)}catch(g){console.warn("[markdown] set code class failed",g),c.className=p}else try{c.removeAttribute&&c.removeAttribute("class")}catch(g){console.warn("[markdown] remove code class failed",g),c.className=""}const f=p,u=f.match(/language-([a-zA-Z0-9_+-]+)/)||f.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!u||!u[1])try{const g=c.textContent||"";try{if(ge&&typeof ge.getLanguage=="function"&&ge.getLanguage("plaintext")){const m=ge.highlight(g,{language:"plaintext"});m&&m.value&&(c.innerHTML=m.value)}}catch{try{ge.highlightElement(c)}catch(b){console.warn("[markdown] hljs.highlightElement failed",b)}}}catch(g){console.warn("[markdown] code auto-detect failed",g)}}catch(d){console.warn("[markdown] processing code blocks failed",d)}})}catch(h){console.warn("[markdown] query code blocks failed",h)}r=a.body.innerHTML;const l=[];return o.forEach(h=>{l.push({level:Number(h.tagName.substring(1)),text:(h.textContent||"").trim(),id:h.id})}),{html:a.body.innerHTML,meta:s||{},toc:l}}catch(i){console.warn("post-process markdown failed",i)}return{html:r,meta:s||{},toc:[]}}function zn(e,t){const n=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(e);)if(a[1]){const o=a[1].toLowerCase();if(dn.has(o)||t&&t.size&&o.length<3&&!t.has(o)&&!(Pe&&Pe[o]&&t.has(Pe[o])))continue;if(t&&t.size){if(t.has(o)){const h=t.get(o);h&&n.add(h);continue}if(Pe&&Pe[o]){const h=Pe[o];if(t.has(h)){const c=t.get(h)||h;n.add(c);continue}}}(i.has(o)||o.length>=5&&o.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(o)&&!r.has(o))&&n.add(o)}return n}const Ks=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:In,detectFenceLanguages:zn,initRendererWorker:Pn,markdownPlugins:Ve,parseMarkdownToHtml:tn,setMarkdownExtensions:Xs},Symbol.toStringTag,{value:"Module"}));function Ys(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t||"").replace(/\/$/,"")+"/"+String(e||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e||"")}}}}function Vs(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=e("navigation"),n.appendChild(s);const r=document.createElement("ul");return r.className="menu-list",t.forEach(i=>{const a=document.createElement("li"),o=document.createElement("a");if(o.href="#"+i.path,o.textContent=i.name,a.appendChild(o),i.children&&i.children.length){const l=document.createElement("ul");i.children.forEach(h=>{const c=document.createElement("li"),d=document.createElement("a");d.href="#"+h.path,d.textContent=h.name,c.appendChild(d),l.appendChild(c)}),a.appendChild(l)}r.appendChild(a)}),n.appendChild(r),n}function Js(e,t,n=""){const s=document.createElement("aside");s.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=e("onThisPage"),s.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const o={};(t||[]).forEach(l=>{try{if(!l||l.level===1)return;const h=Number(l.level)>=2?Number(l.level):2,c=document.createElement("li"),d=document.createElement("a"),p=l.id||le(l.text||"");d.textContent=l.text||"";try{const m=String(n||"").replace(/^[\\.\\/]+/,""),b=m&&U&&U.has&&U.has(m)?U.get(m):m;b?d.href=be(b,p):d.href=`#${encodeURIComponent(p)}`}catch(m){console.warn("[htmlBuilder] buildTocElement href normalization failed",m),d.href=`#${encodeURIComponent(p)}`}if(c.appendChild(d),h===2){i.appendChild(c),o[2]=c,Object.keys(o).forEach(m=>{Number(m)>2&&delete o[m]});return}let f=h-1;for(;f>2&&!o[f];)f--;f<2&&(f=2);let u=o[f];if(!u){i.appendChild(c),o[h]=c;return}let g=u.querySelector("ul");g||(g=document.createElement("ul"),u.appendChild(g)),g.appendChild(c),o[h]=c}catch(h){console.warn("[htmlBuilder] buildTocElement item failed",h,l)}})}catch(o){console.warn("[htmlBuilder] buildTocElement failed",o)}return s.appendChild(i),i.querySelectorAll("li").length<=1?null:s}function Zr(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=le(n.textContent||""))})}function ea(e,t,n){try{const s=e.querySelectorAll("img");if(s&&s.length){const r=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const o=new URL(r+a,n).toString();i.src=o;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] set image loading attribute failed",l)}}catch(o){console.warn("[htmlBuilder] resolve image src failed",o)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function Gr(e,t,n){try{const s=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let r=null;try{const a=new URL(n,location.href);r=new URL(s||".",a).toString()}catch{try{r=new URL(s||".",location.href).toString()}catch{r=s||"./"}}const i=e.querySelectorAll("*");for(const a of Array.from(i||[]))try{const o=a.tagName?a.tagName.toLowerCase():"",l=h=>{try{const c=a.getAttribute(h)||"";if(!c||/^(https?:)?\/\//i.test(c)||c.startsWith("/")||c.startsWith("#"))return;try{a.setAttribute(h,new URL(c,r).toString())}catch(d){console.warn("[htmlBuilder] rewrite asset attribute failed",h,c,d)}}catch(c){console.warn("[htmlBuilder] rewriteAttr failed",c)}};if(a.hasAttribute&&a.hasAttribute("src")&&l("src"),a.hasAttribute&&a.hasAttribute("href")&&o!=="a"&&l("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&l("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&l("poster"),a.hasAttribute("srcset")){const d=(a.getAttribute("srcset")||"").split(",").map(p=>p.trim()).filter(Boolean).map(p=>{const[f,u]=p.split(/\s+/,2);if(!f||/^(https?:)?\/\//i.test(f)||f.startsWith("/"))return p;try{const g=new URL(f,r).toString();return u?`${g} ${u}`:g}catch{return p}}).join(", ");a.setAttribute("srcset",d)}}catch(o){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",o)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let Qr="",Nn=null,Xr="";async function Kr(e,t,n){try{const s=e.querySelectorAll("a");if(!s||!s.length)return;let r,i;if(t===Qr&&Nn)r=Nn,i=Xr;else{try{r=new URL(t,location.href),i=kt(r.pathname)}catch{try{r=new URL(t,location.href),i=kt(r.pathname)}catch{r=null,i="/"}}Qr=t,Nn=r,Xr=i}const a=new Set,o=[],l=new Set,h=[];for(const c of Array.from(s))try{const d=c.getAttribute("href")||"";if(!d||ur(d))continue;try{if(d.startsWith("?")||d.indexOf("?")!==-1)try{const f=new URL(d,t||location.href),u=f.searchParams.get("page");if(u&&u.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const m=ye(g+u);c.setAttribute("href",be(m,f.hash?f.hash.replace(/^#/,""):null));continue}}}catch{}}catch{}if(d.startsWith("/")&&!d.endsWith(".md"))continue;const p=d.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(p){let f=p[1];const u=p[2];!f.startsWith("/")&&n&&(f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+f);try{const g=new URL(f,t).pathname;let m=g.startsWith(i)?g.slice(i.length):g;m=ye(m),o.push({node:c,mdPathRaw:f,frag:u,rel:m}),U.has(m)||a.add(m)}catch(g){console.warn("[htmlBuilder] resolve mdPath failed",g)}continue}try{let f=d;!d.startsWith("/")&&n&&(d.startsWith("#")?f=n+d:f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+d);const g=new URL(f,t).pathname||"";if(g&&g.indexOf(i)!==-1){let m=g.startsWith(i)?g.slice(i.length):g;if(m=ye(m),m=yt(m),m||(m="_home"),!m.endsWith(".md")){let b=null;try{if(U&&U.has&&U.has(m))b=U.get(m);else try{const y=String(m||"").replace(/^.*\//,"");y&&U.has&&U.has(y)&&(b=U.get(y))}catch(y){console.warn("[htmlBuilder] mdToSlug baseName check failed",y)}}catch(y){console.warn("[htmlBuilder] mdToSlug access check failed",y)}if(!b)try{const y=String(m||"").replace(/^.*\//,"");for(const[v,M]of V||[])if(M===m||M===y){b=v;break}}catch{}b?c.setAttribute("href",be(b)):(l.add(m),h.push({node:c,rel:m}))}}}catch(f){console.warn("[htmlBuilder] resolving href to URL failed",f)}}catch(d){console.warn("[htmlBuilder] processing anchor failed",d)}a.size&&await Promise.all(Array.from(a).map(async c=>{try{try{const p=String(c).match(/([^\/]+)\.md$/),f=p&&p[1];if(f&&V.has(f)){try{const u=V.get(f);if(u)try{U.set(u,f)}catch(g){console.warn("[htmlBuilder] mdToSlug.set failed",g)}}catch(u){console.warn("[htmlBuilder] reading slugToMd failed",u)}return}}catch(p){console.warn("[htmlBuilder] basename slug lookup failed",p)}const d=await Ae(c,t);if(d&&d.raw){const p=(d.raw||"").match(/^#\s+(.+)$/m);if(p&&p[1]){const f=le(p[1].trim());if(f)try{V.set(f,c),U.set(c,f)}catch(u){console.warn("[htmlBuilder] setting slug mapping failed",u)}}}}catch(d){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",d)}})),l.size&&await Promise.all(Array.from(l).map(async c=>{try{const d=await Ae(c,t);if(d&&d.raw)try{const f=(Bn||new DOMParser).parseFromString(d.raw,"text/html"),u=f.querySelector("title"),g=f.querySelector("h1"),m=u&&u.textContent&&u.textContent.trim()?u.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(m){const b=le(m);if(b)try{V.set(b,c),U.set(c,b)}catch(y){console.warn("[htmlBuilder] setting html slug mapping failed",y)}}}catch(p){console.warn("[htmlBuilder] parse fetched HTML failed",p)}}catch(d){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",d)}}));for(const c of o){const{node:d,frag:p,rel:f}=c;let u=null;try{U.has(f)&&(u=U.get(f))}catch(g){console.warn("[htmlBuilder] mdToSlug access failed",g)}u?d.setAttribute("href",be(u,p)):d.setAttribute("href",be(f,p))}for(const c of h){const{node:d,rel:p}=c;let f=null;try{U.has(p)&&(f=U.get(p))}catch(u){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",u)}if(!f)try{const u=String(p||"").replace(/^.*\//,"");U.has(u)&&(f=U.get(u))}catch(u){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",u)}f?d.setAttribute("href",be(f)):d.setAttribute("href",be(p))}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function ta(e,t,n,s){const r=t.querySelector("h1"),i=r?(r.textContent||"").trim():"";let a="";try{let o="";try{e&&e.meta&&e.meta.title&&(o=String(e.meta.title).trim())}catch{}if(!o&&i&&(o=i),!o)try{const l=t.querySelector("h2");l&&l.textContent&&(o=String(l.textContent).trim())}catch{}!o&&n&&(o=String(n)),o&&(a=le(o)),a||(a="_home");try{n&&(V.set(a,n),U.set(n,a))}catch(l){console.warn("[htmlBuilder] computeSlug set slug mapping failed",l)}try{const l=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");try{history.replaceState({page:a},"",be(a,l))}catch(h){console.warn("[htmlBuilder] computeSlug history replace failed",h)}}catch(l){console.warn("[htmlBuilder] computeSlug inner failed",l)}}catch(o){console.warn("[htmlBuilder] computeSlug failed",o)}try{if(e&&e.meta&&e.meta.title&&r){const o=String(e.meta.title).trim();if(o&&o!==i){try{a&&(r.id=a)}catch{}try{if(Array.isArray(e.toc))for(const l of e.toc)try{if(l&&Number(l.level)===1&&String(l.text).trim()===(i||"").trim()){l.id=a;break}}catch{}}catch{}}}}catch{}return{topH1:r,h1Text:i,slugKey:a}}async function na(e,t){if(!e||!e.length)return;const n=new Set;for(const l of Array.from(e||[]))try{const h=l.getAttribute("href")||"";if(!h)continue;let p=ye(h).split(/::|#/,2)[0];try{const u=p.indexOf("?");u!==-1&&(p=p.slice(0,u))}catch{}if(!p||(p.includes(".")||(p=p+".html"),!/\.html(?:$|[?#])/.test(p)&&!p.toLowerCase().endsWith(".html")))continue;const f=p;try{if(U&&U.has&&U.has(f))continue}catch(u){console.warn("[htmlBuilder] mdToSlug check failed",u)}try{let u=!1;for(const g of V.values())if(g===f){u=!0;break}if(u)continue}catch(u){console.warn("[htmlBuilder] slugToMd iteration failed",u)}n.add(f)}catch(h){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",h)}if(!n.size)return;const s=async l=>{try{const h=await Ae(l,t);if(h&&h.raw)try{const d=(Bn||new DOMParser).parseFromString(h.raw,"text/html"),p=d.querySelector("title"),f=d.querySelector("h1"),u=p&&p.textContent&&p.textContent.trim()?p.textContent.trim():f&&f.textContent?f.textContent.trim():null;if(u){const g=le(u);if(g)try{V.set(g,l),U.set(l,g)}catch(m){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",m)}}}catch(c){console.warn("[htmlBuilder] parse HTML title failed",c)}}catch(h){console.warn("[htmlBuilder] fetchAndExtract failed",h)}},r=5,i=Array.from(n);let a=0;const o=[];for(;a<i.length;){const l=i.slice(a,a+r);o.push(Promise.all(l.map(s))),a+=r}await Promise.all(o)}async function ra(e,t){if(!e||!e.length)return;const n=[],s=new Set;let r="";try{const i=new URL(t,typeof location<"u"?location.href:"http://localhost/");r=kt(i.pathname)}catch(i){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(e||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const o=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(o){let l=ye(o[1]);try{let h;try{h=Ys(l,t)}catch(d){h=l,console.warn("[htmlBuilder] resolve mdPath URL failed",d)}const c=h&&r&&h.startsWith(r)?h.slice(r.length):String(h||"").replace(/^\//,"");n.push({rel:c}),U.has(c)||s.add(c)}catch(h){console.warn("[htmlBuilder] rewriteAnchors failed",h)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),o=a&&a[1];if(o&&V.has(o)){try{const l=V.get(o);l&&U.set(l,o)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",l)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await Ae(i,t);if(a&&a.raw){const o=(a.raw||"").match(/^#\s+(.+)$/m);if(o&&o[1]){const l=le(o[1].trim());if(l)try{V.set(l,i),U.set(i,l)}catch(h){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",h)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const Bn=typeof DOMParser<"u"?new DOMParser:null;function On(e){try{const n=(Bn||new DOMParser).parseFromString(e||"","text/html");Zr(n);try{n.querySelectorAll("img").forEach(l=>{try{l.getAttribute("loading")||l.setAttribute("data-want-lazy","1")}catch(h){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",h)}})}catch(o){console.warn("[htmlBuilder] parseHtml query images failed",o)}n.querySelectorAll("pre code, code[class]").forEach(o=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",h=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(h&&h[1]){const c=(h[1]||"").toLowerCase(),d=te.size&&(te.get(c)||te.get(String(c).toLowerCase()))||c;try{(async()=>{try{await ot(d)}catch(p){console.warn("[htmlBuilder] registerLanguage failed",p)}})()}catch(p){console.warn("[htmlBuilder] schedule registerLanguage failed",p)}}else try{if(ge&&typeof ge.getLanguage=="function"&&ge.getLanguage("plaintext")){const c=ge.highlight?ge.highlight(o.textContent||"",{language:"plaintext"}):null;c&&c.value&&(o.innerHTML=c.value)}}catch(c){console.warn("[htmlBuilder] plaintext highlight fallback failed",c)}}catch(l){console.warn("[htmlBuilder] code element processing failed",l)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(o=>{r.push({level:Number(o.tagName.substring(1)),text:(o.textContent||"").trim(),id:o.id})});const a={};try{const o=n.querySelector("title");o&&o.textContent&&String(o.textContent).trim()&&(a.title=String(o.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:a,toc:r}}catch(t){return console.warn("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function ia(e){const t=zn?zn(e||"",te):new Set,n=new Set(t),s=[];for(const r of n)try{const i=te.size&&(te.get(r)||te.get(String(r).toLowerCase()))||r;try{s.push(ot(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(i))try{s.push(ot(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function sa(e){if(await ia(e),tn){const t=await tn(e||"");return!t||typeof t!="object"?{html:String(e||""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e||""),meta:{},toc:[]}}async function aa(e,t,n,s,r){let i=null;if(t.isHtml)try{const d=typeof DOMParser<"u"?new DOMParser:null;if(d){const p=d.parseFromString(t.raw||"","text/html");try{Gr(p.body,n,r)}catch(f){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",f)}i=On(p.documentElement&&p.documentElement.outerHTML?p.documentElement.outerHTML:t.raw||"")}else i=On(t.raw||"")}catch{i=On(t.raw||"")}else i=await sa(t.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{Gr(a,n,r)}catch(d){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",d)}try{Zr(a)}catch(d){console.warn("[htmlBuilder] addHeadingIds failed",d)}try{a.querySelectorAll("pre code, code[class]").forEach(p=>{try{const f=p.getAttribute&&p.getAttribute("class")||p.className||"",u=String(f||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(u)try{p.setAttribute&&p.setAttribute("class",u)}catch(g){p.className=u,console.warn("[htmlBuilder] set element class failed",g)}else try{p.removeAttribute&&p.removeAttribute("class")}catch(g){p.className="",console.warn("[htmlBuilder] remove element class failed",g)}}catch(f){console.warn("[htmlBuilder] code element cleanup failed",f)}})}catch(d){console.warn("[htmlBuilder] processing code elements failed",d)}try{tr(a)}catch(d){console.warn("[htmlBuilder] observeCodeBlocks failed",d)}ea(a,n,r);try{(a.querySelectorAll&&a.querySelectorAll("img")||[]).forEach(p=>{try{const f=p.parentElement;if(!f||f.tagName.toLowerCase()!=="p"||f.childNodes.length!==1)return;const u=document.createElement("figure");u.className="image",f.replaceWith(u),u.appendChild(p)}catch{}})}catch(d){console.warn("[htmlBuilder] wrap images in Bulma image helper failed",d)}try{(a.querySelectorAll&&a.querySelectorAll("table")||[]).forEach(p=>{try{if(p.classList)p.classList.contains("table")||p.classList.add("table");else{const f=p.getAttribute&&p.getAttribute("class")?p.getAttribute("class"):"",u=String(f||"").split(/\s+/).filter(Boolean);u.indexOf("table")===-1&&u.push("table");try{p.setAttribute&&p.setAttribute("class",u.join(" "))}catch{p.className=u.join(" ")}}}catch{}})}catch(d){console.warn("[htmlBuilder] add Bulma table class failed",d)}const{topH1:o,h1Text:l,slugKey:h}=ta(i,a,n,s);try{if(o&&i&&i.meta&&(i.meta.author||i.meta.date)&&!(o.parentElement&&o.parentElement.querySelector&&o.parentElement.querySelector(".nimbi-article-subtitle"))){const p=i.meta.author?String(i.meta.author).trim():"",f=i.meta.date?String(i.meta.date).trim():"";let u="";try{const m=new Date(f);f&&!isNaN(m.getTime())?u=m.toLocaleDateString():u=f}catch{u=f}const g=[];if(p&&g.push(p),u&&g.push(u),g.length){const m=document.createElement("p"),b=g[0]?String(g[0]).replace(/\"/g,"").trim():"",y=g.slice(1),v=[];b&&v.push(b),y.length&&v.push(y.join(" • ")),m.className="nimbi-article-subtitle is-6 has-text-grey-light",m.textContent=v.join(" • ");try{o.parentElement.insertBefore(m,o.nextSibling)}catch{try{o.insertAdjacentElement("afterend",m)}catch{}}}}}catch{}try{await oa(a,r,n)}catch(d){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",d),await Kr(a,r,n)}const c=Js(e,i.toc,n);return{article:a,parsed:i,toc:c,topH1:o,h1Text:l,slugKey:h}}function la(e){if(!(!e||!e.querySelectorAll))try{const t=Array.from(e.querySelectorAll("script"));for(const n of t)try{const s=document.createElement("script");for(const i of Array.from(n.attributes||[]))try{s.setAttribute(i.name,i.value)}catch{}if(!n.src){try{s.type="module"}catch{}s.textContent=n.textContent||""}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";s.addEventListener("error",i=>{try{console.warn("[htmlBuilder] injected script error",{src:r,ev:i})}catch{}}),s.addEventListener("load",()=>{try{console.info("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}}),(document.head||document.body||document.documentElement).appendChild(s),n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed injected script",r)}catch{}}catch(s){console.warn("[htmlBuilder] execute injected script failed",s)}}catch{}}function Yr(e,t,n){e&&(e.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=t&&t("notFound")||"Page not found";const i=document.createElement("p");i.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",s.appendChild(r),s.appendChild(i),e&&e.appendChild&&e.appendChild(s)}async function oa(e,t,n){return Kr(e,t,n)}function ca(e){try{e.addEventListener("click",t=>{const n=t.target&&t.target.closest?t.target.closest("a"):null;if(!n)return;const s=n.getAttribute("href")||"";try{const r=new URL(s,location.href),i=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!i&&!a)return;t.preventDefault();let o=null;try{history&&history.state&&history.state.page&&(o=history.state.page)}catch(l){o=null,console.warn("[htmlBuilder] access history.state failed",l)}try{o||(o=new URL(location.href).searchParams.get("page"))}catch(l){console.warn("[htmlBuilder] parse current location failed",l)}if(!i&&a||i&&o&&String(i)===String(o)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:o||i},"",be(o||i,a))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}}catch(l){console.warn("[htmlBuilder] update history for anchor failed",l)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(l){console.warn("[htmlBuilder] stopPropagation failed",l)}try{qn(a)}catch(l){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:i},"",be(i,a));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(l){console.warn("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){console.warn("[htmlBuilder] dispatch popstate failed",l)}else try{renderByQuery()}catch(l){console.warn("[htmlBuilder] renderByQuery failed",l)}}catch(l){console.warn("[htmlBuilder] SPA navigation invocation failed",l)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(t){console.warn("[htmlBuilder] attachTocClickHandler failed",t)}}function qn(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const s=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const r=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(s,50)}}catch(s){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",n)}}function ua(e,t,{mountOverlay:n=null,container:s=null,mountEl:r=null,navWrap:i=null,t:a=null}={}){try{const o=a||(g=>typeof g=="string"?g:""),l=s||document.querySelector(".nimbi-cms"),h=r||document.querySelector(".nimbi-mount"),c=n||document.querySelector(".nimbi-overlay"),d=i||document.querySelector(".nimbi-nav-wrap");let f=document.querySelector(".nimbi-scroll-top");if(!f){f=document.createElement("button"),f.className="nimbi-scroll-top button is-primary is-rounded is-small",f.setAttribute("aria-label",o("scrollToTop")),f.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{c&&c.appendChild?c.appendChild(f):l&&l.appendChild?l.appendChild(f):h&&h.appendChild?h.appendChild(f):document.body.appendChild(f)}catch{try{document.body.appendChild(f)}catch(m){console.warn("[htmlBuilder] append scroll top button failed",m)}}try{try{ir(f)}catch{}}catch(g){console.warn("[htmlBuilder] set scroll-top button theme registration failed",g)}f.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback container scrollTop failed",m)}try{r&&(r.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",m)}try{document.documentElement.scrollTop=0}catch(m){console.warn("[htmlBuilder] fallback document scrollTop failed",m)}}})}const u=d&&d.querySelector?d.querySelector(".menu-label"):null;if(t){if(!f._nimbiObserver){const g=new IntersectionObserver(m=>{for(const b of m)b.target instanceof Element&&(b.isIntersecting?(f.classList.remove("show"),u&&u.classList.remove("show")):(f.classList.add("show"),u&&u.classList.add("show")))},{root:s instanceof Element?s:r instanceof Element?r:null,threshold:0});f._nimbiObserver=g}try{f._nimbiObserver.disconnect()}catch(g){console.warn("[htmlBuilder] observer disconnect failed",g)}try{f._nimbiObserver.observe(t)}catch(g){console.warn("[htmlBuilder] observer observe failed",g)}try{const g=()=>{try{const m=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},b=t.getBoundingClientRect();!(b.bottom<m.top||b.top>m.bottom)?(f.classList.remove("show"),u&&u.classList.remove("show")):(f.classList.add("show"),u&&u.classList.add("show"))}catch(m){console.warn("[htmlBuilder] checkIntersect failed",m)}};g(),"IntersectionObserver"in window||setTimeout(g,100)}catch(g){console.warn("[htmlBuilder] checkIntersect outer failed",g)}}else{f.classList.remove("show"),u&&u.classList.remove("show");const g=s instanceof Element?s:r instanceof Element?r:window,m=()=>{try{(g===window?window.scrollY:g.scrollTop||0)>10?(f.classList.add("show"),u&&u.classList.add("show")):(f.classList.remove("show"),u&&u.classList.remove("show"))}catch(b){console.warn("[htmlBuilder] onScroll handler failed",b)}};Ht(()=>g.addEventListener("scroll",m)),m()}}catch(o){console.warn("[htmlBuilder] ensureScrollTopButton failed",o)}}function Vr(e,t){try{if(!e)return;try{const n=e[t];if(typeof n<"u")return n}catch{}try{if(e.default)return e.default[t]}catch{}return}catch{return}}async function ha(e,t,n,s,r,i,a,o,l="eager",h=1,c=void 0,d="favicon"){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const p=typeof DOMParser<"u"?new DOMParser:null,f=p?p.parseFromString(n||"","text/html"):null,u=f?f.querySelectorAll("a"):[];await Ht(()=>na(u,s)),await Ht(()=>ra(u,s));let g=null,m=null,b=null,y=null,v=null,M=null;function I(){try{const E=document.querySelector(".navbar-burger"),L=E&&E.dataset?E.dataset.target:null,T=L?document.getElementById(L):null;E&&E.classList.contains("is-active")&&(E.classList.remove("is-active"),E.setAttribute("aria-expanded","false"),T&&T.classList.remove("is-active"))}catch(E){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",E)}}const F=()=>g||(g=(async()=>{try{const E=await Promise.resolve().then(()=>Qt),L=Vr(E,"buildSearchIndex")||(typeof globalThis<"u"?globalThis.buildSearchIndex:void 0),T=Vr(E,"buildSearchIndexWorker")||(typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0);if(l==="lazy"&&typeof T=="function")try{const P=await T(s,h,c);if(P&&P.length)return P}catch(P){console.warn&&console.warn("[nimbi-cms] worker builder threw",P)}return typeof L=="function"?await L(s,h,c):[]}catch(E){return console.warn("[nimbi-cms] buildSearchIndex failed",E),[]}finally{if(m){try{m.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}}})(),g.then(E=>{try{const L=String(m&&m.value||"").trim().toLowerCase();if(!L||!Array.isArray(E)||!E.length)return;const T=E.filter(k=>k.title&&k.title.toLowerCase().includes(L)||k.excerpt&&k.excerpt.toLowerCase().includes(L));if(!T||!T.length)return;const P=document.getElementById("nimbi-search-results");if(!P)return;P.innerHTML="";try{const k=document.createElement("div");k.className="panel nimbi-search-panel",T.slice(0,10).forEach(R=>{try{if(R.parentTitle){const ue=document.createElement("p");ue.className="panel-heading nimbi-search-title nimbi-search-parent",ue.textContent=R.parentTitle,k.appendChild(ue)}const N=document.createElement("a");N.className="panel-block nimbi-search-result",N.href=be(R.slug),N.setAttribute("role","button");try{if(R.path&&typeof R.slug=="string"){try{V.set(R.slug,R.path)}catch{}try{U.set(R.path,R.slug)}catch{}}}catch{}const ne=document.createElement("div");ne.className="is-size-6 has-text-weight-semibold",ne.textContent=R.title,N.appendChild(ne),N.addEventListener("click",()=>{try{P.style.display="none"}catch{}}),k.appendChild(N)}catch{}}),P.appendChild(k);try{P.style.display="block"}catch{}}catch{}}catch{}}).catch(()=>{}),g),Z=document.createElement("nav");Z.className="navbar",Z.setAttribute("role","navigation"),Z.setAttribute("aria-label","main navigation");const W=document.createElement("div");W.className="navbar-brand";const fe=u[0],$=document.createElement("a");if($.className="navbar-item",fe){const E=fe.getAttribute("href")||"#";try{const T=new URL(E,location.href).searchParams.get("page");if(T){const P=decodeURIComponent(T);$.href=be(P)}else $.href=be(r),$.textContent=i("home")}catch{$.href=be(r),$.textContent=i("home")}}else $.href=be(r),$.textContent=i("home");async function q(E){try{if(!E||E==="none")return null;if(E==="favicon")try{const L=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!L)return null;const T=L.getAttribute("href")||"";return T&&/\.png(?:\?|$)/i.test(T)?new URL(T,location.href).toString():null}catch{return null}if(E==="copy-first"||E==="move-first")try{const L=await Ae(r,s);if(!L||!L.raw)return null;const k=new DOMParser().parseFromString(L.raw,"text/html").querySelector("img");if(!k)return null;const R=k.getAttribute("src")||"";if(!R)return null;const N=new URL(R,location.href).toString();if(E==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",N)}catch{}return N}catch{return null}try{return new URL(E,location.href).toString()}catch{return null}}catch{return null}}let Q=null;try{Q=await q(d)}catch{Q=null}if(Q)try{const E=document.createElement("img");E.className="nimbi-navbar-logo";const L=i&&typeof i=="function"&&(i("home")||i("siteLogo"))||"";E.alt=L,E.title=L,E.src=Q;try{E.style.marginRight="0.5em"}catch{}try{(!$.textContent||!String($.textContent).trim())&&($.textContent=L)}catch{}try{$.insertBefore(E,$.firstChild)}catch{try{$.appendChild(E)}catch{}}}catch{}W.appendChild($),$.addEventListener("click",function(E){const L=$.getAttribute("href")||"";if(L.startsWith("?page=")){E.preventDefault();const T=new URL(L,location.href),P=T.searchParams.get("page"),k=T.hash?T.hash.replace(/^#/,""):null;history.pushState({page:P},"",be(P,k));try{a()}catch(R){console.warn("[nimbi-cms] renderByQuery failed",R)}try{I()}catch{}}});const O=document.createElement("a");O.className="navbar-burger",O.setAttribute("role","button"),O.setAttribute("aria-label","menu"),O.setAttribute("aria-expanded","false");const oe="nimbi-navbar-menu";O.dataset.target=oe,O.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',W.appendChild(O);try{O.addEventListener("click",E=>{try{const L=O.dataset&&O.dataset.target?O.dataset.target:null,T=L?document.getElementById(L):null;O.classList.contains("is-active")?(O.classList.remove("is-active"),O.setAttribute("aria-expanded","false"),T&&T.classList.remove("is-active")):(O.classList.add("is-active"),O.setAttribute("aria-expanded","true"),T&&T.classList.add("is-active"))}catch(L){console.warn("[nimbi-cms] navbar burger toggle failed",L)}})}catch(E){console.warn("[nimbi-cms] burger event binding failed",E)}const X=document.createElement("div");X.className="navbar-menu",X.id=oe;const S=document.createElement("div");S.className="navbar-start";let J=null,re=null;if(!o)J=null,m=null,y=null,v=null,M=null;else{J=document.createElement("div"),J.className="navbar-end",re=document.createElement("div"),re.className="navbar-item",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=i("searchPlaceholder")||"",m.id="nimbi-search",l==="eager"&&(m.disabled=!0),b=document.createElement("div"),b.className="control",l==="eager"&&b.classList.add("is-loading"),b.appendChild(m),re.appendChild(b),y=document.createElement("div"),y.className="dropdown is-right",y.id="nimbi-search-dropdown";const E=document.createElement("div");E.className="dropdown-trigger",E.appendChild(re);const L=document.createElement("div");L.className="dropdown-menu",L.setAttribute("role","menu"),v=document.createElement("div"),v.id="nimbi-search-results",v.className="dropdown-content nimbi-search-results",M=v,L.appendChild(v),y.appendChild(E),y.appendChild(L),J.appendChild(y);const T=k=>{if(v){if(v.innerHTML="",!k.length){y&&y.classList.remove("is-active");try{v.style.display="none"}catch{}try{v.classList.remove("is-open")}catch{}return}try{const R=document.createElement("div");R.className="panel nimbi-search-panel",k.forEach(N=>{if(N.parentTitle){const he=document.createElement("p");he.textContent=N.parentTitle,he.className="panel-heading nimbi-search-title nimbi-search-parent",R.appendChild(he)}const ne=document.createElement("a");ne.className="panel-block nimbi-search-result",ne.href=be(N.slug),ne.setAttribute("role","button");try{if(N.path&&typeof N.slug=="string"){try{V.set(N.slug,N.path)}catch{}try{U.set(N.path,N.slug)}catch{}}}catch{}const ue=document.createElement("div");ue.className="is-size-6 has-text-weight-semibold",ue.textContent=N.title,ne.appendChild(ue),ne.addEventListener("click",()=>{y&&y.classList.remove("is-active");try{v.style.display="none"}catch{}try{v.classList.remove("is-open")}catch{}}),R.appendChild(ne)}),v.appendChild(R)}catch{}y&&y.classList.add("is-active");try{v.style.display="block"}catch{}try{v.classList.add("is-open")}catch{}}},P=(k,R)=>{let N=null;return(...ne)=>{N&&clearTimeout(N),N=setTimeout(()=>k(...ne),R)}};if(m){const k=P(async()=>{const R=document.querySelector("input#nimbi-search"),N=String(R&&R.value||"").trim().toLowerCase();if(!N){T([]);return}try{await F();const ue=(await g).filter(he=>he.title&&he.title.toLowerCase().includes(N)||he.excerpt&&he.excerpt.toLowerCase().includes(N));T(ue.slice(0,10))}catch(ne){console.warn("[nimbi-cms] search input handler failed",ne),T([])}},50);try{m.addEventListener("input",k)}catch{}try{document.addEventListener("input",R=>{try{R&&R.target&&R.target.id==="nimbi-search"&&k(R)}catch{}},!0)}catch{}}if(l==="eager"){try{g=F()}catch(k){console.warn("[nimbi-cms] eager search index init failed",k),g=Promise.resolve([])}g.finally(()=>{const k=document.querySelector("input#nimbi-search");if(k){try{k.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}})}try{const k=R=>{try{const N=R&&R.target;if(!M||!M.classList.contains("is-open")&&M.style&&M.style.display!=="block"||N&&(M.contains(N)||m&&(N===m||m.contains&&m.contains(N))))return;y&&y.classList.remove("is-active");try{M.style.display="none"}catch{}try{M.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",k,!0),document.addEventListener("touchstart",k,!0)}catch{}}for(let E=0;E<u.length;E++){const L=u[E];if(E===0)continue;const T=L.getAttribute("href")||"#",P=document.createElement("a");P.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(T)||T.endsWith(".md")){const R=ye(T).split(/::|#/,2),N=R[0],ne=R[1];P.href=be(N,ne)}else if(/\.html(?:$|[#?])/.test(T)||T.endsWith(".html")){const R=ye(T).split(/::|#/,2);let N=R[0];N&&!N.toLowerCase().endsWith(".html")&&(N=N+".html");const ne=R[1];try{const ue=await Ae(N,s);if(ue&&ue.raw)try{const Te=new DOMParser().parseFromString(ue.raw,"text/html"),ce=Te.querySelector("title"),Be=Te.querySelector("h1"),pt=ce&&ce.textContent&&ce.textContent.trim()?ce.textContent.trim():Be&&Be.textContent?Be.textContent.trim():null;if(pt){const gt=le(pt);if(gt){try{V.set(gt,N),U.set(N,gt)}catch(jn){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",jn)}P.href=be(gt,ne)}else P.href=be(N,ne)}else P.href=be(N,ne)}catch{P.href=be(N,ne)}else P.href=T}catch{P.href=T}}else P.href=T}catch(k){console.warn("[nimbi-cms] nav item href parse failed",k),P.href=T}try{const k=L.textContent&&String(L.textContent).trim()?String(L.textContent).trim():null;if(k)try{const R=le(k);if(R){const N=P.getAttribute&&P.getAttribute("href")?P.getAttribute("href"):"";try{const ue=new URL(N,location.href).searchParams.get("page");if(ue){const he=decodeURIComponent(ue);try{V.set(R,he),U.set(he,R)}catch(Te){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Te)}}}catch(ne){console.warn("[nimbi-cms] nav slug mapping failed",ne)}}}catch(R){console.warn("[nimbi-cms] nav slug mapping failed",R)}}catch(k){console.warn("[nimbi-cms] nav slug mapping failed",k)}P.textContent=L.textContent||T,S.appendChild(P)}X.appendChild(S),J&&X.appendChild(J),Z.appendChild(W),Z.appendChild(X),e.appendChild(Z);try{const E=L=>{try{const T=Z&&Z.querySelector?Z.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!T||!T.classList.contains("is-active"))return;const P=T&&T.closest?T.closest(".navbar"):Z;if(P&&P.contains(L.target))return;I()}catch{}};document.addEventListener("click",E,!0),document.addEventListener("touchstart",E,!0)}catch{}try{X.addEventListener("click",E=>{const L=E.target&&E.target.closest?E.target.closest("a"):null;if(!L)return;const T=L.getAttribute("href")||"";try{const P=new URL(T,location.href),k=P.searchParams.get("page"),R=P.hash?P.hash.replace(/^#/,""):null;if(k){E.preventDefault(),history.pushState({page:k},"",be(k,R));try{a()}catch(N){console.warn("[nimbi-cms] renderByQuery failed",N)}}}catch(P){console.warn("[nimbi-cms] navbar click handler failed",P)}try{const P=Z&&Z.querySelector?Z.querySelector(".navbar-burger"):null,k=P&&P.dataset?P.dataset.target:null,R=k?document.getElementById(k):null;P&&P.classList.contains("is-active")&&(P.classList.remove("is-active"),P.setAttribute("aria-expanded","false"),R&&R.classList.remove("is-active"))}catch(P){console.warn("[nimbi-cms] mobile menu close failed",P)}})}catch(E){console.warn("[nimbi-cms] attach content click handler failed",E)}try{t.addEventListener("click",E=>{const L=E.target&&E.target.closest?E.target.closest("a"):null;if(!L)return;const T=L.getAttribute("href")||"";if(T&&!ur(T))try{const P=new URL(T,location.href),k=P.searchParams.get("page"),R=P.hash?P.hash.replace(/^#/,""):null;if(k){E.preventDefault(),history.pushState({page:k},"",be(k,R));try{a()}catch(N){console.warn("[nimbi-cms] renderByQuery failed",N)}}}catch(P){console.warn("[nimbi-cms] container click URL parse failed",P)}})}catch(E){console.warn("[nimbi-cms] build navbar failed",E)}return{navbar:Z,linkEls:u}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.style.display="block"}catch{}}}catch{}},!0)}catch{}var Dn,Jr;function da(){if(Jr)return Dn;Jr=1;function e(i,a){return a.some(([o,l])=>o<=i&&i<=l)}function t(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return e(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return e(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(i,a={}){let o=0,l=0,h=i.length-1;const c=a.wordsPerMinute||200,d=a.wordBound||n;for(;d(i[l]);)l++;for(;d(i[h]);)h--;const p=`${i}
`;for(let m=l;m<=h;m++)if((t(p[m])||!d(p[m])&&(d(p[m+1])||t(p[m+1])))&&o++,t(p[m]))for(;m<=h&&(s(p[m+1])||d(p[m+1]));)m++;const f=o/c,u=Math.round(f*60*1e3);return{text:Math.ceil(f.toFixed(2))+" min read",minutes:f,time:u,words:o}}return Dn=r,Dn}var fa=da();const pa=Jn(fa);function ei(e,t){let n=document.querySelector(`meta[name="${e}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",e),document.head.appendChild(n)),n.setAttribute("content",t)}function ft(e,t,n){let s=`meta[${e}="${t}"]`,r=document.querySelector(s);r||(r=document.createElement("meta"),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute("content",n)}function ga(e,t){try{let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",e),document.head.appendChild(n)),n.setAttribute("href",t)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function ma(e,t,n,s){const r=t&&String(t).trim()?t:e.title||document.title;ft("property","og:title",r);const i=s&&String(s).trim()?s:e.description||"";i&&String(i).trim()&&ft("property","og:description",i),ft("name","twitter:card",e.twitter_card||"summary_large_image");const a=n||e.image;a&&(ft("property","og:image",a),ft("name","twitter:image",a))}function wa(e,t,n,s,r=""){const i=e.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",o=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";o&&String(o).trim()&&ei("description",o),ei("robots",i.robots||"index,follow"),ma(i,t,n,o)}function ba(){try{const e=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const t of e){const n=document.querySelector(t);if(n){const s=n.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(e){console.warn("[seoManager] getSiteNameFromMeta failed",e)}return""}function ya(e,t,n,s,r,i=""){try{const a=e.meta||{},o=n&&String(n).trim()?n:a.title||i||document.title,l=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",h=s||a.image||null;let c="";try{if(t){const u=ye(t);try{c=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(u)}catch{c=location.href.split("#")[0]}}else c=location.href.split("#")[0]}catch(u){c=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",u)}c&&ga("canonical",c);try{ft("property","og:url",c)}catch(u){console.warn("[seoManager] upsertMeta og:url failed",u)}const d={"@context":"https://schema.org","@type":"Article",headline:o||"",description:l||"",url:c||location.href.split("#")[0]};h&&(d.image=String(h)),a.date&&(d.datePublished=a.date),a.dateModified&&(d.dateModified=a.dateModified);const p="nimbi-jsonld";let f=document.getElementById(p);f||(f=document.createElement("script"),f.type="application/ld+json",f.id=p,document.head.appendChild(f)),f.textContent=JSON.stringify(d,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function ka(e,t,n,s,r,i,a,o,l,h,c){try{if(s&&s.querySelector){const d=s.querySelector(".menu-label");d&&(d.textContent=o&&o.textContent||e("onThisPage"))}}catch(d){console.warn("[seoManager] update toc label failed",d)}try{const d=n.meta&&n.meta.title?String(n.meta.title).trim():"",p=r.querySelector("img"),f=p&&(p.getAttribute("src")||p.src)||null;let u="";try{let b="";try{const y=o||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let v=y.nextElementSibling;const M=[];for(;v&&!(v.tagName&&v.tagName.toLowerCase()==="h2");){const I=(v.textContent||"").trim();I&&M.push(I),v=v.nextElementSibling}M.length&&(b=M.join(" ").replace(/\s+/g," ").trim()),!b&&l&&(b=String(l).trim())}}catch(y){console.warn("[seoManager] compute descOverride failed",y)}b&&String(b).length>160&&(b=String(b).slice(0,157).trim()+"..."),u=b}catch(b){console.warn("[seoManager] compute descOverride failed",b)}let g="";try{d&&(g=d)}catch{}if(!g)try{o&&o.textContent&&(g=String(o.textContent).trim())}catch{}if(!g)try{const b=r.querySelector("h2");b&&b.textContent&&(g=String(b.textContent).trim())}catch{}g||(g=i||"");try{wa(n,g||void 0,f,u)}catch(b){console.warn("[seoManager] setMetaTags failed",b)}try{ya(n,h,g||void 0,f,u,t)}catch(b){console.warn("[seoManager] setStructuredData failed",b)}const m=ba();g?m?document.title=`${m} - ${g}`:document.title=`${t||"Site"} - ${g}`:d?document.title=d:document.title=t||document.title}catch(d){console.warn("[seoManager] applyPageMeta failed",d)}try{try{const d=r.querySelectorAll(".nimbi-reading-time");d&&d.forEach(p=>p.remove())}catch{}if(l){const d=pa(c.raw||""),p=d&&typeof d.minutes=="number"?Math.ceil(d.minutes):0,f=p?e("readingTime",{minutes:p}):"";if(!f)return;const u=r.querySelector("h1");if(u){const g=r.querySelector(".nimbi-article-subtitle");try{if(g){const m=document.createElement("span");m.className="nimbi-reading-time",m.textContent=" • "+f,g.appendChild(m)}else{const m=document.createElement("p");m.className="nimbi-article-subtitle is-6 has-text-grey-light";const b=document.createElement("span");b.className="nimbi-reading-time",b.textContent=f,m.appendChild(b);try{u.parentElement.insertBefore(m,u.nextSibling)}catch{try{u.insertAdjacentElement("afterend",m)}catch{}}}}catch{try{const b=document.createElement("p");b.className="nimbi-article-subtitle is-6 has-text-grey-light";const y=document.createElement("span");y.className="nimbi-reading-time",y.textContent=f,b.appendChild(y),u.insertAdjacentElement("afterend",b)}catch{}}}}}catch(d){console.warn("[seoManager] reading time update failed",d)}}let Ce=null,j=null,ve=1,Je=(e,t)=>t,$t=0,Pt=0,nn=()=>{},It=.25;function xa(){if(Ce&&document.contains(Ce))return Ce;Ce=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",Je("imagePreviewTitle","Image preview")),e.innerHTML=`
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
  `,e.addEventListener("click",S=>{S.target===e&&Hn()}),e.addEventListener("wheel",S=>{if(!$())return;S.preventDefault();const J=S.deltaY<0?It:-It;Ge(ve+J),h(),c()},{passive:!1}),e.addEventListener("keydown",S=>{if(S.key==="Escape"){Hn();return}if(ve>1){const J=e.querySelector(".nimbi-image-preview__image-wrapper");if(!J)return;const re=40;switch(S.key){case"ArrowUp":J.scrollTop-=re,S.preventDefault();break;case"ArrowDown":J.scrollTop+=re,S.preventDefault();break;case"ArrowLeft":J.scrollLeft-=re,S.preventDefault();break;case"ArrowRight":J.scrollLeft+=re,S.preventDefault();break}}}),document.body.appendChild(e),Ce=e,j=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),s=e.querySelector("[data-nimbi-preview-zoom-in]"),r=e.querySelector("[data-nimbi-preview-zoom-out]"),i=e.querySelector("[data-nimbi-preview-reset]"),a=e.querySelector("[data-nimbi-preview-close]"),o=e.querySelector("[data-nimbi-preview-zoom-label]"),l=e.querySelector("[data-nimbi-preview-zoom-hud]");function h(){o&&(o.textContent=`${Math.round(ve*100)}%`)}const c=()=>{l&&(l.textContent=`${Math.round(ve*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};nn=h,s.addEventListener("click",()=>{Ge(ve+It),h(),c()}),r.addEventListener("click",()=>{Ge(ve-It),h(),c()}),t.addEventListener("click",()=>{zt(),h(),c()}),n.addEventListener("click",()=>{Ge(1),h(),c()}),i.addEventListener("click",()=>{zt(),h(),c()}),a.addEventListener("click",Hn),t.title=Je("imagePreviewFit","Fit to screen"),n.title=Je("imagePreviewOriginal","Original size"),r.title=Je("imagePreviewZoomOut","Zoom out"),s.title=Je("imagePreviewZoomIn","Zoom in"),a.title=Je("imagePreviewClose","Close"),a.setAttribute("aria-label",Je("imagePreviewClose","Close"));let d=!1,p=0,f=0,u=0,g=0;const m=new Map;let b=0,y=1;const v=(S,J)=>{const re=S.x-J.x,E=S.y-J.y;return Math.hypot(re,E)},M=()=>{d=!1,m.clear(),b=0,j&&(j.classList.add("is-panning"),j.classList.remove("is-grabbing"))};let I=0,F=0,Z=0;const W=S=>{const J=Date.now(),re=J-I,E=S.clientX-F,L=S.clientY-Z;I=J,F=S.clientX,Z=S.clientY,re<300&&Math.hypot(E,L)<30&&(Ge(ve>1?1:2),h(),S.preventDefault())},fe=S=>{Ge(ve>1?1:2),h(),S.preventDefault()},$=()=>Ce?typeof Ce.open=="boolean"?Ce.open:Ce.classList.contains("is-active"):!1,q=(S,J,re=1)=>{if(m.has(re)&&m.set(re,{x:S,y:J}),m.size===2){const P=Array.from(m.values()),k=v(P[0],P[1]);if(b>0){const R=k/b;Ge(y*R)}return}if(!d)return;const E=j.closest(".nimbi-image-preview__image-wrapper");if(!E)return;const L=S-p,T=J-f;E.scrollLeft=u-L,E.scrollTop=g-T},Q=(S,J,re=1)=>{if(!$())return;if(m.set(re,{x:S,y:J}),m.size===2){const T=Array.from(m.values());b=v(T[0],T[1]),y=ve;return}const E=j.closest(".nimbi-image-preview__image-wrapper");!E||!(E.scrollWidth>E.clientWidth||E.scrollHeight>E.clientHeight)||(d=!0,p=S,f=J,u=E.scrollLeft,g=E.scrollTop,j.classList.add("is-panning"),j.classList.remove("is-grabbing"),window.addEventListener("pointermove",O),window.addEventListener("pointerup",oe),window.addEventListener("pointercancel",oe))},O=S=>{d&&(S.preventDefault(),q(S.clientX,S.clientY,S.pointerId))},oe=()=>{M(),window.removeEventListener("pointermove",O),window.removeEventListener("pointerup",oe),window.removeEventListener("pointercancel",oe)};j.addEventListener("pointerdown",S=>{S.preventDefault(),Q(S.clientX,S.clientY,S.pointerId)}),j.addEventListener("pointermove",S=>{(d||m.size===2)&&S.preventDefault(),q(S.clientX,S.clientY,S.pointerId)}),j.addEventListener("pointerup",S=>{S.preventDefault(),S.pointerType==="touch"&&W(S),M()}),j.addEventListener("dblclick",fe),j.addEventListener("pointercancel",M),j.addEventListener("mousedown",S=>{S.preventDefault(),Q(S.clientX,S.clientY,1)}),j.addEventListener("mousemove",S=>{d&&S.preventDefault(),q(S.clientX,S.clientY,1)}),j.addEventListener("mouseup",S=>{S.preventDefault(),M()});const X=e.querySelector(".nimbi-image-preview__image-wrapper");return X&&(X.addEventListener("pointerdown",S=>{if(Q(S.clientX,S.clientY,S.pointerId),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),X.addEventListener("pointermove",S=>{q(S.clientX,S.clientY,S.pointerId)}),X.addEventListener("pointerup",M),X.addEventListener("pointercancel",M),X.addEventListener("mousedown",S=>{if(Q(S.clientX,S.clientY,1),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),X.addEventListener("mousemove",S=>{q(S.clientX,S.clientY,1)}),X.addEventListener("mouseup",M)),e}function Ge(e){if(!j)return;const t=Number(e);ve=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const s=j.getBoundingClientRect(),r=$t||j.naturalWidth||j.width||s.width||0,i=Pt||j.naturalHeight||j.height||s.height||0;if(r&&i){j.style.setProperty("--nimbi-preview-img-max-width","none"),j.style.setProperty("--nimbi-preview-img-max-height","none"),j.style.setProperty("--nimbi-preview-img-width",`${r*ve}px`),j.style.setProperty("--nimbi-preview-img-height",`${i*ve}px`),j.style.setProperty("--nimbi-preview-img-transform","none");try{j.style.width=`${r*ve}px`,j.style.height=`${i*ve}px`,j.style.transform="none"}catch{}}else{j.style.setProperty("--nimbi-preview-img-max-width",""),j.style.setProperty("--nimbi-preview-img-max-height",""),j.style.setProperty("--nimbi-preview-img-width",""),j.style.setProperty("--nimbi-preview-img-height",""),j.style.setProperty("--nimbi-preview-img-transform",`scale(${ve})`);try{j.style.transform=`scale(${ve})`}catch{}}j&&(j.classList.add("is-panning"),j.classList.remove("is-grabbing"))}function zt(){if(!j)return;const e=j.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=$t||j.naturalWidth||t.width,s=Pt||j.naturalHeight||t.height;if(!n||!s)return;const r=t.width/n,i=t.height/s,a=Math.min(r,i,1);Ge(Number.isFinite(a)?a:1)}function Sa(e,t="",n=0,s=0){const r=xa();ve=1,$t=n||0,Pt=s||0,j.src=e,j.alt=t,j.style.transform="scale(1)";const i=()=>{$t=j.naturalWidth||j.width||0,Pt=j.naturalHeight||j.height||0};if(i(),zt(),nn(),requestAnimationFrame(()=>{zt(),nn()}),!$t||!Pt){const a=()=>{i(),requestAnimationFrame(()=>{zt(),nn()}),j.removeEventListener("load",a)};j.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function Hn(){if(Ce){typeof Ce.close=="function"&&Ce.open&&Ce.close(),Ce.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function va(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;Je=(f,u)=>(typeof t=="function"?t(f):void 0)||u,It=n,e.addEventListener("click",f=>{const u=f.target;if(!u||u.tagName!=="IMG")return;const g=u;if(g.src){if(f.defaultPrevented!==!0){const m=g.closest("a");m&&m.getAttribute("href")&&f.preventDefault()}Sa(g.src,g.alt||"",g.naturalWidth||0,g.naturalHeight||0)}});let s=!1,r=0,i=0,a=0,o=0;const l=new Map;let h=0,c=1;const d=(f,u)=>{const g=f.x-u.x,m=f.y-u.y;return Math.hypot(g,m)};e.addEventListener("pointerdown",f=>{const u=f.target;if(!u||u.tagName!=="IMG"||!Ce||!Ce.open)return;if(l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){const m=Array.from(l.values());h=d(m[0],m[1]),c=ve;return}const g=u.closest(".nimbi-image-preview__image-wrapper");if(g&&!(ve<=1)){f.preventDefault(),s=!0,r=f.clientX,i=f.clientY,a=g.scrollLeft,o=g.scrollTop,u.setPointerCapture(f.pointerId);try{u.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",f=>{if(l.has(f.pointerId)&&l.set(f.pointerId,{x:f.clientX,y:f.clientY}),l.size===2){f.preventDefault();const y=Array.from(l.values()),v=d(y[0],y[1]);if(h>0){const M=v/h;Ge(c*M)}return}if(!s)return;f.preventDefault();const g=f.target.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const m=f.clientX-r,b=f.clientY-i;g.scrollLeft=a-m,g.scrollTop=o-b});const p=()=>{s=!1,l.clear(),h=0;try{const f=document.querySelector("[data-nimbi-preview-image]");f&&(f.classList.add("is-panning"),f.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p)}function Ea(e){const{contentWrap:t,navWrap:n,container:s,mountOverlay:r=null,t:i,contentBase:a,homePage:o,initialDocumentTitle:l,runHooks:h}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let c=null;const d=Vs(i,[{path:o,name:i("home"),isIndex:!0,children:[]}]);async function p(b,y){let v,M,I;try{({data:v,pagePath:M,anchor:I}=await ns(b,a))}catch(Q){console.error("[nimbi-cms] fetchPageData failed",Q),Yr(t,i,Q);return}!I&&y&&(I=y);try{qn(null)}catch(Q){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",Q)}t.innerHTML="";const{article:F,parsed:Z,toc:W,topH1:fe,h1Text:$,slugKey:q}=await aa(i,v,M,I,a);ka(i,l,Z,W,F,M,I,fe,$,q,v),n.innerHTML="",W&&(n.appendChild(W),ca(W));try{await h("transformHtml",{article:F,parsed:Z,toc:W,pagePath:M,anchor:I,topH1:fe,h1Text:$,slugKey:q,data:v})}catch(Q){console.warn("[nimbi-cms] transformHtml hooks failed",Q)}t.appendChild(F);try{la(F)}catch(Q){console.warn("[nimbi-cms] executeEmbeddedScripts failed",Q)}try{va(F,{t:i})}catch(Q){console.warn("[nimbi-cms] attachImagePreview failed",Q)}try{Dt(s,100,!1),requestAnimationFrame(()=>Dt(s,100,!1)),setTimeout(()=>Dt(s,100,!1),250)}catch(Q){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",Q)}qn(I),ua(F,fe,{mountOverlay:r,container:s,navWrap:n,t:i});try{await h("onPageLoad",{data:v,pagePath:M,anchor:I,article:F,toc:W,topH1:fe,h1Text:$,slugKey:q,contentWrap:t,navWrap:n})}catch(Q){console.warn("[nimbi-cms] onPageLoad hooks failed",Q)}c=M}async function f(){let b=new URLSearchParams(location.search).get("page")||o;const y=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await p(b,y)}catch(v){console.warn("[nimbi-cms] renderByQuery failed for",b,v),Yr(t,i,v)}}window.addEventListener("popstate",f);const u=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,g=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const y={top:b.scrollTop||0,left:b.scrollLeft||0};sessionStorage.setItem(u(),JSON.stringify(y))}catch{}},m=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const y=sessionStorage.getItem(u());if(!y)return;const v=JSON.parse(y);v&&typeof v.top=="number"&&b.scrollTo({top:v.top,left:v.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",b=>{if(b.persisted)try{m(),Dt(s,100,!1)}catch(y){console.warn("[nimbi-cms] bfcache restore failed",y)}}),window.addEventListener("pagehide",()=>{try{g()}catch(b){console.warn("[nimbi-cms] save scroll position failed",b)}}),{renderByQuery:f,siteNav:d,getCurrentPagePath:()=>c}}function Aa(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location&&window.location.hash){const i=window.location.hash,a=i.indexOf("?");a!==-1&&(t=i.slice(a))}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),s={},r=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(s.contentPath=n.get("contentPath")),n.has("searchIndex")){const i=r(n.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(n.has("searchIndexMode")){const i=n.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(n.has("defaultStyle")){const i=n.get("defaultStyle");(i==="light"||i==="dark"||i==="system")&&(s.defaultStyle=i)}if(n.has("bulmaCustomize")&&(s.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(s.lang=n.get("lang")),n.has("l10nFile")){const i=n.get("l10nFile");s.l10nFile=i==="null"?null:i}if(n.has("cacheTtlMinutes")){const i=Number(n.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(n.has("cacheMaxEntries")){const i=Number(n.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(n.has("homePage")&&(s.homePage=n.get("homePage")),n.has("notFoundPage")&&(s.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(s.availableLanguages=n.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),n.has("indexDepth")){const i=Number(n.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(o=>o.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function La(e){return!(typeof e!="string"||!e.trim()||e.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e)||e.startsWith("//")||e.startsWith("/")||/^[A-Za-z]:\\/.test(e))}function ti(e){if(typeof e!="string")return!1;const t=e.trim();return!(!t||t.includes("/")||t.includes("\\")||t.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(t))}let Un="";async function ni(e={}){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.info("[nimbi-cms] initCMS called",{options:e})}catch{}if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const n=Aa();if(n&&(n.contentPath||n.homePage||n.notFoundPage))if(e&&e.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch($){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",$)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch($){console.warn("[nimbi-cms] logging ignore of URL overrides failed",$)}delete n.contentPath,delete n.homePage,delete n.notFoundPage}const s=Object.assign({},n,e);n&&typeof n.bulmaCustomize=="string"&&n.bulmaCustomize.trim()&&(s.bulmaCustomize=n.bulmaCustomize);const{el:r,contentPath:i="/content",crawlMaxQueue:a=1e3,searchIndex:o=!0,searchIndexMode:l="eager",indexDepth:h=1,noIndexing:c=void 0,defaultStyle:d="light",bulmaCustomize:p="none",lang:f=void 0,l10nFile:u=null,cacheTtlMinutes:g=5,cacheMaxEntries:m,markdownExtensions:b,availableLanguages:y,homePage:v="_home.md",notFoundPage:M="_404.md"}=s,{navbarLogo:I="favicon"}=s,{skipRootReadme:F=!1}=s,Z=$=>{try{const q=document.querySelector(r);q&&q instanceof Element&&(q.innerHTML=`<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String($)}</pre></div>`)}catch{}};if(s.contentPath!=null&&!La(s.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(s.homePage!=null&&!ti(s.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(s.notFoundPage!=null&&!ti(s.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!r)throw new Error("el is required");let W=r;if(typeof r=="string"){if(W=document.querySelector(r),!W)throw new Error(`el selector "${r}" did not match any element`)}else if(!(r instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof i!="string"||!i.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof o!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(l!=null&&l!=="eager"&&l!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(h!=null&&h!==1&&h!==2&&h!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(d!=="light"&&d!=="dark"&&d!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(u!=null&&typeof u!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(g!=null&&(typeof g!="number"||!Number.isFinite(g)||g<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(b!=null&&(!Array.isArray(b)||b.some($=>!$||typeof $!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some($=>typeof $!="string"||!$.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(c!=null&&(!Array.isArray(c)||c.some($=>typeof $!="string"||!$.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(F!=null&&typeof F!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(v!=null&&(typeof v!="string"||!v.trim()||!/\.(md|html)$/.test(v)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(M!=null&&(typeof M!="string"||!M.trim()||!/\.(md|html)$/.test(M)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const fe=!!o;try{Promise.resolve().then(()=>Qt).then($=>{try{$&&typeof $.setSkipRootReadme=="function"&&$.setSkipRootReadme(!!F)}catch(q){console.warn("[nimbi-cms] setSkipRootReadme failed",q)}}).catch($=>{})}catch($){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",$)}try{await(async()=>{try{W.classList.add("nimbi-mount")}catch(k){console.warn("[nimbi-cms] mount element setup failed",k)}const $=document.createElement("section");$.className="section";const q=document.createElement("div");q.className="container nimbi-cms";const Q=document.createElement("div");Q.className="columns";const O=document.createElement("div");O.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",O.setAttribute("role","navigation");try{const k=typeof ut=="function"?ut("navigation"):null;k&&O.setAttribute("aria-label",k)}catch(k){console.warn("[nimbi-cms] set nav aria-label failed",k)}Q.appendChild(O);const oe=document.createElement("main");oe.className="column nimbi-content",oe.setAttribute("role","main"),Q.appendChild(oe),q.appendChild(Q),$.appendChild(q);const X=O,S=oe;W.appendChild($);let J=null;try{J=W.querySelector(".nimbi-overlay"),J||(J=document.createElement("div"),J.className="nimbi-overlay",W.appendChild(J))}catch(k){J=null,console.warn("[nimbi-cms] mount overlay setup failed",k)}const re=location.pathname||"/",E=re.endsWith("/")?re:re.substring(0,re.lastIndexOf("/")+1);try{Un=document.title||""}catch(k){Un="",console.warn("[nimbi-cms] read initial document title failed",k)}let L=i;(L==="."||L==="./")&&(L=""),L.startsWith("./")&&(L=L.slice(2)),L.startsWith("/")&&(L=L.slice(1)),L!==""&&!L.endsWith("/")&&(L=L+"/");const T=new URL(E+L,location.origin).toString();try{Promise.resolve().then(()=>Qt).then(k=>{try{k&&typeof k.setHomePage=="function"&&k.setHomePage(v)}catch(R){console.warn("[nimbi-cms] setHomePage failed",R)}}).catch(k=>{})}catch(k){console.warn("[nimbi-cms] setHomePage dynamic import failed",k)}u&&await gn(u,E),y&&Array.isArray(y)&&hr(y),f&&mn(f);const P=Ea({contentWrap:S,navWrap:X,container:q,mountOverlay:J,t:ut,contentBase:T,homePage:v,initialDocumentTitle:Un,runHooks:un});if(typeof g=="number"&&g>=0&&typeof Sr=="function"&&Sr(g*60*1e3),typeof m=="number"&&m>=0&&typeof xr=="function"&&xr(m),b&&Array.isArray(b)&&b.length)try{b.forEach(k=>{typeof k=="object"&&Ks&&typeof In=="function"&&In(k)})}catch(k){console.warn("[nimbi-cms] applying markdownExtensions failed",k)}try{typeof a=="number"&&Promise.resolve().then(()=>Qt).then(({setDefaultCrawlMaxQueue:k})=>{try{k(a)}catch(R){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",R)}})}catch(k){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",k)}try{Ft(T)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{xn(M)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{Ft(T)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{xn(M)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{await Ae(v,T)}catch(k){throw v==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${v} not found at ${T}${v}: ${k.message}`)}rr(d),await nr(p,E);try{const k=document.createElement("header");k.className="nimbi-site-navbar",W.insertBefore(k,$);const R=await Ae("_navigation.md",T),N=await tn(R.raw||""),{navbar:ne,linkEls:ue}=await ha(k,q,N.html||"",T,v,ut,P.renderByQuery,fe,l,h,c,I);try{await un("onNavBuild",{navWrap:X,navbar:ne,linkEls:ue,contentBase:T})}catch(he){console.warn("[nimbi-cms] onNavBuild hooks failed",he)}try{const he=()=>{const Te=k&&k.getBoundingClientRect&&Math.round(k.getBoundingClientRect().height)||k&&k.offsetHeight||0;if(Te>0){try{W.style.setProperty("--nimbi-site-navbar-height",`${Te}px`)}catch(ce){console.warn("[nimbi-cms] set CSS var failed",ce)}try{q.style.paddingTop=""}catch(ce){console.warn("[nimbi-cms] set container paddingTop failed",ce)}try{const ce=W&&W.getBoundingClientRect&&Math.round(W.getBoundingClientRect().height)||W&&W.clientHeight||0;if(ce>0){const Be=Math.max(0,ce-Te);try{q.style.setProperty("--nimbi-cms-height",`${Be}px`)}catch(pt){console.warn("[nimbi-cms] set --nimbi-cms-height failed",pt)}}else try{q.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(Be){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Be)}}catch(ce){console.warn("[nimbi-cms] compute container height failed",ce)}try{k.style.setProperty("--nimbi-site-navbar-height",`${Te}px`)}catch(ce){console.warn("[nimbi-cms] set navbar CSS var failed",ce)}}};he();try{if(typeof ResizeObserver<"u"){const Te=new ResizeObserver(()=>he());try{Te.observe(k)}catch(ce){console.warn("[nimbi-cms] ResizeObserver.observe failed",ce)}}}catch(Te){console.warn("[nimbi-cms] ResizeObserver setup failed",Te)}}catch(he){console.warn("[nimbi-cms] compute navbar height failed",he)}}catch(k){console.warn("[nimbi-cms] build navigation failed",k)}await P.renderByQuery();try{Promise.resolve().then(()=>Ta).then(({getVersion:k})=>{typeof k=="function"&&k().then(R=>{try{const N=R||"0.0.0";try{const ne=Te=>{const ce=document.createElement("a");ce.className="nimbi-version-label tag is-small",ce.textContent=`Ninbi CMS v. ${N}`,ce.href=Te||"#",ce.target="_blank",ce.rel="noopener noreferrer nofollow",ce.setAttribute("aria-label",`Ninbi CMS version ${N}`);try{ir(ce)}catch{}try{W.appendChild(ce)}catch(Be){console.warn("[nimbi-cms] append version label failed",Be)}},ue="https://abelvm.github.io/nimbiCMS/",he=(()=>{try{if(ue&&typeof ue=="string")return new URL(ue).toString()}catch{}return"#"})();ne(he)}catch(ne){console.warn("[nimbi-cms] building version label failed",ne)}}catch(N){console.warn("[nimbi-cms] building version label failed",N)}}).catch(R=>{console.warn("[nimbi-cms] getVersion() failed",R)})}).catch(k=>{console.warn("[nimbi-cms] import version module failed",k)})}catch(k){console.warn("[nimbi-cms] version label setup failed",k)}})()}catch($){throw Z($),$}}async function ri(){try{if("0.1.0".trim())return"0.1.0"}catch{}return"0.0.0"}const Ta=Object.freeze(Object.defineProperty({__proto__:null,getVersion:ri},Symbol.toStringTag,{value:"Module"}));pe.BAD_LANGUAGES=dn,pe.SUPPORTED_HLJS_MAP=te,pe._clearHooks=vi,pe.addHook=Bt,pe.default=ni,pe.ensureBulma=nr,pe.getVersion=ri,pe.initCMS=ni,pe.loadL10nFile=gn,pe.loadSupportedLanguages=pn,pe.observeCodeBlocks=tr,pe.onNavBuild=xi,pe.onPageLoad=ki,pe.registerLanguage=ot,pe.runHooks=un,pe.setHighlightTheme=Ci,pe.setLang=mn,pe.setStyle=rr,pe.setThemeVars=_i,pe.t=ut,pe.transformHtml=Si,Object.defineProperties(pe,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
