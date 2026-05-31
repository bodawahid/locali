import { useState, useRef } from 'react';
import { AlertTriangle, Users, Shield, Car, HandHeart, DollarSign, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SafeNextStep from '../components/SafeNextStep';

// Language map: which native language to use per nationality key
const LANG_MAP = {
  russian: 'Russian (Русский)',
  german: 'German (Deutsch)',
  french: 'French (Français)',
  arabic: 'Arabic (العربية)',
  american: 'English',
  british: 'English',
  italian: 'Italian (Italiano)',
  spanish: 'Spanish (Español)',
  polish: 'Polish (Polski)',
  chinese: 'Chinese (中文)',
};

// Static info per nationality (visa, exchange, banks) — unchanged
const NATIONALITY_GUIDES = {
  russian: {
    flag: '🇷🇺',
    label: 'Russian Tourists',
    visa: 'eVisa (30 days) — ~$25 online or visa-on-arrival',
    exchange: 'Bring USD/EUR — Russian banks often restricted due to sanctions. Exchange at airport or Al Ahly Bank.',
    best_banks: 'CIB Egypt, Banque Misr (accept foreigners)',
  },
  german: {
    flag: '🇩🇪',
    label: 'German Tourists',
    visa: 'eVisa (30 days) — ~€25 or visa-on-arrival',
    exchange: 'EUR very common in tourist areas. ATMs abundant. Bring Visa/Mastercard.',
    best_banks: 'HSBC Egypt, CIB (best English service, ATM network)',
  },
  arabic: {
    flag: '🇸🇦',
    label: 'Arab Tourists (GCC)',
    visa: 'Visa-free for 90 days (Saudi, UAE, Kuwait, Bahrain, Oman, Qatar)',
    exchange: 'SAR/AED accepted at some tourist spots. Use ATMs for best rates.',
    best_banks: 'NCB Egypt, Banque Misr (familiar to Gulf tourists)',
  },
  american: {
    flag: '🇺🇸',
    label: 'American Tourists',
    visa: 'eVisa (30 days) — $25 online via Egypt eVisa portal',
    exchange: 'USD very common (preferred in resorts). ATMs everywhere. Cards widely accepted.',
    best_banks: 'HSBC Egypt, CIB (English-speaking staff)',
  },
  british: {
    flag: '🇬🇧',
    label: 'British Tourists',
    visa: 'eVisa (30 days) — £20 online',
    exchange: 'GBP not widely accepted — use ATMs or exchange at banks.',
    best_banks: 'HSBC Egypt, Barclays presence (limited)',
  },
  french: {
    flag: '🇫🇷',
    label: 'French Tourists',
    visa: 'eVisa (30 days) — €25 online',
    exchange: 'EUR well-accepted in tourist zones. ATMs abundant.',
    best_banks: 'CIB Egypt, Banque Misr (familiar to EU tourists)',
  },
  italian: {
    flag: '🇮🇹',
    label: 'Italian Tourists',
    visa: 'eVisa (30 days) — €25 online',
    exchange: 'EUR accepted in tourist zones. ATMs widespread.',
    best_banks: 'HSBC Egypt, CIB Egypt',
  },
  spanish: {
    flag: '🇪🇸',
    label: 'Spanish Tourists',
    visa: 'eVisa (30 days) — €25 online',
    exchange: 'EUR accepted in tourist zones. ATMs widespread.',
    best_banks: 'HSBC Egypt, CIB Egypt',
  },
  polish: {
    flag: '🇵🇱',
    label: 'Polish Tourists',
    visa: 'eVisa (30 days) — ~100 PLN online',
    exchange: 'PLN not widely accepted — exchange to EUR/USD first then to EGP.',
    best_banks: 'CIB Egypt, Banque Misr',
  },
  chinese: {
    flag: '🇨🇳',
    label: 'Chinese Tourists',
    visa: 'eVisa (30 days) or visa-on-arrival',
    exchange: 'CNY not accepted. Bring USD or use UnionPay ATMs.',
    best_banks: 'HSBC Egypt (UnionPay support)',
  },
};

const SECTION_CONFIG = [
  { key: 'safety', icon: Shield, color: 'text-red-600 bg-red-50 border-red-100' },
  { key: 'transport', icon: Car, color: 'text-amber-700 bg-amber-50 border-amber-100' },
  { key: 'cultural', icon: HandHeart, color: 'text-violet-600 bg-violet-50 border-violet-100' },
  { key: 'money', icon: DollarSign, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
];

export default function NationalityGuide() {
  const [selected, setSelected] = useState('russian');
  const [localizedTips, setLocalizedTips] = useState({});
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef({});

  const fetchTips = async (nat) => {
    if (cacheRef.current[nat]) {
      setLocalizedTips(cacheRef.current[nat]);
      return;
    }
    setLoading(true);
    const lang = LANG_MAP[nat] || 'English';
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert travel advisor for Egypt. Generate practical travel tips for a ${nat} tourist.

CRITICAL: Write ENTIRELY in ${lang}. Do NOT use English unless the language IS English. 
Write like a local friend giving advice — natural, informal tone. Not translated.

Return JSON with exactly 4 keys (safety, transport, cultural, money). Each key has:
- "title": section heading in ${lang}
- "tips": array of 4 practical tips (1-2 sentences each) in ${lang}

Focus on Egypt-specific advice relevant to ${nat} tourists.`,
      response_json_schema: {
        type: 'object',
        properties: {
          safety: { type: 'object', properties: { title: { type: 'string' }, tips: { type: 'array', items: { type: 'string' } } } },
          transport: { type: 'object', properties: { title: { type: 'string' }, tips: { type: 'array', items: { type: 'string' } } } },
          cultural: { type: 'object', properties: { title: { type: 'string' }, tips: { type: 'array', items: { type: 'string' } } } },
          money: { type: 'object', properties: { title: { type: 'string' }, tips: { type: 'array', items: { type: 'string' } } } },
        }
      }
    });
    cacheRef.current[nat] = result;
    setLocalizedTips(result);
    setLoading(false);
  };

  const handleSelect = (nat) => {
    setSelected(nat);
    fetchTips(nat);
  };

  const data = NATIONALITY_GUIDES[selected];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black">By Nationality Guide</h1>
          <p className="text-xs text-gray-500">Tips displayed in your native language</p>
        </div>
      </div>

      {/* Nationality selector */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <p className="text-xs font-bold text-gray-700 mb-3">Select Your Nationality:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.keys(NATIONALITY_GUIDES).map(nat => (
            <button key={nat} onClick={() => handleSelect(nat)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                selected === nat
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-indigo-300'
              }`}>
              {NATIONALITY_GUIDES[nat].flag} {NATIONALITY_GUIDES[nat].label}
            </button>
          ))}
        </div>
      </div>

      {/* Static info card */}
      {data && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
            <p className="text-2xl mb-1">{data.flag}</p>
            <h3 className="font-extrabold text-lg">{data.label}</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-blue-50 rounded-xl p-2.5">
              <p className="text-[10px] font-bold text-blue-700 mb-1">📋 Visa</p>
              <p className="text-xs text-blue-600">{data.visa}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-2.5">
              <p className="text-[10px] font-bold text-green-700 mb-1">💱 Currency Exchange</p>
              <p className="text-xs text-green-600">{data.exchange}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-2.5">
              <p className="text-[10px] font-bold text-purple-700 mb-1">🏦 Best Banks</p>
              <p className="text-xs text-purple-600">{data.best_banks}</p>
            </div>
          </div>
        </div>
      )}

      {/* Localized tips sections */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Fetching tips in your language…</span>
        </div>
      )}

      {!loading && Object.keys(localizedTips).length > 0 && (
        <div className="space-y-3">
          {SECTION_CONFIG.map(({ key, icon: Icon, color }) => {
            const section = localizedTips[key];
            if (!section) return null;
            return (
              <div key={key} className={`rounded-2xl border p-4 ${color}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4" />
                  <h2 className="font-extrabold text-sm">{section.title}</h2>
                </div>
                <ul className="space-y-1.5">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed">
                      <span className="shrink-0 font-bold opacity-40">{i + 1}.</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {!loading && Object.keys(localizedTips).length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Select a nationality above to load tips in your language.
        </div>
      )}

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800 mb-0.5">⚠️ Universal Tips (All Nationalities)</p>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• Always carry passport copy (leave original in hotel safe)</li>
            <li>• Register with your embassy if staying 3+ months</li>
            <li>• Bring universal power adapter (Type C/E plugs)</li>
            <li>• Travel insurance strongly recommended (medical + evacuation)</li>
            <li>• Egyptians very hospitable — respect local customs & dress modestly outside beaches</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <SafeNextStep title="Visa & Entry Details" description="Complete visa application guide" to="/visa-entry" />
        <SafeNextStep title="Currency Rates & Exchange" description="Live rates & best places to exchange" to="/currency-rates" />
      </div>
    </div>
  );
}