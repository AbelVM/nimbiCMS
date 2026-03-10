import { describe, it, expect, beforeEach } from 'vitest'
import { onPageLoad, onNavBuild, transformHtml, addHook, runHooks, _clearHooks } from '../src/nimbi-cms.js'

// The hooks subsystem is fairly small; we test registration, invocation, and
// error handling. runHooks is exported purely for testing purposes.

describe('plugin hook system', () => {
  beforeEach(() => {
    _clearHooks()
  })

  it('allows registering and running simple hooks', async () => {
    let called = false
    onPageLoad(ctx => {
      called = true
      expect(ctx).toEqual({ foo: 'bar' })
    })

    await runHooks('onPageLoad', { foo: 'bar' })
    expect(called).toBe(true)
  })

  it('onNavBuild and transformHtml work similarly', async () => {
    let navCalled = false
    let transformCalled = false

    onNavBuild(ctx => { navCalled = ctx.ok })
    transformHtml(ctx => { transformCalled = ctx.ok })

    await runHooks('onNavBuild', { ok: true })
    await runHooks('transformHtml', { ok: true })

    expect(navCalled).toBe(true)
    expect(transformCalled).toBe(true)
  })

  it('addHook throws for unknown names', () => {
    expect(() => addHook('noSuchHook', () => {})).toThrow(/Unknown hook/)
  })

  it('errors thrown inside hook callbacks are swallowed', async () => {
    let fired = false
    onPageLoad(() => { throw new Error('boom') })
    onPageLoad(() => { fired = true })

    await runHooks('onPageLoad', {})
    expect(fired).toBe(true)
  })
})
