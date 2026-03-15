"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const vt={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Jt(t,e){if(!Object.prototype.hasOwnProperty.call(vt,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");vt[t].push(e)}function ws(t){Jt("onPageLoad",t)}function bs(t){Jt("onNavBuild",t)}function ys(t){Jt("transformHtml",t)}async function bn(t,e){const n=vt[t]||[];for(const s of n)try{await s(e)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function ks(){Object.keys(vt).forEach(t=>{vt[t].length=0})}function $r(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var hn,cr;function xs(){if(cr)return hn;cr=1;function t(g){return g instanceof Map?g.clear=g.delete=g.set=function(){throw new Error("map is read-only")}:g instanceof Set&&(g.add=g.clear=g.delete=function(){throw new Error("set is read-only")}),Object.freeze(g),Object.getOwnPropertyNames(g).forEach(S=>{const L=g[S],W=typeof L;(W==="object"||W==="function")&&!Object.isFrozen(L)&&t(L)}),g}class e{constructor(S){S.data===void 0&&(S.data={}),this.data=S.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(g){return g.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(g,...S){const L=Object.create(null);for(const W in g)L[W]=g[W];return S.forEach(function(W){for(const de in W)L[de]=W[de]}),L}const r="</span>",i=g=>!!g.scope,a=(g,{prefix:S})=>{if(g.startsWith("language:"))return g.replace("language:","language-");if(g.includes(".")){const L=g.split(".");return[`${S}${L.shift()}`,...L.map((W,de)=>`${W}${"_".repeat(de+1)}`)].join(" ")}return`${S}${g}`};class u{constructor(S,L){this.buffer="",this.classPrefix=L.classPrefix,S.walk(this)}addText(S){this.buffer+=n(S)}openNode(S){if(!i(S))return;const L=a(S.scope,{prefix:this.classPrefix});this.span(L)}closeNode(S){i(S)&&(this.buffer+=r)}value(){return this.buffer}span(S){this.buffer+=`<span class="${S}">`}}const o=(g={})=>{const S={children:[]};return Object.assign(S,g),S};class l{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(S){this.top.children.push(S)}openNode(S){const L=o({scope:S});this.add(L),this.stack.push(L)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(S){return this.constructor._walk(S,this.rootNode)}static _walk(S,L){return typeof L=="string"?S.addText(L):L.children&&(S.openNode(L),L.children.forEach(W=>this._walk(S,W)),S.closeNode(L)),S}static _collapse(S){typeof S!="string"&&S.children&&(S.children.every(L=>typeof L=="string")?S.children=[S.children.join("")]:S.children.forEach(L=>{l._collapse(L)}))}}class c extends l{constructor(S){super(),this.options=S}addText(S){S!==""&&this.add(S)}startScope(S){this.openNode(S)}endScope(){this.closeNode()}__addSublanguage(S,L){const W=S.root;L&&(W.scope=`language:${L}`),this.add(W)}toHTML(){return new u(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function h(g){return g?typeof g=="string"?g:g.source:null}function f(g){return m("(?=",g,")")}function p(g){return m("(?:",g,")*")}function d(g){return m("(?:",g,")?")}function m(...g){return g.map(L=>h(L)).join("")}function w(g){const S=g[g.length-1];return typeof S=="object"&&S.constructor===Object?(g.splice(g.length-1,1),S):{}}function k(...g){return"("+(w(g).capture?"":"?:")+g.map(W=>h(W)).join("|")+")"}function x(g){return new RegExp(g.toString()+"|").exec("").length-1}function C(g,S){const L=g&&g.exec(S);return L&&L.index===0}const I=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function M(g,{joinWith:S}){let L=0;return g.map(W=>{L+=1;const de=L;let pe=h(W),P="";for(;pe.length>0;){const $=I.exec(pe);if(!$){P+=pe;break}P+=pe.substring(0,$.index),pe=pe.substring($.index+$[0].length),$[0][0]==="\\"&&$[1]?P+="\\"+String(Number($[1])+de):(P+=$[0],$[0]==="("&&L++)}return P}).map(W=>`(${W})`).join(S)}const z=/\b\B/,N="[a-zA-Z]\\w*",K="[a-zA-Z_]\\w*",J="\\b\\d+(\\.\\d+)?",se="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",j="\\b(0b[01]+)",Q="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",O=(g={})=>{const S=/^#![ ]*\//;return g.binary&&(g.begin=m(S,/.*\b/,g.binary,/\b.*/)),s({scope:"meta",begin:S,end:/$/,relevance:0,"on:begin":(L,W)=>{L.index!==0&&W.ignoreMatch()}},g)},A={begin:"\\\\[\\s\\S]",relevance:0},T={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[A]},b={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[A]},v={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},R=function(g,S,L={}){const W=s({scope:"comment",begin:g,end:S,contains:[]},L);W.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const de=k("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return W.contains.push({begin:m(/[ ]+/,"(",de,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),W},y=R("//","$"),H=R("/\\*","\\*/"),G=R("#","$"),ge={scope:"number",begin:J,relevance:0},ke={scope:"number",begin:se,relevance:0},ee={scope:"number",begin:j,relevance:0},oe={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[A,{begin:/\[/,end:/\]/,relevance:0,contains:[A]}]},me={scope:"title",begin:N,relevance:0},Ue={scope:"title",begin:K,relevance:0},qe={begin:"\\.\\s*"+K,relevance:0};var Mt=Object.freeze({__proto__:null,APOS_STRING_MODE:T,BACKSLASH_ESCAPE:A,BINARY_NUMBER_MODE:ee,BINARY_NUMBER_RE:j,COMMENT:R,C_BLOCK_COMMENT_MODE:H,C_LINE_COMMENT_MODE:y,C_NUMBER_MODE:ke,C_NUMBER_RE:se,END_SAME_AS_BEGIN:function(g){return Object.assign(g,{"on:begin":(S,L)=>{L.data._beginMatch=S[1]},"on:end":(S,L)=>{L.data._beginMatch!==S[1]&&L.ignoreMatch()}})},HASH_COMMENT_MODE:G,IDENT_RE:N,MATCH_NOTHING_RE:z,METHOD_GUARD:qe,NUMBER_MODE:ge,NUMBER_RE:J,PHRASAL_WORDS_MODE:v,QUOTE_STRING_MODE:b,REGEXP_MODE:oe,RE_STARTERS_RE:Q,SHEBANG:O,TITLE_MODE:me,UNDERSCORE_IDENT_RE:K,UNDERSCORE_TITLE_MODE:Ue});function Pi(g,S){g.input[g.index-1]==="."&&S.ignoreMatch()}function Ii(g,S){g.className!==void 0&&(g.scope=g.className,delete g.className)}function zi(g,S){S&&g.beginKeywords&&(g.begin="\\b("+g.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",g.__beforeBegin=Pi,g.keywords=g.keywords||g.beginKeywords,delete g.beginKeywords,g.relevance===void 0&&(g.relevance=0))}function Bi(g,S){Array.isArray(g.illegal)&&(g.illegal=k(...g.illegal))}function Ni(g,S){if(g.match){if(g.begin||g.end)throw new Error("begin & end are not supported with match");g.begin=g.match,delete g.match}}function Oi(g,S){g.relevance===void 0&&(g.relevance=1)}const Di=(g,S)=>{if(!g.beforeMatch)return;if(g.starts)throw new Error("beforeMatch cannot be used with starts");const L=Object.assign({},g);Object.keys(g).forEach(W=>{delete g[W]}),g.keywords=L.keywords,g.begin=m(L.beforeMatch,f(L.begin)),g.starts={relevance:0,contains:[Object.assign(L,{endsParent:!0})]},g.relevance=0,delete L.beforeMatch},Hi=["of","and","for","in","not","or","if","then","parent","list","value"],Ui="keyword";function Gn(g,S,L=Ui){const W=Object.create(null);return typeof g=="string"?de(L,g.split(" ")):Array.isArray(g)?de(L,g):Object.keys(g).forEach(function(pe){Object.assign(W,Gn(g[pe],S,pe))}),W;function de(pe,P){S&&(P=P.map($=>$.toLowerCase())),P.forEach(function($){const F=$.split("|");W[F[0]]=[pe,qi(F[0],F[1])]})}}function qi(g,S){return S?Number(S):ji(g)?0:1}function ji(g){return Hi.includes(g.toLowerCase())}const Qn={},Ke=g=>{console.error(g)},Xn=(g,...S)=>{console.log(`WARN: ${g}`,...S)},tt=(g,S)=>{Qn[`${g}/${S}`]||(console.log(`Deprecated as of ${g}. ${S}`),Qn[`${g}/${S}`]=!0)},_t=new Error;function Kn(g,S,{key:L}){let W=0;const de=g[L],pe={},P={};for(let $=1;$<=S.length;$++)P[$+W]=de[$],pe[$+W]=!0,W+=x(S[$-1]);g[L]=P,g[L]._emit=pe,g[L]._multi=!0}function Fi(g){if(Array.isArray(g.begin)){if(g.skip||g.excludeBegin||g.returnBegin)throw Ke("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),_t;if(typeof g.beginScope!="object"||g.beginScope===null)throw Ke("beginScope must be object"),_t;Kn(g,g.begin,{key:"beginScope"}),g.begin=M(g.begin,{joinWith:""})}}function Wi(g){if(Array.isArray(g.end)){if(g.skip||g.excludeEnd||g.returnEnd)throw Ke("skip, excludeEnd, returnEnd not compatible with endScope: {}"),_t;if(typeof g.endScope!="object"||g.endScope===null)throw Ke("endScope must be object"),_t;Kn(g,g.end,{key:"endScope"}),g.end=M(g.end,{joinWith:""})}}function Zi(g){g.scope&&typeof g.scope=="object"&&g.scope!==null&&(g.beginScope=g.scope,delete g.scope)}function Gi(g){Zi(g),typeof g.beginScope=="string"&&(g.beginScope={_wrap:g.beginScope}),typeof g.endScope=="string"&&(g.endScope={_wrap:g.endScope}),Fi(g),Wi(g)}function Qi(g){function S(P,$){return new RegExp(h(P),"m"+(g.case_insensitive?"i":"")+(g.unicodeRegex?"u":"")+($?"g":""))}class L{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule($,F){F.position=this.position++,this.matchIndexes[this.matchAt]=F,this.regexes.push([F,$]),this.matchAt+=x($)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const $=this.regexes.map(F=>F[1]);this.matcherRe=S(M($,{joinWith:"|"}),!0),this.lastIndex=0}exec($){this.matcherRe.lastIndex=this.lastIndex;const F=this.matcherRe.exec($);if(!F)return null;const ye=F.findIndex((ct,sn)=>sn>0&&ct!==void 0),fe=this.matchIndexes[ye];return F.splice(0,ye),Object.assign(F,fe)}}class W{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher($){if(this.multiRegexes[$])return this.multiRegexes[$];const F=new L;return this.rules.slice($).forEach(([ye,fe])=>F.addRule(ye,fe)),F.compile(),this.multiRegexes[$]=F,F}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule($,F){this.rules.push([$,F]),F.type==="begin"&&this.count++}exec($){const F=this.getMatcher(this.regexIndex);F.lastIndex=this.lastIndex;let ye=F.exec($);if(this.resumingScanAtSamePosition()&&!(ye&&ye.index===this.lastIndex)){const fe=this.getMatcher(0);fe.lastIndex=this.lastIndex+1,ye=fe.exec($)}return ye&&(this.regexIndex+=ye.position+1,this.regexIndex===this.count&&this.considerAll()),ye}}function de(P){const $=new W;return P.contains.forEach(F=>$.addRule(F.begin,{rule:F,type:"begin"})),P.terminatorEnd&&$.addRule(P.terminatorEnd,{type:"end"}),P.illegal&&$.addRule(P.illegal,{type:"illegal"}),$}function pe(P,$){const F=P;if(P.isCompiled)return F;[Ii,Ni,Gi,Di].forEach(fe=>fe(P,$)),g.compilerExtensions.forEach(fe=>fe(P,$)),P.__beforeBegin=null,[zi,Bi,Oi].forEach(fe=>fe(P,$)),P.isCompiled=!0;let ye=null;return typeof P.keywords=="object"&&P.keywords.$pattern&&(P.keywords=Object.assign({},P.keywords),ye=P.keywords.$pattern,delete P.keywords.$pattern),ye=ye||/\w+/,P.keywords&&(P.keywords=Gn(P.keywords,g.case_insensitive)),F.keywordPatternRe=S(ye,!0),$&&(P.begin||(P.begin=/\B|\b/),F.beginRe=S(F.begin),!P.end&&!P.endsWithParent&&(P.end=/\B|\b/),P.end&&(F.endRe=S(F.end)),F.terminatorEnd=h(F.end)||"",P.endsWithParent&&$.terminatorEnd&&(F.terminatorEnd+=(P.end?"|":"")+$.terminatorEnd)),P.illegal&&(F.illegalRe=S(P.illegal)),P.contains||(P.contains=[]),P.contains=[].concat(...P.contains.map(function(fe){return Xi(fe==="self"?P:fe)})),P.contains.forEach(function(fe){pe(fe,F)}),P.starts&&pe(P.starts,$),F.matcher=de(F),F}if(g.compilerExtensions||(g.compilerExtensions=[]),g.contains&&g.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return g.classNameAliases=s(g.classNameAliases||{}),pe(g)}function Yn(g){return g?g.endsWithParent||Yn(g.starts):!1}function Xi(g){return g.variants&&!g.cachedVariants&&(g.cachedVariants=g.variants.map(function(S){return s(g,{variants:null},S)})),g.cachedVariants?g.cachedVariants:Yn(g)?s(g,{starts:g.starts?s(g.starts):null}):Object.isFrozen(g)?s(g):g}var Ki="11.11.1";class Yi extends Error{constructor(S,L){super(S),this.name="HTMLInjectionError",this.html=L}}const rn=n,Vn=s,Jn=Symbol("nomatch"),Vi=7,er=function(g){const S=Object.create(null),L=Object.create(null),W=[];let de=!0;const pe="Could not find the language '{}', did you forget to load/include a language module?",P={disableAutodetect:!0,name:"Plain text",contains:[]};let $={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:c};function F(E){return $.noHighlightRe.test(E)}function ye(E){let D=E.className+" ";D+=E.parentNode?E.parentNode.className:"";const te=$.languageDetectRe.exec(D);if(te){const le=je(te[1]);return le||(Xn(pe.replace("{}",te[1])),Xn("Falling back to no-highlight mode for this block.",E)),le?te[1]:"no-highlight"}return D.split(/\s+/).find(le=>F(le)||je(le))}function fe(E,D,te){let le="",we="";typeof D=="object"?(le=E,te=D.ignoreIllegals,we=D.language):(tt("10.7.0","highlight(lang, code, ...args) has been deprecated."),tt("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),we=E,le=D),te===void 0&&(te=!0);const _e={code:le,language:we};Pt("before:highlight",_e);const Fe=_e.result?_e.result:ct(_e.language,_e.code,te);return Fe.code=_e.code,Pt("after:highlight",Fe),Fe}function ct(E,D,te,le){const we=Object.create(null);function _e(_,B){return _.keywords[B]}function Fe(){if(!Z.keywords){xe.addText(ce);return}let _=0;Z.keywordPatternRe.lastIndex=0;let B=Z.keywordPatternRe.exec(ce),X="";for(;B;){X+=ce.substring(_,B.index);const ae=ze.case_insensitive?B[0].toLowerCase():B[0],ve=_e(Z,ae);if(ve){const[Oe,gs]=ve;if(xe.addText(X),X="",we[ae]=(we[ae]||0)+1,we[ae]<=Vi&&(Bt+=gs),Oe.startsWith("_"))X+=B[0];else{const ms=ze.classNameAliases[Oe]||Oe;Ie(B[0],ms)}}else X+=B[0];_=Z.keywordPatternRe.lastIndex,B=Z.keywordPatternRe.exec(ce)}X+=ce.substring(_),xe.addText(X)}function It(){if(ce==="")return;let _=null;if(typeof Z.subLanguage=="string"){if(!S[Z.subLanguage]){xe.addText(ce);return}_=ct(Z.subLanguage,ce,!0,lr[Z.subLanguage]),lr[Z.subLanguage]=_._top}else _=an(ce,Z.subLanguage.length?Z.subLanguage:null);Z.relevance>0&&(Bt+=_.relevance),xe.__addSublanguage(_._emitter,_.language)}function Re(){Z.subLanguage!=null?It():Fe(),ce=""}function Ie(_,B){_!==""&&(xe.startScope(B),xe.addText(_),xe.endScope())}function ir(_,B){let X=1;const ae=B.length-1;for(;X<=ae;){if(!_._emit[X]){X++;continue}const ve=ze.classNameAliases[_[X]]||_[X],Oe=B[X];ve?Ie(Oe,ve):(ce=Oe,Fe(),ce=""),X++}}function sr(_,B){return _.scope&&typeof _.scope=="string"&&xe.openNode(ze.classNameAliases[_.scope]||_.scope),_.beginScope&&(_.beginScope._wrap?(Ie(ce,ze.classNameAliases[_.beginScope._wrap]||_.beginScope._wrap),ce=""):_.beginScope._multi&&(ir(_.beginScope,B),ce="")),Z=Object.create(_,{parent:{value:Z}}),Z}function ar(_,B,X){let ae=C(_.endRe,X);if(ae){if(_["on:end"]){const ve=new e(_);_["on:end"](B,ve),ve.isMatchIgnored&&(ae=!1)}if(ae){for(;_.endsParent&&_.parent;)_=_.parent;return _}}if(_.endsWithParent)return ar(_.parent,B,X)}function us(_){return Z.matcher.regexIndex===0?(ce+=_[0],1):(un=!0,0)}function hs(_){const B=_[0],X=_.rule,ae=new e(X),ve=[X.__beforeBegin,X["on:begin"]];for(const Oe of ve)if(Oe&&(Oe(_,ae),ae.isMatchIgnored))return us(B);return X.skip?ce+=B:(X.excludeBegin&&(ce+=B),Re(),!X.returnBegin&&!X.excludeBegin&&(ce=B)),sr(X,_),X.returnBegin?0:B.length}function ds(_){const B=_[0],X=D.substring(_.index),ae=ar(Z,_,X);if(!ae)return Jn;const ve=Z;Z.endScope&&Z.endScope._wrap?(Re(),Ie(B,Z.endScope._wrap)):Z.endScope&&Z.endScope._multi?(Re(),ir(Z.endScope,_)):ve.skip?ce+=B:(ve.returnEnd||ve.excludeEnd||(ce+=B),Re(),ve.excludeEnd&&(ce=B));do Z.scope&&xe.closeNode(),!Z.skip&&!Z.subLanguage&&(Bt+=Z.relevance),Z=Z.parent;while(Z!==ae.parent);return ae.starts&&sr(ae.starts,_),ve.returnEnd?0:B.length}function ps(){const _=[];for(let B=Z;B!==ze;B=B.parent)B.scope&&_.unshift(B.scope);_.forEach(B=>xe.openNode(B))}let zt={};function or(_,B){const X=B&&B[0];if(ce+=_,X==null)return Re(),0;if(zt.type==="begin"&&B.type==="end"&&zt.index===B.index&&X===""){if(ce+=D.slice(B.index,B.index+1),!de){const ae=new Error(`0 width match regex (${E})`);throw ae.languageName=E,ae.badRule=zt.rule,ae}return 1}if(zt=B,B.type==="begin")return hs(B);if(B.type==="illegal"&&!te){const ae=new Error('Illegal lexeme "'+X+'" for mode "'+(Z.scope||"<unnamed>")+'"');throw ae.mode=Z,ae}else if(B.type==="end"){const ae=ds(B);if(ae!==Jn)return ae}if(B.type==="illegal"&&X==="")return ce+=`
`,1;if(cn>1e5&&cn>B.index*3)throw new Error("potential infinite loop, way more iterations than matches");return ce+=X,X.length}const ze=je(E);if(!ze)throw Ke(pe.replace("{}",E)),new Error('Unknown language: "'+E+'"');const fs=Qi(ze);let ln="",Z=le||fs;const lr={},xe=new $.__emitter($);ps();let ce="",Bt=0,Ye=0,cn=0,un=!1;try{if(ze.__emitTokens)ze.__emitTokens(D,xe);else{for(Z.matcher.considerAll();;){cn++,un?un=!1:Z.matcher.considerAll(),Z.matcher.lastIndex=Ye;const _=Z.matcher.exec(D);if(!_)break;const B=D.substring(Ye,_.index),X=or(B,_);Ye=_.index+X}or(D.substring(Ye))}return xe.finalize(),ln=xe.toHTML(),{language:E,value:ln,relevance:Bt,illegal:!1,_emitter:xe,_top:Z}}catch(_){if(_.message&&_.message.includes("Illegal"))return{language:E,value:rn(D),illegal:!0,relevance:0,_illegalBy:{message:_.message,index:Ye,context:D.slice(Ye-100,Ye+100),mode:_.mode,resultSoFar:ln},_emitter:xe};if(de)return{language:E,value:rn(D),illegal:!1,relevance:0,errorRaised:_,_emitter:xe,_top:Z};throw _}}function sn(E){const D={value:rn(E),illegal:!1,relevance:0,_top:P,_emitter:new $.__emitter($)};return D._emitter.addText(E),D}function an(E,D){D=D||$.languages||Object.keys(S);const te=sn(E),le=D.filter(je).filter(rr).map(Re=>ct(Re,E,!1));le.unshift(te);const we=le.sort((Re,Ie)=>{if(Re.relevance!==Ie.relevance)return Ie.relevance-Re.relevance;if(Re.language&&Ie.language){if(je(Re.language).supersetOf===Ie.language)return 1;if(je(Ie.language).supersetOf===Re.language)return-1}return 0}),[_e,Fe]=we,It=_e;return It.secondBest=Fe,It}function Ji(E,D,te){const le=D&&L[D]||te;E.classList.add("hljs"),E.classList.add(`language-${le}`)}function on(E){let D=null;const te=ye(E);if(F(te))return;if(Pt("before:highlightElement",{el:E,language:te}),E.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",E);return}if(E.children.length>0&&($.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(E)),$.throwUnescapedHTML))throw new Yi("One of your code blocks includes unescaped HTML.",E.innerHTML);D=E;const le=D.textContent,we=te?fe(le,{language:te,ignoreIllegals:!0}):an(le);E.innerHTML=we.value,E.dataset.highlighted="yes",Ji(E,te,we.language),E.result={language:we.language,re:we.relevance,relevance:we.relevance},we.secondBest&&(E.secondBest={language:we.secondBest.language,relevance:we.secondBest.relevance}),Pt("after:highlightElement",{el:E,result:we,text:le})}function es(E){$=Vn($,E)}const ts=()=>{$t(),tt("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function ns(){$t(),tt("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let tr=!1;function $t(){function E(){$t()}if(document.readyState==="loading"){tr||window.addEventListener("DOMContentLoaded",E,!1),tr=!0;return}document.querySelectorAll($.cssSelector).forEach(on)}function rs(E,D){let te=null;try{te=D(g)}catch(le){if(Ke("Language definition for '{}' could not be registered.".replace("{}",E)),de)Ke(le);else throw le;te=P}te.name||(te.name=E),S[E]=te,te.rawDefinition=D.bind(null,g),te.aliases&&nr(te.aliases,{languageName:E})}function is(E){delete S[E];for(const D of Object.keys(L))L[D]===E&&delete L[D]}function ss(){return Object.keys(S)}function je(E){return E=(E||"").toLowerCase(),S[E]||S[L[E]]}function nr(E,{languageName:D}){typeof E=="string"&&(E=[E]),E.forEach(te=>{L[te.toLowerCase()]=D})}function rr(E){const D=je(E);return D&&!D.disableAutodetect}function as(E){E["before:highlightBlock"]&&!E["before:highlightElement"]&&(E["before:highlightElement"]=D=>{E["before:highlightBlock"](Object.assign({block:D.el},D))}),E["after:highlightBlock"]&&!E["after:highlightElement"]&&(E["after:highlightElement"]=D=>{E["after:highlightBlock"](Object.assign({block:D.el},D))})}function os(E){as(E),W.push(E)}function ls(E){const D=W.indexOf(E);D!==-1&&W.splice(D,1)}function Pt(E,D){const te=E;W.forEach(function(le){le[te]&&le[te](D)})}function cs(E){return tt("10.7.0","highlightBlock will be removed entirely in v12.0"),tt("10.7.0","Please use highlightElement now."),on(E)}Object.assign(g,{highlight:fe,highlightAuto:an,highlightAll:$t,highlightElement:on,highlightBlock:cs,configure:es,initHighlighting:ts,initHighlightingOnLoad:ns,registerLanguage:rs,unregisterLanguage:is,listLanguages:ss,getLanguage:je,registerAliases:nr,autoDetection:rr,inherit:Vn,addPlugin:os,removePlugin:ls}),g.debugMode=function(){de=!1},g.safeMode=function(){de=!0},g.versionString=Ki,g.regex={concat:m,lookahead:f,either:k,optional:d,anyNumberOfTimes:p};for(const E in Mt)typeof Mt[E]=="object"&&t(Mt[E]);return Object.assign(g,Mt),g},nt=er({});return nt.newInstance=()=>er({}),hn=nt,nt.HighlightJS=nt,nt.default=nt,hn}var Ss=xs();const ue=$r(Ss),V=new Map,vs="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Le={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Le.html="xml";Le.xhtml="xml";Le.markup="xml";const Tn=new Set(["magic","undefined"]);let Ge=null;const dn=new Map,Es=300*1e3;async function Cn(t=vs){if(t)return Ge||(Ge=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const s=(await e.text()).split(/\r?\n/);let r=-1;for(let l=0;l<s.length;l++)if(/\|\s*Language\s*\|/i.test(s[l])){r=l;break}if(r===-1)return;const i=s[r].replace(/^\||\|$/g,"").split("|").map(l=>l.trim().toLowerCase());let a=i.findIndex(l=>/alias|aliases|equivalent|alt|alternates?/i.test(l));a===-1&&(a=1);let u=i.findIndex(l=>/file|filename|module|module name|module-name|short|slug/i.test(l));if(u===-1){const l=i.findIndex(c=>/language/i.test(c));u=l!==-1?l:0}let o=[];for(let l=r+1;l<s.length;l++){const c=s[l].trim();if(!c||!c.startsWith("|"))break;const h=c.replace(/^\||\|$/g,"").split("|").map(w=>w.trim());if(h.every(w=>/^-+$/.test(w)))continue;const f=h;if(!f.length)continue;const d=(f[u]||f[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;V.set(d,d);const m=f[a]||"";if(m){const w=String(m).split(",").map(k=>k.replace(/`/g,"").trim()).filter(Boolean);if(w.length){const x=w[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");x&&/[a-z0-9]/i.test(x)&&(V.set(x,x),o.push(x))}}}try{const l=[];for(const c of o){const h=String(c||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");h&&/[a-z0-9]/i.test(h)?l.push(h):V.delete(c)}o=l}catch(l){console.warn("[codeblocksManager] cleanup aliases failed",l)}try{let l=0;for(const c of Array.from(V.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){V.delete(c),l++;continue}if(/^[:]+/.test(c)){const h=c.replace(/^[:]+/,"");if(h&&/[a-z0-9]/i.test(h)){const f=V.get(c);V.delete(c),V.set(h,f)}else V.delete(c),l++}}for(const[c,h]of Array.from(V.entries()))(!h||/^-+$/.test(h)||!/[a-z0-9]/i.test(h))&&(V.delete(c),l++);try{const c=":---------------------";V.has(c)&&(V.delete(c),l++)}catch(c){console.warn("[codeblocksManager] remove sep key failed",c)}try{const c=Array.from(V.keys()).sort()}catch(c){console.warn("[codeblocksManager] compute supported keys failed",c)}}catch(l){console.warn("[codeblocksManager] ignored error",l)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),Ge)}const ut=new Set;async function ot(t,e){if(Ge||(async()=>{try{await Cn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Ge)try{await Ge}catch{}if(t=t==null?"":String(t),t=t.trim(),!t)return!1;const n=t.toLowerCase();if(Tn.has(n))return!1;if(V.size&&!V.has(n)){const r=Le;if(!r[n]&&!r[t])return!1}if(ut.has(t))return!0;const s=Le;try{const r=(e||t||"").toString().replace(/\.js$/i,"").trim(),i=(s[t]||t||"").toString(),a=(s[r]||r||"").toString();let u=Array.from(new Set([i,a,r,t,s[r],s[t]].filter(Boolean))).map(c=>String(c).toLowerCase()).filter(c=>c&&c!=="undefined");V.size&&(u=u.filter(c=>{if(V.has(c))return!0;const h=Le[c];return!!(h&&V.has(h))}));let o=null,l=null;for(const c of u)try{const h=Date.now();let f=dn.get(c);if(f&&f.ok===!1&&h-(f.ts||0)>=Es&&(dn.delete(c),f=void 0),f){if(f.module)o=f.module;else if(f.promise)try{o=await f.promise}catch{o=null}}else{const p={promise:null,module:null,ok:null,ts:0};dn.set(c,p),p.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${c}.js`)}catch{return await import(`highlight.js/lib/languages/${c}`)}}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;return await new Function("u","return import(u)")(m)}catch{try{const w=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;return await new Function("u","return import(u)")(w)}catch{return null}}}}catch{return null}})();try{o=await p.promise,p.module=o,p.ok=!!o,p.ts=Date.now()}catch{p.module=null,p.ok=!1,p.ts=Date.now(),o=null}}if(o){const p=o.default||o;try{const d=V.size&&V.get(t)||c||t;return ue.registerLanguage(d,p),ut.add(d),d!==t&&(ue.registerLanguage(t,p),ut.add(t)),!0}catch(d){l=d}}else try{if(V.has(c)||V.has(t)){const p=()=>({});try{ue.registerLanguage(c,p),ut.add(c)}catch{}try{c!==t&&(ue.registerLanguage(t,p),ut.add(t))}catch{}return!0}}catch{}}catch(h){l=h}if(l)throw l;return!1}catch{return!1}}let Nt=null;function Pr(t=document){Ge||(async()=>{try{await Cn()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const e=Le,s=Nt||(typeof IntersectionObserver>"u"?null:(Nt=new IntersectionObserver((i,a)=>{i.forEach(u=>{if(!u.isIntersecting)return;const o=u.target;try{a.unobserve(o)}catch(l){console.warn("[codeblocksManager] observer unobserve failed",l)}(async()=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",c=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const h=(c[1]||"").toLowerCase(),f=e[h]||h,p=V.size&&(V.get(f)||V.get(String(f).toLowerCase()))||f;try{await ot(p)}catch(d){console.warn("[codeblocksManager] registerLanguage failed",d)}try{ue.highlightElement(o)}catch(d){console.warn("[codeblocksManager] hljs.highlightElement failed",d)}}else try{const h=o.textContent||"";try{if(ue&&typeof ue.getLanguage=="function"&&ue.getLanguage("plaintext")){const f=ue.highlight(h,{language:"plaintext"});f&&f.value&&(o.innerHTML=f.value)}}catch{try{ue.highlightElement(o)}catch(p){console.warn("[codeblocksManager] fallback highlightElement failed",p)}}}catch(h){console.warn("[codeblocksManager] auto-detect plaintext failed",h)}}catch(l){console.warn("[codeblocksManager] observer entry processing failed",l)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Nt)),r=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!s){r.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",u=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const o=(u[1]||"").toLowerCase(),l=e[o]||o,c=V.size&&(V.get(l)||V.get(String(l).toLowerCase()))||l;try{await ot(c)}catch(h){console.warn("[codeblocksManager] registerLanguage failed (no observer)",h)}}try{ue.highlightElement(i)}catch(o){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",o)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function As(t,{useCdn:e=!0}={}){const n=document.querySelector("link[data-hl-theme]");n&&n.remove();let s=t||"monokai";if(s==="monokai")return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");return}const r=`https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${s}.css`,i=document.createElement("link");i.rel="stylesheet",i.href=r,i.setAttribute("data-hl-theme",s),document.head.appendChild(i)}let mt="light";function Rs(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const n=document.createElement("link");n.rel="stylesheet",n.href=t,Object.entries(e).forEach(([s,r])=>n.setAttribute(s,r)),document.head.appendChild(n)}async function Ir(t="none",e="/"){if(!t||t==="none")return;const n=[e+"bulma.css","/bulma.css"],s=Array.from(new Set(n));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const r of s)try{const i=await fetch(r,{method:"GET"});if(i.ok){const a=await i.text(),u=document.createElement("style");u.setAttribute("data-bulma-override",r),u.appendChild(document.createTextNode(`
/* bulma override: ${r} */
`+a)),document.head.appendChild(u);return}}catch(i){console.warn("[bulmaManager] fetch local bulma candidate failed",i)}return}try{const r=String(t).trim();if(!r)return;const i=`https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;Rs(i,{"data-bulmaswatch-theme":r})}catch(r){console.warn("[bulmaManager] ensureBulma failed",r)}}function zr(t){mt=t==="dark"?"dark":"light",document.documentElement.setAttribute("data-theme",mt),mt==="dark"?document.body.classList.add("is-dark"):document.body.classList.remove("is-dark")}function Ls(t){const e=document.documentElement;for(const[n,s]of Object.entries(t||{}))try{e.style.setProperty(`--${n}`,s)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function Br(t){if(!t||!(t instanceof HTMLElement))return()=>{};const e=()=>{mt==="dark"?(t.classList.add("is-dark"),t.classList.remove("is-light")):(t.classList.add("is-light"),t.classList.remove("is-dark"))};e();const n=new MutationObserver(()=>{mt=document.documentElement.getAttribute("data-theme")==="dark"?"dark":"light",e()});try{n.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}catch{}return()=>{try{n.disconnect()}catch{}}}const Nr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},at=JSON.parse(JSON.stringify(Nr));let Ft="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";Ft=String(t).split("-")[0].toLowerCase()}Nr[Ft]||(Ft="en");let Qe=Ft;function it(t,e={}){const n=at[Qe]||at.en;let s=n&&n[t]?n[t]:at.en[t]||"";for(const r of Object.keys(e))s=s.replace(new RegExp(`{${r}}`,"g"),String(e[r]));return s}async function Mn(t,e){if(!t)return;let n=t;try{/^https?:\/\//.test(t)||(n=new URL(t,location.origin+e).toString());const s=await fetch(n);if(!s.ok)return;const r=await s.json();for(const i of Object.keys(r||{}))at[i]=Object.assign({},at[i]||{},r[i])}catch{}}function _n(t){const e=String(t).split("-")[0].toLowerCase();Qe=at[e]?e:"en"}const Ts=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Qe},loadL10nFile:Mn,setLang:_n,t:it},Symbol.toStringTag,{value:"Module"})),Cs=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function Or(t,e="worker"){let n=null;function s(){if(!n)try{const u=t();n=u||null,u&&u.addEventListener("error",()=>{try{n===u&&(n=null,u.terminate&&u.terminate())}catch(o){console.warn("["+e+"] worker termination failed",o)}})}catch(u){n=null,console.warn("["+e+"] worker init failed",u)}return n}function r(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(u){console.warn("["+e+"] worker termination failed",u)}}function i(u,o=1e3){return new Promise((l,c)=>{const h=s();if(!h)return c(new Error("worker unavailable"));const f=String(Math.random());u.id=f;let p=null;const d=()=>{p&&clearTimeout(p),h.removeEventListener("message",m),h.removeEventListener("error",w)},m=k=>{const x=k.data||{};x.id===f&&(d(),x.error?c(new Error(x.error)):l(x.result))},w=k=>{d(),console.warn("["+e+"] worker error event",k);try{n===h&&(n=null,h.terminate&&h.terminate())}catch(x){console.warn("["+e+"] worker termination failed",x)}c(new Error(k&&k.message||"worker error"))};p=setTimeout(()=>{d(),console.warn("["+e+"] worker timed out");try{n===h&&(n=null,h.terminate&&h.terminate())}catch(k){console.warn("["+e+"] worker termination on timeout failed",k)}c(new Error("worker timeout"))},o),h.addEventListener("message",m),h.addEventListener("error",w);try{h.postMessage(u)}catch(k){d(),c(k)}})}return{get:s,send:i,terminate:r}}function Ms(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),n=URL.createObjectURL(e);return new Worker(n,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const Ne=new Set;function $n(t){_s(),Ne.clear();for(const e of Te)e&&Ne.add(e);ur(Y),ur(q),$n._refreshed=!0}function ur(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&Ne.add(e)}function hr(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(n,s){return s&&Ne.add(s),e.call(this,n,s)}}let dr=!1;function _s(){dr||(hr(Y),hr(q),dr=!0)}function Dr(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function he(t){return String(t||"").replace(/^[.\/]+/,"")}function At(t){return String(t||"").replace(/\/+$/,"")}function Et(t){return At(t)+"/"}function $s(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=t,document.head.appendChild(n)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function Ot(t,e=0,n=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const s=Array.from(t.querySelectorAll("img"));if(!s.length)return;const r=t,i=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,u=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=i?Math.max(a,i.top):a,c=(i?Math.min(u,i.bottom):u)+Number(e||0);let h=0;r&&(h=r.clientHeight||(i?i.height:0)),h||(h=u-a);let f=.6;try{const w=r&&window.getComputedStyle?window.getComputedStyle(r):null,k=w&&w.getPropertyValue("--nimbi-image-max-height-ratio"),x=k?parseFloat(k):NaN;!Number.isNaN(x)&&x>0&&x<=1&&(f=x)}catch(w){console.warn("[helpers] read CSS ratio failed",w)}const p=Math.max(200,Math.floor(h*f));let d=!1,m=null;if(s.forEach(w=>{try{const k=w.getAttribute?w.getAttribute("loading"):void 0;k!=="eager"&&w.setAttribute&&w.setAttribute("loading","lazy");const x=w.getBoundingClientRect?w.getBoundingClientRect():null,C=w.src||w.getAttribute&&w.getAttribute("src"),I=x&&x.height>1?x.height:p,M=x?x.top:0,z=M+I;x&&I>0&&M<=c&&z>=o&&(w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),$s(C),d=!0),!m&&x&&x.top<=c&&(m={img:w,src:C,rect:x,beforeLoading:k})}catch(k){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",k)}}),!d&&m){const{img:w,src:k,rect:x,beforeLoading:C}=m;try{w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high")}catch(I){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",I)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function Wt(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Wt)}catch(t){console.warn("[helpers] global attach failed",t)}const Y=new Map;let Ce=[],Pn=!1;function Ps(t){Pn=!!t}function Hr(t){Ce=Array.isArray(t)?t.slice():[]}function Is(){return Ce}const Ur=Or(()=>Ms(Cs),"slugManager");function In(){return Ur.get()}function qr(t){return Ur.send(t)}async function zs(t,e=1,n=void 0){if(!In())return Qt(t,e,n);try{return await qr({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:n})}catch(r){try{return await Qt(t,e,n)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),r}}}async function Bs(t,e,n){return In()?qr({type:"crawlForSlug",slug:t,base:e,maxQueue:n}):zn(t,e,n)}function We(t,e){if(t)if(Ce&&Ce.length){const s=e.split("/")[0],r=Ce.includes(s);let i=Y.get(t);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),r?i.langs[s]=e:i.default=e,Y.set(t,i)}else Y.set(t,e)}const en=new Set;function Ns(t){typeof t=="function"&&en.add(t)}function Os(t){typeof t=="function"&&en.delete(t)}const q=new Map;let yn={},Te=[],lt="_404.md",st="_home.md";function kn(t){t!=null&&(lt=String(t||""))}function Ds(t){t!=null&&(st=String(t||""))}function Hs(t){yn=t||{}}const wt=new Map,Zt=new Set;function Us(){wt.clear(),Zt.clear()}function qs(t){if(!t||t.length===0)return"";let e=t[0];for(let s=1;s<t.length;s++){const r=t[s];let i=0;const a=Math.min(e.length,r.length);for(;i<a&&e[i]===r[i];)i++;e=e.slice(0,i)}const n=e.lastIndexOf("/");return n===-1?e:e.slice(0,n+1)}function Gt(t){Y.clear(),q.clear(),Te=[],Ce=Ce||[];const e=Object.keys(yn||{});if(!e.length)return;let n="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?n=new URL(String(t)).pathname:n=String(t||"")}catch(s){n=String(t||""),console.warn("[slugManager] parse contentBase failed",s)}n=Et(n)}}catch(s){n="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}n||(n=qs(e));for(const s of e){let r=s;n&&s.startsWith(n)?r=he(s.slice(n.length)):r=he(s),Te.push(r);try{$n()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=yn[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const u=ie(a[1].trim());if(u)try{if(Ce&&Ce.length){const l=r.split("/")[0],c=Ce.includes(l);let h=Y.get(u);(!h||typeof h=="string")&&(h={default:typeof h=="string"?h:void 0,langs:{}}),c?h.langs[l]=r:h.default=r,Y.set(u,h)}else Y.set(u,r);q.set(r,u)}catch(o){console.warn("[slugManager] set slug mapping failed",o)}}}}}try{Gt()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function ie(t){let n=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function js(t){return Rt(t,void 0)}function Rt(t,e){if(!t)return!1;if(t.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(t)){if(e&&typeof e=="string")try{const n=new URL(t),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(t.startsWith("/")&&e&&typeof e=="string")try{const n=new URL(t,e),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!1}function Ht(t){return t==null?t:String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(e,n)=>n)}function Lt(t){if(!t||!Y.has(t))return null;const e=Y.get(t);if(!e)return null;if(typeof e=="string")return e;if(Ce&&Ce.length&&Qe&&e.langs&&e.langs[Qe])return e.langs[Qe];if(e.default)return e.default;if(e.langs){const n=Object.keys(e.langs);if(n.length)return e.langs[n[0]]}return null}const bt=new Map;function Fs(){bt.clear()}let Se=async function(t,e){if(!t)throw new Error("path required");try{const i=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&Y.has(i)){const a=Lt(i)||Y.get(i);a&&a!==t&&(t=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const n=e==null?"":At(String(e));let s="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else if(n.startsWith("/"))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=n.startsWith("/")?n:"/"+n;s=i+a.replace(/\/$/,"")+"/"+t.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+t.replace(/^\//,"")}catch{s="/"+t.replace(/^\//,"")}if(bt.has(s))return bt.get(s);const r=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const h=`${n}/${lt}`,f=await globalThis.fetch(h);if(f&&typeof f.ok=="boolean"&&f.ok)return{raw:await f.text(),status:404}}catch(h){console.warn("[slugManager] fetching fallback 404 failed",h)}let c="";try{i&&typeof i.clone=="function"?c=await i.clone().text():i&&typeof i.text=="function"?c=await i.text():c=""}catch(h){c="",console.warn("[slugManager] reading error body failed",h)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:c.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),u=a.trim().slice(0,16).toLowerCase(),o=u.startsWith("<!doctype")||u.startsWith("<html"),l=o||String(t||"").toLowerCase().endsWith(".html");if(o&&String(t||"").toLowerCase().endsWith(".md")){try{const c=`${n}/${lt}`,h=await globalThis.fetch(c);if(h.ok)return{raw:await h.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return l?{raw:a,isHtml:!0}:{raw:a}})();return bt.set(s,r),r};function Ws(t){typeof t=="function"&&(Se=t)}const Ut=new Map;function Zs(t){if(!t||typeof t!="string")return"";let e=t.replace(/```[\s\S]*?```/g,"");return e=e.replace(/<pre[\s\S]*?<\/pre>/gi,""),e=e.replace(/<code[\s\S]*?<\/code>/gi,""),e=e.replace(/<!--([\s\S]*?)-->/g,""),e=e.replace(/^ {4,}.*$/gm,""),e=e.replace(/`[^`]*`/g,""),e}let De=[],ht=null;async function Qt(t,e=1,n=void 0){const s=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>he(String(r||""))))):[];try{const r=he(String(lt||""));r&&!s.includes(r)&&s.push(r)}catch{}if(De&&De.length&&e===1&&!De.some(i=>{try{return s.includes(he(String(i.path||"")))}catch{return!1}}))return De;if(ht)return ht;ht=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(l=>he(String(l||""))))):[];try{const l=he(String(lt||""));l&&!r.includes(l)&&r.push(l)}catch{}const i=l=>{if(!r||!r.length)return!1;for(const c of r)if(c&&(l===c||l.startsWith(c+"/")))return!0;return!1};let a=[];if(Te&&Te.length&&(a=Array.from(Te)),!a.length)for(const l of Y.values())l&&a.push(l);try{const l=await Zr(t);l&&l.length&&(a=a.concat(l))}catch(l){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",l)}try{const l=new Set(a),c=[...a];for(l.size;c.length&&l.size<=Tt;){const h=c.shift();try{const f=await Se(h,t);if(f&&f.raw){if(f.status===404)continue;let p=f.raw;const d=[],m=String(h||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(m)&&Pn&&(!h||!h.includes("/")))continue;const w=Zs(p),k=/\[[^\]]+\]\(([^)]+)\)/g;let x;for(;x=k.exec(w);)d.push(x[1]);const C=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;x=C.exec(w);)d.push(x[1]);const I=h&&h.includes("/")?h.substring(0,h.lastIndexOf("/")+1):"";for(let M of d)try{if(Rt(M,t)||M.startsWith("..")||M.indexOf("/../")!==-1||(I&&!M.startsWith("./")&&!M.startsWith("/")&&!M.startsWith("../")&&(M=I+M),M=he(M),!/\.(md|html?)(?:$|[?#])/i.test(M))||(M=M.split(/[?#]/)[0],i(M)))continue;l.has(M)||(l.add(M),c.push(M),a.push(M))}catch(z){console.warn("[slugManager] href processing failed",M,z)}}}catch(f){console.warn("[slugManager] discovery fetch failed for",h,f)}}}catch(l){console.warn("[slugManager] discovery loop failed",l)}const u=new Set;a=a.filter(l=>!l||u.has(l)||i(l)?!1:(u.add(l),!0));const o=[];for(const l of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(l))try{const c=await Se(l,t);if(c&&c.raw){if(c.status===404)continue;let h="",f="";if(c.isHtml)try{const m=new DOMParser().parseFromString(c.raw,"text/html"),w=m.querySelector("title")||m.querySelector("h1");w&&w.textContent&&(h=w.textContent.trim());const k=m.querySelector("p");if(k&&k.textContent&&(f=k.textContent.trim()),e>=2)try{const x=m.querySelector("h1"),C=x&&x.textContent?x.textContent.trim():h||"",I=(()=>{try{if(q.has(l))return q.get(l)}catch{}return ie(h||l)})(),M=Array.from(m.querySelectorAll("h2"));for(const z of M)try{const N=(z.textContent||"").trim();if(!N)continue;const K=z.id?z.id:ie(N),J=I?`${I}::${K}`:`${ie(l)}::${K}`;let se="",j=z.nextElementSibling;for(;j&&j.tagName&&j.tagName.toLowerCase()==="script";)j=j.nextElementSibling;j&&j.textContent&&(se=String(j.textContent).trim()),o.push({slug:J,title:N,excerpt:se,path:l,parentTitle:C})}catch(N){console.warn("[slugManager] indexing H2 failed",N)}if(e===3)try{const z=Array.from(m.querySelectorAll("h3"));for(const N of z)try{const K=(N.textContent||"").trim();if(!K)continue;const J=N.id?N.id:ie(K),se=I?`${I}::${J}`:`${ie(l)}::${J}`;let j="",Q=N.nextElementSibling;for(;Q&&Q.tagName&&Q.tagName.toLowerCase()==="script";)Q=Q.nextElementSibling;Q&&Q.textContent&&(j=String(Q.textContent).trim()),o.push({slug:se,title:K,excerpt:j,path:l,parentTitle:C})}catch(K){console.warn("[slugManager] indexing H3 failed",K)}}catch(z){console.warn("[slugManager] collect H3s failed",z)}}catch(x){console.warn("[slugManager] collect H2s failed",x)}}catch(d){console.warn("[slugManager] parsing HTML for index failed",d)}else{const d=c.raw,m=d.match(/^#\s+(.+)$/m);h=m?m[1].trim():"";try{h=Ht(h)}catch{}const w=d.split(/\r?\n\s*\r?\n/);if(w.length>1)for(let k=1;k<w.length;k++){const x=w[k].trim();if(x&&!/^#/.test(x)){f=x.replace(/\r?\n/g," ");break}}if(e>=2){let k="",x="";try{const C=(d.match(/^#\s+(.+)$/m)||[])[1];k=C?C.trim():"",x=(function(){try{if(q.has(l))return q.get(l)}catch{}return ie(h||l)})();const I=/^##\s+(.+)$/gm;let M;for(;M=I.exec(d);)try{const z=(M[1]||"").trim(),N=Ht(z);if(!z)continue;const K=ie(z),J=x?`${x}::${K}`:`${ie(l)}::${K}`,j=d.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),Q=j&&j[1]?String(j[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:J,title:N,excerpt:Q,path:l,parentTitle:k})}catch(z){console.warn("[slugManager] indexing markdown H2 failed",z)}}catch(C){console.warn("[slugManager] collect markdown H2s failed",C)}if(e===3)try{const C=/^###\s+(.+)$/gm;let I;for(;I=C.exec(d);)try{const M=(I[1]||"").trim(),z=Ht(M);if(!M)continue;const N=ie(M),K=x?`${x}::${N}`:`${ie(l)}::${N}`,se=d.slice(C.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),j=se&&se[1]?String(se[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:K,title:z,excerpt:j,path:l,parentTitle:k})}catch(M){console.warn("[slugManager] indexing markdown H3 failed",M)}}catch(C){console.warn("[slugManager] collect markdown H3s failed",C)}}}let p="";try{q.has(l)&&(p=q.get(l))}catch(d){console.warn("[slugManager] mdToSlug access failed",d)}p||(p=ie(h||l)),o.push({slug:p,title:h,excerpt:f,path:l})}}catch(c){console.warn("[slugManager] buildSearchIndex: entry fetch failed",c)}try{De=o.filter(c=>{try{return!i(String(c.path||""))}catch{return!0}})}catch(l){console.warn("[slugManager] filtering index by excludes failed",l),De=o}return De})();try{await ht}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return ht=null,De}const jr=1e3;let Tt=jr;function Gs(t){typeof t=="number"&&t>=0&&(Tt=t)}const Fr=new DOMParser,Wr="a[href]";let zn=async function(t,e,n=Tt){if(Ut.has(t))return Ut.get(t);let s=null;const r=new Set,i=[""];for(;i.length&&!s&&!(i.length>n);){const a=i.shift();if(r.has(a))continue;r.add(a);let u=e;u.endsWith("/")||(u+="/"),u+=a;try{let o;try{o=await globalThis.fetch(u)}catch(f){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:u,error:f});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:u,status:o.status});continue}const l=await o.text(),h=Fr.parseFromString(l,"text/html").querySelectorAll(Wr);for(const f of h)try{let p=f.getAttribute("href")||"";if(!p||Rt(p,e)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const d=a+p;r.has(d)||i.push(d);continue}if(p.toLowerCase().endsWith(".md")){const d=he(a+p);try{if(q.has(d))continue;for(const m of Y.values());}catch(m){console.warn("[slugManager] slug map access failed",m)}try{const m=await Se(d,e);if(m&&m.raw){const w=(m.raw||"").match(/^#\s+(.+)$/m);if(w&&w[1]&&ie(w[1].trim())===t){s=d;break}}}catch(m){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",m)}}}catch(p){console.warn("[slugManager] crawlForSlug: link iteration failed",p)}}catch(o){console.warn("[slugManager] crawlForSlug: directory fetch failed",o)}}return Ut.set(t,s),s};async function Zr(t,e=Tt){const n=new Set,s=new Set,r=[""];for(;r.length&&!(r.length>e);){const i=r.shift();if(s.has(i))continue;s.add(i);let a=t;a.endsWith("/")||(a+="/"),a+=i;try{let u;try{u=await globalThis.fetch(a)}catch(h){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:h});continue}if(!u||!u.ok){u&&!u.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:u.status});continue}const o=await u.text(),c=Fr.parseFromString(o,"text/html").querySelectorAll(Wr);for(const h of c)try{let f=h.getAttribute("href")||"";if(!f||Rt(f,t)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const d=i+f;s.has(d)||r.push(d);continue}const p=(i+f).replace(/^\/+/,"");/\.(md|html?)$/i.test(p)&&n.add(p)}catch(f){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",f)}}catch(u){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",u)}}return Array.from(n)}async function Gr(t,e,n){if(t&&typeof t=="string"&&(t=he(t),t=At(t)),Y.has(t))return Lt(t)||Y.get(t);for(const r of en)try{const i=await r(t,e);if(i)return We(t,i),q.set(i,t),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(Te&&Te.length){if(wt.has(t)){const r=wt.get(t);return Y.set(t,r),q.set(r,t),r}for(const r of Te)if(!Zt.has(r))try{const i=await Se(r,e);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const u=ie(a[1].trim());if(Zt.add(r),u&&wt.set(u,r),u===t)return We(t,r),q.set(r,t),r}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const r=await Qt(e);if(r&&r.length){const i=r.find(a=>a.slug===t);if(i)return We(t,i.path),q.set(i.path,t),i.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await zn(t,e,n);if(r)return We(t,r),q.set(r,t),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const s=[`${t}.html`,`${t}.md`];for(const r of s)try{const i=await Se(r,e);if(i&&i.raw)return We(t,r),q.set(r,t),r}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(Te&&Te.length)for(const r of Te)try{const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ie(i)===t)return We(t,r),q.set(r,t),r}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const r=[];st&&typeof st=="string"&&st.trim()&&r.push(st),r.includes("_home.md")||r.push("_home.md");for(const i of r)try{const a=await Se(i,e);if(a&&a.raw){const u=(a.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]&&ie(u[1].trim())===t)return We(t,i),q.set(i,t),i}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const qt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:jr,_setAllMd:Hs,_storeSlugMapping:We,addSlugResolver:Ns,get allMarkdownPaths(){return Te},get availableLanguages(){return Ce},buildSearchIndex:Qt,buildSearchIndexWorker:zs,clearFetchCache:Fs,clearListCaches:Us,crawlAllMarkdown:Zr,crawlCache:Ut,crawlForSlug:zn,crawlForSlugWorker:Bs,get defaultCrawlMaxQueue(){return Tt},ensureSlug:Gr,fetchCache:bt,get fetchMarkdown(){return Se},getLanguages:Is,get homePage(){return st},initSlugWorker:In,isExternalLink:js,isExternalLinkWithBase:Rt,listPathsFetched:Zt,listSlugCache:wt,mdToSlug:q,get notFoundPage(){return lt},removeSlugResolver:Os,resolveSlugPath:Lt,get searchIndex(){return De},setContentBase:Gt,setDefaultCrawlMaxQueue:Gs,setFetchMarkdown:Ws,setHomePage:Ds,setLanguages:Hr,setNotFoundPage:kn,setSkipRootReadme:Ps,get skipRootReadme(){return Pn},slugResolvers:en,slugToMd:Y,slugify:ie,unescapeMarkdown:Ht},Symbol.toStringTag,{value:"Module"}));let Qr=100;function pr(t){Qr=t}let yt=300*1e3;function fr(t){yt=t}const Me=new Map;function Qs(t){if(!Me.has(t))return;const e=Me.get(t),n=Date.now();if(e.ts+yt<n){Me.delete(t);return}return Me.delete(t),Me.set(t,e),e.value}function Xs(t,e){if(gr(),gr(),Me.delete(t),Me.set(t,{value:e,ts:Date.now()}),Me.size>Qr){const n=Me.keys().next().value;n!==void 0&&Me.delete(n)}}function gr(){if(!yt||yt<=0)return;const t=Date.now();for(const[e,n]of Me.entries())n.ts+yt<t&&Me.delete(e)}async function Ks(t,e){const n=new Set(Ne),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(s||[])){const i=r.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const u=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(u){let l=he(u[1]);l&&n.add(l);continue}const o=a.pathname||"";if(o){const l=new URL(e),c=Et(l.pathname);if(o.indexOf(c)!==-1){let h=o.startsWith(c)?o.slice(c.length):o;h=he(h),h&&n.add(h)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const i=await Se(r,e);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const u=(a[1]||"").trim();if(u&&ie(u)===t)return r}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function Ys(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const n=decodeURIComponent(String(t||""));if(Y.has(n)){const s=Lt(n)||Y.get(n);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||e.push(s):(e.push(s),e.push(s+".html")))}else{if(Ne&&Ne.size)for(const s of Ne){const r=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(ie(r)===n&&!/index\.html$/i.test(s)){e.push(s);break}}!e.length&&n&&!/\.(md|html?)$/i.test(n)&&(e.push(n+".html"),e.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return e}async function Vs(t,e){const n=t||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=t||"",i=null;if(r&&String(r).includes("::")){const d=String(r).split("::",2);r=d[0],i=d[1]||null}const u=`${t}|||${typeof Ts<"u"&&Qe?Qe:""}`,o=Qs(u);if(o)r=o.resolved,i=o.anchor||i;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let d=decodeURIComponent(String(r||""));if(d&&typeof d=="string"&&(d=he(d),d=At(d)),Y.has(d))r=Lt(d)||Y.get(d);else{let m=await Ks(d,e);if(m)r=m;else if($n._refreshed&&Ne&&Ne.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const w=await Gr(d,e);w&&(r=w)}}}Xs(u,{resolved:r,anchor:i})}!i&&s&&(i=s);const l=Ys(r),c=String(n||"").includes(".md")||String(n||"").includes(".html");if(c&&l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===1&&/index\.html$/i.test(l[0])&&!c&&!Y.has(r)&&!Y.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let h=null,f=null,p=null;for(const d of l)if(d)try{const m=he(d);h=await Se(m,e),f=m;break}catch(m){p=m;try{console.warn("[router] candidate fetch failed",{candidate:d,contentBase:e,err:m&&m.message||m})}catch{}}if(!h){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:l,contentBase:e,fetchError:p&&(p.message||String(p))||null})}catch{}try{if(c&&String(n||"").toLowerCase().includes(".html"))try{const d=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",d);const m=await fetch(d);if(m&&m.ok){const w=await m.text(),k=m&&m.headers&&typeof m.headers.get=="function"&&m.headers.get("content-type")||"",x=(w||"").toLowerCase(),C=k&&k.indexOf&&k.indexOf("text/html")!==-1||x.indexOf("<!doctype")!==-1||x.indexOf("<html")!==-1;if(C||console.warn("[router] absolute fetch returned non-HTML",{abs:d,contentType:k,snippet:x.slice(0,200)}),C)try{const I=d,M=new URL(".",I).toString();try{const N=typeof DOMParser<"u"?new DOMParser:null;if(N){const K=N.parseFromString(w||"","text/html"),J=(O,A)=>{try{const T=A.getAttribute(O)||"";if(!T||/^(https?:)?\/\//i.test(T)||T.startsWith("/")||T.startsWith("#"))return;try{const b=new URL(T,I).toString();A.setAttribute(O,b)}catch(b){console.warn("[router] rewrite attribute failed",O,b)}}catch(T){console.warn("[router] rewrite helper failed",T)}},se=K.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),j=[];for(const O of Array.from(se||[]))try{const A=O.tagName?O.tagName.toLowerCase():"";if(A==="a")continue;if(O.hasAttribute("src")){const T=O.getAttribute("src");J("src",O);const b=O.getAttribute("src");T!==b&&j.push({attr:"src",tag:A,before:T,after:b})}if(O.hasAttribute("href")&&A==="link"){const T=O.getAttribute("href");J("href",O);const b=O.getAttribute("href");T!==b&&j.push({attr:"href",tag:A,before:T,after:b})}if(O.hasAttribute("href")&&A!=="link"){const T=O.getAttribute("href");J("href",O);const b=O.getAttribute("href");T!==b&&j.push({attr:"href",tag:A,before:T,after:b})}if(O.hasAttribute("xlink:href")){const T=O.getAttribute("xlink:href");J("xlink:href",O);const b=O.getAttribute("xlink:href");T!==b&&j.push({attr:"xlink:href",tag:A,before:T,after:b})}if(O.hasAttribute("poster")){const T=O.getAttribute("poster");J("poster",O);const b=O.getAttribute("poster");T!==b&&j.push({attr:"poster",tag:A,before:T,after:b})}if(O.hasAttribute("srcset")){const v=(O.getAttribute("srcset")||"").split(",").map(R=>R.trim()).filter(Boolean).map(R=>{const[y,H]=R.split(/\s+/,2);if(!y||/^(https?:)?\/\//i.test(y)||y.startsWith("/"))return R;try{const G=new URL(y,I).toString();return H?`${G} ${H}`:G}catch{return R}}).join(", ");O.setAttribute("srcset",v)}}catch{}const Q=K.documentElement&&K.documentElement.outerHTML?K.documentElement.outerHTML:w;try{j&&j.length&&console.warn("[router] rewritten asset refs",{abs:d,rewritten:j})}catch{}return{data:{raw:Q,isHtml:!0},pagePath:String(n||""),anchor:i}}}catch{}let z=w;return/<base\s+[^>]*>/i.test(w)||(/<head[^>]*>/i.test(w)?z=w.replace(/(<head[^>]*>)/i,`$1<base href="${M}">`):z=`<base href="${M}">`+w),{data:{raw:z,isHtml:!0},pagePath:String(n||""),anchor:i}}catch{return{data:{raw:w,isHtml:!0},pagePath:String(n||""),anchor:i}}}}catch(d){console.warn("[router] absolute HTML fetch fallback failed",d)}}catch{}throw new Error("no page data")}return{data:h,pagePath:f,anchor:i}}function Bn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var et=Bn();function Xr(t){et=t}var Ve={exec:()=>null};function ne(t,e=""){let n=typeof t=="string"?t:t.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(Ae.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,e)};return s}var Js=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Ae={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},ea=/^(?:[ \t]*(?:\n|$))+/,ta=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,na=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ct=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ra=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Nn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Kr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Yr=ne(Kr).replace(/bull/g,Nn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ia=ne(Kr).replace(/bull/g,Nn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),On=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,sa=/^[^\n]+/,Dn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,aa=ne(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Dn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),oa=ne(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Nn).getRegex(),tn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Hn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,la=ne("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Hn).replace("tag",tn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Vr=ne(On).replace("hr",Ct).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tn).getRegex(),ca=ne(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Vr).getRegex(),Un={blockquote:ca,code:ta,def:aa,fences:na,heading:ra,hr:Ct,html:la,lheading:Yr,list:oa,newline:ea,paragraph:Vr,table:Ve,text:sa},mr=ne("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ct).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tn).getRegex(),ua={...Un,lheading:ia,table:mr,paragraph:ne(On).replace("hr",Ct).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",mr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",tn).getRegex()},ha={...Un,html:ne(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Hn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ve,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ne(On).replace("hr",Ct).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Yr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},da=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,pa=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Jr=/^( {2,}|\\)\n(?!\s*$)/,fa=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,nn=/[\p{P}\p{S}]/u,qn=/[\s\p{P}\p{S}]/u,ei=/[^\s\p{P}\p{S}]/u,ga=ne(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,qn).getRegex(),ti=/(?!~)[\p{P}\p{S}]/u,ma=/(?!~)[\s\p{P}\p{S}]/u,wa=/(?:[^\s\p{P}\p{S}]|~)/u,ni=/(?![*_])[\p{P}\p{S}]/u,ba=/(?![*_])[\s\p{P}\p{S}]/u,ya=/(?:[^\s\p{P}\p{S}]|[*_])/u,ka=ne(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Js?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ri=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,xa=ne(ri,"u").replace(/punct/g,nn).getRegex(),Sa=ne(ri,"u").replace(/punct/g,ti).getRegex(),ii="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",va=ne(ii,"gu").replace(/notPunctSpace/g,ei).replace(/punctSpace/g,qn).replace(/punct/g,nn).getRegex(),Ea=ne(ii,"gu").replace(/notPunctSpace/g,wa).replace(/punctSpace/g,ma).replace(/punct/g,ti).getRegex(),Aa=ne("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,ei).replace(/punctSpace/g,qn).replace(/punct/g,nn).getRegex(),Ra=ne(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ni).getRegex(),La="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Ta=ne(La,"gu").replace(/notPunctSpace/g,ya).replace(/punctSpace/g,ba).replace(/punct/g,ni).getRegex(),Ca=ne(/\\(punct)/,"gu").replace(/punct/g,nn).getRegex(),Ma=ne(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),_a=ne(Hn).replace("(?:-->|$)","-->").getRegex(),$a=ne("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",_a).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Xt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Pa=ne(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Xt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),si=ne(/^!?\[(label)\]\[(ref)\]/).replace("label",Xt).replace("ref",Dn).getRegex(),ai=ne(/^!?\[(ref)\](?:\[\])?/).replace("ref",Dn).getRegex(),Ia=ne("reflink|nolink(?!\\()","g").replace("reflink",si).replace("nolink",ai).getRegex(),wr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,jn={_backpedal:Ve,anyPunctuation:Ca,autolink:Ma,blockSkip:ka,br:Jr,code:pa,del:Ve,delLDelim:Ve,delRDelim:Ve,emStrongLDelim:xa,emStrongRDelimAst:va,emStrongRDelimUnd:Aa,escape:da,link:Pa,nolink:ai,punctuation:ga,reflink:si,reflinkSearch:Ia,tag:$a,text:fa,url:Ve},za={...jn,link:ne(/^!?\[(label)\]\((.*?)\)/).replace("label",Xt).getRegex(),reflink:ne(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Xt).getRegex()},xn={...jn,emStrongRDelimAst:Ea,emStrongLDelim:Sa,delLDelim:Ra,delRDelim:Ta,url:ne(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",wr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ne(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",wr).getRegex()},Ba={...xn,br:ne(Jr).replace("{2,}","*").getRegex(),text:ne(xn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Dt={normal:Un,gfm:ua,pedantic:ha},dt={normal:jn,gfm:xn,breaks:Ba,pedantic:za},Na={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},br=t=>Na[t];function Be(t,e){if(e){if(Ae.escapeTest.test(t))return t.replace(Ae.escapeReplace,br)}else if(Ae.escapeTestNoEncode.test(t))return t.replace(Ae.escapeReplaceNoEncode,br);return t}function yr(t){try{t=encodeURI(t).replace(Ae.percentDecode,"%")}catch{return null}return t}function kr(t,e){let n=t.replace(Ae.findPipe,(i,a,u)=>{let o=!1,l=a;for(;--l>=0&&u[l]==="\\";)o=!o;return o?"|":" |"}),s=n.split(Ae.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(Ae.slashPipe,"|");return s}function pt(t,e,n){let s=t.length;if(s===0)return"";let r=0;for(;r<s&&t.charAt(s-r-1)===e;)r++;return t.slice(0,s-r)}function Oa(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])n++;else if(t[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function Da(t,e=0){let n=e,s="";for(let r of t)if(r==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=r,n++;return s}function xr(t,e,n,s,r){let i=e.href,a=e.title||null,u=t[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let o={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:u,tokens:s.inlineTokens(u)};return s.state.inLink=!1,o}function Ha(t,e,n){let s=t.match(n.other.indentCodeCompensation);if(s===null)return e;let r=s[1];return e.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[u]=a;return u.length>=r.length?i.slice(r.length):i}).join(`
`)}var Kt=class{options;rules;lexer;constructor(t){this.options=t||et}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:pt(n,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],s=Ha(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let s=pt(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:pt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=pt(e[0],`
`).split(`
`),s="",r="",i=[];for(;n.length>0;){let a=!1,u=[],o;for(o=0;o<n.length;o++)if(this.rules.other.blockquoteStart.test(n[o]))u.push(n[o]),a=!0;else if(!a)u.push(n[o]);else break;n=n.slice(o);let l=u.join(`
`),c=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${l}`:l,r=r?`${r}
${c}`:c;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=h,n.length===0)break;let f=i.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let p=f,d=p.raw+`
`+n.join(`
`),m=this.blockquote(d);i[i.length-1]=m,s=s.substring(0,s.length-p.raw.length)+m.raw,r=r.substring(0,r.length-p.text.length)+m.text;break}else if(f?.type==="list"){let p=f,d=p.raw+`
`+n.join(`
`),m=this.list(d);i[i.length-1]=m,s=s.substring(0,s.length-f.raw.length)+m.raw,r=r.substring(0,r.length-p.raw.length)+m.raw,n=d.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;t;){let o=!1,l="",c="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;l=e[0],t=t.substring(l.length);let h=Da(e[2].split(`
`,1)[0],e[1].length),f=t.split(`
`,1)[0],p=!h.trim(),d=0;if(this.options.pedantic?(d=2,c=h.trimStart()):p?d=e[1].length+1:(d=h.search(this.rules.other.nonSpaceChar),d=d>4?1:d,c=h.slice(d),d+=e[1].length),p&&this.rules.other.blankLine.test(f)&&(l+=f+`
`,t=t.substring(f.length+1),o=!0),!o){let m=this.rules.other.nextBulletRegex(d),w=this.rules.other.hrRegex(d),k=this.rules.other.fencesBeginRegex(d),x=this.rules.other.headingBeginRegex(d),C=this.rules.other.htmlBeginRegex(d),I=this.rules.other.blockquoteBeginRegex(d);for(;t;){let M=t.split(`
`,1)[0],z;if(f=M,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),z=f):z=f.replace(this.rules.other.tabCharGlobal,"    "),k.test(f)||x.test(f)||C.test(f)||I.test(f)||m.test(f)||w.test(f))break;if(z.search(this.rules.other.nonSpaceChar)>=d||!f.trim())c+=`
`+z.slice(d);else{if(p||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||k.test(h)||x.test(h)||w.test(h))break;c+=`
`+f}p=!f.trim(),l+=M+`
`,t=t.substring(M.length+1),h=z.slice(d)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(a=!0)),r.items.push({type:"list_item",raw:l,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),r.raw+=l}let u=r.items.at(-1);if(u)u.raw=u.raw.trimEnd(),u.text=u.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let o of r.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let l=this.rules.other.listTaskCheckbox.exec(o.raw);if(l){let c={type:"checkbox",raw:l[0]+" ",checked:l[0]!=="[ ]"};o.checked=c.checked,r.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=c.raw+o.tokens[0].raw,o.tokens[0].text=c.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(c)):o.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):o.tokens.unshift(c)}}if(!r.loose){let l=o.tokens.filter(h=>h.type==="space"),c=l.length>0&&l.some(h=>this.rules.other.anyLine.test(h.raw));r.loose=c}}if(r.loose)for(let o of r.items){o.loose=!0;for(let l of o.tokens)l.type==="text"&&(l.type="paragraph")}return r}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:r}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=kr(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(kr(a,i.header.length).map((u,o)=>({text:u,tokens:this.lexer.inline(u),header:!1,align:i.align[o]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=pt(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=Oa(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),xr(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return xr(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,u=r,o=0,l=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,e=e.slice(-1*t.length+r);(s=l.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){u+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){o+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u+o);let c=[...s[0]][0].length,h=t.slice(0,r+s.index+c+a);if(Math.min(r,a)%2){let p=h.slice(1,-1);return{type:"em",raw:h,text:p,tokens:this.lexer.inlineTokens(p)}}let f=h.slice(2,-2);return{type:"strong",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,u=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,e=e.slice(-1*t.length+r);(s=o.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){u+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u);let l=[...s[0]][0].length,c=t.slice(0,r+s.index+l+a),h=c.slice(r,-r);return{type:"del",raw:c,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},$e=class Sn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||et,this.options.tokenizer=this.options.tokenizer||new Kt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Ae,block:Dt.normal,inline:dt.normal};this.options.pedantic?(n.block=Dt.pedantic,n.inline=dt.pedantic):this.options.gfm&&(n.block=Dt.gfm,this.options.breaks?n.inline=dt.breaks:n.inline=dt.gfm),this.tokenizer.rules=n}static get rules(){return{block:Dt,inline:dt}}static lex(e,n){return new Sn(n).lex(e)}static lexInline(e,n){return new Sn(n).inlineTokens(e)}lex(e){e=e.replace(Ae.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(Ae.tabCharGlobal,"    ").replace(Ae.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),n.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0,u=e.slice(1),o;this.options.extensions.startBlock.forEach(l=>{o=l.call({lexer:this},u),typeof o=="number"&&o>=0&&(a=Math.min(a,o))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=r[2]?r[2].length:0,s=s.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,u="";for(;e;){a||(u=""),a=!1;let o;if(this.options.extensions?.inline?.some(c=>(o=c.call({lexer:this},e,n))?(e=e.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let c=n.at(-1);o.type==="text"&&c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(e,s,u)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(e,s,u)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),n.push(o);continue}let l=e;if(this.options.extensions?.startInline){let c=1/0,h=e.slice(1),f;this.options.extensions.startInline.forEach(p=>{f=p.call({lexer:this},h),typeof f=="number"&&f>=0&&(c=Math.min(c,f))}),c<1/0&&c>=0&&(l=e.substring(0,c+1))}if(o=this.tokenizer.inlineText(l)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(u=o.raw.slice(-1)),a=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},Yt=class{options;parser;constructor(t){this.options=t||et}space(t){return""}code({text:t,lang:e,escaped:n}){let s=(e||"").match(Ae.notSpaceStart)?.[0],r=t.replace(Ae.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Be(s)+'">'+(n?r:Be(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:Be(r,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,n=t.start,s="";for(let a=0;a<t.items.length;a++){let u=t.items[a];s+=this.listitem(u)}let r=e?"ol":"ul",i=e&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Be(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let s=this.parser.parseInline(n),r=yr(t);if(r===null)return s;t=r;let i='<a href="'+t+'"';return e&&(i+=' title="'+Be(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=yr(t);if(r===null)return Be(n);t=r;let i=`<img src="${t}" alt="${Be(n)}"`;return e&&(i+=` title="${Be(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Be(t.text)}},Fn=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},Pe=class vn{options;renderer;textRenderer;constructor(e){this.options=e||et,this.options.renderer=this.options.renderer||new Yt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Fn}static parse(e,n){return new vn(n).parse(e)}static parseInline(e,n){return new vn(n).parseInline(e)}parse(e){let n="";for(let s=0;s<e.length;s++){let r=e[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,u=this.options.extensions.renderers[a.type].call({parser:this},a);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=u||"";continue}}let i=r;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,n=this.renderer){let s="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let u=this.options.extensions.renderers[i.type].call({parser:this},i);if(u!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=u||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let u='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(u),"";throw new Error(u)}}}return s}},ft=class{options;block;constructor(t){this.options=t||et}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?$e.lex:$e.lexInline}provideParser(){return this.block?Pe.parse:Pe.parseInline}},Ua=class{defaults=Bn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Pe;Renderer=Yt;TextRenderer=Fn;Lexer=$e;Tokenizer=Kt;Hooks=ft;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{let r=s;n=n.concat(this.walkTokens(r.items,e));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...a){let u=r.renderer.apply(this,a);return u===!1&&(u=i.apply(this,a)),u}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),n.renderer){let r=this.defaults.renderer||new Yt(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,u=n.renderer[a],o=r[a];r[a]=(...l)=>{let c=u.apply(r,l);return c===!1&&(c=o.apply(r,l)),c||""}}s.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Kt(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,u=n.tokenizer[a],o=r[a];r[a]=(...l)=>{let c=u.apply(r,l);return c===!1&&(c=o.apply(r,l)),c}}s.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new ft;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,u=n.hooks[a],o=r[a];ft.passThroughHooks.has(i)?r[a]=l=>{if(this.defaults.async&&ft.passThroughHooksRespectAsync.has(i))return(async()=>{let h=await u.call(r,l);return o.call(r,h)})();let c=u.call(r,l);return o.call(r,c)}:r[a]=(...l)=>{if(this.defaults.async)return(async()=>{let h=await u.apply(r,l);return h===!1&&(h=await o.apply(r,l)),h})();let c=u.apply(r,l);return c===!1&&(c=o.apply(r,l)),c}}s.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let u=[];return u.push(i.call(this,a)),r&&(u=u.concat(r.call(this,a))),u}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return $e.lex(t,e??this.defaults)}parser(t,e){return Pe.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let s={...n},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=t),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(e):e,u=await(r.hooks?await r.hooks.provideLexer():t?$e.lex:$e.lexInline)(a,r),o=r.hooks?await r.hooks.processAllTokens(u):u;r.walkTokens&&await Promise.all(this.walkTokens(o,r.walkTokens));let l=await(r.hooks?await r.hooks.provideParser():t?Pe.parse:Pe.parseInline)(o,r);return r.hooks?await r.hooks.postprocess(l):l})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let a=(r.hooks?r.hooks.provideLexer():t?$e.lex:$e.lexInline)(e,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let u=(r.hooks?r.hooks.provideParser():t?Pe.parse:Pe.parseInline)(a,r);return r.hooks&&(u=r.hooks.postprocess(u)),u}catch(a){return i(a)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+Be(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},Je=new Ua;function re(t,e){return Je.parse(t,e)}re.options=re.setOptions=function(t){return Je.setOptions(t),re.defaults=Je.defaults,Xr(re.defaults),re};re.getDefaults=Bn;re.defaults=et;re.use=function(...t){return Je.use(...t),re.defaults=Je.defaults,Xr(re.defaults),re};re.walkTokens=function(t,e){return Je.walkTokens(t,e)};re.parseInline=Je.parseInline;re.Parser=Pe;re.parser=Pe.parse;re.Renderer=Yt;re.TextRenderer=Fn;re.Lexer=$e;re.lexer=$e.lex;re.Tokenizer=Kt;re.Hooks=ft;re.parse=re;re.options;re.setOptions;re.use;re.walkTokens;re.parseInline;Pe.parse;$e.lex;const oi=`function j() {
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
`,Sr=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",oi],{type:"text/javascript;charset=utf-8"});function qa(t){let e;try{if(e=Sr&&(self.URL||self.webkitURL).createObjectURL(Sr),!e)throw"";const n=new Worker(e,{type:"module",name:t?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(oi),{type:"module",name:t?.name})}}function ja(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const n=t.slice(3,e+0).trim(),s=t.slice(e+4).trimStart(),r={};return n.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:s,data:r}}}return{content:t,data:{}}}const li=Or(()=>new qa,"markdown"),vr=typeof DOMParser<"u"?new DOMParser:null;function En(){return li.get()}function Fa(t){return li.send(t,1e3)}const Xe=[];function An(t){if(t&&typeof t=="object"){Xe.push(t);try{re.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function Wa(t){Xe.length=0,Array.isArray(t)&&Xe.push(...t.filter(e=>e&&typeof e=="object"));try{Xe.forEach(e=>re.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function Vt(t){if(En&&En())try{const i=await Fa({type:"render",md:t});if(i&&i.html!==void 0)try{const u=(vr||new DOMParser).parseFromString(i.html,"text/html"),o=u.querySelectorAll("h1,h2,h3,h4,h5,h6");o.forEach(h=>{h.id||(h.id=ie(h.textContent||""));try{const f=Number(h.tagName.substring(1));if(f>=1&&f<=6){const p={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},d=f<=2?"has-text-weight-bold":f<=4?"has-text-weight-semibold":"has-text-weight-normal";`${p[f]} ${d}`.split(/\s+/).filter(Boolean).forEach(w=>{try{h.classList.add(w)}catch{}})}}catch{}});try{u.querySelectorAll("img").forEach(f=>{try{f.getAttribute("loading")||f.setAttribute("data-want-lazy","1")}catch(p){console.warn("[markdown] set image loading attribute failed",p)}})}catch(h){console.warn("[markdown] query images failed",h)}try{u.querySelectorAll("pre code").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(k){console.warn("[markdown] set code class failed",k),f.className=d}else try{f.removeAttribute&&f.removeAttribute("class")}catch(k){console.warn("[markdown] remove code class failed",k),f.className=""}const m=d,w=m.match(/language-([a-zA-Z0-9_+-]+)/)||m.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!w||!w[1])try{const k=f.textContent||"";try{if(ue&&typeof ue.getLanguage=="function"&&ue.getLanguage("plaintext")){const x=ue.highlight(k,{language:"plaintext"});x&&x.value&&(f.innerHTML=x.value)}}catch{try{ue.highlightElement(f)}catch(C){console.warn("[markdown] hljs.highlightElement failed",C)}}}catch(k){console.warn("[markdown] code auto-detect failed",k)}}catch(p){console.warn("[markdown] processing code blocks failed",p)}})}catch(h){console.warn("[markdown] query code blocks failed",h)}const l=u.body.innerHTML,c=[];return o.forEach(h=>{c.push({level:Number(h.tagName.substring(1)),text:(h.textContent||"").trim(),id:h.id})}),{html:l,meta:i.meta||{},toc:c}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:n,data:s}=ja(t||"");if(re.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Xe&&Xe.length)try{Xe.forEach(i=>re.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let r=re.parse(n);try{const a=(vr||new DOMParser).parseFromString(r,"text/html"),u=a.querySelectorAll("h1,h2,h3,h4,h5,h6");u.forEach(l=>{l.id||(l.id=ie(l.textContent||""));try{const c=Number(l.tagName.substring(1));if(c>=1&&c<=6){const h={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},f=c<=2?"has-text-weight-bold":c<=4?"has-text-weight-semibold":"has-text-weight-normal";`${h[c]} ${f}`.split(/\s+/).filter(Boolean).forEach(d=>{try{l.classList.add(d)}catch{}})}}catch{}});try{a.querySelectorAll("img").forEach(c=>{try{c.getAttribute("loading")||c.setAttribute("data-want-lazy","1")}catch(h){console.warn("[markdown] set image loading attribute failed",h)}})}catch(l){console.warn("[markdown] query images failed",l)}try{a.querySelectorAll("pre code").forEach(c=>{try{const h=c.getAttribute&&c.getAttribute("class")||c.className||"",f=String(h||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{c.setAttribute&&c.setAttribute("class",f)}catch(m){console.warn("[markdown] set code class failed",m),c.className=f}else try{c.removeAttribute&&c.removeAttribute("class")}catch(m){console.warn("[markdown] remove code class failed",m),c.className=""}const p=f,d=p.match(/language-([a-zA-Z0-9_+-]+)/)||p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!d||!d[1])try{const m=c.textContent||"";try{if(ue&&typeof ue.getLanguage=="function"&&ue.getLanguage("plaintext")){const w=ue.highlight(m,{language:"plaintext"});w&&w.value&&(c.innerHTML=w.value)}}catch{try{ue.highlightElement(c)}catch(k){console.warn("[markdown] hljs.highlightElement failed",k)}}}catch(m){console.warn("[markdown] code auto-detect failed",m)}}catch(h){console.warn("[markdown] processing code blocks failed",h)}})}catch(l){console.warn("[markdown] query code blocks failed",l)}r=a.body.innerHTML;const o=[];return u.forEach(l=>{o.push({level:Number(l.tagName.substring(1)),text:(l.textContent||"").trim(),id:l.id})}),{html:a.body.innerHTML,meta:s||{},toc:o}}catch(i){console.warn("post-process markdown failed",i)}return{html:r,meta:s||{},toc:[]}}function Rn(t,e){const n=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(t);)if(a[1]){const u=a[1].toLowerCase();if(Tn.has(u)||e&&e.size&&u.length<3&&!e.has(u)&&!(Le&&Le[u]&&e.has(Le[u])))continue;if(e&&e.size){if(e.has(u)){const l=e.get(u);l&&n.add(l);continue}if(Le&&Le[u]){const l=Le[u];if(e.has(l)){const c=e.get(l)||l;n.add(c);continue}}}(i.has(u)||u.length>=5&&u.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(u)&&!r.has(u))&&n.add(u)}return n}const Za=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:An,detectFenceLanguages:Rn,initRendererWorker:En,markdownPlugins:Xe,parseMarkdownToHtml:Vt,setMarkdownExtensions:Wa},Symbol.toStringTag,{value:"Module"}));function Ga(t,e){try{return new URL(t,e).pathname}catch{try{return new URL(t,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(e||"").replace(/\/$/,"")+"/"+String(t||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(t||"")}}}}function Qa(t,e){const n=document.createElement("aside");n.className="menu nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=t("navigation"),n.appendChild(s);const r=document.createElement("ul");return r.className="menu-list",e.forEach(i=>{const a=document.createElement("li"),u=document.createElement("a");if(u.href="#"+i.path,u.textContent=i.name,a.appendChild(u),i.children&&i.children.length){const o=document.createElement("ul");i.children.forEach(l=>{const c=document.createElement("li"),h=document.createElement("a");h.href="#"+l.path,h.textContent=l.name,c.appendChild(h),o.appendChild(c)}),a.appendChild(o)}r.appendChild(a)}),n.appendChild(r),n}function Xa(t,e,n=""){const s=document.createElement("aside");s.className="menu nimbi-toc-inner";const r=document.createElement("p");r.className="menu-label",r.textContent=t("onThisPage"),s.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const a={};(e||[]).forEach(u=>{try{if(!u||u.level===1)return;const o=Number(u.level)>=2?Number(u.level):2,l=document.createElement("li"),c=document.createElement("a"),h=u.id||ie(u.text||"");c.textContent=u.text||"";try{const m=String(n||"").replace(/^[\\.\\/]+/,""),w=m&&q&&q.has&&q.has(m)?q.get(m):m;w?c.href=`?page=${encodeURIComponent(w)}#${encodeURIComponent(h)}`:c.href=`#${encodeURIComponent(h)}`}catch(m){console.warn("[htmlBuilder] buildTocElement href normalization failed",m),c.href=`#${encodeURIComponent(h)}`}if(l.appendChild(c),o===2){i.appendChild(l),a[2]=l,Object.keys(a).forEach(m=>{Number(m)>2&&delete a[m]});return}let f=o-1;for(;f>2&&!a[f];)f--;f<2&&(f=2);let p=a[f];if(!p){i.appendChild(l),a[o]=l;return}let d=p.querySelector("ul");d||(d=document.createElement("ul"),p.appendChild(d)),d.appendChild(l),a[o]=l}catch(o){console.warn("[htmlBuilder] buildTocElement item failed",o,u)}})}catch(a){console.warn("[htmlBuilder] buildTocElement failed",a)}return s.appendChild(i),s}function ci(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=ie(n.textContent||""))})}function Ka(t,e,n){try{const s=t.querySelectorAll("img");if(s&&s.length){const r=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const u=new URL(r+a,n).toString();i.src=u;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] set image loading attribute failed",o)}}catch(u){console.warn("[htmlBuilder] resolve image src failed",u)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function Er(t,e,n){try{const s=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";let r=null;try{const a=new URL(n,location.href);r=new URL(s||".",a).toString()}catch{try{r=new URL(s||".",location.href).toString()}catch{r=s||"./"}}const i=t.querySelectorAll("*");for(const a of Array.from(i||[]))try{const u=a.tagName?a.tagName.toLowerCase():"",o=l=>{try{const c=a.getAttribute(l)||"";if(!c||/^(https?:)?\/\//i.test(c)||c.startsWith("/")||c.startsWith("#"))return;try{a.setAttribute(l,new URL(c,r).toString())}catch(h){console.warn("[htmlBuilder] rewrite asset attribute failed",l,c,h)}}catch(c){console.warn("[htmlBuilder] rewriteAttr failed",c)}};if(a.hasAttribute&&a.hasAttribute("src")&&o("src"),a.hasAttribute&&a.hasAttribute("href")&&u!=="a"&&o("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&o("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&o("poster"),a.hasAttribute("srcset")){const h=(a.getAttribute("srcset")||"").split(",").map(f=>f.trim()).filter(Boolean).map(f=>{const[p,d]=f.split(/\s+/,2);if(!p||/^(https?:)?\/\//i.test(p)||p.startsWith("/"))return f;try{const m=new URL(p,r).toString();return d?`${m} ${d}`:m}catch{return f}}).join(", ");a.setAttribute("srcset",h)}}catch(u){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",u)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let Ar="",pn=null,Rr="";async function ui(t,e,n){try{const s=t.querySelectorAll("a");if(!s||!s.length)return;let r,i;if(e===Ar&&pn)r=pn,i=Rr;else{try{r=new URL(e,location.href),i=Et(r.pathname)}catch{try{r=new URL(e,location.href),i=Et(r.pathname)}catch{r=null,i="/"}}Ar=e,pn=r,Rr=i}const a=new Set,u=[],o=new Set,l=[];for(const c of Array.from(s))try{const h=c.getAttribute("href")||"";if(!h||Dr(h))continue;try{if(h.startsWith("?")||h.indexOf("?")!==-1)try{const p=new URL(h,e||location.href),d=p.searchParams.get("page");if(d&&d.indexOf("/")===-1&&n){const m=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(m){const w=he(m+d);c.setAttribute("href","?page="+encodeURIComponent(w)+(p.hash||""));continue}}}catch{}}catch{}if(h.startsWith("/")&&!h.endsWith(".md"))continue;const f=h.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(f){let p=f[1];const d=f[2];!p.startsWith("/")&&n&&(p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+p);try{const m=new URL(p,e).pathname;let w=m.startsWith(i)?m.slice(i.length):m;w=he(w),u.push({node:c,mdPathRaw:p,frag:d,rel:w}),q.has(w)||a.add(w)}catch(m){console.warn("[htmlBuilder] resolve mdPath failed",m)}continue}try{let p=h;!h.startsWith("/")&&n&&(h.startsWith("#")?p=n+h:p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+h);const m=new URL(p,e).pathname||"";if(m&&m.indexOf(i)!==-1){let w=m.startsWith(i)?m.slice(i.length):m;if(w=he(w),w=At(w),w||(w="_home"),!w.endsWith(".md")){let k=null;try{if(q&&q.has&&q.has(w))k=q.get(w);else try{const x=String(w||"").replace(/^.*\//,"");x&&q.has&&q.has(x)&&(k=q.get(x))}catch(x){console.warn("[htmlBuilder] mdToSlug baseName check failed",x)}}catch(x){console.warn("[htmlBuilder] mdToSlug access check failed",x)}if(!k)try{const x=String(w||"").replace(/^.*\//,"");for(const[C,I]of Y||[])if(I===w||I===x){k=C;break}}catch{}k?c.setAttribute("href",`?page=${encodeURIComponent(k)}`):(o.add(w),l.push({node:c,rel:w}))}}}catch(p){console.warn("[htmlBuilder] resolving href to URL failed",p)}}catch(h){console.warn("[htmlBuilder] processing anchor failed",h)}a.size&&await Promise.all(Array.from(a).map(async c=>{try{try{const f=String(c).match(/([^\/]+)\.md$/),p=f&&f[1];if(p&&Y.has(p)){try{const d=Y.get(p);if(d)try{q.set(d,p)}catch(m){console.warn("[htmlBuilder] mdToSlug.set failed",m)}}catch(d){console.warn("[htmlBuilder] reading slugToMd failed",d)}return}}catch(f){console.warn("[htmlBuilder] basename slug lookup failed",f)}const h=await Se(c,e);if(h&&h.raw){const f=(h.raw||"").match(/^#\s+(.+)$/m);if(f&&f[1]){const p=ie(f[1].trim());if(p)try{Y.set(p,c),q.set(c,p)}catch(d){console.warn("[htmlBuilder] setting slug mapping failed",d)}}}}catch(h){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",h)}})),o.size&&await Promise.all(Array.from(o).map(async c=>{try{const h=await Se(c,e);if(h&&h.raw)try{const p=(Wn||new DOMParser).parseFromString(h.raw,"text/html"),d=p.querySelector("title"),m=p.querySelector("h1"),w=d&&d.textContent&&d.textContent.trim()?d.textContent.trim():m&&m.textContent?m.textContent.trim():null;if(w){const k=ie(w);if(k)try{Y.set(k,c),q.set(c,k)}catch(x){console.warn("[htmlBuilder] setting html slug mapping failed",x)}}}catch(f){console.warn("[htmlBuilder] parse fetched HTML failed",f)}}catch(h){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",h)}}));for(const c of u){const{node:h,frag:f,rel:p}=c;let d=null;try{q.has(p)&&(d=q.get(p))}catch(m){console.warn("[htmlBuilder] mdToSlug access failed",m)}d?f?h.setAttribute("href",`?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(d)}`):f?h.setAttribute("href",`?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(p)}`)}for(const c of l){const{node:h,rel:f}=c;let p=null;try{q.has(f)&&(p=q.get(f))}catch(d){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",d)}if(!p)try{const d=String(f||"").replace(/^.*\//,"");q.has(d)&&(p=q.get(d))}catch(d){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",d)}p?h.setAttribute("href",`?page=${encodeURIComponent(p)}`):h.setAttribute("href",`?page=${encodeURIComponent(f)}`)}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function Ya(t,e,n,s){const r=e.querySelector("h1"),i=r?(r.textContent||"").trim():"";let a="";try{i&&(a=ie(i)),!a&&t&&t.meta&&t.meta.title&&(a=ie(t.meta.title)),!a&&n&&(a=ie(String(n))),a||(a="_home");try{n&&(Y.set(a,n),q.set(n,a))}catch(u){console.warn("[htmlBuilder] computeSlug set slug mapping failed",u)}try{let u="?page="+encodeURIComponent(a);try{const o=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");o&&(u+="#"+encodeURIComponent(o))}catch(o){console.warn("[htmlBuilder] computeSlug hash decode failed",o)}try{history.replaceState({page:a},"",u)}catch(o){console.warn("[htmlBuilder] computeSlug history replace failed",o)}}catch(u){console.warn("[htmlBuilder] computeSlug inner failed",u)}}catch(u){console.warn("[htmlBuilder] computeSlug failed",u)}return{topH1:r,h1Text:i,slugKey:a}}async function Va(t,e){if(!t||!t.length)return;const n=new Set;for(const o of Array.from(t||[]))try{const l=o.getAttribute("href")||"";if(!l)continue;let f=he(l).split(/::|#/,2)[0];try{const d=f.indexOf("?");d!==-1&&(f=f.slice(0,d))}catch{}if(!f||(f.includes(".")||(f=f+".html"),!/\.html(?:$|[?#])/.test(f)&&!f.toLowerCase().endsWith(".html")))continue;const p=f;try{if(q&&q.has&&q.has(p))continue}catch(d){console.warn("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const m of Y.values())if(m===p){d=!0;break}if(d)continue}catch(d){console.warn("[htmlBuilder] slugToMd iteration failed",d)}n.add(p)}catch(l){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",l)}if(!n.size)return;const s=async o=>{try{const l=await Se(o,e);if(l&&l.raw)try{const h=(Wn||new DOMParser).parseFromString(l.raw,"text/html"),f=h.querySelector("title"),p=h.querySelector("h1"),d=f&&f.textContent&&f.textContent.trim()?f.textContent.trim():p&&p.textContent?p.textContent.trim():null;if(d){const m=ie(d);if(m)try{Y.set(m,o),q.set(o,m)}catch(w){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",w)}}}catch(c){console.warn("[htmlBuilder] parse HTML title failed",c)}}catch(l){console.warn("[htmlBuilder] fetchAndExtract failed",l)}},r=5,i=Array.from(n);let a=0;const u=[];for(;a<i.length;){const o=i.slice(a,a+r);u.push(Promise.all(o.map(s))),a+=r}await Promise.all(u)}async function Ja(t,e){if(!t||!t.length)return;const n=[],s=new Set;let r="";try{const i=new URL(e,typeof location<"u"?location.href:"http://localhost/");r=Et(i.pathname)}catch(i){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(t||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const u=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(u){let o=he(u[1]);try{let l;try{l=Ga(o,e)}catch(h){l=o,console.warn("[htmlBuilder] resolve mdPath URL failed",h)}const c=l&&r&&l.startsWith(r)?l.slice(r.length):String(l||"").replace(/^\//,"");n.push({rel:c}),q.has(c)||s.add(c)}catch(l){console.warn("[htmlBuilder] rewriteAnchors failed",l)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),u=a&&a[1];if(u&&Y.has(u)){try{const o=Y.get(u);o&&q.set(o,u)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await Se(i,e);if(a&&a.raw){const u=(a.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]){const o=ie(u[1].trim());if(o)try{Y.set(o,i),q.set(i,o)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",l)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const Wn=typeof DOMParser<"u"?new DOMParser:null;function fn(t){try{const n=(Wn||new DOMParser).parseFromString(t||"","text/html");ci(n);try{n.querySelectorAll("img").forEach(u=>{try{u.getAttribute("loading")||u.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",o)}})}catch(a){console.warn("[htmlBuilder] parseHtml query images failed",a)}n.querySelectorAll("pre code, code[class]").forEach(a=>{try{const u=a.getAttribute&&a.getAttribute("class")||a.className||"",o=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const l=(o[1]||"").toLowerCase(),c=V.size&&(V.get(l)||V.get(String(l).toLowerCase()))||l;try{(async()=>{try{await ot(c)}catch(h){console.warn("[htmlBuilder] registerLanguage failed",h)}})()}catch(h){console.warn("[htmlBuilder] schedule registerLanguage failed",h)}}else try{if(ue&&typeof ue.getLanguage=="function"&&ue.getLanguage("plaintext")){const l=ue.highlight?ue.highlight(a.textContent||"",{language:"plaintext"}):null;l&&l.value&&(a.innerHTML=l.value)}}catch(l){console.warn("[htmlBuilder] plaintext highlight fallback failed",l)}}catch(u){console.warn("[htmlBuilder] code element processing failed",u)}});const r=[];return n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(a=>{r.push({level:Number(a.tagName.substring(1)),text:(a.textContent||"").trim(),id:a.id})}),{html:n.body.innerHTML,meta:{},toc:r}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function eo(t){const e=Rn?Rn(t||"",V):new Set,n=new Set(e),s=[];for(const r of n)try{const i=V.size&&(V.get(r)||V.get(String(r).toLowerCase()))||r;try{s.push(ot(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(i))try{s.push(ot(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function to(t){if(await eo(t),Vt){const e=await Vt(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function no(t,e,n,s,r){let i=null;if(e.isHtml)try{const h=typeof DOMParser<"u"?new DOMParser:null;if(h){const f=h.parseFromString(e.raw||"","text/html");try{Er(f.body,n,r)}catch(p){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",p)}i=fn(f.documentElement&&f.documentElement.outerHTML?f.documentElement.outerHTML:e.raw||"")}else i=fn(e.raw||"")}catch{i=fn(e.raw||"")}else i=await to(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{Er(a,n,r)}catch(h){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",h)}try{ci(a)}catch(h){console.warn("[htmlBuilder] addHeadingIds failed",h)}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(m){f.className=d,console.warn("[htmlBuilder] set element class failed",m)}else try{f.removeAttribute&&f.removeAttribute("class")}catch(m){f.className="",console.warn("[htmlBuilder] remove element class failed",m)}}catch(p){console.warn("[htmlBuilder] code element cleanup failed",p)}})}catch(h){console.warn("[htmlBuilder] processing code elements failed",h)}try{Pr(a)}catch(h){console.warn("[htmlBuilder] observeCodeBlocks failed",h)}Ka(a,n,r);const{topH1:u,h1Text:o,slugKey:l}=Ya(i,a,n,s);try{await ro(a,r,n)}catch(h){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",h),await ui(a,r,n)}const c=Xa(t,i.toc,n);return{article:a,parsed:i,toc:c,topH1:u,h1Text:o,slugKey:l}}function Lr(t,e,n){t&&(t.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=e&&e("notFound")||"Page not found";const i=document.createElement("p");i.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",s.appendChild(r),s.appendChild(i),t&&t.appendChild&&t.appendChild(s)}async function ro(t,e,n){return ui(t,e,n)}function io(t){try{t.addEventListener("click",e=>{const n=e.target&&e.target.closest?e.target.closest("a"):null;if(!n)return;const s=n.getAttribute("href")||"";try{const r=new URL(s,location.href),i=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!i&&!a)return;e.preventDefault();let u=null;try{history&&history.state&&history.state.page&&(u=history.state.page)}catch(o){u=null,console.warn("[htmlBuilder] access history.state failed",o)}try{u||(u=new URL(location.href).searchParams.get("page"))}catch(o){console.warn("[htmlBuilder] parse current location failed",o)}if(!i&&a||i&&u&&String(i)===String(u)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:u||i},"","?page="+encodeURIComponent(u||i)+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}}catch(o){console.warn("[htmlBuilder] update history for anchor failed",o)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(o){console.warn("[htmlBuilder] stopPropagation failed",o)}try{Ln(a)}catch(o){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:i},"","?page="+encodeURIComponent(i)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){console.warn("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.warn("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){console.warn("[htmlBuilder] renderByQuery failed",o)}}catch(o){console.warn("[htmlBuilder] SPA navigation invocation failed",o)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function Ln(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const n=document.getElementById(t);if(n)try{const s=()=>{try{if(e&&e.scrollTo&&e.contains(n)){const r=n.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(s,50)}}catch(s){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",n)}}function so(t,e,{mountOverlay:n=null,container:s=null,mountEl:r=null,navWrap:i=null,t:a=null}={}){try{const u=a||(m=>typeof m=="string"?m:""),o=s||document.querySelector(".nimbi-cms"),l=r||document.querySelector(".nimbi-mount"),c=n||document.querySelector(".nimbi-overlay"),h=i||document.querySelector(".nimbi-nav-wrap");let p=document.querySelector(".nimbi-scroll-top");if(!p){p=document.createElement("button"),p.className="nimbi-scroll-top button is-primary is-rounded is-small",p.setAttribute("aria-label",u("scrollToTop")),p.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{c&&c.appendChild?c.appendChild(p):o&&o.appendChild?o.appendChild(p):l&&l.appendChild?l.appendChild(p):document.body.appendChild(p)}catch{try{document.body.appendChild(p)}catch(w){console.warn("[htmlBuilder] append scroll top button failed",w)}}try{try{Br(p)}catch{}}catch(m){console.warn("[htmlBuilder] set scroll-top button theme registration failed",m)}p.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback container scrollTop failed",w)}try{r&&(r.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",w)}try{document.documentElement.scrollTop=0}catch(w){console.warn("[htmlBuilder] fallback document scrollTop failed",w)}}})}const d=h&&h.querySelector?h.querySelector(".menu-label"):null;if(e){if(!p._nimbiObserver){const m=new IntersectionObserver(w=>{for(const k of w)k.target instanceof Element&&(k.isIntersecting?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show")))},{root:s instanceof Element?s:r instanceof Element?r:null,threshold:0});p._nimbiObserver=m}try{p._nimbiObserver.disconnect()}catch(m){console.warn("[htmlBuilder] observer disconnect failed",m)}try{p._nimbiObserver.observe(e)}catch(m){console.warn("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const w=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},k=e.getBoundingClientRect();!(k.bottom<w.top||k.top>w.bottom)?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show"))}catch(w){console.warn("[htmlBuilder] checkIntersect failed",w)}};m(),"IntersectionObserver"in window||setTimeout(m,100)}catch(m){console.warn("[htmlBuilder] checkIntersect outer failed",m)}}else{p.classList.remove("show"),d&&d.classList.remove("show");const m=s instanceof Element?s:r instanceof Element?r:window,w=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(p.classList.add("show"),d&&d.classList.add("show")):(p.classList.remove("show"),d&&d.classList.remove("show"))}catch(k){console.warn("[htmlBuilder] onScroll handler failed",k)}};Wt(()=>m.addEventListener("scroll",w)),w()}}catch(u){console.warn("[htmlBuilder] ensureScrollTopButton failed",u)}}function Tr(t,e){try{if(!t)return;try{const n=t[e];if(typeof n<"u")return n}catch{}try{if(t.default)return t.default[e]}catch{}return}catch{return}}async function ao(t,e,n,s,r,i,a,u,o="eager",l=1,c=void 0){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const h=typeof DOMParser<"u"?new DOMParser:null,f=h?h.parseFromString(n||"","text/html"):null,p=f?f.querySelectorAll("a"):[];await Wt(()=>Va(p,s)),await Wt(()=>Ja(p,s));let d=null,m=null,w=null;function k(){try{const A=document.querySelector(".navbar-burger"),T=A&&A.dataset?A.dataset.target:null,b=T?document.getElementById(T):null;A&&A.classList.contains("is-active")&&(A.classList.remove("is-active"),A.setAttribute("aria-expanded","false"),b&&b.classList.remove("is-active"))}catch(A){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",A)}}const x=()=>d||(d=(async()=>{try{const A=await Promise.resolve().then(()=>qt),T=Tr(A,"buildSearchIndexWorker"),b=Tr(A,"buildSearchIndex");if(o==="lazy"&&typeof T=="function")try{const v=await T(s,l,c);if(v&&v.length)return v}catch(v){console.warn&&console.warn("[nimbi-cms] worker builder threw",v)}return typeof b=="function"?await b(s,l,c):[]}catch(A){return console.warn("[nimbi-cms] buildSearchIndex failed",A),[]}finally{if(m){try{m.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}}})(),d.then(A=>{try{const T=String(m&&m.value||"").trim().toLowerCase();if(!T||!Array.isArray(A)||!A.length)return;const b=A.filter(R=>R.title&&R.title.toLowerCase().includes(T)||R.excerpt&&R.excerpt.toLowerCase().includes(T));if(!b||!b.length)return;const v=document.getElementById("nimbi-search-results");if(!v)return;v.innerHTML="",b.slice(0,10).forEach(R=>{const y=document.createElement("div");if(y.className="nimbi-search-result",R.parentTitle){const G=document.createElement("div");G.textContent=R.parentTitle,G.className="nimbi-search-title nimbi-search-parent",y.appendChild(G)}const H=document.createElement("a");H.className="block",H.href="?page="+encodeURIComponent(R.slug),H.textContent=R.title,H.addEventListener("click",()=>{try{v.style.display="none"}catch{}}),y.appendChild(H),v.appendChild(y)});try{v.style.display="block"}catch{}}catch{}}).catch(()=>{}),d),C=document.createElement("nav");C.className="navbar",C.setAttribute("role","navigation"),C.setAttribute("aria-label","main navigation");const I=document.createElement("div");I.className="navbar-brand";const M=p[0],z=document.createElement("a");if(z.className="navbar-item",M){const A=M.getAttribute("href")||"#";try{const b=new URL(A,location.href).searchParams.get("page");b?z.href="?page="+encodeURIComponent(decodeURIComponent(b)):(z.href="?page="+encodeURIComponent(r),z.textContent=i("home"))}catch{z.href="?page="+encodeURIComponent(r),z.textContent=i("home")}}else z.href="?page="+encodeURIComponent(r),z.textContent=i("home");I.appendChild(z),z.addEventListener("click",function(A){const T=z.getAttribute("href")||"";if(T.startsWith("?page=")){A.preventDefault();const b=new URL(T,location.href),v=b.searchParams.get("page"),R=b.hash?b.hash.replace(/^#/,""):null;history.pushState({page:v},"","?page="+encodeURIComponent(v)+(R?"#"+encodeURIComponent(R):""));try{a()}catch(y){console.warn("[nimbi-cms] renderByQuery failed",y)}try{k()}catch{}}});const N=document.createElement("a");N.className="navbar-burger",N.setAttribute("role","button"),N.setAttribute("aria-label","menu"),N.setAttribute("aria-expanded","false");const K="nimbi-navbar-menu";N.dataset.target=K,N.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',I.appendChild(N);try{N.addEventListener("click",A=>{try{const T=N.dataset&&N.dataset.target?N.dataset.target:null,b=T?document.getElementById(T):null;N.classList.contains("is-active")?(N.classList.remove("is-active"),N.setAttribute("aria-expanded","false"),b&&b.classList.remove("is-active")):(N.classList.add("is-active"),N.setAttribute("aria-expanded","true"),b&&b.classList.add("is-active"))}catch(T){console.warn("[nimbi-cms] navbar burger toggle failed",T)}})}catch(A){console.warn("[nimbi-cms] burger event binding failed",A)}const J=document.createElement("div");J.className="navbar-menu",J.id=K;const se=document.createElement("div");se.className="navbar-start";let j,Q,O;if(!u)j=null,m=null,O=null;else{j=document.createElement("div"),j.className="navbar-end",Q=document.createElement("div"),Q.className="navbar-item",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=i("searchPlaceholder")||"",m.id="nimbi-search",o==="eager"&&(m.disabled=!0),w=document.createElement("div"),w.className="control",o==="eager"&&w.classList.add("is-loading"),w.appendChild(m),Q.appendChild(w),O=document.createElement("div"),O.id="nimbi-search-results",O.className="box",Q.appendChild(O),j.appendChild(Q);const A=b=>{if(O.innerHTML="",!b.length){O.classList.remove("is-open");try{O.style.display="none"}catch{}return}b.forEach(v=>{const R=document.createElement("div");if(R.className="nimbi-search-result",v.parentTitle){const H=document.createElement("div");H.textContent=v.parentTitle,H.className="nimbi-search-title nimbi-search-parent",R.appendChild(H)}const y=document.createElement("a");y.className="block",y.href="?page="+encodeURIComponent(v.slug),y.textContent=v.title,y.addEventListener("click",()=>{O.style.display="none"}),R.appendChild(y),O.appendChild(R)});try{O.style.display="block"}catch{}O.classList.add("is-open")},T=(b,v)=>{let R=null;return(...y)=>{R&&clearTimeout(R),R=setTimeout(()=>b(...y),v)}};if(m){const b=T(async()=>{const v=document.querySelector("input#nimbi-search"),R=String(v&&v.value||"").trim().toLowerCase();if(!R){A([]);return}try{await x();const H=(await d).filter(G=>G.title&&G.title.toLowerCase().includes(R)||G.excerpt&&G.excerpt.toLowerCase().includes(R));A(H.slice(0,10))}catch(y){console.warn("[nimbi-cms] search input handler failed",y),A([])}},50);try{m.addEventListener("input",b)}catch{}try{document.addEventListener("input",v=>{try{v&&v.target&&v.target.id==="nimbi-search"&&b(v)}catch{}},!0)}catch{}}if(o==="eager"){try{d=x()}catch(b){console.warn("[nimbi-cms] eager search index init failed",b),d=Promise.resolve([])}d.finally(()=>{const b=document.querySelector("input#nimbi-search");if(b){try{b.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}})}}for(let A=0;A<p.length;A++){const T=p[A];if(A===0)continue;const b=T.getAttribute("href")||"#",v=document.createElement("a");v.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(b)||b.endsWith(".md")){const y=he(b).split(/::|#/,2),H=y[0],G=y[1];v.href="?page="+encodeURIComponent(H)+(G?"#"+encodeURIComponent(G):"")}else if(/\.html(?:$|[#?])/.test(b)||b.endsWith(".html")){const y=he(b).split(/::|#/,2);let H=y[0];H&&!H.toLowerCase().endsWith(".html")&&(H=H+".html");const G=y[1];try{const ge=await Se(H,s);if(ge&&ge.raw)try{const ee=new DOMParser().parseFromString(ge.raw,"text/html"),oe=ee.querySelector("title"),me=ee.querySelector("h1"),Ue=oe&&oe.textContent&&oe.textContent.trim()?oe.textContent.trim():me&&me.textContent?me.textContent.trim():null;if(Ue){const qe=ie(Ue);if(qe){try{Y.set(qe,H),q.set(H,qe)}catch(Zn){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Zn)}v.href="?page="+encodeURIComponent(qe)+(G?"#"+encodeURIComponent(G):"")}else v.href="?page="+encodeURIComponent(H)+(G?"#"+encodeURIComponent(G):"")}else v.href="?page="+encodeURIComponent(H)+(G?"#"+encodeURIComponent(G):"")}catch{v.href="?page="+encodeURIComponent(H)+(G?"#"+encodeURIComponent(G):"")}else v.href=b}catch{v.href=b}}else v.href=b}catch(R){console.warn("[nimbi-cms] nav item href parse failed",R),v.href=b}try{const R=T.textContent&&String(T.textContent).trim()?String(T.textContent).trim():null;if(R)try{const y=ie(R);if(y){const H=v.getAttribute&&v.getAttribute("href")?v.getAttribute("href"):"";try{const ge=new URL(H,location.href).searchParams.get("page");if(ge){const ke=decodeURIComponent(ge);try{Y.set(y,ke),q.set(ke,y)}catch(ee){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",ee)}}}catch(G){console.warn("[nimbi-cms] nav slug mapping failed",G)}}}catch(y){console.warn("[nimbi-cms] nav slug mapping failed",y)}}catch(R){console.warn("[nimbi-cms] nav slug mapping failed",R)}v.textContent=T.textContent||b,se.appendChild(v)}J.appendChild(se),j&&J.appendChild(j),C.appendChild(I),C.appendChild(J),t.appendChild(C);try{const A=T=>{try{const b=C&&C.querySelector?C.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!b||!b.classList.contains("is-active"))return;const v=b&&b.closest?b.closest(".navbar"):C;if(v&&v.contains(T.target))return;k()}catch{}};document.addEventListener("click",A,!0),document.addEventListener("touchstart",A,!0)}catch{}try{J.addEventListener("click",A=>{const T=A.target&&A.target.closest?A.target.closest("a"):null;if(!T)return;const b=T.getAttribute("href")||"";try{const v=new URL(b,location.href),R=v.searchParams.get("page"),y=v.hash?v.hash.replace(/^#/,""):null;if(R){A.preventDefault(),history.pushState({page:R},"","?page="+encodeURIComponent(R)+(y?"#"+encodeURIComponent(y):""));try{a()}catch(H){console.warn("[nimbi-cms] renderByQuery failed",H)}}}catch(v){console.warn("[nimbi-cms] navbar click handler failed",v)}try{const v=C&&C.querySelector?C.querySelector(".navbar-burger"):null,R=v&&v.dataset?v.dataset.target:null,y=R?document.getElementById(R):null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),y&&y.classList.remove("is-active"))}catch(v){console.warn("[nimbi-cms] mobile menu close failed",v)}})}catch(A){console.warn("[nimbi-cms] attach content click handler failed",A)}try{e.addEventListener("click",A=>{const T=A.target&&A.target.closest?A.target.closest("a"):null;if(!T)return;const b=T.getAttribute("href")||"";if(b&&!Dr(b))try{const v=new URL(b,location.href),R=v.searchParams.get("page"),y=v.hash?v.hash.replace(/^#/,""):null;if(R){A.preventDefault(),history.pushState({page:R},"","?page="+encodeURIComponent(R)+(y?"#"+encodeURIComponent(y):""));try{a()}catch(H){console.warn("[nimbi-cms] renderByQuery failed",H)}}}catch(v){console.warn("[nimbi-cms] container click URL parse failed",v)}})}catch(A){console.warn("[nimbi-cms] build navbar failed",A)}return{navbar:C,linkEls:p}}try{document.addEventListener("input",t=>{try{if(t&&t.target&&t.target.id==="nimbi-search"){const e=document.getElementById("nimbi-search-results");if(e&&t.target&&t.target.value)try{e.style.display="block"}catch{}}}catch{}},!0)}catch{}var gn,Cr;function oo(){if(Cr)return gn;Cr=1;function t(i,a){return a.some(([u,o])=>u<=i&&i<=o)}function e(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(i,a={}){let u=0,o=0,l=i.length-1;const c=a.wordsPerMinute||200,h=a.wordBound||n;for(;h(i[o]);)o++;for(;h(i[l]);)l--;const f=`${i}
`;for(let w=o;w<=l;w++)if((e(f[w])||!h(f[w])&&(h(f[w+1])||e(f[w+1])))&&u++,e(f[w]))for(;w<=l&&(s(f[w+1])||h(f[w+1]));)w++;const p=u/c,d=Math.round(p*60*1e3);return{text:Math.ceil(p.toFixed(2))+" min read",minutes:p,time:d,words:u}}return gn=r,gn}var lo=oo();const co=$r(lo);function Mr(t,e){let n=document.querySelector(`meta[name="${t}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",t),document.head.appendChild(n)),n.setAttribute("content",e)}function rt(t,e,n){let s=`meta[${t}="${e}"]`,r=document.querySelector(s);r||(r=document.createElement("meta"),r.setAttribute(t,e),document.head.appendChild(r)),r.setAttribute("content",n)}function uo(t,e){try{let n=document.querySelector(`link[rel="${t}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",t),document.head.appendChild(n)),n.setAttribute("href",e)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function ho(t,e,n,s){const r=e&&String(e).trim()?e:t.title||document.title;rt("property","og:title",r);const i=s&&String(s).trim()?s:t.description||"";i&&String(i).trim()&&rt("property","og:description",i),rt("name","twitter:card",t.twitter_card||"summary_large_image");const a=n||t.image;a&&(rt("property","og:image",a),rt("name","twitter:image",a))}function po(t,e,n,s,r=""){const i=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";u&&String(u).trim()&&Mr("description",u),Mr("robots",i.robots||"index,follow"),ho(i,e,n,u)}function fo(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const n=document.querySelector(e);if(n){const s=n.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function go(t,e,n,s,r,i=""){try{const a=t.meta||{},u=n&&String(n).trim()?n:a.title||i||document.title,o=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",l=s||a.image||null;let c="";try{if(e){const d=he(e);try{c=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(d)}catch{c=location.href.split("#")[0]}}else c=location.href.split("#")[0]}catch(d){c=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",d)}c&&uo("canonical",c);try{rt("property","og:url",c)}catch(d){console.warn("[seoManager] upsertMeta og:url failed",d)}const h={"@context":"https://schema.org","@type":"Article",headline:u||"",description:o||"",url:c||location.href.split("#")[0]};l&&(h.image=String(l)),a.date&&(h.datePublished=a.date),a.dateModified&&(h.dateModified=a.dateModified);const f="nimbi-jsonld";let p=document.getElementById(f);p||(p=document.createElement("script"),p.type="application/ld+json",p.id=f,document.head.appendChild(p)),p.textContent=JSON.stringify(h,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function mo(t,e,n,s,r,i,a,u,o,l,c){try{const h=s.querySelector(".menu-label");h&&(h.textContent=u&&u.textContent||t("onThisPage"))}catch(h){console.warn("[seoManager] update toc label failed",h)}try{const h=n.meta&&n.meta.title?String(n.meta.title).trim():"",f=r.querySelector("img"),p=f&&(f.getAttribute("src")||f.src)||null;let d="";try{let w="";try{const k=u||(r&&r.querySelector?r.querySelector("h1"):null);if(k){let x=k.nextElementSibling;const C=[];for(;x&&!(x.tagName&&x.tagName.toLowerCase()==="h2");){const I=(x.textContent||"").trim();I&&C.push(I),x=x.nextElementSibling}C.length&&(w=C.join(" ").replace(/\s+/g," ").trim()),!w&&o&&(w=String(o).trim())}}catch(k){console.warn("[seoManager] compute descOverride failed",k)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),d=w}catch(w){console.warn("[seoManager] compute descOverride failed",w)}try{po(n,o,p,d)}catch(w){console.warn("[seoManager] setMetaTags failed",w)}try{go(n,l,o,p,d,e)}catch(w){console.warn("[seoManager] setStructuredData failed",w)}const m=fo();o?m?document.title=`${m} - ${o}`:document.title=`${e||"Site"} - ${o}`:h?document.title=h:document.title=e||document.title}catch(h){console.warn("[seoManager] applyPageMeta failed",h)}try{const h=r.querySelector(".nimbi-reading-time");if(h&&h.remove(),o){const f=co(c.raw||""),p=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,d=document.createElement("p");d.className="nimbi-reading-time",d.textContent=p?t("readingTime",{minutes:p}):"";const m=r.querySelector("h1");m&&m.insertAdjacentElement("afterend",d)}}catch(h){console.warn("[seoManager] reading time update failed",h)}}let Ee=null,U=null,be=1,Ze=(t,e)=>e,kt=0,xt=0,jt=()=>{},gt=.25;function wo(){if(Ee&&document.contains(Ee))return Ee;Ee=null;const t=document.createElement("dialog");t.className="nimbi-image-preview",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Ze("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",b=>{b.target===t&&mn()}),t.addEventListener("wheel",b=>{if(!se())return;b.preventDefault();const v=b.deltaY<0?gt:-gt;He(be+v),l(),c()},{passive:!1}),t.addEventListener("keydown",b=>{if(b.key==="Escape"){mn();return}if(be>1){const v=t.querySelector(".nimbi-image-preview__image-wrapper");if(!v)return;const R=40;switch(b.key){case"ArrowUp":v.scrollTop-=R,b.preventDefault();break;case"ArrowDown":v.scrollTop+=R,b.preventDefault();break;case"ArrowLeft":v.scrollLeft-=R,b.preventDefault();break;case"ArrowRight":v.scrollLeft+=R,b.preventDefault();break}}}),document.body.appendChild(t),Ee=t,U=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),n=t.querySelector("[data-nimbi-preview-original]"),s=t.querySelector("[data-nimbi-preview-zoom-in]"),r=t.querySelector("[data-nimbi-preview-zoom-out]"),i=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),u=t.querySelector("[data-nimbi-preview-zoom-label]"),o=t.querySelector("[data-nimbi-preview-zoom-hud]");function l(){u&&(u.textContent=`${Math.round(be*100)}%`)}const c=()=>{o&&(o.textContent=`${Math.round(be*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};jt=l,s.addEventListener("click",()=>{He(be+gt),l(),c()}),r.addEventListener("click",()=>{He(be-gt),l(),c()}),e.addEventListener("click",()=>{St(),l(),c()}),n.addEventListener("click",()=>{He(1),l(),c()}),i.addEventListener("click",()=>{St(),l(),c()}),a.addEventListener("click",mn),e.title=Ze("imagePreviewFit","Fit to screen"),n.title=Ze("imagePreviewOriginal","Original size"),r.title=Ze("imagePreviewZoomOut","Zoom out"),s.title=Ze("imagePreviewZoomIn","Zoom in"),a.title=Ze("imagePreviewClose","Close"),a.setAttribute("aria-label",Ze("imagePreviewClose","Close"));let h=!1,f=0,p=0,d=0,m=0;const w=new Map;let k=0,x=1;const C=(b,v)=>{const R=b.x-v.x,y=b.y-v.y;return Math.hypot(R,y)},I=()=>{h=!1,w.clear(),k=0,U&&(U.classList.add("is-panning"),U.classList.remove("is-grabbing"))};let M=0,z=0,N=0;const K=b=>{const v=Date.now(),R=v-M,y=b.clientX-z,H=b.clientY-N;M=v,z=b.clientX,N=b.clientY,R<300&&Math.hypot(y,H)<30&&(He(be>1?1:2),l(),b.preventDefault())},J=b=>{He(be>1?1:2),l(),b.preventDefault()},se=()=>Ee?typeof Ee.open=="boolean"?Ee.open:Ee.classList.contains("is-active"):!1,j=(b,v,R=1)=>{if(w.has(R)&&w.set(R,{x:b,y:v}),w.size===2){const ge=Array.from(w.values()),ke=C(ge[0],ge[1]);if(k>0){const ee=ke/k;He(x*ee)}return}if(!h)return;const y=U.closest(".nimbi-image-preview__image-wrapper");if(!y)return;const H=b-f,G=v-p;y.scrollLeft=d-H,y.scrollTop=m-G},Q=(b,v,R=1)=>{if(!se())return;if(w.set(R,{x:b,y:v}),w.size===2){const G=Array.from(w.values());k=C(G[0],G[1]),x=be;return}const y=U.closest(".nimbi-image-preview__image-wrapper");!y||!(y.scrollWidth>y.clientWidth||y.scrollHeight>y.clientHeight)||(h=!0,f=b,p=v,d=y.scrollLeft,m=y.scrollTop,U.classList.add("is-panning"),U.classList.remove("is-grabbing"),window.addEventListener("pointermove",O),window.addEventListener("pointerup",A),window.addEventListener("pointercancel",A))},O=b=>{h&&(b.preventDefault(),j(b.clientX,b.clientY,b.pointerId))},A=()=>{I(),window.removeEventListener("pointermove",O),window.removeEventListener("pointerup",A),window.removeEventListener("pointercancel",A)};U.addEventListener("pointerdown",b=>{b.preventDefault(),Q(b.clientX,b.clientY,b.pointerId)}),U.addEventListener("pointermove",b=>{(h||w.size===2)&&b.preventDefault(),j(b.clientX,b.clientY,b.pointerId)}),U.addEventListener("pointerup",b=>{b.preventDefault(),b.pointerType==="touch"&&K(b),I()}),U.addEventListener("dblclick",J),U.addEventListener("pointercancel",I),U.addEventListener("mousedown",b=>{b.preventDefault(),Q(b.clientX,b.clientY,1)}),U.addEventListener("mousemove",b=>{h&&b.preventDefault(),j(b.clientX,b.clientY,1)}),U.addEventListener("mouseup",b=>{b.preventDefault(),I()});const T=t.querySelector(".nimbi-image-preview__image-wrapper");return T&&(T.addEventListener("pointerdown",b=>{if(Q(b.clientX,b.clientY,b.pointerId),b&&b.target&&b.target.tagName==="IMG")try{b.target.classList.add("is-grabbing")}catch{}}),T.addEventListener("pointermove",b=>{j(b.clientX,b.clientY,b.pointerId)}),T.addEventListener("pointerup",I),T.addEventListener("pointercancel",I),T.addEventListener("mousedown",b=>{if(Q(b.clientX,b.clientY,1),b&&b.target&&b.target.tagName==="IMG")try{b.target.classList.add("is-grabbing")}catch{}}),T.addEventListener("mousemove",b=>{j(b.clientX,b.clientY,1)}),T.addEventListener("mouseup",I)),t}function He(t){if(!U)return;const e=Number(t);be=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const s=U.getBoundingClientRect(),r=kt||U.naturalWidth||U.width||s.width||0,i=xt||U.naturalHeight||U.height||s.height||0;if(r&&i){U.style.setProperty("--nimbi-preview-img-max-width","none"),U.style.setProperty("--nimbi-preview-img-max-height","none"),U.style.setProperty("--nimbi-preview-img-width",`${r*be}px`),U.style.setProperty("--nimbi-preview-img-height",`${i*be}px`),U.style.setProperty("--nimbi-preview-img-transform","none");try{U.style.width=`${r*be}px`,U.style.height=`${i*be}px`,U.style.transform="none"}catch{}}else{U.style.setProperty("--nimbi-preview-img-max-width",""),U.style.setProperty("--nimbi-preview-img-max-height",""),U.style.setProperty("--nimbi-preview-img-width",""),U.style.setProperty("--nimbi-preview-img-height",""),U.style.setProperty("--nimbi-preview-img-transform",`scale(${be})`);try{U.style.transform=`scale(${be})`}catch{}}U&&(U.classList.add("is-panning"),U.classList.remove("is-grabbing"))}function St(){if(!U)return;const t=U.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const n=kt||U.naturalWidth||e.width,s=xt||U.naturalHeight||e.height;if(!n||!s)return;const r=e.width/n,i=e.height/s,a=Math.min(r,i,1);He(Number.isFinite(a)?a:1)}function bo(t,e="",n=0,s=0){const r=wo();be=1,kt=n||0,xt=s||0,U.src=t,U.alt=e,U.style.transform="scale(1)";const i=()=>{kt=U.naturalWidth||U.width||0,xt=U.naturalHeight||U.height||0};if(i(),St(),jt(),requestAnimationFrame(()=>{St(),jt()}),!kt||!xt){const a=()=>{i(),requestAnimationFrame(()=>{St(),jt()}),U.removeEventListener("load",a)};U.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active"),r.focus()}function mn(){Ee&&(typeof Ee.close=="function"&&Ee.open&&Ee.close(),Ee.classList.remove("is-active"))}function yo(t,{t:e,zoomStep:n=.25}={}){if(!t||!t.querySelectorAll)return;Ze=(p,d)=>(typeof e=="function"?e(p):void 0)||d,gt=n,t.addEventListener("click",p=>{const d=p.target;if(!d||d.tagName!=="IMG")return;const m=d;if(m.src){if(p.defaultPrevented!==!0){const w=m.closest("a");w&&w.getAttribute("href")&&p.preventDefault()}bo(m.src,m.alt||"",m.naturalWidth||0,m.naturalHeight||0)}});let s=!1,r=0,i=0,a=0,u=0;const o=new Map;let l=0,c=1;const h=(p,d)=>{const m=p.x-d.x,w=p.y-d.y;return Math.hypot(m,w)};t.addEventListener("pointerdown",p=>{const d=p.target;if(!d||d.tagName!=="IMG"||!Ee||!Ee.open)return;if(o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){const w=Array.from(o.values());l=h(w[0],w[1]),c=be;return}const m=d.closest(".nimbi-image-preview__image-wrapper");if(m&&!(be<=1)){p.preventDefault(),s=!0,r=p.clientX,i=p.clientY,a=m.scrollLeft,u=m.scrollTop,d.setPointerCapture(p.pointerId);try{d.classList.add("is-grabbing")}catch{}}}),t.addEventListener("pointermove",p=>{if(o.has(p.pointerId)&&o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){p.preventDefault();const x=Array.from(o.values()),C=h(x[0],x[1]);if(l>0){const I=C/l;He(c*I)}return}if(!s)return;p.preventDefault();const m=p.target.closest(".nimbi-image-preview__image-wrapper");if(!m)return;const w=p.clientX-r,k=p.clientY-i;m.scrollLeft=a-w,m.scrollTop=u-k});const f=()=>{s=!1,o.clear(),l=0;try{const p=document.querySelector("[data-nimbi-preview-image]");p&&(p.classList.add("is-panning"),p.classList.remove("is-grabbing"))}catch{}};t.addEventListener("pointerup",f),t.addEventListener("pointercancel",f)}function ko(t){const{contentWrap:e,navWrap:n,container:s,mountOverlay:r=null,t:i,contentBase:a,homePage:u,initialDocumentTitle:o,runHooks:l}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let c=null;const h=Qa(i,[{path:u,name:i("home"),isIndex:!0,children:[]}]);async function f(k,x){let C,I,M;try{({data:C,pagePath:I,anchor:M}=await Vs(k,a))}catch(Q){console.error("[nimbi-cms] fetchPageData failed",Q),Lr(e,i,Q);return}!M&&x&&(M=x);try{Ln(null)}catch(Q){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",Q)}e.innerHTML="";const{article:z,parsed:N,toc:K,topH1:J,h1Text:se,slugKey:j}=await no(i,C,I,M,a);mo(i,o,N,K,z,I,M,J,se,j,C),n.innerHTML="",n.appendChild(K),io(K);try{await l("transformHtml",{article:z,parsed:N,toc:K,pagePath:I,anchor:M,topH1:J,h1Text:se,slugKey:j,data:C})}catch(Q){console.warn("[nimbi-cms] transformHtml hooks failed",Q)}e.appendChild(z);try{yo(z,{t:i})}catch(Q){console.warn("[nimbi-cms] attachImagePreview failed",Q)}try{Ot(s,100,!1),requestAnimationFrame(()=>Ot(s,100,!1)),setTimeout(()=>Ot(s,100,!1),250)}catch(Q){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",Q)}Ln(M),so(z,J,{mountOverlay:r,container:s,navWrap:n,t:i});try{await l("onPageLoad",{data:C,pagePath:I,anchor:M,article:z,toc:K,topH1:J,h1Text:se,slugKey:j,contentWrap:e,navWrap:n})}catch(Q){console.warn("[nimbi-cms] onPageLoad hooks failed",Q)}c=I}async function p(){let k=new URLSearchParams(location.search).get("page")||u;const x=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await f(k,x)}catch(C){console.warn("[nimbi-cms] renderByQuery failed for",k,C),Lr(e,i,C)}}window.addEventListener("popstate",p);const d=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,m=()=>{try{const k=s||document.querySelector(".nimbi-cms");if(!k)return;const x={top:k.scrollTop||0,left:k.scrollLeft||0};sessionStorage.setItem(d(),JSON.stringify(x))}catch{}},w=()=>{try{const k=s||document.querySelector(".nimbi-cms");if(!k)return;const x=sessionStorage.getItem(d());if(!x)return;const C=JSON.parse(x);C&&typeof C.top=="number"&&k.scrollTo({top:C.top,left:C.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",k=>{if(k.persisted)try{w(),Ot(s,100,!1)}catch(x){console.warn("[nimbi-cms] bfcache restore failed",x)}}),window.addEventListener("pagehide",()=>{try{m()}catch(k){console.warn("[nimbi-cms] save scroll position failed",k)}}),{renderByQuery:p,siteNav:h,getCurrentPagePath:()=>c}}function xo(t){try{const e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e)return{};const n=new URLSearchParams(e.startsWith("?")?e.slice(1):e),s={},r=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(s.contentPath=n.get("contentPath")),n.has("searchIndex")){const i=r(n.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(n.has("searchIndexMode")){const i=n.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(n.has("defaultStyle")){const i=n.get("defaultStyle");(i==="light"||i==="dark")&&(s.defaultStyle=i)}if(n.has("bulmaCustomize")&&(s.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(s.lang=n.get("lang")),n.has("l10nFile")){const i=n.get("l10nFile");s.l10nFile=i==="null"?null:i}if(n.has("cacheTtlMinutes")){const i=Number(n.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(n.has("cacheMaxEntries")){const i=Number(n.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(n.has("homePage")&&(s.homePage=n.get("homePage")),n.has("notFoundPage")&&(s.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(s.availableLanguages=n.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),n.has("indexDepth")){const i=Number(n.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(u=>u.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function So(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function _r(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let wn="";async function vo(t={}){if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const e=xo();if(e&&(e.contentPath||e.homePage||e.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(y){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",y)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(y){console.warn("[nimbi-cms] logging ignore of URL overrides failed",y)}delete e.contentPath,delete e.homePage,delete e.notFoundPage}const n=Object.assign({},e,t),{el:s,contentPath:r="/content",crawlMaxQueue:i=1e3,searchIndex:a=!0,searchIndexMode:u="eager",indexDepth:o=1,noIndexing:l=void 0,defaultStyle:c="light",bulmaCustomize:h="none",lang:f=void 0,l10nFile:p=null,cacheTtlMinutes:d=5,cacheMaxEntries:m,markdownExtensions:w,availableLanguages:k,homePage:x="_home.md",notFoundPage:C="_404.md"}=n,{skipRootReadme:I=!1}=n;if(n.contentPath!=null&&!So(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(n.homePage!=null&&!_r(n.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(n.notFoundPage!=null&&!_r(n.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!s)throw new Error("el is required");let M=s;if(typeof s=="string"){if(M=document.querySelector(s),!M)throw new Error(`el selector "${s}" did not match any element`)}else if(!(s instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof r!="string"||!r.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(u!=null&&u!=="eager"&&u!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(o!=null&&o!==1&&o!==2&&o!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(c!=="light"&&c!=="dark")throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(d!=null&&(typeof d!="number"||!Number.isFinite(d)||d<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(y=>!y||typeof y!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(k!=null&&(!Array.isArray(k)||k.some(y=>typeof y!="string"||!y.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(l!=null&&(!Array.isArray(l)||l.some(y=>typeof y!="string"||!y.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(I!=null&&typeof I!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(x!=null&&(typeof x!="string"||!x.trim()||!/\.(md|html)$/.test(x)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(C!=null&&(typeof C!="string"||!C.trim()||!/\.(md|html)$/.test(C)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const z=!!a;try{Promise.resolve().then(()=>qt).then(y=>{try{y&&typeof y.setSkipRootReadme=="function"&&y.setSkipRootReadme(!!I)}catch(H){console.warn("[nimbi-cms] setSkipRootReadme failed",H)}}).catch(y=>{})}catch(y){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",y)}try{M.classList.add("nimbi-mount")}catch(y){console.warn("[nimbi-cms] mount element setup failed",y)}const N=document.createElement("div");N.className="nimbi-cms";const K=document.createElement("div");K.className="columns";const J=document.createElement("div");J.className="column is-full-mobile is-3-tablet nimbi-nav-wrap",J.setAttribute("role","navigation");try{const y=typeof it=="function"?it("navigation"):null;y&&J.setAttribute("aria-label",y)}catch(y){console.warn("[nimbi-cms] set nav aria-label failed",y)}K.appendChild(J);const se=document.createElement("div");se.className="column nimbi-content",se.setAttribute("role","main"),K.appendChild(se),N.appendChild(K);const j=J,Q=se;M.appendChild(N);let O=null;try{O=M.querySelector(".nimbi-overlay"),O||(O=document.createElement("div"),O.className="nimbi-overlay",M.appendChild(O))}catch(y){O=null,console.warn("[nimbi-cms] mount overlay setup failed",y)}const A=location.pathname||"/",T=A.endsWith("/")?A:A.substring(0,A.lastIndexOf("/")+1);try{wn=document.title||""}catch(y){wn="",console.warn("[nimbi-cms] read initial document title failed",y)}let b=r;(b==="."||b==="./")&&(b=""),b.startsWith("./")&&(b=b.slice(2)),b.startsWith("/")&&(b=b.slice(1)),b!==""&&!b.endsWith("/")&&(b=b+"/");const v=new URL(T+b,location.origin).toString();try{Promise.resolve().then(()=>qt).then(y=>{try{y&&typeof y.setHomePage=="function"&&y.setHomePage(x)}catch(H){console.warn("[nimbi-cms] setHomePage failed",H)}}).catch(y=>{})}catch(y){console.warn("[nimbi-cms] setHomePage dynamic import failed",y)}p&&await Mn(p,T),k&&Array.isArray(k)&&Hr(k),f&&_n(f);const R=ko({contentWrap:Q,navWrap:j,container:N,mountOverlay:O,t:it,contentBase:v,homePage:x,initialDocumentTitle:wn,runHooks:bn});if(typeof d=="number"&&d>=0&&typeof fr=="function"&&fr(d*60*1e3),typeof m=="number"&&m>=0&&typeof pr=="function"&&pr(m),w&&Array.isArray(w)&&w.length)try{w.forEach(y=>{typeof y=="object"&&Za&&typeof An=="function"&&An(y)})}catch(y){console.warn("[nimbi-cms] applying markdownExtensions failed",y)}try{typeof i=="number"&&Promise.resolve().then(()=>qt).then(({setDefaultCrawlMaxQueue:y})=>{try{y(i)}catch(H){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",H)}})}catch(y){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",y)}try{Gt(v)}catch(y){console.warn("[nimbi-cms] setContentBase failed",y)}try{kn(C)}catch(y){console.warn("[nimbi-cms] setNotFoundPage failed",y)}try{Gt(v)}catch(y){console.warn("[nimbi-cms] setContentBase failed",y)}try{kn(C)}catch(y){console.warn("[nimbi-cms] setNotFoundPage failed",y)}try{await Se(x,v)}catch(y){throw x==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${x} not found at ${v}${x}: ${y.message}`)}zr(c),await Ir(h,T);try{const y=document.createElement("header");y.className="nimbi-site-navbar",M.insertBefore(y,N);const H=await Se("_navigation.md",v),G=await Vt(H.raw||""),{navbar:ge,linkEls:ke}=await ao(y,N,G.html||"",v,x,it,R.renderByQuery,z,u,o,l);try{await bn("onNavBuild",{navWrap:j,navbar:ge,linkEls:ke,contentBase:v})}catch(ee){console.warn("[nimbi-cms] onNavBuild hooks failed",ee)}try{const ee=()=>{const oe=y&&y.getBoundingClientRect&&Math.round(y.getBoundingClientRect().height)||y&&y.offsetHeight||0;if(oe>0){try{M.style.setProperty("--nimbi-site-navbar-height",`${oe}px`)}catch(me){console.warn("[nimbi-cms] set CSS var failed",me)}try{N.style.paddingTop=""}catch(me){console.warn("[nimbi-cms] set container paddingTop failed",me)}try{const me=M&&M.getBoundingClientRect&&Math.round(M.getBoundingClientRect().height)||M&&M.clientHeight||0;if(me>0){const Ue=Math.max(0,me-oe);try{N.style.setProperty("--nimbi-cms-height",`${Ue}px`)}catch(qe){console.warn("[nimbi-cms] set --nimbi-cms-height failed",qe)}}else try{N.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(Ue){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Ue)}}catch(me){console.warn("[nimbi-cms] compute container height failed",me)}try{y.style.setProperty("--nimbi-site-navbar-height",`${oe}px`)}catch(me){console.warn("[nimbi-cms] set navbar CSS var failed",me)}}};ee();try{if(typeof ResizeObserver<"u"){const oe=new ResizeObserver(()=>ee());try{oe.observe(y)}catch(me){console.warn("[nimbi-cms] ResizeObserver.observe failed",me)}}}catch(oe){console.warn("[nimbi-cms] ResizeObserver setup failed",oe)}}catch(ee){console.warn("[nimbi-cms] compute navbar height failed",ee)}}catch(y){console.warn("[nimbi-cms] build navigation failed",y)}await R.renderByQuery();try{Promise.resolve().then(()=>Eo).then(({getVersion:y})=>{typeof y=="function"&&y().then(H=>{try{const G=H||"0.0.0";try{const ge=ke=>{const ee=document.createElement("a");ee.className="nimbi-version-label tag is-small",ee.textContent=`Ninbi CMS v. ${G}`,ee.href=ke||"#",ee.target="_blank",ee.rel="noopener noreferrer nofollow",ee.setAttribute("aria-label",`Ninbi CMS version ${G}`);try{Br(ee)}catch{}try{M.appendChild(ee)}catch(oe){console.warn("[nimbi-cms] append version label failed",oe)}};(async()=>{try{const ke=await Promise.resolve().then(()=>$i).catch(()=>null),ee=ke&&(ke.default||ke);let oe=null;ee&&(ee.homepage&&typeof ee.homepage=="string"?oe=ee.homepage:ee.repository&&(typeof ee.repository=="string"?oe=ee.repository:ee.repository.url&&typeof ee.repository.url=="string"&&(oe=ee.repository.url)));try{oe&&new URL(oe)}catch{oe=null}ge(oe||"#")}catch{ge("#")}})()}catch(ge){console.warn("[nimbi-cms] building version label failed",ge)}}catch(G){console.warn("[nimbi-cms] building version label failed",G)}}).catch(H=>{console.warn("[nimbi-cms] getVersion() failed",H)})}).catch(y=>{console.warn("[nimbi-cms] import version module failed",y)})}catch(y){console.warn("[nimbi-cms] version label setup failed",y)}}async function hi(){try{let t=null;try{t=await Promise.resolve().then(()=>$i)}catch{try{if(typeof fetch=="function"&&typeof location<"u"){const s=new URL("../package.json",location.href).toString(),r=await fetch(s);r&&r.ok?t={default:await r.json()}:t=null}else t=null}catch{t=null}}const e=t?.default?.version||t?.version;return typeof e=="string"&&e.trim()?e:"0.0.0"}catch{return"0.0.0"}}const Eo=Object.freeze(Object.defineProperty({__proto__:null,getVersion:hi},Symbol.toStringTag,{value:"Module"})),di="nimbi-cms",pi="0.1.0",fi={type:"git",url:"git+https://github.com/AbelVM/nimbiCMS.git"},gi="https://abelvm.github.io/nimbiCMS/",mi="Lightweight CMS client for static sites with Bulma UI and search/indexing features",wi=["cms","static","bulma","search","markdown","nimbi"],bi="Abel Vázquez Montoro",yi="MIT",ki={url:"https://github.com/AbelVM/nimbiCMS/issues"},xi={node:">=16"},Si="module",vi={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js",prepare:"npm run build:lib && npm run gen-dts","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},Ei={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},Ai={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17","typedoc-plugin-markdown":"^4.10.0",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},Ri="dist/nimbi-cms.cjs.js",Li="dist/nimbi-cms.es.js",Ti="src/index.d.ts",Ci="dist/nimbi-cms.js",Mi=["dist","src/index.d.ts"],_i={access:"public"},Ao={name:di,version:pi,repository:fi,homepage:gi,private:!0,description:mi,keywords:wi,author:bi,license:yi,bugs:ki,engines:xi,type:Si,scripts:vi,dependencies:Ei,devDependencies:Ai,main:Ri,module:Li,types:Ti,unpkg:Ci,files:Mi,publishConfig:_i},$i=Object.freeze(Object.defineProperty({__proto__:null,author:bi,bugs:ki,default:Ao,dependencies:Ei,description:mi,devDependencies:Ai,engines:xi,files:Mi,homepage:gi,keywords:wi,license:yi,main:Ri,module:Li,name:di,publishConfig:_i,repository:fi,scripts:vi,type:Si,types:Ti,unpkg:Ci,version:pi},Symbol.toStringTag,{value:"Module"}));exports.BAD_LANGUAGES=Tn;exports.SUPPORTED_HLJS_MAP=V;exports._clearHooks=ks;exports.addHook=Jt;exports.default=vo;exports.ensureBulma=Ir;exports.getVersion=hi;exports.loadL10nFile=Mn;exports.loadSupportedLanguages=Cn;exports.observeCodeBlocks=Pr;exports.onNavBuild=bs;exports.onPageLoad=ws;exports.registerLanguage=ot;exports.runHooks=bn;exports.setHighlightTheme=As;exports.setLang=_n;exports.setStyle=zr;exports.setThemeVars=Ls;exports.t=it;exports.transformHtml=ys;
