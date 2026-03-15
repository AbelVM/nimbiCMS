(function(ue,Ue){typeof exports=="object"&&typeof module<"u"?Ue(exports):typeof define=="function"&&define.amd?define(["exports"],Ue):(ue=typeof globalThis<"u"?globalThis:ue||self,Ue(ue.nimbiCMS={}))})(this,(function(ue){"use strict";const Ue={onPageLoad:[],onNavBuild:[],transformHtml:[]};function It(t,e){if(!Object.prototype.hasOwnProperty.call(Ue,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");Ue[t].push(e)}function Ni(t){It("onPageLoad",t)}function Oi(t){It("onNavBuild",t)}function Di(t){It("transformHtml",t)}async function on(t,e){const n=Ue[t]||[];for(const s of n)try{await s(e)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function Hi(){Object.keys(Ue).forEach(t=>{Ue[t].length=0})}function Kn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var ln,Yn;function Ui(){if(Yn)return ln;Yn=1;function t(m){return m instanceof Map?m.clear=m.delete=m.set=function(){throw new Error("map is read-only")}:m instanceof Set&&(m.add=m.clear=m.delete=function(){throw new Error("set is read-only")}),Object.freeze(m),Object.getOwnPropertyNames(m).forEach(S=>{const T=m[S],G=typeof T;(G==="object"||G==="function")&&!Object.isFrozen(T)&&t(T)}),m}class e{constructor(S){S.data===void 0&&(S.data={}),this.data=S.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(m){return m.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(m,...S){const T=Object.create(null);for(const G in m)T[G]=m[G];return S.forEach(function(G){for(const me in G)T[me]=G[me]}),T}const r="</span>",i=m=>!!m.scope,a=(m,{prefix:S})=>{if(m.startsWith("language:"))return m.replace("language:","language-");if(m.includes(".")){const T=m.split(".");return[`${S}${T.shift()}`,...T.map((G,me)=>`${G}${"_".repeat(me+1)}`)].join(" ")}return`${S}${m}`};class u{constructor(S,T){this.buffer="",this.classPrefix=T.classPrefix,S.walk(this)}addText(S){this.buffer+=n(S)}openNode(S){if(!i(S))return;const T=a(S.scope,{prefix:this.classPrefix});this.span(T)}closeNode(S){i(S)&&(this.buffer+=r)}value(){return this.buffer}span(S){this.buffer+=`<span class="${S}">`}}const o=(m={})=>{const S={children:[]};return Object.assign(S,m),S};class l{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(S){this.top.children.push(S)}openNode(S){const T=o({scope:S});this.add(T),this.stack.push(T)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(S){return this.constructor._walk(S,this.rootNode)}static _walk(S,T){return typeof T=="string"?S.addText(T):T.children&&(S.openNode(T),T.children.forEach(G=>this._walk(S,G)),S.closeNode(T)),S}static _collapse(S){typeof S!="string"&&S.children&&(S.children.every(T=>typeof T=="string")?S.children=[S.children.join("")]:S.children.forEach(T=>{l._collapse(T)}))}}class c extends l{constructor(S){super(),this.options=S}addText(S){S!==""&&this.add(S)}startScope(S){this.openNode(S)}endScope(){this.closeNode()}__addSublanguage(S,T){const G=S.root;T&&(G.scope=`language:${T}`),this.add(G)}toHTML(){return new u(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function h(m){return m?typeof m=="string"?m:m.source:null}function f(m){return g("(?=",m,")")}function p(m){return g("(?:",m,")*")}function d(m){return g("(?:",m,")?")}function g(...m){return m.map(T=>h(T)).join("")}function w(m){const S=m[m.length-1];return typeof S=="object"&&S.constructor===Object?(m.splice(m.length-1,1),S):{}}function y(...m){return"("+(w(m).capture?"":"?:")+m.map(G=>h(G)).join("|")+")"}function x(m){return new RegExp(m.toString()+"|").exec("").length-1}function P(m,S){const T=m&&m.exec(S);return T&&T.index===0}const M=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function _(m,{joinWith:S}){let T=0;return m.map(G=>{T+=1;const me=T;let we=h(G),z="";for(;we.length>0;){const $=M.exec(we);if(!$){z+=we;break}z+=we.substring(0,$.index),we=we.substring($.index+$[0].length),$[0][0]==="\\"&&$[1]?z+="\\"+String(Number($[1])+me):(z+=$[0],$[0]==="("&&T++)}return z}).map(G=>`(${G})`).join(S)}const I=/\b\B/,q="[a-zA-Z]\\w*",X="[a-zA-Z_]\\w*",oe="\\b\\d+(\\.\\d+)?",W="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",U="\\b(0b[01]+)",K="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",Y=(m={})=>{const S=/^#![ ]*\//;return m.binary&&(m.begin=g(S,/.*\b/,m.binary,/\b.*/)),s({scope:"meta",begin:S,end:/$/,relevance:0,"on:begin":(T,G)=>{T.index!==0&&G.ignoreMatch()}},m)},ee={begin:"\\\\[\\s\\S]",relevance:0},F={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[ee]},k={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[ee]},v={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},R=function(m,S,T={}){const G=s({scope:"comment",begin:m,end:S,contains:[]},T);G.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const me=y("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return G.contains.push({begin:g(/[ ]+/,"(",me,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),G},E=R("//","$"),b=R("/\\*","\\*/"),L=R("#","$"),N={scope:"number",begin:oe,relevance:0},Z={scope:"number",begin:W,relevance:0},te={scope:"number",begin:U,relevance:0},re={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[ee,{begin:/\[/,end:/\]/,relevance:0,contains:[ee]}]},de={scope:"title",begin:q,relevance:0},be={scope:"title",begin:X,relevance:0},Oe={begin:"\\.\\s*"+X,relevance:0};var tt=Object.freeze({__proto__:null,APOS_STRING_MODE:F,BACKSLASH_ESCAPE:ee,BINARY_NUMBER_MODE:te,BINARY_NUMBER_RE:U,COMMENT:R,C_BLOCK_COMMENT_MODE:b,C_LINE_COMMENT_MODE:E,C_NUMBER_MODE:Z,C_NUMBER_RE:W,END_SAME_AS_BEGIN:function(m){return Object.assign(m,{"on:begin":(S,T)=>{T.data._beginMatch=S[1]},"on:end":(S,T)=>{T.data._beginMatch!==S[1]&&T.ignoreMatch()}})},HASH_COMMENT_MODE:L,IDENT_RE:q,MATCH_NOTHING_RE:I,METHOD_GUARD:Oe,NUMBER_MODE:N,NUMBER_RE:oe,PHRASAL_WORDS_MODE:v,QUOTE_STRING_MODE:k,REGEXP_MODE:re,RE_STARTERS_RE:K,SHEBANG:Y,TITLE_MODE:de,UNDERSCORE_IDENT_RE:X,UNDERSCORE_TITLE_MODE:be});function ht(m,S){m.input[m.index-1]==="."&&S.ignoreMatch()}function Hn(m,S){m.className!==void 0&&(m.scope=m.className,delete m.className)}function ja(m,S){S&&m.beginKeywords&&(m.begin="\\b("+m.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",m.__beforeBegin=ht,m.keywords=m.keywords||m.beginKeywords,delete m.beginKeywords,m.relevance===void 0&&(m.relevance=0))}function Fa(m,S){Array.isArray(m.illegal)&&(m.illegal=y(...m.illegal))}function Wa(m,S){if(m.match){if(m.begin||m.end)throw new Error("begin & end are not supported with match");m.begin=m.match,delete m.match}}function Za(m,S){m.relevance===void 0&&(m.relevance=1)}const Ga=(m,S)=>{if(!m.beforeMatch)return;if(m.starts)throw new Error("beforeMatch cannot be used with starts");const T=Object.assign({},m);Object.keys(m).forEach(G=>{delete m[G]}),m.keywords=T.keywords,m.begin=g(T.beforeMatch,f(T.begin)),m.starts={relevance:0,contains:[Object.assign(T,{endsParent:!0})]},m.relevance=0,delete T.beforeMatch},Qa=["of","and","for","in","not","or","if","then","parent","list","value"],Xa="keyword";function xi(m,S,T=Xa){const G=Object.create(null);return typeof m=="string"?me(T,m.split(" ")):Array.isArray(m)?me(T,m):Object.keys(m).forEach(function(we){Object.assign(G,xi(m[we],S,we))}),G;function me(we,z){S&&(z=z.map($=>$.toLowerCase())),z.forEach(function($){const j=$.split("|");G[j[0]]=[we,Ka(j[0],j[1])]})}}function Ka(m,S){return S?Number(S):Ya(m)?0:1}function Ya(m){return Qa.includes(m.toLowerCase())}const Si={},nt=m=>{console.error(m)},vi=(m,...S)=>{console.log(`WARN: ${m}`,...S)},dt=(m,S)=>{Si[`${m}/${S}`]||(console.log(`Deprecated as of ${m}. ${S}`),Si[`${m}/${S}`]=!0)},en=new Error;function Ei(m,S,{key:T}){let G=0;const me=m[T],we={},z={};for(let $=1;$<=S.length;$++)z[$+G]=me[$],we[$+G]=!0,G+=x(S[$-1]);m[T]=z,m[T]._emit=we,m[T]._multi=!0}function Va(m){if(Array.isArray(m.begin)){if(m.skip||m.excludeBegin||m.returnBegin)throw nt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),en;if(typeof m.beginScope!="object"||m.beginScope===null)throw nt("beginScope must be object"),en;Ei(m,m.begin,{key:"beginScope"}),m.begin=_(m.begin,{joinWith:""})}}function Ja(m){if(Array.isArray(m.end)){if(m.skip||m.excludeEnd||m.returnEnd)throw nt("skip, excludeEnd, returnEnd not compatible with endScope: {}"),en;if(typeof m.endScope!="object"||m.endScope===null)throw nt("endScope must be object"),en;Ei(m,m.end,{key:"endScope"}),m.end=_(m.end,{joinWith:""})}}function eo(m){m.scope&&typeof m.scope=="object"&&m.scope!==null&&(m.beginScope=m.scope,delete m.scope)}function to(m){eo(m),typeof m.beginScope=="string"&&(m.beginScope={_wrap:m.beginScope}),typeof m.endScope=="string"&&(m.endScope={_wrap:m.endScope}),Va(m),Ja(m)}function no(m){function S(z,$){return new RegExp(h(z),"m"+(m.case_insensitive?"i":"")+(m.unicodeRegex?"u":"")+($?"g":""))}class T{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule($,j){j.position=this.position++,this.matchIndexes[this.matchAt]=j,this.regexes.push([j,$]),this.matchAt+=x($)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const $=this.regexes.map(j=>j[1]);this.matcherRe=S(_($,{joinWith:"|"}),!0),this.lastIndex=0}exec($){this.matcherRe.lastIndex=this.lastIndex;const j=this.matcherRe.exec($);if(!j)return null;const ve=j.findIndex((Pt,qn)=>qn>0&&Pt!==void 0),ye=this.matchIndexes[ve];return j.splice(0,ve),Object.assign(j,ye)}}class G{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher($){if(this.multiRegexes[$])return this.multiRegexes[$];const j=new T;return this.rules.slice($).forEach(([ve,ye])=>j.addRule(ve,ye)),j.compile(),this.multiRegexes[$]=j,j}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule($,j){this.rules.push([$,j]),j.type==="begin"&&this.count++}exec($){const j=this.getMatcher(this.regexIndex);j.lastIndex=this.lastIndex;let ve=j.exec($);if(this.resumingScanAtSamePosition()&&!(ve&&ve.index===this.lastIndex)){const ye=this.getMatcher(0);ye.lastIndex=this.lastIndex+1,ve=ye.exec($)}return ve&&(this.regexIndex+=ve.position+1,this.regexIndex===this.count&&this.considerAll()),ve}}function me(z){const $=new G;return z.contains.forEach(j=>$.addRule(j.begin,{rule:j,type:"begin"})),z.terminatorEnd&&$.addRule(z.terminatorEnd,{type:"end"}),z.illegal&&$.addRule(z.illegal,{type:"illegal"}),$}function we(z,$){const j=z;if(z.isCompiled)return j;[Hn,Wa,to,Ga].forEach(ye=>ye(z,$)),m.compilerExtensions.forEach(ye=>ye(z,$)),z.__beforeBegin=null,[ja,Fa,Za].forEach(ye=>ye(z,$)),z.isCompiled=!0;let ve=null;return typeof z.keywords=="object"&&z.keywords.$pattern&&(z.keywords=Object.assign({},z.keywords),ve=z.keywords.$pattern,delete z.keywords.$pattern),ve=ve||/\w+/,z.keywords&&(z.keywords=xi(z.keywords,m.case_insensitive)),j.keywordPatternRe=S(ve,!0),$&&(z.begin||(z.begin=/\B|\b/),j.beginRe=S(j.begin),!z.end&&!z.endsWithParent&&(z.end=/\B|\b/),z.end&&(j.endRe=S(j.end)),j.terminatorEnd=h(j.end)||"",z.endsWithParent&&$.terminatorEnd&&(j.terminatorEnd+=(z.end?"|":"")+$.terminatorEnd)),z.illegal&&(j.illegalRe=S(z.illegal)),z.contains||(z.contains=[]),z.contains=[].concat(...z.contains.map(function(ye){return ro(ye==="self"?z:ye)})),z.contains.forEach(function(ye){we(ye,j)}),z.starts&&we(z.starts,$),j.matcher=me(j),j}if(m.compilerExtensions||(m.compilerExtensions=[]),m.contains&&m.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return m.classNameAliases=s(m.classNameAliases||{}),we(m)}function Ai(m){return m?m.endsWithParent||Ai(m.starts):!1}function ro(m){return m.variants&&!m.cachedVariants&&(m.cachedVariants=m.variants.map(function(S){return s(m,{variants:null},S)})),m.cachedVariants?m.cachedVariants:Ai(m)?s(m,{starts:m.starts?s(m.starts):null}):Object.isFrozen(m)?s(m):m}var io="11.11.1";class so extends Error{constructor(S,T){super(S),this.name="HTMLInjectionError",this.html=T}}const Un=n,Ri=s,Li=Symbol("nomatch"),ao=7,Ti=function(m){const S=Object.create(null),T=Object.create(null),G=[];let me=!0;const we="Could not find the language '{}', did you forget to load/include a language module?",z={disableAutodetect:!0,name:"Plain text",contains:[]};let $={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:c};function j(A){return $.noHighlightRe.test(A)}function ve(A){let O=A.className+" ";O+=A.parentNode?A.parentNode.className:"";const ie=$.languageDetectRe.exec(O);if(ie){const fe=Ke(ie[1]);return fe||(vi(we.replace("{}",ie[1])),vi("Falling back to no-highlight mode for this block.",A)),fe?ie[1]:"no-highlight"}return O.split(/\s+/).find(fe=>j(fe)||Ke(fe))}function ye(A,O,ie){let fe="",xe="";typeof O=="object"?(fe=A,ie=O.ignoreIllegals,xe=O.language):(dt("10.7.0","highlight(lang, code, ...args) has been deprecated."),dt("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),xe=A,fe=O),ie===void 0&&(ie=!0);const ze={code:fe,language:xe};nn("before:highlight",ze);const Ye=ze.result?ze.result:Pt(ze.language,ze.code,ie);return Ye.code=ze.code,nn("after:highlight",Ye),Ye}function Pt(A,O,ie,fe){const xe=Object.create(null);function ze(C,B){return C.keywords[B]}function Ye(){if(!Q.keywords){Ee.addText(pe);return}let C=0;Q.keywordPatternRe.lastIndex=0;let B=Q.keywordPatternRe.exec(pe),V="";for(;B;){V+=pe.substring(C,B.index);const ce=He.case_insensitive?B[0].toLowerCase():B[0],Re=ze(Q,ce);if(Re){const[Fe,Eo]=Re;if(Ee.addText(V),V="",xe[ce]=(xe[ce]||0)+1,xe[ce]<=ao&&(an+=Eo),Fe.startsWith("_"))V+=B[0];else{const Ao=He.classNameAliases[Fe]||Fe;De(B[0],Ao)}}else V+=B[0];C=Q.keywordPatternRe.lastIndex,B=Q.keywordPatternRe.exec(pe)}V+=pe.substring(C),Ee.addText(V)}function rn(){if(pe==="")return;let C=null;if(typeof Q.subLanguage=="string"){if(!S[Q.subLanguage]){Ee.addText(pe);return}C=Pt(Q.subLanguage,pe,!0,Bi[Q.subLanguage]),Bi[Q.subLanguage]=C._top}else C=jn(pe,Q.subLanguage.length?Q.subLanguage:null);Q.relevance>0&&(an+=C.relevance),Ee.__addSublanguage(C._emitter,C.language)}function _e(){Q.subLanguage!=null?rn():Ye(),pe=""}function De(C,B){C!==""&&(Ee.startScope(B),Ee.addText(C),Ee.endScope())}function $i(C,B){let V=1;const ce=B.length-1;for(;V<=ce;){if(!C._emit[V]){V++;continue}const Re=He.classNameAliases[C[V]]||C[V],Fe=B[V];Re?De(Fe,Re):(pe=Fe,Ye(),pe=""),V++}}function Pi(C,B){return C.scope&&typeof C.scope=="string"&&Ee.openNode(He.classNameAliases[C.scope]||C.scope),C.beginScope&&(C.beginScope._wrap?(De(pe,He.classNameAliases[C.beginScope._wrap]||C.beginScope._wrap),pe=""):C.beginScope._multi&&($i(C.beginScope,B),pe="")),Q=Object.create(C,{parent:{value:Q}}),Q}function Ii(C,B,V){let ce=P(C.endRe,V);if(ce){if(C["on:end"]){const Re=new e(C);C["on:end"](B,Re),Re.isMatchIgnored&&(ce=!1)}if(ce){for(;C.endsParent&&C.parent;)C=C.parent;return C}}if(C.endsWithParent)return Ii(C.parent,B,V)}function yo(C){return Q.matcher.regexIndex===0?(pe+=C[0],1):(Gn=!0,0)}function ko(C){const B=C[0],V=C.rule,ce=new e(V),Re=[V.__beforeBegin,V["on:begin"]];for(const Fe of Re)if(Fe&&(Fe(C,ce),ce.isMatchIgnored))return yo(B);return V.skip?pe+=B:(V.excludeBegin&&(pe+=B),_e(),!V.returnBegin&&!V.excludeBegin&&(pe=B)),Pi(V,C),V.returnBegin?0:B.length}function xo(C){const B=C[0],V=O.substring(C.index),ce=Ii(Q,C,V);if(!ce)return Li;const Re=Q;Q.endScope&&Q.endScope._wrap?(_e(),De(B,Q.endScope._wrap)):Q.endScope&&Q.endScope._multi?(_e(),$i(Q.endScope,C)):Re.skip?pe+=B:(Re.returnEnd||Re.excludeEnd||(pe+=B),_e(),Re.excludeEnd&&(pe=B));do Q.scope&&Ee.closeNode(),!Q.skip&&!Q.subLanguage&&(an+=Q.relevance),Q=Q.parent;while(Q!==ce.parent);return ce.starts&&Pi(ce.starts,C),Re.returnEnd?0:B.length}function So(){const C=[];for(let B=Q;B!==He;B=B.parent)B.scope&&C.unshift(B.scope);C.forEach(B=>Ee.openNode(B))}let sn={};function zi(C,B){const V=B&&B[0];if(pe+=C,V==null)return _e(),0;if(sn.type==="begin"&&B.type==="end"&&sn.index===B.index&&V===""){if(pe+=O.slice(B.index,B.index+1),!me){const ce=new Error(`0 width match regex (${A})`);throw ce.languageName=A,ce.badRule=sn.rule,ce}return 1}if(sn=B,B.type==="begin")return ko(B);if(B.type==="illegal"&&!ie){const ce=new Error('Illegal lexeme "'+V+'" for mode "'+(Q.scope||"<unnamed>")+'"');throw ce.mode=Q,ce}else if(B.type==="end"){const ce=xo(B);if(ce!==Li)return ce}if(B.type==="illegal"&&V==="")return pe+=`
`,1;if(Zn>1e5&&Zn>B.index*3)throw new Error("potential infinite loop, way more iterations than matches");return pe+=V,V.length}const He=Ke(A);if(!He)throw nt(we.replace("{}",A)),new Error('Unknown language: "'+A+'"');const vo=no(He);let Wn="",Q=fe||vo;const Bi={},Ee=new $.__emitter($);So();let pe="",an=0,rt=0,Zn=0,Gn=!1;try{if(He.__emitTokens)He.__emitTokens(O,Ee);else{for(Q.matcher.considerAll();;){Zn++,Gn?Gn=!1:Q.matcher.considerAll(),Q.matcher.lastIndex=rt;const C=Q.matcher.exec(O);if(!C)break;const B=O.substring(rt,C.index),V=zi(B,C);rt=C.index+V}zi(O.substring(rt))}return Ee.finalize(),Wn=Ee.toHTML(),{language:A,value:Wn,relevance:an,illegal:!1,_emitter:Ee,_top:Q}}catch(C){if(C.message&&C.message.includes("Illegal"))return{language:A,value:Un(O),illegal:!0,relevance:0,_illegalBy:{message:C.message,index:rt,context:O.slice(rt-100,rt+100),mode:C.mode,resultSoFar:Wn},_emitter:Ee};if(me)return{language:A,value:Un(O),illegal:!1,relevance:0,errorRaised:C,_emitter:Ee,_top:Q};throw C}}function qn(A){const O={value:Un(A),illegal:!1,relevance:0,_top:z,_emitter:new $.__emitter($)};return O._emitter.addText(A),O}function jn(A,O){O=O||$.languages||Object.keys(S);const ie=qn(A),fe=O.filter(Ke).filter(_i).map(_e=>Pt(_e,A,!1));fe.unshift(ie);const xe=fe.sort((_e,De)=>{if(_e.relevance!==De.relevance)return De.relevance-_e.relevance;if(_e.language&&De.language){if(Ke(_e.language).supersetOf===De.language)return 1;if(Ke(De.language).supersetOf===_e.language)return-1}return 0}),[ze,Ye]=xe,rn=ze;return rn.secondBest=Ye,rn}function oo(A,O,ie){const fe=O&&T[O]||ie;A.classList.add("hljs"),A.classList.add(`language-${fe}`)}function Fn(A){let O=null;const ie=ve(A);if(j(ie))return;if(nn("before:highlightElement",{el:A,language:ie}),A.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",A);return}if(A.children.length>0&&($.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(A)),$.throwUnescapedHTML))throw new so("One of your code blocks includes unescaped HTML.",A.innerHTML);O=A;const fe=O.textContent,xe=ie?ye(fe,{language:ie,ignoreIllegals:!0}):jn(fe);A.innerHTML=xe.value,A.dataset.highlighted="yes",oo(A,ie,xe.language),A.result={language:xe.language,re:xe.relevance,relevance:xe.relevance},xe.secondBest&&(A.secondBest={language:xe.secondBest.language,relevance:xe.secondBest.relevance}),nn("after:highlightElement",{el:A,result:xe,text:fe})}function lo(A){$=Ri($,A)}const co=()=>{tn(),dt("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function uo(){tn(),dt("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Ci=!1;function tn(){function A(){tn()}if(document.readyState==="loading"){Ci||window.addEventListener("DOMContentLoaded",A,!1),Ci=!0;return}document.querySelectorAll($.cssSelector).forEach(Fn)}function ho(A,O){let ie=null;try{ie=O(m)}catch(fe){if(nt("Language definition for '{}' could not be registered.".replace("{}",A)),me)nt(fe);else throw fe;ie=z}ie.name||(ie.name=A),S[A]=ie,ie.rawDefinition=O.bind(null,m),ie.aliases&&Mi(ie.aliases,{languageName:A})}function fo(A){delete S[A];for(const O of Object.keys(T))T[O]===A&&delete T[O]}function po(){return Object.keys(S)}function Ke(A){return A=(A||"").toLowerCase(),S[A]||S[T[A]]}function Mi(A,{languageName:O}){typeof A=="string"&&(A=[A]),A.forEach(ie=>{T[ie.toLowerCase()]=O})}function _i(A){const O=Ke(A);return O&&!O.disableAutodetect}function go(A){A["before:highlightBlock"]&&!A["before:highlightElement"]&&(A["before:highlightElement"]=O=>{A["before:highlightBlock"](Object.assign({block:O.el},O))}),A["after:highlightBlock"]&&!A["after:highlightElement"]&&(A["after:highlightElement"]=O=>{A["after:highlightBlock"](Object.assign({block:O.el},O))})}function mo(A){go(A),G.push(A)}function wo(A){const O=G.indexOf(A);O!==-1&&G.splice(O,1)}function nn(A,O){const ie=A;G.forEach(function(fe){fe[ie]&&fe[ie](O)})}function bo(A){return dt("10.7.0","highlightBlock will be removed entirely in v12.0"),dt("10.7.0","Please use highlightElement now."),Fn(A)}Object.assign(m,{highlight:ye,highlightAuto:jn,highlightAll:tn,highlightElement:Fn,highlightBlock:bo,configure:lo,initHighlighting:co,initHighlightingOnLoad:uo,registerLanguage:ho,unregisterLanguage:fo,listLanguages:po,getLanguage:Ke,registerAliases:Mi,autoDetection:_i,inherit:Ri,addPlugin:mo,removePlugin:wo}),m.debugMode=function(){me=!1},m.safeMode=function(){me=!0},m.versionString=io,m.regex={concat:g,lookahead:f,either:y,optional:d,anyNumberOfTimes:p};for(const A in tt)typeof tt[A]=="object"&&t(tt[A]);return Object.assign(m,tt),m},ft=Ti({});return ft.newInstance=()=>Ti({}),ln=ft,ft.HighlightJS=ft,ft.default=ft,ln}var qi=Ui();const he=Kn(qi),ne=new Map,ji="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Te={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Te.html="xml",Te.xhtml="xml",Te.markup="xml";const cn=new Set(["magic","undefined"]);let We=null;const un=new Map,Fi=300*1e3;async function hn(t=ji){if(t)return We||(We=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const s=(await e.text()).split(/\r?\n/);let r=-1;for(let l=0;l<s.length;l++)if(/\|\s*Language\s*\|/i.test(s[l])){r=l;break}if(r===-1)return;const i=s[r].replace(/^\||\|$/g,"").split("|").map(l=>l.trim().toLowerCase());let a=i.findIndex(l=>/alias|aliases|equivalent|alt|alternates?/i.test(l));a===-1&&(a=1);let u=i.findIndex(l=>/file|filename|module|module name|module-name|short|slug/i.test(l));if(u===-1){const l=i.findIndex(c=>/language/i.test(c));u=l!==-1?l:0}let o=[];for(let l=r+1;l<s.length;l++){const c=s[l].trim();if(!c||!c.startsWith("|"))break;const h=c.replace(/^\||\|$/g,"").split("|").map(w=>w.trim());if(h.every(w=>/^-+$/.test(w)))continue;const f=h;if(!f.length)continue;const d=(f[u]||f[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;ne.set(d,d);const g=f[a]||"";if(g){const w=String(g).split(",").map(y=>y.replace(/`/g,"").trim()).filter(Boolean);if(w.length){const x=w[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");x&&/[a-z0-9]/i.test(x)&&(ne.set(x,x),o.push(x))}}}try{const l=[];for(const c of o){const h=String(c||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");h&&/[a-z0-9]/i.test(h)?l.push(h):ne.delete(c)}o=l}catch(l){console.warn("[codeblocksManager] cleanup aliases failed",l)}try{let l=0;for(const c of Array.from(ne.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){ne.delete(c),l++;continue}if(/^[:]+/.test(c)){const h=c.replace(/^[:]+/,"");if(h&&/[a-z0-9]/i.test(h)){const f=ne.get(c);ne.delete(c),ne.set(h,f)}else ne.delete(c),l++}}for(const[c,h]of Array.from(ne.entries()))(!h||/^-+$/.test(h)||!/[a-z0-9]/i.test(h))&&(ne.delete(c),l++);try{const c=":---------------------";ne.has(c)&&(ne.delete(c),l++)}catch(c){console.warn("[codeblocksManager] remove sep key failed",c)}try{const c=Array.from(ne.keys()).sort()}catch(c){console.warn("[codeblocksManager] compute supported keys failed",c)}}catch(l){console.warn("[codeblocksManager] ignored error",l)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),We)}const pt=new Set;async function it(t,e){if(We||(async()=>{try{await hn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),We)try{await We}catch{}if(t=t==null?"":String(t),t=t.trim(),!t)return!1;const n=t.toLowerCase();if(cn.has(n))return!1;if(ne.size&&!ne.has(n)){const r=Te;if(!r[n]&&!r[t])return!1}if(pt.has(t))return!0;const s=Te;try{const r=(e||t||"").toString().replace(/\.js$/i,"").trim(),i=(s[t]||t||"").toString(),a=(s[r]||r||"").toString();let u=Array.from(new Set([i,a,r,t,s[r],s[t]].filter(Boolean))).map(c=>String(c).toLowerCase()).filter(c=>c&&c!=="undefined");ne.size&&(u=u.filter(c=>{if(ne.has(c))return!0;const h=Te[c];return!!(h&&ne.has(h))}));let o=null,l=null;for(const c of u)try{const h=Date.now();let f=un.get(c);if(f&&f.ok===!1&&h-(f.ts||0)>=Fi&&(un.delete(c),f=void 0),f){if(f.module)o=f.module;else if(f.promise)try{o=await f.promise}catch{o=null}}else{const p={promise:null,module:null,ok:null,ts:0};un.set(c,p),p.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${c}.js`)}catch{return await import(`highlight.js/lib/languages/${c}`)}}catch{try{const g=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;return await new Function("u","return import(u)")(g)}catch{try{const w=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;return await new Function("u","return import(u)")(w)}catch{return null}}}}catch{return null}})();try{o=await p.promise,p.module=o,p.ok=!!o,p.ts=Date.now()}catch{p.module=null,p.ok=!1,p.ts=Date.now(),o=null}}if(o){const p=o.default||o;try{const d=ne.size&&ne.get(t)||c||t;return he.registerLanguage(d,p),pt.add(d),d!==t&&(he.registerLanguage(t,p),pt.add(t)),!0}catch(d){l=d}}else try{if(ne.has(c)||ne.has(t)){const p=()=>({});try{he.registerLanguage(c,p),pt.add(c)}catch{}try{c!==t&&(he.registerLanguage(t,p),pt.add(t))}catch{}return!0}}catch{}}catch(h){l=h}if(l)throw l;return!1}catch{return!1}}let zt=null;function Vn(t=document){We||(async()=>{try{await hn()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const e=Te,s=zt||(typeof IntersectionObserver>"u"?null:(zt=new IntersectionObserver((i,a)=>{i.forEach(u=>{if(!u.isIntersecting)return;const o=u.target;try{a.unobserve(o)}catch(l){console.warn("[codeblocksManager] observer unobserve failed",l)}(async()=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",c=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const h=(c[1]||"").toLowerCase(),f=e[h]||h,p=ne.size&&(ne.get(f)||ne.get(String(f).toLowerCase()))||f;try{await it(p)}catch(d){console.warn("[codeblocksManager] registerLanguage failed",d)}try{he.highlightElement(o)}catch(d){console.warn("[codeblocksManager] hljs.highlightElement failed",d)}}else try{const h=o.textContent||"";try{if(he&&typeof he.getLanguage=="function"&&he.getLanguage("plaintext")){const f=he.highlight(h,{language:"plaintext"});f&&f.value&&(o.innerHTML=f.value)}}catch{try{he.highlightElement(o)}catch(p){console.warn("[codeblocksManager] fallback highlightElement failed",p)}}}catch(h){console.warn("[codeblocksManager] auto-detect plaintext failed",h)}}catch(l){console.warn("[codeblocksManager] observer entry processing failed",l)}})()})},{root:null,rootMargin:"300px",threshold:.1}),zt)),r=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!s){r.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",u=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const o=(u[1]||"").toLowerCase(),l=e[o]||o,c=ne.size&&(ne.get(l)||ne.get(String(l).toLowerCase()))||l;try{await it(c)}catch(h){console.warn("[codeblocksManager] registerLanguage failed (no observer)",h)}}try{he.highlightElement(i)}catch(o){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",o)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function Wi(t,{useCdn:e=!0}={}){const n=document.querySelector("link[data-hl-theme]");n&&n.remove();let s=t||"monokai";if(s==="monokai")return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load from CDN");return}const r=`https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/${s}.css`,i=document.createElement("link");i.rel="stylesheet",i.href=r,i.setAttribute("data-hl-theme",s),document.head.appendChild(i)}let gt="light";function Zi(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const n=document.createElement("link");n.rel="stylesheet",n.href=t,Object.entries(e).forEach(([s,r])=>n.setAttribute(s,r)),document.head.appendChild(n)}async function Jn(t="none",e="/"){if(!t||t==="none")return;const n=[e+"bulma.css","/bulma.css"],s=Array.from(new Set(n));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const r of s)try{const i=await fetch(r,{method:"GET"});if(i.ok){const a=await i.text(),u=document.createElement("style");u.setAttribute("data-bulma-override",r),u.appendChild(document.createTextNode(`
/* bulma override: ${r} */
`+a)),document.head.appendChild(u);return}}catch(i){console.warn("[bulmaManager] fetch local bulma candidate failed",i)}return}try{const r=String(t).trim();if(!r)return;const i=`https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;Zi(i,{"data-bulmaswatch-theme":r})}catch(r){console.warn("[bulmaManager] ensureBulma failed",r)}}function er(t){gt=t==="dark"?"dark":"light",document.documentElement.setAttribute("data-theme",gt),gt==="dark"?document.body.classList.add("is-dark"):document.body.classList.remove("is-dark")}function Gi(t){const e=document.documentElement;for(const[n,s]of Object.entries(t||{}))try{e.style.setProperty(`--${n}`,s)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function tr(t){if(!t||!(t instanceof HTMLElement))return()=>{};const e=()=>{gt==="dark"?(t.classList.add("is-dark"),t.classList.remove("is-light")):(t.classList.add("is-light"),t.classList.remove("is-dark"))};e();const n=new MutationObserver(()=>{gt=document.documentElement.getAttribute("data-theme")==="dark"?"dark":"light",e()});try{n.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}catch{}return()=>{try{n.disconnect()}catch{}}}const nr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},st=JSON.parse(JSON.stringify(nr));let Bt="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";Bt=String(t).split("-")[0].toLowerCase()}nr[Bt]||(Bt="en");let Ze=Bt;function at(t,e={}){const n=st[Ze]||st.en;let s=n&&n[t]?n[t]:st.en[t]||"";for(const r of Object.keys(e))s=s.replace(new RegExp(`{${r}}`,"g"),String(e[r]));return s}async function dn(t,e){if(!t)return;let n=t;try{/^https?:\/\//.test(t)||(n=new URL(t,location.origin+e).toString());const s=await fetch(n);if(!s.ok)return;const r=await s.json();for(const i of Object.keys(r||{}))st[i]=Object.assign({},st[i]||{},r[i])}catch{}}function fn(t){const e=String(t).split("-")[0].toLowerCase();Ze=st[e]?e:"en"}const Qi=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Ze},loadL10nFile:dn,setLang:fn,t:at},Symbol.toStringTag,{value:"Module"})),Xi=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function rr(t,e="worker"){let n=null;function s(){if(!n)try{const u=t();n=u||null,u&&u.addEventListener("error",()=>{try{n===u&&(n=null,u.terminate&&u.terminate())}catch(o){console.warn("["+e+"] worker termination failed",o)}})}catch(u){n=null,console.warn("["+e+"] worker init failed",u)}return n}function r(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(u){console.warn("["+e+"] worker termination failed",u)}}function i(u,o=1e3){return new Promise((l,c)=>{const h=s();if(!h)return c(new Error("worker unavailable"));const f=String(Math.random());u.id=f;let p=null;const d=()=>{p&&clearTimeout(p),h.removeEventListener("message",g),h.removeEventListener("error",w)},g=y=>{const x=y.data||{};x.id===f&&(d(),x.error?c(new Error(x.error)):l(x.result))},w=y=>{d(),console.warn("["+e+"] worker error event",y);try{n===h&&(n=null,h.terminate&&h.terminate())}catch(x){console.warn("["+e+"] worker termination failed",x)}c(new Error(y&&y.message||"worker error"))};p=setTimeout(()=>{d(),console.warn("["+e+"] worker timed out");try{n===h&&(n=null,h.terminate&&h.terminate())}catch(y){console.warn("["+e+"] worker termination on timeout failed",y)}c(new Error("worker timeout"))},o),h.addEventListener("message",g),h.addEventListener("error",w);try{h.postMessage(u)}catch(y){d(),c(y)}})}return{get:s,send:i,terminate:r}}function Ki(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),n=URL.createObjectURL(e);return new Worker(n,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const Be=new Set;function pn(t){Yi(),Be.clear();for(const e of Me)e&&Be.add(e);ir(J),ir(H),pn._refreshed=!0}function ir(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&Be.add(e)}function sr(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(n,s){return s&&Be.add(s),e.call(this,n,s)}}let ar=!1;function Yi(){ar||(sr(J),sr(H),ar=!0)}function or(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function ge(t){return String(t||"").replace(/^[.\/]+/,"")}function mt(t){return String(t||"").replace(/\/+$/,"")}function wt(t){return mt(t)+"/"}function Vi(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=t,document.head.appendChild(n)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function Nt(t,e=0,n=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const s=Array.from(t.querySelectorAll("img"));if(!s.length)return;const r=t,i=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,u=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=i?Math.max(a,i.top):a,c=(i?Math.min(u,i.bottom):u)+Number(e||0);let h=0;r&&(h=r.clientHeight||(i?i.height:0)),h||(h=u-a);let f=.6;try{const w=r&&window.getComputedStyle?window.getComputedStyle(r):null,y=w&&w.getPropertyValue("--nimbi-image-max-height-ratio"),x=y?parseFloat(y):NaN;!Number.isNaN(x)&&x>0&&x<=1&&(f=x)}catch(w){console.warn("[helpers] read CSS ratio failed",w)}const p=Math.max(200,Math.floor(h*f));let d=!1,g=null;if(s.forEach(w=>{try{const y=w.getAttribute?w.getAttribute("loading"):void 0;y!=="eager"&&w.setAttribute&&w.setAttribute("loading","lazy");const x=w.getBoundingClientRect?w.getBoundingClientRect():null,P=w.src||w.getAttribute&&w.getAttribute("src"),M=x&&x.height>1?x.height:p,_=x?x.top:0,I=_+M;x&&M>0&&_<=c&&I>=o&&(w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high"),Vi(P),d=!0),!g&&x&&x.top<=c&&(g={img:w,src:P,rect:x,beforeLoading:y})}catch(y){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",y)}}),!d&&g){const{img:w,src:y,rect:x,beforeLoading:P}=g;try{w.setAttribute?(w.setAttribute("loading","eager"),w.setAttribute("fetchpriority","high"),w.setAttribute("data-eager-by-nimbi","1")):(w.loading="eager",w.fetchPriority="high")}catch(M){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",M)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function Ot(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Ot)}catch(t){console.warn("[helpers] global attach failed",t)}const J=new Map;let Ce=[],gn=!1;function Ji(t){gn=!!t}function lr(t){Ce=Array.isArray(t)?t.slice():[]}function es(){return Ce}const cr=rr(()=>Ki(Xi),"slugManager");function mn(){return cr.get()}function ur(t){return cr.send(t)}async function ts(t,e=1,n=void 0){if(!mn())return Ft(t,e,n);try{return await ur({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:n})}catch(r){try{return await Ft(t,e,n)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),r}}}async function ns(t,e,n){return mn()?ur({type:"crawlForSlug",slug:t,base:e,maxQueue:n}):yn(t,e,n)}function Ge(t,e){if(t)if(Ce&&Ce.length){const s=e.split("/")[0],r=Ce.includes(s);let i=J.get(t);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),r?i.langs[s]=e:i.default=e,J.set(t,i)}else J.set(t,e)}const Dt=new Set;function rs(t){typeof t=="function"&&Dt.add(t)}function is(t){typeof t=="function"&&Dt.delete(t)}const H=new Map;let wn={},Me=[],ot="_404.md",lt="_home.md";function bn(t){t!=null&&(ot=String(t||""))}function ss(t){t!=null&&(lt=String(t||""))}function as(t){wn=t||{}}const bt=new Map,Ht=new Set;function os(){bt.clear(),Ht.clear()}function ls(t){if(!t||t.length===0)return"";let e=t[0];for(let s=1;s<t.length;s++){const r=t[s];let i=0;const a=Math.min(e.length,r.length);for(;i<a&&e[i]===r[i];)i++;e=e.slice(0,i)}const n=e.lastIndexOf("/");return n===-1?e:e.slice(0,n+1)}function Ut(t){J.clear(),H.clear(),Me=[],Ce=Ce||[];const e=Object.keys(wn||{});if(!e.length)return;let n="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?n=new URL(String(t)).pathname:n=String(t||"")}catch(s){n=String(t||""),console.warn("[slugManager] parse contentBase failed",s)}n=wt(n)}}catch(s){n="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}n||(n=ls(e));for(const s of e){let r=s;n&&s.startsWith(n)?r=ge(s.slice(n.length)):r=ge(s),Me.push(r);try{pn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=wn[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const u=le(a[1].trim());if(u)try{if(Ce&&Ce.length){const l=r.split("/")[0],c=Ce.includes(l);let h=J.get(u);(!h||typeof h=="string")&&(h={default:typeof h=="string"?h:void 0,langs:{}}),c?h.langs[l]=r:h.default=r,J.set(u,h)}else J.set(u,r);H.set(r,u)}catch(o){console.warn("[slugManager] set slug mapping failed",o)}}}}}try{Ut()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function le(t){let n=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function cs(t){return yt(t,void 0)}function yt(t,e){if(!t)return!1;if(t.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(t)){if(e&&typeof e=="string")try{const n=new URL(t),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(t.startsWith("/")&&e&&typeof e=="string")try{const n=new URL(t,e),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!1}function qt(t){return t==null?t:String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(e,n)=>n)}function kt(t){if(!t||!J.has(t))return null;const e=J.get(t);if(!e)return null;if(typeof e=="string")return e;if(Ce&&Ce.length&&Ze&&e.langs&&e.langs[Ze])return e.langs[Ze];if(e.default)return e.default;if(e.langs){const n=Object.keys(e.langs);if(n.length)return e.langs[n[0]]}return null}const xt=new Map;function us(){xt.clear()}let Se=async function(t,e){if(!t)throw new Error("path required");try{const i=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&J.has(i)){const a=kt(i)||J.get(i);a&&a!==t&&(t=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const n=e==null?"":mt(String(e));let s="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else if(n.startsWith("/"))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=n.startsWith("/")?n:"/"+n;s=i+a.replace(/\/$/,"")+"/"+t.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+t.replace(/^\//,"")}catch{s="/"+t.replace(/^\//,"")}if(xt.has(s))return xt.get(s);const r=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const h=`${n}/${ot}`,f=await globalThis.fetch(h);if(f&&typeof f.ok=="boolean"&&f.ok)return{raw:await f.text(),status:404}}catch(h){console.warn("[slugManager] fetching fallback 404 failed",h)}let c="";try{i&&typeof i.clone=="function"?c=await i.clone().text():i&&typeof i.text=="function"?c=await i.text():c=""}catch(h){c="",console.warn("[slugManager] reading error body failed",h)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:c.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),u=a.trim().slice(0,16).toLowerCase(),o=u.startsWith("<!doctype")||u.startsWith("<html"),l=o||String(t||"").toLowerCase().endsWith(".html");if(o&&String(t||"").toLowerCase().endsWith(".md")){try{const c=`${n}/${ot}`,h=await globalThis.fetch(c);if(h.ok)return{raw:await h.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return l?{raw:a,isHtml:!0}:{raw:a}})();return xt.set(s,r),r};function hs(t){typeof t=="function"&&(Se=t)}const jt=new Map;function ds(t){if(!t||typeof t!="string")return"";let e=t.replace(/```[\s\S]*?```/g,"");return e=e.replace(/<pre[\s\S]*?<\/pre>/gi,""),e=e.replace(/<code[\s\S]*?<\/code>/gi,""),e=e.replace(/<!--([\s\S]*?)-->/g,""),e=e.replace(/^ {4,}.*$/gm,""),e=e.replace(/`[^`]*`/g,""),e}let qe=[],St=null;async function Ft(t,e=1,n=void 0){const s=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>ge(String(r||""))))):[];try{const r=ge(String(ot||""));r&&!s.includes(r)&&s.push(r)}catch{}if(qe&&qe.length&&e===1&&!qe.some(i=>{try{return s.includes(ge(String(i.path||"")))}catch{return!1}}))return qe;if(St)return St;St=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(l=>ge(String(l||""))))):[];try{const l=ge(String(ot||""));l&&!r.includes(l)&&r.push(l)}catch{}const i=l=>{if(!r||!r.length)return!1;for(const c of r)if(c&&(l===c||l.startsWith(c+"/")))return!0;return!1};let a=[];if(Me&&Me.length&&(a=Array.from(Me)),!a.length)for(const l of J.values())l&&a.push(l);try{const l=await pr(t);l&&l.length&&(a=a.concat(l))}catch(l){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",l)}try{const l=new Set(a),c=[...a];for(l.size;c.length&&l.size<=vt;){const h=c.shift();try{const f=await Se(h,t);if(f&&f.raw){if(f.status===404)continue;let p=f.raw;const d=[],g=String(h||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(g)&&gn&&(!h||!h.includes("/")))continue;const w=ds(p),y=/\[[^\]]+\]\(([^)]+)\)/g;let x;for(;x=y.exec(w);)d.push(x[1]);const P=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;x=P.exec(w);)d.push(x[1]);const M=h&&h.includes("/")?h.substring(0,h.lastIndexOf("/")+1):"";for(let _ of d)try{if(yt(_,t)||_.startsWith("..")||_.indexOf("/../")!==-1||(M&&!_.startsWith("./")&&!_.startsWith("/")&&!_.startsWith("../")&&(_=M+_),_=ge(_),!/\.(md|html?)(?:$|[?#])/i.test(_))||(_=_.split(/[?#]/)[0],i(_)))continue;l.has(_)||(l.add(_),c.push(_),a.push(_))}catch(I){console.warn("[slugManager] href processing failed",_,I)}}}catch(f){console.warn("[slugManager] discovery fetch failed for",h,f)}}}catch(l){console.warn("[slugManager] discovery loop failed",l)}const u=new Set;a=a.filter(l=>!l||u.has(l)||i(l)?!1:(u.add(l),!0));const o=[];for(const l of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(l))try{const c=await Se(l,t);if(c&&c.raw){if(c.status===404)continue;let h="",f="";if(c.isHtml)try{const g=new DOMParser().parseFromString(c.raw,"text/html"),w=g.querySelector("title")||g.querySelector("h1");w&&w.textContent&&(h=w.textContent.trim());const y=g.querySelector("p");if(y&&y.textContent&&(f=y.textContent.trim()),e>=2)try{const x=g.querySelector("h1"),P=x&&x.textContent?x.textContent.trim():h||"",M=(()=>{try{if(H.has(l))return H.get(l)}catch{}return le(h||l)})(),_=Array.from(g.querySelectorAll("h2"));for(const I of _)try{const q=(I.textContent||"").trim();if(!q)continue;const X=I.id?I.id:le(q),oe=M?`${M}::${X}`:`${le(l)}::${X}`;let W="",U=I.nextElementSibling;for(;U&&U.tagName&&U.tagName.toLowerCase()==="script";)U=U.nextElementSibling;U&&U.textContent&&(W=String(U.textContent).trim()),o.push({slug:oe,title:q,excerpt:W,path:l,parentTitle:P})}catch(q){console.warn("[slugManager] indexing H2 failed",q)}if(e===3)try{const I=Array.from(g.querySelectorAll("h3"));for(const q of I)try{const X=(q.textContent||"").trim();if(!X)continue;const oe=q.id?q.id:le(X),W=M?`${M}::${oe}`:`${le(l)}::${oe}`;let U="",K=q.nextElementSibling;for(;K&&K.tagName&&K.tagName.toLowerCase()==="script";)K=K.nextElementSibling;K&&K.textContent&&(U=String(K.textContent).trim()),o.push({slug:W,title:X,excerpt:U,path:l,parentTitle:P})}catch(X){console.warn("[slugManager] indexing H3 failed",X)}}catch(I){console.warn("[slugManager] collect H3s failed",I)}}catch(x){console.warn("[slugManager] collect H2s failed",x)}}catch(d){console.warn("[slugManager] parsing HTML for index failed",d)}else{const d=c.raw,g=d.match(/^#\s+(.+)$/m);h=g?g[1].trim():"";try{h=qt(h)}catch{}const w=d.split(/\r?\n\s*\r?\n/);if(w.length>1)for(let y=1;y<w.length;y++){const x=w[y].trim();if(x&&!/^#/.test(x)){f=x.replace(/\r?\n/g," ");break}}if(e>=2){let y="",x="";try{const P=(d.match(/^#\s+(.+)$/m)||[])[1];y=P?P.trim():"",x=(function(){try{if(H.has(l))return H.get(l)}catch{}return le(h||l)})();const M=/^##\s+(.+)$/gm;let _;for(;_=M.exec(d);)try{const I=(_[1]||"").trim(),q=qt(I);if(!I)continue;const X=le(I),oe=x?`${x}::${X}`:`${le(l)}::${X}`,U=d.slice(M.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),K=U&&U[1]?String(U[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:oe,title:q,excerpt:K,path:l,parentTitle:y})}catch(I){console.warn("[slugManager] indexing markdown H2 failed",I)}}catch(P){console.warn("[slugManager] collect markdown H2s failed",P)}if(e===3)try{const P=/^###\s+(.+)$/gm;let M;for(;M=P.exec(d);)try{const _=(M[1]||"").trim(),I=qt(_);if(!_)continue;const q=le(_),X=x?`${x}::${q}`:`${le(l)}::${q}`,W=d.slice(P.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),U=W&&W[1]?String(W[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:X,title:I,excerpt:U,path:l,parentTitle:y})}catch(_){console.warn("[slugManager] indexing markdown H3 failed",_)}}catch(P){console.warn("[slugManager] collect markdown H3s failed",P)}}}let p="";try{H.has(l)&&(p=H.get(l))}catch(d){console.warn("[slugManager] mdToSlug access failed",d)}p||(p=le(h||l)),o.push({slug:p,title:h,excerpt:f,path:l})}}catch(c){console.warn("[slugManager] buildSearchIndex: entry fetch failed",c)}try{qe=o.filter(c=>{try{return!i(String(c.path||""))}catch{return!0}})}catch(l){console.warn("[slugManager] filtering index by excludes failed",l),qe=o}return qe})();try{await St}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return St=null,qe}const hr=1e3;let vt=hr;function fs(t){typeof t=="number"&&t>=0&&(vt=t)}const dr=new DOMParser,fr="a[href]";let yn=async function(t,e,n=vt){if(jt.has(t))return jt.get(t);let s=null;const r=new Set,i=[""];for(;i.length&&!s&&!(i.length>n);){const a=i.shift();if(r.has(a))continue;r.add(a);let u=e;u.endsWith("/")||(u+="/"),u+=a;try{let o;try{o=await globalThis.fetch(u)}catch(f){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:u,error:f});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:u,status:o.status});continue}const l=await o.text(),h=dr.parseFromString(l,"text/html").querySelectorAll(fr);for(const f of h)try{let p=f.getAttribute("href")||"";if(!p||yt(p,e)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const d=a+p;r.has(d)||i.push(d);continue}if(p.toLowerCase().endsWith(".md")){const d=ge(a+p);try{if(H.has(d))continue;for(const g of J.values());}catch(g){console.warn("[slugManager] slug map access failed",g)}try{const g=await Se(d,e);if(g&&g.raw){const w=(g.raw||"").match(/^#\s+(.+)$/m);if(w&&w[1]&&le(w[1].trim())===t){s=d;break}}}catch(g){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",g)}}}catch(p){console.warn("[slugManager] crawlForSlug: link iteration failed",p)}}catch(o){console.warn("[slugManager] crawlForSlug: directory fetch failed",o)}}return jt.set(t,s),s};async function pr(t,e=vt){const n=new Set,s=new Set,r=[""];for(;r.length&&!(r.length>e);){const i=r.shift();if(s.has(i))continue;s.add(i);let a=t;a.endsWith("/")||(a+="/"),a+=i;try{let u;try{u=await globalThis.fetch(a)}catch(h){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:h});continue}if(!u||!u.ok){u&&!u.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:u.status});continue}const o=await u.text(),c=dr.parseFromString(o,"text/html").querySelectorAll(fr);for(const h of c)try{let f=h.getAttribute("href")||"";if(!f||yt(f,t)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const d=i+f;s.has(d)||r.push(d);continue}const p=(i+f).replace(/^\/+/,"");/\.(md|html?)$/i.test(p)&&n.add(p)}catch(f){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",f)}}catch(u){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",u)}}return Array.from(n)}async function gr(t,e,n){if(t&&typeof t=="string"&&(t=ge(t),t=mt(t)),J.has(t))return kt(t)||J.get(t);for(const r of Dt)try{const i=await r(t,e);if(i)return Ge(t,i),H.set(i,t),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(Me&&Me.length){if(bt.has(t)){const r=bt.get(t);return J.set(t,r),H.set(r,t),r}for(const r of Me)if(!Ht.has(r))try{const i=await Se(r,e);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const u=le(a[1].trim());if(Ht.add(r),u&&bt.set(u,r),u===t)return Ge(t,r),H.set(r,t),r}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const r=await Ft(e);if(r&&r.length){const i=r.find(a=>a.slug===t);if(i)return Ge(t,i.path),H.set(i.path,t),i.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await yn(t,e,n);if(r)return Ge(t,r),H.set(r,t),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const s=[`${t}.html`,`${t}.md`];for(const r of s)try{const i=await Se(r,e);if(i&&i.raw)return Ge(t,r),H.set(r,t),r}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(Me&&Me.length)for(const r of Me)try{const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(i)===t)return Ge(t,r),H.set(r,t),r}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const r=[];lt&&typeof lt=="string"&&lt.trim()&&r.push(lt),r.includes("_home.md")||r.push("_home.md");for(const i of r)try{const a=await Se(i,e);if(a&&a.raw){const u=(a.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]&&le(u[1].trim())===t)return Ge(t,i),H.set(i,t),i}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const Wt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:hr,_setAllMd:as,_storeSlugMapping:Ge,addSlugResolver:rs,get allMarkdownPaths(){return Me},get availableLanguages(){return Ce},buildSearchIndex:Ft,buildSearchIndexWorker:ts,clearFetchCache:us,clearListCaches:os,crawlAllMarkdown:pr,crawlCache:jt,crawlForSlug:yn,crawlForSlugWorker:ns,get defaultCrawlMaxQueue(){return vt},ensureSlug:gr,fetchCache:xt,get fetchMarkdown(){return Se},getLanguages:es,get homePage(){return lt},initSlugWorker:mn,isExternalLink:cs,isExternalLinkWithBase:yt,listPathsFetched:Ht,listSlugCache:bt,mdToSlug:H,get notFoundPage(){return ot},removeSlugResolver:is,resolveSlugPath:kt,get searchIndex(){return qe},setContentBase:Ut,setDefaultCrawlMaxQueue:fs,setFetchMarkdown:hs,setHomePage:ss,setLanguages:lr,setNotFoundPage:bn,setSkipRootReadme:Ji,get skipRootReadme(){return gn},slugResolvers:Dt,slugToMd:J,slugify:le,unescapeMarkdown:qt},Symbol.toStringTag,{value:"Module"}));let mr=100;function wr(t){mr=t}let Et=300*1e3;function br(t){Et=t}const $e=new Map;function ps(t){if(!$e.has(t))return;const e=$e.get(t),n=Date.now();if(e.ts+Et<n){$e.delete(t);return}return $e.delete(t),$e.set(t,e),e.value}function gs(t,e){if(yr(),yr(),$e.delete(t),$e.set(t,{value:e,ts:Date.now()}),$e.size>mr){const n=$e.keys().next().value;n!==void 0&&$e.delete(n)}}function yr(){if(!Et||Et<=0)return;const t=Date.now();for(const[e,n]of $e.entries())n.ts+Et<t&&$e.delete(e)}async function ms(t,e){const n=new Set(Be),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(s||[])){const i=r.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const u=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(u){let l=ge(u[1]);l&&n.add(l);continue}const o=a.pathname||"";if(o){const l=new URL(e),c=wt(l.pathname);if(o.indexOf(c)!==-1){let h=o.startsWith(c)?o.slice(c.length):o;h=ge(h),h&&n.add(h)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const i=await Se(r,e);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const u=(a[1]||"").trim();if(u&&le(u)===t)return r}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function ws(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const n=decodeURIComponent(String(t||""));if(J.has(n)){const s=kt(n)||J.get(n);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||e.push(s):(e.push(s),e.push(s+".html")))}else{if(Be&&Be.size)for(const s of Be){const r=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(r)===n&&!/index\.html$/i.test(s)){e.push(s);break}}!e.length&&n&&!/\.(md|html?)$/i.test(n)&&(e.push(n+".html"),e.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return e}async function bs(t,e){const n=t||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=t||"",i=null;if(r&&String(r).includes("::")){const d=String(r).split("::",2);r=d[0],i=d[1]||null}const u=`${t}|||${typeof Qi<"u"&&Ze?Ze:""}`,o=ps(u);if(o)r=o.resolved,i=o.anchor||i;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let d=decodeURIComponent(String(r||""));if(d&&typeof d=="string"&&(d=ge(d),d=mt(d)),J.has(d))r=kt(d)||J.get(d);else{let g=await ms(d,e);if(g)r=g;else if(pn._refreshed&&Be&&Be.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const w=await gr(d,e);w&&(r=w)}}}gs(u,{resolved:r,anchor:i})}!i&&s&&(i=s);const l=ws(r),c=String(n||"").includes(".md")||String(n||"").includes(".html");if(c&&l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===1&&/index\.html$/i.test(l[0])&&!c&&!J.has(r)&&!J.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let h=null,f=null,p=null;for(const d of l)if(d)try{const g=ge(d);h=await Se(g,e),f=g;break}catch(g){p=g;try{console.warn("[router] candidate fetch failed",{candidate:d,contentBase:e,err:g&&g.message||g})}catch{}}if(!h){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:l,contentBase:e,fetchError:p&&(p.message||String(p))||null})}catch{}try{if(c&&String(n||"").toLowerCase().includes(".html"))try{const d=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",d);const g=await fetch(d);if(g&&g.ok){const w=await g.text(),y=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",x=(w||"").toLowerCase(),P=y&&y.indexOf&&y.indexOf("text/html")!==-1||x.indexOf("<!doctype")!==-1||x.indexOf("<html")!==-1;if(P||console.warn("[router] absolute fetch returned non-HTML",{abs:d,contentType:y,snippet:x.slice(0,200)}),P)try{const M=d,_=new URL(".",M).toString();try{const q=typeof DOMParser<"u"?new DOMParser:null;if(q){const X=q.parseFromString(w||"","text/html"),oe=(Y,ee)=>{try{const F=ee.getAttribute(Y)||"";if(!F||/^(https?:)?\/\//i.test(F)||F.startsWith("/")||F.startsWith("#"))return;try{const k=new URL(F,M).toString();ee.setAttribute(Y,k)}catch(k){console.warn("[router] rewrite attribute failed",Y,k)}}catch(F){console.warn("[router] rewrite helper failed",F)}},W=X.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),U=[];for(const Y of Array.from(W||[]))try{const ee=Y.tagName?Y.tagName.toLowerCase():"";if(ee==="a")continue;if(Y.hasAttribute("src")){const F=Y.getAttribute("src");oe("src",Y);const k=Y.getAttribute("src");F!==k&&U.push({attr:"src",tag:ee,before:F,after:k})}if(Y.hasAttribute("href")&&ee==="link"){const F=Y.getAttribute("href");oe("href",Y);const k=Y.getAttribute("href");F!==k&&U.push({attr:"href",tag:ee,before:F,after:k})}if(Y.hasAttribute("href")&&ee!=="link"){const F=Y.getAttribute("href");oe("href",Y);const k=Y.getAttribute("href");F!==k&&U.push({attr:"href",tag:ee,before:F,after:k})}if(Y.hasAttribute("xlink:href")){const F=Y.getAttribute("xlink:href");oe("xlink:href",Y);const k=Y.getAttribute("xlink:href");F!==k&&U.push({attr:"xlink:href",tag:ee,before:F,after:k})}if(Y.hasAttribute("poster")){const F=Y.getAttribute("poster");oe("poster",Y);const k=Y.getAttribute("poster");F!==k&&U.push({attr:"poster",tag:ee,before:F,after:k})}if(Y.hasAttribute("srcset")){const v=(Y.getAttribute("srcset")||"").split(",").map(R=>R.trim()).filter(Boolean).map(R=>{const[E,b]=R.split(/\s+/,2);if(!E||/^(https?:)?\/\//i.test(E)||E.startsWith("/"))return R;try{const L=new URL(E,M).toString();return b?`${L} ${b}`:L}catch{return R}}).join(", ");Y.setAttribute("srcset",v)}}catch{}const K=X.documentElement&&X.documentElement.outerHTML?X.documentElement.outerHTML:w;try{U&&U.length&&console.warn("[router] rewritten asset refs",{abs:d,rewritten:U})}catch{}return{data:{raw:K,isHtml:!0},pagePath:String(n||""),anchor:i}}}catch{}let I=w;return/<base\s+[^>]*>/i.test(w)||(/<head[^>]*>/i.test(w)?I=w.replace(/(<head[^>]*>)/i,`$1<base href="${_}">`):I=`<base href="${_}">`+w),{data:{raw:I,isHtml:!0},pagePath:String(n||""),anchor:i}}catch{return{data:{raw:w,isHtml:!0},pagePath:String(n||""),anchor:i}}}}catch(d){console.warn("[router] absolute HTML fetch fallback failed",d)}}catch{}throw new Error("no page data")}return{data:h,pagePath:f,anchor:i}}function kn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var Ve=kn();function kr(t){Ve=t}var Je={exec:()=>null};function se(t,e=""){let n=typeof t=="string"?t:t.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(Le.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,e)};return s}var ys=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Le={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},ks=/^(?:[ \t]*(?:\n|$))+/,xs=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ss=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,At=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,vs=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,xn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,xr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Sr=se(xr).replace(/bull/g,xn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Es=se(xr).replace(/bull/g,xn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Sn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,As=/^[^\n]+/,vn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Rs=se(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",vn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ls=se(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,xn).getRegex(),Zt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",En=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ts=se("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",En).replace("tag",Zt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),vr=se(Sn).replace("hr",At).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zt).getRegex(),Cs=se(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",vr).getRegex(),An={blockquote:Cs,code:xs,def:Rs,fences:Ss,heading:vs,hr:At,html:Ts,lheading:Sr,list:Ls,newline:ks,paragraph:vr,table:Je,text:As},Er=se("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",At).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zt).getRegex(),Ms={...An,lheading:Es,table:Er,paragraph:se(Sn).replace("hr",At).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Er).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Zt).getRegex()},_s={...An,html:se(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",En).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Je,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:se(Sn).replace("hr",At).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Sr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},$s=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ps=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ar=/^( {2,}|\\)\n(?!\s*$)/,Is=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Gt=/[\p{P}\p{S}]/u,Rn=/[\s\p{P}\p{S}]/u,Rr=/[^\s\p{P}\p{S}]/u,zs=se(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Rn).getRegex(),Lr=/(?!~)[\p{P}\p{S}]/u,Bs=/(?!~)[\s\p{P}\p{S}]/u,Ns=/(?:[^\s\p{P}\p{S}]|~)/u,Tr=/(?![*_])[\p{P}\p{S}]/u,Os=/(?![*_])[\s\p{P}\p{S}]/u,Ds=/(?:[^\s\p{P}\p{S}]|[*_])/u,Hs=se(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ys?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Cr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Us=se(Cr,"u").replace(/punct/g,Gt).getRegex(),qs=se(Cr,"u").replace(/punct/g,Lr).getRegex(),Mr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",js=se(Mr,"gu").replace(/notPunctSpace/g,Rr).replace(/punctSpace/g,Rn).replace(/punct/g,Gt).getRegex(),Fs=se(Mr,"gu").replace(/notPunctSpace/g,Ns).replace(/punctSpace/g,Bs).replace(/punct/g,Lr).getRegex(),Ws=se("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Rr).replace(/punctSpace/g,Rn).replace(/punct/g,Gt).getRegex(),Zs=se(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Tr).getRegex(),Gs="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Qs=se(Gs,"gu").replace(/notPunctSpace/g,Ds).replace(/punctSpace/g,Os).replace(/punct/g,Tr).getRegex(),Xs=se(/\\(punct)/,"gu").replace(/punct/g,Gt).getRegex(),Ks=se(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ys=se(En).replace("(?:-->|$)","-->").getRegex(),Vs=se("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ys).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Qt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Js=se(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Qt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),_r=se(/^!?\[(label)\]\[(ref)\]/).replace("label",Qt).replace("ref",vn).getRegex(),$r=se(/^!?\[(ref)\](?:\[\])?/).replace("ref",vn).getRegex(),ea=se("reflink|nolink(?!\\()","g").replace("reflink",_r).replace("nolink",$r).getRegex(),Pr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Ln={_backpedal:Je,anyPunctuation:Xs,autolink:Ks,blockSkip:Hs,br:Ar,code:Ps,del:Je,delLDelim:Je,delRDelim:Je,emStrongLDelim:Us,emStrongRDelimAst:js,emStrongRDelimUnd:Ws,escape:$s,link:Js,nolink:$r,punctuation:zs,reflink:_r,reflinkSearch:ea,tag:Vs,text:Is,url:Je},ta={...Ln,link:se(/^!?\[(label)\]\((.*?)\)/).replace("label",Qt).getRegex(),reflink:se(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Qt).getRegex()},Tn={...Ln,emStrongRDelimAst:Fs,emStrongLDelim:qs,delLDelim:Zs,delRDelim:Qs,url:se(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Pr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:se(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Pr).getRegex()},na={...Tn,br:se(Ar).replace("{2,}","*").getRegex(),text:se(Tn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Xt={normal:An,gfm:Ms,pedantic:_s},Rt={normal:Ln,gfm:Tn,breaks:na,pedantic:ta},ra={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Ir=t=>ra[t];function Ne(t,e){if(e){if(Le.escapeTest.test(t))return t.replace(Le.escapeReplace,Ir)}else if(Le.escapeTestNoEncode.test(t))return t.replace(Le.escapeReplaceNoEncode,Ir);return t}function zr(t){try{t=encodeURI(t).replace(Le.percentDecode,"%")}catch{return null}return t}function Br(t,e){let n=t.replace(Le.findPipe,(i,a,u)=>{let o=!1,l=a;for(;--l>=0&&u[l]==="\\";)o=!o;return o?"|":" |"}),s=n.split(Le.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(Le.slashPipe,"|");return s}function Lt(t,e,n){let s=t.length;if(s===0)return"";let r=0;for(;r<s&&t.charAt(s-r-1)===e;)r++;return t.slice(0,s-r)}function ia(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])n++;else if(t[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function sa(t,e=0){let n=e,s="";for(let r of t)if(r==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=r,n++;return s}function Nr(t,e,n,s,r){let i=e.href,a=e.title||null,u=t[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let o={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:u,tokens:s.inlineTokens(u)};return s.state.inLink=!1,o}function aa(t,e,n){let s=t.match(n.other.indentCodeCompensation);if(s===null)return e;let r=s[1];return e.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[u]=a;return u.length>=r.length?i.slice(r.length):i}).join(`
`)}var Kt=class{options;rules;lexer;constructor(t){this.options=t||Ve}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Lt(n,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],s=aa(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let s=Lt(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Lt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=Lt(e[0],`
`).split(`
`),s="",r="",i=[];for(;n.length>0;){let a=!1,u=[],o;for(o=0;o<n.length;o++)if(this.rules.other.blockquoteStart.test(n[o]))u.push(n[o]),a=!0;else if(!a)u.push(n[o]);else break;n=n.slice(o);let l=u.join(`
`),c=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${l}`:l,r=r?`${r}
${c}`:c;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,i,!0),this.lexer.state.top=h,n.length===0)break;let f=i.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let p=f,d=p.raw+`
`+n.join(`
`),g=this.blockquote(d);i[i.length-1]=g,s=s.substring(0,s.length-p.raw.length)+g.raw,r=r.substring(0,r.length-p.text.length)+g.text;break}else if(f?.type==="list"){let p=f,d=p.raw+`
`+n.join(`
`),g=this.list(d);i[i.length-1]=g,s=s.substring(0,s.length-f.raw.length)+g.raw,r=r.substring(0,r.length-p.raw.length)+g.raw,n=d.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;t;){let o=!1,l="",c="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;l=e[0],t=t.substring(l.length);let h=sa(e[2].split(`
`,1)[0],e[1].length),f=t.split(`
`,1)[0],p=!h.trim(),d=0;if(this.options.pedantic?(d=2,c=h.trimStart()):p?d=e[1].length+1:(d=h.search(this.rules.other.nonSpaceChar),d=d>4?1:d,c=h.slice(d),d+=e[1].length),p&&this.rules.other.blankLine.test(f)&&(l+=f+`
`,t=t.substring(f.length+1),o=!0),!o){let g=this.rules.other.nextBulletRegex(d),w=this.rules.other.hrRegex(d),y=this.rules.other.fencesBeginRegex(d),x=this.rules.other.headingBeginRegex(d),P=this.rules.other.htmlBeginRegex(d),M=this.rules.other.blockquoteBeginRegex(d);for(;t;){let _=t.split(`
`,1)[0],I;if(f=_,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),I=f):I=f.replace(this.rules.other.tabCharGlobal,"    "),y.test(f)||x.test(f)||P.test(f)||M.test(f)||g.test(f)||w.test(f))break;if(I.search(this.rules.other.nonSpaceChar)>=d||!f.trim())c+=`
`+I.slice(d);else{if(p||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||y.test(h)||x.test(h)||w.test(h))break;c+=`
`+f}p=!f.trim(),l+=_+`
`,t=t.substring(_.length+1),h=I.slice(d)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(a=!0)),r.items.push({type:"list_item",raw:l,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),r.raw+=l}let u=r.items.at(-1);if(u)u.raw=u.raw.trimEnd(),u.text=u.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let o of r.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let l=this.rules.other.listTaskCheckbox.exec(o.raw);if(l){let c={type:"checkbox",raw:l[0]+" ",checked:l[0]!=="[ ]"};o.checked=c.checked,r.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=c.raw+o.tokens[0].raw,o.tokens[0].text=c.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(c)):o.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):o.tokens.unshift(c)}}if(!r.loose){let l=o.tokens.filter(h=>h.type==="space"),c=l.length>0&&l.some(h=>this.rules.other.anyLine.test(h.raw));r.loose=c}}if(r.loose)for(let o of r.items){o.loose=!0;for(let l of o.tokens)l.type==="text"&&(l.type="paragraph")}return r}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:r}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=Br(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(Br(a,i.header.length).map((u,o)=>({text:u,tokens:this.lexer.inline(u),header:!1,align:i.align[o]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=Lt(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=ia(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Nr(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return Nr(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,u=r,o=0,l=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,e=e.slice(-1*t.length+r);(s=l.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){u+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){o+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u+o);let c=[...s[0]][0].length,h=t.slice(0,r+s.index+c+a);if(Math.min(r,a)%2){let p=h.slice(1,-1);return{type:"em",raw:h,text:p,tokens:this.lexer.inlineTokens(p)}}let f=h.slice(2,-2);return{type:"strong",raw:h,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,u=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,e=e.slice(-1*t.length+r);(s=o.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){u+=a;continue}if(u-=a,u>0)continue;a=Math.min(a,a+u);let l=[...s[0]][0].length,c=t.slice(0,r+s.index+l+a),h=c.slice(r,-r);return{type:"del",raw:c,text:h,tokens:this.lexer.inlineTokens(h)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},Pe=class Qn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Ve,this.options.tokenizer=this.options.tokenizer||new Kt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Le,block:Xt.normal,inline:Rt.normal};this.options.pedantic?(n.block=Xt.pedantic,n.inline=Rt.pedantic):this.options.gfm&&(n.block=Xt.gfm,this.options.breaks?n.inline=Rt.breaks:n.inline=Rt.gfm),this.tokenizer.rules=n}static get rules(){return{block:Xt,inline:Rt}}static lex(e,n){return new Qn(n).lex(e)}static lexInline(e,n){return new Qn(n).inlineTokens(e)}lex(e){e=e.replace(Le.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(Le.tabCharGlobal,"    ").replace(Le.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
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
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=r[2]?r[2].length:0,s=s.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,u="";for(;e;){a||(u=""),a=!1;let o;if(this.options.extensions?.inline?.some(c=>(o=c.call({lexer:this},e,n))?(e=e.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let c=n.at(-1);o.type==="text"&&c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(e,s,u)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(e,s,u)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),n.push(o);continue}let l=e;if(this.options.extensions?.startInline){let c=1/0,h=e.slice(1),f;this.options.extensions.startInline.forEach(p=>{f=p.call({lexer:this},h),typeof f=="number"&&f>=0&&(c=Math.min(c,f))}),c<1/0&&c>=0&&(l=e.substring(0,c+1))}if(o=this.tokenizer.inlineText(l)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(u=o.raw.slice(-1)),a=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(e){let c="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},Yt=class{options;parser;constructor(t){this.options=t||Ve}space(t){return""}code({text:t,lang:e,escaped:n}){let s=(e||"").match(Le.notSpaceStart)?.[0],r=t.replace(Le.endingNewline,"")+`
`;return s?'<pre><code class="language-'+Ne(s)+'">'+(n?r:Ne(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:Ne(r,!0))+`</code></pre>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${Ne(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let s=this.parser.parseInline(n),r=zr(t);if(r===null)return s;t=r;let i='<a href="'+t+'"';return e&&(i+=' title="'+Ne(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=zr(t);if(r===null)return Ne(n);t=r;let i=`<img src="${t}" alt="${Ne(n)}"`;return e&&(i+=` title="${Ne(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:Ne(t.text)}},Cn=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},Ie=class Xn{options;renderer;textRenderer;constructor(e){this.options=e||Ve,this.options.renderer=this.options.renderer||new Yt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Cn}static parse(e,n){return new Xn(n).parse(e)}static parseInline(e,n){return new Xn(n).parseInline(e)}parse(e){let n="";for(let s=0;s<e.length;s++){let r=e[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,u=this.options.extensions.renderers[a.type].call({parser:this},a);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=u||"";continue}}let i=r;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,n=this.renderer){let s="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let u=this.options.extensions.renderers[i.type].call({parser:this},i);if(u!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=u||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let u='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(u),"";throw new Error(u)}}}return s}},Tt=class{options;block;constructor(t){this.options=t||Ve}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Pe.lex:Pe.lexInline}provideParser(){return this.block?Ie.parse:Ie.parseInline}},oa=class{defaults=kn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Ie;Renderer=Yt;TextRenderer=Cn;Lexer=Pe;Tokenizer=Kt;Hooks=Tt;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{let r=s;n=n.concat(this.walkTokens(r.items,e));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...a){let u=r.renderer.apply(this,a);return u===!1&&(u=i.apply(this,a)),u}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),n.renderer){let r=this.defaults.renderer||new Yt(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,u=n.renderer[a],o=r[a];r[a]=(...l)=>{let c=u.apply(r,l);return c===!1&&(c=o.apply(r,l)),c||""}}s.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Kt(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,u=n.tokenizer[a],o=r[a];r[a]=(...l)=>{let c=u.apply(r,l);return c===!1&&(c=o.apply(r,l)),c}}s.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new Tt;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,u=n.hooks[a],o=r[a];Tt.passThroughHooks.has(i)?r[a]=l=>{if(this.defaults.async&&Tt.passThroughHooksRespectAsync.has(i))return(async()=>{let h=await u.call(r,l);return o.call(r,h)})();let c=u.call(r,l);return o.call(r,c)}:r[a]=(...l)=>{if(this.defaults.async)return(async()=>{let h=await u.apply(r,l);return h===!1&&(h=await o.apply(r,l)),h})();let c=u.apply(r,l);return c===!1&&(c=o.apply(r,l)),c}}s.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let u=[];return u.push(i.call(this,a)),r&&(u=u.concat(r.call(this,a))),u}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Pe.lex(t,e??this.defaults)}parser(t,e){return Ie.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let s={...n},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=t),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(e):e,u=await(r.hooks?await r.hooks.provideLexer():t?Pe.lex:Pe.lexInline)(a,r),o=r.hooks?await r.hooks.processAllTokens(u):u;r.walkTokens&&await Promise.all(this.walkTokens(o,r.walkTokens));let l=await(r.hooks?await r.hooks.provideParser():t?Ie.parse:Ie.parseInline)(o,r);return r.hooks?await r.hooks.postprocess(l):l})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let a=(r.hooks?r.hooks.provideLexer():t?Pe.lex:Pe.lexInline)(e,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let u=(r.hooks?r.hooks.provideParser():t?Ie.parse:Ie.parseInline)(a,r);return r.hooks&&(u=r.hooks.postprocess(u)),u}catch(a){return i(a)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+Ne(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},et=new oa;function ae(t,e){return et.parse(t,e)}ae.options=ae.setOptions=function(t){return et.setOptions(t),ae.defaults=et.defaults,kr(ae.defaults),ae},ae.getDefaults=kn,ae.defaults=Ve,ae.use=function(...t){return et.use(...t),ae.defaults=et.defaults,kr(ae.defaults),ae},ae.walkTokens=function(t,e){return et.walkTokens(t,e)},ae.parseInline=et.parseInline,ae.Parser=Ie,ae.parser=Ie.parse,ae.Renderer=Yt,ae.TextRenderer=Cn,ae.Lexer=Pe,ae.lexer=Pe.lex,ae.Tokenizer=Kt,ae.Hooks=Tt,ae.parse=ae,ae.options,ae.setOptions,ae.use,ae.walkTokens,ae.parseInline,Ie.parse,Pe.lex;const Or=`function j() {
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
`,Dr=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Or],{type:"text/javascript;charset=utf-8"});function la(t){let e;try{if(e=Dr&&(self.URL||self.webkitURL).createObjectURL(Dr),!e)throw"";const n=new Worker(e,{type:"module",name:t?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Or),{type:"module",name:t?.name})}}function ca(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const n=t.slice(3,e+0).trim(),s=t.slice(e+4).trimStart(),r={};return n.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:s,data:r}}}return{content:t,data:{}}}const Hr=rr(()=>new la,"markdown"),Ur=typeof DOMParser<"u"?new DOMParser:null;function Mn(){return Hr.get()}function ua(t){return Hr.send(t,1e3)}const Qe=[];function _n(t){if(t&&typeof t=="object"){Qe.push(t);try{ae.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function ha(t){Qe.length=0,Array.isArray(t)&&Qe.push(...t.filter(e=>e&&typeof e=="object"));try{Qe.forEach(e=>ae.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function Vt(t){if(Mn&&Mn())try{const i=await ua({type:"render",md:t});if(i&&i.html!==void 0)try{const u=(Ur||new DOMParser).parseFromString(i.html,"text/html"),o=u.querySelectorAll("h1,h2,h3,h4,h5,h6");o.forEach(h=>{h.id||(h.id=le(h.textContent||""));try{const f=Number(h.tagName.substring(1));if(f>=1&&f<=6){const p={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},d=f<=2?"has-text-weight-bold":f<=4?"has-text-weight-semibold":"has-text-weight-normal";`${p[f]} ${d}`.split(/\s+/).filter(Boolean).forEach(w=>{try{h.classList.add(w)}catch{}})}}catch{}});try{try{const f=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(f){const p=Array.from(u.querySelectorAll("img"));for(const d of p)try{const g=d.getAttribute("src")||"";if(new URL(g,location.href).toString()===f){const y=d.parentElement;d.remove(),y&&y.tagName&&y.tagName.toLowerCase()==="p"&&y.childNodes.length===0&&y.remove();break}}catch{}}}catch{}u.querySelectorAll("img").forEach(f=>{try{f.getAttribute("loading")||f.setAttribute("data-want-lazy","1")}catch(p){console.warn("[markdown] set image loading attribute failed",p)}})}catch(h){console.warn("[markdown] query images failed",h)}try{u.querySelectorAll("pre code").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(y){console.warn("[markdown] set code class failed",y),f.className=d}else try{f.removeAttribute&&f.removeAttribute("class")}catch(y){console.warn("[markdown] remove code class failed",y),f.className=""}const g=d,w=g.match(/language-([a-zA-Z0-9_+-]+)/)||g.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!w||!w[1])try{const y=f.textContent||"";try{if(he&&typeof he.getLanguage=="function"&&he.getLanguage("plaintext")){const x=he.highlight(y,{language:"plaintext"});x&&x.value&&(f.innerHTML=x.value)}}catch{try{he.highlightElement(f)}catch(P){console.warn("[markdown] hljs.highlightElement failed",P)}}}catch(y){console.warn("[markdown] code auto-detect failed",y)}}catch(p){console.warn("[markdown] processing code blocks failed",p)}})}catch(h){console.warn("[markdown] query code blocks failed",h)}const l=u.body.innerHTML,c=[];return o.forEach(h=>{c.push({level:Number(h.tagName.substring(1)),text:(h.textContent||"").trim(),id:h.id})}),{html:l,meta:i.meta||{},toc:c}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:n,data:s}=ca(t||"");if(ae.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Qe&&Qe.length)try{Qe.forEach(i=>ae.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let r=ae.parse(n);try{const a=(Ur||new DOMParser).parseFromString(r,"text/html"),u=a.querySelectorAll("h1,h2,h3,h4,h5,h6");u.forEach(l=>{l.id||(l.id=le(l.textContent||""));try{const c=Number(l.tagName.substring(1));if(c>=1&&c<=6){const h={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},f=c<=2?"has-text-weight-bold":c<=4?"has-text-weight-semibold":"has-text-weight-normal";`${h[c]} ${f}`.split(/\s+/).filter(Boolean).forEach(d=>{try{l.classList.add(d)}catch{}})}}catch{}});try{try{const c=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(c){const h=Array.from(a.querySelectorAll("img"));for(const f of h)try{const p=f.getAttribute("src")||"";if(new URL(p,location.href).toString()===c){const g=f.parentElement;f.remove(),g&&g.tagName&&g.tagName.toLowerCase()==="p"&&g.childNodes.length===0&&g.remove();break}}catch{}}}catch{}a.querySelectorAll("img").forEach(c=>{try{c.getAttribute("loading")||c.setAttribute("data-want-lazy","1")}catch(h){console.warn("[markdown] set image loading attribute failed",h)}})}catch(l){console.warn("[markdown] query images failed",l)}try{a.querySelectorAll("pre code").forEach(c=>{try{const h=c.getAttribute&&c.getAttribute("class")||c.className||"",f=String(h||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(f)try{c.setAttribute&&c.setAttribute("class",f)}catch(g){console.warn("[markdown] set code class failed",g),c.className=f}else try{c.removeAttribute&&c.removeAttribute("class")}catch(g){console.warn("[markdown] remove code class failed",g),c.className=""}const p=f,d=p.match(/language-([a-zA-Z0-9_+-]+)/)||p.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!d||!d[1])try{const g=c.textContent||"";try{if(he&&typeof he.getLanguage=="function"&&he.getLanguage("plaintext")){const w=he.highlight(g,{language:"plaintext"});w&&w.value&&(c.innerHTML=w.value)}}catch{try{he.highlightElement(c)}catch(y){console.warn("[markdown] hljs.highlightElement failed",y)}}}catch(g){console.warn("[markdown] code auto-detect failed",g)}}catch(h){console.warn("[markdown] processing code blocks failed",h)}})}catch(l){console.warn("[markdown] query code blocks failed",l)}r=a.body.innerHTML;const o=[];return u.forEach(l=>{o.push({level:Number(l.tagName.substring(1)),text:(l.textContent||"").trim(),id:l.id})}),{html:a.body.innerHTML,meta:s||{},toc:o}}catch(i){console.warn("post-process markdown failed",i)}return{html:r,meta:s||{},toc:[]}}function $n(t,e){const n=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(t);)if(a[1]){const u=a[1].toLowerCase();if(cn.has(u)||e&&e.size&&u.length<3&&!e.has(u)&&!(Te&&Te[u]&&e.has(Te[u])))continue;if(e&&e.size){if(e.has(u)){const l=e.get(u);l&&n.add(l);continue}if(Te&&Te[u]){const l=Te[u];if(e.has(l)){const c=e.get(l)||l;n.add(c);continue}}}(i.has(u)||u.length>=5&&u.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(u)&&!r.has(u))&&n.add(u)}return n}const da=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:_n,detectFenceLanguages:$n,initRendererWorker:Mn,markdownPlugins:Qe,parseMarkdownToHtml:Vt,setMarkdownExtensions:ha},Symbol.toStringTag,{value:"Module"}));function fa(t,e){try{return new URL(t,e).pathname}catch{try{return new URL(t,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(e||"").replace(/\/$/,"")+"/"+String(t||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(t||"")}}}}function pa(t,e){const n=document.createElement("aside");n.className="menu nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=t("navigation"),n.appendChild(s);const r=document.createElement("ul");return r.className="menu-list",e.forEach(i=>{const a=document.createElement("li"),u=document.createElement("a");if(u.href="#"+i.path,u.textContent=i.name,a.appendChild(u),i.children&&i.children.length){const o=document.createElement("ul");i.children.forEach(l=>{const c=document.createElement("li"),h=document.createElement("a");h.href="#"+l.path,h.textContent=l.name,c.appendChild(h),o.appendChild(c)}),a.appendChild(o)}r.appendChild(a)}),n.appendChild(r),n}function ga(t,e,n=""){const s=document.createElement("aside");s.className="menu nimbi-toc-inner";const r=document.createElement("p");r.className="menu-label",r.textContent=t("onThisPage"),s.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const a={};(e||[]).forEach(u=>{try{if(!u||u.level===1)return;const o=Number(u.level)>=2?Number(u.level):2,l=document.createElement("li"),c=document.createElement("a"),h=u.id||le(u.text||"");c.textContent=u.text||"";try{const g=String(n||"").replace(/^[\\.\\/]+/,""),w=g&&H&&H.has&&H.has(g)?H.get(g):g;w?c.href=`?page=${encodeURIComponent(w)}#${encodeURIComponent(h)}`:c.href=`#${encodeURIComponent(h)}`}catch(g){console.warn("[htmlBuilder] buildTocElement href normalization failed",g),c.href=`#${encodeURIComponent(h)}`}if(l.appendChild(c),o===2){i.appendChild(l),a[2]=l,Object.keys(a).forEach(g=>{Number(g)>2&&delete a[g]});return}let f=o-1;for(;f>2&&!a[f];)f--;f<2&&(f=2);let p=a[f];if(!p){i.appendChild(l),a[o]=l;return}let d=p.querySelector("ul");d||(d=document.createElement("ul"),p.appendChild(d)),d.appendChild(l),a[o]=l}catch(o){console.warn("[htmlBuilder] buildTocElement item failed",o,u)}})}catch(a){console.warn("[htmlBuilder] buildTocElement failed",a)}return s.appendChild(i),s}function qr(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=le(n.textContent||""))})}function ma(t,e,n){try{const s=t.querySelectorAll("img");if(s&&s.length){const r=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const u=new URL(r+a,n).toString();i.src=u;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] set image loading attribute failed",o)}}catch(u){console.warn("[htmlBuilder] resolve image src failed",u)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function jr(t,e,n){try{const s=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";let r=null;try{const a=new URL(n,location.href);r=new URL(s||".",a).toString()}catch{try{r=new URL(s||".",location.href).toString()}catch{r=s||"./"}}const i=t.querySelectorAll("*");for(const a of Array.from(i||[]))try{const u=a.tagName?a.tagName.toLowerCase():"",o=l=>{try{const c=a.getAttribute(l)||"";if(!c||/^(https?:)?\/\//i.test(c)||c.startsWith("/")||c.startsWith("#"))return;try{a.setAttribute(l,new URL(c,r).toString())}catch(h){console.warn("[htmlBuilder] rewrite asset attribute failed",l,c,h)}}catch(c){console.warn("[htmlBuilder] rewriteAttr failed",c)}};if(a.hasAttribute&&a.hasAttribute("src")&&o("src"),a.hasAttribute&&a.hasAttribute("href")&&u!=="a"&&o("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&o("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&o("poster"),a.hasAttribute("srcset")){const h=(a.getAttribute("srcset")||"").split(",").map(f=>f.trim()).filter(Boolean).map(f=>{const[p,d]=f.split(/\s+/,2);if(!p||/^(https?:)?\/\//i.test(p)||p.startsWith("/"))return f;try{const g=new URL(p,r).toString();return d?`${g} ${d}`:g}catch{return f}}).join(", ");a.setAttribute("srcset",h)}}catch(u){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",u)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let Fr="",Pn=null,Wr="";async function Zr(t,e,n){try{const s=t.querySelectorAll("a");if(!s||!s.length)return;let r,i;if(e===Fr&&Pn)r=Pn,i=Wr;else{try{r=new URL(e,location.href),i=wt(r.pathname)}catch{try{r=new URL(e,location.href),i=wt(r.pathname)}catch{r=null,i="/"}}Fr=e,Pn=r,Wr=i}const a=new Set,u=[],o=new Set,l=[];for(const c of Array.from(s))try{const h=c.getAttribute("href")||"";if(!h||or(h))continue;try{if(h.startsWith("?")||h.indexOf("?")!==-1)try{const p=new URL(h,e||location.href),d=p.searchParams.get("page");if(d&&d.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const w=ge(g+d);c.setAttribute("href","?page="+encodeURIComponent(w)+(p.hash||""));continue}}}catch{}}catch{}if(h.startsWith("/")&&!h.endsWith(".md"))continue;const f=h.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(f){let p=f[1];const d=f[2];!p.startsWith("/")&&n&&(p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+p);try{const g=new URL(p,e).pathname;let w=g.startsWith(i)?g.slice(i.length):g;w=ge(w),u.push({node:c,mdPathRaw:p,frag:d,rel:w}),H.has(w)||a.add(w)}catch(g){console.warn("[htmlBuilder] resolve mdPath failed",g)}continue}try{let p=h;!h.startsWith("/")&&n&&(h.startsWith("#")?p=n+h:p=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+h);const g=new URL(p,e).pathname||"";if(g&&g.indexOf(i)!==-1){let w=g.startsWith(i)?g.slice(i.length):g;if(w=ge(w),w=mt(w),w||(w="_home"),!w.endsWith(".md")){let y=null;try{if(H&&H.has&&H.has(w))y=H.get(w);else try{const x=String(w||"").replace(/^.*\//,"");x&&H.has&&H.has(x)&&(y=H.get(x))}catch(x){console.warn("[htmlBuilder] mdToSlug baseName check failed",x)}}catch(x){console.warn("[htmlBuilder] mdToSlug access check failed",x)}if(!y)try{const x=String(w||"").replace(/^.*\//,"");for(const[P,M]of J||[])if(M===w||M===x){y=P;break}}catch{}y?c.setAttribute("href",`?page=${encodeURIComponent(y)}`):(o.add(w),l.push({node:c,rel:w}))}}}catch(p){console.warn("[htmlBuilder] resolving href to URL failed",p)}}catch(h){console.warn("[htmlBuilder] processing anchor failed",h)}a.size&&await Promise.all(Array.from(a).map(async c=>{try{try{const f=String(c).match(/([^\/]+)\.md$/),p=f&&f[1];if(p&&J.has(p)){try{const d=J.get(p);if(d)try{H.set(d,p)}catch(g){console.warn("[htmlBuilder] mdToSlug.set failed",g)}}catch(d){console.warn("[htmlBuilder] reading slugToMd failed",d)}return}}catch(f){console.warn("[htmlBuilder] basename slug lookup failed",f)}const h=await Se(c,e);if(h&&h.raw){const f=(h.raw||"").match(/^#\s+(.+)$/m);if(f&&f[1]){const p=le(f[1].trim());if(p)try{J.set(p,c),H.set(c,p)}catch(d){console.warn("[htmlBuilder] setting slug mapping failed",d)}}}}catch(h){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",h)}})),o.size&&await Promise.all(Array.from(o).map(async c=>{try{const h=await Se(c,e);if(h&&h.raw)try{const p=(In||new DOMParser).parseFromString(h.raw,"text/html"),d=p.querySelector("title"),g=p.querySelector("h1"),w=d&&d.textContent&&d.textContent.trim()?d.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(w){const y=le(w);if(y)try{J.set(y,c),H.set(c,y)}catch(x){console.warn("[htmlBuilder] setting html slug mapping failed",x)}}}catch(f){console.warn("[htmlBuilder] parse fetched HTML failed",f)}}catch(h){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",h)}}));for(const c of u){const{node:h,frag:f,rel:p}=c;let d=null;try{H.has(p)&&(d=H.get(p))}catch(g){console.warn("[htmlBuilder] mdToSlug access failed",g)}d?f?h.setAttribute("href",`?page=${encodeURIComponent(d)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(d)}`):f?h.setAttribute("href",`?page=${encodeURIComponent(p)}#${encodeURIComponent(f)}`):h.setAttribute("href",`?page=${encodeURIComponent(p)}`)}for(const c of l){const{node:h,rel:f}=c;let p=null;try{H.has(f)&&(p=H.get(f))}catch(d){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",d)}if(!p)try{const d=String(f||"").replace(/^.*\//,"");H.has(d)&&(p=H.get(d))}catch(d){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",d)}p?h.setAttribute("href",`?page=${encodeURIComponent(p)}`):h.setAttribute("href",`?page=${encodeURIComponent(f)}`)}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function wa(t,e,n,s){const r=e.querySelector("h1"),i=r?(r.textContent||"").trim():"";let a="";try{i&&(a=le(i)),!a&&t&&t.meta&&t.meta.title&&(a=le(t.meta.title)),!a&&n&&(a=le(String(n))),a||(a="_home");try{n&&(J.set(a,n),H.set(n,a))}catch(u){console.warn("[htmlBuilder] computeSlug set slug mapping failed",u)}try{let u="?page="+encodeURIComponent(a);try{const o=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");o&&(u+="#"+encodeURIComponent(o))}catch(o){console.warn("[htmlBuilder] computeSlug hash decode failed",o)}try{history.replaceState({page:a},"",u)}catch(o){console.warn("[htmlBuilder] computeSlug history replace failed",o)}}catch(u){console.warn("[htmlBuilder] computeSlug inner failed",u)}}catch(u){console.warn("[htmlBuilder] computeSlug failed",u)}return{topH1:r,h1Text:i,slugKey:a}}async function ba(t,e){if(!t||!t.length)return;const n=new Set;for(const o of Array.from(t||[]))try{const l=o.getAttribute("href")||"";if(!l)continue;let f=ge(l).split(/::|#/,2)[0];try{const d=f.indexOf("?");d!==-1&&(f=f.slice(0,d))}catch{}if(!f||(f.includes(".")||(f=f+".html"),!/\.html(?:$|[?#])/.test(f)&&!f.toLowerCase().endsWith(".html")))continue;const p=f;try{if(H&&H.has&&H.has(p))continue}catch(d){console.warn("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const g of J.values())if(g===p){d=!0;break}if(d)continue}catch(d){console.warn("[htmlBuilder] slugToMd iteration failed",d)}n.add(p)}catch(l){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",l)}if(!n.size)return;const s=async o=>{try{const l=await Se(o,e);if(l&&l.raw)try{const h=(In||new DOMParser).parseFromString(l.raw,"text/html"),f=h.querySelector("title"),p=h.querySelector("h1"),d=f&&f.textContent&&f.textContent.trim()?f.textContent.trim():p&&p.textContent?p.textContent.trim():null;if(d){const g=le(d);if(g)try{J.set(g,o),H.set(o,g)}catch(w){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",w)}}}catch(c){console.warn("[htmlBuilder] parse HTML title failed",c)}}catch(l){console.warn("[htmlBuilder] fetchAndExtract failed",l)}},r=5,i=Array.from(n);let a=0;const u=[];for(;a<i.length;){const o=i.slice(a,a+r);u.push(Promise.all(o.map(s))),a+=r}await Promise.all(u)}async function ya(t,e){if(!t||!t.length)return;const n=[],s=new Set;let r="";try{const i=new URL(e,typeof location<"u"?location.href:"http://localhost/");r=wt(i.pathname)}catch(i){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(t||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const u=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(u){let o=ge(u[1]);try{let l;try{l=fa(o,e)}catch(h){l=o,console.warn("[htmlBuilder] resolve mdPath URL failed",h)}const c=l&&r&&l.startsWith(r)?l.slice(r.length):String(l||"").replace(/^\//,"");n.push({rel:c}),H.has(c)||s.add(c)}catch(l){console.warn("[htmlBuilder] rewriteAnchors failed",l)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),u=a&&a[1];if(u&&J.has(u)){try{const o=J.get(u);o&&H.set(o,u)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await Se(i,e);if(a&&a.raw){const u=(a.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]){const o=le(u[1].trim());if(o)try{J.set(o,i),H.set(i,o)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",l)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const In=typeof DOMParser<"u"?new DOMParser:null;function zn(t){try{const n=(In||new DOMParser).parseFromString(t||"","text/html");qr(n);try{n.querySelectorAll("img").forEach(u=>{try{u.getAttribute("loading")||u.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",o)}})}catch(a){console.warn("[htmlBuilder] parseHtml query images failed",a)}n.querySelectorAll("pre code, code[class]").forEach(a=>{try{const u=a.getAttribute&&a.getAttribute("class")||a.className||"",o=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(o&&o[1]){const l=(o[1]||"").toLowerCase(),c=ne.size&&(ne.get(l)||ne.get(String(l).toLowerCase()))||l;try{(async()=>{try{await it(c)}catch(h){console.warn("[htmlBuilder] registerLanguage failed",h)}})()}catch(h){console.warn("[htmlBuilder] schedule registerLanguage failed",h)}}else try{if(he&&typeof he.getLanguage=="function"&&he.getLanguage("plaintext")){const l=he.highlight?he.highlight(a.textContent||"",{language:"plaintext"}):null;l&&l.value&&(a.innerHTML=l.value)}}catch(l){console.warn("[htmlBuilder] plaintext highlight fallback failed",l)}}catch(u){console.warn("[htmlBuilder] code element processing failed",u)}});const r=[];return n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(a=>{r.push({level:Number(a.tagName.substring(1)),text:(a.textContent||"").trim(),id:a.id})}),{html:n.body.innerHTML,meta:{},toc:r}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function ka(t){const e=$n?$n(t||"",ne):new Set,n=new Set(e),s=[];for(const r of n)try{const i=ne.size&&(ne.get(r)||ne.get(String(r).toLowerCase()))||r;try{s.push(it(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(i))try{s.push(it(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function xa(t){if(await ka(t),Vt){const e=await Vt(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function Sa(t,e,n,s,r){let i=null;if(e.isHtml)try{const h=typeof DOMParser<"u"?new DOMParser:null;if(h){const f=h.parseFromString(e.raw||"","text/html");try{jr(f.body,n,r)}catch(p){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",p)}i=zn(f.documentElement&&f.documentElement.outerHTML?f.documentElement.outerHTML:e.raw||"")}else i=zn(e.raw||"")}catch{i=zn(e.raw||"")}else i=await xa(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{jr(a,n,r)}catch(h){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",h)}try{qr(a)}catch(h){console.warn("[htmlBuilder] addHeadingIds failed",h)}try{a.querySelectorAll("pre code, code[class]").forEach(f=>{try{const p=f.getAttribute&&f.getAttribute("class")||f.className||"",d=String(p||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{f.setAttribute&&f.setAttribute("class",d)}catch(g){f.className=d,console.warn("[htmlBuilder] set element class failed",g)}else try{f.removeAttribute&&f.removeAttribute("class")}catch(g){f.className="",console.warn("[htmlBuilder] remove element class failed",g)}}catch(p){console.warn("[htmlBuilder] code element cleanup failed",p)}})}catch(h){console.warn("[htmlBuilder] processing code elements failed",h)}try{Vn(a)}catch(h){console.warn("[htmlBuilder] observeCodeBlocks failed",h)}ma(a,n,r);const{topH1:u,h1Text:o,slugKey:l}=wa(i,a,n,s);try{await va(a,r,n)}catch(h){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",h),await Zr(a,r,n)}const c=ga(t,i.toc,n);return{article:a,parsed:i,toc:c,topH1:u,h1Text:o,slugKey:l}}function Gr(t,e,n){t&&(t.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=e&&e("notFound")||"Page not found";const i=document.createElement("p");i.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",s.appendChild(r),s.appendChild(i),t&&t.appendChild&&t.appendChild(s)}async function va(t,e,n){return Zr(t,e,n)}function Ea(t){try{t.addEventListener("click",e=>{const n=e.target&&e.target.closest?e.target.closest("a"):null;if(!n)return;const s=n.getAttribute("href")||"";try{const r=new URL(s,location.href),i=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!i&&!a)return;e.preventDefault();let u=null;try{history&&history.state&&history.state.page&&(u=history.state.page)}catch(o){u=null,console.warn("[htmlBuilder] access history.state failed",o)}try{u||(u=new URL(location.href).searchParams.get("page"))}catch(o){console.warn("[htmlBuilder] parse current location failed",o)}if(!i&&a||i&&u&&String(i)===String(u)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:u||i},"","?page="+encodeURIComponent(u||i)+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}}catch(o){console.warn("[htmlBuilder] update history for anchor failed",o)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(o){console.warn("[htmlBuilder] stopPropagation failed",o)}try{Bn(a)}catch(o){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:i},"","?page="+encodeURIComponent(i)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){console.warn("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.warn("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){console.warn("[htmlBuilder] renderByQuery failed",o)}}catch(o){console.warn("[htmlBuilder] SPA navigation invocation failed",o)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function Bn(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const n=document.getElementById(t);if(n)try{const s=()=>{try{if(e&&e.scrollTo&&e.contains(n)){const r=n.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(s,50)}}catch(s){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",n)}}function Aa(t,e,{mountOverlay:n=null,container:s=null,mountEl:r=null,navWrap:i=null,t:a=null}={}){try{const u=a||(g=>typeof g=="string"?g:""),o=s||document.querySelector(".nimbi-cms"),l=r||document.querySelector(".nimbi-mount"),c=n||document.querySelector(".nimbi-overlay"),h=i||document.querySelector(".nimbi-nav-wrap");let p=document.querySelector(".nimbi-scroll-top");if(!p){p=document.createElement("button"),p.className="nimbi-scroll-top button is-primary is-rounded is-small",p.setAttribute("aria-label",u("scrollToTop")),p.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{c&&c.appendChild?c.appendChild(p):o&&o.appendChild?o.appendChild(p):l&&l.appendChild?l.appendChild(p):document.body.appendChild(p)}catch{try{document.body.appendChild(p)}catch(w){console.warn("[htmlBuilder] append scroll top button failed",w)}}try{try{tr(p)}catch{}}catch(g){console.warn("[htmlBuilder] set scroll-top button theme registration failed",g)}p.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback container scrollTop failed",w)}try{r&&(r.scrollTop=0)}catch(w){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",w)}try{document.documentElement.scrollTop=0}catch(w){console.warn("[htmlBuilder] fallback document scrollTop failed",w)}}})}const d=h&&h.querySelector?h.querySelector(".menu-label"):null;if(e){if(!p._nimbiObserver){const g=new IntersectionObserver(w=>{for(const y of w)y.target instanceof Element&&(y.isIntersecting?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show")))},{root:s instanceof Element?s:r instanceof Element?r:null,threshold:0});p._nimbiObserver=g}try{p._nimbiObserver.disconnect()}catch(g){console.warn("[htmlBuilder] observer disconnect failed",g)}try{p._nimbiObserver.observe(e)}catch(g){console.warn("[htmlBuilder] observer observe failed",g)}try{const g=()=>{try{const w=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},y=e.getBoundingClientRect();!(y.bottom<w.top||y.top>w.bottom)?(p.classList.remove("show"),d&&d.classList.remove("show")):(p.classList.add("show"),d&&d.classList.add("show"))}catch(w){console.warn("[htmlBuilder] checkIntersect failed",w)}};g(),"IntersectionObserver"in window||setTimeout(g,100)}catch(g){console.warn("[htmlBuilder] checkIntersect outer failed",g)}}else{p.classList.remove("show"),d&&d.classList.remove("show");const g=s instanceof Element?s:r instanceof Element?r:window,w=()=>{try{(g===window?window.scrollY:g.scrollTop||0)>10?(p.classList.add("show"),d&&d.classList.add("show")):(p.classList.remove("show"),d&&d.classList.remove("show"))}catch(y){console.warn("[htmlBuilder] onScroll handler failed",y)}};Ot(()=>g.addEventListener("scroll",w)),w()}}catch(u){console.warn("[htmlBuilder] ensureScrollTopButton failed",u)}}function Qr(t,e){try{if(!t)return;try{const n=t[e];if(typeof n<"u")return n}catch{}try{if(t.default)return t.default[e]}catch{}return}catch{return}}async function Ra(t,e,n,s,r,i,a,u,o="eager",l=1,c=void 0,h="favicon"){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const f=typeof DOMParser<"u"?new DOMParser:null,p=f?f.parseFromString(n||"","text/html"):null,d=p?p.querySelectorAll("a"):[];await Ot(()=>ba(d,s)),await Ot(()=>ya(d,s));let g=null,w=null,y=null;function x(){try{const v=document.querySelector(".navbar-burger"),R=v&&v.dataset?v.dataset.target:null,E=R?document.getElementById(R):null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),E&&E.classList.remove("is-active"))}catch(v){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",v)}}const P=()=>g||(g=(async()=>{try{const v=await Promise.resolve().then(()=>Wt),R=Qr(v,"buildSearchIndexWorker"),E=Qr(v,"buildSearchIndex");if(o==="lazy"&&typeof R=="function")try{const b=await R(s,l,c);if(b&&b.length)return b}catch(b){console.warn&&console.warn("[nimbi-cms] worker builder threw",b)}return typeof E=="function"?await E(s,l,c):[]}catch(v){return console.warn("[nimbi-cms] buildSearchIndex failed",v),[]}finally{if(w){try{w.removeAttribute("disabled")}catch{}try{y&&y.classList.remove("is-loading")}catch{}}}})(),g.then(v=>{try{const R=String(w&&w.value||"").trim().toLowerCase();if(!R||!Array.isArray(v)||!v.length)return;const E=v.filter(L=>L.title&&L.title.toLowerCase().includes(R)||L.excerpt&&L.excerpt.toLowerCase().includes(R));if(!E||!E.length)return;const b=document.getElementById("nimbi-search-results");if(!b)return;b.innerHTML="",E.slice(0,10).forEach(L=>{const N=document.createElement("div");if(N.className="nimbi-search-result",L.parentTitle){const te=document.createElement("div");te.textContent=L.parentTitle,te.className="nimbi-search-title nimbi-search-parent",N.appendChild(te)}const Z=document.createElement("a");Z.className="block",Z.href="?page="+encodeURIComponent(L.slug),Z.textContent=L.title,Z.addEventListener("click",()=>{try{b.style.display="none"}catch{}}),N.appendChild(Z),b.appendChild(N)});try{b.style.display="block"}catch{}}catch{}}).catch(()=>{}),g),M=document.createElement("nav");M.className="navbar",M.setAttribute("role","navigation"),M.setAttribute("aria-label","main navigation");const _=document.createElement("div");_.className="navbar-brand";const I=d[0],q=document.createElement("a");if(q.className="navbar-item",I){const v=I.getAttribute("href")||"#";try{const E=new URL(v,location.href).searchParams.get("page");E?q.href="?page="+encodeURIComponent(decodeURIComponent(E)):(q.href="?page="+encodeURIComponent(r),q.textContent=i("home"))}catch{q.href="?page="+encodeURIComponent(r),q.textContent=i("home")}}else q.href="?page="+encodeURIComponent(r),q.textContent=i("home");async function X(v){try{if(!v||v==="none")return null;if(v==="favicon")try{const R=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!R)return null;const E=R.getAttribute("href")||"";return E&&/\.png(?:\?|$)/i.test(E)?new URL(E,location.href).toString():null}catch{return null}if(v==="copy-first"||v==="move-first")try{const R=await Se(r,s);if(!R||!R.raw)return null;const L=new DOMParser().parseFromString(R.raw,"text/html").querySelector("img");if(!L)return null;const N=L.getAttribute("src")||"";if(!N)return null;const Z=new URL(N,location.href).toString();if(v==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",Z)}catch{}return Z}catch{return null}try{return new URL(v,location.href).toString()}catch{return null}}catch{return null}}let oe=null;try{oe=await X(h)}catch{oe=null}if(oe)try{const v=document.createElement("img");v.className="nimbi-navbar-logo";const R=i&&typeof i=="function"&&(i("home")||i("siteLogo"))||"";v.alt=R,v.title=R,v.src=oe;try{q.innerHTML=""}catch{q.textContent=""}q.appendChild(v)}catch{}_.appendChild(q),q.addEventListener("click",function(v){const R=q.getAttribute("href")||"";if(R.startsWith("?page=")){v.preventDefault();const E=new URL(R,location.href),b=E.searchParams.get("page"),L=E.hash?E.hash.replace(/^#/,""):null;history.pushState({page:b},"","?page="+encodeURIComponent(b)+(L?"#"+encodeURIComponent(L):""));try{a()}catch(N){console.warn("[nimbi-cms] renderByQuery failed",N)}try{x()}catch{}}});const W=document.createElement("a");W.className="navbar-burger",W.setAttribute("role","button"),W.setAttribute("aria-label","menu"),W.setAttribute("aria-expanded","false");const U="nimbi-navbar-menu";W.dataset.target=U,W.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',_.appendChild(W);try{W.addEventListener("click",v=>{try{const R=W.dataset&&W.dataset.target?W.dataset.target:null,E=R?document.getElementById(R):null;W.classList.contains("is-active")?(W.classList.remove("is-active"),W.setAttribute("aria-expanded","false"),E&&E.classList.remove("is-active")):(W.classList.add("is-active"),W.setAttribute("aria-expanded","true"),E&&E.classList.add("is-active"))}catch(R){console.warn("[nimbi-cms] navbar burger toggle failed",R)}})}catch(v){console.warn("[nimbi-cms] burger event binding failed",v)}const K=document.createElement("div");K.className="navbar-menu",K.id=U;const Y=document.createElement("div");Y.className="navbar-start";let ee,F,k;if(!u)ee=null,w=null,k=null;else{ee=document.createElement("div"),ee.className="navbar-end",F=document.createElement("div"),F.className="navbar-item",w=document.createElement("input"),w.className="input",w.type="search",w.placeholder=i("searchPlaceholder")||"",w.id="nimbi-search",o==="eager"&&(w.disabled=!0),y=document.createElement("div"),y.className="control",o==="eager"&&y.classList.add("is-loading"),y.appendChild(w),F.appendChild(y),k=document.createElement("div"),k.id="nimbi-search-results",k.className="box",F.appendChild(k),ee.appendChild(F);const v=E=>{if(k.innerHTML="",!E.length){k.classList.remove("is-open");try{k.style.display="none"}catch{}return}E.forEach(b=>{const L=document.createElement("div");if(L.className="nimbi-search-result",b.parentTitle){const Z=document.createElement("div");Z.textContent=b.parentTitle,Z.className="nimbi-search-title nimbi-search-parent",L.appendChild(Z)}const N=document.createElement("a");N.className="block",N.href="?page="+encodeURIComponent(b.slug),N.textContent=b.title,N.addEventListener("click",()=>{k.style.display="none"}),L.appendChild(N),k.appendChild(L)});try{k.style.display="block"}catch{}k.classList.add("is-open")},R=(E,b)=>{let L=null;return(...N)=>{L&&clearTimeout(L),L=setTimeout(()=>E(...N),b)}};if(w){const E=R(async()=>{const b=document.querySelector("input#nimbi-search"),L=String(b&&b.value||"").trim().toLowerCase();if(!L){v([]);return}try{await P();const Z=(await g).filter(te=>te.title&&te.title.toLowerCase().includes(L)||te.excerpt&&te.excerpt.toLowerCase().includes(L));v(Z.slice(0,10))}catch(N){console.warn("[nimbi-cms] search input handler failed",N),v([])}},50);try{w.addEventListener("input",E)}catch{}try{document.addEventListener("input",b=>{try{b&&b.target&&b.target.id==="nimbi-search"&&E(b)}catch{}},!0)}catch{}}if(o==="eager"){try{g=P()}catch(E){console.warn("[nimbi-cms] eager search index init failed",E),g=Promise.resolve([])}g.finally(()=>{const E=document.querySelector("input#nimbi-search");if(E){try{E.removeAttribute("disabled")}catch{}try{y&&y.classList.remove("is-loading")}catch{}}})}try{const E=b=>{try{const L=b&&b.target;if(!k||!k.classList.contains("is-open")&&k.style&&k.style.display!=="block"||L&&(k.contains(L)||w&&(L===w||w.contains&&w.contains(L))))return;try{k.style.display="none"}catch{}try{k.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",E,!0),document.addEventListener("touchstart",E,!0)}catch{}}for(let v=0;v<d.length;v++){const R=d[v];if(v===0)continue;const E=R.getAttribute("href")||"#",b=document.createElement("a");b.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(E)||E.endsWith(".md")){const N=ge(E).split(/::|#/,2),Z=N[0],te=N[1];b.href="?page="+encodeURIComponent(Z)+(te?"#"+encodeURIComponent(te):"")}else if(/\.html(?:$|[#?])/.test(E)||E.endsWith(".html")){const N=ge(E).split(/::|#/,2);let Z=N[0];Z&&!Z.toLowerCase().endsWith(".html")&&(Z=Z+".html");const te=N[1];try{const re=await Se(Z,s);if(re&&re.raw)try{const be=new DOMParser().parseFromString(re.raw,"text/html"),Oe=be.querySelector("title"),ut=be.querySelector("h1"),tt=Oe&&Oe.textContent&&Oe.textContent.trim()?Oe.textContent.trim():ut&&ut.textContent?ut.textContent.trim():null;if(tt){const ht=le(tt);if(ht){try{J.set(ht,Z),H.set(Z,ht)}catch(Hn){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Hn)}b.href="?page="+encodeURIComponent(ht)+(te?"#"+encodeURIComponent(te):"")}else b.href="?page="+encodeURIComponent(Z)+(te?"#"+encodeURIComponent(te):"")}else b.href="?page="+encodeURIComponent(Z)+(te?"#"+encodeURIComponent(te):"")}catch{b.href="?page="+encodeURIComponent(Z)+(te?"#"+encodeURIComponent(te):"")}else b.href=E}catch{b.href=E}}else b.href=E}catch(L){console.warn("[nimbi-cms] nav item href parse failed",L),b.href=E}try{const L=R.textContent&&String(R.textContent).trim()?String(R.textContent).trim():null;if(L)try{const N=le(L);if(N){const Z=b.getAttribute&&b.getAttribute("href")?b.getAttribute("href"):"";try{const re=new URL(Z,location.href).searchParams.get("page");if(re){const de=decodeURIComponent(re);try{J.set(N,de),H.set(de,N)}catch(be){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",be)}}}catch(te){console.warn("[nimbi-cms] nav slug mapping failed",te)}}}catch(N){console.warn("[nimbi-cms] nav slug mapping failed",N)}}catch(L){console.warn("[nimbi-cms] nav slug mapping failed",L)}b.textContent=R.textContent||E,Y.appendChild(b)}K.appendChild(Y),ee&&K.appendChild(ee),M.appendChild(_),M.appendChild(K),t.appendChild(M);try{const v=R=>{try{const E=M&&M.querySelector?M.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!E||!E.classList.contains("is-active"))return;const b=E&&E.closest?E.closest(".navbar"):M;if(b&&b.contains(R.target))return;x()}catch{}};document.addEventListener("click",v,!0),document.addEventListener("touchstart",v,!0)}catch{}try{K.addEventListener("click",v=>{const R=v.target&&v.target.closest?v.target.closest("a"):null;if(!R)return;const E=R.getAttribute("href")||"";try{const b=new URL(E,location.href),L=b.searchParams.get("page"),N=b.hash?b.hash.replace(/^#/,""):null;if(L){v.preventDefault(),history.pushState({page:L},"","?page="+encodeURIComponent(L)+(N?"#"+encodeURIComponent(N):""));try{a()}catch(Z){console.warn("[nimbi-cms] renderByQuery failed",Z)}}}catch(b){console.warn("[nimbi-cms] navbar click handler failed",b)}try{const b=M&&M.querySelector?M.querySelector(".navbar-burger"):null,L=b&&b.dataset?b.dataset.target:null,N=L?document.getElementById(L):null;b&&b.classList.contains("is-active")&&(b.classList.remove("is-active"),b.setAttribute("aria-expanded","false"),N&&N.classList.remove("is-active"))}catch(b){console.warn("[nimbi-cms] mobile menu close failed",b)}})}catch(v){console.warn("[nimbi-cms] attach content click handler failed",v)}try{e.addEventListener("click",v=>{const R=v.target&&v.target.closest?v.target.closest("a"):null;if(!R)return;const E=R.getAttribute("href")||"";if(E&&!or(E))try{const b=new URL(E,location.href),L=b.searchParams.get("page"),N=b.hash?b.hash.replace(/^#/,""):null;if(L){v.preventDefault(),history.pushState({page:L},"","?page="+encodeURIComponent(L)+(N?"#"+encodeURIComponent(N):""));try{a()}catch(Z){console.warn("[nimbi-cms] renderByQuery failed",Z)}}}catch(b){console.warn("[nimbi-cms] container click URL parse failed",b)}})}catch(v){console.warn("[nimbi-cms] build navbar failed",v)}return{navbar:M,linkEls:d}}try{document.addEventListener("input",t=>{try{if(t&&t.target&&t.target.id==="nimbi-search"){const e=document.getElementById("nimbi-search-results");if(e&&t.target&&t.target.value)try{e.style.display="block"}catch{}}}catch{}},!0)}catch{}var Nn,Xr;function La(){if(Xr)return Nn;Xr=1;function t(i,a){return a.some(([u,o])=>u<=i&&i<=o)}function e(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(i,a={}){let u=0,o=0,l=i.length-1;const c=a.wordsPerMinute||200,h=a.wordBound||n;for(;h(i[o]);)o++;for(;h(i[l]);)l--;const f=`${i}
`;for(let w=o;w<=l;w++)if((e(f[w])||!h(f[w])&&(h(f[w+1])||e(f[w+1])))&&u++,e(f[w]))for(;w<=l&&(s(f[w+1])||h(f[w+1]));)w++;const p=u/c,d=Math.round(p*60*1e3);return{text:Math.ceil(p.toFixed(2))+" min read",minutes:p,time:d,words:u}}return Nn=r,Nn}var Ta=La();const Ca=Kn(Ta);function Kr(t,e){let n=document.querySelector(`meta[name="${t}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",t),document.head.appendChild(n)),n.setAttribute("content",e)}function ct(t,e,n){let s=`meta[${t}="${e}"]`,r=document.querySelector(s);r||(r=document.createElement("meta"),r.setAttribute(t,e),document.head.appendChild(r)),r.setAttribute("content",n)}function Ma(t,e){try{let n=document.querySelector(`link[rel="${t}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",t),document.head.appendChild(n)),n.setAttribute("href",e)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function _a(t,e,n,s){const r=e&&String(e).trim()?e:t.title||document.title;ct("property","og:title",r);const i=s&&String(s).trim()?s:t.description||"";i&&String(i).trim()&&ct("property","og:description",i),ct("name","twitter:card",t.twitter_card||"summary_large_image");const a=n||t.image;a&&(ct("property","og:image",a),ct("name","twitter:image",a))}function $a(t,e,n,s,r=""){const i=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";u&&String(u).trim()&&Kr("description",u),Kr("robots",i.robots||"index,follow"),_a(i,e,n,u)}function Pa(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const n=document.querySelector(e);if(n){const s=n.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function Ia(t,e,n,s,r,i=""){try{const a=t.meta||{},u=n&&String(n).trim()?n:a.title||i||document.title,o=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",l=s||a.image||null;let c="";try{if(e){const d=ge(e);try{c=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(d)}catch{c=location.href.split("#")[0]}}else c=location.href.split("#")[0]}catch(d){c=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",d)}c&&Ma("canonical",c);try{ct("property","og:url",c)}catch(d){console.warn("[seoManager] upsertMeta og:url failed",d)}const h={"@context":"https://schema.org","@type":"Article",headline:u||"",description:o||"",url:c||location.href.split("#")[0]};l&&(h.image=String(l)),a.date&&(h.datePublished=a.date),a.dateModified&&(h.dateModified=a.dateModified);const f="nimbi-jsonld";let p=document.getElementById(f);p||(p=document.createElement("script"),p.type="application/ld+json",p.id=f,document.head.appendChild(p)),p.textContent=JSON.stringify(h,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function za(t,e,n,s,r,i,a,u,o,l,c){try{const h=s.querySelector(".menu-label");h&&(h.textContent=u&&u.textContent||t("onThisPage"))}catch(h){console.warn("[seoManager] update toc label failed",h)}try{const h=n.meta&&n.meta.title?String(n.meta.title).trim():"",f=r.querySelector("img"),p=f&&(f.getAttribute("src")||f.src)||null;let d="";try{let w="";try{const y=u||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let x=y.nextElementSibling;const P=[];for(;x&&!(x.tagName&&x.tagName.toLowerCase()==="h2");){const M=(x.textContent||"").trim();M&&P.push(M),x=x.nextElementSibling}P.length&&(w=P.join(" ").replace(/\s+/g," ").trim()),!w&&o&&(w=String(o).trim())}}catch(y){console.warn("[seoManager] compute descOverride failed",y)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),d=w}catch(w){console.warn("[seoManager] compute descOverride failed",w)}try{$a(n,o,p,d)}catch(w){console.warn("[seoManager] setMetaTags failed",w)}try{Ia(n,l,o,p,d,e)}catch(w){console.warn("[seoManager] setStructuredData failed",w)}const g=Pa();o?g?document.title=`${g} - ${o}`:document.title=`${e||"Site"} - ${o}`:h?document.title=h:document.title=e||document.title}catch(h){console.warn("[seoManager] applyPageMeta failed",h)}try{const h=r.querySelector(".nimbi-reading-time");if(h&&h.remove(),o){const f=Ca(c.raw||""),p=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,d=document.createElement("p");d.className="nimbi-reading-time",d.textContent=p?t("readingTime",{minutes:p}):"";const g=r.querySelector("h1");g&&g.insertAdjacentElement("afterend",d)}}catch(h){console.warn("[seoManager] reading time update failed",h)}}let Ae=null,D=null,ke=1,Xe=(t,e)=>e,Ct=0,Mt=0,Jt=()=>{},_t=.25;function Ba(){if(Ae&&document.contains(Ae))return Ae;Ae=null;const t=document.createElement("dialog");t.className="nimbi-image-preview",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Xe("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",k=>{k.target===t&&On()}),t.addEventListener("wheel",k=>{if(!W())return;k.preventDefault();const v=k.deltaY<0?_t:-_t;je(ke+v),l(),c()},{passive:!1}),t.addEventListener("keydown",k=>{if(k.key==="Escape"){On();return}if(ke>1){const v=t.querySelector(".nimbi-image-preview__image-wrapper");if(!v)return;const R=40;switch(k.key){case"ArrowUp":v.scrollTop-=R,k.preventDefault();break;case"ArrowDown":v.scrollTop+=R,k.preventDefault();break;case"ArrowLeft":v.scrollLeft-=R,k.preventDefault();break;case"ArrowRight":v.scrollLeft+=R,k.preventDefault();break}}}),document.body.appendChild(t),Ae=t,D=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),n=t.querySelector("[data-nimbi-preview-original]"),s=t.querySelector("[data-nimbi-preview-zoom-in]"),r=t.querySelector("[data-nimbi-preview-zoom-out]"),i=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),u=t.querySelector("[data-nimbi-preview-zoom-label]"),o=t.querySelector("[data-nimbi-preview-zoom-hud]");function l(){u&&(u.textContent=`${Math.round(ke*100)}%`)}const c=()=>{o&&(o.textContent=`${Math.round(ke*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};Jt=l,s.addEventListener("click",()=>{je(ke+_t),l(),c()}),r.addEventListener("click",()=>{je(ke-_t),l(),c()}),e.addEventListener("click",()=>{$t(),l(),c()}),n.addEventListener("click",()=>{je(1),l(),c()}),i.addEventListener("click",()=>{$t(),l(),c()}),a.addEventListener("click",On),e.title=Xe("imagePreviewFit","Fit to screen"),n.title=Xe("imagePreviewOriginal","Original size"),r.title=Xe("imagePreviewZoomOut","Zoom out"),s.title=Xe("imagePreviewZoomIn","Zoom in"),a.title=Xe("imagePreviewClose","Close"),a.setAttribute("aria-label",Xe("imagePreviewClose","Close"));let h=!1,f=0,p=0,d=0,g=0;const w=new Map;let y=0,x=1;const P=(k,v)=>{const R=k.x-v.x,E=k.y-v.y;return Math.hypot(R,E)},M=()=>{h=!1,w.clear(),y=0,D&&(D.classList.add("is-panning"),D.classList.remove("is-grabbing"))};let _=0,I=0,q=0;const X=k=>{const v=Date.now(),R=v-_,E=k.clientX-I,b=k.clientY-q;_=v,I=k.clientX,q=k.clientY,R<300&&Math.hypot(E,b)<30&&(je(ke>1?1:2),l(),k.preventDefault())},oe=k=>{je(ke>1?1:2),l(),k.preventDefault()},W=()=>Ae?typeof Ae.open=="boolean"?Ae.open:Ae.classList.contains("is-active"):!1,U=(k,v,R=1)=>{if(w.has(R)&&w.set(R,{x:k,y:v}),w.size===2){const N=Array.from(w.values()),Z=P(N[0],N[1]);if(y>0){const te=Z/y;je(x*te)}return}if(!h)return;const E=D.closest(".nimbi-image-preview__image-wrapper");if(!E)return;const b=k-f,L=v-p;E.scrollLeft=d-b,E.scrollTop=g-L},K=(k,v,R=1)=>{if(!W())return;if(w.set(R,{x:k,y:v}),w.size===2){const L=Array.from(w.values());y=P(L[0],L[1]),x=ke;return}const E=D.closest(".nimbi-image-preview__image-wrapper");!E||!(E.scrollWidth>E.clientWidth||E.scrollHeight>E.clientHeight)||(h=!0,f=k,p=v,d=E.scrollLeft,g=E.scrollTop,D.classList.add("is-panning"),D.classList.remove("is-grabbing"),window.addEventListener("pointermove",Y),window.addEventListener("pointerup",ee),window.addEventListener("pointercancel",ee))},Y=k=>{h&&(k.preventDefault(),U(k.clientX,k.clientY,k.pointerId))},ee=()=>{M(),window.removeEventListener("pointermove",Y),window.removeEventListener("pointerup",ee),window.removeEventListener("pointercancel",ee)};D.addEventListener("pointerdown",k=>{k.preventDefault(),K(k.clientX,k.clientY,k.pointerId)}),D.addEventListener("pointermove",k=>{(h||w.size===2)&&k.preventDefault(),U(k.clientX,k.clientY,k.pointerId)}),D.addEventListener("pointerup",k=>{k.preventDefault(),k.pointerType==="touch"&&X(k),M()}),D.addEventListener("dblclick",oe),D.addEventListener("pointercancel",M),D.addEventListener("mousedown",k=>{k.preventDefault(),K(k.clientX,k.clientY,1)}),D.addEventListener("mousemove",k=>{h&&k.preventDefault(),U(k.clientX,k.clientY,1)}),D.addEventListener("mouseup",k=>{k.preventDefault(),M()});const F=t.querySelector(".nimbi-image-preview__image-wrapper");return F&&(F.addEventListener("pointerdown",k=>{if(K(k.clientX,k.clientY,k.pointerId),k&&k.target&&k.target.tagName==="IMG")try{k.target.classList.add("is-grabbing")}catch{}}),F.addEventListener("pointermove",k=>{U(k.clientX,k.clientY,k.pointerId)}),F.addEventListener("pointerup",M),F.addEventListener("pointercancel",M),F.addEventListener("mousedown",k=>{if(K(k.clientX,k.clientY,1),k&&k.target&&k.target.tagName==="IMG")try{k.target.classList.add("is-grabbing")}catch{}}),F.addEventListener("mousemove",k=>{U(k.clientX,k.clientY,1)}),F.addEventListener("mouseup",M)),t}function je(t){if(!D)return;const e=Number(t);ke=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const s=D.getBoundingClientRect(),r=Ct||D.naturalWidth||D.width||s.width||0,i=Mt||D.naturalHeight||D.height||s.height||0;if(r&&i){D.style.setProperty("--nimbi-preview-img-max-width","none"),D.style.setProperty("--nimbi-preview-img-max-height","none"),D.style.setProperty("--nimbi-preview-img-width",`${r*ke}px`),D.style.setProperty("--nimbi-preview-img-height",`${i*ke}px`),D.style.setProperty("--nimbi-preview-img-transform","none");try{D.style.width=`${r*ke}px`,D.style.height=`${i*ke}px`,D.style.transform="none"}catch{}}else{D.style.setProperty("--nimbi-preview-img-max-width",""),D.style.setProperty("--nimbi-preview-img-max-height",""),D.style.setProperty("--nimbi-preview-img-width",""),D.style.setProperty("--nimbi-preview-img-height",""),D.style.setProperty("--nimbi-preview-img-transform",`scale(${ke})`);try{D.style.transform=`scale(${ke})`}catch{}}D&&(D.classList.add("is-panning"),D.classList.remove("is-grabbing"))}function $t(){if(!D)return;const t=D.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const n=Ct||D.naturalWidth||e.width,s=Mt||D.naturalHeight||e.height;if(!n||!s)return;const r=e.width/n,i=e.height/s,a=Math.min(r,i,1);je(Number.isFinite(a)?a:1)}function Na(t,e="",n=0,s=0){const r=Ba();ke=1,Ct=n||0,Mt=s||0,D.src=t,D.alt=e,D.style.transform="scale(1)";const i=()=>{Ct=D.naturalWidth||D.width||0,Mt=D.naturalHeight||D.height||0};if(i(),$t(),Jt(),requestAnimationFrame(()=>{$t(),Jt()}),!Ct||!Mt){const a=()=>{i(),requestAnimationFrame(()=>{$t(),Jt()}),D.removeEventListener("load",a)};D.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function On(){if(Ae){typeof Ae.close=="function"&&Ae.open&&Ae.close(),Ae.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function Oa(t,{t:e,zoomStep:n=.25}={}){if(!t||!t.querySelectorAll)return;Xe=(p,d)=>(typeof e=="function"?e(p):void 0)||d,_t=n,t.addEventListener("click",p=>{const d=p.target;if(!d||d.tagName!=="IMG")return;const g=d;if(g.src){if(p.defaultPrevented!==!0){const w=g.closest("a");w&&w.getAttribute("href")&&p.preventDefault()}Na(g.src,g.alt||"",g.naturalWidth||0,g.naturalHeight||0)}});let s=!1,r=0,i=0,a=0,u=0;const o=new Map;let l=0,c=1;const h=(p,d)=>{const g=p.x-d.x,w=p.y-d.y;return Math.hypot(g,w)};t.addEventListener("pointerdown",p=>{const d=p.target;if(!d||d.tagName!=="IMG"||!Ae||!Ae.open)return;if(o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){const w=Array.from(o.values());l=h(w[0],w[1]),c=ke;return}const g=d.closest(".nimbi-image-preview__image-wrapper");if(g&&!(ke<=1)){p.preventDefault(),s=!0,r=p.clientX,i=p.clientY,a=g.scrollLeft,u=g.scrollTop,d.setPointerCapture(p.pointerId);try{d.classList.add("is-grabbing")}catch{}}}),t.addEventListener("pointermove",p=>{if(o.has(p.pointerId)&&o.set(p.pointerId,{x:p.clientX,y:p.clientY}),o.size===2){p.preventDefault();const x=Array.from(o.values()),P=h(x[0],x[1]);if(l>0){const M=P/l;je(c*M)}return}if(!s)return;p.preventDefault();const g=p.target.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const w=p.clientX-r,y=p.clientY-i;g.scrollLeft=a-w,g.scrollTop=u-y});const f=()=>{s=!1,o.clear(),l=0;try{const p=document.querySelector("[data-nimbi-preview-image]");p&&(p.classList.add("is-panning"),p.classList.remove("is-grabbing"))}catch{}};t.addEventListener("pointerup",f),t.addEventListener("pointercancel",f)}function Da(t){const{contentWrap:e,navWrap:n,container:s,mountOverlay:r=null,t:i,contentBase:a,homePage:u,initialDocumentTitle:o,runHooks:l}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let c=null;const h=pa(i,[{path:u,name:i("home"),isIndex:!0,children:[]}]);async function f(y,x){let P,M,_;try{({data:P,pagePath:M,anchor:_}=await bs(y,a))}catch(K){console.error("[nimbi-cms] fetchPageData failed",K),Gr(e,i,K);return}!_&&x&&(_=x);try{Bn(null)}catch(K){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",K)}e.innerHTML="";const{article:I,parsed:q,toc:X,topH1:oe,h1Text:W,slugKey:U}=await Sa(i,P,M,_,a);za(i,o,q,X,I,M,_,oe,W,U,P),n.innerHTML="",n.appendChild(X),Ea(X);try{await l("transformHtml",{article:I,parsed:q,toc:X,pagePath:M,anchor:_,topH1:oe,h1Text:W,slugKey:U,data:P})}catch(K){console.warn("[nimbi-cms] transformHtml hooks failed",K)}e.appendChild(I);try{Oa(I,{t:i})}catch(K){console.warn("[nimbi-cms] attachImagePreview failed",K)}try{Nt(s,100,!1),requestAnimationFrame(()=>Nt(s,100,!1)),setTimeout(()=>Nt(s,100,!1),250)}catch(K){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",K)}Bn(_),Aa(I,oe,{mountOverlay:r,container:s,navWrap:n,t:i});try{await l("onPageLoad",{data:P,pagePath:M,anchor:_,article:I,toc:X,topH1:oe,h1Text:W,slugKey:U,contentWrap:e,navWrap:n})}catch(K){console.warn("[nimbi-cms] onPageLoad hooks failed",K)}c=M}async function p(){let y=new URLSearchParams(location.search).get("page")||u;const x=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await f(y,x)}catch(P){console.warn("[nimbi-cms] renderByQuery failed for",y,P),Gr(e,i,P)}}window.addEventListener("popstate",p);const d=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,g=()=>{try{const y=s||document.querySelector(".nimbi-cms");if(!y)return;const x={top:y.scrollTop||0,left:y.scrollLeft||0};sessionStorage.setItem(d(),JSON.stringify(x))}catch{}},w=()=>{try{const y=s||document.querySelector(".nimbi-cms");if(!y)return;const x=sessionStorage.getItem(d());if(!x)return;const P=JSON.parse(x);P&&typeof P.top=="number"&&y.scrollTo({top:P.top,left:P.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",y=>{if(y.persisted)try{w(),Nt(s,100,!1)}catch(x){console.warn("[nimbi-cms] bfcache restore failed",x)}}),window.addEventListener("pagehide",()=>{try{g()}catch(y){console.warn("[nimbi-cms] save scroll position failed",y)}}),{renderByQuery:p,siteNav:h,getCurrentPagePath:()=>c}}function Ha(t){try{const e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e)return{};const n=new URLSearchParams(e.startsWith("?")?e.slice(1):e),s={},r=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(s.contentPath=n.get("contentPath")),n.has("searchIndex")){const i=r(n.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(n.has("searchIndexMode")){const i=n.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(n.has("defaultStyle")){const i=n.get("defaultStyle");(i==="light"||i==="dark")&&(s.defaultStyle=i)}if(n.has("bulmaCustomize")&&(s.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(s.lang=n.get("lang")),n.has("l10nFile")){const i=n.get("l10nFile");s.l10nFile=i==="null"?null:i}if(n.has("cacheTtlMinutes")){const i=Number(n.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(n.has("cacheMaxEntries")){const i=Number(n.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(n.has("homePage")&&(s.homePage=n.get("homePage")),n.has("notFoundPage")&&(s.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(s.availableLanguages=n.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),n.has("indexDepth")){const i=Number(n.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(u=>u.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function Ua(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function Yr(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let Dn="";async function Vr(t={}){if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const e=Ha();if(e&&(e.contentPath||e.homePage||e.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(b){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",b)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(b){console.warn("[nimbi-cms] logging ignore of URL overrides failed",b)}delete e.contentPath,delete e.homePage,delete e.notFoundPage}const n=Object.assign({},e,t),{el:s,contentPath:r="/content",crawlMaxQueue:i=1e3,searchIndex:a=!0,searchIndexMode:u="eager",indexDepth:o=1,noIndexing:l=void 0,defaultStyle:c="light",bulmaCustomize:h="none",lang:f=void 0,l10nFile:p=null,cacheTtlMinutes:d=5,cacheMaxEntries:g,markdownExtensions:w,availableLanguages:y,homePage:x="_home.md",notFoundPage:P="_404.md"}=n,{navbarLogo:M="favicon"}=n,{skipRootReadme:_=!1}=n;if(n.contentPath!=null&&!Ua(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(n.homePage!=null&&!Yr(n.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(n.notFoundPage!=null&&!Yr(n.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!s)throw new Error("el is required");let I=s;if(typeof s=="string"){if(I=document.querySelector(s),!I)throw new Error(`el selector "${s}" did not match any element`)}else if(!(s instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof r!="string"||!r.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(u!=null&&u!=="eager"&&u!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(o!=null&&o!==1&&o!==2&&o!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(c!=="light"&&c!=="dark")throw new TypeError('initCMS(options): "defaultStyle" must be "light" or "dark"');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(d!=null&&(typeof d!="number"||!Number.isFinite(d)||d<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(g!=null&&(typeof g!="number"||!Number.isInteger(g)||g<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(b=>!b||typeof b!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some(b=>typeof b!="string"||!b.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(l!=null&&(!Array.isArray(l)||l.some(b=>typeof b!="string"||!b.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(_!=null&&typeof _!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(x!=null&&(typeof x!="string"||!x.trim()||!/\.(md|html)$/.test(x)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(P!=null&&(typeof P!="string"||!P.trim()||!/\.(md|html)$/.test(P)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const q=!!a;try{Promise.resolve().then(()=>Wt).then(b=>{try{b&&typeof b.setSkipRootReadme=="function"&&b.setSkipRootReadme(!!_)}catch(L){console.warn("[nimbi-cms] setSkipRootReadme failed",L)}}).catch(b=>{})}catch(b){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",b)}try{I.classList.add("nimbi-mount")}catch(b){console.warn("[nimbi-cms] mount element setup failed",b)}const X=document.createElement("div");X.className="nimbi-cms";const oe=document.createElement("div");oe.className="columns";const W=document.createElement("div");W.className="column is-full-mobile is-3-tablet nimbi-nav-wrap",W.setAttribute("role","navigation");try{const b=typeof at=="function"?at("navigation"):null;b&&W.setAttribute("aria-label",b)}catch(b){console.warn("[nimbi-cms] set nav aria-label failed",b)}oe.appendChild(W);const U=document.createElement("div");U.className="column nimbi-content",U.setAttribute("role","main"),oe.appendChild(U),X.appendChild(oe);const K=W,Y=U;I.appendChild(X);let ee=null;try{ee=I.querySelector(".nimbi-overlay"),ee||(ee=document.createElement("div"),ee.className="nimbi-overlay",I.appendChild(ee))}catch(b){ee=null,console.warn("[nimbi-cms] mount overlay setup failed",b)}const F=location.pathname||"/",k=F.endsWith("/")?F:F.substring(0,F.lastIndexOf("/")+1);try{Dn=document.title||""}catch(b){Dn="",console.warn("[nimbi-cms] read initial document title failed",b)}let v=r;(v==="."||v==="./")&&(v=""),v.startsWith("./")&&(v=v.slice(2)),v.startsWith("/")&&(v=v.slice(1)),v!==""&&!v.endsWith("/")&&(v=v+"/");const R=new URL(k+v,location.origin).toString();try{Promise.resolve().then(()=>Wt).then(b=>{try{b&&typeof b.setHomePage=="function"&&b.setHomePage(x)}catch(L){console.warn("[nimbi-cms] setHomePage failed",L)}}).catch(b=>{})}catch(b){console.warn("[nimbi-cms] setHomePage dynamic import failed",b)}p&&await dn(p,k),y&&Array.isArray(y)&&lr(y),f&&fn(f);const E=Da({contentWrap:Y,navWrap:K,container:X,mountOverlay:ee,t:at,contentBase:R,homePage:x,initialDocumentTitle:Dn,runHooks:on});if(typeof d=="number"&&d>=0&&typeof br=="function"&&br(d*60*1e3),typeof g=="number"&&g>=0&&typeof wr=="function"&&wr(g),w&&Array.isArray(w)&&w.length)try{w.forEach(b=>{typeof b=="object"&&da&&typeof _n=="function"&&_n(b)})}catch(b){console.warn("[nimbi-cms] applying markdownExtensions failed",b)}try{typeof i=="number"&&Promise.resolve().then(()=>Wt).then(({setDefaultCrawlMaxQueue:b})=>{try{b(i)}catch(L){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",L)}})}catch(b){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",b)}try{Ut(R)}catch(b){console.warn("[nimbi-cms] setContentBase failed",b)}try{bn(P)}catch(b){console.warn("[nimbi-cms] setNotFoundPage failed",b)}try{Ut(R)}catch(b){console.warn("[nimbi-cms] setContentBase failed",b)}try{bn(P)}catch(b){console.warn("[nimbi-cms] setNotFoundPage failed",b)}try{await Se(x,R)}catch(b){throw x==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${x} not found at ${R}${x}: ${b.message}`)}er(c),await Jn(h,k);try{const b=document.createElement("header");b.className="nimbi-site-navbar",I.insertBefore(b,X);const L=await Se("_navigation.md",R),N=await Vt(L.raw||""),{navbar:Z,linkEls:te}=await Ra(b,X,N.html||"",R,x,at,E.renderByQuery,q,u,o,l,M);try{await on("onNavBuild",{navWrap:K,navbar:Z,linkEls:te,contentBase:R})}catch(re){console.warn("[nimbi-cms] onNavBuild hooks failed",re)}try{const re=()=>{const de=b&&b.getBoundingClientRect&&Math.round(b.getBoundingClientRect().height)||b&&b.offsetHeight||0;if(de>0){try{I.style.setProperty("--nimbi-site-navbar-height",`${de}px`)}catch(be){console.warn("[nimbi-cms] set CSS var failed",be)}try{X.style.paddingTop=""}catch(be){console.warn("[nimbi-cms] set container paddingTop failed",be)}try{const be=I&&I.getBoundingClientRect&&Math.round(I.getBoundingClientRect().height)||I&&I.clientHeight||0;if(be>0){const Oe=Math.max(0,be-de);try{X.style.setProperty("--nimbi-cms-height",`${Oe}px`)}catch(ut){console.warn("[nimbi-cms] set --nimbi-cms-height failed",ut)}}else try{X.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(Oe){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Oe)}}catch(be){console.warn("[nimbi-cms] compute container height failed",be)}try{b.style.setProperty("--nimbi-site-navbar-height",`${de}px`)}catch(be){console.warn("[nimbi-cms] set navbar CSS var failed",be)}}};re();try{if(typeof ResizeObserver<"u"){const de=new ResizeObserver(()=>re());try{de.observe(b)}catch(be){console.warn("[nimbi-cms] ResizeObserver.observe failed",be)}}}catch(de){console.warn("[nimbi-cms] ResizeObserver setup failed",de)}}catch(re){console.warn("[nimbi-cms] compute navbar height failed",re)}}catch(b){console.warn("[nimbi-cms] build navigation failed",b)}await E.renderByQuery();try{Promise.resolve().then(()=>qa).then(({getVersion:b})=>{typeof b=="function"&&b().then(L=>{try{const N=L||"0.0.0";try{const Z=te=>{const re=document.createElement("a");re.className="nimbi-version-label tag is-small",re.textContent=`Ninbi CMS v. ${N}`,re.href=te||"#",re.target="_blank",re.rel="noopener noreferrer nofollow",re.setAttribute("aria-label",`Ninbi CMS version ${N}`);try{tr(re)}catch{}try{I.appendChild(re)}catch(de){console.warn("[nimbi-cms] append version label failed",de)}};(async()=>{try{const te=await Promise.resolve().then(()=>ki).catch(()=>null),re=te&&(te.default||te);let de=null;re&&(re.homepage&&typeof re.homepage=="string"?de=re.homepage:re.repository&&(typeof re.repository=="string"?de=re.repository:re.repository.url&&typeof re.repository.url=="string"&&(de=re.repository.url)));try{de&&new URL(de)}catch{de=null}Z(de||"#")}catch{Z("#")}})()}catch(Z){console.warn("[nimbi-cms] building version label failed",Z)}}catch(N){console.warn("[nimbi-cms] building version label failed",N)}}).catch(L=>{console.warn("[nimbi-cms] getVersion() failed",L)})}).catch(b=>{console.warn("[nimbi-cms] import version module failed",b)})}catch(b){console.warn("[nimbi-cms] version label setup failed",b)}}async function Jr(){try{let t=null;try{t=await Promise.resolve().then(()=>ki)}catch{try{if(typeof fetch=="function"&&typeof location<"u"){const s=new URL("../package.json",location.href).toString(),r=await fetch(s);r&&r.ok?t={default:await r.json()}:t=null}else t=null}catch{t=null}}const e=t?.default?.version||t?.version;return typeof e=="string"&&e.trim()?e:"0.0.0"}catch{return"0.0.0"}}const qa=Object.freeze(Object.defineProperty({__proto__:null,getVersion:Jr},Symbol.toStringTag,{value:"Module"})),ei="nimbi-cms",ti="0.1.0",ni={type:"git",url:"git+https://github.com/AbelVM/nimbiCMS.git"},ri="https://abelvm.github.io/nimbiCMS/",ii="Lightweight CMS client for static sites with Bulma UI and search/indexing features",si=["cms","static","bulma","search","markdown","nimbi"],ai="Abel Vázquez Montoro",oi="MIT",li={url:"https://github.com/AbelVM/nimbiCMS/issues"},ci={node:">=16"},ui="module",hi={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js",prepare:"npm run build:lib && npm run gen-dts","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},di={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},fi={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17","typedoc-plugin-markdown":"^4.10.0",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},pi="dist/nimbi-cms.cjs.js",gi="dist/nimbi-cms.es.js",mi="src/index.d.ts",wi="dist/nimbi-cms.js",bi=["dist","src/index.d.ts"],yi={access:"public"},ki=Object.freeze(Object.defineProperty({__proto__:null,author:ai,bugs:li,default:{name:ei,version:ti,repository:ni,homepage:ri,private:!0,description:ii,keywords:si,author:ai,license:oi,bugs:li,engines:ci,type:ui,scripts:hi,dependencies:di,devDependencies:fi,main:pi,module:gi,types:mi,unpkg:wi,files:bi,publishConfig:yi},dependencies:di,description:ii,devDependencies:fi,engines:ci,files:bi,homepage:ri,keywords:si,license:oi,main:pi,module:gi,name:ei,publishConfig:yi,repository:ni,scripts:hi,type:ui,types:mi,unpkg:wi,version:ti},Symbol.toStringTag,{value:"Module"}));ue.BAD_LANGUAGES=cn,ue.SUPPORTED_HLJS_MAP=ne,ue._clearHooks=Hi,ue.addHook=It,ue.default=Vr,ue.ensureBulma=Jn,ue.getVersion=Jr,ue.initCMS=Vr,ue.loadL10nFile=dn,ue.loadSupportedLanguages=hn,ue.observeCodeBlocks=Vn,ue.onNavBuild=Oi,ue.onPageLoad=Ni,ue.registerLanguage=it,ue.runHooks=on,ue.setHighlightTheme=Wi,ue.setLang=fn,ue.setStyle=er,ue.setThemeVars=Gi,ue.t=at,ue.transformHtml=Di,Object.defineProperties(ue,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
