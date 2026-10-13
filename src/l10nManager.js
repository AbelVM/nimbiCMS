/**
 * Localization loader and translator.
 *
 * Provides runtime localization utilities: loading locale files and
 * translating keys with optional replacements.
 *
 * @module l10nManager
 */
import { DEFAULT_L10N } from "./utils/l10n-defaults.js";
import { PowerDeadline } from "performance-helpers/powerDeadline";

const L10N = structuredClone(DEFAULT_L10N);

/**
 * @typedef {Object.<string,string>} LocaleDict
 */

/**
 * @typedef {{[locale:string]: LocaleDict}} L10NMap
 */

let detectedLang = "en";
if (typeof navigator !== "undefined") {
  const navLang = navigator.language || navigator.languages?.[0] || "en";
  detectedLang = String(navLang).split("-")[0].toLowerCase();
}
if (!DEFAULT_L10N[detectedLang]) detectedLang = "en";

/**
 * Currently selected UI language code (short form, e.g. 'en').
 * @type {string}
 */
export let currentLang = detectedLang;

/**
 * Translate a key using the current language. Replacement tokens of the
 * form `{name}` are interpolated from the `replacements` object.
 *
 * @param {string} key - Translation key to look up in the current locale.
 * @param {Record<string,string>} [replacements] - Optional replacements for token interpolation.
 * @returns {string} - The translated string, or an empty string when not found.
 */
export function t(key, replacements = {}) {
  const dict = L10N[currentLang] || L10N.en;
  let s = dict?.[key] || L10N.en[key] || "";
  for (const k of Object.keys(replacements)) {
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    s = s.replace(new RegExp(`\\{${escaped}\\}`, "g"), String(replacements[k]));
  }
  return s;
}

/**
 * Load a JSON localization file and merge its contents into the runtime
 * dictionary.
 *
 * @param {string} path - URL or relative path to the JSON localization file.
 * @param {string} pageDir - Base page directory used to resolve relative paths.
 * @returns {Promise<void>} - Resolves when the file has been fetched and merged.
 */
export async function loadL10nFile(path, pageDir) {
  if (!path) return;
  let resolved = path;
  const fetchWithDeadline = async (targetUrl) => {
    if (PowerDeadline && typeof PowerDeadline.run === "function") {
      return await PowerDeadline.run(() => fetch(targetUrl), {
        attemptTimeout: 10_000,
        maxAttempts: 1,
      });
    }
    let timeoutSignal = null;
    try {
      if (
        typeof AbortSignal !== "undefined" &&
        typeof AbortSignal.timeout === "function"
      ) {
        timeoutSignal = AbortSignal.timeout(10_000);
      }
    } catch (_) {}
    return await fetch(
      targetUrl,
      timeoutSignal ? { signal: timeoutSignal } : undefined,
    );
  };
  try {
    if (!/^https?:\/\//.test(path)) {
      if (/^file:\/\//i.test(path)) {
        resolved = path;
      } else {
        resolved = new URL(path, location.origin + pageDir).toString();
      }
    }
    const res = await fetchWithDeadline(resolved);
    if (!res.ok) return;
    const json = await res.json();
    for (const lang of Object.keys(json || {})) {
      L10N[lang] = Object.assign({}, L10N[lang] || {}, json[lang]);
    }
  } catch (e) {}
}

/**
 * Translate a key using the current language with pluralization support.
 * Uses `Intl.PluralRules` to select the correct plural form based on `count`.
 * Translation keys should be of the form `key.one`, `key.other`, etc.
 * Falls back to the base key or English if the plural form is not found.
 *
 * @param {string} key - Translation key prefix (e.g. 'article').
 * @param {number} count - The count used to determine the plural form.
 * @param {Record<string,string>} [replacements] - Optional replacements for token interpolation.
 * @returns {string} - The translated string with pluralization applied.
 */
export function tPlural(key, count, replacements = {}) {
  try {
    const dict = L10N[currentLang] || L10N.en;
    const rules = new Intl.PluralRules(currentLang);
    const category = rules.select(count);
    const pluralKey = `${key}.${category}`;
    let s = dict?.[pluralKey] || "";
    if (!s) {
      const base = dict?.[key];
      if (base && typeof base === "object") {
        s = base[category] || "";
      } else if (typeof base === "string") {
        s = base;
      }
    }
    if (!s) {
      s = L10N.en[pluralKey] || "";
    }
    if (!s) {
      const enBase = L10N.en[key];
      if (enBase && typeof enBase === "object") {
        s = enBase[category] || "";
      } else if (typeof enBase === "string") {
        s = enBase;
      }
    }
    // Automatically replace {count} with the numeric count
    const allReplacements = { count: String(count), ...replacements };
    for (const k of Object.keys(allReplacements)) {
      const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      s = s.replace(new RegExp(`\\{${escaped}\\}`, "g"), String(allReplacements[k]));
    }
    return s;
  } catch (_) {
    return t(key, replacements);
  }
}

/**
 * Format a date using the current locale.
 *
 * @param {Date|string|number} date - The date to format.
 * @param {Intl.DateTimeFormatOptions} [options] - Optional formatting options.
 * @returns {string} - The formatted date string.
 */
export function formatDate(date, options = {}) {
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return String(date);
    const formatter = new Intl.DateTimeFormat(currentLang, {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options,
    });
    return formatter.format(d);
  } catch (_) {
    return String(date);
  }
}

/**
 * Format a number using the current locale.
 *
 * @param {number} value - The number to format.
 * @param {Intl.NumberFormatOptions} [options] - Optional formatting options.
 * @returns {string} - The formatted number string.
 */
export function formatNumber(value, options = {}) {
  try {
    const formatter = new Intl.NumberFormat(currentLang, options);
    return formatter.format(value);
  } catch (_) {
    return String(value);
  }
}

/**
 * Switch the current UI language. Falls back to English if the requested
 * language is not available.
 * @param {string} lang - Language code to switch to (e.g. 'en', 'es').
 * @returns {void}
 */
export function setLang(lang) {
  const raw = String(lang ?? "");
  const short = raw.split("-")[0].toLowerCase();
  currentLang = L10N[short] ? short : "en";
  try {
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("lang", short);
      // Set dir="rtl" for RTL locales
      try {
        const loc = new Intl.Locale(short || "en");
        const isRtl =
          (loc.textInfo && loc.textInfo.direction === "rtl") ||
          ["ar", "he", "fa", "ur", "ps", "sd", "ug", "ku", "dv", "yi"].includes(
            short,
          );
        document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
      } catch (_) {}
    }
  } catch (_) {}
  try {
    if (
      typeof window !== "undefined" &&
      window.__nimbiUI &&
      typeof window.__nimbiUI.renderByQuery === "function"
    ) {
      window.__nimbiUI.renderByQuery().catch(() => {});
    }
  } catch (_) {}
}
