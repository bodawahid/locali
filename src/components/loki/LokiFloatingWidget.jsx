import { useState, useEffect } from 'react';
import { Shield, X, ChevronDown, Zap, Train, Utensils, Hotel, MessageCircle } from 'lucide-react';
import LokiChat from './LokiChat';
import { preloadLokiContext } from '@/lib/loki/contextCache';

export default function LokiFloatingWidget({ externalOpen, onExternalOpenHandled }) {
  const [open, setOpen] = useState(false);

  useEffect(() => { preloadLokiContext(null); }, []);

  useEffect(() => {
    if (externalOpen) { setOpen(true); onExternalOpenHandled?.(); }
  }, [externalOpen, onExternalOpenHandled]);

  useEffect(() => {
    if (open && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="locali-fab group fixed z-[9999] flex items-center gap-0 md:gap-2.5 bottom-[5.25rem] right-3 md:bottom-6 md:right-5 pl-3.5 pr-3.5 md:pr-5 py-3 rounded-full md:rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 text-white font-bold shadow-[0_8px_32px_rgba(13,148,136,0.45)] hover:scale-110 hover:shadow-[0_12px_48px_rgba(13,148,136,0.6)] active:scale-[0.95] transition-all duration-300"
          aria-label="Open LOKI AI Chat"
        >
          <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          <span className="hidden md:inline text-sm">LOKI AI</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        </button>
      )}

      {open && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9997] md:hidden" 
            onClick={() => setOpen(false)} 
            aria-hidden 
          />
          <div
            className="fixed z-[9998] flex flex-col bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 inset-0 md:inset-auto md:bottom-6 md:right-5 md:w-[420px] md:max-h-[min(720px,calc(100dvh-48px))] md:rounded-3xl md:shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:border md:border-slate-200/80"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <div className="shrink-0 px-4 py-3.5 bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-900 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center animate-pulse">
                    <Shield className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <p className="font-bold text-base">LOKI</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-teal-200/80 flex items-center gap-0.5"><Train className="w-2.5 h-2.5" /> Trains</span>
                      <span className="text-[10px] text-teal-200/80 flex items-center gap-0.5"><Hotel className="w-2.5 h-2.5" /> Hotels</span>
                      <span className="text-[10px] text-teal-200/80 flex items-center gap-0.5"><Utensils className="w-2.5 h-2.5" /> Food</span>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setOpen(false)} 
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Close LOKI"
                >
                  <X className="w-5 h-5 md:hidden" />
                  <ChevronDown className="w-5 h-5 hidden md:block" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-white/70">847+ مسافر · Telegram · Facebook · EgyptTrains · Numbeo</span>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <LokiChat compact />
            </div>
          </div>
        </>
      )}
    </>
  );
}
