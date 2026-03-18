(function(me,Qe){typeof exports=="object"&&typeof module<"u"?Qe(exports):typeof define=="function"&&define.amd?define(["exports"],Qe):(me=typeof globalThis<"u"?globalThis:me||self,Qe(me.nimbiCMS={}))})(this,(function(me){"use strict";const Qe={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Zt(e,t){if(!Object.prototype.hasOwnProperty.call(Qe,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");Qe[e].push(t)}function Pi(e){Zt("onPageLoad",e)}function zi(e){Zt("onNavBuild",e)}function Ii(e){Zt("transformHtml",e)}async function yn(e,t){const n=Qe[e]||[];for(const s of n)try{await s(t)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function Bi(){Object.keys(Qe).forEach(e=>{Qe[e].length=0})}function sr(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var kn,ar;function Ni(){if(ar)return kn;ar=1;function e(w){return w instanceof Map?w.clear=w.delete=w.set=function(){throw new Error("map is read-only")}:w instanceof Set&&(w.add=w.clear=w.delete=function(){throw new Error("set is read-only")}),Object.freeze(w),Object.getOwnPropertyNames(w).forEach(x=>{const C=w[x],Y=typeof C;(Y==="object"||Y==="function")&&!Object.isFrozen(C)&&e(C)}),w}class t{constructor(x){x.data===void 0&&(x.data={}),this.data=x.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(w){return w.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function s(w,...x){const C=Object.create(null);for(const Y in w)C[Y]=w[Y];return x.forEach(function(Y){for(const Se in Y)C[Se]=Y[Se]}),C}const r="</span>",i=w=>!!w.scope,a=(w,{prefix:x})=>{if(w.startsWith("language:"))return w.replace("language:","language-");if(w.includes(".")){const C=w.split(".");return[`${x}${C.shift()}`,...C.map((Y,Se)=>`${Y}${"_".repeat(Se+1)}`)].join(" ")}return`${x}${w}`};class c{constructor(x,C){this.buffer="",this.classPrefix=C.classPrefix,x.walk(this)}addText(x){this.buffer+=n(x)}openNode(x){if(!i(x))return;const C=a(x.scope,{prefix:this.classPrefix});this.span(C)}closeNode(x){i(x)&&(this.buffer+=r)}value(){return this.buffer}span(x){this.buffer+=`<span class="${x}">`}}const o=(w={})=>{const x={children:[]};return Object.assign(x,w),x};class l{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(x){this.top.children.push(x)}openNode(x){const C=o({scope:x});this.add(C),this.stack.push(C)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(x){return this.constructor._walk(x,this.rootNode)}static _walk(x,C){return typeof C=="string"?x.addText(C):C.children&&(x.openNode(C),C.children.forEach(Y=>this._walk(x,Y)),x.closeNode(C)),x}static _collapse(x){typeof x!="string"&&x.children&&(x.children.every(C=>typeof C=="string")?x.children=[x.children.join("")]:x.children.forEach(C=>{l._collapse(C)}))}}class u extends l{constructor(x){super(),this.options=x}addText(x){x!==""&&this.add(x)}startScope(x){this.openNode(x)}endScope(){this.closeNode()}__addSublanguage(x,C){const Y=x.root;C&&(Y.scope=`language:${C}`),this.add(Y)}toHTML(){return new c(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function f(w){return w?typeof w=="string"?w:w.source:null}function g(w){return p("(?=",w,")")}function d(w){return p("(?:",w,")*")}function h(w){return p("(?:",w,")?")}function p(...w){return w.map(C=>f(C)).join("")}function m(w){const x=w[w.length-1];return typeof x=="object"&&x.constructor===Object?(w.splice(w.length-1,1),x):{}}function b(...w){return"("+(m(w).capture?"":"?:")+w.map(Y=>f(Y)).join("|")+")"}function y(w){return new RegExp(w.toString()+"|").exec("").length-1}function S(w,x){const C=w&&w.exec(x);return C&&C.index===0}const E=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function M(w,{joinWith:x}){let C=0;return w.map(Y=>{C+=1;const Se=C;let ve=f(Y),D="";for(;ve.length>0;){const N=E.exec(ve);if(!N){D+=ve;break}D+=ve.substring(0,N.index),ve=ve.substring(N.index+N[0].length),N[0][0]==="\\"&&N[1]?D+="\\"+String(Number(N[1])+Se):(D+=N[0],N[0]==="("&&C++)}return D}).map(Y=>`(${Y})`).join(x)}const B=/\b\B/,j="[a-zA-Z]\\w*",R="[a-zA-Z_]\\w*",Q="\\b\\d+(\\.\\d+)?",le="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",A="\\b(0b[01]+)",U="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",X=(w={})=>{const x=/^#![ ]*\//;return w.binary&&(w.begin=p(x,/.*\b/,w.binary,/\b.*/)),s({scope:"meta",begin:x,end:/$/,relevance:0,"on:begin":(C,Y)=>{C.index!==0&&Y.ignoreMatch()}},w)},q={begin:"\\\\[\\s\\S]",relevance:0},G={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[q]},v={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[q]},ue={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},ee=function(w,x,C={}){const Y=s({scope:"comment",begin:w,end:x,contains:[]},C);Y.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const Se=b("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return Y.contains.push({begin:p(/[ ]+/,"(",Se,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),Y},ce=ee("//","$"),L=ee("/\\*","\\*/"),T=ee("#","$"),$={scope:"number",begin:Q,relevance:0},I={scope:"number",begin:le,relevance:0},k={scope:"number",begin:A,relevance:0},P={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[q,{begin:/\[/,end:/\]/,relevance:0,contains:[q]}]},O={scope:"title",begin:j,relevance:0},ie={scope:"title",begin:R,relevance:0},de={begin:"\\.\\s*"+R,relevance:0};var xe=Object.freeze({__proto__:null,APOS_STRING_MODE:G,BACKSLASH_ESCAPE:q,BINARY_NUMBER_MODE:k,BINARY_NUMBER_RE:A,COMMENT:ee,C_BLOCK_COMMENT_MODE:L,C_LINE_COMMENT_MODE:ce,C_NUMBER_MODE:I,C_NUMBER_RE:le,END_SAME_AS_BEGIN:function(w){return Object.assign(w,{"on:begin":(x,C)=>{C.data._beginMatch=x[1]},"on:end":(x,C)=>{C.data._beginMatch!==x[1]&&C.ignoreMatch()}})},HASH_COMMENT_MODE:T,IDENT_RE:j,MATCH_NOTHING_RE:B,METHOD_GUARD:de,NUMBER_MODE:$,NUMBER_RE:Q,PHRASAL_WORDS_MODE:ue,QUOTE_STRING_MODE:v,REGEXP_MODE:P,RE_STARTERS_RE:U,SHEBANG:X,TITLE_MODE:O,UNDERSCORE_IDENT_RE:R,UNDERSCORE_TITLE_MODE:ie});function ge(w,x){w.input[w.index-1]==="."&&x.ignoreMatch()}function qe(w,x){w.className!==void 0&&(w.scope=w.className,delete w.className)}function bt(w,x){x&&w.beginKeywords&&(w.begin="\\b("+w.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",w.__beforeBegin=ge,w.keywords=w.keywords||w.beginKeywords,delete w.beginKeywords,w.relevance===void 0&&(w.relevance=0))}function yt(w,x){Array.isArray(w.illegal)&&(w.illegal=b(...w.illegal))}function Xn(w,x){if(w.match){if(w.begin||w.end)throw new Error("begin & end are not supported with match");w.begin=w.match,delete w.match}}function no(w,x){w.relevance===void 0&&(w.relevance=1)}const ro=(w,x)=>{if(!w.beforeMatch)return;if(w.starts)throw new Error("beforeMatch cannot be used with starts");const C=Object.assign({},w);Object.keys(w).forEach(Y=>{delete w[Y]}),w.keywords=C.keywords,w.begin=p(C.beforeMatch,g(C.begin)),w.starts={relevance:0,contains:[Object.assign(C,{endsParent:!0})]},w.relevance=0,delete C.beforeMatch},io=["of","and","for","in","not","or","if","then","parent","list","value"],so="keyword";function wi(w,x,C=so){const Y=Object.create(null);return typeof w=="string"?Se(C,w.split(" ")):Array.isArray(w)?Se(C,w):Object.keys(w).forEach(function(ve){Object.assign(Y,wi(w[ve],x,ve))}),Y;function Se(ve,D){x&&(D=D.map(N=>N.toLowerCase())),D.forEach(function(N){const K=N.split("|");Y[K[0]]=[ve,ao(K[0],K[1])]})}}function ao(w,x){return x?Number(x):oo(w)?0:1}function oo(w){return io.includes(w.toLowerCase())}const bi={},ct=w=>{console.error(w)},yi=(w,...x)=>{console.log(`WARN: ${w}`,...x)},kt=(w,x)=>{bi[`${w}/${x}`]||(console.log(`Deprecated as of ${w}. ${x}`),bi[`${w}/${x}`]=!0)},fn=new Error;function ki(w,x,{key:C}){let Y=0;const Se=w[C],ve={},D={};for(let N=1;N<=x.length;N++)D[N+Y]=Se[N],ve[N+Y]=!0,Y+=y(x[N-1]);w[C]=D,w[C]._emit=ve,w[C]._multi=!0}function lo(w){if(Array.isArray(w.begin)){if(w.skip||w.excludeBegin||w.returnBegin)throw ct("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),fn;if(typeof w.beginScope!="object"||w.beginScope===null)throw ct("beginScope must be object"),fn;ki(w,w.begin,{key:"beginScope"}),w.begin=M(w.begin,{joinWith:""})}}function co(w){if(Array.isArray(w.end)){if(w.skip||w.excludeEnd||w.returnEnd)throw ct("skip, excludeEnd, returnEnd not compatible with endScope: {}"),fn;if(typeof w.endScope!="object"||w.endScope===null)throw ct("endScope must be object"),fn;ki(w,w.end,{key:"endScope"}),w.end=M(w.end,{joinWith:""})}}function uo(w){w.scope&&typeof w.scope=="object"&&w.scope!==null&&(w.beginScope=w.scope,delete w.scope)}function ho(w){uo(w),typeof w.beginScope=="string"&&(w.beginScope={_wrap:w.beginScope}),typeof w.endScope=="string"&&(w.endScope={_wrap:w.endScope}),lo(w),co(w)}function fo(w){function x(D,N){return new RegExp(f(D),"m"+(w.case_insensitive?"i":"")+(w.unicodeRegex?"u":"")+(N?"g":""))}class C{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(N,K){K.position=this.position++,this.matchIndexes[this.matchAt]=K,this.regexes.push([K,N]),this.matchAt+=y(N)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const N=this.regexes.map(K=>K[1]);this.matcherRe=x(M(N,{joinWith:"|"}),!0),this.lastIndex=0}exec(N){this.matcherRe.lastIndex=this.lastIndex;const K=this.matcherRe.exec(N);if(!K)return null;const _e=K.findIndex((Ft,Yn)=>Yn>0&&Ft!==void 0),Ee=this.matchIndexes[_e];return K.splice(0,_e),Object.assign(K,Ee)}}class Y{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(N){if(this.multiRegexes[N])return this.multiRegexes[N];const K=new C;return this.rules.slice(N).forEach(([_e,Ee])=>K.addRule(_e,Ee)),K.compile(),this.multiRegexes[N]=K,K}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(N,K){this.rules.push([N,K]),K.type==="begin"&&this.count++}exec(N){const K=this.getMatcher(this.regexIndex);K.lastIndex=this.lastIndex;let _e=K.exec(N);if(this.resumingScanAtSamePosition()&&!(_e&&_e.index===this.lastIndex)){const Ee=this.getMatcher(0);Ee.lastIndex=this.lastIndex+1,_e=Ee.exec(N)}return _e&&(this.regexIndex+=_e.position+1,this.regexIndex===this.count&&this.considerAll()),_e}}function Se(D){const N=new Y;return D.contains.forEach(K=>N.addRule(K.begin,{rule:K,type:"begin"})),D.terminatorEnd&&N.addRule(D.terminatorEnd,{type:"end"}),D.illegal&&N.addRule(D.illegal,{type:"illegal"}),N}function ve(D,N){const K=D;if(D.isCompiled)return K;[qe,Xn,ho,ro].forEach(Ee=>Ee(D,N)),w.compilerExtensions.forEach(Ee=>Ee(D,N)),D.__beforeBegin=null,[bt,yt,no].forEach(Ee=>Ee(D,N)),D.isCompiled=!0;let _e=null;return typeof D.keywords=="object"&&D.keywords.$pattern&&(D.keywords=Object.assign({},D.keywords),_e=D.keywords.$pattern,delete D.keywords.$pattern),_e=_e||/\w+/,D.keywords&&(D.keywords=wi(D.keywords,w.case_insensitive)),K.keywordPatternRe=x(_e,!0),N&&(D.begin||(D.begin=/\B|\b/),K.beginRe=x(K.begin),!D.end&&!D.endsWithParent&&(D.end=/\B|\b/),D.end&&(K.endRe=x(K.end)),K.terminatorEnd=f(K.end)||"",D.endsWithParent&&N.terminatorEnd&&(K.terminatorEnd+=(D.end?"|":"")+N.terminatorEnd)),D.illegal&&(K.illegalRe=x(D.illegal)),D.contains||(D.contains=[]),D.contains=[].concat(...D.contains.map(function(Ee){return po(Ee==="self"?D:Ee)})),D.contains.forEach(function(Ee){ve(Ee,K)}),D.starts&&ve(D.starts,N),K.matcher=Se(K),K}if(w.compilerExtensions||(w.compilerExtensions=[]),w.contains&&w.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return w.classNameAliases=s(w.classNameAliases||{}),ve(w)}function xi(w){return w?w.endsWithParent||xi(w.starts):!1}function po(w){return w.variants&&!w.cachedVariants&&(w.cachedVariants=w.variants.map(function(x){return s(w,{variants:null},x)})),w.cachedVariants?w.cachedVariants:xi(w)?s(w,{starts:w.starts?s(w.starts):null}):Object.isFrozen(w)?s(w):w}var go="11.11.1";class mo extends Error{constructor(x,C){super(x),this.name="HTMLInjectionError",this.html=C}}const Kn=n,Si=s,vi=Symbol("nomatch"),wo=7,Ei=function(w){const x=Object.create(null),C=Object.create(null),Y=[];let Se=!0;const ve="Could not find the language '{}', did you forget to load/include a language module?",D={disableAutodetect:!0,name:"Plain text",contains:[]};let N={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:u};function K(_){return N.noHighlightRe.test(_)}function _e(_){let W=_.className+" ";W+=_.parentNode?_.parentNode.className:"";const se=N.languageDetectRe.exec(W);if(se){const we=rt(se[1]);return we||(yi(ve.replace("{}",se[1])),yi("Falling back to no-highlight mode for this block.",_)),we?se[1]:"no-highlight"}return W.split(/\s+/).find(we=>K(we)||rt(we))}function Ee(_,W,se){let we="",Le="";typeof W=="object"?(we=_,se=W.ignoreIllegals,Le=W.language):(kt("10.7.0","highlight(lang, code, ...args) has been deprecated."),kt("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),Le=_,we=W),se===void 0&&(se=!0);const je={code:we,language:Le};gn("before:highlight",je);const it=je.result?je.result:Ft(je.language,je.code,se);return it.code=je.code,gn("after:highlight",it),it}function Ft(_,W,se,we){const Le=Object.create(null);function je(z,H){return z.keywords[H]}function it(){if(!V.keywords){Me.addText(be);return}let z=0;V.keywordPatternRe.lastIndex=0;let H=V.keywordPatternRe.exec(be),te="";for(;H;){te+=be.substring(z,H.index);const fe=Ge.case_insensitive?H[0].toLowerCase():H[0],$e=je(V,fe);if($e){const[Ye,zo]=$e;if(Me.addText(te),te="",Le[fe]=(Le[fe]||0)+1,Le[fe]<=wo&&(bn+=zo),Ye.startsWith("_"))te+=H[0];else{const Io=Ge.classNameAliases[Ye]||Ye;Ze(H[0],Io)}}else te+=H[0];z=V.keywordPatternRe.lastIndex,H=V.keywordPatternRe.exec(be)}te+=be.substring(z),Me.addText(te)}function mn(){if(be==="")return;let z=null;if(typeof V.subLanguage=="string"){if(!x[V.subLanguage]){Me.addText(be);return}z=Ft(V.subLanguage,be,!0,$i[V.subLanguage]),$i[V.subLanguage]=z._top}else z=Vn(be,V.subLanguage.length?V.subLanguage:null);V.relevance>0&&(bn+=z.relevance),Me.__addSublanguage(z._emitter,z.language)}function Ne(){V.subLanguage!=null?mn():it(),be=""}function Ze(z,H){z!==""&&(Me.startScope(H),Me.addText(z),Me.endScope())}function _i(z,H){let te=1;const fe=H.length-1;for(;te<=fe;){if(!z._emit[te]){te++;continue}const $e=Ge.classNameAliases[z[te]]||z[te],Ye=H[te];$e?Ze(Ye,$e):(be=Ye,it(),be=""),te++}}function Mi(z,H){return z.scope&&typeof z.scope=="string"&&Me.openNode(Ge.classNameAliases[z.scope]||z.scope),z.beginScope&&(z.beginScope._wrap?(Ze(be,Ge.classNameAliases[z.beginScope._wrap]||z.beginScope._wrap),be=""):z.beginScope._multi&&(_i(z.beginScope,H),be="")),V=Object.create(z,{parent:{value:V}}),V}function Ci(z,H,te){let fe=S(z.endRe,te);if(fe){if(z["on:end"]){const $e=new t(z);z["on:end"](H,$e),$e.isMatchIgnored&&(fe=!1)}if(fe){for(;z.endsParent&&z.parent;)z=z.parent;return z}}if(z.endsWithParent)return Ci(z.parent,H,te)}function Mo(z){return V.matcher.regexIndex===0?(be+=z[0],1):(nr=!0,0)}function Co(z){const H=z[0],te=z.rule,fe=new t(te),$e=[te.__beforeBegin,te["on:begin"]];for(const Ye of $e)if(Ye&&(Ye(z,fe),fe.isMatchIgnored))return Mo(H);return te.skip?be+=H:(te.excludeBegin&&(be+=H),Ne(),!te.returnBegin&&!te.excludeBegin&&(be=H)),Mi(te,z),te.returnBegin?0:H.length}function Ro(z){const H=z[0],te=W.substring(z.index),fe=Ci(V,z,te);if(!fe)return vi;const $e=V;V.endScope&&V.endScope._wrap?(Ne(),Ze(H,V.endScope._wrap)):V.endScope&&V.endScope._multi?(Ne(),_i(V.endScope,z)):$e.skip?be+=H:($e.returnEnd||$e.excludeEnd||(be+=H),Ne(),$e.excludeEnd&&(be=H));do V.scope&&Me.closeNode(),!V.skip&&!V.subLanguage&&(bn+=V.relevance),V=V.parent;while(V!==fe.parent);return fe.starts&&Mi(fe.starts,z),$e.returnEnd?0:H.length}function $o(){const z=[];for(let H=V;H!==Ge;H=H.parent)H.scope&&z.unshift(H.scope);z.forEach(H=>Me.openNode(H))}let wn={};function Ri(z,H){const te=H&&H[0];if(be+=z,te==null)return Ne(),0;if(wn.type==="begin"&&H.type==="end"&&wn.index===H.index&&te===""){if(be+=W.slice(H.index,H.index+1),!Se){const fe=new Error(`0 width match regex (${_})`);throw fe.languageName=_,fe.badRule=wn.rule,fe}return 1}if(wn=H,H.type==="begin")return Co(H);if(H.type==="illegal"&&!se){const fe=new Error('Illegal lexeme "'+te+'" for mode "'+(V.scope||"<unnamed>")+'"');throw fe.mode=V,fe}else if(H.type==="end"){const fe=Ro(H);if(fe!==vi)return fe}if(H.type==="illegal"&&te==="")return be+=`
`,1;if(tr>1e5&&tr>H.index*3)throw new Error("potential infinite loop, way more iterations than matches");return be+=te,te.length}const Ge=rt(_);if(!Ge)throw ct(ve.replace("{}",_)),new Error('Unknown language: "'+_+'"');const Po=fo(Ge);let er="",V=we||Po;const $i={},Me=new N.__emitter(N);$o();let be="",bn=0,ut=0,tr=0,nr=!1;try{if(Ge.__emitTokens)Ge.__emitTokens(W,Me);else{for(V.matcher.considerAll();;){tr++,nr?nr=!1:V.matcher.considerAll(),V.matcher.lastIndex=ut;const z=V.matcher.exec(W);if(!z)break;const H=W.substring(ut,z.index),te=Ri(H,z);ut=z.index+te}Ri(W.substring(ut))}return Me.finalize(),er=Me.toHTML(),{language:_,value:er,relevance:bn,illegal:!1,_emitter:Me,_top:V}}catch(z){if(z.message&&z.message.includes("Illegal"))return{language:_,value:Kn(W),illegal:!0,relevance:0,_illegalBy:{message:z.message,index:ut,context:W.slice(ut-100,ut+100),mode:z.mode,resultSoFar:er},_emitter:Me};if(Se)return{language:_,value:Kn(W),illegal:!1,relevance:0,errorRaised:z,_emitter:Me,_top:V};throw z}}function Yn(_){const W={value:Kn(_),illegal:!1,relevance:0,_top:D,_emitter:new N.__emitter(N)};return W._emitter.addText(_),W}function Vn(_,W){W=W||N.languages||Object.keys(x);const se=Yn(_),we=W.filter(rt).filter(Ti).map(Ne=>Ft(Ne,_,!1));we.unshift(se);const Le=we.sort((Ne,Ze)=>{if(Ne.relevance!==Ze.relevance)return Ze.relevance-Ne.relevance;if(Ne.language&&Ze.language){if(rt(Ne.language).supersetOf===Ze.language)return 1;if(rt(Ze.language).supersetOf===Ne.language)return-1}return 0}),[je,it]=Le,mn=je;return mn.secondBest=it,mn}function bo(_,W,se){const we=W&&C[W]||se;_.classList.add("hljs"),_.classList.add(`language-${we}`)}function Jn(_){let W=null;const se=_e(_);if(K(se))return;if(gn("before:highlightElement",{el:_,language:se}),_.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",_);return}if(_.children.length>0&&(N.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(_)),N.throwUnescapedHTML))throw new mo("One of your code blocks includes unescaped HTML.",_.innerHTML);W=_;const we=W.textContent,Le=se?Ee(we,{language:se,ignoreIllegals:!0}):Vn(we);_.innerHTML=Le.value,_.dataset.highlighted="yes",bo(_,se,Le.language),_.result={language:Le.language,re:Le.relevance,relevance:Le.relevance},Le.secondBest&&(_.secondBest={language:Le.secondBest.language,relevance:Le.secondBest.relevance}),gn("after:highlightElement",{el:_,result:Le,text:we})}function yo(_){N=Si(N,_)}const ko=()=>{pn(),kt("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function xo(){pn(),kt("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Ai=!1;function pn(){function _(){pn()}if(document.readyState==="loading"){Ai||window.addEventListener("DOMContentLoaded",_,!1),Ai=!0;return}document.querySelectorAll(N.cssSelector).forEach(Jn)}function So(_,W){let se=null;try{se=W(w)}catch(we){if(ct("Language definition for '{}' could not be registered.".replace("{}",_)),Se)ct(we);else throw we;se=D}se.name||(se.name=_),x[_]=se,se.rawDefinition=W.bind(null,w),se.aliases&&Li(se.aliases,{languageName:_})}function vo(_){delete x[_];for(const W of Object.keys(C))C[W]===_&&delete C[W]}function Eo(){return Object.keys(x)}function rt(_){return _=(_||"").toLowerCase(),x[_]||x[C[_]]}function Li(_,{languageName:W}){typeof _=="string"&&(_=[_]),_.forEach(se=>{C[se.toLowerCase()]=W})}function Ti(_){const W=rt(_);return W&&!W.disableAutodetect}function Ao(_){_["before:highlightBlock"]&&!_["before:highlightElement"]&&(_["before:highlightElement"]=W=>{_["before:highlightBlock"](Object.assign({block:W.el},W))}),_["after:highlightBlock"]&&!_["after:highlightElement"]&&(_["after:highlightElement"]=W=>{_["after:highlightBlock"](Object.assign({block:W.el},W))})}function Lo(_){Ao(_),Y.push(_)}function To(_){const W=Y.indexOf(_);W!==-1&&Y.splice(W,1)}function gn(_,W){const se=_;Y.forEach(function(we){we[se]&&we[se](W)})}function _o(_){return kt("10.7.0","highlightBlock will be removed entirely in v12.0"),kt("10.7.0","Please use highlightElement now."),Jn(_)}Object.assign(w,{highlight:Ee,highlightAuto:Vn,highlightAll:pn,highlightElement:Jn,highlightBlock:_o,configure:yo,initHighlighting:ko,initHighlightingOnLoad:xo,registerLanguage:So,unregisterLanguage:vo,listLanguages:Eo,getLanguage:rt,registerAliases:Li,autoDetection:Ti,inherit:Si,addPlugin:Lo,removePlugin:To}),w.debugMode=function(){Se=!1},w.safeMode=function(){Se=!0},w.versionString=go,w.regex={concat:p,lookahead:g,either:b,optional:h,anyNumberOfTimes:d};for(const _ in xe)typeof xe[_]=="object"&&e(xe[_]);return Object.assign(w,xe),w},xt=Ei({});return xt.newInstance=()=>Ei({}),kn=xt,xt.HighlightJS=xt,xt.default=xt,kn}var Oi=Ni();const oe=sr(Oi),Di="11.11.1",ne=new Map,Hi="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Ie={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Ie.html="xml",Ie.xhtml="xml",Ie.markup="xml";const xn=new Set(["magic","undefined"]);let Ve=null;const Sn=new Map,qi=300*1e3;async function vn(e=Hi){if(e)return Ve||(Ve=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const s=(await t.text()).split(/\r?\n/);let r=-1;for(let l=0;l<s.length;l++)if(/\|\s*Language\s*\|/i.test(s[l])){r=l;break}if(r===-1)return;const i=s[r].replace(/^\||\|$/g,"").split("|").map(l=>l.trim().toLowerCase());let a=i.findIndex(l=>/alias|aliases|equivalent|alt|alternates?/i.test(l));a===-1&&(a=1);let c=i.findIndex(l=>/file|filename|module|module name|module-name|short|slug/i.test(l));if(c===-1){const l=i.findIndex(u=>/language/i.test(u));c=l!==-1?l:0}let o=[];for(let l=r+1;l<s.length;l++){const u=s[l].trim();if(!u||!u.startsWith("|"))break;const f=u.replace(/^\||\|$/g,"").split("|").map(m=>m.trim());if(f.every(m=>/^-+$/.test(m)))continue;const g=f;if(!g.length)continue;const h=(g[c]||g[0]||"").toString().trim().toLowerCase();if(!h||/^-+$/.test(h))continue;ne.set(h,h);const p=g[a]||"";if(p){const m=String(p).split(",").map(b=>b.replace(/`/g,"").trim()).filter(Boolean);if(m.length){const y=m[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(ne.set(y,y),o.push(y))}}}try{const l=[];for(const u of o){const f=String(u||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");f&&/[a-z0-9]/i.test(f)?l.push(f):ne.delete(u)}o=l}catch(l){console.warn("[codeblocksManager] cleanup aliases failed",l)}try{let l=0;for(const u of Array.from(ne.keys())){if(!u||/^-+$/.test(u)||!/[a-z0-9]/i.test(u)){ne.delete(u),l++;continue}if(/^[:]+/.test(u)){const f=u.replace(/^[:]+/,"");if(f&&/[a-z0-9]/i.test(f)){const g=ne.get(u);ne.delete(u),ne.set(f,g)}else ne.delete(u),l++}}for(const[u,f]of Array.from(ne.entries()))(!f||/^-+$/.test(f)||!/[a-z0-9]/i.test(f))&&(ne.delete(u),l++);try{const u=":---------------------";ne.has(u)&&(ne.delete(u),l++)}catch(u){console.warn("[codeblocksManager] remove sep key failed",u)}try{const u=Array.from(ne.keys()).sort()}catch(u){console.warn("[codeblocksManager] compute supported keys failed",u)}}catch(l){console.warn("[codeblocksManager] ignored error",l)}}catch(t){console.warn("[codeblocksManager] loadSupportedLanguages failed",t)}})(),Ve)}const St=new Set;async function ht(e,t){if(Ve||(async()=>{try{await vn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),Ve)try{await Ve}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(xn.has(n))return!1;if(ne.size&&!ne.has(n)){const r=Ie;if(!r[n]&&!r[e])return!1}if(St.has(e))return!0;const s=Ie;try{const r=(t||e||"").toString().replace(/\.js$/i,"").trim(),i=(s[e]||e||"").toString(),a=(s[r]||r||"").toString();let c=Array.from(new Set([i,a,r,e,s[r],s[e]].filter(Boolean))).map(u=>String(u).toLowerCase()).filter(u=>u&&u!=="undefined");ne.size&&(c=c.filter(u=>{if(ne.has(u))return!0;const f=Ie[u];return!!(f&&ne.has(f))}));let o=null,l=null;for(const u of c)try{const f=Date.now();let g=Sn.get(u);if(g&&g.ok===!1&&f-(g.ts||0)>=qi&&(Sn.delete(u),g=void 0),g){if(g.module)o=g.module;else if(g.promise)try{o=await g.promise}catch{o=null}}else{const d={promise:null,module:null,ok:null,ts:0};Sn.set(u,d),d.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${u}.js`)}catch{return await import(`highlight.js/lib/languages/${u}`)}}catch{try{const p=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${u}.js`;return await new Function("u","return import(u)")(p)}catch{try{const m=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${u}.js`;return await new Function("u","return import(u)")(m)}catch{return null}}}}catch{return null}})();try{o=await d.promise,d.module=o,d.ok=!!o,d.ts=Date.now()}catch{d.module=null,d.ok=!1,d.ts=Date.now(),o=null}}if(o){const d=o.default||o;try{const h=ne.size&&ne.get(e)||u||e;return oe.registerLanguage(h,d),St.add(h),h!==e&&(oe.registerLanguage(e,d),St.add(e)),!0}catch(h){l=h}}else try{if(ne.has(u)||ne.has(e)){const d=()=>({});try{oe.registerLanguage(u,d),St.add(u)}catch{}try{u!==e&&(oe.registerLanguage(e,d),St.add(e))}catch{}return!0}}catch{}}catch(f){l=f}if(l)throw l;return!1}catch{return!1}}let Gt=null;function or(e=document){Ve||(async()=>{try{await vn()}catch(i){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",i)}})();const t=Ie,s=Gt||(typeof IntersectionObserver>"u"?null:(Gt=new IntersectionObserver((i,a)=>{i.forEach(c=>{if(!c.isIntersecting)return;const o=c.target;try{a.unobserve(o)}catch(l){console.warn("[codeblocksManager] observer unobserve failed",l)}(async()=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",u=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const f=(u[1]||"").toLowerCase(),g=t[f]||f,d=ne.size&&(ne.get(g)||ne.get(String(g).toLowerCase()))||g;try{await ht(d)}catch(h){console.warn("[codeblocksManager] registerLanguage failed",h)}try{try{const h=o.textContent||o.innerText||"";h!=null&&(o.textContent=h)}catch{}try{o&&o.dataset&&o.dataset.highlighted&&delete o.dataset.highlighted}catch{}oe.highlightElement(o)}catch(h){console.warn("[codeblocksManager] hljs.highlightElement failed",h)}}else try{const f=o.textContent||"";try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const g=oe.highlight(f,{language:"plaintext"});g&&g.value&&(o.innerHTML=g.value)}}catch{try{oe.highlightElement(o)}catch(d){console.warn("[codeblocksManager] fallback highlightElement failed",d)}}}catch(f){console.warn("[codeblocksManager] auto-detect plaintext failed",f)}}catch(l){console.warn("[codeblocksManager] observer entry processing failed",l)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Gt)),r=e&&e.querySelectorAll?e.querySelectorAll("pre code"):[];if(!s){r.forEach(async i=>{try{const a=i.getAttribute&&i.getAttribute("class")||i.className||"",c=a.match(/language-([a-zA-Z0-9_+-]+)/)||a.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const o=(c[1]||"").toLowerCase(),l=t[o]||o,u=ne.size&&(ne.get(l)||ne.get(String(l).toLowerCase()))||l;try{await ht(u)}catch(f){console.warn("[codeblocksManager] registerLanguage failed (no observer)",f)}}try{try{const o=i.textContent||i.innerText||"";o!=null&&(i.textContent=o)}catch{}try{i&&i.dataset&&i.dataset.highlighted&&delete i.dataset.highlighted}catch{}oe.highlightElement(i)}catch(o){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",o)}}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",a)}});return}r.forEach(i=>{try{s.observe(i)}catch(a){console.warn("[codeblocksManager] observe failed",a)}})}function ji(e,{useCdn:t=!0}={}){const n=document.querySelector("link[data-hl-theme]"),s=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=e==null?"default":String(e),i=r&&String(r).toLowerCase()||"";if(i==="default"||i==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(s&&s.toLowerCase()===i)return;if(!t){console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");return}const a=i,c=`https://cdn.jsdelivr.net/npm/highlight.js@${Di}/styles/${a}.css`,o=document.createElement("link");o.rel="stylesheet",o.href=c,o.setAttribute("data-hl-theme",a),o.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(o)}let st="light";function Ui(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([s,r])=>n.setAttribute(s,r)),document.head.appendChild(n),t["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let s=Number(n.getAttribute("data-bulmaswatch-move-count")||0),r=!1;const i=new MutationObserver(()=>{try{if(r)return;const c=n.parentNode;if(!c||c.lastElementChild===n)return;if(s>=1e3){n.setAttribute("data-bulmaswatch-move-stopped","1");return}r=!0;try{c.appendChild(n)}catch{}s+=1,n.setAttribute("data-bulmaswatch-move-count",String(s)),r=!1}catch{}});try{i.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(s))}catch{}const a=document.head;a&&a.lastElementChild!==n&&a.appendChild(n)}catch{}}function lr(){try{const e=Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));for(const t of e)t&&t.parentNode&&t.parentNode.removeChild(t)}catch{}try{const e=Array.from(document.querySelectorAll("style[data-bulma-override]"));for(const t of e)t&&t.parentNode&&t.parentNode.removeChild(t)}catch{}}async function cr(e="none",t="/"){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.debug("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e)return;if(e==="none"){try{const i=[location&&location.protocol&&location.protocol==="file:"?"https://unpkg.com/bulma/css/bulma.min.css":"//unpkg.com/bulma/css/bulma.min.css","https://unpkg.com/bulma/css/bulma.min.css"];let a=!1;for(const c of i)try{if(document.querySelector(`link[href="${c}"]`)){a=!0;break}}catch{}if(!a){const c=i[0],o=document.createElement("link");o.rel="stylesheet",o.href=c,o.setAttribute("data-bulma-base","1");const l=document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');l&&l.parentNode?l.parentNode.insertBefore(o,l):document.head.appendChild(o)}}catch{}try{const i=Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));for(const a of i)a&&a.parentNode&&a.parentNode.removeChild(a)}catch{}try{const i=Array.from(document.querySelectorAll("style[data-bulma-override]"));for(const a of i)a&&a.parentNode&&a.parentNode.removeChild(a)}catch{}return}const s=[t+"bulma.css","/bulma.css"],r=Array.from(new Set(s));if(e==="local"){if(lr(),document.querySelector("style[data-bulma-override]"))return;for(const i of r)try{const a=await fetch(i,{method:"GET"});if(a.ok){const c=await a.text(),o=document.createElement("style");o.setAttribute("data-bulma-override",i),o.appendChild(document.createTextNode(`
/* bulma override: ${i} */
`+c)),document.head.appendChild(o);return}}catch(a){console.warn("[bulmaManager] fetch local bulma candidate failed",a)}return}try{const i=String(e).trim();if(!i)return;lr();const a=`https://unpkg.com/bulmaswatch/${encodeURIComponent(i)}/bulmaswatch.min.css`;Ui(a,{"data-bulmaswatch-theme":i})}catch(i){console.warn("[bulmaManager] ensureBulma failed",i)}}function ur(e){st=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)st==="dark"?n.setAttribute("data-theme","dark"):st==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;st==="dark"?n.setAttribute("data-theme","dark"):st==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function Wi(e){const t=document.documentElement;for(const[n,s]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,s)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function hr(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest&&e.closest(".nimbi-mount")||null;try{t&&(st==="dark"?t.setAttribute("data-theme","dark"):st==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}const dr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},dt=JSON.parse(JSON.stringify(dr));let Qt="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages&&navigator.languages[0]||"en";Qt=String(e).split("-")[0].toLowerCase()}dr[Qt]||(Qt="en");let Je=Qt;function ft(e,t={}){const n=dt[Je]||dt.en;let s=n&&n[e]?n[e]:dt.en[e]||"";for(const r of Object.keys(t))s=s.replace(new RegExp(`{${r}}`,"g"),String(t[r]));return s}async function En(e,t){if(!e)return;let n=e;try{/^https?:\/\//.test(e)||(n=new URL(e,location.origin+t).toString());const s=await fetch(n);if(!s.ok)return;const r=await s.json();for(const i of Object.keys(r||{}))dt[i]=Object.assign({},dt[i]||{},r[i])}catch{}}function An(e){const t=String(e).split("-")[0].toLowerCase();Je=dt[t]?t:"en"}const Fi=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return Je},loadL10nFile:En,setLang:An,t:ft},Symbol.toStringTag,{value:"Module"})),Zi=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

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

// Exported handler for inline invocation in non-Worker environments (tests).
// Returns an object suitable to post back to the caller: either \`{ id, result }\` or \`{ id, error }\`.
export async function handleSlugWorkerMessage(msg) {
  try {
    if (msg.type === 'buildSearchIndex') {
      const { id, contentBase, indexDepth, noIndexing } = msg
      try {
        const res = await buildSearchIndex(contentBase, indexDepth, noIndexing)
        return { id, result: res }
      } catch (e) { return { id, error: String(e) } }
    }
    if (msg.type === 'crawlForSlug') {
      const { id, slug, base, maxQueue } = msg
      try {
        const res = await crawlForSlug(slug, base, maxQueue)
        return { id, result: res === undefined ? null : res }
      } catch (e) { return { id, error: String(e) } }
    }
    return { id: msg && msg.id, error: 'unsupported message' }
  } catch (e) {
    return { id: msg && msg.id, error: String(e) }
  }
}
`;function Gi(e,t="worker"){let n=null;const s=typeof globalThis<"u"&&typeof globalThis.__nimbiCMSDebug<"u"?!!globalThis.__nimbiCMSDebug:!1;function r(...l){try{s&&console&&typeof console.warn=="function"&&console.warn(...l)}catch{}}function i(){if(!n)try{const l=e();n=l||null,l&&l.addEventListener("error",()=>{try{n===l&&(n=null,l.terminate&&l.terminate())}catch(u){r("["+t+"] worker termination failed",u)}})}catch(l){n=null,r("["+t+"] worker init failed",l)}return n}function a(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(l){r("["+t+"] worker termination failed",l)}}function c(l,u=1e4){return new Promise((f,g)=>{const d=i();if(!d)return g(new Error("worker unavailable"));const h=String(Math.random()),p=Object.assign({},l,{id:h});let m=null;const b=()=>{m&&clearTimeout(m),d.removeEventListener("message",y),d.removeEventListener("error",S)},y=E=>{const M=E.data||{};M.id===h&&(b(),M.error?g(new Error(M.error)):f(M.result))},S=E=>{b(),r("["+t+"] worker error event",E);try{n===d&&(n=null,d.terminate&&d.terminate())}catch(M){r("["+t+"] worker termination failed",M)}g(new Error(E&&E.message||"worker error"))};m=setTimeout(()=>{b(),r("["+t+"] worker timed out");try{n===d&&(n=null,d.terminate&&d.terminate())}catch(E){r("["+t+"] worker termination on timeout failed",E)}g(new Error("worker timeout"))},u),d.addEventListener("message",y),d.addEventListener("error",S);try{d.postMessage(p)}catch(E){b(),g(E)}})}return{get:i,send:c,terminate:a}}function fr(e,t="worker-pool",n=2){const s=new Array(n).fill(null);let r=0;const i=typeof globalThis<"u"&&typeof globalThis.__nimbiCMSDebug<"u"?!!globalThis.__nimbiCMSDebug:!1;function a(...p){try{i&&console&&typeof console.warn=="function"&&console.warn(...p)}catch{}}function c(p){if(!s[p])try{const m=e();s[p]=m||null,m&&m.addEventListener("error",()=>{try{s[p]===m&&(s[p]=null,m.terminate&&m.terminate())}catch(b){a("["+t+"] worker termination failed",b)}})}catch(m){s[p]=null,a("["+t+"] worker init failed",m)}return s[p]}const o=new Array(n).fill(0),l=new Array(n).fill(null),u=30*1e3;function f(p){try{o[p]=Date.now(),l[p]&&(clearTimeout(l[p]),l[p]=null),l[p]=setTimeout(()=>{try{s[p]&&(s[p].terminate&&s[p].terminate(),s[p]=null)}catch(m){a("["+t+"] idle termination failed",m)}l[p]=null},u)}catch{}}function g(){for(let p=0;p<s.length;p++){const m=c(p);if(m)return m}return null}function d(){for(let p=0;p<s.length;p++)try{s[p]&&(s[p].terminate&&s[p].terminate(),s[p]=null)}catch(m){a("["+t+"] worker termination failed",m)}}function h(p,m=1e4){return new Promise((b,y)=>{const S=r++%s.length,E=M=>{const B=(S+M)%s.length,j=c(B);if(!j)return M+1<s.length?E(M+1):y(new Error("worker pool unavailable"));const R=String(Math.random()),Q=Object.assign({},p,{id:R});let le=null;const A=()=>{le&&clearTimeout(le),j.removeEventListener("message",U),j.removeEventListener("error",X)},U=q=>{const G=q.data||{};G.id===R&&(A(),G.error?y(new Error(G.error)):b(G.result))},X=q=>{A(),a("["+t+"] worker error event",q);try{s[B]===j&&(s[B]=null,j.terminate&&j.terminate())}catch(G){a("["+t+"] worker termination failed",G)}y(new Error(q&&q.message||"worker error"))};le=setTimeout(()=>{A(),a("["+t+"] worker timed out");try{s[B]===j&&(s[B]=null,j.terminate&&j.terminate())}catch(q){a("["+t+"] worker termination on timeout failed",q)}y(new Error("worker timeout"))},m),j.addEventListener("message",U),j.addEventListener("error",X);try{f(B),j.postMessage(Q)}catch(q){A(),y(q)}};E(0)})}return{get:g,send:h,terminate:d}}function vt(e){try{if(typeof Blob<"u"&&typeof URL<"u"&&e)try{vt._blobUrlCache||(vt._blobUrlCache=new Map);const t=vt._blobUrlCache;let n=t.get(e);if(!n){const s=new Blob([e],{type:"application/javascript"});n=URL.createObjectURL(s),t.set(e,n)}return new Worker(n,{type:"module"})}catch(t){try{typeof globalThis<"u"&&globalThis.__nimbiCMSDebug&&console&&typeof console.warn=="function"&&console.warn("[worker-manager] createWorkerFromRaw failed",t)}catch{}}}catch(t){try{typeof globalThis<"u"&&globalThis.__nimbiCMSDebug&&console&&typeof console.warn=="function"&&console.warn("[worker-manager] createWorkerFromRaw failed",t)}catch{}}return null}const Ue=new Set;function Ln(e){Qi(),Ue.clear();for(const t of Be)t&&Ue.add(t);pr(J),pr(F),Ln._refreshed=!0}function pr(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&Ue.add(t)}function gr(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,s){return s&&Ue.add(s),t.call(this,n,s)}}let mr=!1;function Qi(){mr||(gr(J),gr(F),mr=!0)}function wr(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}function ke(e){return String(e||"").replace(/^[.\/]+/,"")}function Et(e){return String(e||"").replace(/\/+$/,"")}function At(e){return Et(e)+"/"}function Xi(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=e,document.head.appendChild(n)}catch(t){console.warn("[helpers] preloadImage failed",t)}}function Xt(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const s=Array.from(e.querySelectorAll("img"));if(!s.length)return;const r=e,i=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,a=0,c=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=i?Math.max(a,i.top):a,u=(i?Math.min(c,i.bottom):c)+Number(t||0);let f=0;r&&(f=r.clientHeight||(i?i.height:0)),f||(f=c-a);let g=.6;try{const m=r&&window.getComputedStyle?window.getComputedStyle(r):null,b=m&&m.getPropertyValue("--nimbi-image-max-height-ratio"),y=b?parseFloat(b):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(g=y)}catch(m){console.warn("[helpers] read CSS ratio failed",m)}const d=Math.max(200,Math.floor(f*g));let h=!1,p=null;if(s.forEach(m=>{try{const b=m.getAttribute?m.getAttribute("loading"):void 0;b!=="eager"&&m.setAttribute&&m.setAttribute("loading","lazy");const y=m.getBoundingClientRect?m.getBoundingClientRect():null,S=m.src||m.getAttribute&&m.getAttribute("src"),E=y&&y.height>1?y.height:d,M=y?y.top:0,B=M+E;y&&E>0&&M<=u&&B>=o&&(m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high"),Xi(S),h=!0),!p&&y&&y.top<=u&&(p={img:m,src:S,rect:y,beforeLoading:b})}catch(b){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",b)}}),!h&&p){const{img:m,src:b,rect:y,beforeLoading:S}=p;try{m.setAttribute?(m.setAttribute("loading","eager"),m.setAttribute("fetchpriority","high"),m.setAttribute("data-eager-by-nimbi","1")):(m.loading="eager",m.fetchPriority="high")}catch(E){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",E)}}}catch(s){console.warn("[helpers] setEagerForAboveFoldImages failed",s)}}function ye(e,t=null,n){try{const s=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",r=new URLSearchParams(s.startsWith("?")?s.slice(1):s),i=String(e||"");r.delete("page");const a=new URLSearchParams;a.set("page",i);for(const[l,u]of r.entries())a.append(l,u);const c=a.toString();let o=c?`?${c}`:"";return t&&(o+=`#${encodeURIComponent(t)}`),o||`?page=${encodeURIComponent(i)}`}catch{const r=`?page=${encodeURIComponent(String(e||""))}`;return t?`${r}#${encodeURIComponent(t)}`:r}}function Kt(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):t}catch(t){console.warn("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Kt)}catch(e){console.warn("[helpers] global attach failed",e)}const J=new Map;let Pe=[],Tn=!1;function Ki(e){Tn=!!e}function br(e){Pe=Array.isArray(e)?e.slice():[]}function Yi(){return Pe}const yr=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,kr=fr(()=>vt(Zi),"slugManager",yr);function Vi(){return kr.get()}function xr(e){return kr.send(e,5e3)}async function Ji(e,t=1,n=void 0){const s=await Promise.resolve().then(()=>mt);if(!(s.initSlugWorker&&s.initSlugWorker()))throw new Error("slug worker required but unavailable");return await xr({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n})}async function es(e,t,n){const s=await Promise.resolve().then(()=>mt);if(!(s.initSlugWorker&&s.initSlugWorker()))throw new Error("slug worker required but unavailable");return xr({type:"crawlForSlug",slug:e,base:t,maxQueue:n})}function et(e,t){if(e)if(Pe&&Pe.length){const s=t.split("/")[0],r=Pe.includes(s);let i=J.get(e);(!i||typeof i=="string")&&(i={default:typeof i=="string"?i:void 0,langs:{}}),r?i.langs[s]=t:i.default=t,J.set(e,i)}else J.set(e,t)}const Yt=new Set;function ts(e){typeof e=="function"&&Yt.add(e)}function ns(e){typeof e=="function"&&Yt.delete(e)}const F=new Map;let _n={},Be=[],pt="_404.md",gt="_home.md";function Mn(e){e!=null&&(pt=String(e||""))}function rs(e){e!=null&&(gt=String(e||""))}function is(e){_n=e||{}}const Lt=new Map,Vt=new Set;function ss(){Lt.clear(),Vt.clear()}function as(e){if(!e||e.length===0)return"";let t=e[0];for(let s=1;s<e.length;s++){const r=e[s];let i=0;const a=Math.min(t.length,r.length);for(;i<a&&t[i]===r[i];)i++;t=t.slice(0,i)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}function Jt(e){J.clear(),F.clear(),Be=[],Pe=Pe||[];const t=Object.keys(_n||{});if(!t.length)return;let n="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?n=new URL(String(e)).pathname:n=String(e||"")}catch(s){n=String(e||""),console.warn("[slugManager] parse contentBase failed",s)}n=At(n)}}catch(s){n="",console.warn("[slugManager] setContentBase prefix derivation failed",s)}n||(n=as(t));for(const s of t){let r=s;n&&s.startsWith(n)?r=ke(s.slice(n.length)):r=ke(s),Be.push(r);try{Ln()}catch(a){console.warn("[slugManager] refreshIndexPaths failed",a)}const i=_n[s];if(typeof i=="string"){const a=(i||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const c=he(a[1].trim());if(c)try{let o=c;if((!Pe||!Pe.length)&&(o=Sr(o,new Set(J.keys()))),Pe&&Pe.length){const u=r.split("/")[0],f=Pe.includes(u);let g=J.get(o);(!g||typeof g=="string")&&(g={default:typeof g=="string"?g:void 0,langs:{}}),f?g.langs[u]=r:g.default=r,J.set(o,g)}else J.set(o,r);F.set(r,o)}catch(o){console.warn("[slugManager] set slug mapping failed",o)}}}}}try{Jt()}catch(e){console.warn("[slugManager] initial setContentBase failed",e)}function he(e){let n=String(e||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function Sr(e,t){if(!t.has(e))return e;let n=2,s=`${e}-${n}`;for(;t.has(s);)n+=1,s=`${e}-${n}`;return s}function os(e){return Tt(e,void 0)}function Tt(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),s=new URL(t);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),s=new URL(t);return n.origin!==s.origin?!0:!n.pathname.startsWith(s.pathname)}catch{return!0}return!1}function en(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function _t(e){if(!e||!J.has(e))return null;const t=J.get(e);if(!t)return null;if(typeof t=="string")return t;if(Pe&&Pe.length&&Je&&t.langs&&t.langs[Je])return t.langs[Je];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}const Mt=new Map;function ls(){Mt.clear()}let Te=async function(e,t){if(!e)throw new Error("path required");try{const i=(String(e||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(i&&J.has(i)){const a=_t(i)||J.get(i);a&&a!==e&&(e=a)}}catch(i){console.warn("[slugManager] slug mapping normalization failed",i)}const n=t==null?"":Et(String(t));let s="";try{if(n)if(/^[a-z][a-z0-9+.-]*:/i.test(n))s=n.replace(/\/$/,"")+"/"+e.replace(/^\//,"");else if(n.startsWith("/"))s=n.replace(/\/$/,"")+"/"+e.replace(/^\//,"");else{const i=typeof location<"u"&&location.origin?location.origin:"http://localhost",a=n.startsWith("/")?n:"/"+n;s=i+a.replace(/\/$/,"")+"/"+e.replace(/^\//,"")}else s=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}catch{s="/"+e.replace(/^\//,"")}if(Mt.has(s))return Mt.get(s);const r=(async()=>{const i=await fetch(s);if(!i||typeof i.ok!="boolean"||!i.ok){if(i&&i.status===404)try{const f=`${n}/${pt}`,g=await globalThis.fetch(f);if(g&&typeof g.ok=="boolean"&&g.ok)return{raw:await g.text(),status:404}}catch(f){console.warn("[slugManager] fetching fallback 404 failed",f)}let u="";try{i&&typeof i.clone=="function"?u=await i.clone().text():i&&typeof i.text=="function"?u=await i.text():u=""}catch(f){u="",console.warn("[slugManager] reading error body failed",f)}throw console.error("fetchMarkdown failed:",{url:s,status:i?i.status:void 0,statusText:i?i.statusText:void 0,body:u.slice(0,200)}),new Error("failed to fetch md")}const a=await i.text(),c=a.trim().slice(0,16).toLowerCase(),o=c.startsWith("<!doctype")||c.startsWith("<html"),l=o||String(e||"").toLowerCase().endsWith(".html");if(o&&String(e||"").toLowerCase().endsWith(".md")){try{const u=`${n}/${pt}`,f=await globalThis.fetch(u);if(f.ok)return{raw:await f.text(),status:404}}catch(u){console.warn("[slugManager] fetching fallback 404 failed",u)}throw console.error("fetchMarkdown: server returned HTML for .md request",s),new Error("failed to fetch md")}return l?{raw:a,isHtml:!0}:{raw:a}})();return Mt.set(s,r),r};function cs(e){typeof e=="function"&&(Te=e)}const tn=new Map;function us(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}let Xe=[],Ct=null;async function vr(e,t=1,n=void 0){const s=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>ke(String(r||""))))):[];try{const r=ke(String(pt||""));r&&!s.includes(r)&&s.push(r)}catch{}if(Xe&&Xe.length&&t===1&&!Xe.some(i=>{try{return s.includes(ke(String(i.path||"")))}catch{return!1}}))return Xe;if(Ct)return Ct;Ct=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(l=>ke(String(l||""))))):[];try{const l=ke(String(pt||""));l&&!r.includes(l)&&r.push(l)}catch{}const i=l=>{if(!r||!r.length)return!1;for(const u of r)if(u&&(l===u||l.startsWith(u+"/")))return!0;return!1};let a=[];if(Be&&Be.length&&(a=Array.from(Be)),!a.length)for(const l of J.values())l&&a.push(l);try{const l=await _r(e);l&&l.length&&(a=a.concat(l))}catch(l){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",l)}try{const l=new Set(a),u=[...a],f=Math.max(1,yr),g=async()=>{for(;!(l.size>Rt);){const h=u.shift();if(!h)break;try{const p=await Te(h,e);if(p&&p.raw){if(p.status===404)continue;let m=p.raw;const b=[],y=String(h||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(y)&&Tn&&(!h||!h.includes("/")))continue;const S=us(m),E=/\[[^\]]+\]\(([^)]+)\)/g;let M;for(;M=E.exec(S);)b.push(M[1]);const B=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;M=B.exec(S);)b.push(M[1]);const j=h&&h.includes("/")?h.substring(0,h.lastIndexOf("/")+1):"";for(let R of b)try{if(Tt(R,e)||R.startsWith("..")||R.indexOf("/../")!==-1||(j&&!R.startsWith("./")&&!R.startsWith("/")&&!R.startsWith("../")&&(R=j+R),R=ke(R),!/\.(md|html?)(?:$|[?#])/i.test(R))||(R=R.split(/[?#]/)[0],i(R)))continue;l.has(R)||(l.add(R),u.push(R),a.push(R))}catch(Q){console.warn("[slugManager] href processing failed",R,Q)}}}catch(p){console.warn("[slugManager] discovery fetch failed for",h,p)}}},d=[];for(let h=0;h<f;h++)d.push(g());await Promise.all(d)}catch(l){console.warn("[slugManager] discovery loop failed",l)}const c=new Set;a=a.filter(l=>!l||c.has(l)||i(l)?!1:(c.add(l),!0));const o=[];for(const l of a)if(/\.(?:md|html?)(?:$|[?#])/i.test(l))try{const u=await Te(l,e);if(u&&u.raw){if(u.status===404)continue;let f="",g="";if(u.isHtml)try{const p=new DOMParser().parseFromString(u.raw,"text/html"),m=p.querySelector("title")||p.querySelector("h1");m&&m.textContent&&(f=m.textContent.trim());const b=p.querySelector("p");if(b&&b.textContent&&(g=b.textContent.trim()),t>=2)try{const y=p.querySelector("h1"),S=y&&y.textContent?y.textContent.trim():f||"",E=(()=>{try{if(F.has(l))return F.get(l)}catch{}return he(f||l)})(),M=Array.from(p.querySelectorAll("h2"));for(const B of M)try{const j=(B.textContent||"").trim();if(!j)continue;const R=B.id?B.id:he(j),Q=E?`${E}::${R}`:`${he(l)}::${R}`;let le="",A=B.nextElementSibling;for(;A&&A.tagName&&A.tagName.toLowerCase()==="script";)A=A.nextElementSibling;A&&A.textContent&&(le=String(A.textContent).trim()),o.push({slug:Q,title:j,excerpt:le,path:l,parentTitle:S})}catch(j){console.warn("[slugManager] indexing H2 failed",j)}if(t===3)try{const B=Array.from(p.querySelectorAll("h3"));for(const j of B)try{const R=(j.textContent||"").trim();if(!R)continue;const Q=j.id?j.id:he(R),le=E?`${E}::${Q}`:`${he(l)}::${Q}`;let A="",U=j.nextElementSibling;for(;U&&U.tagName&&U.tagName.toLowerCase()==="script";)U=U.nextElementSibling;U&&U.textContent&&(A=String(U.textContent).trim()),o.push({slug:le,title:R,excerpt:A,path:l,parentTitle:S})}catch(R){console.warn("[slugManager] indexing H3 failed",R)}}catch(B){console.warn("[slugManager] collect H3s failed",B)}}catch(y){console.warn("[slugManager] collect H2s failed",y)}}catch(h){console.warn("[slugManager] parsing HTML for index failed",h)}else{const h=u.raw,p=h.match(/^#\s+(.+)$/m);f=p?p[1].trim():"";try{f=en(f)}catch{}const m=h.split(/\r?\n\s*\r?\n/);if(m.length>1)for(let b=1;b<m.length;b++){const y=m[b].trim();if(y&&!/^#/.test(y)){g=y.replace(/\r?\n/g," ");break}}if(t>=2){let b="",y="";try{const S=(h.match(/^#\s+(.+)$/m)||[])[1];b=S?S.trim():"",y=(function(){try{if(F.has(l))return F.get(l)}catch{}return he(f||l)})();const E=/^##\s+(.+)$/gm;let M;for(;M=E.exec(h);)try{const B=(M[1]||"").trim(),j=en(B);if(!B)continue;const R=he(B),Q=y?`${y}::${R}`:`${he(l)}::${R}`,A=h.slice(E.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),U=A&&A[1]?String(A[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:Q,title:j,excerpt:U,path:l,parentTitle:b})}catch(B){console.warn("[slugManager] indexing markdown H2 failed",B)}}catch(S){console.warn("[slugManager] collect markdown H2s failed",S)}if(t===3)try{const S=/^###\s+(.+)$/gm;let E;for(;E=S.exec(h);)try{const M=(E[1]||"").trim(),B=en(M);if(!M)continue;const j=he(M),R=y?`${y}::${j}`:`${he(l)}::${j}`,le=h.slice(S.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),A=le&&le[1]?String(le[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:R,title:B,excerpt:A,path:l,parentTitle:b})}catch(M){console.warn("[slugManager] indexing markdown H3 failed",M)}}catch(S){console.warn("[slugManager] collect markdown H3s failed",S)}}}let d="";try{F.has(l)&&(d=F.get(l))}catch(h){console.warn("[slugManager] mdToSlug access failed",h)}d||(d=he(f||l)),o.push({slug:d,title:f,excerpt:g,path:l})}}catch(u){console.warn("[slugManager] buildSearchIndex: entry fetch failed",u)}try{Xe=o.filter(u=>{try{return!i(String(u.path||""))}catch{return!0}})}catch(l){console.warn("[slugManager] filtering index by excludes failed",l),Xe=o}return Xe})();try{await Ct}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return Ct=null,Xe}const Er=1e3;let Rt=Er;function hs(e){typeof e=="number"&&e>=0&&(Rt=e)}const Ar=new DOMParser,Lr="a[href]";let Tr=async function(e,t,n=Rt){if(tn.has(e))return tn.get(e);let s=null;const r=new Set,i=[""];for(;i.length&&!s&&!(i.length>n);){const a=i.shift();if(r.has(a))continue;r.add(a);let c=t;c.endsWith("/")||(c+="/"),c+=a;try{let o;try{o=await globalThis.fetch(c)}catch(g){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:c,error:g});continue}if(!o||!o.ok){o&&!o.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:c,status:o.status});continue}const l=await o.text(),f=Ar.parseFromString(l,"text/html").querySelectorAll(Lr);for(const g of f)try{let d=g.getAttribute("href")||"";if(!d||Tt(d,t)||d.startsWith("..")||d.indexOf("/../")!==-1)continue;if(d.endsWith("/")){const h=a+d;r.has(h)||i.push(h);continue}if(d.toLowerCase().endsWith(".md")){const h=ke(a+d);try{if(F.has(h))continue;for(const p of J.values());}catch(p){console.warn("[slugManager] slug map access failed",p)}try{const p=await Te(h,t);if(p&&p.raw){const m=(p.raw||"").match(/^#\s+(.+)$/m);if(m&&m[1]&&he(m[1].trim())===e){s=h;break}}}catch(p){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",p)}}}catch(d){console.warn("[slugManager] crawlForSlug: link iteration failed",d)}}catch(o){console.warn("[slugManager] crawlForSlug: directory fetch failed",o)}}return tn.set(e,s),s};async function _r(e,t=Rt){const n=new Set,s=new Set,r=[""];for(;r.length&&!(r.length>t);){const i=r.shift();if(s.has(i))continue;s.add(i);let a=e;a.endsWith("/")||(a+="/"),a+=i;try{let c;try{c=await globalThis.fetch(a)}catch(f){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:a,error:f});continue}if(!c||!c.ok){c&&!c.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:a,status:c.status});continue}const o=await c.text(),u=Ar.parseFromString(o,"text/html").querySelectorAll(Lr);for(const f of u)try{let g=f.getAttribute("href")||"";if(!g||Tt(g,e)||g.startsWith("..")||g.indexOf("/../")!==-1)continue;if(g.endsWith("/")){const h=i+g;s.has(h)||r.push(h);continue}const d=(i+g).replace(/^\/+/,"");/\.(md|html?)$/i.test(d)&&n.add(d)}catch(g){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",g)}}catch(c){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",c)}}return Array.from(n)}async function Mr(e,t,n){if(e&&typeof e=="string"&&(e=ke(e),e=Et(e)),J.has(e))return _t(e)||J.get(e);for(const r of Yt)try{const i=await r(e,t);if(i)return et(e,i),F.set(i,e),i}catch(i){console.warn("[slugManager] slug resolver failed",i)}if(Be&&Be.length){if(Lt.has(e)){const r=Lt.get(e);return J.set(e,r),F.set(r,e),r}for(const r of Be)if(!Vt.has(r))try{const i=await Te(r,t);if(i&&i.raw){const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a&&a[1]){const c=he(a[1].trim());if(Vt.add(r),c&&Lt.set(c,r),c===e)return et(e,r),F.set(r,e),r}}}catch(i){console.warn("[slugManager] manifest title fetch failed",i)}}try{const r=await vr(t);if(r&&r.length){const i=r.find(a=>a.slug===e);if(i)return et(e,i.path),F.set(i.path,e),i.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await Tr(e,t,n);if(r)return et(e,r),F.set(r,e),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const s=[`${e}.html`,`${e}.md`];for(const r of s)try{const i=await Te(r,t);if(i&&i.raw)return et(e,r),F.set(r,e),r}catch(i){console.warn("[slugManager] candidate fetch failed",i)}if(Be&&Be.length)for(const r of Be)try{const i=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(he(i)===e)return et(e,r),F.set(r,e),r}catch(i){console.warn("[slugManager] build-time filename match failed",i)}try{const r=[];gt&&typeof gt=="string"&&gt.trim()&&r.push(gt),r.includes("_home.md")||r.push("_home.md");for(const i of r)try{const a=await Te(i,t);if(a&&a.raw){const c=(a.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]&&he(c[1].trim())===e)return et(e,i),F.set(i,e),i}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const mt=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:Er,_setAllMd:is,_storeSlugMapping:et,addSlugResolver:ts,get allMarkdownPaths(){return Be},get availableLanguages(){return Pe},buildSearchIndex:vr,buildSearchIndexWorker:Ji,clearFetchCache:ls,clearListCaches:ss,crawlAllMarkdown:_r,crawlCache:tn,crawlForSlug:Tr,crawlForSlugWorker:es,get defaultCrawlMaxQueue(){return Rt},ensureSlug:Mr,fetchCache:Mt,get fetchMarkdown(){return Te},getLanguages:Yi,get homePage(){return gt},initSlugWorker:Vi,isExternalLink:os,isExternalLinkWithBase:Tt,listPathsFetched:Vt,listSlugCache:Lt,mdToSlug:F,get notFoundPage(){return pt},removeSlugResolver:ns,resolveSlugPath:_t,get searchIndex(){return Xe},setContentBase:Jt,setDefaultCrawlMaxQueue:hs,setFetchMarkdown:cs,setHomePage:rs,setLanguages:br,setNotFoundPage:Mn,setSkipRootReadme:Ki,get skipRootReadme(){return Tn},slugResolvers:Yt,slugToMd:J,slugify:he,unescapeMarkdown:en,uniqueSlug:Sr},Symbol.toStringTag,{value:"Module"}));let Cr=100;function Rr(e){Cr=e}let $t=300*1e3;function $r(e){$t=e}const Oe=new Map;function ds(e){if(!Oe.has(e))return;const t=Oe.get(e),n=Date.now();if(t.ts+$t<n){Oe.delete(e);return}return Oe.delete(e),Oe.set(e,t),t.value}function fs(e,t){if(Pr(),Pr(),Oe.delete(e),Oe.set(e,{value:t,ts:Date.now()}),Oe.size>Cr){const n=Oe.keys().next().value;n!==void 0&&Oe.delete(n)}}function Pr(){if(!$t||$t<=0)return;const e=Date.now();for(const[t,n]of Oe.entries())n.ts+$t<e&&Oe.delete(t)}async function ps(e,t){const n=new Set(Ue),s=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(s||[])){const i=r.getAttribute("href")||"";if(i)try{const a=new URL(i,location.href);if(a.origin!==location.origin)continue;const c=(a.hash||a.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(a.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(c){let f=ke(c[1]);f&&n.add(f);continue}const o=(r.textContent||"").trim(),l=(a.pathname||"").replace(/^.*\//,"");if(o&&he(o)===e||l&&he(l.replace(/\.(html?|md)$/i,""))===e)return a.toString();if(/\.(html?)$/i.test(a.pathname)){let f=a.pathname.replace(/^\//,"");n.add(f);continue}const u=a.pathname||"";if(u){const f=new URL(t),g=At(f.pathname);if(u.indexOf(g)!==-1){let d=u.startsWith(g)?u.slice(g.length):u;d=ke(d),d&&n.add(d)}}}catch(a){console.warn("[router] malformed URL while discovering index candidates",a)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const i=await Te(r,t);if(!i||!i.raw)continue;const a=(i.raw||"").match(/^#\s+(.+)$/m);if(a){const c=(a[1]||"").trim();if(c&&he(c)===e)return r}}catch(i){console.warn("[router] fetchMarkdown during index discovery failed",i)}return null}function gs(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e||""));if(J.has(n)){const s=_t(n)||J.get(n);s&&(/\.(md|html?)$/i.test(s)?/index\.html$/i.test(s)||t.push(s):(t.push(s),t.push(s+".html")))}else{if(Ue&&Ue.size)for(const s of Ue){const r=s.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(he(r)===n&&!/index\.html$/i.test(s)){t.push(s);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return t}async function ms(e,t){const n=e||"",s=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=e||"",i=null;if(r&&String(r).includes("::")){const h=String(r).split("::",2);r=h[0],i=h[1]||null}const c=`${e}|||${typeof Fi<"u"&&Je?Je:""}`,o=ds(c);if(o)r=o.resolved,i=o.anchor||i;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let h=decodeURIComponent(String(r||""));if(h&&typeof h=="string"&&(h=ke(h),h=Et(h)),J.has(h))r=_t(h)||J.get(h);else{let p=await ps(h,t);if(p)r=p;else if(Ln._refreshed&&Ue&&Ue.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const m=await Mr(h,t);m&&(r=m)}}}fs(c,{resolved:r,anchor:i})}!i&&s&&(i=s);try{if(r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const h=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const p=await fetch(h);if(p&&p.ok){const m=await p.text(),b=p&&p.headers&&typeof p.headers.get=="function"&&p.headers.get("content-type")||"",y=(m||"").toLowerCase();if(b&&b.indexOf&&b.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1)return{data:{raw:m,isHtml:!0},pagePath:h.replace(/^\//,""),anchor:i}}}catch{}}}catch{}const l=gs(r),u=String(n||"").includes(".md")||String(n||"").includes(".html");if(u&&l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===1&&/index\.html$/i.test(l[0])&&!u&&!J.has(r)&&!J.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let f=null,g=null,d=null;for(const h of l)if(h)try{const p=ke(h);f=await Te(p,t),g=p;break}catch(p){d=p;try{console.warn("[router] candidate fetch failed",{candidate:h,contentBase:t,err:p&&p.message||p})}catch{}}if(!f){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:l,contentBase:t,fetchError:d&&(d.message||String(d))||null})}catch{}try{if(u&&String(n||"").toLowerCase().includes(".html"))try{const h=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",h);const p=await fetch(h);if(p&&p.ok){const m=await p.text(),b=p&&p.headers&&typeof p.headers.get=="function"&&p.headers.get("content-type")||"",y=(m||"").toLowerCase(),S=b&&b.indexOf&&b.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1;if(S||console.warn("[router] absolute fetch returned non-HTML",{abs:h,contentType:b,snippet:y.slice(0,200)}),S)try{const E=h,M=new URL(".",E).toString();try{const j=typeof DOMParser<"u"?new DOMParser:null;if(j){const R=j.parseFromString(m||"","text/html"),Q=(X,q)=>{try{const G=q.getAttribute(X)||"";if(!G||/^(https?:)?\/\//i.test(G)||G.startsWith("/")||G.startsWith("#"))return;try{const v=new URL(G,E).toString();q.setAttribute(X,v)}catch(v){console.warn("[router] rewrite attribute failed",X,v)}}catch(G){console.warn("[router] rewrite helper failed",G)}},le=R.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),A=[];for(const X of Array.from(le||[]))try{const q=X.tagName?X.tagName.toLowerCase():"";if(q==="a")continue;if(X.hasAttribute("src")){const G=X.getAttribute("src");Q("src",X);const v=X.getAttribute("src");G!==v&&A.push({attr:"src",tag:q,before:G,after:v})}if(X.hasAttribute("href")&&q==="link"){const G=X.getAttribute("href");Q("href",X);const v=X.getAttribute("href");G!==v&&A.push({attr:"href",tag:q,before:G,after:v})}if(X.hasAttribute("href")&&q!=="link"){const G=X.getAttribute("href");Q("href",X);const v=X.getAttribute("href");G!==v&&A.push({attr:"href",tag:q,before:G,after:v})}if(X.hasAttribute("xlink:href")){const G=X.getAttribute("xlink:href");Q("xlink:href",X);const v=X.getAttribute("xlink:href");G!==v&&A.push({attr:"xlink:href",tag:q,before:G,after:v})}if(X.hasAttribute("poster")){const G=X.getAttribute("poster");Q("poster",X);const v=X.getAttribute("poster");G!==v&&A.push({attr:"poster",tag:q,before:G,after:v})}if(X.hasAttribute("srcset")){const ue=(X.getAttribute("srcset")||"").split(",").map(ee=>ee.trim()).filter(Boolean).map(ee=>{const[ce,L]=ee.split(/\s+/,2);if(!ce||/^(https?:)?\/\//i.test(ce)||ce.startsWith("/"))return ee;try{const T=new URL(ce,E).toString();return L?`${T} ${L}`:T}catch{return ee}}).join(", ");X.setAttribute("srcset",ue)}}catch{}const U=R.documentElement&&R.documentElement.outerHTML?R.documentElement.outerHTML:m;try{A&&A.length&&console.warn("[router] rewritten asset refs",{abs:h,rewritten:A})}catch{}return{data:{raw:U,isHtml:!0},pagePath:String(n||""),anchor:i}}}catch{}let B=m;return/<base\s+[^>]*>/i.test(m)||(/<head[^>]*>/i.test(m)?B=m.replace(/(<head[^>]*>)/i,`$1<base href="${M}">`):B=`<base href="${M}">`+m),{data:{raw:B,isHtml:!0},pagePath:String(n||""),anchor:i}}catch{return{data:{raw:m,isHtml:!0},pagePath:String(n||""),anchor:i}}}}catch(h){console.warn("[router] absolute HTML fetch fallback failed",h)}}catch{}try{const h=decodeURIComponent(String(r||""));if(h&&!/\.(md|html?)$/i.test(h)){const p=[`/assets/${h}.html`,`/assets/${h}/index.html`];for(const m of p)try{const b=await fetch(m,{method:"GET"});if(b&&b.ok)return{data:{raw:await b.text(),isHtml:!0},pagePath:m.replace(/^\//,""),anchor:i}}catch{}}}catch(h){console.warn("[router] assets fallback failed",h)}throw new Error("no page data")}return{data:f,pagePath:g,anchor:i}}function nn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var tt=nn();function zr(e){tt=e}var at={exec:()=>null};function ae(e,t=""){let n=typeof e=="string"?e:e.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(ze.caret,"$1"),n=n.replace(r,a),s},getRegex:()=>new RegExp(n,t)};return s}var ws=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),ze={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},bs=/^(?:[ \t]*(?:\n|$))+/,ys=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,ks=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Pt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,xs=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Cn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Ir=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Br=ae(Ir).replace(/bull/g,Cn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ss=ae(Ir).replace(/bull/g,Cn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Rn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,vs=/^[^\n]+/,$n=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Es=ae(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",$n).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),As=ae(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Cn).getRegex(),rn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Pn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ls=ae("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Pn).replace("tag",rn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Nr=ae(Rn).replace("hr",Pt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rn).getRegex(),Ts=ae(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Nr).getRegex(),zn={blockquote:Ts,code:ys,def:Es,fences:ks,heading:xs,hr:Pt,html:Ls,lheading:Br,list:As,newline:bs,paragraph:Nr,table:at,text:vs},Or=ae("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Pt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rn).getRegex(),_s={...zn,lheading:Ss,table:Or,paragraph:ae(Rn).replace("hr",Pt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Or).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",rn).getRegex()},Ms={...zn,html:ae(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Pn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:at,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ae(Rn).replace("hr",Pt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",Br).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Cs=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Rs=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Dr=/^( {2,}|\\)\n(?!\s*$)/,$s=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,sn=/[\p{P}\p{S}]/u,In=/[\s\p{P}\p{S}]/u,Hr=/[^\s\p{P}\p{S}]/u,Ps=ae(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,In).getRegex(),qr=/(?!~)[\p{P}\p{S}]/u,zs=/(?!~)[\s\p{P}\p{S}]/u,Is=/(?:[^\s\p{P}\p{S}]|~)/u,jr=/(?![*_])[\p{P}\p{S}]/u,Bs=/(?![*_])[\s\p{P}\p{S}]/u,Ns=/(?:[^\s\p{P}\p{S}]|[*_])/u,Os=ae(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",ws?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Ur=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Ds=ae(Ur,"u").replace(/punct/g,sn).getRegex(),Hs=ae(Ur,"u").replace(/punct/g,qr).getRegex(),Wr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",qs=ae(Wr,"gu").replace(/notPunctSpace/g,Hr).replace(/punctSpace/g,In).replace(/punct/g,sn).getRegex(),js=ae(Wr,"gu").replace(/notPunctSpace/g,Is).replace(/punctSpace/g,zs).replace(/punct/g,qr).getRegex(),Us=ae("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Hr).replace(/punctSpace/g,In).replace(/punct/g,sn).getRegex(),Ws=ae(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,jr).getRegex(),Fs="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Zs=ae(Fs,"gu").replace(/notPunctSpace/g,Ns).replace(/punctSpace/g,Bs).replace(/punct/g,jr).getRegex(),Gs=ae(/\\(punct)/,"gu").replace(/punct/g,sn).getRegex(),Qs=ae(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Xs=ae(Pn).replace("(?:-->|$)","-->").getRegex(),Ks=ae("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Xs).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),an=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Ys=ae(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",an).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Fr=ae(/^!?\[(label)\]\[(ref)\]/).replace("label",an).replace("ref",$n).getRegex(),Zr=ae(/^!?\[(ref)\](?:\[\])?/).replace("ref",$n).getRegex(),Vs=ae("reflink|nolink(?!\\()","g").replace("reflink",Fr).replace("nolink",Zr).getRegex(),Gr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Bn={_backpedal:at,anyPunctuation:Gs,autolink:Qs,blockSkip:Os,br:Dr,code:Rs,del:at,delLDelim:at,delRDelim:at,emStrongLDelim:Ds,emStrongRDelimAst:qs,emStrongRDelimUnd:Us,escape:Cs,link:Ys,nolink:Zr,punctuation:Ps,reflink:Fr,reflinkSearch:Vs,tag:Ks,text:$s,url:at},Js={...Bn,link:ae(/^!?\[(label)\]\((.*?)\)/).replace("label",an).getRegex(),reflink:ae(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",an).getRegex()},Nn={...Bn,emStrongRDelimAst:js,emStrongLDelim:Hs,delLDelim:Ws,delRDelim:Zs,url:ae(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Gr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ae(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Gr).getRegex()},ea={...Nn,br:ae(Dr).replace("{2,}","*").getRegex(),text:ae(Nn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},on={normal:zn,gfm:_s,pedantic:Ms},zt={normal:Bn,gfm:Nn,breaks:ea,pedantic:Js},ta={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Qr=e=>ta[e];function We(e,t){if(t){if(ze.escapeTest.test(e))return e.replace(ze.escapeReplace,Qr)}else if(ze.escapeTestNoEncode.test(e))return e.replace(ze.escapeReplaceNoEncode,Qr);return e}function Xr(e){try{e=encodeURI(e).replace(ze.percentDecode,"%")}catch{return null}return e}function Kr(e,t){let n=e.replace(ze.findPipe,(i,a,c)=>{let o=!1,l=a;for(;--l>=0&&c[l]==="\\";)o=!o;return o?"|":" |"}),s=n.split(ze.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),t)if(s.length>t)s.splice(t);else for(;s.length<t;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(ze.slashPipe,"|");return s}function It(e,t,n){let s=e.length;if(s===0)return"";let r=0;for(;r<s&&e.charAt(s-r-1)===t;)r++;return e.slice(0,s-r)}function na(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let s=0;s<e.length;s++)if(e[s]==="\\")s++;else if(e[s]===t[0])n++;else if(e[s]===t[1]&&(n--,n<0))return s;return n>0?-2:-1}function ra(e,t=0){let n=t,s="";for(let r of e)if(r==="	"){let i=4-n%4;s+=" ".repeat(i),n+=i}else s+=r,n++;return s}function Yr(e,t,n,s,r){let i=t.href,a=t.title||null,c=e[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let o={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:i,title:a,text:c,tokens:s.inlineTokens(c)};return s.state.inLink=!1,o}function ia(e,t,n){let s=e.match(n.other.indentCodeCompensation);if(s===null)return t;let r=s[1];return t.split(`
`).map(i=>{let a=i.match(n.other.beginningSpace);if(a===null)return i;let[c]=a;return c.length>=r.length?i.slice(r.length):i}).join(`
`)}var Bt=class{options;rules;lexer;constructor(e){this.options=e||tt}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:It(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],s=ia(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:s}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let s=It(n,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(n=s.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:It(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=It(t[0],`
`).split(`
`),s="",r="",i=[];for(;n.length>0;){let a=!1,c=[],o;for(o=0;o<n.length;o++)if(this.rules.other.blockquoteStart.test(n[o]))c.push(n[o]),a=!0;else if(!a)c.push(n[o]);else break;n=n.slice(o);let l=c.join(`
`),u=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${l}`:l,r=r?`${r}
${u}`:u;let f=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,i,!0),this.lexer.state.top=f,n.length===0)break;let g=i.at(-1);if(g?.type==="code")break;if(g?.type==="blockquote"){let d=g,h=d.raw+`
`+n.join(`
`),p=this.blockquote(h);i[i.length-1]=p,s=s.substring(0,s.length-d.raw.length)+p.raw,r=r.substring(0,r.length-d.text.length)+p.text;break}else if(g?.type==="list"){let d=g,h=d.raw+`
`+n.join(`
`),p=this.list(h);i[i.length-1]=p,s=s.substring(0,s.length-g.raw.length)+p.raw,r=r.substring(0,r.length-d.raw.length)+p.raw,n=h.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),s=n.length>1,r={type:"list",raw:"",ordered:s,start:s?+n.slice(0,-1):"",loose:!1,items:[]};n=s?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=s?n:"[*+-]");let i=this.rules.other.listItemRegex(n),a=!1;for(;e;){let o=!1,l="",u="";if(!(t=i.exec(e))||this.rules.block.hr.test(e))break;l=t[0],e=e.substring(l.length);let f=ra(t[2].split(`
`,1)[0],t[1].length),g=e.split(`
`,1)[0],d=!f.trim(),h=0;if(this.options.pedantic?(h=2,u=f.trimStart()):d?h=t[1].length+1:(h=f.search(this.rules.other.nonSpaceChar),h=h>4?1:h,u=f.slice(h),h+=t[1].length),d&&this.rules.other.blankLine.test(g)&&(l+=g+`
`,e=e.substring(g.length+1),o=!0),!o){let p=this.rules.other.nextBulletRegex(h),m=this.rules.other.hrRegex(h),b=this.rules.other.fencesBeginRegex(h),y=this.rules.other.headingBeginRegex(h),S=this.rules.other.htmlBeginRegex(h),E=this.rules.other.blockquoteBeginRegex(h);for(;e;){let M=e.split(`
`,1)[0],B;if(g=M,this.options.pedantic?(g=g.replace(this.rules.other.listReplaceNesting,"  "),B=g):B=g.replace(this.rules.other.tabCharGlobal,"    "),b.test(g)||y.test(g)||S.test(g)||E.test(g)||p.test(g)||m.test(g))break;if(B.search(this.rules.other.nonSpaceChar)>=h||!g.trim())u+=`
`+B.slice(h);else{if(d||f.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||b.test(f)||y.test(f)||m.test(f))break;u+=`
`+g}d=!g.trim(),l+=M+`
`,e=e.substring(M.length+1),f=B.slice(h)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(a=!0)),r.items.push({type:"list_item",raw:l,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),r.raw+=l}let c=r.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let o of r.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let l=this.rules.other.listTaskCheckbox.exec(o.raw);if(l){let u={type:"checkbox",raw:l[0]+" ",checked:l[0]!=="[ ]"};o.checked=u.checked,r.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=u.raw+o.tokens[0].raw,o.tokens[0].text=u.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(u)):o.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):o.tokens.unshift(u)}}if(!r.loose){let l=o.tokens.filter(f=>f.type==="space"),u=l.length>0&&l.some(f=>this.rules.other.anyLine.test(f.raw));r.loose=u}}if(r.loose)for(let o of r.items){o.loose=!0;for(let l of o.tokens)l.type==="text"&&(l.type="paragraph")}return r}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:s,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Kr(t[1]),s=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<n.length;a++)i.header.push({text:n[a],tokens:this.lexer.inline(n[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(Kr(a,i.header.length).map((c,o)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:i.align[o]})));return i}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let i=It(n.slice(0,-1),"\\");if((n.length-i.length)%2===0)return}else{let i=na(t[2],"()");if(i===-2)return;if(i>-1){let a=(t[0].indexOf("!")===0?5:4)+t[1].length+i;t[2]=t[2].substring(0,i),t[0]=t[0].substring(0,a).trim(),t[3]=""}}let s=t[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s=s.slice(1):s=s.slice(1,-1)),Yr(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let s=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[s.toLowerCase()];if(!r){let i=n[0].charAt(0);return{type:"text",raw:i,text:i}}return Yr(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let s=this.rules.inline.emStrongLDelim.exec(e);if(!(!s||s[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,c=r,o=0,l=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+r);(s=l.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){c+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){o+=a;continue}if(c-=a,c>0)continue;a=Math.min(a,a+c+o);let u=[...s[0]][0].length,f=e.slice(0,r+s.index+u+a);if(Math.min(r,a)%2){let d=f.slice(1,-1);return{type:"em",raw:f,text:d,tokens:this.lexer.inlineTokens(d)}}let g=f.slice(2,-2);return{type:"strong",raw:f,text:g,tokens:this.lexer.inlineTokens(g)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return s&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let s=this.rules.inline.delLDelim.exec(e);if(s&&(!s[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...s[0]].length-1,i,a,c=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,t=t.slice(-1*e.length+r);(s=o.exec(t))!=null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){c+=a;continue}if(c-=a,c>0)continue;a=Math.min(a,a+c);let l=[...s[0]][0].length,u=e.slice(0,r+s.index+l+a),f=u.slice(r,-r);return{type:"del",raw:u,text:f,tokens:this.lexer.inlineTokens(f)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,s;return t[2]==="@"?(n=t[1],s="mailto:"+n):(n=t[1],s=n),{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,s;if(t[2]==="@")n=t[0],s="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:n,href:s,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},De=class rr{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||tt,this.options.tokenizer=this.options.tokenizer||new Bt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:ze,block:on.normal,inline:zt.normal};this.options.pedantic?(n.block=on.pedantic,n.inline=zt.pedantic):this.options.gfm&&(n.block=on.gfm,this.options.breaks?n.inline=zt.breaks:n.inline=zt.gfm),this.tokenizer.rules=n}static get rules(){return{block:on,inline:zt}}static lex(t,n){return new rr(n).lex(t)}static lexInline(t,n){return new rr(n).inlineTokens(t)}lex(t){t=t.replace(ze.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let s=this.inlineQueue[n];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],s=!1){for(this.options.pedantic&&(t=t.replace(ze.tabCharGlobal,"    ").replace(ze.spaceLine,""));t;){let r;if(this.options.extensions?.block?.some(a=>(r=a.call({lexer:this},t,n))?(t=t.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(t)){t=t.substring(r.raw.length);let a=n.at(-1);r.raw.length===1&&a!==void 0?a.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(t)){t=t.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(r=this.tokenizer.fences(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(t)){t=t.substring(r.raw.length);let a=n.at(-1);a?.type==="paragraph"||a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(t)){t=t.substring(r.raw.length),n.push(r);continue}let i=t;if(this.options.extensions?.startBlock){let a=1/0,c=t.slice(1),o;this.options.extensions.startBlock.forEach(l=>{o=l.call({lexer:this},c),typeof o=="number"&&o>=0&&(a=Math.min(a,o))}),a<1/0&&a>=0&&(i=t.substring(0,a+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let a=n.at(-1);s&&a?.type==="paragraph"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r),s=i.length!==t.length,t=t.substring(r.raw.length);continue}if(r=this.tokenizer.text(t)){t=t.substring(r.raw.length);let a=n.at(-1);a?.type==="text"?(a.raw+=(a.raw.endsWith(`
`)?"":`
`)+r.raw,a.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):n.push(r);continue}if(t){let a="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let s=t,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(s))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(s=s.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+s.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(s))!=null;)s=s.slice(0,r.index)+"++"+s.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(s))!=null;)i=r[2]?r[2].length:0,s=s.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+s.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let a=!1,c="";for(;t;){a||(c=""),a=!1;let o;if(this.options.extensions?.inline?.some(u=>(o=u.call({lexer:this},t,n))?(t=t.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(o.raw.length);let u=n.at(-1);o.type==="text"&&u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(t,s,c)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(t,s,c)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(t)){t=t.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(t))){t=t.substring(o.raw.length),n.push(o);continue}let l=t;if(this.options.extensions?.startInline){let u=1/0,f=t.slice(1),g;this.options.extensions.startInline.forEach(d=>{g=d.call({lexer:this},f),typeof g=="number"&&g>=0&&(u=Math.min(u,g))}),u<1/0&&u>=0&&(l=t.substring(0,u+1))}if(o=this.tokenizer.inlineText(l)){t=t.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(c=o.raw.slice(-1)),a=!0;let u=n.at(-1);u?.type==="text"?(u.raw+=o.raw,u.text+=o.text):n.push(o);continue}if(t){let u="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return n}},Nt=class{options;parser;constructor(e){this.options=e||tt}space(e){return""}code({text:e,lang:t,escaped:n}){let s=(t||"").match(ze.notSpaceStart)?.[0],r=e.replace(ze.endingNewline,"")+`
`;return s?'<pre><code class="language-'+We(s)+'">'+(n?r:We(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:We(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,s="";for(let a=0;a<e.items.length;a++){let c=e.items[a];s+=this.listitem(c)}let r=t?"ol":"ul",i=t&&n!==1?' start="'+n+'"':"";return"<"+r+i+`>
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
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${We(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let s=this.parser.parseInline(n),r=Xr(e);if(r===null)return s;e=r;let i='<a href="'+e+'"';return t&&(i+=' title="'+We(t)+'"'),i+=">"+s+"</a>",i}image({href:e,title:t,text:n,tokens:s}){s&&(n=this.parser.parseInline(s,this.parser.textRenderer));let r=Xr(e);if(r===null)return We(n);e=r;let i=`<img src="${e}" alt="${We(n)}"`;return t&&(i+=` title="${We(t)}"`),i+=">",i}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:We(e.text)}},ln=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},He=class ir{options;renderer;textRenderer;constructor(t){this.options=t||tt,this.options.renderer=this.options.renderer||new Nt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ln}static parse(t,n){return new ir(n).parse(t)}static parseInline(t,n){return new ir(n).parseInline(t)}parse(t){let n="";for(let s=0;s<t.length;s++){let r=t[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,c=this.options.extensions.renderers[a.type].call({parser:this},a);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){n+=c||"";continue}}let i=r;switch(i.type){case"space":{n+=this.renderer.space(i);break}case"hr":{n+=this.renderer.hr(i);break}case"heading":{n+=this.renderer.heading(i);break}case"code":{n+=this.renderer.code(i);break}case"table":{n+=this.renderer.table(i);break}case"blockquote":{n+=this.renderer.blockquote(i);break}case"list":{n+=this.renderer.list(i);break}case"checkbox":{n+=this.renderer.checkbox(i);break}case"html":{n+=this.renderer.html(i);break}case"def":{n+=this.renderer.def(i);break}case"paragraph":{n+=this.renderer.paragraph(i);break}case"text":{n+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(t,n=this.renderer){let s="";for(let r=0;r<t.length;r++){let i=t[r];if(this.options.extensions?.renderers?.[i.type]){let c=this.options.extensions.renderers[i.type].call({parser:this},i);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=c||"";continue}}let a=i;switch(a.type){case"escape":{s+=n.text(a);break}case"html":{s+=n.html(a);break}case"link":{s+=n.link(a);break}case"image":{s+=n.image(a);break}case"checkbox":{s+=n.checkbox(a);break}case"strong":{s+=n.strong(a);break}case"em":{s+=n.em(a);break}case"codespan":{s+=n.codespan(a);break}case"br":{s+=n.br(a);break}case"del":{s+=n.del(a);break}case"text":{s+=n.text(a);break}default:{let c='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return s}},wt=class{options;block;constructor(e){this.options=e||tt}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?De.lex:De.lexInline}provideParser(){return this.block?He.parse:He.parseInline}},Vr=class{defaults=nn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=He;Renderer=Nt;TextRenderer=ln;Lexer=De;Tokenizer=Bt;Hooks=wt;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let s of e)switch(n=n.concat(t.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)n=n.concat(this.walkTokens(i.tokens,t));for(let i of r.rows)for(let a of i)n=n.concat(this.walkTokens(a.tokens,t));break}case"list":{let r=s;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);n=n.concat(this.walkTokens(a,t))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let s={...n};if(s.async=this.defaults.async||s.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=t.renderers[r.name];i?t.renderers[r.name]=function(...a){let c=r.renderer.apply(this,a);return c===!1&&(c=i.apply(this,a)),c}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=t[r.level];i?i.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),s.extensions=t),n.renderer){let r=this.defaults.renderer||new Nt(this.defaults);for(let i in n.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,c=n.renderer[a],o=r[a];r[a]=(...l)=>{let u=c.apply(r,l);return u===!1&&(u=o.apply(r,l)),u||""}}s.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Bt(this.defaults);for(let i in n.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,c=n.tokenizer[a],o=r[a];r[a]=(...l)=>{let u=c.apply(r,l);return u===!1&&(u=o.apply(r,l)),u}}s.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new wt;for(let i in n.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,c=n.hooks[a],o=r[a];wt.passThroughHooks.has(i)?r[a]=l=>{if(this.defaults.async&&wt.passThroughHooksRespectAsync.has(i))return(async()=>{let f=await c.call(r,l);return o.call(r,f)})();let u=c.call(r,l);return o.call(r,u)}:r[a]=(...l)=>{if(this.defaults.async)return(async()=>{let f=await c.apply(r,l);return f===!1&&(f=await o.apply(r,l)),f})();let u=c.apply(r,l);return u===!1&&(u=o.apply(r,l)),u}}s.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,i=n.walkTokens;s.walkTokens=function(a){let c=[];return c.push(i.call(this,a)),r&&(c=c.concat(r.call(this,a))),c}}this.defaults={...this.defaults,...s}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return De.lex(e,t??this.defaults)}parser(e,t){return He.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let s={...n},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=e),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(t):t,c=await(r.hooks?await r.hooks.provideLexer():e?De.lex:De.lexInline)(a,r),o=r.hooks?await r.hooks.processAllTokens(c):c;r.walkTokens&&await Promise.all(this.walkTokens(o,r.walkTokens));let l=await(r.hooks?await r.hooks.provideParser():e?He.parse:He.parseInline)(o,r);return r.hooks?await r.hooks.postprocess(l):l})().catch(i);try{r.hooks&&(t=r.hooks.preprocess(t));let a=(r.hooks?r.hooks.provideLexer():e?De.lex:De.lexInline)(t,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let c=(r.hooks?r.hooks.provideParser():e?He.parse:He.parseInline)(a,r);return r.hooks&&(c=r.hooks.postprocess(c)),c}catch(a){return i(a)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let s="<p>An error occurred:</p><pre>"+We(n.message+"",!0)+"</pre>";return t?Promise.resolve(s):s}if(t)return Promise.reject(n);throw n}}},ot=new Vr;function re(e,t){return ot.parse(e,t)}re.options=re.setOptions=function(e){return ot.setOptions(e),re.defaults=ot.defaults,zr(re.defaults),re},re.getDefaults=nn,re.defaults=tt,re.use=function(...e){return ot.use(...e),re.defaults=ot.defaults,zr(re.defaults),re},re.walkTokens=function(e,t){return ot.walkTokens(e,t)},re.parseInline=ot.parseInline,re.Parser=He,re.parser=He.parse,re.Renderer=Nt,re.TextRenderer=ln,re.Lexer=De,re.lexer=De.lex,re.Tokenizer=Bt,re.Hooks=wt,re.parse=re;var sa=re.options,aa=re.setOptions,oa=re.use,la=re.walkTokens,ca=re.parseInline,ua=re,ha=He.parse,da=De.lex;const Jr=Object.freeze(Object.defineProperty({__proto__:null,Hooks:wt,Lexer:De,Marked:Vr,Parser:He,Renderer:Nt,TextRenderer:ln,Tokenizer:Bt,get defaults(){return tt},getDefaults:nn,lexer:da,marked:re,options:sa,parse:ua,parseInline:ca,parser:ha,setOptions:aa,use:oa,walkTokens:la},Symbol.toStringTag,{value:"Module"})),ei=`function O() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var $ = O();
function he(s) {
  $ = s;
}
var T = { exec: () => null };
function k(s, e = "") {
  let r = typeof s == "string" ? s : s.source, n = { replace: (t, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(m.caret, "$1"), r = r.replace(t, l), n;
  }, getRegex: () => new RegExp(r, e) };
  return n;
}
var Te = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\\t)/gm, outputLinkReplace: /\\\\([\\[\\]])/g, indentCodeCompensation: /^(\\s+)(?:\`\`\`)/, beginningSpace: /^\\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\\n/g, tabCharGlobal: /\\t/g, multipleSpaceGlobal: /\\s+/g, blankLine: /^[ \\t]*$/, doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\\[[ xX]\\] +\\S/, listReplaceTask: /^\\[[ xX]\\] +/, listTaskCheckbox: /\\[[ xX]\\]/, anyLine: /\\n.*\\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\\||\\| *$/g, tableRowBlankLine: /\\n[ \\t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i, endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/, unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g, caret: /(^|[^\\[])\\^/g, percentDecode: /%25/g, findPipe: /\\|/g, splitPipe: / \\|/, slashPipe: /\\\\\\|/g, carriageReturn: /\\r\\n|\\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\\S*/, endingNewline: /\\n$/, listItemRegex: (s) => new RegExp(\`^( {0,3}\${s})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`), nextBulletRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`), hrRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`), fencesBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:\\\`\\\`\\\`|~~~)\`), headingBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}#\`), htmlBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)\`, "i"), blockquoteBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}>\`) }, Ae = /^(?:[ \\t]*(?:\\n|$))+/, _e = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, Pe = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, M = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Le = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, X = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, pe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, ue = k(pe).replace(/bull/g, X).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), ve = k(pe).replace(/bull/g, X).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), K = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/, Ie = /^[^\\n]+/, U = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, Ce = k(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", U).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), Be = k(/^(bull)([ \\t][^\\n]+?)?(?:\\n|$)/).replace(/bull/g, X).getRegex(), N = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", J = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, Ee = k("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", J).replace("tag", N).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), ge = k(K).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex(), qe = k(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", ge).getRegex(), V = { blockquote: qe, code: _e, def: Ce, fences: Pe, heading: Le, hr: M, html: Ee, lheading: ue, list: Be, newline: Ae, paragraph: ge, table: T, text: Ie }, re = k("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex(), Me = { ...V, lheading: ve, table: re, paragraph: k(K).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", N).getRegex() }, Ze = { ...V, html: k(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", J).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(), def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/, heading: /^(#{1,6})(.*)(?:\\n+|$)/, fences: T, lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, paragraph: k(K).replace("hr", M).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", ue).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, je = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, De = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, ke = /^( {2,}|\\\\)\\n(?!\\s*$)/, Oe = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, H = /[\\p{P}\\p{S}]/u, Y = /[\\s\\p{P}\\p{S}]/u, fe = /[^\\s\\p{P}\\p{S}]/u, Ne = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Y).getRegex(), de = /(?!~)[\\p{P}\\p{S}]/u, He = /(?!~)[\\s\\p{P}\\p{S}]/u, Qe = /(?:[^\\s\\p{P}\\p{S}]|~)/u, xe = /(?![*_])[\\p{P}\\p{S}]/u, Ge = /(?![*_])[\\s\\p{P}\\p{S}]/u, We = /(?:[^\\s\\p{P}\\p{S}]|[*_])/u, Fe = k(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", Te ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), be = /^(?:\\*+(?:((?!\\*)punct)|[^\\s*]))|^_+(?:((?!_)punct)|([^\\s_]))/, Xe = k(be, "u").replace(/punct/g, H).getRegex(), Ke = k(be, "u").replace(/punct/g, de).getRegex(), me = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", Ue = k(me, "gu").replace(/notPunctSpace/g, fe).replace(/punctSpace/g, Y).replace(/punct/g, H).getRegex(), Je = k(me, "gu").replace(/notPunctSpace/g, Qe).replace(/punctSpace/g, He).replace(/punct/g, de).getRegex(), Ve = k("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, fe).replace(/punctSpace/g, Y).replace(/punct/g, H).getRegex(), Ye = k(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, xe).getRegex(), et = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", tt = k(et, "gu").replace(/notPunctSpace/g, We).replace(/punctSpace/g, Ge).replace(/punct/g, xe).getRegex(), rt = k(/\\\\(punct)/, "gu").replace(/punct/g, H).getRegex(), st = k(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), nt = k(J).replace("(?:-->|$)", "-->").getRegex(), lt = k("^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", nt).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), D = /(?:\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+[^\`]*?\`+(?!\`)|[^\\[\\]\\\\\`])*?/, it = k(/^!?\\[(label)\\]\\(\\s*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?\\s*\\)/).replace("label", D).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]*/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), we = k(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", D).replace("ref", U).getRegex(), ye = k(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", U).getRegex(), at = k("reflink|nolink(?!\\\\()", "g").replace("reflink", we).replace("nolink", ye).getRegex(), se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ee = { _backpedal: T, anyPunctuation: rt, autolink: st, blockSkip: Fe, br: ke, code: De, del: T, delLDelim: T, delRDelim: T, emStrongLDelim: Xe, emStrongRDelimAst: Ue, emStrongRDelimUnd: Ve, escape: je, link: it, nolink: ye, punctuation: Ne, reflink: we, reflinkSearch: at, tag: lt, text: Oe, url: T }, ot = { ...ee, link: k(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", D).getRegex(), reflink: k(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", D).getRegex() }, G = { ...ee, emStrongRDelimAst: Je, emStrongLDelim: Ke, delLDelim: Ye, delRDelim: tt, url: k(/^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/, text: k(/^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/).replace("protocol", se).getRegex() }, ct = { ...G, br: k(ke).replace("{2,}", "*").getRegex(), text: k(G.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex() }, Z = { normal: V, gfm: Me, pedantic: Ze }, C = { normal: ee, gfm: G, breaks: ct, pedantic: ot }, ht = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ne = (s) => ht[s];
function S(s, e) {
  if (e) {
    if (m.escapeTest.test(s)) return s.replace(m.escapeReplace, ne);
  } else if (m.escapeTestNoEncode.test(s)) return s.replace(m.escapeReplaceNoEncode, ne);
  return s;
}
function le(s) {
  try {
    s = encodeURI(s).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function ie(s, e) {
  let r = s.replace(m.findPipe, (i, l, c) => {
    let a = !1, h = l;
    for (; --h >= 0 && c[h] === "\\\\"; ) a = !a;
    return a ? "|" : " |";
  }), n = r.split(m.splitPipe), t = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; t < n.length; t++) n[t] = n[t].trim().replace(m.slashPipe, "|");
  return n;
}
function B(s, e, r) {
  let n = s.length;
  if (n === 0) return "";
  let t = 0;
  for (; t < n && s.charAt(n - t - 1) === e; )
    t++;
  return s.slice(0, n - t);
}
function pt(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let r = 0;
  for (let n = 0; n < s.length; n++) if (s[n] === "\\\\") n++;
  else if (s[n] === e[0]) r++;
  else if (s[n] === e[1] && (r--, r < 0)) return n;
  return r > 0 ? -2 : -1;
}
function ut(s, e = 0) {
  let r = e, n = "";
  for (let t of s) if (t === "	") {
    let i = 4 - r % 4;
    n += " ".repeat(i), r += i;
  } else n += t, r++;
  return n;
}
function ae(s, e, r, n, t) {
  let i = e.href, l = e.title || null, c = s[1].replace(t.other.outputLinkReplace, "$1");
  n.state.inLink = !0;
  let a = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: r, href: i, title: l, text: c, tokens: n.inlineTokens(c) };
  return n.state.inLink = !1, a;
}
function gt(s, e, r) {
  let n = s.match(r.other.indentCodeCompensation);
  if (n === null) return e;
  let t = n[1];
  return e.split(\`
\`).map((i) => {
    let l = i.match(r.other.beginningSpace);
    if (l === null) return i;
    let [c] = l;
    return c.length >= t.length ? i.slice(t.length) : i;
  }).join(\`
\`);
}
var E = class {
  options;
  rules;
  lexer;
  constructor(s) {
    this.options = s || $;
  }
  space(s) {
    let e = this.rules.block.newline.exec(s);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(s) {
    let e = this.rules.block.code.exec(s);
    if (e) {
      let r = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? r : B(r, \`
\`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let r = e[0], n = gt(r, e[3] || "", this.rules);
      return { type: "code", raw: r, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: n };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let r = e[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let n = B(r, "#");
        (this.options.pedantic || !n || this.rules.other.endingSpaceChar.test(n)) && (r = n.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: B(e[0], \`
\`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let r = B(e[0], \`
\`).split(\`
\`), n = "", t = "", i = [];
      for (; r.length > 0; ) {
        let l = !1, c = [], a;
        for (a = 0; a < r.length; a++) if (this.rules.other.blockquoteStart.test(r[a])) c.push(r[a]), l = !0;
        else if (!l) c.push(r[a]);
        else break;
        r = r.slice(a);
        let h = c.join(\`
\`), o = h.replace(this.rules.other.blockquoteSetextReplace, \`
    $1\`).replace(this.rules.other.blockquoteSetextReplace2, "");
        n = n ? \`\${n}
\${h}\` : h, t = t ? \`\${t}
\${o}\` : o;
        let p = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(o, i, !0), this.lexer.state.top = p, r.length === 0) break;
        let u = i.at(-1);
        if (u?.type === "code") break;
        if (u?.type === "blockquote") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.blockquote(g);
          i[i.length - 1] = x, n = n.substring(0, n.length - d.raw.length) + x.raw, t = t.substring(0, t.length - d.text.length) + x.text;
          break;
        } else if (u?.type === "list") {
          let d = u, g = d.raw + \`
\` + r.join(\`
\`), x = this.list(g);
          i[i.length - 1] = x, n = n.substring(0, n.length - u.raw.length) + x.raw, t = t.substring(0, t.length - d.raw.length) + x.raw, r = g.substring(i.at(-1).raw.length).split(\`
\`);
          continue;
        }
      }
      return { type: "blockquote", raw: n, tokens: i, text: t };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let r = e[1].trim(), n = r.length > 1, t = { type: "list", raw: "", ordered: n, start: n ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = n ? \`\\\\d{1,9}\\\\\${r.slice(-1)}\` : \`\\\\\${r}\`, this.options.pedantic && (r = n ? r : "[*+-]");
      let i = this.rules.other.listItemRegex(r), l = !1;
      for (; s; ) {
        let a = !1, h = "", o = "";
        if (!(e = i.exec(s)) || this.rules.block.hr.test(s)) break;
        h = e[0], s = s.substring(h.length);
        let p = ut(e[2].split(\`
\`, 1)[0], e[1].length), u = s.split(\`
\`, 1)[0], d = !p.trim(), g = 0;
        if (this.options.pedantic ? (g = 2, o = p.trimStart()) : d ? g = e[1].length + 1 : (g = p.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, o = p.slice(g), g += e[1].length), d && this.rules.other.blankLine.test(u) && (h += u + \`
\`, s = s.substring(u.length + 1), a = !0), !a) {
          let x = this.rules.other.nextBulletRegex(g), _ = this.rules.other.hrRegex(g), P = this.rules.other.fencesBeginRegex(g), R = this.rules.other.headingBeginRegex(g), te = this.rules.other.htmlBeginRegex(g), I = this.rules.other.blockquoteBeginRegex(g);
          for (; s; ) {
            let L = s.split(\`
\`, 1)[0], z;
            if (u = L, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), z = u) : z = u.replace(this.rules.other.tabCharGlobal, "    "), P.test(u) || R.test(u) || te.test(u) || I.test(u) || x.test(u) || _.test(u)) break;
            if (z.search(this.rules.other.nonSpaceChar) >= g || !u.trim()) o += \`
\` + z.slice(g);
            else {
              if (d || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || P.test(p) || R.test(p) || _.test(p)) break;
              o += \`
\` + u;
            }
            d = !u.trim(), h += L + \`
\`, s = s.substring(L.length + 1), p = z.slice(g);
          }
        }
        t.loose || (l ? t.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (l = !0)), t.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(o), loose: !1, text: o, tokens: [] }), t.raw += h;
      }
      let c = t.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      t.raw = t.raw.trimEnd();
      for (let a of t.items) {
        if (this.lexer.state.top = !1, a.tokens = this.lexer.blockTokens(a.text, []), a.task) {
          if (a.text = a.text.replace(this.rules.other.listReplaceTask, ""), a.tokens[0]?.type === "text" || a.tokens[0]?.type === "paragraph") {
            a.tokens[0].raw = a.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), a.tokens[0].text = a.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let o = this.lexer.inlineQueue.length - 1; o >= 0; o--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[o].src)) {
              this.lexer.inlineQueue[o].src = this.lexer.inlineQueue[o].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let h = this.rules.other.listTaskCheckbox.exec(a.raw);
          if (h) {
            let o = { type: "checkbox", raw: h[0] + " ", checked: h[0] !== "[ ]" };
            a.checked = o.checked, t.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = o.raw + a.tokens[0].raw, a.tokens[0].text = o.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(o)) : a.tokens.unshift({ type: "paragraph", raw: o.raw, text: o.raw, tokens: [o] }) : a.tokens.unshift(o);
          }
        }
        if (!t.loose) {
          let h = a.tokens.filter((p) => p.type === "space"), o = h.length > 0 && h.some((p) => this.rules.other.anyLine.test(p.raw));
          t.loose = o;
        }
      }
      if (t.loose) for (let a of t.items) {
        a.loose = !0;
        for (let h of a.tokens) h.type === "text" && (h.type = "paragraph");
      }
      return t;
    }
  }
  html(s) {
    let e = this.rules.block.html.exec(s);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(s) {
    let e = this.rules.block.def.exec(s);
    if (e) {
      let r = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), n = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", t = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: r, raw: e[0], href: n, title: t };
    }
  }
  table(s) {
    let e = this.rules.block.table.exec(s);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let r = ie(e[1]), n = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(\`
\`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (r.length === n.length) {
      for (let l of n) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < r.length; l++) i.header.push({ text: r[l], tokens: this.lexer.inline(r[l]), header: !0, align: i.align[l] });
      for (let l of t) i.rows.push(ie(l, i.header.length).map((c, a) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[a] })));
      return i;
    }
  }
  lheading(s) {
    let e = this.rules.block.lheading.exec(s);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(s) {
    let e = this.rules.block.paragraph.exec(s);
    if (e) {
      let r = e[1].charAt(e[1].length - 1) === \`
\` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: r, tokens: this.lexer.inline(r) };
    }
  }
  text(s) {
    let e = this.rules.block.text.exec(s);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(s) {
    let e = this.rules.inline.escape.exec(s);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(s) {
    let e = this.rules.inline.tag.exec(s);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(s) {
    let e = this.rules.inline.link.exec(s);
    if (e) {
      let r = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let i = B(r.slice(0, -1), "\\\\");
        if ((r.length - i.length) % 2 === 0) return;
      } else {
        let i = pt(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let n = e[2], t = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(n);
        i && (n = i[1], t = i[3]);
      } else t = e[3] ? e[3].slice(1, -1) : "";
      return n = n.trim(), this.rules.other.startAngleBracket.test(n) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? n = n.slice(1) : n = n.slice(1, -1)), ae(e, { href: n && n.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let r;
    if ((r = this.rules.inline.reflink.exec(s)) || (r = this.rules.inline.nolink.exec(s))) {
      let n = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[n.toLowerCase()];
      if (!t) {
        let i = r[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return ae(r, t, r[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, r = "") {
    let n = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!n || n[3] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(n[1] || n[2]) || !r || this.rules.inline.punctuation.exec(r))) {
      let t = [...n[0]].length - 1, i, l, c = t, a = 0, h = n[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = h.exec(e)) != null; ) {
        if (i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !i) continue;
        if (l = [...i].length, n[3] || n[4]) {
          c += l;
          continue;
        } else if ((n[5] || n[6]) && t % 3 && !((t + l) % 3)) {
          a += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c + a);
        let o = [...n[0]][0].length, p = s.slice(0, t + n.index + o + l);
        if (Math.min(t, l) % 2) {
          let d = p.slice(1, -1);
          return { type: "em", raw: p, text: d, tokens: this.lexer.inlineTokens(d) };
        }
        let u = p.slice(2, -2);
        return { type: "strong", raw: p, text: u, tokens: this.lexer.inlineTokens(u) };
      }
    }
  }
  codespan(s) {
    let e = this.rules.inline.code.exec(s);
    if (e) {
      let r = e[2].replace(this.rules.other.newLineCharGlobal, " "), n = this.rules.other.nonSpaceChar.test(r), t = this.rules.other.startingSpaceChar.test(r) && this.rules.other.endingSpaceChar.test(r);
      return n && t && (r = r.substring(1, r.length - 1)), { type: "codespan", raw: e[0], text: r };
    }
  }
  br(s) {
    let e = this.rules.inline.br.exec(s);
    if (e) return { type: "br", raw: e[0] };
  }
  del(s, e, r = "") {
    let n = this.rules.inline.delLDelim.exec(s);
    if (n && (!n[1] || !r || this.rules.inline.punctuation.exec(r))) {
      let t = [...n[0]].length - 1, i, l, c = t, a = this.rules.inline.delRDelim;
      for (a.lastIndex = 0, e = e.slice(-1 * s.length + t); (n = a.exec(e)) != null; ) {
        if (i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6], !i || (l = [...i].length, l !== t)) continue;
        if (n[3] || n[4]) {
          c += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c);
        let h = [...n[0]][0].length, o = s.slice(0, t + n.index + h + l), p = o.slice(t, -t);
        return { type: "del", raw: o, text: p, tokens: this.lexer.inlineTokens(p) };
      }
    }
  }
  autolink(s) {
    let e = this.rules.inline.autolink.exec(s);
    if (e) {
      let r, n;
      return e[2] === "@" ? (r = e[1], n = "mailto:" + r) : (r = e[1], n = r), { type: "link", raw: e[0], text: r, href: n, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  url(s) {
    let e;
    if (e = this.rules.inline.url.exec(s)) {
      let r, n;
      if (e[2] === "@") r = e[0], n = "mailto:" + r;
      else {
        let t;
        do
          t = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (t !== e[0]);
        r = e[0], e[1] === "www." ? n = "http://" + e[0] : n = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: n, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(s) {
    let e = this.rules.inline.text.exec(s);
    if (e) {
      let r = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: r };
    }
  }
}, w = class W {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || $, this.options.tokenizer = this.options.tokenizer || new E(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: m, block: Z.normal, inline: C.normal };
    this.options.pedantic ? (r.block = Z.pedantic, r.inline = C.pedantic) : this.options.gfm && (r.block = Z.gfm, this.options.breaks ? r.inline = C.breaks : r.inline = C.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Z, inline: C };
  }
  static lex(e, r) {
    return new W(r).lex(e);
  }
  static lexInline(e, r) {
    return new W(r).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, \`
\`), this.blockTokens(e, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let n = this.inlineQueue[r];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, r = [], n = !1) {
    for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
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
        let l = 1 / 0, c = e.slice(1), a;
        this.options.extensions.startBlock.forEach((h) => {
          a = h.call({ lexer: this }, c), typeof a == "number" && a >= 0 && (l = Math.min(l, a));
        }), l < 1 / 0 && l >= 0 && (i = e.substring(0, l + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(i))) {
        let l = r.at(-1);
        n && l?.type === "paragraph" ? (l.raw += (l.raw.endsWith(\`
\`) ? "" : \`
\`) + t.raw, l.text += \`
\` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : r.push(t), n = i.length !== e.length, e = e.substring(t.raw.length);
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
    let n = e, t = null;
    if (this.tokens.links) {
      let a = Object.keys(this.tokens.links);
      if (a.length > 0) for (; (t = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) a.includes(t[0].slice(t[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, t.index) + "[" + "a".repeat(t[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (t = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, t.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) i = t[2] ? t[2].length : 0, n = n.slice(0, t.index + i) + "[" + "a".repeat(t[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
      let a;
      if (this.options.extensions?.inline?.some((o) => (a = o.call({ lexer: this }, e, r)) ? (e = e.substring(a.raw.length), r.push(a), !0) : !1)) continue;
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
        let o = r.at(-1);
        a.type === "text" && o?.type === "text" ? (o.raw += a.raw, o.text += a.text) : r.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, n, c)) {
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
      if (a = this.tokenizer.del(e, n, c)) {
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
        let o = 1 / 0, p = e.slice(1), u;
        this.options.extensions.startInline.forEach((d) => {
          u = d.call({ lexer: this }, p), typeof u == "number" && u >= 0 && (o = Math.min(o, u));
        }), o < 1 / 0 && o >= 0 && (h = e.substring(0, o + 1));
      }
      if (a = this.tokenizer.inlineText(h)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (c = a.raw.slice(-1)), l = !0;
        let o = r.at(-1);
        o?.type === "text" ? (o.raw += a.raw, o.text += a.text) : r.push(a);
        continue;
      }
      if (e) {
        let o = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(o);
          break;
        } else throw new Error(o);
      }
    }
    return r;
  }
}, q = class {
  options;
  parser;
  constructor(s) {
    this.options = s || $;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: r }) {
    let n = (e || "").match(m.notSpaceStart)?.[0], t = s.replace(m.endingNewline, "") + \`
\`;
    return n ? '<pre><code class="language-' + S(n) + '">' + (r ? t : S(t, !0)) + \`</code></pre>
\` : "<pre><code>" + (r ? t : S(t, !0)) + \`</code></pre>
\`;
  }
  blockquote({ tokens: s }) {
    return \`<blockquote>
\${this.parser.parse(s)}</blockquote>
\`;
  }
  html({ text: s }) {
    return s;
  }
  def(s) {
    return "";
  }
  heading({ tokens: s, depth: e }) {
    return \`<h\${e}>\${this.parser.parseInline(s)}</h\${e}>
\`;
  }
  hr(s) {
    return \`<hr>
\`;
  }
  list(s) {
    let e = s.ordered, r = s.start, n = "";
    for (let l = 0; l < s.items.length; l++) {
      let c = s.items[l];
      n += this.listitem(c);
    }
    let t = e ? "ol" : "ul", i = e && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + t + i + \`>
\` + n + "</" + t + \`>
\`;
  }
  listitem(s) {
    return \`<li>\${this.parser.parse(s.tokens)}</li>
\`;
  }
  checkbox({ checked: s }) {
    return "<input " + (s ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: s }) {
    return \`<p>\${this.parser.parseInline(s)}</p>
\`;
  }
  table(s) {
    let e = "", r = "";
    for (let t = 0; t < s.header.length; t++) r += this.tablecell(s.header[t]);
    e += this.tablerow({ text: r });
    let n = "";
    for (let t = 0; t < s.rows.length; t++) {
      let i = s.rows[t];
      r = "";
      for (let l = 0; l < i.length; l++) r += this.tablecell(i[l]);
      n += this.tablerow({ text: r });
    }
    return n && (n = \`<tbody>\${n}</tbody>\`), \`<table>
<thead>
\` + e + \`</thead>
\` + n + \`</table>
\`;
  }
  tablerow({ text: s }) {
    return \`<tr>
\${s}</tr>
\`;
  }
  tablecell(s) {
    let e = this.parser.parseInline(s.tokens), r = s.header ? "th" : "td";
    return (s.align ? \`<\${r} align="\${s.align}">\` : \`<\${r}>\`) + e + \`</\${r}>
\`;
  }
  strong({ tokens: s }) {
    return \`<strong>\${this.parser.parseInline(s)}</strong>\`;
  }
  em({ tokens: s }) {
    return \`<em>\${this.parser.parseInline(s)}</em>\`;
  }
  codespan({ text: s }) {
    return \`<code>\${S(s, !0)}</code>\`;
  }
  br(s) {
    return "<br>";
  }
  del({ tokens: s }) {
    return \`<del>\${this.parser.parseInline(s)}</del>\`;
  }
  link({ href: s, title: e, tokens: r }) {
    let n = this.parser.parseInline(r), t = le(s);
    if (t === null) return n;
    s = t;
    let i = '<a href="' + s + '"';
    return e && (i += ' title="' + S(e) + '"'), i += ">" + n + "</a>", i;
  }
  image({ href: s, title: e, text: r, tokens: n }) {
    n && (r = this.parser.parseInline(n, this.parser.textRenderer));
    let t = le(s);
    if (t === null) return S(r);
    s = t;
    let i = \`<img src="\${s}" alt="\${S(r)}"\`;
    return e && (i += \` title="\${S(e)}"\`), i += ">", i;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : S(s.text);
  }
}, Q = class {
  strong({ text: s }) {
    return s;
  }
  em({ text: s }) {
    return s;
  }
  codespan({ text: s }) {
    return s;
  }
  del({ text: s }) {
    return s;
  }
  html({ text: s }) {
    return s;
  }
  text({ text: s }) {
    return s;
  }
  link({ text: s }) {
    return "" + s;
  }
  image({ text: s }) {
    return "" + s;
  }
  br() {
    return "";
  }
  checkbox({ raw: s }) {
    return s;
  }
}, y = class F {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || $, this.options.renderer = this.options.renderer || new q(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Q();
  }
  static parse(e, r) {
    return new F(r).parse(e);
  }
  static parseInline(e, r) {
    return new F(r).parseInline(e);
  }
  parse(e) {
    let r = "";
    for (let n = 0; n < e.length; n++) {
      let t = e[n];
      if (this.options.extensions?.renderers?.[t.type]) {
        let l = t, c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(l.type)) {
          r += c || "";
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
    let n = "";
    for (let t = 0; t < e.length; t++) {
      let i = e[t];
      if (this.options.extensions?.renderers?.[i.type]) {
        let c = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += c || "";
          continue;
        }
      }
      let l = i;
      switch (l.type) {
        case "escape": {
          n += r.text(l);
          break;
        }
        case "html": {
          n += r.html(l);
          break;
        }
        case "link": {
          n += r.link(l);
          break;
        }
        case "image": {
          n += r.image(l);
          break;
        }
        case "checkbox": {
          n += r.checkbox(l);
          break;
        }
        case "strong": {
          n += r.strong(l);
          break;
        }
        case "em": {
          n += r.em(l);
          break;
        }
        case "codespan": {
          n += r.codespan(l);
          break;
        }
        case "br": {
          n += r.br(l);
          break;
        }
        case "del": {
          n += r.del(l);
          break;
        }
        case "text": {
          n += r.text(l);
          break;
        }
        default: {
          let c = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return n;
  }
}, v = class {
  options;
  block;
  constructor(s) {
    this.options = s || $;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(s) {
    return s;
  }
  postprocess(s) {
    return s;
  }
  processAllTokens(s) {
    return s;
  }
  emStrongMask(s) {
    return s;
  }
  provideLexer() {
    return this.block ? w.lex : w.lexInline;
  }
  provideParser() {
    return this.block ? y.parse : y.parseInline;
  }
}, Se = class {
  defaults = O();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = y;
  Renderer = q;
  TextRenderer = Q;
  Lexer = w;
  Tokenizer = E;
  Hooks = v;
  constructor(...s) {
    this.use(...s);
  }
  walkTokens(s, e) {
    let r = [];
    for (let n of s) switch (r = r.concat(e.call(this, n)), n.type) {
      case "table": {
        let t = n;
        for (let i of t.header) r = r.concat(this.walkTokens(i.tokens, e));
        for (let i of t.rows) for (let l of i) r = r.concat(this.walkTokens(l.tokens, e));
        break;
      }
      case "list": {
        let t = n;
        r = r.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = n;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((i) => {
          let l = t[i].flat(1 / 0);
          r = r.concat(this.walkTokens(l, e));
        }) : t.tokens && (r = r.concat(this.walkTokens(t.tokens, e)));
      }
    }
    return r;
  }
  use(...s) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return s.forEach((r) => {
      let n = { ...r };
      if (n.async = this.defaults.async || n.async || !1, r.extensions && (r.extensions.forEach((t) => {
        if (!t.name) throw new Error("extension name required");
        if ("renderer" in t) {
          let i = e.renderers[t.name];
          i ? e.renderers[t.name] = function(...l) {
            let c = t.renderer.apply(this, l);
            return c === !1 && (c = i.apply(this, l)), c;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[t.level];
          i ? i.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), n.extensions = e), r.renderer) {
        let t = this.defaults.renderer || new q(this.defaults);
        for (let i in r.renderer) {
          if (!(i in t)) throw new Error(\`renderer '\${i}' does not exist\`);
          if (["options", "parser"].includes(i)) continue;
          let l = i, c = r.renderer[l], a = t[l];
          t[l] = (...h) => {
            let o = c.apply(t, h);
            return o === !1 && (o = a.apply(t, h)), o || "";
          };
        }
        n.renderer = t;
      }
      if (r.tokenizer) {
        let t = this.defaults.tokenizer || new E(this.defaults);
        for (let i in r.tokenizer) {
          if (!(i in t)) throw new Error(\`tokenizer '\${i}' does not exist\`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let l = i, c = r.tokenizer[l], a = t[l];
          t[l] = (...h) => {
            let o = c.apply(t, h);
            return o === !1 && (o = a.apply(t, h)), o;
          };
        }
        n.tokenizer = t;
      }
      if (r.hooks) {
        let t = this.defaults.hooks || new v();
        for (let i in r.hooks) {
          if (!(i in t)) throw new Error(\`hook '\${i}' does not exist\`);
          if (["options", "block"].includes(i)) continue;
          let l = i, c = r.hooks[l], a = t[l];
          v.passThroughHooks.has(i) ? t[l] = (h) => {
            if (this.defaults.async && v.passThroughHooksRespectAsync.has(i)) return (async () => {
              let p = await c.call(t, h);
              return a.call(t, p);
            })();
            let o = c.call(t, h);
            return a.call(t, o);
          } : t[l] = (...h) => {
            if (this.defaults.async) return (async () => {
              let p = await c.apply(t, h);
              return p === !1 && (p = await a.apply(t, h)), p;
            })();
            let o = c.apply(t, h);
            return o === !1 && (o = a.apply(t, h)), o;
          };
        }
        n.hooks = t;
      }
      if (r.walkTokens) {
        let t = this.defaults.walkTokens, i = r.walkTokens;
        n.walkTokens = function(l) {
          let c = [];
          return c.push(i.call(this, l)), t && (c = c.concat(t.call(this, l))), c;
        };
      }
      this.defaults = { ...this.defaults, ...n };
    }), this;
  }
  setOptions(s) {
    return this.defaults = { ...this.defaults, ...s }, this;
  }
  lexer(s, e) {
    return w.lex(s, e ?? this.defaults);
  }
  parser(s, e) {
    return y.parse(s, e ?? this.defaults);
  }
  parseMarkdown(s) {
    return (e, r) => {
      let n = { ...r }, t = { ...this.defaults, ...n }, i = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && n.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let l = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : s ? w.lex : w.lexInline)(l, t), a = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(a, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? y.parse : y.parseInline)(a, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(i);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let l = (t.hooks ? t.hooks.provideLexer() : s ? w.lex : w.lexInline)(e, t);
        t.hooks && (l = t.hooks.processAllTokens(l)), t.walkTokens && this.walkTokens(l, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : s ? y.parse : y.parseInline)(l, t);
        return t.hooks && (c = t.hooks.postprocess(c)), c;
      } catch (l) {
        return i(l);
      }
    };
  }
  onError(s, e) {
    return (r) => {
      if (r.message += \`
Please report this to https://github.com/markedjs/marked.\`, s) {
        let n = "<p>An error occurred:</p><pre>" + S(r.message + "", !0) + "</pre>";
        return e ? Promise.resolve(n) : n;
      }
      if (e) return Promise.reject(r);
      throw r;
    };
  }
}, A = new Se();
function f(s, e) {
  return A.parse(s, e);
}
f.options = f.setOptions = function(s) {
  return A.setOptions(s), f.defaults = A.defaults, he(f.defaults), f;
};
f.getDefaults = O;
f.defaults = $;
f.use = function(...s) {
  return A.use(...s), f.defaults = A.defaults, he(f.defaults), f;
};
f.walkTokens = function(s, e) {
  return A.walkTokens(s, e);
};
f.parseInline = A.parseInline;
f.Parser = y;
f.parser = y.parse;
f.Renderer = q;
f.TextRenderer = Q;
f.Lexer = w;
f.lexer = w.lex;
f.Tokenizer = E;
f.Hooks = v;
f.parse = f;
var kt = f.options, ft = f.setOptions, dt = f.use, xt = f.walkTokens, bt = f.parseInline, mt = f, wt = y.parse, yt = w.lex, oe = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Hooks: v,
  Lexer: w,
  Marked: Se,
  Parser: y,
  Renderer: q,
  TextRenderer: Q,
  Tokenizer: E,
  get defaults() {
    return $;
  },
  getDefaults: O,
  lexer: yt,
  marked: f,
  options: kt,
  parse: mt,
  parseInline: bt,
  parser: wt,
  setOptions: ft,
  use: dt,
  walkTokens: xt
});
function St(s) {
  if (s.startsWith("---")) {
    const e = s.indexOf(\`
---\`, 3);
    if (e !== -1) {
      const r = s.slice(3, e + 0).trim(), n = s.slice(e + 4).trimStart(), t = {};
      return r.split(/\\r?\\n/).forEach((i) => {
        const l = i.match(/^([^:]+):\\s*(.*)$/);
        l && (t[l[1].trim()] = l[2].trim());
      }), { content: n, data: t };
    }
  }
  return { content: s, data: {} };
}
const j = oe && (f || oe) || void 0;
let b = null;
const $t = "https://cdn.jsdelivr.net/npm/highlight.js";
async function ce() {
  if (b) return b;
  try {
    try {
      const s = await import($t + "/lib/core.js");
      b = s.default || s;
    } catch {
      b = null;
    }
  } catch {
    b = null;
  }
  return b;
}
j && typeof j.setOptions == "function" && j.setOptions({
  gfm: !0,
  headerIds: !0,
  mangle: !1,
  // marked expects a \`highlight\`/\`highlighted\` hook depending on version;
  // provide a handler that defends against missing \`hljs\`.
  highlighted: (s, e) => {
    try {
      return b && e && typeof b.getLanguage == "function" && b.getLanguage(e) ? b.highlight(s, { language: e }).value : b && typeof b.getLanguage == "function" && b.getLanguage("plaintext") ? b.highlight(s, { language: "plaintext" }).value : s;
    } catch {
      return s;
    }
  }
});
onmessage = async (s) => {
  const e = s.data || {};
  try {
    if (e.type === "register") {
      const { name: o, url: p } = e;
      try {
        if (!await ce()) {
          postMessage({ type: "register-error", name: o, error: "hljs unavailable" });
          return;
        }
        const d = await import(p), g = d.default || d;
        b.registerLanguage(o, g), postMessage({ type: "registered", name: o });
      } catch (u) {
        postMessage({ type: "register-error", name: o, error: String(u) });
      }
      return;
    }
    if (e.type === "detect") {
      const o = e.md || "", p = e.supported || [], u = /* @__PURE__ */ new Set(), d = /\`\`\`\\s*([a-zA-Z0-9_\\-+]+)?/g;
      let g;
      for (; g = d.exec(o); )
        if (g[1]) {
          const x = String(g[1]).toLowerCase();
          if (!x) continue;
          if (x.length >= 5 && x.length <= 30 && /^[a-z][a-z0-9_\\-+]*$/.test(x) && u.add(x), (/* @__PURE__ */ new Set(["bash", "sh", "zsh", "javascript", "js", "python", "py", "php", "java", "c", "cpp", "rust", "go", "ruby", "perl", "r", "scala", "swift", "kotlin", "cs", "csharp", "html", "css", "json", "xml", "yaml", "yml", "dockerfile", "docker"])).has(x) && u.add(x), p && p.length)
            try {
              p.indexOf(x) !== -1 && u.add(x);
            } catch {
            }
        }
      postMessage({ id: e.id, result: Array.from(u) });
      return;
    }
    const { id: r, md: n } = e, { content: t, data: i } = St(n || "");
    await ce().catch(() => {
    });
    let l = j.parse(t);
    const c = [], a = /* @__PURE__ */ new Map(), h = (o) => {
      try {
        return String(o || "").toLowerCase().trim().replace(/[^a-z0-9\\-\\s]+/g, "").replace(/\\s+/g, "-");
      } catch {
        return "heading";
      }
    };
    l = l.replace(/<h([1-6])([^>]*)>([\\s\\S]*?)<\\/h\\1>/g, (o, p, u, d) => {
      const g = Number(p), x = d.replace(/<[^>]+>/g, "").trim();
      let _ = null;
      const P = (u || "").match(/\\sid="([^"]+)"/);
      P && (_ = P[1]);
      const R = _ || h(x) || "heading", I = (a.get(R) || 0) + 1;
      a.set(R, I);
      const L = I === 1 ? R : R + "-" + I;
      c.push({ level: g, text: x, id: L });
      const z = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, $e = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", Re = (z[g] + " " + $e).trim(), ze = ((u || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${L}" class="\${Re}"\`).trim();
      return \`<h\${g} \${ze}>\${d}</h\${g}>\`;
    }), l = l.replace(/<img([^>]*)>/g, (o, p) => /\\bloading=/.test(p) ? \`<img\${p}>\` : /\\bdata-want-lazy=/.test(p) ? \`<img\${p}>\` : \`<img\${p} loading="lazy">\`), postMessage({ id: r, result: { html: l, meta: i || {}, toc: c } });
  } catch (r) {
    postMessage({ id: e.id, error: String(r) });
  }
};
`,ti=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",ei],{type:"text/javascript;charset=utf-8"});function fa(e){let t;try{if(t=ti&&(self.URL||self.webkitURL).createObjectURL(ti),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(ei),{type:"module",name:e?.name})}}function cn(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),s=e.slice(t+4).trimStart(),r={};return n.split(/\r?\n/).forEach(i=>{const a=i.match(/^([^:]+):\s*(.*)$/);a&&(r[a[1].trim()]=a[2].trim())}),{content:s,data:r}}}return{content:e,data:{}}}const Ot=Jr&&(re||Jr)||void 0;let Ce=null;const pa="https://cdn.jsdelivr.net/npm/highlight.js";async function un(){if(Ce)return Ce;try{try{const e=await import(pa+"/lib/core.js");Ce=e.default||e}catch{Ce=null}}catch{Ce=null}return Ce}Ot&&typeof Ot.setOptions=="function"&&Ot.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(e,t)=>{try{return Ce&&t&&typeof Ce.getLanguage=="function"&&Ce.getLanguage(t)?Ce.highlight(e,{language:t}).value:Ce&&typeof Ce.getLanguage=="function"&&Ce.getLanguage("plaintext")?Ce.highlight(e,{language:"plaintext"}).value:e}catch{return e}}}),onmessage=async e=>{const t=e.data||{};try{if(t.type==="register"){const{name:u,url:f}=t;try{if(!await un()){postMessage({type:"register-error",name:u,error:"hljs unavailable"});return}const d=await import(f),h=d.default||d;Ce.registerLanguage(u,h),postMessage({type:"registered",name:u})}catch(g){postMessage({type:"register-error",name:u,error:String(g)})}return}if(t.type==="detect"){const u=t.md||"",f=t.supported||[],g=new Set,d=/```\s*([a-zA-Z0-9_\-+]+)?/g;let h;for(;h=d.exec(u);)if(h[1]){const p=String(h[1]).toLowerCase();if(!p)continue;if(p.length>=5&&p.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(p)&&g.add(p),new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]).has(p)&&g.add(p),f&&f.length)try{f.indexOf(p)!==-1&&g.add(p)}catch{}}postMessage({id:t.id,result:Array.from(g)});return}const{id:n,md:s}=t,{content:r,data:i}=cn(s||"");await un().catch(()=>{});let a=Ot.parse(r);const c=[],o=new Map,l=u=>{try{return String(u||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};a=a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(u,f,g,d)=>{const h=Number(f),p=d.replace(/<[^>]+>/g,"").trim();let m=null;const b=(g||"").match(/\sid="([^"]+)"/);b&&(m=b[1]);const y=m||l(p)||"heading",E=(o.get(y)||0)+1;o.set(y,E);const M=E===1?y:y+"-"+E;c.push({level:h,text:p,id:M});const B={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},j=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal",R=(B[h]+" "+j).trim(),le=((g||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${M}" class="${R}"`).trim();return`<h${h} ${le}>${d}</h${h}>`}),a=a.replace(/<img([^>]*)>/g,(u,f)=>/\bloading=/.test(f)?`<img${f}>`:/\bdata-want-lazy=/.test(f)?`<img${f}>`:`<img${f} loading="lazy">`),postMessage({id:n,result:{html:a,meta:i||{},toc:c}})}catch(n){postMessage({id:t.id,error:String(n)})}};async function ga(e){try{if(e&&e.type==="register"){const{name:o,url:l}=e;try{if(!await un())return{type:"register-error",name:o,error:"hljs unavailable"};const f=await import(l),g=f.default||f;return Ce.registerLanguage(o,g),{type:"registered",name:o}}catch(u){return{type:"register-error",name:o,error:String(u)}}}if(e&&e.type==="detect"){const o=e.md||"",l=e.supported||[],u=new Set,f=/``\`\s*([a-zA-Z0-9_\-+]+)?/g;let g;for(;g=f.exec(o);)if(g[1]){const d=String(g[1]).toLowerCase();if(!d)continue;if(d.length>=5&&d.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(d)&&u.add(d),new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]).has(d)&&u.add(d),l&&l.length)try{l.indexOf(d)!==-1&&u.add(d)}catch{}}return{id:e.id,result:Array.from(u)}}const t=e&&e.id,{content:n,data:s}=cn(e&&e.md||"");await un().catch(()=>{});let r=Ot.parse(n);const i=[],a=new Map,c=o=>{try{return String(o||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};return r=r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(o,l,u,f)=>{const g=Number(l),d=f.replace(/<[^>]+>/g,"").trim();let h=null;const p=(u||"").match(/\sid="([^"]+)"/);p&&(h=p[1]);const m=h||c(d)||"heading",y=(a.get(m)||0)+1;a.set(m,y);const S=y===1?m:m+"-"+y;i.push({level:g,text:d,id:S});const E={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},M=g<=2?"has-text-weight-bold":g<=4?"has-text-weight-semibold":"has-text-weight-normal",B=(E[g]+" "+M).trim(),R=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${S}" class="${B}"`).trim();return`<h${g} ${R}>${f}</h${g}>`}),r=r.replace(/<img([^>]*)>/g,(o,l)=>/\bloading=/.test(l)?`<img${l}>`:/\bdata-want-lazy=/.test(l)?`<img${l}>`:`<img${l} loading="lazy">`),{id:t,result:{html:r,meta:s||{},toc:i}}}catch(t){return{id:e&&e.id,error:String(t)}}}const ma=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2;function wa(){if(typeof Worker<"u")try{return new fa}catch{}const e={message:[],error:[]};return{addEventListener(n,s){e[n]||(e[n]=[]),e[n].push(s)},removeEventListener(n,s){if(!e[n])return;const r=e[n].indexOf(s);r!==-1&&e[n].splice(r,1)},postMessage(n){setTimeout(async()=>{try{const r={data:await ga(n)}(e.message||[]).forEach(i=>i(r))}catch{const r={data:{id:n&&n.id}}(e.message||[]).forEach(i=>i(r))}},0)},terminate(){Object.keys(e).forEach(n=>e[n].length=0)}}}const ni=fr(()=>wa(),"markdown",ma),ri=typeof DOMParser<"u"?new DOMParser:null;function Dt(){return ni.get()}function ii(e){return ni.send(e,3e3)}const Fe=[];function On(e){if(e&&typeof e=="object"){Fe.push(e);try{re.use(e)}catch(t){console.warn("[markdown] failed to apply plugin",t)}}}function ba(e){Fe.length=0,Array.isArray(e)&&Fe.push(...e.filter(t=>t&&typeof t=="object"));try{Fe.forEach(t=>re.use(t))}catch(t){console.warn("[markdown] failed to apply markdown extensions",t)}}async function hn(e){if(Fe&&Fe.length){const{content:s,data:r}=cn(e||"");re.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""});try{Fe.forEach(a=>re.use(a))}catch(a){console.warn("[markdown] apply plugins failed",a)}const i=re.parse(s);try{const a=ri||(typeof DOMParser<"u"?new DOMParser:null);if(a){const c=a.parseFromString(i,"text/html"),o=c.querySelectorAll("h1,h2,h3,h4,h5,h6"),l=[];return o.forEach(u=>{l.push({level:Number(u.tagName.substring(1)),text:(u.textContent||"").trim(),id:u.id})}),{html:c.body.innerHTML,meta:r||{},toc:l}}}catch{}return{html:i,meta:r||{},toc:[]}}let t;try{const s=await Promise.resolve().then(()=>si);t=s.initRendererWorker&&s.initRendererWorker()}catch{t=Dt&&Dt()}try{if(typeof oe<"u"&&oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")&&/```\s*\n/.test(String(e||""))){const{content:s,data:r}=cn(e||"");re.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(l,u)=>{try{return u&&oe.getLanguage&&oe.getLanguage(u)?oe.highlight(l,{language:u}).value:oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")?oe.highlight(l,{language:"plaintext"}).value:l}catch{return l}}});let i=re.parse(s);try{i=i.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(l,u)=>{try{if(u&&oe&&typeof oe.highlight=="function")try{const f=oe.highlight(u,{language:"plaintext"});return`<pre><code>${f&&f.value?f.value:f}</code></pre>`}catch{try{if(oe&&typeof oe.highlightElement=="function"){const g={innerHTML:u};return oe.highlightElement(g),`<pre><code>${g.innerHTML}</code></pre>`}}catch{}}}catch{}return l})}catch{}const a=[],c=new Set,o=l=>{try{return String(l||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};return i=i.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,u,f,g)=>{const d=Number(u),h=g.replace(/<[^>]+>/g,"").trim();let p=o(h)||"heading",m=p,b=2;for(;c.has(m);)m=p+"-"+b,b+=1;c.add(m),a.push({level:d,text:h,id:m});const y={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},S=d<=2?"has-text-weight-bold":d<=4?"has-text-weight-semibold":"has-text-weight-normal",E=(y[d]+" "+S).trim(),B=((f||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${m}" class="${E}"`).trim();return`<h${d} ${B}>${g}</h${d}>`}),i=i.replace(/<img([^>]*)>/g,(l,u)=>/\bloading=/.test(u)?`<img${u}>`:/\bdata-want-lazy=/.test(u)?`<img${u}>`:`<img${u} loading="lazy">`),{html:i,meta:r||{},toc:a}}}catch{}if(!t)throw new Error("renderer worker required but unavailable");const n=await ii({type:"render",md:e});if(!n||typeof n!="object"||n.html===void 0)throw new Error("renderer worker returned invalid response");try{const s=new Map,r=[],i=o=>{try{return String(o||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},a=o=>{const l={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},u=o<=2?"has-text-weight-bold":o<=4?"has-text-weight-semibold":"has-text-weight-normal";return(l[o]+" "+u).trim()};let c=n.html;c=c.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(o,l,u,f)=>{const g=Number(l),d=f.replace(/<[^>]+>/g,"").trim(),h=(u||"").match(/\sid="([^"]+)"/),p=h?h[1]:i(d)||"heading",b=(s.get(p)||0)+1;s.set(p,b);const y=b===1?p:p+"-"+b;r.push({level:g,text:d,id:y});const S=a(g),M=((u||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${y}" class="${S}"`).trim();return`<h${g} ${M}>${f}</h${g}>`});try{const o=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute&&document.documentElement.getAttribute("data-nimbi-logo-moved")||"";if(o){const l=ri||(typeof DOMParser<"u"?new DOMParser:null);if(l){const u=l.parseFromString(c,"text/html");u.querySelectorAll("img").forEach(g=>{try{const d=g.getAttribute("src")||"";(d?new URL(d,location.href).toString():"")===o&&g.remove()}catch{}}),c=u.body.innerHTML}else try{const u=o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");c=c.replace(new RegExp(`<img[^>]*src=\\"${u}\\"[^>]*>`,"g"),"")}catch{}}}catch{}return{html:c,meta:n.meta||{},toc:r}}catch{return{html:n.html,meta:n.meta||{},toc:n.toc||[]}}}function Ht(e,t){const n=new Set,s=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),i=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let a;for(;a=s.exec(e);)if(a[1]){const c=a[1].toLowerCase();if(xn.has(c)||t&&t.size&&c.length<3&&!t.has(c)&&!(Ie&&Ie[c]&&t.has(Ie[c])))continue;if(t&&t.size){if(t.has(c)){const l=t.get(c);l&&n.add(l);continue}if(Ie&&Ie[c]){const l=Ie[c];if(t.has(l)){const u=t.get(l)||l;n.add(u);continue}}}(i.has(c)||c.length>=5&&c.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(c)&&!r.has(c))&&n.add(c)}return n}async function Dn(e,t){if(Fe&&Fe.length||typeof process<"u"&&process.env&&process.env.VITEST)return Ht(e||"",t);if(Dt&&Dt())try{const s=t&&t.size?Array.from(t.keys()):[],r=await ii({type:"detect",md:String(e||""),supported:s});if(Array.isArray(r))return new Set(r)}catch(s){console.warn("[markdown] detectFenceLanguagesAsync worker failed",s)}return Ht(e||"",t)}const si=Object.freeze(Object.defineProperty({__proto__:null,addMarkdownExtension:On,detectFenceLanguages:Ht,detectFenceLanguagesAsync:Dn,initRendererWorker:Dt,markdownPlugins:Fe,parseMarkdownToHtml:hn,setMarkdownExtensions:ba},Symbol.toStringTag,{value:"Module"})),ya=`import { _rewriteAnchors } from '../htmlBuilder.js'

/**
 * Worker entrypoint for rewriting anchor hrefs inside rendered HTML.
 *
 * Accepted messages:
 * - \`{ type: 'rewriteAnchors', id: string, html: string, contentBase?: string, pagePath?: string }\`
 *   -> posts \`{ id, result: string }\` where \`result\` is the rewritten HTML string.
 *
 * On error the worker posts \`{ id, error: string }\`.
 */

onmessage = async (ev) => {
  const msg = ev.data || {}
  try {
    if (msg.type === 'rewriteAnchors') {
      const { id, html, contentBase, pagePath } = msg
      try {
        
        const parser = new DOMParser()
        const doc = parser.parseFromString(html || '', 'text/html')
        const article = doc.body
        await _rewriteAnchors(article, contentBase, pagePath)
        postMessage({ id, result: doc.body.innerHTML })
      } catch (e) {
        postMessage({ id, error: String(e) })
      }
      return
    }
  } catch (e) {
    postMessage({ id: msg.id, error: String(e) })
  }
}

// Exported handler for inline invocation in non-Worker environments (tests).
export async function handleAnchorWorkerMessage(msg) {
  try {
    if (msg && msg.type === 'rewriteAnchors') {
      const { id, html, contentBase, pagePath } = msg
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html || '', 'text/html')
        const article = doc.body
        await _rewriteAnchors(article, contentBase, pagePath)
        return { id, result: doc.body.innerHTML }
      } catch (e) {
        return { id, error: String(e) }
      }
    }
    return { id: msg && msg.id, error: 'unsupported message' }
  } catch (e) {
    return { id: msg && msg.id, error: String(e) }
  }
}
`;onmessage=async e=>{const t=e.data||{};try{if(t.type==="rewriteAnchors"){const{id:n,html:s,contentBase:r,pagePath:i}=t;try{const c=new DOMParser().parseFromString(s||"","text/html"),o=c.body;await qn(o,r,i),postMessage({id:n,result:c.body.innerHTML})}catch(a){postMessage({id:n,error:String(a)})}return}}catch(n){postMessage({id:t.id,error:String(n)})}};async function ka(e){try{if(e&&e.type==="rewriteAnchors"){const{id:t,html:n,contentBase:s,pagePath:r}=e;try{const a=new DOMParser().parseFromString(n||"","text/html"),c=a.body;return await qn(c,s,r),{id:t,result:a.body.innerHTML}}catch(i){return{id:t,error:String(i)}}}return{id:e&&e.id,error:"unsupported message"}}catch(t){return{id:e&&e.id,error:String(t)}}}const xa=typeof globalThis<"u"&&typeof globalThis.__nimbiCMSDebug<"u"?!!globalThis.__nimbiCMSDebug:!1;function Sa(...e){try{xa&&console&&typeof console.warn=="function"&&console.warn(...e)}catch{}}function va(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t||"").replace(/\/$/,"")+"/"+String(e||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e||"")}}}}function Ea(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav";const s=document.createElement("p");s.className="menu-label",s.textContent=e("navigation"),n.appendChild(s);const r=document.createElement("ul");return r.className="menu-list",t.forEach(i=>{const a=document.createElement("li"),c=document.createElement("a");if(c.href="#"+i.path,c.textContent=i.name,a.appendChild(c),i.children&&i.children.length){const o=document.createElement("ul");i.children.forEach(l=>{const u=document.createElement("li"),f=document.createElement("a");f.href="#"+l.path,f.textContent=l.name,u.appendChild(f),o.appendChild(u)}),a.appendChild(o)}r.appendChild(a)}),n.appendChild(r),n}function Aa(e,t,n=""){const s=document.createElement("aside");s.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=e("onThisPage"),s.appendChild(r);const i=document.createElement("ul");i.className="menu-list";try{const c={};(t||[]).forEach(o=>{try{if(!o||o.level===1)return;const l=Number(o.level)>=2?Number(o.level):2,u=document.createElement("li"),f=document.createElement("a"),g=o.id||he(o.text||"");f.textContent=o.text||"";try{const m=String(n||"").replace(/^[\\.\\/]+/,""),b=m&&F&&F.has&&F.has(m)?F.get(m):m;b?f.href=ye(b,g):f.href=`#${encodeURIComponent(g)}`}catch(m){console.warn("[htmlBuilder] buildTocElement href normalization failed",m),f.href=`#${encodeURIComponent(g)}`}if(u.appendChild(f),l===2){i.appendChild(u),c[2]=u,Object.keys(c).forEach(m=>{Number(m)>2&&delete c[m]});return}let d=l-1;for(;d>2&&!c[d];)d--;d<2&&(d=2);let h=c[d];if(!h){i.appendChild(u),c[l]=u;return}let p=h.querySelector("ul");p||(p=document.createElement("ul"),h.appendChild(p)),p.appendChild(u),c[l]=u}catch(l){console.warn("[htmlBuilder] buildTocElement item failed",l,o)}})}catch(c){console.warn("[htmlBuilder] buildTocElement failed",c)}return s.appendChild(i),i.querySelectorAll("li").length<=1?null:s}function ai(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=he(n.textContent||""))})}function La(e,t,n){try{const s=e.querySelectorAll("img");if(s&&s.length){const r=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";s.forEach(i=>{const a=i.getAttribute("src")||"";if(a&&!(/^(https?:)?\/\//.test(a)||a.startsWith("/")))try{const c=new URL(r+a,n).toString();i.src=c;try{i.getAttribute("loading")||i.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] set image loading attribute failed",o)}}catch(c){console.warn("[htmlBuilder] resolve image src failed",c)}})}}catch(s){console.warn("[htmlBuilder] lazyLoadImages failed",s)}}function oi(e,t,n){try{const s=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let r=null;try{const a=new URL(n,location.href);r=new URL(s||".",a).toString()}catch{try{r=new URL(s||".",location.href).toString()}catch{r=s||"./"}}const i=e.querySelectorAll("*");for(const a of Array.from(i||[]))try{const c=a.tagName?a.tagName.toLowerCase():"",o=l=>{try{const u=a.getAttribute(l)||"";if(!u||/^(https?:)?\/\//i.test(u)||u.startsWith("/")||u.startsWith("#"))return;try{a.setAttribute(l,new URL(u,r).toString())}catch(f){console.warn("[htmlBuilder] rewrite asset attribute failed",l,u,f)}}catch(u){console.warn("[htmlBuilder] rewriteAttr failed",u)}};if(a.hasAttribute&&a.hasAttribute("src")&&o("src"),a.hasAttribute&&a.hasAttribute("href")&&c!=="a"&&o("href"),a.hasAttribute&&a.hasAttribute("xlink:href")&&o("xlink:href"),a.hasAttribute&&a.hasAttribute("poster")&&o("poster"),a.hasAttribute("srcset")){const f=(a.getAttribute("srcset")||"").split(",").map(g=>g.trim()).filter(Boolean).map(g=>{const[d,h]=g.split(/\s+/,2);if(!d||/^(https?:)?\/\//i.test(d)||d.startsWith("/"))return g;try{const p=new URL(d,r).toString();return h?`${p} ${h}`:p}catch{return g}}).join(", ");a.setAttribute("srcset",f)}}catch(c){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",c)}}catch(s){console.warn("[htmlBuilder] rewriteRelativeAssets failed",s)}}let li="",Hn=null,ci="";async function qn(e,t,n){try{const s=e.querySelectorAll("a");if(!s||!s.length)return;let r,i;if(t===li&&Hn)r=Hn,i=ci;else{try{r=new URL(t,location.href),i=At(r.pathname)}catch{try{r=new URL(t,location.href),i=At(r.pathname)}catch{r=null,i="/"}}li=t,Hn=r,ci=i}const a=new Set,c=[],o=new Set,l=[];for(const u of Array.from(s))try{const f=u.getAttribute("href")||"";if(!f||wr(f))continue;try{if(f.startsWith("?")||f.indexOf("?")!==-1)try{const d=new URL(f,t||location.href),h=d.searchParams.get("page");if(h&&h.indexOf("/")===-1&&n){const p=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(p){const m=ke(p+h);u.setAttribute("href",ye(m,d.hash?d.hash.replace(/^#/,""):null));continue}}}catch{}}catch{}if(f.startsWith("/")&&!f.endsWith(".md"))continue;const g=f.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(g){let d=g[1];const h=g[2];!d.startsWith("/")&&n&&(d=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+d);try{const p=new URL(d,t).pathname;let m=p.startsWith(i)?p.slice(i.length):p;m=ke(m),c.push({node:u,mdPathRaw:d,frag:h,rel:m}),F.has(m)||a.add(m)}catch(p){console.warn("[htmlBuilder] resolve mdPath failed",p)}continue}try{let d=f;!f.startsWith("/")&&n&&(f.startsWith("#")?d=n+f:d=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+f);const p=new URL(d,t).pathname||"";if(p&&p.indexOf(i)!==-1){let m=p.startsWith(i)?p.slice(i.length):p;if(m=ke(m),m=Et(m),m||(m="_home"),!m.endsWith(".md")){let b=null;try{if(F&&F.has&&F.has(m))b=F.get(m);else try{const y=String(m||"").replace(/^.*\//,"");y&&F.has&&F.has(y)&&(b=F.get(y))}catch(y){console.warn("[htmlBuilder] mdToSlug baseName check failed",y)}}catch(y){console.warn("[htmlBuilder] mdToSlug access check failed",y)}if(!b)try{const y=String(m||"").replace(/^.*\//,"");for(const[S,E]of J||[])if(E===m||E===y){b=S;break}}catch{}b?u.setAttribute("href",ye(b)):(o.add(m),l.push({node:u,rel:m}))}}}catch(d){console.warn("[htmlBuilder] resolving href to URL failed",d)}}catch(f){console.warn("[htmlBuilder] processing anchor failed",f)}a.size&&await Promise.all(Array.from(a).map(async u=>{try{try{const g=String(u).match(/([^\/]+)\.md$/),d=g&&g[1];if(d&&J.has(d)){try{const h=J.get(d);if(h)try{F.set(h,d)}catch(p){console.warn("[htmlBuilder] mdToSlug.set failed",p)}}catch(h){console.warn("[htmlBuilder] reading slugToMd failed",h)}return}}catch(g){console.warn("[htmlBuilder] basename slug lookup failed",g)}const f=await Te(u,t);if(f&&f.raw){const g=(f.raw||"").match(/^#\s+(.+)$/m);if(g&&g[1]){const d=he(g[1].trim());if(d)try{J.set(d,u),F.set(u,d)}catch(h){console.warn("[htmlBuilder] setting slug mapping failed",h)}}}}catch(f){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",f)}})),o.size&&await Promise.all(Array.from(o).map(async u=>{try{const f=await Te(u,t);if(f&&f.raw)try{const d=(jn||new DOMParser).parseFromString(f.raw,"text/html"),h=d.querySelector("title"),p=d.querySelector("h1"),m=h&&h.textContent&&h.textContent.trim()?h.textContent.trim():p&&p.textContent?p.textContent.trim():null;if(m){const b=he(m);if(b)try{J.set(b,u),F.set(u,b)}catch(y){console.warn("[htmlBuilder] setting html slug mapping failed",y)}}}catch(g){console.warn("[htmlBuilder] parse fetched HTML failed",g)}}catch(f){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",f)}}));for(const u of c){const{node:f,frag:g,rel:d}=u;let h=null;try{F.has(d)&&(h=F.get(d))}catch(p){console.warn("[htmlBuilder] mdToSlug access failed",p)}h?f.setAttribute("href",ye(h,g)):f.setAttribute("href",ye(d,g))}for(const u of l){const{node:f,rel:g}=u;let d=null;try{F.has(g)&&(d=F.get(g))}catch(h){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",h)}if(!d)try{const h=String(g||"").replace(/^.*\//,"");F.has(h)&&(d=F.get(h))}catch(h){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",h)}d?f.setAttribute("href",ye(d)):f.setAttribute("href",ye(g))}}catch(s){console.warn("[htmlBuilder] rewriteAnchors failed",s)}}function Ta(e,t,n,s){const r=t.querySelector("h1"),i=r?(r.textContent||"").trim():"";let a="";try{let c="";try{e&&e.meta&&e.meta.title&&(c=String(e.meta.title).trim())}catch{}if(!c&&i&&(c=i),!c)try{const o=t.querySelector("h2");o&&o.textContent&&(c=String(o.textContent).trim())}catch{}!c&&n&&(c=String(n)),c&&(a=he(c)),a||(a="_home");try{n&&(J.set(a,n),F.set(n,a))}catch(o){console.warn("[htmlBuilder] computeSlug set slug mapping failed",o)}try{const o=s||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");try{history.replaceState({page:a},"",ye(a,o))}catch(l){console.warn("[htmlBuilder] computeSlug history replace failed",l)}}catch(o){console.warn("[htmlBuilder] computeSlug inner failed",o)}}catch(c){console.warn("[htmlBuilder] computeSlug failed",c)}try{if(e&&e.meta&&e.meta.title&&r){const c=String(e.meta.title).trim();if(c&&c!==i){try{a&&(r.id=a)}catch{}try{if(Array.isArray(e.toc))for(const o of e.toc)try{if(o&&Number(o.level)===1&&String(o.text).trim()===(i||"").trim()){o.id=a;break}}catch{}}catch{}}}}catch{}return{topH1:r,h1Text:i,slugKey:a}}async function _a(e,t){if(!e||!e.length)return;const n=new Set;for(const o of Array.from(e||[]))try{const l=o.getAttribute("href")||"";if(!l)continue;let g=ke(l).split(/::|#/,2)[0];try{const h=g.indexOf("?");h!==-1&&(g=g.slice(0,h))}catch{}if(!g||(g.includes(".")||(g=g+".html"),!/\.html(?:$|[?#])/.test(g)&&!g.toLowerCase().endsWith(".html")))continue;const d=g;try{if(F&&F.has&&F.has(d))continue}catch(h){console.warn("[htmlBuilder] mdToSlug check failed",h)}try{let h=!1;for(const p of J.values())if(p===d){h=!0;break}if(h)continue}catch(h){console.warn("[htmlBuilder] slugToMd iteration failed",h)}n.add(d)}catch(l){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",l)}if(!n.size)return;const s=async o=>{try{const l=await Te(o,t);if(l&&l.raw)try{const f=(jn||new DOMParser).parseFromString(l.raw,"text/html"),g=f.querySelector("title"),d=f.querySelector("h1"),h=g&&g.textContent&&g.textContent.trim()?g.textContent.trim():d&&d.textContent?d.textContent.trim():null;if(h){const p=he(h);if(p)try{J.set(p,o),F.set(o,p)}catch(m){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",m)}}}catch(u){console.warn("[htmlBuilder] parse HTML title failed",u)}}catch(l){console.warn("[htmlBuilder] fetchAndExtract failed",l)}},r=5,i=Array.from(n);let a=0;const c=[];for(;a<i.length;){const o=i.slice(a,a+r);c.push(Promise.all(o.map(s))),a+=r}await Promise.all(c)}async function Ma(e,t){if(!e||!e.length)return;const n=[],s=new Set;let r="";try{const i=new URL(t,typeof location<"u"?location.href:"http://localhost/");r=At(i.pathname)}catch(i){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",i)}for(const i of Array.from(e||[]))try{const a=i.getAttribute("href")||"";if(!a)continue;const c=a.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(c){let o=ke(c[1]);try{let l;try{l=va(o,t)}catch(f){l=o,console.warn("[htmlBuilder] resolve mdPath URL failed",f)}const u=l&&r&&l.startsWith(r)?l.slice(r.length):String(l||"").replace(/^\//,"");n.push({rel:u}),F.has(u)||s.add(u)}catch(l){console.warn("[htmlBuilder] rewriteAnchors failed",l)}continue}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",a)}s.size&&await Promise.all(Array.from(s).map(async i=>{try{const a=String(i).match(/([^\/]+)\.md$/),c=a&&a[1];if(c&&J.has(c)){try{const o=J.get(c);o&&F.set(o,c)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",a)}try{const a=await Te(i,t);if(a&&a.raw){const c=(a.raw||"").match(/^#\s+(.+)$/m);if(c&&c[1]){const o=he(c[1].trim());if(o)try{J.set(o,i),F.set(i,o)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",l)}}}}catch(a){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",a)}}))}const jn=typeof DOMParser<"u"?new DOMParser:null;function Un(e){try{const n=(jn||new DOMParser).parseFromString(e||"","text/html");ai(n);try{n.querySelectorAll("img").forEach(o=>{try{o.getAttribute("loading")||o.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",l)}})}catch(c){console.warn("[htmlBuilder] parseHtml query images failed",c)}n.querySelectorAll("pre code, code[class]").forEach(c=>{try{const o=c.getAttribute&&c.getAttribute("class")||c.className||"",l=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const u=(l[1]||"").toLowerCase(),f=ne.size&&(ne.get(u)||ne.get(String(u).toLowerCase()))||u;try{(async()=>{try{await ht(f)}catch(g){console.warn("[htmlBuilder] registerLanguage failed",g)}})()}catch(g){console.warn("[htmlBuilder] schedule registerLanguage failed",g)}}else try{if(oe&&typeof oe.getLanguage=="function"&&oe.getLanguage("plaintext")){const u=oe.highlight?oe.highlight(c.textContent||"",{language:"plaintext"}):null;u&&u.value&&(c.innerHTML=u.value)}}catch(u){console.warn("[htmlBuilder] plaintext highlight fallback failed",u)}}catch(o){console.warn("[htmlBuilder] code element processing failed",o)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(c=>{r.push({level:Number(c.tagName.substring(1)),text:(c.textContent||"").trim(),id:c.id})});const a={};try{const c=n.querySelector("title");c&&c.textContent&&String(c.textContent).trim()&&(a.title=String(c.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:a,toc:r}}catch(t){return console.warn("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function Ca(e){const t=Dn?await Dn(e||"",ne):Ht(e||"",ne),n=new Set(t),s=[];for(const r of n)try{const i=ne.size&&(ne.get(r)||ne.get(String(r).toLowerCase()))||r;try{s.push(ht(i))}catch(a){console.warn("[htmlBuilder] ensureLanguages push canonical failed",a)}if(String(r)!==String(i))try{s.push(ht(r))}catch(a){console.warn("[htmlBuilder] ensureLanguages push alias failed",a)}}catch(i){console.warn("[htmlBuilder] ensureLanguages inner failed",i)}try{await Promise.all(s)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function Ra(e){if(await Ca(e),hn){const t=await hn(e||"");return!t||typeof t!="object"?{html:String(e||""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e||""),meta:{},toc:[]}}async function $a(e,t,n,s,r){let i=null;if(t.isHtml)try{const f=typeof DOMParser<"u"?new DOMParser:null;if(f){const g=f.parseFromString(t.raw||"","text/html");try{oi(g.body,n,r)}catch(d){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",d)}i=Un(g.documentElement&&g.documentElement.outerHTML?g.documentElement.outerHTML:t.raw||"")}else i=Un(t.raw||"")}catch{i=Un(t.raw||"")}else i=await Ra(t.raw||"");const a=document.createElement("article");a.className="nimbi-article content",a.innerHTML=i.html;try{oi(a,n,r)}catch(f){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",f)}try{ai(a)}catch(f){console.warn("[htmlBuilder] addHeadingIds failed",f)}try{a.querySelectorAll("pre code, code[class]").forEach(g=>{try{const d=g.getAttribute&&g.getAttribute("class")||g.className||"",h=String(d||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(h)try{g.setAttribute&&g.setAttribute("class",h)}catch(p){g.className=h,console.warn("[htmlBuilder] set element class failed",p)}else try{g.removeAttribute&&g.removeAttribute("class")}catch(p){g.className="",console.warn("[htmlBuilder] remove element class failed",p)}}catch(d){console.warn("[htmlBuilder] code element cleanup failed",d)}})}catch(f){console.warn("[htmlBuilder] processing code elements failed",f)}try{or(a)}catch(f){console.warn("[htmlBuilder] observeCodeBlocks failed",f)}La(a,n,r);try{(a.querySelectorAll&&a.querySelectorAll("img")||[]).forEach(g=>{try{const d=g.parentElement;if(!d||d.tagName.toLowerCase()!=="p"||d.childNodes.length!==1)return;const h=document.createElement("figure");h.className="image",d.replaceWith(h),h.appendChild(g)}catch{}})}catch(f){console.warn("[htmlBuilder] wrap images in Bulma image helper failed",f)}try{(a.querySelectorAll&&a.querySelectorAll("table")||[]).forEach(g=>{try{if(g.classList)g.classList.contains("table")||g.classList.add("table");else{const d=g.getAttribute&&g.getAttribute("class")?g.getAttribute("class"):"",h=String(d||"").split(/\s+/).filter(Boolean);h.indexOf("table")===-1&&h.push("table");try{g.setAttribute&&g.setAttribute("class",h.join(" "))}catch{g.className=h.join(" ")}}}catch{}})}catch(f){console.warn("[htmlBuilder] add Bulma table class failed",f)}const{topH1:c,h1Text:o,slugKey:l}=Ta(i,a,n,s);try{if(c&&i&&i.meta&&(i.meta.author||i.meta.date)&&!(c.parentElement&&c.parentElement.querySelector&&c.parentElement.querySelector(".nimbi-article-subtitle"))){const g=i.meta.author?String(i.meta.author).trim():"",d=i.meta.date?String(i.meta.date).trim():"";let h="";try{const m=new Date(d);d&&!isNaN(m.getTime())?h=m.toLocaleDateString():h=d}catch{h=d}const p=[];if(g&&p.push(g),h&&p.push(h),p.length){const m=document.createElement("p"),b=p[0]?String(p[0]).replace(/\"/g,"").trim():"",y=p.slice(1),S=[];b&&S.push(b),y.length&&S.push(y.join(" • ")),m.className="nimbi-article-subtitle is-6 has-text-grey-light",m.textContent=S.join(" • ");try{c.parentElement.insertBefore(m,c.nextSibling)}catch{try{c.insertAdjacentElement("afterend",m)}catch{}}}}}catch{}try{await Ba(a,r,n)}catch(f){Sa("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",f),await qn(a,r,n)}const u=Aa(e,i.toc,n);return{article:a,parsed:i,toc:u,topH1:c,h1Text:o,slugKey:l}}function Pa(e){if(!(!e||!e.querySelectorAll))try{const t=Array.from(e.querySelectorAll("script"));for(const n of t)try{const s=document.createElement("script");for(const i of Array.from(n.attributes||[]))try{s.setAttribute(i.name,i.value)}catch{}if(!n.src){const i=n.textContent||"";let a=!1;try{new Function(i)(),a=!0}catch{a=!1}if(a){n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed inline script via Function")}catch{}continue}try{s.type="module"}catch{}s.textContent=i}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";s.addEventListener("error",i=>{try{console.warn("[htmlBuilder] injected script error",{src:r,ev:i})}catch{}}),s.addEventListener("load",()=>{try{console.info("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(s)}catch{try{try{s.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(s)}catch(a){try{console.warn("[htmlBuilder] injected script append failed, skipping",{src:r,err:a})}catch{}}}n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed injected script",r)}catch{}}catch(s){console.warn("[htmlBuilder] execute injected script failed",s)}}catch{}}function ui(e,t,n){e&&(e.innerHTML="");const s=document.createElement("article");s.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=t&&t("notFound")||"Page not found";const i=document.createElement("p");i.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",s.appendChild(r),s.appendChild(i),e&&e.appendChild&&e.appendChild(s)}const hi=Gi(()=>{const e=vt(ya);if(e)try{if(!(typeof process<"u"&&process.env&&process.env.VITEST))return e}catch{return e}const t={message:[],error:[]};return{addEventListener(n,s){t[n]||(t[n]=[]),t[n].push(s)},removeEventListener(n,s){if(!t[n])return;const r=t[n].indexOf(s);r!==-1&&t[n].splice(r,1)},postMessage(n){setTimeout(async()=>{try{const r={data:await ka(n)};(t.message||[]).forEach(i=>i(r))}catch(s){const r={data:{id:n&&n.id,error:String(s)}};(t.message||[]).forEach(i=>i(r))}},0)},terminate(){Object.keys(t).forEach(n=>t[n].length=0)}}},"anchor");function za(){return hi.get()}function Ia(e){return hi.send(e,2e3)}async function Ba(e,t,n){if(!za())throw new Error("anchor worker unavailable");if(!e||typeof e.innerHTML!="string")throw new Error("invalid article element");const r=String(e.innerHTML),i=await Ia({type:"rewriteAnchors",html:r,contentBase:t,pagePath:n});if(i&&typeof i=="string")try{e.innerHTML=i}catch(a){console.warn("[htmlBuilder] applying rewritten anchors failed",a)}}function Na(e){try{e.addEventListener("click",t=>{const n=t.target&&t.target.closest?t.target.closest("a"):null;if(!n)return;const s=n.getAttribute("href")||"";try{const r=new URL(s,location.href),i=r.searchParams.get("page"),a=r.hash?r.hash.replace(/^#/,""):null;if(!i&&!a)return;t.preventDefault();let c=null;try{history&&history.state&&history.state.page&&(c=history.state.page)}catch(o){c=null,console.warn("[htmlBuilder] access history.state failed",o)}try{c||(c=new URL(location.href).searchParams.get("page"))}catch(o){console.warn("[htmlBuilder] parse current location failed",o)}if(!i&&a||i&&c&&String(i)===String(c)){try{if(!i&&a)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(a?"#"+encodeURIComponent(a):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:c||i},"",ye(c||i,a))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}}catch(o){console.warn("[htmlBuilder] update history for anchor failed",o)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(o){console.warn("[htmlBuilder] stopPropagation failed",o)}try{Wn(a)}catch(o){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:i},"",ye(i,a));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){console.warn("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.warn("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){console.warn("[htmlBuilder] renderByQuery failed",o)}}catch(o){console.warn("[htmlBuilder] SPA navigation invocation failed",o)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(t){console.warn("[htmlBuilder] attachTocClickHandler failed",t)}}function Wn(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const s=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const r=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] scrollIntoView failed",i)}}}catch{try{n.scrollIntoView()}catch(i){console.warn("[htmlBuilder] final scroll fallback failed",i)}}};try{requestAnimationFrame(()=>setTimeout(s,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(s,50)}}catch(s){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",s)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(s){console.warn("[htmlBuilder] window.scrollTo failed",s)}console.warn("[htmlBuilder] scroll to top failed",n)}}function Oa(e,t,{mountOverlay:n=null,container:s=null,mountEl:r=null,navWrap:i=null,t:a=null}={}){try{const c=a||(p=>typeof p=="string"?p:""),o=s||document.querySelector(".nimbi-cms"),l=r||document.querySelector(".nimbi-mount"),u=n||document.querySelector(".nimbi-overlay"),f=i||document.querySelector(".nimbi-nav-wrap");let d=document.querySelector(".nimbi-scroll-top");if(!d){d=document.createElement("button"),d.className="nimbi-scroll-top button is-primary is-rounded is-small",d.setAttribute("aria-label",c("scrollToTop")),d.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{u&&u.appendChild?u.appendChild(d):o&&o.appendChild?o.appendChild(d):l&&l.appendChild?l.appendChild(d):document.body.appendChild(d)}catch{try{document.body.appendChild(d)}catch(m){console.warn("[htmlBuilder] append scroll top button failed",m)}}try{try{hr(d)}catch{}}catch(p){console.warn("[htmlBuilder] set scroll-top button theme registration failed",p)}d.addEventListener("click",()=>{try{s&&s.scrollTo?s.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{s&&(s.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback container scrollTop failed",m)}try{r&&(r.scrollTop=0)}catch(m){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",m)}try{document.documentElement.scrollTop=0}catch(m){console.warn("[htmlBuilder] fallback document scrollTop failed",m)}}})}const h=f&&f.querySelector?f.querySelector(".menu-label"):null;if(t){if(!d._nimbiObserver){const p=new IntersectionObserver(m=>{for(const b of m)b.target instanceof Element&&(b.isIntersecting?(d.classList.remove("show"),h&&h.classList.remove("show")):(d.classList.add("show"),h&&h.classList.add("show")))},{root:s instanceof Element?s:r instanceof Element?r:null,threshold:0});d._nimbiObserver=p}try{d._nimbiObserver.disconnect()}catch(p){console.warn("[htmlBuilder] observer disconnect failed",p)}try{d._nimbiObserver.observe(t)}catch(p){console.warn("[htmlBuilder] observer observe failed",p)}try{const p=()=>{try{const m=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},b=t.getBoundingClientRect();!(b.bottom<m.top||b.top>m.bottom)?(d.classList.remove("show"),h&&h.classList.remove("show")):(d.classList.add("show"),h&&h.classList.add("show"))}catch(m){console.warn("[htmlBuilder] checkIntersect failed",m)}};p(),"IntersectionObserver"in window||setTimeout(p,100)}catch(p){console.warn("[htmlBuilder] checkIntersect outer failed",p)}}else{d.classList.remove("show"),h&&h.classList.remove("show");const p=s instanceof Element?s:r instanceof Element?r:window,m=()=>{try{(p===window?window.scrollY:p.scrollTop||0)>10?(d.classList.add("show"),h&&h.classList.add("show")):(d.classList.remove("show"),h&&h.classList.remove("show"))}catch(b){console.warn("[htmlBuilder] onScroll handler failed",b)}};Kt(()=>p.addEventListener("scroll",m)),m()}}catch(c){console.warn("[htmlBuilder] ensureScrollTopButton failed",c)}}function di(e,t){try{if(!e)return;try{const n=e[t];if(typeof n<"u")return n}catch{}try{if(e.default)return e.default[t]}catch{}return}catch{return}}async function Da(e,t,n,s,r,i,a,c,o="eager",l=1,u=void 0,f="favicon"){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const g=typeof DOMParser<"u"?new DOMParser:null,d=g?g.parseFromString(n||"","text/html"):null,h=d?d.querySelectorAll("a"):[];await Kt(()=>_a(h,s)),await Kt(()=>Ma(h,s));let p=null,m=null,b=null,y=null,S=null,E=null;function M(){try{const L=document.querySelector(".navbar-burger"),T=L&&L.dataset?L.dataset.target:null,$=T?document.getElementById(T):null;L&&L.classList.contains("is-active")&&(L.classList.remove("is-active"),L.setAttribute("aria-expanded","false"),$&&$.classList.remove("is-active"))}catch(L){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",L)}}async function B(){const L=typeof document<"u"?document.querySelector(".nimbi-content"):null;try{L&&L.classList.add("is-inactive")}catch{}try{const T=a&&a();T&&typeof T.then=="function"&&await T}catch(T){try{console.warn&&console.warn("[nimbi-cms] renderByQuery failed",T)}catch{}}finally{try{if(typeof requestAnimationFrame=="function")requestAnimationFrame(()=>{try{L&&L.classList.remove("is-inactive")}catch{}});else try{L&&L.classList.remove("is-inactive")}catch{}}catch{try{L&&L.classList.remove("is-inactive")}catch{}}}}const j=()=>p||(p=(async()=>{try{const L=await Promise.resolve().then(()=>mt),T=di(L,"buildSearchIndex")||(typeof globalThis<"u"?globalThis.buildSearchIndex:void 0),$=di(L,"buildSearchIndexWorker")||(typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0);if(o==="lazy"&&typeof $=="function")try{const I=await $(s,l,u);if(I&&I.length)return I}catch(I){console.warn&&console.warn("[nimbi-cms] worker builder threw",I)}return typeof T=="function"?await T(s,l,u):[]}catch(L){return console.warn("[nimbi-cms] buildSearchIndex failed",L),[]}finally{if(m){try{m.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}}})(),p.then(L=>{try{const T=String(m&&m.value||"").trim().toLowerCase();if(!T||!Array.isArray(L)||!L.length)return;const $=L.filter(k=>k.title&&k.title.toLowerCase().includes(T)||k.excerpt&&k.excerpt.toLowerCase().includes(T));if(!$||!$.length)return;const I=document.getElementById("nimbi-search-results");if(!I)return;I.innerHTML="";try{const k=document.createElement("div");k.className="panel nimbi-search-panel",$.slice(0,10).forEach(P=>{try{if(P.parentTitle){const de=document.createElement("p");de.className="panel-heading nimbi-search-title nimbi-search-parent",de.textContent=P.parentTitle,k.appendChild(de)}const O=document.createElement("a");O.className="panel-block nimbi-search-result",O.href=ye(P.slug),O.setAttribute("role","button");try{if(P.path&&typeof P.slug=="string"){try{J.set(P.slug,P.path)}catch{}try{F.set(P.path,P.slug)}catch{}}}catch{}const ie=document.createElement("div");ie.className="is-size-6 has-text-weight-semibold",ie.textContent=P.title,O.appendChild(ie),O.addEventListener("click",()=>{try{I.style.display="none"}catch{}}),k.appendChild(O)}catch{}}),I.appendChild(k);try{I.style.display="block"}catch{}}catch{}}catch{}}).catch(()=>{}),p),R=document.createElement("nav");R.className="navbar",R.setAttribute("role","navigation"),R.setAttribute("aria-label","main navigation");const Q=document.createElement("div");Q.className="navbar-brand";const le=h[0],A=document.createElement("a");if(A.className="navbar-item",le){const L=le.getAttribute("href")||"#";try{const $=new URL(L,location.href).searchParams.get("page");if($){const I=decodeURIComponent($);A.href=ye(I)}else A.href=ye(r),A.textContent=i("home")}catch{A.href=ye(r),A.textContent=i("home")}}else A.href=ye(r),A.textContent=i("home");async function U(L){try{if(!L||L==="none")return null;if(L==="favicon")try{const T=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!T)return null;const $=T.getAttribute("href")||"";return $&&/\.png(?:\?|$)/i.test($)?new URL($,location.href).toString():null}catch{return null}if(L==="copy-first"||L==="move-first")try{const T=await Te(r,s);if(!T||!T.raw)return null;const k=new DOMParser().parseFromString(T.raw,"text/html").querySelector("img");if(!k)return null;const P=k.getAttribute("src")||"";if(!P)return null;const O=new URL(P,location.href).toString();if(L==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",O)}catch{}return O}catch{return null}try{return new URL(L,location.href).toString()}catch{return null}}catch{return null}}let X=null;try{X=await U(f)}catch{X=null}if(X)try{const L=document.createElement("img");L.className="nimbi-navbar-logo";const T=i&&typeof i=="function"&&(i("home")||i("siteLogo"))||"";L.alt=T,L.title=T,L.src=X;try{L.style.marginRight="0.5em"}catch{}try{(!A.textContent||!String(A.textContent).trim())&&(A.textContent=T)}catch{}try{A.insertBefore(L,A.firstChild)}catch{try{A.appendChild(L)}catch{}}}catch{}Q.appendChild(A),A.addEventListener("click",function(L){const T=A.getAttribute("href")||"";if(T.startsWith("?page=")){L.preventDefault();const $=new URL(T,location.href),I=$.searchParams.get("page"),k=$.hash?$.hash.replace(/^#/,""):null;history.pushState({page:I},"",ye(I,k)),B();try{M()}catch{}}});const q=document.createElement("a");q.className="navbar-burger",q.setAttribute("role","button"),q.setAttribute("aria-label","menu"),q.setAttribute("aria-expanded","false");const G="nimbi-navbar-menu";q.dataset.target=G,q.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',Q.appendChild(q);try{q.addEventListener("click",L=>{try{const T=q.dataset&&q.dataset.target?q.dataset.target:null,$=T?document.getElementById(T):null;q.classList.contains("is-active")?(q.classList.remove("is-active"),q.setAttribute("aria-expanded","false"),$&&$.classList.remove("is-active")):(q.classList.add("is-active"),q.setAttribute("aria-expanded","true"),$&&$.classList.add("is-active"))}catch(T){console.warn("[nimbi-cms] navbar burger toggle failed",T)}})}catch(L){console.warn("[nimbi-cms] burger event binding failed",L)}const v=document.createElement("div");v.className="navbar-menu",v.id=G;const ue=document.createElement("div");ue.className="navbar-start";let ee=null,ce=null;if(!c)ee=null,m=null,y=null,S=null,E=null;else{ee=document.createElement("div"),ee.className="navbar-end",ce=document.createElement("div"),ce.className="navbar-item",m=document.createElement("input"),m.className="input",m.type="search",m.placeholder=i("searchPlaceholder")||"",m.id="nimbi-search",o==="eager"&&(m.disabled=!0),b=document.createElement("div"),b.className="control",o==="eager"&&b.classList.add("is-loading"),b.appendChild(m),ce.appendChild(b),y=document.createElement("div"),y.className="dropdown is-right",y.id="nimbi-search-dropdown";const L=document.createElement("div");L.className="dropdown-trigger",L.appendChild(ce);const T=document.createElement("div");T.className="dropdown-menu",T.setAttribute("role","menu"),S=document.createElement("div"),S.id="nimbi-search-results",S.className="dropdown-content nimbi-search-results",E=S,T.appendChild(S),y.appendChild(L),y.appendChild(T),ee.appendChild(y);const $=k=>{if(S){if(S.innerHTML="",!k.length){y&&y.classList.remove("is-active");try{S.style.display="none"}catch{}try{S.classList.remove("is-open")}catch{}return}try{const P=document.createElement("div");P.className="panel nimbi-search-panel",k.forEach(O=>{if(O.parentTitle){const pe=document.createElement("p");pe.textContent=O.parentTitle,pe.className="panel-heading nimbi-search-title nimbi-search-parent",P.appendChild(pe)}const ie=document.createElement("a");ie.className="panel-block nimbi-search-result",ie.href=ye(O.slug),ie.setAttribute("role","button");try{if(O.path&&typeof O.slug=="string"){try{J.set(O.slug,O.path)}catch{}try{F.set(O.path,O.slug)}catch{}}}catch{}const de=document.createElement("div");de.className="is-size-6 has-text-weight-semibold",de.textContent=O.title,ie.appendChild(de),ie.addEventListener("click",()=>{y&&y.classList.remove("is-active");try{S.style.display="none"}catch{}try{S.classList.remove("is-open")}catch{}}),P.appendChild(ie)}),S.appendChild(P)}catch{}y&&y.classList.add("is-active");try{S.style.display="block"}catch{}try{S.classList.add("is-open")}catch{}}},I=(k,P)=>{let O=null;return(...ie)=>{O&&clearTimeout(O),O=setTimeout(()=>k(...ie),P)}};if(m){const k=I(async()=>{const P=document.querySelector("input#nimbi-search"),O=String(P&&P.value||"").trim().toLowerCase();if(!O){$([]);return}try{await j();const de=(await p).filter(pe=>pe.title&&pe.title.toLowerCase().includes(O)||pe.excerpt&&pe.excerpt.toLowerCase().includes(O));$(de.slice(0,10))}catch(ie){console.warn("[nimbi-cms] search input handler failed",ie),$([])}},50);try{m.addEventListener("input",k)}catch{}try{document.addEventListener("input",P=>{try{P&&P.target&&P.target.id==="nimbi-search"&&k(P)}catch{}},!0)}catch{}}if(o==="eager"){try{p=j()}catch(k){console.warn("[nimbi-cms] eager search index init failed",k),p=Promise.resolve([])}p.finally(()=>{const k=document.querySelector("input#nimbi-search");if(k){try{k.removeAttribute("disabled")}catch{}try{b&&b.classList.remove("is-loading")}catch{}}})}try{const k=P=>{try{const O=P&&P.target;if(!E||!E.classList.contains("is-open")&&E.style&&E.style.display!=="block"||O&&(E.contains(O)||m&&(O===m||m.contains&&m.contains(O))))return;y&&y.classList.remove("is-active");try{E.style.display="none"}catch{}try{E.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",k,!0),document.addEventListener("touchstart",k,!0)}catch{}}for(let L=0;L<h.length;L++){const T=h[L];if(L===0)continue;const $=T.getAttribute("href")||"#",I=document.createElement("a");I.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test($)||$.endsWith(".md")){const P=ke($).split(/::|#/,2),O=P[0],ie=P[1];I.href=ye(O,ie)}else if(/\.html(?:$|[#?])/.test($)||$.endsWith(".html")){const P=ke($).split(/::|#/,2);let O=P[0];O&&!O.toLowerCase().endsWith(".html")&&(O=O+".html");const ie=P[1];try{const de=await Te(O,s);if(de&&de.raw)try{const xe=new DOMParser().parseFromString(de.raw,"text/html"),ge=xe.querySelector("title"),qe=xe.querySelector("h1"),bt=ge&&ge.textContent&&ge.textContent.trim()?ge.textContent.trim():qe&&qe.textContent?qe.textContent.trim():null;if(bt){const yt=he(bt);if(yt){try{J.set(yt,O),F.set(O,yt)}catch(Xn){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Xn)}I.href=ye(yt,ie)}else I.href=ye(O,ie)}else I.href=ye(O,ie)}catch{I.href=ye(O,ie)}else I.href=$}catch{I.href=$}}else I.href=$}catch(k){console.warn("[nimbi-cms] nav item href parse failed",k),I.href=$}try{const k=T.textContent&&String(T.textContent).trim()?String(T.textContent).trim():null;if(k)try{const P=he(k);if(P){const O=I.getAttribute&&I.getAttribute("href")?I.getAttribute("href"):"";try{const de=new URL(O,location.href).searchParams.get("page");if(de){const pe=decodeURIComponent(de);try{J.set(P,pe),F.set(pe,P)}catch(xe){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",xe)}}}catch(ie){console.warn("[nimbi-cms] nav slug mapping failed",ie)}}}catch(P){console.warn("[nimbi-cms] nav slug mapping failed",P)}}catch(k){console.warn("[nimbi-cms] nav slug mapping failed",k)}I.textContent=T.textContent||$,ue.appendChild(I)}v.appendChild(ue),ee&&v.appendChild(ee),R.appendChild(Q),R.appendChild(v),e.appendChild(R);try{const L=T=>{try{const $=R&&R.querySelector?R.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!$||!$.classList.contains("is-active"))return;const I=$&&$.closest?$.closest(".navbar"):R;if(I&&I.contains(T.target))return;M()}catch{}};document.addEventListener("click",L,!0),document.addEventListener("touchstart",L,!0)}catch{}try{v.addEventListener("click",L=>{const T=L.target&&L.target.closest?L.target.closest("a"):null;if(!T)return;const $=T.getAttribute("href")||"";try{const I=new URL($,location.href),k=I.searchParams.get("page"),P=I.hash?I.hash.replace(/^#/,""):null;k&&(L.preventDefault(),history.pushState({page:k},"",ye(k,P)),B())}catch(I){console.warn("[nimbi-cms] navbar click handler failed",I)}try{const I=R&&R.querySelector?R.querySelector(".navbar-burger"):null,k=I&&I.dataset?I.dataset.target:null,P=k?document.getElementById(k):null;I&&I.classList.contains("is-active")&&(I.classList.remove("is-active"),I.setAttribute("aria-expanded","false"),P&&P.classList.remove("is-active"))}catch(I){console.warn("[nimbi-cms] mobile menu close failed",I)}})}catch(L){console.warn("[nimbi-cms] attach content click handler failed",L)}try{t.addEventListener("click",L=>{const T=L.target&&L.target.closest?L.target.closest("a"):null;if(!T)return;const $=T.getAttribute("href")||"";if($&&!wr($))try{const I=new URL($,location.href),k=I.searchParams.get("page"),P=I.hash?I.hash.replace(/^#/,""):null;k&&(L.preventDefault(),history.pushState({page:k},"",ye(k,P)),B())}catch(I){console.warn("[nimbi-cms] container click URL parse failed",I)}})}catch(L){console.warn("[nimbi-cms] build navbar failed",L)}return{navbar:R,linkEls:h}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.style.display="block"}catch{}}}catch{}},!0)}catch{}var Fn,fi;function Ha(){if(fi)return Fn;fi=1;function e(i,a){return a.some(([c,o])=>c<=i&&i<=o)}function t(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return e(a,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(i){return` 
\r	`.includes(i)}function s(i){if(typeof i!="string")return!1;const a=i.charCodeAt(0);return e(a,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(i,a={}){let c=0,o=0,l=i.length-1;const u=a.wordsPerMinute||200,f=a.wordBound||n;for(;f(i[o]);)o++;for(;f(i[l]);)l--;const g=`${i}
`;for(let m=o;m<=l;m++)if((t(g[m])||!f(g[m])&&(f(g[m+1])||t(g[m+1])))&&c++,t(g[m]))for(;m<=l&&(s(g[m+1])||f(g[m+1]));)m++;const d=c/u,h=Math.round(d*60*1e3);return{text:Math.ceil(d.toFixed(2))+" min read",minutes:d,time:h,words:c}}return Fn=r,Fn}var qa=Ha();const ja=sr(qa);function pi(e,t){let n=document.querySelector(`meta[name="${e}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",e),document.head.appendChild(n)),n.setAttribute("content",t)}function lt(e,t,n){let s=`meta[${e}="${t}"]`,r=document.querySelector(s);r||(r=document.createElement("meta"),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute("content",n)}function Ua(e,t){try{let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",e),document.head.appendChild(n)),n.setAttribute("href",t)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function Wa(e,t,n,s){const r=t&&String(t).trim()?t:e.title||document.title;lt("property","og:title",r);const i=s&&String(s).trim()?s:e.description||"";i&&String(i).trim()&&lt("property","og:description",i),i&&String(i).trim()&&lt("name","twitter:description",i),lt("name","twitter:card",e.twitter_card||"summary_large_image");const a=n||e.image;a&&(lt("property","og:image",a),lt("name","twitter:image",a))}function Fa(e,t,n,s,r=""){const i=e.meta||{},a=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",c=s&&String(s).trim()?s:i.description&&String(i.description).trim()?i.description:a&&String(a).trim()?a:"";c&&String(c).trim()&&pi("description",c),pi("robots",i.robots||"index,follow"),Wa(i,t,n,c)}function Za(){try{const e=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const t of e){const n=document.querySelector(t);if(n){const s=n.getAttribute("content")||"";if(s&&s.trim())return s.trim()}}}catch(e){console.warn("[seoManager] getSiteNameFromMeta failed",e)}return""}function Ga(e,t,n,s,r,i=""){try{const a=e.meta||{},c=n&&String(n).trim()?n:a.title||i||document.title,o=r&&String(r).trim()?r:a.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",l=s||a.image||null;let u="";try{if(t){const h=ke(t);try{u=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(h)}catch{u=location.href.split("#")[0]}}else u=location.href.split("#")[0]}catch(h){u=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",h)}u&&Ua("canonical",u);try{lt("property","og:url",u)}catch(h){console.warn("[seoManager] upsertMeta og:url failed",h)}const f={"@context":"https://schema.org","@type":"Article",headline:c||"",description:o||"",url:u||location.href.split("#")[0]};l&&(f.image=String(l)),a.date&&(f.datePublished=a.date),a.dateModified&&(f.dateModified=a.dateModified);const g="nimbi-jsonld";let d=document.getElementById(g);d||(d=document.createElement("script"),d.type="application/ld+json",d.id=g,document.head.appendChild(d)),d.textContent=JSON.stringify(f,null,2)}catch(a){console.warn("[seoManager] setStructuredData failed",a)}}function Qa(e,t,n,s,r,i,a,c,o,l,u){try{if(s&&s.querySelector){const f=s.querySelector(".menu-label");f&&(f.textContent=c&&c.textContent||e("onThisPage"))}}catch(f){console.warn("[seoManager] update toc label failed",f)}try{const f=n.meta&&n.meta.title?String(n.meta.title).trim():"",g=r.querySelector("img"),d=g&&(g.getAttribute("src")||g.src)||null;let h="";try{let b="";try{const y=c||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let S=y.nextElementSibling;const E=[];for(;S&&!(S.tagName&&S.tagName.toLowerCase()==="h2");){try{if(S.classList&&S.classList.contains("nimbi-article-subtitle")){S=S.nextElementSibling;continue}}catch{}const M=(S.textContent||"").trim();M&&E.push(M),S=S.nextElementSibling}E.length&&(b=E.join(" ").replace(/\s+/g," ").trim()),!b&&o&&(b=String(o).trim())}}catch(y){console.warn("[seoManager] compute descOverride failed",y)}b&&String(b).length>160&&(b=String(b).slice(0,157).trim()+"..."),h=b}catch(b){console.warn("[seoManager] compute descOverride failed",b)}let p="";try{f&&(p=f)}catch{}if(!p)try{c&&c.textContent&&(p=String(c.textContent).trim())}catch{}if(!p)try{const b=r.querySelector("h2");b&&b.textContent&&(p=String(b.textContent).trim())}catch{}p||(p=i||"");try{Fa(n,p||void 0,d,h)}catch(b){console.warn("[seoManager] setMetaTags failed",b)}try{Ga(n,l,p||void 0,d,h,t)}catch(b){console.warn("[seoManager] setStructuredData failed",b)}const m=Za();p?m?document.title=`${m} - ${p}`:document.title=`${t||"Site"} - ${p}`:f?document.title=f:document.title=t||document.title}catch(f){console.warn("[seoManager] applyPageMeta failed",f)}try{try{const f=r.querySelectorAll(".nimbi-reading-time");f&&f.forEach(g=>g.remove())}catch{}if(o){const f=ja(u.raw||""),g=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,d=g?e("readingTime",{minutes:g}):"";if(!d)return;const h=r.querySelector("h1");if(h){const p=r.querySelector(".nimbi-article-subtitle");try{if(p){const m=document.createElement("span");m.className="nimbi-reading-time",m.textContent=" • "+d,p.appendChild(m)}else{const m=document.createElement("p");m.className="nimbi-article-subtitle is-6 has-text-grey-light";const b=document.createElement("span");b.className="nimbi-reading-time",b.textContent=d,m.appendChild(b);try{h.parentElement.insertBefore(m,h.nextSibling)}catch{try{h.insertAdjacentElement("afterend",m)}catch{}}}}catch{try{const b=document.createElement("p");b.className="nimbi-article-subtitle is-6 has-text-grey-light";const y=document.createElement("span");y.className="nimbi-reading-time",y.textContent=d,b.appendChild(y),h.insertAdjacentElement("afterend",b)}catch{}}}}}catch(f){console.warn("[seoManager] reading time update failed",f)}}let Re=null,Z=null,Ae=1,nt=(e,t)=>t,qt=0,jt=0,dn=()=>{},Ut=.25;function Xa(){if(Re&&document.contains(Re))return Re;Re=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",nt("imagePreviewTitle","Image preview")),e.innerHTML=`
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
  `,e.addEventListener("click",v=>{v.target===e&&Zn()}),e.addEventListener("wheel",v=>{if(!le())return;v.preventDefault();const ue=v.deltaY<0?Ut:-Ut;Ke(Ae+ue),l(),u()},{passive:!1}),e.addEventListener("keydown",v=>{if(v.key==="Escape"){Zn();return}if(Ae>1){const ue=e.querySelector(".nimbi-image-preview__image-wrapper");if(!ue)return;const ee=40;switch(v.key){case"ArrowUp":ue.scrollTop-=ee,v.preventDefault();break;case"ArrowDown":ue.scrollTop+=ee,v.preventDefault();break;case"ArrowLeft":ue.scrollLeft-=ee,v.preventDefault();break;case"ArrowRight":ue.scrollLeft+=ee,v.preventDefault();break}}}),document.body.appendChild(e),Re=e,Z=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),s=e.querySelector("[data-nimbi-preview-zoom-in]"),r=e.querySelector("[data-nimbi-preview-zoom-out]"),i=e.querySelector("[data-nimbi-preview-reset]"),a=e.querySelector("[data-nimbi-preview-close]"),c=e.querySelector("[data-nimbi-preview-zoom-label]"),o=e.querySelector("[data-nimbi-preview-zoom-hud]");function l(){c&&(c.textContent=`${Math.round(Ae*100)}%`)}const u=()=>{o&&(o.textContent=`${Math.round(Ae*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};dn=l,s.addEventListener("click",()=>{Ke(Ae+Ut),l(),u()}),r.addEventListener("click",()=>{Ke(Ae-Ut),l(),u()}),t.addEventListener("click",()=>{Wt(),l(),u()}),n.addEventListener("click",()=>{Ke(1),l(),u()}),i.addEventListener("click",()=>{Wt(),l(),u()}),a.addEventListener("click",Zn),t.title=nt("imagePreviewFit","Fit to screen"),n.title=nt("imagePreviewOriginal","Original size"),r.title=nt("imagePreviewZoomOut","Zoom out"),s.title=nt("imagePreviewZoomIn","Zoom in"),a.title=nt("imagePreviewClose","Close"),a.setAttribute("aria-label",nt("imagePreviewClose","Close"));let f=!1,g=0,d=0,h=0,p=0;const m=new Map;let b=0,y=1;const S=(v,ue)=>{const ee=v.x-ue.x,ce=v.y-ue.y;return Math.hypot(ee,ce)},E=()=>{f=!1,m.clear(),b=0,Z&&(Z.classList.add("is-panning"),Z.classList.remove("is-grabbing"))};let M=0,B=0,j=0;const R=v=>{const ue=Date.now(),ee=ue-M,ce=v.clientX-B,L=v.clientY-j;M=ue,B=v.clientX,j=v.clientY,ee<300&&Math.hypot(ce,L)<30&&(Ke(Ae>1?1:2),l(),v.preventDefault())},Q=v=>{Ke(Ae>1?1:2),l(),v.preventDefault()},le=()=>Re?typeof Re.open=="boolean"?Re.open:Re.classList.contains("is-active"):!1,A=(v,ue,ee=1)=>{if(m.has(ee)&&m.set(ee,{x:v,y:ue}),m.size===2){const $=Array.from(m.values()),I=S($[0],$[1]);if(b>0){const k=I/b;Ke(y*k)}return}if(!f)return;const ce=Z.closest(".nimbi-image-preview__image-wrapper");if(!ce)return;const L=v-g,T=ue-d;ce.scrollLeft=h-L,ce.scrollTop=p-T},U=(v,ue,ee=1)=>{if(!le())return;if(m.set(ee,{x:v,y:ue}),m.size===2){const T=Array.from(m.values());b=S(T[0],T[1]),y=Ae;return}const ce=Z.closest(".nimbi-image-preview__image-wrapper");!ce||!(ce.scrollWidth>ce.clientWidth||ce.scrollHeight>ce.clientHeight)||(f=!0,g=v,d=ue,h=ce.scrollLeft,p=ce.scrollTop,Z.classList.add("is-panning"),Z.classList.remove("is-grabbing"),window.addEventListener("pointermove",X),window.addEventListener("pointerup",q),window.addEventListener("pointercancel",q))},X=v=>{f&&(v.preventDefault(),A(v.clientX,v.clientY,v.pointerId))},q=()=>{E(),window.removeEventListener("pointermove",X),window.removeEventListener("pointerup",q),window.removeEventListener("pointercancel",q)};Z.addEventListener("pointerdown",v=>{v.preventDefault(),U(v.clientX,v.clientY,v.pointerId)}),Z.addEventListener("pointermove",v=>{(f||m.size===2)&&v.preventDefault(),A(v.clientX,v.clientY,v.pointerId)}),Z.addEventListener("pointerup",v=>{v.preventDefault(),v.pointerType==="touch"&&R(v),E()}),Z.addEventListener("dblclick",Q),Z.addEventListener("pointercancel",E),Z.addEventListener("mousedown",v=>{v.preventDefault(),U(v.clientX,v.clientY,1)}),Z.addEventListener("mousemove",v=>{f&&v.preventDefault(),A(v.clientX,v.clientY,1)}),Z.addEventListener("mouseup",v=>{v.preventDefault(),E()});const G=e.querySelector(".nimbi-image-preview__image-wrapper");return G&&(G.addEventListener("pointerdown",v=>{if(U(v.clientX,v.clientY,v.pointerId),v&&v.target&&v.target.tagName==="IMG")try{v.target.classList.add("is-grabbing")}catch{}}),G.addEventListener("pointermove",v=>{A(v.clientX,v.clientY,v.pointerId)}),G.addEventListener("pointerup",E),G.addEventListener("pointercancel",E),G.addEventListener("mousedown",v=>{if(U(v.clientX,v.clientY,1),v&&v.target&&v.target.tagName==="IMG")try{v.target.classList.add("is-grabbing")}catch{}}),G.addEventListener("mousemove",v=>{A(v.clientX,v.clientY,1)}),G.addEventListener("mouseup",E)),e}function Ke(e){if(!Z)return;const t=Number(e);Ae=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const s=Z.getBoundingClientRect(),r=qt||Z.naturalWidth||Z.width||s.width||0,i=jt||Z.naturalHeight||Z.height||s.height||0;if(r&&i){Z.style.setProperty("--nimbi-preview-img-max-width","none"),Z.style.setProperty("--nimbi-preview-img-max-height","none"),Z.style.setProperty("--nimbi-preview-img-width",`${r*Ae}px`),Z.style.setProperty("--nimbi-preview-img-height",`${i*Ae}px`),Z.style.setProperty("--nimbi-preview-img-transform","none");try{Z.style.width=`${r*Ae}px`,Z.style.height=`${i*Ae}px`,Z.style.transform="none"}catch{}}else{Z.style.setProperty("--nimbi-preview-img-max-width",""),Z.style.setProperty("--nimbi-preview-img-max-height",""),Z.style.setProperty("--nimbi-preview-img-width",""),Z.style.setProperty("--nimbi-preview-img-height",""),Z.style.setProperty("--nimbi-preview-img-transform",`scale(${Ae})`);try{Z.style.transform=`scale(${Ae})`}catch{}}Z&&(Z.classList.add("is-panning"),Z.classList.remove("is-grabbing"))}function Wt(){if(!Z)return;const e=Z.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=qt||Z.naturalWidth||t.width,s=jt||Z.naturalHeight||t.height;if(!n||!s)return;const r=t.width/n,i=t.height/s,a=Math.min(r,i,1);Ke(Number.isFinite(a)?a:1)}function Ka(e,t="",n=0,s=0){const r=Xa();Ae=1,qt=n||0,jt=s||0,Z.src=e,Z.alt=t,Z.style.transform="scale(1)";const i=()=>{qt=Z.naturalWidth||Z.width||0,jt=Z.naturalHeight||Z.height||0};if(i(),Wt(),dn(),requestAnimationFrame(()=>{Wt(),dn()}),!qt||!jt){const a=()=>{i(),requestAnimationFrame(()=>{Wt(),dn()}),Z.removeEventListener("load",a)};Z.addEventListener("load",a)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function Zn(){if(Re){typeof Re.close=="function"&&Re.open&&Re.close(),Re.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function Ya(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;nt=(d,h)=>(typeof t=="function"?t(d):void 0)||h,Ut=n,e.addEventListener("click",d=>{const h=d.target;if(!h||h.tagName!=="IMG")return;const p=h;if(!p.src)return;const m=p.closest("a");m&&m.getAttribute("href")||Ka(p.src,p.alt||"",p.naturalWidth||0,p.naturalHeight||0)});let s=!1,r=0,i=0,a=0,c=0;const o=new Map;let l=0,u=1;const f=(d,h)=>{const p=d.x-h.x,m=d.y-h.y;return Math.hypot(p,m)};e.addEventListener("pointerdown",d=>{const h=d.target;if(!h||h.tagName!=="IMG")return;const p=h.closest("a");if(p&&p.getAttribute("href")||!Re||!Re.open)return;if(o.set(d.pointerId,{x:d.clientX,y:d.clientY}),o.size===2){const b=Array.from(o.values());l=f(b[0],b[1]),u=Ae;return}const m=h.closest(".nimbi-image-preview__image-wrapper");if(m&&!(Ae<=1)){d.preventDefault(),s=!0,r=d.clientX,i=d.clientY,a=m.scrollLeft,c=m.scrollTop,h.setPointerCapture(d.pointerId);try{h.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",d=>{if(o.has(d.pointerId)&&o.set(d.pointerId,{x:d.clientX,y:d.clientY}),o.size===2){d.preventDefault();const S=Array.from(o.values()),E=f(S[0],S[1]);if(l>0){const M=E/l;Ke(u*M)}return}if(!s)return;d.preventDefault();const h=d.target,p=h.closest&&h.closest("a");if(p&&p.getAttribute&&p.getAttribute("href"))return;const m=h.closest(".nimbi-image-preview__image-wrapper");if(!m)return;const b=d.clientX-r,y=d.clientY-i;m.scrollLeft=a-b,m.scrollTop=c-y});const g=()=>{s=!1,o.clear(),l=0;try{const d=document.querySelector("[data-nimbi-preview-image]");d&&(d.classList.add("is-panning"),d.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",g),e.addEventListener("pointercancel",g)}function Va(e){const{contentWrap:t,navWrap:n,container:s,mountOverlay:r=null,t:i,contentBase:a,homePage:c,initialDocumentTitle:o,runHooks:l}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let u=null;const f=Ea(i,[{path:c,name:i("home"),isIndex:!0,children:[]}]);async function g(b,y){let S,E,M;try{({data:S,pagePath:E,anchor:M}=await ms(b,a))}catch(U){console.error("[nimbi-cms] fetchPageData failed",U),ui(t,i,U);return}!M&&y&&(M=y);try{Wn(null)}catch(U){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",U)}t.innerHTML="";const{article:B,parsed:j,toc:R,topH1:Q,h1Text:le,slugKey:A}=await $a(i,S,E,M,a);Qa(i,o,j,R,B,E,M,Q,le,A,S),n.innerHTML="",R&&(n.appendChild(R),Na(R));try{await l("transformHtml",{article:B,parsed:j,toc:R,pagePath:E,anchor:M,topH1:Q,h1Text:le,slugKey:A,data:S})}catch(U){console.warn("[nimbi-cms] transformHtml hooks failed",U)}t.appendChild(B);try{Pa(B)}catch(U){console.warn("[nimbi-cms] executeEmbeddedScripts failed",U)}try{Ya(B,{t:i})}catch(U){console.warn("[nimbi-cms] attachImagePreview failed",U)}try{Xt(s,100,!1),requestAnimationFrame(()=>Xt(s,100,!1)),setTimeout(()=>Xt(s,100,!1),250)}catch(U){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",U)}Wn(M),Oa(B,Q,{mountOverlay:r,container:s,navWrap:n,t:i});try{await l("onPageLoad",{data:S,pagePath:E,anchor:M,article:B,toc:R,topH1:Q,h1Text:le,slugKey:A,contentWrap:t,navWrap:n})}catch(U){console.warn("[nimbi-cms] onPageLoad hooks failed",U)}u=E}async function d(){let b=new URLSearchParams(location.search).get("page")||c;const y=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await g(b,y)}catch(S){console.warn("[nimbi-cms] renderByQuery failed for",b,S),ui(t,i,S)}}window.addEventListener("popstate",d);const h=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,p=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const y={top:b.scrollTop||0,left:b.scrollLeft||0};sessionStorage.setItem(h(),JSON.stringify(y))}catch{}},m=()=>{try{const b=s||document.querySelector(".nimbi-cms");if(!b)return;const y=sessionStorage.getItem(h());if(!y)return;const S=JSON.parse(y);S&&typeof S.top=="number"&&b.scrollTo({top:S.top,left:S.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",b=>{if(b.persisted)try{m(),Xt(s,100,!1)}catch(y){console.warn("[nimbi-cms] bfcache restore failed",y)}}),window.addEventListener("pagehide",()=>{try{p()}catch(b){console.warn("[nimbi-cms] save scroll position failed",b)}}),{renderByQuery:d,siteNav:f,getCurrentPagePath:()=>u}}function Ja(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location&&window.location.hash){const i=window.location.hash,a=i.indexOf("?");a!==-1&&(t=i.slice(a))}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),s={},r=i=>{if(i==null)return;const a=String(i).toLowerCase();if(a==="1"||a==="true"||a==="yes")return!0;if(a==="0"||a==="false"||a==="no")return!1};if(n.has("contentPath")&&(s.contentPath=n.get("contentPath")),n.has("searchIndex")){const i=r(n.get("searchIndex"));typeof i=="boolean"&&(s.searchIndex=i)}if(n.has("searchIndexMode")){const i=n.get("searchIndexMode");(i==="eager"||i==="lazy")&&(s.searchIndexMode=i)}if(n.has("defaultStyle")){const i=n.get("defaultStyle");(i==="light"||i==="dark"||i==="system")&&(s.defaultStyle=i)}if(n.has("bulmaCustomize")&&(s.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(s.lang=n.get("lang")),n.has("l10nFile")){const i=n.get("l10nFile");s.l10nFile=i==="null"?null:i}if(n.has("cacheTtlMinutes")){const i=Number(n.get("cacheTtlMinutes"));Number.isFinite(i)&&i>=0&&(s.cacheTtlMinutes=i)}if(n.has("cacheMaxEntries")){const i=Number(n.get("cacheMaxEntries"));Number.isInteger(i)&&i>=0&&(s.cacheMaxEntries=i)}if(n.has("homePage")&&(s.homePage=n.get("homePage")),n.has("navigationPage")&&(s.navigationPage=n.get("navigationPage")),n.has("notFoundPage")&&(s.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(s.availableLanguages=n.get("availableLanguages").split(",").map(i=>i.trim()).filter(Boolean)),n.has("indexDepth")){const i=Number(n.get("indexDepth"));Number.isInteger(i)&&(i===1||i===2||i===3)&&(s.indexDepth=i)}if(n.has("noIndexing")){const a=(n.get("noIndexing")||"").split(",").map(c=>c.trim()).filter(Boolean);a.length&&(s.noIndexing=a)}return s}catch{return{}}}function eo(e){return!(typeof e!="string"||!e.trim()||e.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e)||e.startsWith("//")||e.startsWith("/")||/^[A-Za-z]:\\/.test(e))}function Gn(e){if(typeof e!="string")return!1;const t=e.trim();if(!t||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}let Qn="";async function gi(e={}){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.info("[nimbi-cms] initCMS called",{options:e})}catch{}if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const n=Ja();if(n&&(n.contentPath||n.homePage||n.notFoundPage||n.navigationPage))if(e&&e.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch(A){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",A)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch(A){console.warn("[nimbi-cms] logging ignore of URL overrides failed",A)}delete n.contentPath,delete n.homePage,delete n.notFoundPage,delete n.navigationPage}const s=Object.assign({},n,e);n&&typeof n.bulmaCustomize=="string"&&n.bulmaCustomize.trim()&&(s.bulmaCustomize=n.bulmaCustomize);let{el:r,contentPath:i="/content",crawlMaxQueue:a=1e3,searchIndex:c=!0,searchIndexMode:o="eager",indexDepth:l=1,noIndexing:u=void 0,defaultStyle:f="light",bulmaCustomize:g="none",lang:d=void 0,l10nFile:h=null,cacheTtlMinutes:p=5,cacheMaxEntries:m,markdownExtensions:b,availableLanguages:y,homePage:S="_home.md",notFoundPage:E="_404.md",navigationPage:M="_navigation.md"}=s;try{typeof S=="string"&&S.startsWith("./")&&(S=S.replace(/^\.\//,""))}catch{}try{typeof E=="string"&&E.startsWith("./")&&(E=E.replace(/^\.\//,""))}catch{}try{typeof M=="string"&&M.startsWith("./")&&(M=M.replace(/^[.]\//,""))}catch{}const{navbarLogo:B="favicon"}=s,{skipRootReadme:j=!1}=s,R=A=>{try{const U=document.querySelector(r);U&&U instanceof Element&&(U.innerHTML=`<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(A)}</pre></div>`)}catch{}};if(s.contentPath!=null&&!eo(s.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(S!=null&&!Gn(S))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(E!=null&&!Gn(E))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if(M!=null&&!Gn(M))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!r)throw new Error("el is required");let Q=r;if(typeof r=="string"){if(Q=document.querySelector(r),!Q)throw new Error(`el selector "${r}" did not match any element`)}else if(!(r instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof i!="string"||!i.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof c!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(o!=null&&o!=="eager"&&o!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2&&l!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(f!=="light"&&f!=="dark"&&f!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(g!=null&&typeof g!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(d!=null&&typeof d!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(p!=null&&(typeof p!="number"||!Number.isFinite(p)||p<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(m!=null&&(typeof m!="number"||!Number.isInteger(m)||m<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(b!=null&&(!Array.isArray(b)||b.some(A=>!A||typeof A!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some(A=>typeof A!="string"||!A.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(u!=null&&(!Array.isArray(u)||u.some(A=>typeof A!="string"||!A.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(j!=null&&typeof j!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(S!=null&&(typeof S!="string"||!S.trim()||!/\.(md|html)$/.test(S)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(E!=null&&(typeof E!="string"||!E.trim()||!/\.(md|html)$/.test(E)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const le=!!c;try{Promise.resolve().then(()=>mt).then(A=>{try{A&&typeof A.setSkipRootReadme=="function"&&A.setSkipRootReadme(!!j)}catch(U){console.warn("[nimbi-cms] setSkipRootReadme failed",U)}}).catch(A=>{})}catch(A){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",A)}try{await(async()=>{try{Q.classList.add("nimbi-mount")}catch(k){console.warn("[nimbi-cms] mount element setup failed",k)}const A=document.createElement("section");A.className="section";const U=document.createElement("div");U.className="container nimbi-cms";const X=document.createElement("div");X.className="columns";const q=document.createElement("div");q.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",q.setAttribute("role","navigation");try{const k=typeof ft=="function"?ft("navigation"):null;k&&q.setAttribute("aria-label",k)}catch(k){console.warn("[nimbi-cms] set nav aria-label failed",k)}X.appendChild(q);const G=document.createElement("main");G.className="column nimbi-content",G.setAttribute("role","main"),X.appendChild(G),U.appendChild(X),A.appendChild(U);const v=q,ue=G;Q.appendChild(A);let ee=null;try{ee=Q.querySelector(".nimbi-overlay"),ee||(ee=document.createElement("div"),ee.className="nimbi-overlay",Q.appendChild(ee))}catch(k){ee=null,console.warn("[nimbi-cms] mount overlay setup failed",k)}const ce=location.pathname||"/",L=ce.endsWith("/")?ce:ce.substring(0,ce.lastIndexOf("/")+1);try{Qn=document.title||""}catch(k){Qn="",console.warn("[nimbi-cms] read initial document title failed",k)}let T=i;(T==="."||T==="./")&&(T=""),T.startsWith("./")&&(T=T.slice(2)),T.startsWith("/")&&(T=T.slice(1)),T!==""&&!T.endsWith("/")&&(T=T+"/");const $=new URL(L+T,location.origin).toString();try{Promise.resolve().then(()=>mt).then(k=>{try{k&&typeof k.setHomePage=="function"&&k.setHomePage(S)}catch(P){console.warn("[nimbi-cms] setHomePage failed",P)}}).catch(k=>{})}catch(k){console.warn("[nimbi-cms] setHomePage dynamic import failed",k)}h&&await En(h,L),y&&Array.isArray(y)&&br(y),d&&An(d);const I=Va({contentWrap:ue,navWrap:v,container:U,mountOverlay:ee,t:ft,contentBase:$,homePage:S,initialDocumentTitle:Qn,runHooks:yn});if(typeof p=="number"&&p>=0&&typeof $r=="function"&&$r(p*60*1e3),typeof m=="number"&&m>=0&&typeof Rr=="function"&&Rr(m),b&&Array.isArray(b)&&b.length)try{b.forEach(k=>{typeof k=="object"&&si&&typeof On=="function"&&On(k)})}catch(k){console.warn("[nimbi-cms] applying markdownExtensions failed",k)}try{typeof a=="number"&&Promise.resolve().then(()=>mt).then(({setDefaultCrawlMaxQueue:k})=>{try{k(a)}catch(P){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",P)}})}catch(k){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",k)}try{Jt($)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{Mn(E)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{Jt($)}catch(k){console.warn("[nimbi-cms] setContentBase failed",k)}try{Mn(E)}catch(k){console.warn("[nimbi-cms] setNotFoundPage failed",k)}try{await Te(S,$)}catch(k){throw S==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${S} not found at ${$}${S}: ${k.message}`)}ur(f),await cr(g,L);try{const k=document.createElement("header");k.className="nimbi-site-navbar",Q.insertBefore(k,A);const P=await Te(M,$),O=await hn(P.raw||""),{navbar:ie,linkEls:de}=await Da(k,U,O.html||"",$,S,ft,I.renderByQuery,le,o,l,u,B);try{await yn("onNavBuild",{navWrap:v,navbar:ie,linkEls:de,contentBase:$})}catch(pe){console.warn("[nimbi-cms] onNavBuild hooks failed",pe)}try{const pe=()=>{const xe=k&&k.getBoundingClientRect&&Math.round(k.getBoundingClientRect().height)||k&&k.offsetHeight||0;if(xe>0){try{Q.style.setProperty("--nimbi-site-navbar-height",`${xe}px`)}catch(ge){console.warn("[nimbi-cms] set CSS var failed",ge)}try{U.style.paddingTop=""}catch(ge){console.warn("[nimbi-cms] set container paddingTop failed",ge)}try{const ge=Q&&Q.getBoundingClientRect&&Math.round(Q.getBoundingClientRect().height)||Q&&Q.clientHeight||0;if(ge>0){const qe=Math.max(0,ge-xe);try{U.style.setProperty("--nimbi-cms-height",`${qe}px`)}catch(bt){console.warn("[nimbi-cms] set --nimbi-cms-height failed",bt)}}else try{U.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(qe){console.warn("[nimbi-cms] set --nimbi-cms-height failed",qe)}}catch(ge){console.warn("[nimbi-cms] compute container height failed",ge)}try{k.style.setProperty("--nimbi-site-navbar-height",`${xe}px`)}catch(ge){console.warn("[nimbi-cms] set navbar CSS var failed",ge)}}};pe();try{if(typeof ResizeObserver<"u"){const xe=new ResizeObserver(()=>pe());try{xe.observe(k)}catch(ge){console.warn("[nimbi-cms] ResizeObserver.observe failed",ge)}}}catch(xe){console.warn("[nimbi-cms] ResizeObserver setup failed",xe)}}catch(pe){console.warn("[nimbi-cms] compute navbar height failed",pe)}}catch(k){console.warn("[nimbi-cms] build navigation failed",k)}await I.renderByQuery();try{Promise.resolve().then(()=>to).then(({getVersion:k})=>{typeof k=="function"&&k().then(P=>{try{const O=P||"0.0.0";try{const ie=xe=>{const ge=document.createElement("a");ge.className="nimbi-version-label tag is-small",ge.textContent=`Ninbi CMS v. ${O}`,ge.href=xe||"#",ge.target="_blank",ge.rel="noopener noreferrer nofollow",ge.setAttribute("aria-label",`Ninbi CMS version ${O}`);try{hr(ge)}catch{}try{Q.appendChild(ge)}catch(qe){console.warn("[nimbi-cms] append version label failed",qe)}},de="https://abelvm.github.io/nimbiCMS/",pe=(()=>{try{if(de&&typeof de=="string")return new URL(de).toString()}catch{}return"#"})();ie(pe)}catch(ie){console.warn("[nimbi-cms] building version label failed",ie)}}catch(O){console.warn("[nimbi-cms] building version label failed",O)}}).catch(P=>{console.warn("[nimbi-cms] getVersion() failed",P)})}).catch(k=>{console.warn("[nimbi-cms] import version module failed",k)})}catch(k){console.warn("[nimbi-cms] version label setup failed",k)}})()}catch(A){throw R(A),A}}async function mi(){try{if("1.0.2".trim())return"1.0.2"}catch{}return"0.0.0"}const to=Object.freeze(Object.defineProperty({__proto__:null,getVersion:mi},Symbol.toStringTag,{value:"Module"}));me.BAD_LANGUAGES=xn,me.SUPPORTED_HLJS_MAP=ne,me._clearHooks=Bi,me.addHook=Zt,me.default=gi,me.ensureBulma=cr,me.getVersion=mi,me.initCMS=gi,me.loadL10nFile=En,me.loadSupportedLanguages=vn,me.observeCodeBlocks=or,me.onNavBuild=zi,me.onPageLoad=Pi,me.registerLanguage=ht,me.runHooks=yn,me.setHighlightTheme=ji,me.setLang=An,me.setStyle=ur,me.setThemeVars=Wi,me.t=ft,me.transformHtml=Ii,Object.defineProperties(me,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
