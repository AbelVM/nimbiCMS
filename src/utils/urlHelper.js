/**
 * Utilities for converting between the canonical `?page=slug` URL form and
 * the cosmetic hash form `#/slug#anchor?params` used for friendly links.
 *
 * The helpers are intentionally conservative: they only parse the supported
 * schemas and return a small normalized `Route` object so callers can make
 * deterministic decisions about navigation and fetch logic.
 *
 * @module utils/urlHelper
 */

/**
 * Route descriptor returned by {@link parseHrefToRoute}.
 * @typedef {Object} Route
 * @property {'canonical'|'cosmetic'|'path'|'unknown'} type - route classification
 * @property {string|null} page - page token (slug or path) when available
 * @property {string|null} anchor - anchor fragment (without leading '#') when present
 * @property {string} params - trailing query params (without leading '?') when present
 */

/**
 * Encode each path segment with `encodeURIComponent` while preserving
 * slashes. Used to safely build cosmetic hash paths.
 * @private
 * @param {string} p - raw path
 * @returns {string}
 */
function encodePathSegments(p) {
  try {
    return String(p ?? "")
      .split("/")
      .map((s) => encodeURIComponent(s))
      .join("/");
  } catch (e) {
    return String(p ?? "");
  }
}

/**
 * Build a cosmetic (visible) URL of the form `#/slug[#anchor][?params]`.
 * `page` may be a slug or a relative path. `baseSearch` may be a query
 * string (including leading `?`) or omitted (defaults to current location.search).
 *
 * @param {string} page - slug or relative path to include in the cosmetic hash
 * @param {?string} [anchor=null] - optional anchor (without `#`)
 * @param {?string} [baseSearch] - optional query string (including leading `?`)
 * @returns {string} cosmetic URL string
 */
export function buildCosmeticUrl(page, anchor = null, baseSearch = undefined) {
  const seg = encodePathSegments(String(page ?? ""));
  let out = "#/" + seg;
  if (anchor) out += "#" + encodeURIComponent(String(anchor));
  try {
    let params = "";
    if (typeof baseSearch === "string") {
      params = baseSearch;
    } else {
      if (typeof location !== "undefined" && location?.search) {
        params = location.search;
      } else if (typeof location !== "undefined" && location?.hash) {
        try {
          const parsed = parseHrefToRoute(location.href);
          if (parsed?.params) params = parsed.params;
        } catch (e) {
          // ignore
        }
      }
    }
    if (params) {
      const qs =
        typeof params === "string" && params.startsWith("?")
          ? params.slice(1)
          : params;
      try {
        const sp = new URLSearchParams(qs);
        sp.delete("page");
        const s = sp.toString();
        if (s) out += "?" + s;
      } catch (e) {
        const raw = String(qs ?? "").replace(/^page=[^&]*&?/, "");
        if (raw) out += "?" + raw;
      }
    }
  } catch (e) {
    /* ignore */
  }
  return out;
}

/**
 * Parse a given href string (relative or absolute) and return a normalized
 * {@link Route} describing whether it's `canonical` (?page=...), `cosmetic`
 * (hash route like `#/slug`), or a file/path.
 *
 * @param {string} href - href to parse (relative or absolute)
 * @returns {Route}
 */
export function parseHrefToRoute(href) {
  try {
    const u = new URL(
      href,
      typeof location !== "undefined" ? location.href : "http://localhost/",
    );
    const pageParam = u.searchParams.get("page");
    if (pageParam) {
      let anchor = null;
      let tailParams = "";
      if (u.hash) {
        const h = u.hash.replace(/^#/, "");
        if (h.includes("&")) {
          const parts = h.split("&");
          anchor = parts.shift() || null;
          tailParams = parts.join("&");
        } else {
          anchor = h || null;
        }
      }
      const sp = new URLSearchParams(u.search);
      sp.delete("page");
      const spStr = sp.toString();
      const params = [spStr, tailParams].filter(Boolean).join("&");
      return {
        type: "canonical",
        page: decodeURIComponent(pageParam),
        anchor,
        params,
      };
    }

    const frag = u.hash ? decodeURIComponent(u.hash.replace(/^#/, "")) : "";
    if (frag && frag.startsWith("/")) {
      let preQuery = frag;
      let params = "";
      if (preQuery.indexOf("?") !== -1) {
        const parts = preQuery.split("?");
        preQuery = parts.shift() || "";
        params = parts.join("?") || "";
      }
      let slugPart = preQuery;
      let anchor = null;
      if (slugPart.indexOf("#") !== -1) {
        const parts = slugPart.split("#");
        slugPart = parts.shift() || "";
        anchor = parts.join("#") || null;
      }
      const slug = slugPart.replace(/^\/+/, "") || null;
      return { type: "cosmetic", page: slug, anchor, params };
    }

    return {
      type: "path",
      page: (u.pathname || "").replace(/^\//, "") || null,
      anchor: u.hash ? u.hash.replace(/^#/, "") : null,
      params: u.search ? u.search.replace(/^\?/, "") : "",
    };
  } catch (e) {
    return { type: "unknown", page: href, anchor: null, params: "" };
  }
}

/**
 * Convert a cosmetic or canonical href into the canonical `?page=` form.
 * Returns the canonical href string (e.g. `?page=slug#anchor`).
 *
 * @param {string} href - href to convert
 * @returns {string} canonical href string
 */
export function toCanonicalHref(href) {
  try {
    const r = parseHrefToRoute(href);
    if (r && r.type === "canonical") {
      let out = "?page=" + encodeURIComponent(r.page || "");
      if (r.params) out += (out.includes("?") ? "&" : "?") + r.params;
      if (r.anchor) out += "#" + encodeURIComponent(r.anchor);
      return out;
    }
    if (r && r.page) {
      let out = "?page=" + encodeURIComponent(r.page);
      if (r.params) out += (out.includes("?") ? "&" : "?") + r.params;
      if (r.anchor) out += "#" + encodeURIComponent(r.anchor);
      return out;
    }
  } catch (e) {}
  return String(href ?? "");
}
