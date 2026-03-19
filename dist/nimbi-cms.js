(function(ye,Ve){typeof exports=="object"&&typeof module<"u"?Ve(exports):typeof define=="function"&&define.amd?define(["exports"],Ve):(ye=typeof globalThis<"u"?globalThis:ye||self,Ve(ye.nimbiCMS={}))})(this,(function(ye){"use strict";const Ve={onPageLoad:[],onNavBuild:[],transformHtml:[]};function Gt(e,t){if(!Object.prototype.hasOwnProperty.call(Ve,e))throw new Error('Unknown hook "'+e+'"');if(typeof t!="function")throw new TypeError("hook callback must be a function");Ve[e].push(t)}function Ni(e){Gt("onPageLoad",e)}function Bi(e){Gt("onNavBuild",e)}function Oi(e){Gt("transformHtml",e)}async function kn(e,t){const n=Ve[e]||[];for(const i of n)try{await i(t)}catch(r){console.warn("[nimbi-cms] runHooks callback failed",r)}}function qi(){Object.keys(Ve).forEach(e=>{Ve[e].length=0})}function lr(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var _n,cr;function Di(){if(cr)return _n;cr=1;function e(b){return b instanceof Map?b.clear=b.delete=b.set=function(){throw new Error("map is read-only")}:b instanceof Set&&(b.add=b.clear=b.delete=function(){throw new Error("set is read-only")}),Object.freeze(b),Object.getOwnPropertyNames(b).forEach(_=>{const M=b[_],ee=typeof M;(ee==="object"||ee==="function")&&!Object.isFrozen(M)&&e(M)}),b}class t{constructor(_){_.data===void 0&&(_.data={}),this.data=_.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function n(b){return b.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function i(b,..._){const M=Object.create(null);for(const ee in b)M[ee]=b[ee];return _.forEach(function(ee){for(const Ae in ee)M[Ae]=ee[Ae]}),M}const r="</span>",a=b=>!!b.scope,s=(b,{prefix:_})=>{if(b.startsWith("language:"))return b.replace("language:","language-");if(b.includes(".")){const M=b.split(".");return[`${_}${M.shift()}`,...M.map((ee,Ae)=>`${ee}${"_".repeat(Ae+1)}`)].join(" ")}return`${_}${b}`};class u{constructor(_,M){this.buffer="",this.classPrefix=M.classPrefix,_.walk(this)}addText(_){this.buffer+=n(_)}openNode(_){if(!a(_))return;const M=s(_.scope,{prefix:this.classPrefix});this.span(M)}closeNode(_){a(_)&&(this.buffer+=r)}value(){return this.buffer}span(_){this.buffer+=`<span class="${_}">`}}const o=(b={})=>{const _={children:[]};return Object.assign(_,b),_};class l{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(_){this.top.children.push(_)}openNode(_){const M=o({scope:_});this.add(M),this.stack.push(M)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(_){return this.constructor._walk(_,this.rootNode)}static _walk(_,M){return typeof M=="string"?_.addText(M):M.children&&(_.openNode(M),M.children.forEach(ee=>this._walk(_,ee)),_.closeNode(M)),_}static _collapse(_){typeof _!="string"&&_.children&&(_.children.every(M=>typeof M=="string")?_.children=[_.children.join("")]:_.children.forEach(M=>{l._collapse(M)}))}}class c extends l{constructor(_){super(),this.options=_}addText(_){_!==""&&this.add(_)}startScope(_){this.openNode(_)}endScope(){this.closeNode()}__addSublanguage(_,M){const ee=_.root;M&&(ee.scope=`language:${M}`),this.add(ee)}toHTML(){return new u(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function f(b){return b?typeof b=="string"?b:b.source:null}function m(b){return p("(?=",b,")")}function h(b){return p("(?:",b,")*")}function d(b){return p("(?:",b,")?")}function p(...b){return b.map(M=>f(M)).join("")}function g(b){const _=b[b.length-1];return typeof _=="object"&&_.constructor===Object?(b.splice(b.length-1,1),_):{}}function w(...b){return"("+(g(b).capture?"":"?:")+b.map(ee=>f(ee)).join("|")+")"}function y(b){return new RegExp(b.toString()+"|").exec("").length-1}function k(b,_){const M=b&&b.exec(_);return M&&M.index===0}const v=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function $(b,{joinWith:_}){let M=0;return b.map(ee=>{M+=1;const Ae=M;let Ee=f(ee),q="";for(;Ee.length>0;){const B=v.exec(Ee);if(!B){q+=Ee;break}q+=Ee.substring(0,B.index),Ee=Ee.substring(B.index+B[0].length),B[0][0]==="\\"&&B[1]?q+="\\"+String(Number(B[1])+Ae):(q+=B[0],B[0]==="("&&M++)}return q}).map(ee=>`(${ee})`).join(_)}const N=/\b\B/,U="[a-zA-Z]\\w*",z="[a-zA-Z_]\\w*",K="\\b\\d+(\\.\\d+)?",le="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",L="\\b(0b[01]+)",j="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",_e=(b={})=>{const _=/^#![ ]*\//;return b.binary&&(b.begin=p(_,/.*\b/,b.binary,/\b.*/)),i({scope:"meta",begin:_,end:/$/,relevance:0,"on:begin":(M,ee)=>{M.index!==0&&ee.ignoreMatch()}},b)},V={begin:"\\\\[\\s\\S]",relevance:0},H={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[V]},S={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[V]},Z={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},G=function(b,_,M={}){const ee=i({scope:"comment",begin:b,end:_,contains:[]},M);ee.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const Ae=w("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return ee.contains.push({begin:p(/[ ]+/,"(",Ae,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),ee},pe=G("//","$"),x=G("/\\*","\\*/"),A=G("#","$"),I={scope:"number",begin:K,relevance:0},R={scope:"number",begin:le,relevance:0},O={scope:"number",begin:L,relevance:0},C={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[V,{begin:/\[/,end:/\]/,relevance:0,contains:[V]}]},X={scope:"title",begin:U,relevance:0},E={scope:"title",begin:z,relevance:0},he={begin:"\\.\\s*"+z,relevance:0};var se=Object.freeze({__proto__:null,APOS_STRING_MODE:H,BACKSLASH_ESCAPE:V,BINARY_NUMBER_MODE:O,BINARY_NUMBER_RE:L,COMMENT:G,C_BLOCK_COMMENT_MODE:x,C_LINE_COMMENT_MODE:pe,C_NUMBER_MODE:R,C_NUMBER_RE:le,END_SAME_AS_BEGIN:function(b){return Object.assign(b,{"on:begin":(_,M)=>{M.data._beginMatch=_[1]},"on:end":(_,M)=>{M.data._beginMatch!==_[1]&&M.ignoreMatch()}})},HASH_COMMENT_MODE:A,IDENT_RE:U,MATCH_NOTHING_RE:N,METHOD_GUARD:he,NUMBER_MODE:I,NUMBER_RE:K,PHRASAL_WORDS_MODE:Z,QUOTE_STRING_MODE:S,REGEXP_MODE:C,RE_STARTERS_RE:j,SHEBANG:_e,TITLE_MODE:X,UNDERSCORE_IDENT_RE:z,UNDERSCORE_TITLE_MODE:E});function me(b,_){b.input[b.index-1]==="."&&_.ignoreMatch()}function oe(b,_){b.className!==void 0&&(b.scope=b.className,delete b.className)}function ge(b,_){_&&b.beginKeywords&&(b.begin="\\b("+b.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",b.__beforeBegin=me,b.keywords=b.keywords||b.beginKeywords,delete b.beginKeywords,b.relevance===void 0&&(b.relevance=0))}function we(b,_){Array.isArray(b.illegal)&&(b.illegal=w(...b.illegal))}function Xe(b,_){if(b.match){if(b.begin||b.end)throw new Error("begin & end are not supported with match");b.begin=b.match,delete b.match}}function Vn(b,_){b.relevance===void 0&&(b.relevance=1)}const so=(b,_)=>{if(!b.beforeMatch)return;if(b.starts)throw new Error("beforeMatch cannot be used with starts");const M=Object.assign({},b);Object.keys(b).forEach(ee=>{delete b[ee]}),b.keywords=M.keywords,b.begin=p(M.beforeMatch,m(M.begin)),b.starts={relevance:0,contains:[Object.assign(M,{endsParent:!0})]},b.relevance=0,delete M.beforeMatch},oo=["of","and","for","in","not","or","if","then","parent","list","value"],lo="keyword";function ki(b,_,M=lo){const ee=Object.create(null);return typeof b=="string"?Ae(M,b.split(" ")):Array.isArray(b)?Ae(M,b):Object.keys(b).forEach(function(Ee){Object.assign(ee,ki(b[Ee],_,Ee))}),ee;function Ae(Ee,q){_&&(q=q.map(B=>B.toLowerCase())),q.forEach(function(B){const Y=B.split("|");ee[Y[0]]=[Ee,co(Y[0],Y[1])]})}}function co(b,_){return _?Number(_):uo(b)?0:1}function uo(b){return oo.includes(b.toLowerCase())}const _i={},gt=b=>{console.error(b)},xi=(b,..._)=>{console.log(`WARN: ${b}`,..._)},St=(b,_)=>{_i[`${b}/${_}`]||(console.log(`Deprecated as of ${b}. ${_}`),_i[`${b}/${_}`]=!0)},gn=new Error;function Si(b,_,{key:M}){let ee=0;const Ae=b[M],Ee={},q={};for(let B=1;B<=_.length;B++)q[B+ee]=Ae[B],Ee[B+ee]=!0,ee+=y(_[B-1]);b[M]=q,b[M]._emit=Ee,b[M]._multi=!0}function ho(b){if(Array.isArray(b.begin)){if(b.skip||b.excludeBegin||b.returnBegin)throw gt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),gn;if(typeof b.beginScope!="object"||b.beginScope===null)throw gt("beginScope must be object"),gn;Si(b,b.begin,{key:"beginScope"}),b.begin=$(b.begin,{joinWith:""})}}function po(b){if(Array.isArray(b.end)){if(b.skip||b.excludeEnd||b.returnEnd)throw gt("skip, excludeEnd, returnEnd not compatible with endScope: {}"),gn;if(typeof b.endScope!="object"||b.endScope===null)throw gt("endScope must be object"),gn;Si(b,b.end,{key:"endScope"}),b.end=$(b.end,{joinWith:""})}}function go(b){b.scope&&typeof b.scope=="object"&&b.scope!==null&&(b.beginScope=b.scope,delete b.scope)}function fo(b){go(b),typeof b.beginScope=="string"&&(b.beginScope={_wrap:b.beginScope}),typeof b.endScope=="string"&&(b.endScope={_wrap:b.endScope}),ho(b),po(b)}function mo(b){function _(q,B){return new RegExp(f(q),"m"+(b.case_insensitive?"i":"")+(b.unicodeRegex?"u":"")+(B?"g":""))}class M{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(B,Y){Y.position=this.position++,this.matchIndexes[this.matchAt]=Y,this.regexes.push([Y,B]),this.matchAt+=y(B)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const B=this.regexes.map(Y=>Y[1]);this.matcherRe=_($(B,{joinWith:"|"}),!0),this.lastIndex=0}exec(B){this.matcherRe.lastIndex=this.lastIndex;const Y=this.matcherRe.exec(B);if(!Y)return null;const Re=Y.findIndex((Zt,er)=>er>0&&Zt!==void 0),Le=this.matchIndexes[Re];return Y.splice(0,Re),Object.assign(Y,Le)}}class ee{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(B){if(this.multiRegexes[B])return this.multiRegexes[B];const Y=new M;return this.rules.slice(B).forEach(([Re,Le])=>Y.addRule(Re,Le)),Y.compile(),this.multiRegexes[B]=Y,Y}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(B,Y){this.rules.push([B,Y]),Y.type==="begin"&&this.count++}exec(B){const Y=this.getMatcher(this.regexIndex);Y.lastIndex=this.lastIndex;let Re=Y.exec(B);if(this.resumingScanAtSamePosition()&&!(Re&&Re.index===this.lastIndex)){const Le=this.getMatcher(0);Le.lastIndex=this.lastIndex+1,Re=Le.exec(B)}return Re&&(this.regexIndex+=Re.position+1,this.regexIndex===this.count&&this.considerAll()),Re}}function Ae(q){const B=new ee;return q.contains.forEach(Y=>B.addRule(Y.begin,{rule:Y,type:"begin"})),q.terminatorEnd&&B.addRule(q.terminatorEnd,{type:"end"}),q.illegal&&B.addRule(q.illegal,{type:"illegal"}),B}function Ee(q,B){const Y=q;if(q.isCompiled)return Y;[oe,Xe,fo,so].forEach(Le=>Le(q,B)),b.compilerExtensions.forEach(Le=>Le(q,B)),q.__beforeBegin=null,[ge,we,Vn].forEach(Le=>Le(q,B)),q.isCompiled=!0;let Re=null;return typeof q.keywords=="object"&&q.keywords.$pattern&&(q.keywords=Object.assign({},q.keywords),Re=q.keywords.$pattern,delete q.keywords.$pattern),Re=Re||/\w+/,q.keywords&&(q.keywords=ki(q.keywords,b.case_insensitive)),Y.keywordPatternRe=_(Re,!0),B&&(q.begin||(q.begin=/\B|\b/),Y.beginRe=_(Y.begin),!q.end&&!q.endsWithParent&&(q.end=/\B|\b/),q.end&&(Y.endRe=_(Y.end)),Y.terminatorEnd=f(Y.end)||"",q.endsWithParent&&B.terminatorEnd&&(Y.terminatorEnd+=(q.end?"|":"")+B.terminatorEnd)),q.illegal&&(Y.illegalRe=_(q.illegal)),q.contains||(q.contains=[]),q.contains=[].concat(...q.contains.map(function(Le){return bo(Le==="self"?q:Le)})),q.contains.forEach(function(Le){Ee(Le,Y)}),q.starts&&Ee(q.starts,B),Y.matcher=Ae(Y),Y}if(b.compilerExtensions||(b.compilerExtensions=[]),b.contains&&b.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return b.classNameAliases=i(b.classNameAliases||{}),Ee(b)}function vi(b){return b?b.endsWithParent||vi(b.starts):!1}function bo(b){return b.variants&&!b.cachedVariants&&(b.cachedVariants=b.variants.map(function(_){return i(b,{variants:null},_)})),b.cachedVariants?b.cachedVariants:vi(b)?i(b,{starts:b.starts?i(b.starts):null}):Object.isFrozen(b)?i(b):b}var wo="11.11.1";class yo extends Error{constructor(_,M){super(_),this.name="HTMLInjectionError",this.html=M}}const Jn=n,Ai=i,Ei=Symbol("nomatch"),ko=7,Li=function(b){const _=Object.create(null),M=Object.create(null),ee=[];let Ae=!0;const Ee="Could not find the language '{}', did you forget to load/include a language module?",q={disableAutodetect:!0,name:"Plain text",contains:[]};let B={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:c};function Y(T){return B.noHighlightRe.test(T)}function Re(T){let W=T.className+" ";W+=T.parentNode?T.parentNode.className:"";const ce=B.languageDetectRe.exec(W);if(ce){const xe=st(ce[1]);return xe||(xi(Ee.replace("{}",ce[1])),xi("Falling back to no-highlight mode for this block.",T)),xe?ce[1]:"no-highlight"}return W.split(/\s+/).find(xe=>Y(xe)||st(xe))}function Le(T,W,ce){let xe="",Ce="";typeof W=="object"?(xe=T,ce=W.ignoreIllegals,Ce=W.language):(St("10.7.0","highlight(lang, code, ...args) has been deprecated."),St("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),Ce=T,xe=W),ce===void 0&&(ce=!0);const We={code:xe,language:Ce};mn("before:highlight",We);const ot=We.result?We.result:Zt(We.language,We.code,ce);return ot.code=We.code,mn("after:highlight",ot),ot}function Zt(T,W,ce,xe){const Ce=Object.create(null);function We(P,D){return P.keywords[D]}function ot(){if(!te.keywords){$e.addText(Se);return}let P=0;te.keywordPatternRe.lastIndex=0;let D=te.keywordPatternRe.exec(Se),re="";for(;D;){re+=Se.substring(P,D.index);const be=Ye.case_insensitive?D[0].toLowerCase():D[0],Ie=We(te,be);if(Ie){const[tt,Bo]=Ie;if($e.addText(re),re="",Ce[be]=(Ce[be]||0)+1,Ce[be]<=ko&&(yn+=Bo),tt.startsWith("_"))re+=D[0];else{const Oo=Ye.classNameAliases[tt]||tt;Ke(D[0],Oo)}}else re+=D[0];P=te.keywordPatternRe.lastIndex,D=te.keywordPatternRe.exec(Se)}re+=Se.substring(P),$e.addText(re)}function bn(){if(Se==="")return;let P=null;if(typeof te.subLanguage=="string"){if(!_[te.subLanguage]){$e.addText(Se);return}P=Zt(te.subLanguage,Se,!0,Ii[te.subLanguage]),Ii[te.subLanguage]=P._top}else P=tr(Se,te.subLanguage.length?te.subLanguage:null);te.relevance>0&&(yn+=P.relevance),$e.__addSublanguage(P._emitter,P.language)}function De(){te.subLanguage!=null?bn():ot(),Se=""}function Ke(P,D){P!==""&&($e.startScope(D),$e.addText(P),$e.endScope())}function Ri(P,D){let re=1;const be=D.length-1;for(;re<=be;){if(!P._emit[re]){re++;continue}const Ie=Ye.classNameAliases[P[re]]||P[re],tt=D[re];Ie?Ke(tt,Ie):(Se=tt,ot(),Se=""),re++}}function $i(P,D){return P.scope&&typeof P.scope=="string"&&$e.openNode(Ye.classNameAliases[P.scope]||P.scope),P.beginScope&&(P.beginScope._wrap?(Ke(Se,Ye.classNameAliases[P.beginScope._wrap]||P.beginScope._wrap),Se=""):P.beginScope._multi&&(Ri(P.beginScope,D),Se="")),te=Object.create(P,{parent:{value:te}}),te}function zi(P,D,re){let be=k(P.endRe,re);if(be){if(P["on:end"]){const Ie=new t(P);P["on:end"](D,Ie),Ie.isMatchIgnored&&(be=!1)}if(be){for(;P.endsParent&&P.parent;)P=P.parent;return P}}if(P.endsWithParent)return zi(P.parent,D,re)}function $o(P){return te.matcher.regexIndex===0?(Se+=P[0],1):(ar=!0,0)}function zo(P){const D=P[0],re=P.rule,be=new t(re),Ie=[re.__beforeBegin,re["on:begin"]];for(const tt of Ie)if(tt&&(tt(P,be),be.isMatchIgnored))return $o(D);return re.skip?Se+=D:(re.excludeBegin&&(Se+=D),De(),!re.returnBegin&&!re.excludeBegin&&(Se=D)),$i(re,P),re.returnBegin?0:D.length}function Po(P){const D=P[0],re=W.substring(P.index),be=zi(te,P,re);if(!be)return Ei;const Ie=te;te.endScope&&te.endScope._wrap?(De(),Ke(D,te.endScope._wrap)):te.endScope&&te.endScope._multi?(De(),Ri(te.endScope,P)):Ie.skip?Se+=D:(Ie.returnEnd||Ie.excludeEnd||(Se+=D),De(),Ie.excludeEnd&&(Se=D));do te.scope&&$e.closeNode(),!te.skip&&!te.subLanguage&&(yn+=te.relevance),te=te.parent;while(te!==be.parent);return be.starts&&$i(be.starts,P),Ie.returnEnd?0:D.length}function Io(){const P=[];for(let D=te;D!==Ye;D=D.parent)D.scope&&P.unshift(D.scope);P.forEach(D=>$e.openNode(D))}let wn={};function Pi(P,D){const re=D&&D[0];if(Se+=P,re==null)return De(),0;if(wn.type==="begin"&&D.type==="end"&&wn.index===D.index&&re===""){if(Se+=W.slice(D.index,D.index+1),!Ae){const be=new Error(`0 width match regex (${T})`);throw be.languageName=T,be.badRule=wn.rule,be}return 1}if(wn=D,D.type==="begin")return zo(D);if(D.type==="illegal"&&!ce){const be=new Error('Illegal lexeme "'+re+'" for mode "'+(te.scope||"<unnamed>")+'"');throw be.mode=te,be}else if(D.type==="end"){const be=Po(D);if(be!==Ei)return be}if(D.type==="illegal"&&re==="")return Se+=`
`,1;if(ir>1e5&&ir>D.index*3)throw new Error("potential infinite loop, way more iterations than matches");return Se+=re,re.length}const Ye=st(T);if(!Ye)throw gt(Ee.replace("{}",T)),new Error('Unknown language: "'+T+'"');const No=mo(Ye);let rr="",te=xe||No;const Ii={},$e=new B.__emitter(B);Io();let Se="",yn=0,ft=0,ir=0,ar=!1;try{if(Ye.__emitTokens)Ye.__emitTokens(W,$e);else{for(te.matcher.considerAll();;){ir++,ar?ar=!1:te.matcher.considerAll(),te.matcher.lastIndex=ft;const P=te.matcher.exec(W);if(!P)break;const D=W.substring(ft,P.index),re=Pi(D,P);ft=P.index+re}Pi(W.substring(ft))}return $e.finalize(),rr=$e.toHTML(),{language:T,value:rr,relevance:yn,illegal:!1,_emitter:$e,_top:te}}catch(P){if(P.message&&P.message.includes("Illegal"))return{language:T,value:Jn(W),illegal:!0,relevance:0,_illegalBy:{message:P.message,index:ft,context:W.slice(ft-100,ft+100),mode:P.mode,resultSoFar:rr},_emitter:$e};if(Ae)return{language:T,value:Jn(W),illegal:!1,relevance:0,errorRaised:P,_emitter:$e,_top:te};throw P}}function er(T){const W={value:Jn(T),illegal:!1,relevance:0,_top:q,_emitter:new B.__emitter(B)};return W._emitter.addText(T),W}function tr(T,W){W=W||B.languages||Object.keys(_);const ce=er(T),xe=W.filter(st).filter(Mi).map(De=>Zt(De,T,!1));xe.unshift(ce);const Ce=xe.sort((De,Ke)=>{if(De.relevance!==Ke.relevance)return Ke.relevance-De.relevance;if(De.language&&Ke.language){if(st(De.language).supersetOf===Ke.language)return 1;if(st(Ke.language).supersetOf===De.language)return-1}return 0}),[We,ot]=Ce,bn=We;return bn.secondBest=ot,bn}function _o(T,W,ce){const xe=W&&M[W]||ce;T.classList.add("hljs"),T.classList.add(`language-${xe}`)}function nr(T){let W=null;const ce=Re(T);if(Y(ce))return;if(mn("before:highlightElement",{el:T,language:ce}),T.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",T);return}if(T.children.length>0&&(B.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(T)),B.throwUnescapedHTML))throw new yo("One of your code blocks includes unescaped HTML.",T.innerHTML);W=T;const xe=W.textContent,Ce=ce?Le(xe,{language:ce,ignoreIllegals:!0}):tr(xe);T.innerHTML=Ce.value,T.dataset.highlighted="yes",_o(T,ce,Ce.language),T.result={language:Ce.language,re:Ce.relevance,relevance:Ce.relevance},Ce.secondBest&&(T.secondBest={language:Ce.secondBest.language,relevance:Ce.secondBest.relevance}),mn("after:highlightElement",{el:T,result:Ce,text:xe})}function xo(T){B=Ai(B,T)}const So=()=>{fn(),St("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function vo(){fn(),St("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Ti=!1;function fn(){function T(){fn()}if(document.readyState==="loading"){Ti||window.addEventListener("DOMContentLoaded",T,!1),Ti=!0;return}document.querySelectorAll(B.cssSelector).forEach(nr)}function Ao(T,W){let ce=null;try{ce=W(b)}catch(xe){if(gt("Language definition for '{}' could not be registered.".replace("{}",T)),Ae)gt(xe);else throw xe;ce=q}ce.name||(ce.name=T),_[T]=ce,ce.rawDefinition=W.bind(null,b),ce.aliases&&Ci(ce.aliases,{languageName:T})}function Eo(T){delete _[T];for(const W of Object.keys(M))M[W]===T&&delete M[W]}function Lo(){return Object.keys(_)}function st(T){return T=(T||"").toLowerCase(),_[T]||_[M[T]]}function Ci(T,{languageName:W}){typeof T=="string"&&(T=[T]),T.forEach(ce=>{M[ce.toLowerCase()]=W})}function Mi(T){const W=st(T);return W&&!W.disableAutodetect}function To(T){T["before:highlightBlock"]&&!T["before:highlightElement"]&&(T["before:highlightElement"]=W=>{T["before:highlightBlock"](Object.assign({block:W.el},W))}),T["after:highlightBlock"]&&!T["after:highlightElement"]&&(T["after:highlightElement"]=W=>{T["after:highlightBlock"](Object.assign({block:W.el},W))})}function Co(T){To(T),ee.push(T)}function Mo(T){const W=ee.indexOf(T);W!==-1&&ee.splice(W,1)}function mn(T,W){const ce=T;ee.forEach(function(xe){xe[ce]&&xe[ce](W)})}function Ro(T){return St("10.7.0","highlightBlock will be removed entirely in v12.0"),St("10.7.0","Please use highlightElement now."),nr(T)}Object.assign(b,{highlight:Le,highlightAuto:tr,highlightAll:fn,highlightElement:nr,highlightBlock:Ro,configure:xo,initHighlighting:So,initHighlightingOnLoad:vo,registerLanguage:Ao,unregisterLanguage:Eo,listLanguages:Lo,getLanguage:st,registerAliases:Ci,autoDetection:Mi,inherit:Ai,addPlugin:Co,removePlugin:Mo}),b.debugMode=function(){Ae=!1},b.safeMode=function(){Ae=!0},b.versionString=wo,b.regex={concat:p,lookahead:m,either:w,optional:d,anyNumberOfTimes:h};for(const T in se)typeof se[T]=="object"&&e(se[T]);return Object.assign(b,se),b},vt=Li({});return vt.newInstance=()=>Li({}),_n=vt,vt.HighlightJS=vt,vt.default=vt,_n}var Hi=Di();const de=lr(Hi),ji="11.11.1",ie=new Map,Ui="https://raw.githubusercontent.com/highlightjs/highlight.js/main/SUPPORTED_LANGUAGES.md",Oe={shell:"bash",sh:"bash",zsh:"bash",js:"javascript",ts:"typescript",py:"python",csharp:"cs","c#":"cs"};Oe.html="xml",Oe.xhtml="xml",Oe.markup="xml";const xn=new Set(["magic","undefined"]);let nt=null;const Sn=new Map,Wi=300*1e3;async function vn(e=Ui){if(e)return nt||(nt=(async()=>{try{const t=await fetch(e);if(!t.ok)return;const i=(await t.text()).split(/\r?\n/);let r=-1;for(let l=0;l<i.length;l++)if(/\|\s*Language\s*\|/i.test(i[l])){r=l;break}if(r===-1)return;const a=i[r].replace(/^\||\|$/g,"").split("|").map(l=>l.trim().toLowerCase());let s=a.findIndex(l=>/alias|aliases|equivalent|alt|alternates?/i.test(l));s===-1&&(s=1);let u=a.findIndex(l=>/file|filename|module|module name|module-name|short|slug/i.test(l));if(u===-1){const l=a.findIndex(c=>/language/i.test(c));u=l!==-1?l:0}let o=[];for(let l=r+1;l<i.length;l++){const c=i[l].trim();if(!c||!c.startsWith("|"))break;const f=c.replace(/^\||\|$/g,"").split("|").map(g=>g.trim());if(f.every(g=>/^-+$/.test(g)))continue;const m=f;if(!m.length)continue;const d=(m[u]||m[0]||"").toString().trim().toLowerCase();if(!d||/^-+$/.test(d))continue;ie.set(d,d);const p=m[s]||"";if(p){const g=String(p).split(",").map(w=>w.replace(/`/g,"").trim()).filter(Boolean);if(g.length){const y=g[0].toLowerCase().replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");y&&/[a-z0-9]/i.test(y)&&(ie.set(y,y),o.push(y))}}}try{const l=[];for(const c of o){const f=String(c||"").replace(/^[:]+/,"").replace(/[^a-z0-9_-]+/ig,"");f&&/[a-z0-9]/i.test(f)?l.push(f):ie.delete(c)}o=l}catch(l){console.warn("[codeblocksManager] cleanup aliases failed",l)}try{let l=0;for(const c of Array.from(ie.keys())){if(!c||/^-+$/.test(c)||!/[a-z0-9]/i.test(c)){ie.delete(c),l++;continue}if(/^[:]+/.test(c)){const f=c.replace(/^[:]+/,"");if(f&&/[a-z0-9]/i.test(f)){const m=ie.get(c);ie.delete(c),ie.set(f,m)}else ie.delete(c),l++}}for(const[c,f]of Array.from(ie.entries()))(!f||/^-+$/.test(f)||!/[a-z0-9]/i.test(f))&&(ie.delete(c),l++);try{const c=":---------------------";ie.has(c)&&(ie.delete(c),l++)}catch(c){console.warn("[codeblocksManager] remove sep key failed",c)}try{const c=Array.from(ie.keys()).sort()}catch(c){console.warn("[codeblocksManager] compute supported keys failed",c)}}catch(l){console.warn("[codeblocksManager] ignored error",l)}}catch(t){console.warn("[codeblocksManager] loadSupportedLanguages failed",t)}})(),nt)}const At=new Set;async function mt(e,t){if(nt||(async()=>{try{await vn()}catch(r){console.warn("[codeblocksManager] loadSupportedLanguages (IIFE) failed",r)}})(),nt)try{await nt}catch{}if(e=e==null?"":String(e),e=e.trim(),!e)return!1;const n=e.toLowerCase();if(xn.has(n))return!1;if(ie.size&&!ie.has(n)){const r=Oe;if(!r[n]&&!r[e])return!1}if(At.has(e))return!0;const i=Oe;try{const r=(t||e||"").toString().replace(/\.js$/i,"").trim(),a=(i[e]||e||"").toString(),s=(i[r]||r||"").toString();let u=Array.from(new Set([a,s,r,e,i[r],i[e]].filter(Boolean))).map(c=>String(c).toLowerCase()).filter(c=>c&&c!=="undefined");ie.size&&(u=u.filter(c=>{if(ie.has(c))return!0;const f=Oe[c];return!!(f&&ie.has(f))}));let o=null,l=null;for(const c of u)try{const f=Date.now();let m=Sn.get(c);if(m&&m.ok===!1&&f-(m.ts||0)>=Wi&&(Sn.delete(c),m=void 0),m){if(m.module)o=m.module;else if(m.promise)try{o=await m.promise}catch{o=null}}else{const h={promise:null,module:null,ok:null,ts:0};Sn.set(c,h),h.promise=(async()=>{try{try{try{return await import(`highlight.js/lib/languages/${c}.js`)}catch{return await import(`highlight.js/lib/languages/${c}`)}}catch{try{const p=`https://cdn.jsdelivr.net/npm/highlight.js/es/languages/${c}.js`;return await new Function("u","return import(u)")(p)}catch{try{const g=`https://cdn.jsdelivr.net/npm/highlight.js/lib/languages/${c}.js`;return await new Function("u","return import(u)")(g)}catch{return null}}}}catch{return null}})();try{o=await h.promise,h.module=o,h.ok=!!o,h.ts=Date.now()}catch{h.module=null,h.ok=!1,h.ts=Date.now(),o=null}}if(o){const h=o.default||o;try{const d=ie.size&&ie.get(e)||c||e;return de.registerLanguage(d,h),At.add(d),d!==e&&(de.registerLanguage(e,h),At.add(e)),!0}catch(d){l=d}}else try{if(ie.has(c)||ie.has(e)){const h=()=>({});try{de.registerLanguage(c,h),At.add(c)}catch{}try{c!==e&&(de.registerLanguage(e,h),At.add(e))}catch{}return!0}}catch{}}catch(f){l=f}if(l)throw l;return!1}catch{return!1}}let Qt=null;function ur(e=document){nt||(async()=>{try{await vn()}catch(a){console.warn("[codeblocksManager] loadSupportedLanguages (observer) failed",a)}})();const t=Oe,i=Qt||(typeof IntersectionObserver>"u"?null:(Qt=new IntersectionObserver((a,s)=>{a.forEach(u=>{if(!u.isIntersecting)return;const o=u.target;try{s.unobserve(o)}catch(l){console.warn("[codeblocksManager] observer unobserve failed",l)}(async()=>{try{const l=o.getAttribute&&o.getAttribute("class")||o.className||"",c=l.match(/language-([a-zA-Z0-9_+-]+)/)||l.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(c&&c[1]){const f=(c[1]||"").toLowerCase(),m=t[f]||f,h=ie.size&&(ie.get(m)||ie.get(String(m).toLowerCase()))||m;try{await mt(h)}catch(d){console.warn("[codeblocksManager] registerLanguage failed",d)}try{try{const d=o.textContent||o.innerText||"";d!=null&&(o.textContent=d)}catch{}try{o&&o.dataset&&o.dataset.highlighted&&delete o.dataset.highlighted}catch{}de.highlightElement(o)}catch(d){console.warn("[codeblocksManager] hljs.highlightElement failed",d)}}else try{const f=o.textContent||"";try{if(de&&typeof de.getLanguage=="function"&&de.getLanguage("plaintext")){const m=de.highlight(f,{language:"plaintext"});m&&m.value&&(o.innerHTML=m.value)}}catch{try{de.highlightElement(o)}catch(h){console.warn("[codeblocksManager] fallback highlightElement failed",h)}}}catch(f){console.warn("[codeblocksManager] auto-detect plaintext failed",f)}}catch(l){console.warn("[codeblocksManager] observer entry processing failed",l)}})()})},{root:null,rootMargin:"300px",threshold:.1}),Qt)),r=e&&e.querySelectorAll?e.querySelectorAll("pre code"):[];if(!i){r.forEach(async a=>{try{const s=a.getAttribute&&a.getAttribute("class")||a.className||"",u=s.match(/language-([a-zA-Z0-9_+-]+)/)||s.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(u&&u[1]){const o=(u[1]||"").toLowerCase(),l=t[o]||o,c=ie.size&&(ie.get(l)||ie.get(String(l).toLowerCase()))||l;try{await mt(c)}catch(f){console.warn("[codeblocksManager] registerLanguage failed (no observer)",f)}}try{try{const o=a.textContent||a.innerText||"";o!=null&&(a.textContent=o)}catch{}try{a&&a.dataset&&a.dataset.highlighted&&delete a.dataset.highlighted}catch{}de.highlightElement(a)}catch(o){console.warn("[codeblocksManager] hljs.highlightElement failed (no observer)",o)}}catch(s){console.warn("[codeblocksManager] loadSupportedLanguages fallback ignored error",s)}});return}r.forEach(a=>{try{i.observe(a)}catch(s){console.warn("[codeblocksManager] observe failed",s)}})}function Fi(e,{useCdn:t=!0}={}){const n=document.querySelector("link[data-hl-theme]"),i=n&&n.getAttribute?n.getAttribute("data-hl-theme"):null,r=e==null?"default":String(e),a=r&&String(r).toLowerCase()||"";if(a==="default"||a==="monokai"){try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}return}if(i&&i.toLowerCase()===a)return;if(!t){console.warn("Requested highlight theme not bundled; set useCdn=true to load theme from CDN");return}const s=a,u=`https://cdn.jsdelivr.net/npm/highlight.js@${ji}/styles/${s}.css`,o=document.createElement("link");o.rel="stylesheet",o.href=u,o.setAttribute("data-hl-theme",s),o.addEventListener("load",()=>{try{n&&n.parentNode&&n.parentNode.removeChild(n)}catch{}}),document.head.appendChild(o)}let lt="light";function Zi(e,t={}){if(document.querySelector(`link[href="${e}"]`))return;const n=document.createElement("link");if(n.rel="stylesheet",n.href=e,Object.entries(t).forEach(([i,r])=>n.setAttribute(i,r)),document.head.appendChild(n),t["data-bulmaswatch-theme"])try{if(n.getAttribute("data-bulmaswatch-observer"))return;let i=Number(n.getAttribute("data-bulmaswatch-move-count")||0),r=!1;const a=new MutationObserver(()=>{try{if(r)return;const u=n.parentNode;if(!u||u.lastElementChild===n)return;if(i>=1e3){n.setAttribute("data-bulmaswatch-move-stopped","1");return}r=!0;try{u.appendChild(n)}catch{}i+=1,n.setAttribute("data-bulmaswatch-move-count",String(i)),r=!1}catch{}});try{a.observe(document.head,{childList:!0}),n.setAttribute("data-bulmaswatch-observer","1"),n.setAttribute("data-bulmaswatch-move-count",String(i))}catch{}const s=document.head;s&&s.lastElementChild!==n&&s.appendChild(n)}catch{}}function hr(){try{const e=Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));for(const t of e)t&&t.parentNode&&t.parentNode.removeChild(t)}catch{}try{const e=Array.from(document.querySelectorAll("style[data-bulma-override]"));for(const t of e)t&&t.parentNode&&t.parentNode.removeChild(t)}catch{}}async function dr(e="none",t="/"){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.debug("[bulmaManager] ensureBulma called",{bulmaCustomize:e,pageDir:t})}catch{}if(!e)return;if(e==="none"){try{const a=[location&&location.protocol&&location.protocol==="file:"?"https://unpkg.com/bulma/css/bulma.min.css":"//unpkg.com/bulma/css/bulma.min.css","https://unpkg.com/bulma/css/bulma.min.css"];let s=!1;for(const u of a)try{if(document.querySelector(`link[href="${u}"]`)){s=!0;break}}catch{}if(!s){const u=a[0],o=document.createElement("link");o.rel="stylesheet",o.href=u,o.setAttribute("data-bulma-base","1");const l=document.querySelector('link[href*="/dist/nimbi-cms.css"], link[href*="dist/nimbi-cms.css"]');l&&l.parentNode?l.parentNode.insertBefore(o,l):document.head.appendChild(o)}}catch{}try{const a=Array.from(document.querySelectorAll("link[data-bulmaswatch-theme]"));for(const s of a)s&&s.parentNode&&s.parentNode.removeChild(s)}catch{}try{const a=Array.from(document.querySelectorAll("style[data-bulma-override]"));for(const s of a)s&&s.parentNode&&s.parentNode.removeChild(s)}catch{}return}const i=[t+"bulma.css","/bulma.css"],r=Array.from(new Set(i));if(e==="local"){if(hr(),document.querySelector("style[data-bulma-override]"))return;for(const a of r)try{const s=await fetch(a,{method:"GET"});if(s.ok){const u=await s.text(),o=document.createElement("style");o.setAttribute("data-bulma-override",a),o.appendChild(document.createTextNode(`
/* bulma override: ${a} */
`+u)),document.head.appendChild(o);return}}catch(s){console.warn("[bulmaManager] fetch local bulma candidate failed",s)}return}try{const a=String(e).trim();if(!a)return;hr();const s=`https://unpkg.com/bulmaswatch/${encodeURIComponent(a)}/bulmaswatch.min.css`;Zi(s,{"data-bulmaswatch-theme":a})}catch(a){console.warn("[bulmaManager] ensureBulma failed",a)}}function pr(e){lt=e==="dark"?"dark":e==="system"?"system":"light";try{const t=Array.from(document.querySelectorAll(".nimbi-mount"));if(t.length>0)for(const n of t)lt==="dark"?n.setAttribute("data-theme","dark"):lt==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme");else{const n=document.documentElement;lt==="dark"?n.setAttribute("data-theme","dark"):lt==="light"?n.setAttribute("data-theme","light"):n.removeAttribute("data-theme")}}catch{}}function Gi(e){const t=document.documentElement;for(const[n,i]of Object.entries(e||{}))try{t.style.setProperty(`--${n}`,i)}catch(r){console.warn("[bulmaManager] setThemeVars failed for",n,r)}}function gr(e){if(!e||!(e instanceof HTMLElement))return()=>{};const t=e.closest&&e.closest(".nimbi-mount")||null;try{t&&(lt==="dark"?t.setAttribute("data-theme","dark"):lt==="light"?t.setAttribute("data-theme","light"):t.removeAttribute("data-theme"))}catch{}return()=>{}}const fr={en:{navigation:"Navigation",onThisPage:"On this page",home:"Home",scrollToTop:"Scroll to top",readingTime:"{minutes} min read",searchPlaceholder:"Search…",imagePreviewTitle:"Image preview",imagePreviewFit:"Fit to screen",imagePreviewOriginal:"Original size",imagePreviewZoomOut:"Zoom out",imagePreviewZoomIn:"Zoom in",imagePreviewClose:"Close"},es:{navigation:"Navegación",onThisPage:"En esta página",home:"Inicio",scrollToTop:"Ir arriba",readingTime:"{minutes} min de lectura",searchPlaceholder:"Buscar…",imagePreviewTitle:"Previsualización de imagen",imagePreviewFit:"Ajustar a la pantalla",imagePreviewOriginal:"Tamaño original",imagePreviewZoomOut:"Alejar",imagePreviewZoomIn:"Acercar",imagePreviewClose:"Cerrar"},de:{navigation:"Navigation",onThisPage:"Auf dieser Seite",home:"Startseite",scrollToTop:"Nach oben",readingTime:"{minutes} min Lesezeit",searchPlaceholder:"Suchen…",imagePreviewTitle:"Bildvorschau",imagePreviewFit:"An Bildschirm anpassen",imagePreviewOriginal:"Originalgröße",imagePreviewZoomOut:"Verkleinern",imagePreviewZoomIn:"Vergrößern",imagePreviewClose:"Schließen"},fr:{navigation:"Navigation",onThisPage:"Sur cette page",home:"Accueil",scrollToTop:"Aller en haut",readingTime:"{minutes} min de lecture",searchPlaceholder:"Rechercher…",imagePreviewTitle:"Aperçu de l’image",imagePreviewFit:"Ajuster à l’écran",imagePreviewOriginal:"Taille originale",imagePreviewZoomOut:"Dézoomer",imagePreviewZoomIn:"Zoomer",imagePreviewClose:"Fermer"},pt:{navigation:"Navegação",onThisPage:"Nesta página",home:"Início",scrollToTop:"Ir para o topo",readingTime:"{minutes} min de leitura",searchPlaceholder:"Procurar…",imagePreviewTitle:"Visualização da imagem",imagePreviewFit:"Ajustar à tela",imagePreviewOriginal:"Tamanho original",imagePreviewZoomOut:"Diminuir",imagePreviewZoomIn:"Aumentar",imagePreviewClose:"Fechar"}},bt=JSON.parse(JSON.stringify(fr));let Xt="en";if(typeof navigator<"u"){const e=navigator.language||navigator.languages&&navigator.languages[0]||"en";Xt=String(e).split("-")[0].toLowerCase()}fr[Xt]||(Xt="en");let rt=Xt;function wt(e,t={}){const n=bt[rt]||bt.en;let i=n&&n[e]?n[e]:bt.en[e]||"";for(const r of Object.keys(t))i=i.replace(new RegExp(`{${r}}`,"g"),String(t[r]));return i}async function An(e,t){if(!e)return;let n=e;try{/^https?:\/\//.test(e)||(n=new URL(e,location.origin+t).toString());const i=await fetch(n);if(!i.ok)return;const r=await i.json();for(const a of Object.keys(r||{}))bt[a]=Object.assign({},bt[a]||{},r[a])}catch{}}function En(e){const t=String(e).split("-")[0].toLowerCase();rt=bt[t]?t:"en"}const Qi=Object.freeze(Object.defineProperty({__proto__:null,get currentLang(){return rt},loadL10nFile:An,setLang:En,t:wt},Symbol.toStringTag,{value:"Module"})),Xi=`import { buildSearchIndex, crawlForSlug } from '../slugManager.js'

/**
 * Worker entrypoint for slug-related background tasks.
 */

/**
 * Worker \`onmessage\` handler for slug-related background tasks.
 * @param {MessageEvent} ev - Message event; \`ev.data\` should be the request
 * (e.g. \`{ type: 'buildSearchIndex', id, contentBase }\` or \`{ type: 'crawlForSlug', id, slug, base?, maxQueue? }\`).
 * @returns {Promise<void>} Posts \`{id, result}\` or \`{id, error}\` back to the caller.
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

/**
 * Helper to process slug-worker messages outside of a Worker.
 * @param {Object} msg - Message object for slug worker (see onmessage shapes above).
 * @returns {Promise<Object>} Response object matching worker posts (\`{id, result}\` or \`{id, error}\`).
 */
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
`;function Ki(e,t="worker"){let n=null;const i=typeof globalThis<"u"&&typeof globalThis.__nimbiCMSDebug<"u"?!!globalThis.__nimbiCMSDebug:!1;function r(...l){try{i&&console&&typeof console.warn=="function"&&console.warn(...l)}catch{}}function a(){if(!n)try{const l=e();n=l||null,l&&l.addEventListener("error",()=>{try{n===l&&(n=null,l.terminate&&l.terminate())}catch(c){r("["+t+"] worker termination failed",c)}})}catch(l){n=null,r("["+t+"] worker init failed",l)}return n}function s(){try{n&&(n.terminate&&n.terminate(),n=null)}catch(l){r("["+t+"] worker termination failed",l)}}function u(l,c=1e4){return new Promise((f,m)=>{const h=a();if(!h)return m(new Error("worker unavailable"));const d=String(Math.random()),p=Object.assign({},l,{id:d});let g=null;const w=()=>{g&&clearTimeout(g),h.removeEventListener("message",y),h.removeEventListener("error",k)},y=v=>{const $=v.data||{};$.id===d&&(w(),$.error?m(new Error($.error)):f($.result))},k=v=>{w(),r("["+t+"] worker error event",v);try{n===h&&(n=null,h.terminate&&h.terminate())}catch($){r("["+t+"] worker termination failed",$)}m(new Error(v&&v.message||"worker error"))};g=setTimeout(()=>{w(),r("["+t+"] worker timed out");try{n===h&&(n=null,h.terminate&&h.terminate())}catch(v){r("["+t+"] worker termination on timeout failed",v)}m(new Error("worker timeout"))},c),h.addEventListener("message",y),h.addEventListener("error",k);try{h.postMessage(p)}catch(v){w(),m(v)}})}return{get:a,send:u,terminate:s}}function mr(e,t="worker-pool",n=2){const i=new Array(n).fill(null);let r=0;const a=typeof globalThis<"u"&&typeof globalThis.__nimbiCMSDebug<"u"?!!globalThis.__nimbiCMSDebug:!1;function s(...p){try{a&&console&&typeof console.warn=="function"&&console.warn(...p)}catch{}}function u(p){if(!i[p])try{const g=e();i[p]=g||null,g&&g.addEventListener("error",()=>{try{i[p]===g&&(i[p]=null,g.terminate&&g.terminate())}catch(w){s("["+t+"] worker termination failed",w)}})}catch(g){i[p]=null,s("["+t+"] worker init failed",g)}return i[p]}const o=new Array(n).fill(0),l=new Array(n).fill(null),c=30*1e3;function f(p){try{o[p]=Date.now(),l[p]&&(clearTimeout(l[p]),l[p]=null),l[p]=setTimeout(()=>{try{i[p]&&(i[p].terminate&&i[p].terminate(),i[p]=null)}catch(g){s("["+t+"] idle termination failed",g)}l[p]=null},c)}catch{}}function m(){for(let p=0;p<i.length;p++){const g=u(p);if(g)return g}return null}function h(){for(let p=0;p<i.length;p++)try{i[p]&&(i[p].terminate&&i[p].terminate(),i[p]=null)}catch(g){s("["+t+"] worker termination failed",g)}}function d(p,g=1e4){return new Promise((w,y)=>{const k=r++%i.length,v=$=>{const N=(k+$)%i.length,U=u(N);if(!U)return $+1<i.length?v($+1):y(new Error("worker pool unavailable"));const z=String(Math.random()),K=Object.assign({},p,{id:z});let le=null;const L=()=>{le&&clearTimeout(le),U.removeEventListener("message",j),U.removeEventListener("error",_e)},j=V=>{const H=V.data||{};H.id===z&&(L(),H.error?y(new Error(H.error)):w(H.result))},_e=V=>{L(),s("["+t+"] worker error event",V);try{i[N]===U&&(i[N]=null,U.terminate&&U.terminate())}catch(H){s("["+t+"] worker termination failed",H)}y(new Error(V&&V.message||"worker error"))};le=setTimeout(()=>{L(),s("["+t+"] worker timed out");try{i[N]===U&&(i[N]=null,U.terminate&&U.terminate())}catch(V){s("["+t+"] worker termination on timeout failed",V)}y(new Error("worker timeout"))},g),U.addEventListener("message",j),U.addEventListener("error",_e);try{f(N),U.postMessage(K)}catch(V){L(),y(V)}};v(0)})}return{get:m,send:d,terminate:h}}function Et(e){try{if(typeof Blob<"u"&&typeof URL<"u"&&e)try{Et._blobUrlCache||(Et._blobUrlCache=new Map);const t=Et._blobUrlCache;let n=t.get(e);if(!n){const i=new Blob([e],{type:"application/javascript"});n=URL.createObjectURL(i),t.set(e,n)}return new Worker(n,{type:"module"})}catch(t){try{typeof globalThis<"u"&&globalThis.__nimbiCMSDebug&&console&&typeof console.warn=="function"&&console.warn("[worker-manager] createWorkerFromRaw failed",t)}catch{}}}catch(t){try{typeof globalThis<"u"&&globalThis.__nimbiCMSDebug&&console&&typeof console.warn=="function"&&console.warn("[worker-manager] createWorkerFromRaw failed",t)}catch{}}return null}const Fe=new Set;function Ln(e){Yi(),Fe.clear();for(const t of qe)t&&Fe.add(t);br(ne),br(F),Ln._refreshed=!0}function br(e){if(!(!e||typeof e.values!="function"))for(const t of e.values())t&&Fe.add(t)}function wr(e){if(!e||typeof e.set!="function")return;const t=e.set;e.set=function(n,i){return i&&Fe.add(i),t.call(this,n,i)}}let yr=!1;function Yi(){yr||(wr(ne),wr(F),yr=!0)}function kr(e){return!e||typeof e!="string"?!1:/^(https?:)?\/\//.test(e)||e.startsWith("mailto:")||e.startsWith("tel:")}function ke(e){return String(e||"").replace(/^[.\/]+/,"")}function Lt(e){return String(e||"").replace(/\/+$/,"")}function ct(e){return Lt(e)+"/"}function Vi(e){try{if(!e||typeof document>"u"||!document.head||e.startsWith("data:")||document.head.querySelector(`link[rel="preload"][as="image"][href="${e}"]`))return;const n=document.createElement("link");n.rel="preload",n.as="image",n.href=e,document.head.appendChild(n)}catch(t){console.warn("[helpers] preloadImage failed",t)}}function Kt(e,t=0,n=!1){try{if(typeof window>"u"||!e||!e.querySelectorAll)return;const i=Array.from(e.querySelectorAll("img"));if(!i.length)return;const r=e,a=r&&r.getBoundingClientRect?r.getBoundingClientRect():null,s=0,u=typeof window<"u"&&(window.innerHeight||document.documentElement.clientHeight)||0,o=a?Math.max(s,a.top):s,c=(a?Math.min(u,a.bottom):u)+Number(t||0);let f=0;r&&(f=r.clientHeight||(a?a.height:0)),f||(f=u-s);let m=.6;try{const g=r&&window.getComputedStyle?window.getComputedStyle(r):null,w=g&&g.getPropertyValue("--nimbi-image-max-height-ratio"),y=w?parseFloat(w):NaN;!Number.isNaN(y)&&y>0&&y<=1&&(m=y)}catch(g){console.warn("[helpers] read CSS ratio failed",g)}const h=Math.max(200,Math.floor(f*m));let d=!1,p=null;if(i.forEach(g=>{try{const w=g.getAttribute?g.getAttribute("loading"):void 0;w!=="eager"&&g.setAttribute&&g.setAttribute("loading","lazy");const y=g.getBoundingClientRect?g.getBoundingClientRect():null,k=g.src||g.getAttribute&&g.getAttribute("src"),v=y&&y.height>1?y.height:h,$=y?y.top:0,N=$+v;y&&v>0&&$<=c&&N>=o&&(g.setAttribute?(g.setAttribute("loading","eager"),g.setAttribute("fetchpriority","high"),g.setAttribute("data-eager-by-nimbi","1")):(g.loading="eager",g.fetchPriority="high"),Vi(k),d=!0),!p&&y&&y.top<=c&&(p={img:g,src:k,rect:y,beforeLoading:w})}catch(w){console.warn("[helpers] setEagerForAboveFoldImages per-image failed",w)}}),!d&&p){const{img:g,src:w,rect:y,beforeLoading:k}=p;try{g.setAttribute?(g.setAttribute("loading","eager"),g.setAttribute("fetchpriority","high"),g.setAttribute("data-eager-by-nimbi","1")):(g.loading="eager",g.fetchPriority="high")}catch(v){console.warn("[helpers] setEagerForAboveFoldImages fallback failed",v)}}}catch(i){console.warn("[helpers] setEagerForAboveFoldImages failed",i)}}function ve(e,t=null,n){try{const i=typeof n=="string"?n:typeof window<"u"&&window.location?window.location.search:"",r=new URLSearchParams(i.startsWith("?")?i.slice(1):i),a=String(e||"");r.delete("page");const s=new URLSearchParams;s.set("page",a);for(const[l,c]of r.entries())s.append(l,c);const u=s.toString();let o=u?`?${u}`:"";return t&&(o+=`#${encodeURIComponent(t)}`),o||`?page=${encodeURIComponent(a)}`}catch{const r=`?page=${encodeURIComponent(String(e||""))}`;return t?`${r}#${encodeURIComponent(t)}`:r}}function Yt(e){try{const t=e();return t&&typeof t.then=="function"?t.catch(n=>{console.warn("[helpers] safe swallowed error",n)}):t}catch(t){console.warn("[helpers] safe swallowed error",t)}}try{typeof globalThis<"u"&&!globalThis.safe&&(globalThis.safe=Yt)}catch(e){console.warn("[helpers] global attach failed",e)}function Ji(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}}const ne=new Map;let Ne=[],Tn=!1;function ea(e){Tn=!!e}function _r(e){Ne=Array.isArray(e)?e.slice():[]}function ta(){return Ne}const xr=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2,Sr=mr(()=>Et(Xi),"slugManager",xr);function na(){return Sr.get()}function vr(e){return Sr.send(e,5e3)}async function ra(e,t=1,n=void 0){const i=await Promise.resolve().then(()=>_t);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return await vr({type:"buildSearchIndex",contentBase:e,indexDepth:t,noIndexing:n})}async function ia(e,t,n){const i=await Promise.resolve().then(()=>_t);if(!(i.initSlugWorker&&i.initSlugWorker()))throw new Error("slug worker required but unavailable");return vr({type:"crawlForSlug",slug:e,base:t,maxQueue:n})}function it(e,t){if(e)if(Ne&&Ne.length){const i=t.split("/")[0],r=Ne.includes(i);let a=ne.get(e);(!a||typeof a=="string")&&(a={default:typeof a=="string"?a:void 0,langs:{}}),r?a.langs[i]=t:a.default=t,ne.set(e,a)}else ne.set(e,t)}const Vt=new Set;function aa(e){typeof e=="function"&&Vt.add(e)}function sa(e){typeof e=="function"&&Vt.delete(e)}const F=new Map;let Cn={},qe=[],yt="_404.md",kt="_home.md";function Mn(e){e!=null&&(yt=String(e||""))}function oa(e){e!=null&&(kt=String(e||""))}function la(e){Cn=e||{}}const Tt=new Map,Jt=new Set;function ca(){Tt.clear(),Jt.clear()}function ua(e){if(!e||e.length===0)return"";let t=e[0];for(let i=1;i<e.length;i++){const r=e[i];let a=0;const s=Math.min(t.length,r.length);for(;a<s&&t[a]===r[a];)a++;t=t.slice(0,a)}const n=t.lastIndexOf("/");return n===-1?t:t.slice(0,n+1)}function en(e){ne.clear(),F.clear(),qe=[],Ne=Ne||[];const t=Object.keys(Cn||{});if(!t.length)return;let n="";try{if(e){try{/^[a-z][a-z0-9+.-]*:/i.test(String(e))?n=new URL(String(e)).pathname:n=String(e||"")}catch(i){n=String(e||""),console.warn("[slugManager] parse contentBase failed",i)}n=ct(n)}}catch(i){n="",console.warn("[slugManager] setContentBase prefix derivation failed",i)}n||(n=ua(t));for(const i of t){let r=i;n&&i.startsWith(n)?r=ke(i.slice(n.length)):r=ke(i),qe.push(r);try{Ln()}catch(s){console.warn("[slugManager] refreshIndexPaths failed",s)}const a=Cn[i];if(typeof a=="string"){const s=(a||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const u=fe(s[1].trim());if(u)try{let o=u;if((!Ne||!Ne.length)&&(o=Ar(o,new Set(ne.keys()))),Ne&&Ne.length){const c=r.split("/")[0],f=Ne.includes(c);let m=ne.get(o);(!m||typeof m=="string")&&(m={default:typeof m=="string"?m:void 0,langs:{}}),f?m.langs[c]=r:m.default=r,ne.set(o,m)}else ne.set(o,r);F.set(r,o)}catch(o){console.warn("[slugManager] set slug mapping failed",o)}}}}}try{en()}catch(e){console.warn("[slugManager] initial setContentBase failed",e)}function fe(e){let n=String(e||"").toLowerCase().replace(/[^a-z0-9\- ]/g,"").replace(/ /g,"-");return n=n.replace(/(?:-?)(?:md|html)$/,""),n=n.replace(/-+/g,"-"),n=n.replace(/^-|-$/g,""),n.length>80&&(n=n.slice(0,80).replace(/-+$/g,"")),n}function Ar(e,t){if(!t.has(e))return e;let n=2,i=`${e}-${n}`;for(;t.has(i);)n+=1,i=`${e}-${n}`;return i}function ha(e){return Ct(e,void 0)}function Ct(e,t){if(!e)return!1;if(e.startsWith("//"))return!0;if(/^[a-z][a-z0-9+.-]*:/i.test(e)){if(t&&typeof t=="string")try{const n=new URL(e),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!0}if(e.startsWith("/")&&t&&typeof t=="string")try{const n=new URL(e,t),i=new URL(t);return n.origin!==i.origin?!0:!n.pathname.startsWith(i.pathname)}catch{return!0}return!1}function tn(e){return e==null?e:String(e).replace(/\\([\\`*_{}\[\]()#+\-.!])/g,(t,n)=>n)}function Mt(e){if(!e||!ne.has(e))return null;const t=ne.get(e);if(!t)return null;if(typeof t=="string")return t;if(Ne&&Ne.length&&rt&&t.langs&&t.langs[rt])return t.langs[rt];if(t.default)return t.default;if(t.langs){const n=Object.keys(t.langs);if(n.length)return t.langs[n[0]]}return null}const Rt=new Map;function da(){Rt.clear()}let Me=async function(e,t){if(!e)throw new Error("path required");try{const a=(String(e||"").match(/([^\/]+)\.md(?:$|[?#])/)||[])[1];if(a&&ne.has(a)){const s=Mt(a)||ne.get(a);s&&s!==e&&(e=s)}}catch(a){console.warn("[slugManager] slug mapping normalization failed",a)}const n=t==null?"":Lt(String(t));let i="";try{const a=typeof location<"u"&&location.origin?location.origin:"http://localhost";if(n&&n.startsWith("/")&&!/^[a-z][a-z0-9+.-]*:/i.test(n))i=n.replace(/\/$/,"")+"/"+e.replace(/^\//,"");else{let s=a+"/";n&&(/^[a-z][a-z0-9+.-]*:/i.test(n)?s=n.replace(/\/$/,"")+"/":n.startsWith("/")?s=a+n.replace(/\/$/,"")+"/":s=a+"/"+n.replace(/\/$/,"")+"/"),i=new URL(e.replace(/^\//,""),s).toString()}}catch{i=(typeof location<"u"&&location.origin?location.origin:"http://localhost")+"/"+e.replace(/^\//,"")}if(Rt.has(i))return Rt.get(i);const r=(async()=>{const a=await fetch(i);if(!a||typeof a.ok!="boolean"||!a.ok){if(a&&a.status===404)try{const f=`${n}/${yt}`,m=await globalThis.fetch(f);if(m&&typeof m.ok=="boolean"&&m.ok)return{raw:await m.text(),status:404}}catch(f){console.warn("[slugManager] fetching fallback 404 failed",f)}let c="";try{a&&typeof a.clone=="function"?c=await a.clone().text():a&&typeof a.text=="function"?c=await a.text():c=""}catch(f){c="",console.warn("[slugManager] reading error body failed",f)}throw console.error("fetchMarkdown failed:",{url:i,status:a?a.status:void 0,statusText:a?a.statusText:void 0,body:c.slice(0,200)}),new Error("failed to fetch md")}const s=await a.text(),u=s.trim().slice(0,128).toLowerCase(),o=/^(?:<!doctype|<html|<title|<h1)/.test(u),l=o||String(e||"").toLowerCase().endsWith(".html");if(o&&String(e||"").toLowerCase().endsWith(".md")){try{const c=`${n}/${yt}`,f=await globalThis.fetch(c);if(f.ok)return{raw:await f.text(),status:404}}catch(c){console.warn("[slugManager] fetching fallback 404 failed",c)}throw console.error("fetchMarkdown: server returned HTML for .md request",i),new Error("failed to fetch md")}return l?{raw:s,isHtml:!0}:{raw:s}})();return Rt.set(i,r),r};function pa(e){typeof e=="function"&&(Me=e)}const nn=new Map;function ga(e){if(!e||typeof e!="string")return"";let t=e.replace(/```[\s\S]*?```/g,"");return t=t.replace(/<pre[\s\S]*?<\/pre>/gi,""),t=t.replace(/<code[\s\S]*?<\/code>/gi,""),t=t.replace(/<!--([\s\S]*?)-->/g,""),t=t.replace(/^ {4,}.*$/gm,""),t=t.replace(/`[^`]*`/g,""),t}let Je=[],$t=null;async function Er(e,t=1,n=void 0){const i=Array.isArray(n)?Array.from(new Set((n||[]).map(r=>ke(String(r||""))))):[];try{const r=ke(String(yt||""));r&&!i.includes(r)&&i.push(r)}catch{}if(Je&&Je.length&&t===1&&!Je.some(a=>{try{return i.includes(ke(String(a.path||"")))}catch{return!1}}))return Je;if($t)return $t;$t=(async()=>{let r=Array.isArray(n)?Array.from(new Set((n||[]).map(l=>ke(String(l||""))))):[];try{const l=ke(String(yt||""));l&&!r.includes(l)&&r.push(l)}catch{}const a=l=>{if(!r||!r.length)return!1;for(const c of r)if(c&&(l===c||l.startsWith(c+"/")))return!0;return!1};let s=[];if(qe&&qe.length&&(s=Array.from(qe)),!s.length)for(const l of ne.values())l&&s.push(l);try{const l=await Rr(e);l&&l.length&&(s=s.concat(l))}catch(l){console.warn("[slugManager] crawlAllMarkdown during buildSearchIndex failed",l)}try{const l=new Set(s),c=[...s],f=Math.max(1,xr),m=async()=>{for(;!(l.size>zt);){const d=c.shift();if(!d)break;try{const p=await Me(d,e);if(p&&p.raw){if(p.status===404)continue;let g=p.raw;const w=[],y=String(d||"").replace(/^.*\//,"");if(/^readme(?:\.md)?$/i.test(y)&&Tn&&(!d||!d.includes("/")))continue;const k=ga(g),v=/\[[^\]]+\]\(([^)]+)\)/g;let $;for(;$=v.exec(k);)w.push($[1]);const N=/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;for(;$=N.exec(k);)w.push($[1]);const U=d&&d.includes("/")?d.substring(0,d.lastIndexOf("/")+1):"";for(let z of w)try{if(Ct(z,e)||z.startsWith("..")||z.indexOf("/../")!==-1||(U&&!z.startsWith("./")&&!z.startsWith("/")&&!z.startsWith("../")&&(z=U+z),z=ke(z),!/\.(md|html?)(?:$|[?#])/i.test(z))||(z=z.split(/[?#]/)[0],a(z)))continue;l.has(z)||(l.add(z),c.push(z),s.push(z))}catch(K){console.warn("[slugManager] href processing failed",z,K)}}}catch(p){console.warn("[slugManager] discovery fetch failed for",d,p)}}},h=[];for(let d=0;d<f;d++)h.push(m());await Promise.all(h)}catch(l){console.warn("[slugManager] discovery loop failed",l)}const u=new Set;s=s.filter(l=>!l||u.has(l)||a(l)?!1:(u.add(l),!0));const o=[];for(const l of s)if(/\.(?:md|html?)(?:$|[?#])/i.test(l))try{const c=await Me(l,e);if(c&&c.raw){if(c.status===404)continue;let f="",m="";if(c.isHtml)try{const p=new DOMParser().parseFromString(c.raw,"text/html"),g=p.querySelector("title")||p.querySelector("h1");g&&g.textContent&&(f=g.textContent.trim());const w=p.querySelector("p");if(w&&w.textContent&&(m=w.textContent.trim()),t>=2)try{const y=p.querySelector("h1"),k=y&&y.textContent?y.textContent.trim():f||"",v=(()=>{try{if(F.has(l))return F.get(l)}catch{}return fe(f||l)})(),$=Array.from(p.querySelectorAll("h2"));for(const N of $)try{const U=(N.textContent||"").trim();if(!U)continue;const z=N.id?N.id:fe(U),K=v?`${v}::${z}`:`${fe(l)}::${z}`;let le="",L=N.nextElementSibling;for(;L&&L.tagName&&L.tagName.toLowerCase()==="script";)L=L.nextElementSibling;L&&L.textContent&&(le=String(L.textContent).trim()),o.push({slug:K,title:U,excerpt:le,path:l,parentTitle:k})}catch(U){console.warn("[slugManager] indexing H2 failed",U)}if(t===3)try{const N=Array.from(p.querySelectorAll("h3"));for(const U of N)try{const z=(U.textContent||"").trim();if(!z)continue;const K=U.id?U.id:fe(z),le=v?`${v}::${K}`:`${fe(l)}::${K}`;let L="",j=U.nextElementSibling;for(;j&&j.tagName&&j.tagName.toLowerCase()==="script";)j=j.nextElementSibling;j&&j.textContent&&(L=String(j.textContent).trim()),o.push({slug:le,title:z,excerpt:L,path:l,parentTitle:k})}catch(z){console.warn("[slugManager] indexing H3 failed",z)}}catch(N){console.warn("[slugManager] collect H3s failed",N)}}catch(y){console.warn("[slugManager] collect H2s failed",y)}}catch(d){console.warn("[slugManager] parsing HTML for index failed",d)}else{const d=c.raw,p=d.match(/^#\s+(.+)$/m);f=p?p[1].trim():"";try{f=tn(f)}catch{}const g=d.split(/\r?\n\s*\r?\n/);if(g.length>1)for(let w=1;w<g.length;w++){const y=g[w].trim();if(y&&!/^#/.test(y)){m=y.replace(/\r?\n/g," ");break}}if(t>=2){let w="",y="";try{const k=(d.match(/^#\s+(.+)$/m)||[])[1];w=k?k.trim():"",y=(function(){try{if(F.has(l))return F.get(l)}catch{}return fe(f||l)})();const v=/^##\s+(.+)$/gm;let $;for(;$=v.exec(d);)try{const N=($[1]||"").trim(),U=tn(N);if(!N)continue;const z=fe(N),K=y?`${y}::${z}`:`${fe(l)}::${z}`,L=d.slice(v.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),j=L&&L[1]?String(L[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:K,title:U,excerpt:j,path:l,parentTitle:w})}catch(N){console.warn("[slugManager] indexing markdown H2 failed",N)}}catch(k){console.warn("[slugManager] collect markdown H2s failed",k)}if(t===3)try{const k=/^###\s+(.+)$/gm;let v;for(;v=k.exec(d);)try{const $=(v[1]||"").trim(),N=tn($);if(!$)continue;const U=fe($),z=y?`${y}::${U}`:`${fe(l)}::${U}`,le=d.slice(k.lastIndex).match(/^(?:\r?\n)*([^\r\n][^\r\n]*(?:\r?\n[^\r\n].*)*)/),L=le&&le[1]?String(le[1]).trim().split(/\r?\n/).join(" ").slice(0,300):"";o.push({slug:z,title:N,excerpt:L,path:l,parentTitle:w})}catch($){console.warn("[slugManager] indexing markdown H3 failed",$)}}catch(k){console.warn("[slugManager] collect markdown H3s failed",k)}}}let h="";try{F.has(l)&&(h=F.get(l))}catch(d){console.warn("[slugManager] mdToSlug access failed",d)}h||(h=fe(f||l)),o.push({slug:h,title:f,excerpt:m,path:l})}}catch(c){console.warn("[slugManager] buildSearchIndex: entry fetch failed",c)}try{Je=o.filter(c=>{try{return!a(String(c.path||""))}catch{return!0}})}catch(l){console.warn("[slugManager] filtering index by excludes failed",l),Je=o}return Je})();try{await $t}catch(r){console.warn("[slugManager] awaiting _indexPromise failed",r)}return $t=null,Je}const Lr=1e3;let zt=Lr;function fa(e){typeof e=="number"&&e>=0&&(zt=e)}const Tr=new DOMParser,Cr="a[href]";let Mr=async function(e,t,n=zt){if(nn.has(e))return nn.get(e);let i=null;const r=new Set,a=[""],s=typeof location<"u"&&location.origin?location.origin:"http://localhost";let u=s+"/";try{t&&(/^[a-z][a-z0-9+.-]*:/i.test(String(t))?u=String(t).replace(/\/$/,"")+"/":String(t).startsWith("/")?u=s+String(t).replace(/\/$/,"")+"/":u=s+"/"+String(t).replace(/\/$/,"")+"/")}catch{u=s+"/"}for(;a.length&&!i&&!(a.length>n);){const o=a.shift();if(r.has(o))continue;r.add(o);let l="";try{l=new URL(o||"",u).toString()}catch{l=(String(t||"")||s)+"/"+String(o||"").replace(/^\//,"")}try{let c;try{c=await globalThis.fetch(l)}catch(p){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:l,error:p});continue}if(!c||!c.ok){c&&!c.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:l,status:c.status});continue}const f=await c.text(),h=Tr.parseFromString(f,"text/html").querySelectorAll(Cr),d=l;for(const p of h)try{let g=p.getAttribute("href")||"";if(!g||Ct(g,t)||g.startsWith("..")||g.indexOf("/../")!==-1)continue;if(g.endsWith("/")){try{const w=new URL(g,d),y=new URL(u).pathname,k=w.pathname.startsWith(y)?w.pathname.slice(y.length):w.pathname.replace(/^\//,""),v=ct(ke(k));r.has(v)||a.push(v)}catch{const y=ke(o+g);r.has(y)||a.push(y)}continue}if(g.toLowerCase().endsWith(".md")){let w="";try{const y=new URL(g,d),k=new URL(u).pathname;w=y.pathname.startsWith(k)?y.pathname.slice(k.length):y.pathname.replace(/^\//,"")}catch{w=(o+g).replace(/^\//,"")}w=ke(w);try{if(F.has(w))continue;for(const y of ne.values());}catch(y){console.warn("[slugManager] slug map access failed",y)}try{const y=await Me(w,t);if(y&&y.raw){const k=(y.raw||"").match(/^#\s+(.+)$/m);if(k&&k[1]&&fe(k[1].trim())===e){i=w;break}}}catch(y){console.warn("[slugManager] crawlForSlug: fetchMarkdown failed",y)}}}catch(g){console.warn("[slugManager] crawlForSlug: link iteration failed",g)}}catch(c){console.warn("[slugManager] crawlForSlug: directory fetch failed",c)}}return nn.set(e,i),i};async function Rr(e,t=zt){const n=new Set,i=new Set,r=[""],a=typeof location<"u"&&location.origin?location.origin:"http://localhost";let s=a+"/";try{e&&(/^[a-z][a-z0-9+.-]*:/i.test(String(e))?s=String(e).replace(/\/$/,"")+"/":String(e).startsWith("/")?s=a+String(e).replace(/\/$/,"")+"/":s=a+"/"+String(e).replace(/\/$/,"")+"/")}catch{s=a+"/"}for(;r.length&&!(r.length>t);){const u=r.shift();if(i.has(u))continue;i.add(u);let o="";try{o=new URL(u||"",s).toString()}catch{o=(String(e||"")||a)+"/"+String(u||"").replace(/^\//,"")}try{let l;try{l=await globalThis.fetch(o)}catch(d){console.warn("[slugManager] crawlAllMarkdown: fetch failed",{url:o,error:d});continue}if(!l||!l.ok){l&&!l.ok&&console.warn("[slugManager] crawlAllMarkdown: directory fetch non-ok",{url:o,status:l.status});continue}const c=await l.text(),m=Tr.parseFromString(c,"text/html").querySelectorAll(Cr),h=o;for(const d of m)try{let p=d.getAttribute("href")||"";if(!p||Ct(p,e)||p.startsWith("..")||p.indexOf("/../")!==-1)continue;if(p.endsWith("/")){try{const w=new URL(p,h),y=new URL(s).pathname,k=w.pathname.startsWith(y)?w.pathname.slice(y.length):w.pathname.replace(/^\//,""),v=ct(ke(k));i.has(v)||r.push(v)}catch{const y=u+p;i.has(y)||r.push(y)}continue}let g="";try{const w=new URL(p,h),y=new URL(s).pathname;g=w.pathname.startsWith(y)?w.pathname.slice(y.length):w.pathname.replace(/^\//,"")}catch{g=(u+p).replace(/^\//,"")}g=ke(g),/\.(md|html?)$/i.test(g)&&n.add(g)}catch(p){console.warn("[slugManager] crawlAllMarkdown: link iteration failed",p)}}catch(l){console.warn("[slugManager] crawlAllMarkdown: directory fetch failed",l)}}return Array.from(n)}async function $r(e,t,n){if(e&&typeof e=="string"&&(e=ke(e),e=Lt(e)),ne.has(e))return Mt(e)||ne.get(e);for(const r of Vt)try{const a=await r(e,t);if(a)return it(e,a),F.set(a,e),a}catch(a){console.warn("[slugManager] slug resolver failed",a)}if(qe&&qe.length){if(Tt.has(e)){const r=Tt.get(e);return ne.set(e,r),F.set(r,e),r}for(const r of qe)if(!Jt.has(r))try{const a=await Me(r,t);if(a&&a.raw){const s=(a.raw||"").match(/^#\s+(.+)$/m);if(s&&s[1]){const u=fe(s[1].trim());if(Jt.add(r),u&&Tt.set(u,r),u===e)return it(e,r),F.set(r,e),r}}}catch(a){console.warn("[slugManager] manifest title fetch failed",a)}}try{const r=await Er(t);if(r&&r.length){const a=r.find(s=>s.slug===e);if(a)return it(e,a.path),F.set(a.path,e),a.path}}catch(r){console.warn("[slugManager] buildSearchIndex lookup failed",r)}try{const r=await Mr(e,t,n);if(r)return it(e,r),F.set(r,e),r}catch(r){console.warn("[slugManager] crawlForSlug lookup failed",r)}const i=[`${e}.html`,`${e}.md`];for(const r of i)try{const a=await Me(r,t);if(a&&a.raw)return it(e,r),F.set(r,e),r}catch(a){console.warn("[slugManager] candidate fetch failed",a)}if(qe&&qe.length)for(const r of qe)try{const a=r.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(fe(a)===e)return it(e,r),F.set(r,e),r}catch(a){console.warn("[slugManager] build-time filename match failed",a)}try{const r=[];kt&&typeof kt=="string"&&kt.trim()&&r.push(kt),r.includes("_home.md")||r.push("_home.md");for(const a of r)try{const s=await Me(a,t);if(s&&s.raw){const u=(s.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]&&fe(u[1].trim())===e)return it(e,a),F.set(a,e),a}}catch{}}catch(r){console.warn("[slugManager] home page fetch failed",r)}return null}const _t=Object.freeze(Object.defineProperty({__proto__:null,CRAWL_MAX_QUEUE:Lr,_setAllMd:la,_storeSlugMapping:it,addSlugResolver:aa,get allMarkdownPaths(){return qe},get availableLanguages(){return Ne},buildSearchIndex:Er,buildSearchIndexWorker:ra,clearFetchCache:da,clearListCaches:ca,crawlAllMarkdown:Rr,crawlCache:nn,crawlForSlug:Mr,crawlForSlugWorker:ia,get defaultCrawlMaxQueue(){return zt},ensureSlug:$r,fetchCache:Rt,get fetchMarkdown(){return Me},getLanguages:ta,get homePage(){return kt},initSlugWorker:na,isExternalLink:ha,isExternalLinkWithBase:Ct,listPathsFetched:Jt,listSlugCache:Tt,mdToSlug:F,get notFoundPage(){return yt},removeSlugResolver:sa,resolveSlugPath:Mt,get searchIndex(){return Je},setContentBase:en,setDefaultCrawlMaxQueue:fa,setFetchMarkdown:pa,setHomePage:oa,setLanguages:_r,setNotFoundPage:Mn,setSkipRootReadme:ea,get skipRootReadme(){return Tn},slugResolvers:Vt,slugToMd:ne,slugify:fe,unescapeMarkdown:tn,uniqueSlug:Ar},Symbol.toStringTag,{value:"Module"}));let zr=100;function Pr(e){zr=e}let Pt=300*1e3;function Ir(e){Pt=e}const He=new Map;function ma(e){if(!He.has(e))return;const t=He.get(e),n=Date.now();if(t.ts+Pt<n){He.delete(e);return}return He.delete(e),He.set(e,t),t.value}function ba(e,t){if(Nr(),Nr(),He.delete(e),He.set(e,{value:t,ts:Date.now()}),He.size>zr){const n=He.keys().next().value;n!==void 0&&He.delete(n)}}function Nr(){if(!Pt||Pt<=0)return;const e=Date.now();for(const[t,n]of He.entries())n.ts+Pt<e&&He.delete(t)}async function wa(e,t){const n=new Set(Fe),i=document.querySelectorAll(".nimbi-site-navbar a, .navbar a, .nimbi-nav a");for(const r of Array.from(i||[])){const a=r.getAttribute("href")||"";if(a)try{const s=new URL(a,location.href);if(s.origin!==location.origin)continue;const u=(s.hash||s.pathname).match(/([^#?]+\.md)(?:$|[?#])/)||(s.pathname||"").match(/([^#?]+\.md)(?:$|[?#])/);if(u){let f=ke(u[1]);f&&n.add(f);continue}const o=(r.textContent||"").trim(),l=(s.pathname||"").replace(/^.*\//,"");if(o&&fe(o)===e||l&&fe(l.replace(/\.(html?|md)$/i,""))===e)return s.toString();if(/\.(html?)$/i.test(s.pathname)){let f=s.pathname.replace(/^\//,"");n.add(f);continue}const c=s.pathname||"";if(c){const f=new URL(t),m=ct(f.pathname);if(c.indexOf(m)!==-1){let h=c.startsWith(m)?c.slice(m.length):c;h=ke(h),h&&n.add(h)}}}catch(s){console.warn("[router] malformed URL while discovering index candidates",s)}}for(const r of n)try{if(!r||!String(r).includes(".md"))continue;const a=await Me(r,t);if(!a||!a.raw)continue;const s=(a.raw||"").match(/^#\s+(.+)$/m);if(s){const u=(s[1]||"").trim();if(u&&fe(u)===e)return r}}catch(a){console.warn("[router] fetchMarkdown during index discovery failed",a)}return null}function ya(e){const t=[];if(String(e).includes(".md")||String(e).includes(".html"))/index\.html$/i.test(e)||t.push(e);else try{const n=decodeURIComponent(String(e||""));if(ne.has(n)){const i=Mt(n)||ne.get(n);i&&(/\.(md|html?)$/i.test(i)?/index\.html$/i.test(i)||t.push(i):(t.push(i),t.push(i+".html")))}else{if(Fe&&Fe.size)for(const i of Fe){const r=i.replace(/^.*\//,"").replace(/\.(md|html?)$/i,"");if(fe(r)===n&&!/index\.html$/i.test(i)){t.push(i);break}}!t.length&&n&&!/\.(md|html?)$/i.test(n)&&(t.push(n+".html"),t.push(n+".md"))}}catch(n){console.warn("[router] buildPageCandidates failed during slug handling",n)}return t}async function ka(e,t){const n=e||"",i=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;let r=e||"",a=null;if(r&&String(r).includes("::")){const d=String(r).split("::",2);r=d[0],a=d[1]||null}const u=`${e}|||${typeof Qi<"u"&&rt?rt:""}`,o=ma(u);if(o)r=o.resolved,a=o.anchor||a;else{if(!String(r).includes(".md")&&!String(r).includes(".html")){let d=decodeURIComponent(String(r||""));if(d&&typeof d=="string"&&(d=ke(d),d=Lt(d)),ne.has(d))r=Mt(d)||ne.get(d);else{let p=await wa(d,t);if(p)r=p;else if(Ln._refreshed&&Fe&&Fe.size||typeof t=="string"&&/^[a-z][a-z0-9+.-]*:\/\//i.test(t)){const g=await $r(d,t);g&&(r=g)}}}ba(u,{resolved:r,anchor:a})}!a&&i&&(a=i);try{if(r&&(r.startsWith("http://")||r.startsWith("https://")||r.startsWith("/"))){const d=r.startsWith("/")?new URL(r,location.origin).toString():r;try{const p=await fetch(d);if(p&&p.ok){const g=await p.text(),w=p&&p.headers&&typeof p.headers.get=="function"&&p.headers.get("content-type")||"",y=(g||"").toLowerCase();if(w&&w.indexOf&&w.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1)return{data:{raw:g,isHtml:!0},pagePath:d.replace(/^\//,""),anchor:a}}}catch{}}}catch{}const l=ya(r),c=String(n||"").includes(".md")||String(n||"").includes(".html");if(c&&l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===0&&(String(r).includes(".md")||String(r).includes(".html"))&&l.push(r),l.length===1&&/index\.html$/i.test(l[0])&&!c&&!ne.has(r)&&!ne.has(decodeURIComponent(String(r||"")))&&!String(r||"").includes("/"))throw new Error("Unknown slug: index.html fallback prevented");let f=null,m=null,h=null;for(const d of l)if(d)try{const p=ke(d);f=await Me(p,t),m=p;break}catch(p){h=p;try{console.warn("[router] candidate fetch failed",{candidate:d,contentBase:t,err:p&&p.message||p})}catch{}}if(!f){try{console.error("[router] fetchPageData: no page data for",{originalRaw:n,resolved:r,pageCandidates:l,contentBase:t,fetchError:h&&(h.message||String(h))||null})}catch{}try{if(c&&String(n||"").toLowerCase().includes(".html"))try{const d=new URL(String(n||""),location.href).toString();console.warn("[router] attempting absolute HTML fetch fallback",d);const p=await fetch(d);if(p&&p.ok){const g=await p.text(),w=p&&p.headers&&typeof p.headers.get=="function"&&p.headers.get("content-type")||"",y=(g||"").toLowerCase(),k=w&&w.indexOf&&w.indexOf("text/html")!==-1||y.indexOf("<!doctype")!==-1||y.indexOf("<html")!==-1;if(k||console.warn("[router] absolute fetch returned non-HTML",{abs:d,contentType:w,snippet:y.slice(0,200)}),k){const v=(g||"").toLowerCase();if(/<title>\s*index of\b/i.test(g)||/<h1>\s*index of\b/i.test(g)||v.indexOf("parent directory")!==-1||/<title>\s*directory listing/i.test(g)||/<h1>\s*directory listing/i.test(g))try{console.warn("[router] absolute fetch returned directory listing; treating as not found",{abs:d})}catch{}else try{const N=d,U=new URL(".",N).toString();try{const K=typeof DOMParser<"u"?new DOMParser:null;if(K){const le=K.parseFromString(g||"","text/html"),L=(H,S)=>{try{const Z=S.getAttribute(H)||"";if(!Z||/^(https?:)?\/\//i.test(Z)||Z.startsWith("/")||Z.startsWith("#"))return;try{const G=new URL(Z,N).toString();S.setAttribute(H,G)}catch(G){console.warn("[router] rewrite attribute failed",H,G)}}catch(Z){console.warn("[router] rewrite helper failed",Z)}},j=le.querySelectorAll("[src],[href],[srcset],[xlink:href],[poster]"),_e=[];for(const H of Array.from(j||[]))try{const S=H.tagName?H.tagName.toLowerCase():"";if(S==="a")continue;if(H.hasAttribute("src")){const Z=H.getAttribute("src");L("src",H);const G=H.getAttribute("src");Z!==G&&_e.push({attr:"src",tag:S,before:Z,after:G})}if(H.hasAttribute("href")&&S==="link"){const Z=H.getAttribute("href");L("href",H);const G=H.getAttribute("href");Z!==G&&_e.push({attr:"href",tag:S,before:Z,after:G})}if(H.hasAttribute("href")&&S!=="link"){const Z=H.getAttribute("href");L("href",H);const G=H.getAttribute("href");Z!==G&&_e.push({attr:"href",tag:S,before:Z,after:G})}if(H.hasAttribute("xlink:href")){const Z=H.getAttribute("xlink:href");L("xlink:href",H);const G=H.getAttribute("xlink:href");Z!==G&&_e.push({attr:"xlink:href",tag:S,before:Z,after:G})}if(H.hasAttribute("poster")){const Z=H.getAttribute("poster");L("poster",H);const G=H.getAttribute("poster");Z!==G&&_e.push({attr:"poster",tag:S,before:Z,after:G})}if(H.hasAttribute("srcset")){const pe=(H.getAttribute("srcset")||"").split(",").map(x=>x.trim()).filter(Boolean).map(x=>{const[A,I]=x.split(/\s+/,2);if(!A||/^(https?:)?\/\//i.test(A)||A.startsWith("/"))return x;try{const R=new URL(A,N).toString();return I?`${R} ${I}`:R}catch{return x}}).join(", ");H.setAttribute("srcset",pe)}}catch{}const V=le.documentElement&&le.documentElement.outerHTML?le.documentElement.outerHTML:g;try{_e&&_e.length&&console.warn("[router] rewritten asset refs",{abs:d,rewritten:_e})}catch{}return{data:{raw:V,isHtml:!0},pagePath:String(n||""),anchor:a}}}catch{}let z=g;return/<base\s+[^>]*>/i.test(g)||(/<head[^>]*>/i.test(g)?z=g.replace(/(<head[^>]*>)/i,`$1<base href="${U}">`):z=`<base href="${U}">`+g),{data:{raw:z,isHtml:!0},pagePath:String(n||""),anchor:a}}catch{return{data:{raw:g,isHtml:!0},pagePath:String(n||""),anchor:a}}}}}catch(d){console.warn("[router] absolute HTML fetch fallback failed",d)}}catch{}try{const d=decodeURIComponent(String(r||""));if(d&&!/\.(md|html?)$/i.test(d)){const p=[`/assets/${d}.html`,`/assets/${d}/index.html`];for(const g of p)try{const w=await fetch(g,{method:"GET"});if(w&&w.ok)return{data:{raw:await w.text(),isHtml:!0},pagePath:g.replace(/^\//,""),anchor:a}}catch{}}}catch(d){console.warn("[router] assets fallback failed",d)}throw new Error("no page data")}return{data:f,pagePath:m,anchor:a}}function rn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var at=rn();function Br(e){at=e}var ut={exec:()=>null};function ue(e,t=""){let n=typeof e=="string"?e:e.source,i={replace:(r,a)=>{let s=typeof a=="string"?a:a.source;return s=s.replace(Be.caret,"$1"),n=n.replace(r,s),i},getRegex:()=>new RegExp(n,t)};return i}var _a=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Be={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}#`),htmlBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}<(?:[a-z].*>|!--)`,"i"),blockquoteBeginRegex:e=>new RegExp(`^ {0,${Math.min(3,e-1)}}>`)},xa=/^(?:[ \t]*(?:\n|$))+/,Sa=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,va=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,It=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Aa=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Rn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Or=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,qr=ue(Or).replace(/bull/g,Rn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ea=ue(Or).replace(/bull/g,Rn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),$n=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,La=/^[^\n]+/,zn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Ta=ue(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",zn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ca=ue(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Rn).getRegex(),an="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Pn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ma=ue("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Pn).replace("tag",an).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Dr=ue($n).replace("hr",It).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",an).getRegex(),Ra=ue(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Dr).getRegex(),In={blockquote:Ra,code:Sa,def:Ta,fences:va,heading:Aa,hr:It,html:Ma,lheading:qr,list:Ca,newline:xa,paragraph:Dr,table:ut,text:La},Hr=ue("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",It).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",an).getRegex(),$a={...In,lheading:Ea,table:Hr,paragraph:ue($n).replace("hr",It).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Hr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",an).getRegex()},za={...In,html:ue(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Pn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:ut,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:ue($n).replace("hr",It).replace("heading",` *#{1,6} *[^
]`).replace("lheading",qr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Pa=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ia=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,jr=/^( {2,}|\\)\n(?!\s*$)/,Na=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,sn=/[\p{P}\p{S}]/u,Nn=/[\s\p{P}\p{S}]/u,Ur=/[^\s\p{P}\p{S}]/u,Ba=ue(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Nn).getRegex(),Wr=/(?!~)[\p{P}\p{S}]/u,Oa=/(?!~)[\s\p{P}\p{S}]/u,qa=/(?:[^\s\p{P}\p{S}]|~)/u,Fr=/(?![*_])[\p{P}\p{S}]/u,Da=/(?![*_])[\s\p{P}\p{S}]/u,Ha=/(?:[^\s\p{P}\p{S}]|[*_])/u,ja=ue(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",_a?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Zr=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Ua=ue(Zr,"u").replace(/punct/g,sn).getRegex(),Wa=ue(Zr,"u").replace(/punct/g,Wr).getRegex(),Gr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Fa=ue(Gr,"gu").replace(/notPunctSpace/g,Ur).replace(/punctSpace/g,Nn).replace(/punct/g,sn).getRegex(),Za=ue(Gr,"gu").replace(/notPunctSpace/g,qa).replace(/punctSpace/g,Oa).replace(/punct/g,Wr).getRegex(),Ga=ue("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Ur).replace(/punctSpace/g,Nn).replace(/punct/g,sn).getRegex(),Qa=ue(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,Fr).getRegex(),Xa="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Ka=ue(Xa,"gu").replace(/notPunctSpace/g,Ha).replace(/punctSpace/g,Da).replace(/punct/g,Fr).getRegex(),Ya=ue(/\\(punct)/,"gu").replace(/punct/g,sn).getRegex(),Va=ue(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ja=ue(Pn).replace("(?:-->|$)","-->").getRegex(),es=ue("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ja).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),on=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,ts=ue(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",on).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Qr=ue(/^!?\[(label)\]\[(ref)\]/).replace("label",on).replace("ref",zn).getRegex(),Xr=ue(/^!?\[(ref)\](?:\[\])?/).replace("ref",zn).getRegex(),ns=ue("reflink|nolink(?!\\()","g").replace("reflink",Qr).replace("nolink",Xr).getRegex(),Kr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Bn={_backpedal:ut,anyPunctuation:Ya,autolink:Va,blockSkip:ja,br:jr,code:Ia,del:ut,delLDelim:ut,delRDelim:ut,emStrongLDelim:Ua,emStrongRDelimAst:Fa,emStrongRDelimUnd:Ga,escape:Pa,link:ts,nolink:Xr,punctuation:Ba,reflink:Qr,reflinkSearch:ns,tag:es,text:Na,url:ut},rs={...Bn,link:ue(/^!?\[(label)\]\((.*?)\)/).replace("label",on).getRegex(),reflink:ue(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",on).getRegex()},On={...Bn,emStrongRDelimAst:Za,emStrongLDelim:Wa,delLDelim:Qa,delRDelim:Ka,url:ue(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Kr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:ue(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Kr).getRegex()},is={...On,br:ue(jr).replace("{2,}","*").getRegex(),text:ue(On.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ln={normal:In,gfm:$a,pedantic:za},Nt={normal:Bn,gfm:On,breaks:is,pedantic:rs},as={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Yr=e=>as[e];function Ze(e,t){if(t){if(Be.escapeTest.test(e))return e.replace(Be.escapeReplace,Yr)}else if(Be.escapeTestNoEncode.test(e))return e.replace(Be.escapeReplaceNoEncode,Yr);return e}function Vr(e){try{e=encodeURI(e).replace(Be.percentDecode,"%")}catch{return null}return e}function Jr(e,t){let n=e.replace(Be.findPipe,(a,s,u)=>{let o=!1,l=s;for(;--l>=0&&u[l]==="\\";)o=!o;return o?"|":" |"}),i=n.split(Be.splitPipe),r=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),t)if(i.length>t)i.splice(t);else for(;i.length<t;)i.push("");for(;r<i.length;r++)i[r]=i[r].trim().replace(Be.slashPipe,"|");return i}function Bt(e,t,n){let i=e.length;if(i===0)return"";let r=0;for(;r<i&&e.charAt(i-r-1)===t;)r++;return e.slice(0,i-r)}function ss(e,t){if(e.indexOf(t[1])===-1)return-1;let n=0;for(let i=0;i<e.length;i++)if(e[i]==="\\")i++;else if(e[i]===t[0])n++;else if(e[i]===t[1]&&(n--,n<0))return i;return n>0?-2:-1}function os(e,t=0){let n=t,i="";for(let r of e)if(r==="	"){let a=4-n%4;i+=" ".repeat(a),n+=a}else i+=r,n++;return i}function ei(e,t,n,i,r){let a=t.href,s=t.title||null,u=e[1].replace(r.other.outputLinkReplace,"$1");i.state.inLink=!0;let o={type:e[0].charAt(0)==="!"?"image":"link",raw:n,href:a,title:s,text:u,tokens:i.inlineTokens(u)};return i.state.inLink=!1,o}function ls(e,t,n){let i=e.match(n.other.indentCodeCompensation);if(i===null)return t;let r=i[1];return t.split(`
`).map(a=>{let s=a.match(n.other.beginningSpace);if(s===null)return a;let[u]=s;return u.length>=r.length?a.slice(r.length):a}).join(`
`)}var Ot=class{options;rules;lexer;constructor(e){this.options=e||at}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:Bt(n,`
`)}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let n=t[0],i=ls(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){let i=Bt(n,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(n=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Bt(t[0],`
`)}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let n=Bt(t[0],`
`).split(`
`),i="",r="",a=[];for(;n.length>0;){let s=!1,u=[],o;for(o=0;o<n.length;o++)if(this.rules.other.blockquoteStart.test(n[o]))u.push(n[o]),s=!0;else if(!s)u.push(n[o]);else break;n=n.slice(o);let l=u.join(`
`),c=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${l}`:l,r=r?`${r}
${c}`:c;let f=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(c,a,!0),this.lexer.state.top=f,n.length===0)break;let m=a.at(-1);if(m?.type==="code")break;if(m?.type==="blockquote"){let h=m,d=h.raw+`
`+n.join(`
`),p=this.blockquote(d);a[a.length-1]=p,i=i.substring(0,i.length-h.raw.length)+p.raw,r=r.substring(0,r.length-h.text.length)+p.text;break}else if(m?.type==="list"){let h=m,d=h.raw+`
`+n.join(`
`),p=this.list(d);a[a.length-1]=p,i=i.substring(0,i.length-m.raw.length)+p.raw,r=r.substring(0,r.length-h.raw.length)+p.raw,n=d.substring(a.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:a,text:r}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim(),i=n.length>1,r={type:"list",raw:"",ordered:i,start:i?+n.slice(0,-1):"",loose:!1,items:[]};n=i?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=i?n:"[*+-]");let a=this.rules.other.listItemRegex(n),s=!1;for(;e;){let o=!1,l="",c="";if(!(t=a.exec(e))||this.rules.block.hr.test(e))break;l=t[0],e=e.substring(l.length);let f=os(t[2].split(`
`,1)[0],t[1].length),m=e.split(`
`,1)[0],h=!f.trim(),d=0;if(this.options.pedantic?(d=2,c=f.trimStart()):h?d=t[1].length+1:(d=f.search(this.rules.other.nonSpaceChar),d=d>4?1:d,c=f.slice(d),d+=t[1].length),h&&this.rules.other.blankLine.test(m)&&(l+=m+`
`,e=e.substring(m.length+1),o=!0),!o){let p=this.rules.other.nextBulletRegex(d),g=this.rules.other.hrRegex(d),w=this.rules.other.fencesBeginRegex(d),y=this.rules.other.headingBeginRegex(d),k=this.rules.other.htmlBeginRegex(d),v=this.rules.other.blockquoteBeginRegex(d);for(;e;){let $=e.split(`
`,1)[0],N;if(m=$,this.options.pedantic?(m=m.replace(this.rules.other.listReplaceNesting,"  "),N=m):N=m.replace(this.rules.other.tabCharGlobal,"    "),w.test(m)||y.test(m)||k.test(m)||v.test(m)||p.test(m)||g.test(m))break;if(N.search(this.rules.other.nonSpaceChar)>=d||!m.trim())c+=`
`+N.slice(d);else{if(h||f.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||w.test(f)||y.test(f)||g.test(f))break;c+=`
`+m}h=!m.trim(),l+=$+`
`,e=e.substring($.length+1),f=N.slice(d)}}r.loose||(s?r.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(s=!0)),r.items.push({type:"list_item",raw:l,task:!!this.options.gfm&&this.rules.other.listIsTask.test(c),loose:!1,text:c,tokens:[]}),r.raw+=l}let u=r.items.at(-1);if(u)u.raw=u.raw.trimEnd(),u.text=u.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let o of r.items){if(this.lexer.state.top=!1,o.tokens=this.lexer.blockTokens(o.text,[]),o.task){if(o.text=o.text.replace(this.rules.other.listReplaceTask,""),o.tokens[0]?.type==="text"||o.tokens[0]?.type==="paragraph"){o.tokens[0].raw=o.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),o.tokens[0].text=o.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let c=this.lexer.inlineQueue.length-1;c>=0;c--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[c].src)){this.lexer.inlineQueue[c].src=this.lexer.inlineQueue[c].src.replace(this.rules.other.listReplaceTask,"");break}}let l=this.rules.other.listTaskCheckbox.exec(o.raw);if(l){let c={type:"checkbox",raw:l[0]+" ",checked:l[0]!=="[ ]"};o.checked=c.checked,r.loose?o.tokens[0]&&["paragraph","text"].includes(o.tokens[0].type)&&"tokens"in o.tokens[0]&&o.tokens[0].tokens?(o.tokens[0].raw=c.raw+o.tokens[0].raw,o.tokens[0].text=c.raw+o.tokens[0].text,o.tokens[0].tokens.unshift(c)):o.tokens.unshift({type:"paragraph",raw:c.raw,text:c.raw,tokens:[c]}):o.tokens.unshift(c)}}if(!r.loose){let l=o.tokens.filter(f=>f.type==="space"),c=l.length>0&&l.some(f=>this.rules.other.anyLine.test(f.raw));r.loose=c}}if(r.loose)for(let o of r.items){o.loose=!0;for(let l of o.tokens)l.type==="text"&&(l.type="paragraph")}return r}}html(e){let t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){let t=this.rules.block.def.exec(e);if(t){let n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:i,title:r}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let n=Jr(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],a={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===i.length){for(let s of i)this.rules.other.tableAlignRight.test(s)?a.align.push("right"):this.rules.other.tableAlignCenter.test(s)?a.align.push("center"):this.rules.other.tableAlignLeft.test(s)?a.align.push("left"):a.align.push(null);for(let s=0;s<n.length;s++)a.header.push({text:n[s],tokens:this.lexer.inline(n[s]),header:!0,align:a.align[s]});for(let s of r)a.rows.push(Jr(s,a.header.length).map((u,o)=>({text:u,tokens:this.lexer.inline(u),header:!1,align:a.align[o]})));return a}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){let t=this.rules.inline.link.exec(e);if(t){let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let a=Bt(n.slice(0,-1),"\\");if((n.length-a.length)%2===0)return}else{let a=ss(t[2],"()");if(a===-2)return;if(a>-1){let s=(t[0].indexOf("!")===0?5:4)+t[1].length+a;t[2]=t[2].substring(0,a),t[0]=t[0].substring(0,s).trim(),t[3]=""}}let i=t[2],r="";if(this.options.pedantic){let a=this.rules.other.pedanticHrefTitle.exec(i);a&&(i=a[1],r=a[3])}else r=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),ei(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){let i=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=t[i.toLowerCase()];if(!r){let a=n[0].charAt(0);return{type:"text",raw:a,text:a}}return ei(n,r,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let i=this.rules.inline.emStrongLDelim.exec(e);if(!(!i||i[3]&&n.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[2])||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,u=r,o=0,l=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+r);(i=l.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a)continue;if(s=[...a].length,i[3]||i[4]){u+=s;continue}else if((i[5]||i[6])&&r%3&&!((r+s)%3)){o+=s;continue}if(u-=s,u>0)continue;s=Math.min(s,s+u+o);let c=[...i[0]][0].length,f=e.slice(0,r+i.index+c+s);if(Math.min(r,s)%2){let h=f.slice(1,-1);return{type:"em",raw:f,text:h,tokens:this.lexer.inlineTokens(h)}}let m=f.slice(2,-2);return{type:"strong",raw:f,text:m,tokens:this.lexer.inlineTokens(m)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(n),r=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return i&&r&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,n=""){let i=this.rules.inline.delLDelim.exec(e);if(i&&(!i[1]||!n||this.rules.inline.punctuation.exec(n))){let r=[...i[0]].length-1,a,s,u=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,t=t.slice(-1*e.length+r);(i=o.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a||(s=[...a].length,s!==r))continue;if(i[3]||i[4]){u+=s;continue}if(u-=s,u>0)continue;s=Math.min(s,s+u);let l=[...i[0]][0].length,c=e.slice(0,r+i.index+l+s),f=c.slice(r,-r);return{type:"del",raw:c,text:f,tokens:this.lexer.inlineTokens(f)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let n,i;return t[2]==="@"?(n=t[1],i="mailto:"+n):(n=t[1],i=n),{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let n,i;if(t[2]==="@")n=t[0],i="mailto:"+n;else{let r;do r=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??"";while(r!==t[0]);n=t[0],t[1]==="www."?i="http://"+t[0]:i=t[0]}return{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}},je=class sr{tokens;options;state;inlineQueue;tokenizer;constructor(t){this.tokens=[],this.tokens.links=Object.create(null),this.options=t||at,this.options.tokenizer=this.options.tokenizer||new Ot,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let n={other:Be,block:ln.normal,inline:Nt.normal};this.options.pedantic?(n.block=ln.pedantic,n.inline=Nt.pedantic):this.options.gfm&&(n.block=ln.gfm,this.options.breaks?n.inline=Nt.breaks:n.inline=Nt.gfm),this.tokenizer.rules=n}static get rules(){return{block:ln,inline:Nt}}static lex(t,n){return new sr(n).lex(t)}static lexInline(t,n){return new sr(n).inlineTokens(t)}lex(t){t=t.replace(Be.carriageReturn,`
`),this.blockTokens(t,this.tokens);for(let n=0;n<this.inlineQueue.length;n++){let i=this.inlineQueue[n];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(t,n=[],i=!1){for(this.options.pedantic&&(t=t.replace(Be.tabCharGlobal,"    ").replace(Be.spaceLine,""));t;){let r;if(this.options.extensions?.block?.some(s=>(r=s.call({lexer:this},t,n))?(t=t.substring(r.raw.length),n.push(r),!0):!1))continue;if(r=this.tokenizer.space(t)){t=t.substring(r.raw.length);let s=n.at(-1);r.raw.length===1&&s!==void 0?s.raw+=`
`:n.push(r);continue}if(r=this.tokenizer.code(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(r=this.tokenizer.fences(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.heading(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.hr(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.blockquote(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.list(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.html(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.def(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="paragraph"||s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.raw,this.inlineQueue.at(-1).src=s.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},n.push(r));continue}if(r=this.tokenizer.table(t)){t=t.substring(r.raw.length),n.push(r);continue}if(r=this.tokenizer.lheading(t)){t=t.substring(r.raw.length),n.push(r);continue}let a=t;if(this.options.extensions?.startBlock){let s=1/0,u=t.slice(1),o;this.options.extensions.startBlock.forEach(l=>{o=l.call({lexer:this},u),typeof o=="number"&&o>=0&&(s=Math.min(s,o))}),s<1/0&&s>=0&&(a=t.substring(0,s+1))}if(this.state.top&&(r=this.tokenizer.paragraph(a))){let s=n.at(-1);i&&s?.type==="paragraph"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r),i=a.length!==t.length,t=t.substring(r.raw.length);continue}if(r=this.tokenizer.text(t)){t=t.substring(r.raw.length);let s=n.at(-1);s?.type==="text"?(s.raw+=(s.raw.endsWith(`
`)?"":`
`)+r.raw,s.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=s.text):n.push(r);continue}if(t){let s="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(s);break}else throw new Error(s)}}return this.state.top=!0,n}inline(t,n=[]){return this.inlineQueue.push({src:t,tokens:n}),n}inlineTokens(t,n=[]){let i=t,r=null;if(this.tokens.links){let o=Object.keys(this.tokens.links);if(o.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)o.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,r.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let a;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)a=r[2]?r[2].length:0,i=i.slice(0,r.index+a)+"["+"a".repeat(r[0].length-a-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let s=!1,u="";for(;t;){s||(u=""),s=!1;let o;if(this.options.extensions?.inline?.some(c=>(o=c.call({lexer:this},t,n))?(t=t.substring(o.raw.length),n.push(o),!0):!1))continue;if(o=this.tokenizer.escape(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.tag(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.link(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.reflink(t,this.tokens.links)){t=t.substring(o.raw.length);let c=n.at(-1);o.type==="text"&&c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(o=this.tokenizer.emStrong(t,i,u)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.codespan(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.br(t)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.del(t,i,u)){t=t.substring(o.raw.length),n.push(o);continue}if(o=this.tokenizer.autolink(t)){t=t.substring(o.raw.length),n.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(t))){t=t.substring(o.raw.length),n.push(o);continue}let l=t;if(this.options.extensions?.startInline){let c=1/0,f=t.slice(1),m;this.options.extensions.startInline.forEach(h=>{m=h.call({lexer:this},f),typeof m=="number"&&m>=0&&(c=Math.min(c,m))}),c<1/0&&c>=0&&(l=t.substring(0,c+1))}if(o=this.tokenizer.inlineText(l)){t=t.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(u=o.raw.slice(-1)),s=!0;let c=n.at(-1);c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):n.push(o);continue}if(t){let c="Infinite loop on byte: "+t.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return n}},qt=class{options;parser;constructor(e){this.options=e||at}space(e){return""}code({text:e,lang:t,escaped:n}){let i=(t||"").match(Be.notSpaceStart)?.[0],r=e.replace(Be.endingNewline,"")+`
`;return i?'<pre><code class="language-'+Ze(i)+'">'+(n?r:Ze(r,!0))+`</code></pre>
`:"<pre><code>"+(n?r:Ze(r,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){let t=e.ordered,n=e.start,i="";for(let s=0;s<e.items.length;s++){let u=e.items[s];i+=this.listitem(u)}let r=t?"ol":"ul",a=t&&n!==1?' start="'+n+'"':"";return"<"+r+a+`>
`+i+"</"+r+`>
`}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let r=0;r<e.header.length;r++)n+=this.tablecell(e.header[r]);t+=this.tablerow({text:n});let i="";for(let r=0;r<e.rows.length;r++){let a=e.rows[r];n="";for(let s=0;s<a.length;s++)n+=this.tablecell(a[s]);i+=this.tablerow({text:n})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+i+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){let t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Ze(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){let i=this.parser.parseInline(n),r=Vr(e);if(r===null)return i;e=r;let a='<a href="'+e+'"';return t&&(a+=' title="'+Ze(t)+'"'),a+=">"+i+"</a>",a}image({href:e,title:t,text:n,tokens:i}){i&&(n=this.parser.parseInline(i,this.parser.textRenderer));let r=Vr(e);if(r===null)return Ze(n);e=r;let a=`<img src="${e}" alt="${Ze(n)}"`;return t&&(a+=` title="${Ze(t)}"`),a+=">",a}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Ze(e.text)}},cn=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},Ue=class or{options;renderer;textRenderer;constructor(t){this.options=t||at,this.options.renderer=this.options.renderer||new qt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new cn}static parse(t,n){return new or(n).parse(t)}static parseInline(t,n){return new or(n).parseInline(t)}parse(t){let n="";for(let i=0;i<t.length;i++){let r=t[i];if(this.options.extensions?.renderers?.[r.type]){let s=r,u=this.options.extensions.renderers[s.type].call({parser:this},s);if(u!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(s.type)){n+=u||"";continue}}let a=r;switch(a.type){case"space":{n+=this.renderer.space(a);break}case"hr":{n+=this.renderer.hr(a);break}case"heading":{n+=this.renderer.heading(a);break}case"code":{n+=this.renderer.code(a);break}case"table":{n+=this.renderer.table(a);break}case"blockquote":{n+=this.renderer.blockquote(a);break}case"list":{n+=this.renderer.list(a);break}case"checkbox":{n+=this.renderer.checkbox(a);break}case"html":{n+=this.renderer.html(a);break}case"def":{n+=this.renderer.def(a);break}case"paragraph":{n+=this.renderer.paragraph(a);break}case"text":{n+=this.renderer.text(a);break}default:{let s='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(s),"";throw new Error(s)}}}return n}parseInline(t,n=this.renderer){let i="";for(let r=0;r<t.length;r++){let a=t[r];if(this.options.extensions?.renderers?.[a.type]){let u=this.options.extensions.renderers[a.type].call({parser:this},a);if(u!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){i+=u||"";continue}}let s=a;switch(s.type){case"escape":{i+=n.text(s);break}case"html":{i+=n.html(s);break}case"link":{i+=n.link(s);break}case"image":{i+=n.image(s);break}case"checkbox":{i+=n.checkbox(s);break}case"strong":{i+=n.strong(s);break}case"em":{i+=n.em(s);break}case"codespan":{i+=n.codespan(s);break}case"br":{i+=n.br(s);break}case"del":{i+=n.del(s);break}case"text":{i+=n.text(s);break}default:{let u='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(u),"";throw new Error(u)}}}return i}},xt=class{options;block;constructor(e){this.options=e||at}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(){return this.block?je.lex:je.lexInline}provideParser(){return this.block?Ue.parse:Ue.parseInline}},ti=class{defaults=rn();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=Ue;Renderer=qt;TextRenderer=cn;Lexer=je;Tokenizer=Ot;Hooks=xt;constructor(...e){this.use(...e)}walkTokens(e,t){let n=[];for(let i of e)switch(n=n.concat(t.call(this,i)),i.type){case"table":{let r=i;for(let a of r.header)n=n.concat(this.walkTokens(a.tokens,t));for(let a of r.rows)for(let s of a)n=n.concat(this.walkTokens(s.tokens,t));break}case"list":{let r=i;n=n.concat(this.walkTokens(r.items,t));break}default:{let r=i;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(a=>{let s=r[a].flat(1/0);n=n.concat(this.walkTokens(s,t))}):r.tokens&&(n=n.concat(this.walkTokens(r.tokens,t)))}}return n}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{let i={...n};if(i.async=this.defaults.async||i.async||!1,n.extensions&&(n.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let a=t.renderers[r.name];a?t.renderers[r.name]=function(...s){let u=r.renderer.apply(this,s);return u===!1&&(u=a.apply(this,s)),u}:t.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let a=t[r.level];a?a.unshift(r.tokenizer):t[r.level]=[r.tokenizer],r.start&&(r.level==="block"?t.startBlock?t.startBlock.push(r.start):t.startBlock=[r.start]:r.level==="inline"&&(t.startInline?t.startInline.push(r.start):t.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(t.childTokens[r.name]=r.childTokens)}),i.extensions=t),n.renderer){let r=this.defaults.renderer||new qt(this.defaults);for(let a in n.renderer){if(!(a in r))throw new Error(`renderer '${a}' does not exist`);if(["options","parser"].includes(a))continue;let s=a,u=n.renderer[s],o=r[s];r[s]=(...l)=>{let c=u.apply(r,l);return c===!1&&(c=o.apply(r,l)),c||""}}i.renderer=r}if(n.tokenizer){let r=this.defaults.tokenizer||new Ot(this.defaults);for(let a in n.tokenizer){if(!(a in r))throw new Error(`tokenizer '${a}' does not exist`);if(["options","rules","lexer"].includes(a))continue;let s=a,u=n.tokenizer[s],o=r[s];r[s]=(...l)=>{let c=u.apply(r,l);return c===!1&&(c=o.apply(r,l)),c}}i.tokenizer=r}if(n.hooks){let r=this.defaults.hooks||new xt;for(let a in n.hooks){if(!(a in r))throw new Error(`hook '${a}' does not exist`);if(["options","block"].includes(a))continue;let s=a,u=n.hooks[s],o=r[s];xt.passThroughHooks.has(a)?r[s]=l=>{if(this.defaults.async&&xt.passThroughHooksRespectAsync.has(a))return(async()=>{let f=await u.call(r,l);return o.call(r,f)})();let c=u.call(r,l);return o.call(r,c)}:r[s]=(...l)=>{if(this.defaults.async)return(async()=>{let f=await u.apply(r,l);return f===!1&&(f=await o.apply(r,l)),f})();let c=u.apply(r,l);return c===!1&&(c=o.apply(r,l)),c}}i.hooks=r}if(n.walkTokens){let r=this.defaults.walkTokens,a=n.walkTokens;i.walkTokens=function(s){let u=[];return u.push(a.call(this,s)),r&&(u=u.concat(r.call(this,s))),u}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return je.lex(e,t??this.defaults)}parser(e,t){return Ue.parse(e,t??this.defaults)}parseMarkdown(e){return(t,n)=>{let i={...n},r={...this.defaults,...i},a=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&i.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=e),r.async)return(async()=>{let s=r.hooks?await r.hooks.preprocess(t):t,u=await(r.hooks?await r.hooks.provideLexer():e?je.lex:je.lexInline)(s,r),o=r.hooks?await r.hooks.processAllTokens(u):u;r.walkTokens&&await Promise.all(this.walkTokens(o,r.walkTokens));let l=await(r.hooks?await r.hooks.provideParser():e?Ue.parse:Ue.parseInline)(o,r);return r.hooks?await r.hooks.postprocess(l):l})().catch(a);try{r.hooks&&(t=r.hooks.preprocess(t));let s=(r.hooks?r.hooks.provideLexer():e?je.lex:je.lexInline)(t,r);r.hooks&&(s=r.hooks.processAllTokens(s)),r.walkTokens&&this.walkTokens(s,r.walkTokens);let u=(r.hooks?r.hooks.provideParser():e?Ue.parse:Ue.parseInline)(s,r);return r.hooks&&(u=r.hooks.postprocess(u)),u}catch(s){return a(s)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){let i="<p>An error occurred:</p><pre>"+Ze(n.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(n);throw n}}},ht=new ti;function ae(e,t){return ht.parse(e,t)}ae.options=ae.setOptions=function(e){return ht.setOptions(e),ae.defaults=ht.defaults,Br(ae.defaults),ae},ae.getDefaults=rn,ae.defaults=at,ae.use=function(...e){return ht.use(...e),ae.defaults=ht.defaults,Br(ae.defaults),ae},ae.walkTokens=function(e,t){return ht.walkTokens(e,t)},ae.parseInline=ht.parseInline,ae.Parser=Ue,ae.parser=Ue.parse,ae.Renderer=qt,ae.TextRenderer=cn,ae.Lexer=je,ae.lexer=je.lex,ae.Tokenizer=Ot,ae.Hooks=xt,ae.parse=ae;var cs=ae.options,us=ae.setOptions,hs=ae.use,ds=ae.walkTokens,ps=ae.parseInline,gs=ae,fs=Ue.parse,ms=je.lex;const ni=Object.freeze(Object.defineProperty({__proto__:null,Hooks:xt,Lexer:je,Marked:ti,Parser:Ue,Renderer:qt,TextRenderer:cn,Tokenizer:Ot,get defaults(){return at},getDefaults:rn,lexer:ms,marked:ae,options:cs,parse:gs,parseInline:ps,parser:fs,setOptions:us,use:hs,walkTokens:ds},Symbol.toStringTag,{value:"Module"})),ri=`function O() {
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
})(), m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\\t)/gm, outputLinkReplace: /\\\\([\\[\\]])/g, indentCodeCompensation: /^(\\s+)(?:\`\`\`)/, beginningSpace: /^\\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\\n/g, tabCharGlobal: /\\t/g, multipleSpaceGlobal: /\\s+/g, blankLine: /^[ \\t]*$/, doubleBlankLine: /\\n[ \\t]*\\n[ \\t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\\n {0,3}((?:=+|-+) *)(?=\\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \\t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\\[[ xX]\\] +\\S/, listReplaceTask: /^\\[[ xX]\\] +/, listTaskCheckbox: /\\[[ xX]\\]/, anyLine: /\\n.*\\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\\||\\| *$/g, tableRowBlankLine: /\\n[ \\t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\\s|>)/i, endPreScriptTag: /^<\\/(pre|code|kbd|script)(\\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/, unicodeAlphaNumeric: /[\\p{L}\\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/g, caret: /(^|[^\\[])\\^/g, percentDecode: /%25/g, findPipe: /\\|/g, splitPipe: / \\|/, slashPipe: /\\\\\\|/g, carriageReturn: /\\r\\n|\\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\\S*/, endingNewline: /\\n$/, listItemRegex: (s) => new RegExp(\`^( {0,3}\${s})((?:[	 ][^\\\\n]*)?(?:\\\\n|$))\`), nextBulletRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ 	][^\\\\n]*)?(?:\\\\n|$))\`), hrRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`), fencesBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}(?:\\\`\\\`\\\`|~~~)\`), headingBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}#\`), htmlBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)\`, "i"), blockquoteBeginRegex: (s) => new RegExp(\`^ {0,\${Math.min(3, s - 1)}}>\`) }, Ae = /^(?:[ \\t]*(?:\\n|$))+/, _e = /^((?: {4}| {0,3}\\t)[^\\n]+(?:\\n(?:[ \\t]*(?:\\n|$))*)?)+/, Le = /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/, M = /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/, Pe = /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/, X = / {0,3}(?:[*+-]|\\d{1,9}[.)])/, pe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\\n(?!\\s*?\\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, ue = k(pe).replace(/bull/g, X).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/\\|table/g, "").getRegex(), Ie = k(pe).replace(/bull/g, X).replace(/blockCode/g, /(?: {4}| {0,3}\\t)/).replace(/fences/g, / {0,3}(?:\`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\\n>]+>\\n/).replace(/table/g, / {0,3}\\|?(?:[:\\- ]*\\|)+[\\:\\- ]*\\n/).getRegex(), K = /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/, ve = /^[^\\n]+/, U = /(?!\\s*\\])(?:\\\\[\\s\\S]|[^\\[\\]\\\\])+/, Ce = k(/^ {0,3}\\[(label)\\]: *(?:\\n[ \\t]*)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n[ \\t]*)?| *\\n[ \\t]*)(title))? *(?:\\n+|$)/).replace("label", U).replace("title", /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/).getRegex(), Be = k(/^(bull)([ \\t][^\\n]+?)?(?:\\n|$)/).replace(/bull/g, X).getRegex(), H = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", J = /<!--(?:-?>|[\\s\\S]*?(?:-->|$))/, Ee = k("^ {0,3}(?:<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)|comment[^\\\\n]*(\\\\n+|$)|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$)|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n[ 	]*)+\\\\n|$))", "i").replace("comment", J).replace("tag", H).replace("attribute", / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/).getRegex(), ge = k(K).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex(), qe = k(/^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/).replace("paragraph", ge).getRegex(), V = { blockquote: qe, code: _e, def: Ce, fences: Le, heading: Pe, hr: M, html: Ee, lheading: ue, list: Be, newline: Ae, paragraph: ge, table: T, text: ve }, re = k("^ *([^\\\\n ].*)\\\\n {0,3}((?:\\\\| *)?:?-+:? *(?:\\\\| *:?-+:? *)*(?:\\\\| *)?)(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)").replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\\\n]").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex(), Me = { ...V, lheading: Ie, table: re, paragraph: k(K).replace("hr", M).replace("heading", " {0,3}#{1,6}(?:\\\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\\\t]").replace("html", "</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", H).getRegex() }, Ze = { ...V, html: k(\`^ *(?:comment *(?:\\\\n|\\\\s*$)|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\\\s[^'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))\`).replace("comment", J).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b").getRegex(), def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/, heading: /^(#{1,6})(.*)(?:\\n+|$)/, fences: T, lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/, paragraph: k(K).replace("hr", M).replace("heading", \` *#{1,6} *[^
]\`).replace("lheading", ue).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, je = /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/, De = /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/, ke = /^( {2,}|\\\\)\\n(?!\\s*$)/, Oe = /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/, N = /[\\p{P}\\p{S}]/u, Y = /[\\s\\p{P}\\p{S}]/u, fe = /[^\\s\\p{P}\\p{S}]/u, He = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Y).getRegex(), de = /(?!~)[\\p{P}\\p{S}]/u, Ne = /(?!~)[\\s\\p{P}\\p{S}]/u, Qe = /(?:[^\\s\\p{P}\\p{S}]|~)/u, xe = /(?![*_])[\\p{P}\\p{S}]/u, Ge = /(?![*_])[\\s\\p{P}\\p{S}]/u, We = /(?:[^\\s\\p{P}\\p{S}]|[*_])/u, Fe = k(/link|precode-code|html/, "g").replace("link", /\\[(?:[^\\[\\]\`]|(?<a>\`+)[^\`]+\\k<a>(?!\`))*?\\]\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)]|\\((?:\\\\[\\s\\S]|[^\\\\\\(\\)])*\\))*\\)/).replace("precode-", Te ? "(?<!\`)()" : "(^^|[^\`])").replace("code", /(?<b>\`+)[^\`]+\\k<b>(?!\`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), be = /^(?:\\*+(?:((?!\\*)punct)|[^\\s*]))|^_+(?:((?!_)punct)|([^\\s_]))/, Xe = k(be, "u").replace(/punct/g, N).getRegex(), Ke = k(be, "u").replace(/punct/g, de).getRegex(), me = "^[^_*]*?__[^_*]*?\\\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\\\*)punct(\\\\*+)(?=[\\\\s]|$)|notPunctSpace(\\\\*+)(?!\\\\*)(?=punctSpace|$)|(?!\\\\*)punctSpace(\\\\*+)(?=notPunctSpace)|[\\\\s](\\\\*+)(?!\\\\*)(?=punct)|(?!\\\\*)punct(\\\\*+)(?!\\\\*)(?=punct)|notPunctSpace(\\\\*+)(?=notPunctSpace)", Ue = k(me, "gu").replace(/notPunctSpace/g, fe).replace(/punctSpace/g, Y).replace(/punct/g, N).getRegex(), Je = k(me, "gu").replace(/notPunctSpace/g, Qe).replace(/punctSpace/g, Ne).replace(/punct/g, de).getRegex(), Ve = k("^[^_*]*?\\\\*\\\\*[^_*]*?_[^_*]*?(?=\\\\*\\\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, fe).replace(/punctSpace/g, Y).replace(/punct/g, N).getRegex(), Ye = k(/^~~?(?:((?!~)punct)|[^\\s~])/, "u").replace(/punct/g, xe).getRegex(), et = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", tt = k(et, "gu").replace(/notPunctSpace/g, We).replace(/punctSpace/g, Ge).replace(/punct/g, xe).getRegex(), rt = k(/\\\\(punct)/, "gu").replace(/punct/g, N).getRegex(), st = k(/^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), nt = k(J).replace("(?:-->|$)", "-->").getRegex(), lt = k("^comment|^</[a-zA-Z][\\\\w:-]*\\\\s*>|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>|^<\\\\?[\\\\s\\\\S]*?\\\\?>|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>").replace("comment", nt).replace("attribute", /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/).getRegex(), D = /(?:\\[(?:\\\\[\\s\\S]|[^\\[\\]\\\\])*\\]|\\\\[\\s\\S]|\`+[^\`]*?\`+(?!\`)|[^\\[\\]\\\\\`])*?/, it = k(/^!?\\[(label)\\]\\(\\s*(href)(?:(?:[ \\t]+(?:\\n[ \\t]*)?|\\n[ \\t]*)(title))?\\s*\\)/).replace("label", D).replace("href", /<(?:\\\\.|[^\\n<>\\\\])+>|[^ \\t\\n\\x00-\\x1f]*/).replace("title", /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/).getRegex(), we = k(/^!?\\[(label)\\]\\[(ref)\\]/).replace("label", D).replace("ref", U).getRegex(), ye = k(/^!?\\[(ref)\\](?:\\[\\])?/).replace("ref", U).getRegex(), at = k("reflink|nolink(?!\\\\()", "g").replace("reflink", we).replace("nolink", ye).getRegex(), se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ee = { _backpedal: T, anyPunctuation: rt, autolink: st, blockSkip: Fe, br: ke, code: De, del: T, delLDelim: T, delRDelim: T, emStrongLDelim: Xe, emStrongRDelimAst: Ue, emStrongRDelimUnd: Ve, escape: je, link: it, nolink: ye, punctuation: He, reflink: we, reflinkSearch: at, tag: lt, text: Oe, url: T }, ot = { ...ee, link: k(/^!?\\[(label)\\]\\((.*?)\\)/).replace("label", D).getRegex(), reflink: k(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/).replace("label", D).getRegex() }, G = { ...ee, emStrongRDelimAst: Je, emStrongLDelim: Ke, delLDelim: Ye, delRDelim: tt, url: k(/^((?:protocol):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\\s~])((?:\\\\[\\s\\S]|[^\\\\])*?(?:\\\\[\\s\\S]|[^\\s~\\\\]))\\1(?=[^~]|$)/, text: k(/^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|protocol:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/).replace("protocol", se).getRegex() }, ct = { ...G, br: k(ke).replace("{2,}", "*").getRegex(), text: k(G.text).replace("\\\\b_", "\\\\b_| {2,}\\\\n").replace(/\\{2,\\}/g, "*").getRegex() }, Z = { normal: V, gfm: Me, pedantic: Ze }, C = { normal: ee, gfm: G, breaks: ct, pedantic: ot }, ht = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ne = (s) => ht[s];
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
          let x = this.rules.other.nextBulletRegex(g), _ = this.rules.other.hrRegex(g), L = this.rules.other.fencesBeginRegex(g), R = this.rules.other.headingBeginRegex(g), te = this.rules.other.htmlBeginRegex(g), v = this.rules.other.blockquoteBeginRegex(g);
          for (; s; ) {
            let P = s.split(\`
\`, 1)[0], z;
            if (u = P, this.options.pedantic ? (u = u.replace(this.rules.other.listReplaceNesting, "  "), z = u) : z = u.replace(this.rules.other.tabCharGlobal, "    "), L.test(u) || R.test(u) || te.test(u) || v.test(u) || x.test(u) || _.test(u)) break;
            if (z.search(this.rules.other.nonSpaceChar) >= g || !u.trim()) o += \`
\` + z.slice(g);
            else {
              if (d || p.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || L.test(p) || R.test(p) || _.test(p)) break;
              o += \`
\` + u;
            }
            d = !u.trim(), h += P + \`
\`, s = s.substring(P.length + 1), p = z.slice(g);
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
}, I = class {
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
  Hooks = I;
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
        let t = this.defaults.hooks || new I();
        for (let i in r.hooks) {
          if (!(i in t)) throw new Error(\`hook '\${i}' does not exist\`);
          if (["options", "block"].includes(i)) continue;
          let l = i, c = r.hooks[l], a = t[l];
          I.passThroughHooks.has(i) ? t[l] = (h) => {
            if (this.defaults.async && I.passThroughHooksRespectAsync.has(i)) return (async () => {
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
f.Hooks = I;
f.parse = f;
var kt = f.options, ft = f.setOptions, dt = f.use, xt = f.walkTokens, bt = f.parseInline, mt = f, wt = y.parse, yt = w.lex, oe = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  Hooks: I,
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
function $t(s) {
  try {
    if (!s && s !== 0) return "";
    const e = String(s), r = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
    return e.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (n, t) => {
      if (!t) return n;
      if (t[0] === "#")
        try {
          return t[1] === "x" || t[1] === "X" ? String.fromCharCode(parseInt(t.slice(2), 16)) : String.fromCharCode(parseInt(t.slice(1), 10));
        } catch {
          return n;
        }
      return r[t] !== void 0 ? r[t] : n;
    });
  } catch {
    return String(s || "");
  }
}
const j = oe && (f || oe) || void 0;
let b = null;
const Rt = "https://cdn.jsdelivr.net/npm/highlight.js";
async function ce() {
  if (b) return b;
  try {
    try {
      const s = await import(Rt + "/lib/core.js");
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
      const g = Number(p);
      let x = d.replace(/<[^>]+>/g, "").trim();
      try {
        x = $t(x);
      } catch {
      }
      let _ = null;
      const L = (u || "").match(/\\sid="([^"]+)"/);
      L && (_ = L[1]);
      const R = _ || h(x) || "heading", v = (a.get(R) || 0) + 1;
      a.set(R, v);
      const P = v === 1 ? R : R + "-" + v;
      c.push({ level: g, text: x, id: P });
      const z = {
        1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
        2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
        3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
        4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
        5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
        6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop"
      }, $e = g <= 2 ? "has-text-weight-bold" : g <= 4 ? "has-text-weight-semibold" : "has-text-weight-normal", Re = (z[g] + " " + $e).trim(), ze = ((u || "").replace(/\\s*(id|class)="[^"]*"/g, "") + \` id="\${P}" class="\${Re}"\`).trim();
      return \`<h\${g} \${ze}>\${d}</h\${g}>\`;
    }), l = l.replace(/<img([^>]*)>/g, (o, p) => /\\bloading=/.test(p) ? \`<img\${p}>\` : /\\bdata-want-lazy=/.test(p) ? \`<img\${p}>\` : \`<img\${p} loading="lazy">\`), postMessage({ id: r, result: { html: l, meta: i || {}, toc: c } });
  } catch (r) {
    postMessage({ id: e.id, error: String(r) });
  }
};
`,ii=typeof self<"u"&&self.Blob&&new Blob(["URL.revokeObjectURL(import.meta.url);",ri],{type:"text/javascript;charset=utf-8"});function bs(e){let t;try{if(t=ii&&(self.URL||self.webkitURL).createObjectURL(ii),!t)throw"";const n=new Worker(t,{type:"module",name:e?.name});return n.addEventListener("error",()=>{(self.URL||self.webkitURL).revokeObjectURL(t)}),n}catch{return new Worker("data:text/javascript;charset=utf-8,"+encodeURIComponent(ri),{type:"module",name:e?.name})}}function un(e){if(e.startsWith("---")){const t=e.indexOf(`
---`,3);if(t!==-1){const n=e.slice(3,t+0).trim(),i=e.slice(t+4).trimStart(),r={};return n.split(/\r?\n/).forEach(a=>{const s=a.match(/^([^:]+):\s*(.*)$/);s&&(r[s[1].trim()]=s[2].trim())}),{content:i,data:r}}}return{content:e,data:{}}}function ai(e){try{if(!e&&e!==0)return"";const t=String(e),n={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g,(i,r)=>{if(!r)return i;if(r[0]==="#")try{return r[1]==="x"||r[1]==="X"?String.fromCharCode(parseInt(r.slice(2),16)):String.fromCharCode(parseInt(r.slice(1),10))}catch{return i}return n[r]!==void 0?n[r]:i})}catch{return String(e||"")}}const Dt=ni&&(ae||ni)||void 0;let ze=null;const ws="https://cdn.jsdelivr.net/npm/highlight.js";async function hn(){if(ze)return ze;try{try{const e=await import(ws+"/lib/core.js");ze=e.default||e}catch{ze=null}}catch{ze=null}return ze}Dt&&typeof Dt.setOptions=="function"&&Dt.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(e,t)=>{try{return ze&&t&&typeof ze.getLanguage=="function"&&ze.getLanguage(t)?ze.highlight(e,{language:t}).value:ze&&typeof ze.getLanguage=="function"&&ze.getLanguage("plaintext")?ze.highlight(e,{language:"plaintext"}).value:e}catch{return e}}}),onmessage=async e=>{const t=e.data||{};try{if(t.type==="register"){const{name:c,url:f}=t;try{if(!await hn()){postMessage({type:"register-error",name:c,error:"hljs unavailable"});return}const h=await import(f),d=h.default||h;ze.registerLanguage(c,d),postMessage({type:"registered",name:c})}catch(m){postMessage({type:"register-error",name:c,error:String(m)})}return}if(t.type==="detect"){const c=t.md||"",f=t.supported||[],m=new Set,h=/```\s*([a-zA-Z0-9_\-+]+)?/g;let d;for(;d=h.exec(c);)if(d[1]){const p=String(d[1]).toLowerCase();if(!p)continue;if(p.length>=5&&p.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(p)&&m.add(p),new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]).has(p)&&m.add(p),f&&f.length)try{f.indexOf(p)!==-1&&m.add(p)}catch{}}postMessage({id:t.id,result:Array.from(m)});return}const{id:n,md:i}=t,{content:r,data:a}=un(i||"");await hn().catch(()=>{});let s=Dt.parse(r);const u=[],o=new Map,l=c=>{try{return String(c||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};s=s.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(c,f,m,h)=>{const d=Number(f);let p=h.replace(/<[^>]+>/g,"").trim();try{p=ai(p)}catch{}let g=null;const w=(m||"").match(/\sid="([^"]+)"/);w&&(g=w[1]);const y=g||l(p)||"heading",v=(o.get(y)||0)+1;o.set(y,v);const $=v===1?y:y+"-"+v;u.push({level:d,text:p,id:$});const N={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},U=d<=2?"has-text-weight-bold":d<=4?"has-text-weight-semibold":"has-text-weight-normal",z=(N[d]+" "+U).trim(),le=((m||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${$}" class="${z}"`).trim();return`<h${d} ${le}>${h}</h${d}>`}),s=s.replace(/<img([^>]*)>/g,(c,f)=>/\bloading=/.test(f)?`<img${f}>`:/\bdata-want-lazy=/.test(f)?`<img${f}>`:`<img${f} loading="lazy">`),postMessage({id:n,result:{html:s,meta:a||{},toc:u}})}catch(n){postMessage({id:t.id,error:String(n)})}};async function ys(e){try{if(e&&e.type==="register"){const{name:o,url:l}=e;try{if(!await hn())return{type:"register-error",name:o,error:"hljs unavailable"};const f=await import(l),m=f.default||f;return ze.registerLanguage(o,m),{type:"registered",name:o}}catch(c){return{type:"register-error",name:o,error:String(c)}}}if(e&&e.type==="detect"){const o=e.md||"",l=e.supported||[],c=new Set,f=/``\`\s*([a-zA-Z0-9_\-+]+)?/g;let m;for(;m=f.exec(o);)if(m[1]){const h=String(m[1]).toLowerCase();if(!h)continue;if(h.length>=5&&h.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(h)&&c.add(h),new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]).has(h)&&c.add(h),l&&l.length)try{l.indexOf(h)!==-1&&c.add(h)}catch{}}return{id:e.id,result:Array.from(c)}}const t=e&&e.id,{content:n,data:i}=un(e&&e.md||"");await hn().catch(()=>{});let r=Dt.parse(n);const a=[],s=new Map,u=o=>{try{return String(o||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};return r=r.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(o,l,c,f)=>{const m=Number(l);let h=f.replace(/<[^>]+>/g,"").trim();try{h=ai(h)}catch{}let d=null;const p=(c||"").match(/\sid="([^"]+)"/);p&&(d=p[1]);const g=d||u(h)||"heading",y=(s.get(g)||0)+1;s.set(g,y);const k=y===1?g:g+"-"+y;a.push({level:m,text:h,id:k});const v={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},$=m<=2?"has-text-weight-bold":m<=4?"has-text-weight-semibold":"has-text-weight-normal",N=(v[m]+" "+$).trim(),z=((c||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${k}" class="${N}"`).trim();return`<h${m} ${z}>${f}</h${m}>`}),r=r.replace(/<img([^>]*)>/g,(o,l)=>/\bloading=/.test(l)?`<img${l}>`:/\bdata-want-lazy=/.test(l)?`<img${l}>`:`<img${l} loading="lazy">`),{id:t,result:{html:r,meta:i||{},toc:a}}}catch(t){return{id:e&&e.id,error:String(t)}}}const qn={100:"💯",1234:"🔢",grinning:"😀",grimacing:"😬",grin:"😁",joy:"😂",rofl:"🤣",partying:"🥳",smiley:"😃",smile:"😄",sweat_smile:"😅",laughing:"😆",innocent:"😇",wink:"😉",blush:"😊",slightly_smiling_face:"🙂",upside_down_face:"🙃",relaxed:"☺️",yum:"😋",relieved:"😌",heart_eyes:"😍",smiling_face_with_three_hearts:"🥰",kissing_heart:"😘",kissing:"😗",kissing_smiling_eyes:"😙",kissing_closed_eyes:"😚",stuck_out_tongue_winking_eye:"😜",zany:"🤪",raised_eyebrow:"🤨",monocle:"🧐",stuck_out_tongue_closed_eyes:"😝",stuck_out_tongue:"😛",money_mouth_face:"🤑",nerd_face:"🤓",sunglasses:"😎",star_struck:"🤩",clown_face:"🤡",cowboy_hat_face:"🤠",hugs:"🤗",smirk:"😏",no_mouth:"😶",neutral_face:"😐",expressionless:"😑",unamused:"😒",roll_eyes:"🙄",thinking:"🤔",lying_face:"🤥",hand_over_mouth:"🤭",shushing:"🤫",symbols_over_mouth:"🤬",exploding_head:"🤯",flushed:"😳",disappointed:"😞",worried:"😟",angry:"😠",rage:"😡",pensive:"😔",confused:"😕",slightly_frowning_face:"🙁",frowning_face:"☹",persevere:"😣",confounded:"😖",tired_face:"😫",weary:"😩",pleading:"🥺",triumph:"😤",open_mouth:"😮",scream:"😱",fearful:"😨",cold_sweat:"😰",hushed:"😯",frowning:"😦",anguished:"😧",cry:"😢",disappointed_relieved:"😥",drooling_face:"🤤",sleepy:"😪",sweat:"😓",hot:"🥵",cold:"🥶",sob:"😭",dizzy_face:"😵",astonished:"😲",zipper_mouth_face:"🤐",nauseated_face:"🤢",sneezing_face:"🤧",vomiting:"🤮",mask:"😷",face_with_thermometer:"🤒",face_with_head_bandage:"🤕",woozy:"🥴",sleeping:"😴",zzz:"💤",poop:"💩",smiling_imp:"😈",imp:"👿",japanese_ogre:"👹",japanese_goblin:"👺",skull:"💀",ghost:"👻",alien:"👽",robot:"🤖",smiley_cat:"😺",smile_cat:"😸",joy_cat:"😹",heart_eyes_cat:"😻",smirk_cat:"😼",kissing_cat:"😽",scream_cat:"🙀",crying_cat_face:"😿",pouting_cat:"😾",palms_up:"🤲",raised_hands:"🙌",clap:"👏",wave:"👋",call_me_hand:"🤙","+1":"👍","-1":"👎",facepunch:"👊",fist:"✊",fist_left:"🤛",fist_right:"🤜",v:"✌",ok_hand:"👌",raised_hand:"✋",raised_back_of_hand:"🤚",open_hands:"👐",muscle:"💪",pray:"🙏",foot:"🦶",leg:"🦵",handshake:"🤝",point_up:"☝",point_up_2:"👆",point_down:"👇",point_left:"👈",point_right:"👉",fu:"🖕",raised_hand_with_fingers_splayed:"🖐",love_you:"🤟",metal:"🤘",crossed_fingers:"🤞",vulcan_salute:"🖖",writing_hand:"✍",selfie:"🤳",nail_care:"💅",lips:"👄",tooth:"🦷",tongue:"👅",ear:"👂",nose:"👃",eye:"👁",eyes:"👀",brain:"🧠",bust_in_silhouette:"👤",busts_in_silhouette:"👥",speaking_head:"🗣",baby:"👶",child:"🧒",boy:"👦",girl:"👧",adult:"🧑",man:"👨",woman:"👩",blonde_woman:"👱‍♀️",blonde_man:"👱",bearded_person:"🧔",older_adult:"🧓",older_man:"👴",older_woman:"👵",man_with_gua_pi_mao:"👲",woman_with_headscarf:"🧕",woman_with_turban:"👳‍♀️",man_with_turban:"👳",policewoman:"👮‍♀️",policeman:"👮",construction_worker_woman:"👷‍♀️",construction_worker_man:"👷",guardswoman:"💂‍♀️",guardsman:"💂",female_detective:"🕵️‍♀️",male_detective:"🕵",woman_health_worker:"👩‍⚕️",man_health_worker:"👨‍⚕️",woman_farmer:"👩‍🌾",man_farmer:"👨‍🌾",woman_cook:"👩‍🍳",man_cook:"👨‍🍳",woman_student:"👩‍🎓",man_student:"👨‍🎓",woman_singer:"👩‍🎤",man_singer:"👨‍🎤",woman_teacher:"👩‍🏫",man_teacher:"👨‍🏫",woman_factory_worker:"👩‍🏭",man_factory_worker:"👨‍🏭",woman_technologist:"👩‍💻",man_technologist:"👨‍💻",woman_office_worker:"👩‍💼",man_office_worker:"👨‍💼",woman_mechanic:"👩‍🔧",man_mechanic:"👨‍🔧",woman_scientist:"👩‍🔬",man_scientist:"👨‍🔬",woman_artist:"👩‍🎨",man_artist:"👨‍🎨",woman_firefighter:"👩‍🚒",man_firefighter:"👨‍🚒",woman_pilot:"👩‍✈️",man_pilot:"👨‍✈️",woman_astronaut:"👩‍🚀",man_astronaut:"👨‍🚀",woman_judge:"👩‍⚖️",man_judge:"👨‍⚖️",woman_superhero:"🦸‍♀️",man_superhero:"🦸‍♂️",woman_supervillain:"🦹‍♀️",man_supervillain:"🦹‍♂️",mrs_claus:"🤶",santa:"🎅",sorceress:"🧙‍♀️",wizard:"🧙‍♂️",woman_elf:"🧝‍♀️",man_elf:"🧝‍♂️",woman_vampire:"🧛‍♀️",man_vampire:"🧛‍♂️",woman_zombie:"🧟‍♀️",man_zombie:"🧟‍♂️",woman_genie:"🧞‍♀️",man_genie:"🧞‍♂️",mermaid:"🧜‍♀️",merman:"🧜‍♂️",woman_fairy:"🧚‍♀️",man_fairy:"🧚‍♂️",angel:"👼",pregnant_woman:"🤰",breastfeeding:"🤱",princess:"👸",prince:"🤴",bride_with_veil:"👰",man_in_tuxedo:"🤵",running_woman:"🏃‍♀️",running_man:"🏃",walking_woman:"🚶‍♀️",walking_man:"🚶",dancer:"💃",man_dancing:"🕺",dancing_women:"👯",dancing_men:"👯‍♂️",couple:"👫",two_men_holding_hands:"👬",two_women_holding_hands:"👭",bowing_woman:"🙇‍♀️",bowing_man:"🙇",man_facepalming:"🤦‍♂️",woman_facepalming:"🤦‍♀️",woman_shrugging:"🤷",man_shrugging:"🤷‍♂️",tipping_hand_woman:"💁",tipping_hand_man:"💁‍♂️",no_good_woman:"🙅",no_good_man:"🙅‍♂️",ok_woman:"🙆",ok_man:"🙆‍♂️",raising_hand_woman:"🙋",raising_hand_man:"🙋‍♂️",pouting_woman:"🙎",pouting_man:"🙎‍♂️",frowning_woman:"🙍",frowning_man:"🙍‍♂️",haircut_woman:"💇",haircut_man:"💇‍♂️",massage_woman:"💆",massage_man:"💆‍♂️",woman_in_steamy_room:"🧖‍♀️",man_in_steamy_room:"🧖‍♂️",couple_with_heart_woman_man:"💑",couple_with_heart_woman_woman:"👩‍❤️‍👩",couple_with_heart_man_man:"👨‍❤️‍👨",couplekiss_man_woman:"💏",couplekiss_woman_woman:"👩‍❤️‍💋‍👩",couplekiss_man_man:"👨‍❤️‍💋‍👨",family_man_woman_boy:"👪",family_man_woman_girl:"👨‍👩‍👧",family_man_woman_girl_boy:"👨‍👩‍👧‍👦",family_man_woman_boy_boy:"👨‍👩‍👦‍👦",family_man_woman_girl_girl:"👨‍👩‍👧‍👧",family_woman_woman_boy:"👩‍👩‍👦",family_woman_woman_girl:"👩‍👩‍👧",family_woman_woman_girl_boy:"👩‍👩‍👧‍👦",family_woman_woman_boy_boy:"👩‍👩‍👦‍👦",family_woman_woman_girl_girl:"👩‍👩‍👧‍👧",family_man_man_boy:"👨‍👨‍👦",family_man_man_girl:"👨‍👨‍👧",family_man_man_girl_boy:"👨‍👨‍👧‍👦",family_man_man_boy_boy:"👨‍👨‍👦‍👦",family_man_man_girl_girl:"👨‍👨‍👧‍👧",family_woman_boy:"👩‍👦",family_woman_girl:"👩‍👧",family_woman_girl_boy:"👩‍👧‍👦",family_woman_boy_boy:"👩‍👦‍👦",family_woman_girl_girl:"👩‍👧‍👧",family_man_boy:"👨‍👦",family_man_girl:"👨‍👧",family_man_girl_boy:"👨‍👧‍👦",family_man_boy_boy:"👨‍👦‍👦",family_man_girl_girl:"👨‍👧‍👧",yarn:"🧶",thread:"🧵",coat:"🧥",labcoat:"🥼",womans_clothes:"👚",tshirt:"👕",jeans:"👖",necktie:"👔",dress:"👗",bikini:"👙",kimono:"👘",lipstick:"💄",kiss:"💋",footprints:"👣",flat_shoe:"🥿",high_heel:"👠",sandal:"👡",boot:"👢",mans_shoe:"👞",athletic_shoe:"👟",hiking_boot:"🥾",socks:"🧦",gloves:"🧤",scarf:"🧣",womans_hat:"👒",tophat:"🎩",billed_hat:"🧢",rescue_worker_helmet:"⛑",mortar_board:"🎓",crown:"👑",school_satchel:"🎒",luggage:"🧳",pouch:"👝",purse:"👛",handbag:"👜",briefcase:"💼",eyeglasses:"👓",dark_sunglasses:"🕶",goggles:"🥽",ring:"💍",closed_umbrella:"🌂",dog:"🐶",cat:"🐱",mouse:"🐭",hamster:"🐹",rabbit:"🐰",fox_face:"🦊",bear:"🐻",panda_face:"🐼",koala:"🐨",tiger:"🐯",lion:"🦁",cow:"🐮",pig:"🐷",pig_nose:"🐽",frog:"🐸",squid:"🦑",octopus:"🐙",shrimp:"🦐",monkey_face:"🐵",gorilla:"🦍",see_no_evil:"🙈",hear_no_evil:"🙉",speak_no_evil:"🙊",monkey:"🐒",chicken:"🐔",penguin:"🐧",bird:"🐦",baby_chick:"🐤",hatching_chick:"🐣",hatched_chick:"🐥",duck:"🦆",eagle:"🦅",owl:"🦉",bat:"🦇",wolf:"🐺",boar:"🐗",horse:"🐴",unicorn:"🦄",honeybee:"🐝",bug:"🐛",butterfly:"🦋",snail:"🐌",beetle:"🐞",ant:"🐜",grasshopper:"🦗",spider:"🕷",scorpion:"🦂",crab:"🦀",snake:"🐍",lizard:"🦎","t-rex":"🦖",sauropod:"🦕",turtle:"🐢",tropical_fish:"🐠",fish:"🐟",blowfish:"🐡",dolphin:"🐬",shark:"🦈",whale:"🐳",whale2:"🐋",crocodile:"🐊",leopard:"🐆",zebra:"🦓",tiger2:"🐅",water_buffalo:"🐃",ox:"🐂",cow2:"🐄",deer:"🦌",dromedary_camel:"🐪",camel:"🐫",giraffe:"🦒",elephant:"🐘",rhinoceros:"🦏",goat:"🐐",ram:"🐏",sheep:"🐑",racehorse:"🐎",pig2:"🐖",rat:"🐀",mouse2:"🐁",rooster:"🐓",turkey:"🦃",dove:"🕊",dog2:"🐕",poodle:"🐩",cat2:"🐈",rabbit2:"🐇",chipmunk:"🐿",hedgehog:"🦔",raccoon:"🦝",llama:"🦙",hippopotamus:"🦛",kangaroo:"🦘",badger:"🦡",swan:"🦢",peacock:"🦚",parrot:"🦜",lobster:"🦞",mosquito:"🦟",paw_prints:"🐾",dragon:"🐉",dragon_face:"🐲",cactus:"🌵",christmas_tree:"🎄",evergreen_tree:"🌲",deciduous_tree:"🌳",palm_tree:"🌴",seedling:"🌱",herb:"🌿",shamrock:"☘",four_leaf_clover:"🍀",bamboo:"🎍",tanabata_tree:"🎋",leaves:"🍃",fallen_leaf:"🍂",maple_leaf:"🍁",ear_of_rice:"🌾",hibiscus:"🌺",sunflower:"🌻",rose:"🌹",wilted_flower:"🥀",tulip:"🌷",blossom:"🌼",cherry_blossom:"🌸",bouquet:"💐",mushroom:"🍄",chestnut:"🌰",jack_o_lantern:"🎃",shell:"🐚",spider_web:"🕸",earth_americas:"🌎",earth_africa:"🌍",earth_asia:"🌏",full_moon:"🌕",waning_gibbous_moon:"🌖",last_quarter_moon:"🌗",waning_crescent_moon:"🌘",new_moon:"🌑",waxing_crescent_moon:"🌒",first_quarter_moon:"🌓",waxing_gibbous_moon:"🌔",new_moon_with_face:"🌚",full_moon_with_face:"🌝",first_quarter_moon_with_face:"🌛",last_quarter_moon_with_face:"🌜",sun_with_face:"🌞",crescent_moon:"🌙",star:"⭐",star2:"🌟",dizzy:"💫",sparkles:"✨",comet:"☄",sunny:"☀️",sun_behind_small_cloud:"🌤",partly_sunny:"⛅",sun_behind_large_cloud:"🌥",sun_behind_rain_cloud:"🌦",cloud:"☁️",cloud_with_rain:"🌧",cloud_with_lightning_and_rain:"⛈",cloud_with_lightning:"🌩",zap:"⚡",fire:"🔥",boom:"💥",snowflake:"❄️",cloud_with_snow:"🌨",snowman:"⛄",snowman_with_snow:"☃",wind_face:"🌬",dash:"💨",tornado:"🌪",fog:"🌫",open_umbrella:"☂",umbrella:"☔",droplet:"💧",sweat_drops:"💦",ocean:"🌊",green_apple:"🍏",apple:"🍎",pear:"🍐",tangerine:"🍊",lemon:"🍋",banana:"🍌",watermelon:"🍉",grapes:"🍇",strawberry:"🍓",melon:"🍈",cherries:"🍒",peach:"🍑",pineapple:"🍍",coconut:"🥥",kiwi_fruit:"🥝",mango:"🥭",avocado:"🥑",broccoli:"🥦",tomato:"🍅",eggplant:"🍆",cucumber:"🥒",carrot:"🥕",hot_pepper:"🌶",potato:"🥔",corn:"🌽",leafy_greens:"🥬",sweet_potato:"🍠",peanuts:"🥜",honey_pot:"🍯",croissant:"🥐",bread:"🍞",baguette_bread:"🥖",bagel:"🥯",pretzel:"🥨",cheese:"🧀",egg:"🥚",bacon:"🥓",steak:"🥩",pancakes:"🥞",poultry_leg:"🍗",meat_on_bone:"🍖",bone:"🦴",fried_shrimp:"🍤",fried_egg:"🍳",hamburger:"🍔",fries:"🍟",stuffed_flatbread:"🥙",hotdog:"🌭",pizza:"🍕",sandwich:"🥪",canned_food:"🥫",spaghetti:"🍝",taco:"🌮",burrito:"🌯",green_salad:"🥗",shallow_pan_of_food:"🥘",ramen:"🍜",stew:"🍲",fish_cake:"🍥",fortune_cookie:"🥠",sushi:"🍣",bento:"🍱",curry:"🍛",rice_ball:"🍙",rice:"🍚",rice_cracker:"🍘",oden:"🍢",dango:"🍡",shaved_ice:"🍧",ice_cream:"🍨",icecream:"🍦",pie:"🥧",cake:"🍰",cupcake:"🧁",moon_cake:"🥮",birthday:"🎂",custard:"🍮",candy:"🍬",lollipop:"🍭",chocolate_bar:"🍫",popcorn:"🍿",dumpling:"🥟",doughnut:"🍩",cookie:"🍪",milk_glass:"🥛",beer:"🍺",beers:"🍻",clinking_glasses:"🥂",wine_glass:"🍷",tumbler_glass:"🥃",cocktail:"🍸",tropical_drink:"🍹",champagne:"🍾",sake:"🍶",tea:"🍵",cup_with_straw:"🥤",coffee:"☕",baby_bottle:"🍼",salt:"🧂",spoon:"🥄",fork_and_knife:"🍴",plate_with_cutlery:"🍽",bowl_with_spoon:"🥣",takeout_box:"🥡",chopsticks:"🥢",soccer:"⚽",basketball:"🏀",football:"🏈",baseball:"⚾",softball:"🥎",tennis:"🎾",volleyball:"🏐",rugby_football:"🏉",flying_disc:"🥏","8ball":"🎱",golf:"⛳",golfing_woman:"🏌️‍♀️",golfing_man:"🏌",ping_pong:"🏓",badminton:"🏸",goal_net:"🥅",ice_hockey:"🏒",field_hockey:"🏑",lacrosse:"🥍",cricket:"🏏",ski:"🎿",skier:"⛷",snowboarder:"🏂",person_fencing:"🤺",women_wrestling:"🤼‍♀️",men_wrestling:"🤼‍♂️",woman_cartwheeling:"🤸‍♀️",man_cartwheeling:"🤸‍♂️",woman_playing_handball:"🤾‍♀️",man_playing_handball:"🤾‍♂️",ice_skate:"⛸",curling_stone:"🥌",skateboard:"🛹",sled:"🛷",bow_and_arrow:"🏹",fishing_pole_and_fish:"🎣",boxing_glove:"🥊",martial_arts_uniform:"🥋",rowing_woman:"🚣‍♀️",rowing_man:"🚣",climbing_woman:"🧗‍♀️",climbing_man:"🧗‍♂️",swimming_woman:"🏊‍♀️",swimming_man:"🏊",woman_playing_water_polo:"🤽‍♀️",man_playing_water_polo:"🤽‍♂️",woman_in_lotus_position:"🧘‍♀️",man_in_lotus_position:"🧘‍♂️",surfing_woman:"🏄‍♀️",surfing_man:"🏄",bath:"🛀",basketball_woman:"⛹️‍♀️",basketball_man:"⛹",weight_lifting_woman:"🏋️‍♀️",weight_lifting_man:"🏋",biking_woman:"🚴‍♀️",biking_man:"🚴",mountain_biking_woman:"🚵‍♀️",mountain_biking_man:"🚵",horse_racing:"🏇",business_suit_levitating:"🕴",trophy:"🏆",running_shirt_with_sash:"🎽",medal_sports:"🏅",medal_military:"🎖","1st_place_medal":"🥇","2nd_place_medal":"🥈","3rd_place_medal":"🥉",reminder_ribbon:"🎗",rosette:"🏵",ticket:"🎫",tickets:"🎟",performing_arts:"🎭",art:"🎨",circus_tent:"🎪",woman_juggling:"🤹‍♀️",man_juggling:"🤹‍♂️",microphone:"🎤",headphones:"🎧",musical_score:"🎼",musical_keyboard:"🎹",drum:"🥁",saxophone:"🎷",trumpet:"🎺",guitar:"🎸",violin:"🎻",clapper:"🎬",video_game:"🎮",space_invader:"👾",dart:"🎯",game_die:"🎲",chess_pawn:"♟",slot_machine:"🎰",jigsaw:"🧩",bowling:"🎳",red_car:"🚗",taxi:"🚕",blue_car:"🚙",bus:"🚌",trolleybus:"🚎",racing_car:"🏎",police_car:"🚓",ambulance:"🚑",fire_engine:"🚒",minibus:"🚐",truck:"🚚",articulated_lorry:"🚛",tractor:"🚜",kick_scooter:"🛴",motorcycle:"🏍",bike:"🚲",motor_scooter:"🛵",rotating_light:"🚨",oncoming_police_car:"🚔",oncoming_bus:"🚍",oncoming_automobile:"🚘",oncoming_taxi:"🚖",aerial_tramway:"🚡",mountain_cableway:"🚠",suspension_railway:"🚟",railway_car:"🚃",train:"🚋",monorail:"🚝",bullettrain_side:"🚄",bullettrain_front:"🚅",light_rail:"🚈",mountain_railway:"🚞",steam_locomotive:"🚂",train2:"🚆",metro:"🚇",tram:"🚊",station:"🚉",flying_saucer:"🛸",helicopter:"🚁",small_airplane:"🛩",airplane:"✈️",flight_departure:"🛫",flight_arrival:"🛬",sailboat:"⛵",motor_boat:"🛥",speedboat:"🚤",ferry:"⛴",passenger_ship:"🛳",rocket:"🚀",artificial_satellite:"🛰",seat:"💺",canoe:"🛶",anchor:"⚓",construction:"🚧",fuelpump:"⛽",busstop:"🚏",vertical_traffic_light:"🚦",traffic_light:"🚥",checkered_flag:"🏁",ship:"🚢",ferris_wheel:"🎡",roller_coaster:"🎢",carousel_horse:"🎠",building_construction:"🏗",foggy:"🌁",tokyo_tower:"🗼",factory:"🏭",fountain:"⛲",rice_scene:"🎑",mountain:"⛰",mountain_snow:"🏔",mount_fuji:"🗻",volcano:"🌋",japan:"🗾",camping:"🏕",tent:"⛺",national_park:"🏞",motorway:"🛣",railway_track:"🛤",sunrise:"🌅",sunrise_over_mountains:"🌄",desert:"🏜",beach_umbrella:"🏖",desert_island:"🏝",city_sunrise:"🌇",city_sunset:"🌆",cityscape:"🏙",night_with_stars:"🌃",bridge_at_night:"🌉",milky_way:"🌌",stars:"🌠",sparkler:"🎇",fireworks:"🎆",rainbow:"🌈",houses:"🏘",european_castle:"🏰",japanese_castle:"🏯",stadium:"🏟",statue_of_liberty:"🗽",house:"🏠",house_with_garden:"🏡",derelict_house:"🏚",office:"🏢",department_store:"🏬",post_office:"🏣",european_post_office:"🏤",hospital:"🏥",bank:"🏦",hotel:"🏨",convenience_store:"🏪",school:"🏫",love_hotel:"🏩",wedding:"💒",classical_building:"🏛",church:"⛪",mosque:"🕌",synagogue:"🕍",kaaba:"🕋",shinto_shrine:"⛩",watch:"⌚",iphone:"📱",calling:"📲",computer:"💻",keyboard:"⌨",desktop_computer:"🖥",printer:"🖨",computer_mouse:"🖱",trackball:"🖲",joystick:"🕹",clamp:"🗜",minidisc:"💽",floppy_disk:"💾",cd:"💿",dvd:"📀",vhs:"📼",camera:"📷",camera_flash:"📸",video_camera:"📹",movie_camera:"🎥",film_projector:"📽",film_strip:"🎞",telephone_receiver:"📞",phone:"☎️",pager:"📟",fax:"📠",tv:"📺",radio:"📻",studio_microphone:"🎙",level_slider:"🎚",control_knobs:"🎛",compass:"🧭",stopwatch:"⏱",timer_clock:"⏲",alarm_clock:"⏰",mantelpiece_clock:"🕰",hourglass_flowing_sand:"⏳",hourglass:"⌛",satellite:"📡",battery:"🔋",electric_plug:"🔌",bulb:"💡",flashlight:"🔦",candle:"🕯",fire_extinguisher:"🧯",wastebasket:"🗑",oil_drum:"🛢",money_with_wings:"💸",dollar:"💵",yen:"💴",euro:"💶",pound:"💷",moneybag:"💰",credit_card:"💳",gem:"💎",balance_scale:"⚖",toolbox:"🧰",wrench:"🔧",hammer:"🔨",hammer_and_pick:"⚒",hammer_and_wrench:"🛠",pick:"⛏",nut_and_bolt:"🔩",gear:"⚙",brick:"🧱",chains:"⛓",magnet:"🧲",gun:"🔫",bomb:"💣",firecracker:"🧨",hocho:"🔪",dagger:"🗡",crossed_swords:"⚔",shield:"🛡",smoking:"🚬",skull_and_crossbones:"☠",coffin:"⚰",funeral_urn:"⚱",amphora:"🏺",crystal_ball:"🔮",prayer_beads:"📿",nazar_amulet:"🧿",barber:"💈",alembic:"⚗",telescope:"🔭",microscope:"🔬",hole:"🕳",pill:"💊",syringe:"💉",dna:"🧬",microbe:"🦠",petri_dish:"🧫",test_tube:"🧪",thermometer:"🌡",broom:"🧹",basket:"🧺",toilet_paper:"🧻",label:"🏷",bookmark:"🔖",toilet:"🚽",shower:"🚿",bathtub:"🛁",soap:"🧼",sponge:"🧽",lotion_bottle:"🧴",key:"🔑",old_key:"🗝",couch_and_lamp:"🛋",sleeping_bed:"🛌",bed:"🛏",door:"🚪",bellhop_bell:"🛎",teddy_bear:"🧸",framed_picture:"🖼",world_map:"🗺",parasol_on_ground:"⛱",moyai:"🗿",shopping:"🛍",shopping_cart:"🛒",balloon:"🎈",flags:"🎏",ribbon:"🎀",gift:"🎁",confetti_ball:"🎊",tada:"🎉",dolls:"🎎",wind_chime:"🎐",crossed_flags:"🎌",izakaya_lantern:"🏮",red_envelope:"🧧",email:"✉️",envelope_with_arrow:"📩",incoming_envelope:"📨","e-mail":"📧",love_letter:"💌",postbox:"📮",mailbox_closed:"📪",mailbox:"📫",mailbox_with_mail:"📬",mailbox_with_no_mail:"📭",package:"📦",postal_horn:"📯",inbox_tray:"📥",outbox_tray:"📤",scroll:"📜",page_with_curl:"📃",bookmark_tabs:"📑",receipt:"🧾",bar_chart:"📊",chart_with_upwards_trend:"📈",chart_with_downwards_trend:"📉",page_facing_up:"📄",date:"📅",calendar:"📆",spiral_calendar:"🗓",card_index:"📇",card_file_box:"🗃",ballot_box:"🗳",file_cabinet:"🗄",clipboard:"📋",spiral_notepad:"🗒",file_folder:"📁",open_file_folder:"📂",card_index_dividers:"🗂",newspaper_roll:"🗞",newspaper:"📰",notebook:"📓",closed_book:"📕",green_book:"📗",blue_book:"📘",orange_book:"📙",notebook_with_decorative_cover:"📔",ledger:"📒",books:"📚",open_book:"📖",safety_pin:"🧷",link:"🔗",paperclip:"📎",paperclips:"🖇",scissors:"✂️",triangular_ruler:"📐",straight_ruler:"📏",abacus:"🧮",pushpin:"📌",round_pushpin:"📍",triangular_flag_on_post:"🚩",white_flag:"🏳",black_flag:"🏴",rainbow_flag:"🏳️‍🌈",closed_lock_with_key:"🔐",lock:"🔒",unlock:"🔓",lock_with_ink_pen:"🔏",pen:"🖊",fountain_pen:"🖋",black_nib:"✒️",memo:"📝",pencil2:"✏️",crayon:"🖍",paintbrush:"🖌",mag:"🔍",mag_right:"🔎",heart:"❤️",orange_heart:"🧡",yellow_heart:"💛",green_heart:"💚",blue_heart:"💙",purple_heart:"💜",black_heart:"🖤",broken_heart:"💔",heavy_heart_exclamation:"❣",two_hearts:"💕",revolving_hearts:"💞",heartbeat:"💓",heartpulse:"💗",sparkling_heart:"💖",cupid:"💘",gift_heart:"💝",heart_decoration:"💟",peace_symbol:"☮",latin_cross:"✝",star_and_crescent:"☪",om:"🕉",wheel_of_dharma:"☸",star_of_david:"✡",six_pointed_star:"🔯",menorah:"🕎",yin_yang:"☯",orthodox_cross:"☦",place_of_worship:"🛐",ophiuchus:"⛎",aries:"♈",taurus:"♉",gemini:"♊",cancer:"♋",leo:"♌",virgo:"♍",libra:"♎",scorpius:"♏",sagittarius:"♐",capricorn:"♑",aquarius:"♒",pisces:"♓",id:"🆔",atom_symbol:"⚛",u7a7a:"🈳",u5272:"🈹",radioactive:"☢",biohazard:"☣",mobile_phone_off:"📴",vibration_mode:"📳",u6709:"🈶",u7121:"🈚",u7533:"🈸",u55b6:"🈺",u6708:"🈷️",eight_pointed_black_star:"✴️",vs:"🆚",accept:"🉑",white_flower:"💮",ideograph_advantage:"🉐",secret:"㊙️",congratulations:"㊗️",u5408:"🈴",u6e80:"🈵",u7981:"🈲",a:"🅰️",b:"🅱️",ab:"🆎",cl:"🆑",o2:"🅾️",sos:"🆘",no_entry:"⛔",name_badge:"📛",no_entry_sign:"🚫",x:"❌",o:"⭕",stop_sign:"🛑",anger:"💢",hotsprings:"♨️",no_pedestrians:"🚷",do_not_litter:"🚯",no_bicycles:"🚳","non-potable_water":"🚱",underage:"🔞",no_mobile_phones:"📵",exclamation:"❗",grey_exclamation:"❕",question:"❓",grey_question:"❔",bangbang:"‼️",interrobang:"⁉️",low_brightness:"🔅",high_brightness:"🔆",trident:"🔱",fleur_de_lis:"⚜",part_alternation_mark:"〽️",warning:"⚠️",children_crossing:"🚸",beginner:"🔰",recycle:"♻️",u6307:"🈯",chart:"💹",sparkle:"❇️",eight_spoked_asterisk:"✳️",negative_squared_cross_mark:"❎",white_check_mark:"✅",diamond_shape_with_a_dot_inside:"💠",cyclone:"🌀",loop:"➿",globe_with_meridians:"🌐",m:"Ⓜ️",atm:"🏧",sa:"🈂️",passport_control:"🛂",customs:"🛃",baggage_claim:"🛄",left_luggage:"🛅",wheelchair:"♿",no_smoking:"🚭",wc:"🚾",parking:"🅿️",potable_water:"🚰",mens:"🚹",womens:"🚺",baby_symbol:"🚼",restroom:"🚻",put_litter_in_its_place:"🚮",cinema:"🎦",signal_strength:"📶",koko:"🈁",ng:"🆖",ok:"🆗",up:"🆙",cool:"🆒",new:"🆕",free:"🆓",zero:"0️⃣",one:"1️⃣",two:"2️⃣",three:"3️⃣",four:"4️⃣",five:"5️⃣",six:"6️⃣",seven:"7️⃣",eight:"8️⃣",nine:"9️⃣",keycap_ten:"🔟",asterisk:"*⃣",eject_button:"⏏️",arrow_forward:"▶️",pause_button:"⏸",next_track_button:"⏭",stop_button:"⏹",record_button:"⏺",play_or_pause_button:"⏯",previous_track_button:"⏮",fast_forward:"⏩",rewind:"⏪",twisted_rightwards_arrows:"🔀",repeat:"🔁",repeat_one:"🔂",arrow_backward:"◀️",arrow_up_small:"🔼",arrow_down_small:"🔽",arrow_double_up:"⏫",arrow_double_down:"⏬",arrow_right:"➡️",arrow_left:"⬅️",arrow_up:"⬆️",arrow_down:"⬇️",arrow_upper_right:"↗️",arrow_lower_right:"↘️",arrow_lower_left:"↙️",arrow_upper_left:"↖️",arrow_up_down:"↕️",left_right_arrow:"↔️",arrows_counterclockwise:"🔄",arrow_right_hook:"↪️",leftwards_arrow_with_hook:"↩️",arrow_heading_up:"⤴️",arrow_heading_down:"⤵️",hash:"#️⃣",information_source:"ℹ️",abc:"🔤",abcd:"🔡",capital_abcd:"🔠",symbols:"🔣",musical_note:"🎵",notes:"🎶",wavy_dash:"〰️",curly_loop:"➰",heavy_check_mark:"✔️",arrows_clockwise:"🔃",heavy_plus_sign:"➕",heavy_minus_sign:"➖",heavy_division_sign:"➗",heavy_multiplication_x:"✖️",infinity:"♾",heavy_dollar_sign:"💲",currency_exchange:"💱",copyright:"©️",registered:"®️",tm:"™️",end:"🔚",back:"🔙",on:"🔛",top:"🔝",soon:"🔜",ballot_box_with_check:"☑️",radio_button:"🔘",white_circle:"⚪",black_circle:"⚫",red_circle:"🔴",large_blue_circle:"🔵",small_orange_diamond:"🔸",small_blue_diamond:"🔹",large_orange_diamond:"🔶",large_blue_diamond:"🔷",small_red_triangle:"🔺",black_small_square:"▪️",white_small_square:"▫️",black_large_square:"⬛",white_large_square:"⬜",small_red_triangle_down:"🔻",black_medium_square:"◼️",white_medium_square:"◻️",black_medium_small_square:"◾",white_medium_small_square:"◽",black_square_button:"🔲",white_square_button:"🔳",speaker:"🔈",sound:"🔉",loud_sound:"🔊",mute:"🔇",mega:"📣",loudspeaker:"📢",bell:"🔔",no_bell:"🔕",black_joker:"🃏",mahjong:"🀄",spades:"♠️",clubs:"♣️",hearts:"♥️",diamonds:"♦️",flower_playing_cards:"🎴",thought_balloon:"💭",right_anger_bubble:"🗯",speech_balloon:"💬",left_speech_bubble:"🗨",clock1:"🕐",clock2:"🕑",clock3:"🕒",clock4:"🕓",clock5:"🕔",clock6:"🕕",clock7:"🕖",clock8:"🕗",clock9:"🕘",clock10:"🕙",clock11:"🕚",clock12:"🕛",clock130:"🕜",clock230:"🕝",clock330:"🕞",clock430:"🕟",clock530:"🕠",clock630:"🕡",clock730:"🕢",clock830:"🕣",clock930:"🕤",clock1030:"🕥",clock1130:"🕦",clock1230:"🕧",afghanistan:"🇦🇫",aland_islands:"🇦🇽",albania:"🇦🇱",algeria:"🇩🇿",american_samoa:"🇦🇸",andorra:"🇦🇩",angola:"🇦🇴",anguilla:"🇦🇮",antarctica:"🇦🇶",antigua_barbuda:"🇦🇬",argentina:"🇦🇷",armenia:"🇦🇲",aruba:"🇦🇼",australia:"🇦🇺",austria:"🇦🇹",azerbaijan:"🇦🇿",bahamas:"🇧🇸",bahrain:"🇧🇭",bangladesh:"🇧🇩",barbados:"🇧🇧",belarus:"🇧🇾",belgium:"🇧🇪",belize:"🇧🇿",benin:"🇧🇯",bermuda:"🇧🇲",bhutan:"🇧🇹",bolivia:"🇧🇴",caribbean_netherlands:"🇧🇶",bosnia_herzegovina:"🇧🇦",botswana:"🇧🇼",brazil:"🇧🇷",british_indian_ocean_territory:"🇮🇴",british_virgin_islands:"🇻🇬",brunei:"🇧🇳",bulgaria:"🇧🇬",burkina_faso:"🇧🇫",burundi:"🇧🇮",cape_verde:"🇨🇻",cambodia:"🇰🇭",cameroon:"🇨🇲",canada:"🇨🇦",canary_islands:"🇮🇨",cayman_islands:"🇰🇾",central_african_republic:"🇨🇫",chad:"🇹🇩",chile:"🇨🇱",cn:"🇨🇳",christmas_island:"🇨🇽",cocos_islands:"🇨🇨",colombia:"🇨🇴",comoros:"🇰🇲",congo_brazzaville:"🇨🇬",congo_kinshasa:"🇨🇩",cook_islands:"🇨🇰",costa_rica:"🇨🇷",croatia:"🇭🇷",cuba:"🇨🇺",curacao:"🇨🇼",cyprus:"🇨🇾",czech_republic:"🇨🇿",denmark:"🇩🇰",djibouti:"🇩🇯",dominica:"🇩🇲",dominican_republic:"🇩🇴",ecuador:"🇪🇨",egypt:"🇪🇬",el_salvador:"🇸🇻",equatorial_guinea:"🇬🇶",eritrea:"🇪🇷",estonia:"🇪🇪",ethiopia:"🇪🇹",eu:"🇪🇺",falkland_islands:"🇫🇰",faroe_islands:"🇫🇴",fiji:"🇫🇯",finland:"🇫🇮",fr:"🇫🇷",french_guiana:"🇬🇫",french_polynesia:"🇵🇫",french_southern_territories:"🇹🇫",gabon:"🇬🇦",gambia:"🇬🇲",georgia:"🇬🇪",de:"🇩🇪",ghana:"🇬🇭",gibraltar:"🇬🇮",greece:"🇬🇷",greenland:"🇬🇱",grenada:"🇬🇩",guadeloupe:"🇬🇵",guam:"🇬🇺",guatemala:"🇬🇹",guernsey:"🇬🇬",guinea:"🇬🇳",guinea_bissau:"🇬🇼",guyana:"🇬🇾",haiti:"🇭🇹",honduras:"🇭🇳",hong_kong:"🇭🇰",hungary:"🇭🇺",iceland:"🇮🇸",india:"🇮🇳",indonesia:"🇮🇩",iran:"🇮🇷",iraq:"🇮🇶",ireland:"🇮🇪",isle_of_man:"🇮🇲",israel:"🇮🇱",it:"🇮🇹",cote_divoire:"🇨🇮",jamaica:"🇯🇲",jp:"🇯🇵",jersey:"🇯🇪",jordan:"🇯🇴",kazakhstan:"🇰🇿",kenya:"🇰🇪",kiribati:"🇰🇮",kosovo:"🇽🇰",kuwait:"🇰🇼",kyrgyzstan:"🇰🇬",laos:"🇱🇦",latvia:"🇱🇻",lebanon:"🇱🇧",lesotho:"🇱🇸",liberia:"🇱🇷",libya:"🇱🇾",liechtenstein:"🇱🇮",lithuania:"🇱🇹",luxembourg:"🇱🇺",macau:"🇲🇴",macedonia:"🇲🇰",madagascar:"🇲🇬",malawi:"🇲🇼",malaysia:"🇲🇾",maldives:"🇲🇻",mali:"🇲🇱",malta:"🇲🇹",marshall_islands:"🇲🇭",martinique:"🇲🇶",mauritania:"🇲🇷",mauritius:"🇲🇺",mayotte:"🇾🇹",mexico:"🇲🇽",micronesia:"🇫🇲",moldova:"🇲🇩",monaco:"🇲🇨",mongolia:"🇲🇳",montenegro:"🇲🇪",montserrat:"🇲🇸",morocco:"🇲🇦",mozambique:"🇲🇿",myanmar:"🇲🇲",namibia:"🇳🇦",nauru:"🇳🇷",nepal:"🇳🇵",netherlands:"🇳🇱",new_caledonia:"🇳🇨",new_zealand:"🇳🇿",nicaragua:"🇳🇮",niger:"🇳🇪",nigeria:"🇳🇬",niue:"🇳🇺",norfolk_island:"🇳🇫",northern_mariana_islands:"🇲🇵",north_korea:"🇰🇵",norway:"🇳🇴",oman:"🇴🇲",pakistan:"🇵🇰",palau:"🇵🇼",palestinian_territories:"🇵🇸",panama:"🇵🇦",papua_new_guinea:"🇵🇬",paraguay:"🇵🇾",peru:"🇵🇪",philippines:"🇵🇭",pitcairn_islands:"🇵🇳",poland:"🇵🇱",portugal:"🇵🇹",puerto_rico:"🇵🇷",qatar:"🇶🇦",reunion:"🇷🇪",romania:"🇷🇴",ru:"🇷🇺",rwanda:"🇷🇼",st_barthelemy:"🇧🇱",st_helena:"🇸🇭",st_kitts_nevis:"🇰🇳",st_lucia:"🇱🇨",st_pierre_miquelon:"🇵🇲",st_vincent_grenadines:"🇻🇨",samoa:"🇼🇸",san_marino:"🇸🇲",sao_tome_principe:"🇸🇹",saudi_arabia:"🇸🇦",senegal:"🇸🇳",serbia:"🇷🇸",seychelles:"🇸🇨",sierra_leone:"🇸🇱",singapore:"🇸🇬",sint_maarten:"🇸🇽",slovakia:"🇸🇰",slovenia:"🇸🇮",solomon_islands:"🇸🇧",somalia:"🇸🇴",south_africa:"🇿🇦",south_georgia_south_sandwich_islands:"🇬🇸",kr:"🇰🇷",south_sudan:"🇸🇸",es:"🇪🇸",sri_lanka:"🇱🇰",sudan:"🇸🇩",suriname:"🇸🇷",swaziland:"🇸🇿",sweden:"🇸🇪",switzerland:"🇨🇭",syria:"🇸🇾",taiwan:"🇹🇼",tajikistan:"🇹🇯",tanzania:"🇹🇿",thailand:"🇹🇭",timor_leste:"🇹🇱",togo:"🇹🇬",tokelau:"🇹🇰",tonga:"🇹🇴",trinidad_tobago:"🇹🇹",tunisia:"🇹🇳",tr:"🇹🇷",turkmenistan:"🇹🇲",turks_caicos_islands:"🇹🇨",tuvalu:"🇹🇻",uganda:"🇺🇬",ukraine:"🇺🇦",united_arab_emirates:"🇦🇪",uk:"🇬🇧",england:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",wales:"🏴󠁧󠁢󠁷󠁬󠁳󠁿",us:"🇺🇸",us_virgin_islands:"🇻🇮",uruguay:"🇺🇾",uzbekistan:"🇺🇿",vanuatu:"🇻🇺",vatican_city:"🇻🇦",venezuela:"🇻🇪",vietnam:"🇻🇳",wallis_futuna:"🇼🇫",western_sahara:"🇪🇭",yemen:"🇾🇪",zambia:"🇿🇲",zimbabwe:"🇿🇼",united_nations:"🇺🇳",pirate_flag:"🏴‍☠️"},ks=typeof navigator<"u"&&navigator.hardwareConcurrency?Math.max(1,Math.floor(navigator.hardwareConcurrency/2)):2;function _s(){if(typeof Worker<"u")try{return new bs}catch{}const e={message:[],error:[]};return{addEventListener(n,i){e[n]||(e[n]=[]),e[n].push(i)},removeEventListener(n,i){if(!e[n])return;const r=e[n].indexOf(i);r!==-1&&e[n].splice(r,1)},postMessage(n){setTimeout(async()=>{try{const r={data:await ys(n)}(e.message||[]).forEach(a=>a(r))}catch{const r={data:{id:n&&n.id}}(e.message||[]).forEach(a=>a(r))}},0)},terminate(){Object.keys(e).forEach(n=>e[n].length=0)}}}const si=mr(()=>_s(),"markdown",ks),oi=typeof DOMParser<"u"?new DOMParser:null,dt=()=>si.get(),Dn=e=>si.send(e,3e3),Ge=[];function Hn(e){if(e&&(typeof e=="object"||typeof e=="function")){Ge.push(e);try{ae.use(e)}catch(t){console.warn("[markdown] failed to apply plugin",t)}}}function xs(e){Ge.length=0,Array.isArray(e)&&Ge.push(...e.filter(t=>t&&typeof t=="object"));try{Ge.forEach(t=>ae.use(t))}catch(t){console.warn("[markdown] failed to apply markdown extensions",t)}}async function dn(e){if(Ge&&Ge.length){let{content:i,data:r}=un(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(s,u)=>qn[u]||s)}catch{}ae.setOptions({gfm:!0,mangle:!1,headerIds:!1,headerPrefix:""});try{Ge.forEach(s=>ae.use(s))}catch(s){console.warn("[markdown] apply plugins failed",s)}const a=ae.parse(i);try{const s=oi||(typeof DOMParser<"u"?new DOMParser:null);if(s){const u=s.parseFromString(a,"text/html"),o=u.querySelectorAll("h1,h2,h3,h4,h5,h6"),l=[],c=new Set,f=h=>{try{return String(h||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},m=h=>{const d={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},p=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal";return(d[h]+" "+p).trim()};o.forEach(h=>{try{const d=Number(h.tagName.substring(1)),p=(h.textContent||"").trim();let g=f(p)||"heading",w=g,y=2;for(;c.has(w);)w=g+"-"+y,y+=1;c.add(w),h.id=w,h.className=m(d),l.push({level:d,text:p,id:w})}catch{}});try{u.querySelectorAll("img").forEach(h=>{try{const d=h.getAttribute&&h.getAttribute("loading"),p=h.getAttribute&&h.getAttribute("data-want-lazy");!d&&!p&&h.setAttribute&&h.setAttribute("loading","lazy")}catch{}})}catch{}try{u.querySelectorAll("pre code, code[class]").forEach(h=>{try{const d=h.getAttribute&&h.getAttribute("class")||h.className||"",p=String(d||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(p)try{h.setAttribute&&h.setAttribute("class",p)}catch{h.className=p}else try{h.removeAttribute&&h.removeAttribute("class")}catch{h.className=""}}catch{}})}catch{}return{html:u.body.innerHTML,meta:r||{},toc:l}}}catch{}return{html:a,meta:r||{},toc:[]}}let t;if(typeof process<"u"&&process.env&&process.env.VITEST)try{const i=await Promise.resolve().then(()=>li);t=i.initRendererWorker&&i.initRendererWorker()}catch{t=dt&&dt()}else t=dt&&dt();try{e=String(e||"").replace(/:([^:\s]+):/g,(i,r)=>qn[r]||i)}catch{}try{if(typeof de<"u"&&de&&typeof de.getLanguage=="function"&&de.getLanguage("plaintext")&&/```\s*\n/.test(String(e||""))){let{content:i,data:r}=un(e||"");try{i=String(i||"").replace(/:([^:\s]+):/g,(l,c)=>qn[c]||l)}catch{}ae.setOptions({gfm:!0,headerIds:!0,mangle:!1,highlighted:(l,c)=>{try{return c&&de.getLanguage&&de.getLanguage(c)?de.highlight(l,{language:c}).value:de&&typeof de.getLanguage=="function"&&de.getLanguage("plaintext")?de.highlight(l,{language:"plaintext"}).value:l}catch{return l}}});let a=ae.parse(i);try{a=a.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g,(l,c)=>{try{if(c&&de&&typeof de.highlight=="function")try{const f=de.highlight(c,{language:"plaintext"});return`<pre><code>${f&&f.value?f.value:f}</code></pre>`}catch{try{if(de&&typeof de.highlightElement=="function"){const m={innerHTML:c};return de.highlightElement(m),`<pre><code>${m.innerHTML}</code></pre>`}}catch{}}}catch{}return l})}catch{}const s=[],u=new Set,o=l=>{try{return String(l||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}};return a=a.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(l,c,f,m)=>{const h=Number(c),d=m.replace(/<[^>]+>/g,"").trim();let p=o(d)||"heading",g=p,w=2;for(;u.has(g);)g=p+"-"+w,w+=1;u.add(g),s.push({level:h,text:d,id:g});const y={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},k=h<=2?"has-text-weight-bold":h<=4?"has-text-weight-semibold":"has-text-weight-normal",v=(y[h]+" "+k).trim(),N=((f||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${g}" class="${v}"`).trim();return`<h${h} ${N}>${m}</h${h}>`}),a=a.replace(/<img([^>]*)>/g,(l,c)=>/\bloading=/.test(c)?`<img${c}>`:/\bdata-want-lazy=/.test(c)?`<img${c}>`:`<img${c} loading="lazy">`),{html:a,meta:r||{},toc:s}}}catch{}if(!t)throw new Error("renderer worker required but unavailable");const n=await Dn({type:"render",md:e});if(!n||typeof n!="object"||n.html===void 0)throw new Error("renderer worker returned invalid response");try{const i=new Map,r=[],a=o=>{try{return String(o||"").toLowerCase().trim().replace(/[^a-z0-9\-\s]+/g,"").replace(/\s+/g,"-")}catch{return"heading"}},s=o=>{const l={1:"is-size-3-mobile is-size-2-tablet is-size-1-desktop",2:"is-size-4-mobile is-size-3-tablet is-size-2-desktop",3:"is-size-5-mobile is-size-4-tablet is-size-3-desktop",4:"is-size-6-mobile is-size-5-tablet is-size-4-desktop",5:"is-size-6-mobile is-size-6-tablet is-size-5-desktop",6:"is-size-6-mobile is-size-6-tablet is-size-6-desktop"},c=o<=2?"has-text-weight-bold":o<=4?"has-text-weight-semibold":"has-text-weight-normal";return(l[o]+" "+c).trim()};let u=n.html;u=u.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(o,l,c,f)=>{const m=Number(l),h=f.replace(/<[^>]+>/g,"").trim(),d=(c||"").match(/\sid="([^"]+)"/),p=d?d[1]:a(h)||"heading",w=(i.get(p)||0)+1;i.set(p,w);const y=w===1?p:p+"-"+w;r.push({level:m,text:h,id:y});const k=s(m),$=((c||"").replace(/\s*(id|class)="[^"]*"/g,"")+` id="${y}" class="${k}"`).trim();return`<h${m} ${$}>${f}</h${m}>`});try{const o=typeof document<"u"&&document.documentElement&&document.documentElement.getAttribute&&document.documentElement.getAttribute("data-nimbi-logo-moved")||"";if(o){const l=oi||(typeof DOMParser<"u"?new DOMParser:null);if(l){const c=l.parseFromString(u,"text/html");c.querySelectorAll("img").forEach(m=>{try{const h=m.getAttribute("src")||"";(h?new URL(h,location.href).toString():"")===o&&m.remove()}catch{}}),u=c.body.innerHTML}else try{const c=o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");u=u.replace(new RegExp(`<img[^>]*src=\\"${c}\\"[^>]*>`,"g"),"")}catch{}}}catch{}return{html:u,meta:n.meta||{},toc:r}}catch{return{html:n.html,meta:n.meta||{},toc:n.toc||[]}}}function Ht(e,t){const n=new Set,i=/```\s*([a-zA-Z0-9_\-+]+)?/g,r=new Set(["then","now","if","once","so","and","or","but","when","the","a","an","as","let","const","var","export","import","from","true","false","null","npm","run","echo","sudo","this","that","have","using","some","return","returns","function","console","log","error","warn","class","new","undefined","with","select","from","where","join","on","group","order","by","having","as","into","values","like","limit","offset","create","table","index","view","insert","update","delete","returning","and","or","not","all","any","exists","case","when","then","else","end","distance","geometry","you","which","would","why","cool","other","same","everything","check"]),a=new Set(["bash","sh","zsh","javascript","js","python","py","php","java","c","cpp","rust","go","ruby","perl","r","scala","swift","kotlin","cs","csharp","html","css","json","xml","yaml","yml","dockerfile","docker"]);let s;for(;s=i.exec(e);)if(s[1]){const u=s[1].toLowerCase();if(xn.has(u)||t&&t.size&&u.length<3&&!t.has(u)&&!(Oe&&Oe[u]&&t.has(Oe[u])))continue;if(t&&t.size){if(t.has(u)){const l=t.get(u);l&&n.add(l);continue}if(Oe&&Oe[u]){const l=Oe[u];if(t.has(l)){const c=t.get(l)||l;n.add(c);continue}}}(a.has(u)||u.length>=5&&u.length<=30&&/^[a-z][a-z0-9_\-+]*$/.test(u)&&!r.has(u))&&n.add(u)}return n}async function jn(e,t){if(Ge&&Ge.length||typeof process<"u"&&process.env&&process.env.VITEST)return Ht(e||"",t);if(dt&&dt())try{const i=t&&t.size?Array.from(t.keys()):[],r=await Dn({type:"detect",md:String(e||""),supported:i});if(Array.isArray(r))return new Set(r)}catch(i){console.warn("[markdown] detectFenceLanguagesAsync worker failed",i)}return Ht(e||"",t)}const li=Object.freeze(Object.defineProperty({__proto__:null,_sendToRenderer:Dn,addMarkdownExtension:Hn,detectFenceLanguages:Ht,detectFenceLanguagesAsync:jn,initRendererWorker:dt,markdownPlugins:Ge,parseMarkdownToHtml:dn,setMarkdownExtensions:xs},Symbol.toStringTag,{value:"Module"})),Ss=`import { _rewriteAnchors } from '../htmlBuilder.js'

/**
 * Worker entrypoint for rewriting anchor hrefs inside rendered HTML.
 *
 * Accepted messages:
 * - \`{ type: 'rewriteAnchors', id: string, html: string, contentBase?: string, pagePath?: string }\`
 *   -> posts \`{ id, result: string }\` where \`result\` is the rewritten HTML string.
 *
 * On error the worker posts \`{ id, error: string }\`.
 */

/**
 * Worker \`onmessage\` handler for anchor rewrite messages.
 * @param {MessageEvent} ev - Message event whose \`data\` should contain the worker request
 * (e.g. \`{ type: 'rewriteAnchors', id, html, contentBase?, pagePath? }\`).
 * @returns {Promise<void>} Posts a \`{id, result}\` or \`{id, error}\` message.
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

/**
 * Helper to process an anchor-worker style message outside of a Worker.
 * @param {Object} msg - Message object (expects \`type === 'rewriteAnchors'\` and fields \`id\`, \`html\`, \`contentBase\`, \`pagePath\`).
 * @returns {Promise<Object>} Response shaped like the worker postMessage (contains \`id\` and \`result\` or \`error\`).
 */
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
`;onmessage=async e=>{const t=e.data||{};try{if(t.type==="rewriteAnchors"){const{id:n,html:i,contentBase:r,pagePath:a}=t;try{const u=new DOMParser().parseFromString(i||"","text/html"),o=u.body;await Wn(o,r,a),postMessage({id:n,result:u.body.innerHTML})}catch(s){postMessage({id:n,error:String(s)})}return}}catch(n){postMessage({id:t.id,error:String(n)})}};async function vs(e){try{if(e&&e.type==="rewriteAnchors"){const{id:t,html:n,contentBase:i,pagePath:r}=e;try{const s=new DOMParser().parseFromString(n||"","text/html"),u=s.body;return await Wn(u,i,r),{id:t,result:s.body.innerHTML}}catch(a){return{id:t,error:String(a)}}}return{id:e&&e.id,error:"unsupported message"}}catch(t){return{id:e&&e.id,error:String(t)}}}const As=typeof globalThis<"u"&&typeof globalThis.__nimbiCMSDebug<"u"?!!globalThis.__nimbiCMSDebug:!1;function Es(...e){try{As&&console&&typeof console.warn=="function"&&console.warn(...e)}catch{}}function Ls(e,t){try{return new URL(e,t).pathname}catch{try{return new URL(e,typeof location<"u"?location.href:"http://localhost/").pathname}catch{try{return(String(t||"").replace(/\/$/,"")+"/"+String(e||"").replace(/^\//,"")).replace(/\/\\+/g,"/")}catch{return String(e||"")}}}}function Ts(e,t){const n=document.createElement("aside");n.className="menu box nimbi-nav";const i=document.createElement("p");i.className="menu-label",i.textContent=e("navigation"),n.appendChild(i);const r=document.createElement("ul");return r.className="menu-list",t.forEach(a=>{const s=document.createElement("li"),u=document.createElement("a");if(u.href="#"+a.path,u.textContent=a.name,s.appendChild(u),a.children&&a.children.length){const o=document.createElement("ul");a.children.forEach(l=>{const c=document.createElement("li"),f=document.createElement("a");f.href="#"+l.path,f.textContent=l.name,c.appendChild(f),o.appendChild(c)}),s.appendChild(o)}r.appendChild(s)}),n.appendChild(r),n}function Cs(e,t,n=""){const i=document.createElement("aside");i.className="menu box nimbi-toc-inner is-hidden-mobile";const r=document.createElement("p");r.className="menu-label",r.textContent=e("onThisPage"),i.appendChild(r);const a=document.createElement("ul");a.className="menu-list";try{const u={};(t||[]).forEach(o=>{try{if(!o||o.level===1)return;const l=Number(o.level)>=2?Number(o.level):2,c=document.createElement("li"),f=document.createElement("a"),m=Ji(o.text||""),h=o.id||fe(m);f.textContent=m;try{const w=String(n||"").replace(/^[\\.\\/]+/,""),y=w&&F&&F.has&&F.has(w)?F.get(w):w;y?f.href=ve(y,h):f.href=`#${encodeURIComponent(h)}`}catch(w){console.warn("[htmlBuilder] buildTocElement href normalization failed",w),f.href=`#${encodeURIComponent(h)}`}if(c.appendChild(f),l===2){a.appendChild(c),u[2]=c,Object.keys(u).forEach(w=>{Number(w)>2&&delete u[w]});return}let d=l-1;for(;d>2&&!u[d];)d--;d<2&&(d=2);let p=u[d];if(!p){a.appendChild(c),u[l]=c;return}let g=p.querySelector("ul");g||(g=document.createElement("ul"),p.appendChild(g)),g.appendChild(c),u[l]=c}catch(l){console.warn("[htmlBuilder] buildTocElement item failed",l,o)}})}catch(u){console.warn("[htmlBuilder] buildTocElement failed",u)}return i.appendChild(a),a.querySelectorAll("li").length<=1?null:i}function ci(e){e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(n=>{n.id||(n.id=fe(n.textContent||""))})}function Ms(e,t,n){try{const i=e.querySelectorAll("img");if(i&&i.length){const r=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";i.forEach(a=>{const s=a.getAttribute("src")||"";if(s&&!(/^(https?:)?\/\//.test(s)||s.startsWith("/")))try{const u=new URL(r+s,n).toString();a.src=u;try{a.getAttribute("loading")||a.setAttribute("data-want-lazy","1")}catch(o){console.warn("[htmlBuilder] set image loading attribute failed",o)}}catch(u){console.warn("[htmlBuilder] resolve image src failed",u)}})}}catch(i){console.warn("[htmlBuilder] lazyLoadImages failed",i)}}function ui(e,t,n){try{const i=t&&t.includes("/")?t.substring(0,t.lastIndexOf("/")+1):"";let r=null;try{const s=new URL(n,location.href);r=new URL(i||".",s).toString()}catch{try{r=new URL(i||".",location.href).toString()}catch{r=i||"./"}}const a=e.querySelectorAll("*");for(const s of Array.from(a||[]))try{const u=s.tagName?s.tagName.toLowerCase():"",o=l=>{try{const c=s.getAttribute(l)||"";if(!c||/^(https?:)?\/\//i.test(c)||c.startsWith("/")||c.startsWith("#"))return;try{s.setAttribute(l,new URL(c,r).toString())}catch(f){console.warn("[htmlBuilder] rewrite asset attribute failed",l,c,f)}}catch(c){console.warn("[htmlBuilder] rewriteAttr failed",c)}};if(s.hasAttribute&&s.hasAttribute("src")&&o("src"),s.hasAttribute&&s.hasAttribute("href")&&u!=="a"&&o("href"),s.hasAttribute&&s.hasAttribute("xlink:href")&&o("xlink:href"),s.hasAttribute&&s.hasAttribute("poster")&&o("poster"),s.hasAttribute("srcset")){const f=(s.getAttribute("srcset")||"").split(",").map(m=>m.trim()).filter(Boolean).map(m=>{const[h,d]=m.split(/\s+/,2);if(!h||/^(https?:)?\/\//i.test(h)||h.startsWith("/"))return m;try{const p=new URL(h,r).toString();return d?`${p} ${d}`:p}catch{return m}}).join(", ");s.setAttribute("srcset",f)}}catch(u){console.warn("[htmlBuilder] rewriteRelativeAssets node processing failed",u)}}catch(i){console.warn("[htmlBuilder] rewriteRelativeAssets failed",i)}}let hi="",Un=null,di="";async function Wn(e,t,n){try{const i=e.querySelectorAll("a");if(!i||!i.length)return;let r,a;if(t===hi&&Un)r=Un,a=di;else{try{r=new URL(t,location.href),a=ct(r.pathname)}catch{try{r=new URL(t,location.href),a=ct(r.pathname)}catch{r=null,a="/"}}hi=t,Un=r,di=a}const s=new Set,u=[],o=new Set,l=[];for(const c of Array.from(i))try{try{if(c.closest&&c.closest("h1,h2,h3,h4,h5,h6"))continue}catch{}const f=c.getAttribute("href")||"";if(!f||kr(f))continue;try{if(f.startsWith("?")||f.indexOf("?")!==-1)try{const h=new URL(f,t||location.href),d=h.searchParams.get("page");if(d&&d.indexOf("/")===-1&&n){const p=n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"";if(p){const g=ke(p+d);c.setAttribute("href",ve(g,h.hash?h.hash.replace(/^#/,""):null));continue}}}catch{}}catch{}if(f.startsWith("/")&&!f.endsWith(".md"))continue;const m=f.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(m){let h=m[1];const d=m[2];!h.startsWith("/")&&n&&(h=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+h);try{const p=new URL(h,t).pathname;let g=p.startsWith(a)?p.slice(a.length):p;g=ke(g),u.push({node:c,mdPathRaw:h,frag:d,rel:g}),F.has(g)||s.add(g)}catch(p){console.warn("[htmlBuilder] resolve mdPath failed",p)}continue}try{let h=f;!f.startsWith("/")&&n&&(f.startsWith("#")?h=n+f:h=(n.includes("/")?n.substring(0,n.lastIndexOf("/")+1):"")+f);const p=new URL(h,t).pathname||"";if(p&&p.indexOf(a)!==-1){let g=p.startsWith(a)?p.slice(a.length):p;if(g=ke(g),g=Lt(g),g||(g="_home"),!g.endsWith(".md")){let w=null;try{if(F&&F.has&&F.has(g))w=F.get(g);else try{const y=String(g||"").replace(/^.*\//,"");y&&F.has&&F.has(y)&&(w=F.get(y))}catch(y){console.warn("[htmlBuilder] mdToSlug baseName check failed",y)}}catch(y){console.warn("[htmlBuilder] mdToSlug access check failed",y)}if(!w)try{const y=String(g||"").replace(/^.*\//,"");for(const[k,v]of ne||[])if(v===g||v===y){w=k;break}}catch{}w?c.setAttribute("href",ve(w)):(o.add(g),l.push({node:c,rel:g}))}}}catch(h){console.warn("[htmlBuilder] resolving href to URL failed",h)}}catch(f){console.warn("[htmlBuilder] processing anchor failed",f)}s.size&&await Promise.all(Array.from(s).map(async c=>{try{try{const m=String(c).match(/([^\/]+)\.md$/),h=m&&m[1];if(h&&ne.has(h)){try{const d=ne.get(h);if(d)try{F.set(d,h)}catch(p){console.warn("[htmlBuilder] mdToSlug.set failed",p)}}catch(d){console.warn("[htmlBuilder] reading slugToMd failed",d)}return}}catch(m){console.warn("[htmlBuilder] basename slug lookup failed",m)}const f=await Me(c,t);if(f&&f.raw){const m=(f.raw||"").match(/^#\s+(.+)$/m);if(m&&m[1]){const h=fe(m[1].trim());if(h)try{ne.set(h,c),F.set(c,h)}catch(d){console.warn("[htmlBuilder] setting slug mapping failed",d)}}}}catch(f){console.warn("[htmlBuilder] fetchMarkdown during rewriteAnchors failed",f)}})),o.size&&await Promise.all(Array.from(o).map(async c=>{try{const f=await Me(c,t);if(f&&f.raw)try{const h=(Fn||new DOMParser).parseFromString(f.raw,"text/html"),d=h.querySelector("title"),p=h.querySelector("h1"),g=d&&d.textContent&&d.textContent.trim()?d.textContent.trim():p&&p.textContent?p.textContent.trim():null;if(g){const w=fe(g);if(w)try{ne.set(w,c),F.set(c,w)}catch(y){console.warn("[htmlBuilder] setting html slug mapping failed",y)}}}catch(m){console.warn("[htmlBuilder] parse fetched HTML failed",m)}}catch(f){console.warn("[htmlBuilder] fetchMarkdown for htmlPending failed",f)}}));for(const c of u){const{node:f,frag:m,rel:h}=c;let d=null;try{F.has(h)&&(d=F.get(h))}catch(p){console.warn("[htmlBuilder] mdToSlug access failed",p)}d?f.setAttribute("href",ve(d,m)):f.setAttribute("href",ve(h,m))}for(const c of l){const{node:f,rel:m}=c;let h=null;try{F.has(m)&&(h=F.get(m))}catch(d){console.warn("[htmlBuilder] mdToSlug access failed for htmlAnchorInfo",d)}if(!h)try{const d=String(m||"").replace(/^.*\//,"");F.has(d)&&(h=F.get(d))}catch(d){console.warn("[htmlBuilder] mdToSlug baseName access failed for htmlAnchorInfo",d)}h?f.setAttribute("href",ve(h)):f.setAttribute("href",ve(m))}}catch(i){console.warn("[htmlBuilder] rewriteAnchors failed",i)}}function Rs(e,t,n,i){const r=t.querySelector("h1"),a=r?(r.textContent||"").trim():"";let s="";try{let u="";try{e&&e.meta&&e.meta.title&&(u=String(e.meta.title).trim())}catch{}if(!u&&a&&(u=a),!u)try{const o=t.querySelector("h2");o&&o.textContent&&(u=String(o.textContent).trim())}catch{}!u&&n&&(u=String(n)),u&&(s=fe(u)),s||(s="_home");try{n&&(ne.set(s,n),F.set(n,s))}catch(o){console.warn("[htmlBuilder] computeSlug set slug mapping failed",o)}try{const o=i||(location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):"");try{history.replaceState({page:s},"",ve(s,o))}catch(l){console.warn("[htmlBuilder] computeSlug history replace failed",l)}}catch(o){console.warn("[htmlBuilder] computeSlug inner failed",o)}}catch(u){console.warn("[htmlBuilder] computeSlug failed",u)}try{if(e&&e.meta&&e.meta.title&&r){const u=String(e.meta.title).trim();if(u&&u!==a){try{s&&(r.id=s)}catch{}try{if(Array.isArray(e.toc))for(const o of e.toc)try{if(o&&Number(o.level)===1&&String(o.text).trim()===(a||"").trim()){o.id=s;break}}catch{}}catch{}}}}catch{}return{topH1:r,h1Text:a,slugKey:s}}async function $s(e,t){if(!e||!e.length)return;const n=new Set;for(const o of Array.from(e||[]))try{const l=o.getAttribute("href")||"";if(!l)continue;let m=ke(l).split(/::|#/,2)[0];try{const d=m.indexOf("?");d!==-1&&(m=m.slice(0,d))}catch{}if(!m||(m.includes(".")||(m=m+".html"),!/\.html(?:$|[?#])/.test(m)&&!m.toLowerCase().endsWith(".html")))continue;const h=m;try{if(F&&F.has&&F.has(h))continue}catch(d){console.warn("[htmlBuilder] mdToSlug check failed",d)}try{let d=!1;for(const p of ne.values())if(p===h){d=!0;break}if(d)continue}catch(d){console.warn("[htmlBuilder] slugToMd iteration failed",d)}n.add(h)}catch(l){console.warn("[htmlBuilder] preScanHtmlSlugs anchor iteration failed",l)}if(!n.size)return;const i=async o=>{try{const l=await Me(o,t);if(l&&l.raw)try{const f=(Fn||new DOMParser).parseFromString(l.raw,"text/html"),m=f.querySelector("title"),h=f.querySelector("h1"),d=m&&m.textContent&&m.textContent.trim()?m.textContent.trim():h&&h.textContent?h.textContent.trim():null;if(d){const p=fe(d);if(p)try{ne.set(p,o),F.set(o,p)}catch(g){console.warn("[htmlBuilder] set slugToMd/mdToSlug failed",g)}}}catch(c){console.warn("[htmlBuilder] parse HTML title failed",c)}}catch(l){console.warn("[htmlBuilder] fetchAndExtract failed",l)}},r=5,a=Array.from(n);let s=0;const u=[];for(;s<a.length;){const o=a.slice(s,s+r);u.push(Promise.all(o.map(i))),s+=r}await Promise.all(u)}async function zs(e,t){if(!e||!e.length)return;const n=[],i=new Set;let r="";try{const a=new URL(t,typeof location<"u"?location.href:"http://localhost/");r=ct(a.pathname)}catch(a){r="",console.warn("[htmlBuilder] preMapMdSlugs parse base failed",a)}for(const a of Array.from(e||[]))try{const s=a.getAttribute("href")||"";if(!s)continue;const u=s.match(/^([^#?]+\.md)(?:[#](.+))?$/);if(u){let o=ke(u[1]);try{let l;try{l=Ls(o,t)}catch(f){l=o,console.warn("[htmlBuilder] resolve mdPath URL failed",f)}const c=l&&r&&l.startsWith(r)?l.slice(r.length):String(l||"").replace(/^\//,"");n.push({rel:c}),F.has(c)||i.add(c)}catch(l){console.warn("[htmlBuilder] rewriteAnchors failed",l)}continue}}catch(s){console.warn("[htmlBuilder] preMapMdSlugs anchor iteration failed",s)}i.size&&await Promise.all(Array.from(i).map(async a=>{try{const s=String(a).match(/([^\/]+)\.md$/),u=s&&s[1];if(u&&ne.has(u)){try{const o=ne.get(u);o&&F.set(o,u)}catch(o){console.warn("[htmlBuilder] preMapMdSlugs slug map access failed",o)}return}}catch(s){console.warn("[htmlBuilder] preMapMdSlugs basename check failed",s)}try{const s=await Me(a,t);if(s&&s.raw){const u=(s.raw||"").match(/^#\s+(.+)$/m);if(u&&u[1]){const o=fe(u[1].trim());if(o)try{ne.set(o,a),F.set(a,o)}catch(l){console.warn("[htmlBuilder] preMapMdSlugs setting slug mapping failed",l)}}}}catch(s){console.warn("[htmlBuilder] preMapMdSlugs fetch failed",s)}}))}const Fn=typeof DOMParser<"u"?new DOMParser:null;function Zn(e){try{const n=(Fn||new DOMParser).parseFromString(e||"","text/html");ci(n);try{n.querySelectorAll("img").forEach(o=>{try{o.getAttribute("loading")||o.setAttribute("data-want-lazy","1")}catch(l){console.warn("[htmlBuilder] parseHtml set image loading attribute failed",l)}})}catch(u){console.warn("[htmlBuilder] parseHtml query images failed",u)}n.querySelectorAll("pre code, code[class]").forEach(u=>{try{const o=u.getAttribute&&u.getAttribute("class")||u.className||"",l=o.match(/language-([a-zA-Z0-9_+-]+)/)||o.match(/lang(?:uage)?-?([a-zA-Z0-9_+-]+)/);if(l&&l[1]){const c=(l[1]||"").toLowerCase(),f=ie.size&&(ie.get(c)||ie.get(String(c).toLowerCase()))||c;try{(async()=>{try{await mt(f)}catch(m){console.warn("[htmlBuilder] registerLanguage failed",m)}})()}catch(m){console.warn("[htmlBuilder] schedule registerLanguage failed",m)}}else try{if(de&&typeof de.getLanguage=="function"&&de.getLanguage("plaintext")){const c=de.highlight?de.highlight(u.textContent||"",{language:"plaintext"}):null;c&&c.value&&(u.innerHTML=c.value)}}catch(c){console.warn("[htmlBuilder] plaintext highlight fallback failed",c)}}catch(o){console.warn("[htmlBuilder] code element processing failed",o)}});const r=[];n.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(u=>{r.push({level:Number(u.tagName.substring(1)),text:(u.textContent||"").trim(),id:u.id})});const s={};try{const u=n.querySelector("title");u&&u.textContent&&String(u.textContent).trim()&&(s.title=String(u.textContent).trim())}catch{}return{html:n.body.innerHTML,meta:s,toc:r}}catch(t){return console.warn("[htmlBuilder] parseHtml failed",t),{html:e||"",meta:{},toc:[]}}}async function Ps(e){const t=jn?await jn(e||"",ie):Ht(e||"",ie),n=new Set(t),i=[];for(const r of n)try{const a=ie.size&&(ie.get(r)||ie.get(String(r).toLowerCase()))||r;try{i.push(mt(a))}catch(s){console.warn("[htmlBuilder] ensureLanguages push canonical failed",s)}if(String(r)!==String(a))try{i.push(mt(r))}catch(s){console.warn("[htmlBuilder] ensureLanguages push alias failed",s)}}catch(a){console.warn("[htmlBuilder] ensureLanguages inner failed",a)}try{await Promise.all(i)}catch(r){console.warn("[htmlBuilder] ensureLanguages failed",r)}}async function Is(e){if(await Ps(e),dn){const t=await dn(e||"");return!t||typeof t!="object"?{html:String(e||""),meta:{},toc:[]}:(Array.isArray(t.toc)||(t.toc=[]),t.meta||(t.meta={}),t)}return{html:String(e||""),meta:{},toc:[]}}async function Ns(e,t,n,i,r){let a=null;if(t.isHtml)try{const f=typeof DOMParser<"u"?new DOMParser:null;if(f){const m=f.parseFromString(t.raw||"","text/html");try{ui(m.body,n,r)}catch(h){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle (inner)",h)}a=Zn(m.documentElement&&m.documentElement.outerHTML?m.documentElement.outerHTML:t.raw||"")}else a=Zn(t.raw||"")}catch{a=Zn(t.raw||"")}else a=await Is(t.raw||"");const s=document.createElement("article");s.className="nimbi-article content",s.innerHTML=a.html;try{ui(s,n,r)}catch(f){console.warn("[htmlBuilder] rewriteRelativeAssets failed in prepareArticle",f)}try{ci(s)}catch(f){console.warn("[htmlBuilder] addHeadingIds failed",f)}try{s.querySelectorAll("pre code, code[class]").forEach(m=>{try{const h=m.getAttribute&&m.getAttribute("class")||m.className||"",d=String(h||"").replace(/\blanguage-undefined\b|\blang-undefined\b/g,"").trim();if(d)try{m.setAttribute&&m.setAttribute("class",d)}catch(p){m.className=d,console.warn("[htmlBuilder] set element class failed",p)}else try{m.removeAttribute&&m.removeAttribute("class")}catch(p){m.className="",console.warn("[htmlBuilder] remove element class failed",p)}}catch(h){console.warn("[htmlBuilder] code element cleanup failed",h)}})}catch(f){console.warn("[htmlBuilder] processing code elements failed",f)}try{ur(s)}catch(f){console.warn("[htmlBuilder] observeCodeBlocks failed",f)}Ms(s,n,r);try{(s.querySelectorAll&&s.querySelectorAll("img")||[]).forEach(m=>{try{const h=m.parentElement;if(!h||h.tagName.toLowerCase()!=="p"||h.childNodes.length!==1)return;const d=document.createElement("figure");d.className="image",h.replaceWith(d),d.appendChild(m)}catch{}})}catch(f){console.warn("[htmlBuilder] wrap images in Bulma image helper failed",f)}try{(s.querySelectorAll&&s.querySelectorAll("table")||[]).forEach(m=>{try{if(m.classList)m.classList.contains("table")||m.classList.add("table");else{const h=m.getAttribute&&m.getAttribute("class")?m.getAttribute("class"):"",d=String(h||"").split(/\s+/).filter(Boolean);d.indexOf("table")===-1&&d.push("table");try{m.setAttribute&&m.setAttribute("class",d.join(" "))}catch{m.className=d.join(" ")}}}catch{}})}catch(f){console.warn("[htmlBuilder] add Bulma table class failed",f)}const{topH1:u,h1Text:o,slugKey:l}=Rs(a,s,n,i);try{if(u&&a&&a.meta&&(a.meta.author||a.meta.date)&&!(u.parentElement&&u.parentElement.querySelector&&u.parentElement.querySelector(".nimbi-article-subtitle"))){const m=a.meta.author?String(a.meta.author).trim():"",h=a.meta.date?String(a.meta.date).trim():"";let d="";try{const g=new Date(h);h&&!isNaN(g.getTime())?d=g.toLocaleDateString():d=h}catch{d=h}const p=[];if(m&&p.push(m),d&&p.push(d),p.length){const g=document.createElement("p"),w=p[0]?String(p[0]).replace(/"/g,"").trim():"",y=p.slice(1);if(g.className="nimbi-article-subtitle is-6 has-text-grey-light",w){const k=document.createElement("span");k.className="nimbi-article-author",k.textContent=w,g.appendChild(k)}if(y.length){const k=document.createElement("span");k.className="nimbi-article-meta",k.textContent=y.join(" • "),g.appendChild(k)}try{u.parentElement.insertBefore(g,u.nextSibling)}catch{try{u.insertAdjacentElement("afterend",g)}catch{}}}}}catch{}try{await Ds(s,r,n)}catch(f){Es("[htmlBuilder] rewriteAnchorsWorker failed, falling back to main thread",f),await Wn(s,r,n)}const c=Cs(e,a.toc,n);return{article:s,parsed:a,toc:c,topH1:u,h1Text:o,slugKey:l}}function Bs(e){if(!(!e||!e.querySelectorAll))try{const t=Array.from(e.querySelectorAll("script"));for(const n of t)try{const i=document.createElement("script");for(const a of Array.from(n.attributes||[]))try{i.setAttribute(a.name,a.value)}catch{}if(!n.src){const a=n.textContent||"";let s=!1;try{new Function(a)(),s=!0}catch{s=!1}if(s){n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed inline script via Function")}catch{}continue}try{i.type="module"}catch{}i.textContent=a}if(n.src)try{if(document.querySelector&&document.querySelector(`script[src="${n.src}"]`)){n.parentNode&&n.parentNode.removeChild(n);continue}}catch{}const r=n.src||"<inline>";i.addEventListener("error",a=>{try{console.warn("[htmlBuilder] injected script error",{src:r,ev:a})}catch{}}),i.addEventListener("load",()=>{try{console.info("[htmlBuilder] injected script loaded",{src:r,hasNimbi:!!(window&&window.nimbiCMS)})}catch{}});try{(document.head||document.body||document.documentElement).appendChild(i)}catch{try{try{i.type="text/javascript"}catch{}(document.head||document.body||document.documentElement).appendChild(i)}catch(s){try{console.warn("[htmlBuilder] injected script append failed, skipping",{src:r,err:s})}catch{}}}n.parentNode&&n.parentNode.removeChild(n);try{console.info("[htmlBuilder] executed injected script",r)}catch{}}catch(i){console.warn("[htmlBuilder] execute injected script failed",i)}}catch{}}function pi(e,t,n){e&&(e.innerHTML="");const i=document.createElement("article");i.className="nimbi-article content nimbi-not-found";const r=document.createElement("h1");r.textContent=t&&t("notFound")||"Page not found";const a=document.createElement("p");a.textContent=n&&n.message?String(n.message):"Failed to resolve the requested page.",i.appendChild(r),i.appendChild(a),e&&e.appendChild&&e.appendChild(i)}const gi=Ki(()=>{const e=Et(Ss);if(e)try{if(!(typeof process<"u"&&process.env&&process.env.VITEST))return e}catch{return e}const t={message:[],error:[]};return{addEventListener(n,i){t[n]||(t[n]=[]),t[n].push(i)},removeEventListener(n,i){if(!t[n])return;const r=t[n].indexOf(i);r!==-1&&t[n].splice(r,1)},postMessage(n){setTimeout(async()=>{try{const r={data:await vs(n)};(t.message||[]).forEach(a=>a(r))}catch(i){const r={data:{id:n&&n.id,error:String(i)}};(t.message||[]).forEach(a=>a(r))}},0)},terminate(){Object.keys(t).forEach(n=>t[n].length=0)}}},"anchor");function Os(){return gi.get()}function qs(e){return gi.send(e,2e3)}async function Ds(e,t,n){if(!Os())throw new Error("anchor worker unavailable");if(!e||typeof e.innerHTML!="string")throw new Error("invalid article element");const r=String(e.innerHTML),a=await qs({type:"rewriteAnchors",html:r,contentBase:t,pagePath:n});if(a&&typeof a=="string")try{e.innerHTML=a}catch(s){console.warn("[htmlBuilder] applying rewritten anchors failed",s)}}function Hs(e){try{e.addEventListener("click",t=>{const n=t.target&&t.target.closest?t.target.closest("a"):null;if(!n)return;const i=n.getAttribute("href")||"";try{const r=new URL(i,location.href),a=r.searchParams.get("page"),s=r.hash?r.hash.replace(/^#/,""):null;if(!a&&!s)return;t.preventDefault();let u=null;try{history&&history.state&&history.state.page&&(u=history.state.page)}catch(o){u=null,console.warn("[htmlBuilder] access history.state failed",o)}try{u||(u=new URL(location.href).searchParams.get("page"))}catch(o){console.warn("[htmlBuilder] parse current location failed",o)}if(!a&&s||a&&u&&String(a)===String(u)){try{if(!a&&s)try{history.replaceState(history.state,"",(location.pathname||"")+(location.search||"")+(s?"#"+encodeURIComponent(s):""))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}else try{history.replaceState({page:u||a},"",ve(u||a,s))}catch(o){console.warn("[htmlBuilder] history.replaceState failed",o)}}catch(o){console.warn("[htmlBuilder] update history for anchor failed",o)}try{t.stopImmediatePropagation&&t.stopImmediatePropagation(),t.stopPropagation&&t.stopPropagation()}catch(o){console.warn("[htmlBuilder] stopPropagation failed",o)}try{Gn(s)}catch(o){console.warn("[htmlBuilder] scrollToAnchorOrTop failed",o)}return}history.pushState({page:a},"",ve(a,s));try{if(typeof window<"u"&&typeof window.renderByQuery=="function")try{window.renderByQuery()}catch(o){console.warn("[htmlBuilder] window.renderByQuery failed",o)}else if(typeof window<"u")try{window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.warn("[htmlBuilder] dispatch popstate failed",o)}else try{renderByQuery()}catch(o){console.warn("[htmlBuilder] renderByQuery failed",o)}}catch(o){console.warn("[htmlBuilder] SPA navigation invocation failed",o)}}catch(r){console.warn("[htmlBuilder] non-URL href in attachTocClickHandler",r)}})}catch(t){console.warn("[htmlBuilder] attachTocClickHandler failed",t)}}function Gn(e){const t=document.querySelector(".nimbi-cms")||null;if(e){const n=document.getElementById(e);if(n)try{const i=()=>{try{if(t&&t.scrollTo&&t.contains(n)){const r=n.getBoundingClientRect().top-t.getBoundingClientRect().top+t.scrollTop;t.scrollTo({top:r,behavior:"smooth"})}else try{n.scrollIntoView({behavior:"smooth",block:"start"})}catch{try{n.scrollIntoView()}catch(a){console.warn("[htmlBuilder] scrollIntoView failed",a)}}}catch{try{n.scrollIntoView()}catch(a){console.warn("[htmlBuilder] final scroll fallback failed",a)}}};try{requestAnimationFrame(()=>setTimeout(i,50))}catch(r){console.warn("[htmlBuilder] scheduling scroll failed",r),setTimeout(i,50)}}catch(i){try{n.scrollIntoView()}catch(r){console.warn("[htmlBuilder] final scroll fallback failed",r)}console.warn("[htmlBuilder] doScroll failed",i)}}else try{t&&t.scrollTo?t.scrollTo({top:0,behavior:"smooth"}):window.scrollTo(0,0)}catch(n){try{window.scrollTo(0,0)}catch(i){console.warn("[htmlBuilder] window.scrollTo failed",i)}console.warn("[htmlBuilder] scroll to top failed",n)}}function js(e,t,{mountOverlay:n=null,container:i=null,mountEl:r=null,navWrap:a=null,t:s=null}={}){try{const u=s||(p=>typeof p=="string"?p:""),o=i||document.querySelector(".nimbi-cms"),l=r||document.querySelector(".nimbi-mount"),c=n||document.querySelector(".nimbi-overlay"),f=a||document.querySelector(".nimbi-nav-wrap");let h=document.querySelector(".nimbi-scroll-top");if(!h){h=document.createElement("button"),h.className="nimbi-scroll-top button is-primary is-rounded is-small",h.setAttribute("aria-label",u("scrollToTop")),h.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6"/><path d="M5 12l7-7 7 7"/></svg>';try{c&&c.appendChild?c.appendChild(h):o&&o.appendChild?o.appendChild(h):l&&l.appendChild?l.appendChild(h):document.body.appendChild(h)}catch{try{document.body.appendChild(h)}catch(g){console.warn("[htmlBuilder] append scroll top button failed",g)}}try{try{gr(h)}catch{}}catch(p){console.warn("[htmlBuilder] set scroll-top button theme registration failed",p)}h.addEventListener("click",()=>{try{i&&i.scrollTo?i.scrollTo({top:0,left:0,behavior:"smooth"}):r&&r.scrollTo?r.scrollTo({top:0,left:0,behavior:"smooth"}):window.scrollTo({top:0,left:0,behavior:"smooth"})}catch{try{i&&(i.scrollTop=0)}catch(g){console.warn("[htmlBuilder] fallback container scrollTop failed",g)}try{r&&(r.scrollTop=0)}catch(g){console.warn("[htmlBuilder] fallback mountEl scrollTop failed",g)}try{document.documentElement.scrollTop=0}catch(g){console.warn("[htmlBuilder] fallback document scrollTop failed",g)}}})}const d=f&&f.querySelector?f.querySelector(".menu-label"):null;if(t){if(!h._nimbiObserver){const p=new IntersectionObserver(g=>{for(const w of g)w.target instanceof Element&&(w.isIntersecting?(h.classList.remove("show"),d&&d.classList.remove("show")):(h.classList.add("show"),d&&d.classList.add("show")))},{root:i instanceof Element?i:r instanceof Element?r:null,threshold:0});h._nimbiObserver=p}try{h._nimbiObserver.disconnect()}catch(p){console.warn("[htmlBuilder] observer disconnect failed",p)}try{h._nimbiObserver.observe(t)}catch(p){console.warn("[htmlBuilder] observer observe failed",p)}try{const p=()=>{try{const g=o instanceof Element?o.getBoundingClientRect():{top:0,bottom:window.innerHeight},w=t.getBoundingClientRect();!(w.bottom<g.top||w.top>g.bottom)?(h.classList.remove("show"),d&&d.classList.remove("show")):(h.classList.add("show"),d&&d.classList.add("show"))}catch(g){console.warn("[htmlBuilder] checkIntersect failed",g)}};p(),"IntersectionObserver"in window||setTimeout(p,100)}catch(p){console.warn("[htmlBuilder] checkIntersect outer failed",p)}}else{h.classList.remove("show"),d&&d.classList.remove("show");const p=i instanceof Element?i:r instanceof Element?r:window,g=()=>{try{(p===window?window.scrollY:p.scrollTop||0)>10?(h.classList.add("show"),d&&d.classList.add("show")):(h.classList.remove("show"),d&&d.classList.remove("show"))}catch(w){console.warn("[htmlBuilder] onScroll handler failed",w)}};Yt(()=>p.addEventListener("scroll",g)),g()}}catch(u){console.warn("[htmlBuilder] ensureScrollTopButton failed",u)}}function fi(e,t){try{if(!e)return;try{const n=e[t];if(typeof n<"u")return n}catch{}try{if(e.default)return e.default[t]}catch{}return}catch{return}}async function Us(e,t,n,i,r,a,s,u,o="eager",l=1,c=void 0,f="favicon"){if(!e||!(e instanceof HTMLElement))throw new TypeError("navbarWrap must be an HTMLElement");const m=typeof DOMParser<"u"?new DOMParser:null,h=m?m.parseFromString(n||"","text/html"):null,d=h?h.querySelectorAll("a"):[];await Yt(()=>$s(d,i)),await Yt(()=>zs(d,i));try{if(t&&t instanceof HTMLElement&&(!t.hasAttribute||!t.hasAttribute("role")))try{t.setAttribute("role","main")}catch{}}catch{}let p=null,g=null,w=null,y=null,k=null,v=null;function $(){try{const x=document.querySelector(".navbar-burger"),A=x&&x.dataset?x.dataset.target:null,I=A?document.getElementById(A):null;x&&x.classList.contains("is-active")&&(x.classList.remove("is-active"),x.setAttribute("aria-expanded","false"),I&&I.classList.remove("is-active"))}catch(x){console.warn&&console.warn("[nimbi-cms] closeMobileMenu failed",x)}}async function N(){const x=typeof document<"u"?document.querySelector(".nimbi-content"):null;try{x&&x.classList.add("is-inactive")}catch{}try{const A=s&&s();A&&typeof A.then=="function"&&await A}catch(A){try{console.warn&&console.warn("[nimbi-cms] renderByQuery failed",A)}catch{}}finally{try{if(typeof requestAnimationFrame=="function")requestAnimationFrame(()=>{try{x&&x.classList.remove("is-inactive")}catch{}});else try{x&&x.classList.remove("is-inactive")}catch{}}catch{try{x&&x.classList.remove("is-inactive")}catch{}}}}const U=()=>p||(p=(async()=>{try{const x=await Promise.resolve().then(()=>_t),A=fi(x,"buildSearchIndex")||(typeof globalThis<"u"?globalThis.buildSearchIndex:void 0),I=fi(x,"buildSearchIndexWorker")||(typeof globalThis<"u"?globalThis.buildSearchIndexWorker:void 0);if(o==="lazy"&&typeof I=="function")try{const R=await I(i,l,c);if(R&&R.length)return R}catch(R){console.warn&&console.warn("[nimbi-cms] worker builder threw",R)}return typeof A=="function"?await A(i,l,c):[]}catch(x){return console.warn("[nimbi-cms] buildSearchIndex failed",x),[]}finally{if(g){try{g.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}}})(),p.then(x=>{try{const A=String(g&&g.value||"").trim().toLowerCase();if(!A||!Array.isArray(x)||!x.length)return;const I=x.filter(O=>O.title&&O.title.toLowerCase().includes(A)||O.excerpt&&O.excerpt.toLowerCase().includes(A));if(!I||!I.length)return;const R=document.getElementById("nimbi-search-results");if(!R)return;R.innerHTML="";try{const O=document.createElement("div");O.className="panel nimbi-search-panel",I.slice(0,10).forEach(C=>{try{if(C.parentTitle){const he=document.createElement("p");he.className="panel-heading nimbi-search-title nimbi-search-parent",he.textContent=C.parentTitle,O.appendChild(he)}const X=document.createElement("a");X.className="panel-block nimbi-search-result",X.href=ve(C.slug),X.setAttribute("role","button");try{if(C.path&&typeof C.slug=="string"){try{ne.set(C.slug,C.path)}catch{}try{F.set(C.path,C.slug)}catch{}}}catch{}const E=document.createElement("div");E.className="is-size-6 has-text-weight-semibold",E.textContent=C.title,X.appendChild(E),X.addEventListener("click",()=>{try{R.style.display="none"}catch{}}),O.appendChild(X)}catch{}}),R.appendChild(O);try{R.style.display="block"}catch{}}catch{}}catch{}}).catch(()=>{}),p),z=document.createElement("nav");z.className="navbar",z.setAttribute("role","navigation"),z.setAttribute("aria-label","main navigation");const K=document.createElement("div");K.className="navbar-brand";const le=d[0],L=document.createElement("a");if(L.className="navbar-item",le){const x=le.getAttribute("href")||"#";try{const I=new URL(x,location.href).searchParams.get("page");if(I){const R=decodeURIComponent(I);L.href=ve(R)}else L.href=ve(r),L.textContent=a("home")}catch{L.href=ve(r),L.textContent=a("home")}}else L.href=ve(r),L.textContent=a("home");async function j(x){try{if(!x||x==="none")return null;if(x==="favicon")try{const A=document.querySelector('link[rel~="icon"],link[rel="shortcut icon"]');if(!A)return null;const I=A.getAttribute("href")||"";return I&&/\.png(?:\?|$)/i.test(I)?new URL(I,location.href).toString():null}catch{return null}if(x==="copy-first"||x==="move-first")try{const A=await Me(r,i);if(!A||!A.raw)return null;const O=new DOMParser().parseFromString(A.raw,"text/html").querySelector("img");if(!O)return null;const C=O.getAttribute("src")||"";if(!C)return null;const X=new URL(C,location.href).toString();if(x==="move-first")try{document.documentElement.setAttribute("data-nimbi-logo-moved",X)}catch{}return X}catch{return null}try{return new URL(x,location.href).toString()}catch{return null}}catch{return null}}let _e=null;try{_e=await j(f)}catch{_e=null}if(_e)try{const x=document.createElement("img");x.className="nimbi-navbar-logo";const A=a&&typeof a=="function"&&(a("home")||a("siteLogo"))||"";x.alt=A,x.title=A,x.src=_e;try{x.style.marginRight="0.5em"}catch{}try{(!L.textContent||!String(L.textContent).trim())&&(L.textContent=A)}catch{}try{L.insertBefore(x,L.firstChild)}catch{try{L.appendChild(x)}catch{}}}catch{}K.appendChild(L),L.addEventListener("click",function(x){const A=L.getAttribute("href")||"";if(A.startsWith("?page=")){x.preventDefault();const I=new URL(A,location.href),R=I.searchParams.get("page"),O=I.hash?I.hash.replace(/^#/,""):null;history.pushState({page:R},"",ve(R,O)),N();try{$()}catch{}}});const V=document.createElement("a");V.className="navbar-burger",V.setAttribute("role","button"),V.setAttribute("aria-label","menu"),V.setAttribute("aria-expanded","false");const H="nimbi-navbar-menu";V.dataset.target=H,V.innerHTML='<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>',K.appendChild(V);try{V.addEventListener("click",x=>{try{const A=V.dataset&&V.dataset.target?V.dataset.target:null,I=A?document.getElementById(A):null;V.classList.contains("is-active")?(V.classList.remove("is-active"),V.setAttribute("aria-expanded","false"),I&&I.classList.remove("is-active")):(V.classList.add("is-active"),V.setAttribute("aria-expanded","true"),I&&I.classList.add("is-active"))}catch(A){console.warn("[nimbi-cms] navbar burger toggle failed",A)}})}catch(x){console.warn("[nimbi-cms] burger event binding failed",x)}const S=document.createElement("div");S.className="navbar-menu",S.id=H;const Z=document.createElement("div");Z.className="navbar-start";let G=null,pe=null;if(!u)G=null,g=null,y=null,k=null,v=null;else{G=document.createElement("div"),G.className="navbar-end",pe=document.createElement("div"),pe.className="navbar-item",g=document.createElement("input"),g.className="input",g.type="search",g.placeholder=a("searchPlaceholder")||"",g.id="nimbi-search";try{const O=(a&&typeof a=="function"?a("searchAria"):null)||g.placeholder||"Search";try{g.setAttribute("aria-label",O)}catch{}try{g.setAttribute("aria-controls","nimbi-search-results")}catch{}try{g.setAttribute("aria-autocomplete","list")}catch{}try{g.setAttribute("role","combobox")}catch{}}catch{}o==="eager"&&(g.disabled=!0),w=document.createElement("div"),w.className="control",o==="eager"&&w.classList.add("is-loading"),w.appendChild(g),pe.appendChild(w),y=document.createElement("div"),y.className="dropdown is-right",y.id="nimbi-search-dropdown";const x=document.createElement("div");x.className="dropdown-trigger",x.appendChild(pe);const A=document.createElement("div");A.className="dropdown-menu",A.setAttribute("role","menu"),k=document.createElement("div"),k.id="nimbi-search-results",k.className="dropdown-content nimbi-search-results",v=k,A.appendChild(k),y.appendChild(x),y.appendChild(A),G.appendChild(y);const I=O=>{if(!k)return;k.innerHTML="";let C=-1;function X(J){try{const se=k.querySelector(".nimbi-search-result.is-selected");se&&se.classList.remove("is-selected");const me=k.querySelectorAll(".nimbi-search-result");if(!me||!me.length)return;if(J<0){C=-1;return}J>=me.length&&(J=me.length-1);const oe=me[J];if(oe){oe.classList.add("is-selected"),C=J;try{oe.scrollIntoView({block:"nearest"})}catch{}}}catch{}}function E(J){try{const se=J.key,me=k.querySelectorAll(".nimbi-search-result");if(!me||!me.length)return;if(se==="ArrowDown"){J.preventDefault();const oe=C<0?0:Math.min(me.length-1,C+1);X(oe);return}if(se==="ArrowUp"){J.preventDefault();const oe=C<=0?0:C-1;X(oe);return}if(se==="Enter"){J.preventDefault();const oe=k.querySelector(".nimbi-search-result.is-selected")||k.querySelector(".nimbi-search-result");if(oe)try{oe.click()}catch{}return}if(se==="Escape"){try{y.classList.remove("is-active")}catch{}try{document.documentElement.classList.remove("nimbi-search-open")}catch{}try{k.style.display="none"}catch{}try{k.classList.remove("is-open")}catch{}try{k.removeAttribute("tabindex")}catch{}try{k.removeEventListener("keydown",E)}catch{}try{g&&g.focus()}catch{}try{g&&g.removeEventListener("keydown",he)}catch{}return}}catch{}}function he(J){try{if(J&&J.key==="ArrowDown"){J.preventDefault();try{k.focus()}catch{}X(0)}}catch{}}try{const J=document.createElement("div");J.className="panel nimbi-search-panel",O.forEach(se=>{if(se.parentTitle){const ge=document.createElement("p");ge.textContent=se.parentTitle,ge.className="panel-heading nimbi-search-title nimbi-search-parent",J.appendChild(ge)}const me=document.createElement("a");me.className="panel-block nimbi-search-result",me.href=ve(se.slug),me.setAttribute("role","button");try{if(se.path&&typeof se.slug=="string"){try{ne.set(se.slug,se.path)}catch{}try{F.set(se.path,se.slug)}catch{}}}catch{}const oe=document.createElement("div");oe.className="is-size-6 has-text-weight-semibold",oe.textContent=se.title,me.appendChild(oe),me.addEventListener("click",()=>{if(y){y.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{k.style.display="none"}catch{}try{k.classList.remove("is-open")}catch{}try{k.removeAttribute("tabindex")}catch{}try{k.removeEventListener("keydown",E)}catch{}try{g&&g.removeEventListener("keydown",he)}catch{}}),J.appendChild(me)}),k.appendChild(J)}catch{}if(y){y.classList.add("is-active");try{document.documentElement.classList.add("nimbi-search-open")}catch{}}try{k.style.display="block"}catch{}try{k.classList.add("is-open")}catch{}try{k.setAttribute("tabindex","0")}catch{}try{k.addEventListener("keydown",E)}catch{}try{g&&g.addEventListener("keydown",he)}catch{}},R=(O,C)=>{let X=null;return(...E)=>{X&&clearTimeout(X),X=setTimeout(()=>O(...E),C)}};if(g){const O=R(async()=>{const C=document.querySelector("input#nimbi-search"),X=String(C&&C.value||"").trim().toLowerCase();if(!X){I([]);return}try{await U();const he=(await p).filter(J=>J.title&&J.title.toLowerCase().includes(X)||J.excerpt&&J.excerpt.toLowerCase().includes(X));I(he.slice(0,10))}catch(E){console.warn("[nimbi-cms] search input handler failed",E),I([])}},50);try{g.addEventListener("input",O)}catch{}try{document.addEventListener("input",C=>{try{C&&C.target&&C.target.id==="nimbi-search"&&O(C)}catch{}},!0)}catch{}}if(o==="eager"){try{p=U()}catch(O){console.warn("[nimbi-cms] eager search index init failed",O),p=Promise.resolve([])}p.finally(()=>{const O=document.querySelector("input#nimbi-search");if(O){try{O.removeAttribute("disabled")}catch{}try{w&&w.classList.remove("is-loading")}catch{}}})}try{const O=C=>{try{const X=C&&C.target;if(!v||!v.classList.contains("is-open")&&v.style&&v.style.display!=="block"||X&&(v.contains(X)||g&&(X===g||g.contains&&g.contains(X))))return;if(y){y.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-search-open")}catch{}}try{v.style.display="none"}catch{}try{v.classList.remove("is-open")}catch{}}catch{}};document.addEventListener("click",O,!0),document.addEventListener("touchstart",O,!0)}catch{}}for(let x=0;x<d.length;x++){const A=d[x];if(x===0)continue;const I=A.getAttribute("href")||"#",R=document.createElement("a");R.className="navbar-item";try{if(/^[^#]*\.md(?:$|[#?])/.test(I)||I.endsWith(".md")){const C=ke(I).split(/::|#/,2),X=C[0],E=C[1];R.href=ve(X,E)}else if(/\.html(?:$|[#?])/.test(I)||I.endsWith(".html")){const C=ke(I).split(/::|#/,2);let X=C[0];X&&!X.toLowerCase().endsWith(".html")&&(X=X+".html");const E=C[1];try{const he=await Me(X,i);if(he&&he.raw)try{const se=new DOMParser().parseFromString(he.raw,"text/html"),me=se.querySelector("title"),oe=se.querySelector("h1"),ge=me&&me.textContent&&me.textContent.trim()?me.textContent.trim():oe&&oe.textContent?oe.textContent.trim():null;if(ge){const we=fe(ge);if(we){try{ne.set(we,X),F.set(X,we)}catch(Xe){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",Xe)}R.href=ve(we,E)}else R.href=ve(X,E)}else R.href=ve(X,E)}catch{R.href=ve(X,E)}else R.href=I}catch{R.href=I}}else R.href=I}catch(O){console.warn("[nimbi-cms] nav item href parse failed",O),R.href=I}try{const O=A.textContent&&String(A.textContent).trim()?String(A.textContent).trim():null;if(O)try{const C=fe(O);if(C){const X=R.getAttribute&&R.getAttribute("href")?R.getAttribute("href"):"";try{const he=new URL(X,location.href).searchParams.get("page");if(he){const J=decodeURIComponent(he);try{ne.set(C,J),F.set(J,C)}catch(se){console.warn("[nimbi-cms] slugToMd/mdToSlug set failed",se)}}}catch(E){console.warn("[nimbi-cms] nav slug mapping failed",E)}}}catch(C){console.warn("[nimbi-cms] nav slug mapping failed",C)}}catch(O){console.warn("[nimbi-cms] nav slug mapping failed",O)}R.textContent=A.textContent||I,Z.appendChild(R)}S.appendChild(Z),G&&S.appendChild(G),z.appendChild(K),z.appendChild(S),e.appendChild(z);try{const x=A=>{try{const I=z&&z.querySelector?z.querySelector(".navbar-burger"):document.querySelector(".navbar-burger");if(!I||!I.classList.contains("is-active"))return;const R=I&&I.closest?I.closest(".navbar"):z;if(R&&R.contains(A.target))return;$()}catch{}};document.addEventListener("click",x,!0),document.addEventListener("touchstart",x,!0)}catch{}try{S.addEventListener("click",x=>{const A=x.target&&x.target.closest?x.target.closest("a"):null;if(!A)return;const I=A.getAttribute("href")||"";try{const R=new URL(I,location.href),O=R.searchParams.get("page"),C=R.hash?R.hash.replace(/^#/,""):null;O&&(x.preventDefault(),history.pushState({page:O},"",ve(O,C)),N())}catch(R){console.warn("[nimbi-cms] navbar click handler failed",R)}try{const R=z&&z.querySelector?z.querySelector(".navbar-burger"):null,O=R&&R.dataset?R.dataset.target:null,C=O?document.getElementById(O):null;R&&R.classList.contains("is-active")&&(R.classList.remove("is-active"),R.setAttribute("aria-expanded","false"),C&&C.classList.remove("is-active"))}catch(R){console.warn("[nimbi-cms] mobile menu close failed",R)}})}catch(x){console.warn("[nimbi-cms] attach content click handler failed",x)}try{t.addEventListener("click",x=>{const A=x.target&&x.target.closest?x.target.closest("a"):null;if(!A)return;const I=A.getAttribute("href")||"";if(I&&!kr(I))try{const R=new URL(I,location.href),O=R.searchParams.get("page"),C=R.hash?R.hash.replace(/^#/,""):null;O&&(x.preventDefault(),history.pushState({page:O},"",ve(O,C)),N())}catch(R){console.warn("[nimbi-cms] container click URL parse failed",R)}})}catch(x){console.warn("[nimbi-cms] build navbar failed",x)}return{navbar:z,linkEls:d}}try{document.addEventListener("input",e=>{try{if(e&&e.target&&e.target.id==="nimbi-search"){const t=document.getElementById("nimbi-search-results");if(t&&e.target&&e.target.value)try{t.style.display="block"}catch{}}}catch{}},!0)}catch{}var Qn,mi;function Ws(){if(mi)return Qn;mi=1;function e(a,s){return s.some(([u,o])=>u<=a&&a<=o)}function t(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[12352,12447],[19968,40959],[44032,55203],[131072,191456]])}function n(a){return` 
\r	`.includes(a)}function i(a){if(typeof a!="string")return!1;const s=a.charCodeAt(0);return e(s,[[33,47],[58,64],[91,96],[123,126],[12288,12351],[65280,65519]])}function r(a,s={}){let u=0,o=0,l=a.length-1;const c=s.wordsPerMinute||200,f=s.wordBound||n;for(;f(a[o]);)o++;for(;f(a[l]);)l--;const m=`${a}
`;for(let g=o;g<=l;g++)if((t(m[g])||!f(m[g])&&(f(m[g+1])||t(m[g+1])))&&u++,t(m[g]))for(;g<=l&&(i(m[g+1])||f(m[g+1]));)g++;const h=u/c,d=Math.round(h*60*1e3);return{text:Math.ceil(h.toFixed(2))+" min read",minutes:h,time:d,words:u}}return Qn=r,Qn}var Fs=Ws();const Zs=lr(Fs);function bi(e,t){let n=document.querySelector(`meta[name="${e}"]`);n||(n=document.createElement("meta"),n.setAttribute("name",e),document.head.appendChild(n)),n.setAttribute("content",t)}function pt(e,t,n){let i=`meta[${e}="${t}"]`,r=document.querySelector(i);r||(r=document.createElement("meta"),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute("content",n)}function Gs(e,t){try{let n=document.querySelector(`link[rel="${e}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",e),document.head.appendChild(n)),n.setAttribute("href",t)}catch(n){console.warn("[seoManager] upsertLinkRel failed",n)}}function Qs(e,t,n,i){const r=t&&String(t).trim()?t:e.title||document.title;pt("property","og:title",r);const a=i&&String(i).trim()?i:e.description||"";a&&String(a).trim()&&pt("property","og:description",a),a&&String(a).trim()&&pt("name","twitter:description",a),pt("name","twitter:card",e.twitter_card||"summary_large_image");const s=n||e.image;s&&(pt("property","og:image",s),pt("name","twitter:image",s))}function Xs(e,t,n,i,r=""){const a=e.meta||{},s=document&&document.querySelector&&document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",u=i&&String(i).trim()?i:a.description&&String(a.description).trim()?a.description:s&&String(s).trim()?s:"";u&&String(u).trim()&&bi("description",u),bi("robots",a.robots||"index,follow"),Qs(a,t,n,u)}function Ks(){try{const e=['meta[name="site"]','meta[name="site-name"]','meta[name="siteName"]','meta[property="og:site_name"]','meta[name="twitter:site"]'];for(const t of e){const n=document.querySelector(t);if(n){const i=n.getAttribute("content")||"";if(i&&i.trim())return i.trim()}}}catch(e){console.warn("[seoManager] getSiteNameFromMeta failed",e)}return""}function Ys(e,t,n,i,r,a=""){try{const s=e.meta||{},u=n&&String(n).trim()?n:s.title||a||document.title,o=r&&String(r).trim()?r:s.description||document.querySelector('meta[name="description"]')&&document.querySelector('meta[name="description"]').getAttribute("content")||"",l=i||s.image||null;let c="";try{if(t){const d=ke(t);try{c=(location.origin+location.pathname).split("?")[0]+"?page="+encodeURIComponent(d)}catch{c=location.href.split("#")[0]}}else c=location.href.split("#")[0]}catch(d){c=location.href.split("#")[0],console.warn("[seoManager] compute canonical failed",d)}c&&Gs("canonical",c);try{pt("property","og:url",c)}catch(d){console.warn("[seoManager] upsertMeta og:url failed",d)}const f={"@context":"https://schema.org","@type":"Article",headline:u||"",description:o||"",url:c||location.href.split("#")[0]};l&&(f.image=String(l)),s.date&&(f.datePublished=s.date),s.dateModified&&(f.dateModified=s.dateModified);const m="nimbi-jsonld";let h=document.getElementById(m);h||(h=document.createElement("script"),h.type="application/ld+json",h.id=m,document.head.appendChild(h)),h.textContent=JSON.stringify(f,null,2)}catch(s){console.warn("[seoManager] setStructuredData failed",s)}}function Vs(e,t,n,i,r,a,s,u,o,l,c){try{if(i&&i.querySelector){const f=i.querySelector(".menu-label");f&&(f.textContent=u&&u.textContent||e("onThisPage"))}}catch(f){console.warn("[seoManager] update toc label failed",f)}try{const f=n.meta&&n.meta.title?String(n.meta.title).trim():"",m=r.querySelector("img"),h=m&&(m.getAttribute("src")||m.src)||null;let d="";try{let w="";try{const y=u||(r&&r.querySelector?r.querySelector("h1"):null);if(y){let k=y.nextElementSibling;const v=[];for(;k&&!(k.tagName&&k.tagName.toLowerCase()==="h2");){try{if(k.classList&&k.classList.contains("nimbi-article-subtitle")){k=k.nextElementSibling;continue}}catch{}const $=(k.textContent||"").trim();$&&v.push($),k=k.nextElementSibling}v.length&&(w=v.join(" ").replace(/\s+/g," ").trim()),!w&&o&&(w=String(o).trim())}}catch(y){console.warn("[seoManager] compute descOverride failed",y)}w&&String(w).length>160&&(w=String(w).slice(0,157).trim()+"..."),d=w}catch(w){console.warn("[seoManager] compute descOverride failed",w)}let p="";try{f&&(p=f)}catch{}if(!p)try{u&&u.textContent&&(p=String(u.textContent).trim())}catch{}if(!p)try{const w=r.querySelector("h2");w&&w.textContent&&(p=String(w.textContent).trim())}catch{}p||(p=a||"");try{Xs(n,p||void 0,h,d)}catch(w){console.warn("[seoManager] setMetaTags failed",w)}try{Ys(n,l,p||void 0,h,d,t)}catch(w){console.warn("[seoManager] setStructuredData failed",w)}const g=Ks();p?g?document.title=`${g} - ${p}`:document.title=`${t||"Site"} - ${p}`:f?document.title=f:document.title=t||document.title}catch(f){console.warn("[seoManager] applyPageMeta failed",f)}try{try{const f=r.querySelectorAll(".nimbi-reading-time");f&&f.forEach(m=>m.remove())}catch{}if(o){const f=Zs(c.raw||""),m=f&&typeof f.minutes=="number"?Math.ceil(f.minutes):0,h=m?e("readingTime",{minutes:m}):"";if(!h)return;const d=r.querySelector("h1");if(d){const p=r.querySelector(".nimbi-article-subtitle");try{if(p){const g=document.createElement("span");g.className="nimbi-reading-time",g.textContent=h,p.appendChild(g)}else{const g=document.createElement("p");g.className="nimbi-article-subtitle is-6 has-text-grey-light";const w=document.createElement("span");w.className="nimbi-reading-time",w.textContent=h,g.appendChild(w);try{d.parentElement.insertBefore(g,d.nextSibling)}catch{try{d.insertAdjacentElement("afterend",g)}catch{}}}}catch{try{const w=document.createElement("p");w.className="nimbi-article-subtitle is-6 has-text-grey-light";const y=document.createElement("span");y.className="nimbi-reading-time",y.textContent=h,w.appendChild(y),d.insertAdjacentElement("afterend",w)}catch{}}}}}catch(f){console.warn("[seoManager] reading time update failed",f)}}let Pe=null,Q=null,Te=1,Qe=(e,t)=>t,jt=0,Ut=0,pn=()=>{},Wt=.25;function Js(){if(Pe&&document.contains(Pe))return Pe;Pe=null;const e=document.createElement("dialog");e.className="nimbi-image-preview modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label",Qe("imagePreviewTitle","Image preview")),e.innerHTML=`
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
  `,e.addEventListener("click",S=>{S.target===e&&Xn()}),e.addEventListener("wheel",S=>{if(!le())return;S.preventDefault();const Z=S.deltaY<0?Wt:-Wt;et(Te+Z),l(),c()},{passive:!1}),e.addEventListener("keydown",S=>{if(S.key==="Escape"){Xn();return}if(Te>1){const Z=e.querySelector(".nimbi-image-preview__image-wrapper");if(!Z)return;const G=40;switch(S.key){case"ArrowUp":Z.scrollTop-=G,S.preventDefault();break;case"ArrowDown":Z.scrollTop+=G,S.preventDefault();break;case"ArrowLeft":Z.scrollLeft-=G,S.preventDefault();break;case"ArrowRight":Z.scrollLeft+=G,S.preventDefault();break}}}),document.body.appendChild(e),Pe=e,Q=e.querySelector("[data-nimbi-preview-image]");const t=e.querySelector("[data-nimbi-preview-fit]"),n=e.querySelector("[data-nimbi-preview-original]"),i=e.querySelector("[data-nimbi-preview-zoom-in]"),r=e.querySelector("[data-nimbi-preview-zoom-out]"),a=e.querySelector("[data-nimbi-preview-reset]"),s=e.querySelector("[data-nimbi-preview-close]"),u=e.querySelector("[data-nimbi-preview-zoom-label]"),o=e.querySelector("[data-nimbi-preview-zoom-hud]");function l(){u&&(u.textContent=`${Math.round(Te*100)}%`)}const c=()=>{o&&(o.textContent=`${Math.round(Te*100)}%`,o.classList.add("visible"),clearTimeout(o._timeout),o._timeout=setTimeout(()=>o.classList.remove("visible"),800))};pn=l,i.addEventListener("click",()=>{et(Te+Wt),l(),c()}),r.addEventListener("click",()=>{et(Te-Wt),l(),c()}),t.addEventListener("click",()=>{Ft(),l(),c()}),n.addEventListener("click",()=>{et(1),l(),c()}),a.addEventListener("click",()=>{Ft(),l(),c()}),s.addEventListener("click",Xn),t.title=Qe("imagePreviewFit","Fit to screen"),n.title=Qe("imagePreviewOriginal","Original size"),r.title=Qe("imagePreviewZoomOut","Zoom out"),i.title=Qe("imagePreviewZoomIn","Zoom in"),s.title=Qe("imagePreviewClose","Close"),s.setAttribute("aria-label",Qe("imagePreviewClose","Close"));let f=!1,m=0,h=0,d=0,p=0;const g=new Map;let w=0,y=1;const k=(S,Z)=>{const G=S.x-Z.x,pe=S.y-Z.y;return Math.hypot(G,pe)},v=()=>{f=!1,g.clear(),w=0,Q&&(Q.classList.add("is-panning"),Q.classList.remove("is-grabbing"))};let $=0,N=0,U=0;const z=S=>{const Z=Date.now(),G=Z-$,pe=S.clientX-N,x=S.clientY-U;$=Z,N=S.clientX,U=S.clientY,G<300&&Math.hypot(pe,x)<30&&(et(Te>1?1:2),l(),S.preventDefault())},K=S=>{et(Te>1?1:2),l(),S.preventDefault()},le=()=>Pe?typeof Pe.open=="boolean"?Pe.open:Pe.classList.contains("is-active"):!1,L=(S,Z,G=1)=>{if(g.has(G)&&g.set(G,{x:S,y:Z}),g.size===2){const I=Array.from(g.values()),R=k(I[0],I[1]);if(w>0){const O=R/w;et(y*O)}return}if(!f)return;const pe=Q.closest(".nimbi-image-preview__image-wrapper");if(!pe)return;const x=S-m,A=Z-h;pe.scrollLeft=d-x,pe.scrollTop=p-A},j=(S,Z,G=1)=>{if(!le())return;if(g.set(G,{x:S,y:Z}),g.size===2){const A=Array.from(g.values());w=k(A[0],A[1]),y=Te;return}const pe=Q.closest(".nimbi-image-preview__image-wrapper");!pe||!(pe.scrollWidth>pe.clientWidth||pe.scrollHeight>pe.clientHeight)||(f=!0,m=S,h=Z,d=pe.scrollLeft,p=pe.scrollTop,Q.classList.add("is-panning"),Q.classList.remove("is-grabbing"),window.addEventListener("pointermove",_e),window.addEventListener("pointerup",V),window.addEventListener("pointercancel",V))},_e=S=>{f&&(S.preventDefault(),L(S.clientX,S.clientY,S.pointerId))},V=()=>{v(),window.removeEventListener("pointermove",_e),window.removeEventListener("pointerup",V),window.removeEventListener("pointercancel",V)};Q.addEventListener("pointerdown",S=>{S.preventDefault(),j(S.clientX,S.clientY,S.pointerId)}),Q.addEventListener("pointermove",S=>{(f||g.size===2)&&S.preventDefault(),L(S.clientX,S.clientY,S.pointerId)}),Q.addEventListener("pointerup",S=>{S.preventDefault(),S.pointerType==="touch"&&z(S),v()}),Q.addEventListener("dblclick",K),Q.addEventListener("pointercancel",v),Q.addEventListener("mousedown",S=>{S.preventDefault(),j(S.clientX,S.clientY,1)}),Q.addEventListener("mousemove",S=>{f&&S.preventDefault(),L(S.clientX,S.clientY,1)}),Q.addEventListener("mouseup",S=>{S.preventDefault(),v()});const H=e.querySelector(".nimbi-image-preview__image-wrapper");return H&&(H.addEventListener("pointerdown",S=>{if(j(S.clientX,S.clientY,S.pointerId),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),H.addEventListener("pointermove",S=>{L(S.clientX,S.clientY,S.pointerId)}),H.addEventListener("pointerup",v),H.addEventListener("pointercancel",v),H.addEventListener("mousedown",S=>{if(j(S.clientX,S.clientY,1),S&&S.target&&S.target.tagName==="IMG")try{S.target.classList.add("is-grabbing")}catch{}}),H.addEventListener("mousemove",S=>{L(S.clientX,S.clientY,1)}),H.addEventListener("mouseup",v)),e}function et(e){if(!Q)return;const t=Number(e);Te=Number.isFinite(t)?Math.max(.1,Math.min(4,t)):1;const i=Q.getBoundingClientRect(),r=jt||Q.naturalWidth||Q.width||i.width||0,a=Ut||Q.naturalHeight||Q.height||i.height||0;if(r&&a){Q.style.setProperty("--nimbi-preview-img-max-width","none"),Q.style.setProperty("--nimbi-preview-img-max-height","none"),Q.style.setProperty("--nimbi-preview-img-width",`${r*Te}px`),Q.style.setProperty("--nimbi-preview-img-height",`${a*Te}px`),Q.style.setProperty("--nimbi-preview-img-transform","none");try{Q.style.width=`${r*Te}px`,Q.style.height=`${a*Te}px`,Q.style.transform="none"}catch{}}else{Q.style.setProperty("--nimbi-preview-img-max-width",""),Q.style.setProperty("--nimbi-preview-img-max-height",""),Q.style.setProperty("--nimbi-preview-img-width",""),Q.style.setProperty("--nimbi-preview-img-height",""),Q.style.setProperty("--nimbi-preview-img-transform",`scale(${Te})`);try{Q.style.transform=`scale(${Te})`}catch{}}Q&&(Q.classList.add("is-panning"),Q.classList.remove("is-grabbing"))}function Ft(){if(!Q)return;const e=Q.closest(".nimbi-image-preview__image-wrapper");if(!e)return;const t=e.getBoundingClientRect();if(t.width===0||t.height===0)return;const n=jt||Q.naturalWidth||t.width,i=Ut||Q.naturalHeight||t.height;if(!n||!i)return;const r=t.width/n,a=t.height/i,s=Math.min(r,a,1);et(Number.isFinite(s)?s:1)}function eo(e,t="",n=0,i=0){const r=Js();Te=1,jt=n||0,Ut=i||0,Q.src=e;try{if(!t)try{const u=new URL(e,typeof location<"u"?location.href:"").pathname||"",l=(u.substring(u.lastIndexOf("/")+1)||e).replace(/\.[^/.]+$/,"").replace(/[-_]+/g," ");t=Qe("imagePreviewDefaultAlt",l||"Image")}catch{t=Qe("imagePreviewDefaultAlt","Image")}}catch{}Q.alt=t,Q.style.transform="scale(1)";const a=()=>{jt=Q.naturalWidth||Q.width||0,Ut=Q.naturalHeight||Q.height||0};if(a(),Ft(),pn(),requestAnimationFrame(()=>{Ft(),pn()}),!jt||!Ut){const s=()=>{a(),requestAnimationFrame(()=>{Ft(),pn()}),Q.removeEventListener("load",s)};Q.addEventListener("load",s)}typeof r.showModal=="function"&&(r.open||r.showModal()),r.classList.add("is-active");try{document.documentElement.classList.add("nimbi-image-preview-open")}catch{}r.focus()}function Xn(){if(Pe){typeof Pe.close=="function"&&Pe.open&&Pe.close(),Pe.classList.remove("is-active");try{document.documentElement.classList.remove("nimbi-image-preview-open")}catch{}}}function to(e,{t,zoomStep:n=.25}={}){if(!e||!e.querySelectorAll)return;Qe=(h,d)=>(typeof t=="function"?t(h):void 0)||d,Wt=n,e.addEventListener("click",h=>{const d=h.target;if(!d||d.tagName!=="IMG")return;const p=d;if(!p.src)return;const g=p.closest("a");g&&g.getAttribute("href")||eo(p.src,p.alt||"",p.naturalWidth||0,p.naturalHeight||0)});let i=!1,r=0,a=0,s=0,u=0;const o=new Map;let l=0,c=1;const f=(h,d)=>{const p=h.x-d.x,g=h.y-d.y;return Math.hypot(p,g)};e.addEventListener("pointerdown",h=>{const d=h.target;if(!d||d.tagName!=="IMG")return;const p=d.closest("a");if(p&&p.getAttribute("href")||!Pe||!Pe.open)return;if(o.set(h.pointerId,{x:h.clientX,y:h.clientY}),o.size===2){const w=Array.from(o.values());l=f(w[0],w[1]),c=Te;return}const g=d.closest(".nimbi-image-preview__image-wrapper");if(g&&!(Te<=1)){h.preventDefault(),i=!0,r=h.clientX,a=h.clientY,s=g.scrollLeft,u=g.scrollTop,d.setPointerCapture(h.pointerId);try{d.classList.add("is-grabbing")}catch{}}}),e.addEventListener("pointermove",h=>{if(o.has(h.pointerId)&&o.set(h.pointerId,{x:h.clientX,y:h.clientY}),o.size===2){h.preventDefault();const k=Array.from(o.values()),v=f(k[0],k[1]);if(l>0){const $=v/l;et(c*$)}return}if(!i)return;h.preventDefault();const d=h.target,p=d.closest&&d.closest("a");if(p&&p.getAttribute&&p.getAttribute("href"))return;const g=d.closest(".nimbi-image-preview__image-wrapper");if(!g)return;const w=h.clientX-r,y=h.clientY-a;g.scrollLeft=s-w,g.scrollTop=u-y});const m=()=>{i=!1,o.clear(),l=0;try{const h=document.querySelector("[data-nimbi-preview-image]");h&&(h.classList.add("is-panning"),h.classList.remove("is-grabbing"))}catch{}};e.addEventListener("pointerup",m),e.addEventListener("pointercancel",m)}function no(e){const{contentWrap:t,navWrap:n,container:i,mountOverlay:r=null,t:a,contentBase:s,homePage:u,initialDocumentTitle:o,runHooks:l}=e||{};if(!t||!(t instanceof HTMLElement))throw new TypeError("contentWrap must be an HTMLElement");let c=null;const f=Ts(a,[{path:u,name:a("home"),isIndex:!0,children:[]}]);async function m(w,y){let k,v,$;try{({data:k,pagePath:v,anchor:$}=await ka(w,s))}catch(j){console.error("[nimbi-cms] fetchPageData failed",j),pi(t,a,j);return}!$&&y&&($=y);try{Gn(null)}catch(j){console.warn("[nimbi-cms] scrollToAnchorOrTop failed",j)}t.innerHTML="";const{article:N,parsed:U,toc:z,topH1:K,h1Text:le,slugKey:L}=await Ns(a,k,v,$,s);Vs(a,o,U,z,N,v,$,K,le,L,k),n.innerHTML="",z&&(n.appendChild(z),Hs(z));try{await l("transformHtml",{article:N,parsed:U,toc:z,pagePath:v,anchor:$,topH1:K,h1Text:le,slugKey:L,data:k})}catch(j){console.warn("[nimbi-cms] transformHtml hooks failed",j)}t.appendChild(N);try{Bs(N)}catch(j){console.warn("[nimbi-cms] executeEmbeddedScripts failed",j)}try{to(N,{t:a})}catch(j){console.warn("[nimbi-cms] attachImagePreview failed",j)}try{Kt(i,100,!1),requestAnimationFrame(()=>Kt(i,100,!1)),setTimeout(()=>Kt(i,100,!1),250)}catch(j){console.warn("[nimbi-cms] setEagerForAboveFoldImages failed",j)}Gn($),js(N,K,{mountOverlay:r,container:i,navWrap:n,t:a});try{await l("onPageLoad",{data:k,pagePath:v,anchor:$,article:N,toc:z,topH1:K,h1Text:le,slugKey:L,contentWrap:t,navWrap:n})}catch(j){console.warn("[nimbi-cms] onPageLoad hooks failed",j)}c=v}async function h(){let w=new URLSearchParams(location.search).get("page")||u;const y=location.hash?decodeURIComponent(location.hash.replace(/^#/,"")):null;try{await m(w,y)}catch(k){console.warn("[nimbi-cms] renderByQuery failed for",w,k),pi(t,a,k)}}window.addEventListener("popstate",h);const d=()=>`nimbi-cms-scroll:${location.pathname}${location.search}`,p=()=>{try{const w=i||document.querySelector(".nimbi-cms");if(!w)return;const y={top:w.scrollTop||0,left:w.scrollLeft||0};sessionStorage.setItem(d(),JSON.stringify(y))}catch{}},g=()=>{try{const w=i||document.querySelector(".nimbi-cms");if(!w)return;const y=sessionStorage.getItem(d());if(!y)return;const k=JSON.parse(y);k&&typeof k.top=="number"&&w.scrollTo({top:k.top,left:k.left||0,behavior:"auto"})}catch{}};return window.addEventListener("pageshow",w=>{if(w.persisted)try{g(),Kt(i,100,!1)}catch(y){console.warn("[nimbi-cms] bfcache restore failed",y)}}),window.addEventListener("pagehide",()=>{try{p()}catch(w){console.warn("[nimbi-cms] save scroll position failed",w)}}),{renderByQuery:h,siteNav:f,getCurrentPagePath:()=>c}}function ro(e){try{let t=typeof e=="string"?e:typeof window<"u"&&window.location?window.location.search:"";if(!t&&typeof window<"u"&&window.location&&window.location.hash){const a=window.location.hash,s=a.indexOf("?");s!==-1&&(t=a.slice(s))}if(!t)return{};const n=new URLSearchParams(t.startsWith("?")?t.slice(1):t),i={},r=a=>{if(a==null)return;const s=String(a).toLowerCase();if(s==="1"||s==="true"||s==="yes")return!0;if(s==="0"||s==="false"||s==="no")return!1};if(n.has("contentPath")&&(i.contentPath=n.get("contentPath")),n.has("searchIndex")){const a=r(n.get("searchIndex"));typeof a=="boolean"&&(i.searchIndex=a)}if(n.has("searchIndexMode")){const a=n.get("searchIndexMode");(a==="eager"||a==="lazy")&&(i.searchIndexMode=a)}if(n.has("defaultStyle")){const a=n.get("defaultStyle");(a==="light"||a==="dark"||a==="system")&&(i.defaultStyle=a)}if(n.has("bulmaCustomize")&&(i.bulmaCustomize=n.get("bulmaCustomize")),n.has("lang")&&(i.lang=n.get("lang")),n.has("l10nFile")){const a=n.get("l10nFile");i.l10nFile=a==="null"?null:a}if(n.has("cacheTtlMinutes")){const a=Number(n.get("cacheTtlMinutes"));Number.isFinite(a)&&a>=0&&(i.cacheTtlMinutes=a)}if(n.has("cacheMaxEntries")){const a=Number(n.get("cacheMaxEntries"));Number.isInteger(a)&&a>=0&&(i.cacheMaxEntries=a)}if(n.has("homePage")&&(i.homePage=n.get("homePage")),n.has("navigationPage")&&(i.navigationPage=n.get("navigationPage")),n.has("notFoundPage")&&(i.notFoundPage=n.get("notFoundPage")),n.has("availableLanguages")&&(i.availableLanguages=n.get("availableLanguages").split(",").map(a=>a.trim()).filter(Boolean)),n.has("indexDepth")){const a=Number(n.get("indexDepth"));Number.isInteger(a)&&(a===1||a===2||a===3)&&(i.indexDepth=a)}if(n.has("noIndexing")){const s=(n.get("noIndexing")||"").split(",").map(u=>u.trim()).filter(Boolean);s.length&&(i.noIndexing=s)}return i}catch{return{}}}function io(e){return!(typeof e!="string"||!e.trim()||e.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(e)||e.startsWith("//")||e.startsWith("/")||/^[A-Za-z]:\\/.test(e))}function Kn(e){if(typeof e!="string")return!1;const t=e.trim();if(!t||t.includes("..")||/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(t)||t.startsWith("//")||t.startsWith("/")||/^[A-Za-z]:\\/.test(t))return!1;const n=t.replace(/^\.\//,"");return!!/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(md|html)$/.test(n)}let Yn="";async function wi(e={}){if(typeof window<"u"&&window.__nimbiCMSDebug)try{console.info("[nimbi-cms] initCMS called",{options:e})}catch{}if(!e||typeof e!="object")throw new TypeError("initCMS(options): options must be an object");const n=ro();if(n&&(n.contentPath||n.homePage||n.notFoundPage||n.navigationPage))if(e&&e.allowUrlPathOverrides===!0)try{console.warn("[nimbi-cms] allowUrlPathOverrides enabled by host; honoring URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch(L){console.warn("[nimbi-cms] allowUrlPathOverrides logging failed",L)}else{try{console.warn("[nimbi-cms] ignoring unsafe URL overrides for contentPath/homePage/notFoundPage/navigationPage")}catch(L){console.warn("[nimbi-cms] logging ignore of URL overrides failed",L)}delete n.contentPath,delete n.homePage,delete n.notFoundPage,delete n.navigationPage}const i=Object.assign({},n,e);n&&typeof n.bulmaCustomize=="string"&&n.bulmaCustomize.trim()&&(i.bulmaCustomize=n.bulmaCustomize);let{el:r,contentPath:a="/content",crawlMaxQueue:s=1e3,searchIndex:u=!0,searchIndexMode:o="eager",indexDepth:l=1,noIndexing:c=void 0,defaultStyle:f="light",bulmaCustomize:m="none",lang:h=void 0,l10nFile:d=null,cacheTtlMinutes:p=5,cacheMaxEntries:g,markdownExtensions:w,availableLanguages:y,homePage:k="_home.md",notFoundPage:v="_404.md",navigationPage:$="_navigation.md"}=i;try{typeof k=="string"&&k.startsWith("./")&&(k=k.replace(/^\.\//,""))}catch{}try{typeof v=="string"&&v.startsWith("./")&&(v=v.replace(/^\.\//,""))}catch{}try{typeof $=="string"&&$.startsWith("./")&&($=$.replace(/^[.]\//,""))}catch{}const{navbarLogo:N="favicon"}=i,{skipRootReadme:U=!1}=i,z=L=>{try{const j=document.querySelector(r);j&&j instanceof Element&&(j.innerHTML=`<div style="padding:1rem;font-family:system-ui, sans-serif;color:#b00;background:#fee;border:1px solid #b00;"><strong>NimbiCMS failed to initialize:</strong><br><pre style="white-space:pre-wrap;">${String(L)}</pre></div>`)}catch{}};if(i.contentPath!=null&&!io(i.contentPath))throw new TypeError('initCMS(options): "contentPath" contains unsafe characters or patterns');if(k!=null&&!Kn(k))throw new TypeError('initCMS(options): "homePage" must be a relative path (no leading "/") ending with .md or .html');if(v!=null&&!Kn(v))throw new TypeError('initCMS(options): "notFoundPage" must be a relative path (no leading "/") ending with .md or .html');if($!=null&&!Kn($))throw new TypeError('initCMS(options): "navigationPage" must be a relative path (no leading "/") ending with .md or .html');if(!r)throw new Error("el is required");let K=r;if(typeof r=="string"){if(K=document.querySelector(r),!K)throw new Error(`el selector "${r}" did not match any element`)}else if(!(r instanceof Element))throw new TypeError("el must be a CSS selector string or a DOM element");if(typeof a!="string"||!a.trim())throw new TypeError('initCMS(options): "contentPath" must be a non-empty string when provided');if(typeof u!="boolean")throw new TypeError('initCMS(options): "searchIndex" must be a boolean when provided');if(o!=null&&o!=="eager"&&o!=="lazy")throw new TypeError('initCMS(options): "searchIndexMode" must be "eager" or "lazy" when provided');if(l!=null&&l!==1&&l!==2&&l!==3)throw new TypeError('initCMS(options): "indexDepth" must be 1, 2, or 3 when provided');if(f!=="light"&&f!=="dark"&&f!=="system")throw new TypeError('initCMS(options): "defaultStyle" must be "light", "dark" or "system"');if(m!=null&&typeof m!="string")throw new TypeError('initCMS(options): "bulmaCustomize" must be a string when provided');if(h!=null&&typeof h!="string")throw new TypeError('initCMS(options): "lang" must be a string when provided');if(d!=null&&typeof d!="string")throw new TypeError('initCMS(options): "l10nFile" must be a string or null when provided');if(p!=null&&(typeof p!="number"||!Number.isFinite(p)||p<0))throw new TypeError('initCMS(options): "cacheTtlMinutes" must be a non‑negative number when provided');if(g!=null&&(typeof g!="number"||!Number.isInteger(g)||g<0))throw new TypeError('initCMS(options): "cacheMaxEntries" must be a non‑negative integer when provided');if(w!=null&&(!Array.isArray(w)||w.some(L=>!L||typeof L!="object")))throw new TypeError('initCMS(options): "markdownExtensions" must be an array of extension objects when provided');if(y!=null&&(!Array.isArray(y)||y.some(L=>typeof L!="string"||!L.trim())))throw new TypeError('initCMS(options): "availableLanguages" must be an array of non-empty strings when provided');if(c!=null&&(!Array.isArray(c)||c.some(L=>typeof L!="string"||!L.trim())))throw new TypeError('initCMS(options): "noIndexing" must be an array of non-empty strings when provided');if(U!=null&&typeof U!="boolean")throw new TypeError('initCMS(options): "skipRootReadme" must be a boolean when provided');if(k!=null&&(typeof k!="string"||!k.trim()||!/\.(md|html)$/.test(k)))throw new TypeError('initCMS(options): "homePage" must be a non-empty string ending with .md or .html');if(v!=null&&(typeof v!="string"||!v.trim()||!/\.(md|html)$/.test(v)))throw new TypeError('initCMS(options): "notFoundPage" must be a non-empty string ending with .md or .html');const le=!!u;try{Promise.resolve().then(()=>_t).then(L=>{try{L&&typeof L.setSkipRootReadme=="function"&&L.setSkipRootReadme(!!U)}catch(j){console.warn("[nimbi-cms] setSkipRootReadme failed",j)}}).catch(L=>{})}catch(L){console.warn("[nimbi-cms] setSkipRootReadme dynamic import failed",L)}try{await(async()=>{try{K.classList.add("nimbi-mount")}catch(E){console.warn("[nimbi-cms] mount element setup failed",E)}const L=document.createElement("section");L.className="section";const j=document.createElement("div");j.className="container nimbi-cms";const _e=document.createElement("div");_e.className="columns";const V=document.createElement("div");V.className="column is-hidden-mobile is-3-tablet nimbi-nav-wrap",V.setAttribute("role","navigation");try{const E=typeof wt=="function"?wt("navigation"):null;E&&V.setAttribute("aria-label",E)}catch(E){console.warn("[nimbi-cms] set nav aria-label failed",E)}_e.appendChild(V);const H=document.createElement("main");H.className="column nimbi-content",H.setAttribute("role","main"),_e.appendChild(H),j.appendChild(_e),L.appendChild(j);const S=V,Z=H;K.appendChild(L);let G=null;try{G=K.querySelector(".nimbi-overlay"),G||(G=document.createElement("div"),G.className="nimbi-overlay",K.appendChild(G))}catch(E){G=null,console.warn("[nimbi-cms] mount overlay setup failed",E)}const pe=location.pathname||"/";let x;if(pe.endsWith("/"))x=pe;else{const E=pe.substring(pe.lastIndexOf("/")+1);E&&!E.includes(".")?x=pe+"/":x=pe.substring(0,pe.lastIndexOf("/")+1)}try{Yn=document.title||""}catch(E){Yn="",console.warn("[nimbi-cms] read initial document title failed",E)}let A=a;const I=Object.prototype.hasOwnProperty.call(i,"contentPath"),R=typeof location<"u"&&location.origin?location.origin:"http://localhost",O=new URL(x,R).toString();(A==="."||A==="./")&&(A="");try{A=String(A||"").replace(/\\/g,"/")}catch{A=String(A||"")}A.startsWith("/")&&(A=A.replace(/^\/+/,"")),A&&!A.endsWith("/")&&(A=A+"/");try{if(A&&x&&x!=="/"){const E=x.replace(/^\/+/,"").replace(/\/+$/,"")+"/";E&&A.startsWith(E)&&(A=A.slice(E.length))}}catch{}try{if(A)var C=new URL(A,O.endsWith("/")?O:O+"/").toString();else var C=O}catch{try{if(A)var C=new URL("/"+A,R).toString();else var C=new URL(x,R).toString()}catch{var C=R}}try{Promise.resolve().then(()=>_t).then(E=>{try{E&&typeof E.setHomePage=="function"&&E.setHomePage(k)}catch(he){console.warn("[nimbi-cms] setHomePage failed",he)}}).catch(E=>{})}catch(E){console.warn("[nimbi-cms] setHomePage dynamic import failed",E)}d&&await An(d,x),y&&Array.isArray(y)&&_r(y),h&&En(h);const X=no({contentWrap:Z,navWrap:S,container:j,mountOverlay:G,t:wt,contentBase:C,homePage:k,initialDocumentTitle:Yn,runHooks:kn});if(typeof p=="number"&&p>=0&&typeof Ir=="function"&&Ir(p*60*1e3),typeof g=="number"&&g>=0&&typeof Pr=="function"&&Pr(g),w&&Array.isArray(w)&&w.length)try{w.forEach(E=>{typeof E=="object"&&li&&typeof Hn=="function"&&Hn(E)})}catch(E){console.warn("[nimbi-cms] applying markdownExtensions failed",E)}try{typeof s=="number"&&Promise.resolve().then(()=>_t).then(({setDefaultCrawlMaxQueue:E})=>{try{E(s)}catch(he){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue failed",he)}})}catch(E){console.warn("[nimbi-cms] setDefaultCrawlMaxQueue import failed",E)}try{en(C)}catch(E){console.warn("[nimbi-cms] setContentBase failed",E)}try{Mn(v)}catch(E){console.warn("[nimbi-cms] setNotFoundPage failed",E)}try{en(C)}catch(E){console.warn("[nimbi-cms] setContentBase failed",E)}try{Mn(v)}catch(E){console.warn("[nimbi-cms] setNotFoundPage failed",E)}try{await Me(k,C)}catch(E){throw k==="_home.md"?new Error("Required _home.md not found"):new Error(`Required ${k} not found at ${C}${k}: ${E.message}`)}pr(f),await dr(m,x);try{const E=document.createElement("header");E.className="nimbi-site-navbar",K.insertBefore(E,L);const he=await Me($,C),J=await dn(he.raw||""),{navbar:se,linkEls:me}=await Us(E,j,J.html||"",C,k,wt,X.renderByQuery,le,o,l,c,N);try{await kn("onNavBuild",{navWrap:S,navbar:se,linkEls:me,contentBase:C})}catch(oe){console.warn("[nimbi-cms] onNavBuild hooks failed",oe)}try{const oe=()=>{const ge=E&&E.getBoundingClientRect&&Math.round(E.getBoundingClientRect().height)||E&&E.offsetHeight||0;if(ge>0){try{K.style.setProperty("--nimbi-site-navbar-height",`${ge}px`)}catch(we){console.warn("[nimbi-cms] set CSS var failed",we)}try{j.style.paddingTop=""}catch(we){console.warn("[nimbi-cms] set container paddingTop failed",we)}try{const we=K&&K.getBoundingClientRect&&Math.round(K.getBoundingClientRect().height)||K&&K.clientHeight||0;if(we>0){const Xe=Math.max(0,we-ge);try{j.style.setProperty("--nimbi-cms-height",`${Xe}px`)}catch(Vn){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Vn)}}else try{j.style.setProperty("--nimbi-cms-height","calc(100vh - var(--nimbi-site-navbar-height))")}catch(Xe){console.warn("[nimbi-cms] set --nimbi-cms-height failed",Xe)}}catch(we){console.warn("[nimbi-cms] compute container height failed",we)}try{E.style.setProperty("--nimbi-site-navbar-height",`${ge}px`)}catch(we){console.warn("[nimbi-cms] set navbar CSS var failed",we)}}};oe();try{if(typeof ResizeObserver<"u"){const ge=new ResizeObserver(()=>oe());try{ge.observe(E)}catch(we){console.warn("[nimbi-cms] ResizeObserver.observe failed",we)}}}catch(ge){console.warn("[nimbi-cms] ResizeObserver setup failed",ge)}}catch(oe){console.warn("[nimbi-cms] compute navbar height failed",oe)}}catch(E){console.warn("[nimbi-cms] build navigation failed",E)}await X.renderByQuery();try{Promise.resolve().then(()=>ao).then(({getVersion:E})=>{typeof E=="function"&&E().then(he=>{try{const J=he||"0.0.0";try{const se=ge=>{const we=document.createElement("a");we.className="nimbi-version-label tag is-small",we.textContent=`Nimbi CMS v. ${J}`,we.href=ge||"#",we.target="_blank",we.rel="noopener noreferrer nofollow",we.setAttribute("aria-label",`Nimbi CMS version ${J}`);try{gr(we)}catch{}try{K.appendChild(we)}catch(Xe){console.warn("[nimbi-cms] append version label failed",Xe)}},me="https://abelvm.github.io/nimbiCMS/",oe=(()=>{try{if(me&&typeof me=="string")return new URL(me).toString()}catch{}return"#"})();se(oe)}catch(se){console.warn("[nimbi-cms] building version label failed",se)}}catch(J){console.warn("[nimbi-cms] building version label failed",J)}}).catch(he=>{console.warn("[nimbi-cms] getVersion() failed",he)})}).catch(E=>{console.warn("[nimbi-cms] import version module failed",E)})}catch(E){console.warn("[nimbi-cms] version label setup failed",E)}})()}catch(L){throw z(L),L}}async function yi(){try{if("1.0.5".trim())return"1.0.5"}catch{}return"0.0.0"}const ao=Object.freeze(Object.defineProperty({__proto__:null,getVersion:yi},Symbol.toStringTag,{value:"Module"}));ye.BAD_LANGUAGES=xn,ye.SUPPORTED_HLJS_MAP=ie,ye._clearHooks=qi,ye.addHook=Gt,ye.default=wi,ye.ensureBulma=dr,ye.getVersion=yi,ye.initCMS=wi,ye.loadL10nFile=An,ye.loadSupportedLanguages=vn,ye.observeCodeBlocks=ur,ye.onNavBuild=Bi,ye.onPageLoad=Ni,ye.registerLanguage=mt,ye.runHooks=kn,ye.setHighlightTheme=Fi,ye.setLang=En,ye.setStyle=pr,ye.setThemeVars=Gi,ye.t=wt,ye.transformHtml=Oi,Object.defineProperties(ye,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
