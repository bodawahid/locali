import { useState } from 'react';
import { Bot, Sparkles, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../lib/constants';
import AddServiceModal from './AddServiceModal';

export default function HeroSection({ lang, onOpenChat, titleOverride, subtitleOverride, descOverride, imageOverride }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <img
        src={imageOverride || "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80"}
        alt="Egypt pyramids desert landscape"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(58,42,30,0.75) 0%, rgba(58,42,30,0.5) 50%, rgba(245,233,218,1) 100%)' }} />

      <div className="relative px-4 pt-12 pb-20 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white text-[11px] font-bold tracking-wide">Egypt's #1 Tourist Safety Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.95] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {titleOverride || t('hero_title', lang)}
            <br />
            <span style={{ color: '#D8B58A' }}>{subtitleOverride || t('hero_subtitle', lang)}</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/75 max-w-md leading-relaxed">
            {descOverride || t('hero_desc', lang)}
          </p>
        </motion.div>

        <motion.div className="mt-8 space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {/* AI search bar */}
          <div className="max-w-lg">
            <button
              onClick={onOpenChat}
              className="w-full flex items-center gap-4 px-5 py-4 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2E7D8A' }}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: '#3A2A1E' }}>Ask your smart Egypt guide 🇪🇬</p>
                <p className="text-xs text-gray-400 mt-0.5">Restaurants, rides, prices, safety…</p>
              </div>
              <div className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: '#F5E9DA' }}>
                <Sparkles className="w-3 h-3" style={{ color: '#2E7D8A' }} />
                <span className="text-[10px] font-bold" style={{ color: '#2E7D8A' }}>AI</span>
              </div>
            </button>
          </div>

          {/* Add service CTA */}
          <div className="max-w-lg">
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm border-2 border-white/40 text-white hover:bg-white/15 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Your Service Free — Reach Thousands of Tourists
            </button>
          </div>
        </motion.div>
      </div>

      <AddServiceModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}