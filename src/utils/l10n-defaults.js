/**
 * Localization defaults for supported languages.
 *
 * @typedef {Object} L10nEntry
 * @property {string} navigation
 * @property {string} onThisPage
 * @property {string} home
 * @property {string} scrollToTop
 * @property {string} readingTime - Template using `{minutes}` placeholder.
 * @property {string} searchPlaceholder
 */

/** @type {Record<string, L10nEntry>} */
export const DEFAULT_L10N = {
  en: {
    navigation: 'Navigation',
    onThisPage: 'On this page',
    home: 'Home',
    scrollToTop: 'Scroll to top',
    readingTime: '{minutes} min read',
    searchPlaceholder: 'Search…'
  },
  es: {
    navigation: 'Navegación',
    onThisPage: 'En esta página',
    home: 'Inicio',
    scrollToTop: 'Ir arriba',
    readingTime: '{minutes} min de lectura',
    searchPlaceholder: 'Buscar…'
  }
  ,
  de: {
    navigation: 'Navigation',
    onThisPage: 'Auf dieser Seite',
    home: 'Startseite',
    scrollToTop: 'Nach oben',
    readingTime: '{minutes} min Lesezeit',
    searchPlaceholder: 'Suchen…'
  },
  fr: {
    navigation: 'Navigation',
    onThisPage: 'Sur cette page',
    home: 'Accueil',
    scrollToTop: 'Aller en haut',
    readingTime: '{minutes} min de lecture',
    searchPlaceholder: 'Rechercher…'
  },
  pt: {
    navigation: 'Navegação',
    onThisPage: 'Nesta página',
    home: 'Início',
    scrollToTop: 'Ir para o topo',
    readingTime: '{minutes} min de leitura',
    searchPlaceholder: 'Procurar…'
  }
}

export default DEFAULT_L10N

