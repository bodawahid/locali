import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Check, X, AlertTriangle, TrendingUp, Bot, Loader2, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { id: 'visa', label: 'Visa' },
  { id: 'taxi', label: 'Taxi' },
  { id: 'rent', label: 'Rent / Apartments' },
  { id: 'food_drinks', label: 'Food & Drinks' },
  { id: 'activities_tours', label: 'Activities & Tours' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'medical', label: 'Medical' },
  { id: 'telecom', label: 'Telecom / SIM' },
  { id: 'other', label: 'Other' },
];

const CITIES = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'el-gouna', 'cairo', 'all'];
const CURRENCIES = ['EGP', 'USD', 'EUR'];

const ALERT_STYLES = {
  none: '',
  price_increased: 'border-amber-400 bg-amber-50',
  scam_risk: 'border-red-400 bg-red-50',
};

const EMPTY_FORM = {
  title: '', category: 'taxi', city: 'hurghada',
  min_price: '', max_price: '', currency: 'EGP',
  notes: '', source_label: 'manual_verified',
  alert_type: 'none', is_active: true,
  last_verified_date: new Date().toISOString().split('T')[0],
};

function PriceForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Title</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="e.g. Short Taxi Ride"
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent/50" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none">
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">City</label>
          <select value={form.city} onChange={e => set('city', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none">
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">Min Price</label>
          <input type="number" value={form.min_price} onChange={e => set('min_price', +e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">Max Price</label>
          <input type="number" value={form.max_price} onChange={e => set('max_price', +e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">Currency</label>
          <select value={form.currency} onChange={e => set('currency', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none">
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">Alert</label>
          <select value={form.alert_type} onChange={e => set('alert_type', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none">
            <option value="none">None</option>
            <option value="price_increased">Price Increased</option>
            <option value="scam_risk">Scam Risk</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">Last Verified</label>
          <input type="date" value={form.last_verified_date} onChange={e => set('last_verified_date', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase">Source</label>
          <select value={form.source_label} onChange={e => set('source_label', e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none">
            <option value="manual_verified">Manual Verified</option>
            <option value="tourist_reports">Tourist Reports</option>
            <option value="official_source">Official Source</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Notes for travelers</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2}
            placeholder="e.g. Agree price before getting in"
            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} id="active" />
          <label htmlFor="active" className="text-xs font-semibold">Visible to users</label>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold">Cancel</button>
        <button onClick={() => onSave(form)} disabled={saving || !form.title}
          className="flex-1 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-bold disabled:opacity-40">
          {saving ? 'Saving…' : 'Save Price'}
        </button>
      </div>
    </div>
  );
}

function PriceRow({ entry, onEdit, onDelete, onApproveSuggestion }) {
  const [deleting, setDeleting] = useState(false);
  const daysAgo = entry.last_verified_date
    ? Math.floor((Date.now() - new Date(entry.last_verified_date)) / 86400000)
    : null;

  return (
    <div className={`border rounded-2xl p-4 ${ALERT_STYLES[entry.alert_type] || 'border-gray-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase">{entry.category?.replace('_', ' ')}</span>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{entry.city}</span>
            {entry.alert_type === 'price_increased' && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                <TrendingUp className="w-2.5 h-2.5" /> Increased
              </span>
            )}
            {entry.alert_type === 'scam_risk' && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-2.5 h-2.5" /> Scam Risk
              </span>
            )}
            {!entry.is_active && <span className="text-[10px] font-bold bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full">Hidden</span>}
          </div>
          <p className="font-bold text-sm">{entry.title}</p>
          <p className="text-base font-extrabold text-accent mt-0.5">{entry.min_price} – {entry.max_price} <span className="text-xs font-semibold text-gray-400">{entry.currency}</span></p>
          {daysAgo !== null && (
            <p className="text-[10px] text-gray-400 mt-0.5">Verified {daysAgo === 0 ? 'today' : `${daysAgo}d ago`} · {entry.source_label?.replace('_', ' ')}</p>
          )}
          {entry.notes && <p className="text-xs text-gray-500 mt-1 italic">"{entry.notes}"</p>}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(entry)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Edit2 className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button onClick={async () => { setDeleting(true); await onDelete(entry.id); }}
            className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" /> : <X className="w-3.5 h-3.5 text-red-400" />}
          </button>
        </div>
      </div>
      {/* AI suggestion pending */}
      {entry.pending_suggestion && (
        <div className="mt-2 bg-violet-50 border border-violet-200 rounded-xl p-3 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Bot className="w-3.5 h-3.5 text-violet-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-violet-700">AI Suggestion (not applied)</p>
              <p className="text-xs text-violet-600 mt-0.5">{entry.pending_suggestion}</p>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => onApproveSuggestion(entry)}
              className="flex items-center gap-1 text-[10px] font-bold bg-violet-600 text-white px-2 py-1 rounded-lg hover:bg-violet-700">
              <Check className="w-2.5 h-2.5" /> Apply
            </button>
            <button onClick={() => base44.entities.PriceEntry.update(entry.id, { pending_suggestion: null })}
              className="flex items-center gap-1 text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-300">
              <X className="w-2.5 h-2.5" /> Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPriceManager() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['priceEntries'],
    queryFn: () => base44.entities.PriceEntry.list('-updated_date', 200),
  });

  const refresh = () => qc.invalidateQueries(['priceEntries']);

  const handleSave = async (form) => {
    setSaving(true);
    if (editEntry) {
      await base44.entities.PriceEntry.update(editEntry.id, form);
    } else {
      await base44.entities.PriceEntry.create(form);
    }
    setSaving(false);
    setShowForm(false);
    setEditEntry(null);
    refresh();
  };

  const handleDelete = async (id) => {
    await base44.entities.PriceEntry.delete(id);
    refresh();
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApproveSuggestion = async (entry) => {
    // Parse suggestion like "120-180 EGP" and apply
    const match = entry.pending_suggestion?.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (match) {
      await base44.entities.PriceEntry.update(entry.id, {
        min_price: +match[1],
        max_price: +match[2],
        pending_suggestion: null,
        last_verified_date: new Date().toISOString().split('T')[0],
        source_label: 'ai_suggested',
      });
      refresh();
    }
  };

  const handleAIScan = async () => {
    if (entries.length === 0) return;
    setAiLoading(true);
    // Pick first 5 entries without recent verification
    const targets = entries.slice(0, 5);
    for (const entry of targets) {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a travel price researcher for Egypt. Based on current 2024-2026 data, suggest an accurate price range for: "${entry.title}" in ${entry.city}, category: ${entry.category}.
Current range: ${entry.min_price}–${entry.max_price} ${entry.currency}.
Reply with ONLY a suggested range like "100-200 EGP" or "same" if current is accurate. No explanation.`,
        add_context_from_internet: false,
      });
      if (result && result !== 'same' && result.toLowerCase() !== 'same') {
        await base44.entities.PriceEntry.update(entry.id, { pending_suggestion: result.trim() });
      }
    }
    setAiLoading(false);
    refresh();
  };

  const filtered = entries.filter(e =>
    (!filterCat || e.category === filterCat) &&
    (!filterCity || e.city === filterCity)
  );

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Price Manager</h1>
          <p className="text-sm text-gray-500">{entries.length} prices · admin-controlled</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">● Live data — changes reflect instantly to users</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAIScan} disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-100 text-violet-700 rounded-xl text-xs font-bold hover:bg-violet-200 disabled:opacity-40">
            {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
            AI Scan
          </button>
          <button onClick={() => { setEditEntry(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-accent text-accent-foreground rounded-xl text-xs font-bold">
            <Plus className="w-3.5 h-3.5" /> Add Price
          </button>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700"><strong>Admin-only.</strong> AI suggestions are never applied automatically. You must review and approve each one.</p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6">
          <PriceForm
            initial={editEntry || EMPTY_FORM}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditEntry(null); }}
            saving={saving}
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
        <button onClick={() => setFilterCat('')} className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border ${!filterCat ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-gray-200'}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setFilterCat(c.id === filterCat ? '' : c.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border ${filterCat === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-gray-200'}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
        <button onClick={() => setFilterCity('')} className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border ${!filterCity ? 'bg-accent text-accent-foreground border-accent' : 'bg-white border-gray-200'}`}>All Cities</button>
        {CITIES.filter(c => c !== 'all').map(c => (
          <button key={c} onClick={() => setFilterCity(c === filterCity ? '' : c)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border capitalize ${filterCity === c ? 'bg-accent text-accent-foreground border-accent' : 'bg-white border-gray-200'}`}>
            {c.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Entries */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">💰</p>
          <p className="font-bold">No prices yet</p>
          <p className="text-sm mt-1">Click "Add Price" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(e => (
            <PriceRow key={e.id} entry={e} onEdit={handleEdit} onDelete={handleDelete} onApproveSuggestion={handleApproveSuggestion} />
          ))}
        </div>
      )}
    </div>
  );
}