import { t, setLang, loadL10nFile, currentLang } from '../src/l10nManager.js'

describe('l10nManager', () => {
  beforeEach(() => {
    // reset to english before each test
    setLang('en')
  })

  it('returns English strings by default and respects setLang()', () => {
    expect(currentLang).toBe('en')
    expect(t('home')).toBe('Home')

    setLang('de')
    expect(currentLang).toBe('de')
    expect(t('home')).toBe('Startseite')

    setLang('fr')
    expect(currentLang).toBe('fr')
    expect(t('home')).toBe('Accueil')

    // unknown language falls back to English
    setLang('zz')
    expect(currentLang).toBe('en')
    expect(t('home')).toBe('Home')
  })

  it('can load a localization file and apply new language', async () => {
    // stub fetch to return a fake translation for a new locale "xx"
    global.fetch = vi.fn(async () => {
      return {
        ok: true,
        json: () => Promise.resolve({
          xx: { home: 'X Home', searchPlaceholder: 'X' }
        })
      }
    })

    await loadL10nFile('dummy.json', '/pages/')
    setLang('xx')
    expect(currentLang).toBe('xx')
    expect(t('home')).toBe('X Home')
    expect(t('searchPlaceholder')).toBe('X')
  })
})
