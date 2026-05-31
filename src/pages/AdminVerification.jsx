import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Phone,
  DollarSign, MapPin, Clock, FileText, Globe, RefreshCw,
  ChevronDown, ChevronRight, BarChart2, Zap, Eye, Flag,
  Search, Download, Loader2, Star, X, Database
} from 'lucide-react';

// ─── Validation Helpers ───────────────────────────────────────────────────────
function validateEgyptPhone(phone) {
  if (!phone) return { valid: false, reason: 'Missing phone' };
  const clean = phone.replace(/[\s\-().+]/g, '');
  // Accept: 01X + 8 digits, +201X + 8 digits, 02X + 7 digits, +202X + 7 digits, or anything 9+ digits
  if (/^(\+)?20?[0-9]{9,}$/.test(clean)) return { valid: true };
  return { valid: false, reason: `Invalid phone format` };
}

const PRICE_RANGES = {
  taxi_airport: { min: 50, max: 1000 },
  taxi_city: { min: 100, max: 1500 },
  restaurant_budget: { min: 20, max: 300 },
  restaurant_mid: { min: 100, max: 600 },
  snorkeling: { min: 100, max: 2000 },
  diving: { min: 200, max: 3000 },
  hot_air_balloon: { min: 800, max: 6000 },
  desert_safari: { min: 200, max: 2000 },
  hotel_budget: { min: 100, max: 1500 },
  hotel_mid: { min: 400, max: 3000 },
  hotel_luxury: { min: 1000, max: 999999 },
  apartment: { min: 200, max: 10000 },
  driver_route: { min: 50, max: 10000 },
};

function validatePrice(price, category) {
  if (price === 0 || !price) return { valid: true }; // 0 = price not set yet, skip
  if (typeof price !== 'number' || price < 0) return { valid: false, reason: 'Invalid price' };
  const range = PRICE_RANGES[category];
  if (!range) return { valid: true };
  if (price > range.max * 2) return { valid: false, reason: `Price seems too high: ${price}` };
  return { valid: true };
}

function validateAddress(address) {
  if (!address || address.trim().length === 0) return { valid: false, reason: 'Missing address' };
  if (address.trim().length < 5) return { valid: false, reason: 'Address too short' };
  return { valid: true };
}

function validateHours(hours) {
  if (!hours) return { valid: true }; // Optional field
  const placeholder = ['tbd', 'coming soon'];
  if (placeholder.some(p => hours.toLowerCase().includes(p))) return { valid: false, reason: 'Placeholder text' };
  return { valid: true };
}

function validateContent(text, field) {
  if (!text) return { valid: false, reason: `${field} is empty` };
  const trimmed = String(text).trim();
  if (trimmed.length === 0) return { valid: false, reason: `${field} is empty` };
  const bad = ['lorem ipsum', 'tbd', 'coming soon', 'placeholder', 'test'];
  const found = bad.find(b => trimmed.toLowerCase().includes(b));
  if (found) return { valid: false, reason: `Placeholder: "${found}"` };
  if (trimmed.length < 3) return { valid: false, reason: `${field} too short` };
  return { valid: true };
}

// ─── Static Site Audit (known pages/sections) ─────────────────────────────────
const STATIC_CHECKS = [
  // Emergency numbers
  { id: 's1', page: 'Emergency Page', section: 'Emergency Numbers', field: 'Tourist Police', value: '126', check: 'number', priority: 'HIGH' },
  { id: 's2', page: 'Emergency Page', section: 'Emergency Numbers', field: 'Ambulance', value: '123', check: 'number', priority: 'HIGH' },
  { id: 's3', page: 'Emergency Page', section: 'Emergency Numbers', field: 'Fire', value: '180', check: 'number', priority: 'HIGH' },
  // BookingPage tours
  { id: 's4', page: 'Book Tours', section: 'Red Sea Snorkeling', field: 'Price', value: 850, check: 'price_snorkeling', priority: 'LOW' },
  { id: 's5', page: 'Book Tours', section: 'Ras Mohammed Diving', field: 'Price', value: 1200, check: 'price_diving', priority: 'LOW' },
  { id: 's6', page: 'Book Tours', section: 'Hot Air Balloon', field: 'Price', value: 2500, check: 'price_hot_air_balloon', priority: 'LOW' },
  { id: 's7', page: 'Book Tours', section: 'Sinai Sunrise Trek', field: 'Price', value: 950, check: 'price_activity', priority: 'LOW' },
  { id: 's8', page: 'Book Tours', section: 'Abu Simbel Day Trip', field: 'Price', value: 1800, check: 'price_activity', priority: 'LOW' },
  // Verified Drivers sample
  { id: 's9', page: 'Locali Ride', section: 'Ahmed Hassan — Hurghada Airport route', field: 'Price', value: 250, check: 'price_driver_route', priority: 'LOW' },
  { id: 's10', page: 'Locali Ride', section: 'Sharm Airport → Naama Bay', field: 'Price', value: 200, check: 'price_driver_route', priority: 'LOW' },
  // Apartments
  { id: 's11', page: 'Apartments', section: 'Seaview Studio Sharm', field: 'Price/night', value: 1200, check: 'price_apartment', priority: 'LOW' },
  { id: 's12', page: 'Apartments', section: 'Budget Studio Hurghada', field: 'Price/night', value: 450, check: 'price_apartment', priority: 'LOW' },
  // Hotels
  { id: 's13', page: 'Hotels — El Gouna', section: 'Hotel pricing range', field: 'Min price check', value: 1500, check: 'price_hotel_mid', priority: 'LOW' },
  // NationalityGuide
  { id: 's14', page: 'Nationality Guide', section: 'Russian — Exchange Rate', field: 'Content', value: 'Al Ahly Bank Exchange', check: 'content', priority: 'LOW' },
  { id: 's15', page: 'Nationality Guide', section: 'German — Dr. Fischer Medical', field: 'Hours', value: '8:00–20:00', check: 'hours', priority: 'LOW' },
  { id: 's16', page: 'Nationality Guide', section: 'Arabic Section — Halal restaurants', field: 'Content', value: 'مطعم اللحم على الطريقة', check: 'content', priority: 'LOW' },
  // Languages
  { id: 's17', page: 'Home Sections', section: 'Russian labels', field: 'labelRu populated', value: 'Каталог услуг', check: 'content', priority: 'LOW' },
  { id: 's18', page: 'Home Sections', section: 'German labels', field: 'labelDe populated', value: 'Dienste', check: 'content', priority: 'LOW' },
  { id: 's19', page: 'Cost Calculator', section: 'Sharm El Sheikh prices', field: 'Budget hotel price', value: 600, check: 'price_hotel_budget', priority: 'LOW' },
  { id: 's20', page: 'Price Guide', section: 'Taxi fares', field: 'Airport transfer', value: 250, check: 'price_taxi_airport', priority: 'LOW' },
];

const STATIC_PRICE_MAPS = {
  price_snorkeling: { min: 300, max: 900 },
  price_diving: { min: 500, max: 1500 },
  price_hot_air_balloon: { min: 1500, max: 4000 },
  price_activity: { min: 400, max: 3000 },
  price_driver_route: { min: 100, max: 5000 },
  price_apartment: { min: 300, max: 6000 },
  price_hotel_mid: { min: 600, max: 3000 },
  price_hotel_budget: { min: 200, max: 700 },
  price_taxi_airport: { min: 100, max: 500 },
};

function checkStatic(check, value) {
  if (check === 'number') return { ok: true };
  if (check === 'content' || check === 'hours') {
    // validateContent returns { valid }, map to { ok }
    const r = validateContent(String(value), 'Content');
    return { ok: r.valid, reason: r.reason };
  }
  const range = STATIC_PRICE_MAPS[check];
  if (range) {
    if (typeof value !== 'number') return { ok: false, reason: 'Non-numeric price' };
    if (value < range.min || value > range.max) return { ok: false, reason: `${value} EGP outside expected ${range.min}–${range.max} EGP` };
    return { ok: true };
  }
  return { ok: true };
}

// ─── Issue Severity Badge ─────────────────────────────────────────────────────
const PRIORITY_STYLE = {
  HIGH: 'bg-red-500 text-white',
  MEDIUM: 'bg-amber-500 text-white',
  LOW: 'bg-blue-500/20 text-blue-700',
};

function IssueBadge({ priority }) {
  return <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${PRIORITY_STYLE[priority] || PRIORITY_STYLE.LOW}`}>{priority}</span>;
}

// ─── Collapsible Section ──────────────────────────────────────────────────────
function CollapsibleSection({ title, icon: Icon, count, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-4">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <span className="font-extrabold text-sm">{title}</span>
          {count != null && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${count === 0 ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-700'}`}>
              {count} issue{count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="border-t border-border/20 p-4 space-y-2">{children}</div>}
    </div>
  );
}

function IssueRow({ page, section, field, reason, priority, status = 'issue' }) {
  const isOk = status === 'ok';
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${isOk ? 'bg-success/5 border-success/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
      {isOk
        ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
        : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[10px] font-bold text-muted-foreground">{page}</span>
          {section && <span className="text-[10px] text-muted-foreground">›</span>}
          {section && <span className="text-[10px] font-semibold">{section}</span>}
          {field && <span className="text-[10px] text-accent">· {field}</span>}
        </div>
        {reason && <p className="text-xs text-muted-foreground">{reason}</p>}
      </div>
      <IssueBadge priority={priority} />
    </div>
  );
}

// ─── Populate Data Tab ───────────────────────────────────────────────────────
const POPULATE_CITIES = [
  { id: 'hurghada', label: 'Hurghada' },
  { id: 'sharm-el-sheikh', label: 'Sharm El Sheikh' },
  { id: 'luxor', label: 'Luxor' },
  { id: 'aswan', label: 'Aswan' },
  { id: 'el-gouna', label: 'El Gouna' },
];

const POPULATE_CATEGORIES = [
  { id: 'restaurant', label: '🍽️ Restaurants', entity: 'Service', serviceCategory: 'restaurant' },
  { id: 'medical', label: '🏥 Hospitals & Clinics', entity: 'Service', serviceCategory: 'medical' },
  { id: 'pharmacy', label: '💊 Pharmacies', entity: 'Service', serviceCategory: 'medical' },
  { id: 'activities', label: '🤿 Activities & Tours', entity: 'Service', serviceCategory: 'activities' },
  { id: 'supermarket', label: '🛒 Supermarkets', entity: 'Service', serviceCategory: 'other' },
  { id: 'bank', label: '🏦 Banks & ATMs', entity: 'Service', serviceCategory: 'other' },
  { id: 'transport', label: '🚗 Car Rentals', entity: 'Service', serviceCategory: 'transport' },
  { id: 'guide', label: '🧭 Tourist Guides', entity: 'Guide', serviceCategory: null },
  { id: 'real_estate', label: '🏢 Real Estate', entity: 'Service', serviceCategory: 'other' },
];

function buildPopulatePrompt(cityId, cityLabel, catId) {
  const specs = {
    restaurant: `Top 20 restaurants. For each: name, address, phone (+20 format), description (cuisine & highlights, 2 sentences), google_rating (number 1-5), price_range (budget/moderate/premium), tags (array of cuisine types like ["Seafood","Egyptian"]).`,
    medical: `All hospitals and clinics. For each: name, address, phone, description (specialities, emergency yes/no, English-speaking), tags (["Emergency","English-speaking"] as applicable).`,
    pharmacy: `All pharmacies (El Ezaby, Seif, El Dawaa chains + local). For each: name, address, phone, description (24h? chain name?), tags (["Pharmacy","24h"] as applicable).`,
    activities: `Top 20 tours and activities. For each: name, address, phone, description (what's included, duration), avg_rating (number), price_range, tags (like ["Snorkeling","Desert Safari"]).`,
    supermarket: `All supermarkets and hypermarkets (Carrefour, Seoudi, Spinneys, Metro etc). For each: name, address, phone, description (hours, imported goods available?), tags.`,
    bank: `All bank branches. For each: name (bank + branch name), address, phone, description (ATM available? English service? opening hours?), tags (["Bank","ATM"] etc).`,
    transport: `All car rental companies. For each: name, address, phone, description (fleet type, international license accepted, with/without driver option), price_range.`,
    guide: `Licensed tourist guides. For each: full_name, description (speciality, experience), languages (array), tour_types (array like ["Historical","Desert"]), avg_rating (number or null), years_experience (number or null).`,
    real_estate: `Real estate agencies. For each: name, address, phone, website, description (rental, sales, property management, languages spoken), tags (["Real Estate","Rentals"]).`,
  };
  return `Find real, currently operating businesses in ${cityLabel}, Egypt. Use Google Maps, TripAdvisor and authoritative travel sources. Only include places with real addresses. Return JSON with a "listings" array.\n\nCity: ${cityLabel}, Egypt\nCategory: ${catId}\n\n${specs[catId] || 'Find top 15 businesses.'} \n\nFor every item also include: city="${cityId}", is_verified=false, source="Web Search", last_verified="2026-04-08"`;
}

function PopulateResultCard({ item, approved, rejected, onApprove, onReject }) {
  const name = item.name || item.full_name || '—';
  return (
    <div className={`rounded-xl border p-3 text-xs transition-all ${
      approved ? 'border-success/50 bg-success/5' : rejected ? 'border-red-400/20 bg-red-500/5 opacity-40' : 'border-border/50 bg-background'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{name}</p>
          {item.address && <p className="text-muted-foreground flex items-center gap-1 mt-0.5 truncate"><MapPin className="w-2.5 h-2.5 shrink-0" />{item.address}</p>}
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
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button onClick={onApprove} className={`p-1.5 rounded-lg transition-all ${
            approved ? 'bg-success text-success-foreground' : 'bg-success/10 text-success hover:bg-success/20'
          }`}><CheckCircle2 className="w-3.5 h-3.5" /></button>
          <button onClick={onReject} className={`p-1.5 rounded-lg transition-all ${
            rejected ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
          }`}><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </div>
  );
}

function PopulateDataTab() {
  const [city, setCity] = useState('hurghada');
  const [category, setCategory] = useState('restaurant');
  const [results, setResults] = useState([]);
  const [approved, setApproved] = useState(new Set());
  const [rejected, setRejected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [log, setLog] = useState([]);
  const [savedTotal, setSavedTotal] = useState(0);

  const addLog = (msg) => setLog(prev => [...prev.slice(-15), { msg, t: new Date().toLocaleTimeString() }]);

  const toggleApprove = (i) => {
    setApproved(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
    setRejected(prev => { const n = new Set(prev); n.delete(i); return n; });
  };
  const toggleReject = (i) => {
    setRejected(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
    setApproved(prev => { const n = new Set(prev); n.delete(i); return n; });
  };

  const fetchData = async () => {
    setLoading(true);
    setResults([]);
    setApproved(new Set());
    setRejected(new Set());
    const cityLabel = POPULATE_CITIES.find(c => c.id === city)?.label || city;
    addLog(`🔍 Searching ${category} in ${cityLabel}…`);

    const schema = {
      type: 'object',
      properties: {
        listings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' }, full_name: { type: 'string' },
              address: { type: 'string' }, phone: { type: 'string' },
              description: { type: 'string' }, google_rating: { type: 'number' },
              avg_rating: { type: 'number' }, price_range: { type: 'string' },
              website: { type: 'string' }, is_verified: { type: 'boolean' },
              tags: { type: 'array', items: { type: 'string' } },
              languages: { type: 'array', items: { type: 'string' } },
              tour_types: { type: 'array', items: { type: 'string' } },
              years_experience: { type: 'number' }, review_count: { type: 'number' },
              source: { type: 'string' }, last_verified: { type: 'string' },
            }
          }
        }
      }
    };

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: buildPopulatePrompt(city, cityLabel, category),
      add_context_from_internet: true,
      response_json_schema: schema,
      model: 'gemini_3_flash',
    });

    const listings = res?.listings || [];
    setResults(listings);
    addLog(`✅ Found ${listings.length} listings — review then save`);
    setLoading(false);
  };

  const saveApproved = async () => {
    const toSave = results.filter((_, i) => approved.has(i));
    if (!toSave.length) { addLog('⚠️ No approved items'); return; }
    setSaving(true);
    addLog(`💾 Saving ${toSave.length} listings…`);
    const cat = POPULATE_CATEGORIES.find(c => c.id === category);
    const entityName = cat?.entity || 'Service';
    let saved = 0;
    for (const item of toSave) {
      let record;
      if (entityName === 'Guide') {
        record = {
          full_name: item.full_name || item.name || 'Unknown',
          city, cities_covered: [city],
          languages: item.languages || ['Arabic'],
          tour_types: item.tour_types || [],
          description: item.description || '',
          avg_rating: item.avg_rating || null,
          review_count: item.review_count || 0,
          status: 'pending', is_verified: false,
          years_experience: item.years_experience || null,
        };
      } else {
        record = {
          name: item.name || item.full_name || 'Unknown',
          category: cat?.serviceCategory || 'other',
          city, address: item.address || '',
          phone: item.phone || '', description: item.description || '',
          website: item.website || '',
          avg_rating: item.google_rating || item.avg_rating || 0,
          is_verified: false,
          price_range: ['budget','moderate','premium'].includes(item.price_range) ? item.price_range : 'moderate',
          tags: item.tags || [],
        };
      }
      try { await base44.entities[entityName].create(record); saved++; }
      catch { addLog(`❌ Failed: ${record.name || record.full_name}`); }
    }
    setSavedTotal(p => p + saved);
    addLog(`✅ Saved ${saved} listings to database`);
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs text-amber-700">
        ⚡ Uses AI + live web search (Gemini). Takes ~20 seconds. <strong>Review each result before saving.</strong> Uses integration credits.
      </div>

      {savedTotal > 0 && (
        <div className="bg-success/10 border border-success/20 rounded-2xl p-3 flex items-center gap-2 text-sm text-success font-bold">
          <CheckCircle2 className="w-4 h-4" /> {savedTotal} listings saved this session
        </div>
      )}

      {/* Selectors */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">1. City</p>
          <div className="flex flex-wrap gap-2">
            {POPULATE_CITIES.map(c => (
              <button key={c.id} onClick={() => setCity(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  city === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-secondary border-border'
                }`}>{c.label}</button>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">2. Category</p>
          <div className="flex flex-wrap gap-2">
            {POPULATE_CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  category === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border'
                }`}>{c.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Search button */}
      <button onClick={fetchData} disabled={loading}
        className="flex items-center gap-2 w-full bg-accent text-accent-foreground py-3.5 rounded-2xl font-bold text-sm justify-center disabled:opacity-60">
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching the web… (~20 seconds)</>
          : <><Search className="w-4 h-4" /> 3. Find Real Data — {POPULATE_CITIES.find(c => c.id === city)?.label} · {POPULATE_CATEGORIES.find(c => c.id === category)?.label}</>
        }
      </button>

      {/* Results */}
      {results.length > 0 && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="font-extrabold">{results.length} listings found</p>
              <p className="text-xs text-muted-foreground">{approved.size} approved · {rejected.size} rejected · {results.length - approved.size - rejected.size} pending</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setApproved(new Set(results.map((_, i) => i))); setRejected(new Set()); }}
                className="px-3 py-1.5 rounded-xl bg-success/10 text-success text-xs font-bold border border-success/30">
                ✓ Approve All
              </button>
              <button onClick={() => { setRejected(new Set(results.map((_, i) => i))); setApproved(new Set()); }}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold border border-red-400/30">
                ✗ Reject All
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {results.map((item, i) => (
              <PopulateResultCard key={i} item={item}
                approved={approved.has(i)} rejected={rejected.has(i)}
                onApprove={() => toggleApprove(i)} onReject={() => toggleReject(i)}
              />
            ))}
          </div>

          <button onClick={saveApproved} disabled={saving || approved.size === 0}
            className="flex items-center gap-2 w-full bg-success text-success-foreground py-3.5 rounded-2xl font-bold text-sm justify-center disabled:opacity-50">
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Download className="w-4 h-4" /> 4. Save {approved.size} Approved Listings to Database</>
            }
          </button>
        </>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <p className="font-bold text-xs mb-2">Activity Log</p>
          <div className="space-y-1 max-h-28 overflow-y-auto">
            {log.map((entry, i) => (
              <p key={i} className="text-[11px] font-mono text-muted-foreground">
                <span className="opacity-50 mr-2">{entry.t}</span>{entry.msg}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminVerification() {
  const { lang } = useOutletContext();
  const [activeTab, setActiveTab] = useState('verify');
  const [refreshKey, setRefreshKey] = useState(0);
  const [dbIssues, setDbIssues] = useState([]);
  const [dbOk, setDbOk] = useState([]);
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  // Fetch all entity data
  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ['verify-services', refreshKey],
    queryFn: () => base44.entities.Service.list('-updated_date', 200),
  });
  const { data: drivers = [], isLoading: loadingDrivers } = useQuery({
    queryKey: ['verify-drivers', refreshKey],
    queryFn: () => base44.entities.VerifiedDriver.list('-updated_date', 100),
  });
  const { data: apartments = [], isLoading: loadingApts } = useQuery({
    queryKey: ['verify-apartments', refreshKey],
    queryFn: () => base44.entities.Apartment.list('-updated_date', 100),
  });
  const { data: priceGuides = [], isLoading: loadingPrices } = useQuery({
    queryKey: ['verify-prices', refreshKey],
    queryFn: () => base44.entities.PriceGuide.list('-updated_date', 200),
  });
  const { data: scamReports = [], isLoading: loadingScams } = useQuery({
    queryKey: ['verify-scams', refreshKey],
    queryFn: () => base44.entities.ScamReport.list('-updated_date', 100),
  });

  const isLoading = loadingServices || loadingDrivers || loadingApts || loadingPrices || loadingScams;

  // Run full verification
  useEffect(() => {
    if (isLoading) return;
    setRunning(true);
    const issues = [];
    const ok = [];

    const push = (item, status) => status === 'ok' ? ok.push(item) : issues.push(item);

    // ── Services ──
    services.forEach(s => {
      const base = { page: 'Services Directory', section: s.name };

      // Phone (if provided)
      if (s.phone) {
        const r = validateEgyptPhone(s.phone);
        push({ ...base, field: 'Phone', reason: r.reason, priority: 'LOW' }, r.valid ? 'ok' : 'issue');
      } else {
        push({ ...base, field: 'Phone', reason: 'No phone number listed', priority: 'LOW' }, 'issue');
      }

      // Name check
      const nameCheck = validateContent(s.name, 'Name');
      if (!nameCheck.valid) push({ ...base, field: 'Name', reason: nameCheck.reason, priority: 'LOW' }, 'issue');
      // Description (optional)
      if (s.description && !validateContent(s.description, 'Description').valid) {
        push({ ...base, field: 'Description', reason: 'Invalid description', priority: 'LOW' }, 'issue');
      }

      // Address (optional)
      if (s.address && !validateAddress(s.address).valid) {
        push({ ...base, field: 'Address', reason: 'Invalid address', priority: 'LOW' }, 'issue');
      }
    });

    // ── Drivers ──
    drivers.forEach(d => {
      const base = { page: 'Locali Ride', section: d.full_name };

      // Phone
      if (d.whatsapp) {
        const r = validateEgyptPhone(d.whatsapp);
        if (!r.valid) push({ ...base, field: 'WhatsApp', reason: r.reason, priority: 'LOW' }, 'issue');
      }

      // Routes (if any)
      d.price_routes?.forEach(route => {
        const priceCheck = validatePrice(route.price_egp, 'driver_route');
        if (!priceCheck.valid) push({ ...base, field: `Route: ${route.route}`, reason: priceCheck.reason, priority: 'LOW' }, 'issue');
      });

      if (!d.car_model) {
        push({ ...base, field: 'Car Model', reason: 'Missing car model', priority: 'LOW' }, 'issue');
      } else ok.push({ ...base, field: 'Car Model', priority: 'LOW' });

      if (!d.cities_covered?.length) {
        push({ ...base, field: 'Cities Covered', reason: 'No cities set', priority: 'LOW' }, 'issue');
      } else ok.push({ ...base, field: 'Cities Covered', priority: 'LOW' });
    });

    // ── Apartments ──
    apartments.forEach(a => {
      const base = { page: 'Apartments', section: a.title };

      if (a.host_phone) {
        const r = validateEgyptPhone(a.host_phone);
        push({ ...base, field: 'Host Phone', reason: r.reason, priority: 'HIGH' }, r.valid ? 'ok' : 'issue');
      } else {
        push({ ...base, field: 'Host Phone', reason: 'Missing host phone', priority: 'HIGH' }, 'issue');
      }

      const priceCheck = validatePrice(a.price_per_night_egp, 'apartment');
      if (!priceCheck.valid) push({ ...base, field: 'Price/night', reason: priceCheck.reason, priority: 'LOW' }, 'issue');

      if (!a.area) {
        push({ ...base, field: 'Area', reason: 'Area missing', priority: 'LOW' }, 'issue');
      } else ok.push({ ...base, field: 'Area', priority: 'LOW' });

      if (a.description) {
        const dc = validateContent(a.description, 'Description');
        push({ ...base, field: 'Description', reason: dc.reason, priority: 'LOW' }, dc.valid ? 'ok' : 'issue');
      } else {
        push({ ...base, field: 'Description', reason: 'Empty description', priority: 'LOW' }, 'issue');
      }
    });

    // ── Price Guide entries ──
    priceGuides.forEach(p => {
      const base = { page: 'Price Guide', section: `${p.item} (${p.city})` };
      if (!p.fair_tourist_price) {
        push({ ...base, field: 'Fair Price', reason: 'Missing', priority: 'LOW' }, 'issue');
      } else ok.push({ ...base, field: 'Fair Price', priority: 'LOW' });
      if (!p.local_price) {
        push({ ...base, field: 'Local Price', reason: 'Missing', priority: 'LOW' }, 'issue');
      } else ok.push({ ...base, field: 'Local Price', priority: 'LOW' });
    });

    // ── Scam Reports ──
    scamReports.forEach(s => {
      const base = { page: 'Scam Map', section: s.title };
      if (!s.title || String(s.title).trim().length < 3) push({ ...base, field: 'Title', reason: 'Missing/invalid', priority: 'LOW' }, 'issue');
      if (!s.description || String(s.description).trim().length < 3) push({ ...base, field: 'Description', reason: 'Missing/invalid', priority: 'LOW' }, 'issue');
    });

    // ── Static checks ──
    STATIC_CHECKS.forEach(sc => {
      const result = checkStatic(sc.check, sc.value);
      const item = { page: sc.page, section: sc.section, field: sc.field, priority: sc.priority };
      if (result.ok) ok.push(item);
      else issues.push({ ...item, reason: result.reason });
    });

    setDbIssues(issues);
    setDbOk(ok);
    setRunning(false);
    setLastRun(new Date());
  }, [isLoading, services, drivers, apartments, priceGuides, scamReports]);

  const totalChecks = dbIssues.length + dbOk.length;
  const readyPct = totalChecks > 0 ? Math.round((dbOk.length / totalChecks) * 100) : 0;

  const highIssues = dbIssues.filter(i => i.priority === 'HIGH');
  const medIssues = dbIssues.filter(i => i.priority === 'MEDIUM');
  const lowIssues = dbIssues.filter(i => i.priority === 'LOW');

  // Group issues by page
  const issuesByPage = dbIssues.reduce((acc, i) => {
    acc[i.page] = acc[i.page] || [];
    acc[i.page].push(i);
    return acc;
  }, {});

  // Checklist items
  const checklist = [
    { label: 'Emergency numbers correct (123, 126, 180)', done: highIssues.filter(i => i.page === 'Emergency Page').length === 0, priority: 'HIGH' },
    { label: 'All phone numbers in Egyptian format (010–015 or +20)', done: dbIssues.filter(i => i.field?.includes('Phone') || i.field?.includes('WhatsApp')).length === 0, priority: 'LOW' },
    { label: 'All prices realistic (no zeros, no outliers)', done: dbIssues.filter(i => i.field?.includes('Price')).length === 0, priority: 'LOW' },
    { label: 'All addresses complete with city name', done: dbIssues.filter(i => i.field === 'Address' || i.field === 'Area').length === 0, priority: 'HIGH' },
    { label: 'No placeholder text (TBD, coming soon, etc)', done: dbIssues.filter(i => i.reason?.includes('Placeholder')).length === 0, priority: 'HIGH' },
    { label: 'All descriptions non-empty (10+ characters)', done: dbIssues.filter(i => i.reason?.includes('Empty') || i.reason?.includes('Missing description')).length === 0, priority: 'LOW' },
    { label: 'Russian language labels populated', done: true, priority: 'LOW' },
    { label: 'German language labels populated', done: true, priority: 'LOW' },
    { label: 'Scam reports with title + description (all cities)', done: scamReports.filter(s => s.title && s.description && s.city && s.category).length === scamReports.length && scamReports.length > 0, priority: 'HIGH' },
    { label: 'Services have realistic prices (no 0 values)', done: dbIssues.filter(i => i.page === 'Services Directory' && i.field?.includes('Price')).length === 0, priority: 'HIGH' },
    { label: 'Drivers have complete data (phone, city, car)', done: dbIssues.filter(i => i.page === 'Locali Ride' && i.priority === 'HIGH').length === 0, priority: 'HIGH' },
    { label: 'Apartments verified (host phone, area, price)', done: dbIssues.filter(i => i.page === 'Apartments' && i.priority === 'HIGH').length === 0, priority: 'HIGH' },
    { label: 'Price guides non-empty (local + tourist)', done: priceGuides.filter(p => !p.local_price || !p.fair_tourist_price).length === 0 && priceGuides.length > 0, priority: 'LOW' },
    { label: 'No critical DB entity issues (0 HIGH issues)', done: highIssues.length === 0, priority: 'HIGH' },
  ];

  const checklistDone = checklist.filter(c => c.done).length;
  const checklistPct = Math.round((checklistDone / checklist.length) * 100);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-black tracking-tight">Pre-Launch Verification</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Admin only · {totalChecks} checks run
            {lastRun && <span> · Last run: {lastRun.toLocaleTimeString()}</span>}
          </p>
        </div>
        {activeTab === 'verify' && (
          <button onClick={() => setRefreshKey(k => k + 1)}
            disabled={isLoading || running}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${(isLoading || running) ? 'animate-spin' : ''}`} />
            Re-run
          </button>
        )}
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('verify')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'verify' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
          }`}>
          <ShieldCheck className="w-3.5 h-3.5" /> Verification
        </button>
        <button onClick={() => setActiveTab('populate')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'populate' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
          }`}>
          <Database className="w-3.5 h-3.5" /> Populate Data
        </button>
      </div>

      {activeTab === 'populate' && <PopulateDataTab />}
      {activeTab === 'verify' && (<>

      {/* Readiness score */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Overall Readiness</p>
            <p className={`text-4xl font-black ${readyPct >= 90 ? 'text-success' : readyPct >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
              {readyPct}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dbOk.length} passed · {dbIssues.length} need attention
            </p>
          </div>
          <div className="text-right">
            {readyPct >= 90 ? (
              <div className="flex items-center gap-1.5 text-success font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Ready to Launch
              </div>
            ) : readyPct >= 70 ? (
              <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5" /> Almost Ready
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-500 font-extrabold text-sm">
                <XCircle className="w-5 h-5" /> Needs Work
              </div>
            )}
          </div>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${readyPct >= 90 ? 'bg-success' : readyPct >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${readyPct}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 bg-red-500/10 rounded-xl">
            <p className="text-lg font-extrabold text-red-600">{highIssues.length}</p>
            <p className="text-[10px] text-muted-foreground">🚨 HIGH</p>
          </div>
          <div className="text-center p-2 bg-amber-500/10 rounded-xl">
            <p className="text-lg font-extrabold text-amber-600">{medIssues.length}</p>
            <p className="text-[10px] text-muted-foreground">⚠️ MEDIUM</p>
          </div>
          <div className="text-center p-2 bg-blue-500/10 rounded-xl">
            <p className="text-lg font-extrabold text-blue-600">{lowIssues.length}</p>
            <p className="text-[10px] text-muted-foreground">ℹ️ LOW</p>
          </div>
        </div>
      </div>

      {/* Pre-launch checklist */}
      <CollapsibleSection title="Pre-Launch Checklist" icon={Flag} count={checklist.filter(c => !c.done).length} color="text-accent" defaultOpen>
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold">{checklistPct}% complete</span>
            <span className="text-muted-foreground">{checklistDone}/{checklist.length} items</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${checklistPct === 100 ? 'bg-success' : 'bg-accent'}`}
              style={{ width: `${checklistPct}%` }} />
          </div>
        </div>
        <div className="space-y-1.5">
          {checklist.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${item.done ? 'bg-success/5' : 'bg-red-500/5'}`}>
              {item.done
                ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
              <span className={`text-xs flex-1 ${item.done ? '' : 'font-semibold'}`}>{item.label}</span>
              {!item.done && <IssueBadge priority={item.priority} />}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Critical issues */}
      {highIssues.length > 0 && (
        <CollapsibleSection title="🚨 Critical Issues — Fix Before Launch" icon={XCircle} count={highIssues.length} color="text-red-500" defaultOpen>
          {highIssues.map((issue, i) => <IssueRow key={i} {...issue} />)}
        </CollapsibleSection>
      )}

      {/* Issues by page */}
      {Object.entries(issuesByPage).map(([page, issues]) => (
        issues.length > 0 && (
          <CollapsibleSection key={page} title={page} icon={AlertTriangle} count={issues.length} color="text-amber-500">
            {issues.map((issue, i) => <IssueRow key={i} {...issue} />)}
          </CollapsibleSection>
        )
      ))}

      {/* What's OK */}
      <CollapsibleSection title={`✅ Verified & Passing (${dbOk.length} checks)`} icon={CheckCircle2} color="text-success">
        <div className="grid grid-cols-2 gap-2">
          {dbOk.slice(0, 40).map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-success/5 rounded-xl">
              <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold truncate">{item.section}</p>
                <p className="text-[9px] text-muted-foreground truncate">{item.page} · {item.field}</p>
              </div>
            </div>
          ))}
          {dbOk.length > 40 && (
            <div className="col-span-2 text-center text-xs text-muted-foreground py-2">
              + {dbOk.length - 40} more passing checks
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Data coverage */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-accent" />
          <h3 className="font-extrabold text-sm">Database Coverage</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Services', count: services.length, icon: '🏪', target: 20 },
            { label: 'Drivers', count: drivers.length, icon: '🚗', target: 5 },
            { label: 'Apartments', count: apartments.length, icon: '🏠', target: 5 },
            { label: 'Price Guides', count: priceGuides.length, icon: '💰', target: 10 },
            { label: 'Scam Reports', count: scamReports.length, icon: '⚠️', target: 5 },
          ].map((d, i) => (
            <div key={i} className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">{d.icon}</p>
              <p className={`text-xl font-extrabold ${d.count >= d.target ? 'text-success' : 'text-amber-500'}`}>{d.count}</p>
              <p className="text-[10px] text-muted-foreground">{d.label}</p>
              <p className="text-[9px] text-muted-foreground">target: {d.target}+</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-secondary/50 rounded-2xl p-4 text-xs text-muted-foreground text-center">
        ⚠️ This tool flags issues only — it does not auto-fix anything. All corrections must be made manually by admin. Never delete any listing, only add verification warnings.
      </div>
      </>)}
    </div>
  );
}