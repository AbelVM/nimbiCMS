import { readFileSync } from 'fs'
import { execSync } from 'child_process'

// Ensure the declaration generator script stays sane.
// This is less about the library's runtime and more about avoiding
// accidentally emitting broken TypeScript when we regenerate the file.

describe('gen-dts script', () => {
  it('runs without throwing and produces basic content', () => {
    // run the generator in-process so we can catch exceptions
    execSync('node scripts/gen-dts.js', { stdio: 'inherit' })
    const dts = readFileSync('src/index.d.ts', 'utf8')
    expect(dts).toMatch(/export function parseMarkdownToHtml\(/)
    expect(dts).not.toMatch(/Object<\s*string/) // should convert to Record<

    // sample file exports should produce sensible types
    expect(dts).toMatch(/complexExample\(opts: {a:number,b:string}\): Promise<Array<{foo:string}\|{bar:number}>>/)
    expect(dts).toMatch(/simpleUnion\(\): string\|number/)
    // recordExample may produce either Array<number> or number[] inside the Record
    expect(dts).toMatch(/recordExample\(\): Record<string, (?:Array<number>|number\[\])>/)
    expect(dts).toMatch(/sum\(opts: any\): {sum:number}/)
    expect(dts).toMatch(/callIt\(cb: \(\.\.\.args:any\[\]\)=>any\): void/)
  })
})
