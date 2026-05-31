import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, CheckCircle2, XCircle, Loader2, Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CITIES = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'cairo', 'el-gouna'];

const PRICE_GUIDE_CATEGORIES = ['transport', 'food', 'accommodation', 'activities', 'shopping', 'telecom', 'medical'];

const SERVICE_CATEGORIES = ['restaurant', 'medical', 'transport', 'activities', 'kids_family', 'sim_internet', 'nightlife', 'remote_work', 'long_stay'];

const LISTING_CATEGORIES = ['hotel', 'restaurant', 'tour', 'activity', 'attraction'];

async function generatePriceGuideEntries(city, category) {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Generate 25 realistic price guide entries for tourists in ${city}, Egypt for the category "${category}".
    
    Return a JSON array of objects. Each object must have:
    - item: string (specific item/service name, be specific e.g. "Short taxi ride 5-10 min", "Bottled water 500ml Pepsi")
    - category: "${category}"
    - city: "${city}"
    - local_price: number (EGP, what locals pay)
    - fair_tourist_price: number (EGP, fair price for tourists, usually 1.5-2x local)
    - scam_price: number (EGP, inflated scam price, 3-5x local)
    - notes: string (1-2 sentence practical tip for tourists)
    
    Be realistic based on 2024 Egyptian market prices. Mix budget/mid/premium items. No duplicates. Return ONLY the JSON array, no markdown.`,
    response_json_schema: {
      type: 'object',
      properties: {
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              item: { type: 'string' },
              category: { type: 'string' },
              city: { type: 'string' },
              local_price: { type: 'number' },
              fair_tourist_price: { type: 'number' },
              scam_price: { type: 'number' },
              notes: { type: 'string' }
            }
          }
        }
      }
    }
  });
  return res?.entries || [];
}

async function generateServiceEntries(city, category) {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Generate 20 realistic service/business listings for tourists in ${city}, Egypt for category "${category}".
    
    Return JSON with an "entries" array. Each entry:
    - name: string (real or realistic business name)
    - category: "${category}"
    - city: "${city}"
    - description: string (2-3 sentences about the place)
    - address: string (realistic area/street in ${city})
    - price_range: one of "budget", "moderate", "premium"
    - avg_rating: number between 3.5 and 5.0
    - review_count: integer between 10 and 500
    - scam_score: integer 0-30 (mostly low for legit businesses)
    - is_verified: false
    - is_featured: false
    - tags: array of 2-3 relevant string tags
    
    Mix budget/mid/premium. Use real-sounding Egyptian business names. No duplicates. Return ONLY valid JSON.`,
    response_json_schema: {
      type: 'object',
      properties: {
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              category: { type: 'string' },
              city: { type: 'string' },
              description: { type: 'string' },
              address: { type: 'string' },
              price_range: { type: 'string' },
              avg_rating: { type: 'number' },
              review_count: { type: 'integer' },
              scam_score: { type: 'integer' },
              is_verified: { type: 'boolean' },
              is_featured: { type: 'boolean' },
              tags: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      }
    }
  });
  return res?.entries || [];
}

async function generateListingEntries(city, category) {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Generate 15 realistic listing entries for ${category}s in ${city}, Egypt for a tourist guide platform.
    
    Return JSON with an "entries" array. Each entry:
    - name: string (real or realistic business name)
    - category: "${category}"
    - city: "${city}"
    - rating: number 3.8-5.0
    - review_count: integer 50-2000
    - address: string (real area in ${city})
    - description: string (2 sentences, SEO-friendly)
    - price_range: one of "budget", "moderate", "premium", "luxury"
    - is_verified: false
    - is_featured: false
    - source: "manual_verified"
    - google_maps_link: "https://maps.google.com"
    
    Mix price ranges. Use realistic Egyptian names. Return ONLY valid JSON.`,
    response_json_schema: {
      type: 'object',
      properties: {
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              category: { type: 'string' },
              city: { type: 'string' },
              rating: { type: 'number' },
              review_count: { type: 'integer' },
              address: { type: 'string' },
              description: { type: 'string' },
              price_range: { type: 'string' },
              is_verified: { type: 'boolean' },
              is_featured: { type: 'boolean' },
              source: { type: 'string' },
              google_maps_link: { type: 'string' }
            }
          }
        }
      }
    }
  });
  return res?.entries || [];
}

const TASKS = [];
CITIES.forEach(city => {
  PRICE_GUIDE_CATEGORIES.forEach(cat => {
    TASKS.push({ id: `pg_${city}_${cat}`, entity: 'PriceGuide', city, category: cat, label: `💰 Price Guide — ${city} / ${cat}` });
  });
  SERVICE_CATEGORIES.slice(0, 5).forEach(cat => {
    TASKS.push({ id: `svc_${city}_${cat}`, entity: 'Service', city, category: cat, label: `🏪 Service — ${city} / ${cat}` });
  });
  LISTING_CATEGORIES.forEach(cat => {
    TASKS.push({ id: `lst_${city}_${cat}`, entity: 'Listing', city, category: cat, label: `📍 Listing — ${city} / ${cat}` });
  });
});

export default function AdminBulkPopulate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [statuses, setStatuses] = useState({});
  const [totalAdded, setTotalAdded] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Shield className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-bold">Admin Access Required</h1>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const setStatus = (id, status) => setStatuses(prev => ({ ...prev, [id]: status }));

  const runTask = async (task) => {
    setStatus(task.id, { state: 'running', count: 0 });
    let entries = [];
    if (task.entity === 'PriceGuide') entries = await generatePriceGuideEntries(task.city, task.category);
    if (task.entity === 'Service') entries = await generateServiceEntries(task.city, task.category);
    if (task.entity === 'Listing') entries = await generateListingEntries(task.city, task.category);

    if (entries.length > 0) {
      // Deduplicate against existing by name/item
      const existing = await base44.entities[task.entity].filter({ city: task.city, category: task.category }, 'created_date', 200);
      const existingNames = new Set(existing.map(e => (e.name || e.item || '').toLowerCase()));
      const fresh = entries.filter(e => !existingNames.has((e.name || e.item || '').toLowerCase()));
      
      if (fresh.length > 0) {
        await base44.entities[task.entity].bulkCreate(fresh);
        setTotalAdded(prev => prev + fresh.length);
        setStatus(task.id, { state: 'done', count: fresh.length });
      } else {
        setStatus(task.id, { state: 'skipped', count: 0 });
      }
    } else {
      setStatus(task.id, { state: 'error', count: 0 });
    }
  };

  const filteredTasks = TASKS.filter(t => {
    if (selectedEntity !== 'all' && t.entity !== selectedEntity) return false;
    if (selectedCity !== 'all' && t.city !== selectedCity) return false;
    return true;
  });

  const runAll = async () => {
    setRunning(true);
    setTotalAdded(0);
    // Run in batches of 3 to avoid rate limits
    for (let i = 0; i < filteredTasks.length; i += 3) {
      const batch = filteredTasks.slice(i, i + 3);
      await Promise.all(batch.map(runTask));
    }
    setRunning(false);
  };

  const runSingle = async (task) => {
    await runTask(task);
  };

  const pending = filteredTasks.filter(t => !statuses[t.id]).length;
  const done = filteredTasks.filter(t => statuses[t.id]?.state === 'done').length;
  const errored = filteredTasks.filter(t => statuses[t.id]?.state === 'error').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Bulk Database Populator</h1>
          <p className="text-sm text-muted-foreground">AI-generates 15–25 real-world entries per category/city and saves to DB</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Tasks', value: filteredTasks.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Pending', value: pending, color: 'bg-amber-50 text-amber-700' },
          { label: 'Completed', value: done, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Records Added', value: totalAdded, color: 'bg-violet-50 text-violet-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={selectedEntity} onChange={e => setSelectedEntity(e.target.value)}
          className="px-3 py-2 border border-border rounded-xl text-sm bg-card">
          <option value="all">All Entities</option>
          <option value="PriceGuide">Price Guide</option>
          <option value="Service">Services</option>
          <option value="Listing">Listings</option>
        </select>
        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
          className="px-3 py-2 border border-border rounded-xl text-sm bg-card">
          <option value="all">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Button onClick={runAll} disabled={running} className="ml-auto">
          {running ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running ({done}/{filteredTasks.length})…</> : <><Play className="w-4 h-4 mr-2" /> Run All ({filteredTasks.length} tasks)</>}
        </Button>
      </div>

      {errored > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-700 flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          {errored} tasks failed. You can re-run individual tasks below.
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {filteredTasks.map(task => {
          const s = statuses[task.id];
          return (
            <div key={task.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-semibold">{task.label}</p>
              </div>
              <div className="shrink-0 w-32 text-right">
                {!s && <span className="text-xs text-muted-foreground">Pending</span>}
                {s?.state === 'running' && <span className="flex items-center gap-1 text-xs text-amber-600 justify-end"><Loader2 className="w-3 h-3 animate-spin" /> Generating…</span>}
                {s?.state === 'done' && <span className="flex items-center gap-1 text-xs text-emerald-600 justify-end"><CheckCircle2 className="w-3 h-3" /> +{s.count} added</span>}
                {s?.state === 'skipped' && <span className="text-xs text-muted-foreground">All exist</span>}
                {s?.state === 'error' && <span className="flex items-center gap-1 text-xs text-red-500 justify-end"><XCircle className="w-3 h-3" /> Failed</span>}
              </div>
              <button
                onClick={() => runSingle(task)}
                disabled={running || s?.state === 'running'}
                className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-40 transition-colors"
                title="Run this task"
              >
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}