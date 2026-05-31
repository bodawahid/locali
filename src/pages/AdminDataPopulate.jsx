import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Download, CheckCircle2, Loader2, X, Star, MapPin, Phone, RefreshCw, ShieldCheck } from 'lucide-react';

const CITIES = [
  { id: 'hurghada', label: 'Hurghada' },
  { id: 'sharm-el-sheikh', label: 'Sharm El Sheikh' },
  { id: 'luxor', label: 'Luxor' },
  { id: 'aswan', label: 'Aswan' },
  { id: 'el-gouna', label: 'El Gouna' },
];

const CATEGORIES = [
  { id: 'restaurant', label: '🍽️ Restaurants', entity: 'Service' },
  { id: 'medical', label: '🏥 Hospitals & Clinics', entity: 'Service' },
  { id: 'pharmacy', label: '💊 Pharmacies', entity: 'Service' },
  { id: 'activities', label: '🤿 Activities & Tours', entity: 'Service' },
  { id: 'supermarket', label: '🛒 Supermarkets', entity: 'Service' },
  { id: 'bank', label: '🏦 Banks & ATMs', entity: 'Service' },
  { id: 'transport', label: '🚗 Car Rentals', entity: 'Service' },
  { id: 'guide', label: '🧭 Tourist Guides', entity: 'Guide' },
];

function buildPrompt(cityId, cityLabel, categoryId) {
  const base = `Find real, currently operating businesses in ${cityLabel}, Egypt. Use Google Maps, TripAdvisor and travel sources. Only include places with a real address and rating 3.5+. Return as JSON with a "listings" array.`;

  const specs = {
    restaurant: `Top 20 restaurants. For each: name, address, phone (+20 format), description (cuisine & highlights), google_rating (number), price_range (budget/moderate/premium), website (Google Maps URL if available), tags (array of cuisine types).`,
    medical: `All hospitals and clinics. For each: name, address, phone, description (specialities, emergency yes/no, English-speaking yes/no), tags (array like ["Emergency","English-speaking"]).`,
    pharmacy: `All pharmacies (El Ezaby, Seif, El Dawaa chains + local). For each: name, address, phone, description (include if 24h), tags (["Pharmacy","24h"] if applicable).`,
    activities: `Top 20 tours and activities. For each: name, address, phone, description (what's included, duration), avg_rating (number), price_range, website, tags (activity types).`,
    supermarket: `All supermarkets and hypermarkets (Carrefour, Seoudi, Spinneys, Metro etc). For each: name, address, phone, description (hours, imported goods), tags.`,
    bank: `All bank branches. For each: name (bank + branch), address, phone, description (ATM available, English service, hours), tags (["Bank","ATM"] etc).`,
    transport: `All car rental companies. For each: name, address, phone, description (fleet, with/without driver, international license), price_range.`,
    guide: `Licensed tourist guides. For each: full_name, description, languages (array), tour_types (array), avg_rating (number or null), years_experience (number or null).`,
  };

  return `${base}\n\nCity: ${cityLabel}, Egypt\nCategory: ${categoryId}\n\n${specs[categoryId] || ''}\n\nAlso include for every item: city="${cityId}", is_verified=false, source="Web Search", last_verified="2026-04-08"`;
}

function categoryToServiceCategory(catId) {
  const map = { restaurant: 'restaurant', medical: 'medical', pharmacy: 'medical', activities: 'activities', supermarket: 'other', bank: 'other', transport: 'transport', guide: null };
  return map[catId] || 'other';
}

function ResultCard({ item, approved, rejected, onApprove, onReject }) {
  const name = item.name || item.full_name || '—';
  return (
    <div className={`rounded-xl border p-3 text-xs transition-all ${approved ? 'border-success/50 bg-success/5' : rejected ? 'border-red-400/30 bg-red-500/5 opacity-40' : 'border-border/50 bg-card'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate text-sm">{name}</p>
          {item.address && <p className="text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5 shrink-0" />{item.address}</p>}
          {item.phone && <p className="text-muted-foreground flex items-center gap-1"><Phone className="w-2.5 h-2.5 shrink-0" />{item.phone}</p>}
          {(item.google_rating || item.avg_rating) && (
            <p className="flex items-center gap-1 mt-0.5"><Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />{item.google_rating || item.avg_rating}</p>
          )}
          {item.description && <p className="text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{item.description}</p>}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.tags.slice(0, 3).map((t, i) => <span key={i} className="bg-secondary px-1.5 py-0.5 rounded-full">{t}</span>)}
            </div>
          )}
          {item.languages?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.languages.map((l, i) => <span key={i} className="bg-blue-500/10 text-blue-700 px-1.5 py-0.5 rounded-full">{l}</span>)}
            </div>
          )}
          {item.source && <p className="text-[9px] text-muted-foreground mt-1.5 border-t border-border/20 pt-1">📡 {item.source}</p>}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button onClick={onApprove} className={`p-1.5 rounded-lg ${approved ? 'bg-success text-success-foreground' : 'bg-success/10 text-success hover:bg-success/20'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onReject} className={`p-1.5 rounded-lg ${rejected ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDataPopulate() {
  const [city, setCity] = useState('hurghada');
  const [category, setCategory] = useState('restaurant');
  const [results, setResults] = useState([]);
  const [approved, setApproved] = useState(new Set());
  const [rejected, setRejected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [log, setLog] = useState([]);
  const [savedCount, setSavedCount] = useState(0);

  const addLog = (msg) => setLog(prev => [...prev.slice(-20), { msg, t: new Date().toLocaleTimeString() }]);

  const toggle = (set, setFn, idx, otherSet, setOther) => {
    setFn(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
    setOther(prev => { const n = new Set(prev); n.delete(idx); return n; });
  };

  const fetchData = async () => {
    setLoading(true);
    setResults([]);
    setApproved(new Set());
    setRejected(new Set());
    const cityLabel = CITIES.find(c => c.id === city)?.label || city;
    addLog(`🔍 Searching ${category} in ${cityLabel}…`);

    const prompt = buildPrompt(city, cityLabel, category);

    const schema = {
      type: 'object',
      properties: {
        listings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              full_name: { type: 'string' },
              address: { type: 'string' },
              phone: { type: 'string' },
              description: { type: 'string' },
              google_rating: { type: 'number' },
              avg_rating: { type: 'number' },
              price_range: { type: 'string' },
              website: { type: 'string' },
              is_verified: { type: 'boolean' },
              tags: { type: 'array', items: { type: 'string' } },
              languages: { type: 'array', items: { type: 'string' } },
              tour_types: { type: 'array', items: { type: 'string' } },
              years_experience: { type: 'number' },
              review_count: { type: 'number' },
              source: { type: 'string' },
              last_verified: { type: 'string' },
            }
          }
        }
      }
    };

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      response_json_schema: schema,
      model: 'gemini_3_flash',
    });

    const listings = res?.listings || [];
    setResults(listings);
    addLog(`✅ Found ${listings.length} listings — review and approve before saving`);
    setLoading(false);
  };

  const saveApproved = async () => {
    const toSave = results.filter((_, i) => approved.has(i));
    if (!toSave.length) return;
    setSaving(true);
    addLog(`💾 Saving ${toSave.length} listings…`);

    const cat = CATEGORIES.find(c => c.id === category);
    const entityName = cat?.entity || 'Service';
    let saved = 0;

    for (const item of toSave) {
      let record;
      if (entityName === 'Guide') {
        record = {
          full_name: item.full_name || item.name || 'Unknown',
          city,
          cities_covered: [city],
          languages: item.languages || ['Arabic'],
          tour_types: item.tour_types || [],
          description: item.description || '',
          avg_rating: item.avg_rating || null,
          review_count: item.review_count || 0,
          status: 'pending',
          is_verified: false,
          years_experience: item.years_experience || null,
        };
      } else {
        record = {
          name: item.name || item.full_name || 'Unknown',
          category: categoryToServiceCategory(category),
          city,
          address: item.address || '',
          phone: item.phone || '',
          description: item.description || '',
          website: item.website || '',
          avg_rating: item.google_rating || item.avg_rating || 0,
          is_verified: false,
          price_range: ['budget', 'moderate', 'premium'].includes(item.price_range) ? item.price_range : 'moderate',
          tags: item.tags || [],
        };
      }
      try {
        await base44.entities[entityName].create(record);
        saved++;
      } catch (e) {
        addLog(`❌ Failed: ${record.name || record.full_name}`);
      }
    }

    setSavedCount(prev => prev + saved);
    addLog(`✅ Saved ${saved} listings to database`);
    setSaving(false);
  };

  const approvedCount = approved.size;
  const pendingResults = results.filter((_, i) => !approved.has(i) && !rejected.has(i));

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
          <Search className="w-6 h-6 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Auto-Populate Real Data</h1>
          <p className="text-sm text-muted-foreground">Find & import real businesses using AI + live web search · Admin only</p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 mb-6 text-xs text-amber-700">
        ⚡ Uses AI + live internet search. Results take ~15–30 seconds. <strong>Always review before saving</strong> — verify phone numbers before publishing to tourists. This uses integration credits (gemini_3_flash).
      </div>

      {savedCount > 0 && (
        <div className="bg-success/10 border border-success/20 rounded-2xl p-3 mb-4 flex items-center gap-2 text-sm text-success font-bold">
          <CheckCircle2 className="w-4 h-4" /> {savedCount} listings saved to database this session
        </div>
      )}

      {/* Step 1: City */}
      <div className="bg-card rounded-2xl border border-border/50 p-4 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Step 1 — Select City</p>
        <div className="flex flex-wrap gap-2">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => setCity(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${city === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-secondary border-border hover:border-accent/40'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Category */}
      <div className="bg-card rounded-2xl border border-border/50 p-4 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Step 2 — Select Category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${category === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border hover:border-primary/40'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Search */}
      <button onClick={fetchData} disabled={loading}
        className="flex items-center gap-2 w-full bg-accent text-accent-foreground py-3.5 rounded-2xl font-bold text-sm justify-center mb-6 disabled:opacity-60 hover:opacity-90 transition-opacity">
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching the web… this takes ~20 seconds</>
          : <><Search className="w-4 h-4" /> Step 3 — Find Real Data for {CITIES.find(c => c.id === city)?.label} · {CATEGORIES.find(c => c.id === category)?.label}</>
        }
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="font-extrabold text-base">{results.length} listings found</h2>
              <p className="text-xs text-muted-foreground">{approvedCount} approved · {pendingResults.length} pending · {rejected.size} rejected</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setApproved(new Set(results.map((_, i) => i))); setRejected(new Set()); }}
                className="px-3 py-1.5 rounded-xl bg-success/10 text-success text-xs font-bold border border-success/30 hover:bg-success/20">
                ✓ Approve All
              </button>
              <button onClick={() => { setRejected(new Set(results.map((_, i) => i))); setApproved(new Set()); }}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold border border-red-400/30 hover:bg-red-500/20">
                ✗ Reject All
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {results.map((item, i) => (
              <ResultCard
                key={i} item={item}
                approved={approved.has(i)}
                rejected={rejected.has(i)}
                onApprove={() => toggle(approved, setApproved, i, rejected, setRejected)}
                onReject={() => toggle(rejected, setRejected, i, approved, setApproved)}
              />
            ))}
          </div>

          <button onClick={saveApproved} disabled={saving || approvedCount === 0}
            className="flex items-center gap-2 w-full bg-success text-success-foreground py-3.5 rounded-2xl font-bold text-sm justify-center disabled:opacity-50 hover:opacity-90 transition-opacity">
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Download className="w-4 h-4" /> Step 4 — Save {approvedCount} Approved Listings to Database</>
            }
          </button>
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" /> Activity Log</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {log.map((entry, i) => (
              <p key={i} className="text-[11px] font-mono text-muted-foreground">
                <span className="opacity-50 mr-2">{entry.t}</span>{entry.msg}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-secondary/50 rounded-2xl p-4 text-xs text-muted-foreground space-y-1.5">
        <p className="font-bold text-foreground mb-1">📋 Guidelines</p>
        {['All saved listings start as is_verified: false — promote manually after verification', 'Call phone numbers to verify before marking is_verified: true', 'Re-run monthly to catch closed businesses', 'Admin can promote listings via the Services entity manager'].map((r, i) => (
          <div key={i} className="flex items-start gap-2"><ShieldCheck className="w-3 h-3 text-success shrink-0 mt-0.5" />{r}</div>
        ))}
      </div>
    </div>
  );
}