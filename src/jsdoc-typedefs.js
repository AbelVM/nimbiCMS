/**
 * Shared JSDoc typedefs to improve emitted declaration generation.
 * This file does not execute code; it only provides typedef annotations
 * that TypeDoc/gen-dts can pick up.
 */

/**
 * @typedef {{level:number,text:string,id?:string}} TocEntry
 */

/**
 * @typedef {{html:string,meta:Record<string,unknown>,toc:TocEntry[]}} ParsedPage
 */

/**
 * @typedef {{article:HTMLElement,parsed:ParsedPage,toc:HTMLElement,topH1:HTMLElement|null,h1Text:string|null,slugKey:string|null}} ArticleResult
 */

/**
 * @typedef {{raw:string,isHtml?:boolean,status?:number}} FetchResult
 */

/**
 * @typedef {{default?:string,langs?:Record<string,string>}} SlugEntry
 */

/**
 * @typedef {{value:{resolved:string,anchor:string|null},ts:number}} ResolutionRecord
 */

/**
 * @typedef {{tokenizer?:Function,renderer?:Object,walkTokens?:Function,transform?:Function}} MarkdownPlugin
 */

export default null
