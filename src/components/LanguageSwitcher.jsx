import { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '../lib/constants';

const FLAG_MAP = {
  en: '🇬🇧', ru: '🇷🇺', de: '🇩🇪', fr: '🇫🇷',
  it: '🇮🇹', es: '🇪🇸', zh: '🇨🇳', ar: '🇸🇦',
};

export default function LanguageSwitcher({ lang, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code) => { onChange(code); setOpen(false); };

  return (
    <div ref={ref} className="relative">
      {/* Trigger pill */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 border border-border/60 hover:bg-secondary transition-all duration-200 shadow-sm"
      >
        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-bold text-foreground">{FLAG_MAP[current.code]} {current.label}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 top-full mt-2 w-44 z-50 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <div className="p-1.5 space-y-0.5">
              {LANGUAGES.map((l) => (
                <motion.button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    lang === l.code
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-foreground hover:bg-secondary/80 font-medium'
                  }`}
                >
                  <span className="text-base leading-none">{FLAG_MAP[l.code]}</span>
                  <span className="flex-1 text-left">{l.full}</span>
                  {lang === l.code && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}