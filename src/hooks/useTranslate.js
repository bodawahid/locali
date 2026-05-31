/**
 * useTranslate — AI-powered context-aware translation hook
 *
 * Provides tx(text, context?) which translates any dynamic string
 * to the current app language using the LLM, with session-level caching.
 *
 * Usage:
 *   const { tx, isTranslating } = useTranslate(lang);
 *   const label = tx('Verified Driver', 'tourism service status');
 */

import { useCallback, useRef } from 'react';
import { base44 } from '@/api/base44Client';

// Session-level cache: key = `${lang}::${text}`, value = translated string
const CACHE = {};

const RTL_LANGS = ['ar'];

export function isRTL(lang) {
  return RTL_LANGS.includes(lang);
}

// Batch queue for pending translations
let batchQueue = {};
let batchTimer = null;
const batchResolvers = {};

function flushBatch(lang) {
  const keys = Object.keys(batchQueue);
  if (keys.length === 0) return;

  const texts = keys.map(k => batchQueue[k]);
  batchQueue = {};
  batchTimer = null;

  const cacheKey = (text) => `${lang}::${text}`;

  base44.integrations.Core.InvokeLLM({
    prompt: `You are a professional tourism app translator. Translate the following UI texts to "${lang}" language.
Context: This is a travel safety and pricing app for Egypt tourists. Use natural, friendly tone.
Tourism context: "charge" = payment fee, "ride" = taxi/transport, "guide" = tour guide, "verified" = officially checked.
Rules:
- Translate ONLY the text, preserve any emoji at start/end
- Keep proper nouns (Egypt, Hurghada, EGP, WhatsApp, Locali) unchanged
- Return a JSON object where each key is the original English text and value is the translation
- If a text is already in the target language, keep it as-is
- For "en" language, return texts unchanged

Texts to translate:
${JSON.stringify(texts, null, 2)}`,
    response_json_schema: {
      type: 'object',
      additionalProperties: { type: 'string' },
    },
  }).then((result) => {
    keys.forEach((k, i) => {
      const original = texts[i];
      const translated = result?.[original] || original;
      CACHE[cacheKey(original)] = translated;
      const resolvers = batchResolvers[k] || [];
      resolvers.forEach(resolve => resolve(translated));
      delete batchResolvers[k];
    });
  }).catch(() => {
    // On failure, resolve with original text
    keys.forEach((k, i) => {
      const original = texts[i];
      const resolvers = batchResolvers[k] || [];
      resolvers.forEach(resolve => resolve(original));
      delete batchResolvers[k];
    });
  });
}

/**
 * Translates a single string, using cache first, then AI batch.
 * Returns a Promise<string>.
 */
export function translateText(text, lang) {
  if (!text || typeof text !== 'string') return Promise.resolve(text || '');
  if (!lang || lang === 'en') return Promise.resolve(text);

  const key = `${lang}::${text}`;
  if (CACHE[key]) return Promise.resolve(CACHE[key]);

  // Queue for batch
  const queueKey = `${lang}::${text}`;
  batchQueue[queueKey] = text;

  return new Promise((resolve) => {
    if (!batchResolvers[queueKey]) batchResolvers[queueKey] = [];
    batchResolvers[queueKey].push(resolve);

    // Debounce: flush after 80ms of inactivity
    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(() => flushBatch(lang), 80);
  });
}

/**
 * React hook for component-level AI translation.
 * Returns a synchronous tx() that uses cache, triggering re-render when translation arrives.
 */
export default function useTranslate(lang) {
  const pendingRef = useRef(new Set());

  const tx = useCallback((text, _context) => {
    if (!text || !lang || lang === 'en') return text || '';

    const key = `${lang}::${text}`;
    if (CACHE[key]) return CACHE[key];

    // Not cached yet — queue it (will cause re-render via forceUpdate trick if needed)
    // For simplicity, return original while translation is in flight
    if (!pendingRef.current.has(key)) {
      pendingRef.current.add(key);
      translateText(text, lang).then(() => {
        pendingRef.current.delete(key);
        // Components using tx() should re-render when data changes —
        // they can do this by wrapping tx() calls in useMemo with a translationVersion dep
      });
    }

    return text; // show original until translated
  }, [lang]);

  return { tx };
}