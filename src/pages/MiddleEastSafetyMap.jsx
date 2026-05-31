import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { ShieldCheck, AlertTriangle, XCircle, MapPin, Info } from 'lucide-react';

const COUNTRIES = [
  {
    flag: '🇪🇬', name: 'Egypt — Tourist Areas', status: 'safe',
    details: 'Sharm El Sheikh, Hurghada, Luxor, Aswan. Stable government. 15M+ tourists/year. Heavy tourist police presence.',
    distance: 'YOUR DESTINATION',
    note: 'North Sinai (near Israeli border) is a separate region — no tourist sites there.',
  },
  {
    flag: '🇯🇴', name: 'Jordan', status: 'safe',
    details: 'Petra, Wadi Rum, Aqaba. Very stable. Friendly to Western tourists. King Abdullah government highly stable.',
    distance: '~600km from Sharm',
    note: 'One of the safest countries in the Middle East.',
  },
  {
    flag: '🇸🇦', name: 'Saudi Arabia', status: 'caution',
    details: 'Tourism opening rapidly. Strict social rules apply. Visa now available to most nationalities.',
    distance: '~500km from Sharm',
    note: 'Rapidly modernizing for tourism. Not a conflict zone.',
  },
  {
    flag: '🇮🇱', name: 'Israel / Gaza border', status: 'avoid',
    details: 'Active conflict in Gaza. Travel advisories in effect for the Gaza region and some border areas.',
    distance: '~350km from Hurghada',
    note: 'Egypt\'s tourist resorts are geographically and practically distant from this area.',
  },
  {
    flag: '🇱🇧', name: 'Lebanon', status: 'avoid',
    details: 'Ongoing instability, economic crisis, and active conflict risk in southern areas.',
    distance: '~1,000km from Sharm',
    note: 'Not recommended for tourism currently.',
  },
  {
    flag: '🇸🇾', name: 'Syria', status: 'avoid',
    details: 'Active conflict zones throughout much of the country. Not a tourist destination.',
    distance: '~1,400km from Sharm',
    note: 'All major governments advise against travel.',
  },
  {
    flag: '🇱🇾', name: 'Libya', status: 'avoid',
    details: 'Civil war and political instability. No tourism infrastructure.',
    distance: '~1,800km from Hurghada',
    note: 'All governments advise against travel.',
  },
  {
    flag: '🇮🇶', name: 'Iraq', status: 'avoid',
    details: 'Ongoing security issues. Limited tourism. Most governments advise against travel except Kurdistan region.',
    distance: '~2,000km from Sharm',
    note: 'Not a tourist destination for most travelers.',
  },
  {
    flag: '🇹🇷', name: 'Turkey', status: 'safe',
    details: 'Major tourist destination. Istanbul, Antalya, Cappadocia. Generally safe for tourists. Strong tourism infrastructure.',
    distance: '~1,000km from Sharm',
    note: 'Occasional political tensions but tourist zones consistently safe.',
  },
  {
    flag: '🇬🇷', name: 'Greece', status: 'safe',
    details: 'EU member. Completely stable. Popular with Mediterranean tourists.',
    distance: '~1,500km from Sharm',
    note: 'Reference point: European-level safety.',
  },
];

const STATUS_CONFIG = {
  safe: { bg: 'bg-success/10 border-success/20', badge: 'bg-success text-success-foreground', label: 'SAFE', icon: ShieldCheck, iconColor: 'text-success' },
  caution: { bg: 'bg-amber-500/10 border-amber-500/20', badge: 'bg-amber-500 text-white', label: 'CAUTION', icon: AlertTriangle, iconColor: 'text-amber-500' },
  avoid: { bg: 'bg-red-500/10 border-red-500/20', badge: 'bg-red-500 text-white', label: 'AVOID', icon: XCircle, iconColor: 'text-red-500' },
};

export default function MiddleEastSafetyMap() {
  useSEO({
    title: 'Middle East Safety Map 2026 — Egypt vs Surrounding Countries',
    description: 'Visual safety comparison of Egypt vs nearby Middle Eastern countries. Egypt\'s tourist areas are hundreds of kilometers from conflict zones. Updated 2026.',
  });

  const safeCount = COUNTRIES.filter(c => c.status === 'safe').length;
  const avoidCount = COUNTRIES.filter(c => c.status === 'avoid').length;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
          <MapPin className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Middle East Safety Map</h1>
          <p className="text-sm text-muted-foreground">Egypt vs the region — honest stability guide 2026</p>
        </div>
      </div>

      {/* Key message */}
      <div className="bg-success/10 border border-success/20 rounded-2xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-success shrink-0 mt-0.5" />
          <div>
            <h2 className="font-extrabold text-success mb-2">Egypt's Tourist Areas Are Far From Conflict Zones</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sharm El Sheikh is on the southern tip of the Sinai Peninsula — over 350km from the Gaza area.
              Hurghada, Luxor, and Aswan are on the other side of the country entirely, along the Nile and Red Sea coast.
              Egypt's tourist infrastructure has operated continuously throughout regional tensions for decades.
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-success/10 border border-success/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-success">{safeCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Countries Safe</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-amber-600">1</p>
          <p className="text-xs text-muted-foreground mt-1">Use Caution</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
          <p className="text-3xl font-black text-red-500">{avoidCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Avoid Travel</p>
        </div>
      </div>

      {/* Countries list */}
      <h2 className="text-xl font-extrabold mb-4">Country-by-Country Status</h2>
      <div className="space-y-3 mb-10">
        {COUNTRIES.map((country, i) => {
          const config = STATUS_CONFIG[country.status];
          const Icon = config.icon;
          return (
            <div key={i} className={`rounded-2xl border p-4 ${config.bg} ${country.name.includes('Egypt') ? 'ring-2 ring-accent' : ''}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <h3 className="font-bold text-sm">{country.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{country.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>{config.label}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{country.details}</p>
              {country.note && (
                <div className="flex items-start gap-1.5 mt-2">
                  <Info className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground italic">{country.note}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Geographic context */}
      <div className="bg-card border border-border/50 rounded-2xl p-5 mb-8">
        <h2 className="font-extrabold mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent" />
          Geographic Context
        </h2>
        <div className="space-y-2">
          {[
            ['Hurghada to Gaza border', '~380km (5+ hour drive)', 'Across Sinai desert + border'],
            ['Sharm El Sheikh to Gaza border', '~350km', 'South Sinai is entirely separate from North Sinai'],
            ['Luxor to nearest conflict zone', '~700km+', 'Deep in Upper Egypt — completely insulated'],
            ['Aswan to nearest conflict zone', '~900km+', 'Southern Egypt — further than London to Madrid'],
          ].map(([route, dist, note], i) => (
            <div key={i} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-2 border-b border-border/20 last:border-0">
              <span className="text-xs font-semibold">{route}</span>
              <div className="text-right">
                <span className="text-xs font-bold text-accent">{dist}</span>
                <p className="text-[10px] text-muted-foreground">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Is Egypt Safe Right Now?" description="Full safety assessment with current situation" to="/egypt-safe-now" />
        <SafeNextStep title="Egypt vs Dubai vs Turkey" description="Which destination is better for your trip?" to="/egypt-vs-dubai" />
      </div>
    </div>
  );
}