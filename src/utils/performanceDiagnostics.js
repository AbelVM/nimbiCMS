import { debugInfo } from "./debug.js";

const MAX_ENTRIES = 50;

function summarize(entries) {
  const durations = entries
    .map((entry) => entry.duration)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const percentile = (ratio) =>
    durations.length ? durations[Math.min(durations.length - 1, Math.floor((durations.length - 1) * ratio))] : 0;
  return {
    count: durations.length,
    p50: percentile(0.5),
    p75: percentile(0.75),
    p95: percentile(0.95),
    max: durations.at(-1) || 0,
    interactionCount: entries.filter((entry) => entry.interactionId > 0).length,
  };
}

export function startPerformanceDiagnostics(signal, options = {}) {
  const Observer = globalThis.PerformanceObserver;
  if (typeof Observer === "undefined") return () => {};
  const requestedRate = Number(options?.sampleRate);
  const sampleRate = Number.isFinite(requestedRate)
    ? Math.min(1, Math.max(0, requestedRate))
    : 1;
  const entries = [];
  const observers = [];
  const record = (entry) => {
    if (sampleRate < 1 && Math.random() >= sampleRate) return;
    const heapUsedBytes = Number(globalThis.performance?.memory?.usedJSHeapSize);
    entries.push({
      name: entry.name,
      startTime: Number(entry.startTime) || 0,
      duration: Number(entry.duration) || 0,
      ...(Number.isFinite(heapUsedBytes) ? { heapUsedBytes } : {}),
      interactionId: Number(entry.interactionId) || 0,
      processingStart: Number(entry.processingStart) || 0,
      processingEnd: Number(entry.processingEnd) || 0,
    });
    if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);
    try {
      if (typeof window !== "undefined") {
        window.__nimbiPerformanceDiagnosticsSummary = summarize(entries);
      }
    } catch (_) {}
    try {
      debugInfo("[nimbi] performance entry", entries[entries.length - 1]);
    } catch (_) {}
  };
  for (const type of ["long-animation-frame", "longtask", "event"]) {
    try {
      if (!Observer.supportedEntryTypes?.includes(type)) continue;
      const observer = new Observer((list) => {
        list.getEntries().forEach(record);
      });
      observer.observe({
        type,
        buffered: true,
        ...(type === "event" ? { durationThreshold: 16 } : {}),
      });
      observers.push(observer);
    } catch (_) {}
  }
  try {
    if (typeof window !== "undefined") {
      window.__nimbiPerformanceDiagnostics = entries;
      window.__nimbiPerformanceDiagnosticsSummary = summarize(entries);
    }
  } catch (_) {}
  const dispose = () => {
    observers.forEach((observer) => observer.disconnect());
    observers.length = 0;
    entries.length = 0;
    try {
      if (typeof window !== "undefined") window.__nimbiPerformanceDiagnostics = null;
      if (typeof window !== "undefined") window.__nimbiPerformanceDiagnosticsSummary = null;
    } catch (_) {}
  };
  try {
    signal?.addEventListener("abort", dispose, { once: true });
  } catch (_) {}
  return dispose;
}
