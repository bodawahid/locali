import { useState, useCallback } from 'react';

const SUPPORTED = ['en', 'ru', 'de', 'fr', 'it', 'es', 'zh', 'ar'];

function detectBrowserLang() {
  const saved = localStorage.getItem('locali_lang');
  if (saved && SUPPORTED.includes(saved)) return saved;
  const nav = (navigator.language || navigator.userLanguage || 'en').split('-')[0].toLowerCase();
  // Map browser codes to our codes
  const map = { zh: 'zh', 'zh-cn': 'zh', 'zh-hans': 'zh', ru: 'ru', de: 'de', fr: 'fr', it: 'it', es: 'es', ar: 'ar' };
  return map[nav] || 'en';
}

export default function useLanguage() {
  const [lang, setLang] = useState(() => detectBrowserLang());

  const changeLang = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('locali_lang', newLang);
  }, []);

  return { lang, changeLang };
}