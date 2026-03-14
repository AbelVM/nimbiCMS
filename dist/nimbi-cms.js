(function(re,Be){typeof exports=="object"&&typeof module<"u"?Be(exports):typeof define=="function"&&define.amd?define(["exports"],Be):(re=typeof globalThis<"u"?globalThis:re||self,Be(re.nimbiCMS={}))})(this,(function(re){"use strict";const Be={onPageLoad:[],onNavBuild:[],transformHtml:[]};function St(t,e){if(!Object.prototype.hasOwnProperty.call(Be,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");Be[t].push(e)}function pi(t){St("onPageLoad",t)}function fi(t){St("onNavBuild",t)}function gi(t){St("transformHtml",t)}async function Kt(t,e){const r=Be[t]||[];for(const i of r)try{await i(e)}catch(n){console.warn("[nimbi-cms] runHooks callback failed",n)}}function mi(){Object.keys(Be).forEach(t=>{Be[t].length=0})}function On(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Yt,Nn;function wi(){if(Nn)return Yt;Nn=1;function t(p){return p instanceof Map?p.clear=p.delete=p.set=function(){throw new Error("map is read-only")}:p instanceof Set&&(p.add=p.clear=p.delete=function(){throw new Error("set is read-only")}),Object.freeze(p),Object.getOwnPropertyNames(p).forEach(k=>{const R=p[k],U=typeof R;(U==="object"||U==="function")&&!Object.isFrozen(R)&&t(R)}),p}class e{constructor(k){k.data===void 0&&(k.data={}),this.data=k.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function r(p){return p.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(p,...k){const R=Object.create(null);for(const U in p)R[U]=p[U];return k.forEach(function(U){for(const le in U)R[le]=U[le]}),R}const n="</span>",s=p=>!!p.scope,a=(p,{prefix:k})=>{if(p.startsWith("language:"))return p.replace("language:","language-");if(p.includes(".")){const R=p.split(".");return[`${k}${R.shift()}`,...R.map((U,le)=>`${U}${"_".repeat(le+1)}`)].join(" ")}return`${k}${p}`};class c{constructor(k,R){this.buffer="",this.classPrefix=R.classPrefix,k.walk(this)}addText(k){this.buffer+=r(k)}openNode(k){if(!s(k))return;const R=a(k.scope,{prefix:this.classPrefix});this.span(R)}closeNode(k){s(k)&&(this.buffer+=n)}value(){return this.buffer}span(k){this.buffer+=`<span class="${k}">`}}const l=(p={})=>{const k={children:[]};return Object.assign(k,p),k};class u{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(k){this.top.children.push(k)}openNode(k){const R=l({scope:k});this.add(R),this.stack.push(R)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(k){return this.constructor._walk(k,this.rootNode)}static _walk(k,R){return typeof R=="string"?k.addText(R):R.children&&(k.openNode(R),R.children.forEach(U=>this._walk(k,U)),k.closeNode(R)),k}static _collapse(k){typeof k!="string"&&k.children&&(k.children.every(R=>typeof R=="string")?k.children=[k.children.join("")]:k.children.forEach(R=>{u._collapse(R)}))}}class h extends u{constructor(k){super(),this.options=k}addText(k){k!==""&&this.add(k)}startScope(k){this.openNode(k)}endScope(){this.closeNode()}__addSublanguage(k,R){const U=k.root;R&&(U.scope=`language:${R}`),this.add(U)}toHTML(){return new c(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function o(p){return p?typeof p=="string"?p:p.source:null}function f(p){return b("(?=",p,")")}function d(p){return b("(?:",p,")*")}function m(p){return b("(?:",p,")?")}function b(...p){return p.map(R=>o(R)).join("")}function w(p){const k=p[p.length-1];return typeof k=="object"&&k.constructor===Object?(p.splice(p.length-1,1),k):{}}function x(...p){return"("+(w(p).capture?"":"?:")+p.map(U=>o(U)).join("|")+")"}function y(p){return new RegExp(p.toString()+"|").exec("").length-1}function z(p,k){const R=p&&p.exec(k);return R&&R.index===0}const P=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function X(p,{joinWith:k}){let R=0;return p.map(U=>{R+=1;const le=R;let oe=o(U),M="";for(;oe.length>0;){const C=P.exec(oe);if(!C){M+=oe;break}M+=oe.substring(0,C.index),oe=oe.substring(C.index+C[0].length),C[0][0]==="\\"&&C[1]?M+="\\"+String(Number(C[1])+le):(M+=C[0],C[0]==="("&&R++)}return M}).map(U=>`(${U})`).join(k)}const V=/\b\B/,se="[a-zA-Z]\\w*",ce="[a-zA-Z_]\\w*",ee="\\b\\d+(\\.\\d+)?",_="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",B="\\b(0b[01]+)",T="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",v=(p={})=>{const k=/^#![ ]*\//;return p.binary&&(p.begin=b(k,/.*\b/,p.binary,/\b.*/)),i({scope:"meta",begin:k,end:/$/,relevance:0,"on:begin":(R,U)=>{R.index!==0&&U.ignoreMatch()}},p)},E={begin:"\\\\[\\s\\S]",relevance:0},L={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[E]},g={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[E]},O={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},N=function(p,k,R={}){const U=i({scope:"comment",begin:p,end:k,contains:[]},R);U.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const le=x("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return U.contains.push({begin:b(/[ ]+/,"(",le,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),U},Z=N("//","$"),ve=N("/\\*","\\*/"),fe=N("#","$"),me={scope:"number",begin:ee,relevance:0},he={scope:"number",begin:_,relevance:0},Ee={scope:"number",begin:B,relevance:0},De={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[E,{begin:/\[/,end:/\]/,relevance:0,contains:[E]}]},ma={scope:"title",begin:se,relevance:0},wa={scope:"title",begin:ce,relevance:0},ba={begin:"\\.\\s*"+ce,relevance:0};var jt=Object.freeze({__proto__:null,APOS_STRING_MODE:L,BACKSLASH_ESCAPE:E,BINARY_NUMBER_MODE:Ee,BINARY_NUMBER_RE:B,COMMENT:N,C_BLOCK_COMMENT_MODE:ve,C_LINE_COMMENT_MODE:Z,C_NUMBER_MODE:he,C_NUMBER_RE:_,END_SAME_AS_BEGIN:function(p){return Object.assign(p,{"on:begin":(k,R)=>{R.data._beginMatch=k[1]},"on:end":(k,R)=>{R.data._beginMatch!==k[1]&&R.ignoreMatch()}})},HASH_COMMENT_MODE:fe,IDENT_RE:se,MATCH_NOTHING_RE:V,METHOD_GUARD:ba,NUMBER_MODE:me,NUMBER_RE:ee,PHRASAL_WORDS_MODE:O,QUOTE_STRING_MODE:g,REGEXP_MODE:De,RE_STARTERS_RE:T,SHEBANG:v,TITLE_MODE:ma,UNDERSCORE_IDENT_RE:ce,UNDERSCORE_TITLE_MODE:wa});function ka(p,k){p.input[p.index-1]==="."&&k.ignoreMatch()}function ya(p,k){p.className!==void 0&&(p.scope=p.className,delete p.className)}function xa(p,k){k&&p.beginKeywords&&(p.begin="\\b("+p.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",p.__beforeBegin=ka,p.keywords=p.keywords||p.beginKeywords,delete p.beginKeywords,p.relevance===void 0&&(p.relevance=0))}function Sa(p,k){Array.isArray(p.illegal)&&(p.illegal=x(...p.illegal))}function va(p,k){if(p.match){if(p.begin||p.end)throw new Error("begin & end are not supported with match");p.begin=p.match,delete p.match}}function Ea(p,k){p.relevance===void 0&&(p.relevance=1)}const Ra=(p,k)=>{if(!p.beforeMatch)return;if(p.starts)throw new Error("beforeMatch cannot be used with starts");const R=Object.assign({},p);Object.keys(p).forEach(U=>{delete p[U]}),p.keywords=R.keywords,p.begin=b(R.beforeMatch,f(R.begin)),p.starts={relevance:0,contains:[Object.assign(R,{endsParent:!0})]},p.relevance=0,delete R.beforeMatch},Aa=["of","and","for","in","not","or","if","then","parent","list","value"],Ta="keyword";function Yr(p,k,R=Ta){const U=Object.create(null);return typeof p=="string"?le(R,p.split(" ")):Array.isArray(p)?le(R,p):Object.keys(p).forEach(function(oe){Object.assign(U,Yr(p[oe],k,oe))}),U;function le(oe,M){k&&(M=M.map(C=>C.toLowerCase())),M.forEach(function(C){const D=C.split("|");U[D[0]]=[oe,_a(D[0],D[1])]})}}function _a(p,k){return k?Number(k):Ca(p)?0:1}function Ca(p){return Aa.includes(p.toLowerCase())}const Vr={},Ye=p=>{console.error(p)},Jr=(p,...k)=>{console.log(`WARN: ${p}`,...k)},it=(p,k)=>{Vr[`${p}/${k}`]||(console.log(`Deprecated as of ${p}. ${k}`),Vr[`${p}/${k}`]=!0)},Ft=new Error;function ei(p,k,{key:R}){let U=0;const le=p[R],oe={},M={};for(let C=1;C<=k.length;C++)M[C+U]=le[C],oe[C+U]=!0,U+=y(k[C-1]);p[R]=M,p[R]._emit=oe,p[R]._multi=!0}function La(p){if(Array.isArray(p.begin)){if(p.skip||p.excludeBegin||p.returnBegin)throw Ye("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Ft;if(typeof p.beginScope!="object"||p.beginScope===null)throw Ye("beginScope must be object"),Ft;ei(p,p.begin,{key:"beginScope"}),p.begin=X(p.begin,{joinWith:""})}}function Ma(p){if(Array.isArray(p.end)){if(p.skip||p.excludeEnd||p.returnEnd)throw Ye("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Ft;if(typeof p.endScope!="object"||p.endScope===null)throw Ye("endScope must be object"),Ft;ei(p,p.end,{key:"endScope"}),p.end=X(p.end,{joinWith:""})}}function Pa(p){p.scope&&typeof p.scope=="object"&&p.scope!==null&&(p.beginScope=p.scope,delete p.scope)}function $a(p){Pa(p),typeof p.beginScope=="string"&&(p.beginScope={_wrap:p.beginScope}),typeof p.endScope=="string"&&(p.endScope={_wrap:p.endScope}),La(p),Ma(p)}function Ia(p){function k(M,C){return new RegExp(o(M),"m"+(p.case_insensitive?"i":"")+(p.unicodeRegex?"u":"")+(C?"g":""))}class R{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(C,D){D.position=this.position++,this.matchIndexes[this.matchAt]=D,this.regexes.push([D,C]),this.matchAt+=y(C)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const C=this.regexes.map(D=>D[1]);this.matcherRe=k(X(C,{joinWith:"|"}),!0),this.lastIndex=0}exec(C){this.matcherRe.lastIndex=this.lastIndex;const D=this.matcherRe.exec(C);if(!D)return null;const ge=D.findIndex((xt,Cn)=>Cn>0&&xt!==void 0),ue=this.matchIndexes[ge];return D.splice(0,ge),Object.assign(D,ue)}}class U{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(C){if(this.multiRegexes[C])return this.multiRegexes[C];const D=new R;return this.rules.slice(C).forEach(([ge,ue])=>D.addRule(ge,ue)),D.compile(),this.multiRegexes[C]=D,D}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(C,D){this.rules.push([C,D]),D.type==="begin"&&this.count++}exec(C){const D=this.getMatcher(this.regexIndex);D.lastIndex=this.lastIndex;let ge=D.exec(C);if(this.resumingScanAtSamePosition()&&!(ge&&ge.index===this.lastIndex)){const ue=this.getMatcher(0);ue.lastIndex=this.lastIndex+1,ge=ue.exec(C)}return ge&&(this.regexIndex+=ge.position+1,this.regexIndex===this.count&&this.considerAll()),ge}}function le(M){const C=new U;return M.contains.forEach(D=>C.addRule(D.begin,{rule:D,type:"begin"})),M.terminatorEnd&&C.addRule(M.terminatorEnd,{type:"end"}),M.illegal&&C.addRule(M.illegal,{type:"illegal"}),C}function oe(M,C){const D=M;if(M.isCompiled)return D;[ya,va,$a,Ra].forEach(ue=>ue(M,C)),p.compilerExtensions.forEach(ue=>ue(M,C)),M.__beforeBegin=null,[xa,Sa,Ea].forEach(ue=>ue(M,C)),M.isCompiled=!0;let ge=null;return typeof M.keywords=="object"&&M.keywords.$pattern&&(M.keywords=Object.assign({},M.keywords),ge=M.keywords.$pattern,delete M.keywords.$pattern),ge=ge||/\w+/,M.keywords&&(M.keywords=Yr(M.keywords,p.case_insensitive)),D.keywordPatternRe=k(ge,!0),C&&(M.begin||(M.begin=/\B|\b/),D.beginRe=k(D.begin),!M.end&&!M.endsWithParent&&(M.end=/\B|\b/),M.end&&(D.endRe=k(D.end)),D.terminatorEnd=o(D.end)||"",M.endsWithParent&&C.terminatorEnd&&(D.terminatorEnd+=(M.end?"|":"")+C.terminatorEnd)),M.illegal&&(D.illegalRe=k(M.illegal)),M.contains||(M.contains=[]),M.contains=[].concat(...M.contains.map(function(ue){return za(ue==="self"?M:ue)})),M.contains.forEach(function(ue){oe(ue,D)}),M.starts&&oe(M.starts,C),D.matcher=le(D),D}if(p.compilerExtensions||(p.compilerExtensions=[]),p.contains&&p.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return p.classNameAliases=i(p.classNameAliases||{}),oe(p)}function ti(p){return p?p.endsWithParent||ti(p.starts):!1}function za(p){return p.variants&&!p.cachedVariants&&(p.cachedVariants=p.variants.map(function(k){return i(p,{variants:null},k)})),p.cachedVariants?p.cachedVariants:ti(p)?i(p,{starts:p.starts?i(p.starts):null}):Object.isFrozen(p)?i(p):p}var Ba="11.11.1";class Oa extends Error{constructor(k,R){super(k),this.name="HTMLInjectionError",this.html=R}}const _n=r,ni=i,ri=Symbol("nomatch"),Na=7,ii=function(p){const k=Object.create(null),R=Object.create(null),U=[];let le=!0;const oe="Could not find the language '{}', did you forget to load/include a language module?",M={disableAutodetect:!0,name:"Plain text",contains:[]};let C={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:h};function D(S){return C.noHighlightRe.test(S)}function ge(S){let I=S.className+" ";I+=S.parentNode?S.parentNode.className:"";const Q=C.languageDetectRe.exec(I);if(Q){const te=We(Q[1]);return te||(Jr(oe.replace("{}",Q[1])),Jr("Falling back to no-highlight mode for this block.",S)),te?Q[1]:"no-highlight"}return I.split(/\s+/).find(te=>D(te)||We(te))}function ue(S,I,Q){let te="",de="";typeof I=="object"?(te=S,Q=I.ignoreIllegals,de=I.language):(it("10.7.0","highlight(lang, code, ...args) has been deprecated."),it("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),de=S,te=I),Q===void 0&&(Q=!0);const Me={code:te,language:de};Zt("before:highlight",Me);const Ze=Me.result?Me.result:xt(Me.language,Me.code,Q);return Ze.code=Me.code,Zt("after:highlight",Ze),Ze}function xt(S,I,Q,te){const de=Object.create(null);function Me(A,$){return A.keywords[$]}function Ze(){if(!H.keywords){we.addText(ne);return}let A=0;H.keywordPatternRe.lastIndex=0;let $=H.keywordPatternRe.exec(ne),F="";for(;$;){F+=ne.substring(A,$.index);const J=ze.case_insensitive?$[0].toLowerCase():$[0],xe=Me(H,J);if(xe){const[qe,tl]=xe;if(we.addText(F),F="",de[J]=(de[J]||0)+1,de[J]<=Na&&(Xt+=tl),qe.startsWith("_"))F+=$[0];else{const nl=ze.classNameAliases[qe]||qe;Ie($[0],nl)}}else F+=$[0];A=H.keywordPatternRe.lastIndex,$=H.keywordPatternRe.exec(ne)}F+=ne.substring(A),we.addText(F)}function Qt(){if(ne==="")return;let A=null;if(typeof H.subLanguage=="string"){if(!k[H.subLanguage]){we.addText(ne);return}A=xt(H.subLanguage,ne,!0,di[H.subLanguage]),di[H.subLanguage]=A._top}else A=Ln(ne,H.subLanguage.length?H.subLanguage:null);H.relevance>0&&(Xt+=A.relevance),we.__addSublanguage(A._emitter,A.language)}function Te(){H.subLanguage!=null?Qt():Ze(),ne=""}function Ie(A,$){A!==""&&(we.startScope($),we.addText(A),we.endScope())}function oi(A,$){let F=1;const J=$.length-1;for(;F<=J;){if(!A._emit[F]){F++;continue}const xe=ze.classNameAliases[A[F]]||A[F],qe=$[F];xe?Ie(qe,xe):(ne=qe,Ze(),ne=""),F++}}function ci(A,$){return A.scope&&typeof A.scope=="string"&&we.openNode(ze.classNameAliases[A.scope]||A.scope),A.beginScope&&(A.beginScope._wrap?(Ie(ne,ze.classNameAliases[A.beginScope._wrap]||A.beginScope._wrap),ne=""):A.beginScope._multi&&(oi(A.beginScope,$),ne="")),H=Object.create(A,{parent:{value:H}}),H}function ui(A,$,F){let J=z(A.endRe,F);if(J){if(A["on:end"]){const xe=new e(A);A["on:end"]($,xe),xe.isMatchIgnored&&(J=!1)}if(J){for(;A.endsParent&&A.parent;)A=A.parent;return A}}if(A.endsWithParent)return ui(A.parent,$,F)}function Ka(A){return H.matcher.regexIndex===0?(ne+=A[0],1):(In=!0,0)}function Ya(A){const $=A[0],F=A.rule,J=new e(F),xe=[F.__beforeBegin,F["on:begin"]];for(const qe of xe)if(qe&&(qe(A,J),J.isMatchIgnored))return Ka($);return F.skip?ne+=$:(F.excludeBegin&&(ne+=$),Te(),!F.returnBegin&&!F.excludeBegin&&(ne=$)),ci(F,A),F.returnBegin?0:$.length}function Va(A){const $=A[0],F=I.substring(A.index),J=ui(H,A,F);if(!J)return ri;const xe=H;H.endScope&&H.endScope._wrap?(Te(),Ie($,H.endScope._wrap)):H.endScope&&H.endScope._multi?(Te(),oi(H.endScope,A)):xe.skip?ne+=$:(xe.returnEnd||xe.excludeEnd||(ne+=$),Te(),xe.excludeEnd&&(ne=$));do H.scope&&we.closeNode(),!H.skip&&!H.subLanguage&&(Xt+=H.relevance),H=H.parent;while(H!==J.parent);return J.starts&&ci(J.starts,A),xe.returnEnd?0:$.length}function Ja(){const A=[];for(let $=H;$!==ze;$=$.parent)$.scope&&A.unshift($.scope);A.forEach($=>we.openNode($))}let Gt={};function hi(A,$){const F=$&&$[0];if(ne+=A,F==null)return Te(),0;if(Gt.type==="begin"&&$.type==="end"&&Gt.index===$.index&&F===""){if(ne+=I.slice($.index,$.index+1),!le){const J=new Error(`0 width match regex (${S})`);throw J.languageName=S,J.badRule=Gt.rule,J}return 1}if(Gt=$,$.type==="begin")return Ya($);if($.type==="illegal"&&!Q){const J=new Error('Illegal lexeme "'+F+'" for mode "'+(H.scope||"<unnamed>")+'"');throw J.mode=H,J}else if($.type==="end"){const J=Va($);if(J!==ri)return J}if($.type==="illegal"&&F==="")return ne+=`
`,1;if($n>1e5&&$n>$.index*3)throw new Error("potential infinite loop, way more iterations than matches");return ne+=F,F.length}const ze=We(S);if(!ze)throw Ye(oe.replace("{}",S)),new Error('Unknown language: "'+S+'"');const el=Ia(ze);let Pn="",H=te||el;const di={},we=new C.__emitter(C);Ja();let ne="",Xt=0,Ve=0,$n=0,In=!1;try{if(ze.__emitTokens)ze.__emitTokens(I,we);else{for(H.matcher.considerAll();;){$n++,In?In=!1:H.matcher.considerAll(),H.matcher.lastIndex=Ve;const A=H.matcher.exec(I);if(!A)break;const $=I.substring(Ve,A.index),F=hi($,A);Ve=A.index+F}hi(I.substring(Ve))}return we.finalize(),Pn=we.toHTML(),{language:S,value:Pn,relevance:Xt,illegal:!1,_emitter:we,_top:H}}catch(A){if(A.message&&A.message.includes("Illegal"))return{language:S,value:_n(I),illegal:!0,relevance:0,_illegalBy:{message:A.message,index:Ve,context:I.slice(Ve-100,Ve+100),mode:A.mode,resultSoFar:Pn},_emitter:we};if(le)return{language:S,value:_n(I),illegal:!1,relevance:0,errorRaised:A,_emitter:we,_top:H};throw A}}function Cn(S){const I={value:_n(S),illegal:!1,relevance:0,_top:M,_emitter:new C.__emitter(C)};return I._emitter.addText(S),I}function Ln(S,I){I=I||C.languages||Object.keys(k);const Q=Cn(S),te=I.filter(We).filter(li).map(Te=>xt(Te,S,!1));te.unshift(Q);const de=te.sort((Te,Ie)=>{if(Te.relevance!==Ie.relevance)return Ie.relevance-Te.relevance;if(Te.language&&Ie.language){if(We(Te.language).supersetOf===Ie.language)return 1;if(We(Ie.language).supersetOf===Te.language)return-1}return 0}),[Me,Ze]=de,Qt=Me;return Qt.secondBest=Ze,Qt}function Da(S,I,Q){const te=I&&R[I]||Q;S.classList.add("hljs"),S.classList.add(`language-${te}`)}function Mn(S){let I=null;const Q=ge(S);if(D(Q))return;if(Zt("before:highlightElement",{el:S,language:Q}),S.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",S);return}if(S.children.length>0&&(C.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(S)),C.throwUnescapedHTML))throw new Oa("One of your code blocks includes unescaped HTML.",S.innerHTML);I=S;const te=I.textContent,de=Q?ue(te,{language:Q,ignoreIllegals:!0}):Ln(te);S.innerHTML=de.value,S.dataset.highlighted="yes",Da(S,Q,de.language),S.result={language:de.language,re:de.relevance,relevance:de.relevance},de.secondBest&&(S.secondBest={language:de.secondBest.language,relevance:de.secondBest.relevance}),Zt("after:highlightElement",{el:S,result:de,text:te})}function qa(S){C=ni(C,S)}const Ua=()=>{Wt(),it("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function Ha(){Wt(),it("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let si=!1;function Wt(){function S(){Wt()}if(document.readyState==="loading"){si||window.addEventListener("DOMContentLoaded",S,!1),si=!0;return}document.querySelectorAll(C.cssSelector).forEach(Mn)}function ja(S,I){let Q=null;try{Q=I(p)}catch(te){if(Ye("Language definition for '{}' could not be registered.".replace("{}",S)),le)Ye(te);else throw te;Q=M}Q.name||(Q.name=S),k[S]=Q,Q.rawDefinition=I.bind(null,p),Q.aliases&&ai(Q.aliases,{languageName:S})}function Fa(S){delete k[S];for(const I of Object.keys(R))R[I]===S&&delete R[I]}function Wa(){return Object.keys(k)}function We(S){return S=(S||"").toLowerCase(),k[S]||k[R[S]]}function ai(S,{languageName:I}){typeof S=="string"&&(S=[S]),S.forEach(Q=>{R[Q.toLowerCase()]=I})}function li(S){const I=We(S);return I&&!I.disableAutodetect}function Za(S){S["before:highlightBlock"]&&!S["before:highlightElement"]&&(S["before:highlightElement"]=I=>{S["before:highlightBlock"](Object.assign({block:I.el},I))}),S["after:highlightBlock"]&&!S["after:highlightElement"]&&(S["after:highlightElement"]=I=>{S["after:highlightBlock"](Object.assign({block:I.el},I))})}function Qa(S){Za(S),U.push(S)}function Ga(S){const I=U.indexOf(S);I!==-1&&U.splice(I,1)}function Zt(S,I){const Q=S;U.forEach(function(te){te[Q]&&te[Q](I)})}function Xa(S){return it("10.7.0","highlightBlock will be removed entirely in v12.0"),it("10.7.0","Please use highlightElement now."),Mn(S)}Object.assign(p,{highlight:ue,highlightAuto:Ln,highlightAll:Wt,highlightElement:Mn,highlightBlock:Xa,configure:qa,initHighlighting:Ua,initHighlightingOnLoad:Ha,registerLanguage:ja,unregisterLanguage:Fa,listLanguages:Wa,getLanguage:We,registerAliases:ai,autoDetection:li,inherit:ni,addPlugin:Qa,removePlugin:Ga}),p.debugMode=function(){le=!1},p.safeMode=function(){le=!0},p.versionString=Ba,p.regex={concat:b,lookahead:f,either:x,optional:m,anyNumberOfTimes:d};for(const S in jt)typeof jt[S]=="object"&&t(jt[S]);return Object.assign(p,jt),p},st=ii({});return st.newInstance=()=>ii({}),Yt=st,st.HighlightJS=st,st.default=st,Yt}var bi=wi();const ie=On(bi),Y=new Map,ki="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Oe={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"},Vt=new Set(["magic","undefined"]);let Je=null;const Dn=new Map,yi=300*1e3;async function Jt(t=ki){if(t)return Je||(Je=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const i=(await e.text()).split(/\r?\n/);let n=-1;for(let u=0;u<i.length;u++)if(/\|\s*Language\s*\|/i.test(i[u])){n=u;break}if(n===-1)return;const s=i[n].replace(/^\||\|$/g,"").split("|").map(u=>u.trim().toLowerCase());let a=s.findIndex(u=>/alias|aliases|equivalent|alt|alternates?/i.test(u));a===-1&&(a=1);let c=s.findIndex(u=>/file|filename|module|module name|module-name|short|slug/i.test(u));if(c===-1){const u=s.findIndex(h=>/language/i.test(h));c=u!==-1?u:0}let l=[];for(let u=n+1;u<i.length;u++){const h=i[u].trim();if(!h||!h.startsWith("|"))break;const o=h.replace(/^\||\|$/g,"").split("|").map(w=>w.trim());if(o.every(w=>/^-+$/.test(w)))continue;const f=o;if(!f.length)continue;const m=(f[c]||f[0]||"").toString().trim().toLowerCase();if(!m||/^-+$/.test(m))continue;Y.set(m,m);const b=f[a]||"";if(b){const w=String(b).split(",").map(x=>x.replace(/`/g,"").trim()).filter(Boolean);if(w.length){const y=w[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(Y.set(y,y),l.push(y))}}}try{const u=[];for(const h of l){const o=String(h||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");o&&/[a-z0-9]/i.test(o)?u.push(o):Y.delete(h)}l=u}catch(u){console.warn("[codeblocksManager] cleanup aliases failed",u)}try{let u=0;for(const h of Array.from(Y.keys())){if(!h||/^-+$/.test(h)||!/[a-z0-9]/i.test(h)){Y.delete(h),u++;continue}if(/^[:]+/.test(h)){const o=h.replace(/^[:]+/,"");if(o&&/[a-z0-9]/i.test(o)){const f=Y.get(h);Y.delete(h),Y.set(o,f)}else Y.delete(h),u++}}for(const[h,o]of Array.from(Y.entries()))(!o||/^-+$/.test(o)||!/[a-z0-9]/i.test(o))&&(Y.delete(h),u++);try{const h=":---------------------";Y.has(h)&&(Y.delete(h),u++)}catch(h){console.warn("[codeblocksManager] remove sep key failed",h)}try{const h=Array.from(Y.keys()).sort()}catch(h){console.warn("[codeblocksManager] compute supported keys failed",h)}}catch(u){console.warn("[codeblocksManager] ignored error",u)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),Je)}const en=new Set;async function et(t,e){if(Je||(async()=>{try{await Jt()}catch(n){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",n)}})(),t=t==null?"":String(t),t=t.trim(),!t)return!1;const r=t.toLowerCase();if(Vt.has(r))return!1;if(Y.size&&!Y.has(r)){const n=Oe;if(!n[r]&&!n[t])return!1}if(en.has(t))return!0;const i=Oe;try{const n=(e||t||"").toString().replace(/\.js$/i,"").trim(),s=Array.from(new Set([n,t,i[n],i[t]].filter(Boolean))).map(l=>String(l).toLowerCase()).filter(l=>l&&l!=="undefined");let a=null,c=null;for(const l of s)try{const u=Date.now(),h=Dn.get(l);if(h){if(h.ok===!1&&u-(h.ts||0)<yi)a=null;else if(h.module)a=h.module;else if(h.promise)try{a=await h.promise}catch{a=null}}else{const o={promise:null,module:null,ok:null,ts:0};Dn.set(l,o),o.promise=(async()=>{try{try{return await import(`highlight.js/lib/languages/${l}.js`)}catch{try{const d=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${l}.js`;return await new Function("u","return import(u)")(d)}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${l}.js`;return await new Function("u","return import(u)")(m)}catch{return null}}}}catch{return null}})();try{a=await o.promise,o.module=a,o.ok=!!a,o.ts=Date.now()}catch{o.module=null,o.ok=!1,o.ts=Date.now(),a=null}}if(a){const o=a.default||a;try{const f=Y.size&&Y.get(t)||l||t;return ie.registerLanguage(f,o),en.add(f),f!==t&&(ie.registerLanguage(t,o),en.add(t)),!0}catch(f){c=f}}}catch(u){c=u}if(c)throw c;return!1}catch{return!1}}let vt=null;function qn(t=document){Je||(async()=>{try{await Jt()}catch(s){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",s)}})();const e=Oe,i=vt||(typeof IntersectionObserver>"u"?null:(vt=new IntersectionObserver((s,a)=>{s.forEach(c=>{if(!c.isIntersecting)return;const l=c.target;try{a.unobserve(l)}catch(u){console.warn("[codeblocksManager] observer unobserve failed",u)}(async()=>{try{const u=l.getAttribute&&l.getAttribute("class")||l.className||"",h=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(h&&h[1]){const o=(h[1]||"").toLowerCase(),f=e[o]||o,d=Y.size&&(Y.get(f)||Y.get(String(f).toLowerCase()))||f;try{await et(d)}catch(m){console.warn("[codeblocksManager] registerLanguage failed",m)}try{ie.highlightElement(l)}catch(m){console.warn("[codeblocksManager] hljs.highlightElement failed",m)}}else try{const o=l.textContent||"";try{if(ie&&typeof ie.getLanguage=="function"&&ie.getLanguage("plaintext")){const f=ie.highlight(o,{language:"plaintext"});f&&f.value&&(l.innerHTML=f.value)}}catch{try{ie.highlightElement(l)}catch(d){console.warn("[codeblocksManager] fallback highlightElement failed",d)}}}catch(o){console.warn("[codeblocksManager] auto-detect plaintext failed",o)}}catch(u){console.warn("[codeblocksManager] observer entry processing failed",u)}})()})},{root:null,rootMargin:"300px",threshold:.1}),vt)),n=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!i){n.forEach(async s=>{try{const a=s.getAttribute&&s.getAttribute("class")||s.className||"",c=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const l=(c[1]||"").toLowerCase(),u=e[l]||l,h=Y.size&&(Y.get(u)||Y.get(String(u).toLowerCase()))||u;try{await et(h)}catch(o){console.warn("[codeblocksManager] registerLanguage failed (no observer)",o)}}try{ie.highlightElement(s)}catch(l){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",l)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}n.forEach(s=>{try{i.observe(s)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function xi(t,{useCdn:e=!0}={}){const r=document.querySelector("link[data-hl-theme]");r&&r.remove();let i=t||"monokai";if(i==="monokai")return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");return}const n=`https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${i}.css`,s=document.createElement("link");s.rel="stylesheet",s.href=n,s.setAttribute("data-hl-theme",i),document.head.appendChild(s)}let tn="light";function Si(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const r=document.createElement("link");r.rel="stylesheet",r.href=t,Object.entries(e).forEach(([i,n])=>r.setAttribute(i,n)),document.head.appendChild(r)}async function Un(t="none",e="/"){if(!t||t==="none")return;const r=[e+"bulma.css","/bulma.css"],i=Array.from(new Set(r));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const n of i)try{const s=await fetch(n,{method:"GET"});if(s.ok){const a=await s.text(),c=document.createElement("style");c.setAttribute("data-bulma-override",n),c.appendChild(document.createTextNode(`
/* bulma override: ${n} */
`+a)),document.head.appendChild(c);return}}catch(s){console.warn("[bulmaManager] fetch local bulma candidate failed",s)}return}try{const n=String(t).trim();if(!n)return;const s=`https://unpkg.com/bulmaswatch/${encodeURIComponent(n)}/bulmaswatch.min.css`;Si(s,{"data-bulmaswatch-theme":n})}catch(n){console.warn("[bulmaManager] ensureBulma failed",n)}}function Hn(t){tn=t==="dark"?"dark":"light",document.documentElement.setAttribute("data-theme",tn),tn==="dark"?document.body.classList.add("is-dark"):document.body.classList.remove("is-dark")}function vi(t){const e=document.documentElement;for(const[r,i]of Object.entries(t||{}))try{e.style.setProperty(`--${r}`,i)}catch(n){console.warn("[bulmaManager] setThemeVars failed for",r,n)}}const jn={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},tt=JSON.parse(JSON.stringify(jn));let Et="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";Et=String(t).split("-")[0].toLowerCase()}jn[Et]||(Et="en");let Ue=Et;function nt(t,e={}){const r=tt[Ue]||tt.en;let i=r&&r[t]?r[t]:tt.en[t]||"";for(const n of Object.keys(e))i=i.replace(new RegExp(`{${n}}`,"g"),String(e[n]));return i}async function nn(t,e){if(!t)return;let r=t;try{/^https?:\/\//.test(t)||(r=new URL(t,location.origin+e).toString());const i=await fetch(r);if(!i.ok)return;const n=await i.json();for(const s of Object.keys(n||{}))tt[s]=Object.assign({},tt[s]||{},n[s])}catch{}}function rn(t){const e=String(t).split("-")[0].toLowerCase();Ue=tt[e]?e:"en"}const Ei=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Ue},loadL10nFile:nn,setLang:rn,t:nt},Symbol.toStringTag,{value:"Module"})),Ri=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
      const { id, contentBase } = msg
      try {
        const res = await buildSearchIndex(contentBase)
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
`;function Fn(t,e="worker"){let r=null;function i(){if(!r)try{const c=t();r=c||null,c&&c.addEventListener("error",()=>{try{r===c&&(r=null,c.terminate&&c.terminate())}catch(l){console.warn("["+e+"] worker termination failed",l)}})}catch(c){r=null,console.warn("["+e+"] worker init failed",c)}return r}function n(){try{r&&(r.terminate&&r.terminate(),r=null)}catch(c){console.warn("["+e+"] worker termination failed",c)}}function s(c,l=1e3){return new Promise((u,h)=>{const o=i();if(!o)return h(new Error("worker unavailable"));const f=String(Math.random());c.id=f;let d=null;const m=()=>{d&&clearTimeout(d),o.removeEventListener("message",b),o.removeEventListener("error",w)},b=x=>{const y=x.data||{};y.id===f&&(m(),y.error?h(new Error(y.error)):u(y.result))},w=x=>{m(),console.warn("["+e+"] worker error event",x);try{r===o&&(r=null,o.terminate&&o.terminate())}catch(y){console.warn("["+e+"] worker termination failed",y)}h(new Error(x&&x.message||"worker error"))};d=setTimeout(()=>{m(),console.warn("["+e+"] worker timed out");try{r===o&&(r=null,o.terminate&&o.terminate())}catch(x){console.warn("["+e+"] worker termination on timeout failed",x)}h(new Error("worker timeout"))},l),o.addEventListener("message",b),o.addEventListener("error",w);try{o.postMessage(c)}catch(x){m(),h(x)}})}return{get:i,send:s,terminate:n}}function Ai(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),r=URL.createObjectURL(e);return new Worker(r,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const Pe=new Set;function sn(t){Ti(),Pe.clear();for(const e of Ae)e&&Pe.add(e);Wn(W),Wn(j),sn._refreshed=!0}function Wn(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&Pe.add(e)}function Zn(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(r,i){return i&&Pe.add(i),e.call(this,r,i)}}let Qn=!1;function Ti(){Qn||(Zn(W),Zn(j),Qn=!0)}function Gn(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function pe(t){return String(t||"").replace(/^[.\/]+/,"")}function at(t){return String(t||"").replace(/\/+$/,"")}function Rt(t){return at(t)+"/"}function _i(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const r=document.createElement("link");r.rel="preload",r.as="image",r.href=t,document.head.appendChild(r)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function At(t,e=0,r=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const i=Array.from(t.querySelectorAll("img"));if(!i.length)return;const n=t,s=n&&n.getBoundingClientRect?n.getBoundingClientRect():null,a=0,c=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,l=s?Math.max(a,s.top):a,h=(s?Math.min(c,s.bottom):c)+Number(e||0);let o=0;n&&(o=n.clientHeight||(s?s.height:0)),o||(o=c-a);let f=.6;try{const w=n&&window.getComputedStyle?window.getComputedStyle(n):null,x=w&&w.getPropertyValue("--nimbi-image-max-height-ratio"),y=x?parseFloat(x):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(f=y)}catch(w){console.warn("[helpers] read CSS ratio failed",w)}const d=Math.max(200,Math.floor(o*f));let m=!1,b=null;if(i.forEach(w=>{try{const x=w.getAttribute?w.getAttribute("loading"):void 0;x!=="eager"&&w.setAttribute&&w.setAttribute("loading","lazy");const y=w.getBoundingClientRect?w.getBoundingClientRect():null,z=w.src||w.getAttribute&&w.getAttribute("src"),P=y&&y.height>1?y.height:d,X=y?y.top:0,V=X+P,se=!!(y&&P>0&&X<=h&&V>=l);se&&(w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),_i(z),m=!0),!b&&y&&y.top<=h&&(b={img:w,src:z,rect:y,beforeLoading:x}),r&&console.log("[helpers] setEagerForAboveFoldImages:",{src:z,rect:y,marginPx:e,visibleTop:l,visibleBottom:h,beforeLoading:x,isAboveFold:se,effectiveHeight:P,maxImageHeight:d})}catch(x){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",x)}}),!m&&b){const{img:w,src:x,rect:y,beforeLoading:z}=b;try{w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),r&&console.log("[helpers] setEagerForAboveFoldImages (fallback first visible):",{src:x,rect:y,marginPx:e,visibleTop:l,visibleBottom:h,beforeLoading:z,fallback:!0})}catch(P){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",P)}}}catch(i){console.warn("[helpers] setEagerForAboveFoldImages failed",i)}}function Tt(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(r=>{console.warn("[helpers] safe swallowed error",r)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Tt)}catch(t){console.warn("[helpers] global attach failed",t)}const W=new Map;let Re=[];function Xn(t){Re=Array.isArray(t)?t.slice():[]}function Ci(){return Re}const Kn=Fn(()=>Ai(Ri),"slugManager");function an(){return Kn.get()}function Yn(t){return Kn.send(t)}async function Li(t){if(!an())return $t(t);try{return await Yn({type:"buildSearchIndex",contentBase:t})}catch(r){try{return await $t(t)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),r}}}async function Mi(t,e,r){return an()?Yn({type:"crawlForSlug",slug:t,base:e,maxQueue:r}):cn(t,e,r)}function He(t,e){if(t)if(Re&&Re.length){const i=e.split("/")[0],n=Re.includes(i);let s=W.get(t);(!s||typeof s=="string")&&(s={default:typeof s=="string"?s:void 0,langs:{}}),n?s.langs[i]=e:s.default=e,W.set(t,s)}else W.set(t,e)}const _t=new Set;function Pi(t){typeof t=="function"&&_t.add(t)}function $i(t){typeof t=="function"&&_t.delete(t)}const j=new Map;let ln={},Ae=[],Ct="_404.md";function on(t){t!=null&&(Ct=String(t||""))}function Ii(t){ln=t||{}}const lt=new Map,Lt=new Set;function zi(){lt.clear(),Lt.clear()}function Bi(t){if(!t||t.length===0)return"";let e=t[0];for(let i=1;i<t.length;i++){const n=t[i];let s=0;const a=Math.min(e.length,n.length);for(;s<a&&e[s]===n[s];)s++;e=e.slice(0,s)}const r=e.lastIndexOf("/");return r===-1?e:e.slice(0,r+1)}function Mt(t){W.clear(),j.clear(),Ae=[],Re=Re||[];const e=Object.keys(ln||{});if(!e.length)return;let r="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?r=new URL(String(t)).pathname:r=String(t||"")}catch(i){r=String(t||""),console.warn("[slugManager] parse contentBase failed",i)}r=Rt(r)}}catch(i){r="",console.warn("[slugManager] setContentBase prefix derivation failed",i)}r||(r=Bi(e));for(const i of e){let n=i;r&&i.startsWith(r)?n=pe(i.slice(r.length)):n=pe(i),Ae.push(n);try{sn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const s=ln[i];if(typeof s=="string"){const a=(s||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const c=ae(a[1].trim());if(c)try{if(Re&&Re.length){const u=n.split("/")[0],h=Re.includes(u);let o=W.get(c);(!o||typeof o=="string")&&(o={default:typeof o=="string"?o:void 0,langs:{}}),h?o.langs[u]=n:o.default=n,W.set(c,o)}else W.set(c,n);j.set(n,c)}catch(l){console.warn("[slugManager] set slug mapping failed",l)}}}}}try{Mt()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function ae(t){let e=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return e=e.replace(/(?:-?)(?:md|html)$/,""),e}function ot(t){if(!t||!W.has(t))return null;const e=W.get(t);if(!e)return null;if(typeof e=="string")return e;if(Re&&Re.length&&Ue&&e.langs&&e.langs[Ue])return e.langs[Ue];if(e.default)return e.default;if(e.langs){const r=Object.keys(e.langs);if(r.length)return e.langs[r[0]]}return null}const ct=new Map;function Oi(){ct.clear()}let be=async function(t,e){if(!t)throw new Error("path required");try{const s=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(s&&W.has(s)){const a=ot(s)||W.get(s);a&&a!==t&&(t=a)}}catch(s){console.warn("[slugManager] slug mapping normalization failed",s)}const r=e==null?"":at(String(e));let i="";try{r?/^[a-z][a-z0-9+.-]*:/i.test(r)?i=r.replace(/\/$/,"")+"/"+t.replace(/^\//,""):i=(r.startsWith("/")?"":"/")+r.replace(/\/$/,"")+"/"+t.replace(/^\//,""):i="/"+t.replace(/^\//,"")}catch{i="/"+t.replace(/^\//,"")}if(ct.has(i))return ct.get(i);const n=(async()=>{const s=await fetch(i);if(!s||typeof s.ok!="boolean"||!s.ok){if(s&&s.status===404)try{const o=`${r}/${Ct}`,f=await globalThis.fetch(o);if(f&&typeof f.ok=="boolean"&&f.ok)return{raw:await f.text(),status:404}}catch(o){console.warn("[slugManager] fetching fallback 404 failed",o)}let h="";try{s&&typeof s.clone=="function"?h=await s.clone().text():s&&typeof s.text=="function"?h=await s.text():h=""}catch(o){h="",console.warn("[slugManager] reading error body failed",o)}throw console.error("fetchMarkdown failed:",{url:i,status:s?s.status:void 0,statusText:s?s.statusText:void 0,body:h.slice(0,200)}),new Error("failed to fetch md")}const a=await s.text(),c=a.trim().slice(0,16).toLowerCase(),l=c.startsWith("<!doctype")||c.startsWith("<html"),u=l||String(t||"").toLowerCase().endsWith(".html");if(l&&String(t||"").toLowerCase().endsWith(".md")){try{const h=`${r}/${Ct}`,o=await globalThis.fetch(h);if(o.ok)return{raw:await o.text(),status:404}}catch(h){console.warn("[slugManager] fetching fallback 404 failed",h)}throw console.error("fetchMarkdown: server returned HTML for .md request",i),new Error("failed to fetch md")}return u?{raw:a,isHtml:!0}:{raw:a}})();return ct.set(i,n),n};function Ni(t){typeof t=="function"&&(be=t)}const Pt=new Map;let Qe=[],ut=null;async function $t(t){if(Qe&&Qe.length)return Qe;if(ut)return ut;ut=(async()=>{let e=[];if(Ae&&Ae.length&&(e=Array.from(Ae)),!e.length)for(const n of W.values())n&&e.push(n);try{const n=await tr(t);n&&n.length&&(e=e.concat(n))}catch(n){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",n)}try{const n=new Set(e),s=[...e];for(n.size;s.length&&n.size<=ht;){const a=s.shift();try{const c=await be(a,t);if(c&&c.raw){let l=c.raw;const u=[],h=/\[[^\]]+\]\(([^)]+)\)/g;let o;for(;o=h.exec(l);)u.push(o[1]);const f=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;o=f.exec(l);)u.push(o[1]);for(let d of u)/^[a-z][a-z0-9+.-]*:/i.test(d)||(d=pe(d),/\.(md|html?)(?:$|[?#])/i.test(d)&&(d=d.split(/[?#]/)[0],n.has(d)||(n.add(d),s.push(d),e.push(d))))}}catch(c){console.warn("[slugManager] discovery fetch failed for",a,c)}}}catch(n){console.warn("[slugManager] discovery loop failed",n)}const r=new Set;e=e.filter(n=>!n||r.has(n)?!1:(r.add(n),!0));const i=[];for(const n of e)if(/\.(?:md|html?)(?:$|[?#])/i.test(n))try{const s=await be(n,t);if(s&&s.raw){let a="",c="";if(s.isHtml)try{const h=new DOMParser().parseFromString(s.raw,"text/html"),o=h.querySelector("title")||h.querySelector("h1");o&&o.textContent&&(a=o.textContent.trim());const f=h.querySelector("p");f&&f.textContent&&(c=f.textContent.trim())}catch(u){console.warn("[slugManager] parsing HTML for index failed",u)}else{const u=s.raw,h=u.match(/^#\s+(.+)$/m);a=h?h[1].trim():"";const o=u.split(/\r?\n\s*\r?\n/);if(o.length>1)for(let f=1;f<o.length;f++){const d=o[f].trim();if(d&&!/^#/.test(d)){c=d.replace(/\r?\n/g," ");break}}}let l="";try{j.has(n)&&(l=j.get(n))}catch(u){console.warn("[slugManager] mdToSlug access failed",u)}l||(l=ae(a||n)),i.push({slug:l,title:a,excerpt:c,path:n})}}catch(s){console.warn("[slugManager] buildSearchIndex: entry fetch failed",s)}return Qe=i,Qe})();try{await ut}catch(e){console.warn("[slugManager] awaiting _indexPromise failed",e)}return ut=null,Qe}const Vn=1e3;let ht=Vn;function Di(t){typeof t=="number"&&t>=0&&(ht=t)}const Jn=new DOMParser,er="a[href]";let cn=async function(t,e,r=ht){if(Pt.has(t))return Pt.get(t);let i=null;const n=new Set,s=[""];for(;s.length&&!i&&!(s.length>r);){const a=s.shift();if(n.has(a))continue;n.add(a);let c=e;c.endsWith("/")||(c+="/"),c+=a;try{const l=await globalThis.fetch(c);if(!l.ok)continue;const u=await l.text(),o=Jn.parseFromString(u,"text/html").querySelectorAll(er);for(const f of o)try{let d=f.getAttribute("href")||"";if(!d)continue;if(d.endsWith("/")){const m=a+d;n.has(m)||s.push(m);continue}if(d.toLowerCase().endsWith(".md")){const m=pe(a+d);try{if(j.has(m))continue;for(const b of W.values());}catch(b){console.warn("[slugManager] slug map access failed",b)}try{const b=await be(m,e);if(b&&b.raw){const w=(b.raw||"").match(/^#\s+(.+)$/m);if(w&&w[1]&&ae(w[1].trim())===t){i=m;break}}}catch(b){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",b)}}}catch(d){console.warn("[slugManager] crawlForSlug: link iteration failed",d)}}catch(l){console.warn("[slugManager] crawlForSlug: directory fetch failed",l)}}return Pt.set(t,i),i};async function tr(t,e=ht){const r=new Set,i=new Set,n=[""];for(;n.length&&!(n.length>e);){const s=n.shift();if(i.has(s))continue;i.add(s);let a=t;a.endsWith("/")||(a+="/"),a+=s;try{const c=await globalThis.fetch(a);if(!c.ok)continue;const l=await c.text(),h=Jn.parseFromString(l,"text/html").querySelectorAll(er);for(const o of h)try{let f=o.getAttribute("href")||"";if(!f)continue;if(f.endsWith("/")){const m=s+f;i.has(m)||n.push(m);continue}const d=(s+f).replace(/^\/+/,"");/\.(md|html?)$/i.test(d)&&r.add(d)}catch(f){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",f)}}catch(c){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",c)}}return Array.from(r)}async function nr(t,e,r){if(t&&typeof t=="string"&&(t=pe(t),t=at(t)),W.has(t))return ot(t)||W.get(t);for(const n of _t)try{const s=await n(t,e);if(s)return He(t,s),j.set(s,t),s}catch(s){console.warn("[slugManager] slug resolver failed",s)}if(Ae&&Ae.length){if(lt.has(t)){const n=lt.get(t);return W.set(t,n),j.set(n,t),n}for(const n of Ae)if(!Lt.has(n))try{const s=await be(n,e);if(s&&s.raw){const a=(s.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const c=ae(a[1].trim());if(Lt.add(n),c&&lt.set(c,n),c===t)return He(t,n),j.set(n,t),n}}}catch(s){console.warn("[slugManager] manifest title fetch failed",s)}}try{const n=await $t(e);if(n&&n.length){const s=n.find(a=>a.slug===t);if(s)return He(t,s.path),j.set(s.path,t),s.path}}catch(n){console.warn("[slugManager] buildSearchIndex lookup failed",n)}try{const n=await cn(t,e,r);if(n)return He(t,n),j.set(n,t),n}catch(n){console.warn("[slugManager] crawlForSlug lookup failed",n)}const i=[`${t}.html`,`${t}.md`];for(const n of i)try{const s=await be(n,e);if(s&&s.raw)return He(t,n),j.set(n,t),n}catch(s){console.warn("[slugManager] candidate fetch failed",s)}if(Ae&&Ae.length)for(const n of Ae)try{const s=n.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ae(s)===t)return He(t,n),j.set(n,t),n}catch(s){console.warn("[slugManager] build-time filename match failed",s)}try{const n=await be("_home.md",e);if(n&&n.raw){const s=(n.raw||"").match(/^#\s+(.+)$/m);if(s&&s[1]&&ae(s[1].trim())===t)return He(t,"_home.md"),j.set("_home.md",t),"_home.md"}}catch(n){console.warn("[slugManager] home page fetch failed",n)}return null}const It=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:Vn,_setAllMd:Ii,_storeSlugMapping:He,addSlugResolver:Pi,get allMarkdownPaths(){return Ae},get availableLanguages(){return Re},buildSearchIndex:$t,buildSearchIndexWorker:Li,clearFetchCache:Oi,clearListCaches:zi,crawlAllMarkdown:tr,crawlCache:Pt,crawlForSlug:cn,crawlForSlugWorker:Mi,get defaultCrawlMaxQueue(){return ht},ensureSlug:nr,fetchCache:ct,get fetchMarkdown(){return be},getLanguages:Ci,initSlugWorker:an,listPathsFetched:Lt,listSlugCache:lt,mdToSlug:j,get notFoundPage(){return Ct},removeSlugResolver:$i,resolveSlugPath:ot,get searchIndex(){return Qe},setContentBase:Mt,setDefaultCrawlMaxQueue:Di,setFetchMarkdown:Ni,setLanguages:Xn,setNotFoundPage:on,slugResolvers:_t,slugToMd:W,slugify:ae},Symbol.toStringTag,{value:"Module"}));let rr=100;function ir(t){rr=t}let dt=300*1e3;function sr(t){dt=t}const _e=new Map;function qi(t){if(!_e.has(t))return;const e=_e.get(t),r=Date.now();if(e.ts+dt<r){_e.delete(t);return}return _e.delete(t),_e.set(t,e),e.value}function Ui(t,e){if(ar(),ar(),_e.delete(t),_e.set(t,{value:e,ts:Date.now()}),_e.size>rr){const r=_e.keys().next().value;r!==void 0&&_e.delete(r)}}function ar(){if(!dt||dt<=0)return;const t=Date.now();for(const[e,r]of _e.entries())r.ts+dt<t&&_e.delete(e)}async function Hi(t,e){const r=new Set(Pe),i=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const n of Array.from(i||[])){const s=n.getAttribute("href")||"";if(s)try{const a=new URL(s,location.href);if(a.origin!==location.origin)continue;const c=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(c){let u=pe(c[1]);u&&r.add(u);continue}const l=a.pathname||"";if(l){const u=new URL(e),h=Rt(u.pathname);if(l.indexOf(h)!==-1){let o=l.startsWith(h)?l.slice(h.length):l;o=pe(o),o&&r.add(o)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const n of r)try{if(!n||!String(n).includes(".md"))continue;const s=await be(n,e);if(!s||!s.raw)continue;const a=(s.raw||"").match(/^#\s+(.+)$/m);if(a){const c=(a[1]||"").trim();if(c&&ae(c)===t)return n}}catch(s){console.warn("[router] fetchMarkdown during index discovery failed",s)}return null}function ji(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const r=decodeURIComponent(String(t||""));if(W.has(r)){const i=ot(r)||W.get(r);i&&(/\.(md|html?)$/i.test(i)?/index\.html$/i.test(i)||e.push(i):(e.push(i),e.push(i+".html")))}else{if(Pe&&Pe.size)for(const i of Pe){const n=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ae(n)===r&&!/index\.html$/i.test(i)){e.push(i);break}}!e.length&&r&&!/\.(md|html?)$/i.test(r)&&(e.push(r+".html"),e.push(r+".md"))}}catch(r){console.warn("[router] buildPageCandidates failed during slug handling",r)}return e}async function Fi(t,e){const r=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let i=t||"",n=null;if(i&&String(i).includes("::")){const o=String(i).split("::",2);i=o[0],n=o[1]||null}const a=`${t}|||${typeof Ei<"u"&&Ue?Ue:""}`,c=qi(a);if(c)i=c.resolved,n=c.anchor||n;else{if(!String(i).includes(".md")&&!String(i).includes(".html")){let o=decodeURIComponent(String(i||""));if(o&&typeof o=="string"&&(o=pe(o),o=at(o)),W.has(o))i=ot(o)||W.get(o);else{let f=await Hi(o,e);if(f)i=f;else if(sn._refreshed&&Pe&&Pe.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const d=await nr(o,e);d&&(i=d)}}}Ui(a,{resolved:i,anchor:n})}!n&&r&&(n=r);const l=ji(i);if(l.length===1&&/index\.html$/i.test(l[0])&&!W.has(i)&&!W.has(decodeURIComponent(String(i||""))))throw new Error("Unknown slug: index.html fallback prevented");let u=null,h=null;for(const o of l)if(o)try{const f=pe(o);u=await be(f,e),h=f;break}catch{}if(!u)throw new Error("no page data");return{data:u,pagePath:h,anchor:n}}function un(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ge=un();function lr(t){Ge=t}var Xe={exec:()=>null};function G(t,e=""){let r=typeof t=="string"?t:t.source,i={replace:(n,s)=>{let a=typeof s=="string"?s:s.source;return a=a.replace(Se.caret,"$1"),r=r.replace(n,a),i},getRegex:()=>new RegExp(r,e)};return i}var Wi=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Se={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},Zi=/^(?:[ \t]*(?:\n|$))+/,Qi=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Gi=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,pt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Xi=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,hn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,or=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,cr=G(or).replace(/bull/g,hn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ki=G(or).replace(/bull/g,hn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),dn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Yi=/^[^\n]+/,pn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Vi=G(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",pn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ji=G(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,hn).getRegex(),zt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",fn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,es=G("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",fn).replace("tag",zt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ur=G(dn).replace("hr",pt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",zt).getRegex(),ts=G(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ur).getRegex(),gn={blockquote:ts,code:Qi,def:Vi,fences:Gi,heading:Xi,hr:pt,html:es,lheading:cr,list:Ji,newline:Zi,paragraph:ur,table:Xe,text:Yi},hr=G("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",pt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",zt).getRegex(),ns={...gn,lheading:Ki,table:hr,paragraph:G(dn).replace("hr",pt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",hr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",zt).getRegex()},rs={...gn,html:G(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",fn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Xe,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:G(dn).replace("hr",pt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",cr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},is=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ss=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,dr=/^( {2,}|\\)\n(?!\s*$)/,as=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Bt=/[\p{P}\p{S}]/u,mn=/[\s\p{P}\p{S}]/u,pr=/[^\s\p{P}\p{S}]/u,ls=G(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,mn).getRegex(),fr=/(?!~)[\p{P}\p{S}]/u,os=/(?!~)[\s\p{P}\p{S}]/u,cs=/(?:[^\s\p{P}\p{S}]|~)/u,gr=/(?![*_])[\p{P}\p{S}]/u,us=/(?![*_])[\s\p{P}\p{S}]/u,hs=/(?:[^\s\p{P}\p{S}]|[*_])/u,ds=G(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Wi?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),mr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,ps=G(mr,"u").replace(/punct/g,Bt).getRegex(),fs=G(mr,"u").replace(/punct/g,fr).getRegex(),wr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",gs=G(wr,"gu").replace(/notPunctSpace/g,pr).replace(/punctSpace/g,mn).replace(/punct/g,Bt).getRegex(),ms=G(wr,"gu").replace(/notPunctSpace/g,cs).replace(/punctSpace/g,os).replace(/punct/g,fr).getRegex(),ws=G("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,pr).replace(/punctSpace/g,mn).replace(/punct/g,Bt).getRegex(),bs=G(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,gr).getRegex(),ks="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",ys=G(ks,"gu").replace(/notPunctSpace/g,hs).replace(/punctSpace/g,us).replace(/punct/g,gr).getRegex(),xs=G(/\\(punct)/,"gu").replace(/punct/g,Bt).getRegex(),Ss=G(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),vs=G(fn).replace("(?:-->|$)","-->").getRegex(),Es=G("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",vs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ot=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Rs=G(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Ot).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),br=G(/^!?\[(label)\]\[(ref)\]/).replace("label",Ot).replace("ref",pn).getRegex(),kr=G(/^!?\[(ref)\](?:\[\])?/).replace("ref",pn).getRegex(),As=G("reflink|nolink(?!\\()","g").replace("reflink",br).replace("nolink",kr).getRegex(),yr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,wn={_backpedal:Xe,anyPunctuation:xs,autolink:Ss,blockSkip:ds,br:dr,code:ss,del:Xe,delLDelim:Xe,delRDelim:Xe,emStrongLDelim:ps,emStrongRDelimAst:gs,emStrongRDelimUnd:ws,escape:is,link:Rs,nolink:kr,punctuation:ls,reflink:br,reflinkSearch:As,tag:Es,text:as,url:Xe},Ts={...wn,link:G(/^!?\[(label)\]\((.*?)\)/).replace("label",Ot).getRegex(),reflink:G(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ot).getRegex()},bn={...wn,emStrongRDelimAst:ms,emStrongLDelim:fs,delLDelim:bs,delRDelim:ys,url:G(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",yr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:G(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",yr).getRegex()},_s={...bn,br:G(dr).replace("{2,}","*").getRegex(),text:G(bn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Nt={normal:gn,gfm:ns,pedantic:rs},ft={normal:wn,gfm:bn,breaks:_s,pedantic:Ts},Cs={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},xr=t=>Cs[t];function $e(t,e){if(e){if(Se.escapeTest.test(t))return t.replace(Se.escapeReplace,xr)}else if(Se.escapeTestNoEncode.test(t))return t.replace(Se.escapeReplaceNoEncode,xr);return t}function Sr(t){try{t=encodeURI(t).replace(Se.percentDecode,"%")}catch{return null}return t}function vr(t,e){let r=t.replace(Se.findPipe,(s,a,c)=>{let l=!1,u=a;for(;--u>=0&&c[u]==="\\";)l=!l;return l?"|":" |"}),i=r.split(Se.splitPipe),n=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),e)if(i.length>e)i.splice(e);else for(;i.length<e;)i.push("");for(;n<i.length;n++)i[n]=i[n].trim().replace(Se.slashPipe,"|");return i}function gt(t,e,r){let i=t.length;if(i===0)return"";let n=0;for(;n<i&&t.charAt(i-n-1)===e;)n++;return t.slice(0,i-n)}function Ls(t,e){if(t.indexOf(e[1])===-1)return-1;let r=0;for(let i=0;i<t.length;i++)if(t[i]==="\\")i++;else if(t[i]===e[0])r++;else if(t[i]===e[1]&&(r--,r<0))return i;return r>0?-2:-1}function Ms(t,e=0){let r=e,i="";for(let n of t)if(n==="	"){let s=4-r%4;i+=" ".repeat(s),r+=s}else i+=n,r++;return i}function Er(t,e,r,i,n){let s=e.href,a=e.title||null,c=t[1].replace(n.other.outputLinkReplace,"$1");i.state.inLink=!0;let l={type:t[0].charAt(0)==="!"?"image":"link",raw:r,href:s,title:a,text:c,tokens:i.inlineTokens(c)};return i.state.inLink=!1,l}function Ps(t,e,r){let i=t.match(r.other.indentCodeCompensation);if(i===null)return e;let n=i[1];return e.split(`
`).map(s=>{let a=s.match(r.other.beginningSpace);if(a===null)return s;let[c]=a;return c.length>=n.length?s.slice(n.length):s}).join(`
`)}var Dt=class{options;rules;lexer;constructor(t){this.options=t||Ge}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let r=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?r:gt(r,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let r=e[0],i=Ps(r,e[3]||"",this.rules);return{type:"code",raw:r,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:i}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let r=e[2].trim();if(this.rules.other.endingHash.test(r)){let i=gt(r,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(r=i.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:gt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let r=gt(e[0],`
`).split(`
`),i="",n="",s=[];for(;r.length>0;){let a=!1,c=[],l;for(l=0;l<r.length;l++)if(this.rules.other.blockquoteStart.test(r[l]))c.push(r[l]),a=!0;else if(!a)c.push(r[l]);else break;r=r.slice(l);let u=c.join(`
`),h=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${u}`:u,n=n?`${n}
${h}`:h;let o=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,s,!0),this.lexer.state.top=o,r.length===0)break;let f=s.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let d=f,m=d.raw+`
`+r.join(`
`),b=this.blockquote(m);s[s.length-1]=b,i=i.substring(0,i.length-d.raw.length)+b.raw,n=n.substring(0,n.length-d.text.length)+b.text;break}else if(f?.type==="list"){let d=f,m=d.raw+`
`+r.join(`
`),b=this.list(m);s[s.length-1]=b,i=i.substring(0,i.length-f.raw.length)+b.raw,n=n.substring(0,n.length-d.raw.length)+b.raw,r=m.substring(s.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:s,text:n}}}list(t){let e=this.rules.block.list.exec(t);if(e){let r=e[1].trim(),i=r.length>1,n={type:"list",raw:"",ordered:i,start:i?+r.slice(0,-1):"",loose:!1,items:[]};r=i?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=i?r:"[*+-]");let s=this.rules.other.listItemRegex(r),a=!1;for(;t;){let l=!1,u="",h="";if(!(e=s.exec(t))||this.rules.block.hr.test(t))break;u=e[0],t=t.substring(u.length);let o=Ms(e[2].split(`
`,1)[0],e[1].length),f=t.split(`
`,1)[0],d=!o.trim(),m=0;if(this.options.pedantic?(m=2,h=o.trimStart()):d?m=e[1].length+1:(m=o.search(this.rules.other.nonSpaceChar),m=m>4?1:m,h=o.slice(m),m+=e[1].length),d&&this.rules.other.blankLine.test(f)&&(u+=f+`
`,t=t.substring(f.length+1),l=!0),!l){let b=this.rules.other.nextBulletRegex(m),w=this.rules.other.hrRegex(m),x=this.rules.other.fencesBeginRegex(m),y=this.rules.other.headingBeginRegex(m),z=this.rules.other.htmlBeginRegex(m),P=this.rules.other.blockquoteBeginRegex(m);for(;t;){let X=t.split(`
`,1)[0],V;if(f=X,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),V=f):V=f.replace(this.rules.other.tabCharGlobal,"    "),x.test(f)||y.test(f)||z.test(f)||P.test(f)||b.test(f)||w.test(f))break;if(V.search(this.rules.other.nonSpaceChar)>=m||!f.trim())h+=`
`+V.slice(m);else{if(d||o.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||x.test(o)||y.test(o)||w.test(o))break;h+=`
`+f}d=!f.trim(),u+=X+`
`,t=t.substring(X.length+1),o=V.slice(m)}}n.loose||(a?n.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(a=!0)),n.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(h),loose:!1,text:h,tokens:[]}),n.raw+=u}let c=n.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let l of n.items){if(this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]),l.task){if(l.text=l.text.replace(this.rules.other.listReplaceTask,""),l.tokens[0]?.type==="text"||l.tokens[0]?.type==="paragraph"){l.tokens[0].raw=l.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),l.tokens[0].text=l.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let h=this.lexer.inlineQueue.length-1;h>=0;h--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)){this.lexer.inlineQueue[h].src=this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(l.raw);if(u){let h={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};l.checked=h.checked,n.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=h.raw+l.tokens[0].raw,l.tokens[0].text=h.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(h)):l.tokens.unshift({type:"paragraph",raw:h.raw,text:h.raw,tokens:[h]}):l.tokens.unshift(h)}}if(!n.loose){let u=l.tokens.filter(o=>o.type==="space"),h=u.length>0&&u.some(o=>this.rules.other.anyLine.test(o.raw));n.loose=h}}if(n.loose)for(let l of n.items){l.loose=!0;for(let u of l.tokens)u.type==="text"&&(u.type="paragraph")}return n}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let r=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:r,raw:e[0],href:i,title:n}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let r=vr(e[1]),i=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],s={type:"table",raw:e[0],header:[],align:[],rows:[]};if(r.length===i.length){for(let a of i)this.rules.other.tableAlignRight.test(a)?s.align.push("right"):this.rules.other.tableAlignCenter.test(a)?s.align.push("center"):this.rules.other.tableAlignLeft.test(a)?s.align.push("left"):s.align.push(null);for(let a=0;a<r.length;a++)s.header.push({text:r[a],tokens:this.lexer.inline(r[a]),header:!0,align:s.align[a]});for(let a of n)s.rows.push(vr(a,s.header.length).map((c,l)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:s.align[l]})));return s}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let r=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:r,tokens:this.lexer.inline(r)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let r=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let s=gt(r.slice(0,-1),"\\");if((r.length-s.length)%2===0)return}else{let s=Ls(e[2],"()");if(s===-2)return;if(s>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+s;e[2]=e[2].substring(0,s),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let i=e[2],n="";if(this.options.pedantic){let s=this.rules.other.pedanticHrefTitle.exec(i);s&&(i=s[1],n=s[3])}else n=e[3]?e[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?i=i.slice(1):i=i.slice(1,-1)),Er(e,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){let i=(r[2]||r[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=e[i.toLowerCase()];if(!n){let s=r[0].charAt(0);return{type:"text",raw:s,text:s}}return Er(r,n,r[0],this.lexer,this.rules)}}emStrong(t,e,r=""){let i=this.rules.inline.emStrongLDelim.exec(t);if(!(!i||i[3]&&r.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[2])||!r||this.rules.inline.punctuation.exec(r))){let n=[...i[0]].length-1,s,a,c=n,l=0,u=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,e=e.slice(-1*t.length+n);(i=u.exec(e))!=null;){if(s=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!s)continue;if(a=[...s].length,i[3]||i[4]){c+=a;continue}else if((i[5]||i[6])&&n%3&&!((n+a)%3)){l+=a;continue}if(c-=a,c>0)continue;a=Math.min(a,a+c+l);let h=[...i[0]][0].length,o=t.slice(0,n+i.index+h+a);if(Math.min(n,a)%2){let d=o.slice(1,-1);return{type:"em",raw:o,text:d,tokens:this.lexer.inlineTokens(d)}}let f=o.slice(2,-2);return{type:"strong",raw:o,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let r=e[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(r),n=this.rules.other.startingSpaceChar.test(r)&&this.rules.other.endingSpaceChar.test(r);return i&&n&&(r=r.substring(1,r.length-1)),{type:"codespan",raw:e[0],text:r}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,r=""){let i=this.rules.inline.delLDelim.exec(t);if(i&&(!i[1]||!r||this.rules.inline.punctuation.exec(r))){let n=[...i[0]].length-1,s,a,c=n,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*t.length+n);(i=l.exec(e))!=null;){if(s=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!s||(a=[...s].length,a!==n))continue;if(i[3]||i[4]){c+=a;continue}if(c-=a,c>0)continue;a=Math.min(a,a+c);let u=[...i[0]][0].length,h=t.slice(0,n+i.index+u+a),o=h.slice(n,-n);return{type:"del",raw:h,text:o,tokens:this.lexer.inlineTokens(o)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let r,i;return e[2]==="@"?(r=e[1],i="mailto:"+r):(r=e[1],i=r),{type:"link",raw:e[0],text:r,href:i,tokens:[{type:"text",raw:r,text:r}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let r,i;if(e[2]==="@")r=e[0],i="mailto:"+r;else{let n;do n=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(n!==e[0]);r=e[0],e[1]==="www."?i="http://"+e[0]:i=e[0]}return{type:"link",raw:e[0],text:r,href:i,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let r=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:r}}}},Ce=class zn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ge,this.options.tokenizer=this.options.tokenizer||new Dt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let r={other:Se,block:Nt.normal,inline:ft.normal};this.options.pedantic?(r.block=Nt.pedantic,r.inline=ft.pedantic):this.options.gfm&&(r.block=Nt.gfm,this.options.breaks?r.inline=ft.breaks:r.inline=ft.gfm),this.tokenizer.rules=r}static get rules(){return{block:Nt,inline:ft}}static lex(e,r){return new zn(r).lex(e)}static lexInline(e,r){return new zn(r).inlineTokens(e)}lex(e){e=e.replace(Se.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let r=0;r<this.inlineQueue.length;r++){let i=this.inlineQueue[r];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,r=[],i=!1){for(this.options.pedantic&&(e=e.replace(Se.tabCharGlobal,"    ").replace(Se.spaceLine,""));e;){let n;if(this.options.extensions?.block?.some(a=>(n=a.call({lexer:this},e,r))?(e=e.substring(n.raw.length),r.push(n),!0):!1))continue;if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length);let a=r.at(-1);n.raw.length===1&&a!==void 0?a.raw+=`
`:r.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title},r.push(n));continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),r.push(n);continue}let s=e;if(this.options.extensions?.startBlock){let a=1/0,c=e.slice(1),l;this.options.extensions.startBlock.forEach(u=>{l=u.call({lexer:this},c),typeof l=="number"&&l>=0&&(a=Math.min(a,l))}),a<1/0&&a>=0&&(s=e.substring(0,a+1))}if(this.state.top&&(n=this.tokenizer.paragraph(s))){let a=r.at(-1);i&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n),i=s.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,r}inline(e,r=[]){return this.inlineQueue.push({src:e,tokens:r}),r}inlineTokens(e,r=[]){let i=e,n=null;if(this.tokens.links){let l=Object.keys(this.tokens.links);if(l.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)l.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,n.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let s;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)s=n[2]?n[2].length:0,i=i.slice(0,n.index+s)+"["+"a".repeat(n[0].length-s-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let a=!1,c="";for(;e;){a||(c=""),a=!1;let l;if(this.options.extensions?.inline?.some(h=>(l=h.call({lexer:this},e,r))?(e=e.substring(l.raw.length),r.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);let h=r.at(-1);l.type==="text"&&h?.type==="text"?(h.raw+=l.raw,h.text+=l.text):r.push(l);continue}if(l=this.tokenizer.emStrong(e,i,c)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.del(e,i,c)){e=e.substring(l.raw.length),r.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),r.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),r.push(l);continue}let u=e;if(this.options.extensions?.startInline){let h=1/0,o=e.slice(1),f;this.options.extensions.startInline.forEach(d=>{f=d.call({lexer:this},o),typeof f=="number"&&f>=0&&(h=Math.min(h,f))}),h<1/0&&h>=0&&(u=e.substring(0,h+1))}if(l=this.tokenizer.inlineText(u)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(c=l.raw.slice(-1)),a=!0;let h=r.at(-1);h?.type==="text"?(h.raw+=l.raw,h.text+=l.text):r.push(l);continue}if(e){let h="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(h);break}else throw new Error(h)}}return r}},qt=class{options;parser;constructor(t){this.options=t||Ge}space(t){return""}code({text:t,lang:e,escaped:r}){let i=(e||"").match(Se.notSpaceStart)?.[0],n=t.replace(Se.endingNewline,"")+`
`;return i?'<pre><code class="language-'+$e(i)+'">'+(r?n:$e(n,!0))+`</code></pre>
`:"<pre><code>"+(r?n:$e(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,r=t.start,i="";for(let a=0;a<t.items.length;a++){let c=t.items[a];i+=this.listitem(c)}let n=e?"ol":"ul",s=e&&r!==1?' start="'+r+'"':"";return"<"+n+s+`>
`+i+"</"+n+`>
`}listitem(t){return`<li>${this.parser.parse(t.tokens)}</li>
`}checkbox({checked:t}){return"<input "+(t?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:t}){return`<p>${this.parser.parseInline(t)}</p>
`}table(t){let e="",r="";for(let n=0;n<t.header.length;n++)r+=this.tablecell(t.header[n]);e+=this.tablerow({text:r});let i="";for(let n=0;n<t.rows.length;n++){let s=t.rows[n];r="";for(let a=0;a<s.length;a++)r+=this.tablecell(s[a]);i+=this.tablerow({text:r})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+i+`</table>
`}tablerow({text:t}){return`<tr>
${t}</tr>
`}tablecell(t){let e=this.parser.parseInline(t.tokens),r=t.header?"th":"td";return(t.align?`<${r} align="${t.align}">`:`<${r}>`)+e+`</${r}>
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${$e(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:r}){let i=this.parser.parseInline(r),n=Sr(t);if(n===null)return i;t=n;let s='<a href="'+t+'"';return e&&(s+=' title="'+$e(e)+'"'),s+=">"+i+"</a>",s}image({href:t,title:e,text:r,tokens:i}){i&&(r=this.parser.parseInline(i,this.parser.textRenderer));let n=Sr(t);if(n===null)return $e(r);t=n;let s=`<img src="${t}" alt="${$e(r)}"`;return e&&(s+=` title="${$e(e)}"`),s+=">",s}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:$e(t.text)}},kn=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},Le=class Bn{options;renderer;textRenderer;constructor(e){this.options=e||Ge,this.options.renderer=this.options.renderer||new qt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new kn}static parse(e,r){return new Bn(r).parse(e)}static parseInline(e,r){return new Bn(r).parseInline(e)}parse(e){let r="";for(let i=0;i<e.length;i++){let n=e[i];if(this.options.extensions?.renderers?.[n.type]){let a=n,c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){r+=c||"";continue}}let s=n;switch(s.type){case"space":{r+=this.renderer.space(s);break}case"hr":{r+=this.renderer.hr(s);break}case"heading":{r+=this.renderer.heading(s);break}case"code":{r+=this.renderer.code(s);break}case"table":{r+=this.renderer.table(s);break}case"blockquote":{r+=this.renderer.blockquote(s);break}case"list":{r+=this.renderer.list(s);break}case"checkbox":{r+=this.renderer.checkbox(s);break}case"html":{r+=this.renderer.html(s);break}case"def":{r+=this.renderer.def(s);break}case"paragraph":{r+=this.renderer.paragraph(s);break}case"text":{r+=this.renderer.text(s);break}default:{let a='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}parseInline(e,r=this.renderer){let i="";for(let n=0;n<e.length;n++){let s=e[n];if(this.options.extensions?.renderers?.[s.type]){let c=this.options.extensions.renderers[s.type].call({parser:this},s);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(s.type)){i+=c||"";continue}}let a=s;switch(a.type){case"escape":{i+=r.text(a);break}case"html":{i+=r.html(a);break}case"link":{i+=r.link(a);break}case"image":{i+=r.image(a);break}case"checkbox":{i+=r.checkbox(a);break}case"strong":{i+=r.strong(a);break}case"em":{i+=r.em(a);break}case"codespan":{i+=r.codespan(a);break}case"br":{i+=r.br(a);break}case"del":{i+=r.del(a);break}case"text":{i+=r.text(a);break}default:{let c='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return i}},mt=class{options;block;constructor(t){this.options=t||Ge}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Ce.lex:Ce.lexInline}provideParser(){return this.block?Le.parse:Le.parseInline}},$s=class{defaults=un();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Le;Renderer=qt;TextRenderer=kn;Lexer=Ce;Tokenizer=Dt;Hooks=mt;constructor(...t){this.use(...t)}walkTokens(t,e){let r=[];for(let i of t)switch(r=r.concat(e.call(this,i)),i.type){case"table":{let n=i;for(let s of n.header)r=r.concat(this.walkTokens(s.tokens,e));for(let s of n.rows)for(let a of s)r=r.concat(this.walkTokens(a.tokens,e));break}case"list":{let n=i;r=r.concat(this.walkTokens(n.items,e));break}default:{let n=i;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(s=>{let a=n[s].flat(1/0);r=r.concat(this.walkTokens(a,e))}):n.tokens&&(r=r.concat(this.walkTokens(n.tokens,e)))}}return r}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(r=>{let i={...r};if(i.async=this.defaults.async||i.async||!1,r.extensions&&(r.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let s=e.renderers[n.name];s?e.renderers[n.name]=function(...a){let c=n.renderer.apply(this,a);return c===!1&&(c=s.apply(this,a)),c}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let s=e[n.level];s?s.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),i.extensions=e),r.renderer){let n=this.defaults.renderer||new qt(this.defaults);for(let s in r.renderer){if(!(s in n))throw new Error(`renderer '${s}' does not exist`);if(["options","parser"].includes(s))continue;let a=s,c=r.renderer[a],l=n[a];n[a]=(...u)=>{let h=c.apply(n,u);return h===!1&&(h=l.apply(n,u)),h||""}}i.renderer=n}if(r.tokenizer){let n=this.defaults.tokenizer||new Dt(this.defaults);for(let s in r.tokenizer){if(!(s in n))throw new Error(`tokenizer '${s}' does not exist`);if(["options","rules","lexer"].includes(s))continue;let a=s,c=r.tokenizer[a],l=n[a];n[a]=(...u)=>{let h=c.apply(n,u);return h===!1&&(h=l.apply(n,u)),h}}i.tokenizer=n}if(r.hooks){let n=this.defaults.hooks||new mt;for(let s in r.hooks){if(!(s in n))throw new Error(`hook '${s}' does not exist`);if(["options","block"].includes(s))continue;let a=s,c=r.hooks[a],l=n[a];mt.passThroughHooks.has(s)?n[a]=u=>{if(this.defaults.async&&mt.passThroughHooksRespectAsync.has(s))return(async()=>{let o=await c.call(n,u);return l.call(n,o)})();let h=c.call(n,u);return l.call(n,h)}:n[a]=(...u)=>{if(this.defaults.async)return(async()=>{let o=await c.apply(n,u);return o===!1&&(o=await l.apply(n,u)),o})();let h=c.apply(n,u);return h===!1&&(h=l.apply(n,u)),h}}i.hooks=n}if(r.walkTokens){let n=this.defaults.walkTokens,s=r.walkTokens;i.walkTokens=function(a){let c=[];return c.push(s.call(this,a)),n&&(c=c.concat(n.call(this,a))),c}}this.defaults={...this.defaults,...i}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Ce.lex(t,e??this.defaults)}parser(t,e){return Le.parse(t,e??this.defaults)}parseMarkdown(t){return(e,r)=>{let i={...r},n={...this.defaults,...i},s=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&i.async===!1)return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return s(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return s(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let a=n.hooks?await n.hooks.preprocess(e):e,c=await(n.hooks?await n.hooks.provideLexer():t?Ce.lex:Ce.lexInline)(a,n),l=n.hooks?await n.hooks.processAllTokens(c):c;n.walkTokens&&await Promise.all(this.walkTokens(l,n.walkTokens));let u=await(n.hooks?await n.hooks.provideParser():t?Le.parse:Le.parseInline)(l,n);return n.hooks?await n.hooks.postprocess(u):u})().catch(s);try{n.hooks&&(e=n.hooks.preprocess(e));let a=(n.hooks?n.hooks.provideLexer():t?Ce.lex:Ce.lexInline)(e,n);n.hooks&&(a=n.hooks.processAllTokens(a)),n.walkTokens&&this.walkTokens(a,n.walkTokens);let c=(n.hooks?n.hooks.provideParser():t?Le.parse:Le.parseInline)(a,n);return n.hooks&&(c=n.hooks.postprocess(c)),c}catch(a){return s(a)}}}onError(t,e){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let i="<p>An error occurred:</p><pre>"+$e(r.message+"",!0)+"</pre>";return e?Promise.resolve(i):i}if(e)return Promise.reject(r);throw r}}},Ke=new $s;function K(t,e){return Ke.parse(t,e)}K.options=K.setOptions=function(t){return Ke.setOptions(t),K.defaults=Ke.defaults,lr(K.defaults),K},K.getDefaults=un,K.defaults=Ge,K.use=function(...t){return Ke.use(...t),K.defaults=Ke.defaults,lr(K.defaults),K},K.walkTokens=function(t,e){return Ke.walkTokens(t,e)},K.parseInline=Ke.parseInline,K.Parser=Le,K.parser=Le.parse,K.Renderer=qt,K.TextRenderer=kn,K.Lexer=Ce,K.lexer=Ce.lex,K.Tokenizer=Dt,K.Hooks=mt,K.parse=K,K.options,K.setOptions,K.use,K.walkTokens,K.parseInline,Le.parse,Ce.lex;const Rr=`function j() {
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
`,Ar=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Rr],{type:"text/javascript;charset=utf-8"});function Is(t){let e;try{if(e=Ar&&(self.URL||self.webkitURL).createObjectURL(Ar),!e)throw"";const r=new Worker(e,{type:"module",name:t?.name});return r.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),r}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Rr),{type:"module",name:t?.name})}}function zs(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const r=t.slice(3,e+0).trim(),i=t.slice(e+4).trimStart(),n={};return r.split(/\r?\n/).forEach(s=>{const a=s.match(/^([^:]+):\s*(.*)$/);a&&(n[a[1].trim()]=a[2].trim())}),{content:i,data:n}}}return{content:t,data:{}}}const Tr=Fn(()=>new Is,"markdown"),_r=typeof DOMParser<"u"?new DOMParser:null;function yn(){return Tr.get()}function Bs(t){return Tr.send(t,1e3)}const je=[];function xn(t){if(t&&typeof t=="object"){je.push(t);try{K.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function Os(t){je.length=0,Array.isArray(t)&&je.push(...t.filter(e=>e&&typeof e=="object"));try{je.forEach(e=>K.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function Ut(t){if(yn&&yn())try{const s=await Bs({type:"render",md:t});if(s&&s.html!==void 0)try{const c=(_r||new DOMParser).parseFromString(s.html,"text/html"),l=c.querySelectorAll("h1,h2,h3,h4,h5,h6");l.forEach(o=>{o.id||(o.id=ae(o.textContent||""))});try{c.querySelectorAll("img").forEach(f=>{try{f.getAttribute("loading")||f.setAttribute("data-want-lazy","1")}catch(d){console.warn("[markdown] set image loading attribute failed",d)}})}catch(o){console.warn("[markdown] query images failed",o)}try{c.querySelectorAll("pre code").forEach(f=>{try{const d=f.getAttribute&&f.getAttribute("class")||f.className||"",m=String(d||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{f.setAttribute&&f.setAttribute("class",m)}catch(x){console.warn("[markdown] set code class failed",x),f.className=m}else try{f.removeAttribute&&f.removeAttribute("class")}catch(x){console.warn("[markdown] remove code class failed",x),f.className=""}const b=m,w=b.match(/language-([a-zA-Z0-9_+-]+)/)||b.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!w||!w[1])try{const x=f.textContent||"";try{if(ie&&typeof ie.getLanguage=="function"&&ie.getLanguage("plaintext")){const y=ie.highlight(x,{language:"plaintext"});y&&y.value&&(f.innerHTML=y.value)}}catch{try{ie.highlightElement(f)}catch(z){console.warn("[markdown] hljs.highlightElement failed",z)}}}catch(x){console.warn("[markdown] code auto-detect failed",x)}}catch(d){console.warn("[markdown] processing code blocks failed",d)}})}catch(o){console.warn("[markdown] query code blocks failed",o)}const u=c.body.innerHTML,h=[];return l.forEach(o=>{h.push({level:Number(o.tagName.substring(1)),text:(o.textContent||"").trim(),id:o.id})}),{html:u,meta:s.meta||{},toc:h}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),s}}catch(s){console.warn("[markdown] worker render failed",s)}const{content:r,data:i}=zs(t||"");if(K.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),je&&je.length)try{je.forEach(s=>K.use(s))}catch(s){console.warn("[markdown] apply plugins failed",s)}let n=K.parse(r);try{const a=(_r||new DOMParser).parseFromString(n,"text/html"),c=a.querySelectorAll("h1,h2,h3,h4,h5,h6");c.forEach(u=>{u.id||(u.id=ae(u.textContent||""))});try{a.querySelectorAll("img").forEach(h=>{try{h.getAttribute("loading")||h.setAttribute("data-want-lazy","1")}catch(o){console.warn("[markdown] set image loading attribute failed",o)}})}catch(u){console.warn("[markdown] query images failed",u)}try{a.querySelectorAll("pre code").forEach(h=>{try{const o=h.getAttribute&&h.getAttribute("class")||h.className||"",f=String(o||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{h.setAttribute&&h.setAttribute("class",f)}catch(b){console.warn("[markdown] set code class failed",b),h.className=f}else try{h.removeAttribute&&h.removeAttribute("class")}catch(b){console.warn("[markdown] remove code class failed",b),h.className=""}const d=f,m=d.match(/language-([a-zA-Z0-9_+-]+)/)||d.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!m||!m[1])try{const b=h.textContent||"";try{if(ie&&typeof ie.getLanguage=="function"&&ie.getLanguage("plaintext")){const w=ie.highlight(b,{language:"plaintext"});w&&w.value&&(h.innerHTML=w.value)}}catch{try{ie.highlightElement(h)}catch(x){console.warn("[markdown] hljs.highlightElement failed",x)}}}catch(b){console.warn("[markdown] code auto-detect failed",b)}}catch(o){console.warn("[markdown] processing code blocks failed",o)}})}catch(u){console.warn("[markdown] query code blocks failed",u)}n=a.body.innerHTML;const l=[];return c.forEach(u=>{l.push({level:Number(u.tagName.substring(1)),text:(u.textContent||"").trim(),id:u.id})}),{html:a.body.innerHTML,meta:i||{},toc:l}}catch(s){console.warn("post-process markdown failed",s)}return{html:n,meta:i||{},toc:[]}}function Sn(t,e){const r=new Set,i=/```\s*([a-zA-Z0-9_\-+]+)?/g,n=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),s=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=i.exec(t);)if(a[1]){const c=a[1].toLowerCase();if(Vt.has(c)||e&&e.size&&c.length<3&&!e.has(c)&&!(Oe&&Oe[c]&&e.has(Oe[c])))continue;if(e&&e.size){if(e.has(c)){const u=e.get(c);u&&r.add(u);continue}if(Oe&&Oe[c]){const u=Oe[c];if(e.has(u)){const h=e.get(u)||u;r.add(h);continue}}}(s.has(c)||c.length>=5&&c.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(c)&&!n.has(c))&&r.add(c)}return r}const Ns=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:xn,detectFenceLanguages:Sn,initRendererWorker:yn,markdownPlugins:je,parseMarkdownToHtml:Ut,setMarkdownExtensions:Os},Symbol.toStringTag,{value:"Module"}));function Ds(t,e){const r=document.createElement("aside");r.className="menu nimbi-nav";const i=document.createElement("p");i.className="menu-label",i.textContent=t("navigation"),r.appendChild(i);const n=document.createElement("ul");return n.className="menu-list",e.forEach(s=>{const a=document.createElement("li"),c=document.createElement("a");if(c.href="#"+s.path,c.textContent=s.name,a.appendChild(c),s.children&&s.children.length){const l=document.createElement("ul");s.children.forEach(u=>{const h=document.createElement("li"),o=document.createElement("a");o.href="#"+u.path,o.textContent=u.name,h.appendChild(o),l.appendChild(h)}),a.appendChild(l)}n.appendChild(a)}),r.appendChild(n),r}function qs(t,e,r=""){const i=document.createElement("aside");i.className="menu nimbi-toc-inner";const n=document.createElement("p");n.className="menu-label",n.textContent=t("onThisPage"),i.appendChild(n);const s=document.createElement("ul");return s.className="menu-list",e.forEach(a=>{if(a.level===1)return;const c=document.createElement("li"),l=document.createElement("a"),u=a.id||ae(a.text);try{const h=String(r||"").replace(/^[\.\/]+/,""),o=h&&j&&j.has&&j.has(h)?j.get(h):h;o?l.href=`?page=${encodeURIComponent(o)}#${encodeURIComponent(u)}`:l.href=`?page=${encodeURIComponent(u)}#${encodeURIComponent(u)}`}catch(h){console.warn("[htmlBuilder] buildTocElement href normalization failed",h);const o=String(r||"").replace(/^[\.\/]+/,""),f=o&&j&&j.has&&j.has(o)?j.get(o):o;f?l.href=`?page=${encodeURIComponent(f)}#${encodeURIComponent(u)}`:l.href=`?page=${encodeURIComponent(u)}#${encodeURIComponent(u)}`}l.textContent=a.text,c.appendChild(l),s.appendChild(c)}),i.appendChild(s),i}function Cr(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(r=>{r.id||(r.id=ae(r.textContent||""))})}function Us(t,e,r){try{const i=t.querySelectorAll("img");if(i&&i.length){const n=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";i.forEach(s=>{const a=s.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const c=new URL(n+a,r).toString();s.src=c;try{s.getAttribute("loading")||s.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] set image loading attribute failed",l)}}catch(c){console.warn("[htmlBuilder] resolve image src failed",c)}})}}catch(i){console.warn("[htmlBuilder] lazyLoadImages failed",i)}}let Lr="",vn=null,Mr="";async function Pr(t,e,r){try{const i=t.querySelectorAll("a");if(!i||!i.length)return;let n,s;e===Lr&&vn?(n=vn,s=Mr):(n=new URL(e),s=Rt(n.pathname),Lr=e,vn=n,Mr=s);const a=new Set,c=[];for(const l of Array.from(i))try{const u=l.getAttribute("href")||"";if(!u||Gn(u)||u.startsWith("/")&&!u.endsWith(".md"))continue;const h=u.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(h){let o=h[1];const f=h[2];!o.startsWith("/")&&r&&(o=(r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"")+o);try{const d=new URL(o,e).pathname;let m=d.startsWith(s)?d.slice(s.length):d;m=pe(m),c.push({node:l,mdPathRaw:o,frag:f,rel:m}),j.has(m)||a.add(m)}catch(d){console.warn("[htmlBuilder] resolve mdPath failed",d)}continue}try{const f=new URL(u,e).pathname||"";if(f&&f.indexOf(s)!==-1){let d=f.startsWith(s)?f.slice(s.length):f;if(d=pe(d),d=at(d),d||(d="_home"),!d.endsWith(".md"))if(W.has(d)){const m=W.get(d),b=j.get(m)||d;l.setAttribute("href",`?page=${encodeURIComponent(b)}`)}else l.setAttribute("href",`?page=${encodeURIComponent(d)}`)}}catch(o){console.warn("[htmlBuilder] resolving href to URL failed",o)}}catch(u){console.warn("[htmlBuilder] processing anchor failed",u)}a.size&&await Promise.all(Array.from(a).map(async l=>{try{try{const h=String(l).match(/([^\/]+)\.md$/),o=h&&h[1];if(o&&W.has(o)){try{const f=W.get(o);if(f)try{j.set(f,o)}catch(d){console.warn("[htmlBuilder] mdToSlug.set failed",d)}}catch(f){console.warn("[htmlBuilder] reading slugToMd failed",f)}return}}catch(h){console.warn("[htmlBuilder] basename slug lookup failed",h)}const u=await be(l,e);if(u&&u.raw){const h=(u.raw||"").match(/^#\s+(.+)$/m);if(h&&h[1]){const o=ae(h[1].trim());if(o)try{W.set(o,l),j.set(l,o)}catch(f){console.warn("[htmlBuilder] setting slug mapping failed",f)}}}}catch(u){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",u)}}));for(const l of c){const{node:u,frag:h,rel:o}=l;let f=null;try{j.has(o)&&(f=j.get(o))}catch(d){console.warn("[htmlBuilder] mdToSlug access failed",d)}f?h?u.setAttribute("href",`?page=${encodeURIComponent(f)}#${encodeURIComponent(h)}`):u.setAttribute("href",`?page=${encodeURIComponent(f)}`):h?u.setAttribute("href",`?page=${encodeURIComponent(o)}#${encodeURIComponent(h)}`):u.setAttribute("href",`?page=${encodeURIComponent(o)}`)}}catch(i){console.warn("[htmlBuilder] rewriteAnchors failed",i)}}function Hs(t,e,r,i){const n=e.querySelector("h1"),s=n?(n.textContent||"").trim():"";let a="";try{s&&(a=ae(s)),!a&&t&&t.meta&&t.meta.title&&(a=ae(t.meta.title)),!a&&r&&(a=ae(String(r))),a||(a="_home");try{r&&(W.set(a,r),j.set(r,a))}catch(c){console.warn("[htmlBuilder] computeSlug set slug mapping failed",c)}try{let c="?page="+encodeURIComponent(a);try{const l=i||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");l&&(c+="#"+encodeURIComponent(l))}catch(l){console.warn("[htmlBuilder] computeSlug hash decode failed",l)}try{history.replaceState({page:a},"",c)}catch(l){console.warn("[htmlBuilder] computeSlug history replace failed",l)}}catch(c){console.warn("[htmlBuilder] computeSlug inner failed",c)}}catch(c){console.warn("[htmlBuilder] computeSlug failed",c)}return{topH1:n,h1Text:s,slugKey:a}}async function js(t,e){if(!t||!t.length)return;const r=new Set;for(const l of Array.from(t||[]))try{const u=l.getAttribute("href")||"";if(!u)continue;let f=pe(u).split(/::|#/,2)[0];if(!f||(f.includes(".")||(f=f+".html"),!/\.html(?:$|[?#])/.test(f)&&!f.toLowerCase().endsWith(".html")))continue;const d=f;try{if(j&&j.has&&j.has(d))continue}catch(m){console.warn("[htmlBuilder] mdToSlug check failed",m)}try{let m=!1;for(const b of W.values())if(b===d){m=!0;break}if(m)continue}catch(m){console.warn("[htmlBuilder] slugToMd iteration failed",m)}r.add(d)}catch(u){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",u)}if(!r.size)return;const i=async l=>{try{const u=await be(l,e);if(u&&u.raw)try{const o=($r||new DOMParser).parseFromString(u.raw,"text/html"),f=o.querySelector("title"),d=o.querySelector("h1"),m=f&&f.textContent&&f.textContent.trim()?f.textContent.trim():d&&d.textContent?d.textContent.trim():null;if(m){const b=ae(m);if(b)try{W.set(b,l),j.set(l,b)}catch(w){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",w)}}}catch(h){console.warn("[htmlBuilder] parse HTML title failed",h)}}catch(u){console.warn("[htmlBuilder] fetchAndExtract failed",u)}},n=5,s=Array.from(r);let a=0;const c=[];for(;a<s.length;){const l=s.slice(a,a+n);c.push(Promise.all(l.map(i))),a+=n}await Promise.all(c)}async function Fs(t,e){if(!t||!t.length)return;const r=[],i=new Set;let n="";try{const s=new URL(e);n=Rt(s.pathname)}catch(s){n="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",s)}for(const s of Array.from(t||[]))try{const a=s.getAttribute("href")||"";if(!a)continue;const c=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(c){let l=pe(c[1]);try{let u;try{u=new URL(l,e).pathname}catch(o){u=l,console.warn("[htmlBuilder] resolve mdPath URL failed",o)}const h=u.startsWith(n)?u.slice(n.length):u.replace(/^\//,"");r.push({rel:h}),j.has(h)||i.add(h)}catch(u){console.warn("[htmlBuilder] rewriteAnchors failed",u)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}i.size&&await Promise.all(Array.from(i).map(async s=>{try{const a=String(s).match(/([^\/]+)\.md$/),c=a&&a[1];if(c&&W.has(c)){try{const l=W.get(c);l&&j.set(l,c)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",l)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await be(s,e);if(a&&a.raw){const c=(a.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]){const l=ae(c[1].trim());if(l)try{W.set(l,s),j.set(s,l)}catch(u){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",u)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const $r=typeof DOMParser<"u"?new DOMParser:null;function Ws(t){try{const r=($r||new DOMParser).parseFromString(t||"","text/html");Cr(r);try{r.querySelectorAll("img").forEach(c=>{try{c.getAttribute("loading")||c.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",l)}})}catch(a){console.warn("[htmlBuilder] parseHtml query images failed",a)}r.querySelectorAll("pre code, code[class]").forEach(a=>{try{const c=a.getAttribute&&a.getAttribute("class")||a.className||"",l=c.match(/language-([a-zA-Z0-9_+-]+)/)||c.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const u=(l[1]||"").toLowerCase(),h=Y.size&&(Y.get(u)||Y.get(String(u).toLowerCase()))||u;try{(async()=>{try{await et(h)}catch(o){console.warn("[htmlBuilder] registerLanguage failed",o)}})()}catch(o){console.warn("[htmlBuilder] schedule registerLanguage failed",o)}}else try{if(ie&&typeof ie.getLanguage=="function"&&ie.getLanguage("plaintext")){const u=ie.highlight?ie.highlight(a.textContent||"",{language:"plaintext"}):null;u&&u.value&&(a.innerHTML=u.value)}}catch(u){console.warn("[htmlBuilder] plaintext highlight fallback failed",u)}}catch(c){console.warn("[htmlBuilder] code element processing failed",c)}});const n=[];return r.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(a=>{n.push({level:Number(a.tagName.substring(1)),text:(a.textContent||"").trim(),id:a.id})}),{html:r.body.innerHTML,meta:{},toc:n}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function Zs(t){const e=Sn?Sn(t||"",Y):new Set,r=new Set(e),i=[];for(const n of r)try{const s=Y.size&&(Y.get(n)||Y.get(String(n).toLowerCase()))||n;try{i.push(et(s))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(n)!==String(s))try{i.push(et(n))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(s){console.warn("[htmlBuilder] ensureLanguages inner failed",s)}try{await Promise.all(i)}catch(n){console.warn("[htmlBuilder] ensureLanguages failed",n)}}async function Qs(t){if(await Zs(t),Ut){const e=await Ut(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function Gs(t,e,r,i,n){let s=null;e.isHtml?s=Ws(e.raw||""):s=await Qs(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=s.html;try{Cr(a)}catch(o){console.warn("[htmlBuilder] addHeadingIds failed",o)}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const d=f.getAttribute&&f.getAttribute("class")||f.className||"",m=String(d||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{f.setAttribute&&f.setAttribute("class",m)}catch(b){f.className=m,console.warn("[htmlBuilder] set element class failed",b)}else try{f.removeAttribute&&f.removeAttribute("class")}catch(b){f.className="",console.warn("[htmlBuilder] remove element class failed",b)}}catch(d){console.warn("[htmlBuilder] code element cleanup failed",d)}})}catch(o){console.warn("[htmlBuilder] processing code elements failed",o)}try{qn(a)}catch(o){console.warn("[htmlBuilder] observeCodeBlocks failed",o)}Us(a,r,n);try{await Xs(a,n,r)}catch(o){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",o),await Pr(a,n,r)}const{topH1:c,h1Text:l,slugKey:u}=Hs(s,a,r,i),h=qs(t,s.toc,r);return{article:a,parsed:s,toc:h,topH1:c,h1Text:l,slugKey:u}}function Ir(t,e,r){t&&(t.innerHTML="");const i=document.createElement("article");i.className="nimbi-article content nimbi-not-found";const n=document.createElement("h1");n.textContent=e&&e("notFound")||"Page not found";const s=document.createElement("p");s.textContent=r&&r.message?String(r.message):"Failed to resolve the requested page.",i.appendChild(n),i.appendChild(s),t&&t.appendChild&&t.appendChild(i)}async function Xs(t,e,r){return Pr(t,e,r)}function Ks(t){try{t.addEventListener("click",e=>{const r=e.target&&e.target.closest?e.target.closest("a"):null;if(!r)return;const i=r.getAttribute("href")||"";try{const n=new URL(i,location.href),s=n.searchParams.get("page"),a=n.hash?n.hash.replace(/^#/,""):null;if(!s&&!a)return;e.preventDefault();let c=null;try{history&&history.state&&history.state.page&&(c=history.state.page)}catch(l){c=null,console.warn("[htmlBuilder] access history.state failed",l)}try{c||(c=new URL(location.href).searchParams.get("page"))}catch(l){console.warn("[htmlBuilder] parse current location failed",l)}if(!s&&a||s&&c&&String(s)===String(c)){try{if(!s&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}else try{history.replaceState({page:c||s},"","?page="+encodeURIComponent(c||s)+(a?"#"+encodeURIComponent(a):""))}catch(l){console.warn("[htmlBuilder] history.replaceState failed",l)}}catch(l){console.warn("[htmlBuilder] update history for anchor failed",l)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(l){console.warn("[htmlBuilder] stopPropagation failed",l)}try{En(a)}catch(l){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",l)}return}history.pushState({page:s},"","?page="+encodeURIComponent(s)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(l){console.warn("[htmlBuilder] window.renderByQuery failed",l)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(l){console.warn("[htmlBuilder] dispatch popstate failed",l)}else try{renderByQuery()}catch(l){console.warn("[htmlBuilder] renderByQuery failed",l)}}catch(l){console.warn("[htmlBuilder] SPA navigation invocation failed",l)}}catch(n){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",n)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function En(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const r=document.getElementById(t);if(r)try{const i=()=>{try{if(e&&e.scrollTo&&e.contains(r)){const n=r.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:n,behavior:"smooth"})}else try{r.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{r.scrollIntoView()}catch(s){console.warn("[htmlBuilder] scrollIntoView failed",s)}}}catch{try{r.scrollIntoView()}catch(s){console.warn("[htmlBuilder] final scroll fallback failed",s)}}};try{requestAnimationFrame(()=>setTimeout(i,50))}catch(n){console.warn("[htmlBuilder] scheduling scroll failed",n),setTimeout(i,50)}}catch(i){try{r.scrollIntoView()}catch(n){console.warn("[htmlBuilder] final scroll fallback failed",n)}console.warn("[htmlBuilder] doScroll failed",i)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(r){try{window.scrollTo(0,0)}catch(i){console.warn("[htmlBuilder] window.scrollTo failed",i)}console.warn("[htmlBuilder] scroll to top failed",r)}}function Ys(t,e,{mountOverlay:r=null,container:i=null,mountEl:n=null,navWrap:s=null,t:a=null}={}){try{const c=a||(b=>typeof b=="string"?b:""),l=i||document.querySelector(".nimbi-cms"),u=n||document.querySelector(".nimbi-mount"),h=r||document.querySelector(".nimbi-overlay"),o=s||document.querySelector(".nimbi-nav-wrap");let d=document.querySelector(".nimbi-scroll-top");if(!d){d=document.createElement("button"),d.className="nimbi-scroll-top",d.setAttribute("aria-label",c("scrollToTop")),d.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{h&&h.appendChild?h.appendChild(d):l&&l.appendChild?l.appendChild(d):u&&u.appendChild?u.appendChild(d):document.body.appendChild(d)}catch{try{document.body.appendChild(d)}catch(w){console.warn("[htmlBuilder] append scroll top button failed",w)}}try{d.style.position="absolute",d.style.right="1rem",d.style.bottom="1.25rem",d.style.zIndex="60"}catch(b){console.warn("[htmlBuilder] set scroll-top button styles failed",b)}d.addEventListener("click",()=>{try{i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):n&&n.scrollTo?n.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{i&&(i.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback container scrollTop failed",w)}try{n&&(n.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",w)}try{document.documentElement.scrollTop=0}catch(w){console.warn("[htmlBuilder] fallback document scrollTop failed",w)}}})}const m=o&&o.querySelector?o.querySelector(".menu-label"):null;if(e){if(!d._nimbiObserver){const b=new IntersectionObserver(w=>{for(const x of w)x.target instanceof Element&&(x.isIntersecting?(d.classList.remove("show"),m&&m.classList.remove("show")):(d.classList.add("show"),m&&m.classList.add("show")))},{root:i instanceof Element?i:n instanceof Element?n:null,threshold:0});d._nimbiObserver=b}try{d._nimbiObserver.disconnect()}catch(b){console.warn("[htmlBuilder] observer disconnect failed",b)}try{d._nimbiObserver.observe(e)}catch(b){console.warn("[htmlBuilder] observer observe failed",b)}try{const b=()=>{try{const w=l instanceof Element?l.getBoundingClientRect():{top:0,bottom:window.innerHeight},x=e.getBoundingClientRect();!(x.bottom<w.top||x.top>w.bottom)?(d.classList.remove("show"),m&&m.classList.remove("show")):(d.classList.add("show"),m&&m.classList.add("show"))}catch(w){console.warn("[htmlBuilder] checkIntersect failed",w)}};b(),"IntersectionObserver"in window||setTimeout(b,100)}catch(b){console.warn("[htmlBuilder] checkIntersect outer failed",b)}}else{d.classList.remove("show"),m&&m.classList.remove("show");const b=i instanceof Element?i:n instanceof Element?n:window,w=()=>{try{(b===window?window.scrollY:b.scrollTop||0)>10?(d.classList.add("show"),m&&m.classList.add("show")):(d.classList.remove("show"),m&&m.classList.remove("show"))}catch(x){console.warn("[htmlBuilder] onScroll handler failed",x)}};Tt(()=>b.addEventListener("scroll",w)),w()}}catch(c){console.warn("[htmlBuilder] ensureScrollTopButton failed",c)}}async function Vs(t,e,r,i,n,s,a,c,l="eager"){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const u=typeof DOMParser<"u"?new DOMParser:null,h=u?u.parseFromString(r||"","text/html"):null,o=h?h.querySelectorAll("a"):[];await Tt(()=>js(o,i)),await Tt(()=>Fs(o,i));let f=null,d=null,m=!1;const b=document.createElement("nav");b.className="navbar",b.setAttribute("role","navigation"),b.setAttribute("aria-label","main navigation");const w=document.createElement("div");w.className="navbar-brand";const x=o[0],y=document.createElement("a");if(y.className="navbar-item",x){const _=x.getAttribute("href")||"#";try{const B=new URL(_,location.href),T=B.searchParams.get("page");if(T)y.href="?page="+encodeURIComponent(decodeURIComponent(T));else if(B.hash&&/\.md$/.test(B.hash.replace(/^#/,""))){const v=B.hash.replace(/^#/,"");y.href="?page="+encodeURIComponent(v)}else{const v=(B.pathname||"").match(/([^\/]+\.md)(?:$|[?#])/);if(v){let E=pe(v[1]);y.href="?page="+encodeURIComponent(E)}else y.href=_}}catch{/^[#].*\.md$/.test(_)?y.href="?page="+encodeURIComponent(_.replace(/^#/,"")):/\.md$/.test(_)?y.href="?page="+encodeURIComponent(pe(_)):y.href=_}y.textContent=x.textContent||s("home")}else y.href="?page="+encodeURIComponent(n),y.textContent=s("home");w.appendChild(y),y.addEventListener("click",function(_){const B=y.getAttribute("href")||"";if(B.startsWith("?page=")){_.preventDefault();const T=new URL(B,location.href),v=T.searchParams.get("page"),E=T.hash?T.hash.replace(/^#/,""):null;history.pushState({page:v},"","?page="+encodeURIComponent(v)+(E?"#"+encodeURIComponent(E):""));try{a()}catch(L){console.warn("[nimbi-cms] renderByQuery failed",L)}}});const z=document.createElement("a");z.className="navbar-burger",z.setAttribute("role","button"),z.setAttribute("aria-label","menu"),z.setAttribute("aria-expanded","false");const P="nimbi-navbar-menu";z.dataset.target=P,z.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',w.appendChild(z);try{z.addEventListener("click",_=>{try{const B=z.dataset&&z.dataset.target?z.dataset.target:null,T=B?document.getElementById(B):null;z.classList.contains("is-active")?(z.classList.remove("is-active"),z.setAttribute("aria-expanded","false"),T&&T.classList.remove("is-active")):(z.classList.add("is-active"),z.setAttribute("aria-expanded","true"),T&&T.classList.add("is-active"))}catch(B){console.warn("[nimbi-cms] navbar burger toggle failed",B)}})}catch(_){console.warn("[nimbi-cms] burger event binding failed",_)}const X=document.createElement("div");X.className="navbar-menu",X.id=P;const V=document.createElement("div");V.className="navbar-start";let se,ce,ee;if(!c)se=null,d=null,ee=null;else{se=document.createElement("div"),se.className="navbar-end",ce=document.createElement("div"),ce.className="navbar-item",d=document.createElement("input"),d.className="input",d.type="search",d.placeholder=s("searchPlaceholder")||"",d.id="nimbi-search",l==="eager"&&(d.disabled=!0,d.classList.add("is-loading")),ce.appendChild(d),ee=document.createElement("div"),ee.id="nimbi-search-results",ee.className="box",ce.appendChild(ee),se.appendChild(ce);const _=T=>{if(ee.innerHTML="",!T.length){ee.style.display="none";return}T.forEach(v=>{const E=document.createElement("a");E.className="block",E.href="?page="+encodeURIComponent(v.slug),E.textContent=v.title,E.style.whiteSpace="nowrap",E.style.overflow="hidden",E.style.textOverflow="ellipsis",E.addEventListener("click",()=>{ee.style.display="none"}),ee.appendChild(E)}),ee.style.display="block",ee.style.right="0",ee.style.left="auto"},B=(T,v)=>{let E=null;return(...L)=>{E&&clearTimeout(E),E=setTimeout(()=>T(...L),v)}};if(d){const T=B(async()=>{const v=document.querySelector("input#nimbi-search"),E=String(v&&v.value||"").trim().toLowerCase();if(!E){_([]);return}try{const L=await Promise.resolve().then(()=>It);f||(f=(async()=>{try{return l==="lazy"&&L.buildSearchIndexWorker?L.buildSearchIndexWorker(i):L.buildSearchIndex(i)}catch(N){return console.warn("[nimbi-cms] buildSearchIndex failed",N),[]}finally{v&&(v.removeAttribute("disabled"),v.classList.remove("is-loading"))}})());const O=(await f).filter(N=>N.title&&N.title.toLowerCase().includes(E)||N.excerpt&&N.excerpt.toLowerCase().includes(E));_(O.slice(0,10))}catch(L){console.warn("[nimbi-cms] search input handler failed",L),_([])}},50);d&&d.addEventListener("input",T),document.addEventListener("click",v=>{const E=document.querySelector("input#nimbi-search");E&&!E.contains(v.target)&&ee&&!ee.contains(v.target)&&(ee.style.display="none")})}if(l==="eager"){try{f=(async()=>{try{const v=await(await Promise.resolve().then(()=>It)).buildSearchIndex(i);return m||(m=!0),v}catch(T){return console.warn("[nimbi-cms] buildSearchIndex failed",T),[]}})()}catch(T){console.warn("[nimbi-cms] eager search index init failed",T),f=Promise.resolve([])}f.finally(()=>{const T=document.querySelector("input#nimbi-search");T&&(T.removeAttribute("disabled"),T.classList.remove("is-loading"))})}}for(let _=0;_<o.length;_++){const B=o[_];if(_===0)continue;const T=B.getAttribute("href")||"#",v=document.createElement("a");v.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(T)||T.endsWith(".md")){const L=pe(T).split(/::|#/,2),g=L[0],O=L[1];v.href="?page="+encodeURIComponent(g)+(O?"#"+encodeURIComponent(O):"")}else if(/\.html(?:$|[#?])/.test(T)||T.endsWith(".html")){const L=pe(T).split(/::|#/,2);let g=L[0];g&&!g.toLowerCase().endsWith(".html")&&(g=g+".html");const O=L[1];try{const N=await be(g,i);if(N&&N.raw)try{const ve=new DOMParser().parseFromString(N.raw,"text/html"),fe=ve.querySelector("title"),me=ve.querySelector("h1"),he=fe&&fe.textContent&&fe.textContent.trim()?fe.textContent.trim():me&&me.textContent?me.textContent.trim():null;if(he){const Ee=ae(he);if(Ee){try{W.set(Ee,g),j.set(g,Ee)}catch(De){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",De)}v.href="?page="+encodeURIComponent(Ee)+(O?"#"+encodeURIComponent(O):"")}else v.href="?page="+encodeURIComponent(g)+(O?"#"+encodeURIComponent(O):"")}else v.href="?page="+encodeURIComponent(g)+(O?"#"+encodeURIComponent(O):"")}catch{v.href="?page="+encodeURIComponent(g)+(O?"#"+encodeURIComponent(O):"")}else v.href=T}catch{v.href=T}}else v.href=T}catch(E){console.warn("[nimbi-cms] nav item href parse failed",E),v.href=T}try{const E=B.textContent&&String(B.textContent).trim()?String(B.textContent).trim():null;if(E)try{const L=ae(E);if(L){const g=v.getAttribute&&v.getAttribute("href")?v.getAttribute("href"):"";try{const N=new URL(g,location.href).searchParams.get("page");if(N){const Z=decodeURIComponent(N);try{W.set(L,Z),j.set(Z,L)}catch(ve){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",ve)}}}catch(O){console.warn("[nimbi-cms] nav slug mapping failed",O)}}}catch(L){console.warn("[nimbi-cms] nav slug mapping failed",L)}}catch(E){console.warn("[nimbi-cms] nav slug mapping failed",E)}v.textContent=B.textContent||T,V.appendChild(v)}try{d=document.getElementById("nimbi-search");const _=document.getElementById("nimbi-search-results"),B=v=>{if(_.innerHTML="",!v.length){_.style.display="none";return}v.forEach(E=>{const L=document.createElement("a");L.className="block",L.href="?page="+encodeURIComponent(E.slug),L.textContent=E.title,L.style.whiteSpace="nowrap",L.style.overflow="hidden",L.style.textOverflow="ellipsis",L.addEventListener("click",()=>{_.style.display="none"}),_.appendChild(L)}),_.style.display="block",_.style.right="0",_.style.left="auto"},T=(v,E)=>{let L=null;return(...g)=>{L&&clearTimeout(L),L=setTimeout(()=>v(...g),E)}};if(d){const v=T(async()=>{const E=String(d.value||"").trim().toLowerCase();if(!E){B([]);return}try{const L=await Promise.resolve().then(()=>It);f||(f=(async()=>{try{return l==="lazy"&&L.buildSearchIndexWorker?L.buildSearchIndexWorker(i):L.buildSearchIndex(i)}catch(N){return console.warn("[nimbi-cms] buildSearchIndex failed",N),[]}finally{d&&(d.disabled=!1,d.classList.remove("is-loading"))}})());const O=(await f).filter(N=>N.title&&N.title.toLowerCase().includes(E)||N.excerpt&&N.excerpt.toLowerCase().includes(E));B(O.slice(0,10))}catch(L){console.warn("[nimbi-cms] search input handler failed",L),B([])}},50);d.addEventListener("input",v),document.addEventListener("click",E=>{d&&!d.contains(E.target)&&_&&!_.contains(E.target)&&(_.style.display="none")})}}catch(_){console.warn("[nimbi-cms] navbar/search setup inner failed",_)}X.appendChild(V),se&&X.appendChild(se),b.appendChild(w),b.appendChild(X),t.appendChild(b);try{X.addEventListener("click",_=>{const B=_.target&&_.target.closest?_.target.closest("a"):null;if(!B)return;const T=B.getAttribute("href")||"";try{const v=new URL(T,location.href),E=v.searchParams.get("page"),L=v.hash?v.hash.replace(/^#/,""):null;if(E){_.preventDefault(),history.pushState({page:E},"","?page="+encodeURIComponent(E)+(L?"#"+encodeURIComponent(L):""));try{a()}catch(g){console.warn("[nimbi-cms] renderByQuery failed",g)}}}catch(v){console.warn("[nimbi-cms] navbar click handler failed",v)}try{const v=b&&b.querySelector?b.querySelector(".navbar-burger"):null,E=v&&v.dataset?v.dataset.target:null,L=E?document.getElementById(E):null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),L&&L.classList.remove("is-active"))}catch(v){console.warn("[nimbi-cms] mobile menu close failed",v)}})}catch(_){console.warn("[nimbi-cms] attach content click handler failed",_)}try{e.addEventListener("click",_=>{const B=_.target&&_.target.closest?_.target.closest("a"):null;if(!B)return;const T=B.getAttribute("href")||"";if(T&&!Gn(T))try{const v=new URL(T,location.href),E=v.searchParams.get("page"),L=v.hash?v.hash.replace(/^#/,""):null;if(E){_.preventDefault(),history.pushState({page:E},"","?page="+encodeURIComponent(E)+(L?"#"+encodeURIComponent(L):""));try{a()}catch(g){console.warn("[nimbi-cms] renderByQuery failed",g)}}}catch(v){console.warn("[nimbi-cms] container click URL parse failed",v)}})}catch(_){console.warn("[nimbi-cms] build navbar failed",_)}return{navbar:b,linkEls:o}}var Rn,zr;function Js(){if(zr)return Rn;zr=1;function t(s,a){return a.some(([c,l])=>c<=s&&s<=l)}function e(s){if(typeof s!="string")return!1;const a=s.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function r(s){return` 
\r	`.includes(s)}function i(s){if(typeof s!="string")return!1;const a=s.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function n(s,a={}){let c=0,l=0,u=s.length-1;const h=a.wordsPerMinute||200,o=a.wordBound||r;for(;o(s[l]);)l++;for(;o(s[u]);)u--;const f=`${s}
`;for(let w=l;w<=u;w++)if((e(f[w])||!o(f[w])&&(o(f[w+1])||e(f[w+1])))&&c++,e(f[w]))for(;w<=u&&(i(f[w+1])||o(f[w+1]));)w++;const d=c/h,m=Math.round(d*60*1e3);return{text:Math.ceil(d.toFixed(2))+" min read",minutes:d,time:m,words:c}}return Rn=n,Rn}var ea=Js();const ta=On(ea);function Br(t,e){let r=document.querySelector(`meta[name="${t}"]`);r||(r=document.createElement("meta"),r.setAttribute("name",t),document.head.appendChild(r)),r.setAttribute("content",e)}function rt(t,e,r){let i=`meta[${t}="${e}"]`,n=document.querySelector(i);n||(n=document.createElement("meta"),n.setAttribute(t,e),document.head.appendChild(n)),n.setAttribute("content",r)}function na(t,e){try{let r=document.querySelector(`link[rel="${t}"]`);r||(r=document.createElement("link"),r.setAttribute("rel",t),document.head.appendChild(r)),r.setAttribute("href",e)}catch(r){console.warn("[seoManager] upsertLinkRel failed",r)}}function ra(t,e,r,i){const n=e&&String(e).trim()?e:t.title||document.title;rt("property","og:title",n);const s=i&&String(i).trim()?i:t.description||"";s&&String(s).trim()&&rt("property","og:description",s),rt("name","twitter:card",t.twitter_card||"summary_large_image");const a=r||t.image;a&&(rt("property","og:image",a),rt("name","twitter:image",a))}function ia(t,e,r,i,n=""){const s=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",c=i&&String(i).trim()?i:s.description&&String(s.description).trim()?s.description:a&&String(a).trim()?a:"";c&&String(c).trim()&&Br("description",c),Br("robots",s.robots||"index,follow"),ra(s,e,r,c)}function sa(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const r=document.querySelector(e);if(r){const i=r.getAttribute("content")||"";if(i&&i.trim())return i.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function aa(t,e,r,i,n,s=""){try{const a=t.meta||{},c=r&&String(r).trim()?r:a.title||s||document.title,l=n&&String(n).trim()?n:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=i||a.image||null;let h="";try{if(e){const m=pe(e);try{h=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(m)}catch{h=location.href.split("#")[0]}}else h=location.href.split("#")[0]}catch(m){h=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",m)}h&&na("canonical",h);try{rt("property","og:url",h)}catch(m){console.warn("[seoManager] upsertMeta og:url failed",m)}const o={"@context":"https://schema.org","@type":"Article",headline:c||"",description:l||"",url:h||location.href.split("#")[0]};u&&(o.image=String(u)),a.date&&(o.datePublished=a.date),a.dateModified&&(o.dateModified=a.dateModified);const f="nimbi-jsonld";let d=document.getElementById(f);d||(d=document.createElement("script"),d.type="application/ld+json",d.id=f,document.head.appendChild(d)),d.textContent=JSON.stringify(o,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function la(t,e,r,i,n,s,a,c,l,u,h){try{const o=i.querySelector(".menu-label");o&&(o.textContent=c&&c.textContent||t("onThisPage"))}catch(o){console.warn("[seoManager] update toc label failed",o)}try{const o=r.meta&&r.meta.title?String(r.meta.title).trim():"",f=n.querySelector("img"),d=f&&(f.getAttribute("src")||f.src)||null;let m="";try{let w="";try{const x=c||(n&&n.querySelector?n.querySelector("h1"):null);if(x){let y=x.nextElementSibling;const z=[];for(;y&&!(y.tagName&&y.tagName.toLowerCase()==="h2");){const P=(y.textContent||"").trim();P&&z.push(P),y=y.nextElementSibling}z.length&&(w=z.join(" ").replace(/\s+/g," ").trim()),!w&&l&&(w=String(l).trim())}}catch(x){console.warn("[seoManager] compute descOverride failed",x)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),m=w}catch(w){console.warn("[seoManager] compute descOverride failed",w)}try{ia(r,l,d,m)}catch(w){console.warn("[seoManager] setMetaTags failed",w)}try{aa(r,u,l,d,m,e)}catch(w){console.warn("[seoManager] setStructuredData failed",w)}const b=sa();l?b?document.title=`${b} - ${l}`:document.title=`${e||"Site"} - ${l}`:o?document.title=o:document.title=e||document.title}catch(o){console.warn("[seoManager] applyPageMeta failed",o)}try{const o=n.querySelector(".nimbi-reading-time");if(o&&o.remove(),l){const f=ta(h.raw||""),d=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,m=document.createElement("p");m.className="nimbi-reading-time",m.textContent=d?t("readingTime",{minutes:d}):"";const b=n.querySelector("h1");b&&b.insertAdjacentElement("afterend",m)}}catch(o){console.warn("[seoManager] reading time update failed",o)}}let ke=null,q=null,ye=1,Fe=(t,e)=>e,wt=0,bt=0,Ht=()=>{},kt=.25;function oa(){if(ke&&document.contains(ke))return ke;ke=null;const t=document.createElement("dialog");t.className="nimbi-image-preview",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Fe("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",g=>{g.target===t&&An()}),t.addEventListener("wheel",g=>{if(!_())return;g.preventDefault();const O=g.deltaY<0?kt:-kt;Ne(ye+O),u(),h()},{passive:!1}),t.addEventListener("keydown",g=>{if(g.key==="Escape"){An();return}if(ye>1){const O=t.querySelector(".nimbi-image-preview__image-wrapper");if(!O)return;const N=40;switch(g.key){case"ArrowUp":O.scrollTop-=N,g.preventDefault();break;case"ArrowDown":O.scrollTop+=N,g.preventDefault();break;case"ArrowLeft":O.scrollLeft-=N,g.preventDefault();break;case"ArrowRight":O.scrollLeft+=N,g.preventDefault();break}}}),document.body.appendChild(t),ke=t,q=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),r=t.querySelector("[data-nimbi-preview-original]"),i=t.querySelector("[data-nimbi-preview-zoom-in]"),n=t.querySelector("[data-nimbi-preview-zoom-out]"),s=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),c=t.querySelector("[data-nimbi-preview-zoom-label]"),l=t.querySelector("[data-nimbi-preview-zoom-hud]");function u(){c&&(c.textContent=`${Math.round(ye*100)}%`)}const h=()=>{l&&(l.textContent=`${Math.round(ye*100)}%`,l.classList.add("visible"),clearTimeout(l._timeout),l._timeout=setTimeout(()=>l.classList.remove("visible"),800))};Ht=u,i.addEventListener("click",()=>{Ne(ye+kt),u(),h()}),n.addEventListener("click",()=>{Ne(ye-kt),u(),h()}),e.addEventListener("click",()=>{yt(),u(),h()}),r.addEventListener("click",()=>{Ne(1),u(),h()}),s.addEventListener("click",()=>{yt(),u(),h()}),a.addEventListener("click",An),e.title=Fe("imagePreviewFit","Fit to screen"),r.title=Fe("imagePreviewOriginal","Original size"),n.title=Fe("imagePreviewZoomOut","Zoom out"),i.title=Fe("imagePreviewZoomIn","Zoom in"),a.title=Fe("imagePreviewClose","Close"),a.setAttribute("aria-label",Fe("imagePreviewClose","Close"));let o=!1,f=0,d=0,m=0,b=0;const w=new Map;let x=0,y=1;const z=(g,O)=>{const N=g.x-O.x,Z=g.y-O.y;return Math.hypot(N,Z)},P=()=>{o=!1,w.clear(),x=0,q&&(q.style.cursor="all-scroll")};let X=0,V=0,se=0;const ce=g=>{const O=Date.now(),N=O-X,Z=g.clientX-V,ve=g.clientY-se;X=O,V=g.clientX,se=g.clientY,N<300&&Math.hypot(Z,ve)<30&&(Ne(ye>1?1:2),u(),g.preventDefault())},ee=g=>{Ne(ye>1?1:2),u(),g.preventDefault()},_=()=>ke?typeof ke.open=="boolean"?ke.open:ke.classList.contains("is-active"):!1,B=(g,O,N=1)=>{if(w.has(N)&&w.set(N,{x:g,y:O}),w.size===2){const me=Array.from(w.values()),he=z(me[0],me[1]);if(x>0){const Ee=he/x;Ne(y*Ee)}return}if(!o)return;const Z=q.closest(".nimbi-image-preview__image-wrapper");if(!Z)return;const ve=g-f,fe=O-d;Z.scrollLeft=m-ve,Z.scrollTop=b-fe},T=(g,O,N=1)=>{if(!_())return;if(w.set(N,{x:g,y:O}),w.size===2){const fe=Array.from(w.values());x=z(fe[0],fe[1]),y=ye;return}const Z=q.closest(".nimbi-image-preview__image-wrapper");!Z||!(Z.scrollWidth>Z.clientWidth||Z.scrollHeight>Z.clientHeight)||(o=!0,f=g,d=O,m=Z.scrollLeft,b=Z.scrollTop,q.style.cursor="all-scroll",window.addEventListener("pointermove",v),window.addEventListener("pointerup",E),window.addEventListener("pointercancel",E))},v=g=>{o&&(g.preventDefault(),B(g.clientX,g.clientY,g.pointerId))},E=()=>{P(),window.removeEventListener("pointermove",v),window.removeEventListener("pointerup",E),window.removeEventListener("pointercancel",E)};q.addEventListener("pointerdown",g=>{g.preventDefault(),T(g.clientX,g.clientY,g.pointerId)}),q.addEventListener("pointermove",g=>{(o||w.size===2)&&g.preventDefault(),B(g.clientX,g.clientY,g.pointerId)}),q.addEventListener("pointerup",g=>{g.preventDefault(),g.pointerType==="touch"&&ce(g),P()}),q.addEventListener("dblclick",ee),q.addEventListener("pointercancel",P),q.addEventListener("mousedown",g=>{g.preventDefault(),T(g.clientX,g.clientY,1)}),q.addEventListener("mousemove",g=>{o&&g.preventDefault(),B(g.clientX,g.clientY,1)}),q.addEventListener("mouseup",g=>{g.preventDefault(),P()});const L=t.querySelector(".nimbi-image-preview__image-wrapper");return L&&(L.addEventListener("pointerdown",g=>{T(g.clientX,g.clientY,g.pointerId)}),L.addEventListener("pointermove",g=>{B(g.clientX,g.clientY,g.pointerId)}),L.addEventListener("pointerup",P),L.addEventListener("pointercancel",P),L.addEventListener("mousedown",g=>{T(g.clientX,g.clientY,1)}),L.addEventListener("mousemove",g=>{B(g.clientX,g.clientY,1)}),L.addEventListener("mouseup",P)),t}function Ne(t){if(!q)return;const e=Number(t);ye=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const i=q.getBoundingClientRect(),n=wt||q.naturalWidth||q.width||i.width||0,s=bt||q.naturalHeight||q.height||i.height||0;n&&s?(q.style.maxWidth="none",q.style.maxHeight="none",q.style.width=`${n*ye}px`,q.style.height=`${s*ye}px`,q.style.transform=""):(q.style.maxWidth="",q.style.maxHeight="",q.style.width="",q.style.height="",q.style.transform=`scale(${ye})`),q&&(q.style.cursor="all-scroll")}function yt(){if(!q)return;const t=q.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const r=wt||q.naturalWidth||e.width,i=bt||q.naturalHeight||e.height;if(!r||!i)return;const n=e.width/r,s=e.height/i,a=Math.min(n,s,1);Ne(Number.isFinite(a)?a:1)}function ca(t,e="",r=0,i=0){const n=oa();ye=1,wt=r||0,bt=i||0,q.src=t,q.alt=e,q.style.transform="scale(1)";const s=()=>{wt=q.naturalWidth||q.width||0,bt=q.naturalHeight||q.height||0};if(s(),yt(),Ht(),requestAnimationFrame(()=>{yt(),Ht()}),!wt||!bt){const a=()=>{s(),requestAnimationFrame(()=>{yt(),Ht()}),q.removeEventListener("load",a)};q.addEventListener("load",a)}typeof n.showModal=="function"&&(n.open||n.showModal()),n.classList.add("is-active"),n.focus()}function An(){ke&&(typeof ke.close=="function"&&ke.open&&ke.close(),ke.classList.remove("is-active"))}function ua(t,{t:e,zoomStep:r=.25}={}){if(!t||!t.querySelectorAll)return;Fe=(d,m)=>(typeof e=="function"?e(d):void 0)||m,kt=r,t.addEventListener("click",d=>{const m=d.target;if(!m||m.tagName!=="IMG")return;const b=m;if(b.src){if(d.defaultPrevented!==!0){const w=b.closest("a");w&&w.getAttribute("href")&&d.preventDefault()}ca(b.src,b.alt||"",b.naturalWidth||0,b.naturalHeight||0)}});let i=!1,n=0,s=0,a=0,c=0;const l=new Map;let u=0,h=1;const o=(d,m)=>{const b=d.x-m.x,w=d.y-m.y;return Math.hypot(b,w)};t.addEventListener("pointerdown",d=>{const m=d.target;if(!m||m.tagName!=="IMG"||!ke||!ke.open)return;if(l.set(d.pointerId,{x:d.clientX,y:d.clientY}),l.size===2){const w=Array.from(l.values());u=o(w[0],w[1]),h=ye;return}const b=m.closest(".nimbi-image-preview__image-wrapper");b&&(ye<=1||(d.preventDefault(),i=!0,n=d.clientX,s=d.clientY,a=b.scrollLeft,c=b.scrollTop,m.setPointerCapture(d.pointerId),m.style.cursor="grabbing"))}),t.addEventListener("pointermove",d=>{if(l.has(d.pointerId)&&l.set(d.pointerId,{x:d.clientX,y:d.clientY}),l.size===2){d.preventDefault();const y=Array.from(l.values()),z=o(y[0],y[1]);if(u>0){const P=z/u;Ne(h*P)}return}if(!i)return;d.preventDefault();const b=d.target.closest(".nimbi-image-preview__image-wrapper");if(!b)return;const w=d.clientX-n,x=d.clientY-s;b.scrollLeft=a-w,b.scrollTop=c-x});const f=()=>{i=!1,l.clear(),u=0};t.addEventListener("pointerup",f),t.addEventListener("pointercancel",f)}function ha(t){const{contentWrap:e,navWrap:r,container:i,mountOverlay:n=null,t:s,contentBase:a,homePage:c,initialDocumentTitle:l,runHooks:u}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let h=null;const o=Ds(s,[{path:c,name:s("home"),isIndex:!0,children:[]}]);async function f(x,y){let z,P,X;try{({data:z,pagePath:P,anchor:X}=await Fi(x,a))}catch(T){console.error("[nimbi-cms] fetchPageData failed",T),Ir(e,s,T);return}!X&&y&&(X=y);try{En(null)}catch(T){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",T)}e.innerHTML="";const{article:V,parsed:se,toc:ce,topH1:ee,h1Text:_,slugKey:B}=await Gs(s,z,P,X,a);la(s,l,se,ce,V,P,X,ee,_,B,z),r.innerHTML="",r.appendChild(ce),Ks(ce);try{await u("transformHtml",{article:V,parsed:se,toc:ce,pagePath:P,anchor:X,topH1:ee,h1Text:_,slugKey:B,data:z})}catch(T){console.warn("[nimbi-cms] transformHtml hooks failed",T)}e.appendChild(V);try{ua(V,{t:s})}catch(T){console.warn("[nimbi-cms] attachImagePreview failed",T)}try{At(i,100,!1),requestAnimationFrame(()=>At(i,100,!1)),setTimeout(()=>At(i,100,!1),250)}catch(T){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",T)}En(X),Ys(V,ee,{mountOverlay:n,container:i,navWrap:r,t:s});try{await u("onPageLoad",{data:z,pagePath:P,anchor:X,article:V,toc:ce,topH1:ee,h1Text:_,slugKey:B,contentWrap:e,navWrap:r})}catch(T){console.warn("[nimbi-cms] onPageLoad hooks failed",T)}h=P}async function d(){let x=new URLSearchParams(location.search).get("page")||c;const y=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await f(x,y)}catch(z){console.warn("[nimbi-cms] renderByQuery failed for",x,z),Ir(e,s,z)}}window.addEventListener("popstate",d);const m=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,b=()=>{try{const x=i||document.querySelector(".nimbi-cms");if(!x)return;const y={top:x.scrollTop||0,left:x.scrollLeft||0};sessionStorage.setItem(m(),JSON.stringify(y))}catch{}},w=()=>{try{const x=i||document.querySelector(".nimbi-cms");if(!x)return;const y=sessionStorage.getItem(m());if(!y)return;const z=JSON.parse(y);z&&typeof z.top=="number"&&x.scrollTo({top:z.top,left:z.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",x=>{if(x.persisted)try{w(),At(i,100,!1)}catch(y){console.warn("[nimbi-cms] bfcache restore failed",y)}}),window.addEventListener("pagehide",()=>{try{b()}catch(x){console.warn("[nimbi-cms] save scroll position failed",x)}}),{renderByQuery:d,siteNav:o,getCurrentPagePath:()=>h}}function da(t){try{const e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e)return{};const r=new URLSearchParams(e.startsWith("?")?e.slice(1):e),i={},n=s=>{if(s==null)return;const a=String(s).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(r.has("contentPath")&&(i.contentPath=r.get("contentPath")),r.has("searchIndex")){const s=n(r.get("searchIndex"));typeof s=="boolean"&&(i.searchIndex=s)}if(r.has("searchIndexMode")){const s=r.get("searchIndexMode");(s==="eager"||s==="lazy")&&(i.searchIndexMode=s)}if(r.has("defaultStyle")){const s=r.get("defaultStyle");(s==="light"||s==="dark")&&(i.defaultStyle=s)}if(r.has("bulmaCustomize")&&(i.bulmaCustomize=r.get("bulmaCustomize")),r.has("lang")&&(i.lang=r.get("lang")),r.has("l10nFile")){const s=r.get("l10nFile");i.l10nFile=s==="null"?null:s}if(r.has("cacheTtlMinutes")){const s=Number(r.get("cacheTtlMinutes"));Number.isFinite(s)&&s>=0&&(i.cacheTtlMinutes=s)}if(r.has("cacheMaxEntries")){const s=Number(r.get("cacheMaxEntries"));Number.isInteger(s)&&s>=0&&(i.cacheMaxEntries=s)}return r.has("homePage")&&(i.homePage=r.get("homePage")),r.has("notFoundPage")&&(i.notFoundPage=r.get("notFoundPage")),r.has("availableLanguages")&&(i.availableLanguages=r.get("availableLanguages").split(",").map(s=>s.trim()).filter(Boolean)),i}catch{return{}}}function pa(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function Or(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let Tn="";async function fa(t={}){if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const e=da();if(e&&(e.contentPath||e.homePage||e.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(g){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",g)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(g){console.warn("[nimbi-cms] logging ignore of URL overrides failed",g)}delete e.contentPath,delete e.homePage,delete e.notFoundPage}const r=Object.assign({},e,t),{el:i,contentPath:n="/content",crawlMaxQueue:s=1e3,searchIndex:a=!0,searchIndexMode:c="eager",defaultStyle:l="light",bulmaCustomize:u="none",lang:h=void 0,l10nFile:o=null,cacheTtlMinutes:f=5,cacheMaxEntries:d,markdownExtensions:m,availableLanguages:b,homePage:w="_home.md",notFoundPage:x="_404.md"}=r;if(r.contentPath!=null&&!pa(r.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(r.homePage!=null&&!Or(r.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(r.notFoundPage!=null&&!Or(r.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!i)throw new Error("el is required");let y=i;if(typeof i=="string"){if(y=document.querySelector(i),!y)throw new Error(`el selector "${i}" did not match any element`)}else if(!(i instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof n!="string"||!n.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(c!=null&&c!=="eager"&&c!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=="light"&&l!=="dark")throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');if(u!=null&&typeof u!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(o!=null&&typeof o!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(f!=null&&(typeof f!="number"||!Number.isFinite(f)||f<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(d!=null&&(typeof d!="number"||!Number.isInteger(d)||d<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(m!=null&&(!Array.isArray(m)||m.some(g=>!g||typeof g!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(b!=null&&(!Array.isArray(b)||b.some(g=>typeof g!="string"||!g.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(w!=null&&(typeof w!="string"||!w.trim()||!/\.(md|html)$/.test(w)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(x!=null&&(typeof x!="string"||!x.trim()||!/\.(md|html)$/.test(x)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const z=!!a;try{y.classList.add("nimbi-mount"),y.style.position=y.style.position||"relative",y.style.overflow=y.style.overflow||"hidden"}catch(g){console.warn("[nimbi-cms] mount element setup failed",g)}const P=document.createElement("div");P.className="nimbi-cms";try{P.style.position=P.style.position||"relative",P.style.overflow=P.style.overflow||"auto";try{P.style.webkitOverflowScrolling||(P.style.webkitOverflowScrolling="touch")}catch(g){console.warn("[nimbi-cms] set container webkitOverflowScrolling failed",g)}P.style.width=P.style.width||"100%",P.style.height=P.style.height||"100%",P.style.boxSizing=P.style.boxSizing||"border-box"}catch(g){console.warn("[nimbi-cms] container style setup failed",g)}const X=document.createElement("div");X.className="columns";const V=document.createElement("div");V.className="column is-full-mobile is-3-tablet nimbi-nav-wrap",V.setAttribute("role","navigation");try{const g=typeof nt=="function"?nt("navigation"):null;g&&V.setAttribute("aria-label",g)}catch(g){console.warn("[nimbi-cms] set nav aria-label failed",g)}X.appendChild(V);const se=document.createElement("div");se.className="column nimbi-content",se.setAttribute("role","main"),X.appendChild(se),P.appendChild(X);const ce=V,ee=se;y.appendChild(P);let _=null;try{_=y.querySelector(".nimbi-overlay"),_||(_=document.createElement("div"),_.className="nimbi-overlay",y.appendChild(_))}catch(g){_=null,console.warn("[nimbi-cms] mount overlay setup failed",g)}const B=location.pathname||"/",T=B.endsWith("/")?B:B.substring(0,B.lastIndexOf("/")+1);try{Tn=document.title||""}catch(g){Tn="",console.warn("[nimbi-cms] read initial document title failed",g)}let v=n;v.startsWith("./")&&(v=v.slice(2)),v.startsWith("/")&&(v=v.slice(1)),v.endsWith("/")||(v=v+"/");const E=new URL(T+v,location.origin).toString();o&&await nn(o,T),b&&Array.isArray(b)&&Xn(b),h&&rn(h);const L=ha({contentWrap:ee,navWrap:ce,container:P,mountOverlay:_,t:nt,contentBase:E,homePage:w,initialDocumentTitle:Tn,runHooks:Kt});if(typeof f=="number"&&f>=0&&typeof sr=="function"&&sr(f*60*1e3),typeof d=="number"&&d>=0&&typeof ir=="function"&&ir(d),m&&Array.isArray(m)&&m.length)try{m.forEach(g=>{typeof g=="object"&&Ns&&typeof xn=="function"&&xn(g)})}catch(g){console.warn("[nimbi-cms] applying markdownExtensions failed",g)}try{typeof s=="number"&&Promise.resolve().then(()=>It).then(({setDefaultCrawlMaxQueue:g})=>{try{g(s)}catch(O){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",O)}})}catch(g){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",g)}try{Mt(E)}catch(g){console.warn("[nimbi-cms] setContentBase failed",g)}try{on(x)}catch(g){console.warn("[nimbi-cms] setNotFoundPage failed",g)}try{Mt(E)}catch(g){console.warn("[nimbi-cms] setContentBase failed",g)}try{on(x)}catch(g){console.warn("[nimbi-cms] setNotFoundPage failed",g)}try{await be(w,E)}catch(g){throw w==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${w} not found at ${E}${w}: ${g.message}`)}Hn(l),await Un(u,T);try{const g=document.createElement("header");g.className="nimbi-site-navbar",y.insertBefore(g,P);const O=await be("_navigation.md",E),N=await Ut(O.raw||""),{navbar:Z,linkEls:ve}=await Vs(g,P,N.html||"",E,w,nt,L.renderByQuery,z,c);try{await Kt("onNavBuild",{navWrap:ce,navbar:Z,linkEls:ve,contentBase:E})}catch(fe){console.warn("[nimbi-cms] onNavBuild hooks failed",fe)}try{const fe=()=>{const me=g&&g.getBoundingClientRect&&Math.round(g.getBoundingClientRect().height)||g&&g.offsetHeight||0;if(me>0){try{y.style.setProperty("--nimbi-site-navbar-height",`${me}px`)}catch(he){console.warn("[nimbi-cms] set CSS var failed",he)}try{P.style.paddingTop=""}catch(he){console.warn("[nimbi-cms] set container paddingTop failed",he)}try{const he=y&&y.getBoundingClientRect&&Math.round(y.getBoundingClientRect().height)||y&&y.clientHeight||0;if(he>0){const Ee=Math.max(0,he-me);try{P.style.boxSizing="border-box"}catch(De){console.warn("[nimbi-cms] set container boxSizing failed",De)}try{P.style.height=`${Ee}px`}catch(De){console.warn("[nimbi-cms] set container height failed",De)}try{P.style.setProperty("--nimbi-cms-height",`${Ee}px`)}catch(De){console.warn("[nimbi-cms] set --nimbi-cms-height failed",De)}}else{try{P.style.height="calc(100% - var(--nimbi-site-navbar-height))"}catch(Ee){console.warn("[nimbi-cms] set container height failed",Ee)}try{P.style.setProperty("--nimbi-cms-height","calc(100% - var(--nimbi-site-navbar-height))")}catch(Ee){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Ee)}}}catch(he){console.warn("[nimbi-cms] compute container height failed",he)}try{g.style.setProperty("--nimbi-site-navbar-height",`${me}px`)}catch(he){console.warn("[nimbi-cms] set navbar CSS var failed",he)}}};fe();try{if(typeof ResizeObserver<"u"){const me=new ResizeObserver(()=>fe());try{me.observe(g)}catch(he){console.warn("[nimbi-cms] ResizeObserver.observe failed",he)}}}catch(me){console.warn("[nimbi-cms] ResizeObserver setup failed",me)}}catch(fe){console.warn("[nimbi-cms] compute navbar height failed",fe)}}catch(g){console.warn("[nimbi-cms] build navigation failed",g)}await L.renderByQuery();try{Promise.resolve().then(()=>ga).then(({getVersion:g})=>{typeof g=="function"&&g().then(O=>{try{const N=O||"0.0.0",Z=document.createElement("div");Z.className="nimbi-version-label",Z.textContent=`Ninbi CMS v. ${N}`,Z.style.position="absolute",Z.style.left="8px",Z.style.bottom="6px",Z.style.fontSize="11px",Z.style.opacity="0.6",Z.style.pointerEvents="none",Z.style.zIndex="9999",Z.style.userSelect="none";try{y.appendChild(Z)}catch(ve){console.warn("[nimbi-cms] append version label failed",ve)}}catch(N){console.warn("[nimbi-cms] building version label failed",N)}}).catch(O=>{console.warn("[nimbi-cms] getVersion() failed",O)})}).catch(g=>{console.warn("[nimbi-cms] import version module failed",g)})}catch(g){console.warn("[nimbi-cms] version label setup failed",g)}}async function Nr(){try{let t=null;try{t=await Promise.resolve().then(()=>Kr)}catch{try{t=await Promise.resolve().then(()=>Kr)}catch{t=null}}const e=t?.default?.version||t?.version;return typeof e=="string"&&e.trim()?e:"0.0.0"}catch{return"0.0.0"}}const ga=Object.freeze(Object.defineProperty({__proto__:null,getVersion:Nr},Symbol.toStringTag,{value:"Module"})),Dr="nimbi-cms",qr="0.1.0",Ur="module",Hr={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},jr={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},Fr={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},Wr="dist/nimbi-cms.cjs.js",Zr="dist/nimbi-cms.es.js",Qr="src/index.d.ts",Gr="dist/nimbi-cms.js",Xr=["dist","src/index.d.ts"],Kr=Object.freeze(Object.defineProperty({__proto__:null,default:{name:Dr,version:qr,private:!0,type:Ur,scripts:Hr,dependencies:jr,devDependencies:Fr,main:Wr,module:Zr,types:Qr,unpkg:Gr,files:Xr},dependencies:jr,devDependencies:Fr,files:Xr,main:Wr,module:Zr,name:Dr,scripts:Hr,type:Ur,types:Qr,unpkg:Gr,version:qr},Symbol.toStringTag,{value:"Module"}));re.BAD_LANGUAGES=Vt,re.SUPPORTED_HLJS_MAP=Y,re._clearHooks=mi,re.addHook=St,re.default=fa,re.ensureBulma=Un,re.getVersion=Nr,re.loadL10nFile=nn,re.loadSupportedLanguages=Jt,re.observeCodeBlocks=qn,re.onNavBuild=fi,re.onPageLoad=pi,re.registerLanguage=et,re.runHooks=Kt,re.setHighlightTheme=xi,re.setLang=rn,re.setStyle=Hn,re.setThemeVars=vi,re.t=nt,re.transformHtml=gi,Object.defineProperties(re,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
