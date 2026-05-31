import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSEO } from '../lib/seo';
import { Link } from 'react-router-dom';
import { Radio, TrendingUp, CloudSun, Car, ShieldCheck, Calendar, DollarSign, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

const CITY_LABELS = {
  hurghada: 'Hurghada',
  'sharm-el-sheikh': 'Sharm El Sheikh',
  luxor: 'Luxor',
  aswan: 'Aswan',
};

const STATUS_CONFIG = {
  green: { bg: 'bg-success/10 border-success/20', badge: 'bg-success text-success-foreground', dot: 'bg-success', label: 'NORMAL', icon: CheckCircle2 },
  yellow: { bg: 'bg-amber-500/10 border-amber-500/20', badge: 'bg-amber-500 text-white', dot: 'bg-amber-500', label: 'BUSY', icon: AlertTriangle },
  red: { bg: 'bg-red-500/10 border-red-500/20', badge: 'bg-red-500 text-white', dot: 'bg-red-500', label: 'ALERT', icon: AlertTriangle },
};

// Fallback data if DB is empty
const FALLBACK = {
  global: { usd_to_egp: 50.2, eur_to_egp: 54.1, rub_to_egp: 0.55, gbp_to_egp: 63.4, currency_note: 'Rates stable', update_date: '2026-04-02' },
  cities: [
    { city: 'hurghada', status: 'green', weather: '26°C, sunny, light sea breeze', traffic: 'Normal — airport and roads clear', alerts: 'None', events: 'None reported', recommendation: 'Great beach and diving day. Use Careem for airport transfer.', meal_range: '100–300 EGP', coffee_range: '40–90 EGP', taxi_range: '30–80 EGP', update_date: '2026-04-02' },
    { city: 'sharm-el-sheikh', status: 'green', weather: '27°C, clear, Red Sea breeze', traffic: 'Normal operations', alerts: 'None', events: 'None reported', recommendation: 'Perfect diving conditions. Buy SIM at official Vodafone kiosk only.', meal_range: '120–350 EGP', coffee_range: '50–100 EGP', taxi_range: '40–100 EGP', update_date: '2026-04-02' },
    { city: 'luxor', status: 'green', weather: '33°C, very sunny, hot from 11am', traffic: 'Normal — West Bank ferry running', alerts: 'None', events: 'None reported', recommendation: 'Visit Valley of Kings before 10am. Carry 2L water minimum.', meal_range: '80–250 EGP', coffee_range: '30–70 EGP', taxi_range: '20–60 EGP', update_date: '2026-04-02' },
    { city: 'aswan', status: 'green', weather: '36°C, dry and very sunny', traffic: 'Abu Simbel convoy running 4am', alerts: 'None', events: 'None reported', recommendation: 'Extremely hot. Stay hydrated. Abu Simbel convoy confirmed.', meal_range: '80–230 EGP', coffee_range: '30–70 EGP', taxi_range: '20–50 EGP', update_date: '2026-04-02' },
  ],
};

function CityCard({ data }) {
  const cfg = STATUS_CONFIG[data.status] || STATUS_CONFIG.green;
  const Icon = cfg.icon;

  return (
    <div className={`rounded-2xl border p-5 ${cfg.bg}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-base">{CITY_LABELS[data.city] || data.city}</h3>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${cfg.badge}`}>
          <div className={`w-1.5 h-1.5 rounded-full bg-white/70 ${data.status === 'green' ? 'animate-pulse' : ''}`} />
          {cfg.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { icon: CloudSun, label: 'Weather', value: data.weather },
          { icon: Car, label: 'Traffic', value: data.traffic },
          { icon: ShieldCheck, label: 'Alerts', value: data.alerts || 'None' },
          { icon: Calendar, label: 'Events', value: data.events || 'None' },
        ].map(({ icon: ItemIcon, label, value }) => (
          <div key={label} className="bg-background/60 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <ItemIcon className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
            </div>
            <p className="text-xs font-medium leading-relaxed">{value}</p>
          </div>
        ))}
      </div>

      {/* Prices */}
      {(data.meal_range || data.taxi_range) && (
        <div className="bg-background/60 rounded-xl p-3 mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Price Ranges</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {data.meal_range && <p className="text-xs text-muted-foreground">🍽️ Meal: <strong className="text-foreground">{data.meal_range} EGP</strong></p>}
            {data.coffee_range && <p className="text-xs text-muted-foreground">☕ Coffee: <strong className="text-foreground">{data.coffee_range} EGP</strong></p>}
            {data.taxi_range && <p className="text-xs text-muted-foreground">🚕 Taxi: <strong className="text-foreground">{data.taxi_range} EGP</strong></p>}
          </div>
        </div>
      )}

      {data.recommendation && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-3">
          <p className="text-xs font-medium text-accent-foreground">💡 {data.recommendation}</p>
        </div>
      )}

      {data.update_date && (
        <p className="text-[10px] text-muted-foreground mt-2 text-right">Updated: {data.update_date}</p>
      )}
    </div>
  );
}

export default function LiveSituationPage() {
  useSEO({
    title: 'Live Situation Update — Egypt Tourist Cities Today | Localli Egypt',
    description: 'Daily live status for Hurghada, Sharm El Sheikh, Luxor and Aswan. Weather, safety alerts, prices, currency rates, and tourist recommendations. Updated every morning.',
  });

  const { data: allRecords = [], isLoading } = useQuery({
    queryKey: ['live-situation'],
    queryFn: () => base44.entities.LiveSituation.list('-update_date', 20),
  });

  // Get latest record per city
  const getLatest = (city) => {
    const records = allRecords.filter(r => r.city === city);
    return records[0] || null;
  };

  const globalData = getLatest('global') || FALLBACK.global;
  const cities = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan'];
  const cityData = cities.map(c => getLatest(c) || FALLBACK.cities.find(f => f.city === c));

  const overallStatus = cityData.some(c => c?.status === 'red') ? 'red' :
    cityData.some(c => c?.status === 'yellow') ? 'yellow' : 'green';
  const overallCfg = STATUS_CONFIG[overallStatus];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
          <Radio className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Live Situation Update</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${overallCfg.dot} animate-pulse`} />
            <span className="text-xs text-muted-foreground">Updated daily at 8am Egypt time · {globalData.update_date}</span>
          </div>
        </div>
      </div>

      {/* Overall status bar */}
      <div className={`rounded-2xl border p-4 mb-6 flex items-center justify-between ${overallCfg.bg}`}>
        <div>
          <p className="font-extrabold text-sm mb-0.5">Overall Egypt Tourist Status</p>
          <p className="text-xs text-muted-foreground">Covering Hurghada, Sharm El Sheikh, Luxor & Aswan</p>
        </div>
        <span className={`text-sm font-extrabold px-3 py-1.5 rounded-full ${overallCfg.badge}`}>
          {overallCfg.label}
        </span>
      </div>

      {/* Currency rates */}
      <div className="bg-card border border-border/50 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-accent" />
          <h2 className="font-extrabold text-base">Live Currency Rates</h2>
          {globalData.currency_note && (
            <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full ml-auto">
              {globalData.currency_note}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { flag: '🇺🇸', code: 'USD', rate: globalData.usd_to_egp },
            { flag: '🇪🇺', code: 'EUR', rate: globalData.eur_to_egp },
            { flag: '🇬🇧', code: 'GBP', rate: globalData.gbp_to_egp },
            { flag: '🇷🇺', code: 'RUB', rate: globalData.rub_to_egp },
          ].map(({ flag, code, rate }) => (
            <div key={code} className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-lg mb-1">{flag}</p>
              <p className="text-xs text-muted-foreground">1 {code}</p>
              <p className="font-extrabold text-accent text-lg">{rate ? `${rate} EGP` : '—'}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          Approximate market rates. Use official bank or certified exchange bureau. Rates updated daily.
        </p>
        <div className="mt-3 text-center">
          <Link to="/currency-rates" className="text-xs font-bold text-accent hover:underline inline-flex items-center gap-1">
            Full currency guide & converter <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* City cards */}
      <h2 className="text-xl font-extrabold mb-4">City-by-City Status</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-card border border-border/30 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {cityData.map(data => data && <CityCard key={data.city} data={data} />)}
        </div>
      )}

      {/* Global price context */}
      <div className="bg-card border border-border/50 rounded-2xl p-5 mb-8">
        <h2 className="font-extrabold text-base mb-4">Egypt Price Reference (All Cities)</h2>
        <div className="space-y-3">
          {[
            { label: 'Budget street meal / koshary', range: '30–80 EGP', emoji: '🥙' },
            { label: 'Mid-range restaurant meal', range: '150–400 EGP', emoji: '🍽️' },
            { label: 'Fine dining (per person)', range: '800–2,000 EGP', emoji: '🥂' },
            { label: 'Coffee / tea (cafe)', range: '40–90 EGP', emoji: '☕' },
            { label: 'Short taxi ride (Careem/Uber)', range: '30–80 EGP', emoji: '🚕' },
            { label: 'Airport transfer (15–30km)', range: '150–300 EGP', emoji: '✈️' },
            { label: 'SIM card 15GB (official store)', range: '130–160 EGP', emoji: '📱' },
            { label: '1.5L water (supermarket)', range: '5–8 EGP', emoji: '💧' },
            { label: 'Diving day trip', range: '400–800 EGP', emoji: '🤿' },
          ].map(({ label, range, emoji }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <span className="text-sm text-muted-foreground">{emoji} {label}</span>
              <span className="text-sm font-bold">{range}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">
          Ranges reflect fair tourist prices. Scam prices can be 3–10x higher — always agree price before service.
        </p>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link to="/currency-rates" className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between hover:border-accent/30 transition-colors">
          <div>
            <p className="font-bold text-sm">Currency Calculator</p>
            <p className="text-xs text-muted-foreground">Convert your money to EGP</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link to="/price-checker" className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between hover:border-accent/30 transition-colors">
          <div>
            <p className="font-bold text-sm">Full Price Checker</p>
            <p className="text-xs text-muted-foreground">Local vs fair vs scam prices</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link to="/egypt-safe-now" className="bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between hover:border-accent/30 transition-colors">
          <div>
            <p className="font-bold text-sm">Full Safety Assessment</p>
            <p className="text-xs text-muted-foreground">Detailed Egypt safety guide 2026</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link to="/ai-assistant" className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex items-center justify-between hover:border-accent/40 transition-colors">
          <div>
            <p className="font-bold text-sm text-accent">Ask Localli Guide</p>
            <p className="text-xs text-muted-foreground">AI assistant for real-time answers</p>
          </div>
          <ArrowRight className="w-4 h-4 text-accent" />
        </Link>
      </div>
    </div>
  );
}