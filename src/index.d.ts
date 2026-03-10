// Type definitions for nimbiCMS_pre
// Generated manually to aid IDEs.  Keep in sync with the public JS API.

export type ThemeStyle = 'light' | 'dark'

export interface InitOptions {
  el: string | Element
  contentPath?: string
  defaultStyle?: ThemeStyle
  bulmaCustomize?: string
  lang?: string
  l10nFile?: string | null
}

export interface PageContext {
  data: any
  pagePath: string
  anchor: string | null
}

export interface HookContext {
  // common fields provided to all hooks
  pagePath?: string
  anchor?: string | null
  article?: HTMLElement
  toc?: HTMLElement
  topH1?: HTMLElement | null
  h1Text?: string | null
  slugKey?: string | null
  data?: any
  contentWrap?: HTMLElement | null
  navWrap?: HTMLElement | null
  // nav-build specific
  navbar?: HTMLElement
  linkEls?: NodeListOf<HTMLAnchorElement>
  contentBase?: string
}

export function initCMS(options: InitOptions): Promise<void>
export default initCMS

export function registerLanguage(name: string, modulePath: string): void
export function setStyle(style: ThemeStyle): void
export function setThemeVars(vars: Record<string,string>): void
export function setHighlightTheme(name: string, opts?: { useCdn?: boolean }): void

export function onPageLoad(fn: (ctx: HookContext) => any): void
export function onNavBuild(fn: (ctx: HookContext) => any): void
export function transformHtml(fn: (ctx: HookContext) => any): void
export function addHook(name: string, fn: (ctx: HookContext) => any): void

// re-exported from codeblocksManager
export function observeCodeBlocks(el: HTMLElement): void

// accessible helpers from other modules
declare const allMarkdownPaths: string[]
export { allMarkdownPaths }

// additional low-level utilities (import from submodules if needed)
export function slugify(s: string): string
export function detectFenceLanguages(md: string, supportedMap?: Map<string,string>): Set<string>
export function parseMarkdownToHtml(md: string): Promise<{html:string,meta:any,toc:Array<any>}>
export function fetchPageData(raw: string, contentBase: string): Promise<{data:any,pagePath:string,anchor:string|null}>
export function fetchMarkdown(path: string, base: string): Promise<{raw:string,isHtml?:boolean,status?:number}>
export function isExternalLink(href: string): boolean
export function normalizePath(p: string): string
export function setLazyload(img: HTMLImageElement): void
export function safe(fn: Function): any

// DOM helpers
export function scrollToAnchorOrTop(anchor: string|null): void
export function ensureScrollTopButton(article: HTMLElement, topH1: HTMLElement|null, opts?: { mountOverlay?: HTMLElement|null, container?: HTMLElement|null, mountEl?: HTMLElement|null, navWrap?: HTMLElement|null, t?: Function }): void

