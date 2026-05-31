import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Trash2, Zap, CheckCircle2, XCircle, Loader2, Play, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EL_GOUNA_AREAS = ['Abu Tig Marina', 'Downtown El Gouna', 'Mangroovy Beach', 'Ancient Sands', 'Kafr El Gouna', 'El Gouna Lagoon', 'Three Corners', 'El Gouna Golf Course Area'];

async function generateElGounaEntries(entity, category) {
  const areasList = EL_GOUNA_AREAS.join(', ');
  let prompt = '';

  if (entity === 'PriceGuide') {
    prompt = `Generate 30 realistic price guide entries for tourists in El Gouna, Egypt for the category "${category}".
El Gouna is a premium Red Sea resort town near Hurghada. Areas: ${areasList}.

Return JSON with "entries" array. Each entry:
- item: string (specific item/service, e.g. "Golf cart rental 1 hour", "Fresh juice at marina cafe")
- category: "${category}"
- city: "el-gouna"
- local_price: number (EGP)
- fair_tourist_price: number (EGP, 1.5-2x local, El Gouna is premium)
- scam_price: number (EGP, inflated price)
- notes: string (practical tip, mention El Gouna specifics)

El Gouna is upscale — prices are higher than typical Egypt. 2024 Egyptian prices. No duplicates. Return ONLY valid JSON.`;
  } else if (entity === 'Service') {
    prompt = `Generate 25 realistic service/business listings for El Gouna, Egypt for category "${category}".
El Gouna is a luxury resort town. Areas: ${areasList}.
Real places include: Hemingways, OZONE, Sandbar, The Captain's Inn, Sliders Burger Bar, Kiteflip, Aqua Sports El Gouna.

Return JSON with "entries" array. Each entry:
- name: string (real or realistic El Gouna business name)
- category: "${category}"
- city: "el-gouna"
- description: string (2-3 sentences, mention location/style)
- address: string (one of the El Gouna areas)
- price_range: one of "budget", "moderate", "premium"
- avg_rating: number 3.8-5.0
- review_count: integer 20-800
- scam_score: integer 0-15
- is_verified: false
- is_featured: false
- tags: array of 2-3 relevant tags

Mix budget/mid/premium. Mention marina, lagoon, beach, golf. Return ONLY valid JSON.`;
  } else if (entity === 'Listing') {
    prompt = `Generate 20 realistic listing entries for ${category}s in El Gouna, Egypt.
El Gouna is a self-contained luxury resort island town. Areas: ${areasList}.
Known places: Sheraton Miramar, Steigenberger Golf Resort, Three Corners Rihana, Sultan Bey Hotel, Club Med.

Return JSON with "entries" array. Each entry:
- name: string (real or realistic El Gouna business name)
- category: "${category}"
- city: "el-gouna"
- rating: number 3.9-5.0
- review_count: integer 100-3000
- address: string (specific El Gouna area)
- description: string (2 sentences, SEO-friendly, El Gouna specific)
- price_range: one of "budget", "moderate", "premium", "luxury"
- is_verified: false
- is_featured: false
- source: "manual_verified"
- google_maps_link: "https://maps.google.com"

Include mix of budget guesthouses to luxury resorts. Return ONLY valid JSON.`;
  }

  const res = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        entries: { type: 'array', items: { type: 'object' } }
      }
    }
  });
  return res?.entries || [];
}

const PG_CATEGORIES = ['transport', 'food', 'accommodation', 'activities', 'shopping', 'telecom', 'medical'];
const SVC_CATEGORIES = ['restaurant', 'medical', 'transport', 'activities', 'nightlife'];
const LST_CATEGORIES = ['hotel', 'restaurant', 'tour', 'activity', 'attraction'];

const POPULATE_TASKS = [
  ...PG_CATEGORIES.map(cat => ({ id: `pg_${cat}`, entity: 'PriceGuide', category: cat, label: `💰 Price Guide / ${cat}` })),
  ...SVC_CATEGORIES.map(cat => ({ id: `svc_${cat}`, entity: 'Service', category: cat, label: `🏪 Service / ${cat}` })),
  ...LST_CATEGORIES.map(cat => ({ id: `lst_${cat}`, entity: 'Listing', category: cat, label: `📍 Listing / ${cat}` })),
];

export default function AdminElGounaFix() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle'); // idle | deleting | populating | done
  const [deleteStats, setDeleteStats] = useState(null);
  const [taskStatuses, setTaskStatuses] = useState({});
  const [totalAdded, setTotalAdded] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Shield className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-bold">Admin Access Required</h1>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const setTaskStatus = (id, status) => setTaskStatuses(prev => ({ ...prev, [id]: status }));

  const deleteCairoEntries = async () => {
    setPhase('deleting');
    const stats = { PriceGuide: 0, Service: 0, Listing: 0 };

    for (const entity of ['PriceGuide', 'Service', 'Listing']) {
      let deleted = 0;
      let batch;
      do {
        batch = await base44.entities[entity].filter({ city: 'cairo' }, 'created_date', 100);
        for (const record of batch) {
          await base44.entities[entity].delete(record.id);
          deleted++;
        }
      } while (batch.length === 100);
      stats[entity] = deleted;
    }

    setDeleteStats(stats);
    return stats;
  };

  const populateElGouna = async () => {
    setPhase('populating');
    let added = 0;

    for (let i = 0; i < POPULATE_TASKS.length; i += 3) {
      const batch = POPULATE_TASKS.slice(i, i + 3);
      await Promise.all(batch.map(async (task) => {
        setTaskStatus(task.id, { state: 'running' });
        const entries = await generateElGounaEntries(task.entity, task.category);

        if (entries.length > 0) {
          const existing = await base44.entities[task.entity].filter({ city: 'el-gouna', category: task.category }, 'created_date', 200);
          const existingNames = new Set(existing.map(e => (e.name || e.item || '').toLowerCase()));
          const fresh = entries.filter(e => !existingNames.has((e.name || e.item || '').toLowerCase()));

          if (fresh.length > 0) {
            await base44.entities[task.entity].bulkCreate(fresh);
            added += fresh.length;
            setTotalAdded(prev => prev + fresh.length);
            setTaskStatus(task.id, { state: 'done', count: fresh.length });
          } else {
            setTaskStatus(task.id, { state: 'skipped', count: 0 });
          }
        } else {
          setTaskStatus(task.id, { state: 'error' });
        }
      }));
    }
  };

  const runAll = async () => {
    await deleteCairoEntries();
    await populateElGouna();
    setPhase('done');
  };

  const done = POPULATE_TASKS.filter(t => taskStatuses[t.id]?.state === 'done').length;
  const errored = POPULATE_TASKS.filter(t => taskStatuses[t.id]?.state === 'error').length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
          <Zap className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Cairo → El Gouna Fix</h1>
          <p className="text-sm text-muted-foreground">Remove all Cairo entries · Populate El Gouna with 400+ entries</p>
        </div>
      </div>

      {/* Confirmation warning */}
      {phase === 'idle' && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-red-800 mb-1">⚠️ This will permanently delete all Cairo entries</h2>
              <p className="text-sm text-red-700 mb-3">
                All PriceGuide, Service, and Listing records with <code className="bg-red-100 px-1 rounded">city = "cairo"</code> will be deleted. This cannot be undone.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="w-4 h-4" />
                <span className="text-sm font-semibold text-red-800">I understand — delete Cairo and populate El Gouna</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className={`rounded-2xl p-4 ${phase === 'deleting' ? 'bg-red-50 border-2 border-red-300' : deleteStats ? 'bg-emerald-50' : 'bg-secondary'}`}>
          <div className="flex items-center gap-2 mb-1">
            {phase === 'deleting' ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4 text-muted-foreground" />}
            <p className="text-xs font-bold uppercase tracking-wide">Step 1: Delete Cairo</p>
          </div>
          {deleteStats ? (
            <p className="text-sm text-emerald-700 font-bold">✓ {deleteStats.PriceGuide + deleteStats.Service + deleteStats.Listing} records deleted</p>
          ) : (
            <p className="text-xs text-muted-foreground">PriceGuide, Service, Listing</p>
          )}
        </div>
        <div className={`rounded-2xl p-4 ${phase === 'populating' ? 'bg-amber-50 border-2 border-amber-300' : phase === 'done' ? 'bg-emerald-50' : 'bg-secondary'}`}>
          <div className="flex items-center gap-2 mb-1">
            {phase === 'populating' ? <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> : <Zap className="w-4 h-4 text-muted-foreground" />}
            <p className="text-xs font-bold uppercase tracking-wide">Step 2: Populate El Gouna</p>
          </div>
          <p className="text-xs text-muted-foreground">{done}/{POPULATE_TASKS.length} tasks · {totalAdded} added</p>
        </div>
        <div className={`rounded-2xl p-4 ${phase === 'done' ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-secondary'}`}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className={`w-4 h-4 ${phase === 'done' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
            <p className="text-xs font-bold uppercase tracking-wide">Done</p>
          </div>
          <p className="text-xs text-muted-foreground">{totalAdded} El Gouna records</p>
        </div>
      </div>

      {phase === 'idle' && (
        <Button onClick={runAll} disabled={!confirmed} size="lg" className="w-full mb-6">
          <Play className="w-5 h-5 mr-2" /> Start: Delete Cairo + Populate El Gouna
        </Button>
      )}

      {phase === 'done' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="font-bold text-emerald-800">Complete! {totalAdded} El Gouna entries added.</p>
          {errored > 0 && <p className="text-xs text-amber-600 mt-1">{errored} tasks failed — re-run from Bulk Populator if needed.</p>}
          <Button onClick={() => navigate('/admin/cms')} variant="outline" size="sm" className="mt-3">Back to Admin CMS</Button>
        </div>
      )}

      {/* Task list */}
      {phase !== 'idle' && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">El Gouna Population Tasks</p>
          {POPULATE_TASKS.map(task => {
            const s = taskStatuses[task.id];
            return (
              <div key={task.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-2.5">
                <p className="text-sm flex-1">{task.label}</p>
                <div className="text-right shrink-0">
                  {!s && <span className="text-xs text-muted-foreground">Waiting…</span>}
                  {s?.state === 'running' && <span className="flex items-center gap-1 text-xs text-amber-600"><Loader2 className="w-3 h-3 animate-spin" /> Generating</span>}
                  {s?.state === 'done' && <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="w-3 h-3" /> +{s.count} added</span>}
                  {s?.state === 'skipped' && <span className="text-xs text-muted-foreground">Already exists</span>}
                  {s?.state === 'error' && <span className="flex items-center gap-1 text-xs text-red-500"><XCircle className="w-3 h-3" /> Failed</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}