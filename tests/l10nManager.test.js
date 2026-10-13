import { t, tPlural, setLang, loadL10nFile, currentLang } from '../src/l10nManager.js'

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

  it('handles regex metacharacters in replacement keys without ReDoS', () => {
    setLang('en')
    const start = Date.now()
    // Malicious keys with regex metacharacters should be escaped and
    // complete quickly without hanging.
    const result = t('home', { 'a{2,}b': 'value', '(a|b)*': 'other' })
    expect(result).toBe('Home')
    expect(Date.now() - start).toBeLessThan(1000)
  })

  it('tPlural selects the correct plural form for the current locale', async () => {
    // Load a test locale with pluralization entries
    global.fetch = vi.fn(async () => {
      return {
        ok: true,
        json: () => Promise.resolve({
          en: {
            article: {
              one: '1 article',
              other: '{count} articles'
            }
          },
          es: {
            article: {
              one: '1 artículo',
              other: '{count} artículos'
            }
          }
        })
      }
    })

    await loadL10nFile('dummy.json', '/pages/')

    setLang('en')
    expect(tPlural('article', 0)).toBe('0 articles')
    expect(tPlural('article', 1)).toBe('1 article')
    expect(tPlural('article', 2)).toBe('2 articles')
    expect(tPlural('article', 5)).toBe('5 articles')
    expect(tPlural('article', 1, { count: 'one' })).toBe('1 article')

    setLang('es')
    expect(tPlural('article', 0)).toBe('0 artículos')
    expect(tPlural('article', 1)).toBe('1 artículo')
    expect(tPlural('article', 2)).toBe('2 artículos')
  })

  it('tPlural falls back to base key or English when plural form is missing', () => {
    setLang('en')
    // 'home' has no plural forms; should fall back to base key
    expect(tPlural('home', 1)).toBe('Home')
    expect(tPlural('home', 2)).toBe('Home')

    // Unknown key should return empty string
    expect(tPlural('nonexistent', 1)).toBe('')
  })
})
