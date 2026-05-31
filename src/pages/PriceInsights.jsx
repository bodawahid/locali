import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Share2, TrendingUp, CheckCircle2, AlertCircle, Clock, Plus, X, Loader2, Bot } from 'lucide-react';
import LiveTrustBadge from '../components/LiveTrustBadge';

const CITIES = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'el-gouna', 'cairo'];
const CATEGORIES = ['taxi', 'food_drinks', 'activities', 'shopping', 'accommodation', 'other'];

const TRUST_CONFIG = {
  verified:    { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', label: 'Verified' },
  community:   { icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',   dot: 'bg-amber-400',  label: 'Community Report' },
  unverified:  { icon: AlertCircle,  color: 'text-gray-500',    bg: 'bg-gray-50 border-gray-200',     dot: 'bg-gray-400',   label: 'Unverified' },
};

const CITY_LABELS = {
  'hurghada': 'Hurghada', 'sharm-el-sheikh': 'Sharm El Sheikh',
  'luxor': 'Luxor', 'aswan': 'Aswan', 'el-gouna': 'El Gouna', 'cairo': 'Cairo',
};

function varianceLabel(tourist, localMax) {
  if (!tourist || !localMax) return null;
  const ratio = tourist / localMax;
  if (ratio > 2.5) return { text: 'High price variation reported', color: 'text-red-600 bg-red-50', icon: '📊' };
  if (ratio > 1.5) return { text: 'Moderate price variation noted', color: 'text-amber-700 bg-amber-50', icon: '📊' };
  return { text: 'Within normal range', color: 'text-emerald-700 bg-emerald-50', icon: '✅' };
}

function shareInsight(insight) {
  const city = CITY_LABELS[insight.city] || insight.city;
  const text = `📍 ${city} — ${insight.service_name}${insight.location_label ? ` (${insight.location_label})` : ''}\n\nReported prices vary compared to local average.\n✅ Local range: ${insight.local_price_min}–${insight.local_price_max} EGP${insight.reported_tourist_price ? `\n📌 Reported tourist price: ${insight.reported_tourist_price} EGP` : ''}\n\nCheck live verified ranges on Locali Egypt 🇪🇬`;
  if (navigator.share) {
    navigator.share({ text, title: `Pricing Insight — ${city}` });
  } else {
    navigator.clipboard?.writeText(text);
    alert('Insight copied to clipboard!');
  }
}

function PriceInsightCard({ insight }) {
  const trust = TRUST_CONFIG[insight.trust_label] || TRUST_CONFIG.unverified;
  const TrustIcon = trust.icon;
  const variance = varianceLabel(insight.reported_tourist_price, insight.local_price_max);
  const daysAgo = insight.updated_date
    ? Math.floor((Date.now() - new Date(insight.updated_date).getTime()) / 86400000)
    : null;

  return (
    <div className={`rounded-2xl border p-4 ${trust.bg}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`flex items-center gap-1 text-[10px] font-extrabold ${trust.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${trust.dot}`} />
              {trust.label}
            </span>
            <span className="text-[10px] font-bold bg-white/70 text-gray-600 px-2 py-0.5 rounded-full capitalize">
              {insight.category?.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-bold bg-white/70 text-gray-600 px-2 py-0.5 rounded-full">
              {CITY_LABELS[insight.city] || insight.city}
            </span>
          </div>
          <p className="font-extrabold text-sm text-foreground">{insight.service_name}</p>
          {insight.location_label && (
            <p className="text-[11px] text-muted-foreground mt-0.5">📍 {insight.location_label}</p>
          )}
        </div>
        <button onClick={() => shareInsight(insight)}
          className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center hover:bg-white transition-colors shrink-0">
          <Share2 className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {/* Price comparison */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/60 rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground font-medium mb-1">✅ Local Average Range</p>
          <p className="text-lg font-black text-emerald-600">{insight.local_price_min}–{insight.local_price_max}</p>
          <p className="text-[10px] text-muted-foreground">EGP</p>
        </div>
        {insight.reported_tourist_price ? (
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground font-medium mb-1">❌ Reported Tourist Price</p>
            <p className="text-lg font-black text-red-500">{insight.reported_tourist_price}</p>
            <p className="text-[10px] text-muted-foreground">EGP</p>
          </div>
        ) : (
          <div className="bg-white/60 rounded-xl p-3 text-center flex items-center justify-center">
            <p className="text-[11px] text-muted-foreground italic">No tourist price reported yet</p>
          </div>
        )}
      </div>

      {/* Variance label */}
      {variance && (
        <div className={`flex items-center gap-1.5 rounded-xl px-3 py-2 mb-2 ${variance.color}`}>
          <span className="text-sm">{variance.icon}</span>
          <p className="text-[11px] font-bold">{variance.text}</p>
        </div>
      )}

      {/* Context note */}
      {insight.context_note && (
        <p className="text-[11px] text-muted-foreground italic mb-2">💡 {insight.context_note}</p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 pt-2 border-t border-black/5">
        {daysAgo !== null && (
          <span className="text-[10px] text-muted-foreground">🕒 {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
        )}
        {insight.report_count > 0 && (
          <span className="text-[10px] text-muted-foreground">👥 {insight.report_count} report{insight.report_count > 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
}

function LiveFeedItem({ insight }) {
  const city = CITY_LABELS[insight.city] || insight.city;
  const variance = insight.reported_tourist_price && insight.local_price_max
    ? insight.reported_tourist_price / insight.local_price_max
    : 1;
  const text = variance > 2.5
    ? `Higher than usual pricing detected for ${insight.service_name} in ${city}`
    : variance > 1.5
    ? `Moderate price variation reported for ${insight.service_name} in ${city}`
    : `Normal pricing confirmed for ${insight.service_name} in ${city}`;
  const dot = variance > 2.5 ? 'bg-red-400' : variance > 1.5 ? 'bg-amber-400' : 'bg-emerald-500';

  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-border/40 last:border-0">
      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dot}`} />
      <p className="text-xs text-foreground leading-relaxed">{text}</p>
    </div>
  );
}

const EMPTY_FORM = { service_name: '', location_label: '', city: 'hurghada', category: 'taxi', reported_tourist_price: '', local_price_min: '', local_price_max: '', context_note: '' };

function SubmitForm({ onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.service_name || !form.local_price_min || !form.local_price_max) return;
    setSaving(true);
    await base44.entities.PriceInsight.create({
      ...form,
      reported_tourist_price: form.reported_tourist_price ? +form.reported_tourist_price : null,
      local_price_min: +form.local_price_min,
      local_price_max: +form.local_price_max,
      trust_label: 'unverified',
      report_count: 1,
      is_active: true,
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-sm">Share a Pricing Insight</h3>
        <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      <div className="space-y-3">
        <input value={form.service_name} onChange={e => set('service_name', e.target.value)}
          placeholder="Service / item (e.g. Taxi ride 5 min)"
          className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none border border-transparent focus:border-accent/40" />
        <input value={form.location_label} onChange={e => set('location_label', e.target.value)}
          placeholder="Location (e.g. Hurghada Marina) — optional"
          className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none border border-transparent focus:border-accent/40" />
        <div className="grid grid-cols-2 gap-2">
          <select value={form.city} onChange={e => set('city', e.target.value)}
            className="px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none">
            {CITIES.map(c => <option key={c} value={c}>{CITY_LABELS[c] || c}</option>)}
          </select>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none capitalize">
            {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground mb-1">Local Min (EGP)</p>
            <input type="number" value={form.local_price_min} onChange={e => set('local_price_min', e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground mb-1">Local Max (EGP)</p>
            <input type="number" value={form.local_price_max} onChange={e => set('local_price_max', e.target.value)}
              className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground mb-1">Tourist Price</p>
            <input type="number" value={form.reported_tourist_price} onChange={e => set('reported_tourist_price', e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none" />
          </div>
        </div>
        <textarea value={form.context_note} onChange={e => set('context_note', e.target.value)}
          placeholder="Context: seasonal pricing, peak demand, negotiable... (optional)"
          rows={2} className="w-full px-3 py-2.5 bg-secondary rounded-xl text-sm outline-none resize-none" />
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
          <p className="text-[10px] text-blue-700">All insights are reviewed before being marked as verified. Please report factual price differences only.</p>
        </div>
        <button onClick={handleSubmit} disabled={saving || !form.service_name}
          className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-bold text-sm disabled:opacity-40">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Submit Pricing Insight'}
        </button>
      </div>
    </div>
  );
}

function AISummary({ insights }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const items = insights.slice(0, 8).map(i =>
      `${i.service_name} in ${i.city}: local ${i.local_price_min}–${i.local_price_max} EGP${i.reported_tourist_price ? `, tourist reported ${i.reported_tourist_price} EGP` : ''}`
    ).join('\n');
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a neutral travel pricing analyst. Summarize the following price insights for Egypt tourists in 3–4 sentences. Be factual, neutral, and helpful. Never use words like "scam" or "rip-off". Frame differences as "price variations" and mention factors like seasonal demand or tourist-area pricing when relevant.\n\nData:\n${items}`,
    });
    setSummary(result);
    setLoading(false);
  };

  if (summary) {
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-4 h-4 text-blue-600" />
          <p className="text-xs font-extrabold text-blue-700">AI Pricing Intelligence</p>
        </div>
        <p className="text-xs text-blue-800 leading-relaxed">{summary}</p>
      </div>
    );
  }

  return (
    <button onClick={generate} disabled={loading || insights.length === 0}
      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-40 mb-4">
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
      {loading ? 'Analyzing pricing data…' : 'Generate AI Pricing Summary'}
    </button>
  );
}

export default function PriceInsights() {
  const qc = useQueryClient();
  const [filterCity, setFilterCity] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('insights'); // insights | feed

  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['priceInsights', filterCity, filterCat],
    queryFn: () => {
      const f = { is_active: true };
      if (filterCity) f.city = filterCity;
      if (filterCat) f.category = filterCat;
      return base44.entities.PriceInsight.filter(f, '-updated_date', 50);
    },
  });

  const refresh = () => qc.invalidateQueries(['priceInsights']);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Pricing Intelligence</h1>
            <p className="text-sm text-muted-foreground">Community-verified price transparency for Egypt travelers</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-2 bg-accent text-accent-foreground rounded-xl text-xs font-bold shrink-0">
            <Plus className="w-3.5 h-3.5" /> Share
          </button>
        </div>
        <LiveTrustBadge records={insights} reportCount={insights.reduce((a, i) => a + (i.report_count || 1), 0)} label="community reports" className="mt-2" />
      </div>

      {/* Submit form */}
      {showForm && (
        <SubmitForm onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); refresh(); }} />
      )}

      {/* AI Summary */}
      {!isLoading && <AISummary insights={insights} />}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[{ id: 'insights', label: '📊 Insights' }, { id: 'feed', label: '📡 Live Feed' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-3">
        <button onClick={() => setFilterCity('')} className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border ${!filterCity ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>All Cities</button>
        {CITIES.map(c => (
          <button key={c} onClick={() => setFilterCity(c === filterCity ? '' : c)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border capitalize ${filterCity === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
            {CITY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
        <button onClick={() => setFilterCat('')} className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border ${!filterCat ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border'}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilterCat(c === filterCat ? '' : c)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border capitalize ${filterCat === c ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border'}`}>
            {c.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : insights.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">📊</p>
          <p className="font-bold">No insights yet</p>
          <p className="text-sm mt-1">Be the first to share a pricing insight</p>
          <button onClick={() => setShowForm(true)} className="mt-4 px-5 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-bold">
            Share Insight
          </button>
        </div>
      ) : tab === 'insights' ? (
        <div className="space-y-3">
          {insights.map(i => <PriceInsightCard key={i.id} insight={i} />)}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <p className="text-xs font-extrabold text-emerald-600">Live Pricing Feed</p>
          </div>
          {insights.map(i => <LiveFeedItem key={i.id} insight={i} />)}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 bg-secondary/50 rounded-2xl p-4 text-center">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          All prices may vary based on season, demand, location, and negotiation. This data is community-contributed and reviewed for accuracy. Always confirm prices directly with service providers.
        </p>
      </div>
    </div>
  );
}