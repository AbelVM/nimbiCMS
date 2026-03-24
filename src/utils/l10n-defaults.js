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
 * @property {string} searchNoResults
 * @property {string} imagePreviewTitle
 * @property {string} imagePreviewFit
 * @property {string} imagePreviewOriginal
 * @property {string} imagePreviewZoomOut
 * @property {string} imagePreviewZoomIn
 * @property {string} imagePreviewClose
 */

/** @type {Record<string, L10nEntry>} */
export const DEFAULT_L10N = {
  en: {
    navigation: 'Navigation',
    onThisPage: 'On this page',
    home: 'Home',
    scrollToTop: 'Scroll to top',
    readingTime: '{minutes} min read',
    searchPlaceholder: 'Search…',
    searchNoResults: 'No results',
    imagePreviewTitle: 'Image preview',
    imagePreviewFit: 'Fit to screen',
    imagePreviewOriginal: 'Original size',
    imagePreviewZoomOut: 'Zoom out',
    imagePreviewZoomIn: 'Zoom in',
    imagePreviewClose: 'Close'
  },
  es: {
    navigation: 'Navegación',
    onThisPage: 'En esta página',
    home: 'Inicio',
    scrollToTop: 'Ir arriba',
    readingTime: '{minutes} min de lectura',
    searchPlaceholder: 'Buscar…',
    searchNoResults: 'Sin resultados',
    imagePreviewTitle: 'Previsualización de imagen',
    imagePreviewFit: 'Ajustar a la pantalla',
    imagePreviewOriginal: 'Tamaño original',
    imagePreviewZoomOut: 'Alejar',
    imagePreviewZoomIn: 'Acercar',
    imagePreviewClose: 'Cerrar'
  }
  ,
  de: {
    navigation: 'Navigation',
    onThisPage: 'Auf dieser Seite',
    home: 'Startseite',
    scrollToTop: 'Nach oben',
    readingTime: '{minutes} min Lesezeit',
    searchPlaceholder: 'Suchen…',
    searchNoResults: 'Keine Ergebnisse',
    imagePreviewTitle: 'Bildvorschau',
    imagePreviewFit: 'An Bildschirm anpassen',
    imagePreviewOriginal: 'Originalgröße',
    imagePreviewZoomOut: 'Verkleinern',
    imagePreviewZoomIn: 'Vergrößern',
    imagePreviewClose: 'Schließen'
  },
  fr: {
    navigation: 'Navigation',
    onThisPage: 'Sur cette page',
    home: 'Accueil',
    scrollToTop: 'Aller en haut',
    readingTime: '{minutes} min de lecture',
    searchPlaceholder: 'Rechercher…',
    searchNoResults: 'Aucun résultat',
    imagePreviewTitle: 'Aperçu de l’image',
    imagePreviewFit: 'Ajuster à l’écran',
    imagePreviewOriginal: 'Taille originale',
    imagePreviewZoomOut: 'Dézoomer',
    imagePreviewZoomIn: 'Zoomer',
    imagePreviewClose: 'Fermer'
  },
  pt: {
    navigation: 'Navegação',
    onThisPage: 'Nesta página',
    home: 'Início',
    scrollToTop: 'Ir para o topo',
    readingTime: '{minutes} min de leitura',
    searchPlaceholder: 'Procurar…',
    searchNoResults: 'Sem resultados',
    imagePreviewTitle: 'Visualização da imagem',
    imagePreviewFit: 'Ajustar à tela',
    imagePreviewOriginal: 'Tamanho original',
    imagePreviewZoomOut: 'Diminuir',
    imagePreviewZoomIn: 'Aumentar',
    imagePreviewClose: 'Fechar'
  }
}

/**
 * Default localization entries keyed by locale (e.g. 'en', 'es').
 * Exported as the module default for convenience.
 * @type {Record<string, L10nEntry>}
 */
export default DEFAULT_L10N

