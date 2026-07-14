/**
 * Hybrid LOKI — instant pre-built answers for ~70% of common tourism queries.
 * AI personalizes only when no template match or user asks follow-ups.
 */

import { detectIntent, detectCity } from './queryIntent';
import {
  formatTrainsContext,
  formatTransportContext,
  formatHotelsContext,
  formatRestaurantsContext,
  formatNumbeoContext,
  formatHiddenGemsContext,
  formatVisaContext,
  formatMetroContext,
} from '@/data/tourismCatalog';
import { formatCommunityIntelForLoki } from '@/data/communityIntel';

function mapsLink(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ' Egypt')}`;
}

const SOURCES_FOOTER = `

**📚 المصادر:**
• [Telegram: Hurghada Chat](https://t.me/HurghadaChat1/1) — أسعار موثقة من المجتمع
• [EgyptTrains.com](https://egypttrains.com) — حجز القطارات والأسعار
• [Numbeo Egypt](https://www.numbeo.com/cost-of-living/country_result.jsp?country=Egypt) — تكلفة المعيشة`;

function formatInstantMarkdown(intent, city, userMessage) {
  const blocks = [];
  const community = formatCommunityIntelForLoki(city, userMessage);
  if (community) blocks.push(community);

  if (intent === 'trains' || /train|قطار/i.test(userMessage)) {
    blocks.push(formatTrainsContext(userMessage));
  }
  if (['transport', 'prices', 'urgent'].includes(intent)) {
    blocks.push(formatTransportContext(city, userMessage));
  }
  if (intent === 'hotels' || /فندق|hotel/i.test(userMessage)) {
    blocks.push(formatHotelsContext(city));
  }
  if (intent === 'restaurants' || /مطعم|restaurant|أكل/i.test(userMessage)) {
    blocks.push(formatRestaurantsContext(city));
  }
  if (['prices', 'restaurants', 'general'].includes(intent)) {
    blocks.push(formatNumbeoContext(city));
  }
  if (/hidden|gem|سر|مخفي|مشهور/i.test(userMessage)) {
    blocks.push(formatHiddenGemsContext(city));
  }
  if (/visa|فيزا|تأشيرة|entry|جواز/i.test(userMessage)) {
    blocks.push(formatVisaContext());
  }
  if (/metro|مترو|subway/i.test(userMessage) || (city === 'cairo' && intent === 'transport')) {
    blocks.push(formatMetroContext());
  }

  if (!blocks.length) return null;

  const cityLabel = city ? `**${city.replace(/-/g, ' ')}**` : 'مصر';
  const header = intent === 'safety'
    ? `🛡️ **تنبيه أمان — ${cityLabel}**\n\n`
    : `✨ **LOKI — إجابة سريعة عن ${cityLabel}**\n\n`;

  return header + blocks.join('\n\n') + SOURCES_FOOTER;
}

/**
 * Returns instant preview text (shown while AI loads) or full cached-style answer.
 */
export function getHybridInstantResponse(userMessage) {
  const intent = detectIntent(userMessage);
  const city = detectCity(userMessage);
  const body = formatInstantMarkdown(intent, city, userMessage);
  if (!body) return null;

  return {
    intent,
    city,
    preview: body.split('\n').slice(0, 4).join('\n') + '\n\n_جاري تجميع التفاصيل الكاملة..._',
    fullTemplate: body,
    useTemplateOnly: false,
  };
}

/**
 * High-confidence queries that can skip AI entirely (pure data).
 */
export function canSkipAI(userMessage) {
  const t = userMessage.toLowerCase();
  const intent = detectIntent(userMessage);
  const city = detectCity(userMessage);

  if (!city) return false;
  if (intent === 'trains' && /cairo|luxor|aswan|alex|قطار|cairo|أقصر|أسوان/i.test(t)) return true;
  if (intent === 'transport' && /taxi|تاكسي|airport|مطار|fair|سعر/i.test(t)) return true;
  if (intent === 'restaurants' && /best|أفضل|مطعم/i.test(t)) return true;
  if (/visa|فيزا|تأشيرة/i.test(t)) return true;
  if (/metro|مترو/i.test(t) && /cairo|قاهرة/i.test(t)) return true;
  return false;
}

export function getTemplateOnlyResponse(userMessage) {
  const intent = detectIntent(userMessage);
  const city = detectCity(userMessage);
  return formatInstantMarkdown(intent, city, userMessage);
}
