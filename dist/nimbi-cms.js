(function(ce,De){typeof exports=="object"&&typeof module<"u"?De(exports):typeof define=="function"&&define.amd?define(["exports"],De):(ce=typeof globalThis<"u"?globalThis:ce||self,De(ce.nimbiCMS={}))})(this,(function(ce){"use strict";const De={onPageLoad:[],onNavBuild:[],transformHtml:[]};function _t(t,e){if(!Object.prototype.hasOwnProperty.call(De,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");De[t].push(e)}function Ti(t){_t("onPageLoad",t)}function Li(t){_t("onNavBuild",t)}function Ci(t){_t("transformHtml",t)}async function rn(t,e){const r=De[t]||[];for(const s of r)try{await s(e)}catch(n){console.warn("[nimbi-cms] runHooks callback failed",n)}}function _i(){Object.keys(De).forEach(t=>{De[t].length=0})}function Xn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var sn,Kn;function Mi(){if(Kn)return sn;Kn=1;function t(g){return g instanceof Map?g.clear=g.delete=g.set=function(){throw new Error("map is read-only")}:g instanceof Set&&(g.add=g.clear=g.delete=function(){throw new Error("set is read-only")}),Object.freeze(g),Object.getOwnPropertyNames(g).forEach(x=>{const L=g[x],W=typeof L;(W==="object"||W==="function")&&!Object.isFrozen(L)&&t(L)}),g}class e{constructor(x){x.data===void 0&&(x.data={}),this.data=x.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function r(g){return g.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(g,...x){const L=Object.create(null);for(const W in g)L[W]=g[W];return x.forEach(function(W){for(const pe in W)L[pe]=W[pe]}),L}const n="</span>",i=g=>!!g.scope,a=(g,{prefix:x})=>{if(g.startsWith("language:"))return g.replace("language:","language-");if(g.includes(".")){const L=g.split(".");return[`${x}${L.shift()}`,...L.map((W,pe)=>`${W}${"_".repeat(pe+1)}`)].join(" ")}return`${x}${g}`};class u{constructor(x,L){this.buffer="",this.classPrefix=L.classPrefix,x.walk(this)}addText(x){this.buffer+=r(x)}openNode(x){if(!i(x))return;const L=a(x.scope,{prefix:this.classPrefix});this.span(L)}closeNode(x){i(x)&&(this.buffer+=n)}value(){return this.buffer}span(x){this.buffer+=`<span class="${x}">`}}const o=(g={})=>{const x={children:[]};return Object.assign(x,g),x};class l{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(x){this.top.children.push(x)}openNode(x){const L=o({scope:x});this.add(L),this.stack.push(L)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(x){return this.constructor._walk(x,this.rootNode)}static _walk(x,L){return typeof L=="string"?x.addText(L):L.children&&(x.openNode(L),L.children.forEach(W=>this._walk(x,W)),x.closeNode(L)),x}static _collapse(x){typeof x!="string"&&x.children&&(x.children.every(L=>typeof L=="string")?x.children=[x.children.join("")]:x.children.forEach(L=>{l._collapse(L)}))}}class c extends l{constructor(x){super(),this.options=x}addText(x){x!==""&&this.add(x)}startScope(x){this.openNode(x)}endScope(){this.closeNode()}__addSublanguage(x,L){const W=x.root;L&&(W.scope=`language:${L}`),this.add(W)}toHTML(){return new u(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function h(g){return g?typeof g=="string"?g:g.source:null}function f(g){return m("(?=",g,")")}function p(g){return m("(?:",g,")*")}function d(g){return m("(?:",g,")?")}function m(...g){return g.map(L=>h(L)).join("")}function w(g){const x=g[g.length-1];return typeof x=="object"&&x.constructor===Object?(g.splice(g.length-1,1),x):{}}function k(...g){return"("+(w(g).capture?"":"?:")+g.map(W=>h(W)).join("|")+")"}function y(g){return new RegExp(g.toString()+"|").exec("").length-1}function I(g,x){const L=g&&g.exec(x);return L&&L.index===0}const P=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function A(g,{joinWith:x}){let L=0;return g.map(W=>{L+=1;const pe=L;let fe=h(W),z="";for(;fe.length>0;){const $=P.exec(fe);if(!$){z+=fe;break}z+=fe.substring(0,$.index),fe=fe.substring($.index+$[0].length),$[0][0]==="\\"&&$[1]?z+="\\"+String(Number($[1])+pe):(z+=$[0],$[0]==="("&&L++)}return z}).map(W=>`(${W})`).join(x)}const q=/\b\B/,j="[a-zA-Z]\\w*",G="[a-zA-Z_]\\w*",V="\\b\\d+(\\.\\d+)?",ie="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",O="\\b(0b[01]+)",C="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",M=(g={})=>{const x=/^#![ ]*\//;return g.binary&&(g.begin=m(x,/.*\b/,g.binary,/\b.*/)),s({scope:"meta",begin:x,end:/$/,relevance:0,"on:begin":(L,W)=>{L.index!==0&&W.ignoreMatch()}},g)},T={begin:"\\\\[\\s\\S]",relevance:0},v={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[T]},b={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[T]},R={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},B=function(g,x,L={}){const W=s({scope:"comment",begin:g,end:x,contains:[]},L);W.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const pe=k("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return W.contains.push({begin:m(/[ ]+/,"(",pe,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),W},S=B("//","$"),Q=B("/\\*","\\*/"),he=B("#","$"),Ae={scope:"number",begin:V,relevance:0},ye={scope:"number",begin:ie,relevance:0},te={scope:"number",begin:O,relevance:0},ue={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[T,{begin:/\[/,end:/\]/,relevance:0,contains:[T]}]},ge={scope:"title",begin:j,relevance:0},Je={scope:"title",begin:G,relevance:0},Dn={begin:"\\.\\s*"+G,relevance:0};var Kt=Object.freeze({__proto__:null,APOS_STRING_MODE:v,BACKSLASH_ESCAPE:T,BINARY_NUMBER_MODE:te,BINARY_NUMBER_RE:O,COMMENT:B,C_BLOCK_COMMENT_MODE:Q,C_LINE_COMMENT_MODE:S,C_NUMBER_MODE:ye,C_NUMBER_RE:ie,END_SAME_AS_BEGIN:function(g){return Object.assign(g,{"on:begin":(x,L)=>{L.data._beginMatch=x[1]},"on:end":(x,L)=>{L.data._beginMatch!==x[1]&&L.ignoreMatch()}})},HASH_COMMENT_MODE:he,IDENT_RE:j,MATCH_NOTHING_RE:q,METHOD_GUARD:Dn,NUMBER_MODE:Ae,NUMBER_RE:V,PHRASAL_WORDS_MODE:R,QUOTE_STRING_MODE:b,REGEXP_MODE:ue,RE_STARTERS_RE:C,SHEBANG:M,TITLE_MODE:ge,UNDERSCORE_IDENT_RE:G,UNDERSCORE_TITLE_MODE:Je});function Pa(g,x){g.input[g.index-1]==="."&&x.ignoreMatch()}function $a(g,x){g.className!==void 0&&(g.scope=g.className,delete g.className)}function Ia(g,x){x&&g.beginKeywords&&(g.begin="\\b("+g.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",g.__beforeBegin=Pa,g.keywords=g.keywords||g.beginKeywords,delete g.beginKeywords,g.relevance===void 0&&(g.relevance=0))}function Ba(g,x){Array.isArray(g.illegal)&&(g.illegal=k(...g.illegal))}function za(g,x){if(g.match){if(g.begin||g.end)throw new Error("begin & end are not supported with match");g.begin=g.match,delete g.match}}function Na(g,x){g.relevance===void 0&&(g.relevance=1)}const Oa=(g,x)=>{if(!g.beforeMatch)return;if(g.starts)throw new Error("beforeMatch cannot be used with starts");const L=Object.assign({},g);Object.keys(g).forEach(W=>{delete g[W]}),g.keywords=L.keywords,g.begin=m(L.beforeMatch,f(L.begin)),g.starts={relevance:0,contains:[Object.assign(L,{endsParent:!0})]},g.relevance=0,delete L.beforeMatch},Da=["of","and","for","in","not","or","if","then","parent","list","value"],Ha="keyword";function hi(g,x,L=Ha){const W=Object.create(null);return typeof g=="string"?pe(L,g.split(" ")):Array.isArray(g)?pe(L,g):Object.keys(g).forEach(function(fe){Object.assign(W,hi(g[fe],x,fe))}),W;function pe(fe,z){x&&(z=z.map($=>$.toLowerCase())),z.forEach(function($){const F=$.split("|");W[F[0]]=[fe,Ua(F[0],F[1])]})}}function Ua(g,x){return x?Number(x):qa(g)?0:1}function qa(g){return Da.includes(g.toLowerCase())}const di={},et=g=>{console.error(g)},pi=(g,...x)=>{console.log(`WARN: ${g}`,...x)},lt=(g,x)=>{di[`${g}/${x}`]||(console.log(`Deprecated as of ${g}. ${x}`),di[`${g}/${x}`]=!0)},Yt=new Error;function fi(g,x,{key:L}){let W=0;const pe=g[L],fe={},z={};for(let $=1;$<=x.length;$++)z[$+W]=pe[$],fe[$+W]=!0,W+=y(x[$-1]);g[L]=z,g[L]._emit=fe,g[L]._multi=!0}function ja(g){if(Array.isArray(g.begin)){if(g.skip||g.excludeBegin||g.returnBegin)throw et("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),Yt;if(typeof g.beginScope!="object"||g.beginScope===null)throw et("beginScope must be object"),Yt;fi(g,g.begin,{key:"beginScope"}),g.begin=A(g.begin,{joinWith:""})}}function Fa(g){if(Array.isArray(g.end)){if(g.skip||g.excludeEnd||g.returnEnd)throw et("skip, excludeEnd, returnEnd not compatible with endScope: {}"),Yt;if(typeof g.endScope!="object"||g.endScope===null)throw et("endScope must be object"),Yt;fi(g,g.end,{key:"endScope"}),g.end=A(g.end,{joinWith:""})}}function Wa(g){g.scope&&typeof g.scope=="object"&&g.scope!==null&&(g.beginScope=g.scope,delete g.scope)}function Za(g){Wa(g),typeof g.beginScope=="string"&&(g.beginScope={_wrap:g.beginScope}),typeof g.endScope=="string"&&(g.endScope={_wrap:g.endScope}),ja(g),Fa(g)}function Ga(g){function x(z,$){return new RegExp(h(z),"m"+(g.case_insensitive?"i":"")+(g.unicodeRegex?"u":"")+($?"g":""))}class L{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule($,F){F.position=this.position++,this.matchIndexes[this.matchAt]=F,this.regexes.push([F,$]),this.matchAt+=y($)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const $=this.regexes.map(F=>F[1]);this.matcherRe=x(A($,{joinWith:"|"}),!0),this.lastIndex=0}exec($){this.matcherRe.lastIndex=this.lastIndex;const F=this.matcherRe.exec($);if(!F)return null;const be=F.findIndex((Ct,Un)=>Un>0&&Ct!==void 0),me=this.matchIndexes[be];return F.splice(0,be),Object.assign(F,me)}}class W{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher($){if(this.multiRegexes[$])return this.multiRegexes[$];const F=new L;return this.rules.slice($).forEach(([be,me])=>F.addRule(be,me)),F.compile(),this.multiRegexes[$]=F,F}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule($,F){this.rules.push([$,F]),F.type==="begin"&&this.count++}exec($){const F=this.getMatcher(this.regexIndex);F.lastIndex=this.lastIndex;let be=F.exec($);if(this.resumingScanAtSamePosition()&&!(be&&be.index===this.lastIndex)){const me=this.getMatcher(0);me.lastIndex=this.lastIndex+1,be=me.exec($)}return be&&(this.regexIndex+=be.position+1,this.regexIndex===this.count&&this.considerAll()),be}}function pe(z){const $=new W;return z.contains.forEach(F=>$.addRule(F.begin,{rule:F,type:"begin"})),z.terminatorEnd&&$.addRule(z.terminatorEnd,{type:"end"}),z.illegal&&$.addRule(z.illegal,{type:"illegal"}),$}function fe(z,$){const F=z;if(z.isCompiled)return F;[$a,za,Za,Oa].forEach(me=>me(z,$)),g.compilerExtensions.forEach(me=>me(z,$)),z.__beforeBegin=null,[Ia,Ba,Na].forEach(me=>me(z,$)),z.isCompiled=!0;let be=null;return typeof z.keywords=="object"&&z.keywords.$pattern&&(z.keywords=Object.assign({},z.keywords),be=z.keywords.$pattern,delete z.keywords.$pattern),be=be||/\w+/,z.keywords&&(z.keywords=hi(z.keywords,g.case_insensitive)),F.keywordPatternRe=x(be,!0),$&&(z.begin||(z.begin=/\B|\b/),F.beginRe=x(F.begin),!z.end&&!z.endsWithParent&&(z.end=/\B|\b/),z.end&&(F.endRe=x(F.end)),F.terminatorEnd=h(F.end)||"",z.endsWithParent&&$.terminatorEnd&&(F.terminatorEnd+=(z.end?"|":"")+$.terminatorEnd)),z.illegal&&(F.illegalRe=x(z.illegal)),z.contains||(z.contains=[]),z.contains=[].concat(...z.contains.map(function(me){return Qa(me==="self"?z:me)})),z.contains.forEach(function(me){fe(me,F)}),z.starts&&fe(z.starts,$),F.matcher=pe(F),F}if(g.compilerExtensions||(g.compilerExtensions=[]),g.contains&&g.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return g.classNameAliases=s(g.classNameAliases||{}),fe(g)}function gi(g){return g?g.endsWithParent||gi(g.starts):!1}function Qa(g){return g.variants&&!g.cachedVariants&&(g.cachedVariants=g.variants.map(function(x){return s(g,{variants:null},x)})),g.cachedVariants?g.cachedVariants:gi(g)?s(g,{starts:g.starts?s(g.starts):null}):Object.isFrozen(g)?s(g):g}var Xa="11.11.1";class Ka extends Error{constructor(x,L){super(x),this.name="HTMLInjectionError",this.html=L}}const Hn=r,mi=s,wi=Symbol("nomatch"),Ya=7,bi=function(g){const x=Object.create(null),L=Object.create(null),W=[];let pe=!0;const fe="Could not find the language '{}', did you forget to load/include a language module?",z={disableAutodetect:!0,name:"Plain text",contains:[]};let $={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:c};function F(E){return $.noHighlightRe.test(E)}function be(E){let D=E.className+" ";D+=E.parentNode?E.parentNode.className:"";const J=$.languageDetectRe.exec(D);if(J){const oe=Qe(J[1]);return oe||(pi(fe.replace("{}",J[1])),pi("Falling back to no-highlight mode for this block.",E)),oe?J[1]:"no-highlight"}return D.split(/\s+/).find(oe=>F(oe)||Qe(oe))}function me(E,D,J){let oe="",we="";typeof D=="object"?(oe=E,J=D.ignoreIllegals,we=D.language):(lt("10.7.0","highlight(lang, code, ...args) has been deprecated."),lt("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),we=E,oe=D),J===void 0&&(J=!0);const Ie={code:oe,language:we};Jt("before:highlight",Ie);const Xe=Ie.result?Ie.result:Ct(Ie.language,Ie.code,J);return Xe.code=Ie.code,Jt("after:highlight",Xe),Xe}function Ct(E,D,J,oe){const we=Object.create(null);function Ie(_,N){return _.keywords[N]}function Xe(){if(!Z.keywords){xe.addText(le);return}let _=0;Z.keywordPatternRe.lastIndex=0;let N=Z.keywordPatternRe.exec(le),X="";for(;N;){X+=le.substring(_,N.index);const se=Oe.case_insensitive?N[0].toLowerCase():N[0],Ee=Ie(Z,se);if(Ee){const[qe,go]=Ee;if(xe.addText(X),X="",we[se]=(we[se]||0)+1,we[se]<=Ya&&(nn+=go),qe.startsWith("_"))X+=N[0];else{const mo=Oe.classNameAliases[qe]||qe;Ne(N[0],mo)}}else X+=N[0];_=Z.keywordPatternRe.lastIndex,N=Z.keywordPatternRe.exec(le)}X+=le.substring(_),xe.addText(X)}function en(){if(le==="")return;let _=null;if(typeof Z.subLanguage=="string"){if(!x[Z.subLanguage]){xe.addText(le);return}_=Ct(Z.subLanguage,le,!0,Ri[Z.subLanguage]),Ri[Z.subLanguage]=_._top}else _=qn(le,Z.subLanguage.length?Z.subLanguage:null);Z.relevance>0&&(nn+=_.relevance),xe.__addSublanguage(_._emitter,_.language)}function _e(){Z.subLanguage!=null?en():Xe(),le=""}function Ne(_,N){_!==""&&(xe.startScope(N),xe.addText(_),xe.endScope())}function Si(_,N){let X=1;const se=N.length-1;for(;X<=se;){if(!_._emit[X]){X++;continue}const Ee=Oe.classNameAliases[_[X]]||_[X],qe=N[X];Ee?Ne(qe,Ee):(le=qe,Xe(),le=""),X++}}function vi(_,N){return _.scope&&typeof _.scope=="string"&&xe.openNode(Oe.classNameAliases[_.scope]||_.scope),_.beginScope&&(_.beginScope._wrap?(Ne(le,Oe.classNameAliases[_.beginScope._wrap]||_.beginScope._wrap),le=""):_.beginScope._multi&&(Si(_.beginScope,N),le="")),Z=Object.create(_,{parent:{value:Z}}),Z}function Ai(_,N,X){let se=I(_.endRe,X);if(se){if(_["on:end"]){const Ee=new e(_);_["on:end"](N,Ee),Ee.isMatchIgnored&&(se=!1)}if(se){for(;_.endsParent&&_.parent;)_=_.parent;return _}}if(_.endsWithParent)return Ai(_.parent,N,X)}function co(_){return Z.matcher.regexIndex===0?(le+=_[0],1):(Zn=!0,0)}function uo(_){const N=_[0],X=_.rule,se=new e(X),Ee=[X.__beforeBegin,X["on:begin"]];for(const qe of Ee)if(qe&&(qe(_,se),se.isMatchIgnored))return co(N);return X.skip?le+=N:(X.excludeBegin&&(le+=N),_e(),!X.returnBegin&&!X.excludeBegin&&(le=N)),vi(X,_),X.returnBegin?0:N.length}function ho(_){const N=_[0],X=D.substring(_.index),se=Ai(Z,_,X);if(!se)return wi;const Ee=Z;Z.endScope&&Z.endScope._wrap?(_e(),Ne(N,Z.endScope._wrap)):Z.endScope&&Z.endScope._multi?(_e(),Si(Z.endScope,_)):Ee.skip?le+=N:(Ee.returnEnd||Ee.excludeEnd||(le+=N),_e(),Ee.excludeEnd&&(le=N));do Z.scope&&xe.closeNode(),!Z.skip&&!Z.subLanguage&&(nn+=Z.relevance),Z=Z.parent;while(Z!==se.parent);return se.starts&&vi(se.starts,_),Ee.returnEnd?0:N.length}function po(){const _=[];for(let N=Z;N!==Oe;N=N.parent)N.scope&&_.unshift(N.scope);_.forEach(N=>xe.openNode(N))}let tn={};function Ei(_,N){const X=N&&N[0];if(le+=_,X==null)return _e(),0;if(tn.type==="begin"&&N.type==="end"&&tn.index===N.index&&X===""){if(le+=D.slice(N.index,N.index+1),!pe){const se=new Error(`0 width match regex (${E})`);throw se.languageName=E,se.badRule=tn.rule,se}return 1}if(tn=N,N.type==="begin")return uo(N);if(N.type==="illegal"&&!J){const se=new Error('Illegal lexeme "'+X+'" for mode "'+(Z.scope||"<unnamed>")+'"');throw se.mode=Z,se}else if(N.type==="end"){const se=ho(N);if(se!==wi)return se}if(N.type==="illegal"&&X==="")return le+=`
`,1;if(Wn>1e5&&Wn>N.index*3)throw new Error("potential infinite loop, way more iterations than matches");return le+=X,X.length}const Oe=Qe(E);if(!Oe)throw et(fe.replace("{}",E)),new Error('Unknown language: "'+E+'"');const fo=Ga(Oe);let Fn="",Z=oe||fo;const Ri={},xe=new $.__emitter($);po();let le="",nn=0,tt=0,Wn=0,Zn=!1;try{if(Oe.__emitTokens)Oe.__emitTokens(D,xe);else{for(Z.matcher.considerAll();;){Wn++,Zn?Zn=!1:Z.matcher.considerAll(),Z.matcher.lastIndex=tt;const _=Z.matcher.exec(D);if(!_)break;const N=D.substring(tt,_.index),X=Ei(N,_);tt=_.index+X}Ei(D.substring(tt))}return xe.finalize(),Fn=xe.toHTML(),{language:E,value:Fn,relevance:nn,illegal:!1,_emitter:xe,_top:Z}}catch(_){if(_.message&&_.message.includes("Illegal"))return{language:E,value:Hn(D),illegal:!0,relevance:0,_illegalBy:{message:_.message,index:tt,context:D.slice(tt-100,tt+100),mode:_.mode,resultSoFar:Fn},_emitter:xe};if(pe)return{language:E,value:Hn(D),illegal:!1,relevance:0,errorRaised:_,_emitter:xe,_top:Z};throw _}}function Un(E){const D={value:Hn(E),illegal:!1,relevance:0,_top:z,_emitter:new $.__emitter($)};return D._emitter.addText(E),D}function qn(E,D){D=D||$.languages||Object.keys(x);const J=Un(E),oe=D.filter(Qe).filter(xi).map(_e=>Ct(_e,E,!1));oe.unshift(J);const we=oe.sort((_e,Ne)=>{if(_e.relevance!==Ne.relevance)return Ne.relevance-_e.relevance;if(_e.language&&Ne.language){if(Qe(_e.language).supersetOf===Ne.language)return 1;if(Qe(Ne.language).supersetOf===_e.language)return-1}return 0}),[Ie,Xe]=we,en=Ie;return en.secondBest=Xe,en}function Va(E,D,J){const oe=D&&L[D]||J;E.classList.add("hljs"),E.classList.add(`language-${oe}`)}function jn(E){let D=null;const J=be(E);if(F(J))return;if(Jt("before:highlightElement",{el:E,language:J}),E.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",E);return}if(E.children.length>0&&($.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(E)),$.throwUnescapedHTML))throw new Ka("One of your code blocks includes unescaped HTML.",E.innerHTML);D=E;const oe=D.textContent,we=J?me(oe,{language:J,ignoreIllegals:!0}):qn(oe);E.innerHTML=we.value,E.dataset.highlighted="yes",Va(E,J,we.language),E.result={language:we.language,re:we.relevance,relevance:we.relevance},we.secondBest&&(E.secondBest={language:we.secondBest.language,relevance:we.secondBest.relevance}),Jt("after:highlightElement",{el:E,result:we,text:oe})}function Ja(E){$=mi($,E)}const eo=()=>{Vt(),lt("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function to(){Vt(),lt("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let ki=!1;function Vt(){function E(){Vt()}if(document.readyState==="loading"){ki||window.addEventListener("DOMContentLoaded",E,!1),ki=!0;return}document.querySelectorAll($.cssSelector).forEach(jn)}function no(E,D){let J=null;try{J=D(g)}catch(oe){if(et("Language definition for '{}' could not be registered.".replace("{}",E)),pe)et(oe);else throw oe;J=z}J.name||(J.name=E),x[E]=J,J.rawDefinition=D.bind(null,g),J.aliases&&yi(J.aliases,{languageName:E})}function ro(E){delete x[E];for(const D of Object.keys(L))L[D]===E&&delete L[D]}function io(){return Object.keys(x)}function Qe(E){return E=(E||"").toLowerCase(),x[E]||x[L[E]]}function yi(E,{languageName:D}){typeof E=="string"&&(E=[E]),E.forEach(J=>{L[J.toLowerCase()]=D})}function xi(E){const D=Qe(E);return D&&!D.disableAutodetect}function so(E){E["before:highlightBlock"]&&!E["before:highlightElement"]&&(E["before:highlightElement"]=D=>{E["before:highlightBlock"](Object.assign({block:D.el},D))}),E["after:highlightBlock"]&&!E["after:highlightElement"]&&(E["after:highlightElement"]=D=>{E["after:highlightBlock"](Object.assign({block:D.el},D))})}function ao(E){so(E),W.push(E)}function oo(E){const D=W.indexOf(E);D!==-1&&W.splice(D,1)}function Jt(E,D){const J=E;W.forEach(function(oe){oe[J]&&oe[J](D)})}function lo(E){return lt("10.7.0","highlightBlock will be removed entirely in v12.0"),lt("10.7.0","Please use highlightElement now."),jn(E)}Object.assign(g,{highlight:me,highlightAuto:qn,highlightAll:Vt,highlightElement:jn,highlightBlock:lo,configure:Ja,initHighlighting:eo,initHighlightingOnLoad:to,registerLanguage:no,unregisterLanguage:ro,listLanguages:io,getLanguage:Qe,registerAliases:yi,autoDetection:xi,inherit:mi,addPlugin:ao,removePlugin:oo}),g.debugMode=function(){pe=!1},g.safeMode=function(){pe=!0},g.versionString=Xa,g.regex={concat:m,lookahead:f,either:k,optional:d,anyNumberOfTimes:p};for(const E in Kt)typeof Kt[E]=="object"&&t(Kt[E]);return Object.assign(g,Kt),g},ct=bi({});return ct.newInstance=()=>bi({}),sn=ct,ct.HighlightJS=ct,ct.default=ct,sn}var Pi=Mi();const ae=Xn(Pi),Y=new Map,$i="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Te={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Te.html="xml",Te.xhtml="xml",Te.markup="xml";const an=new Set(["magic","undefined"]);let je=null;const on=new Map,Ii=300*1e3;async function ln(t=$i){if(t)return je||(je=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const s=(await e.text()).split(/\r?\n/);let n=-1;for(let l=0;l<s.length;l++)if(/\|\s*Language\s*\|/i.test(s[l])){n=l;break}if(n===-1)return;const i=s[n].replace(/^\||\|$/g,"").split("|").map(l=>l.trim().toLowerCase());let a=i.findIndex(l=>/alias|aliases|equivalent|alt|alternates?/i.test(l));a===-1&&(a=1);let u=i.findIndex(l=>/file|filename|module|module name|module-name|short|slug/i.test(l));if(u===-1){const l=i.findIndex(c=>/language/i.test(c));u=l!==-1?l:0}let o=[];for(let l=n+1;l<s.length;l++){const c=s[l].trim();if(!c||!c.startsWith("|"))break;const h=c.replace(/^\||\|$/g,"").split("|").map(w=>w.trim());if(h.every(w=>/^-+$/.test(w)))continue;const f=h;if(!f.length)continue;const d=(f[u]||f[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;Y.set(d,d);const m=f[a]||"";if(m){const w=String(m).split(",").map(k=>k.replace(/`/g,"").trim()).filter(Boolean);if(w.length){const y=w[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(Y.set(y,y),o.push(y))}}}try{const l=[];for(const c of o){const h=String(c||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");h&&/[a-z0-9]/i.test(h)?l.push(h):Y.delete(c)}o=l}catch(l){console.warn("[codeblocksManager] cleanup aliases failed",l)}try{let l=0;for(const c of Array.from(Y.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){Y.delete(c),l++;continue}if(/^[:]+/.test(c)){const h=c.replace(/^[:]+/,"");if(h&&/[a-z0-9]/i.test(h)){const f=Y.get(c);Y.delete(c),Y.set(h,f)}else Y.delete(c),l++}}for(const[c,h]of Array.from(Y.entries()))(!h||/^-+$/.test(h)||!/[a-z0-9]/i.test(h))&&(Y.delete(c),l++);try{const c=":---------------------";Y.has(c)&&(Y.delete(c),l++)}catch(c){console.warn("[codeblocksManager] remove sep key failed",c)}try{const c=Array.from(Y.keys()).sort()}catch(c){console.warn("[codeblocksManager] compute supported keys failed",c)}}catch(l){console.warn("[codeblocksManager] ignored error",l)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),je)}const ut=new Set;async function nt(t,e){if(je||(async()=>{try{await ln()}catch(n){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",n)}})(),je)try{await je}catch{}if(t=t==null?"":String(t),t=t.trim(),!t)return!1;const r=t.toLowerCase();if(an.has(r))return!1;if(Y.size&&!Y.has(r)){const n=Te;if(!n[r]&&!n[t])return!1}if(ut.has(t))return!0;const s=Te;try{const n=(e||t||"").toString().replace(/\.js$/i,"").trim(),i=(s[t]||t||"").toString(),a=(s[n]||n||"").toString();let u=Array.from(new Set([i,a,n,t,s[n],s[t]].filter(Boolean))).map(c=>String(c).toLowerCase()).filter(c=>c&&c!=="undefined");Y.size&&(u=u.filter(c=>{if(Y.has(c))return!0;const h=Te[c];return!!(h&&Y.has(h))}));let o=null,l=null;for(const c of u)try{const h=Date.now();let f=on.get(c);if(f&&f.ok===!1&&h-(f.ts||0)>=Ii&&(on.delete(c),f=void 0),f){if(f.module)o=f.module;else if(f.promise)try{o=await f.promise}catch{o=null}}else{const p={promise:null,module:null,ok:null,ts:0};on.set(c,p),p.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${c}.js`)}catch{return await import(`highlight.js/lib/languages/${c}`)}}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;return await new Function("u","return import(u)")(m)}catch{try{const w=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;return await new Function("u","return import(u)")(w)}catch{return null}}}}catch{return null}})();try{o=await p.promise,p.module=o,p.ok=!!o,p.ts=Date.now()}catch{p.module=null,p.ok=!1,p.ts=Date.now(),o=null}}if(o){const p=o.default||o;try{const d=Y.size&&Y.get(t)||c||t;return ae.registerLanguage(d,p),ut.add(d),d!==t&&(ae.registerLanguage(t,p),ut.add(t)),!0}catch(d){l=d}}else try{if(Y.has(c)||Y.has(t)){const p=()=>({});try{ae.registerLanguage(c,p),ut.add(c)}catch{}try{c!==t&&(ae.registerLanguage(t,p),ut.add(t))}catch{}return!0}}catch{}}catch(h){l=h}if(l)throw l;return!1}catch{return!1}}let Mt=null;function Yn(t=document){je||(async()=>{try{await ln()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const e=Te,s=Mt||(typeof IntersectionObserver>"u"?null:(Mt=new IntersectionObserver((i,a)=>{i.forEach(u=>{if(!u.isIntersecting)return;const o=u.target;try{a.unobserve(o)}catch(l){console.warn("[codeblocksManager] observer unobserve failed",l)}(async()=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",c=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const h=(c[1]||"").toLowerCase(),f=e[h]||h,p=Y.size&&(Y.get(f)||Y.get(String(f).toLowerCase()))||f;try{await nt(p)}catch(d){console.warn("[codeblocksManager] registerLanguage failed",d)}try{ae.highlightElement(o)}catch(d){console.warn("[codeblocksManager] hljs.highlightElement failed",d)}}else try{const h=o.textContent||"";try{if(ae&&typeof ae.getLanguage=="function"&&ae.getLanguage("plaintext")){const f=ae.highlight(h,{language:"plaintext"});f&&f.value&&(o.innerHTML=f.value)}}catch{try{ae.highlightElement(o)}catch(p){console.warn("[codeblocksManager] fallback highlightElement failed",p)}}}catch(h){console.warn("[codeblocksManager] auto-detect plaintext failed",h)}}catch(l){console.warn("[codeblocksManager] observer entry processing failed",l)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Mt)),n=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!s){n.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",u=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const o=(u[1]||"").toLowerCase(),l=e[o]||o,c=Y.size&&(Y.get(l)||Y.get(String(l).toLowerCase()))||l;try{await nt(c)}catch(h){console.warn("[codeblocksManager] registerLanguage failed (no observer)",h)}}try{ae.highlightElement(i)}catch(o){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",o)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}n.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function Bi(t,{useCdn:e=!0}={}){const r=document.querySelector("link[data-hl-theme]");r&&r.remove();let s=t||"monokai";if(s==="monokai")return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");return}const n=`https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${s}.css`,i=document.createElement("link");i.rel="stylesheet",i.href=n,i.setAttribute("data-hl-theme",s),document.head.appendChild(i)}let ht="light";function zi(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const r=document.createElement("link");r.rel="stylesheet",r.href=t,Object.entries(e).forEach(([s,n])=>r.setAttribute(s,n)),document.head.appendChild(r)}async function Vn(t="none",e="/"){if(!t||t==="none")return;const r=[e+"bulma.css","/bulma.css"],s=Array.from(new Set(r));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const n of s)try{const i=await fetch(n,{method:"GET"});if(i.ok){const a=await i.text(),u=document.createElement("style");u.setAttribute("data-bulma-override",n),u.appendChild(document.createTextNode(`
/* bulma override: ${n} */
`+a)),document.head.appendChild(u);return}}catch(i){console.warn("[bulmaManager] fetch local bulma candidate failed",i)}return}try{const n=String(t).trim();if(!n)return;const i=`https://unpkg.com/bulmaswatch/${encodeURIComponent(n)}/bulmaswatch.min.css`;zi(i,{"data-bulmaswatch-theme":n})}catch(n){console.warn("[bulmaManager] ensureBulma failed",n)}}function Jn(t){ht=t==="dark"?"dark":"light",document.documentElement.setAttribute("data-theme",ht),ht==="dark"?document.body.classList.add("is-dark"):document.body.classList.remove("is-dark")}function Ni(t){const e=document.documentElement;for(const[r,s]of Object.entries(t||{}))try{e.style.setProperty(`--${r}`,s)}catch(n){console.warn("[bulmaManager] setThemeVars failed for",r,n)}}function er(t){if(!t||!(t instanceof HTMLElement))return()=>{};const e=()=>{ht==="dark"?(t.classList.add("is-dark"),t.classList.remove("is-light")):(t.classList.add("is-light"),t.classList.remove("is-dark"))};e();const r=new MutationObserver(()=>{ht=document.documentElement.getAttribute("data-theme")==="dark"?"dark":"light",e()});try{r.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}catch{}return()=>{try{r.disconnect()}catch{}}}const tr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},rt=JSON.parse(JSON.stringify(tr));let Pt="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";Pt=String(t).split("-")[0].toLowerCase()}tr[Pt]||(Pt="en");let Fe=Pt;function it(t,e={}){const r=rt[Fe]||rt.en;let s=r&&r[t]?r[t]:rt.en[t]||"";for(const n of Object.keys(e))s=s.replace(new RegExp(`{${n}}`,"g"),String(e[n]));return s}async function cn(t,e){if(!t)return;let r=t;try{/^https?:\/\//.test(t)||(r=new URL(t,location.origin+e).toString());const s=await fetch(r);if(!s.ok)return;const n=await s.json();for(const i of Object.keys(n||{}))rt[i]=Object.assign({},rt[i]||{},n[i])}catch{}}function un(t){const e=String(t).split("-")[0].toLowerCase();Fe=rt[e]?e:"en"}const Oi=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Fe},loadL10nFile:cn,setLang:un,t:it},Symbol.toStringTag,{value:"Module"})),Di=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function nr(t,e="worker"){let r=null;function s(){if(!r)try{const u=t();r=u||null,u&&u.addEventListener("error",()=>{try{r===u&&(r=null,u.terminate&&u.terminate())}catch(o){console.warn("["+e+"] worker termination failed",o)}})}catch(u){r=null,console.warn("["+e+"] worker init failed",u)}return r}function n(){try{r&&(r.terminate&&r.terminate(),r=null)}catch(u){console.warn("["+e+"] worker termination failed",u)}}function i(u,o=1e3){return new Promise((l,c)=>{const h=s();if(!h)return c(new Error("worker unavailable"));const f=String(Math.random());u.id=f;let p=null;const d=()=>{p&&clearTimeout(p),h.removeEventListener("message",m),h.removeEventListener("error",w)},m=k=>{const y=k.data||{};y.id===f&&(d(),y.error?c(new Error(y.error)):l(y.result))},w=k=>{d(),console.warn("["+e+"] worker error event",k);try{r===h&&(r=null,h.terminate&&h.terminate())}catch(y){console.warn("["+e+"] worker termination failed",y)}c(new Error(k&&k.message||"worker error"))};p=setTimeout(()=>{d(),console.warn("["+e+"] worker timed out");try{r===h&&(r=null,h.terminate&&h.terminate())}catch(k){console.warn("["+e+"] worker termination on timeout failed",k)}c(new Error("worker timeout"))},o),h.addEventListener("message",m),h.addEventListener("error",w);try{h.postMessage(u)}catch(k){d(),c(k)}})}return{get:s,send:i,terminate:n}}function Hi(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),r=URL.createObjectURL(e);return new Worker(r,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const Be=new Set;function hn(t){Ui(),Be.clear();for(const e of Ce)e&&Be.add(e);rr(K),rr(H),hn._refreshed=!0}function rr(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&Be.add(e)}function ir(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(r,s){return s&&Be.add(s),e.call(this,r,s)}}let sr=!1;function Ui(){sr||(ir(K),ir(H),sr=!0)}function ar(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function de(t){return String(t||"").replace(/^[.\/]+/,"")}function dt(t){return String(t||"").replace(/\/+$/,"")}function pt(t){return dt(t)+"/"}function qi(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const r=document.createElement("link");r.rel="preload",r.as="image",r.href=t,document.head.appendChild(r)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function $t(t,e=0,r=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const s=Array.from(t.querySelectorAll("img"));if(!s.length)return;const n=t,i=n&&n.getBoundingClientRect?n.getBoundingClientRect():null,a=0,u=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=i?Math.max(a,i.top):a,c=(i?Math.min(u,i.bottom):u)+Number(e||0);let h=0;n&&(h=n.clientHeight||(i?i.height:0)),h||(h=u-a);let f=.6;try{const w=n&&window.getComputedStyle?window.getComputedStyle(n):null,k=w&&w.getPropertyValue("--nimbi-image-max-height-ratio"),y=k?parseFloat(k):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(f=y)}catch(w){console.warn("[helpers] read CSS ratio failed",w)}const p=Math.max(200,Math.floor(h*f));let d=!1,m=null;if(s.forEach(w=>{try{const k=w.getAttribute?w.getAttribute("loading"):void 0;k!=="eager"&&w.setAttribute&&w.setAttribute("loading","lazy");const y=w.getBoundingClientRect?w.getBoundingClientRect():null,I=w.src||w.getAttribute&&w.getAttribute("src"),P=y&&y.height>1?y.height:p,A=y?y.top:0,q=A+P,j=!!(y&&P>0&&A<=c&&q>=o);j&&(w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),qi(I),d=!0),!m&&y&&y.top<=c&&(m={img:w,src:I,rect:y,beforeLoading:k}),r&&console.log("[helpers] setEagerForAboveFoldImages:",{src:I,rect:y,marginPx:e,visibleTop:o,visibleBottom:c,beforeLoading:k,isAboveFold:j,effectiveHeight:P,maxImageHeight:p})}catch(k){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",k)}}),!d&&m){const{img:w,src:k,rect:y,beforeLoading:I}=m;try{w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),r&&console.log("[helpers] setEagerForAboveFoldImages (fallback first visible):",{src:k,rect:y,marginPx:e,visibleTop:o,visibleBottom:c,beforeLoading:I,fallback:!0})}catch(P){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",P)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function It(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(r=>{console.warn("[helpers] safe swallowed error",r)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=It)}catch(t){console.warn("[helpers] global attach failed",t)}const K=new Map;let Le=[],dn=!1;function pn(t){dn=!!t}function or(t){Le=Array.isArray(t)?t.slice():[]}function ji(){return Le}const lr=nr(()=>Hi(Di),"slugManager");function fn(){return lr.get()}function cr(t){return lr.send(t)}async function Fi(t,e=1,r=void 0){if(!fn())return Ht(t,e,r);try{return await cr({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:r})}catch(n){try{return await Ht(t,e,r)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),n}}}async function Wi(t,e,r){return fn()?cr({type:"crawlForSlug",slug:t,base:e,maxQueue:r}):bn(t,e,r)}function We(t,e){if(t)if(Le&&Le.length){const s=e.split("/")[0],n=Le.includes(s);let i=K.get(t);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),n?i.langs[s]=e:i.default=e,K.set(t,i)}else K.set(t,e)}const Bt=new Set;function Zi(t){typeof t=="function"&&Bt.add(t)}function Gi(t){typeof t=="function"&&Bt.delete(t)}const H=new Map;let gn={},Ce=[],st="_404.md",at="_home.md";function mn(t){t!=null&&(st=String(t||""))}function wn(t){t!=null&&(at=String(t||""))}function Qi(t){gn=t||{}}const ft=new Map,zt=new Set;function Xi(){ft.clear(),zt.clear()}function Ki(t){if(!t||t.length===0)return"";let e=t[0];for(let s=1;s<t.length;s++){const n=t[s];let i=0;const a=Math.min(e.length,n.length);for(;i<a&&e[i]===n[i];)i++;e=e.slice(0,i)}const r=e.lastIndexOf("/");return r===-1?e:e.slice(0,r+1)}function Nt(t){K.clear(),H.clear(),Ce=[],Le=Le||[];const e=Object.keys(gn||{});if(!e.length)return;let r="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?r=new URL(String(t)).pathname:r=String(t||"")}catch(s){r=String(t||""),console.warn("[slugManager] parse contentBase failed",s)}r=pt(r)}}catch(s){r="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}r||(r=Ki(e));for(const s of e){let n=s;r&&s.startsWith(r)?n=de(s.slice(r.length)):n=de(s),Ce.push(n);try{hn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=gn[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const u=re(a[1].trim());if(u)try{if(Le&&Le.length){const l=n.split("/")[0],c=Le.includes(l);let h=K.get(u);(!h||typeof h=="string")&&(h={default:typeof h=="string"?h:void 0,langs:{}}),c?h.langs[l]=n:h.default=n,K.set(u,h)}else K.set(u,n);H.set(n,u)}catch(o){console.warn("[slugManager] set slug mapping failed",o)}}}}}try{Nt()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function re(t){let r=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return r=r.replace(/(?:-?)(?:md|html)$/,""),r.length>80&&(r=r.slice(0,80).replace(/-+$/g,"")),r}function Yi(t){return gt(t,void 0)}function gt(t,e){if(!t)return!1;if(t.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(t)){if(e&&typeof e=="string")try{const r=new URL(t),s=new URL(e);return r.origin!==s.origin?!0:!r.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(t.startsWith("/")&&e&&typeof e=="string")try{const r=new URL(t,e),s=new URL(e);return r.origin!==s.origin?!0:!r.pathname.startsWith(s.pathname)}catch{return!0}return!1}function Ot(t){return t==null?t:String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(e,r)=>r)}function mt(t){if(!t||!K.has(t))return null;const e=K.get(t);if(!e)return null;if(typeof e=="string")return e;if(Le&&Le.length&&Fe&&e.langs&&e.langs[Fe])return e.langs[Fe];if(e.default)return e.default;if(e.langs){const r=Object.keys(e.langs);if(r.length)return e.langs[r[0]]}return null}const wt=new Map;function Vi(){wt.clear()}let ke=async function(t,e){if(!t)throw new Error("path required");try{const i=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&K.has(i)){const a=mt(i)||K.get(i);a&&a!==t&&(t=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const r=e==null?"":dt(String(e));let s="";try{if(r)if(/^[a-z][a-z0-9+.-]*:/i.test(r))s=r.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=r.startsWith("/")?r:"/"+r;s=i+a.replace(/\/$/,"")+"/"+t.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+t.replace(/^\//,"")}catch{s="/"+t.replace(/^\//,"")}if(wt.has(s))return wt.get(s);const n=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const h=`${r}/${st}`,f=await globalThis.fetch(h);if(f&&typeof f.ok=="boolean"&&f.ok)return{raw:await f.text(),status:404}}catch(h){console.warn("[slugManager] fetching fallback 404 failed",h)}let c="";try{i&&typeof i.clone=="function"?c=await i.clone().text():i&&typeof i.text=="function"?c=await i.text():c=""}catch(h){c="",console.warn("[slugManager] reading error body failed",h)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:c.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),u=a.trim().slice(0,16).toLowerCase(),o=u.startsWith("<!doctype")||u.startsWith("<html"),l=o||String(t||"").toLowerCase().endsWith(".html");if(o&&String(t||"").toLowerCase().endsWith(".md")){try{const c=`${r}/${st}`,h=await globalThis.fetch(c);if(h.ok)return{raw:await h.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return l?{raw:a,isHtml:!0}:{raw:a}})();return wt.set(s,n),n};function Ji(t){typeof t=="function"&&(ke=t)}const Dt=new Map;function es(t){if(!t||typeof t!="string")return"";let e=t.replace(/```[\s\S]*?```/g,"");return e=e.replace(/<pre[\s\S]*?<\/pre>/gi,""),e=e.replace(/<code[\s\S]*?<\/code>/gi,""),e=e.replace(/<!--([\s\S]*?)-->/g,""),e=e.replace(/^ {4,}.*$/gm,""),e=e.replace(/`[^`]*`/g,""),e}let He=[],bt=null;async function Ht(t,e=1,r=void 0){const s=Array.isArray(r)?Array.from(new Set((r||[]).map(n=>de(String(n||""))))):[];try{const n=de(String(st||""));n&&!s.includes(n)&&s.push(n)}catch{}if(He&&He.length&&e===1&&!He.some(i=>{try{return s.includes(de(String(i.path||"")))}catch{return!1}}))return He;if(bt)return bt;bt=(async()=>{let n=Array.isArray(r)?Array.from(new Set((r||[]).map(l=>de(String(l||""))))):[];try{const l=de(String(st||""));l&&!n.includes(l)&&n.push(l)}catch{}const i=l=>{if(!n||!n.length)return!1;for(const c of n)if(c&&(l===c||l.startsWith(c+"/")))return!0;return!1};let a=[];if(Ce&&Ce.length&&(a=Array.from(Ce)),!a.length)for(const l of K.values())l&&a.push(l);try{const l=await pr(t);l&&l.length&&(a=a.concat(l))}catch(l){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",l)}try{const l=new Set(a),c=[...a];for(l.size;c.length&&l.size<=kt;){const h=c.shift();try{const f=await ke(h,t);if(f&&f.raw){if(f.status===404)continue;let p=f.raw;const d=[],m=String(h||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(m)&&dn&&(!h||!h.includes("/")))continue;const w=es(p),k=/\[[^\]]+\]\(([^)]+)\)/g;let y;for(;y=k.exec(w);)d.push(y[1]);const I=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;y=I.exec(w);)d.push(y[1]);const P=h&&h.includes("/")?h.substring(0,h.lastIndexOf("/")+1):"";for(let A of d)try{if(gt(A,t)||A.startsWith("..")||A.indexOf("/../")!==-1||(P&&!A.startsWith("./")&&!A.startsWith("/")&&!A.startsWith("../")&&(A=P+A),A=de(A),!/\.(md|html?)(?:$|[?#])/i.test(A))||(A=A.split(/[?#]/)[0],i(A)))continue;l.has(A)||(l.add(A),c.push(A),a.push(A))}catch(q){console.warn("[slugManager] href processing failed",A,q)}}}catch(f){console.warn("[slugManager] discovery fetch failed for",h,f)}}}catch(l){console.warn("[slugManager] discovery loop failed",l)}const u=new Set;a=a.filter(l=>!l||u.has(l)||i(l)?!1:(u.add(l),!0));const o=[];for(const l of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(l))try{const c=await ke(l,t);if(c&&c.raw){if(c.status===404)continue;let h="",f="";if(c.isHtml)try{const m=new DOMParser().parseFromString(c.raw,"text/html"),w=m.querySelector("title")||m.querySelector("h1");w&&w.textContent&&(h=w.textContent.trim());const k=m.querySelector("p");if(k&&k.textContent&&(f=k.textContent.trim()),e>=2)try{const y=m.querySelector("h1"),I=y&&y.textContent?y.textContent.trim():h||"",P=(()=>{try{if(H.has(l))return H.get(l)}catch{}return re(h||l)})(),A=Array.from(m.querySelectorAll("h2"));for(const q of A)try{const j=(q.textContent||"").trim();if(!j)continue;const G=q.id?q.id:re(j),V=P?`${P}::${G}`:`${re(l)}::${G}`;let ie="",O=q.nextElementSibling;for(;O&&O.tagName&&O.tagName.toLowerCase()==="script";)O=O.nextElementSibling;O&&O.textContent&&(ie=String(O.textContent).trim()),o.push({slug:V,title:j,excerpt:ie,path:l,parentTitle:I})}catch(j){console.warn("[slugManager] indexing H2 failed",j)}if(e===3)try{const q=Array.from(m.querySelectorAll("h3"));for(const j of q)try{const G=(j.textContent||"").trim();if(!G)continue;const V=j.id?j.id:re(G),ie=P?`${P}::${V}`:`${re(l)}::${V}`;let O="",C=j.nextElementSibling;for(;C&&C.tagName&&C.tagName.toLowerCase()==="script";)C=C.nextElementSibling;C&&C.textContent&&(O=String(C.textContent).trim()),o.push({slug:ie,title:G,excerpt:O,path:l,parentTitle:I})}catch(G){console.warn("[slugManager] indexing H3 failed",G)}}catch(q){console.warn("[slugManager] collect H3s failed",q)}}catch(y){console.warn("[slugManager] collect H2s failed",y)}}catch(d){console.warn("[slugManager] parsing HTML for index failed",d)}else{const d=c.raw,m=d.match(/^#\s+(.+)$/m);h=m?m[1].trim():"";try{h=Ot(h)}catch{}const w=d.split(/\r?\n\s*\r?\n/);if(w.length>1)for(let k=1;k<w.length;k++){const y=w[k].trim();if(y&&!/^#/.test(y)){f=y.replace(/\r?\n/g," ");break}}if(e>=2){let k="",y="";try{const I=(d.match(/^#\s+(.+)$/m)||[])[1];k=I?I.trim():"",y=(function(){try{if(H.has(l))return H.get(l)}catch{}return re(h||l)})();const P=/^##\s+(.+)$/gm;let A;for(;A=P.exec(d);)try{const q=(A[1]||"").trim(),j=Ot(q);if(!q)continue;const G=re(q),V=y?`${y}::${G}`:`${re(l)}::${G}`,O=d.slice(P.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),C=O&&O[1]?String(O[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:V,title:j,excerpt:C,path:l,parentTitle:k})}catch(q){console.warn("[slugManager] indexing markdown H2 failed",q)}}catch(I){console.warn("[slugManager] collect markdown H2s failed",I)}if(e===3)try{const I=/^###\s+(.+)$/gm;let P;for(;P=I.exec(d);)try{const A=(P[1]||"").trim(),q=Ot(A);if(!A)continue;const j=re(A),G=y?`${y}::${j}`:`${re(l)}::${j}`,ie=d.slice(I.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),O=ie&&ie[1]?String(ie[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:G,title:q,excerpt:O,path:l,parentTitle:k})}catch(A){console.warn("[slugManager] indexing markdown H3 failed",A)}}catch(I){console.warn("[slugManager] collect markdown H3s failed",I)}}}let p="";try{H.has(l)&&(p=H.get(l))}catch(d){console.warn("[slugManager] mdToSlug access failed",d)}p||(p=re(h||l)),o.push({slug:p,title:h,excerpt:f,path:l})}}catch(c){console.warn("[slugManager] buildSearchIndex: entry fetch failed",c)}try{He=o.filter(c=>{try{return!i(String(c.path||""))}catch{return!0}})}catch(l){console.warn("[slugManager] filtering index by excludes failed",l),He=o}return He})();try{await bt}catch(n){console.warn("[slugManager] awaiting _indexPromise failed",n)}return bt=null,He}const ur=1e3;let kt=ur;function ts(t){typeof t=="number"&&t>=0&&(kt=t)}const hr=new DOMParser,dr="a[href]";let bn=async function(t,e,r=kt){if(Dt.has(t))return Dt.get(t);let s=null;const n=new Set,i=[""];for(;i.length&&!s&&!(i.length>r);){const a=i.shift();if(n.has(a))continue;n.add(a);let u=e;u.endsWith("/")||(u+="/"),u+=a;try{let o;try{o=await globalThis.fetch(u)}catch(f){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:u,error:f});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:u,status:o.status});continue}const l=await o.text(),h=hr.parseFromString(l,"text/html").querySelectorAll(dr);for(const f of h)try{let p=f.getAttribute("href")||"";if(!p||gt(p,e)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const d=a+p;n.has(d)||i.push(d);continue}if(p.toLowerCase().endsWith(".md")){const d=de(a+p);try{if(H.has(d))continue;for(const m of K.values());}catch(m){console.warn("[slugManager] slug map access failed",m)}try{const m=await ke(d,e);if(m&&m.raw){const w=(m.raw||"").match(/^#\s+(.+)$/m);if(w&&w[1]&&re(w[1].trim())===t){s=d;break}}}catch(m){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",m)}}}catch(p){console.warn("[slugManager] crawlForSlug: link iteration failed",p)}}catch(o){console.warn("[slugManager] crawlForSlug: directory fetch failed",o)}}return Dt.set(t,s),s};async function pr(t,e=kt){const r=new Set,s=new Set,n=[""];for(;n.length&&!(n.length>e);){const i=n.shift();if(s.has(i))continue;s.add(i);let a=t;a.endsWith("/")||(a+="/"),a+=i;try{let u;try{u=await globalThis.fetch(a)}catch(h){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:h});continue}if(!u||!u.ok){u&&!u.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:u.status});continue}const o=await u.text(),c=hr.parseFromString(o,"text/html").querySelectorAll(dr);for(const h of c)try{let f=h.getAttribute("href")||"";if(!f||gt(f,t)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const d=i+f;s.has(d)||n.push(d);continue}const p=(i+f).replace(/^\/+/,"");/\.(md|html?)$/i.test(p)&&r.add(p)}catch(f){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",f)}}catch(u){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",u)}}return Array.from(r)}async function fr(t,e,r){if(t&&typeof t=="string"&&(t=de(t),t=dt(t)),K.has(t))return mt(t)||K.get(t);for(const n of Bt)try{const i=await n(t,e);if(i)return We(t,i),H.set(i,t),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(Ce&&Ce.length){if(ft.has(t)){const n=ft.get(t);return K.set(t,n),H.set(n,t),n}for(const n of Ce)if(!zt.has(n))try{const i=await ke(n,e);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const u=re(a[1].trim());if(zt.add(n),u&&ft.set(u,n),u===t)return We(t,n),H.set(n,t),n}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const n=await Ht(e);if(n&&n.length){const i=n.find(a=>a.slug===t);if(i)return We(t,i.path),H.set(i.path,t),i.path}}catch(n){console.warn("[slugManager] buildSearchIndex lookup failed",n)}try{const n=await bn(t,e,r);if(n)return We(t,n),H.set(n,t),n}catch(n){console.warn("[slugManager] crawlForSlug lookup failed",n)}const s=[`${t}.html`,`${t}.md`];for(const n of s)try{const i=await ke(n,e);if(i&&i.raw)return We(t,n),H.set(n,t),n}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(Ce&&Ce.length)for(const n of Ce)try{const i=n.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(re(i)===t)return We(t,n),H.set(n,t),n}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const n=[];at&&typeof at=="string"&&at.trim()&&n.push(at),n.includes("_home.md")||n.push("_home.md");for(const i of n)try{const a=await ke(i,e);if(a&&a.raw){const u=(a.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]&&re(u[1].trim())===t)return We(t,i),H.set(i,t),i}}catch{}}catch(n){console.warn("[slugManager] home page fetch failed",n)}return null}const Ut=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:ur,_setAllMd:Qi,_storeSlugMapping:We,addSlugResolver:Zi,get allMarkdownPaths(){return Ce},get availableLanguages(){return Le},buildSearchIndex:Ht,buildSearchIndexWorker:Fi,clearFetchCache:Vi,clearListCaches:Xi,crawlAllMarkdown:pr,crawlCache:Dt,crawlForSlug:bn,crawlForSlugWorker:Wi,get defaultCrawlMaxQueue(){return kt},ensureSlug:fr,fetchCache:wt,get fetchMarkdown(){return ke},getLanguages:ji,get homePage(){return at},initSlugWorker:fn,isExternalLink:Yi,isExternalLinkWithBase:gt,listPathsFetched:zt,listSlugCache:ft,mdToSlug:H,get notFoundPage(){return st},removeSlugResolver:Gi,resolveSlugPath:mt,get searchIndex(){return He},setContentBase:Nt,setDefaultCrawlMaxQueue:ts,setFetchMarkdown:Ji,setHomePage:wn,setLanguages:or,setNotFoundPage:mn,setSkipRootReadme:pn,get skipRootReadme(){return dn},slugResolvers:Bt,slugToMd:K,slugify:re,unescapeMarkdown:Ot},Symbol.toStringTag,{value:"Module"}));let gr=100;function mr(t){gr=t}let yt=300*1e3;function wr(t){yt=t}const Me=new Map;function ns(t){if(!Me.has(t))return;const e=Me.get(t),r=Date.now();if(e.ts+yt<r){Me.delete(t);return}return Me.delete(t),Me.set(t,e),e.value}function rs(t,e){if(br(),br(),Me.delete(t),Me.set(t,{value:e,ts:Date.now()}),Me.size>gr){const r=Me.keys().next().value;r!==void 0&&Me.delete(r)}}function br(){if(!yt||yt<=0)return;const t=Date.now();for(const[e,r]of Me.entries())r.ts+yt<t&&Me.delete(e)}async function is(t,e){const r=new Set(Be),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const n of Array.from(s||[])){const i=n.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const u=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(u){let l=de(u[1]);l&&r.add(l);continue}const o=a.pathname||"";if(o){const l=new URL(e),c=pt(l.pathname);if(o.indexOf(c)!==-1){let h=o.startsWith(c)?o.slice(c.length):o;h=de(h),h&&r.add(h)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const n of r)try{if(!n||!String(n).includes(".md"))continue;const i=await ke(n,e);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const u=(a[1]||"").trim();if(u&&re(u)===t)return n}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function ss(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const r=decodeURIComponent(String(t||""));if(K.has(r)){const s=mt(r)||K.get(r);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||e.push(s):(e.push(s),e.push(s+".html")))}else{if(Be&&Be.size)for(const s of Be){const n=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(re(n)===r&&!/index\.html$/i.test(s)){e.push(s);break}}!e.length&&r&&!/\.(md|html?)$/i.test(r)&&(e.push(r+".html"),e.push(r+".md"))}}catch(r){console.warn("[router] buildPageCandidates failed during slug handling",r)}return e}async function as(t,e){const r=t||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let n=t||"",i=null;if(n&&String(n).includes("::")){const d=String(n).split("::",2);n=d[0],i=d[1]||null}const u=`${t}|||${typeof Oi<"u"&&Fe?Fe:""}`,o=ns(u);if(o)n=o.resolved,i=o.anchor||i;else{if(!String(n).includes(".md")&&!String(n).includes(".html")){let d=decodeURIComponent(String(n||""));if(d&&typeof d=="string"&&(d=de(d),d=dt(d)),K.has(d))n=mt(d)||K.get(d);else{let m=await is(d,e);if(m)n=m;else if(hn._refreshed&&Be&&Be.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const w=await fr(d,e);w&&(n=w)}}}rs(u,{resolved:n,anchor:i})}!i&&s&&(i=s);const l=ss(n),c=String(r||"").includes(".md")||String(r||"").includes(".html");if(c&&l.length===0&&(String(n).includes(".md")||String(n).includes(".html"))&&l.push(n),l.length===0&&(String(n).includes(".md")||String(n).includes(".html"))&&l.push(n),l.length===1&&/index\.html$/i.test(l[0])&&!c&&!K.has(n)&&!K.has(decodeURIComponent(String(n||"")))&&!String(n||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let h=null,f=null,p=null;for(const d of l)if(d)try{const m=de(d);h=await ke(m,e),f=m;break}catch(m){p=m;try{console.warn("[router] candidate fetch failed",{candidate:d,contentBase:e,err:m&&m.message||m})}catch{}}if(!h){try{console.error("[router] fetchPageData: no page data for",{originalRaw:r,resolved:n,pageCandidates:l,contentBase:e,fetchError:p&&(p.message||String(p))||null})}catch{}try{if(c&&String(r||"").toLowerCase().includes(".html"))try{const d=new URL(String(r||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",d);const m=await fetch(d);if(m&&m.ok){const w=await m.text(),k=m&&m.headers&&typeof m.headers.get=="function"&&m.headers.get("content-type")||"",y=(w||"").toLowerCase(),I=k&&k.indexOf&&k.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1;if(I||console.warn("[router] absolute fetch returned non-HTML",{abs:d,contentType:k,snippet:y.slice(0,200)}),I)try{const P=d,A=new URL(".",P).toString();try{const j=typeof DOMParser<"u"?new DOMParser:null;if(j){const G=j.parseFromString(w||"","text/html"),V=(M,T)=>{try{const v=T.getAttribute(M)||"";if(!v||/^(https?:)?\/\//i.test(v)||v.startsWith("/")||v.startsWith("#"))return;try{const b=new URL(v,P).toString();T.setAttribute(M,b)}catch(b){console.warn("[router] rewrite attribute failed",M,b)}}catch(v){console.warn("[router] rewrite helper failed",v)}},ie=G.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),O=[];for(const M of Array.from(ie||[]))try{const T=M.tagName?M.tagName.toLowerCase():"";if(T==="a")continue;if(M.hasAttribute("src")){const v=M.getAttribute("src");V("src",M);const b=M.getAttribute("src");v!==b&&O.push({attr:"src",tag:T,before:v,after:b})}if(M.hasAttribute("href")&&T==="link"){const v=M.getAttribute("href");V("href",M);const b=M.getAttribute("href");v!==b&&O.push({attr:"href",tag:T,before:v,after:b})}if(M.hasAttribute("href")&&T!=="link"){const v=M.getAttribute("href");V("href",M);const b=M.getAttribute("href");v!==b&&O.push({attr:"href",tag:T,before:v,after:b})}if(M.hasAttribute("xlink:href")){const v=M.getAttribute("xlink:href");V("xlink:href",M);const b=M.getAttribute("xlink:href");v!==b&&O.push({attr:"xlink:href",tag:T,before:v,after:b})}if(M.hasAttribute("poster")){const v=M.getAttribute("poster");V("poster",M);const b=M.getAttribute("poster");v!==b&&O.push({attr:"poster",tag:T,before:v,after:b})}if(M.hasAttribute("srcset")){const R=(M.getAttribute("srcset")||"").split(",").map(B=>B.trim()).filter(Boolean).map(B=>{const[S,Q]=B.split(/\s+/,2);if(!S||/^(https?:)?\/\//i.test(S)||S.startsWith("/"))return B;try{const he=new URL(S,P).toString();return Q?`${he} ${Q}`:he}catch{return B}}).join(", ");M.setAttribute("srcset",R)}}catch{}const C=G.documentElement&&G.documentElement.outerHTML?G.documentElement.outerHTML:w;try{O&&O.length&&console.warn("[router] rewritten asset refs",{abs:d,rewritten:O})}catch{}return{data:{raw:C,isHtml:!0},pagePath:String(r||""),anchor:i}}}catch{}let q=w;return/<base\s+[^>]*>/i.test(w)||(/<head[^>]*>/i.test(w)?q=w.replace(/(<head[^>]*>)/i,`$1<base href="${A}">`):q=`<base href="${A}">`+w),{data:{raw:q,isHtml:!0},pagePath:String(r||""),anchor:i}}catch{return{data:{raw:w,isHtml:!0},pagePath:String(r||""),anchor:i}}}}catch(d){console.warn("[router] absolute HTML fetch fallback failed",d)}}catch{}throw new Error("no page data")}return{data:h,pagePath:f,anchor:i}}function kn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ke=kn();function kr(t){Ke=t}var Ye={exec:()=>null};function ee(t,e=""){let r=typeof t=="string"?t:t.source,s={replace:(n,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(Re.caret,"$1"),r=r.replace(n,a),s},getRegex:()=>new RegExp(r,e)};return s}var os=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Re={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},ls=/^(?:[ \t]*(?:\n|$))+/,cs=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,us=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,xt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,hs=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,yn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,yr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,xr=ee(yr).replace(/bull/g,yn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),ds=ee(yr).replace(/bull/g,yn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),xn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ps=/^[^\n]+/,Sn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,fs=ee(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Sn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),gs=ee(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,yn).getRegex(),qt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",vn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ms=ee("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",vn).replace("tag",qt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Sr=ee(xn).replace("hr",xt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",qt).getRegex(),ws=ee(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Sr).getRegex(),An={blockquote:ws,code:cs,def:fs,fences:us,heading:hs,hr:xt,html:ms,lheading:xr,list:gs,newline:ls,paragraph:Sr,table:Ye,text:ps},vr=ee("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",xt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",qt).getRegex(),bs={...An,lheading:ds,table:vr,paragraph:ee(xn).replace("hr",xt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",vr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",qt).getRegex()},ks={...An,html:ee(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",vn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ye,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ee(xn).replace("hr",xt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",xr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ys=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,xs=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ar=/^( {2,}|\\)\n(?!\s*$)/,Ss=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,jt=/[\p{P}\p{S}]/u,En=/[\s\p{P}\p{S}]/u,Er=/[^\s\p{P}\p{S}]/u,vs=ee(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,En).getRegex(),Rr=/(?!~)[\p{P}\p{S}]/u,As=/(?!~)[\s\p{P}\p{S}]/u,Es=/(?:[^\s\p{P}\p{S}]|~)/u,Tr=/(?![*_])[\p{P}\p{S}]/u,Rs=/(?![*_])[\s\p{P}\p{S}]/u,Ts=/(?:[^\s\p{P}\p{S}]|[*_])/u,Ls=ee(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",os?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Lr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Cs=ee(Lr,"u").replace(/punct/g,jt).getRegex(),_s=ee(Lr,"u").replace(/punct/g,Rr).getRegex(),Cr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Ms=ee(Cr,"gu").replace(/notPunctSpace/g,Er).replace(/punctSpace/g,En).replace(/punct/g,jt).getRegex(),Ps=ee(Cr,"gu").replace(/notPunctSpace/g,Es).replace(/punctSpace/g,As).replace(/punct/g,Rr).getRegex(),$s=ee("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Er).replace(/punctSpace/g,En).replace(/punct/g,jt).getRegex(),Is=ee(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Tr).getRegex(),Bs="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",zs=ee(Bs,"gu").replace(/notPunctSpace/g,Ts).replace(/punctSpace/g,Rs).replace(/punct/g,Tr).getRegex(),Ns=ee(/\\(punct)/,"gu").replace(/punct/g,jt).getRegex(),Os=ee(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ds=ee(vn).replace("(?:-->|$)","-->").getRegex(),Hs=ee("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ds).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ft=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Us=ee(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Ft).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),_r=ee(/^!?\[(label)\]\[(ref)\]/).replace("label",Ft).replace("ref",Sn).getRegex(),Mr=ee(/^!?\[(ref)\](?:\[\])?/).replace("ref",Sn).getRegex(),qs=ee("reflink|nolink(?!\\()","g").replace("reflink",_r).replace("nolink",Mr).getRegex(),Pr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Rn={_backpedal:Ye,anyPunctuation:Ns,autolink:Os,blockSkip:Ls,br:Ar,code:xs,del:Ye,delLDelim:Ye,delRDelim:Ye,emStrongLDelim:Cs,emStrongRDelimAst:Ms,emStrongRDelimUnd:$s,escape:ys,link:Us,nolink:Mr,punctuation:vs,reflink:_r,reflinkSearch:qs,tag:Hs,text:Ss,url:Ye},js={...Rn,link:ee(/^!?\[(label)\]\((.*?)\)/).replace("label",Ft).getRegex(),reflink:ee(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ft).getRegex()},Tn={...Rn,emStrongRDelimAst:Ps,emStrongLDelim:_s,delLDelim:Is,delRDelim:zs,url:ee(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Pr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ee(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Pr).getRegex()},Fs={...Tn,br:ee(Ar).replace("{2,}","*").getRegex(),text:ee(Tn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Wt={normal:An,gfm:bs,pedantic:ks},St={normal:Rn,gfm:Tn,breaks:Fs,pedantic:js},Ws={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},$r=t=>Ws[t];function ze(t,e){if(e){if(Re.escapeTest.test(t))return t.replace(Re.escapeReplace,$r)}else if(Re.escapeTestNoEncode.test(t))return t.replace(Re.escapeReplaceNoEncode,$r);return t}function Ir(t){try{t=encodeURI(t).replace(Re.percentDecode,"%")}catch{return null}return t}function Br(t,e){let r=t.replace(Re.findPipe,(i,a,u)=>{let o=!1,l=a;for(;--l>=0&&u[l]==="\\";)o=!o;return o?"|":" |"}),s=r.split(Re.splitPipe),n=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;n<s.length;n++)s[n]=s[n].trim().replace(Re.slashPipe,"|");return s}function vt(t,e,r){let s=t.length;if(s===0)return"";let n=0;for(;n<s&&t.charAt(s-n-1)===e;)n++;return t.slice(0,s-n)}function Zs(t,e){if(t.indexOf(e[1])===-1)return-1;let r=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])r++;else if(t[s]===e[1]&&(r--,r<0))return s;return r>0?-2:-1}function Gs(t,e=0){let r=e,s="";for(let n of t)if(n==="	"){let i=4-r%4;s+=" ".repeat(i),r+=i}else s+=n,r++;return s}function zr(t,e,r,s,n){let i=e.href,a=e.title||null,u=t[1].replace(n.other.outputLinkReplace,"$1");s.state.inLink=!0;let o={type:t[0].charAt(0)==="!"?"image":"link",raw:r,href:i,title:a,text:u,tokens:s.inlineTokens(u)};return s.state.inLink=!1,o}function Qs(t,e,r){let s=t.match(r.other.indentCodeCompensation);if(s===null)return e;let n=s[1];return e.split(`
`).map(i=>{let a=i.match(r.other.beginningSpace);if(a===null)return i;let[u]=a;return u.length>=n.length?i.slice(n.length):i}).join(`
`)}var Zt=class{options;rules;lexer;constructor(t){this.options=t||Ke}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let r=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?r:vt(r,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let r=e[0],s=Qs(r,e[3]||"",this.rules);return{type:"code",raw:r,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let r=e[2].trim();if(this.rules.other.endingHash.test(r)){let s=vt(r,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(r=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:r,tokens:this.lexer.inline(r)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:vt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let r=vt(e[0],`
`).split(`
`),s="",n="",i=[];for(;r.length>0;){let a=!1,u=[],o;for(o=0;o<r.length;o++)if(this.rules.other.blockquoteStart.test(r[o]))u.push(r[o]),a=!0;else if(!a)u.push(r[o]);else break;r=r.slice(o);let l=u.join(`
`),c=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${l}`:l,n=n?`${n}
${c}`:c;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=h,r.length===0)break;let f=i.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let p=f,d=p.raw+`
`+r.join(`
`),m=this.blockquote(d);i[i.length-1]=m,s=s.substring(0,s.length-p.raw.length)+m.raw,n=n.substring(0,n.length-p.text.length)+m.text;break}else if(f?.type==="list"){let p=f,d=p.raw+`
`+r.join(`
`),m=this.list(d);i[i.length-1]=m,s=s.substring(0,s.length-f.raw.length)+m.raw,n=n.substring(0,n.length-p.raw.length)+m.raw,r=d.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:n}}}list(t){let e=this.rules.block.list.exec(t);if(e){let r=e[1].trim(),s=r.length>1,n={type:"list",raw:"",ordered:s,start:s?+r.slice(0,-1):"",loose:!1,items:[]};r=s?`\\d{1,9}\\${r.slice(-1)}`:`\\${r}`,this.options.pedantic&&(r=s?r:"[*+-]");let i=this.rules.other.listItemRegex(r),a=!1;for(;t;){let o=!1,l="",c="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;l=e[0],t=t.substring(l.length);let h=Gs(e[2].split(`
`,1)[0],e[1].length),f=t.split(`
`,1)[0],p=!h.trim(),d=0;if(this.options.pedantic?(d=2,c=h.trimStart()):p?d=e[1].length+1:(d=h.search(this.rules.other.nonSpaceChar),d=d>4?1:d,c=h.slice(d),d+=e[1].length),p&&this.rules.other.blankLine.test(f)&&(l+=f+`
`,t=t.substring(f.length+1),o=!0),!o){let m=this.rules.other.nextBulletRegex(d),w=this.rules.other.hrRegex(d),k=this.rules.other.fencesBeginRegex(d),y=this.rules.other.headingBeginRegex(d),I=this.rules.other.htmlBeginRegex(d),P=this.rules.other.blockquoteBeginRegex(d);for(;t;){let A=t.split(`
`,1)[0],q;if(f=A,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),q=f):q=f.replace(this.rules.other.tabCharGlobal,"    "),k.test(f)||y.test(f)||I.test(f)||P.test(f)||m.test(f)||w.test(f))break;if(q.search(this.rules.other.nonSpaceChar)>=d||!f.trim())c+=`
`+q.slice(d);else{if(p||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||k.test(h)||y.test(h)||w.test(h))break;c+=`
`+f}p=!f.trim(),l+=A+`
`,t=t.substring(A.length+1),h=q.slice(d)}}n.loose||(a?n.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(a=!0)),n.items.push({type:"list_item",raw:l,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),n.raw+=l}let u=n.items.at(-1);if(u)u.raw=u.raw.trimEnd(),u.text=u.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let o of n.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let l=this.rules.other.listTaskCheckbox.exec(o.raw);if(l){let c={type:"checkbox",raw:l[0]+" ",checked:l[0]!=="[ ]"};o.checked=c.checked,n.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=c.raw+o.tokens[0].raw,o.tokens[0].text=c.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(c)):o.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):o.tokens.unshift(c)}}if(!n.loose){let l=o.tokens.filter(h=>h.type==="space"),c=l.length>0&&l.some(h=>this.rules.other.anyLine.test(h.raw));n.loose=c}}if(n.loose)for(let o of n.items){o.loose=!0;for(let l of o.tokens)l.type==="text"&&(l.type="paragraph")}return n}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let r=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:r,raw:e[0],href:s,title:n}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let r=Br(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(r.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<r.length;a++)i.header.push({text:r[a],tokens:this.lexer.inline(r[a]),header:!0,align:i.align[a]});for(let a of n)i.rows.push(Br(a,i.header.length).map((u,o)=>({text:u,tokens:this.lexer.inline(u),header:!1,align:i.align[o]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let r=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:r,tokens:this.lexer.inline(r)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let r=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(r)){if(!this.rules.other.endAngleBracket.test(r))return;let i=vt(r.slice(0,-1),"\\");if((r.length-i.length)%2===0)return}else{let i=Zs(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],n="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],n=i[3])}else n=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(r)?s=s.slice(1):s=s.slice(1,-1)),zr(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let r;if((r=this.rules.inline.reflink.exec(t))||(r=this.rules.inline.nolink.exec(t))){let s=(r[2]||r[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=e[s.toLowerCase()];if(!n){let i=r[0].charAt(0);return{type:"text",raw:i,text:i}}return zr(r,n,r[0],this.lexer,this.rules)}}emStrong(t,e,r=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&r.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!r||this.rules.inline.punctuation.exec(r))){let n=[...s[0]].length-1,i,a,u=n,o=0,l=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,e=e.slice(-1*t.length+n);(s=l.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){u+=a;continue}else if((s[5]||s[6])&&n%3&&!((n+a)%3)){o+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u+o);let c=[...s[0]][0].length,h=t.slice(0,n+s.index+c+a);if(Math.min(n,a)%2){let p=h.slice(1,-1);return{type:"em",raw:h,text:p,tokens:this.lexer.inlineTokens(p)}}let f=h.slice(2,-2);return{type:"strong",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let r=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(r),n=this.rules.other.startingSpaceChar.test(r)&&this.rules.other.endingSpaceChar.test(r);return s&&n&&(r=r.substring(1,r.length-1)),{type:"codespan",raw:e[0],text:r}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,r=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!r||this.rules.inline.punctuation.exec(r))){let n=[...s[0]].length-1,i,a,u=n,o=this.rules.inline.delRDelim;for(o.lastIndex=0,e=e.slice(-1*t.length+n);(s=o.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==n))continue;if(s[3]||s[4]){u+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u);let l=[...s[0]][0].length,c=t.slice(0,n+s.index+l+a),h=c.slice(n,-n);return{type:"del",raw:c,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let r,s;return e[2]==="@"?(r=e[1],s="mailto:"+r):(r=e[1],s=r),{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let r,s;if(e[2]==="@")r=e[0],s="mailto:"+r;else{let n;do n=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(n!==e[0]);r=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:r,href:s,tokens:[{type:"text",raw:r,text:r}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let r=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:r}}}},Pe=class Gn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ke,this.options.tokenizer=this.options.tokenizer||new Zt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let r={other:Re,block:Wt.normal,inline:St.normal};this.options.pedantic?(r.block=Wt.pedantic,r.inline=St.pedantic):this.options.gfm&&(r.block=Wt.gfm,this.options.breaks?r.inline=St.breaks:r.inline=St.gfm),this.tokenizer.rules=r}static get rules(){return{block:Wt,inline:St}}static lex(e,r){return new Gn(r).lex(e)}static lexInline(e,r){return new Gn(r).inlineTokens(e)}lex(e){e=e.replace(Re.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let r=0;r<this.inlineQueue.length;r++){let s=this.inlineQueue[r];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,r=[],s=!1){for(this.options.pedantic&&(e=e.replace(Re.tabCharGlobal,"    ").replace(Re.spaceLine,""));e;){let n;if(this.options.extensions?.block?.some(a=>(n=a.call({lexer:this},e,r))?(e=e.substring(n.raw.length),r.push(n),!0):!1))continue;if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length);let a=r.at(-1);n.raw.length===1&&a!==void 0?a.raw+=`
`:r.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title},r.push(n));continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),r.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),r.push(n);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0,u=e.slice(1),o;this.options.extensions.startBlock.forEach(l=>{o=l.call({lexer:this},u),typeof o=="number"&&o>=0&&(a=Math.min(a,o))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(n=this.tokenizer.paragraph(i))){let a=r.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n),s=i.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length);let a=r.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+n.raw,a.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):r.push(n);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,r}inline(e,r=[]){return this.inlineQueue.push({src:e,tokens:r}),r}inlineTokens(e,r=[]){let s=e,n=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)o.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,n.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=n[2]?n[2].length:0,s=s.slice(0,n.index+i)+"["+"a".repeat(n[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,u="";for(;e;){a||(u=""),a=!1;let o;if(this.options.extensions?.inline?.some(c=>(o=c.call({lexer:this},e,r))?(e=e.substring(o.raw.length),r.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let c=r.at(-1);o.type==="text"&&c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):r.push(o);continue}if(o=this.tokenizer.emStrong(e,s,u)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.del(e,s,u)){e=e.substring(o.raw.length),r.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),r.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),r.push(o);continue}let l=e;if(this.options.extensions?.startInline){let c=1/0,h=e.slice(1),f;this.options.extensions.startInline.forEach(p=>{f=p.call({lexer:this},h),typeof f=="number"&&f>=0&&(c=Math.min(c,f))}),c<1/0&&c>=0&&(l=e.substring(0,c+1))}if(o=this.tokenizer.inlineText(l)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(u=o.raw.slice(-1)),a=!0;let c=r.at(-1);c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):r.push(o);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return r}},Gt=class{options;parser;constructor(t){this.options=t||Ke}space(t){return""}code({text:t,lang:e,escaped:r}){let s=(e||"").match(Re.notSpaceStart)?.[0],n=t.replace(Re.endingNewline,"")+`
`;return s?'<pre><code class="language-'+ze(s)+'">'+(r?n:ze(n,!0))+`</code></pre>
`:"<pre><code>"+(r?n:ze(n,!0))+`</code></pre>
`}blockquote({tokens:t}){return`<blockquote>
${this.parser.parse(t)}</blockquote>
`}html({text:t}){return t}def(t){return""}heading({tokens:t,depth:e}){return`<h${e}>${this.parser.parseInline(t)}</h${e}>
`}hr(t){return`<hr>
`}list(t){let e=t.ordered,r=t.start,s="";for(let a=0;a<t.items.length;a++){let u=t.items[a];s+=this.listitem(u)}let n=e?"ol":"ul",i=e&&r!==1?' start="'+r+'"':"";return"<"+n+i+`>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${ze(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:r}){let s=this.parser.parseInline(r),n=Ir(t);if(n===null)return s;t=n;let i='<a href="'+t+'"';return e&&(i+=' title="'+ze(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:r,tokens:s}){s&&(r=this.parser.parseInline(s,this.parser.textRenderer));let n=Ir(t);if(n===null)return ze(r);t=n;let i=`<img src="${t}" alt="${ze(r)}"`;return e&&(i+=` title="${ze(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:ze(t.text)}},Ln=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},$e=class Qn{options;renderer;textRenderer;constructor(e){this.options=e||Ke,this.options.renderer=this.options.renderer||new Gt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Ln}static parse(e,r){return new Qn(r).parse(e)}static parseInline(e,r){return new Qn(r).parseInline(e)}parse(e){let r="";for(let s=0;s<e.length;s++){let n=e[s];if(this.options.extensions?.renderers?.[n.type]){let a=n,u=this.options.extensions.renderers[a.type].call({parser:this},a);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){r+=u||"";continue}}let i=n;switch(i.type){case"space":{r+=this.renderer.space(i);break}case"hr":{r+=this.renderer.hr(i);break}case"heading":{r+=this.renderer.heading(i);break}case"code":{r+=this.renderer.code(i);break}case"table":{r+=this.renderer.table(i);break}case"blockquote":{r+=this.renderer.blockquote(i);break}case"list":{r+=this.renderer.list(i);break}case"checkbox":{r+=this.renderer.checkbox(i);break}case"html":{r+=this.renderer.html(i);break}case"def":{r+=this.renderer.def(i);break}case"paragraph":{r+=this.renderer.paragraph(i);break}case"text":{r+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return r}parseInline(e,r=this.renderer){let s="";for(let n=0;n<e.length;n++){let i=e[n];if(this.options.extensions?.renderers?.[i.type]){let u=this.options.extensions.renderers[i.type].call({parser:this},i);if(u!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=u||"";continue}}let a=i;switch(a.type){case"escape":{s+=r.text(a);break}case"html":{s+=r.html(a);break}case"link":{s+=r.link(a);break}case"image":{s+=r.image(a);break}case"checkbox":{s+=r.checkbox(a);break}case"strong":{s+=r.strong(a);break}case"em":{s+=r.em(a);break}case"codespan":{s+=r.codespan(a);break}case"br":{s+=r.br(a);break}case"del":{s+=r.del(a);break}case"text":{s+=r.text(a);break}default:{let u='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(u),"";throw new Error(u)}}}return s}},At=class{options;block;constructor(t){this.options=t||Ke}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Pe.lex:Pe.lexInline}provideParser(){return this.block?$e.parse:$e.parseInline}},Xs=class{defaults=kn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=$e;Renderer=Gt;TextRenderer=Ln;Lexer=Pe;Tokenizer=Zt;Hooks=At;constructor(...t){this.use(...t)}walkTokens(t,e){let r=[];for(let s of t)switch(r=r.concat(e.call(this,s)),s.type){case"table":{let n=s;for(let i of n.header)r=r.concat(this.walkTokens(i.tokens,e));for(let i of n.rows)for(let a of i)r=r.concat(this.walkTokens(a.tokens,e));break}case"list":{let n=s;r=r.concat(this.walkTokens(n.items,e));break}default:{let n=s;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(i=>{let a=n[i].flat(1/0);r=r.concat(this.walkTokens(a,e))}):n.tokens&&(r=r.concat(this.walkTokens(n.tokens,e)))}}return r}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(r=>{let s={...r};if(s.async=this.defaults.async||s.async||!1,r.extensions&&(r.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let i=e.renderers[n.name];i?e.renderers[n.name]=function(...a){let u=n.renderer.apply(this,a);return u===!1&&(u=i.apply(this,a)),u}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[n.level];i?i.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),s.extensions=e),r.renderer){let n=this.defaults.renderer||new Gt(this.defaults);for(let i in r.renderer){if(!(i in n))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,u=r.renderer[a],o=n[a];n[a]=(...l)=>{let c=u.apply(n,l);return c===!1&&(c=o.apply(n,l)),c||""}}s.renderer=n}if(r.tokenizer){let n=this.defaults.tokenizer||new Zt(this.defaults);for(let i in r.tokenizer){if(!(i in n))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,u=r.tokenizer[a],o=n[a];n[a]=(...l)=>{let c=u.apply(n,l);return c===!1&&(c=o.apply(n,l)),c}}s.tokenizer=n}if(r.hooks){let n=this.defaults.hooks||new At;for(let i in r.hooks){if(!(i in n))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,u=r.hooks[a],o=n[a];At.passThroughHooks.has(i)?n[a]=l=>{if(this.defaults.async&&At.passThroughHooksRespectAsync.has(i))return(async()=>{let h=await u.call(n,l);return o.call(n,h)})();let c=u.call(n,l);return o.call(n,c)}:n[a]=(...l)=>{if(this.defaults.async)return(async()=>{let h=await u.apply(n,l);return h===!1&&(h=await o.apply(n,l)),h})();let c=u.apply(n,l);return c===!1&&(c=o.apply(n,l)),c}}s.hooks=n}if(r.walkTokens){let n=this.defaults.walkTokens,i=r.walkTokens;s.walkTokens=function(a){let u=[];return u.push(i.call(this,a)),n&&(u=u.concat(n.call(this,a))),u}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Pe.lex(t,e??this.defaults)}parser(t,e){return $e.parse(t,e??this.defaults)}parseMarkdown(t){return(e,r)=>{let s={...r},n={...this.defaults,...s},i=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=t),n.async)return(async()=>{let a=n.hooks?await n.hooks.preprocess(e):e,u=await(n.hooks?await n.hooks.provideLexer():t?Pe.lex:Pe.lexInline)(a,n),o=n.hooks?await n.hooks.processAllTokens(u):u;n.walkTokens&&await Promise.all(this.walkTokens(o,n.walkTokens));let l=await(n.hooks?await n.hooks.provideParser():t?$e.parse:$e.parseInline)(o,n);return n.hooks?await n.hooks.postprocess(l):l})().catch(i);try{n.hooks&&(e=n.hooks.preprocess(e));let a=(n.hooks?n.hooks.provideLexer():t?Pe.lex:Pe.lexInline)(e,n);n.hooks&&(a=n.hooks.processAllTokens(a)),n.walkTokens&&this.walkTokens(a,n.walkTokens);let u=(n.hooks?n.hooks.provideParser():t?$e.parse:$e.parseInline)(a,n);return n.hooks&&(u=n.hooks.postprocess(u)),u}catch(a){return i(a)}}}onError(t,e){return r=>{if(r.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+ze(r.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(r);throw r}}},Ve=new Xs;function ne(t,e){return Ve.parse(t,e)}ne.options=ne.setOptions=function(t){return Ve.setOptions(t),ne.defaults=Ve.defaults,kr(ne.defaults),ne},ne.getDefaults=kn,ne.defaults=Ke,ne.use=function(...t){return Ve.use(...t),ne.defaults=Ve.defaults,kr(ne.defaults),ne},ne.walkTokens=function(t,e){return Ve.walkTokens(t,e)},ne.parseInline=Ve.parseInline,ne.Parser=$e,ne.parser=$e.parse,ne.Renderer=Gt,ne.TextRenderer=Ln,ne.Lexer=Pe,ne.lexer=Pe.lex,ne.Tokenizer=Zt,ne.Hooks=At,ne.parse=ne,ne.options,ne.setOptions,ne.use,ne.walkTokens,ne.parseInline,$e.parse,Pe.lex;const Nr=`function j() {
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
`,Or=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Nr],{type:"text/javascript;charset=utf-8"});function Ks(t){let e;try{if(e=Or&&(self.URL||self.webkitURL).createObjectURL(Or),!e)throw"";const r=new Worker(e,{type:"module",name:t?.name});return r.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),r}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Nr),{type:"module",name:t?.name})}}function Ys(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const r=t.slice(3,e+0).trim(),s=t.slice(e+4).trimStart(),n={};return r.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(n[a[1].trim()]=a[2].trim())}),{content:s,data:n}}}return{content:t,data:{}}}const Dr=nr(()=>new Ks,"markdown"),Hr=typeof DOMParser<"u"?new DOMParser:null;function Cn(){return Dr.get()}function Vs(t){return Dr.send(t,1e3)}const Ze=[];function _n(t){if(t&&typeof t=="object"){Ze.push(t);try{ne.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function Js(t){Ze.length=0,Array.isArray(t)&&Ze.push(...t.filter(e=>e&&typeof e=="object"));try{Ze.forEach(e=>ne.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function Qt(t){if(Cn&&Cn())try{const i=await Vs({type:"render",md:t});if(i&&i.html!==void 0)try{const u=(Hr||new DOMParser).parseFromString(i.html,"text/html"),o=u.querySelectorAll("h1,h2,h3,h4,h5,h6");o.forEach(h=>{h.id||(h.id=re(h.textContent||""))});try{u.querySelectorAll("img").forEach(f=>{try{f.getAttribute("loading")||f.setAttribute("data-want-lazy","1")}catch(p){console.warn("[markdown] set image loading attribute failed",p)}})}catch(h){console.warn("[markdown] query images failed",h)}try{u.querySelectorAll("pre code").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(k){console.warn("[markdown] set code class failed",k),f.className=d}else try{f.removeAttribute&&f.removeAttribute("class")}catch(k){console.warn("[markdown] remove code class failed",k),f.className=""}const m=d,w=m.match(/language-([a-zA-Z0-9_+-]+)/)||m.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!w||!w[1])try{const k=f.textContent||"";try{if(ae&&typeof ae.getLanguage=="function"&&ae.getLanguage("plaintext")){const y=ae.highlight(k,{language:"plaintext"});y&&y.value&&(f.innerHTML=y.value)}}catch{try{ae.highlightElement(f)}catch(I){console.warn("[markdown] hljs.highlightElement failed",I)}}}catch(k){console.warn("[markdown] code auto-detect failed",k)}}catch(p){console.warn("[markdown] processing code blocks failed",p)}})}catch(h){console.warn("[markdown] query code blocks failed",h)}const l=u.body.innerHTML,c=[];return o.forEach(h=>{c.push({level:Number(h.tagName.substring(1)),text:(h.textContent||"").trim(),id:h.id})}),{html:l,meta:i.meta||{},toc:c}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:r,data:s}=Ys(t||"");if(ne.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Ze&&Ze.length)try{Ze.forEach(i=>ne.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let n=ne.parse(r);try{const a=(Hr||new DOMParser).parseFromString(n,"text/html"),u=a.querySelectorAll("h1,h2,h3,h4,h5,h6");u.forEach(l=>{l.id||(l.id=re(l.textContent||""))});try{a.querySelectorAll("img").forEach(c=>{try{c.getAttribute("loading")||c.setAttribute("data-want-lazy","1")}catch(h){console.warn("[markdown] set image loading attribute failed",h)}})}catch(l){console.warn("[markdown] query images failed",l)}try{a.querySelectorAll("pre code").forEach(c=>{try{const h=c.getAttribute&&c.getAttribute("class")||c.className||"",f=String(h||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{c.setAttribute&&c.setAttribute("class",f)}catch(m){console.warn("[markdown] set code class failed",m),c.className=f}else try{c.removeAttribute&&c.removeAttribute("class")}catch(m){console.warn("[markdown] remove code class failed",m),c.className=""}const p=f,d=p.match(/language-([a-zA-Z0-9_+-]+)/)||p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!d||!d[1])try{const m=c.textContent||"";try{if(ae&&typeof ae.getLanguage=="function"&&ae.getLanguage("plaintext")){const w=ae.highlight(m,{language:"plaintext"});w&&w.value&&(c.innerHTML=w.value)}}catch{try{ae.highlightElement(c)}catch(k){console.warn("[markdown] hljs.highlightElement failed",k)}}}catch(m){console.warn("[markdown] code auto-detect failed",m)}}catch(h){console.warn("[markdown] processing code blocks failed",h)}})}catch(l){console.warn("[markdown] query code blocks failed",l)}n=a.body.innerHTML;const o=[];return u.forEach(l=>{o.push({level:Number(l.tagName.substring(1)),text:(l.textContent||"").trim(),id:l.id})}),{html:a.body.innerHTML,meta:s||{},toc:o}}catch(i){console.warn("post-process markdown failed",i)}return{html:n,meta:s||{},toc:[]}}function Mn(t,e){const r=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,n=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(t);)if(a[1]){const u=a[1].toLowerCase();if(an.has(u)||e&&e.size&&u.length<3&&!e.has(u)&&!(Te&&Te[u]&&e.has(Te[u])))continue;if(e&&e.size){if(e.has(u)){const l=e.get(u);l&&r.add(l);continue}if(Te&&Te[u]){const l=Te[u];if(e.has(l)){const c=e.get(l)||l;r.add(c);continue}}}(i.has(u)||u.length>=5&&u.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(u)&&!n.has(u))&&r.add(u)}return r}const ea=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:_n,detectFenceLanguages:Mn,initRendererWorker:Cn,markdownPlugins:Ze,parseMarkdownToHtml:Qt,setMarkdownExtensions:Js},Symbol.toStringTag,{value:"Module"}));function ta(t,e){try{return new URL(t,e).pathname}catch{try{return new URL(t,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(e||"").replace(/\/$/,"")+"/"+String(t||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(t||"")}}}}function na(t,e){const r=document.createElement("aside");r.className="menu nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=t("navigation"),r.appendChild(s);const n=document.createElement("ul");return n.className="menu-list",e.forEach(i=>{const a=document.createElement("li"),u=document.createElement("a");if(u.href="#"+i.path,u.textContent=i.name,a.appendChild(u),i.children&&i.children.length){const o=document.createElement("ul");i.children.forEach(l=>{const c=document.createElement("li"),h=document.createElement("a");h.href="#"+l.path,h.textContent=l.name,c.appendChild(h),o.appendChild(c)}),a.appendChild(o)}n.appendChild(a)}),r.appendChild(n),r}function ra(t,e,r=""){const s=document.createElement("aside");s.className="menu nimbi-toc-inner";const n=document.createElement("p");n.className="menu-label",n.textContent=t("onThisPage"),s.appendChild(n);const i=document.createElement("ul");return i.className="menu-list",(e||[]).forEach(a=>{try{if(!a||a.level===1)return;const u=document.createElement("li"),o=document.createElement("a"),l=a.id||re(a.text||"");o.textContent=a.text||"";try{const c=String(r||"").replace(/^[\.\/]+/,""),h=c&&H&&H.has&&H.has(c)?H.get(c):c;h?o.href=`?page=${encodeURIComponent(h)}#${encodeURIComponent(l)}`:o.href=`#${encodeURIComponent(l)}`}catch(c){console.warn("[htmlBuilder] buildTocElement href normalization failed",c),o.href=`#${encodeURIComponent(l)}`}u.appendChild(o),i.appendChild(u)}catch(u){console.warn("[htmlBuilder] buildTocElement item failed",u,a)}}),s.appendChild(i),s}function Ur(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(r=>{r.id||(r.id=re(r.textContent||""))})}function ia(t,e,r){try{const s=t.querySelectorAll("img");if(s&&s.length){const n=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const u=new URL(n+a,r).toString();i.src=u;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] set image loading attribute failed",o)}}catch(u){console.warn("[htmlBuilder] resolve image src failed",u)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function qr(t,e,r){try{const s=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";let n=null;try{const a=new URL(r,location.href);n=new URL(s||".",a).toString()}catch{try{n=new URL(s||".",location.href).toString()}catch{n=s||"./"}}const i=t.querySelectorAll("*");for(const a of Array.from(i||[]))try{const u=a.tagName?a.tagName.toLowerCase():"",o=l=>{try{const c=a.getAttribute(l)||"";if(!c||/^(https?:)?\/\//i.test(c)||c.startsWith("/")||c.startsWith("#"))return;try{a.setAttribute(l,new URL(c,n).toString())}catch(h){console.warn("[htmlBuilder] rewrite asset attribute failed",l,c,h)}}catch(c){console.warn("[htmlBuilder] rewriteAttr failed",c)}};if(a.hasAttribute&&a.hasAttribute("src")&&o("src"),a.hasAttribute&&a.hasAttribute("href")&&u!=="a"&&o("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&o("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&o("poster"),a.hasAttribute("srcset")){const h=(a.getAttribute("srcset")||"").split(",").map(f=>f.trim()).filter(Boolean).map(f=>{const[p,d]=f.split(/\s+/,2);if(!p||/^(https?:)?\/\//i.test(p)||p.startsWith("/"))return f;try{const m=new URL(p,n).toString();return d?`${m} ${d}`:m}catch{return f}}).join(", ");a.setAttribute("srcset",h)}}catch(u){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",u)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let jr="",Pn=null,Fr="";async function Wr(t,e,r){try{const s=t.querySelectorAll("a");if(!s||!s.length)return;let n,i;if(e===jr&&Pn)n=Pn,i=Fr;else{try{n=new URL(e,location.href),i=pt(n.pathname)}catch{try{n=new URL(e,location.href),i=pt(n.pathname)}catch{n=null,i="/"}}jr=e,Pn=n,Fr=i}const a=new Set,u=[],o=new Set,l=[];for(const c of Array.from(s))try{const h=c.getAttribute("href")||"";if(!h||ar(h))continue;try{if(h.startsWith("?")||h.indexOf("?")!==-1)try{const p=new URL(h,e||location.href),d=p.searchParams.get("page");if(d&&d.indexOf("/")===-1&&r){const m=r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"";if(m){const w=de(m+d);c.setAttribute("href","?page="+encodeURIComponent(w)+(p.hash||""));continue}}}catch{}}catch{}if(h.startsWith("/")&&!h.endsWith(".md"))continue;const f=h.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(f){let p=f[1];const d=f[2];!p.startsWith("/")&&r&&(p=(r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"")+p);try{const m=new URL(p,e).pathname;let w=m.startsWith(i)?m.slice(i.length):m;w=de(w),u.push({node:c,mdPathRaw:p,frag:d,rel:w}),H.has(w)||a.add(w)}catch(m){console.warn("[htmlBuilder] resolve mdPath failed",m)}continue}try{let p=h;!h.startsWith("/")&&r&&(h.startsWith("#")?p=r+h:p=(r.includes("/")?r.substring(0,r.lastIndexOf("/")+1):"")+h);const m=new URL(p,e).pathname||"";if(m&&m.indexOf(i)!==-1){let w=m.startsWith(i)?m.slice(i.length):m;if(w=de(w),w=dt(w),w||(w="_home"),!w.endsWith(".md")){let k=null;try{if(H&&H.has&&H.has(w))k=H.get(w);else try{const y=String(w||"").replace(/^.*\//,"");y&&H.has&&H.has(y)&&(k=H.get(y))}catch(y){console.warn("[htmlBuilder] mdToSlug baseName check failed",y)}}catch(y){console.warn("[htmlBuilder] mdToSlug access check failed",y)}if(!k)try{const y=String(w||"").replace(/^.*\//,"");for(const[I,P]of K||[])if(P===w||P===y){k=I;break}}catch{}k?c.setAttribute("href",`?page=${encodeURIComponent(k)}`):(o.add(w),l.push({node:c,rel:w}))}}}catch(p){console.warn("[htmlBuilder] resolving href to URL failed",p)}}catch(h){console.warn("[htmlBuilder] processing anchor failed",h)}a.size&&await Promise.all(Array.from(a).map(async c=>{try{try{const f=String(c).match(/([^\/]+)\.md$/),p=f&&f[1];if(p&&K.has(p)){try{const d=K.get(p);if(d)try{H.set(d,p)}catch(m){console.warn("[htmlBuilder] mdToSlug.set failed",m)}}catch(d){console.warn("[htmlBuilder] reading slugToMd failed",d)}return}}catch(f){console.warn("[htmlBuilder] basename slug lookup failed",f)}const h=await ke(c,e);if(h&&h.raw){const f=(h.raw||"").match(/^#\s+(.+)$/m);if(f&&f[1]){const p=re(f[1].trim());if(p)try{K.set(p,c),H.set(c,p)}catch(d){console.warn("[htmlBuilder] setting slug mapping failed",d)}}}}catch(h){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",h)}})),o.size&&await Promise.all(Array.from(o).map(async c=>{try{const h=await ke(c,e);if(h&&h.raw)try{const p=($n||new DOMParser).parseFromString(h.raw,"text/html"),d=p.querySelector("title"),m=p.querySelector("h1"),w=d&&d.textContent&&d.textContent.trim()?d.textContent.trim():m&&m.textContent?m.textContent.trim():null;if(w){const k=re(w);if(k)try{K.set(k,c),H.set(c,k)}catch(y){console.warn("[htmlBuilder] setting html slug mapping failed",y)}}}catch(f){console.warn("[htmlBuilder] parse fetched HTML failed",f)}}catch(h){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",h)}}));for(const c of u){const{node:h,frag:f,rel:p}=c;let d=null;try{H.has(p)&&(d=H.get(p))}catch(m){console.warn("[htmlBuilder] mdToSlug access failed",m)}d?f?h.setAttribute("href",`?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(d)}`):f?h.setAttribute("href",`?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(p)}`)}for(const c of l){const{node:h,rel:f}=c;let p=null;try{H.has(f)&&(p=H.get(f))}catch(d){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",d)}if(!p)try{const d=String(f||"").replace(/^.*\//,"");H.has(d)&&(p=H.get(d))}catch(d){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",d)}p?h.setAttribute("href",`?page=${encodeURIComponent(p)}`):h.setAttribute("href",`?page=${encodeURIComponent(f)}`)}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function sa(t,e,r,s){const n=e.querySelector("h1"),i=n?(n.textContent||"").trim():"";let a="";try{i&&(a=re(i)),!a&&t&&t.meta&&t.meta.title&&(a=re(t.meta.title)),!a&&r&&(a=re(String(r))),a||(a="_home");try{r&&(K.set(a,r),H.set(r,a))}catch(u){console.warn("[htmlBuilder] computeSlug set slug mapping failed",u)}try{let u="?page="+encodeURIComponent(a);try{const o=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");o&&(u+="#"+encodeURIComponent(o))}catch(o){console.warn("[htmlBuilder] computeSlug hash decode failed",o)}try{history.replaceState({page:a},"",u)}catch(o){console.warn("[htmlBuilder] computeSlug history replace failed",o)}}catch(u){console.warn("[htmlBuilder] computeSlug inner failed",u)}}catch(u){console.warn("[htmlBuilder] computeSlug failed",u)}return{topH1:n,h1Text:i,slugKey:a}}async function aa(t,e){if(!t||!t.length)return;const r=new Set;for(const o of Array.from(t||[]))try{const l=o.getAttribute("href")||"";if(!l)continue;let f=de(l).split(/::|#/,2)[0];try{const d=f.indexOf("?");d!==-1&&(f=f.slice(0,d))}catch{}if(!f||(f.includes(".")||(f=f+".html"),!/\.html(?:$|[?#])/.test(f)&&!f.toLowerCase().endsWith(".html")))continue;const p=f;try{if(H&&H.has&&H.has(p))continue}catch(d){console.warn("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const m of K.values())if(m===p){d=!0;break}if(d)continue}catch(d){console.warn("[htmlBuilder] slugToMd iteration failed",d)}r.add(p)}catch(l){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",l)}if(!r.size)return;const s=async o=>{try{const l=await ke(o,e);if(l&&l.raw)try{const h=($n||new DOMParser).parseFromString(l.raw,"text/html"),f=h.querySelector("title"),p=h.querySelector("h1"),d=f&&f.textContent&&f.textContent.trim()?f.textContent.trim():p&&p.textContent?p.textContent.trim():null;if(d){const m=re(d);if(m)try{K.set(m,o),H.set(o,m)}catch(w){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",w)}}}catch(c){console.warn("[htmlBuilder] parse HTML title failed",c)}}catch(l){console.warn("[htmlBuilder] fetchAndExtract failed",l)}},n=5,i=Array.from(r);let a=0;const u=[];for(;a<i.length;){const o=i.slice(a,a+n);u.push(Promise.all(o.map(s))),a+=n}await Promise.all(u)}async function oa(t,e){if(!t||!t.length)return;const r=[],s=new Set;let n="";try{const i=new URL(e,typeof location<"u"?location.href:"http://localhost/");n=pt(i.pathname)}catch(i){n="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(t||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const u=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(u){let o=de(u[1]);try{let l;try{l=ta(o,e)}catch(h){l=o,console.warn("[htmlBuilder] resolve mdPath URL failed",h)}const c=l&&n&&l.startsWith(n)?l.slice(n.length):String(l||"").replace(/^\//,"");r.push({rel:c}),H.has(c)||s.add(c)}catch(l){console.warn("[htmlBuilder] rewriteAnchors failed",l)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),u=a&&a[1];if(u&&K.has(u)){try{const o=K.get(u);o&&H.set(o,u)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await ke(i,e);if(a&&a.raw){const u=(a.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]){const o=re(u[1].trim());if(o)try{K.set(o,i),H.set(i,o)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",l)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const $n=typeof DOMParser<"u"?new DOMParser:null;function In(t){try{const r=($n||new DOMParser).parseFromString(t||"","text/html");Ur(r);try{r.querySelectorAll("img").forEach(u=>{try{u.getAttribute("loading")||u.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",o)}})}catch(a){console.warn("[htmlBuilder] parseHtml query images failed",a)}r.querySelectorAll("pre code, code[class]").forEach(a=>{try{const u=a.getAttribute&&a.getAttribute("class")||a.className||"",o=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const l=(o[1]||"").toLowerCase(),c=Y.size&&(Y.get(l)||Y.get(String(l).toLowerCase()))||l;try{(async()=>{try{await nt(c)}catch(h){console.warn("[htmlBuilder] registerLanguage failed",h)}})()}catch(h){console.warn("[htmlBuilder] schedule registerLanguage failed",h)}}else try{if(ae&&typeof ae.getLanguage=="function"&&ae.getLanguage("plaintext")){const l=ae.highlight?ae.highlight(a.textContent||"",{language:"plaintext"}):null;l&&l.value&&(a.innerHTML=l.value)}}catch(l){console.warn("[htmlBuilder] plaintext highlight fallback failed",l)}}catch(u){console.warn("[htmlBuilder] code element processing failed",u)}});const n=[];return r.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(a=>{n.push({level:Number(a.tagName.substring(1)),text:(a.textContent||"").trim(),id:a.id})}),{html:r.body.innerHTML,meta:{},toc:n}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function la(t){const e=Mn?Mn(t||"",Y):new Set,r=new Set(e),s=[];for(const n of r)try{const i=Y.size&&(Y.get(n)||Y.get(String(n).toLowerCase()))||n;try{s.push(nt(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(n)!==String(i))try{s.push(nt(n))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(n){console.warn("[htmlBuilder] ensureLanguages failed",n)}}async function ca(t){if(await la(t),Qt){const e=await Qt(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function ua(t,e,r,s,n){let i=null;if(e.isHtml)try{const h=typeof DOMParser<"u"?new DOMParser:null;if(h){const f=h.parseFromString(e.raw||"","text/html");try{qr(f.body,r,n)}catch(p){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",p)}i=In(f.documentElement&&f.documentElement.outerHTML?f.documentElement.outerHTML:e.raw||"")}else i=In(e.raw||"")}catch{i=In(e.raw||"")}else i=await ca(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{qr(a,r,n)}catch(h){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",h)}try{Ur(a)}catch(h){console.warn("[htmlBuilder] addHeadingIds failed",h)}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(m){f.className=d,console.warn("[htmlBuilder] set element class failed",m)}else try{f.removeAttribute&&f.removeAttribute("class")}catch(m){f.className="",console.warn("[htmlBuilder] remove element class failed",m)}}catch(p){console.warn("[htmlBuilder] code element cleanup failed",p)}})}catch(h){console.warn("[htmlBuilder] processing code elements failed",h)}try{Yn(a)}catch(h){console.warn("[htmlBuilder] observeCodeBlocks failed",h)}ia(a,r,n);const{topH1:u,h1Text:o,slugKey:l}=sa(i,a,r,s);try{await ha(a,n,r)}catch(h){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",h),await Wr(a,n,r)}const c=ra(t,i.toc,r);return{article:a,parsed:i,toc:c,topH1:u,h1Text:o,slugKey:l}}function Zr(t,e,r){t&&(t.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const n=document.createElement("h1");n.textContent=e&&e("notFound")||"Page not found";const i=document.createElement("p");i.textContent=r&&r.message?String(r.message):"Failed to resolve the requested page.",s.appendChild(n),s.appendChild(i),t&&t.appendChild&&t.appendChild(s)}async function ha(t,e,r){return Wr(t,e,r)}function da(t){try{t.addEventListener("click",e=>{const r=e.target&&e.target.closest?e.target.closest("a"):null;if(!r)return;const s=r.getAttribute("href")||"";try{const n=new URL(s,location.href),i=n.searchParams.get("page"),a=n.hash?n.hash.replace(/^#/,""):null;if(!i&&!a)return;e.preventDefault();let u=null;try{history&&history.state&&history.state.page&&(u=history.state.page)}catch(o){u=null,console.warn("[htmlBuilder] access history.state failed",o)}try{u||(u=new URL(location.href).searchParams.get("page"))}catch(o){console.warn("[htmlBuilder] parse current location failed",o)}if(!i&&a||i&&u&&String(i)===String(u)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:u||i},"","?page="+encodeURIComponent(u||i)+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}}catch(o){console.warn("[htmlBuilder] update history for anchor failed",o)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(o){console.warn("[htmlBuilder] stopPropagation failed",o)}try{Bn(a)}catch(o){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:i},"","?page="+encodeURIComponent(i)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){console.warn("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.warn("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){console.warn("[htmlBuilder] renderByQuery failed",o)}}catch(o){console.warn("[htmlBuilder] SPA navigation invocation failed",o)}}catch(n){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",n)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function Bn(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const r=document.getElementById(t);if(r)try{const s=()=>{try{if(e&&e.scrollTo&&e.contains(r)){const n=r.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:n,behavior:"smooth"})}else try{r.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{r.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{r.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(n){console.warn("[htmlBuilder] scheduling scroll failed",n),setTimeout(s,50)}}catch(s){try{r.scrollIntoView()}catch(n){console.warn("[htmlBuilder] final scroll fallback failed",n)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(r){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",r)}}function pa(t,e,{mountOverlay:r=null,container:s=null,mountEl:n=null,navWrap:i=null,t:a=null}={}){try{const u=a||(m=>typeof m=="string"?m:""),o=s||document.querySelector(".nimbi-cms"),l=n||document.querySelector(".nimbi-mount"),c=r||document.querySelector(".nimbi-overlay"),h=i||document.querySelector(".nimbi-nav-wrap");let p=document.querySelector(".nimbi-scroll-top");if(!p){p=document.createElement("button"),p.className="nimbi-scroll-top button is-primary is-rounded is-small",p.setAttribute("aria-label",u("scrollToTop")),p.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{c&&c.appendChild?c.appendChild(p):o&&o.appendChild?o.appendChild(p):l&&l.appendChild?l.appendChild(p):document.body.appendChild(p)}catch{try{document.body.appendChild(p)}catch(w){console.warn("[htmlBuilder] append scroll top button failed",w)}}try{try{er(p)}catch{}}catch(m){console.warn("[htmlBuilder] set scroll-top button theme registration failed",m)}p.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):n&&n.scrollTo?n.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback container scrollTop failed",w)}try{n&&(n.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",w)}try{document.documentElement.scrollTop=0}catch(w){console.warn("[htmlBuilder] fallback document scrollTop failed",w)}}})}const d=h&&h.querySelector?h.querySelector(".menu-label"):null;if(e){if(!p._nimbiObserver){const m=new IntersectionObserver(w=>{for(const k of w)k.target instanceof Element&&(k.isIntersecting?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show")))},{root:s instanceof Element?s:n instanceof Element?n:null,threshold:0});p._nimbiObserver=m}try{p._nimbiObserver.disconnect()}catch(m){console.warn("[htmlBuilder] observer disconnect failed",m)}try{p._nimbiObserver.observe(e)}catch(m){console.warn("[htmlBuilder] observer observe failed",m)}try{const m=()=>{try{const w=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},k=e.getBoundingClientRect();!(k.bottom<w.top||k.top>w.bottom)?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show"))}catch(w){console.warn("[htmlBuilder] checkIntersect failed",w)}};m(),"IntersectionObserver"in window||setTimeout(m,100)}catch(m){console.warn("[htmlBuilder] checkIntersect outer failed",m)}}else{p.classList.remove("show"),d&&d.classList.remove("show");const m=s instanceof Element?s:n instanceof Element?n:window,w=()=>{try{(m===window?window.scrollY:m.scrollTop||0)>10?(p.classList.add("show"),d&&d.classList.add("show")):(p.classList.remove("show"),d&&d.classList.remove("show"))}catch(k){console.warn("[htmlBuilder] onScroll handler failed",k)}};It(()=>m.addEventListener("scroll",w)),w()}}catch(u){console.warn("[htmlBuilder] ensureScrollTopButton failed",u)}}async function fa(t,e,r,s,n,i,a,u,o="eager",l=1,c=void 0){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const h=typeof DOMParser<"u"?new DOMParser:null,f=h?h.parseFromString(r||"","text/html"):null,p=f?f.querySelectorAll("a"):[];await It(()=>aa(p,s)),await It(()=>oa(p,s));let d=null,m=null,w=!1;const k=document.createElement("nav");k.className="navbar",k.setAttribute("role","navigation"),k.setAttribute("aria-label","main navigation");const y=document.createElement("div");y.className="navbar-brand";const I=p[0],P=document.createElement("a");if(P.className="navbar-item",I){const C=I.getAttribute("href")||"#";try{const T=new URL(C,location.href).searchParams.get("page");T?P.href="?page="+encodeURIComponent(decodeURIComponent(T)):(P.href="?page="+encodeURIComponent(n),P.textContent=i("home"))}catch{P.href="?page="+encodeURIComponent(n),P.textContent=i("home")}}else P.href="?page="+encodeURIComponent(n),P.textContent=i("home");y.appendChild(P),P.addEventListener("click",function(C){const M=P.getAttribute("href")||"";if(M.startsWith("?page=")){C.preventDefault();const T=new URL(M,location.href),v=T.searchParams.get("page"),b=T.hash?T.hash.replace(/^#/,""):null;history.pushState({page:v},"","?page="+encodeURIComponent(v)+(b?"#"+encodeURIComponent(b):""));try{a()}catch(R){console.warn("[nimbi-cms] renderByQuery failed",R)}}});const A=document.createElement("a");A.className="navbar-burger",A.setAttribute("role","button"),A.setAttribute("aria-label","menu"),A.setAttribute("aria-expanded","false");const q="nimbi-navbar-menu";A.dataset.target=q,A.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',y.appendChild(A);try{A.addEventListener("click",C=>{try{const M=A.dataset&&A.dataset.target?A.dataset.target:null,T=M?document.getElementById(M):null;A.classList.contains("is-active")?(A.classList.remove("is-active"),A.setAttribute("aria-expanded","false"),T&&T.classList.remove("is-active")):(A.classList.add("is-active"),A.setAttribute("aria-expanded","true"),T&&T.classList.add("is-active"))}catch(M){console.warn("[nimbi-cms] navbar burger toggle failed",M)}})}catch(C){console.warn("[nimbi-cms] burger event binding failed",C)}const j=document.createElement("div");j.className="navbar-menu",j.id=q;const G=document.createElement("div");G.className="navbar-start";let V,ie,O;if(!u)V=null,m=null,O=null;else{V=document.createElement("div"),V.className="navbar-end",ie=document.createElement("div"),ie.className="navbar-item",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=i("searchPlaceholder")||"",m.id="nimbi-search",o==="eager"&&(m.disabled=!0,m.classList.add("is-loading")),ie.appendChild(m),O=document.createElement("div"),O.id="nimbi-search-results",O.className="box",ie.appendChild(O),V.appendChild(ie);const C=T=>{if(O.innerHTML="",!T.length){O.classList.remove("is-open");return}T.forEach(v=>{const b=document.createElement("div");if(b.className="nimbi-search-result",v.parentTitle){const B=document.createElement("div");B.textContent=v.parentTitle,B.className="nimbi-search-title nimbi-search-parent",b.appendChild(B)}const R=document.createElement("a");R.className="block",R.href="?page="+encodeURIComponent(v.slug),R.textContent=v.title,R.addEventListener("click",()=>{O.style.display="none"}),b.appendChild(R),O.appendChild(b)}),O.classList.add("is-open")},M=(T,v)=>{let b=null;return(...R)=>{b&&clearTimeout(b),b=setTimeout(()=>T(...R),v)}};if(m){const T=M(async()=>{const v=document.querySelector("input#nimbi-search"),b=String(v&&v.value||"").trim().toLowerCase();if(!b){C([]);return}try{const R=await Promise.resolve().then(()=>Ut);d||(d=(async()=>{try{return o==="lazy"&&R.buildSearchIndexWorker?R.buildSearchIndexWorker(s,l,c):R.buildSearchIndex(s,l,c)}catch(Q){return console.warn("[nimbi-cms] buildSearchIndex failed",Q),[]}finally{v&&(v.removeAttribute("disabled"),v.classList.remove("is-loading"))}})());const S=(await d).filter(Q=>Q.title&&Q.title.toLowerCase().includes(b)||Q.excerpt&&Q.excerpt.toLowerCase().includes(b));C(S.slice(0,10))}catch(R){console.warn("[nimbi-cms] search input handler failed",R),C([])}},50);m&&m.addEventListener("input",T),document.addEventListener("click",v=>{const b=document.querySelector("input#nimbi-search");b&&!b.contains(v.target)&&O&&!O.contains(v.target)&&O.classList.remove("is-open")})}if(o==="eager"){try{d=(async()=>{try{const v=await(await Promise.resolve().then(()=>Ut)).buildSearchIndex(s,l,c);return w||(w=!0),v}catch(T){return console.warn("[nimbi-cms] buildSearchIndex failed",T),[]}})()}catch(T){console.warn("[nimbi-cms] eager search index init failed",T),d=Promise.resolve([])}d.finally(()=>{const T=document.querySelector("input#nimbi-search");T&&(T.removeAttribute("disabled"),T.classList.remove("is-loading"))})}}for(let C=0;C<p.length;C++){const M=p[C];if(C===0)continue;const T=M.getAttribute("href")||"#",v=document.createElement("a");v.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(T)||T.endsWith(".md")){const R=de(T).split(/::|#/,2),B=R[0],S=R[1];v.href="?page="+encodeURIComponent(B)+(S?"#"+encodeURIComponent(S):"")}else if(/\.html(?:$|[#?])/.test(T)||T.endsWith(".html")){const R=de(T).split(/::|#/,2);let B=R[0];B&&!B.toLowerCase().endsWith(".html")&&(B=B+".html");const S=R[1];try{const Q=await ke(B,s);if(Q&&Q.raw)try{const Ae=new DOMParser().parseFromString(Q.raw,"text/html"),ye=Ae.querySelector("title"),te=Ae.querySelector("h1"),ue=ye&&ye.textContent&&ye.textContent.trim()?ye.textContent.trim():te&&te.textContent?te.textContent.trim():null;if(ue){const ge=re(ue);if(ge){try{K.set(ge,B),H.set(B,ge)}catch(Je){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Je)}v.href="?page="+encodeURIComponent(ge)+(S?"#"+encodeURIComponent(S):"")}else v.href="?page="+encodeURIComponent(B)+(S?"#"+encodeURIComponent(S):"")}else v.href="?page="+encodeURIComponent(B)+(S?"#"+encodeURIComponent(S):"")}catch{v.href="?page="+encodeURIComponent(B)+(S?"#"+encodeURIComponent(S):"")}else v.href=T}catch{v.href=T}}else v.href=T}catch(b){console.warn("[nimbi-cms] nav item href parse failed",b),v.href=T}try{const b=M.textContent&&String(M.textContent).trim()?String(M.textContent).trim():null;if(b)try{const R=re(b);if(R){const B=v.getAttribute&&v.getAttribute("href")?v.getAttribute("href"):"";try{const Q=new URL(B,location.href).searchParams.get("page");if(Q){const he=decodeURIComponent(Q);try{K.set(R,he),H.set(he,R)}catch(Ae){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Ae)}}}catch(S){console.warn("[nimbi-cms] nav slug mapping failed",S)}}}catch(R){console.warn("[nimbi-cms] nav slug mapping failed",R)}}catch(b){console.warn("[nimbi-cms] nav slug mapping failed",b)}v.textContent=M.textContent||T,G.appendChild(v)}try{m=document.getElementById("nimbi-search");const C=document.getElementById("nimbi-search-results"),M=v=>{if(C.innerHTML="",!v.length){C.classList.remove("is-open");return}v.forEach(b=>{const R=document.createElement("div");if(R.className="nimbi-search-result",b.parentTitle){const S=document.createElement("div");S.textContent=b.parentTitle,S.className="nimbi-search-title nimbi-search-parent",R.appendChild(S)}const B=document.createElement("a");B.className="block",B.href="?page="+encodeURIComponent(b.slug),B.textContent=b.title,B.addEventListener("click",()=>{C.style.display="none"}),R.appendChild(B),C.appendChild(R)}),C.classList.add("is-open")},T=(v,b)=>{let R=null;return(...B)=>{R&&clearTimeout(R),R=setTimeout(()=>v(...B),b)}};if(m){const v=T(async()=>{const b=String(m.value||"").trim().toLowerCase();if(!b){M([]);return}try{const R=await Promise.resolve().then(()=>Ut);d||(d=(async()=>{try{return o==="lazy"&&R.buildSearchIndexWorker?R.buildSearchIndexWorker(s,l,c):R.buildSearchIndex(s,l,c)}catch(Q){return console.warn("[nimbi-cms] buildSearchIndex failed",Q),[]}finally{m&&(m.disabled=!1,m.classList.remove("is-loading"))}})());const S=(await d).filter(Q=>Q.title&&Q.title.toLowerCase().includes(b)||Q.excerpt&&Q.excerpt.toLowerCase().includes(b));M(S.slice(0,10))}catch(R){console.warn("[nimbi-cms] search input handler failed",R),M([])}},50);m.addEventListener("input",v),document.addEventListener("click",b=>{m&&!m.contains(b.target)&&C&&!C.contains(b.target)&&(C.style.display="none")})}}catch(C){console.warn("[nimbi-cms] navbar/search setup inner failed",C)}j.appendChild(G),V&&j.appendChild(V),k.appendChild(y),k.appendChild(j),t.appendChild(k);try{j.addEventListener("click",C=>{const M=C.target&&C.target.closest?C.target.closest("a"):null;if(!M)return;const T=M.getAttribute("href")||"";try{const v=new URL(T,location.href),b=v.searchParams.get("page"),R=v.hash?v.hash.replace(/^#/,""):null;if(b){C.preventDefault(),history.pushState({page:b},"","?page="+encodeURIComponent(b)+(R?"#"+encodeURIComponent(R):""));try{a()}catch(B){console.warn("[nimbi-cms] renderByQuery failed",B)}}}catch(v){console.warn("[nimbi-cms] navbar click handler failed",v)}try{const v=k&&k.querySelector?k.querySelector(".navbar-burger"):null,b=v&&v.dataset?v.dataset.target:null,R=b?document.getElementById(b):null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),R&&R.classList.remove("is-active"))}catch(v){console.warn("[nimbi-cms] mobile menu close failed",v)}})}catch(C){console.warn("[nimbi-cms] attach content click handler failed",C)}try{e.addEventListener("click",C=>{const M=C.target&&C.target.closest?C.target.closest("a"):null;if(!M)return;const T=M.getAttribute("href")||"";if(T&&!ar(T))try{const v=new URL(T,location.href),b=v.searchParams.get("page"),R=v.hash?v.hash.replace(/^#/,""):null;if(b){C.preventDefault(),history.pushState({page:b},"","?page="+encodeURIComponent(b)+(R?"#"+encodeURIComponent(R):""));try{a()}catch(B){console.warn("[nimbi-cms] renderByQuery failed",B)}}}catch(v){console.warn("[nimbi-cms] container click URL parse failed",v)}})}catch(C){console.warn("[nimbi-cms] build navbar failed",C)}return{navbar:k,linkEls:p}}var zn,Gr;function ga(){if(Gr)return zn;Gr=1;function t(i,a){return a.some(([u,o])=>u<=i&&i<=o)}function e(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function r(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function n(i,a={}){let u=0,o=0,l=i.length-1;const c=a.wordsPerMinute||200,h=a.wordBound||r;for(;h(i[o]);)o++;for(;h(i[l]);)l--;const f=`${i}
`;for(let w=o;w<=l;w++)if((e(f[w])||!h(f[w])&&(h(f[w+1])||e(f[w+1])))&&u++,e(f[w]))for(;w<=l&&(s(f[w+1])||h(f[w+1]));)w++;const p=u/c,d=Math.round(p*60*1e3);return{text:Math.ceil(p.toFixed(2))+" min read",minutes:p,time:d,words:u}}return zn=n,zn}var ma=ga();const wa=Xn(ma);function Qr(t,e){let r=document.querySelector(`meta[name="${t}"]`);r||(r=document.createElement("meta"),r.setAttribute("name",t),document.head.appendChild(r)),r.setAttribute("content",e)}function ot(t,e,r){let s=`meta[${t}="${e}"]`,n=document.querySelector(s);n||(n=document.createElement("meta"),n.setAttribute(t,e),document.head.appendChild(n)),n.setAttribute("content",r)}function ba(t,e){try{let r=document.querySelector(`link[rel="${t}"]`);r||(r=document.createElement("link"),r.setAttribute("rel",t),document.head.appendChild(r)),r.setAttribute("href",e)}catch(r){console.warn("[seoManager] upsertLinkRel failed",r)}}function ka(t,e,r,s){const n=e&&String(e).trim()?e:t.title||document.title;ot("property","og:title",n);const i=s&&String(s).trim()?s:t.description||"";i&&String(i).trim()&&ot("property","og:description",i),ot("name","twitter:card",t.twitter_card||"summary_large_image");const a=r||t.image;a&&(ot("property","og:image",a),ot("name","twitter:image",a))}function ya(t,e,r,s,n=""){const i=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";u&&String(u).trim()&&Qr("description",u),Qr("robots",i.robots||"index,follow"),ka(i,e,r,u)}function xa(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const r=document.querySelector(e);if(r){const s=r.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function Sa(t,e,r,s,n,i=""){try{const a=t.meta||{},u=r&&String(r).trim()?r:a.title||i||document.title,o=n&&String(n).trim()?n:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",l=s||a.image||null;let c="";try{if(e){const d=de(e);try{c=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(d)}catch{c=location.href.split("#")[0]}}else c=location.href.split("#")[0]}catch(d){c=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",d)}c&&ba("canonical",c);try{ot("property","og:url",c)}catch(d){console.warn("[seoManager] upsertMeta og:url failed",d)}const h={"@context":"https://schema.org","@type":"Article",headline:u||"",description:o||"",url:c||location.href.split("#")[0]};l&&(h.image=String(l)),a.date&&(h.datePublished=a.date),a.dateModified&&(h.dateModified=a.dateModified);const f="nimbi-jsonld";let p=document.getElementById(f);p||(p=document.createElement("script"),p.type="application/ld+json",p.id=f,document.head.appendChild(p)),p.textContent=JSON.stringify(h,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function va(t,e,r,s,n,i,a,u,o,l,c){try{const h=s.querySelector(".menu-label");h&&(h.textContent=u&&u.textContent||t("onThisPage"))}catch(h){console.warn("[seoManager] update toc label failed",h)}try{const h=r.meta&&r.meta.title?String(r.meta.title).trim():"",f=n.querySelector("img"),p=f&&(f.getAttribute("src")||f.src)||null;let d="";try{let w="";try{const k=u||(n&&n.querySelector?n.querySelector("h1"):null);if(k){let y=k.nextElementSibling;const I=[];for(;y&&!(y.tagName&&y.tagName.toLowerCase()==="h2");){const P=(y.textContent||"").trim();P&&I.push(P),y=y.nextElementSibling}I.length&&(w=I.join(" ").replace(/\s+/g," ").trim()),!w&&o&&(w=String(o).trim())}}catch(k){console.warn("[seoManager] compute descOverride failed",k)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),d=w}catch(w){console.warn("[seoManager] compute descOverride failed",w)}try{ya(r,o,p,d)}catch(w){console.warn("[seoManager] setMetaTags failed",w)}try{Sa(r,l,o,p,d,e)}catch(w){console.warn("[seoManager] setStructuredData failed",w)}const m=xa();o?m?document.title=`${m} - ${o}`:document.title=`${e||"Site"} - ${o}`:h?document.title=h:document.title=e||document.title}catch(h){console.warn("[seoManager] applyPageMeta failed",h)}try{const h=n.querySelector(".nimbi-reading-time");if(h&&h.remove(),o){const f=wa(c.raw||""),p=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,d=document.createElement("p");d.className="nimbi-reading-time",d.textContent=p?t("readingTime",{minutes:p}):"";const m=n.querySelector("h1");m&&m.insertAdjacentElement("afterend",d)}}catch(h){console.warn("[seoManager] reading time update failed",h)}}let Se=null,U=null,ve=1,Ge=(t,e)=>e,Et=0,Rt=0,Xt=()=>{},Tt=.25;function Aa(){if(Se&&document.contains(Se))return Se;Se=null;const t=document.createElement("dialog");t.className="nimbi-image-preview",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Ge("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",b=>{b.target===t&&Nn()}),t.addEventListener("wheel",b=>{if(!ie())return;b.preventDefault();const R=b.deltaY<0?Tt:-Tt;Ue(ve+R),l(),c()},{passive:!1}),t.addEventListener("keydown",b=>{if(b.key==="Escape"){Nn();return}if(ve>1){const R=t.querySelector(".nimbi-image-preview__image-wrapper");if(!R)return;const B=40;switch(b.key){case"ArrowUp":R.scrollTop-=B,b.preventDefault();break;case"ArrowDown":R.scrollTop+=B,b.preventDefault();break;case"ArrowLeft":R.scrollLeft-=B,b.preventDefault();break;case"ArrowRight":R.scrollLeft+=B,b.preventDefault();break}}}),document.body.appendChild(t),Se=t,U=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),r=t.querySelector("[data-nimbi-preview-original]"),s=t.querySelector("[data-nimbi-preview-zoom-in]"),n=t.querySelector("[data-nimbi-preview-zoom-out]"),i=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),u=t.querySelector("[data-nimbi-preview-zoom-label]"),o=t.querySelector("[data-nimbi-preview-zoom-hud]");function l(){u&&(u.textContent=`${Math.round(ve*100)}%`)}const c=()=>{o&&(o.textContent=`${Math.round(ve*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};Xt=l,s.addEventListener("click",()=>{Ue(ve+Tt),l(),c()}),n.addEventListener("click",()=>{Ue(ve-Tt),l(),c()}),e.addEventListener("click",()=>{Lt(),l(),c()}),r.addEventListener("click",()=>{Ue(1),l(),c()}),i.addEventListener("click",()=>{Lt(),l(),c()}),a.addEventListener("click",Nn),e.title=Ge("imagePreviewFit","Fit to screen"),r.title=Ge("imagePreviewOriginal","Original size"),n.title=Ge("imagePreviewZoomOut","Zoom out"),s.title=Ge("imagePreviewZoomIn","Zoom in"),a.title=Ge("imagePreviewClose","Close"),a.setAttribute("aria-label",Ge("imagePreviewClose","Close"));let h=!1,f=0,p=0,d=0,m=0;const w=new Map;let k=0,y=1;const I=(b,R)=>{const B=b.x-R.x,S=b.y-R.y;return Math.hypot(B,S)},P=()=>{if(h=!1,w.clear(),k=0,U){U.classList.add("is-panning"),U.classList.remove("is-grabbing");try{U.style.cursor="all-scroll"}catch{}}};let A=0,q=0,j=0;const G=b=>{const R=Date.now(),B=R-A,S=b.clientX-q,Q=b.clientY-j;A=R,q=b.clientX,j=b.clientY,B<300&&Math.hypot(S,Q)<30&&(Ue(ve>1?1:2),l(),b.preventDefault())},V=b=>{Ue(ve>1?1:2),l(),b.preventDefault()},ie=()=>Se?typeof Se.open=="boolean"?Se.open:Se.classList.contains("is-active"):!1,O=(b,R,B=1)=>{if(w.has(B)&&w.set(B,{x:b,y:R}),w.size===2){const Ae=Array.from(w.values()),ye=I(Ae[0],Ae[1]);if(k>0){const te=ye/k;Ue(y*te)}return}if(!h)return;const S=U.closest(".nimbi-image-preview__image-wrapper");if(!S)return;const Q=b-f,he=R-p;S.scrollLeft=d-Q,S.scrollTop=m-he},C=(b,R,B=1)=>{if(!ie())return;if(w.set(B,{x:b,y:R}),w.size===2){const he=Array.from(w.values());k=I(he[0],he[1]),y=ve;return}const S=U.closest(".nimbi-image-preview__image-wrapper");if(!(!S||!(S.scrollWidth>S.clientWidth||S.scrollHeight>S.clientHeight))){h=!0,f=b,p=R,d=S.scrollLeft,m=S.scrollTop,U.classList.add("is-panning"),U.classList.remove("is-grabbing");try{U.style.cursor="all-scroll"}catch{}window.addEventListener("pointermove",M),window.addEventListener("pointerup",T),window.addEventListener("pointercancel",T)}},M=b=>{h&&(b.preventDefault(),O(b.clientX,b.clientY,b.pointerId))},T=()=>{P(),window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",T),window.removeEventListener("pointercancel",T)};U.addEventListener("pointerdown",b=>{b.preventDefault(),C(b.clientX,b.clientY,b.pointerId)}),U.addEventListener("pointermove",b=>{(h||w.size===2)&&b.preventDefault(),O(b.clientX,b.clientY,b.pointerId)}),U.addEventListener("pointerup",b=>{b.preventDefault(),b.pointerType==="touch"&&G(b),P()}),U.addEventListener("dblclick",V),U.addEventListener("pointercancel",P),U.addEventListener("mousedown",b=>{b.preventDefault(),C(b.clientX,b.clientY,1)}),U.addEventListener("mousemove",b=>{h&&b.preventDefault(),O(b.clientX,b.clientY,1)}),U.addEventListener("mouseup",b=>{b.preventDefault(),P()});const v=t.querySelector(".nimbi-image-preview__image-wrapper");return v&&(v.addEventListener("pointerdown",b=>{if(C(b.clientX,b.clientY,b.pointerId),b&&b.target&&b.target.tagName==="IMG")try{b.target.classList.add("is-grabbing"),b.target.style.cursor="grabbing"}catch{}}),v.addEventListener("pointermove",b=>{O(b.clientX,b.clientY,b.pointerId)}),v.addEventListener("pointerup",P),v.addEventListener("pointercancel",P),v.addEventListener("mousedown",b=>{if(C(b.clientX,b.clientY,1),b&&b.target&&b.target.tagName==="IMG")try{b.target.classList.add("is-grabbing"),b.target.style.cursor="grabbing"}catch{}}),v.addEventListener("mousemove",b=>{O(b.clientX,b.clientY,1)}),v.addEventListener("mouseup",P)),t}function Ue(t){if(!U)return;const e=Number(t);ve=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const s=U.getBoundingClientRect(),n=Et||U.naturalWidth||U.width||s.width||0,i=Rt||U.naturalHeight||U.height||s.height||0;if(n&&i?(U.style.setProperty("--nimbi-preview-img-max-width","none"),U.style.setProperty("--nimbi-preview-img-max-height","none"),U.style.setProperty("--nimbi-preview-img-width",`${n*ve}px`),U.style.setProperty("--nimbi-preview-img-height",`${i*ve}px`),U.style.setProperty("--nimbi-preview-img-transform","none")):(U.style.setProperty("--nimbi-preview-img-max-width",""),U.style.setProperty("--nimbi-preview-img-max-height",""),U.style.setProperty("--nimbi-preview-img-width",""),U.style.setProperty("--nimbi-preview-img-height",""),U.style.setProperty("--nimbi-preview-img-transform",`scale(${ve})`)),U){U.classList.add("is-panning"),U.classList.remove("is-grabbing");try{U.style.cursor="all-scroll"}catch{}}}function Lt(){if(!U)return;const t=U.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const r=Et||U.naturalWidth||e.width,s=Rt||U.naturalHeight||e.height;if(!r||!s)return;const n=e.width/r,i=e.height/s,a=Math.min(n,i,1);Ue(Number.isFinite(a)?a:1)}function Ea(t,e="",r=0,s=0){const n=Aa();ve=1,Et=r||0,Rt=s||0,U.src=t,U.alt=e,U.style.transform="scale(1)";const i=()=>{Et=U.naturalWidth||U.width||0,Rt=U.naturalHeight||U.height||0};if(i(),Lt(),Xt(),requestAnimationFrame(()=>{Lt(),Xt()}),!Et||!Rt){const a=()=>{i(),requestAnimationFrame(()=>{Lt(),Xt()}),U.removeEventListener("load",a)};U.addEventListener("load",a)}typeof n.showModal=="function"&&(n.open||n.showModal()),n.classList.add("is-active"),n.focus()}function Nn(){Se&&(typeof Se.close=="function"&&Se.open&&Se.close(),Se.classList.remove("is-active"))}function Ra(t,{t:e,zoomStep:r=.25}={}){if(!t||!t.querySelectorAll)return;Ge=(p,d)=>(typeof e=="function"?e(p):void 0)||d,Tt=r,t.addEventListener("click",p=>{const d=p.target;if(!d||d.tagName!=="IMG")return;const m=d;if(m.src){if(p.defaultPrevented!==!0){const w=m.closest("a");w&&w.getAttribute("href")&&p.preventDefault()}Ea(m.src,m.alt||"",m.naturalWidth||0,m.naturalHeight||0)}});let s=!1,n=0,i=0,a=0,u=0;const o=new Map;let l=0,c=1;const h=(p,d)=>{const m=p.x-d.x,w=p.y-d.y;return Math.hypot(m,w)};t.addEventListener("pointerdown",p=>{const d=p.target;if(!d||d.tagName!=="IMG"||!Se||!Se.open)return;if(o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){const w=Array.from(o.values());l=h(w[0],w[1]),c=ve;return}const m=d.closest(".nimbi-image-preview__image-wrapper");m&&(ve<=1||(p.preventDefault(),s=!0,n=p.clientX,i=p.clientY,a=m.scrollLeft,u=m.scrollTop,d.setPointerCapture(p.pointerId),d.style.cursor="grabbing"))}),t.addEventListener("pointermove",p=>{if(o.has(p.pointerId)&&o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){p.preventDefault();const y=Array.from(o.values()),I=h(y[0],y[1]);if(l>0){const P=I/l;Ue(c*P)}return}if(!s)return;p.preventDefault();const m=p.target.closest(".nimbi-image-preview__image-wrapper");if(!m)return;const w=p.clientX-n,k=p.clientY-i;m.scrollLeft=a-w,m.scrollTop=u-k});const f=()=>{s=!1,o.clear(),l=0};t.addEventListener("pointerup",f),t.addEventListener("pointercancel",f)}function Ta(t){const{contentWrap:e,navWrap:r,container:s,mountOverlay:n=null,t:i,contentBase:a,homePage:u,initialDocumentTitle:o,runHooks:l}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let c=null;const h=na(i,[{path:u,name:i("home"),isIndex:!0,children:[]}]);async function f(k,y){let I,P,A;try{({data:I,pagePath:P,anchor:A}=await as(k,a))}catch(C){console.error("[nimbi-cms] fetchPageData failed",C),Zr(e,i,C);return}!A&&y&&(A=y);try{Bn(null)}catch(C){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",C)}e.innerHTML="";const{article:q,parsed:j,toc:G,topH1:V,h1Text:ie,slugKey:O}=await ua(i,I,P,A,a);va(i,o,j,G,q,P,A,V,ie,O,I),r.innerHTML="",r.appendChild(G),da(G);try{await l("transformHtml",{article:q,parsed:j,toc:G,pagePath:P,anchor:A,topH1:V,h1Text:ie,slugKey:O,data:I})}catch(C){console.warn("[nimbi-cms] transformHtml hooks failed",C)}e.appendChild(q);try{Ra(q,{t:i})}catch(C){console.warn("[nimbi-cms] attachImagePreview failed",C)}try{$t(s,100,!1),requestAnimationFrame(()=>$t(s,100,!1)),setTimeout(()=>$t(s,100,!1),250)}catch(C){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",C)}Bn(A),pa(q,V,{mountOverlay:n,container:s,navWrap:r,t:i});try{await l("onPageLoad",{data:I,pagePath:P,anchor:A,article:q,toc:G,topH1:V,h1Text:ie,slugKey:O,contentWrap:e,navWrap:r})}catch(C){console.warn("[nimbi-cms] onPageLoad hooks failed",C)}c=P}async function p(){let k=new URLSearchParams(location.search).get("page")||u;const y=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await f(k,y)}catch(I){console.warn("[nimbi-cms] renderByQuery failed for",k,I),Zr(e,i,I)}}window.addEventListener("popstate",p);const d=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,m=()=>{try{const k=s||document.querySelector(".nimbi-cms");if(!k)return;const y={top:k.scrollTop||0,left:k.scrollLeft||0};sessionStorage.setItem(d(),JSON.stringify(y))}catch{}},w=()=>{try{const k=s||document.querySelector(".nimbi-cms");if(!k)return;const y=sessionStorage.getItem(d());if(!y)return;const I=JSON.parse(y);I&&typeof I.top=="number"&&k.scrollTo({top:I.top,left:I.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",k=>{if(k.persisted)try{w(),$t(s,100,!1)}catch(y){console.warn("[nimbi-cms] bfcache restore failed",y)}}),window.addEventListener("pagehide",()=>{try{m()}catch(k){console.warn("[nimbi-cms] save scroll position failed",k)}}),{renderByQuery:p,siteNav:h,getCurrentPagePath:()=>c}}function La(t){try{const e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e)return{};const r=new URLSearchParams(e.startsWith("?")?e.slice(1):e),s={},n=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(r.has("contentPath")&&(s.contentPath=r.get("contentPath")),r.has("searchIndex")){const i=n(r.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(r.has("searchIndexMode")){const i=r.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(r.has("defaultStyle")){const i=r.get("defaultStyle");(i==="light"||i==="dark")&&(s.defaultStyle=i)}if(r.has("bulmaCustomize")&&(s.bulmaCustomize=r.get("bulmaCustomize")),r.has("lang")&&(s.lang=r.get("lang")),r.has("l10nFile")){const i=r.get("l10nFile");s.l10nFile=i==="null"?null:i}if(r.has("cacheTtlMinutes")){const i=Number(r.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(r.has("cacheMaxEntries")){const i=Number(r.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(r.has("homePage")&&(s.homePage=r.get("homePage")),r.has("notFoundPage")&&(s.notFoundPage=r.get("notFoundPage")),r.has("availableLanguages")&&(s.availableLanguages=r.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),r.has("indexDepth")){const i=Number(r.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(r.has("noIndexing")){const a=(r.get("noIndexing")||"").split(",").map(u=>u.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function Ca(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function Xr(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let On="";async function _a(t={}){if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const e=La();if(e&&(e.contentPath||e.homePage||e.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(S){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",S)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(S){console.warn("[nimbi-cms] logging ignore of URL overrides failed",S)}delete e.contentPath,delete e.homePage,delete e.notFoundPage}const r=Object.assign({},e,t),{el:s,contentPath:n="/content",crawlMaxQueue:i=1e3,searchIndex:a=!0,searchIndexMode:u="eager",indexDepth:o=1,noIndexing:l=void 0,defaultStyle:c="light",bulmaCustomize:h="none",lang:f=void 0,l10nFile:p=null,cacheTtlMinutes:d=5,cacheMaxEntries:m,markdownExtensions:w,availableLanguages:k,homePage:y="_home.md",notFoundPage:I="_404.md"}=r,{skipRootReadme:P=!1}=r;if(r.contentPath!=null&&!Ca(r.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(r.homePage!=null&&!Xr(r.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(r.notFoundPage!=null&&!Xr(r.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!s)throw new Error("el is required");let A=s;if(typeof s=="string"){if(A=document.querySelector(s),!A)throw new Error(`el selector "${s}" did not match any element`)}else if(!(s instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof n!="string"||!n.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(u!=null&&u!=="eager"&&u!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(o!=null&&o!==1&&o!==2&&o!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(c!=="light"&&c!=="dark")throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(d!=null&&(typeof d!="number"||!Number.isFinite(d)||d<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(S=>!S||typeof S!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(k!=null&&(!Array.isArray(k)||k.some(S=>typeof S!="string"||!S.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(l!=null&&(!Array.isArray(l)||l.some(S=>typeof S!="string"||!S.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(P!=null&&typeof P!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(y!=null&&(typeof y!="string"||!y.trim()||!/\.(md|html)$/.test(y)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(I!=null&&(typeof I!="string"||!I.trim()||!/\.(md|html)$/.test(I)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const q=!!a;try{typeof pn=="function"&&pn(!!P)}catch(S){console.warn("[nimbi-cms] setSkipRootReadme failed",S)}try{A.classList.add("nimbi-mount")}catch(S){console.warn("[nimbi-cms] mount element setup failed",S)}const j=document.createElement("div");j.className="nimbi-cms";const G=document.createElement("div");G.className="columns";const V=document.createElement("div");V.className="column is-full-mobile is-3-tablet nimbi-nav-wrap",V.setAttribute("role","navigation");try{const S=typeof it=="function"?it("navigation"):null;S&&V.setAttribute("aria-label",S)}catch(S){console.warn("[nimbi-cms] set nav aria-label failed",S)}G.appendChild(V);const ie=document.createElement("div");ie.className="column nimbi-content",ie.setAttribute("role","main"),G.appendChild(ie),j.appendChild(G);const O=V,C=ie;A.appendChild(j);let M=null;try{M=A.querySelector(".nimbi-overlay"),M||(M=document.createElement("div"),M.className="nimbi-overlay",A.appendChild(M))}catch(S){M=null,console.warn("[nimbi-cms] mount overlay setup failed",S)}const T=location.pathname||"/",v=T.endsWith("/")?T:T.substring(0,T.lastIndexOf("/")+1);try{On=document.title||""}catch(S){On="",console.warn("[nimbi-cms] read initial document title failed",S)}let b=n;(b==="."||b==="./")&&(b=""),b.startsWith("./")&&(b=b.slice(2)),b.startsWith("/")&&(b=b.slice(1)),b!==""&&!b.endsWith("/")&&(b=b+"/");const R=new URL(v+b,location.origin).toString();try{wn&&wn(y)}catch(S){console.warn("[nimbi-cms] setHomePage failed",S)}p&&await cn(p,v),k&&Array.isArray(k)&&or(k),f&&un(f);const B=Ta({contentWrap:C,navWrap:O,container:j,mountOverlay:M,t:it,contentBase:R,homePage:y,initialDocumentTitle:On,runHooks:rn});if(typeof d=="number"&&d>=0&&typeof wr=="function"&&wr(d*60*1e3),typeof m=="number"&&m>=0&&typeof mr=="function"&&mr(m),w&&Array.isArray(w)&&w.length)try{w.forEach(S=>{typeof S=="object"&&ea&&typeof _n=="function"&&_n(S)})}catch(S){console.warn("[nimbi-cms] applying markdownExtensions failed",S)}try{typeof i=="number"&&Promise.resolve().then(()=>Ut).then(({setDefaultCrawlMaxQueue:S})=>{try{S(i)}catch(Q){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",Q)}})}catch(S){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",S)}try{Nt(R)}catch(S){console.warn("[nimbi-cms] setContentBase failed",S)}try{mn(I)}catch(S){console.warn("[nimbi-cms] setNotFoundPage failed",S)}try{Nt(R)}catch(S){console.warn("[nimbi-cms] setContentBase failed",S)}try{mn(I)}catch(S){console.warn("[nimbi-cms] setNotFoundPage failed",S)}try{await ke(y,R)}catch(S){throw y==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${y} not found at ${R}${y}: ${S.message}`)}Jn(c),await Vn(h,v);try{const S=document.createElement("header");S.className="nimbi-site-navbar",A.insertBefore(S,j);const Q=await ke("_navigation.md",R),he=await Qt(Q.raw||""),{navbar:Ae,linkEls:ye}=await fa(S,j,he.html||"",R,y,it,B.renderByQuery,q,u,o,l);try{await rn("onNavBuild",{navWrap:O,navbar:Ae,linkEls:ye,contentBase:R})}catch(te){console.warn("[nimbi-cms] onNavBuild hooks failed",te)}try{const te=()=>{const ue=S&&S.getBoundingClientRect&&Math.round(S.getBoundingClientRect().height)||S&&S.offsetHeight||0;if(ue>0){try{A.style.setProperty("--nimbi-site-navbar-height",`${ue}px`)}catch(ge){console.warn("[nimbi-cms] set CSS var failed",ge)}try{j.style.paddingTop=""}catch(ge){console.warn("[nimbi-cms] set container paddingTop failed",ge)}try{const ge=A&&A.getBoundingClientRect&&Math.round(A.getBoundingClientRect().height)||A&&A.clientHeight||0;if(ge>0){const Je=Math.max(0,ge-ue);try{j.style.setProperty("--nimbi-cms-height",`${Je}px`)}catch(Dn){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Dn)}}else try{j.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(Je){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Je)}}catch(ge){console.warn("[nimbi-cms] compute container height failed",ge)}try{S.style.setProperty("--nimbi-site-navbar-height",`${ue}px`)}catch(ge){console.warn("[nimbi-cms] set navbar CSS var failed",ge)}}};te();try{if(typeof ResizeObserver<"u"){const ue=new ResizeObserver(()=>te());try{ue.observe(S)}catch(ge){console.warn("[nimbi-cms] ResizeObserver.observe failed",ge)}}}catch(ue){console.warn("[nimbi-cms] ResizeObserver setup failed",ue)}}catch(te){console.warn("[nimbi-cms] compute navbar height failed",te)}}catch(S){console.warn("[nimbi-cms] build navigation failed",S)}await B.renderByQuery();try{Promise.resolve().then(()=>Ma).then(({getVersion:S})=>{typeof S=="function"&&S().then(Q=>{try{const he=Q||"0.0.0";try{const Ae=ye=>{const te=document.createElement("a");te.className="nimbi-version-label tag is-small",te.textContent=`Ninbi CMS v. ${he}`,te.href=ye||"#",te.target="_blank",te.rel="noopener noreferrer nofollow",te.setAttribute("aria-label",`Ninbi CMS version ${he}`);try{er(te)}catch{}try{A.appendChild(te)}catch(ue){console.warn("[nimbi-cms] append version label failed",ue)}};(async()=>{try{const ye=await Promise.resolve().then(()=>ui).catch(()=>null),te=ye&&(ye.default||ye);let ue=null;te&&(te.homepage&&typeof te.homepage=="string"?ue=te.homepage:te.repository&&(typeof te.repository=="string"?ue=te.repository:te.repository.url&&typeof te.repository.url=="string"&&(ue=te.repository.url)));try{ue&&new URL(ue)}catch{ue=null}Ae(ue||"#")}catch{Ae("#")}})()}catch(Ae){console.warn("[nimbi-cms] building version label failed",Ae)}}catch(he){console.warn("[nimbi-cms] building version label failed",he)}}).catch(Q=>{console.warn("[nimbi-cms] getVersion() failed",Q)})}).catch(S=>{console.warn("[nimbi-cms] import version module failed",S)})}catch(S){console.warn("[nimbi-cms] version label setup failed",S)}}async function Kr(){try{let t=null;try{t=await Promise.resolve().then(()=>ui)}catch{try{if(typeof fetch=="function"&&typeof location<"u"){const s=new URL("../package.json",location.href).toString(),n=await fetch(s);n&&n.ok?t={default:await n.json()}:t=null}else t=null}catch{t=null}}const e=t?.default?.version||t?.version;return typeof e=="string"&&e.trim()?e:"0.0.0"}catch{return"0.0.0"}}const Ma=Object.freeze(Object.defineProperty({__proto__:null,getVersion:Kr},Symbol.toStringTag,{value:"Module"})),Yr="nimbi-cms",Vr="0.1.0",Jr={type:"git",url:"git+https://github.com/AbelVM/nimbiCMS.git"},ei="https://abelvm.github.io/nimbiCMS/",ti="module",ni={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},ri={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},ii={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17","typedoc-plugin-markdown":"^4.10.0",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},si="dist/nimbi-cms.cjs.js",ai="dist/nimbi-cms.es.js",oi="src/index.d.ts",li="dist/nimbi-cms.js",ci=["dist","src/index.d.ts"],ui=Object.freeze(Object.defineProperty({__proto__:null,default:{name:Yr,version:Vr,repository:Jr,homepage:ei,private:!0,type:ti,scripts:ni,dependencies:ri,devDependencies:ii,main:si,module:ai,types:oi,unpkg:li,files:ci},dependencies:ri,devDependencies:ii,files:ci,homepage:ei,main:si,module:ai,name:Yr,repository:Jr,scripts:ni,type:ti,types:oi,unpkg:li,version:Vr},Symbol.toStringTag,{value:"Module"}));ce.BAD_LANGUAGES=an,ce.SUPPORTED_HLJS_MAP=Y,ce._clearHooks=_i,ce.addHook=_t,ce.default=_a,ce.ensureBulma=Vn,ce.getVersion=Kr,ce.loadL10nFile=cn,ce.loadSupportedLanguages=ln,ce.observeCodeBlocks=Yn,ce.onNavBuild=Li,ce.onPageLoad=Ti,ce.registerLanguage=nt,ce.runHooks=rn,ce.setHighlightTheme=Bi,ce.setLang=un,ce.setStyle=Jn,ce.setThemeVars=Ni,ce.t=it,ce.transformHtml=Ci,Object.defineProperties(ce,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
