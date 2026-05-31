import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Globe, Shield, Car, HandHeart, DollarSign, Loader2, ChevronDown } from 'lucide-react';

const NATIONALITIES = [
  { value: 'Russian', label: '🇷🇺 Russian' },
  { value: 'German', label: '🇩🇪 German' },
  { value: 'British', label: '🇬🇧 British' },
  { value: 'American', label: '🇺🇸 American' },
  { value: 'French', label: '🇫🇷 French' },
  { value: 'Italian', label: '🇮🇹 Italian' },
  { value: 'Polish', label: '🇵🇱 Polish' },
  { value: 'Ukrainian', label: '🇺🇦 Ukrainian' },
  { value: 'Saudi', label: '🇸🇦 Saudi' },
  { value: 'Emirati', label: '🇦🇪 Emirati' },
  { value: 'Chinese', label: '🇨🇳 Chinese' },
  { value: 'Japanese', label: '🇯🇵 Japanese' },
  { value: 'Spanish', label: '🇪🇸 Spanish' },
  { value: 'Turkish', label: '🇹🇷 Turkish' },
  { value: 'Indian', label: '🇮🇳 Indian' },
];

const SECTION_ICONS = {
  safety: Shield,
  transport: Car,
  cultural: HandHeart,
  money: DollarSign,
};

const SECTION_COLORS = {
  safety: 'text-red-600 bg-red-50 border-red-100',
  transport: 'text-amber-700 bg-amber-50 border-amber-100',
  cultural: 'text-violet-600 bg-violet-50 border-violet-100',
  money: 'text-emerald-700 bg-emerald-50 border-emerald-100',
};

export default function TravelTips() {
  const [nationality, setNationality] = useState('');
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTips = async () => {
    if (!nationality) return;
    setLoading(true);
    setError(null);
    setTips(null);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert travel advisor for Egypt. Generate practical travel tips for a ${nationality} tourist visiting Egypt.

CRITICAL RULES:
- Write ENTIRELY in the native language of ${nationality} people (e.g. Russian for Russians, German for Germans, Arabic for Saudis/Emiratis, Chinese for Chinese, etc.)
- The tone must be natural and native — NOT translated or formal. Write like a local friend giving advice.
- Be specific, practical, and honest about Egypt.

Return a JSON object with exactly these 4 keys:
{
  "safety": { "title": "section title in native language", "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"] },
  "transport": { "title": "section title in native language", "tips": ["tip1", "tip2", "tip3", "tip4"] },
  "cultural": { "title": "section title in native language", "tips": ["tip1", "tip2", "tip3", "tip4"] },
  "money": { "title": "section title in native language", "tips": ["tip1", "tip2", "tip3", "tip4"] }
}

Each tip should be 1-2 sentences max. Be direct and useful.`,
      response_json_schema: {
        type: 'object',
        properties: {
          safety: {
            type: 'object',
            properties: { title: { type: 'string' }, tips: { type: 'array', items: { type: 'string' } } }
          },
          transport: {
            type: 'object',
            properties: { title: { type: 'string' }, tips: { type: 'array', items: { type: 'string' } } }
          },
          cultural: {
            type: 'object',
            properties: { title: { type: 'string' }, tips: { type: 'array', items: { type: 'string' } } }
          },
          money: {
            type: 'object',
            properties: { title: { type: 'string' }, tips: { type: 'array', items: { type: 'string' } } }
          }
        }
      }
    });

    setTips(result);
    setLoading(false);
  };

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-6 h-6 text-accent" />
          <h1 className="text-2xl font-black tracking-tight">Travel Tips for Egypt</h1>
        </div>
        <p className="text-sm text-muted-foreground">Get practical tips in your native language — safety, transport, culture & money.</p>
      </div>

      {/* Nationality selector */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <label className="block text-sm font-bold mb-2">Select your nationality</label>
        <div className="relative">
          <select
            value={nationality}
            onChange={e => setNationality(e.target.value)}
            className="w-full appearance-none bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-semibold pr-10 focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="">— Choose nationality —</option>
            {NATIONALITIES.map(n => (
              <option key={n.value} value={n.value}>{n.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        <button
          onClick={generateTips}
          disabled={!nationality || loading}
          className="mt-4 w-full py-3.5 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50"
          style={{ background: '#2E7D8A' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating tips…
            </span>
          ) : (
            `Get Tips for ${nationality || 'your nationality'} →`
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">{error}</div>
      )}

      {/* Tips output */}
      {tips && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground text-center">Tips for <strong>{nationality}</strong> tourists — written in your native language</p>
          {Object.entries(tips).map(([key, section]) => {
            const Icon = SECTION_ICONS[key];
            const colorClass = SECTION_COLORS[key];
            return (
              <div key={key} className={`rounded-2xl border p-5 ${colorClass}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5" />
                  <h2 className="font-extrabold text-base">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed">
                      <span className="shrink-0 font-bold opacity-50">{i + 1}.</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <button
            onClick={() => { setTips(null); setNationality(''); }}
            className="w-full py-3 rounded-xl border border-border text-sm font-bold hover:bg-secondary transition-colors"
          >
            Generate for another nationality
          </button>
        </div>
      )}
    </div>
  );
}