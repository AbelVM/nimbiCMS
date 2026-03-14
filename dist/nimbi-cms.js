(function(le,He){typeof exports=="object"&&typeof module<"u"?He(exports):typeof define=="function"&&define.amd?define(["exports"],He):(le=typeof globalThis<"u"?globalThis:le||self,He(le.nimbiCMS={}))})(this,(function(le){"use strict";const He={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Lt(t,e){if(!Object.prototype.hasOwnProperty.call(He,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");He[t].push(e)}function Ei(t){Lt("onPageLoad",t)}function Ai(t){Lt("onNavBuild",t)}function Ri(t){Lt("transformHtml",t)}async function nn(t,e){const r=He[t]||[];for(const s of r)try{await s(e)}catch(n){console.warn("[nimbi-cms] runHooks callback failed",n)}}function Ti(){Object.keys(He).forEach(t=>{He[t].length=0})}function Qn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var rn,Gn;function Ci(){if(Gn)return rn;Gn=1;function t(g){return g instanceof Map?g.clear=g.delete=g.set=function(){throw new Error("map is read-only")}:g instanceof Set&&(g.add=g.clear=g.delete=function(){throw new Error("set is read-only")}),Object.freeze(g),Object.getOwnPropertyNames(g).forEach(S=>{const L=g[S],F=typeof L;(F==="object"||F==="function")&&!Object.isFrozen(L)&&t(L)}),g}class e{constructor(S){S.data===void 0&&(S.data={}),this.data=S.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function r(g){return g.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(g,...S){const L=Object.create(null);for(const F in g)L[F]=g[F];return S.forEach(function(F){for(const de in F)L[de]=F[de]}),L}const n="</span>",i=g=>!!g.scope,a=(g,{prefix:S})=>{if(g.startsWith("language:"))return g.replace("language:","language-");if(g.includes(".")){const L=g.split(".");return[`${S}${L.shift()}`,...L.map((F,de)=>`${F}${"_".repeat(de+1)}`)].join(" ")}return`${S}${g}`};class h{constructor(S,L){this.buffer="",this.classPrefix=L.classPrefix,S.walk(this)}addText(S){this.buffer+=r(S)}openNode(S){if(!i(S))return;const L=a(S.scope,{prefix:this.classPrefix});this.span(L)}closeNode(S){i(S)&&(this.buffer+=n)}value(){return this.buffer}span(S){this.buffer+=`<span class="${S}">`}}const l=(g={})=>{const S={children:[]};return Object.assign(S,g),S};class o{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(S){this.top.children.push(S)}openNode(S){const L=l({scope:S});this.add(L),this.stack.push(L)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(S){return this.constructor._walk(S,this.rootNode)}static _walk(S,L){return typeof L=="string"?S.addText(L):L.children&&(S.openNode(L),L.children.forEach(F=>this._walk(S,F)),S.closeNode(L)),S}static _collapse(S){typeof S!="string"&&S.children&&(S.children.every(L=>typeof L=="string")?S.children=[S.children.join("")]:S.children.forEach(L=>{o._collapse(L)}))}}class u extends o{constructor(S){super(),this.options=S}addText(S){S!==""&&this.add(S)}startScope(S){this.openNode(S)}endScope(){this.closeNode()}__addSublanguage(S,L){const F=S.root;L&&(F.scope=`language:${L}`),this.add(F)}toHTML(){return new h(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function c(g){return g?typeof g=="string"?g:g.source:null}function f(g){return m("(?=",g,")")}function p(g){return m("(?:",g,")*")}function d(g){return m("(?:",g,")?")}function m(...g){return g.map(L=>c(L)).join("")}function w(g){const S=g[g.length-1];return typeof S=="object"&&S.constructor===Object?(g.splice(g.length-1,1),S):{}}function y(...g){return"("+(w(g).capture?"":"?:")+g.map(F=>c(F)).join("|")+")"}function x(g){return new RegExp(g.toString()+"|").exec("").length-1}function z(g,S){const L=g&&g.exec(S);return L&&L.index===0}const R=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function _(g,{joinWith:S}){let L=0;return g.map(F=>{L+=1;const de=L;let pe=c(F),N="";for(;pe.length>0;){const B=R.exec(pe);if(!B){N+=pe;break}N+=pe.substring(0,B.index),pe=pe.substring(B.index+B[0].length),B[0][0]==="\\"&&B[1]?N+="\\"+String(Number(B[1])+de):(N+=B[0],B[0]==="("&&L++)}return N}).map(F=>`(${F})`).join(S)}const q=/\b\B/,O="[a-zA-Z]\\w*",Q="[a-zA-Z_]\\w*",Y="\\b\\d+(\\.\\d+)?",ne="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",P="\\b(0b[01]+)",T="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",I=(g={})=>{const S=/^#![ ]*\//;return g.binary&&(g.begin=m(S,/.*\b/,g.binary,/\b.*/)),s({scope:"meta",begin:S,end:/$/,relevance:0,"on:begin":(L,F)=>{L.index!==0&&F.ignoreMatch()}},g)},C={begin:"\\\\[\\s\\S]",relevance:0},v={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[C]},b={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[C]},E={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},$=function(g,S,L={}){const F=s({scope:"comment",begin:g,end:S,contains:[]},L);F.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const de=y("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return F.contains.push({begin:m(/[ ]+/,"(",de,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),F},k=$("//","$"),G=$("/\\*","\\*/"),he=$("#","$"),ce={scope:"number",begin:Y,relevance:0},Me={scope:"number",begin:ne,relevance:0},Ee={scope:"number",begin:P,relevance:0},Ce={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[C,{begin:/\[/,end:/\]/,relevance:0,contains:[C]}]},ge={scope:"title",begin:O,relevance:0},Oe={scope:"title",begin:Q,relevance:0},et={begin:"\\.\\s*"+Q,relevance:0};var Xt=Object.freeze({__proto__:null,APOS_STRING_MODE:v,BACKSLASH_ESCAPE:C,BINARY_NUMBER_MODE:Ee,BINARY_NUMBER_RE:P,COMMENT:$,C_BLOCK_COMMENT_MODE:G,C_LINE_COMMENT_MODE:k,C_NUMBER_MODE:Me,C_NUMBER_RE:ne,END_SAME_AS_BEGIN:function(g){return Object.assign(g,{"on:begin":(S,L)=>{L.data._beginMatch=S[1]},"on:end":(S,L)=>{L.data._beginMatch!==S[1]&&L.ignoreMatch()}})},HASH_COMMENT_MODE:he,IDENT_RE:O,MATCH_NOTHING_RE:q,METHOD_GUARD:et,NUMBER_MODE:ce,NUMBER_RE:Y,PHRASAL_WORDS_MODE:E,QUOTE_STRING_MODE:b,REGEXP_MODE:Ce,RE_STARTERS_RE:T,SHEBANG:I,TITLE_MODE:ge,UNDERSCORE_IDENT_RE:Q,UNDERSCORE_TITLE_MODE:Oe});function Ta(g,S){g.input[g.index-1]==="."&&S.ignoreMatch()}function Ca(g,S){g.className!==void 0&&(g.scope=g.className,delete g.className)}function La(g,S){S&&g.beginKeywords&&(g.begin="\\b("+g.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",g.__beforeBegin=Ta,g.keywords=g.keywords||g.beginKeywords,delete g.beginKeywords,g.relevance===void 0&&(g.relevance=0))}function _a(g,S){Array.isArray(g.illegal)&&(g.illegal=y(...g.illegal))}function Ma(g,S){if(g.match){if(g.begin||g.end)throw new Error("begin & end are not supported with match");g.begin=g.match,delete g.match}}function $a(g,S){g.relevance===void 0&&(g.relevance=1)}const Pa=(g,S)=>{if(!g.beforeMatch)return;if(g.starts)throw new Error("beforeMatch cannot be used with starts");const L=Object.assign({},g);Object.keys(g).forEach(F=>{delete g[F]}),g.keywords=L.keywords,g.begin=m(L.beforeMatch,f(L.begin)),g.starts={relevance:0,contains:[Object.assign(L,{endsParent:!0})]},g.relevance=0,delete L.beforeMatch},Ia=["of","and","for","in","not","or","if","then","parent","list","value"],za="keyword";function oi(g,S,L=za){const F=Object.create(null);return typeof g=="string"?de(L,g.split(" ")):Array.isArray(g)?de(L,g):Object.keys(g).forEach(function(pe){Object.assign(F,oi(g[pe],S,pe))}),F;function de(pe,N){S&&(N=N.map(B=>B.toLowerCase())),N.forEach(function(B){const j=B.split("|");F[j[0]]=[pe,Ba(j[0],j[1])]})}}function Ba(g,S){return S?Number(S):Oa(g)?0:1}function Oa(g){return Ia.includes(g.toLowerCase())}const ci={},tt=g=>{console.error(g)},ui=(g,...S)=>{console.log(`WARN: ${g}`,...S)},ct=(g,S)=>{ci[`${g}/${S}`]||(console.log(`Deprecated as of ${g}. ${S}`),ci[`${g}/${S}`]=!0)},Kt=new Error;function hi(g,S,{key:L}){let F=0;const de=g[L],pe={},N={};for(let B=1;B<=S.length;B++)N[B+F]=de[B],pe[B+F]=!0,F+=x(S[B-1]);g[L]=N,g[L]._emit=pe,g[L]._multi=!0}function Na(g){if(Array.isArray(g.begin)){if(g.skip||g.excludeBegin||g.returnBegin)throw tt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Kt;if(typeof g.beginScope!="object"||g.beginScope===null)throw tt("beginScope must be object"),Kt;hi(g,g.begin,{key:"beginScope"}),g.begin=_(g.begin,{joinWith:""})}}function Da(g){if(Array.isArray(g.end)){if(g.skip||g.excludeEnd||g.returnEnd)throw tt("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Kt;if(typeof g.endScope!="object"||g.endScope===null)throw tt("endScope must be object"),Kt;hi(g,g.end,{key:"endScope"}),g.end=_(g.end,{joinWith:""})}}function Ha(g){g.scope&&typeof g.scope=="object"&&g.scope!==null&&(g.beginScope=g.scope,delete g.scope)}function Ua(g){Ha(g),typeof g.beginScope=="string"&&(g.beginScope={_wrap:g.beginScope}),typeof g.endScope=="string"&&(g.endScope={_wrap:g.endScope}),Na(g),Da(g)}function qa(g){function S(N,B){return new RegExp(c(N),"m"+(g.case_insensitive?"i":"")+(g.unicodeRegex?"u":"")+(B?"g":""))}class L{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(B,j){j.position=this.position++,this.matchIndexes[this.matchAt]=j,this.regexes.push([j,B]),this.matchAt+=x(B)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const B=this.regexes.map(j=>j[1]);this.matcherRe=S(_(B,{joinWith:"|"}),!0),this.lastIndex=0}exec(B){this.matcherRe.lastIndex=this.lastIndex;const j=this.matcherRe.exec(B);if(!j)return null;const we=j.findIndex((Ct,Dn)=>Dn>0&&Ct!==void 0),fe=this.matchIndexes[we];return j.splice(0,we),Object.assign(j,fe)}}class F{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(B){if(this.multiRegexes[B])return this.multiRegexes[B];const j=new L;return this.rules.slice(B).forEach(([we,fe])=>j.addRule(we,fe)),j.compile(),this.multiRegexes[B]=j,j}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(B,j){this.rules.push([B,j]),j.type==="begin"&&this.count++}exec(B){const j=this.getMatcher(this.regexIndex);j.lastIndex=this.lastIndex;let we=j.exec(B);if(this.resumingScanAtSamePosition()&&!(we&&we.index===this.lastIndex)){const fe=this.getMatcher(0);fe.lastIndex=this.lastIndex+1,we=fe.exec(B)}return we&&(this.regexIndex+=we.position+1,this.regexIndex===this.count&&this.considerAll()),we}}function de(N){const B=new F;return N.contains.forEach(j=>B.addRule(j.begin,{rule:j,type:"begin"})),N.terminatorEnd&&B.addRule(N.terminatorEnd,{type:"end"}),N.illegal&&B.addRule(N.illegal,{type:"illegal"}),B}function pe(N,B){const j=N;if(N.isCompiled)return j;[Ca,Ma,Ua,Pa].forEach(fe=>fe(N,B)),g.compilerExtensions.forEach(fe=>fe(N,B)),N.__beforeBegin=null,[La,_a,$a].forEach(fe=>fe(N,B)),N.isCompiled=!0;let we=null;return typeof N.keywords=="object"&&N.keywords.$pattern&&(N.keywords=Object.assign({},N.keywords),we=N.keywords.$pattern,delete N.keywords.$pattern),we=we||/\w+/,N.keywords&&(N.keywords=oi(N.keywords,g.case_insensitive)),j.keywordPatternRe=S(we,!0),B&&(N.begin||(N.begin=/\B|\b/),j.beginRe=S(j.begin),!N.end&&!N.endsWithParent&&(N.end=/\B|\b/),N.end&&(j.endRe=S(j.end)),j.terminatorEnd=c(j.end)||"",N.endsWithParent&&B.terminatorEnd&&(j.terminatorEnd+=(N.end?"|":"")+B.terminatorEnd)),N.illegal&&(j.illegalRe=S(N.illegal)),N.contains||(N.contains=[]),N.contains=[].concat(...N.contains.map(function(fe){return ja(fe==="self"?N:fe)})),N.contains.forEach(function(fe){pe(fe,j)}),N.starts&&pe(N.starts,B),j.matcher=de(j),j}if(g.compilerExtensions||(g.compilerExtensions=[]),g.contains&&g.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return g.classNameAliases=s(g.classNameAliases||{}),pe(g)}function di(g){return g?g.endsWithParent||di(g.starts):!1}function ja(g){return g.variants&&!g.cachedVariants&&(g.cachedVariants=g.variants.map(function(S){return s(g,{variants:null},S)})),g.cachedVariants?g.cachedVariants:di(g)?s(g,{starts:g.starts?s(g.starts):null}):Object.isFrozen(g)?s(g):g}var Wa="11.11.1";class Fa extends Error{constructor(S,L){super(S),this.name="HTMLInjectionError",this.html=L}}const Nn=r,pi=s,fi=Symbol("nomatch"),Za=7,gi=function(g){const S=Object.create(null),L=Object.create(null),F=[];let de=!0;const pe="Could not find the language '{}', did you forget to load/include a language module?",N={disableAutodetect:!0,name:"Plain text",contains:[]};let B={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:u};function j(A){return B.noHighlightRe.test(A)}function we(A){let U=A.className+" ";U+=A.parentNode?A.parentNode.className:"";const J=B.languageDetectRe.exec(U);if(J){const se=Xe(J[1]);return se||(ui(pe.replace("{}",J[1])),ui("Falling back to no-highlight mode for this block.",A)),se?J[1]:"no-highlight"}return U.split(/\s+/).find(se=>j(se)||Xe(se))}function fe(A,U,J){let se="",me="";typeof U=="object"?(se=A,J=U.ignoreIllegals,me=U.language):(ct("10.7.0","highlight(lang, code, ...args) has been deprecated."),ct("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),me=A,se=U),J===void 0&&(J=!0);const Ie={code:se,language:me};Vt("before:highlight",Ie);const Ke=Ie.result?Ie.result:Ct(Ie.language,Ie.code,J);return Ke.code=Ie.code,Vt("after:highlight",Ke),Ke}function Ct(A,U,J,se){const me=Object.create(null);function Ie(M,D){return M.keywords[D]}function Ke(){if(!Z.keywords){ye.addText(ae);return}let M=0;Z.keywordPatternRe.lastIndex=0;let D=Z.keywordPatternRe.exec(ae),X="";for(;D;){X+=ae.substring(M,D.index);const ie=De.case_insensitive?D[0].toLowerCase():D[0],Se=Ie(Z,ie);if(Se){const[je,cl]=Se;if(ye.addText(X),X="",me[ie]=(me[ie]||0)+1,me[ie]<=Za&&(tn+=cl),je.startsWith("_"))X+=D[0];else{const ul=De.classNameAliases[je]||je;Ne(D[0],ul)}}else X+=D[0];M=Z.keywordPatternRe.lastIndex,D=Z.keywordPatternRe.exec(ae)}X+=ae.substring(M),ye.addText(X)}function Jt(){if(ae==="")return;let M=null;if(typeof Z.subLanguage=="string"){if(!S[Z.subLanguage]){ye.addText(ae);return}M=Ct(Z.subLanguage,ae,!0,vi[Z.subLanguage]),vi[Z.subLanguage]=M._top}else M=Hn(ae,Z.subLanguage.length?Z.subLanguage:null);Z.relevance>0&&(tn+=M.relevance),ye.__addSublanguage(M._emitter,M.language)}function Le(){Z.subLanguage!=null?Jt():Ke(),ae=""}function Ne(M,D){M!==""&&(ye.startScope(D),ye.addText(M),ye.endScope())}function yi(M,D){let X=1;const ie=D.length-1;for(;X<=ie;){if(!M._emit[X]){X++;continue}const Se=De.classNameAliases[M[X]]||M[X],je=D[X];Se?Ne(je,Se):(ae=je,Ke(),ae=""),X++}}function ki(M,D){return M.scope&&typeof M.scope=="string"&&ye.openNode(De.classNameAliases[M.scope]||M.scope),M.beginScope&&(M.beginScope._wrap?(Ne(ae,De.classNameAliases[M.beginScope._wrap]||M.beginScope._wrap),ae=""):M.beginScope._multi&&(yi(M.beginScope,D),ae="")),Z=Object.create(M,{parent:{value:Z}}),Z}function xi(M,D,X){let ie=z(M.endRe,X);if(ie){if(M["on:end"]){const Se=new e(M);M["on:end"](D,Se),Se.isMatchIgnored&&(ie=!1)}if(ie){for(;M.endsParent&&M.parent;)M=M.parent;return M}}if(M.endsWithParent)return xi(M.parent,D,X)}function il(M){return Z.matcher.regexIndex===0?(ae+=M[0],1):(Wn=!0,0)}function sl(M){const D=M[0],X=M.rule,ie=new e(X),Se=[X.__beforeBegin,X["on:begin"]];for(const je of Se)if(je&&(je(M,ie),ie.isMatchIgnored))return il(D);return X.skip?ae+=D:(X.excludeBegin&&(ae+=D),Le(),!X.returnBegin&&!X.excludeBegin&&(ae=D)),ki(X,M),X.returnBegin?0:D.length}function al(M){const D=M[0],X=U.substring(M.index),ie=xi(Z,M,X);if(!ie)return fi;const Se=Z;Z.endScope&&Z.endScope._wrap?(Le(),Ne(D,Z.endScope._wrap)):Z.endScope&&Z.endScope._multi?(Le(),yi(Z.endScope,M)):Se.skip?ae+=D:(Se.returnEnd||Se.excludeEnd||(ae+=D),Le(),Se.excludeEnd&&(ae=D));do Z.scope&&ye.closeNode(),!Z.skip&&!Z.subLanguage&&(tn+=Z.relevance),Z=Z.parent;while(Z!==ie.parent);return ie.starts&&ki(ie.starts,M),Se.returnEnd?0:D.length}function ll(){const M=[];for(let D=Z;D!==De;D=D.parent)D.scope&&M.unshift(D.scope);M.forEach(D=>ye.openNode(D))}let en={};function Si(M,D){const X=D&&D[0];if(ae+=M,X==null)return Le(),0;if(en.type==="begin"&&D.type==="end"&&en.index===D.index&&X===""){if(ae+=U.slice(D.index,D.index+1),!de){const ie=new Error(`0 width match regex (${A})`);throw ie.languageName=A,ie.badRule=en.rule,ie}return 1}if(en=D,D.type==="begin")return sl(D);if(D.type==="illegal"&&!J){const ie=new Error('Illegal lexeme "'+X+'" for mode "'+(Z.scope||"<unnamed>")+'"');throw ie.mode=Z,ie}else if(D.type==="end"){const ie=al(D);if(ie!==fi)return ie}if(D.type==="illegal"&&X==="")return ae+=`
`,1;if(jn>1e5&&jn>D.index*3)throw new Error("potential infinite loop, way more iterations than matches");return ae+=X,X.length}const De=Xe(A);if(!De)throw tt(pe.replace("{}",A)),new Error('Unknown language: "'+A+'"');const ol=qa(De);let qn="",Z=se||ol;const vi={},ye=new B.__emitter(B);ll();let ae="",tn=0,nt=0,jn=0,Wn=!1;try{if(De.__emitTokens)De.__emitTokens(U,ye);else{for(Z.matcher.considerAll();;){jn++,Wn?Wn=!1:Z.matcher.considerAll(),Z.matcher.lastIndex=nt;const M=Z.matcher.exec(U);if(!M)break;const D=U.substring(nt,M.index),X=Si(D,M);nt=M.index+X}Si(U.substring(nt))}return ye.finalize(),qn=ye.toHTML(),{language:A,value:qn,relevance:tn,illegal:!1,_emitter:ye,_top:Z}}catch(M){if(M.message&&M.message.includes("Illegal"))return{language:A,value:Nn(U),illegal:!0,relevance:0,_illegalBy:{message:M.message,index:nt,context:U.slice(nt-100,nt+100),mode:M.mode,resultSoFar:qn},_emitter:ye};if(de)return{language:A,value:Nn(U),illegal:!1,relevance:0,errorRaised:M,_emitter:ye,_top:Z};throw M}}function Dn(A){const U={value:Nn(A),illegal:!1,relevance:0,_top:N,_emitter:new B.__emitter(B)};return U._emitter.addText(A),U}function Hn(A,U){U=U||B.languages||Object.keys(S);const J=Dn(A),se=U.filter(Xe).filter(bi).map(Le=>Ct(Le,A,!1));se.unshift(J);const me=se.sort((Le,Ne)=>{if(Le.relevance!==Ne.relevance)return Ne.relevance-Le.relevance;if(Le.language&&Ne.language){if(Xe(Le.language).supersetOf===Ne.language)return 1;if(Xe(Ne.language).supersetOf===Le.language)return-1}return 0}),[Ie,Ke]=me,Jt=Ie;return Jt.secondBest=Ke,Jt}function Qa(A,U,J){const se=U&&L[U]||J;A.classList.add("hljs"),A.classList.add(`language-${se}`)}function Un(A){let U=null;const J=we(A);if(j(J))return;if(Vt("before:highlightElement",{el:A,language:J}),A.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",A);return}if(A.children.length>0&&(B.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(A)),B.throwUnescapedHTML))throw new Fa("One of your code blocks includes unescaped HTML.",A.innerHTML);U=A;const se=U.textContent,me=J?fe(se,{language:J,ignoreIllegals:!0}):Hn(se);A.innerHTML=me.value,A.dataset.highlighted="yes",Qa(A,J,me.language),A.result={language:me.language,re:me.relevance,relevance:me.relevance},me.secondBest&&(A.secondBest={language:me.secondBest.language,relevance:me.secondBest.relevance}),Vt("after:highlightElement",{el:A,result:me,text:se})}function Ga(A){B=pi(B,A)}const Xa=()=>{Yt(),ct("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Ka(){Yt(),ct("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let mi=!1;function Yt(){function A(){Yt()}if(document.readyState==="loading"){mi||window.addEventListener("DOMContentLoaded",A,!1),mi=!0;return}document.querySelectorAll(B.cssSelector).forEach(Un)}function Ya(A,U){let J=null;try{J=U(g)}catch(se){if(tt("Language definition for '{}' could not be registered.".replace("{}",A)),de)tt(se);else throw se;J=N}J.name||(J.name=A),S[A]=J,J.rawDefinition=U.bind(null,g),J.aliases&&wi(J.aliases,{languageName:A})}function Va(A){delete S[A];for(const U of Object.keys(L))L[U]===A&&delete L[U]}function Ja(){return Object.keys(S)}function Xe(A){return A=(A||"").toLowerCase(),S[A]||S[L[A]]}function wi(A,{languageName:U}){typeof A=="string"&&(A=[A]),A.forEach(J=>{L[J.toLowerCase()]=U})}function bi(A){const U=Xe(A);return U&&!U.disableAutodetect}function el(A){A["before:highlightBlock"]&&!A["before:highlightElement"]&&(A["before:highlightElement"]=U=>{A["before:highlightBlock"](Object.assign({block:U.el},U))}),A["after:highlightBlock"]&&!A["after:highlightElement"]&&(A["after:highlightElement"]=U=>{A["after:highlightBlock"](Object.assign({block:U.el},U))})}function tl(A){el(A),F.push(A)}function nl(A){const U=F.indexOf(A);U!==-1&&F.splice(U,1)}function Vt(A,U){const J=A;F.forEach(function(se){se[J]&&se[J](U)})}function rl(A){return ct("10.7.0","highlightBlock will be removed entirely in v12.0"),ct("10.7.0","Please use highlightElement now."),Un(A)}Object.assign(g,{highlight:fe,highlightAuto:Hn,highlightAll:Yt,highlightElement:Un,highlightBlock:rl,configure:Ga,initHighlighting:Xa,initHighlightingOnLoad:Ka,registerLanguage:Ya,unregisterLanguage:Va,listLanguages:Ja,getLanguage:Xe,registerAliases:wi,autoDetection:bi,inherit:pi,addPlugin:tl,removePlugin:nl}),g.debugMode=function(){de=!1},g.safeMode=function(){de=!0},g.versionString=Wa,g.regex={concat:m,lookahead:f,either:y,optional:d,anyNumberOfTimes:p};for(const A in Xt)typeof Xt[A]=="object"&&t(Xt[A]);return Object.assign(g,Xt),g},ut=gi({});return ut.newInstance=()=>gi({}),rn=ut,ut.HighlightJS=ut,ut.default=ut,rn}var Li=Ci();const oe=Qn(Li),V=new Map,_i="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Ae={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Ae.html="xml",Ae.xhtml="xml",Ae.markup="xml";const sn=new Set(["magic","undefined"]);let We=null;const Xn=new Map,Mi=300*1e3;async function an(t=_i){if(t)return We||(We=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const s=(await e.text()).split(/\r?\n/);let n=-1;for(let o=0;o<s.length;o++)if(/\|\s*Language\s*\|/i.test(s[o])){n=o;break}if(n===-1)return;const i=s[n].replace(/^\||\|$/g,"").split("|").map(o=>o.trim().toLowerCase());let a=i.findIndex(o=>/alias|aliases|equivalent|alt|alternates?/i.test(o));a===-1&&(a=1);let h=i.findIndex(o=>/file|filename|module|module name|module-name|short|slug/i.test(o));if(h===-1){const o=i.findIndex(u=>/language/i.test(u));h=o!==-1?o:0}let l=[];for(let o=n+1;o<s.length;o++){const u=s[o].trim();if(!u||!u.startsWith("|"))break;const c=u.replace(/^\||\|$/g,"").split("|").map(w=>w.trim());if(c.every(w=>/^-+$/.test(w)))continue;const f=c;if(!f.length)continue;const d=(f[h]||f[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;V.set(d,d);const m=f[a]||"";if(m){const w=String(m).split(",").map(y=>y.replace(/`/g,"").trim()).filter(Boolean);if(w.length){const x=w[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");x&&/[a-z0-9]/i.test(x)&&(V.set(x,x),l.push(x))}}}try{const o=[];for(const u of l){const c=String(u||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");c&&/[a-z0-9]/i.test(c)?o.push(c):V.delete(u)}l=o}catch(o){console.warn("[codeblocksManager] cleanup aliases failed",o)}try{let o=0;for(const u of Array.from(V.keys())){if(!u||/^-+$/.test(u)||!/[a-z0-9]/i.test(u)){V.delete(u),o++;continue}if(/^[:]+/.test(u)){const c=u.replace(/^[:]+/,"");if(c&&/[a-z0-9]/i.test(c)){const f=V.get(u);V.delete(u),V.set(c,f)}else V.delete(u),o++}}for(const[u,c]of Array.from(V.entries()))(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c))&&(V.delete(u),o++);try{const u=":---------------------";V.has(u)&&(V.delete(u),o++)}catch(u){console.warn("[codeblocksManager] remove sep key failed",u)}try{const u=Array.from(V.keys()).sort()}catch(u){console.warn("[codeblocksManager] compute supported keys failed",u)}}catch(o){console.warn("[codeblocksManager] ignored error",o)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),We)}const ln=new Set;async function rt(t,e){if(We||(async()=>{try{await an()}catch(n){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",n)}})(),We)try{await We}catch{}if(t=t==null?"":String(t),t=t.trim(),!t)return!1;const r=t.toLowerCase();if(sn.has(r))return!1;if(V.size&&!V.has(r)){const n=Ae;if(!n[r]&&!n[t])return!1}if(ln.has(t))return!0;const s=Ae;try{const n=(e||t||"").toString().replace(/\.js$/i,"").trim(),i=(s[t]||t||"").toString(),a=(s[n]||n||"").toString();let h=Array.from(new Set([i,a,n,t,s[n],s[t]].filter(Boolean))).map(u=>String(u).toLowerCase()).filter(u=>u&&u!=="undefined");V.size&&(h=h.filter(u=>{if(V.has(u))return!0;const c=Ae[u];return!!(c&&V.has(c))}));let l=null,o=null;for(const u of h)try{const c=Date.now(),f=Xn.get(u);if(f){if(f.ok===!1&&c-(f.ts||0)<Mi)l=null;else if(f.module)l=f.module;else if(f.promise)try{l=await f.promise}catch{l=null}}else{const p={promise:null,module:null,ok:null,ts:0};Xn.set(u,p),p.promise=(async()=>{try{try{return await import(`highlight.js/lib/languages/${u}.js`)}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`;return await new Function("u","return import(u)")(m)}catch{try{const w=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`;return await new Function("u","return import(u)")(w)}catch{return null}}}}catch{return null}})();try{l=await p.promise,p.module=l,p.ok=!!l,p.ts=Date.now()}catch{p.module=null,p.ok=!1,p.ts=Date.now(),l=null}}if(l){const p=l.default||l;try{const d=V.size&&V.get(t)||u||t;return oe.registerLanguage(d,p),ln.add(d),d!==t&&(oe.registerLanguage(t,p),ln.add(t)),!0}catch(d){o=d}}}catch(c){o=c}if(o)throw o;return!1}catch{return!1}}let _t=null;function Kn(t=document){We||(async()=>{try{await an()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const e=Ae,s=_t||(typeof IntersectionObserver>"u"?null:(_t=new IntersectionObserver((i,a)=>{i.forEach(h=>{if(!h.isIntersecting)return;const l=h.target;try{a.unobserve(l)}catch(o){console.warn("[codeblocksManager] observer unobserve failed",o)}(async()=>{try{const o=l.getAttribute&&l.getAttribute("class")||l.className||"",u=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const c=(u[1]||"").toLowerCase(),f=e[c]||c,p=V.size&&(V.get(f)||V.get(String(f).toLowerCase()))||f;try{await rt(p)}catch(d){console.warn("[codeblocksManager] registerLanguage failed",d)}try{oe.highlightElement(l)}catch(d){console.warn("[codeblocksManager] hljs.highlightElement failed",d)}}else try{const c=l.textContent||"";try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const f=oe.highlight(c,{language:"plaintext"});f&&f.value&&(l.innerHTML=f.value)}}catch{try{oe.highlightElement(l)}catch(p){console.warn("[codeblocksManager] fallback highlightElement failed",p)}}}catch(c){console.warn("[codeblocksManager] auto-detect plaintext failed",c)}}catch(o){console.warn("[codeblocksManager] observer entry processing failed",o)}})()})},{root:null,rootMargin:"300px",threshold:.1}),_t)),n=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!s){n.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",h=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(h&&h[1]){const l=(h[1]||"").toLowerCase(),o=e[l]||l,u=V.size&&(V.get(o)||V.get(String(o).toLowerCase()))||o;try{await rt(u)}catch(c){console.warn("[codeblocksManager] registerLanguage failed (no observer)",c)}}try{oe.highlightElement(i)}catch(l){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}n.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function $i(t,{useCdn:e=!0}={}){const r=document.querySelector("link[data-hl-theme]");r&&r.remove();let s=t||"monokai";if(s==="monokai")return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");return}const n=`https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${s}.css`,i=document.createElement("link");i.rel="stylesheet",i.href=n,i.setAttribute("data-hl-theme",s),document.head.appendChild(i)}let on="light";function Pi(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const r=document.createElement("link");r.rel="stylesheet",r.href=t,Object.entries(e).forEach(([s,n])=>r.setAttribute(s,n)),document.head.appendChild(r)}async function Yn(t="none",e="/"){if(!t||t==="none")return;const r=[e+"bulma.css","/bulma.css"],s=Array.from(new Set(r));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const n of s)try{const i=await fetch(n,{method:"GET"});if(i.ok){const a=await i.text(),h=document.createElement("style");h.setAttribute("data-bulma-override",n),h.appendChild(document.createTextNode(`
/* bulma override: ${n} */
`+a)),document.head.appendChild(h);return}}catch(i){console.warn("[bulmaManager] fetch local bulma candidate failed",i)}return}try{const n=String(t).trim();if(!n)return;const i=`https://unpkg.com/bulmaswatch/${encodeURIComponent(n)}/bulmaswatch.min.css`;Pi(i,{"data-bulmaswatch-theme":n})}catch(n){console.warn("[bulmaManager] ensureBulma failed",n)}}function Vn(t){on=t==="dark"?"dark":"light",document.documentElement.setAttribute("data-theme",on),on==="dark"?document.body.classList.add("is-dark"):document.body.classList.remove("is-dark")}function Ii(t){const e=document.documentElement;for(const[r,s]of Object.entries(t||{}))try{e.style.setProperty(`--${r}`,s)}catch(n){console.warn("[bulmaManager] setThemeVars failed for",r,n)}}const Jn={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},it=JSON.parse(JSON.stringify(Jn));let Mt="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";Mt=String(t).split("-")[0].toLowerCase()}Jn[Mt]||(Mt="en");let Fe=Mt;function st(t,e={}){const r=it[Fe]||it.en;let s=r&&r[t]?r[t]:it.en[t]||"";for(const n of Object.keys(e))s=s.replace(new RegExp(`{${n}}`,"g"),String(e[n]));return s}async function cn(t,e){if(!t)return;let r=t;try{/^https?:\/\//.test(t)||(r=new URL(t,location.origin+e).toString());const s=await fetch(r);if(!s.ok)return;const n=await s.json();for(const i of Object.keys(n||{}))it[i]=Object.assign({},it[i]||{},n[i])}catch{}}function un(t){const e=String(t).split("-")[0].toLowerCase();Fe=it[e]?e:"en"}const zi=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Fe},loadL10nFile:cn,setLang:un,t:st},Symbol.toStringTag,{value:"Module"})),Bi=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function er(t,e="worker"){let r=null;function s(){if(!r)try{const h=t();r=h||null,h&&h.addEventListener("error",()=>{try{r===h&&(r=null,h.terminate&&h.terminate())}catch(l){console.warn("["+e+"] worker termination failed",l)}})}catch(h){r=null,console.warn("["+e+"] worker init failed",h)}return r}function n(){try{r&&(r.terminate&&r.terminate(),r=null)}catch(h){console.warn("["+e+"] worker termination failed",h)}}function i(h,l=1e3){return new Promise((o,u)=>{const c=s();if(!c)return u(new Error("worker unavailable"));const f=String(Math.random());h.id=f;let p=null;const d=()=>{p&&clearTimeout(p),c.removeEventListener("message",m),c.removeEventListener("error",w)},m=y=>{const x=y.data||{};x.id===f&&(d(),x.error?u(new Error(x.error)):o(x.result))},w=y=>{d(),console.warn("["+e+"] worker error event",y);try{r===c&&(r=null,c.terminate&&c.terminate())}catch(x){console.warn("["+e+"] worker termination failed",x)}u(new Error(y&&y.message||"worker error"))};p=setTimeout(()=>{d(),console.warn("["+e+"] worker timed out");try{r===c&&(r=null,c.terminate&&c.terminate())}catch(y){console.warn("["+e+"] worker termination on timeout failed",y)}u(new Error("worker timeout"))},l),c.addEventListener("message",m),c.addEventListener("error",w);try{c.postMessage(h)}catch(y){d(),u(y)}})}return{get:s,send:i,terminate:n}}function Oi(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),r=URL.createObjectURL(e);return new Worker(r,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const ze=new Set;function hn(t){Ni(),ze.clear();for(const e of Te)e&&ze.add(e);tr(K),tr(H),hn._refreshed=!0}function tr(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&ze.add(e)}function nr(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(r,s){return s&&ze.add(s),e.call(this,r,s)}}let rr=!1;function Ni(){rr||(nr(K),nr(H),rr=!0)}function ir(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function ue(t){return String(t||"").replace(/^[.\/]+/,"")}function ht(t){return String(t||"").replace(/\/+$/,"")}function dt(t){return ht(t)+"/"}function Di(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const r=document.createElement("link");r.rel="preload",r.as="image",r.href=t,document.head.appendChild(r)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function $t(t,e=0,r=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const s=Array.from(t.querySelectorAll("img"));if(!s.length)return;const n=t,i=n&&n.getBoundingClientRect?n.getBoundingClientRect():null,a=0,h=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=i?Math.max(a,i.top):a,u=(i?Math.min(h,i.bottom):h)+Number(e||0);let c=0;n&&(c=n.clientHeight||(i?i.height:0)),c||(c=h-a);let f=.6;try{const w=n&&window.getComputedStyle?window.getComputedStyle(n):null,y=w&&w.getPropertyValue("--nimbi-image-max-height-ratio"),x=y?parseFloat(y):NaN;!Number.isNaN(x)&&x>0&&x<=1&&(f=x)}catch(w){console.warn("[helpers] read CSS ratio failed",w)}const p=Math.max(200,Math.floor(c*f));let d=!1,m=null;if(s.forEach(w=>{try{const y=w.getAttribute?w.getAttribute("loading"):void 0;y!=="eager"&&w.setAttribute&&w.setAttribute("loading","lazy");const x=w.getBoundingClientRect?w.getBoundingClientRect():null,z=w.src||w.getAttribute&&w.getAttribute("src"),R=x&&x.height>1?x.height:p,_=x?x.top:0,q=_+R,O=!!(x&&R>0&&_<=u&&q>=l);O&&(w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),Di(z),d=!0),!m&&x&&x.top<=u&&(m={img:w,src:z,rect:x,beforeLoading:y}),r&&console.log("[helpers] setEagerForAboveFoldImages:",{src:z,rect:x,marginPx:e,visibleTop:l,visibleBottom:u,beforeLoading:y,isAboveFold:O,effectiveHeight:R,maxImageHeight:p})}catch(y){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",y)}}),!d&&m){const{img:w,src:y,rect:x,beforeLoading:z}=m;try{w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),r&&console.log("[helpers] setEagerForAboveFoldImages (fallback first visible):",{src:y,rect:x,marginPx:e,visibleTop:l,visibleBottom:u,beforeLoading:z,fallback:!0})}catch(R){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",R)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function Pt(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(r=>{console.warn("[helpers] safe swallowed error",r)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Pt)}catch(t){console.warn("[helpers] global attach failed",t)}const K=new Map;let Re=[],dn=!1;function sr(t){dn=!!t}function ar(t){Re=Array.isArray(t)?t.slice():[]}function Hi(){return Re}const lr=er(()=>Oi(Bi),"slugManager");function pn(){return lr.get()}function or(t){return lr.send(t)}async function Ui(t,e=1,r=void 0){if(!pn())return Dt(t,e,r);try{return await or({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:r})}catch(n){try{return await Dt(t,e,r)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),n}}}async function qi(t,e,r){return pn()?or({type:"crawlForSlug",slug:t,base:e,maxQueue:r}):wn(t,e,r)}function Ze(t,e){if(t)if(Re&&Re.length){const s=e.split("/")[0],n=Re.includes(s);let i=K.get(t);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),n?i.langs[s]=e:i.default=e,K.set(t,i)}else K.set(t,e)}const It=new Set;function ji(t){typeof t=="function"&&It.add(t)}function Wi(t){typeof t=="function"&&It.delete(t)}const H=new Map;let fn={},Te=[],at="_404.md",lt="_home.md";function gn(t){t!=null&&(at=String(t||""))}function mn(t){t!=null&&(lt=String(t||""))}function Fi(t){fn=t||{}}const pt=new Map,zt=new Set;function Zi(){pt.clear(),zt.clear()}function Qi(t){if(!t||t.length===0)return"";let e=t[0];for(let s=1;s<t.length;s++){const n=t[s];let i=0;const a=Math.min(e.length,n.length);for(;i<a&&e[i]===n[i];)i++;e=e.slice(0,i)}const r=e.lastIndexOf("/");return r===-1?e:e.slice(0,r+1)}function Bt(t){K.clear(),H.clear(),Te=[],Re=Re||[];const e=Object.keys(fn||{});if(!e.length)return;let r="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?r=new URL(String(t)).pathname:r=String(t||"")}catch(s){r=String(t||""),console.warn("[slugManager] parse contentBase failed",s)}r=dt(r)}}catch(s){r="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}r||(r=Qi(e));for(const s of e){let n=s;r&&s.startsWith(r)?n=ue(s.slice(r.length)):n=ue(s),Te.push(n);try{hn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=fn[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const h=re(a[1].trim());if(h)try{if(Re&&Re.length){const o=n.split("/")[0],u=Re.includes(o);let c=K.get(h);(!c||typeof c=="string")&&(c={default:typeof c=="string"?c:void 0,langs:{}}),u?c.langs[o]=n:c.default=n,K.set(h,c)}else K.set(h,n);H.set(n,h)}catch(l){console.warn("[slugManager] set slug mapping failed",l)}}}}}try{Bt()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function re(t){let e=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return e=e.replace(/(?:-?)(?:md|html)$/,""),e}function Gi(t){return ft(t,void 0)}function ft(t,e){if(!t)return!1;if(t.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(t)){if(e&&typeof e=="string")try{const r=new URL(t),s=new URL(e);return r.origin!==s.origin?!0:!r.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(t.startsWith("/")&&e&&typeof e=="string")try{const r=new URL(t,e),s=new URL(e);return r.origin!==s.origin?!0:!r.pathname.startsWith(s.pathname)}catch{return!0}return!1}function Ot(t){return t==null?t:String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(e,r)=>r)}function gt(t){if(!t||!K.has(t))return null;const e=K.get(t);if(!e)return null;if(typeof e=="string")return e;if(Re&&Re.length&&Fe&&e.langs&&e.langs[Fe])return e.langs[Fe];if(e.default)return e.default;if(e.langs){const r=Object.keys(e.langs);if(r.length)return e.langs[r[0]]}return null}const mt=new Map;function Xi(){mt.clear()}let be=async function(t,e){if(!t)throw new Error("path required");try{const i=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&K.has(i)){const a=gt(i)||K.get(i);a&&a!==t&&(t=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const r=e==null?"":ht(String(e));let s="";try{r?/^[a-z][a-z0-9+.-]*:/i.test(r)?s=r.replace(/\/$/,"")+"/"+t.replace(/^\//,""):s=(r.startsWith("/")?"":"/")+r.replace(/\/$/,"")+"/"+t.replace(/^\//,""):s="/"+t.replace(/^\//,"")}catch{s="/"+t.replace(/^\//,"")}if(mt.has(s))return mt.get(s);const n=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const c=`${r}/${at}`,f=await globalThis.fetch(c);if(f&&typeof f.ok=="boolean"&&f.ok)return{raw:await f.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}let u="";try{i&&typeof i.clone=="function"?u=await i.clone().text():i&&typeof i.text=="function"?u=await i.text():u=""}catch(c){u="",console.warn("[slugManager] reading error body failed",c)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:u.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),h=a.trim().slice(0,16).toLowerCase(),l=h.startsWith("<!doctype")||h.startsWith("<html"),o=l||String(t||"").toLowerCase().endsWith(".html");if(l&&String(t||"").toLowerCase().endsWith(".md")){try{const u=`${r}/${at}`,c=await globalThis.fetch(u);if(c.ok)return{raw:await c.text(),status:404}}catch(u){console.warn("[slugManager] fetching fallback 404 failed",u)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return o?{raw:a,isHtml:!0}:{raw:a}})();return mt.set(s,n),n};function Ki(t){typeof t=="function"&&(be=t)}const Nt=new Map;let Ue=[],wt=null;async function Dt(t,e=1,r=void 0){const s=Array.isArray(r)?Array.from(new Set((r||[]).map(n=>ue(String(n||""))))):[];try{const n=ue(String(at||""));n&&!s.includes(n)&&s.push(n)}catch{}if(Ue&&Ue.length&&e===1&&!Ue.some(i=>{try{return s.includes(ue(String(i.path||"")))}catch{return!1}}))return Ue;if(wt)return wt;wt=(async()=>{let n=Array.isArray(r)?Array.from(new Set((r||[]).map(o=>ue(String(o||""))))):[];try{const o=ue(String(at||""));o&&!n.includes(o)&&n.push(o)}catch{}const i=o=>{if(!n||!n.length)return!1;for(const u of n)if(u&&(o===u||o.startsWith(u+"/")))return!0;return!1};let a=[];if(Te&&Te.length&&(a=Array.from(Te)),!a.length)for(const o of K.values())o&&a.push(o);try{const o=await dr(t);o&&o.length&&(a=a.concat(o))}catch(o){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",o)}try{const o=new Set(a),u=[...a];for(o.size;u.length&&o.size<=bt;){const c=u.shift();try{const f=await be(c,t);if(f&&f.raw){if(f.status===404)continue;let p=f.raw;const d=[],m=String(c||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(m)&&dn&&(!c||!c.includes("/")))continue;const w=/\[[^\]]+\]\(([^)]+)\)/g;let y;for(;y=w.exec(p);)d.push(y[1]);const x=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;y=x.exec(p);)d.push(y[1]);const z=c&&c.includes("/")?c.substring(0,c.lastIndexOf("/")+1):"";for(let R of d)try{if(ft(R,t)||R.startsWith("..")||R.indexOf("/../")!==-1||(z&&!R.startsWith("./")&&!R.startsWith("/")&&!R.startsWith("../")&&(R=z+R),R=ue(R),!/\.(md|html?)(?:$|[?#])/i.test(R))||(R=R.split(/[?#]/)[0],i(R)))continue;o.has(R)||(o.add(R),u.push(R),a.push(R))}catch(_){console.warn("[slugManager] href processing failed",R,_)}}}catch(f){console.warn("[slugManager] discovery fetch failed for",c,f)}}}catch(o){console.warn("[slugManager] discovery loop failed",o)}const h=new Set;a=a.filter(o=>!o||h.has(o)||i(o)?!1:(h.add(o),!0));const l=[];for(const o of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(o))try{const u=await be(o,t);if(u&&u.raw){if(u.status===404)continue;let c="",f="";if(u.isHtml)try{const m=new DOMParser().parseFromString(u.raw,"text/html"),w=m.querySelector("title")||m.querySelector("h1");w&&w.textContent&&(c=w.textContent.trim());const y=m.querySelector("p");if(y&&y.textContent&&(f=y.textContent.trim()),e>=2)try{const x=m.querySelector("h1"),z=x&&x.textContent?x.textContent.trim():c||"",R=(()=>{try{if(H.has(o))return H.get(o)}catch{}return re(c||o)})(),_=Array.from(m.querySelectorAll("h2"));for(const q of _)try{const O=(q.textContent||"").trim();if(!O)continue;const Q=q.id?q.id:re(O),Y=R?`${R}::${Q}`:`${re(o)}::${Q}`;let ne="",P=q.nextElementSibling;for(;P&&P.tagName&&P.tagName.toLowerCase()==="script";)P=P.nextElementSibling;P&&P.textContent&&(ne=String(P.textContent).trim()),l.push({slug:Y,title:O,excerpt:ne,path:o,parentTitle:z})}catch(O){console.warn("[slugManager] indexing H2 failed",O)}if(e===3)try{const q=Array.from(m.querySelectorAll("h3"));for(const O of q)try{const Q=(O.textContent||"").trim();if(!Q)continue;const Y=O.id?O.id:re(Q),ne=R?`${R}::${Y}`:`${re(o)}::${Y}`;let P="",T=O.nextElementSibling;for(;T&&T.tagName&&T.tagName.toLowerCase()==="script";)T=T.nextElementSibling;T&&T.textContent&&(P=String(T.textContent).trim()),l.push({slug:ne,title:Q,excerpt:P,path:o,parentTitle:z})}catch(Q){console.warn("[slugManager] indexing H3 failed",Q)}}catch(q){console.warn("[slugManager] collect H3s failed",q)}}catch(x){console.warn("[slugManager] collect H2s failed",x)}}catch(d){console.warn("[slugManager] parsing HTML for index failed",d)}else{const d=u.raw,m=d.match(/^#\s+(.+)$/m);c=m?m[1].trim():"";try{c=Ot(c)}catch{}const w=d.split(/\r?\n\s*\r?\n/);if(w.length>1)for(let y=1;y<w.length;y++){const x=w[y].trim();if(x&&!/^#/.test(x)){f=x.replace(/\r?\n/g," ");break}}if(e>=2){let y="",x="";try{const z=(d.match(/^#\s+(.+)$/m)||[])[1];y=z?z.trim():"",x=(function(){try{if(H.has(o))return H.get(o)}catch{}return re(c||o)})();const R=/^##\s+(.+)$/gm;let _;for(;_=R.exec(d);)try{const q=(_[1]||"").trim(),O=Ot(q);if(!q)continue;const Q=re(q),Y=x?`${x}::${Q}`:`${re(o)}::${Q}`,P=d.slice(R.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),T=P&&P[1]?String(P[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";l.push({slug:Y,title:O,excerpt:T,path:o,parentTitle:y})}catch(q){console.warn("[slugManager] indexing markdown H2 failed",q)}}catch(z){console.warn("[slugManager] collect markdown H2s failed",z)}if(e===3)try{const z=/^###\s+(.+)$/gm;let R;for(;R=z.exec(d);)try{const _=(R[1]||"").trim(),q=Ot(_);if(!_)continue;const O=re(_),Q=x?`${x}::${O}`:`${re(o)}::${O}`,ne=d.slice(z.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),P=ne&&ne[1]?String(ne[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";l.push({slug:Q,title:q,excerpt:P,path:o,parentTitle:y})}catch(_){console.warn("[slugManager] indexing markdown H3 failed",_)}}catch(z){console.warn("[slugManager] collect markdown H3s failed",z)}}}let p="";try{H.has(o)&&(p=H.get(o))}catch(d){console.warn("[slugManager] mdToSlug access failed",d)}p||(p=re(c||o)),l.push({slug:p,title:c,excerpt:f,path:o})}}catch(u){console.warn("[slugManager] buildSearchIndex: entry fetch failed",u)}try{Ue=l.filter(u=>{try{return!i(String(u.path||""))}catch{return!0}})}catch(o){console.warn("[slugManager] filtering index by excludes failed",o),Ue=l}return Ue})();try{await wt}catch(n){console.warn("[slugManager] awaiting _indexPromise failed",n)}return wt=null,Ue}const cr=1e3;let bt=cr;function Yi(t){typeof t=="number"&&t>=0&&(bt=t)}const ur=new DOMParser,hr="a[href]";let wn=async function(t,e,r=bt){if(Nt.has(t))return Nt.get(t);let s=null;const n=new Set,i=[""];for(;i.length&&!s&&!(i.length>r);){const a=i.shift();if(n.has(a))continue;n.add(a);let h=e;h.endsWith("/")||(h+="/"),h+=a;try{const l=await globalThis.fetch(h);if(!l.ok)continue;const o=await l.text(),c=ur.parseFromString(o,"text/html").querySelectorAll(hr);for(const f of c)try{let p=f.getAttribute("href")||"";if(!p||ft(p,e)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const d=a+p;n.has(d)||i.push(d);continue}if(p.toLowerCase().endsWith(".md")){const d=ue(a+p);try{if(H.has(d))continue;for(const m of K.values());}catch(m){console.warn("[slugManager] slug map access failed",m)}try{const m=await be(d,e);if(m&&m.raw){const w=(m.raw||"").match(/^#\s+(.+)$/m);if(w&&w[1]&&re(w[1].trim())===t){s=d;break}}}catch(m){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",m)}}}catch(p){console.warn("[slugManager] crawlForSlug: link iteration failed",p)}}catch(l){console.warn("[slugManager] crawlForSlug: directory fetch failed",l)}}return Nt.set(t,s),s};async function dr(t,e=bt){const r=new Set,s=new Set,n=[""];for(;n.length&&!(n.length>e);){const i=n.shift();if(s.has(i))continue;s.add(i);let a=t;a.endsWith("/")||(a+="/"),a+=i;try{const h=await globalThis.fetch(a);if(!h.ok)continue;const l=await h.text(),u=ur.parseFromString(l,"text/html").querySelectorAll(hr);for(const c of u)try{let f=c.getAttribute("href")||"";if(!f||ft(f,t)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const d=i+f;s.has(d)||n.push(d);continue}const p=(i+f).replace(/^\/+/,"");/\.(md|html?)$/i.test(p)&&r.add(p)}catch(f){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",f)}}catch(h){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",h)}}return Array.from(r)}async function pr(t,e,r){if(t&&typeof t=="string"&&(t=ue(t),t=ht(t)),K.has(t))return gt(t)||K.get(t);for(const n of It)try{const i=await n(t,e);if(i)return Ze(t,i),H.set(i,t),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(Te&&Te.length){if(pt.has(t)){const n=pt.get(t);return K.set(t,n),H.set(n,t),n}for(const n of Te)if(!zt.has(n))try{const i=await be(n,e);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const h=re(a[1].trim());if(zt.add(n),h&&pt.set(h,n),h===t)return Ze(t,n),H.set(n,t),n}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const n=await Dt(e);if(n&&n.length){const i=n.find(a=>a.slug===t);if(i)return Ze(t,i.path),H.set(i.path,t),i.path}}catch(n){console.warn("[slugManager] buildSearchIndex lookup failed",n)}try{const n=await wn(t,e,r);if(n)return Ze(t,n),H.set(n,t),n}catch(n){console.warn("[slugManager] crawlForSlug lookup failed",n)}const s=[`${t}.html`,`${t}.md`];for(const n of s)try{const i=await be(n,e);if(i&&i.raw)return Ze(t,n),H.set(n,t),n}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(Te&&Te.length)for(const n of Te)try{const i=n.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(re(i)===t)return Ze(t,n),H.set(n,t),n}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const n=[];lt&&typeof lt=="string"&&lt.trim()&&n.push(lt),n.includes("_home.md")||n.push("_home.md");for(const i of n)try{const a=await be(i,e);if(a&&a.raw){const h=(a.raw||"").match(/^#\s+(.+)$/m);if(h&&h[1]&&re(h[1].trim())===t)return Ze(t,i),H.set(i,t),i}}catch{}}catch(n){console.warn("[slugManager] home page fetch failed",n)}return null}const Ht=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:cr,_setAllMd:Fi,_storeSlugMapping:Ze,addSlugResolver:ji,get allMarkdownPaths(){return Te},get availableLanguages(){return Re},buildSearchIndex:Dt,buildSearchIndexWorker:Ui,clearFetchCache:Xi,clearListCaches:Zi,crawlAllMarkdown:dr,crawlCache:Nt,crawlForSlug:wn,crawlForSlugWorker:qi,get defaultCrawlMaxQueue(){return bt},ensureSlug:pr,fetchCache:mt,get fetchMarkdown(){return be},getLanguages:Hi,get homePage(){return lt},initSlugWorker:pn,isExternalLink:Gi,isExternalLinkWithBase:ft,listPathsFetched:zt,listSlugCache:pt,mdToSlug:H,get notFoundPage(){return at},removeSlugResolver:Wi,resolveSlugPath:gt,get searchIndex(){return Ue},setContentBase:Bt,setDefaultCrawlMaxQueue:Yi,setFetchMarkdown:Ki,setHomePage:mn,setLanguages:ar,setNotFoundPage:gn,setSkipRootReadme:sr,get skipRootReadme(){return dn},slugResolvers:It,slugToMd:K,slugify:re,unescapeMarkdown:Ot},Symbol.toStringTag,{value:"Module"}));let fr=100;function gr(t){fr=t}let yt=300*1e3;function mr(t){yt=t}const _e=new Map;function Vi(t){if(!_e.has(t))return;const e=_e.get(t),r=Date.now();if(e.ts+yt<r){_e.delete(t);return}return _e.delete(t),_e.set(t,e),e.value}function Ji(t,e){if(wr(),wr(),_e.delete(t),_e.set(t,{value:e,ts:Date.now()}),_e.size>fr){const r=_e.keys().next().value;r!==void 0&&_e.delete(r)}}function wr(){if(!yt||yt<=0)return;const t=Date.now();for(const[e,r]of _e.entries())r.ts+yt<t&&_e.delete(e)}async function es(t,e){const r=new Set(ze),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const n of Array.from(s||[])){const i=n.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const h=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(h){let o=ue(h[1]);o&&r.add(o);continue}const l=a.pathname||"";if(l){const o=new URL(e),u=dt(o.pathname);if(l.indexOf(u)!==-1){let c=l.startsWith(u)?l.slice(u.length):l;c=ue(c),c&&r.add(c)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const n of r)try{if(!n||!String(n).includes(".md"))continue;const i=await be(n,e);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const h=(a[1]||"").trim();if(h&&re(h)===t)return n}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function ts(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const r=decodeURIComponent(String(t||""));if(K.has(r)){const s=gt(r)||K.get(r);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||e.push(s):(e.push(s),e.push(s+".html")))}else{if(ze&&ze.size)for(const s of ze){const n=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(re(n)===r&&!/index\.html$/i.test(s)){e.push(s);break}}!e.length&&r&&!/\.(md|html?)$/i.test(r)&&(e.push(r+".html"),e.push(r+".md"))}}catch(r){console.warn("[router] buildPageCandidates failed during slug handling",r)}return e}async function ns(t,e){const r=t||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let n=t||"",i=null;if(n&&String(n).includes("::")){const d=String(n).split("::",2);n=d[0],i=d[1]||null}const h=`${t}|||${typeof zi<"u"&&Fe?Fe:""}`,l=Vi(h);if(l)n=l.resolved,i=l.anchor||i;else{if(!String(n).includes(".md")&&!String(n).includes(".html")){let d=decodeURIComponent(String(n||""));if(d&&typeof d=="string"&&(d=ue(d),d=ht(d)),K.has(d))n=gt(d)||K.get(d);else{let m=await es(d,e);if(m)n=m;else if(hn._refreshed&&ze&&ze.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const w=await pr(d,e);w&&(n=w)}}}Ji(h,{resolved:n,anchor:i})}!i&&s&&(i=s);const o=ts(n),u=String(r||"").includes(".md")||String(r||"").includes(".html");if(u&&o.length===0&&(String(n).includes(".md")||String(n).includes(".html"))&&o.push(n),o.length===0&&(String(n).includes(".md")||String(n).includes(".html"))&&o.push(n),o.length===1&&/index\.html$/i.test(o[0])&&!u&&!K.has(n)&&!K.has(decodeURIComponent(String(n||"")))&&!String(n||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let c=null,f=null,p=null;for(const d of o)if(d)try{const m=ue(d);c=await be(m,e),f=m;break}catch(m){p=m;try{console.warn("[router] candidate fetch failed",{candidate:d,contentBase:e,err:m&&m.message||m})}catch{}}if(!c){try{console.error("[router] fetchPageData: no page data for",{originalRaw:r,resolved:n,pageCandidates:o,contentBase:e,fetchError:p&&(p.message||String(p))||null})}catch{}try{if(u&&String(r||"").toLowerCase().includes(".html"))try{const d=new URL(String(r||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",d);const m=await fetch(d);if(m&&m.ok){const w=await m.text(),y=m&&m.headers&&typeof m.headers.get=="function"&&m.headers.get("content-type")||"",x=(w||"").toLowerCase(),z=y&&y.indexOf&&y.indexOf("text/html")!==-1||x.indexOf("<!doctype")!==-1||x.indexOf("<html")!==-1;if(z||console.warn("[router] absolute fetch returned non-HTML",{abs:d,contentType:y,snippet:x.slice(0,200)}),z)try{const R=d,_=new URL(".",R).toString();try{const O=typeof DOMParser<"u"?new DOMParser:null;if(O){const Q=O.parseFromString(w||"","text/html"),Y=(I,C)=>{try{const v=C.getAttribute(I)||"";if(!v||/^(https?:)?\/\//i.test(v)||v.startsWith("/")||v.startsWith("#"))return;try{const b=new URL(v,R).toString();C.setAttribute(I,b)}catch{}}catch{}},ne=Q.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),P=[];for(const I of Array.from(ne||[]))try{const C=I.tagName?I.tagName.toLowerCase():"";if(C==="a")continue;if(I.hasAttribute("src")){const v=I.getAttribute("src");Y("src",I);const b=I.getAttribute("src");v!==b&&P.push({attr:"src",tag:C,before:v,after:b})}if(I.hasAttribute("href")&&C==="link"){const v=I.getAttribute("href");Y("href",I);const b=I.getAttribute("href");v!==b&&P.push({attr:"href",tag:C,before:v,after:b})}if(I.hasAttribute("href")&&C!=="link"){const v=I.getAttribute("href");Y("href",I);const b=I.getAttribute("href");v!==b&&P.push({attr:"href",tag:C,before:v,after:b})}if(I.hasAttribute("xlink:href")){const v=I.getAttribute("xlink:href");Y("xlink:href",I);const b=I.getAttribute("xlink:href");v!==b&&P.push({attr:"xlink:href",tag:C,before:v,after:b})}if(I.hasAttribute("poster")){const v=I.getAttribute("poster");Y("poster",I);const b=I.getAttribute("poster");v!==b&&P.push({attr:"poster",tag:C,before:v,after:b})}if(I.hasAttribute("srcset")){const E=(I.getAttribute("srcset")||"").split(",").map($=>$.trim()).filter(Boolean).map($=>{const[k,G]=$.split(/\s+/,2);if(!k||/^(https?:)?\/\//i.test(k)||k.startsWith("/"))return $;try{const he=new URL(k,R).toString();return G?`${he} ${G}`:he}catch{return $}}).join(", ");I.setAttribute("srcset",E)}}catch{}const T=Q.documentElement&&Q.documentElement.outerHTML?Q.documentElement.outerHTML:w;try{P&&P.length&&console.warn("[router] rewritten asset refs",{abs:d,rewritten:P})}catch{}return{data:{raw:T,isHtml:!0},pagePath:String(r||""),anchor:i}}}catch{}let q=w;return/<base\s+[^>]*>/i.test(w)||(/<head[^>]*>/i.test(w)?q=w.replace(/(<head[^>]*>)/i,`$1<base href="${_}">`):q=`<base href="${_}">`+w),{data:{raw:q,isHtml:!0},pagePath:String(r||""),anchor:i}}catch{return{data:{raw:w,isHtml:!0},pagePath:String(r||""),anchor:i}}}}catch(d){console.warn("[router] absolute HTML fetch fallback failed",d)}}catch{}throw new Error("no page data")}return{data:c,pagePath:f,anchor:i}}function bn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ye=bn();function br(t){Ye=t}var Ve={exec:()=>null};function ee(t,e=""){let r=typeof t=="string"?t:t.source,s={replace:(n,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(ve.caret,"$1"),r=r.replace(n,a),s},getRegex:()=>new RegExp(r,e)};return s}var rs=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),ve={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},is=/^(?:[ \t]*(?:\n|$))+/,ss=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,as=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,kt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ls=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,yn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,yr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,kr=ee(yr).replace(/bull/g,yn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),os=ee(yr).replace(/bull/g,yn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),kn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,cs=/^[^\n]+/,xn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,us=ee(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",xn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),hs=ee(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,yn).getRegex(),Ut="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Sn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ds=ee("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Sn).replace("tag",Ut).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),xr=ee(kn).replace("hr",kt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),ps=ee(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",xr).getRegex(),vn={blockquote:ps,code:ss,def:us,fences:as,heading:ls,hr:kt,html:ds,lheading:kr,list:hs,newline:is,paragraph:xr,table:Ve,text:cs},Sr=ee("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",kt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex(),fs={...vn,lheading:os,table:Sr,paragraph:ee(kn).replace("hr",kt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Sr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ut).getRegex()},gs={...vn,html:ee(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Sn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ve,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ee(kn).replace("hr",kt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",kr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ms=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ws=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,vr=/^( {2,}|\\)\n(?!\s*$)/,bs=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,qt=/[\p{P}\p{S}]/u,En=/[\s\p{P}\p{S}]/u,Er=/[^\s\p{P}\p{S}]/u,ys=ee(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,En).getRegex(),Ar=/(?!~)[\p{P}\p{S}]/u,ks=/(?!~)[\s\p{P}\p{S}]/u,xs=/(?:[^\s\p{P}\p{S}]|~)/u,Rr=/(?![*_])[\p{P}\p{S}]/u,Ss=/(?![*_])[\s\p{P}\p{S}]/u,vs=/(?:[^\s\p{P}\p{S}]|[*_])/u,Es=ee(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",rs?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Tr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,As=ee(Tr,"u").replace(/punct/g,qt).getRegex(),Rs=ee(Tr,"u").replace(/punct/g,Ar).getRegex(),Cr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ts=ee(Cr,"gu").replace(/notPunctSpace/g,Er).replace(/punctSpace/g,En).replace(/punct/g,qt).getRegex(),Cs=ee(Cr,"gu").replace(/notPunctSpace/g,xs).replace(/punctSpace/g,ks).replace(/punct/g,Ar).getRegex(),Ls=ee("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Er).replace(/punctSpace/g,En).replace(/punct/g,qt).getRegex(),_s=ee(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Rr).getRegex(),Ms="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",$s=ee(Ms,"gu").replace(/notPunctSpace/g,vs).replace(/punctSpace/g,Ss).replace(/punct/g,Rr).getRegex(),Ps=ee(/\\(punct)/,"gu").replace(/punct/g,qt).getRegex(),Is=ee(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),zs=ee(Sn).replace("(?:-->|$)","-->").getRegex(),Bs=ee("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",zs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),jt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Os=ee(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",jt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Lr=ee(/^!?\[(label)\]\[(ref)\]/).replace("label",jt).replace("ref",xn).getRegex(),_r=ee(/^!?\[(ref)\](?:\[\])?/).replace("ref",xn).getRegex(),Ns=ee("reflink|nolink(?!\\()","g").replace("reflink",Lr).replace("nolink",_r).getRegex(),Mr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,An={_backpedal:Ve,anyPunctuation:Ps,autolink:Is,blockSkip:Es,br:vr,code:ws,del:Ve,delLDelim:Ve,delRDelim:Ve,emStrongLDelim:As,emStrongRDelimAst:Ts,emStrongRDelimUnd:Ls,escape:ms,link:Os,nolink:_r,punctuation:ys,reflink:Lr,reflinkSearch:Ns,tag:Bs,text:bs,url:Ve},Ds={...An,link:ee(/^!?\[(label)\]\((.*?)\)/).replace("label",jt).getRegex(),reflink:ee(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",jt).getRegex()},Rn={...An,emStrongRDelimAst:Cs,emStrongLDelim:Rs,delLDelim:_s,delRDelim:$s,url:ee(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Mr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ee(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Mr).getRegex()},Hs={...Rn,br:ee(vr).replace("{2,}","*").getRegex(),text:ee(Rn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Wt={normal:vn,gfm:fs,pedantic:gs},xt={normal:An,gfm:Rn,breaks:Hs,pedantic:Ds},Us={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},$r=t=>Us[t];function Be(t,e){if(e){if(ve.escapeTest.test(t))return t.replace(ve.escapeReplace,$r)}else if(ve.escapeTestNoEncode.test(t))return t.replace(ve.escapeReplaceNoEncode,$r);return t}function Pr(t){try{t=encodeURI(t).replace(ve.percentDecode,"%")}catch{return null}return t}function Ir(t,e){let r=t.replace(ve.findPipe,(i,a,h)=>{let l=!1,o=a;for(;--o>=0&&h[o]==="\\";)l=!l;return l?"|":" |"}),s=r.split(ve.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(ve.slashPipe,"|");return s}function St(t,e,r){let s=t.length;if(s===0)return"";let n=0;for(;n<s&&t.charAt(s-n-1)===e;)n++;return t.slice(0,s-n)}function qs(t,e){if(t.indexOf(e[1])===-1)return-1;let r=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])r++;else if(t[s]===e[1]&&(r--,r<0))return s;return r>0?-2:-1}function js(t,e=0){let r=e,s="";for(let n of t)if(n==="	"){let i=4-r%4;s+=" ".repeat(i),r+=i}else s+=n,r++;return s}function zr(t,e,r,s,n){let i=e.href,a=e.title||null,h=t[1].replace(n.other.outputLinkReplace,"$1");s.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:r,href:i,title:a,text:h,tokens:s.inlineTokens(h)};return s.state.inLink=!1,l}function Ws(t,e,r){let s=t.match(r.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(i=>{let a=i.match(r.other.beginningSpace);if(a===null)return i;let[h]=a;return h.length>=n.length?i.slice(n.length):i}).join(`
`)}var Ft=class{options;rules;lexer;constructor(t){this.options=t||Ye}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let r=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?r:St(r,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let r=e[0],s=Ws(r,e[3]||"",this.rules);return{type:"code",raw:r,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let r=e[2].trim();if(this.rules.other.endingHash.test(r)){let s=St(r,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(r=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:St(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let r=St(e[0],`
`).split(`
`),s="",n="",i=[];for(;r.length>0;){let a=!1,h=[],l;for(l=0;l<r.length;l++)if(this.rules.other.blockquoteStart.test(r[l]))h.push(r[l]),a=!0;else if(!a)h.push(r[l]);else break;r=r.slice(l);let o=h.join(`
`),u=o.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${o}`:o,n=n?`${n}
${u}`:u;let c=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,i,!0),this.lexer.state.top=c,r.length===0)break;let f=i.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let p=f,d=p.raw+`
`+r.join(`
`),m=this.blockquote(d);i[i.length-1]=m,s=s.substring(0,s.length-p.raw.length)+m.raw,n=n.substring(0,n.length-p.text.length)+m.text;break}else if(f?.type==="list"){let p=f,d=p.raw+`
`+r.join(`
`),m=this.list(d);i[i.length-1]=m,s=s.substring(0,s.length-f.raw.length)+m.raw,n=n.substring(0,n.length-p.raw.length)+m.raw,r=d.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:n}}}list(t){let e=this.rules.block.list.exec(t);if(e){let r=e[1].trim(),s=r.length>1,n={type:"list",raw:"",ordered:s,start:s?+r.slice(0,-1):"",loose:!1,items:[]};r=s?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=s?r:"[*+-]");let i=this.rules.other.listItemRegex(r),a=!1;for(;t;){let l=!1,o="",u="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;o=e[0],t=t.substring(o.length);let c=js(e[2].split(`
`,1)[0],e[1].length),f=t.split(`
`,1)[0],p=!c.trim(),d=0;if(this.options.pedantic?(d=2,u=c.trimStart()):p?d=e[1].length+1:(d=c.search(this.rules.other.nonSpaceChar),d=d>4?1:d,u=c.slice(d),d+=e[1].length),p&&this.rules.other.blankLine.test(f)&&(o+=f+`
`,t=t.substring(f.length+1),l=!0),!l){let m=this.rules.other.nextBulletRegex(d),w=this.rules.other.hrRegex(d),y=this.rules.other.fencesBeginRegex(d),x=this.rules.other.headingBeginRegex(d),z=this.rules.other.htmlBeginRegex(d),R=this.rules.other.blockquoteBeginRegex(d);for(;t;){let _=t.split(`
`,1)[0],q;if(f=_,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),q=f):q=f.replace(this.rules.other.tabCharGlobal,"    "),y.test(f)||x.test(f)||z.test(f)||R.test(f)||m.test(f)||w.test(f))break;if(q.search(this.rules.other.nonSpaceChar)>=d||!f.trim())u+=`
`+q.slice(d);else{if(p||c.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||y.test(c)||x.test(c)||w.test(c))break;u+=`
`+f}p=!f.trim(),o+=_+`
`,t=t.substring(_.length+1),c=q.slice(d)}}n.loose||(a?n.loose=!0:this.rules.other.doubleBlankLine.test(o)&&(a=!0)),n.items.push({type:"list_item",raw:o,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),n.raw+=o}let h=n.items.at(-1);if(h)h.raw=h.raw.trimEnd(),h.text=h.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let l of n.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let o=this.rules.other.listTaskCheckbox.exec(l.raw);if(o){let u={type:"checkbox",raw:o[0]+" ",checked:o[0]!=="[ ]"};l.checked=u.checked,n.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=u.raw+l.tokens[0].raw,l.tokens[0].text=u.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(u)):l.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):l.tokens.unshift(u)}}if(!n.loose){let o=l.tokens.filter(c=>c.type==="space"),u=o.length>0&&o.some(c=>this.rules.other.anyLine.test(c.raw));n.loose=u}}if(n.loose)for(let l of n.items){l.loose=!0;for(let o of l.tokens)o.type==="text"&&(o.type="paragraph")}return n}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let r=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:r,raw:e[0],href:s,title:n}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let r=Ir(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(r.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<r.length;a++)i.header.push({text:r[a],tokens:this.lexer.inline(r[a]),header:!0,align:i.align[a]});for(let a of n)i.rows.push(Ir(a,i.header.length).map((h,l)=>({text:h,tokens:this.lexer.inline(h),header:!1,align:i.align[l]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let r=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:r,tokens:this.lexer.inline(r)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let r=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let i=St(r.slice(0,-1),"\\");if((r.length-i.length)%2===0)return}else{let i=qs(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],n="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],n=i[3])}else n=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?s=s.slice(1):s=s.slice(1,-1)),zr(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){let s=(r[2]||r[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=e[s.toLowerCase()];if(!n){let i=r[0].charAt(0);return{type:"text",raw:i,text:i}}return zr(r,n,r[0],this.lexer,this.rules)}}emStrong(t,e,r=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&r.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!r||this.rules.inline.punctuation.exec(r))){let n=[...s[0]].length-1,i,a,h=n,l=0,o=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(o.lastIndex=0,e=e.slice(-1*t.length+n);(s=o.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){h+=a;continue}else if((s[5]||s[6])&&n%3&&!((n+a)%3)){l+=a;continue}if(h-=a,h>0)continue;a=Math.min(a,a+h+l);let u=[...s[0]][0].length,c=t.slice(0,n+s.index+u+a);if(Math.min(n,a)%2){let p=c.slice(1,-1);return{type:"em",raw:c,text:p,tokens:this.lexer.inlineTokens(p)}}let f=c.slice(2,-2);return{type:"strong",raw:c,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let r=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(r),n=this.rules.other.startingSpaceChar.test(r)&&this.rules.other.endingSpaceChar.test(r);return s&&n&&(r=r.substring(1,r.length-1)),{type:"codespan",raw:e[0],text:r}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,r=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!r||this.rules.inline.punctuation.exec(r))){let n=[...s[0]].length-1,i,a,h=n,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+n);(s=l.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==n))continue;if(s[3]||s[4]){h+=a;continue}if(h-=a,h>0)continue;a=Math.min(a,a+h);let o=[...s[0]][0].length,u=t.slice(0,n+s.index+o+a),c=u.slice(n,-n);return{type:"del",raw:u,text:c,tokens:this.lexer.inlineTokens(c)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let r,s;return e[2]==="@"?(r=e[1],s="mailto:"+r):(r=e[1],s=r),{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let r,s;if(e[2]==="@")r=e[0],s="mailto:"+r;else{let n;do n=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(n!==e[0]);r=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let r=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:r}}}},$e=class Fn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ye,this.options.tokenizer=this.options.tokenizer||new Ft,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let r={other:ve,block:Wt.normal,inline:xt.normal};this.options.pedantic?(r.block=Wt.pedantic,r.inline=xt.pedantic):this.options.gfm&&(r.block=Wt.gfm,this.options.breaks?r.inline=xt.breaks:r.inline=xt.gfm),this.tokenizer.rules=r}static get rules(){return{block:Wt,inline:xt}}static lex(e,r){return new Fn(r).lex(e)}static lexInline(e,r){return new Fn(r).inlineTokens(e)}lex(e){e=e.replace(ve.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let r=0;r<this.inlineQueue.length;r++){let s=this.inlineQueue[r];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,r=[],s=!1){for(this.options.pedantic&&(e=e.replace(ve.tabCharGlobal,"    ").replace(ve.spaceLine,""));e;){let n;if(this.options.extensions?.block?.some(a=>(n=a.call({lexer:this},e,r))?(e=e.substring(n.raw.length),r.push(n),!0):!1))continue;if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length);let a=r.at(-1);n.raw.length===1&&a!==void 0?a.raw+=`
`:r.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title},r.push(n));continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),r.push(n);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0,h=e.slice(1),l;this.options.extensions.startBlock.forEach(o=>{l=o.call({lexer:this},h),typeof l=="number"&&l>=0&&(a=Math.min(a,l))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(n=this.tokenizer.paragraph(i))){let a=r.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n),s=i.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,r}inline(e,r=[]){return this.inlineQueue.push({src:e,tokens:r}),r}inlineTokens(e,r=[]){let s=e,n=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)l.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,n.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=n[2]?n[2].length:0,s=s.slice(0,n.index+i)+"["+"a".repeat(n[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,h="";for(;e;){a||(h=""),a=!1;let l;if(this.options.extensions?.inline?.some(u=>(l=u.call({lexer:this},e,r))?(e=e.substring(l.raw.length),r.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let u=r.at(-1);l.type==="text"&&u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):r.push(l);continue}if(l=this.tokenizer.emStrong(e,s,h)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.del(e,s,h)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),r.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),r.push(l);continue}let o=e;if(this.options.extensions?.startInline){let u=1/0,c=e.slice(1),f;this.options.extensions.startInline.forEach(p=>{f=p.call({lexer:this},c),typeof f=="number"&&f>=0&&(u=Math.min(u,f))}),u<1/0&&u>=0&&(o=e.substring(0,u+1))}if(l=this.tokenizer.inlineText(o)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(h=l.raw.slice(-1)),a=!0;let u=r.at(-1);u?.type==="text"?(u.raw+=l.raw,u.text+=l.text):r.push(l);continue}if(e){let u="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return r}},Zt=class{options;parser;constructor(t){this.options=t||Ye}space(t){return""}code({text:t,lang:e,escaped:r}){let s=(e||"").match(ve.notSpaceStart)?.[0],n=t.replace(ve.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Be(s)+'">'+(r?n:Be(n,!0))+`</code></pre>
`:"<pre><code>"+(r?n:Be(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,r=t.start,s="";for(let a=0;a<t.items.length;a++){let h=t.items[a];s+=this.listitem(h)}let n=e?"ol":"ul",i=e&&r!==1?' start="'+r+'"':"";return"<"+n+i+`>
`+s+"</"+n+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",r="";for(let n=0;n<t.header.length;n++)r+=this.tablecell(t.header[n]);e+=this.tablerow({text:r});let s="";for(let n=0;n<t.rows.length;n++){let i=t.rows[n];r="";for(let a=0;a<i.length;a++)r+=this.tablecell(i[a]);s+=this.tablerow({text:r})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+e+`</${r}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Be(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:r}){let s=this.parser.parseInline(r),n=Pr(t);if(n===null)return s;t=n;let i='<a href="'+t+'"';return e&&(i+=' title="'+Be(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:r,tokens:s}){s&&(r=this.parser.parseInline(s,this.parser.textRenderer));let n=Pr(t);if(n===null)return Be(r);t=n;let i=`<img src="${t}" alt="${Be(r)}"`;return e&&(i+=` title="${Be(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Be(t.text)}},Tn=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},Pe=class Zn{options;renderer;textRenderer;constructor(e){this.options=e||Ye,this.options.renderer=this.options.renderer||new Zt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Tn}static parse(e,r){return new Zn(r).parse(e)}static parseInline(e,r){return new Zn(r).parseInline(e)}parse(e){let r="";for(let s=0;s<e.length;s++){let n=e[s];if(this.options.extensions?.renderers?.[n.type]){let a=n,h=this.options.extensions.renderers[a.type].call({parser:this},a);if(h!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){r+=h||"";continue}}let i=n;switch(i.type){case"space":{r+=this.renderer.space(i);break}case"hr":{r+=this.renderer.hr(i);break}case"heading":{r+=this.renderer.heading(i);break}case"code":{r+=this.renderer.code(i);break}case"table":{r+=this.renderer.table(i);break}case"blockquote":{r+=this.renderer.blockquote(i);break}case"list":{r+=this.renderer.list(i);break}case"checkbox":{r+=this.renderer.checkbox(i);break}case"html":{r+=this.renderer.html(i);break}case"def":{r+=this.renderer.def(i);break}case"paragraph":{r+=this.renderer.paragraph(i);break}case"text":{r+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}parseInline(e,r=this.renderer){let s="";for(let n=0;n<e.length;n++){let i=e[n];if(this.options.extensions?.renderers?.[i.type]){let h=this.options.extensions.renderers[i.type].call({parser:this},i);if(h!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=h||"";continue}}let a=i;switch(a.type){case"escape":{s+=r.text(a);break}case"html":{s+=r.html(a);break}case"link":{s+=r.link(a);break}case"image":{s+=r.image(a);break}case"checkbox":{s+=r.checkbox(a);break}case"strong":{s+=r.strong(a);break}case"em":{s+=r.em(a);break}case"codespan":{s+=r.codespan(a);break}case"br":{s+=r.br(a);break}case"del":{s+=r.del(a);break}case"text":{s+=r.text(a);break}default:{let h='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(h),"";throw new Error(h)}}}return s}},vt=class{options;block;constructor(t){this.options=t||Ye}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?$e.lex:$e.lexInline}provideParser(){return this.block?Pe.parse:Pe.parseInline}},Fs=class{defaults=bn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Pe;Renderer=Zt;TextRenderer=Tn;Lexer=$e;Tokenizer=Ft;Hooks=vt;constructor(...t){this.use(...t)}walkTokens(t,e){let r=[];for(let s of t)switch(r=r.concat(e.call(this,s)),s.type){case"table":{let n=s;for(let i of n.header)r=r.concat(this.walkTokens(i.tokens,e));for(let i of n.rows)for(let a of i)r=r.concat(this.walkTokens(a.tokens,e));break}case"list":{let n=s;r=r.concat(this.walkTokens(n.items,e));break}default:{let n=s;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(i=>{let a=n[i].flat(1/0);r=r.concat(this.walkTokens(a,e))}):n.tokens&&(r=r.concat(this.walkTokens(n.tokens,e)))}}return r}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(r=>{let s={...r};if(s.async=this.defaults.async||s.async||!1,r.extensions&&(r.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let i=e.renderers[n.name];i?e.renderers[n.name]=function(...a){let h=n.renderer.apply(this,a);return h===!1&&(h=i.apply(this,a)),h}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[n.level];i?i.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),r.renderer){let n=this.defaults.renderer||new Zt(this.defaults);for(let i in r.renderer){if(!(i in n))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,h=r.renderer[a],l=n[a];n[a]=(...o)=>{let u=h.apply(n,o);return u===!1&&(u=l.apply(n,o)),u||""}}s.renderer=n}if(r.tokenizer){let n=this.defaults.tokenizer||new Ft(this.defaults);for(let i in r.tokenizer){if(!(i in n))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,h=r.tokenizer[a],l=n[a];n[a]=(...o)=>{let u=h.apply(n,o);return u===!1&&(u=l.apply(n,o)),u}}s.tokenizer=n}if(r.hooks){let n=this.defaults.hooks||new vt;for(let i in r.hooks){if(!(i in n))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,h=r.hooks[a],l=n[a];vt.passThroughHooks.has(i)?n[a]=o=>{if(this.defaults.async&&vt.passThroughHooksRespectAsync.has(i))return(async()=>{let c=await h.call(n,o);return l.call(n,c)})();let u=h.call(n,o);return l.call(n,u)}:n[a]=(...o)=>{if(this.defaults.async)return(async()=>{let c=await h.apply(n,o);return c===!1&&(c=await l.apply(n,o)),c})();let u=h.apply(n,o);return u===!1&&(u=l.apply(n,o)),u}}s.hooks=n}if(r.walkTokens){let n=this.defaults.walkTokens,i=r.walkTokens;s.walkTokens=function(a){let h=[];return h.push(i.call(this,a)),n&&(h=h.concat(n.call(this,a))),h}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return $e.lex(t,e??this.defaults)}parser(t,e){return Pe.parse(t,e??this.defaults)}parseMarkdown(t){return(e,r)=>{let s={...r},n={...this.defaults,...s},i=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let a=n.hooks?await n.hooks.preprocess(e):e,h=await(n.hooks?await n.hooks.provideLexer():t?$e.lex:$e.lexInline)(a,n),l=n.hooks?await n.hooks.processAllTokens(h):h;n.walkTokens&&await Promise.all(this.walkTokens(l,n.walkTokens));let o=await(n.hooks?await n.hooks.provideParser():t?Pe.parse:Pe.parseInline)(l,n);return n.hooks?await n.hooks.postprocess(o):o})().catch(i);try{n.hooks&&(e=n.hooks.preprocess(e));let a=(n.hooks?n.hooks.provideLexer():t?$e.lex:$e.lexInline)(e,n);n.hooks&&(a=n.hooks.processAllTokens(a)),n.walkTokens&&this.walkTokens(a,n.walkTokens);let h=(n.hooks?n.hooks.provideParser():t?Pe.parse:Pe.parseInline)(a,n);return n.hooks&&(h=n.hooks.postprocess(h)),h}catch(a){return i(a)}}}onError(t,e){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+Be(r.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(r);throw r}}},Je=new Fs;function te(t,e){return Je.parse(t,e)}te.options=te.setOptions=function(t){return Je.setOptions(t),te.defaults=Je.defaults,br(te.defaults),te},te.getDefaults=bn,te.defaults=Ye,te.use=function(...t){return Je.use(...t),te.defaults=Je.defaults,br(te.defaults),te},te.walkTokens=function(t,e){return Je.walkTokens(t,e)},te.parseInline=Je.parseInline,te.Parser=Pe,te.parser=Pe.parse,te.Renderer=Zt,te.TextRenderer=Tn,te.Lexer=$e,te.lexer=$e.lex,te.Tokenizer=Ft,te.Hooks=vt,te.parse=te,te.options,te.setOptions,te.use,te.walkTokens,te.parseInline,Pe.parse,$e.lex;const Br=`function j() {
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
`,Or=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Br],{type:"text/javascript;charset=utf-8"});function Zs(t){let e;try{if(e=Or&&(self.URL||self.webkitURL).createObjectURL(Or),!e)throw"";const r=new Worker(e,{type:"module",name:t?.name});return r.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),r}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Br),{type:"module",name:t?.name})}}function Qs(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const r=t.slice(3,e+0).trim(),s=t.slice(e+4).trimStart(),n={};return r.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(n[a[1].trim()]=a[2].trim())}),{content:s,data:n}}}return{content:t,data:{}}}const Nr=er(()=>new Zs,"markdown"),Dr=typeof DOMParser<"u"?new DOMParser:null;function Cn(){return Nr.get()}function Gs(t){return Nr.send(t,1e3)}const Qe=[];function Ln(t){if(t&&typeof t=="object"){Qe.push(t);try{te.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function Xs(t){Qe.length=0,Array.isArray(t)&&Qe.push(...t.filter(e=>e&&typeof e=="object"));try{Qe.forEach(e=>te.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function Qt(t){if(Cn&&Cn())try{const i=await Gs({type:"render",md:t});if(i&&i.html!==void 0)try{const h=(Dr||new DOMParser).parseFromString(i.html,"text/html"),l=h.querySelectorAll("h1,h2,h3,h4,h5,h6");l.forEach(c=>{c.id||(c.id=re(c.textContent||""))});try{h.querySelectorAll("img").forEach(f=>{try{f.getAttribute("loading")||f.setAttribute("data-want-lazy","1")}catch(p){console.warn("[markdown] set image loading attribute failed",p)}})}catch(c){console.warn("[markdown] query images failed",c)}try{h.querySelectorAll("pre code").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(y){console.warn("[markdown] set code class failed",y),f.className=d}else try{f.removeAttribute&&f.removeAttribute("class")}catch(y){console.warn("[markdown] remove code class failed",y),f.className=""}const m=d,w=m.match(/language-([a-zA-Z0-9_+-]+)/)||m.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!w||!w[1])try{const y=f.textContent||"";try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const x=oe.highlight(y,{language:"plaintext"});x&&x.value&&(f.innerHTML=x.value)}}catch{try{oe.highlightElement(f)}catch(z){console.warn("[markdown] hljs.highlightElement failed",z)}}}catch(y){console.warn("[markdown] code auto-detect failed",y)}}catch(p){console.warn("[markdown] processing code blocks failed",p)}})}catch(c){console.warn("[markdown] query code blocks failed",c)}const o=h.body.innerHTML,u=[];return l.forEach(c=>{u.push({level:Number(c.tagName.substring(1)),text:(c.textContent||"").trim(),id:c.id})}),{html:o,meta:i.meta||{},toc:u}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:r,data:s}=Qs(t||"");if(te.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Qe&&Qe.length)try{Qe.forEach(i=>te.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let n=te.parse(r);try{const a=(Dr||new DOMParser).parseFromString(n,"text/html"),h=a.querySelectorAll("h1,h2,h3,h4,h5,h6");h.forEach(o=>{o.id||(o.id=re(o.textContent||""))});try{a.querySelectorAll("img").forEach(u=>{try{u.getAttribute("loading")||u.setAttribute("data-want-lazy","1")}catch(c){console.warn("[markdown] set image loading attribute failed",c)}})}catch(o){console.warn("[markdown] query images failed",o)}try{a.querySelectorAll("pre code").forEach(u=>{try{const c=u.getAttribute&&u.getAttribute("class")||u.className||"",f=String(c||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{u.setAttribute&&u.setAttribute("class",f)}catch(m){console.warn("[markdown] set code class failed",m),u.className=f}else try{u.removeAttribute&&u.removeAttribute("class")}catch(m){console.warn("[markdown] remove code class failed",m),u.className=""}const p=f,d=p.match(/language-([a-zA-Z0-9_+-]+)/)||p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!d||!d[1])try{const m=u.textContent||"";try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const w=oe.highlight(m,{language:"plaintext"});w&&w.value&&(u.innerHTML=w.value)}}catch{try{oe.highlightElement(u)}catch(y){console.warn("[markdown] hljs.highlightElement failed",y)}}}catch(m){console.warn("[markdown] code auto-detect failed",m)}}catch(c){console.warn("[markdown] processing code blocks failed",c)}})}catch(o){console.warn("[markdown] query code blocks failed",o)}n=a.body.innerHTML;const l=[];return h.forEach(o=>{l.push({level:Number(o.tagName.substring(1)),text:(o.textContent||"").trim(),id:o.id})}),{html:a.body.innerHTML,meta:s||{},toc:l}}catch(i){console.warn("post-process markdown failed",i)}return{html:n,meta:s||{},toc:[]}}function _n(t,e){const r=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,n=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(t);)if(a[1]){const h=a[1].toLowerCase();if(sn.has(h)||e&&e.size&&h.length<3&&!e.has(h)&&!(Ae&&Ae[h]&&e.has(Ae[h])))continue;if(e&&e.size){if(e.has(h)){const o=e.get(h);o&&r.add(o);continue}if(Ae&&Ae[h]){const o=Ae[h];if(e.has(o)){const u=e.get(o)||o;r.add(u);continue}}}(i.has(h)||h.length>=5&&h.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(h)&&!n.has(h))&&r.add(h)}return r}const Ks=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:Ln,detectFenceLanguages:_n,initRendererWorker:Cn,markdownPlugins:Qe,parseMarkdownToHtml:Qt,setMarkdownExtensions:Xs},Symbol.toStringTag,{value:"Module"}));function Ys(t,e){const r=document.createElement("aside");r.className="menu nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=t("navigation"),r.appendChild(s);const n=document.createElement("ul");return n.className="menu-list",e.forEach(i=>{const a=document.createElement("li"),h=document.createElement("a");if(h.href="#"+i.path,h.textContent=i.name,a.appendChild(h),i.children&&i.children.length){const l=document.createElement("ul");i.children.forEach(o=>{const u=document.createElement("li"),c=document.createElement("a");c.href="#"+o.path,c.textContent=o.name,u.appendChild(c),l.appendChild(u)}),a.appendChild(l)}n.appendChild(a)}),r.appendChild(n),r}function Vs(t,e,r=""){const s=document.createElement("aside");s.className="menu nimbi-toc-inner";const n=document.createElement("p");n.className="menu-label",n.textContent=t("onThisPage"),s.appendChild(n);const i=document.createElement("ul");return i.className="menu-list",e.forEach(a=>{if(a.level===1)return;const h=document.createElement("li"),l=document.createElement("a"),o=a.id||re(a.text);try{const u=String(r||"").replace(/^[\.\/]+/,""),c=u&&H&&H.has&&H.has(u)?H.get(u):u;c?l.href=`?page=${encodeURIComponent(c)}#${encodeURIComponent(o)}`:l.href=`?page=${encodeURIComponent(o)}#${encodeURIComponent(o)}`}catch(u){console.warn("[htmlBuilder] buildTocElement href normalization failed",u);const c=String(r||"").replace(/^[\.\/]+/,""),f=c&&H&&H.has&&H.has(c)?H.get(c):c;f?l.href=`?page=${encodeURIComponent(f)}#${encodeURIComponent(o)}`:l.href=`?page=${encodeURIComponent(o)}#${encodeURIComponent(o)}`}l.textContent=a.text,h.appendChild(l),i.appendChild(h)}),s.appendChild(i),s}function Hr(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(r=>{r.id||(r.id=re(r.textContent||""))})}function Js(t,e,r){try{const s=t.querySelectorAll("img");if(s&&s.length){const n=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const h=new URL(n+a,r).toString();i.src=h;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] set image loading attribute failed",l)}}catch(h){console.warn("[htmlBuilder] resolve image src failed",h)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function Ur(t,e,r){try{const s=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";let n=null;try{const a=new URL(r,location.href);n=new URL(s||".",a).toString()}catch{try{n=new URL(s||".",location.href).toString()}catch{n=s||"./"}}const i=t.querySelectorAll("*");for(const a of Array.from(i||[]))try{const h=a.tagName?a.tagName.toLowerCase():"",l=o=>{try{const u=a.getAttribute(o)||"";if(!u||/^(https?:)?\/\//i.test(u)||u.startsWith("/")||u.startsWith("#"))return;try{a.setAttribute(o,new URL(u,n).toString())}catch{}}catch{}};if(a.hasAttribute&&a.hasAttribute("src")&&l("src"),a.hasAttribute&&a.hasAttribute("href")&&h!=="a"&&l("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&l("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&l("poster"),a.hasAttribute("srcset")){const c=(a.getAttribute("srcset")||"").split(",").map(f=>f.trim()).filter(Boolean).map(f=>{const[p,d]=f.split(/\s+/,2);if(!p||/^(https?:)?\/\//i.test(p)||p.startsWith("/"))return f;try{const m=new URL(p,n).toString();return d?`${m} ${d}`:m}catch{return f}}).join(", ");a.setAttribute("srcset",c)}}catch{}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let qr="",Mn=null,jr="";async function Wr(t,e,r){try{const s=t.querySelectorAll("a");if(!s||!s.length)return;let n,i;if(e===qr&&Mn)n=Mn,i=jr;else{try{n=new URL(e,location.href),i=dt(n.pathname)}catch{try{n=new URL(e,location.href),i=dt(n.pathname)}catch{n=null,i="/"}}qr=e,Mn=n,jr=i}const a=new Set,h=[],l=new Set,o=[];for(const u of Array.from(s))try{const c=u.getAttribute("href")||"";if(!c||ir(c))continue;try{if(c.startsWith("?")||c.indexOf("?")!==-1)try{const p=new URL(c,e||location.href),d=p.searchParams.get("page");if(d&&d.indexOf("/")===-1&&r){const m=r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"";if(m){const w=ue(m+d);u.setAttribute("href","?page="+encodeURIComponent(w)+(p.hash||""));continue}}}catch{}}catch{}if(c.startsWith("/")&&!c.endsWith(".md"))continue;const f=c.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(f){let p=f[1];const d=f[2];!p.startsWith("/")&&r&&(p=(r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"")+p);try{const m=new URL(p,e).pathname;let w=m.startsWith(i)?m.slice(i.length):m;w=ue(w),h.push({node:u,mdPathRaw:p,frag:d,rel:w}),H.has(w)||a.add(w)}catch(m){console.warn("[htmlBuilder] resolve mdPath failed",m)}continue}try{let p=c;!c.startsWith("/")&&r&&(p=(r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"")+c);const m=new URL(p,e).pathname||"";if(m&&m.indexOf(i)!==-1){let w=m.startsWith(i)?m.slice(i.length):m;if(w=ue(w),w=ht(w),w||(w="_home"),!w.endsWith(".md")){let y=null;try{if(H&&H.has&&H.has(w))y=H.get(w);else try{const x=String(w||"").replace(/^.*\//,"");x&&H.has&&H.has(x)&&(y=H.get(x))}catch{}}catch{}if(!y)try{const x=String(w||"").replace(/^.*\//,"");for(const[z,R]of K||[])if(R===w||R===x){y=z;break}}catch{}y?u.setAttribute("href",`?page=${encodeURIComponent(y)}`):(l.add(w),o.push({node:u,rel:w}))}}}catch(p){console.warn("[htmlBuilder] resolving href to URL failed",p)}}catch(c){console.warn("[htmlBuilder] processing anchor failed",c)}a.size&&await Promise.all(Array.from(a).map(async u=>{try{try{const f=String(u).match(/([^\/]+)\.md$/),p=f&&f[1];if(p&&K.has(p)){try{const d=K.get(p);if(d)try{H.set(d,p)}catch(m){console.warn("[htmlBuilder] mdToSlug.set failed",m)}}catch(d){console.warn("[htmlBuilder] reading slugToMd failed",d)}return}}catch(f){console.warn("[htmlBuilder] basename slug lookup failed",f)}const c=await be(u,e);if(c&&c.raw){const f=(c.raw||"").match(/^#\s+(.+)$/m);if(f&&f[1]){const p=re(f[1].trim());if(p)try{K.set(p,u),H.set(u,p)}catch(d){console.warn("[htmlBuilder] setting slug mapping failed",d)}}}}catch(c){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",c)}})),l.size&&await Promise.all(Array.from(l).map(async u=>{try{const c=await be(u,e);if(c&&c.raw)try{const p=($n||new DOMParser).parseFromString(c.raw,"text/html"),d=p.querySelector("title"),m=p.querySelector("h1"),w=d&&d.textContent&&d.textContent.trim()?d.textContent.trim():m&&m.textContent?m.textContent.trim():null;if(w){const y=re(w);if(y)try{K.set(y,u),H.set(u,y)}catch(x){console.warn("[htmlBuilder] setting html slug mapping failed",x)}}}catch(f){console.warn("[htmlBuilder] parse fetched HTML failed",f)}}catch(c){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",c)}}));for(const u of h){const{node:c,frag:f,rel:p}=u;let d=null;try{H.has(p)&&(d=H.get(p))}catch(m){console.warn("[htmlBuilder] mdToSlug access failed",m)}d?f?c.setAttribute("href",`?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`):c.setAttribute("href",`?page=${encodeURIComponent(d)}`):f?c.setAttribute("href",`?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`):c.setAttribute("href",`?page=${encodeURIComponent(p)}`)}for(const u of o){const{node:c,rel:f}=u;let p=null;try{H.has(f)&&(p=H.get(f))}catch{}if(!p)try{const d=String(f||"").replace(/^.*\//,"");H.has(d)&&(p=H.get(d))}catch{}p?c.setAttribute("href",`?page=${encodeURIComponent(p)}`):c.setAttribute("href",`?page=${encodeURIComponent(f)}`)}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function ea(t,e,r,s){const n=e.querySelector("h1"),i=n?(n.textContent||"").trim():"";let a="";try{i&&(a=re(i)),!a&&t&&t.meta&&t.meta.title&&(a=re(t.meta.title)),!a&&r&&(a=re(String(r))),a||(a="_home");try{r&&(K.set(a,r),H.set(r,a))}catch(h){console.warn("[htmlBuilder] computeSlug set slug mapping failed",h)}try{let h="?page="+encodeURIComponent(a);try{const l=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");l&&(h+="#"+encodeURIComponent(l))}catch(l){console.warn("[htmlBuilder] computeSlug hash decode failed",l)}try{history.replaceState({page:a},"",h)}catch(l){console.warn("[htmlBuilder] computeSlug history replace failed",l)}}catch(h){console.warn("[htmlBuilder] computeSlug inner failed",h)}}catch(h){console.warn("[htmlBuilder] computeSlug failed",h)}return{topH1:n,h1Text:i,slugKey:a}}async function ta(t,e){if(!t||!t.length)return;const r=new Set;for(const l of Array.from(t||[]))try{const o=l.getAttribute("href")||"";if(!o)continue;let f=ue(o).split(/::|#/,2)[0];if(!f||(f.includes(".")||(f=f+".html"),!/\.html(?:$|[?#])/.test(f)&&!f.toLowerCase().endsWith(".html")))continue;const p=f;try{if(H&&H.has&&H.has(p))continue}catch(d){console.warn("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const m of K.values())if(m===p){d=!0;break}if(d)continue}catch(d){console.warn("[htmlBuilder] slugToMd iteration failed",d)}r.add(p)}catch(o){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",o)}if(!r.size)return;const s=async l=>{try{const o=await be(l,e);if(o&&o.raw)try{const c=($n||new DOMParser).parseFromString(o.raw,"text/html"),f=c.querySelector("title"),p=c.querySelector("h1"),d=f&&f.textContent&&f.textContent.trim()?f.textContent.trim():p&&p.textContent?p.textContent.trim():null;if(d){const m=re(d);if(m)try{K.set(m,l),H.set(l,m)}catch(w){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",w)}}}catch(u){console.warn("[htmlBuilder] parse HTML title failed",u)}}catch(o){console.warn("[htmlBuilder] fetchAndExtract failed",o)}},n=5,i=Array.from(r);let a=0;const h=[];for(;a<i.length;){const l=i.slice(a,a+n);h.push(Promise.all(l.map(s))),a+=n}await Promise.all(h)}async function na(t,e){if(!t||!t.length)return;const r=[],s=new Set;let n="";try{const i=new URL(e);n=dt(i.pathname)}catch(i){n="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(t||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const h=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(h){let l=ue(h[1]);try{let o;try{o=new URL(l,e).pathname}catch(c){o=l,console.warn("[htmlBuilder] resolve mdPath URL failed",c)}const u=o.startsWith(n)?o.slice(n.length):o.replace(/^\//,"");r.push({rel:u}),H.has(u)||s.add(u)}catch(o){console.warn("[htmlBuilder] rewriteAnchors failed",o)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),h=a&&a[1];if(h&&K.has(h)){try{const l=K.get(h);l&&H.set(l,h)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",l)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await be(i,e);if(a&&a.raw){const h=(a.raw||"").match(/^#\s+(.+)$/m);if(h&&h[1]){const l=re(h[1].trim());if(l)try{K.set(l,i),H.set(i,l)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",o)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const $n=typeof DOMParser<"u"?new DOMParser:null;function Pn(t){try{const r=($n||new DOMParser).parseFromString(t||"","text/html");Hr(r);try{r.querySelectorAll("img").forEach(h=>{try{h.getAttribute("loading")||h.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",l)}})}catch(a){console.warn("[htmlBuilder] parseHtml query images failed",a)}r.querySelectorAll("pre code, code[class]").forEach(a=>{try{const h=a.getAttribute&&a.getAttribute("class")||a.className||"",l=h.match(/language-([a-zA-Z0-9_+-]+)/)||h.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const o=(l[1]||"").toLowerCase(),u=V.size&&(V.get(o)||V.get(String(o).toLowerCase()))||o;try{(async()=>{try{await rt(u)}catch(c){console.warn("[htmlBuilder] registerLanguage failed",c)}})()}catch(c){console.warn("[htmlBuilder] schedule registerLanguage failed",c)}}else try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const o=oe.highlight?oe.highlight(a.textContent||"",{language:"plaintext"}):null;o&&o.value&&(a.innerHTML=o.value)}}catch(o){console.warn("[htmlBuilder] plaintext highlight fallback failed",o)}}catch(h){console.warn("[htmlBuilder] code element processing failed",h)}});const n=[];return r.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(a=>{n.push({level:Number(a.tagName.substring(1)),text:(a.textContent||"").trim(),id:a.id})}),{html:r.body.innerHTML,meta:{},toc:n}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function ra(t){const e=_n?_n(t||"",V):new Set,r=new Set(e),s=[];for(const n of r)try{const i=V.size&&(V.get(n)||V.get(String(n).toLowerCase()))||n;try{s.push(rt(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(n)!==String(i))try{s.push(rt(n))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(n){console.warn("[htmlBuilder] ensureLanguages failed",n)}}async function ia(t){if(await ra(t),Qt){const e=await Qt(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function sa(t,e,r,s,n){let i=null;if(e.isHtml)try{const c=typeof DOMParser<"u"?new DOMParser:null;if(c){const f=c.parseFromString(e.raw||"","text/html");try{Ur(f.body,r,n)}catch{}i=Pn(f.documentElement&&f.documentElement.outerHTML?f.documentElement.outerHTML:e.raw||"")}else i=Pn(e.raw||"")}catch{i=Pn(e.raw||"")}else i=await ia(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{Ur(a,r,n)}catch(c){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",c)}try{Hr(a)}catch(c){console.warn("[htmlBuilder] addHeadingIds failed",c)}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(m){f.className=d,console.warn("[htmlBuilder] set element class failed",m)}else try{f.removeAttribute&&f.removeAttribute("class")}catch(m){f.className="",console.warn("[htmlBuilder] remove element class failed",m)}}catch(p){console.warn("[htmlBuilder] code element cleanup failed",p)}})}catch(c){console.warn("[htmlBuilder] processing code elements failed",c)}try{Kn(a)}catch(c){console.warn("[htmlBuilder] observeCodeBlocks failed",c)}Js(a,r,n);try{await aa(a,n,r)}catch(c){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",c),await Wr(a,n,r)}const{topH1:h,h1Text:l,slugKey:o}=ea(i,a,r,s),u=Vs(t,i.toc,r);return{article:a,parsed:i,toc:u,topH1:h,h1Text:l,slugKey:o}}function Fr(t,e,r){t&&(t.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const n=document.createElement("h1");n.textContent=e&&e("notFound")||"Page not found";const i=document.createElement("p");i.textContent=r&&r.message?String(r.message):"Failed to resolve the requested page.",s.appendChild(n),s.appendChild(i),t&&t.appendChild&&t.appendChild(s)}async function aa(t,e,r){return Wr(t,e,r)}function la(t){try{t.addEventListener("click",e=>{const r=e.target&&e.target.closest?e.target.closest("a"):null;if(!r)return;const s=r.getAttribute("href")||"";try{const n=new URL(s,location.href),i=n.searchParams.get("page"),a=n.hash?n.hash.replace(/^#/,""):null;if(!i&&!a)return;e.preventDefault();let h=null;try{history&&history.state&&history.state.page&&(h=history.state.page)}catch(l){h=null,console.warn("[htmlBuilder] access history.state failed",l)}try{h||(h=new URL(location.href).searchParams.get("page"))}catch(l){console.warn("[htmlBuilder] parse current location failed",l)}if(!i&&a||i&&h&&String(i)===String(h)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:h||i},"","?page="+encodeURIComponent(h||i)+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}}catch(l){console.warn("[htmlBuilder] update history for anchor failed",l)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(l){console.warn("[htmlBuilder] stopPropagation failed",l)}try{In(a)}catch(l){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:i},"","?page="+encodeURIComponent(i)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(l){console.warn("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){console.warn("[htmlBuilder] dispatch popstate failed",l)}else try{renderByQuery()}catch(l){console.warn("[htmlBuilder] renderByQuery failed",l)}}catch(l){console.warn("[htmlBuilder] SPA navigation invocation failed",l)}}catch(n){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",n)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function In(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const r=document.getElementById(t);if(r)try{const s=()=>{try{if(e&&e.scrollTo&&e.contains(r)){const n=r.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:n,behavior:"smooth"})}else try{r.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{r.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{r.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(n){console.warn("[htmlBuilder] scheduling scroll failed",n),setTimeout(s,50)}}catch(s){try{r.scrollIntoView()}catch(n){console.warn("[htmlBuilder] final scroll fallback failed",n)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(r){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",r)}}function oa(t,e,{mountOverlay:r=null,container:s=null,mountEl:n=null,navWrap:i=null,t:a=null}={}){try{const h=a||(m=>typeof m=="string"?m:""),l=s||document.querySelector(".nimbi-cms"),o=n||document.querySelector(".nimbi-mount"),u=r||document.querySelector(".nimbi-overlay"),c=i||document.querySelector(".nimbi-nav-wrap");let p=document.querySelector(".nimbi-scroll-top");if(!p){p=document.createElement("button"),p.className="nimbi-scroll-top",p.setAttribute("aria-label",h("scrollToTop")),p.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{u&&u.appendChild?u.appendChild(p):l&&l.appendChild?l.appendChild(p):o&&o.appendChild?o.appendChild(p):document.body.appendChild(p)}catch{try{document.body.appendChild(p)}catch(w){console.warn("[htmlBuilder] append scroll top button failed",w)}}try{p.style.position="absolute",p.style.right="1rem",p.style.bottom="1.25rem",p.style.zIndex="60"}catch(m){console.warn("[htmlBuilder] set scroll-top button styles failed",m)}p.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):n&&n.scrollTo?n.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback container scrollTop failed",w)}try{n&&(n.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",w)}try{document.documentElement.scrollTop=0}catch(w){console.warn("[htmlBuilder] fallback document scrollTop failed",w)}}})}const d=c&&c.querySelector?c.querySelector(".menu-label"):null;if(e){if(!p._nimbiObserver){const m=new IntersectionObserver(w=>{for(const y of w)y.target instanceof Element&&(y.isIntersecting?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show")))},{root:s instanceof Element?s:n instanceof Element?n:null,threshold:0});p._nimbiObserver=m}try{p._nimbiObserver.disconnect()}catch(m){console.warn("[htmlBuilder] observer disconnect failed",m)}try{p._nimbiObserver.observe(e)}catch(m){console.warn("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const w=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},y=e.getBoundingClientRect();!(y.bottom<w.top||y.top>w.bottom)?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show"))}catch(w){console.warn("[htmlBuilder] checkIntersect failed",w)}};m(),"IntersectionObserver"in window||setTimeout(m,100)}catch(m){console.warn("[htmlBuilder] checkIntersect outer failed",m)}}else{p.classList.remove("show"),d&&d.classList.remove("show");const m=s instanceof Element?s:n instanceof Element?n:window,w=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(p.classList.add("show"),d&&d.classList.add("show")):(p.classList.remove("show"),d&&d.classList.remove("show"))}catch(y){console.warn("[htmlBuilder] onScroll handler failed",y)}};Pt(()=>m.addEventListener("scroll",w)),w()}}catch(h){console.warn("[htmlBuilder] ensureScrollTopButton failed",h)}}async function ca(t,e,r,s,n,i,a,h,l="eager",o=1,u=void 0){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const c=typeof DOMParser<"u"?new DOMParser:null,f=c?c.parseFromString(r||"","text/html"):null,p=f?f.querySelectorAll("a"):[];await Pt(()=>ta(p,s)),await Pt(()=>na(p,s));let d=null,m=null,w=!1;const y=document.createElement("nav");y.className="navbar",y.setAttribute("role","navigation"),y.setAttribute("aria-label","main navigation");const x=document.createElement("div");x.className="navbar-brand";const z=p[0],R=document.createElement("a");if(R.className="navbar-item",z){const T=z.getAttribute("href")||"#";try{const C=new URL(T,location.href).searchParams.get("page");C?R.href="?page="+encodeURIComponent(decodeURIComponent(C)):(R.href="?page="+encodeURIComponent(n),R.textContent=i("home"))}catch{R.href="?page="+encodeURIComponent(n),R.textContent=i("home")}}else R.href="?page="+encodeURIComponent(n),R.textContent=i("home");x.appendChild(R),R.addEventListener("click",function(T){const I=R.getAttribute("href")||"";if(I.startsWith("?page=")){T.preventDefault();const C=new URL(I,location.href),v=C.searchParams.get("page"),b=C.hash?C.hash.replace(/^#/,""):null;history.pushState({page:v},"","?page="+encodeURIComponent(v)+(b?"#"+encodeURIComponent(b):""));try{a()}catch(E){console.warn("[nimbi-cms] renderByQuery failed",E)}}});const _=document.createElement("a");_.className="navbar-burger",_.setAttribute("role","button"),_.setAttribute("aria-label","menu"),_.setAttribute("aria-expanded","false");const q="nimbi-navbar-menu";_.dataset.target=q,_.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',x.appendChild(_);try{_.addEventListener("click",T=>{try{const I=_.dataset&&_.dataset.target?_.dataset.target:null,C=I?document.getElementById(I):null;_.classList.contains("is-active")?(_.classList.remove("is-active"),_.setAttribute("aria-expanded","false"),C&&C.classList.remove("is-active")):(_.classList.add("is-active"),_.setAttribute("aria-expanded","true"),C&&C.classList.add("is-active"))}catch(I){console.warn("[nimbi-cms] navbar burger toggle failed",I)}})}catch(T){console.warn("[nimbi-cms] burger event binding failed",T)}const O=document.createElement("div");O.className="navbar-menu",O.id=q;const Q=document.createElement("div");Q.className="navbar-start";let Y,ne,P;if(!h)Y=null,m=null,P=null;else{Y=document.createElement("div"),Y.className="navbar-end",ne=document.createElement("div"),ne.className="navbar-item",ne.style.position="relative",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=i("searchPlaceholder")||"",m.id="nimbi-search",l==="eager"&&(m.disabled=!0,m.classList.add("is-loading")),ne.appendChild(m),P=document.createElement("div"),P.id="nimbi-search-results",P.className="box",P.style.position="absolute",P.style.top="100%",P.style.right="0",P.style.left="auto",P.style.zIndex="10000",P.style.minWidth="240px",P.style.maxWidth="420px",P.style.maxHeight="50vh",P.style.overflowY="auto",P.style.display="none",P.style.padding="8px",P.style.boxShadow="0 6px 18px rgba(10,10,10,0.1)",ne.appendChild(P),Y.appendChild(ne);const T=C=>{if(P.innerHTML="",!C.length){P.style.display="none";return}C.forEach(v=>{const b=document.createElement("div");if(b.style.marginBottom="6px",b.style.padding="6px",b.style.borderBottom="1px solid rgba(0,0,0,0.06)",v.parentTitle){const $=document.createElement("div");$.textContent=v.parentTitle,$.style.fontSize="11px",$.style.opacity="0.7",$.style.marginBottom="4px",$.className="nimbi-search-parent",$.style.whiteSpace="nowrap",$.style.overflow="hidden",$.style.textOverflow="ellipsis",$.style.display="block",$.style.maxWidth="100%",b.appendChild($)}const E=document.createElement("a");E.className="block",E.href="?page="+encodeURIComponent(v.slug),E.textContent=v.title,E.style.whiteSpace="nowrap",E.style.overflow="hidden",E.style.textOverflow="ellipsis",E.addEventListener("click",()=>{P.style.display="none"}),b.appendChild(E),P.appendChild(b)}),P.style.display="block",P.style.right="0",P.style.left="auto"},I=(C,v)=>{let b=null;return(...E)=>{b&&clearTimeout(b),b=setTimeout(()=>C(...E),v)}};if(m){const C=I(async()=>{const v=document.querySelector("input#nimbi-search"),b=String(v&&v.value||"").trim().toLowerCase();if(!b){T([]);return}try{const E=await Promise.resolve().then(()=>Ht);d||(d=(async()=>{try{return l==="lazy"&&E.buildSearchIndexWorker?E.buildSearchIndexWorker(s,o,u):E.buildSearchIndex(s,o,u)}catch(G){return console.warn("[nimbi-cms] buildSearchIndex failed",G),[]}finally{v&&(v.removeAttribute("disabled"),v.classList.remove("is-loading"))}})());const k=(await d).filter(G=>G.title&&G.title.toLowerCase().includes(b)||G.excerpt&&G.excerpt.toLowerCase().includes(b));T(k.slice(0,10))}catch(E){console.warn("[nimbi-cms] search input handler failed",E),T([])}},50);m&&m.addEventListener("input",C),document.addEventListener("click",v=>{const b=document.querySelector("input#nimbi-search");b&&!b.contains(v.target)&&P&&!P.contains(v.target)&&(P.style.display="none")})}if(l==="eager"){try{d=(async()=>{try{const v=await(await Promise.resolve().then(()=>Ht)).buildSearchIndex(s,o,u);return w||(w=!0),v}catch(C){return console.warn("[nimbi-cms] buildSearchIndex failed",C),[]}})()}catch(C){console.warn("[nimbi-cms] eager search index init failed",C),d=Promise.resolve([])}d.finally(()=>{const C=document.querySelector("input#nimbi-search");C&&(C.removeAttribute("disabled"),C.classList.remove("is-loading"))})}}for(let T=0;T<p.length;T++){const I=p[T];if(T===0)continue;const C=I.getAttribute("href")||"#",v=document.createElement("a");v.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(C)||C.endsWith(".md")){const E=ue(C).split(/::|#/,2),$=E[0],k=E[1];v.href="?page="+encodeURIComponent($)+(k?"#"+encodeURIComponent(k):"")}else if(/\.html(?:$|[#?])/.test(C)||C.endsWith(".html")){const E=ue(C).split(/::|#/,2);let $=E[0];$&&!$.toLowerCase().endsWith(".html")&&($=$+".html");const k=E[1];try{const G=await be($,s);if(G&&G.raw)try{const ce=new DOMParser().parseFromString(G.raw,"text/html"),Me=ce.querySelector("title"),Ee=ce.querySelector("h1"),Ce=Me&&Me.textContent&&Me.textContent.trim()?Me.textContent.trim():Ee&&Ee.textContent?Ee.textContent.trim():null;if(Ce){const ge=re(Ce);if(ge){try{K.set(ge,$),H.set($,ge)}catch(Oe){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Oe)}v.href="?page="+encodeURIComponent(ge)+(k?"#"+encodeURIComponent(k):"")}else v.href="?page="+encodeURIComponent($)+(k?"#"+encodeURIComponent(k):"")}else v.href="?page="+encodeURIComponent($)+(k?"#"+encodeURIComponent(k):"")}catch{v.href="?page="+encodeURIComponent($)+(k?"#"+encodeURIComponent(k):"")}else v.href=C}catch{v.href=C}}else v.href=C}catch(b){console.warn("[nimbi-cms] nav item href parse failed",b),v.href=C}try{const b=I.textContent&&String(I.textContent).trim()?String(I.textContent).trim():null;if(b)try{const E=re(b);if(E){const $=v.getAttribute&&v.getAttribute("href")?v.getAttribute("href"):"";try{const G=new URL($,location.href).searchParams.get("page");if(G){const he=decodeURIComponent(G);try{K.set(E,he),H.set(he,E)}catch(ce){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",ce)}}}catch(k){console.warn("[nimbi-cms] nav slug mapping failed",k)}}}catch(E){console.warn("[nimbi-cms] nav slug mapping failed",E)}}catch(b){console.warn("[nimbi-cms] nav slug mapping failed",b)}v.textContent=I.textContent||C,Q.appendChild(v)}try{m=document.getElementById("nimbi-search");const T=document.getElementById("nimbi-search-results"),I=v=>{if(T.innerHTML="",!v.length){T.style.display="none";return}v.forEach(b=>{const E=document.createElement("div");if(E.style.marginBottom="6px",E.style.padding="6px",E.style.borderBottom="1px solid rgba(0,0,0,0.06)",b.parentTitle){const k=document.createElement("div");k.textContent=b.parentTitle,k.style.fontSize="11px",k.style.opacity="0.7",k.style.marginBottom="4px",k.className="nimbi-search-parent",k.style.whiteSpace="nowrap",k.style.overflow="hidden",k.style.textOverflow="ellipsis",k.style.display="block",k.style.maxWidth="100%",E.appendChild(k)}const $=document.createElement("a");$.className="block",$.href="?page="+encodeURIComponent(b.slug),$.textContent=b.title,$.style.whiteSpace="nowrap",$.style.overflow="hidden",$.style.textOverflow="ellipsis",$.addEventListener("click",()=>{T.style.display="none"}),E.appendChild($),T.appendChild(E)}),T.style.display="block",T.style.right="0",T.style.left="auto"},C=(v,b)=>{let E=null;return(...$)=>{E&&clearTimeout(E),E=setTimeout(()=>v(...$),b)}};if(m){const v=C(async()=>{const b=String(m.value||"").trim().toLowerCase();if(!b){I([]);return}try{const E=await Promise.resolve().then(()=>Ht);d||(d=(async()=>{try{return l==="lazy"&&E.buildSearchIndexWorker?E.buildSearchIndexWorker(s,o,u):E.buildSearchIndex(s,o,u)}catch(G){return console.warn("[nimbi-cms] buildSearchIndex failed",G),[]}finally{m&&(m.disabled=!1,m.classList.remove("is-loading"))}})());const k=(await d).filter(G=>G.title&&G.title.toLowerCase().includes(b)||G.excerpt&&G.excerpt.toLowerCase().includes(b));I(k.slice(0,10))}catch(E){console.warn("[nimbi-cms] search input handler failed",E),I([])}},50);m.addEventListener("input",v),document.addEventListener("click",b=>{m&&!m.contains(b.target)&&T&&!T.contains(b.target)&&(T.style.display="none")})}}catch(T){console.warn("[nimbi-cms] navbar/search setup inner failed",T)}O.appendChild(Q),Y&&O.appendChild(Y),y.appendChild(x),y.appendChild(O),t.appendChild(y);try{O.addEventListener("click",T=>{const I=T.target&&T.target.closest?T.target.closest("a"):null;if(!I)return;const C=I.getAttribute("href")||"";try{const v=new URL(C,location.href),b=v.searchParams.get("page"),E=v.hash?v.hash.replace(/^#/,""):null;if(b){T.preventDefault(),history.pushState({page:b},"","?page="+encodeURIComponent(b)+(E?"#"+encodeURIComponent(E):""));try{a()}catch($){console.warn("[nimbi-cms] renderByQuery failed",$)}}}catch(v){console.warn("[nimbi-cms] navbar click handler failed",v)}try{const v=y&&y.querySelector?y.querySelector(".navbar-burger"):null,b=v&&v.dataset?v.dataset.target:null,E=b?document.getElementById(b):null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),E&&E.classList.remove("is-active"))}catch(v){console.warn("[nimbi-cms] mobile menu close failed",v)}})}catch(T){console.warn("[nimbi-cms] attach content click handler failed",T)}try{e.addEventListener("click",T=>{const I=T.target&&T.target.closest?T.target.closest("a"):null;if(!I)return;const C=I.getAttribute("href")||"";if(C&&!ir(C))try{const v=new URL(C,location.href),b=v.searchParams.get("page"),E=v.hash?v.hash.replace(/^#/,""):null;if(b){T.preventDefault(),history.pushState({page:b},"","?page="+encodeURIComponent(b)+(E?"#"+encodeURIComponent(E):""));try{a()}catch($){console.warn("[nimbi-cms] renderByQuery failed",$)}}}catch(v){console.warn("[nimbi-cms] container click URL parse failed",v)}})}catch(T){console.warn("[nimbi-cms] build navbar failed",T)}return{navbar:y,linkEls:p}}var zn,Zr;function ua(){if(Zr)return zn;Zr=1;function t(i,a){return a.some(([h,l])=>h<=i&&i<=l)}function e(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function r(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function n(i,a={}){let h=0,l=0,o=i.length-1;const u=a.wordsPerMinute||200,c=a.wordBound||r;for(;c(i[l]);)l++;for(;c(i[o]);)o--;const f=`${i}
`;for(let w=l;w<=o;w++)if((e(f[w])||!c(f[w])&&(c(f[w+1])||e(f[w+1])))&&h++,e(f[w]))for(;w<=o&&(s(f[w+1])||c(f[w+1]));)w++;const p=h/u,d=Math.round(p*60*1e3);return{text:Math.ceil(p.toFixed(2))+" min read",minutes:p,time:d,words:h}}return zn=n,zn}var ha=ua();const da=Qn(ha);function Qr(t,e){let r=document.querySelector(`meta[name="${t}"]`);r||(r=document.createElement("meta"),r.setAttribute("name",t),document.head.appendChild(r)),r.setAttribute("content",e)}function ot(t,e,r){let s=`meta[${t}="${e}"]`,n=document.querySelector(s);n||(n=document.createElement("meta"),n.setAttribute(t,e),document.head.appendChild(n)),n.setAttribute("content",r)}function pa(t,e){try{let r=document.querySelector(`link[rel="${t}"]`);r||(r=document.createElement("link"),r.setAttribute("rel",t),document.head.appendChild(r)),r.setAttribute("href",e)}catch(r){console.warn("[seoManager] upsertLinkRel failed",r)}}function fa(t,e,r,s){const n=e&&String(e).trim()?e:t.title||document.title;ot("property","og:title",n);const i=s&&String(s).trim()?s:t.description||"";i&&String(i).trim()&&ot("property","og:description",i),ot("name","twitter:card",t.twitter_card||"summary_large_image");const a=r||t.image;a&&(ot("property","og:image",a),ot("name","twitter:image",a))}function ga(t,e,r,s,n=""){const i=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",h=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";h&&String(h).trim()&&Qr("description",h),Qr("robots",i.robots||"index,follow"),fa(i,e,r,h)}function ma(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const r=document.querySelector(e);if(r){const s=r.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function wa(t,e,r,s,n,i=""){try{const a=t.meta||{},h=r&&String(r).trim()?r:a.title||i||document.title,l=n&&String(n).trim()?n:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",o=s||a.image||null;let u="";try{if(e){const d=ue(e);try{u=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(d)}catch{u=location.href.split("#")[0]}}else u=location.href.split("#")[0]}catch(d){u=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",d)}u&&pa("canonical",u);try{ot("property","og:url",u)}catch(d){console.warn("[seoManager] upsertMeta og:url failed",d)}const c={"@context":"https://schema.org","@type":"Article",headline:h||"",description:l||"",url:u||location.href.split("#")[0]};o&&(c.image=String(o)),a.date&&(c.datePublished=a.date),a.dateModified&&(c.dateModified=a.dateModified);const f="nimbi-jsonld";let p=document.getElementById(f);p||(p=document.createElement("script"),p.type="application/ld+json",p.id=f,document.head.appendChild(p)),p.textContent=JSON.stringify(c,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function ba(t,e,r,s,n,i,a,h,l,o,u){try{const c=s.querySelector(".menu-label");c&&(c.textContent=h&&h.textContent||t("onThisPage"))}catch(c){console.warn("[seoManager] update toc label failed",c)}try{const c=r.meta&&r.meta.title?String(r.meta.title).trim():"",f=n.querySelector("img"),p=f&&(f.getAttribute("src")||f.src)||null;let d="";try{let w="";try{const y=h||(n&&n.querySelector?n.querySelector("h1"):null);if(y){let x=y.nextElementSibling;const z=[];for(;x&&!(x.tagName&&x.tagName.toLowerCase()==="h2");){const R=(x.textContent||"").trim();R&&z.push(R),x=x.nextElementSibling}z.length&&(w=z.join(" ").replace(/\s+/g," ").trim()),!w&&l&&(w=String(l).trim())}}catch(y){console.warn("[seoManager] compute descOverride failed",y)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),d=w}catch(w){console.warn("[seoManager] compute descOverride failed",w)}try{ga(r,l,p,d)}catch(w){console.warn("[seoManager] setMetaTags failed",w)}try{wa(r,o,l,p,d,e)}catch(w){console.warn("[seoManager] setStructuredData failed",w)}const m=ma();l?m?document.title=`${m} - ${l}`:document.title=`${e||"Site"} - ${l}`:c?document.title=c:document.title=e||document.title}catch(c){console.warn("[seoManager] applyPageMeta failed",c)}try{const c=n.querySelector(".nimbi-reading-time");if(c&&c.remove(),l){const f=da(u.raw||""),p=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,d=document.createElement("p");d.className="nimbi-reading-time",d.textContent=p?t("readingTime",{minutes:p}):"";const m=n.querySelector("h1");m&&m.insertAdjacentElement("afterend",d)}}catch(c){console.warn("[seoManager] reading time update failed",c)}}let ke=null,W=null,xe=1,Ge=(t,e)=>e,Et=0,At=0,Gt=()=>{},Rt=.25;function ya(){if(ke&&document.contains(ke))return ke;ke=null;const t=document.createElement("dialog");t.className="nimbi-image-preview",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Ge("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",b=>{b.target===t&&Bn()}),t.addEventListener("wheel",b=>{if(!ne())return;b.preventDefault();const E=b.deltaY<0?Rt:-Rt;qe(xe+E),o(),u()},{passive:!1}),t.addEventListener("keydown",b=>{if(b.key==="Escape"){Bn();return}if(xe>1){const E=t.querySelector(".nimbi-image-preview__image-wrapper");if(!E)return;const $=40;switch(b.key){case"ArrowUp":E.scrollTop-=$,b.preventDefault();break;case"ArrowDown":E.scrollTop+=$,b.preventDefault();break;case"ArrowLeft":E.scrollLeft-=$,b.preventDefault();break;case"ArrowRight":E.scrollLeft+=$,b.preventDefault();break}}}),document.body.appendChild(t),ke=t,W=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),r=t.querySelector("[data-nimbi-preview-original]"),s=t.querySelector("[data-nimbi-preview-zoom-in]"),n=t.querySelector("[data-nimbi-preview-zoom-out]"),i=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),h=t.querySelector("[data-nimbi-preview-zoom-label]"),l=t.querySelector("[data-nimbi-preview-zoom-hud]");function o(){h&&(h.textContent=`${Math.round(xe*100)}%`)}const u=()=>{l&&(l.textContent=`${Math.round(xe*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};Gt=o,s.addEventListener("click",()=>{qe(xe+Rt),o(),u()}),n.addEventListener("click",()=>{qe(xe-Rt),o(),u()}),e.addEventListener("click",()=>{Tt(),o(),u()}),r.addEventListener("click",()=>{qe(1),o(),u()}),i.addEventListener("click",()=>{Tt(),o(),u()}),a.addEventListener("click",Bn),e.title=Ge("imagePreviewFit","Fit to screen"),r.title=Ge("imagePreviewOriginal","Original size"),n.title=Ge("imagePreviewZoomOut","Zoom out"),s.title=Ge("imagePreviewZoomIn","Zoom in"),a.title=Ge("imagePreviewClose","Close"),a.setAttribute("aria-label",Ge("imagePreviewClose","Close"));let c=!1,f=0,p=0,d=0,m=0;const w=new Map;let y=0,x=1;const z=(b,E)=>{const $=b.x-E.x,k=b.y-E.y;return Math.hypot($,k)},R=()=>{c=!1,w.clear(),y=0,W&&(W.style.cursor="all-scroll")};let _=0,q=0,O=0;const Q=b=>{const E=Date.now(),$=E-_,k=b.clientX-q,G=b.clientY-O;_=E,q=b.clientX,O=b.clientY,$<300&&Math.hypot(k,G)<30&&(qe(xe>1?1:2),o(),b.preventDefault())},Y=b=>{qe(xe>1?1:2),o(),b.preventDefault()},ne=()=>ke?typeof ke.open=="boolean"?ke.open:ke.classList.contains("is-active"):!1,P=(b,E,$=1)=>{if(w.has($)&&w.set($,{x:b,y:E}),w.size===2){const ce=Array.from(w.values()),Me=z(ce[0],ce[1]);if(y>0){const Ee=Me/y;qe(x*Ee)}return}if(!c)return;const k=W.closest(".nimbi-image-preview__image-wrapper");if(!k)return;const G=b-f,he=E-p;k.scrollLeft=d-G,k.scrollTop=m-he},T=(b,E,$=1)=>{if(!ne())return;if(w.set($,{x:b,y:E}),w.size===2){const he=Array.from(w.values());y=z(he[0],he[1]),x=xe;return}const k=W.closest(".nimbi-image-preview__image-wrapper");!k||!(k.scrollWidth>k.clientWidth||k.scrollHeight>k.clientHeight)||(c=!0,f=b,p=E,d=k.scrollLeft,m=k.scrollTop,W.style.cursor="all-scroll",window.addEventListener("pointermove",I),window.addEventListener("pointerup",C),window.addEventListener("pointercancel",C))},I=b=>{c&&(b.preventDefault(),P(b.clientX,b.clientY,b.pointerId))},C=()=>{R(),window.removeEventListener("pointermove",I),window.removeEventListener("pointerup",C),window.removeEventListener("pointercancel",C)};W.addEventListener("pointerdown",b=>{b.preventDefault(),T(b.clientX,b.clientY,b.pointerId)}),W.addEventListener("pointermove",b=>{(c||w.size===2)&&b.preventDefault(),P(b.clientX,b.clientY,b.pointerId)}),W.addEventListener("pointerup",b=>{b.preventDefault(),b.pointerType==="touch"&&Q(b),R()}),W.addEventListener("dblclick",Y),W.addEventListener("pointercancel",R),W.addEventListener("mousedown",b=>{b.preventDefault(),T(b.clientX,b.clientY,1)}),W.addEventListener("mousemove",b=>{c&&b.preventDefault(),P(b.clientX,b.clientY,1)}),W.addEventListener("mouseup",b=>{b.preventDefault(),R()});const v=t.querySelector(".nimbi-image-preview__image-wrapper");return v&&(v.addEventListener("pointerdown",b=>{T(b.clientX,b.clientY,b.pointerId)}),v.addEventListener("pointermove",b=>{P(b.clientX,b.clientY,b.pointerId)}),v.addEventListener("pointerup",R),v.addEventListener("pointercancel",R),v.addEventListener("mousedown",b=>{T(b.clientX,b.clientY,1)}),v.addEventListener("mousemove",b=>{P(b.clientX,b.clientY,1)}),v.addEventListener("mouseup",R)),t}function qe(t){if(!W)return;const e=Number(t);xe=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const s=W.getBoundingClientRect(),n=Et||W.naturalWidth||W.width||s.width||0,i=At||W.naturalHeight||W.height||s.height||0;n&&i?(W.style.maxWidth="none",W.style.maxHeight="none",W.style.width=`${n*xe}px`,W.style.height=`${i*xe}px`,W.style.transform=""):(W.style.maxWidth="",W.style.maxHeight="",W.style.width="",W.style.height="",W.style.transform=`scale(${xe})`),W&&(W.style.cursor="all-scroll")}function Tt(){if(!W)return;const t=W.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const r=Et||W.naturalWidth||e.width,s=At||W.naturalHeight||e.height;if(!r||!s)return;const n=e.width/r,i=e.height/s,a=Math.min(n,i,1);qe(Number.isFinite(a)?a:1)}function ka(t,e="",r=0,s=0){const n=ya();xe=1,Et=r||0,At=s||0,W.src=t,W.alt=e,W.style.transform="scale(1)";const i=()=>{Et=W.naturalWidth||W.width||0,At=W.naturalHeight||W.height||0};if(i(),Tt(),Gt(),requestAnimationFrame(()=>{Tt(),Gt()}),!Et||!At){const a=()=>{i(),requestAnimationFrame(()=>{Tt(),Gt()}),W.removeEventListener("load",a)};W.addEventListener("load",a)}typeof n.showModal=="function"&&(n.open||n.showModal()),n.classList.add("is-active"),n.focus()}function Bn(){ke&&(typeof ke.close=="function"&&ke.open&&ke.close(),ke.classList.remove("is-active"))}function xa(t,{t:e,zoomStep:r=.25}={}){if(!t||!t.querySelectorAll)return;Ge=(p,d)=>(typeof e=="function"?e(p):void 0)||d,Rt=r,t.addEventListener("click",p=>{const d=p.target;if(!d||d.tagName!=="IMG")return;const m=d;if(m.src){if(p.defaultPrevented!==!0){const w=m.closest("a");w&&w.getAttribute("href")&&p.preventDefault()}ka(m.src,m.alt||"",m.naturalWidth||0,m.naturalHeight||0)}});let s=!1,n=0,i=0,a=0,h=0;const l=new Map;let o=0,u=1;const c=(p,d)=>{const m=p.x-d.x,w=p.y-d.y;return Math.hypot(m,w)};t.addEventListener("pointerdown",p=>{const d=p.target;if(!d||d.tagName!=="IMG"||!ke||!ke.open)return;if(l.set(p.pointerId,{x:p.clientX,y:p.clientY}),l.size===2){const w=Array.from(l.values());o=c(w[0],w[1]),u=xe;return}const m=d.closest(".nimbi-image-preview__image-wrapper");m&&(xe<=1||(p.preventDefault(),s=!0,n=p.clientX,i=p.clientY,a=m.scrollLeft,h=m.scrollTop,d.setPointerCapture(p.pointerId),d.style.cursor="grabbing"))}),t.addEventListener("pointermove",p=>{if(l.has(p.pointerId)&&l.set(p.pointerId,{x:p.clientX,y:p.clientY}),l.size===2){p.preventDefault();const x=Array.from(l.values()),z=c(x[0],x[1]);if(o>0){const R=z/o;qe(u*R)}return}if(!s)return;p.preventDefault();const m=p.target.closest(".nimbi-image-preview__image-wrapper");if(!m)return;const w=p.clientX-n,y=p.clientY-i;m.scrollLeft=a-w,m.scrollTop=h-y});const f=()=>{s=!1,l.clear(),o=0};t.addEventListener("pointerup",f),t.addEventListener("pointercancel",f)}function Sa(t){const{contentWrap:e,navWrap:r,container:s,mountOverlay:n=null,t:i,contentBase:a,homePage:h,initialDocumentTitle:l,runHooks:o}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let u=null;const c=Ys(i,[{path:h,name:i("home"),isIndex:!0,children:[]}]);async function f(y,x){let z,R,_;try{({data:z,pagePath:R,anchor:_}=await ns(y,a))}catch(T){console.error("[nimbi-cms] fetchPageData failed",T),Fr(e,i,T);return}!_&&x&&(_=x);try{In(null)}catch(T){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",T)}e.innerHTML="";const{article:q,parsed:O,toc:Q,topH1:Y,h1Text:ne,slugKey:P}=await sa(i,z,R,_,a);ba(i,l,O,Q,q,R,_,Y,ne,P,z),r.innerHTML="",r.appendChild(Q),la(Q);try{await o("transformHtml",{article:q,parsed:O,toc:Q,pagePath:R,anchor:_,topH1:Y,h1Text:ne,slugKey:P,data:z})}catch(T){console.warn("[nimbi-cms] transformHtml hooks failed",T)}e.appendChild(q);try{xa(q,{t:i})}catch(T){console.warn("[nimbi-cms] attachImagePreview failed",T)}try{$t(s,100,!1),requestAnimationFrame(()=>$t(s,100,!1)),setTimeout(()=>$t(s,100,!1),250)}catch(T){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",T)}In(_),oa(q,Y,{mountOverlay:n,container:s,navWrap:r,t:i});try{await o("onPageLoad",{data:z,pagePath:R,anchor:_,article:q,toc:Q,topH1:Y,h1Text:ne,slugKey:P,contentWrap:e,navWrap:r})}catch(T){console.warn("[nimbi-cms] onPageLoad hooks failed",T)}u=R}async function p(){let y=new URLSearchParams(location.search).get("page")||h;const x=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await f(y,x)}catch(z){console.warn("[nimbi-cms] renderByQuery failed for",y,z),Fr(e,i,z)}}window.addEventListener("popstate",p);const d=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,m=()=>{try{const y=s||document.querySelector(".nimbi-cms");if(!y)return;const x={top:y.scrollTop||0,left:y.scrollLeft||0};sessionStorage.setItem(d(),JSON.stringify(x))}catch{}},w=()=>{try{const y=s||document.querySelector(".nimbi-cms");if(!y)return;const x=sessionStorage.getItem(d());if(!x)return;const z=JSON.parse(x);z&&typeof z.top=="number"&&y.scrollTo({top:z.top,left:z.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",y=>{if(y.persisted)try{w(),$t(s,100,!1)}catch(x){console.warn("[nimbi-cms] bfcache restore failed",x)}}),window.addEventListener("pagehide",()=>{try{m()}catch(y){console.warn("[nimbi-cms] save scroll position failed",y)}}),{renderByQuery:p,siteNav:c,getCurrentPagePath:()=>u}}function va(t){try{const e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e)return{};const r=new URLSearchParams(e.startsWith("?")?e.slice(1):e),s={},n=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(r.has("contentPath")&&(s.contentPath=r.get("contentPath")),r.has("searchIndex")){const i=n(r.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(r.has("searchIndexMode")){const i=r.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(r.has("defaultStyle")){const i=r.get("defaultStyle");(i==="light"||i==="dark")&&(s.defaultStyle=i)}if(r.has("bulmaCustomize")&&(s.bulmaCustomize=r.get("bulmaCustomize")),r.has("lang")&&(s.lang=r.get("lang")),r.has("l10nFile")){const i=r.get("l10nFile");s.l10nFile=i==="null"?null:i}if(r.has("cacheTtlMinutes")){const i=Number(r.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(r.has("cacheMaxEntries")){const i=Number(r.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(r.has("homePage")&&(s.homePage=r.get("homePage")),r.has("notFoundPage")&&(s.notFoundPage=r.get("notFoundPage")),r.has("availableLanguages")&&(s.availableLanguages=r.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),r.has("indexDepth")){const i=Number(r.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(r.has("noIndexing")){const a=(r.get("noIndexing")||"").split(",").map(h=>h.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function Ea(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function Gr(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let On="";async function Aa(t={}){if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const e=va();if(e&&(e.contentPath||e.homePage||e.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(k){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",k)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(k){console.warn("[nimbi-cms] logging ignore of URL overrides failed",k)}delete e.contentPath,delete e.homePage,delete e.notFoundPage}const r=Object.assign({},e,t),{el:s,contentPath:n="/content",crawlMaxQueue:i=1e3,searchIndex:a=!0,searchIndexMode:h="eager",indexDepth:l=1,noIndexing:o=void 0,defaultStyle:u="light",bulmaCustomize:c="none",lang:f=void 0,l10nFile:p=null,cacheTtlMinutes:d=5,cacheMaxEntries:m,markdownExtensions:w,availableLanguages:y,homePage:x="_home.md",notFoundPage:z="_404.md"}=r,{skipRootReadme:R=!1}=r;if(r.contentPath!=null&&!Ea(r.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(r.homePage!=null&&!Gr(r.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(r.notFoundPage!=null&&!Gr(r.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!s)throw new Error("el is required");let _=s;if(typeof s=="string"){if(_=document.querySelector(s),!_)throw new Error(`el selector "${s}" did not match any element`)}else if(!(s instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof n!="string"||!n.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(h!=null&&h!=="eager"&&h!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2&&l!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(u!=="light"&&u!=="dark")throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');if(c!=null&&typeof c!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(d!=null&&(typeof d!="number"||!Number.isFinite(d)||d<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(k=>!k||typeof k!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some(k=>typeof k!="string"||!k.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(o!=null&&(!Array.isArray(o)||o.some(k=>typeof k!="string"||!k.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(R!=null&&typeof R!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(x!=null&&(typeof x!="string"||!x.trim()||!/\.(md|html)$/.test(x)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(z!=null&&(typeof z!="string"||!z.trim()||!/\.(md|html)$/.test(z)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const q=!!a;try{sr(!!R)}catch(k){console.warn("[nimbi-cms] setSkipRootReadme failed",k)}try{_.classList.add("nimbi-mount"),_.style.position=_.style.position||"relative",_.style.overflow=_.style.overflow||"hidden"}catch(k){console.warn("[nimbi-cms] mount element setup failed",k)}const O=document.createElement("div");O.className="nimbi-cms";try{O.style.position=O.style.position||"relative",O.style.overflow=O.style.overflow||"auto";try{O.style.webkitOverflowScrolling||(O.style.webkitOverflowScrolling="touch")}catch(k){console.warn("[nimbi-cms] set container webkitOverflowScrolling failed",k)}O.style.width=O.style.width||"100%",O.style.height=O.style.height||"100%",O.style.boxSizing=O.style.boxSizing||"border-box"}catch(k){console.warn("[nimbi-cms] container style setup failed",k)}const Q=document.createElement("div");Q.className="columns";const Y=document.createElement("div");Y.className="column is-full-mobile is-3-tablet nimbi-nav-wrap",Y.setAttribute("role","navigation");try{const k=typeof st=="function"?st("navigation"):null;k&&Y.setAttribute("aria-label",k)}catch(k){console.warn("[nimbi-cms] set nav aria-label failed",k)}Q.appendChild(Y);const ne=document.createElement("div");ne.className="column nimbi-content",ne.setAttribute("role","main"),Q.appendChild(ne),O.appendChild(Q);const P=Y,T=ne;_.appendChild(O);let I=null;try{I=_.querySelector(".nimbi-overlay"),I||(I=document.createElement("div"),I.className="nimbi-overlay",_.appendChild(I))}catch(k){I=null,console.warn("[nimbi-cms] mount overlay setup failed",k)}const C=location.pathname||"/",v=C.endsWith("/")?C:C.substring(0,C.lastIndexOf("/")+1);try{On=document.title||""}catch(k){On="",console.warn("[nimbi-cms] read initial document title failed",k)}let b=n;(b==="."||b==="./")&&(b=""),b.startsWith("./")&&(b=b.slice(2)),b.startsWith("/")&&(b=b.slice(1)),b!==""&&!b.endsWith("/")&&(b=b+"/");const E=new URL(v+b,location.origin).toString();try{mn&&mn(x)}catch{}p&&await cn(p,v),y&&Array.isArray(y)&&ar(y),f&&un(f);const $=Sa({contentWrap:T,navWrap:P,container:O,mountOverlay:I,t:st,contentBase:E,homePage:x,initialDocumentTitle:On,runHooks:nn});if(typeof d=="number"&&d>=0&&typeof mr=="function"&&mr(d*60*1e3),typeof m=="number"&&m>=0&&typeof gr=="function"&&gr(m),w&&Array.isArray(w)&&w.length)try{w.forEach(k=>{typeof k=="object"&&Ks&&typeof Ln=="function"&&Ln(k)})}catch(k){console.warn("[nimbi-cms] applying markdownExtensions failed",k)}try{typeof i=="number"&&Promise.resolve().then(()=>Ht).then(({setDefaultCrawlMaxQueue:k})=>{try{k(i)}catch(G){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",G)}})}catch(k){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",k)}try{Bt(E)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{gn(z)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{Bt(E)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{gn(z)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{await be(x,E)}catch(k){throw x==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${x} not found at ${E}${x}: ${k.message}`)}Vn(u),await Yn(c,v);try{const k=document.createElement("header");k.className="nimbi-site-navbar",_.insertBefore(k,O);const G=await be("_navigation.md",E),he=await Qt(G.raw||""),{navbar:ce,linkEls:Me}=await ca(k,O,he.html||"",E,x,st,$.renderByQuery,q,h,l,o);try{await nn("onNavBuild",{navWrap:P,navbar:ce,linkEls:Me,contentBase:E})}catch(Ee){console.warn("[nimbi-cms] onNavBuild hooks failed",Ee)}try{const Ee=()=>{const Ce=k&&k.getBoundingClientRect&&Math.round(k.getBoundingClientRect().height)||k&&k.offsetHeight||0;if(Ce>0){try{_.style.setProperty("--nimbi-site-navbar-height",`${Ce}px`)}catch(ge){console.warn("[nimbi-cms] set CSS var failed",ge)}try{O.style.paddingTop=""}catch(ge){console.warn("[nimbi-cms] set container paddingTop failed",ge)}try{const ge=_&&_.getBoundingClientRect&&Math.round(_.getBoundingClientRect().height)||_&&_.clientHeight||0;if(ge>0){const Oe=Math.max(0,ge-Ce);try{O.style.boxSizing="border-box"}catch(et){console.warn("[nimbi-cms] set container boxSizing failed",et)}try{O.style.height=`${Oe}px`}catch(et){console.warn("[nimbi-cms] set container height failed",et)}try{O.style.setProperty("--nimbi-cms-height",`${Oe}px`)}catch(et){console.warn("[nimbi-cms] set --nimbi-cms-height failed",et)}}else{try{O.style.height="calc(100% - var(--nimbi-site-navbar-height))"}catch(Oe){console.warn("[nimbi-cms] set container height failed",Oe)}try{O.style.setProperty("--nimbi-cms-height","calc(100% - var(--nimbi-site-navbar-height))")}catch(Oe){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Oe)}}}catch(ge){console.warn("[nimbi-cms] compute container height failed",ge)}try{k.style.setProperty("--nimbi-site-navbar-height",`${Ce}px`)}catch(ge){console.warn("[nimbi-cms] set navbar CSS var failed",ge)}}};Ee();try{if(typeof ResizeObserver<"u"){const Ce=new ResizeObserver(()=>Ee());try{Ce.observe(k)}catch(ge){console.warn("[nimbi-cms] ResizeObserver.observe failed",ge)}}}catch(Ce){console.warn("[nimbi-cms] ResizeObserver setup failed",Ce)}}catch(Ee){console.warn("[nimbi-cms] compute navbar height failed",Ee)}}catch(k){console.warn("[nimbi-cms] build navigation failed",k)}await $.renderByQuery();try{Promise.resolve().then(()=>Ra).then(({getVersion:k})=>{typeof k=="function"&&k().then(G=>{try{const he=G||"0.0.0",ce=document.createElement("div");ce.className="nimbi-version-label",ce.textContent=`Ninbi CMS v. ${he}`,ce.style.position="absolute",ce.style.left="8px",ce.style.bottom="6px",ce.style.fontSize="11px",ce.style.opacity="0.6",ce.style.pointerEvents="none",ce.style.zIndex="9999",ce.style.userSelect="none";try{_.appendChild(ce)}catch(Me){console.warn("[nimbi-cms] append version label failed",Me)}}catch(he){console.warn("[nimbi-cms] building version label failed",he)}}).catch(G=>{console.warn("[nimbi-cms] getVersion() failed",G)})}).catch(k=>{console.warn("[nimbi-cms] import version module failed",k)})}catch(k){console.warn("[nimbi-cms] version label setup failed",k)}}async function Xr(){try{let t=null;try{t=await Promise.resolve().then(()=>li)}catch{try{t=await Promise.resolve().then(()=>li)}catch{t=null}}const e=t?.default?.version||t?.version;return typeof e=="string"&&e.trim()?e:"0.0.0"}catch{return"0.0.0"}}const Ra=Object.freeze(Object.defineProperty({__proto__:null,getVersion:Xr},Symbol.toStringTag,{value:"Module"})),Kr="nimbi-cms",Yr="0.1.0",Vr="module",Jr={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},ei={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},ti={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17","typedoc-plugin-markdown":"^4.10.0",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},ni="dist/nimbi-cms.cjs.js",ri="dist/nimbi-cms.es.js",ii="src/index.d.ts",si="dist/nimbi-cms.js",ai=["dist","src/index.d.ts"],li=Object.freeze(Object.defineProperty({__proto__:null,default:{name:Kr,version:Yr,private:!0,type:Vr,scripts:Jr,dependencies:ei,devDependencies:ti,main:ni,module:ri,types:ii,unpkg:si,files:ai},dependencies:ei,devDependencies:ti,files:ai,main:ni,module:ri,name:Kr,scripts:Jr,type:Vr,types:ii,unpkg:si,version:Yr},Symbol.toStringTag,{value:"Module"}));le.BAD_LANGUAGES=sn,le.SUPPORTED_HLJS_MAP=V,le._clearHooks=Ti,le.addHook=Lt,le.default=Aa,le.ensureBulma=Yn,le.getVersion=Xr,le.loadL10nFile=cn,le.loadSupportedLanguages=an,le.observeCodeBlocks=Kn,le.onNavBuild=Ai,le.onPageLoad=Ei,le.registerLanguage=rt,le.runHooks=nn,le.setHighlightTheme=$i,le.setLang=un,le.setStyle=Vn,le.setThemeVars=Ii,le.t=st,le.transformHtml=Ri,Object.defineProperties(le,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
