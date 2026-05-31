// @ts-nocheck
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, DollarSign, AlertTriangle, Search, Phone, Sparkles, ShieldCheck, Plus, ChevronDown, Car, Hotel, Bot, Map, Globe, Compass, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import { t } from '../lib/constants';
import { useAuth } from '../lib/AuthContext';

const NAV_GROUPS = [
  {
    id: 'explore',
    label: 'Explore Egypt',
    description: 'Destinations & hidden gems',
    icon: Compass,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    accent: '#d97706',
    items: [
      { path: '/hidden-gems-egypt', label: '🌍 30 Hidden Gems', icon: Sparkles, highlight: false },
      { path: '/el-gouna', label: 'El Gouna Guide', icon: Compass },
      { path: '/beaches', label: 'Beaches', icon: Compass },
      { path: '/horse-riding', label: 'Horse Riding', icon: Compass },
      { path: '/nightlife', label: 'Nightlife', icon: Compass },
    ],
  },
  {
    id: 'safety',
    label: 'Safety & Security',
    description: 'Stay safe & avoid scams',
    icon: ShieldCheck,
    color: 'text-red-600',
    bg: 'bg-red-50',
    accent: '#ef4444',
    items: [
      { path: '/safety-guide', label: 'Safety Guide', icon: ShieldCheck },
      { path: '/scam-map', label: 'Scam Alerts', icon: AlertTriangle },
      { path: '/women-safety', label: "Women's Safety", icon: Shield },
      { path: '/emergency', label: 'Emergency SOS', icon: Phone, highlight: true },
    ],
  },
  {
    id: 'around',
    label: 'Travel Essentials',
    description: 'Transport, SIM cards & money',
    icon: Car,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    accent: '#d97706',
    items: [
      { path: '/drivers', label: '🚗 Transport & Drivers', icon: Car },
      { path: '/price-checker', label: 'Price Checker', icon: DollarSign },
      { path: '/sim-cards', label: 'SIM Cards', icon: Globe },
      { path: '/currency-rates', label: 'Currency Rates', icon: DollarSign },
      { path: '/visa-entry', label: 'Visa & Entry', icon: Globe },
    ],
  },
  {
    id: 'do',
    label: 'Things To Do',
    description: 'Activities & bookable services',
    icon: Compass,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    accent: '#059669',
    items: [
      { path: '/services', label: 'All Services', icon: Search },
      { path: '/services?category=activities', label: 'Activities', icon: Compass },
      { path: '/services?category=restaurant', label: 'Restaurants', icon: Search },
      { path: '/boat-trips', label: 'Boat Trips', icon: Compass },
      { path: '/temple-trips', label: 'Temple Trips', icon: Compass },
    ],
  },
  {
    id: 'plan',
    label: 'Plan Your Trip',
    description: 'Hotels, planning & recommendations',
    icon: Hotel,
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    accent: '#7c3aed',
    items: [
      { path: '/trip-planner', label: 'Trip Planner', icon: Map },
      { path: '/ai-assistant', label: 'AI Assistant', icon: Bot },
      { path: '/hotels', label: 'Hotels', icon: Hotel },
      { path: '/apartments', label: 'Apartments', icon: Hotel },
      { path: '/tour-operators', label: 'Tour Operators', icon: Map },
    ],
  },
];

const NAV_LINKS = [
  { path: '/hidden-gems-egypt', label: '🌍 Hidden Gems', icon: Sparkles },
  { path: '/services', labelKey: 'services', icon: Search },
  { path: '/drivers', label: '🚗 Transport', icon: Car },
  { path: '/price-checker', labelKey: 'price_checker', icon: DollarSign },
  { path: '/scam-map', labelKey: 'scam_map', icon: AlertTriangle },
  { path: '/emergency', labelKey: 'emergency', icon: Phone },
];

function AccordionGroup({ group, location, onNavigate }) {
  const [open, setOpen] = useState(false);
  const Icon = group.icon;
  const isAnyActive = group.items.some(i => i.path === location.pathname);

  return (
    <motion.div
      layout
      className={`rounded-2xl border overflow-hidden transition-shadow duration-300 ${
        open ? 'shadow-lg shadow-black/8 border-border' : 'border-border/50'
      }`}
      style={{ scale: open ? 1.005 : 1, transition: 'box-shadow 0.3s, scale 0.2s' }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors duration-200 ${
          open ? group.bg : 'bg-white hover:bg-secondary/60'
        }`}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: open ? group.accent + '20' : '#f3f4f6' }}
        >
          <Icon className="w-4 h-4" style={{ color: open ? group.accent : '#6b7280' }} />
        </div>
        <div className="flex-1 text-left">
          <span className="block text-sm font-bold" style={{ color: open ? group.accent : '#1f2937' }}>
            {group.label}
          </span>
          {group.description && (
            <span className="block text-[10px] text-muted-foreground font-normal">{group.description}</span>
          )}
        </div>
        {isAnyActive && !open && (
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: group.accent }} />
        )}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
          <ChevronDown className="w-4 h-4" style={{ color: open ? group.accent : '#9ca3af' }} />
        </motion.div>
      </button>

      {/* Sub-items */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 space-y-1 bg-white border-t border-border/30">
              {group.items.map((item) => {
                const ItemIcon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      active
                        ? 'text-white shadow-sm'
                        : item.highlight
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                    }`}
                    style={active ? { background: group.accent } : {}}
                  >
                    <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TopBar({ lang, onLangChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const goAddService = () => { setMobileOpen(false); navigate('/add-service'); };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-xl border-b-2 border-border/60 shadow-[0_2px_12px_rgba(0,0,0,0.10)]">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            <Shield className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-foreground">Locali</span>
          <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Egypt</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ path, labelKey, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                location.pathname === path
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {label || t(labelKey, lang)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher lang={lang} onChange={onLangChange} />
          
          {/* ========================================================= */}
          {/* زاوية الأدمن الذكية: تظهر فقط لك أنت كمشرف على المنصة */}
          {/* ========================================================= */}
          {isAdmin && (
            <Link
              to="/localiadmin"
              className="hidden md:flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
              Control Panel
            </Link>
          )}
          
          <button
            onClick={goAddService}
            className="hidden md:flex items-center gap-1.5 text-white px-3 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            style={{ background: '#2E7D8A' }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Service
          </button>
          
          <Link
            to="/emergency"
            className="hidden md:flex items-center gap-1.5 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors btn-3d"
          >
            <Phone className="w-3.5 h-3.5" />
            SOS
          </Link>
          
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden border-t border-border/40 bg-background"
          >
            <div className="px-3 py-3 space-y-2">
              {/* الأدمن على الموبايل يدخل اللوحة علطول من هنا */}
              {isAdmin && (
                <Link
                  to="/localiadmin"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-gray-900 shadow-md"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4 text-teal-400 shrink-0" />
                  <div>Go to Control Panel</div>
                </Link>
              )}

              {/* Add Service CTA */}
              <button
                onClick={goAddService}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, #2E7D8A, #1a5f6a)' }}
              >
                <Plus className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div>Add Your Service Free</div>
                  <div className="text-[10px] font-normal opacity-80">Join 200+ verified Egyptian service providers</div>
                </div>
              </button>

              {/* Accordion Groups */}
              {NAV_GROUPS.map((group) => (
                <AccordionGroup
                  key={group.id}
                  group={group}
                  location={location}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}