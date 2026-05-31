import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Bot, Sparkles, DollarSign, ShieldCheck, ChevronRight,
  Map, Users, Eye, Star, ArrowRight, Search
} from 'lucide-react';
import EditableImage from '../components/EditableImage';
import CityCard from '../components/HomeCityCard';

// ─── Section Data ─────────────────────────────────────────────────────────────
const JOURNEY_STEPS = [
  {
    id: 'before',
    emoji: '✈️',
    number: '01',
    title: 'Before You Come',
    subtitle: 'Everything to prepare before arriving in Egypt',
    color: 'from-indigo-500 to-blue-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    textAccent: 'text-indigo-600',
    links: [
      { label: 'Visa & Entry Requirements', to: '/visa-entry', icon: '🛂' },
      { label: 'What to Pack & Bring', to: '/airport-items', icon: '🎒' },
      { label: 'Women\'s Safety Guide', to: '/women-safety', icon: '👩' },
      { label: 'Cultural Tips & Etiquette', to: '/smart-guide', icon: '🕌' },
    ],
    cta: 'Start Planning',
    ctaTo: '/before-you-land',
  },
  {
    id: 'first24',
    emoji: '🌅',
    number: '02',
    title: 'First 24 Hours',
    subtitle: 'Step-by-step guide from airport to hotel',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    textAccent: 'text-orange-600',
    links: [
      { label: 'Airport & Immigration Guide', to: '/airport-items', icon: '🛬' },
      { label: 'Get a SIM Card', to: '/sim-cards', icon: '📱' },
      { label: 'Transport from Airport', to: '/city/hurghada/transport', icon: '🚗' },
      { label: 'First-Day Mistakes to Avoid', to: '/scam-map', icon: '⚠️' },
    ],
    cta: 'View Airport Guide',
    ctaTo: '/airport-items',
  },
  {
    id: 'explore',
    emoji: '🏛️',
    number: '03',
    title: 'Explore Egypt',
    subtitle: 'Best experiences, day plans, and hidden gems',
    color: 'from-teal-500 to-emerald-500',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    textAccent: 'text-teal-600',
    links: [
      { label: 'Boat Trips & Red Sea', to: '/boat-trips', icon: '⛵' },
      { label: 'Horse Riding Experiences', to: '/horse-riding', icon: '🐴' },
      { label: 'Hidden Gems of Egypt', to: '/hidden-gems', icon: '💎' },
      { label: 'Best Restaurants by City', to: '/restaurants', icon: '🍽️' },
    ],
    cta: 'Explore Experiences',
    ctaTo: '/services?category=activities',
  },
  {
    id: 'scams',
    emoji: '🛡️',
    number: '04',
    title: "Don't Get Scammed",
    subtitle: 'Real prices, red flags, and negotiation tips',
    color: 'from-red-500 to-rose-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
    textAccent: 'text-red-600',
    links: [
      { label: 'Real Price Ranges', to: '/price-checker', icon: '💰' },
      { label: 'Common Scams Map', to: '/scam-map', icon: '🗺️' },
      { label: 'Negotiation Tips', to: '/smart-guide', icon: '🤝' },
      { label: 'Community Price Reports', to: '/price-insights', icon: '📊' },
    ],
    cta: 'Avoid Scams Now',
    ctaTo: '/scam-map',
  },
];

const SMART_TOOLS = [
  { icon: DollarSign, label: 'Price Checker', desc: 'Know real prices before you pay', to: '/price-checker', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Bot, label: 'AI Guide', desc: 'Ask anything about Egypt', to: '/ai-assistant', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Users, label: 'Ask a Local', desc: 'By nationality & language', to: '/ask-a-local', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: ShieldCheck, label: 'Verified Services', desc: 'Trusted local businesses', to: '/services', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Eye, label: 'Live Situation', desc: 'Weather, sea & travel status', to: '/live-situation', color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: Map, label: 'Scam Map', desc: 'Real-time scam reports', to: '/scam-map', color: 'text-red-600', bg: 'bg-red-50' },
];

const CITIES = [
  { id: 'hurghada', label: 'Hurghada', emoji: '🤿', img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80' },
  { id: 'sharm-el-sheikh', label: 'Sharm', emoji: '🐠', img: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&q=80' },
  { id: 'luxor', label: 'Luxor', emoji: '🏛️', img: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=600&q=80' },
  { id: 'aswan', label: 'Aswan', emoji: '🛶', img: 'https://images.unsplash.com/photo-1553342385-111fd9d0c46a?w=600&q=80' },
  { id: 'el-gouna', label: 'El Gouna', emoji: '🌊', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80' },
];

export default function Home() {
  const { openAIChat, lang = 'en' } = useOutletContext();
  const [search, setSearch] = useState('');

  const { data: liveData } = useQuery({
    queryKey: ['liveInfo'],
    queryFn: async () => {
      const [rates, situation] = await Promise.all([
        base44.entities.CurrencyRate.list('-created_date', 1),
        base44.entities.LiveSituation.filter({ city: 'global' }, '-created_date', 1),
      ]);
      return {
        usd: rates?.[0]?.usd,
        status: situation?.[0]?.status || 'green',
        statusText: situation?.[0]?.recommendation || 'Normal',
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const statusDot = liveData?.status === 'red' ? 'bg-red-500' : liveData?.status === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500';

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/services?q=${encodeURIComponent(search)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <EditableImage
            src="https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80"
            alt="Egypt"
            className="w-full h-full object-cover opacity-70"
            sectionKey="home_hero"
          />
        </div>
        <div className="relative px-4 pt-10 pb-10 max-w-xl mx-auto text-center">
          {/* Live status pill */}
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full px-3 py-1 text-xs font-bold mb-4">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusDot}`} />
            Egypt is open · Safe to travel
          </div>

          <h1 className="text-3xl font-black text-white leading-tight mb-2">
            Your Smart Local<br />
            <span className="text-amber-300">Guide to Egypt</span>
          </h1>
          <p className="text-teal-100 text-sm mb-6 leading-relaxed">
            Avoid scams. Know real prices. Discover the best experiences. Like a local.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search services, places, tips..."
                className="w-full pl-10 pr-4 py-3.5 bg-white rounded-2xl text-sm text-gray-800 font-medium focus:outline-none shadow-md"
              />
            </div>
            <button type="submit" className="bg-orange-500 text-white px-5 py-3.5 rounded-2xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-md">
              Go
            </button>
          </form>

          {/* Quick stats */}
          <div className="flex justify-center gap-6 mt-5">
            <div className="text-center">
              <p className="text-white font-black text-lg">2K+</p>
              <p className="text-teal-200 text-[10px]">Travelers</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg">500+</p>
              <p className="text-teal-200 text-[10px]">Scams Avoided</p>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg">5 Cities</p>
              <p className="text-teal-200 text-[10px]">Covered</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIVE TICKER ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5">
        <div className="max-w-xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-700">
              💵 1 USD = <strong className="text-teal-600">{liveData?.usd ? `${liveData.usd} EGP` : '—'}</strong>
            </span>
            <span className="text-gray-300">|</span>
            <Link to="/currency-rates" className="text-teal-600 font-bold hover:underline">All Rates →</Link>
          </div>
          <button onClick={openAIChat} className="flex items-center gap-1 bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-bold border border-teal-100">
            <Sparkles className="w-3 h-3" /> AI Guide
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">

        {/* ── JOURNEY SECTIONS ─────────────────────────────────────────── */}
        <div className="mb-2">
          <h2 className="text-lg font-black text-gray-900 mb-1">Your Journey, Step by Step</h2>
          <p className="text-xs text-gray-500 mb-5">A local friend guiding you through Egypt — from planning to exploring.</p>

          <div className="space-y-4">
            {JOURNEY_STEPS.map(step => (
              <div key={step.id} className={`${step.bg} border ${step.border} rounded-2xl overflow-hidden`}>
                {/* Header */}
                <div className={`bg-gradient-to-r ${step.color} px-5 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{step.emoji}</span>
                      <div>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Step {step.number}</p>
                        <h3 className="text-white font-black text-base leading-tight">{step.title}</h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/80 text-xs mt-1 ml-14">{step.subtitle}</p>
                </div>

                {/* Links */}
                <div className="px-4 py-3 space-y-1">
                  {step.links.map(link => (
                    <Link key={link.to} to={link.to}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/70 hover:bg-white transition-colors">
                      <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        <span className="text-base">{link.icon}</span>
                        {link.label}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${step.textAccent}`} />
                    </Link>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-4 pb-4">
                  <Link to={step.ctaTo}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white bg-gradient-to-r ${step.color} shadow-sm`}>
                    {step.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EXPLORE BY CITY ──────────────────────────────────────────── */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-gray-900">Explore by City</h2>
            <Link to="/services" className="text-xs font-bold text-teal-600">See all →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {CITIES.map(city => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </div>

        {/* ── SMART TOOLS ──────────────────────────────────────────────── */}
        <div className="mt-6 mb-6">
          <div className="bg-gray-900 rounded-2xl px-5 py-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-white font-black text-base">Smart Tools for Your Trip</h2>
            </div>
            <p className="text-gray-400 text-xs">Advanced tools to navigate Egypt like a pro.</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SMART_TOOLS.map(tool => {
              const Icon = tool.icon;
              return (
                <Link key={tool.to} to={tool.to}
                  className="bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-9 h-9 ${tool.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={`w-4 h-4 ${tool.color}`} />
                  </div>
                  <p className={`text-xs font-black ${tool.color} mb-0.5`}>{tool.label}</p>
                  <p className="text-[9px] text-gray-400 leading-tight">{tool.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── ASK AI BANNER ────────────────────────────────────────────── */}
        <button onClick={openAIChat}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-5 text-left flex items-center gap-4 mb-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-base leading-tight">Ask Me Anything</p>
            <p className="text-teal-100 text-xs mt-0.5">Prices, scams, transport, food, places…</p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-white text-[10px] font-bold">AI</span>
          </div>
        </button>

        {/* ── WELLNESS BANNER ──────────────────────────────────────────── */}
        <Link to="/wellness"
          className="block bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌿</span>
            <div className="flex-1">
              <p className="font-black text-teal-700 text-sm">Wellness & Natural Healing in Egypt</p>
              <p className="text-xs text-teal-500 mt-0.5">7 experiences · Safaga, Siwa, White Desert, Red Sea & more</p>
            </div>
            <ChevronRight className="w-5 h-5 text-teal-400 shrink-0" />
          </div>
        </Link>

        {/* ── QUICK SCAM ALERT ─────────────────────────────────────────── */}
        <Link to="/scam-map"
          className="block bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚨</span>
            <div className="flex-1">
              <p className="font-black text-red-700 text-sm">Check Real Prices Before You Pay</p>
              <p className="text-xs text-red-500 mt-0.5">500+ tourists saved from overpaying · Updated daily</p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400 shrink-0" />
          </div>
        </Link>

        {/* ── TRUST STRIP ──────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-6">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '👥', text: '2,000+ travelers from 40+ countries' },
              { icon: '📋', text: 'Real tourist reports only' },
              { icon: '✅', text: 'Verified local services' },
              { icon: '🚨', text: '500+ scams reported & avoided' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <p className="text-[10px] font-bold text-gray-500 leading-tight">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}