import * as _markedModule from "marked";
import { getDOMPurify } from "../utils/domPurify.js";
import { parseFrontmatter } from "../utils/frontmatter.js";
import {
  importUrlWithCache,
  clearImportCache,
  setImportNegativeCacheTTL,
} from "../utils/importCache.js";
import { decodeInbound, announceCapabilities } from "performance-helpers/powerMessageCodec";
import { slugify } from "../utils/slugify.js";
import { decodeHtmlEntities } from "../utils/decodeHtmlEntities.js";
import { splitIntoSections } from "../utils/splitIntoSections.js";
import hljsCore from "highlight.js/lib/core";

// Announce native structured-clone support so PowerPool can use native
// envelopes when available. Guarded for test environments where `postMessage`
// may not be the worker-style single-argument form yet.
try {
  if (typeof postMessage === "function") {
    postMessage(announceCapabilities({ native: true }));
  }
} catch (_) {}

const marked =
  (_markedModule && (_markedModule.marked || _markedModule)) || undefined;
const FENCE_RE = /```\s*([a-zA-Z0-9_\-+]+)?/g;
const FALLBACK_KNOWN = new Set([
  "bash",
  "sh",
  "zsh",
  "javascript",
  "js",
  "python",
  "py",
  "php",
  "java",
  "c",
  "cpp",
  "rust",
  "go",
  "ruby",
  "perl",
  "r",
  "scala",
  "swift",
  "kotlin",
  "cs",
  "csharp",
  "html",
  "css",
  "json",
  "xml",
  "yaml",
  "yml",
  "dockerfile",
  "docker",
]);
const HEADING_CLASSES = {
  1: "is-size-3-mobile is-size-2-tablet is-size-1-desktop",
  2: "is-size-4-mobile is-size-3-tablet is-size-2-desktop",
  3: "is-size-5-mobile is-size-4-tablet is-size-3-desktop",
  4: "is-size-6-mobile is-size-5-tablet is-size-4-desktop",
  5: "is-size-6-mobile is-size-6-tablet is-size-5-desktop",
  6: "is-size-6-mobile is-size-6-tablet is-size-6-desktop",
};

let hljs = null;



export function slugifyHeading(s) {
  try {
    return slugify(s) || "heading";
  } catch (_) {
    return "heading";
  }
}

export function clearRendererImportCache() {
  clearImportCache();
  hljs = null;
}

export function setRendererImportNegativeCacheTTL(ms) {
  setImportNegativeCacheTTL(ms);
}

export async function importModuleWithCache(url) {
  return await importUrlWithCache(url);
}

export async function ensureHljs() {
  if (hljs) return hljs;
  try {
    hljs = hljsCore || null;
  } catch (_) {
    // highlight.js core unavailable: highlighting stays disabled.
    hljs = null;
  }
  return hljs;
}

function headingWeight(level) {
  return level <= 2
    ? "has-text-weight-bold"
    : level <= 4
      ? "has-text-weight-semibold"
      : "has-text-weight-normal";
}

function postProcessHtml(html, idCounts = new Map()) {
  const heads = [];
  let out = String(html ?? "");
  out = out.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (full, lvl, attrs, inner) => {
      const level = Number(lvl);
      let text = inner.replace(/<[^>]+>/g, "").trim();
      try {
        text = decodeHtmlEntities(text);
      } catch (_) {}
      let existingId = null;
      const idMatch = (attrs || "").match(/\sid="([^"]+)"/);
      if (idMatch) existingId = idMatch[1];
      const base = existingId || slugifyHeading(text) || "heading";
      const prev = idCounts.get(base) || 0;
      const idx = prev + 1;
      idCounts.set(base, idx);
      const candidate = idx === 1 ? base : base + "-" + idx;
      heads.push({ level, text, id: candidate });
      const classes =
        `${HEADING_CLASSES[level]} ${headingWeight(level)}`.trim();
      const cleanAttrs = (attrs || "").replace(/\s*(id|class)="[^"]*"/g, "");
      const newAttrs = (
        cleanAttrs + ` id="${candidate}" class="${classes}"`
      ).trim();
      return `<h${level} ${newAttrs}>${inner}</h${level}>`;
    },
  );
  out = out.replace(/<img([^>]*)>/g, (full, attrs) => {
    if (/\bloading=/.test(attrs)) return `<img${attrs}>`;
    if (/\bdata-want-lazy=/.test(attrs)) return `<img${attrs}>`;
    return `<img${attrs} loading="lazy">`;
  });
  return { html: out, toc: heads };
}

async function registerLanguageMessage(name, url) {
  try {
    const availableHljs = await ensureHljs();
    if (!availableHljs)
      return { type: "register-error", name, error: "hljs unavailable" };
    const mod = await importModuleWithCache(url);
    const lang = mod ? mod.default || mod : null;
    if (!lang)
      return {
        type: "register-error",
        name,
        error: "failed to import language module",
      };
    hljs.registerLanguage(name, lang);
    return { type: "registered", name };
  } catch (e) {
    return { type: "register-error", name, error: String(e) };
  }
}

function detectLanguagesMessage(id, mdText, supported) {
  const res = new Set();
  const re = new RegExp(FENCE_RE.source, FENCE_RE.flags);
  let match;
  while ((match = re.exec(mdText || ""))) {
    if (!match[1]) continue;
    const name = String(match[1]).toLowerCase();
    if (!name) continue;
    if (
      name.length >= 5 &&
      name.length <= 30 &&
      /^[a-z][a-z0-9_\-+]*$/.test(name)
    )
      res.add(name);
    if (FALLBACK_KNOWN.has(name)) res.add(name);
    if (supported?.length) {
      try {
        if (supported.indexOf(name) !== -1) res.add(name);
      } catch (_) {}
    }
  }
  return { id, result: Array.from(res) };
}

async function renderMarkdownResult(md, idCounts = new Map()) {
  const { content, data } = parseFrontmatter(md || "");
  await ensureHljs().catch(() => {});
  const parsed = postProcessHtml(getDOMPurify()(marked.parse(content)), idCounts);
  return { html: parsed.html, meta: data || {}, toc: parsed.toc };
}

async function streamMarkdownResult(msg, onChunk) {
  const id = msg.id;
  const chunkSize = Number(msg.chunkSize) || 64 * 1024;
  const { content, data } = parseFrontmatter(msg.md || "");
  await ensureHljs().catch(() => {});
  const sections = splitIntoSections(content, chunkSize);
  const idCounts = new Map();
  for (let i = 0; i < sections.length; i++) {
    const rendered = postProcessHtml(getDOMPurify()(marked.parse(sections[i])), idCounts);
    onChunk({
      id,
      type: "chunk",
      html: rendered.html,
      toc: rendered.toc,
      index: i,
      isLast: i === sections.length - 1,
    });
  }
  const done = { id, type: "done", meta: data || {} };
  onChunk(done);
  return done;
}

function sendWorkerMessage(payload, transfer) {
  if (typeof postMessage !== "function") return;
  if (transfer?.length) postMessage(payload, transfer);
  else postMessage(payload);
}

export function attachRendererWorker(target = globalThis) {
  const handler = async (ev) => {
    const decoded = decodeInbound(ev.data);
    const msg = decoded.value;
    const correlationId = decoded.correlationId ?? msg.correlationId;
    const reply = (result) => {
      if (correlationId != null) {
        sendWorkerMessage({ correlationId, response: result });
      } else {
        sendWorkerMessage({ id: msg.id, result });
      }
    };
    const replyErr = (error) => {
      if (correlationId != null) {
        sendWorkerMessage({ correlationId, response: { error: String(error) } });
      } else {
        sendWorkerMessage({ id: msg.id, error: String(error) });
      }
    };
    try {
      if (msg?.type === "register") {
        const result = await registerLanguageMessage(msg?.name, msg?.url);
        if (correlationId != null) reply(result);
        else sendWorkerMessage(result);
        return;
      }
      if (msg?.type === "detect") {
        sendWorkerMessage(
          detectLanguagesMessage(msg?.id, msg?.md || "", msg?.supported || []),
        );
        return;
      }
      if (msg?.type === "stream") {
        await streamMarkdownResult(msg, (payload) =>
          sendWorkerMessage(payload),
        );
        return;
      }
      const result = await renderMarkdownResult(msg?.md || "", new Map());
      reply(result);
    } catch (e) {
      replyErr(e);
    }
  };
  if (target) target.onmessage = handler;
  return handler;
}

export async function handleWorkerMessage(msg) {
  try {
    if (msg?.type === "register")
      return await registerLanguageMessage(msg?.name, msg?.url);
    if (msg?.type === "detect")
      return detectLanguagesMessage(
        msg?.id || null,
        msg?.md || "",
        msg?.supported || [],
      );
    const result = await renderMarkdownResult(msg?.md || "", new Map());
    return { id: msg?.id, result };
  } catch (e) {
    return { id: msg?.id, error: String(e) };
  }
}

export async function handleWorkerMessageStream(msg, onChunk) {
  try {
    if (!msg || msg.type !== "stream") {
      const out = await handleWorkerMessage(msg);
      if (typeof onChunk === "function") onChunk(out);
      return out;
    }
    return await streamMarkdownResult(msg, (payload) => {
      if (typeof onChunk === "function") onChunk(payload);
    });
  } catch (e) {
    const err = { id: msg?.id, error: String(e) };
    if (typeof onChunk === "function") onChunk(err);
    return err;
  }
}

if (marked && typeof marked.setOptions === "function") {
  marked.setOptions({
    gfm: true,
    headerIds: true,
    mangle: false,
    highlighted: (code, lang) => {
      try {
        if (
          hljs &&
          lang &&
          typeof hljs.getLanguage === "function" &&
          hljs.getLanguage(lang)
        )
          return hljs.highlight(code, { language: lang }).value;
        if (
          hljs &&
          typeof hljs.getLanguage === "function" &&
          hljs.getLanguage("plaintext")
        )
          return hljs.highlight(code, { language: "plaintext" }).value;
        return code;
      } catch (_) {
        return code;
      }
    },
  });
}

// Retained under the historical name for existing consumers/tests.
export { decodeHtmlEntities as decodeHtmlEntitiesLocal };
