import { expectType } from 'tsd'
import initCMS, { InitOptions, ParsedPage, NavTreeItem, ParsedPage as ParseResult, ResolutionRecord } from '../src/index'

// basic initCMS options
expectType<Promise<void>>(initCMS({ el: '#app' } as InitOptions))

// markdown parse result
expectType<Promise<ParsedPage>>( (async () => await (await import('../src/index')).parseMarkdownToHtml(''))() )

// nav types
const nav: NavTreeItem[] = [{ path: 'home', name: 'Home' }]
expectType<NavTreeItem[]>(nav)

// resolution cache shape
const rec: ResolutionRecord = { value: { resolved: 'x', anchor: null }, ts: Date.now() }
expectType<number>(rec.ts)
