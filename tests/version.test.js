import { describe, it, expect } from 'vitest'
import { getVersion } from '../src/version.js'

describe('version module', () => {
  it('returns injected version when present', async () => {
    global.__NIMBI_CMS_VERSION__ = '1.2.3'
    const v = await getVersion()
    expect(v).toBe('1.2.3')
    delete global.__NIMBI_CMS_VERSION__
  })

  it('falls back to 0.0.0 when not defined', async () => {
    try { delete global.__NIMBI_CMS_VERSION__ } catch (e) {}
    const v = await getVersion()
    expect(v).toBe('0.0.0')
  })
})
