(function(de,Ue){typeof exports=="object"&&typeof module<"u"?Ue(exports):typeof define=="function"&&define.amd?define(["exports"],Ue):(de=typeof globalThis<"u"?globalThis:de||self,Ue(de.nimbiCMS={}))})(this,(function(de){"use strict";const Ue={onPageLoad:[],onNavBuild:[],transformHtml:[]};function zt(t,e){if(!Object.prototype.hasOwnProperty.call(Ue,t))throw new Error('Unknown hook "'+t+'"');if(typeof e!="function")throw new TypeError("hook callback must be a function");Ue[t].push(e)}function Di(t){zt("onPageLoad",t)}function Hi(t){zt("onNavBuild",t)}function Ui(t){zt("transformHtml",t)}async function cn(t,e){const n=Ue[t]||[];for(const s of n)try{await s(e)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function ji(){Object.keys(Ue).forEach(t=>{Ue[t].length=0})}function Vn(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var un,Jn;function Fi(){if(Jn)return un;Jn=1;function t(w){return w instanceof Map?w.clear=w.delete=w.set=function(){throw new Error("map is read-only")}:w instanceof Set&&(w.add=w.clear=w.delete=function(){throw new Error("set is read-only")}),Object.freeze(w),Object.getOwnPropertyNames(w).forEach(x=>{const L=w[x],K=typeof L;(K==="object"||K==="function")&&!Object.isFrozen(L)&&t(L)}),w}class e{constructor(x){x.data===void 0&&(x.data={}),this.data=x.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(w){return w.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(w,...x){const L=Object.create(null);for(const K in w)L[K]=w[K];return x.forEach(function(K){for(const be in K)L[be]=K[be]}),L}const r="</span>",i=w=>!!w.scope,a=(w,{prefix:x})=>{if(w.startsWith("language:"))return w.replace("language:","language-");if(w.includes(".")){const L=w.split(".");return[`${x}${L.shift()}`,...L.map((K,be)=>`${K}${"_".repeat(be+1)}`)].join(" ")}return`${x}${w}`};class c{constructor(x,L){this.buffer="",this.classPrefix=L.classPrefix,x.walk(this)}addText(x){this.buffer+=n(x)}openNode(x){if(!i(x))return;const L=a(x.scope,{prefix:this.classPrefix});this.span(L)}closeNode(x){i(x)&&(this.buffer+=r)}value(){return this.buffer}span(x){this.buffer+=`<span class="${x}">`}}const o=(w={})=>{const x={children:[]};return Object.assign(x,w),x};class u{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(x){this.top.children.push(x)}openNode(x){const L=o({scope:x});this.add(L),this.stack.push(L)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(x){return this.constructor._walk(x,this.rootNode)}static _walk(x,L){return typeof L=="string"?x.addText(L):L.children&&(x.openNode(L),L.children.forEach(K=>this._walk(x,K)),x.closeNode(L)),x}static _collapse(x){typeof x!="string"&&x.children&&(x.children.every(L=>typeof L=="string")?x.children=[x.children.join("")]:x.children.forEach(L=>{u._collapse(L)}))}}class l extends u{constructor(x){super(),this.options=x}addText(x){x!==""&&this.add(x)}startScope(x){this.openNode(x)}endScope(){this.closeNode()}__addSublanguage(x,L){const K=x.root;L&&(K.scope=`language:${L}`),this.add(K)}toHTML(){return new c(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(w){return w?typeof w=="string"?w:w.source:null}function p(w){return g("(?=",w,")")}function f(w){return g("(?:",w,")*")}function h(w){return g("(?:",w,")?")}function g(...w){return w.map(L=>d(L)).join("")}function m(w){const x=w[w.length-1];return typeof x=="object"&&x.constructor===Object?(w.splice(w.length-1,1),x):{}}function b(...w){return"("+(m(w).capture?"":"?:")+w.map(K=>d(K)).join("|")+")"}function k(w){return new RegExp(w.toString()+"|").exec("").length-1}function A(w,x){const L=w&&w.exec(x);return L&&L.index===0}const C=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function M(w,{joinWith:x}){let L=0;return w.map(K=>{L+=1;const be=L;let ye=d(K),N="";for(;ye.length>0;){const P=C.exec(ye);if(!P){N+=ye;break}N+=ye.substring(0,P.index),ye=ye.substring(P.index+P[0].length),P[0][0]==="\\"&&P[1]?N+="\\"+String(Number(P[1])+be):(N+=P[0],P[0]==="("&&L++)}return N}).map(K=>`(${K})`).join(x)}const z=/\b\B/,Z="[a-zA-Z]\\w*",V="[a-zA-Z_]\\w*",ie="\\b\\d+(\\.\\d+)?",J="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",W="\\b(0b[01]+)",X="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",D=(w={})=>{const x=/^#![ ]*\//;return w.binary&&(w.begin=g(x,/.*\b/,w.binary,/\b.*/)),s({scope:"meta",begin:x,end:/$/,relevance:0,"on:begin":(L,K)=>{L.index!==0&&K.ignoreMatch()}},w)},he={begin:"\\\\[\\s\\S]",relevance:0},F={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[he]},S={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[he]},re={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},Q=function(w,x,L={}){const K=s({scope:"comment",begin:w,end:x,contains:[]},L);K.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const be=b("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return K.contains.push({begin:g(/[ ]+/,"(",be,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),K},v=Q("//","$"),$=Q("/\\*","\\*/"),y=Q("#","$"),R={scope:"number",begin:ie,relevance:0},I={scope:"number",begin:J,relevance:0},_={scope:"number",begin:W,relevance:0},O={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[he,{begin:/\[/,end:/\]/,relevance:0,contains:[he]}]},B={scope:"title",begin:Z,relevance:0},ce={scope:"title",begin:V,relevance:0},me={begin:"\\.\\s*"+V,relevance:0};var Be=Object.freeze({__proto__:null,APOS_STRING_MODE:F,BACKSLASH_ESCAPE:he,BINARY_NUMBER_MODE:_,BINARY_NUMBER_RE:W,COMMENT:Q,C_BLOCK_COMMENT_MODE:$,C_LINE_COMMENT_MODE:v,C_NUMBER_MODE:I,C_NUMBER_RE:J,END_SAME_AS_BEGIN:function(w){return Object.assign(w,{"on:begin":(x,L)=>{L.data._beginMatch=x[1]},"on:end":(x,L)=>{L.data._beginMatch!==x[1]&&L.ignoreMatch()}})},HASH_COMMENT_MODE:y,IDENT_RE:Z,MATCH_NOTHING_RE:z,METHOD_GUARD:me,NUMBER_MODE:R,NUMBER_RE:ie,PHRASAL_WORDS_MODE:re,QUOTE_STRING_MODE:S,REGEXP_MODE:O,RE_STARTERS_RE:X,SHEBANG:D,TITLE_MODE:B,UNDERSCORE_IDENT_RE:V,UNDERSCORE_TITLE_MODE:ce});function Pt(w,x){w.input[w.index-1]==="."&&x.ignoreMatch()}function tn(w,x){w.className!==void 0&&(w.scope=w.className,delete w.className)}function dt(w,x){x&&w.beginKeywords&&(w.begin="\\b("+w.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",w.__beforeBegin=Pt,w.keywords=w.keywords||w.beginKeywords,delete w.beginKeywords,w.relevance===void 0&&(w.relevance=0))}function Un(w,x){Array.isArray(w.illegal)&&(w.illegal=b(...w.illegal))}function Qa(w,x){if(w.match){if(w.begin||w.end)throw new Error("begin & end are not supported with match");w.begin=w.match,delete w.match}}function Xa(w,x){w.relevance===void 0&&(w.relevance=1)}const Ka=(w,x)=>{if(!w.beforeMatch)return;if(w.starts)throw new Error("beforeMatch cannot be used with starts");const L=Object.assign({},w);Object.keys(w).forEach(K=>{delete w[K]}),w.keywords=L.keywords,w.begin=g(L.beforeMatch,p(L.begin)),w.starts={relevance:0,contains:[Object.assign(L,{endsParent:!0})]},w.relevance=0,delete L.beforeMatch},Ya=["of","and","for","in","not","or","if","then","parent","list","value"],Va="keyword";function Ai(w,x,L=Va){const K=Object.create(null);return typeof w=="string"?be(L,w.split(" ")):Array.isArray(w)?be(L,w):Object.keys(w).forEach(function(ye){Object.assign(K,Ai(w[ye],x,ye))}),K;function be(ye,N){x&&(N=N.map(P=>P.toLowerCase())),N.forEach(function(P){const G=P.split("|");K[G[0]]=[ye,Ja(G[0],G[1])]})}}function Ja(w,x){return x?Number(x):eo(w)?0:1}function eo(w){return Ya.includes(w.toLowerCase())}const Ei={},it=w=>{console.error(w)},Ri=(w,...x)=>{console.log(`WARN: ${w}`,...x)},ft=(w,x)=>{Ei[`${w}/${x}`]||(console.log(`Deprecated as of ${w}. ${x}`),Ei[`${w}/${x}`]=!0)},nn=new Error;function Li(w,x,{key:L}){let K=0;const be=w[L],ye={},N={};for(let P=1;P<=x.length;P++)N[P+K]=be[P],ye[P+K]=!0,K+=k(x[P-1]);w[L]=N,w[L]._emit=ye,w[L]._multi=!0}function to(w){if(Array.isArray(w.begin)){if(w.skip||w.excludeBegin||w.returnBegin)throw it("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),nn;if(typeof w.beginScope!="object"||w.beginScope===null)throw it("beginScope must be object"),nn;Li(w,w.begin,{key:"beginScope"}),w.begin=M(w.begin,{joinWith:""})}}function no(w){if(Array.isArray(w.end)){if(w.skip||w.excludeEnd||w.returnEnd)throw it("skip, excludeEnd, returnEnd not compatible with endScope: {}"),nn;if(typeof w.endScope!="object"||w.endScope===null)throw it("endScope must be object"),nn;Li(w,w.end,{key:"endScope"}),w.end=M(w.end,{joinWith:""})}}function ro(w){w.scope&&typeof w.scope=="object"&&w.scope!==null&&(w.beginScope=w.scope,delete w.scope)}function io(w){ro(w),typeof w.beginScope=="string"&&(w.beginScope={_wrap:w.beginScope}),typeof w.endScope=="string"&&(w.endScope={_wrap:w.endScope}),to(w),no(w)}function so(w){function x(N,P){return new RegExp(d(N),"m"+(w.case_insensitive?"i":"")+(w.unicodeRegex?"u":"")+(P?"g":""))}class L{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(P,G){G.position=this.position++,this.matchIndexes[this.matchAt]=G,this.regexes.push([G,P]),this.matchAt+=k(P)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const P=this.regexes.map(G=>G[1]);this.matcherRe=x(M(P,{joinWith:"|"}),!0),this.lastIndex=0}exec(P){this.matcherRe.lastIndex=this.lastIndex;const G=this.matcherRe.exec(P);if(!G)return null;const Ae=G.findIndex((It,Fn)=>Fn>0&&It!==void 0),ke=this.matchIndexes[Ae];return G.splice(0,Ae),Object.assign(G,ke)}}class K{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(P){if(this.multiRegexes[P])return this.multiRegexes[P];const G=new L;return this.rules.slice(P).forEach(([Ae,ke])=>G.addRule(Ae,ke)),G.compile(),this.multiRegexes[P]=G,G}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(P,G){this.rules.push([P,G]),G.type==="begin"&&this.count++}exec(P){const G=this.getMatcher(this.regexIndex);G.lastIndex=this.lastIndex;let Ae=G.exec(P);if(this.resumingScanAtSamePosition()&&!(Ae&&Ae.index===this.lastIndex)){const ke=this.getMatcher(0);ke.lastIndex=this.lastIndex+1,Ae=ke.exec(P)}return Ae&&(this.regexIndex+=Ae.position+1,this.regexIndex===this.count&&this.considerAll()),Ae}}function be(N){const P=new K;return N.contains.forEach(G=>P.addRule(G.begin,{rule:G,type:"begin"})),N.terminatorEnd&&P.addRule(N.terminatorEnd,{type:"end"}),N.illegal&&P.addRule(N.illegal,{type:"illegal"}),P}function ye(N,P){const G=N;if(N.isCompiled)return G;[tn,Qa,io,Ka].forEach(ke=>ke(N,P)),w.compilerExtensions.forEach(ke=>ke(N,P)),N.__beforeBegin=null,[dt,Un,Xa].forEach(ke=>ke(N,P)),N.isCompiled=!0;let Ae=null;return typeof N.keywords=="object"&&N.keywords.$pattern&&(N.keywords=Object.assign({},N.keywords),Ae=N.keywords.$pattern,delete N.keywords.$pattern),Ae=Ae||/\w+/,N.keywords&&(N.keywords=Ai(N.keywords,w.case_insensitive)),G.keywordPatternRe=x(Ae,!0),P&&(N.begin||(N.begin=/\B|\b/),G.beginRe=x(G.begin),!N.end&&!N.endsWithParent&&(N.end=/\B|\b/),N.end&&(G.endRe=x(G.end)),G.terminatorEnd=d(G.end)||"",N.endsWithParent&&P.terminatorEnd&&(G.terminatorEnd+=(N.end?"|":"")+P.terminatorEnd)),N.illegal&&(G.illegalRe=x(N.illegal)),N.contains||(N.contains=[]),N.contains=[].concat(...N.contains.map(function(ke){return ao(ke==="self"?N:ke)})),N.contains.forEach(function(ke){ye(ke,G)}),N.starts&&ye(N.starts,P),G.matcher=be(G),G}if(w.compilerExtensions||(w.compilerExtensions=[]),w.contains&&w.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return w.classNameAliases=s(w.classNameAliases||{}),ye(w)}function Ti(w){return w?w.endsWithParent||Ti(w.starts):!1}function ao(w){return w.variants&&!w.cachedVariants&&(w.cachedVariants=w.variants.map(function(x){return s(w,{variants:null},x)})),w.cachedVariants?w.cachedVariants:Ti(w)?s(w,{starts:w.starts?s(w.starts):null}):Object.isFrozen(w)?s(w):w}var oo="11.11.1";class lo extends Error{constructor(x,L){super(x),this.name="HTMLInjectionError",this.html=L}}const jn=n,Ci=s,Mi=Symbol("nomatch"),co=7,_i=function(w){const x=Object.create(null),L=Object.create(null),K=[];let be=!0;const ye="Could not find the language '{}', did you forget to load/include a language module?",N={disableAutodetect:!0,name:"Plain text",contains:[]};let P={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:l};function G(E){return P.noHighlightRe.test(E)}function Ae(E){let H=E.className+" ";H+=E.parentNode?E.parentNode.className:"";const se=P.languageDetectRe.exec(H);if(se){const pe=Ve(se[1]);return pe||(Ri(ye.replace("{}",se[1])),Ri("Falling back to no-highlight mode for this block.",E)),pe?se[1]:"no-highlight"}return H.split(/\s+/).find(pe=>G(pe)||Ve(pe))}function ke(E,H,se){let pe="",Se="";typeof H=="object"?(pe=E,se=H.ignoreIllegals,Se=H.language):(ft("10.7.0","highlight(lang, code, ...args) has been deprecated."),ft("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),Se=E,pe=H),se===void 0&&(se=!0);const Ne={code:pe,language:Se};sn("before:highlight",Ne);const Je=Ne.result?Ne.result:It(Ne.language,Ne.code,se);return Je.code=Ne.code,sn("after:highlight",Je),Je}function It(E,H,se,pe){const Se=Object.create(null);function Ne(T,q){return T.keywords[q]}function Je(){if(!Y.keywords){Ee.addText(ge);return}let T=0;Y.keywordPatternRe.lastIndex=0;let q=Y.keywordPatternRe.exec(ge),te="";for(;q;){te+=ge.substring(T,q.index);const ue=He.case_insensitive?q[0].toLowerCase():q[0],Le=Ne(Y,ue);if(Le){const[Ze,Lo]=Le;if(Ee.addText(te),te="",Se[ue]=(Se[ue]||0)+1,Se[ue]<=co&&(ln+=Lo),Ze.startsWith("_"))te+=q[0];else{const To=He.classNameAliases[Ze]||Ze;De(q[0],To)}}else te+=q[0];T=Y.keywordPatternRe.lastIndex,q=Y.keywordPatternRe.exec(ge)}te+=ge.substring(T),Ee.addText(te)}function an(){if(ge==="")return;let T=null;if(typeof Y.subLanguage=="string"){if(!x[Y.subLanguage]){Ee.addText(ge);return}T=It(Y.subLanguage,ge,!0,qi[Y.subLanguage]),qi[Y.subLanguage]=T._top}else T=Wn(ge,Y.subLanguage.length?Y.subLanguage:null);Y.relevance>0&&(ln+=T.relevance),Ee.__addSublanguage(T._emitter,T.language)}function $e(){Y.subLanguage!=null?an():Je(),ge=""}function De(T,q){T!==""&&(Ee.startScope(q),Ee.addText(T),Ee.endScope())}function zi(T,q){let te=1;const ue=q.length-1;for(;te<=ue;){if(!T._emit[te]){te++;continue}const Le=He.classNameAliases[T[te]]||T[te],Ze=q[te];Le?De(Ze,Le):(ge=Ze,Je(),ge=""),te++}}function Bi(T,q){return T.scope&&typeof T.scope=="string"&&Ee.openNode(He.classNameAliases[T.scope]||T.scope),T.beginScope&&(T.beginScope._wrap?(De(ge,He.classNameAliases[T.beginScope._wrap]||T.beginScope._wrap),ge=""):T.beginScope._multi&&(zi(T.beginScope,q),ge="")),Y=Object.create(T,{parent:{value:Y}}),Y}function Ni(T,q,te){let ue=A(T.endRe,te);if(ue){if(T["on:end"]){const Le=new e(T);T["on:end"](q,Le),Le.isMatchIgnored&&(ue=!1)}if(ue){for(;T.endsParent&&T.parent;)T=T.parent;return T}}if(T.endsWithParent)return Ni(T.parent,q,te)}function So(T){return Y.matcher.regexIndex===0?(ge+=T[0],1):(Xn=!0,0)}function vo(T){const q=T[0],te=T.rule,ue=new e(te),Le=[te.__beforeBegin,te["on:begin"]];for(const Ze of Le)if(Ze&&(Ze(T,ue),ue.isMatchIgnored))return So(q);return te.skip?ge+=q:(te.excludeBegin&&(ge+=q),$e(),!te.returnBegin&&!te.excludeBegin&&(ge=q)),Bi(te,T),te.returnBegin?0:q.length}function Ao(T){const q=T[0],te=H.substring(T.index),ue=Ni(Y,T,te);if(!ue)return Mi;const Le=Y;Y.endScope&&Y.endScope._wrap?($e(),De(q,Y.endScope._wrap)):Y.endScope&&Y.endScope._multi?($e(),zi(Y.endScope,T)):Le.skip?ge+=q:(Le.returnEnd||Le.excludeEnd||(ge+=q),$e(),Le.excludeEnd&&(ge=q));do Y.scope&&Ee.closeNode(),!Y.skip&&!Y.subLanguage&&(ln+=Y.relevance),Y=Y.parent;while(Y!==ue.parent);return ue.starts&&Bi(ue.starts,T),Le.returnEnd?0:q.length}function Eo(){const T=[];for(let q=Y;q!==He;q=q.parent)q.scope&&T.unshift(q.scope);T.forEach(q=>Ee.openNode(q))}let on={};function Oi(T,q){const te=q&&q[0];if(ge+=T,te==null)return $e(),0;if(on.type==="begin"&&q.type==="end"&&on.index===q.index&&te===""){if(ge+=H.slice(q.index,q.index+1),!be){const ue=new Error(`0 width match regex (${E})`);throw ue.languageName=E,ue.badRule=on.rule,ue}return 1}if(on=q,q.type==="begin")return vo(q);if(q.type==="illegal"&&!se){const ue=new Error('Illegal lexeme "'+te+'" for mode "'+(Y.scope||"<unnamed>")+'"');throw ue.mode=Y,ue}else if(q.type==="end"){const ue=Ao(q);if(ue!==Mi)return ue}if(q.type==="illegal"&&te==="")return ge+=`
`,1;if(Qn>1e5&&Qn>q.index*3)throw new Error("potential infinite loop, way more iterations than matches");return ge+=te,te.length}const He=Ve(E);if(!He)throw it(ye.replace("{}",E)),new Error('Unknown language: "'+E+'"');const Ro=so(He);let Gn="",Y=pe||Ro;const qi={},Ee=new P.__emitter(P);Eo();let ge="",ln=0,st=0,Qn=0,Xn=!1;try{if(He.__emitTokens)He.__emitTokens(H,Ee);else{for(Y.matcher.considerAll();;){Qn++,Xn?Xn=!1:Y.matcher.considerAll(),Y.matcher.lastIndex=st;const T=Y.matcher.exec(H);if(!T)break;const q=H.substring(st,T.index),te=Oi(q,T);st=T.index+te}Oi(H.substring(st))}return Ee.finalize(),Gn=Ee.toHTML(),{language:E,value:Gn,relevance:ln,illegal:!1,_emitter:Ee,_top:Y}}catch(T){if(T.message&&T.message.includes("Illegal"))return{language:E,value:jn(H),illegal:!0,relevance:0,_illegalBy:{message:T.message,index:st,context:H.slice(st-100,st+100),mode:T.mode,resultSoFar:Gn},_emitter:Ee};if(be)return{language:E,value:jn(H),illegal:!1,relevance:0,errorRaised:T,_emitter:Ee,_top:Y};throw T}}function Fn(E){const H={value:jn(E),illegal:!1,relevance:0,_top:N,_emitter:new P.__emitter(P)};return H._emitter.addText(E),H}function Wn(E,H){H=H||P.languages||Object.keys(x);const se=Fn(E),pe=H.filter(Ve).filter(Ii).map($e=>It($e,E,!1));pe.unshift(se);const Se=pe.sort(($e,De)=>{if($e.relevance!==De.relevance)return De.relevance-$e.relevance;if($e.language&&De.language){if(Ve($e.language).supersetOf===De.language)return 1;if(Ve(De.language).supersetOf===$e.language)return-1}return 0}),[Ne,Je]=Se,an=Ne;return an.secondBest=Je,an}function uo(E,H,se){const pe=H&&L[H]||se;E.classList.add("hljs"),E.classList.add(`language-${pe}`)}function Zn(E){let H=null;const se=Ae(E);if(G(se))return;if(sn("before:highlightElement",{el:E,language:se}),E.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",E);return}if(E.children.length>0&&(P.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(E)),P.throwUnescapedHTML))throw new lo("One of your code blocks includes unescaped HTML.",E.innerHTML);H=E;const pe=H.textContent,Se=se?ke(pe,{language:se,ignoreIllegals:!0}):Wn(pe);E.innerHTML=Se.value,E.dataset.highlighted="yes",uo(E,se,Se.language),E.result={language:Se.language,re:Se.relevance,relevance:Se.relevance},Se.secondBest&&(E.secondBest={language:Se.secondBest.language,relevance:Se.secondBest.relevance}),sn("after:highlightElement",{el:E,result:Se,text:pe})}function ho(E){P=Ci(P,E)}const fo=()=>{rn(),ft("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function po(){rn(),ft("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let $i=!1;function rn(){function E(){rn()}if(document.readyState==="loading"){$i||window.addEventListener("DOMContentLoaded",E,!1),$i=!0;return}document.querySelectorAll(P.cssSelector).forEach(Zn)}function go(E,H){let se=null;try{se=H(w)}catch(pe){if(it("Language definition for '{}' could not be registered.".replace("{}",E)),be)it(pe);else throw pe;se=N}se.name||(se.name=E),x[E]=se,se.rawDefinition=H.bind(null,w),se.aliases&&Pi(se.aliases,{languageName:E})}function mo(E){delete x[E];for(const H of Object.keys(L))L[H]===E&&delete L[H]}function wo(){return Object.keys(x)}function Ve(E){return E=(E||"").toLowerCase(),x[E]||x[L[E]]}function Pi(E,{languageName:H}){typeof E=="string"&&(E=[E]),E.forEach(se=>{L[se.toLowerCase()]=H})}function Ii(E){const H=Ve(E);return H&&!H.disableAutodetect}function bo(E){E["before:highlightBlock"]&&!E["before:highlightElement"]&&(E["before:highlightElement"]=H=>{E["before:highlightBlock"](Object.assign({block:H.el},H))}),E["after:highlightBlock"]&&!E["after:highlightElement"]&&(E["after:highlightElement"]=H=>{E["after:highlightBlock"](Object.assign({block:H.el},H))})}function yo(E){bo(E),K.push(E)}function ko(E){const H=K.indexOf(E);H!==-1&&K.splice(H,1)}function sn(E,H){const se=E;K.forEach(function(pe){pe[se]&&pe[se](H)})}function xo(E){return ft("10.7.0","highlightBlock will be removed entirely in v12.0"),ft("10.7.0","Please use highlightElement now."),Zn(E)}Object.assign(w,{highlight:ke,highlightAuto:Wn,highlightAll:rn,highlightElement:Zn,highlightBlock:xo,configure:ho,initHighlighting:fo,initHighlightingOnLoad:po,registerLanguage:go,unregisterLanguage:mo,listLanguages:wo,getLanguage:Ve,registerAliases:Pi,autoDetection:Ii,inherit:Ci,addPlugin:yo,removePlugin:ko}),w.debugMode=function(){be=!1},w.safeMode=function(){be=!0},w.versionString=oo,w.regex={concat:g,lookahead:p,either:b,optional:h,anyNumberOfTimes:f};for(const E in Be)typeof Be[E]=="object"&&t(Be[E]);return Object.assign(w,Be),w},pt=_i({});return pt.newInstance=()=>_i({}),un=pt,pt.HighlightJS=pt,pt.default=pt,un}var Wi=Fi();const fe=Vn(Wi),Zi="11.11.1",ne=new Map,Gi="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Me={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Me.html="xml",Me.xhtml="xml",Me.markup="xml";const hn=new Set(["magic","undefined"]);let Ge=null;const dn=new Map,Qi=300*1e3;async function fn(t=Gi){if(t)return Ge||(Ge=(async()=>{try{const e=await fetch(t);if(!e.ok)return;const s=(await e.text()).split(/\r?\n/);let r=-1;for(let u=0;u<s.length;u++)if(/\|\s*Language\s*\|/i.test(s[u])){r=u;break}if(r===-1)return;const i=s[r].replace(/^\||\|$/g,"").split("|").map(u=>u.trim().toLowerCase());let a=i.findIndex(u=>/alias|aliases|equivalent|alt|alternates?/i.test(u));a===-1&&(a=1);let c=i.findIndex(u=>/file|filename|module|module name|module-name|short|slug/i.test(u));if(c===-1){const u=i.findIndex(l=>/language/i.test(l));c=u!==-1?u:0}let o=[];for(let u=r+1;u<s.length;u++){const l=s[u].trim();if(!l||!l.startsWith("|"))break;const d=l.replace(/^\||\|$/g,"").split("|").map(m=>m.trim());if(d.every(m=>/^-+$/.test(m)))continue;const p=d;if(!p.length)continue;const h=(p[c]||p[0]||"").toString().trim().toLowerCase();if(!h||/^-+$/.test(h))continue;ne.set(h,h);const g=p[a]||"";if(g){const m=String(g).split(",").map(b=>b.replace(/`/g,"").trim()).filter(Boolean);if(m.length){const k=m[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");k&&/[a-z0-9]/i.test(k)&&(ne.set(k,k),o.push(k))}}}try{const u=[];for(const l of o){const d=String(l||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");d&&/[a-z0-9]/i.test(d)?u.push(d):ne.delete(l)}o=u}catch(u){console.warn("[codeblocksManager] cleanup aliases failed",u)}try{let u=0;for(const l of Array.from(ne.keys())){if(!l||/^-+$/.test(l)||!/[a-z0-9]/i.test(l)){ne.delete(l),u++;continue}if(/^[:]+/.test(l)){const d=l.replace(/^[:]+/,"");if(d&&/[a-z0-9]/i.test(d)){const p=ne.get(l);ne.delete(l),ne.set(d,p)}else ne.delete(l),u++}}for(const[l,d]of Array.from(ne.entries()))(!d||/^-+$/.test(d)||!/[a-z0-9]/i.test(d))&&(ne.delete(l),u++);try{const l=":---------------------";ne.has(l)&&(ne.delete(l),u++)}catch(l){console.warn("[codeblocksManager] remove sep key failed",l)}try{const l=Array.from(ne.keys()).sort()}catch(l){console.warn("[codeblocksManager] compute supported keys failed",l)}}catch(u){console.warn("[codeblocksManager] ignored error",u)}}catch(e){console.warn("[codeblocksManager] loadSupportedLanguages failed",e)}})(),Ge)}const gt=new Set;async function at(t,e){if(Ge||(async()=>{try{await fn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Ge)try{await Ge}catch{}if(t=t==null?"":String(t),t=t.trim(),!t)return!1;const n=t.toLowerCase();if(hn.has(n))return!1;if(ne.size&&!ne.has(n)){const r=Me;if(!r[n]&&!r[t])return!1}if(gt.has(t))return!0;const s=Me;try{const r=(e||t||"").toString().replace(/\.js$/i,"").trim(),i=(s[t]||t||"").toString(),a=(s[r]||r||"").toString();let c=Array.from(new Set([i,a,r,t,s[r],s[t]].filter(Boolean))).map(l=>String(l).toLowerCase()).filter(l=>l&&l!=="undefined");ne.size&&(c=c.filter(l=>{if(ne.has(l))return!0;const d=Me[l];return!!(d&&ne.has(d))}));let o=null,u=null;for(const l of c)try{const d=Date.now();let p=dn.get(l);if(p&&p.ok===!1&&d-(p.ts||0)>=Qi&&(dn.delete(l),p=void 0),p){if(p.module)o=p.module;else if(p.promise)try{o=await p.promise}catch{o=null}}else{const f={promise:null,module:null,ok:null,ts:0};dn.set(l,f),f.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${l}.js`)}catch{return await import(`highlight.js/lib/languages/${l}`)}}catch{try{const g=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${l}.js`;return await new Function("u","return import(u)")(g)}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${l}.js`;return await new Function("u","return import(u)")(m)}catch{return null}}}}catch{return null}})();try{o=await f.promise,f.module=o,f.ok=!!o,f.ts=Date.now()}catch{f.module=null,f.ok=!1,f.ts=Date.now(),o=null}}if(o){const f=o.default||o;try{const h=ne.size&&ne.get(t)||l||t;return fe.registerLanguage(h,f),gt.add(h),h!==t&&(fe.registerLanguage(t,f),gt.add(t)),!0}catch(h){u=h}}else try{if(ne.has(l)||ne.has(t)){const f=()=>({});try{fe.registerLanguage(l,f),gt.add(l)}catch{}try{l!==t&&(fe.registerLanguage(t,f),gt.add(t))}catch{}return!0}}catch{}}catch(d){u=d}if(u)throw u;return!1}catch{return!1}}let Bt=null;function er(t=document){Ge||(async()=>{try{await fn()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const e=Me,s=Bt||(typeof IntersectionObserver>"u"?null:(Bt=new IntersectionObserver((i,a)=>{i.forEach(c=>{if(!c.isIntersecting)return;const o=c.target;try{a.unobserve(o)}catch(u){console.warn("[codeblocksManager] observer unobserve failed",u)}(async()=>{try{const u=o.getAttribute&&o.getAttribute("class")||o.className||"",l=u.match(/language-([a-zA-Z0-9_+-]+)/)||u.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const d=(l[1]||"").toLowerCase(),p=e[d]||d,f=ne.size&&(ne.get(p)||ne.get(String(p).toLowerCase()))||p;try{await at(f)}catch(h){console.warn("[codeblocksManager] registerLanguage failed",h)}try{try{const h=o.textContent||o.innerText||"";h!=null&&(o.textContent=h)}catch{}try{o&&o.dataset&&o.dataset.highlighted&&delete o.dataset.highlighted}catch{}fe.highlightElement(o)}catch(h){console.warn("[codeblocksManager] hljs.highlightElement failed",h)}}else try{const d=o.textContent||"";try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const p=fe.highlight(d,{language:"plaintext"});p&&p.value&&(o.innerHTML=p.value)}}catch{try{fe.highlightElement(o)}catch(f){console.warn("[codeblocksManager] fallback highlightElement failed",f)}}}catch(d){console.warn("[codeblocksManager] auto-detect plaintext failed",d)}}catch(u){console.warn("[codeblocksManager] observer entry processing failed",u)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Bt)),r=t&&t.querySelectorAll?t.querySelectorAll("pre code"):[];if(!s){r.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",c=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const o=(c[1]||"").toLowerCase(),u=e[o]||o,l=ne.size&&(ne.get(u)||ne.get(String(u).toLowerCase()))||u;try{await at(l)}catch(d){console.warn("[codeblocksManager] registerLanguage failed (no observer)",d)}}try{try{const o=i.textContent||i.innerText||"";o!=null&&(i.textContent=o)}catch{}try{i&&i.dataset&&i.dataset.highlighted&&delete i.dataset.highlighted}catch{}fe.highlightElement(i)}catch(o){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",o)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function Xi(t,{useCdn:e=!0}={}){const n=document.querySelector("link[data-hl-theme]"),s=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=t==null?"default":String(t),i=r&&String(r).toLowerCase()||"";if(i==="default"||i==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(s&&s.toLowerCase()===i)return;if(!e){console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");return}const a=i,c=`https://cdn.jsdelivr.net/npm/highlight.js@${Zi}/styles/${a}.css`,o=document.createElement("link");o.rel="stylesheet",o.href=c,o.setAttribute("data-hl-theme",a),o.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(o)}let et="light";function Ki(t,e={}){if(document.querySelector(`link[href="${t}"]`))return;const n=document.createElement("link");n.rel="stylesheet",n.href=t,Object.entries(e).forEach(([s,r])=>n.setAttribute(s,r)),document.head.appendChild(n)}async function tr(t="none",e="/"){if(!t||t==="none")return;const n=[e+"bulma.css","/bulma.css"],s=Array.from(new Set(n));if(t==="local"){if(document.querySelector("style[data-bulma-override]"))return;for(const r of s)try{const i=await fetch(r,{method:"GET"});if(i.ok){const a=await i.text(),c=document.createElement("style");c.setAttribute("data-bulma-override",r),c.appendChild(document.createTextNode(`
/* bulma override: ${r} */
`+a)),document.head.appendChild(c);return}}catch(i){console.warn("[bulmaManager] fetch local bulma candidate failed",i)}return}try{const r=String(t).trim();if(!r)return;const i=`https://unpkg.com/bulmaswatch/${encodeURIComponent(r)}/bulmaswatch.min.css`;Ki(i,{"data-bulmaswatch-theme":r})}catch(r){console.warn("[bulmaManager] ensureBulma failed",r)}}function nr(t){et=t==="dark"?"dark":t==="system"?"system":"light";try{const e=Array.from(document.querySelectorAll(".nimbi-mount"));if(e.length>0)for(const n of e)et==="dark"?n.setAttribute("data-theme","dark"):et==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;et==="dark"?n.setAttribute("data-theme","dark"):et==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function Yi(t){const e=document.documentElement;for(const[n,s]of Object.entries(t||{}))try{e.style.setProperty(`--${n}`,s)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function rr(t){if(!t||!(t instanceof HTMLElement))return()=>{};const e=t.closest&&t.closest(".nimbi-mount")||null;try{e&&(et==="dark"?e.setAttribute("data-theme","dark"):et==="light"?e.setAttribute("data-theme","light"):e.removeAttribute("data-theme"))}catch{}return()=>{}}const ir={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},ot=JSON.parse(JSON.stringify(ir));let Nt="en";if(typeof navigator<"u"){const t=navigator.language||navigator.languages&&navigator.languages[0]||"en";Nt=String(t).split("-")[0].toLowerCase()}ir[Nt]||(Nt="en");let Qe=Nt;function lt(t,e={}){const n=ot[Qe]||ot.en;let s=n&&n[t]?n[t]:ot.en[t]||"";for(const r of Object.keys(e))s=s.replace(new RegExp(`{${r}}`,"g"),String(e[r]));return s}async function pn(t,e){if(!t)return;let n=t;try{/^https?:\/\//.test(t)||(n=new URL(t,location.origin+e).toString());const s=await fetch(n);if(!s.ok)return;const r=await s.json();for(const i of Object.keys(r||{}))ot[i]=Object.assign({},ot[i]||{},r[i])}catch{}}function gn(t){const e=String(t).split("-")[0].toLowerCase();Qe=ot[e]?e:"en"}const Vi=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Qe},loadL10nFile:pn,setLang:gn,t:lt},Symbol.toStringTag,{value:"Module"})),Ji=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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
`;function sr(t,e="worker"){let n=null;function s(){if(!n)try{const c=t();n=c||null,c&&c.addEventListener("error",()=>{try{n===c&&(n=null,c.terminate&&c.terminate())}catch(o){console.warn("["+e+"] worker termination failed",o)}})}catch(c){n=null,console.warn("["+e+"] worker init failed",c)}return n}function r(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(c){console.warn("["+e+"] worker termination failed",c)}}function i(c,o=1e3){return new Promise((u,l)=>{const d=s();if(!d)return l(new Error("worker unavailable"));const p=String(Math.random());c.id=p;let f=null;const h=()=>{f&&clearTimeout(f),d.removeEventListener("message",g),d.removeEventListener("error",m)},g=b=>{const k=b.data||{};k.id===p&&(h(),k.error?l(new Error(k.error)):u(k.result))},m=b=>{h(),console.warn("["+e+"] worker error event",b);try{n===d&&(n=null,d.terminate&&d.terminate())}catch(k){console.warn("["+e+"] worker termination failed",k)}l(new Error(b&&b.message||"worker error"))};f=setTimeout(()=>{h(),console.warn("["+e+"] worker timed out");try{n===d&&(n=null,d.terminate&&d.terminate())}catch(b){console.warn("["+e+"] worker termination on timeout failed",b)}l(new Error("worker timeout"))},o),d.addEventListener("message",g),d.addEventListener("error",m);try{d.postMessage(c)}catch(b){h(),l(b)}})}return{get:s,send:i,terminate:r}}function es(t){try{if(typeof Blob<"u"&&typeof URL<"u"&&t){const e=new Blob([t],{type:"application/javascript"}),n=URL.createObjectURL(e);return new Worker(n,{type:"module"})}}catch(e){console.warn("[worker-manager] createWorkerFromRaw failed",e)}return null}const Oe=new Set;function mn(t){ts(),Oe.clear();for(const e of _e)e&&Oe.add(e);ar(ee),ar(j),mn._refreshed=!0}function ar(t){if(!(!t||typeof t.values!="function"))for(const e of t.values())e&&Oe.add(e)}function or(t){if(!t||typeof t.set!="function")return;const e=t.set;t.set=function(n,s){return s&&Oe.add(s),e.call(this,n,s)}}let lr=!1;function ts(){lr||(or(ee),or(j),lr=!0)}function cr(t){return!t||typeof t!="string"?!1:/^(https?:)?\/\//.test(t)||t.startsWith("mailto:")||t.startsWith("tel:")}function we(t){return String(t||"").replace(/^[.\/]+/,"")}function mt(t){return String(t||"").replace(/\/+$/,"")}function wt(t){return mt(t)+"/"}function ns(t){try{if(!t||typeof document>"u"||!document.head||t.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${t}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=t,document.head.appendChild(n)}catch(e){console.warn("[helpers] preloadImage failed",e)}}function Ot(t,e=0,n=!1){try{if(typeof window>"u"||!t||!t.querySelectorAll)return;const s=Array.from(t.querySelectorAll("img"));if(!s.length)return;const r=t,i=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,c=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=i?Math.max(a,i.top):a,l=(i?Math.min(c,i.bottom):c)+Number(e||0);let d=0;r&&(d=r.clientHeight||(i?i.height:0)),d||(d=c-a);let p=.6;try{const m=r&&window.getComputedStyle?window.getComputedStyle(r):null,b=m&&m.getPropertyValue("--nimbi-image-max-height-ratio"),k=b?parseFloat(b):NaN;!Number.isNaN(k)&&k>0&&k<=1&&(p=k)}catch(m){console.warn("[helpers] read CSS ratio failed",m)}const f=Math.max(200,Math.floor(d*p));let h=!1,g=null;if(s.forEach(m=>{try{const b=m.getAttribute?m.getAttribute("loading"):void 0;b!=="eager"&&m.setAttribute&&m.setAttribute("loading","lazy");const k=m.getBoundingClientRect?m.getBoundingClientRect():null,A=m.src||m.getAttribute&&m.getAttribute("src"),C=k&&k.height>1?k.height:f,M=k?k.top:0,z=M+C;k&&C>0&&M<=l&&z>=o&&(m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high"),ns(A),h=!0),!g&&k&&k.top<=l&&(g={img:m,src:A,rect:k,beforeLoading:b})}catch(b){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",b)}}),!h&&g){const{img:m,src:b,rect:k,beforeLoading:A}=g;try{m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high")}catch(C){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",C)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function qt(t){try{const e=t();return e&&typeof e.then=="function"?e.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):e}catch(e){console.warn("[helpers] safe swallowed error",e)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=qt)}catch(t){console.warn("[helpers] global attach failed",t)}const ee=new Map;let Te=[],wn=!1;function rs(t){wn=!!t}function ur(t){Te=Array.isArray(t)?t.slice():[]}function is(){return Te}const hr=sr(()=>es(Ji),"slugManager");function bn(){return hr.get()}function dr(t){return hr.send(t)}async function ss(t,e=1,n=void 0){if(!bn())return Wt(t,e,n);try{return await dr({type:"buildSearchIndex",contentBase:t,indexDepth:e,noIndexing:n})}catch(r){try{return await Wt(t,e,n)}catch(i){throw console.warn("[slugManager] buildSearchIndex fallback failed",i),r}}}async function as(t,e,n){return bn()?dr({type:"crawlForSlug",slug:t,base:e,maxQueue:n}):xn(t,e,n)}function Xe(t,e){if(t)if(Te&&Te.length){const s=e.split("/")[0],r=Te.includes(s);let i=ee.get(t);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),r?i.langs[s]=e:i.default=e,ee.set(t,i)}else ee.set(t,e)}const Dt=new Set;function os(t){typeof t=="function"&&Dt.add(t)}function ls(t){typeof t=="function"&&Dt.delete(t)}const j=new Map;let yn={},_e=[],ct="_404.md",ut="_home.md";function kn(t){t!=null&&(ct=String(t||""))}function cs(t){t!=null&&(ut=String(t||""))}function us(t){yn=t||{}}const bt=new Map,Ht=new Set;function hs(){bt.clear(),Ht.clear()}function ds(t){if(!t||t.length===0)return"";let e=t[0];for(let s=1;s<t.length;s++){const r=t[s];let i=0;const a=Math.min(e.length,r.length);for(;i<a&&e[i]===r[i];)i++;e=e.slice(0,i)}const n=e.lastIndexOf("/");return n===-1?e:e.slice(0,n+1)}function Ut(t){ee.clear(),j.clear(),_e=[],Te=Te||[];const e=Object.keys(yn||{});if(!e.length)return;let n="";try{if(t){try{/^[a-z][a-z0-9+.-]*:/i.test(String(t))?n=new URL(String(t)).pathname:n=String(t||"")}catch(s){n=String(t||""),console.warn("[slugManager] parse contentBase failed",s)}n=wt(n)}}catch(s){n="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}n||(n=ds(e));for(const s of e){let r=s;n&&s.startsWith(n)?r=we(s.slice(n.length)):r=we(s),_e.push(r);try{mn()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=yn[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const c=le(a[1].trim());if(c)try{let o=c;if((!Te||!Te.length)&&(o=fr(o,new Set(ee.keys()))),Te&&Te.length){const l=r.split("/")[0],d=Te.includes(l);let p=ee.get(o);(!p||typeof p=="string")&&(p={default:typeof p=="string"?p:void 0,langs:{}}),d?p.langs[l]=r:p.default=r,ee.set(o,p)}else ee.set(o,r);j.set(r,o)}catch(o){console.warn("[slugManager] set slug mapping failed",o)}}}}}try{Ut()}catch(t){console.warn("[slugManager] initial setContentBase failed",t)}function le(t){let n=String(t||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function fr(t,e){if(!e.has(t))return t;let n=2,s=`${t}-${n}`;for(;e.has(s);)n+=1,s=`${t}-${n}`;return s}function fs(t){return yt(t,void 0)}function yt(t,e){if(!t)return!1;if(t.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(t)){if(e&&typeof e=="string")try{const n=new URL(t),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(t.startsWith("/")&&e&&typeof e=="string")try{const n=new URL(t,e),s=new URL(e);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!1}function jt(t){return t==null?t:String(t).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(e,n)=>n)}function kt(t){if(!t||!ee.has(t))return null;const e=ee.get(t);if(!e)return null;if(typeof e=="string")return e;if(Te&&Te.length&&Qe&&e.langs&&e.langs[Qe])return e.langs[Qe];if(e.default)return e.default;if(e.langs){const n=Object.keys(e.langs);if(n.length)return e.langs[n[0]]}return null}const xt=new Map;function ps(){xt.clear()}let ve=async function(t,e){if(!t)throw new Error("path required");try{const i=(String(t||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&ee.has(i)){const a=kt(i)||ee.get(i);a&&a!==t&&(t=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const n=e==null?"":mt(String(e));let s="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else if(n.startsWith("/"))s=n.replace(/\/$/,"")+"/"+t.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=n.startsWith("/")?n:"/"+n;s=i+a.replace(/\/$/,"")+"/"+t.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+t.replace(/^\//,"")}catch{s="/"+t.replace(/^\//,"")}if(xt.has(s))return xt.get(s);const r=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const d=`${n}/${ct}`,p=await globalThis.fetch(d);if(p&&typeof p.ok=="boolean"&&p.ok)return{raw:await p.text(),status:404}}catch(d){console.warn("[slugManager] fetching fallback 404 failed",d)}let l="";try{i&&typeof i.clone=="function"?l=await i.clone().text():i&&typeof i.text=="function"?l=await i.text():l=""}catch(d){l="",console.warn("[slugManager] reading error body failed",d)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:l.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),c=a.trim().slice(0,16).toLowerCase(),o=c.startsWith("<!doctype")||c.startsWith("<html"),u=o||String(t||"").toLowerCase().endsWith(".html");if(o&&String(t||"").toLowerCase().endsWith(".md")){try{const l=`${n}/${ct}`,d=await globalThis.fetch(l);if(d.ok)return{raw:await d.text(),status:404}}catch(l){console.warn("[slugManager] fetching fallback 404 failed",l)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return u?{raw:a,isHtml:!0}:{raw:a}})();return xt.set(s,r),r};function gs(t){typeof t=="function"&&(ve=t)}const Ft=new Map;function ms(t){if(!t||typeof t!="string")return"";let e=t.replace(/```[\s\S]*?```/g,"");return e=e.replace(/<pre[\s\S]*?<\/pre>/gi,""),e=e.replace(/<code[\s\S]*?<\/code>/gi,""),e=e.replace(/<!--([\s\S]*?)-->/g,""),e=e.replace(/^ {4,}.*$/gm,""),e=e.replace(/`[^`]*`/g,""),e}let je=[],St=null;async function Wt(t,e=1,n=void 0){const s=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>we(String(r||""))))):[];try{const r=we(String(ct||""));r&&!s.includes(r)&&s.push(r)}catch{}if(je&&je.length&&e===1&&!je.some(i=>{try{return s.includes(we(String(i.path||"")))}catch{return!1}}))return je;if(St)return St;St=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(u=>we(String(u||""))))):[];try{const u=we(String(ct||""));u&&!r.includes(u)&&r.push(u)}catch{}const i=u=>{if(!r||!r.length)return!1;for(const l of r)if(l&&(u===l||u.startsWith(l+"/")))return!0;return!1};let a=[];if(_e&&_e.length&&(a=Array.from(_e)),!a.length)for(const u of ee.values())u&&a.push(u);try{const u=await wr(t);u&&u.length&&(a=a.concat(u))}catch(u){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",u)}try{const u=new Set(a),l=[...a];for(u.size;l.length&&u.size<=vt;){const d=l.shift();try{const p=await ve(d,t);if(p&&p.raw){if(p.status===404)continue;let f=p.raw;const h=[],g=String(d||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(g)&&wn&&(!d||!d.includes("/")))continue;const m=ms(f),b=/\[[^\]]+\]\(([^)]+)\)/g;let k;for(;k=b.exec(m);)h.push(k[1]);const A=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;k=A.exec(m);)h.push(k[1]);const C=d&&d.includes("/")?d.substring(0,d.lastIndexOf("/")+1):"";for(let M of h)try{if(yt(M,t)||M.startsWith("..")||M.indexOf("/../")!==-1||(C&&!M.startsWith("./")&&!M.startsWith("/")&&!M.startsWith("../")&&(M=C+M),M=we(M),!/\.(md|html?)(?:$|[?#])/i.test(M))||(M=M.split(/[?#]/)[0],i(M)))continue;u.has(M)||(u.add(M),l.push(M),a.push(M))}catch(z){console.warn("[slugManager] href processing failed",M,z)}}}catch(p){console.warn("[slugManager] discovery fetch failed for",d,p)}}}catch(u){console.warn("[slugManager] discovery loop failed",u)}const c=new Set;a=a.filter(u=>!u||c.has(u)||i(u)?!1:(c.add(u),!0));const o=[];for(const u of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(u))try{const l=await ve(u,t);if(l&&l.raw){if(l.status===404)continue;let d="",p="";if(l.isHtml)try{const g=new DOMParser().parseFromString(l.raw,"text/html"),m=g.querySelector("title")||g.querySelector("h1");m&&m.textContent&&(d=m.textContent.trim());const b=g.querySelector("p");if(b&&b.textContent&&(p=b.textContent.trim()),e>=2)try{const k=g.querySelector("h1"),A=k&&k.textContent?k.textContent.trim():d||"",C=(()=>{try{if(j.has(u))return j.get(u)}catch{}return le(d||u)})(),M=Array.from(g.querySelectorAll("h2"));for(const z of M)try{const Z=(z.textContent||"").trim();if(!Z)continue;const V=z.id?z.id:le(Z),ie=C?`${C}::${V}`:`${le(u)}::${V}`;let J="",W=z.nextElementSibling;for(;W&&W.tagName&&W.tagName.toLowerCase()==="script";)W=W.nextElementSibling;W&&W.textContent&&(J=String(W.textContent).trim()),o.push({slug:ie,title:Z,excerpt:J,path:u,parentTitle:A})}catch(Z){console.warn("[slugManager] indexing H2 failed",Z)}if(e===3)try{const z=Array.from(g.querySelectorAll("h3"));for(const Z of z)try{const V=(Z.textContent||"").trim();if(!V)continue;const ie=Z.id?Z.id:le(V),J=C?`${C}::${ie}`:`${le(u)}::${ie}`;let W="",X=Z.nextElementSibling;for(;X&&X.tagName&&X.tagName.toLowerCase()==="script";)X=X.nextElementSibling;X&&X.textContent&&(W=String(X.textContent).trim()),o.push({slug:J,title:V,excerpt:W,path:u,parentTitle:A})}catch(V){console.warn("[slugManager] indexing H3 failed",V)}}catch(z){console.warn("[slugManager] collect H3s failed",z)}}catch(k){console.warn("[slugManager] collect H2s failed",k)}}catch(h){console.warn("[slugManager] parsing HTML for index failed",h)}else{const h=l.raw,g=h.match(/^#\s+(.+)$/m);d=g?g[1].trim():"";try{d=jt(d)}catch{}const m=h.split(/\r?\n\s*\r?\n/);if(m.length>1)for(let b=1;b<m.length;b++){const k=m[b].trim();if(k&&!/^#/.test(k)){p=k.replace(/\r?\n/g," ");break}}if(e>=2){let b="",k="";try{const A=(h.match(/^#\s+(.+)$/m)||[])[1];b=A?A.trim():"",k=(function(){try{if(j.has(u))return j.get(u)}catch{}return le(d||u)})();const C=/^##\s+(.+)$/gm;let M;for(;M=C.exec(h);)try{const z=(M[1]||"").trim(),Z=jt(z);if(!z)continue;const V=le(z),ie=k?`${k}::${V}`:`${le(u)}::${V}`,W=h.slice(C.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),X=W&&W[1]?String(W[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:ie,title:Z,excerpt:X,path:u,parentTitle:b})}catch(z){console.warn("[slugManager] indexing markdown H2 failed",z)}}catch(A){console.warn("[slugManager] collect markdown H2s failed",A)}if(e===3)try{const A=/^###\s+(.+)$/gm;let C;for(;C=A.exec(h);)try{const M=(C[1]||"").trim(),z=jt(M);if(!M)continue;const Z=le(M),V=k?`${k}::${Z}`:`${le(u)}::${Z}`,J=h.slice(A.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),W=J&&J[1]?String(J[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:V,title:z,excerpt:W,path:u,parentTitle:b})}catch(M){console.warn("[slugManager] indexing markdown H3 failed",M)}}catch(A){console.warn("[slugManager] collect markdown H3s failed",A)}}}let f="";try{j.has(u)&&(f=j.get(u))}catch(h){console.warn("[slugManager] mdToSlug access failed",h)}f||(f=le(d||u)),o.push({slug:f,title:d,excerpt:p,path:u})}}catch(l){console.warn("[slugManager] buildSearchIndex: entry fetch failed",l)}try{je=o.filter(l=>{try{return!i(String(l.path||""))}catch{return!0}})}catch(u){console.warn("[slugManager] filtering index by excludes failed",u),je=o}return je})();try{await St}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return St=null,je}const pr=1e3;let vt=pr;function ws(t){typeof t=="number"&&t>=0&&(vt=t)}const gr=new DOMParser,mr="a[href]";let xn=async function(t,e,n=vt){if(Ft.has(t))return Ft.get(t);let s=null;const r=new Set,i=[""];for(;i.length&&!s&&!(i.length>n);){const a=i.shift();if(r.has(a))continue;r.add(a);let c=e;c.endsWith("/")||(c+="/"),c+=a;try{let o;try{o=await globalThis.fetch(c)}catch(p){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:c,error:p});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:c,status:o.status});continue}const u=await o.text(),d=gr.parseFromString(u,"text/html").querySelectorAll(mr);for(const p of d)try{let f=p.getAttribute("href")||"";if(!f||yt(f,e)||f.startsWith("..")||f.indexOf("/../")!==-1)continue;if(f.endsWith("/")){const h=a+f;r.has(h)||i.push(h);continue}if(f.toLowerCase().endsWith(".md")){const h=we(a+f);try{if(j.has(h))continue;for(const g of ee.values());}catch(g){console.warn("[slugManager] slug map access failed",g)}try{const g=await ve(h,e);if(g&&g.raw){const m=(g.raw||"").match(/^#\s+(.+)$/m);if(m&&m[1]&&le(m[1].trim())===t){s=h;break}}}catch(g){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",g)}}}catch(f){console.warn("[slugManager] crawlForSlug: link iteration failed",f)}}catch(o){console.warn("[slugManager] crawlForSlug: directory fetch failed",o)}}return Ft.set(t,s),s};async function wr(t,e=vt){const n=new Set,s=new Set,r=[""];for(;r.length&&!(r.length>e);){const i=r.shift();if(s.has(i))continue;s.add(i);let a=t;a.endsWith("/")||(a+="/"),a+=i;try{let c;try{c=await globalThis.fetch(a)}catch(d){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:d});continue}if(!c||!c.ok){c&&!c.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:c.status});continue}const o=await c.text(),l=gr.parseFromString(o,"text/html").querySelectorAll(mr);for(const d of l)try{let p=d.getAttribute("href")||"";if(!p||yt(p,t)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){const h=i+p;s.has(h)||r.push(h);continue}const f=(i+p).replace(/^\/+/,"");/\.(md|html?)$/i.test(f)&&n.add(f)}catch(p){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",p)}}catch(c){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",c)}}return Array.from(n)}async function br(t,e,n){if(t&&typeof t=="string"&&(t=we(t),t=mt(t)),ee.has(t))return kt(t)||ee.get(t);for(const r of Dt)try{const i=await r(t,e);if(i)return Xe(t,i),j.set(i,t),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(_e&&_e.length){if(bt.has(t)){const r=bt.get(t);return ee.set(t,r),j.set(r,t),r}for(const r of _e)if(!Ht.has(r))try{const i=await ve(r,e);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const c=le(a[1].trim());if(Ht.add(r),c&&bt.set(c,r),c===t)return Xe(t,r),j.set(r,t),r}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const r=await Wt(e);if(r&&r.length){const i=r.find(a=>a.slug===t);if(i)return Xe(t,i.path),j.set(i.path,t),i.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await xn(t,e,n);if(r)return Xe(t,r),j.set(r,t),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const s=[`${t}.html`,`${t}.md`];for(const r of s)try{const i=await ve(r,e);if(i&&i.raw)return Xe(t,r),j.set(r,t),r}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(_e&&_e.length)for(const r of _e)try{const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(i)===t)return Xe(t,r),j.set(r,t),r}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const r=[];ut&&typeof ut=="string"&&ut.trim()&&r.push(ut),r.includes("_home.md")||r.push("_home.md");for(const i of r)try{const a=await ve(i,e);if(a&&a.raw){const c=(a.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]&&le(c[1].trim())===t)return Xe(t,i),j.set(i,t),i}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const Zt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:pr,_setAllMd:us,_storeSlugMapping:Xe,addSlugResolver:os,get allMarkdownPaths(){return _e},get availableLanguages(){return Te},buildSearchIndex:Wt,buildSearchIndexWorker:ss,clearFetchCache:ps,clearListCaches:hs,crawlAllMarkdown:wr,crawlCache:Ft,crawlForSlug:xn,crawlForSlugWorker:as,get defaultCrawlMaxQueue(){return vt},ensureSlug:br,fetchCache:xt,get fetchMarkdown(){return ve},getLanguages:is,get homePage(){return ut},initSlugWorker:bn,isExternalLink:fs,isExternalLinkWithBase:yt,listPathsFetched:Ht,listSlugCache:bt,mdToSlug:j,get notFoundPage(){return ct},removeSlugResolver:ls,resolveSlugPath:kt,get searchIndex(){return je},setContentBase:Ut,setDefaultCrawlMaxQueue:ws,setFetchMarkdown:gs,setHomePage:cs,setLanguages:ur,setNotFoundPage:kn,setSkipRootReadme:rs,get skipRootReadme(){return wn},slugResolvers:Dt,slugToMd:ee,slugify:le,unescapeMarkdown:jt,uniqueSlug:fr},Symbol.toStringTag,{value:"Module"}));let yr=100;function kr(t){yr=t}let At=300*1e3;function xr(t){At=t}const Pe=new Map;function bs(t){if(!Pe.has(t))return;const e=Pe.get(t),n=Date.now();if(e.ts+At<n){Pe.delete(t);return}return Pe.delete(t),Pe.set(t,e),e.value}function ys(t,e){if(Sr(),Sr(),Pe.delete(t),Pe.set(t,{value:e,ts:Date.now()}),Pe.size>yr){const n=Pe.keys().next().value;n!==void 0&&Pe.delete(n)}}function Sr(){if(!At||At<=0)return;const t=Date.now();for(const[e,n]of Pe.entries())n.ts+At<t&&Pe.delete(e)}async function ks(t,e){const n=new Set(Oe),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(s||[])){const i=r.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const c=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(c){let d=we(c[1]);d&&n.add(d);continue}const o=(r.textContent||"").trim(),u=(a.pathname||"").replace(/^.*\//,"");if(o&&le(o)===t||u&&le(u.replace(/\.(html?|md)$/i,""))===t)return a.toString();if(/\.(html?)$/i.test(a.pathname)){let d=a.pathname.replace(/^\//,"");n.add(d);continue}const l=a.pathname||"";if(l){const d=new URL(e),p=wt(d.pathname);if(l.indexOf(p)!==-1){let f=l.startsWith(p)?l.slice(p.length):l;f=we(f),f&&n.add(f)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const i=await ve(r,e);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const c=(a[1]||"").trim();if(c&&le(c)===t)return r}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function xs(t){const e=[];if(String(t).includes(".md")||String(t).includes(".html"))/index\.html$/i.test(t)||e.push(t);else try{const n=decodeURIComponent(String(t||""));if(ee.has(n)){const s=kt(n)||ee.get(n);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||e.push(s):(e.push(s),e.push(s+".html")))}else{if(Oe&&Oe.size)for(const s of Oe){const r=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(le(r)===n&&!/index\.html$/i.test(s)){e.push(s);break}}!e.length&&n&&!/\.(md|html?)$/i.test(n)&&(e.push(n+".html"),e.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return e}async function Ss(t,e){const n=t||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=t||"",i=null;if(r&&String(r).includes("::")){const h=String(r).split("::",2);r=h[0],i=h[1]||null}const c=`${t}|||${typeof Vi<"u"&&Qe?Qe:""}`,o=bs(c);if(o)r=o.resolved,i=o.anchor||i;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let h=decodeURIComponent(String(r||""));if(h&&typeof h=="string"&&(h=we(h),h=mt(h)),ee.has(h))r=kt(h)||ee.get(h);else{let g=await ks(h,e);if(g)r=g;else if(mn._refreshed&&Oe&&Oe.size||typeof e=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(e)){const m=await br(h,e);m&&(r=m)}}}ys(c,{resolved:r,anchor:i})}!i&&s&&(i=s);try{if(r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const h=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const g=await fetch(h);if(g&&g.ok){const m=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",k=(m||"").toLowerCase();if(b&&b.indexOf&&b.indexOf("text/html")!==-1||k.indexOf("<!doctype")!==-1||k.indexOf("<html")!==-1)return{data:{raw:m,isHtml:!0},pagePath:h.replace(/^\//,""),anchor:i}}}catch{}}}catch{}const u=xs(r),l=String(n||"").includes(".md")||String(n||"").includes(".html");if(l&&u.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&u.push(r),u.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&u.push(r),u.length===1&&/index\.html$/i.test(u[0])&&!l&&!ee.has(r)&&!ee.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let d=null,p=null,f=null;for(const h of u)if(h)try{const g=we(h);d=await ve(g,e),p=g;break}catch(g){f=g;try{console.warn("[router] candidate fetch failed",{candidate:h,contentBase:e,err:g&&g.message||g})}catch{}}if(!d){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:u,contentBase:e,fetchError:f&&(f.message||String(f))||null})}catch{}try{if(l&&String(n||"").toLowerCase().includes(".html"))try{const h=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",h);const g=await fetch(h);if(g&&g.ok){const m=await g.text(),b=g&&g.headers&&typeof g.headers.get=="function"&&g.headers.get("content-type")||"",k=(m||"").toLowerCase(),A=b&&b.indexOf&&b.indexOf("text/html")!==-1||k.indexOf("<!doctype")!==-1||k.indexOf("<html")!==-1;if(A||console.warn("[router] absolute fetch returned non-HTML",{abs:h,contentType:b,snippet:k.slice(0,200)}),A)try{const C=h,M=new URL(".",C).toString();try{const Z=typeof DOMParser<"u"?new DOMParser:null;if(Z){const V=Z.parseFromString(m||"","text/html"),ie=(D,he)=>{try{const F=he.getAttribute(D)||"";if(!F||/^(https?:)?\/\//i.test(F)||F.startsWith("/")||F.startsWith("#"))return;try{const S=new URL(F,C).toString();he.setAttribute(D,S)}catch(S){console.warn("[router] rewrite attribute failed",D,S)}}catch(F){console.warn("[router] rewrite helper failed",F)}},J=V.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),W=[];for(const D of Array.from(J||[]))try{const he=D.tagName?D.tagName.toLowerCase():"";if(he==="a")continue;if(D.hasAttribute("src")){const F=D.getAttribute("src");ie("src",D);const S=D.getAttribute("src");F!==S&&W.push({attr:"src",tag:he,before:F,after:S})}if(D.hasAttribute("href")&&he==="link"){const F=D.getAttribute("href");ie("href",D);const S=D.getAttribute("href");F!==S&&W.push({attr:"href",tag:he,before:F,after:S})}if(D.hasAttribute("href")&&he!=="link"){const F=D.getAttribute("href");ie("href",D);const S=D.getAttribute("href");F!==S&&W.push({attr:"href",tag:he,before:F,after:S})}if(D.hasAttribute("xlink:href")){const F=D.getAttribute("xlink:href");ie("xlink:href",D);const S=D.getAttribute("xlink:href");F!==S&&W.push({attr:"xlink:href",tag:he,before:F,after:S})}if(D.hasAttribute("poster")){const F=D.getAttribute("poster");ie("poster",D);const S=D.getAttribute("poster");F!==S&&W.push({attr:"poster",tag:he,before:F,after:S})}if(D.hasAttribute("srcset")){const re=(D.getAttribute("srcset")||"").split(",").map(Q=>Q.trim()).filter(Boolean).map(Q=>{const[v,$]=Q.split(/\s+/,2);if(!v||/^(https?:)?\/\//i.test(v)||v.startsWith("/"))return Q;try{const y=new URL(v,C).toString();return $?`${y} ${$}`:y}catch{return Q}}).join(", ");D.setAttribute("srcset",re)}}catch{}const X=V.documentElement&&V.documentElement.outerHTML?V.documentElement.outerHTML:m;try{W&&W.length&&console.warn("[router] rewritten asset refs",{abs:h,rewritten:W})}catch{}return{data:{raw:X,isHtml:!0},pagePath:String(n||""),anchor:i}}}catch{}let z=m;return/<base\s+[^>]*>/i.test(m)||(/<head[^>]*>/i.test(m)?z=m.replace(/(<head[^>]*>)/i,`$1<base href="${M}">`):z=`<base href="${M}">`+m),{data:{raw:z,isHtml:!0},pagePath:String(n||""),anchor:i}}catch{return{data:{raw:m,isHtml:!0},pagePath:String(n||""),anchor:i}}}}catch(h){console.warn("[router] absolute HTML fetch fallback failed",h)}}catch{}try{const h=decodeURIComponent(String(r||""));if(h&&!/\.(md|html?)$/i.test(h)){const g=[`/assets/${h}.html`,`/assets/${h}/index.html`];for(const m of g)try{const b=await fetch(m,{method:"GET"});if(b&&b.ok)return{data:{raw:await b.text(),isHtml:!0},pagePath:m.replace(/^\//,""),anchor:i}}catch{}}}catch(h){console.warn("[router] assets fallback failed",h)}throw new Error("no page data")}return{data:d,pagePath:p,anchor:i}}function Sn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var tt=Sn();function vr(t){tt=t}var nt={exec:()=>null};function ae(t,e=""){let n=typeof t=="string"?t:t.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(Ce.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,e)};return s}var vs=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Ce={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:t=>new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}#`),htmlBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:t=>new RegExp(`^ {0,${Math.min(3,t-1)}}>`)},As=/^(?:[ \t]*(?:\n|$))+/,Es=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Rs=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Et=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ls=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,vn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Ar=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Er=ae(Ar).replace(/bull/g,vn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ts=ae(Ar).replace(/bull/g,vn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),An=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Cs=/^[^\n]+/,En=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Ms=ae(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",En).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),_s=ae(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,vn).getRegex(),Gt="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Rn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,$s=ae("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Rn).replace("tag",Gt).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Rr=ae(An).replace("hr",Et).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Gt).getRegex(),Ps=ae(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Rr).getRegex(),Ln={blockquote:Ps,code:Es,def:Ms,fences:Rs,heading:Ls,hr:Et,html:$s,lheading:Er,list:_s,newline:As,paragraph:Rr,table:nt,text:Cs},Lr=ae("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Et).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Gt).getRegex(),Is={...Ln,lheading:Ts,table:Lr,paragraph:ae(An).replace("hr",Et).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Lr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Gt).getRegex()},zs={...Ln,html:ae(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Rn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:nt,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ae(An).replace("hr",Et).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Er).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Bs=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ns=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Tr=/^( {2,}|\\)\n(?!\s*$)/,Os=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Qt=/[\p{P}\p{S}]/u,Tn=/[\s\p{P}\p{S}]/u,Cr=/[^\s\p{P}\p{S}]/u,qs=ae(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Tn).getRegex(),Mr=/(?!~)[\p{P}\p{S}]/u,Ds=/(?!~)[\s\p{P}\p{S}]/u,Hs=/(?:[^\s\p{P}\p{S}]|~)/u,_r=/(?![*_])[\p{P}\p{S}]/u,Us=/(?![*_])[\s\p{P}\p{S}]/u,js=/(?:[^\s\p{P}\p{S}]|[*_])/u,Fs=ae(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",vs?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),$r=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Ws=ae($r,"u").replace(/punct/g,Qt).getRegex(),Zs=ae($r,"u").replace(/punct/g,Mr).getRegex(),Pr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Gs=ae(Pr,"gu").replace(/notPunctSpace/g,Cr).replace(/punctSpace/g,Tn).replace(/punct/g,Qt).getRegex(),Qs=ae(Pr,"gu").replace(/notPunctSpace/g,Hs).replace(/punctSpace/g,Ds).replace(/punct/g,Mr).getRegex(),Xs=ae("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Cr).replace(/punctSpace/g,Tn).replace(/punct/g,Qt).getRegex(),Ks=ae(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,_r).getRegex(),Ys="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Vs=ae(Ys,"gu").replace(/notPunctSpace/g,js).replace(/punctSpace/g,Us).replace(/punct/g,_r).getRegex(),Js=ae(/\\(punct)/,"gu").replace(/punct/g,Qt).getRegex(),ea=ae(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ta=ae(Rn).replace("(?:-->|$)","-->").getRegex(),na=ae("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ta).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Xt=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,ra=ae(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Xt).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ir=ae(/^!?\[(label)\]\[(ref)\]/).replace("label",Xt).replace("ref",En).getRegex(),zr=ae(/^!?\[(ref)\](?:\[\])?/).replace("ref",En).getRegex(),ia=ae("reflink|nolink(?!\\()","g").replace("reflink",Ir).replace("nolink",zr).getRegex(),Br=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Cn={_backpedal:nt,anyPunctuation:Js,autolink:ea,blockSkip:Fs,br:Tr,code:Ns,del:nt,delLDelim:nt,delRDelim:nt,emStrongLDelim:Ws,emStrongRDelimAst:Gs,emStrongRDelimUnd:Xs,escape:Bs,link:ra,nolink:zr,punctuation:qs,reflink:Ir,reflinkSearch:ia,tag:na,text:Os,url:nt},sa={...Cn,link:ae(/^!?\[(label)\]\((.*?)\)/).replace("label",Xt).getRegex(),reflink:ae(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Xt).getRegex()},Mn={...Cn,emStrongRDelimAst:Qs,emStrongLDelim:Zs,delLDelim:Ks,delRDelim:Vs,url:ae(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Br).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ae(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Br).getRegex()},aa={...Mn,br:ae(Tr).replace("{2,}","*").getRegex(),text:ae(Mn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Kt={normal:Ln,gfm:Is,pedantic:zs},Rt={normal:Cn,gfm:Mn,breaks:aa,pedantic:sa},oa={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Nr=t=>oa[t];function qe(t,e){if(e){if(Ce.escapeTest.test(t))return t.replace(Ce.escapeReplace,Nr)}else if(Ce.escapeTestNoEncode.test(t))return t.replace(Ce.escapeReplaceNoEncode,Nr);return t}function Or(t){try{t=encodeURI(t).replace(Ce.percentDecode,"%")}catch{return null}return t}function qr(t,e){let n=t.replace(Ce.findPipe,(i,a,c)=>{let o=!1,u=a;for(;--u>=0&&c[u]==="\\";)o=!o;return o?"|":" |"}),s=n.split(Ce.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(Ce.slashPipe,"|");return s}function Lt(t,e,n){let s=t.length;if(s===0)return"";let r=0;for(;r<s&&t.charAt(s-r-1)===e;)r++;return t.slice(0,s-r)}function la(t,e){if(t.indexOf(e[1])===-1)return-1;let n=0;for(let s=0;s<t.length;s++)if(t[s]==="\\")s++;else if(t[s]===e[0])n++;else if(t[s]===e[1]&&(n--,n<0))return s;return n>0?-2:-1}function ca(t,e=0){let n=e,s="";for(let r of t)if(r==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=r,n++;return s}function Dr(t,e,n,s,r){let i=e.href,a=e.title||null,c=t[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let o={type:t[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:c,tokens:s.inlineTokens(c)};return s.state.inLink=!1,o}function ua(t,e,n){let s=t.match(n.other.indentCodeCompensation);if(s===null)return e;let r=s[1];return e.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[c]=a;return c.length>=r.length?i.slice(r.length):i}).join(`
`)}var Yt=class{options;rules;lexer;constructor(t){this.options=t||tt}space(t){let e=this.rules.block.newline.exec(t);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(t){let e=this.rules.block.code.exec(t);if(e){let n=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Lt(n,`
`)}}}fences(t){let e=this.rules.block.fences.exec(t);if(e){let n=e[0],s=ua(n,e[3]||"",this.rules);return{type:"code",raw:n,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(t){let e=this.rules.block.heading.exec(t);if(e){let n=e[2].trim();if(this.rules.other.endingHash.test(n)){let s=Lt(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(t){let e=this.rules.block.hr.exec(t);if(e)return{type:"hr",raw:Lt(e[0],`
`)}}blockquote(t){let e=this.rules.block.blockquote.exec(t);if(e){let n=Lt(e[0],`
`).split(`
`),s="",r="",i=[];for(;n.length>0;){let a=!1,c=[],o;for(o=0;o<n.length;o++)if(this.rules.other.blockquoteStart.test(n[o]))c.push(n[o]),a=!0;else if(!a)c.push(n[o]);else break;n=n.slice(o);let u=c.join(`
`),l=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${u}`:u,r=r?`${r}
${l}`:l;let d=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(l,i,!0),this.lexer.state.top=d,n.length===0)break;let p=i.at(-1);if(p?.type==="code")break;if(p?.type==="blockquote"){let f=p,h=f.raw+`
`+n.join(`
`),g=this.blockquote(h);i[i.length-1]=g,s=s.substring(0,s.length-f.raw.length)+g.raw,r=r.substring(0,r.length-f.text.length)+g.text;break}else if(p?.type==="list"){let f=p,h=f.raw+`
`+n.join(`
`),g=this.list(h);i[i.length-1]=g,s=s.substring(0,s.length-p.raw.length)+g.raw,r=r.substring(0,r.length-f.raw.length)+g.raw,n=h.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(t){let e=this.rules.block.list.exec(t);if(e){let n=e[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;t;){let o=!1,u="",l="";if(!(e=i.exec(t))||this.rules.block.hr.test(t))break;u=e[0],t=t.substring(u.length);let d=ca(e[2].split(`
`,1)[0],e[1].length),p=t.split(`
`,1)[0],f=!d.trim(),h=0;if(this.options.pedantic?(h=2,l=d.trimStart()):f?h=e[1].length+1:(h=d.search(this.rules.other.nonSpaceChar),h=h>4?1:h,l=d.slice(h),h+=e[1].length),f&&this.rules.other.blankLine.test(p)&&(u+=p+`
`,t=t.substring(p.length+1),o=!0),!o){let g=this.rules.other.nextBulletRegex(h),m=this.rules.other.hrRegex(h),b=this.rules.other.fencesBeginRegex(h),k=this.rules.other.headingBeginRegex(h),A=this.rules.other.htmlBeginRegex(h),C=this.rules.other.blockquoteBeginRegex(h);for(;t;){let M=t.split(`
`,1)[0],z;if(p=M,this.options.pedantic?(p=p.replace(this.rules.other.listReplaceNesting,"  "),z=p):z=p.replace(this.rules.other.tabCharGlobal,"    "),b.test(p)||k.test(p)||A.test(p)||C.test(p)||g.test(p)||m.test(p))break;if(z.search(this.rules.other.nonSpaceChar)>=h||!p.trim())l+=`
`+z.slice(h);else{if(f||d.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||b.test(d)||k.test(d)||m.test(d))break;l+=`
`+p}f=!p.trim(),u+=M+`
`,t=t.substring(M.length+1),d=z.slice(h)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(a=!0)),r.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(l),loose:!1,text:l,tokens:[]}),r.raw+=u}let c=r.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let o of r.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let l=this.lexer.inlineQueue.length-1;l>=0;l--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[l].src)){this.lexer.inlineQueue[l].src=this.lexer.inlineQueue[l].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(o.raw);if(u){let l={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};o.checked=l.checked,r.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=l.raw+o.tokens[0].raw,o.tokens[0].text=l.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(l)):o.tokens.unshift({type:"paragraph",raw:l.raw,text:l.raw,tokens:[l]}):o.tokens.unshift(l)}}if(!r.loose){let u=o.tokens.filter(d=>d.type==="space"),l=u.length>0&&u.some(d=>this.rules.other.anyLine.test(d.raw));r.loose=l}}if(r.loose)for(let o of r.items){o.loose=!0;for(let u of o.tokens)u.type==="text"&&(u.type="paragraph")}return r}}html(t){let e=this.rules.block.html.exec(t);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(t){let e=this.rules.block.def.exec(t);if(e){let n=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:n,raw:e[0],href:s,title:r}}}table(t){let e=this.rules.block.table.exec(t);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let n=qr(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(qr(a,i.header.length).map((c,o)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:i.align[o]})));return i}}lheading(t){let e=this.rules.block.lheading.exec(t);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(t){let e=this.rules.block.paragraph.exec(t);if(e){let n=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:n,tokens:this.lexer.inline(n)}}}text(t){let e=this.rules.block.text.exec(t);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(t){let e=this.rules.inline.escape.exec(t);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(t){let e=this.rules.inline.tag.exec(t);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(t){let e=this.rules.inline.link.exec(t);if(e){let n=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=Lt(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=la(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Dr(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(t,e){let n;if((n=this.rules.inline.reflink.exec(t))||(n=this.rules.inline.nolink.exec(t))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return Dr(n,r,n[0],this.lexer,this.rules)}}emStrong(t,e,n=""){let s=this.rules.inline.emStrongLDelim.exec(t);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,c=r,o=0,u=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,e=e.slice(-1*t.length+r);(s=u.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){c+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){o+=a;continue}if(c-=a,c>0)continue;a=Math.min(a,a+c+o);let l=[...s[0]][0].length,d=t.slice(0,r+s.index+l+a);if(Math.min(r,a)%2){let f=d.slice(1,-1);return{type:"em",raw:d,text:f,tokens:this.lexer.inlineTokens(f)}}let p=d.slice(2,-2);return{type:"strong",raw:d,text:p,tokens:this.lexer.inlineTokens(p)}}}}codespan(t){let e=this.rules.inline.code.exec(t);if(e){let n=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:e[0],text:n}}}br(t){let e=this.rules.inline.br.exec(t);if(e)return{type:"br",raw:e[0]}}del(t,e,n=""){let s=this.rules.inline.delLDelim.exec(t);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,c=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,e=e.slice(-1*t.length+r);(s=o.exec(e))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){c+=a;continue}if(c-=a,c>0)continue;a=Math.min(a,a+c);let u=[...s[0]][0].length,l=t.slice(0,r+s.index+u+a),d=l.slice(r,-r);return{type:"del",raw:l,text:d,tokens:this.lexer.inlineTokens(d)}}}}autolink(t){let e=this.rules.inline.autolink.exec(t);if(e){let n,s;return e[2]==="@"?(n=e[1],s="mailto:"+n):(n=e[1],s=n),{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(t){let e;if(e=this.rules.inline.url.exec(t)){let n,s;if(e[2]==="@")n=e[0],s="mailto:"+n;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);n=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(t){let e=this.rules.inline.text.exec(t);if(e){let n=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:n}}}},Ie=class Kn{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||tt,this.options.tokenizer=this.options.tokenizer||new Yt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Ce,block:Kt.normal,inline:Rt.normal};this.options.pedantic?(n.block=Kt.pedantic,n.inline=Rt.pedantic):this.options.gfm&&(n.block=Kt.gfm,this.options.breaks?n.inline=Rt.breaks:n.inline=Rt.gfm),this.tokenizer.rules=n}static get rules(){return{block:Kt,inline:Rt}}static lex(e,n){return new Kn(n).lex(e)}static lexInline(e,n){return new Kn(n).inlineTokens(e)}lex(e){e=e.replace(Ce.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,n=[],s=!1){for(this.options.pedantic&&(e=e.replace(Ce.tabCharGlobal,"    ").replace(Ce.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},e,n))?(e=e.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),n.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let a=1/0,c=e.slice(1),o;this.options.extensions.startBlock.forEach(u=>{o=u.call({lexer:this},c),typeof o=="number"&&o>=0&&(a=Math.min(a,o))}),a<1/0&&a>=0&&(i=e.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(e){let a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(e,n=[]){return this.inlineQueue.push({src:e,tokens:n}),n}inlineTokens(e,n=[]){let s=e,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=r[2]?r[2].length:0,s=s.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,c="";for(;e;){a||(c=""),a=!1;let o;if(this.options.extensions?.inline?.some(l=>(o=l.call({lexer:this},e,n))?(e=e.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let l=n.at(-1);o.type==="text"&&l?.type==="text"?(l.raw+=o.raw,l.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(e,s,c)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(e,s,c)){e=e.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),n.push(o);continue}let u=e;if(this.options.extensions?.startInline){let l=1/0,d=e.slice(1),p;this.options.extensions.startInline.forEach(f=>{p=f.call({lexer:this},d),typeof p=="number"&&p>=0&&(l=Math.min(l,p))}),l<1/0&&l>=0&&(u=e.substring(0,l+1))}if(o=this.tokenizer.inlineText(u)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(c=o.raw.slice(-1)),a=!0;let l=n.at(-1);l?.type==="text"?(l.raw+=o.raw,l.text+=o.text):n.push(o);continue}if(e){let l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return n}},Vt=class{options;parser;constructor(t){this.options=t||tt}space(t){return""}code({text:t,lang:e,escaped:n}){let s=(e||"").match(Ce.notSpaceStart)?.[0],r=t.replace(Ce.endingNewline,"")+`
`;return s?'<pre><code class="language-'+qe(s)+'">'+(n?r:qe(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:qe(r,!0))+`</code></pre>
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
`}strong({tokens:t}){return`<strong>${this.parser.parseInline(t)}</strong>`}em({tokens:t}){return`<em>${this.parser.parseInline(t)}</em>`}codespan({text:t}){return`<code>${qe(t,!0)}</code>`}br(t){return"<br>"}del({tokens:t}){return`<del>${this.parser.parseInline(t)}</del>`}link({href:t,title:e,tokens:n}){let s=this.parser.parseInline(n),r=Or(t);if(r===null)return s;t=r;let i='<a href="'+t+'"';return e&&(i+=' title="'+qe(e)+'"'),i+=">"+s+"</a>",i}image({href:t,title:e,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=Or(t);if(r===null)return qe(n);t=r;let i=`<img src="${t}" alt="${qe(n)}"`;return e&&(i+=` title="${qe(e)}"`),i+=">",i}text(t){return"tokens"in t&&t.tokens?this.parser.parseInline(t.tokens):"escaped"in t&&t.escaped?t.text:qe(t.text)}},_n=class{strong({text:t}){return t}em({text:t}){return t}codespan({text:t}){return t}del({text:t}){return t}html({text:t}){return t}text({text:t}){return t}link({text:t}){return""+t}image({text:t}){return""+t}br(){return""}checkbox({raw:t}){return t}},ze=class Yn{options;renderer;textRenderer;constructor(e){this.options=e||tt,this.options.renderer=this.options.renderer||new Vt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new _n}static parse(e,n){return new Yn(n).parse(e)}static parseInline(e,n){return new Yn(n).parseInline(e)}parse(e){let n="";for(let s=0;s<e.length;s++){let r=e[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=c||"";continue}}let i=r;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,n=this.renderer){let s="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let c=this.options.extensions.renderers[i.type].call({parser:this},i);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=c||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let c='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}},Tt=class{options;block;constructor(t){this.options=t||tt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(t){return t}postprocess(t){return t}processAllTokens(t){return t}emStrongMask(t){return t}provideLexer(){return this.block?Ie.lex:Ie.lexInline}provideParser(){return this.block?ze.parse:ze.parseInline}},ha=class{defaults=Sn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ze;Renderer=Vt;TextRenderer=_n;Lexer=Ie;Tokenizer=Yt;Hooks=Tt;constructor(...t){this.use(...t)}walkTokens(t,e){let n=[];for(let s of t)switch(n=n.concat(e.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,e));break}case"list":{let r=s;n=n.concat(this.walkTokens(r.items,e));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,e))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,e)))}}return n}use(...t){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return t.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...a){let c=r.renderer.apply(this,a);return c===!1&&(c=i.apply(this,a)),c}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),n.renderer){let r=this.defaults.renderer||new Vt(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,c=n.renderer[a],o=r[a];r[a]=(...u)=>{let l=c.apply(r,u);return l===!1&&(l=o.apply(r,u)),l||""}}s.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Yt(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,c=n.tokenizer[a],o=r[a];r[a]=(...u)=>{let l=c.apply(r,u);return l===!1&&(l=o.apply(r,u)),l}}s.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new Tt;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,c=n.hooks[a],o=r[a];Tt.passThroughHooks.has(i)?r[a]=u=>{if(this.defaults.async&&Tt.passThroughHooksRespectAsync.has(i))return(async()=>{let d=await c.call(r,u);return o.call(r,d)})();let l=c.call(r,u);return o.call(r,l)}:r[a]=(...u)=>{if(this.defaults.async)return(async()=>{let d=await c.apply(r,u);return d===!1&&(d=await o.apply(r,u)),d})();let l=c.apply(r,u);return l===!1&&(l=o.apply(r,u)),l}}s.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let c=[];return c.push(i.call(this,a)),r&&(c=c.concat(r.call(this,a))),c}}this.defaults={...this.defaults,...s}}),this}setOptions(t){return this.defaults={...this.defaults,...t},this}lexer(t,e){return Ie.lex(t,e??this.defaults)}parser(t,e){return ze.parse(t,e??this.defaults)}parseMarkdown(t){return(e,n)=>{let s={...n},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=t),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(e):e,c=await(r.hooks?await r.hooks.provideLexer():t?Ie.lex:Ie.lexInline)(a,r),o=r.hooks?await r.hooks.processAllTokens(c):c;r.walkTokens&&await Promise.all(this.walkTokens(o,r.walkTokens));let u=await(r.hooks?await r.hooks.provideParser():t?ze.parse:ze.parseInline)(o,r);return r.hooks?await r.hooks.postprocess(u):u})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let a=(r.hooks?r.hooks.provideLexer():t?Ie.lex:Ie.lexInline)(e,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let c=(r.hooks?r.hooks.provideParser():t?ze.parse:ze.parseInline)(a,r);return r.hooks&&(c=r.hooks.postprocess(c)),c}catch(a){return i(a)}}}onError(t,e){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,t){let s="<p>An error occurred:</p><pre>"+qe(n.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(n);throw n}}},rt=new ha;function oe(t,e){return rt.parse(t,e)}oe.options=oe.setOptions=function(t){return rt.setOptions(t),oe.defaults=rt.defaults,vr(oe.defaults),oe},oe.getDefaults=Sn,oe.defaults=tt,oe.use=function(...t){return rt.use(...t),oe.defaults=rt.defaults,vr(oe.defaults),oe},oe.walkTokens=function(t,e){return rt.walkTokens(t,e)},oe.parseInline=rt.parseInline,oe.Parser=ze,oe.parser=ze.parse,oe.Renderer=Vt,oe.TextRenderer=_n,oe.Lexer=Ie,oe.lexer=Ie.lex,oe.Tokenizer=Yt,oe.Hooks=Tt,oe.parse=oe,oe.options,oe.setOptions,oe.use,oe.walkTokens,oe.parseInline,ze.parse,Ie.lex;const Hr=`function j() {
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
`,Ur=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",Hr],{type:"text/javascript;charset=utf-8"});function da(t){let e;try{if(e=Ur&&(self.URL||self.webkitURL).createObjectURL(Ur),!e)throw"";const n=new Worker(e,{type:"module",name:t?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(e)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(Hr),{type:"module",name:t?.name})}}function fa(t){if(t.startsWith("---")){const e=t.indexOf(`
---`,3);if(e!==-1){const n=t.slice(3,e+0).trim(),s=t.slice(e+4).trimStart(),r={};return n.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:s,data:r}}}return{content:t,data:{}}}const jr=sr(()=>new da,"markdown"),Fr=typeof DOMParser<"u"?new DOMParser:null;function $n(){return jr.get()}function pa(t){return jr.send(t,1e3)}const Ke=[];function Pn(t){if(t&&typeof t=="object"){Ke.push(t);try{oe.use(t)}catch(e){console.warn("[markdown] failed to apply plugin",e)}}}function ga(t){Ke.length=0,Array.isArray(t)&&Ke.push(...t.filter(e=>e&&typeof e=="object"));try{Ke.forEach(e=>oe.use(e))}catch(e){console.warn("[markdown] failed to apply markdown extensions",e)}}async function Jt(t){if($n&&$n())try{const i=await pa({type:"render",md:t});if(i&&i.html!==void 0)try{const c=(Fr||new DOMParser).parseFromString(i.html,"text/html"),o=c.querySelectorAll("h1,h2,h3,h4,h5,h6"),u=new Set,l=f=>{f||(f="heading");let h=f,g=2;for(;u.has(h);)h=`${f}-${g}`,g+=1;return u.add(h),h};o.forEach(f=>{if(f.id)f.id=l(f.id);else{const h=le(f.textContent||"");f.id=l(h)}try{const h=Number(f.tagName.substring(1));if(h>=1&&h<=6){const g={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},m=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal";`${g[h]} ${m}`.split(/\s+/).filter(Boolean).forEach(k=>{try{f.classList.add(k)}catch{}})}}catch{}});try{try{const h=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(h){const g=Array.from(c.querySelectorAll("img"));for(const m of g)try{const b=m.getAttribute("src")||"";if(new URL(b,location.href).toString()===h){const A=m.parentElement;m.remove(),A&&A.tagName&&A.tagName.toLowerCase()==="p"&&A.childNodes.length===0&&A.remove();break}}catch{}}}catch{}c.querySelectorAll("img").forEach(h=>{try{h.getAttribute("loading")||h.setAttribute("data-want-lazy","1")}catch(g){console.warn("[markdown] set image loading attribute failed",g)}})}catch(f){console.warn("[markdown] query images failed",f)}try{c.querySelectorAll("pre code").forEach(h=>{try{const g=h.getAttribute&&h.getAttribute("class")||h.className||"",m=String(g||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(m)try{h.setAttribute&&h.setAttribute("class",m)}catch(A){console.warn("[markdown] set code class failed",A),h.className=m}else try{h.removeAttribute&&h.removeAttribute("class")}catch(A){console.warn("[markdown] remove code class failed",A),h.className=""}const b=m,k=b.match(/language-([a-zA-Z0-9_+-]+)/)||b.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!k||!k[1])try{const A=h.textContent||"";try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const C=fe.highlight(A,{language:"plaintext"});C&&C.value&&(h.innerHTML=C.value)}}catch{try{fe.highlightElement(h)}catch(M){console.warn("[markdown] hljs.highlightElement failed",M)}}}catch(A){console.warn("[markdown] code auto-detect failed",A)}}catch(g){console.warn("[markdown] processing code blocks failed",g)}})}catch(f){console.warn("[markdown] query code blocks failed",f)}const d=c.body.innerHTML,p=[];return o.forEach(f=>{p.push({level:Number(f.tagName.substring(1)),text:(f.textContent||"").trim(),id:f.id})}),{html:d,meta:i.meta||{},toc:p}}catch(a){return console.warn("[markdown] post-process worker HTML failed",a),i}}catch(i){console.warn("[markdown] worker render failed",i)}const{content:n,data:s}=fa(t||"");if(oe.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""}),Ke&&Ke.length)try{Ke.forEach(i=>oe.use(i))}catch(i){console.warn("[markdown] apply plugins failed",i)}let r=oe.parse(n);try{const a=(Fr||new DOMParser).parseFromString(r,"text/html"),c=a.querySelectorAll("h1,h2,h3,h4,h5,h6");c.forEach(u=>{u.id||(u.id=le(u.textContent||""));try{const l=Number(u.tagName.substring(1));if(l>=1&&l<=6){const d={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},p=l<=2?"has-text-weight-bold":l<=4?"has-text-weight-semibold":"has-text-weight-normal";`${d[l]} ${p}`.split(/\s+/).filter(Boolean).forEach(h=>{try{u.classList.add(h)}catch{}})}}catch{}});try{try{const l=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute?document.documentElement.getAttribute("data-nimbi-logo-moved"):null;if(l){const d=Array.from(a.querySelectorAll("img"));for(const p of d)try{const f=p.getAttribute("src")||"";if(new URL(f,location.href).toString()===l){const g=p.parentElement;p.remove(),g&&g.tagName&&g.tagName.toLowerCase()==="p"&&g.childNodes.length===0&&g.remove();break}}catch{}}}catch{}a.querySelectorAll("img").forEach(l=>{try{l.getAttribute("loading")||l.setAttribute("data-want-lazy","1")}catch(d){console.warn("[markdown] set image loading attribute failed",d)}})}catch(u){console.warn("[markdown] query images failed",u)}try{a.querySelectorAll("pre code").forEach(l=>{try{const d=l.getAttribute&&l.getAttribute("class")||l.className||"",p=String(d||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(p)try{l.setAttribute&&l.setAttribute("class",p)}catch(g){console.warn("[markdown] set code class failed",g),l.className=p}else try{l.removeAttribute&&l.removeAttribute("class")}catch(g){console.warn("[markdown] remove code class failed",g),l.className=""}const f=p,h=f.match(/language-([a-zA-Z0-9_+-]+)/)||f.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(!h||!h[1])try{const g=l.textContent||"";try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const m=fe.highlight(g,{language:"plaintext"});m&&m.value&&(l.innerHTML=m.value)}}catch{try{fe.highlightElement(l)}catch(b){console.warn("[markdown] hljs.highlightElement failed",b)}}}catch(g){console.warn("[markdown] code auto-detect failed",g)}}catch(d){console.warn("[markdown] processing code blocks failed",d)}})}catch(u){console.warn("[markdown] query code blocks failed",u)}r=a.body.innerHTML;const o=[];return c.forEach(u=>{o.push({level:Number(u.tagName.substring(1)),text:(u.textContent||"").trim(),id:u.id})}),{html:a.body.innerHTML,meta:s||{},toc:o}}catch(i){console.warn("post-process markdown failed",i)}return{html:r,meta:s||{},toc:[]}}function In(t,e){const n=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(t);)if(a[1]){const c=a[1].toLowerCase();if(hn.has(c)||e&&e.size&&c.length<3&&!e.has(c)&&!(Me&&Me[c]&&e.has(Me[c])))continue;if(e&&e.size){if(e.has(c)){const u=e.get(c);u&&n.add(u);continue}if(Me&&Me[c]){const u=Me[c];if(e.has(u)){const l=e.get(u)||u;n.add(l);continue}}}(i.has(c)||c.length>=5&&c.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(c)&&!r.has(c))&&n.add(c)}return n}const ma=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:Pn,detectFenceLanguages:In,initRendererWorker:$n,markdownPlugins:Ke,parseMarkdownToHtml:Jt,setMarkdownExtensions:ga},Symbol.toStringTag,{value:"Module"}));function wa(t,e){try{return new URL(t,e).pathname}catch{try{return new URL(t,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(e||"").replace(/\/$/,"")+"/"+String(t||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(t||"")}}}}function ba(t,e){const n=document.createElement("aside");n.className="menu box nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=t("navigation"),n.appendChild(s);const r=document.createElement("ul");return r.className="menu-list",e.forEach(i=>{const a=document.createElement("li"),c=document.createElement("a");if(c.href="#"+i.path,c.textContent=i.name,a.appendChild(c),i.children&&i.children.length){const o=document.createElement("ul");i.children.forEach(u=>{const l=document.createElement("li"),d=document.createElement("a");d.href="#"+u.path,d.textContent=u.name,l.appendChild(d),o.appendChild(l)}),a.appendChild(o)}r.appendChild(a)}),n.appendChild(r),n}function ya(t,e,n=""){const s=document.createElement("aside");s.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=t("onThisPage"),s.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const c={};(e||[]).forEach(o=>{try{if(!o||o.level===1)return;const u=Number(o.level)>=2?Number(o.level):2,l=document.createElement("li"),d=document.createElement("a"),p=o.id||le(o.text||"");d.textContent=o.text||"";try{const m=String(n||"").replace(/^[\\.\\/]+/,""),b=m&&j&&j.has&&j.has(m)?j.get(m):m;b?d.href=`?page=${encodeURIComponent(b)}#${encodeURIComponent(p)}`:d.href=`#${encodeURIComponent(p)}`}catch(m){console.warn("[htmlBuilder] buildTocElement href normalization failed",m),d.href=`#${encodeURIComponent(p)}`}if(l.appendChild(d),u===2){i.appendChild(l),c[2]=l,Object.keys(c).forEach(m=>{Number(m)>2&&delete c[m]});return}let f=u-1;for(;f>2&&!c[f];)f--;f<2&&(f=2);let h=c[f];if(!h){i.appendChild(l),c[u]=l;return}let g=h.querySelector("ul");g||(g=document.createElement("ul"),h.appendChild(g)),g.appendChild(l),c[u]=l}catch(u){console.warn("[htmlBuilder] buildTocElement item failed",u,o)}})}catch(c){console.warn("[htmlBuilder] buildTocElement failed",c)}return s.appendChild(i),i.querySelectorAll("li").length<=1?null:s}function Wr(t){t.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=le(n.textContent||""))})}function ka(t,e,n){try{const s=t.querySelectorAll("img");if(s&&s.length){const r=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const c=new URL(r+a,n).toString();i.src=c;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] set image loading attribute failed",o)}}catch(c){console.warn("[htmlBuilder] resolve image src failed",c)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function Zr(t,e,n){try{const s=e&&e.includes("/")?e.substring(0,e.lastIndexOf("/")+1):"";let r=null;try{const a=new URL(n,location.href);r=new URL(s||".",a).toString()}catch{try{r=new URL(s||".",location.href).toString()}catch{r=s||"./"}}const i=t.querySelectorAll("*");for(const a of Array.from(i||[]))try{const c=a.tagName?a.tagName.toLowerCase():"",o=u=>{try{const l=a.getAttribute(u)||"";if(!l||/^(https?:)?\/\//i.test(l)||l.startsWith("/")||l.startsWith("#"))return;try{a.setAttribute(u,new URL(l,r).toString())}catch(d){console.warn("[htmlBuilder] rewrite asset attribute failed",u,l,d)}}catch(l){console.warn("[htmlBuilder] rewriteAttr failed",l)}};if(a.hasAttribute&&a.hasAttribute("src")&&o("src"),a.hasAttribute&&a.hasAttribute("href")&&c!=="a"&&o("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&o("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&o("poster"),a.hasAttribute("srcset")){const d=(a.getAttribute("srcset")||"").split(",").map(p=>p.trim()).filter(Boolean).map(p=>{const[f,h]=p.split(/\s+/,2);if(!f||/^(https?:)?\/\//i.test(f)||f.startsWith("/"))return p;try{const g=new URL(f,r).toString();return h?`${g} ${h}`:g}catch{return p}}).join(", ");a.setAttribute("srcset",d)}}catch(c){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",c)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let Gr="",zn=null,Qr="";async function Xr(t,e,n){try{const s=t.querySelectorAll("a");if(!s||!s.length)return;let r,i;if(e===Gr&&zn)r=zn,i=Qr;else{try{r=new URL(e,location.href),i=wt(r.pathname)}catch{try{r=new URL(e,location.href),i=wt(r.pathname)}catch{r=null,i="/"}}Gr=e,zn=r,Qr=i}const a=new Set,c=[],o=new Set,u=[];for(const l of Array.from(s))try{const d=l.getAttribute("href")||"";if(!d||cr(d))continue;try{if(d.startsWith("?")||d.indexOf("?")!==-1)try{const f=new URL(d,e||location.href),h=f.searchParams.get("page");if(h&&h.indexOf("/")===-1&&n){const g=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(g){const m=we(g+h);l.setAttribute("href","?page="+encodeURIComponent(m)+(f.hash||""));continue}}}catch{}}catch{}if(d.startsWith("/")&&!d.endsWith(".md"))continue;const p=d.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(p){let f=p[1];const h=p[2];!f.startsWith("/")&&n&&(f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+f);try{const g=new URL(f,e).pathname;let m=g.startsWith(i)?g.slice(i.length):g;m=we(m),c.push({node:l,mdPathRaw:f,frag:h,rel:m}),j.has(m)||a.add(m)}catch(g){console.warn("[htmlBuilder] resolve mdPath failed",g)}continue}try{let f=d;!d.startsWith("/")&&n&&(d.startsWith("#")?f=n+d:f=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+d);const g=new URL(f,e).pathname||"";if(g&&g.indexOf(i)!==-1){let m=g.startsWith(i)?g.slice(i.length):g;if(m=we(m),m=mt(m),m||(m="_home"),!m.endsWith(".md")){let b=null;try{if(j&&j.has&&j.has(m))b=j.get(m);else try{const k=String(m||"").replace(/^.*\//,"");k&&j.has&&j.has(k)&&(b=j.get(k))}catch(k){console.warn("[htmlBuilder] mdToSlug baseName check failed",k)}}catch(k){console.warn("[htmlBuilder] mdToSlug access check failed",k)}if(!b)try{const k=String(m||"").replace(/^.*\//,"");for(const[A,C]of ee||[])if(C===m||C===k){b=A;break}}catch{}b?l.setAttribute("href",`?page=${encodeURIComponent(b)}`):(o.add(m),u.push({node:l,rel:m}))}}}catch(f){console.warn("[htmlBuilder] resolving href to URL failed",f)}}catch(d){console.warn("[htmlBuilder] processing anchor failed",d)}a.size&&await Promise.all(Array.from(a).map(async l=>{try{try{const p=String(l).match(/([^\/]+)\.md$/),f=p&&p[1];if(f&&ee.has(f)){try{const h=ee.get(f);if(h)try{j.set(h,f)}catch(g){console.warn("[htmlBuilder] mdToSlug.set failed",g)}}catch(h){console.warn("[htmlBuilder] reading slugToMd failed",h)}return}}catch(p){console.warn("[htmlBuilder] basename slug lookup failed",p)}const d=await ve(l,e);if(d&&d.raw){const p=(d.raw||"").match(/^#\s+(.+)$/m);if(p&&p[1]){const f=le(p[1].trim());if(f)try{ee.set(f,l),j.set(l,f)}catch(h){console.warn("[htmlBuilder] setting slug mapping failed",h)}}}}catch(d){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",d)}})),o.size&&await Promise.all(Array.from(o).map(async l=>{try{const d=await ve(l,e);if(d&&d.raw)try{const f=(Bn||new DOMParser).parseFromString(d.raw,"text/html"),h=f.querySelector("title"),g=f.querySelector("h1"),m=h&&h.textContent&&h.textContent.trim()?h.textContent.trim():g&&g.textContent?g.textContent.trim():null;if(m){const b=le(m);if(b)try{ee.set(b,l),j.set(l,b)}catch(k){console.warn("[htmlBuilder] setting html slug mapping failed",k)}}}catch(p){console.warn("[htmlBuilder] parse fetched HTML failed",p)}}catch(d){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",d)}}));for(const l of c){const{node:d,frag:p,rel:f}=l;let h=null;try{j.has(f)&&(h=j.get(f))}catch(g){console.warn("[htmlBuilder] mdToSlug access failed",g)}h?p?d.setAttribute("href",`?page=${encodeURIComponent(h)}#${encodeURIComponent(p)}`):d.setAttribute("href",`?page=${encodeURIComponent(h)}`):p?d.setAttribute("href",`?page=${encodeURIComponent(f)}#${encodeURIComponent(p)}`):d.setAttribute("href",`?page=${encodeURIComponent(f)}`)}for(const l of u){const{node:d,rel:p}=l;let f=null;try{j.has(p)&&(f=j.get(p))}catch(h){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",h)}if(!f)try{const h=String(p||"").replace(/^.*\//,"");j.has(h)&&(f=j.get(h))}catch(h){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",h)}f?d.setAttribute("href",`?page=${encodeURIComponent(f)}`):d.setAttribute("href",`?page=${encodeURIComponent(p)}`)}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function xa(t,e,n,s){const r=e.querySelector("h1"),i=r?(r.textContent||"").trim():"";let a="";try{let c="";try{t&&t.meta&&t.meta.title&&(c=String(t.meta.title).trim())}catch{}if(!c&&i&&(c=i),!c)try{const o=e.querySelector("h2");o&&o.textContent&&(c=String(o.textContent).trim())}catch{}!c&&n&&(c=String(n)),c&&(a=le(c)),a||(a="_home");try{n&&(ee.set(a,n),j.set(n,a))}catch(o){console.warn("[htmlBuilder] computeSlug set slug mapping failed",o)}try{let o="?page="+encodeURIComponent(a);try{const u=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");u&&(o+="#"+encodeURIComponent(u))}catch(u){console.warn("[htmlBuilder] computeSlug hash decode failed",u)}try{history.replaceState({page:a},"",o)}catch(u){console.warn("[htmlBuilder] computeSlug history replace failed",u)}}catch(o){console.warn("[htmlBuilder] computeSlug inner failed",o)}}catch(c){console.warn("[htmlBuilder] computeSlug failed",c)}return{topH1:r,h1Text:i,slugKey:a}}async function Sa(t,e){if(!t||!t.length)return;const n=new Set;for(const o of Array.from(t||[]))try{const u=o.getAttribute("href")||"";if(!u)continue;let p=we(u).split(/::|#/,2)[0];try{const h=p.indexOf("?");h!==-1&&(p=p.slice(0,h))}catch{}if(!p||(p.includes(".")||(p=p+".html"),!/\.html(?:$|[?#])/.test(p)&&!p.toLowerCase().endsWith(".html")))continue;const f=p;try{if(j&&j.has&&j.has(f))continue}catch(h){console.warn("[htmlBuilder] mdToSlug check failed",h)}try{let h=!1;for(const g of ee.values())if(g===f){h=!0;break}if(h)continue}catch(h){console.warn("[htmlBuilder] slugToMd iteration failed",h)}n.add(f)}catch(u){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",u)}if(!n.size)return;const s=async o=>{try{const u=await ve(o,e);if(u&&u.raw)try{const d=(Bn||new DOMParser).parseFromString(u.raw,"text/html"),p=d.querySelector("title"),f=d.querySelector("h1"),h=p&&p.textContent&&p.textContent.trim()?p.textContent.trim():f&&f.textContent?f.textContent.trim():null;if(h){const g=le(h);if(g)try{ee.set(g,o),j.set(o,g)}catch(m){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",m)}}}catch(l){console.warn("[htmlBuilder] parse HTML title failed",l)}}catch(u){console.warn("[htmlBuilder] fetchAndExtract failed",u)}},r=5,i=Array.from(n);let a=0;const c=[];for(;a<i.length;){const o=i.slice(a,a+r);c.push(Promise.all(o.map(s))),a+=r}await Promise.all(c)}async function va(t,e){if(!t||!t.length)return;const n=[],s=new Set;let r="";try{const i=new URL(e,typeof location<"u"?location.href:"http://localhost/");r=wt(i.pathname)}catch(i){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(t||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const c=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(c){let o=we(c[1]);try{let u;try{u=wa(o,e)}catch(d){u=o,console.warn("[htmlBuilder] resolve mdPath URL failed",d)}const l=u&&r&&u.startsWith(r)?u.slice(r.length):String(u||"").replace(/^\//,"");n.push({rel:l}),j.has(l)||s.add(l)}catch(u){console.warn("[htmlBuilder] rewriteAnchors failed",u)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),c=a&&a[1];if(c&&ee.has(c)){try{const o=ee.get(c);o&&j.set(o,c)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await ve(i,e);if(a&&a.raw){const c=(a.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]){const o=le(c[1].trim());if(o)try{ee.set(o,i),j.set(i,o)}catch(u){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",u)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const Bn=typeof DOMParser<"u"?new DOMParser:null;function Nn(t){try{const n=(Bn||new DOMParser).parseFromString(t||"","text/html");Wr(n);try{n.querySelectorAll("img").forEach(o=>{try{o.getAttribute("loading")||o.setAttribute("data-want-lazy","1")}catch(u){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",u)}})}catch(c){console.warn("[htmlBuilder] parseHtml query images failed",c)}n.querySelectorAll("pre code, code[class]").forEach(c=>{try{const o=c.getAttribute&&c.getAttribute("class")||c.className||"",u=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const l=(u[1]||"").toLowerCase(),d=ne.size&&(ne.get(l)||ne.get(String(l).toLowerCase()))||l;try{(async()=>{try{await at(d)}catch(p){console.warn("[htmlBuilder] registerLanguage failed",p)}})()}catch(p){console.warn("[htmlBuilder] schedule registerLanguage failed",p)}}else try{if(fe&&typeof fe.getLanguage=="function"&&fe.getLanguage("plaintext")){const l=fe.highlight?fe.highlight(c.textContent||"",{language:"plaintext"}):null;l&&l.value&&(c.innerHTML=l.value)}}catch(l){console.warn("[htmlBuilder] plaintext highlight fallback failed",l)}}catch(o){console.warn("[htmlBuilder] code element processing failed",o)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(c=>{r.push({level:Number(c.tagName.substring(1)),text:(c.textContent||"").trim(),id:c.id})});const a={};try{const c=n.querySelector("title");c&&c.textContent&&String(c.textContent).trim()&&(a.title=String(c.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:a,toc:r}}catch(e){return console.warn("[htmlBuilder] parseHtml failed",e),{html:t||"",meta:{},toc:[]}}}async function Aa(t){const e=In?In(t||"",ne):new Set,n=new Set(e),s=[];for(const r of n)try{const i=ne.size&&(ne.get(r)||ne.get(String(r).toLowerCase()))||r;try{s.push(at(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(i))try{s.push(at(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function Ea(t){if(await Aa(t),Jt){const e=await Jt(t||"");return!e||typeof e!="object"?{html:String(t||""),meta:{},toc:[]}:(Array.isArray(e.toc)||(e.toc=[]),e.meta||(e.meta={}),e)}return{html:String(t||""),meta:{},toc:[]}}async function Ra(t,e,n,s,r){let i=null;if(e.isHtml)try{const d=typeof DOMParser<"u"?new DOMParser:null;if(d){const p=d.parseFromString(e.raw||"","text/html");try{Zr(p.body,n,r)}catch(f){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",f)}i=Nn(p.documentElement&&p.documentElement.outerHTML?p.documentElement.outerHTML:e.raw||"")}else i=Nn(e.raw||"")}catch{i=Nn(e.raw||"")}else i=await Ea(e.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{Zr(a,n,r)}catch(d){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",d)}try{Wr(a)}catch(d){console.warn("[htmlBuilder] addHeadingIds failed",d)}try{a.querySelectorAll("pre code, code[class]").forEach(p=>{try{const f=p.getAttribute&&p.getAttribute("class")||p.className||"",h=String(f||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(h)try{p.setAttribute&&p.setAttribute("class",h)}catch(g){p.className=h,console.warn("[htmlBuilder] set element class failed",g)}else try{p.removeAttribute&&p.removeAttribute("class")}catch(g){p.className="",console.warn("[htmlBuilder] remove element class failed",g)}}catch(f){console.warn("[htmlBuilder] code element cleanup failed",f)}})}catch(d){console.warn("[htmlBuilder] processing code elements failed",d)}try{er(a)}catch(d){console.warn("[htmlBuilder] observeCodeBlocks failed",d)}ka(a,n,r);try{(a.querySelectorAll&&a.querySelectorAll("img")||[]).forEach(p=>{try{const f=p.parentElement;if(!f||f.tagName.toLowerCase()!=="p"||f.childNodes.length!==1)return;const h=document.createElement("figure");h.className="image",f.replaceWith(h),h.appendChild(p)}catch{}})}catch(d){console.warn("[htmlBuilder] wrap images in Bulma image helper failed",d)}try{(a.querySelectorAll&&a.querySelectorAll("table")||[]).forEach(p=>{try{if(p.classList)p.classList.contains("table")||p.classList.add("table");else{const f=p.getAttribute&&p.getAttribute("class")?p.getAttribute("class"):"",h=String(f||"").split(/\s+/).filter(Boolean);h.indexOf("table")===-1&&h.push("table");try{p.setAttribute&&p.setAttribute("class",h.join(" "))}catch{p.className=h.join(" ")}}}catch{}})}catch(d){console.warn("[htmlBuilder] add Bulma table class failed",d)}const{topH1:c,h1Text:o,slugKey:u}=xa(i,a,n,s);try{await Ta(a,r,n)}catch(d){console.warn("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",d),await Xr(a,r,n)}const l=ya(t,i.toc,n);return{article:a,parsed:i,toc:l,topH1:c,h1Text:o,slugKey:u}}function La(t){if(!(!t||!t.querySelectorAll))try{const e=Array.from(t.querySelectorAll("script"));for(const n of e)try{const s=document.createElement("script");for(const i of Array.from(n.attributes||[]))try{s.setAttribute(i.name,i.value)}catch{}if(!n.src){try{s.type="module"}catch{}s.textContent=n.textContent||""}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";s.addEventListener("error",i=>{try{console.warn("[htmlBuilder] injected script error",{src:r,ev:i})}catch{}}),s.addEventListener("load",()=>{try{console.info("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}}),(document.head||document.body||document.documentElement).appendChild(s),n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed injected script",r)}catch{}}catch(s){console.warn("[htmlBuilder] execute injected script failed",s)}}catch{}}function Kr(t,e,n){t&&(t.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=e&&e("notFound")||"Page not found";const i=document.createElement("p");i.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",s.appendChild(r),s.appendChild(i),t&&t.appendChild&&t.appendChild(s)}async function Ta(t,e,n){return Xr(t,e,n)}function Ca(t){try{t.addEventListener("click",e=>{const n=e.target&&e.target.closest?e.target.closest("a"):null;if(!n)return;const s=n.getAttribute("href")||"";try{const r=new URL(s,location.href),i=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!i&&!a)return;e.preventDefault();let c=null;try{history&&history.state&&history.state.page&&(c=history.state.page)}catch(o){c=null,console.warn("[htmlBuilder] access history.state failed",o)}try{c||(c=new URL(location.href).searchParams.get("page"))}catch(o){console.warn("[htmlBuilder] parse current location failed",o)}if(!i&&a||i&&c&&String(i)===String(c)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:c||i},"","?page="+encodeURIComponent(c||i)+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}}catch(o){console.warn("[htmlBuilder] update history for anchor failed",o)}try{e.stopImmediatePropagation&&e.stopImmediatePropagation(),e.stopPropagation&&e.stopPropagation()}catch(o){console.warn("[htmlBuilder] stopPropagation failed",o)}try{On(a)}catch(o){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:i},"","?page="+encodeURIComponent(i)+(a?"#"+encodeURIComponent(a):""));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){console.warn("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.warn("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){console.warn("[htmlBuilder] renderByQuery failed",o)}}catch(o){console.warn("[htmlBuilder] SPA navigation invocation failed",o)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(e){console.warn("[htmlBuilder] attachTocClickHandler failed",e)}}function On(t){const e=document.querySelector(".nimbi-cms")||null;if(t){const n=document.getElementById(t);if(n)try{const s=()=>{try{if(e&&e.scrollTo&&e.contains(n)){const r=n.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop;e.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(s,50)}}catch(s){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{e&&e.scrollTo?e.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",n)}}function Ma(t,e,{mountOverlay:n=null,container:s=null,mountEl:r=null,navWrap:i=null,t:a=null}={}){try{const c=a||(g=>typeof g=="string"?g:""),o=s||document.querySelector(".nimbi-cms"),u=r||document.querySelector(".nimbi-mount"),l=n||document.querySelector(".nimbi-overlay"),d=i||document.querySelector(".nimbi-nav-wrap");let f=document.querySelector(".nimbi-scroll-top");if(!f){f=document.createElement("button"),f.className="nimbi-scroll-top button is-primary is-rounded is-small",f.setAttribute("aria-label",c("scrollToTop")),f.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{l&&l.appendChild?l.appendChild(f):o&&o.appendChild?o.appendChild(f):u&&u.appendChild?u.appendChild(f):document.body.appendChild(f)}catch{try{document.body.appendChild(f)}catch(m){console.warn("[htmlBuilder] append scroll top button failed",m)}}try{try{rr(f)}catch{}}catch(g){console.warn("[htmlBuilder] set scroll-top button theme registration failed",g)}f.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback container scrollTop failed",m)}try{r&&(r.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",m)}try{document.documentElement.scrollTop=0}catch(m){console.warn("[htmlBuilder] fallback document scrollTop failed",m)}}})}const h=d&&d.querySelector?d.querySelector(".menu-label"):null;if(e){if(!f._nimbiObserver){const g=new IntersectionObserver(m=>{for(const b of m)b.target instanceof Element&&(b.isIntersecting?(f.classList.remove("show"),h&&h.classList.remove("show")):(f.classList.add("show"),h&&h.classList.add("show")))},{root:s instanceof Element?s:r instanceof Element?r:null,threshold:0});f._nimbiObserver=g}try{f._nimbiObserver.disconnect()}catch(g){console.warn("[htmlBuilder] observer disconnect failed",g)}try{f._nimbiObserver.observe(e)}catch(g){console.warn("[htmlBuilder] observer observe failed",g)}try{const g=()=>{try{const m=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},b=e.getBoundingClientRect();!(b.bottom<m.top||b.top>m.bottom)?(f.classList.remove("show"),h&&h.classList.remove("show")):(f.classList.add("show"),h&&h.classList.add("show"))}catch(m){console.warn("[htmlBuilder] checkIntersect failed",m)}};g(),"IntersectionObserver"in window||setTimeout(g,100)}catch(g){console.warn("[htmlBuilder] checkIntersect outer failed",g)}}else{f.classList.remove("show"),h&&h.classList.remove("show");const g=s instanceof Element?s:r instanceof Element?r:window,m=()=>{try{(g===window?window.scrollY:g.scrollTop||0)>10?(f.classList.add("show"),h&&h.classList.add("show")):(f.classList.remove("show"),h&&h.classList.remove("show"))}catch(b){console.warn("[htmlBuilder] onScroll handler failed",b)}};qt(()=>g.addEventListener("scroll",m)),m()}}catch(c){console.warn("[htmlBuilder] ensureScrollTopButton failed",c)}}function Yr(t,e){try{if(!t)return;try{const n=t[e];if(typeof n<"u")return n}catch{}try{if(t.default)return t.default[e]}catch{}return}catch{return}}async function _a(t,e,n,s,r,i,a,c,o="eager",u=1,l=void 0,d="favicon"){if(!t||!(t instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const p=typeof DOMParser<"u"?new DOMParser:null,f=p?p.parseFromString(n||"","text/html"):null,h=f?f.querySelectorAll("a"):[];await qt(()=>Sa(h,s)),await qt(()=>va(h,s));let g=null,m=null,b=null,k=null,A=null,C=null;function M(){try{const v=document.querySelector(".navbar-burger"),$=v&&v.dataset?v.dataset.target:null,y=$?document.getElementById($):null;v&&v.classList.contains("is-active")&&(v.classList.remove("is-active"),v.setAttribute("aria-expanded","false"),y&&y.classList.remove("is-active"))}catch(v){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",v)}}const z=()=>g||(g=(async()=>{try{const v=await Promise.resolve().then(()=>Zt),$=Yr(v,"buildSearchIndex")||(typeof globalThis<"u"?globalThis.buildSearchIndex:void 0),y=Yr(v,"buildSearchIndexWorker")||(typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0);if(o==="lazy"&&typeof y=="function")try{const R=await y(s,u,l);if(R&&R.length)return R}catch(R){console.warn&&console.warn("[nimbi-cms] worker builder threw",R)}return typeof $=="function"?await $(s,u,l):[]}catch(v){return console.warn("[nimbi-cms] buildSearchIndex failed",v),[]}finally{if(m){try{m.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}}})(),g.then(v=>{try{const $=String(m&&m.value||"").trim().toLowerCase();if(!$||!Array.isArray(v)||!v.length)return;const y=v.filter(I=>I.title&&I.title.toLowerCase().includes($)||I.excerpt&&I.excerpt.toLowerCase().includes($));if(!y||!y.length)return;const R=document.getElementById("nimbi-search-results");if(!R)return;R.innerHTML="",y.slice(0,10).forEach(I=>{const _=document.createElement("div");if(_.className="nimbi-search-result",I.parentTitle){const B=document.createElement("div");B.textContent=I.parentTitle,B.className="nimbi-search-title nimbi-search-parent",_.appendChild(B)}const O=document.createElement("a");O.className="block",O.href="?page="+encodeURIComponent(I.slug),O.textContent=I.title,O.addEventListener("click",()=>{try{R.style.display="none"}catch{}}),_.appendChild(O),R.appendChild(_)});try{R.style.display="block"}catch{}}catch{}}).catch(()=>{}),g),Z=document.createElement("nav");Z.className="navbar",Z.setAttribute("role","navigation"),Z.setAttribute("aria-label","main navigation");const V=document.createElement("div");V.className="navbar-brand";const ie=h[0],J=document.createElement("a");if(J.className="navbar-item",ie){const v=ie.getAttribute("href")||"#";try{const y=new URL(v,location.href).searchParams.get("page");y?J.href="?page="+encodeURIComponent(decodeURIComponent(y)):(J.href="?page="+encodeURIComponent(r),J.textContent=i("home"))}catch{J.href="?page="+encodeURIComponent(r),J.textContent=i("home")}}else J.href="?page="+encodeURIComponent(r),J.textContent=i("home");async function W(v){try{if(!v||v==="none")return null;if(v==="favicon")try{const $=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!$)return null;const y=$.getAttribute("href")||"";return y&&/\.png(?:\?|$)/i.test(y)?new URL(y,location.href).toString():null}catch{return null}if(v==="copy-first"||v==="move-first")try{const $=await ve(r,s);if(!$||!$.raw)return null;const I=new DOMParser().parseFromString($.raw,"text/html").querySelector("img");if(!I)return null;const _=I.getAttribute("src")||"";if(!_)return null;const O=new URL(_,location.href).toString();if(v==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",O)}catch{}return O}catch{return null}try{return new URL(v,location.href).toString()}catch{return null}}catch{return null}}let X=null;try{X=await W(d)}catch{X=null}if(X)try{const v=document.createElement("img");v.className="nimbi-navbar-logo";const $=i&&typeof i=="function"&&(i("home")||i("siteLogo"))||"";v.alt=$,v.title=$,v.src=X;try{J.innerHTML=""}catch{J.textContent=""}J.appendChild(v)}catch{}V.appendChild(J),J.addEventListener("click",function(v){const $=J.getAttribute("href")||"";if($.startsWith("?page=")){v.preventDefault();const y=new URL($,location.href),R=y.searchParams.get("page"),I=y.hash?y.hash.replace(/^#/,""):null;history.pushState({page:R},"","?page="+encodeURIComponent(R)+(I?"#"+encodeURIComponent(I):""));try{a()}catch(_){console.warn("[nimbi-cms] renderByQuery failed",_)}try{M()}catch{}}});const D=document.createElement("a");D.className="navbar-burger",D.setAttribute("role","button"),D.setAttribute("aria-label","menu"),D.setAttribute("aria-expanded","false");const he="nimbi-navbar-menu";D.dataset.target=he,D.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',V.appendChild(D);try{D.addEventListener("click",v=>{try{const $=D.dataset&&D.dataset.target?D.dataset.target:null,y=$?document.getElementById($):null;D.classList.contains("is-active")?(D.classList.remove("is-active"),D.setAttribute("aria-expanded","false"),y&&y.classList.remove("is-active")):(D.classList.add("is-active"),D.setAttribute("aria-expanded","true"),y&&y.classList.add("is-active"))}catch($){console.warn("[nimbi-cms] navbar burger toggle failed",$)}})}catch(v){console.warn("[nimbi-cms] burger event binding failed",v)}const F=document.createElement("div");F.className="navbar-menu",F.id=he;const S=document.createElement("div");S.className="navbar-start";let re=null,Q=null;if(!c)re=null,m=null,k=null,A=null,C=null;else{re=document.createElement("div"),re.className="navbar-end",Q=document.createElement("div"),Q.className="navbar-item",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=i("searchPlaceholder")||"",m.id="nimbi-search",o==="eager"&&(m.disabled=!0),b=document.createElement("div"),b.className="control",o==="eager"&&b.classList.add("is-loading"),b.appendChild(m),Q.appendChild(b),k=document.createElement("div"),k.className="dropdown is-right",k.id="nimbi-search-dropdown";const v=document.createElement("div");v.className="dropdown-trigger",v.appendChild(Q);const $=document.createElement("div");$.className="dropdown-menu",$.setAttribute("role","menu"),A=document.createElement("div"),A.id="nimbi-search-results",A.className="dropdown-content nimbi-search-results",C=A,$.appendChild(A),k.appendChild(v),k.appendChild($),re.appendChild(k);const y=I=>{if(A){if(A.innerHTML="",!I.length){k&&k.classList.remove("is-active");try{A.style.display="none"}catch{}try{A.classList.remove("is-open")}catch{}return}I.forEach(_=>{if(_.parentTitle){const B=document.createElement("p");B.textContent=_.parentTitle,B.className="panel-heading nimbi-search-title nimbi-search-parent",A.appendChild(B)}const O=document.createElement("a");O.className="dropdown-item nimbi-search-result",O.href="?page="+encodeURIComponent(_.slug),O.textContent=_.title,O.addEventListener("click",()=>{k&&k.classList.remove("is-active");try{A.style.display="none"}catch{}try{A.classList.remove("is-open")}catch{}}),A.appendChild(O)}),k&&k.classList.add("is-active");try{A.style.display="block"}catch{}try{A.classList.add("is-open")}catch{}}},R=(I,_)=>{let O=null;return(...B)=>{O&&clearTimeout(O),O=setTimeout(()=>I(...B),_)}};if(m){const I=R(async()=>{const _=document.querySelector("input#nimbi-search"),O=String(_&&_.value||"").trim().toLowerCase();if(!O){y([]);return}try{await z();const ce=(await g).filter(me=>me.title&&me.title.toLowerCase().includes(O)||me.excerpt&&me.excerpt.toLowerCase().includes(O));y(ce.slice(0,10))}catch(B){console.warn("[nimbi-cms] search input handler failed",B),y([])}},50);try{m.addEventListener("input",I)}catch{}try{document.addEventListener("input",_=>{try{_&&_.target&&_.target.id==="nimbi-search"&&I(_)}catch{}},!0)}catch{}}if(o==="eager"){try{g=z()}catch(I){console.warn("[nimbi-cms] eager search index init failed",I),g=Promise.resolve([])}g.finally(()=>{const I=document.querySelector("input#nimbi-search");if(I){try{I.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}})}try{const I=_=>{try{const O=_&&_.target;if(!C||!C.classList.contains("is-open")&&C.style&&C.style.display!=="block"||O&&(C.contains(O)||m&&(O===m||m.contains&&m.contains(O))))return;k&&k.classList.remove("is-active");try{C.style.display="none"}catch{}try{C.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",I,!0),document.addEventListener("touchstart",I,!0)}catch{}}for(let v=0;v<h.length;v++){const $=h[v];if(v===0)continue;const y=$.getAttribute("href")||"#",R=document.createElement("a");R.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(y)||y.endsWith(".md")){const _=we(y).split(/::|#/,2),O=_[0],B=_[1];R.href="?page="+encodeURIComponent(O)+(B?"#"+encodeURIComponent(B):"")}else if(/\.html(?:$|[#?])/.test(y)||y.endsWith(".html")){const _=we(y).split(/::|#/,2);let O=_[0];O&&!O.toLowerCase().endsWith(".html")&&(O=O+".html");const B=_[1];try{const ce=await ve(O,s);if(ce&&ce.raw)try{const We=new DOMParser().parseFromString(ce.raw,"text/html"),Be=We.querySelector("title"),Pt=We.querySelector("h1"),tn=Be&&Be.textContent&&Be.textContent.trim()?Be.textContent.trim():Pt&&Pt.textContent?Pt.textContent.trim():null;if(tn){const dt=le(tn);if(dt){try{ee.set(dt,O),j.set(O,dt)}catch(Un){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Un)}R.href="?page="+encodeURIComponent(dt)+(B?"#"+encodeURIComponent(B):"")}else R.href="?page="+encodeURIComponent(O)+(B?"#"+encodeURIComponent(B):"")}else R.href="?page="+encodeURIComponent(O)+(B?"#"+encodeURIComponent(B):"")}catch{R.href="?page="+encodeURIComponent(O)+(B?"#"+encodeURIComponent(B):"")}else R.href=y}catch{R.href=y}}else R.href=y}catch(I){console.warn("[nimbi-cms] nav item href parse failed",I),R.href=y}try{const I=$.textContent&&String($.textContent).trim()?String($.textContent).trim():null;if(I)try{const _=le(I);if(_){const O=R.getAttribute&&R.getAttribute("href")?R.getAttribute("href"):"";try{const ce=new URL(O,location.href).searchParams.get("page");if(ce){const me=decodeURIComponent(ce);try{ee.set(_,me),j.set(me,_)}catch(We){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",We)}}}catch(B){console.warn("[nimbi-cms] nav slug mapping failed",B)}}}catch(_){console.warn("[nimbi-cms] nav slug mapping failed",_)}}catch(I){console.warn("[nimbi-cms] nav slug mapping failed",I)}R.textContent=$.textContent||y,S.appendChild(R)}F.appendChild(S),re&&F.appendChild(re),Z.appendChild(V),Z.appendChild(F),t.appendChild(Z);try{const v=$=>{try{const y=Z&&Z.querySelector?Z.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!y||!y.classList.contains("is-active"))return;const R=y&&y.closest?y.closest(".navbar"):Z;if(R&&R.contains($.target))return;M()}catch{}};document.addEventListener("click",v,!0),document.addEventListener("touchstart",v,!0)}catch{}try{F.addEventListener("click",v=>{const $=v.target&&v.target.closest?v.target.closest("a"):null;if(!$)return;const y=$.getAttribute("href")||"";try{const R=new URL(y,location.href),I=R.searchParams.get("page"),_=R.hash?R.hash.replace(/^#/,""):null;if(I){v.preventDefault(),history.pushState({page:I},"","?page="+encodeURIComponent(I)+(_?"#"+encodeURIComponent(_):""));try{a()}catch(O){console.warn("[nimbi-cms] renderByQuery failed",O)}}}catch(R){console.warn("[nimbi-cms] navbar click handler failed",R)}try{const R=Z&&Z.querySelector?Z.querySelector(".navbar-burger"):null,I=R&&R.dataset?R.dataset.target:null,_=I?document.getElementById(I):null;R&&R.classList.contains("is-active")&&(R.classList.remove("is-active"),R.setAttribute("aria-expanded","false"),_&&_.classList.remove("is-active"))}catch(R){console.warn("[nimbi-cms] mobile menu close failed",R)}})}catch(v){console.warn("[nimbi-cms] attach content click handler failed",v)}try{e.addEventListener("click",v=>{const $=v.target&&v.target.closest?v.target.closest("a"):null;if(!$)return;const y=$.getAttribute("href")||"";if(y&&!cr(y))try{const R=new URL(y,location.href),I=R.searchParams.get("page"),_=R.hash?R.hash.replace(/^#/,""):null;if(I){v.preventDefault(),history.pushState({page:I},"","?page="+encodeURIComponent(I)+(_?"#"+encodeURIComponent(_):""));try{a()}catch(O){console.warn("[nimbi-cms] renderByQuery failed",O)}}}catch(R){console.warn("[nimbi-cms] container click URL parse failed",R)}})}catch(v){console.warn("[nimbi-cms] build navbar failed",v)}return{navbar:Z,linkEls:h}}try{document.addEventListener("input",t=>{try{if(t&&t.target&&t.target.id==="nimbi-search"){const e=document.getElementById("nimbi-search-results");if(e&&t.target&&t.target.value)try{e.style.display="block"}catch{}}}catch{}},!0)}catch{}var qn,Vr;function $a(){if(Vr)return qn;Vr=1;function t(i,a){return a.some(([c,o])=>c<=i&&i<=o)}function e(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return t(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(i,a={}){let c=0,o=0,u=i.length-1;const l=a.wordsPerMinute||200,d=a.wordBound||n;for(;d(i[o]);)o++;for(;d(i[u]);)u--;const p=`${i}
`;for(let m=o;m<=u;m++)if((e(p[m])||!d(p[m])&&(d(p[m+1])||e(p[m+1])))&&c++,e(p[m]))for(;m<=u&&(s(p[m+1])||d(p[m+1]));)m++;const f=c/l,h=Math.round(f*60*1e3);return{text:Math.ceil(f.toFixed(2))+" min read",minutes:f,time:h,words:c}}return qn=r,qn}var Pa=$a();const Ia=Vn(Pa);function Jr(t,e){let n=document.querySelector(`meta[name="${t}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",t),document.head.appendChild(n)),n.setAttribute("content",e)}function ht(t,e,n){let s=`meta[${t}="${e}"]`,r=document.querySelector(s);r||(r=document.createElement("meta"),r.setAttribute(t,e),document.head.appendChild(r)),r.setAttribute("content",n)}function za(t,e){try{let n=document.querySelector(`link[rel="${t}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",t),document.head.appendChild(n)),n.setAttribute("href",e)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function Ba(t,e,n,s){const r=e&&String(e).trim()?e:t.title||document.title;ht("property","og:title",r);const i=s&&String(s).trim()?s:t.description||"";i&&String(i).trim()&&ht("property","og:description",i),ht("name","twitter:card",t.twitter_card||"summary_large_image");const a=n||t.image;a&&(ht("property","og:image",a),ht("name","twitter:image",a))}function Na(t,e,n,s,r=""){const i=t.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",c=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";c&&String(c).trim()&&Jr("description",c),Jr("robots",i.robots||"index,follow"),Ba(i,e,n,c)}function Oa(){try{const t=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const e of t){const n=document.querySelector(e);if(n){const s=n.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(t){console.warn("[seoManager] getSiteNameFromMeta failed",t)}return""}function qa(t,e,n,s,r,i=""){try{const a=t.meta||{},c=n&&String(n).trim()?n:a.title||i||document.title,o=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=s||a.image||null;let l="";try{if(e){const h=we(e);try{l=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(h)}catch{l=location.href.split("#")[0]}}else l=location.href.split("#")[0]}catch(h){l=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",h)}l&&za("canonical",l);try{ht("property","og:url",l)}catch(h){console.warn("[seoManager] upsertMeta og:url failed",h)}const d={"@context":"https://schema.org","@type":"Article",headline:c||"",description:o||"",url:l||location.href.split("#")[0]};u&&(d.image=String(u)),a.date&&(d.datePublished=a.date),a.dateModified&&(d.dateModified=a.dateModified);const p="nimbi-jsonld";let f=document.getElementById(p);f||(f=document.createElement("script"),f.type="application/ld+json",f.id=p,document.head.appendChild(f)),f.textContent=JSON.stringify(d,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function Da(t,e,n,s,r,i,a,c,o,u,l){try{if(s&&s.querySelector){const d=s.querySelector(".menu-label");d&&(d.textContent=c&&c.textContent||t("onThisPage"))}}catch(d){console.warn("[seoManager] update toc label failed",d)}try{const d=n.meta&&n.meta.title?String(n.meta.title).trim():"",p=r.querySelector("img"),f=p&&(p.getAttribute("src")||p.src)||null;let h="";try{let b="";try{const k=c||(r&&r.querySelector?r.querySelector("h1"):null);if(k){let A=k.nextElementSibling;const C=[];for(;A&&!(A.tagName&&A.tagName.toLowerCase()==="h2");){const M=(A.textContent||"").trim();M&&C.push(M),A=A.nextElementSibling}C.length&&(b=C.join(" ").replace(/\s+/g," ").trim()),!b&&o&&(b=String(o).trim())}}catch(k){console.warn("[seoManager] compute descOverride failed",k)}b&&String(b).length>160&&(b=String(b).slice(0,157).trim()+"..."),h=b}catch(b){console.warn("[seoManager] compute descOverride failed",b)}let g="";try{d&&(g=d)}catch{}if(!g)try{c&&c.textContent&&(g=String(c.textContent).trim())}catch{}if(!g)try{const b=r.querySelector("h2");b&&b.textContent&&(g=String(b.textContent).trim())}catch{}g||(g=i||"");try{Na(n,g||void 0,f,h)}catch(b){console.warn("[seoManager] setMetaTags failed",b)}try{qa(n,u,g||void 0,f,h,e)}catch(b){console.warn("[seoManager] setStructuredData failed",b)}const m=Oa();g?m?document.title=`${m} - ${g}`:document.title=`${e||"Site"} - ${g}`:d?document.title=d:document.title=e||document.title}catch(d){console.warn("[seoManager] applyPageMeta failed",d)}try{const d=r.querySelector(".nimbi-reading-time");if(d&&d.remove(),o){const p=Ia(l.raw||""),f=p&&typeof p.minutes=="number"?Math.ceil(p.minutes):0,h=document.createElement("p");h.className="nimbi-reading-time",h.textContent=f?t("readingTime",{minutes:f}):"";const g=r.querySelector("h1");g&&g.insertAdjacentElement("afterend",h)}}catch(d){console.warn("[seoManager] reading time update failed",d)}}let Re=null,U=null,xe=1,Ye=(t,e)=>e,Ct=0,Mt=0,en=()=>{},_t=.25;function Ha(){if(Re&&document.contains(Re))return Re;Re=null;const t=document.createElement("dialog");t.className="nimbi-image-preview modal",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",Ye("imagePreviewTitle","Image preview")),t.innerHTML=`
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
  `,t.addEventListener("click",S=>{S.target===t&&Dn()}),t.addEventListener("wheel",S=>{if(!J())return;S.preventDefault();const re=S.deltaY<0?_t:-_t;Fe(xe+re),u(),l()},{passive:!1}),t.addEventListener("keydown",S=>{if(S.key==="Escape"){Dn();return}if(xe>1){const re=t.querySelector(".nimbi-image-preview__image-wrapper");if(!re)return;const Q=40;switch(S.key){case"ArrowUp":re.scrollTop-=Q,S.preventDefault();break;case"ArrowDown":re.scrollTop+=Q,S.preventDefault();break;case"ArrowLeft":re.scrollLeft-=Q,S.preventDefault();break;case"ArrowRight":re.scrollLeft+=Q,S.preventDefault();break}}}),document.body.appendChild(t),Re=t,U=t.querySelector("[data-nimbi-preview-image]");const e=t.querySelector("[data-nimbi-preview-fit]"),n=t.querySelector("[data-nimbi-preview-original]"),s=t.querySelector("[data-nimbi-preview-zoom-in]"),r=t.querySelector("[data-nimbi-preview-zoom-out]"),i=t.querySelector("[data-nimbi-preview-reset]"),a=t.querySelector("[data-nimbi-preview-close]"),c=t.querySelector("[data-nimbi-preview-zoom-label]"),o=t.querySelector("[data-nimbi-preview-zoom-hud]");function u(){c&&(c.textContent=`${Math.round(xe*100)}%`)}const l=()=>{o&&(o.textContent=`${Math.round(xe*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};en=u,s.addEventListener("click",()=>{Fe(xe+_t),u(),l()}),r.addEventListener("click",()=>{Fe(xe-_t),u(),l()}),e.addEventListener("click",()=>{$t(),u(),l()}),n.addEventListener("click",()=>{Fe(1),u(),l()}),i.addEventListener("click",()=>{$t(),u(),l()}),a.addEventListener("click",Dn),e.title=Ye("imagePreviewFit","Fit to screen"),n.title=Ye("imagePreviewOriginal","Original size"),r.title=Ye("imagePreviewZoomOut","Zoom out"),s.title=Ye("imagePreviewZoomIn","Zoom in"),a.title=Ye("imagePreviewClose","Close"),a.setAttribute("aria-label",Ye("imagePreviewClose","Close"));let d=!1,p=0,f=0,h=0,g=0;const m=new Map;let b=0,k=1;const A=(S,re)=>{const Q=S.x-re.x,v=S.y-re.y;return Math.hypot(Q,v)},C=()=>{d=!1,m.clear(),b=0,U&&(U.classList.add("is-panning"),U.classList.remove("is-grabbing"))};let M=0,z=0,Z=0;const V=S=>{const re=Date.now(),Q=re-M,v=S.clientX-z,$=S.clientY-Z;M=re,z=S.clientX,Z=S.clientY,Q<300&&Math.hypot(v,$)<30&&(Fe(xe>1?1:2),u(),S.preventDefault())},ie=S=>{Fe(xe>1?1:2),u(),S.preventDefault()},J=()=>Re?typeof Re.open=="boolean"?Re.open:Re.classList.contains("is-active"):!1,W=(S,re,Q=1)=>{if(m.has(Q)&&m.set(Q,{x:S,y:re}),m.size===2){const R=Array.from(m.values()),I=A(R[0],R[1]);if(b>0){const _=I/b;Fe(k*_)}return}if(!d)return;const v=U.closest(".nimbi-image-preview__image-wrapper");if(!v)return;const $=S-p,y=re-f;v.scrollLeft=h-$,v.scrollTop=g-y},X=(S,re,Q=1)=>{if(!J())return;if(m.set(Q,{x:S,y:re}),m.size===2){const y=Array.from(m.values());b=A(y[0],y[1]),k=xe;return}const v=U.closest(".nimbi-image-preview__image-wrapper");!v||!(v.scrollWidth>v.clientWidth||v.scrollHeight>v.clientHeight)||(d=!0,p=S,f=re,h=v.scrollLeft,g=v.scrollTop,U.classList.add("is-panning"),U.classList.remove("is-grabbing"),window.addEventListener("pointermove",D),window.addEventListener("pointerup",he),window.addEventListener("pointercancel",he))},D=S=>{d&&(S.preventDefault(),W(S.clientX,S.clientY,S.pointerId))},he=()=>{C(),window.removeEventListener("pointermove",D),window.removeEventListener("pointerup",he),window.removeEventListener("pointercancel",he)};U.addEventListener("pointerdown",S=>{S.preventDefault(),X(S.clientX,S.clientY,S.pointerId)}),U.addEventListener("pointermove",S=>{(d||m.size===2)&&S.preventDefault(),W(S.clientX,S.clientY,S.pointerId)}),U.addEventListener("pointerup",S=>{S.preventDefault(),S.pointerType==="touch"&&V(S),C()}),U.addEventListener("dblclick",ie),U.addEventListener("pointercancel",C),U.addEventListener("mousedown",S=>{S.preventDefault(),X(S.clientX,S.clientY,1)}),U.addEventListener("mousemove",S=>{d&&S.preventDefault(),W(S.clientX,S.clientY,1)}),U.addEventListener("mouseup",S=>{S.preventDefault(),C()});const F=t.querySelector(".nimbi-image-preview__image-wrapper");return F&&(F.addEventListener("pointerdown",S=>{if(X(S.clientX,S.clientY,S.pointerId),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),F.addEventListener("pointermove",S=>{W(S.clientX,S.clientY,S.pointerId)}),F.addEventListener("pointerup",C),F.addEventListener("pointercancel",C),F.addEventListener("mousedown",S=>{if(X(S.clientX,S.clientY,1),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),F.addEventListener("mousemove",S=>{W(S.clientX,S.clientY,1)}),F.addEventListener("mouseup",C)),t}function Fe(t){if(!U)return;const e=Number(t);xe=Number.isFinite(e)?Math.max(.1,Math.min(4,e)):1;const s=U.getBoundingClientRect(),r=Ct||U.naturalWidth||U.width||s.width||0,i=Mt||U.naturalHeight||U.height||s.height||0;if(r&&i){U.style.setProperty("--nimbi-preview-img-max-width","none"),U.style.setProperty("--nimbi-preview-img-max-height","none"),U.style.setProperty("--nimbi-preview-img-width",`${r*xe}px`),U.style.setProperty("--nimbi-preview-img-height",`${i*xe}px`),U.style.setProperty("--nimbi-preview-img-transform","none");try{U.style.width=`${r*xe}px`,U.style.height=`${i*xe}px`,U.style.transform="none"}catch{}}else{U.style.setProperty("--nimbi-preview-img-max-width",""),U.style.setProperty("--nimbi-preview-img-max-height",""),U.style.setProperty("--nimbi-preview-img-width",""),U.style.setProperty("--nimbi-preview-img-height",""),U.style.setProperty("--nimbi-preview-img-transform",`scale(${xe})`);try{U.style.transform=`scale(${xe})`}catch{}}U&&(U.classList.add("is-panning"),U.classList.remove("is-grabbing"))}function $t(){if(!U)return;const t=U.closest(".nimbi-image-preview__image-wrapper");if(!t)return;const e=t.getBoundingClientRect();if(e.width===0||e.height===0)return;const n=Ct||U.naturalWidth||e.width,s=Mt||U.naturalHeight||e.height;if(!n||!s)return;const r=e.width/n,i=e.height/s,a=Math.min(r,i,1);Fe(Number.isFinite(a)?a:1)}function Ua(t,e="",n=0,s=0){const r=Ha();xe=1,Ct=n||0,Mt=s||0,U.src=t,U.alt=e,U.style.transform="scale(1)";const i=()=>{Ct=U.naturalWidth||U.width||0,Mt=U.naturalHeight||U.height||0};if(i(),$t(),en(),requestAnimationFrame(()=>{$t(),en()}),!Ct||!Mt){const a=()=>{i(),requestAnimationFrame(()=>{$t(),en()}),U.removeEventListener("load",a)};U.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function Dn(){if(Re){typeof Re.close=="function"&&Re.open&&Re.close(),Re.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function ja(t,{t:e,zoomStep:n=.25}={}){if(!t||!t.querySelectorAll)return;Ye=(f,h)=>(typeof e=="function"?e(f):void 0)||h,_t=n,t.addEventListener("click",f=>{const h=f.target;if(!h||h.tagName!=="IMG")return;const g=h;if(g.src){if(f.defaultPrevented!==!0){const m=g.closest("a");m&&m.getAttribute("href")&&f.preventDefault()}Ua(g.src,g.alt||"",g.naturalWidth||0,g.naturalHeight||0)}});let s=!1,r=0,i=0,a=0,c=0;const o=new Map;let u=0,l=1;const d=(f,h)=>{const g=f.x-h.x,m=f.y-h.y;return Math.hypot(g,m)};t.addEventListener("pointerdown",f=>{const h=f.target;if(!h||h.tagName!=="IMG"||!Re||!Re.open)return;if(o.set(f.pointerId,{x:f.clientX,y:f.clientY}),o.size===2){const m=Array.from(o.values());u=d(m[0],m[1]),l=xe;return}const g=h.closest(".nimbi-image-preview__image-wrapper");if(g&&!(xe<=1)){f.preventDefault(),s=!0,r=f.clientX,i=f.clientY,a=g.scrollLeft,c=g.scrollTop,h.setPointerCapture(f.pointerId);try{h.classList.add("is-grabbing")}catch{}}}),t.addEventListener("pointermove",f=>{if(o.has(f.pointerId)&&o.set(f.pointerId,{x:f.clientX,y:f.clientY}),o.size===2){f.preventDefault();const k=Array.from(o.values()),A=d(k[0],k[1]);if(u>0){const C=A/u;Fe(l*C)}return}if(!s)return;f.preventDefault();const g=f.target.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const m=f.clientX-r,b=f.clientY-i;g.scrollLeft=a-m,g.scrollTop=c-b});const p=()=>{s=!1,o.clear(),u=0;try{const f=document.querySelector("[data-nimbi-preview-image]");f&&(f.classList.add("is-panning"),f.classList.remove("is-grabbing"))}catch{}};t.addEventListener("pointerup",p),t.addEventListener("pointercancel",p)}function Fa(t){const{contentWrap:e,navWrap:n,container:s,mountOverlay:r=null,t:i,contentBase:a,homePage:c,initialDocumentTitle:o,runHooks:u}=t||{};if(!e||!(e instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let l=null;const d=ba(i,[{path:c,name:i("home"),isIndex:!0,children:[]}]);async function p(b,k){let A,C,M;try{({data:A,pagePath:C,anchor:M}=await Ss(b,a))}catch(X){console.error("[nimbi-cms] fetchPageData failed",X),Kr(e,i,X);return}!M&&k&&(M=k);try{On(null)}catch(X){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",X)}e.innerHTML="";const{article:z,parsed:Z,toc:V,topH1:ie,h1Text:J,slugKey:W}=await Ra(i,A,C,M,a);Da(i,o,Z,V,z,C,M,ie,J,W,A),n.innerHTML="",V&&(n.appendChild(V),Ca(V));try{await u("transformHtml",{article:z,parsed:Z,toc:V,pagePath:C,anchor:M,topH1:ie,h1Text:J,slugKey:W,data:A})}catch(X){console.warn("[nimbi-cms] transformHtml hooks failed",X)}e.appendChild(z);try{La(z)}catch(X){console.warn("[nimbi-cms] executeEmbeddedScripts failed",X)}try{ja(z,{t:i})}catch(X){console.warn("[nimbi-cms] attachImagePreview failed",X)}try{Ot(s,100,!1),requestAnimationFrame(()=>Ot(s,100,!1)),setTimeout(()=>Ot(s,100,!1),250)}catch(X){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",X)}On(M),Ma(z,ie,{mountOverlay:r,container:s,navWrap:n,t:i});try{await u("onPageLoad",{data:A,pagePath:C,anchor:M,article:z,toc:V,topH1:ie,h1Text:J,slugKey:W,contentWrap:e,navWrap:n})}catch(X){console.warn("[nimbi-cms] onPageLoad hooks failed",X)}l=C}async function f(){let b=new URLSearchParams(location.search).get("page")||c;const k=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await p(b,k)}catch(A){console.warn("[nimbi-cms] renderByQuery failed for",b,A),Kr(e,i,A)}}window.addEventListener("popstate",f);const h=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,g=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const k={top:b.scrollTop||0,left:b.scrollLeft||0};sessionStorage.setItem(h(),JSON.stringify(k))}catch{}},m=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const k=sessionStorage.getItem(h());if(!k)return;const A=JSON.parse(k);A&&typeof A.top=="number"&&b.scrollTo({top:A.top,left:A.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",b=>{if(b.persisted)try{m(),Ot(s,100,!1)}catch(k){console.warn("[nimbi-cms] bfcache restore failed",k)}}),window.addEventListener("pagehide",()=>{try{g()}catch(b){console.warn("[nimbi-cms] save scroll position failed",b)}}),{renderByQuery:f,siteNav:d,getCurrentPagePath:()=>l}}function Wa(t){try{const e=typeof t=="string"?t:typeof window<"u"&&window.location?window.location.search:"";if(!e)return{};const n=new URLSearchParams(e.startsWith("?")?e.slice(1):e),s={},r=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(s.contentPath=n.get("contentPath")),n.has("searchIndex")){const i=r(n.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(n.has("searchIndexMode")){const i=n.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(n.has("defaultStyle")){const i=n.get("defaultStyle");(i==="light"||i==="dark"||i==="system")&&(s.defaultStyle=i)}if(n.has("bulmaCustomize")&&(s.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(s.lang=n.get("lang")),n.has("l10nFile")){const i=n.get("l10nFile");s.l10nFile=i==="null"?null:i}if(n.has("cacheTtlMinutes")){const i=Number(n.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(n.has("cacheMaxEntries")){const i=Number(n.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(n.has("homePage")&&(s.homePage=n.get("homePage")),n.has("notFoundPage")&&(s.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(s.availableLanguages=n.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),n.has("indexDepth")){const i=Number(n.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(c=>c.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function Za(t){return!(typeof t!="string"||!t.trim()||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))}function ei(t){if(typeof t!="string")return!1;const e=t.trim();return!(!e||e.includes("/")||e.includes("\\")||e.includes("..")||!/^[A-Za-z0-9._-]+\.(md|html)$/.test(e))}let Hn="";async function ti(t={}){if(!t||typeof t!="object")throw new TypeError("initCMS(options): options must be an object");const e=Wa();if(e&&(e.contentPath||e.homePage||e.notFoundPage))if(t&&t.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage")}catch(y){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",y)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage")}catch(y){console.warn("[nimbi-cms] logging ignore of URL overrides failed",y)}delete e.contentPath,delete e.homePage,delete e.notFoundPage}const n=Object.assign({},e,t),{el:s,contentPath:r="/content",crawlMaxQueue:i=1e3,searchIndex:a=!0,searchIndexMode:c="eager",indexDepth:o=1,noIndexing:u=void 0,defaultStyle:l="light",bulmaCustomize:d="none",lang:p=void 0,l10nFile:f=null,cacheTtlMinutes:h=5,cacheMaxEntries:g,markdownExtensions:m,availableLanguages:b,homePage:k="_home.md",notFoundPage:A="_404.md"}=n,{navbarLogo:C="favicon"}=n,{skipRootReadme:M=!1}=n;if(n.contentPath!=null&&!Za(n.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(n.homePage!=null&&!ei(n.homePage))throw new TypeError('initCMS(options): "homePage" must be a simple basename ending with .md or .html');if(n.notFoundPage!=null&&!ei(n.notFoundPage))throw new TypeError('initCMS(options): "notFoundPage" must be a simple basename ending with .md or .html');if(!s)throw new Error("el is required");let z=s;if(typeof s=="string"){if(z=document.querySelector(s),!z)throw new Error(`el selector "${s}" did not match any element`)}else if(!(s instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof r!="string"||!r.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof a!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(c!=null&&c!=="eager"&&c!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(o!=null&&o!==1&&o!==2&&o!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(l!=="light"&&l!=="dark"&&l!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(d!=null&&typeof d!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(p!=null&&typeof p!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(f!=null&&typeof f!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(h!=null&&(typeof h!="number"||!Number.isFinite(h)||h<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(g!=null&&(typeof g!="number"||!Number.isInteger(g)||g<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(m!=null&&(!Array.isArray(m)||m.some(y=>!y||typeof y!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(b!=null&&(!Array.isArray(b)||b.some(y=>typeof y!="string"||!y.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(u!=null&&(!Array.isArray(u)||u.some(y=>typeof y!="string"||!y.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(M!=null&&typeof M!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(k!=null&&(typeof k!="string"||!k.trim()||!/\.(md|html)$/.test(k)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(A!=null&&(typeof A!="string"||!A.trim()||!/\.(md|html)$/.test(A)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const Z=!!a;try{Promise.resolve().then(()=>Zt).then(y=>{try{y&&typeof y.setSkipRootReadme=="function"&&y.setSkipRootReadme(!!M)}catch(R){console.warn("[nimbi-cms] setSkipRootReadme failed",R)}}).catch(y=>{})}catch(y){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",y)}try{z.classList.add("nimbi-mount")}catch(y){console.warn("[nimbi-cms] mount element setup failed",y)}const V=document.createElement("section");V.className="section";const ie=document.createElement("div");ie.className="container nimbi-cms";const J=document.createElement("div");J.className="columns";const W=document.createElement("div");W.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",W.setAttribute("role","navigation");try{const y=typeof lt=="function"?lt("navigation"):null;y&&W.setAttribute("aria-label",y)}catch(y){console.warn("[nimbi-cms] set nav aria-label failed",y)}J.appendChild(W);const X=document.createElement("main");X.className="column nimbi-content",X.setAttribute("role","main"),J.appendChild(X),ie.appendChild(J),V.appendChild(ie);const D=W,he=X;z.appendChild(V);let F=null;try{F=z.querySelector(".nimbi-overlay"),F||(F=document.createElement("div"),F.className="nimbi-overlay",z.appendChild(F))}catch(y){F=null,console.warn("[nimbi-cms] mount overlay setup failed",y)}const S=location.pathname||"/",re=S.endsWith("/")?S:S.substring(0,S.lastIndexOf("/")+1);try{Hn=document.title||""}catch(y){Hn="",console.warn("[nimbi-cms] read initial document title failed",y)}let Q=r;(Q==="."||Q==="./")&&(Q=""),Q.startsWith("./")&&(Q=Q.slice(2)),Q.startsWith("/")&&(Q=Q.slice(1)),Q!==""&&!Q.endsWith("/")&&(Q=Q+"/");const v=new URL(re+Q,location.origin).toString();try{Promise.resolve().then(()=>Zt).then(y=>{try{y&&typeof y.setHomePage=="function"&&y.setHomePage(k)}catch(R){console.warn("[nimbi-cms] setHomePage failed",R)}}).catch(y=>{})}catch(y){console.warn("[nimbi-cms] setHomePage dynamic import failed",y)}f&&await pn(f,re),b&&Array.isArray(b)&&ur(b),p&&gn(p);const $=Fa({contentWrap:he,navWrap:D,container:ie,mountOverlay:F,t:lt,contentBase:v,homePage:k,initialDocumentTitle:Hn,runHooks:cn});if(typeof h=="number"&&h>=0&&typeof xr=="function"&&xr(h*60*1e3),typeof g=="number"&&g>=0&&typeof kr=="function"&&kr(g),m&&Array.isArray(m)&&m.length)try{m.forEach(y=>{typeof y=="object"&&ma&&typeof Pn=="function"&&Pn(y)})}catch(y){console.warn("[nimbi-cms] applying markdownExtensions failed",y)}try{typeof i=="number"&&Promise.resolve().then(()=>Zt).then(({setDefaultCrawlMaxQueue:y})=>{try{y(i)}catch(R){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",R)}})}catch(y){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",y)}try{Ut(v)}catch(y){console.warn("[nimbi-cms] setContentBase failed",y)}try{kn(A)}catch(y){console.warn("[nimbi-cms] setNotFoundPage failed",y)}try{Ut(v)}catch(y){console.warn("[nimbi-cms] setContentBase failed",y)}try{kn(A)}catch(y){console.warn("[nimbi-cms] setNotFoundPage failed",y)}try{await ve(k,v)}catch(y){throw k==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${k} not found at ${v}${k}: ${y.message}`)}nr(l),await tr(d,re);try{const y=document.createElement("header");y.className="nimbi-site-navbar",z.insertBefore(y,V);const R=await ve("_navigation.md",v),I=await Jt(R.raw||""),{navbar:_,linkEls:O}=await _a(y,ie,I.html||"",v,k,lt,$.renderByQuery,Z,c,o,u,C);try{await cn("onNavBuild",{navWrap:D,navbar:_,linkEls:O,contentBase:v})}catch(B){console.warn("[nimbi-cms] onNavBuild hooks failed",B)}try{const B=()=>{const ce=y&&y.getBoundingClientRect&&Math.round(y.getBoundingClientRect().height)||y&&y.offsetHeight||0;if(ce>0){try{z.style.setProperty("--nimbi-site-navbar-height",`${ce}px`)}catch(me){console.warn("[nimbi-cms] set CSS var failed",me)}try{ie.style.paddingTop=""}catch(me){console.warn("[nimbi-cms] set container paddingTop failed",me)}try{const me=z&&z.getBoundingClientRect&&Math.round(z.getBoundingClientRect().height)||z&&z.clientHeight||0;if(me>0){const We=Math.max(0,me-ce);try{ie.style.setProperty("--nimbi-cms-height",`${We}px`)}catch(Be){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Be)}}else try{ie.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(We){console.warn("[nimbi-cms] set --nimbi-cms-height failed",We)}}catch(me){console.warn("[nimbi-cms] compute container height failed",me)}try{y.style.setProperty("--nimbi-site-navbar-height",`${ce}px`)}catch(me){console.warn("[nimbi-cms] set navbar CSS var failed",me)}}};B();try{if(typeof ResizeObserver<"u"){const ce=new ResizeObserver(()=>B());try{ce.observe(y)}catch(me){console.warn("[nimbi-cms] ResizeObserver.observe failed",me)}}}catch(ce){console.warn("[nimbi-cms] ResizeObserver setup failed",ce)}}catch(B){console.warn("[nimbi-cms] compute navbar height failed",B)}}catch(y){console.warn("[nimbi-cms] build navigation failed",y)}await $.renderByQuery();try{Promise.resolve().then(()=>Ga).then(({getVersion:y})=>{typeof y=="function"&&y().then(R=>{try{const I=R||"0.0.0";try{const _=O=>{const B=document.createElement("a");B.className="nimbi-version-label tag is-small",B.textContent=`Ninbi CMS v. ${I}`,B.href=O||"#",B.target="_blank",B.rel="noopener noreferrer nofollow",B.setAttribute("aria-label",`Ninbi CMS version ${I}`);try{rr(B)}catch{}try{z.appendChild(B)}catch(ce){console.warn("[nimbi-cms] append version label failed",ce)}};(async()=>{try{const O=await Promise.resolve().then(()=>vi).catch(()=>null),B=O&&(O.default||O);let ce=null;B&&(B.homepage&&typeof B.homepage=="string"?ce=B.homepage:B.repository&&(typeof B.repository=="string"?ce=B.repository:B.repository.url&&typeof B.repository.url=="string"&&(ce=B.repository.url)));try{ce&&new URL(ce)}catch{ce=null}_(ce||"#")}catch{_("#")}})()}catch(_){console.warn("[nimbi-cms] building version label failed",_)}}catch(I){console.warn("[nimbi-cms] building version label failed",I)}}).catch(R=>{console.warn("[nimbi-cms] getVersion() failed",R)})}).catch(y=>{console.warn("[nimbi-cms] import version module failed",y)})}catch(y){console.warn("[nimbi-cms] version label setup failed",y)}}async function ni(){try{let t=null;try{t=await Promise.resolve().then(()=>vi)}catch{try{if(typeof fetch=="function"&&typeof location<"u"){const s=new URL("../package.json",location.href).toString(),r=await fetch(s);r&&r.ok?t={default:await r.json()}:t=null}else t=null}catch{t=null}}const e=t?.default?.version||t?.version;return typeof e=="string"&&e.trim()?e:"0.0.0"}catch{return"0.0.0"}}const Ga=Object.freeze(Object.defineProperty({__proto__:null,getVersion:ni},Symbol.toStringTag,{value:"Module"})),ri="nimbi-cms",ii="0.1.0",si={type:"git",url:"git+https://github.com/AbelVM/nimbiCMS.git"},ai="https://abelvm.github.io/nimbiCMS/",oi="Lightweight CMS client for static sites with Bulma UI and search/indexing features",li=["cms","static","bulma","search","markdown","nimbi"],ci="Abel Vázquez Montoro",ui="MIT",hi={url:"https://github.com/AbelVM/nimbiCMS/issues"},di={node:">=16"},fi="module",pi={dev:"vite","dev:example":'sh -c "npm run build -- --outDir example/dist --config vite.config.js && vite example --port 5173 &"',build:"vite build --config vite.config.js","build:lib":"vite build --config vite.config.js","build:analyze":"ANALYZE=1 vite build --config vite.config.js",preview:"vite preview",test:"npx vitest run","gen-dts":"node scripts/gen-dts.js",prepare:"npm run build:lib && npm run gen-dts","check-dts":"npx tsc --noEmit src/index.d.ts --lib es2015,dom --skipLibCheck","type-test":"npx tsd",docs:"typedoc --options typedoc.json"},gi={bulma:"^1.0.4","highlight.js":"^11.11.1",marked:"^17.0.4"},mi={"@vitest/coverage-v8":"^4.0.18","comment-parser":"^0.7.6",eslint:"^10.0.3","eslint-plugin-unused-imports":"^4.4.1",glob:"^10.4.1",jsdom:"^28.1.0","reading-time":"^1.5.0",terser:"^5.17.0",typedoc:"^0.28.17","typedoc-plugin-markdown":"^4.10.0",typescript:"^5.9.3",tsd:"^0.33.0",vite:"^7.3.1","rollup-plugin-visualizer":"^5.8.0","vite-plugin-restart":"^2.0.0",vitest:"^4.0.18"},wi="dist/nimbi-cms.cjs.js",bi="dist/nimbi-cms.es.js",yi="src/index.d.ts",ki="dist/nimbi-cms.js",xi=["dist","src/index.d.ts"],Si={access:"public"},vi=Object.freeze(Object.defineProperty({__proto__:null,author:ci,bugs:hi,default:{name:ri,version:ii,repository:si,homepage:ai,private:!0,description:oi,keywords:li,author:ci,license:ui,bugs:hi,engines:di,type:fi,scripts:pi,dependencies:gi,devDependencies:mi,main:wi,module:bi,types:yi,unpkg:ki,files:xi,publishConfig:Si},dependencies:gi,description:oi,devDependencies:mi,engines:di,files:xi,homepage:ai,keywords:li,license:ui,main:wi,module:bi,name:ri,publishConfig:Si,repository:si,scripts:pi,type:fi,types:yi,unpkg:ki,version:ii},Symbol.toStringTag,{value:"Module"}));de.BAD_LANGUAGES=hn,de.SUPPORTED_HLJS_MAP=ne,de._clearHooks=ji,de.addHook=zt,de.default=ti,de.ensureBulma=tr,de.getVersion=ni,de.initCMS=ti,de.loadL10nFile=pn,de.loadSupportedLanguages=fn,de.observeCodeBlocks=er,de.onNavBuild=Hi,de.onPageLoad=Di,de.registerLanguage=at,de.runHooks=cn,de.setHighlightTheme=Xi,de.setLang=gn,de.setStyle=nr,de.setThemeVars=Yi,de.t=lt,de.transformHtml=Ui,Object.defineProperties(de,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
