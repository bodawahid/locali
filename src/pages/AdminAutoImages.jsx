import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Image, Play, CheckCircle, XCircle, Loader2, RefreshCw, Shield, AlertTriangle, ToggleLeft, ToggleRight, Clock, Zap } from 'lucide-react';

const ENTITY_OPTIONS = [
  { id: 'Service', label: '🏪 Services', desc: 'Restaurants, transport, medical, activities…' },
  { id: 'Place', label: '🏠 Places', desc: 'Locali host listings' },
  { id: 'HiddenGemPlace', label: '💎 Hidden Gems', desc: 'Hidden gem locations' },
];

const CONFIDENCE_COLORS = {
  high: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  null: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminAutoImages() {
  const [selectedEntities, setSelectedEntities] = useState(['Service', 'Place', 'HiddenGemPlace']);
  const [limit, setLimit] = useState(20);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [autoEnabled, setAutoEnabled] = useState(() => localStorage.getItem('autoImages_enabled') !== 'false');
  const [filter, setFilter] = useState('all');
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('autoImages_logs') || '[]'); } catch { return []; }
  });

  const toggleEntity = (id) => {
    setSelectedEntities(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleAuto = () => {
    const next = !autoEnabled;
    setAutoEnabled(next);
    localStorage.setItem('autoImages_enabled', String(next));
  };

  const run = async () => {
    if (!selectedEntities.length) return;
    setRunning(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('smartAutoImages', {
        entities: selectedEntities,
        limit,
      });
      const data = res.data;
      setResult(data);

      // Save to logs
      const entry = {
        timestamp: data.timestamp || new Date().toISOString(),
        updated: data.updated,
        failed: data.failed,
        entities: selectedEntities,
      };
      const newLogs = [entry, ...logs].slice(0, 10);
      setLogs(newLogs);
      localStorage.setItem('autoImages_logs', JSON.stringify(newLogs));
    } catch (err) {
      setResult({ error: err.message });
    }
    setRunning(false);
  };

  const filteredDetails = result?.details?.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'high') return d.confidence === 'high';
    if (filter === 'medium') return d.confidence === 'medium';
    if (filter === 'failed') return d.status !== 'updated';
    return true;
  }) || [];

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Zap className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Smart Auto-Image System</h1>
          <p className="text-sm text-muted-foreground">Pexels + Unsplash · Location-accurate · Realistic photos only</p>
        </div>
      </div>

      {/* Auto toggle */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-sm">Background Auto-Processing</p>
          <p className="text-xs text-muted-foreground">Scheduled automation fills missing images automatically every 30 min</p>
        </div>
        <button onClick={toggleAuto} className="flex items-center gap-2">
          {autoEnabled
            ? <ToggleRight className="w-8 h-8 text-accent" />
            : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
          <span className={`text-xs font-bold ${autoEnabled ? 'text-accent' : 'text-muted-foreground'}`}>
            {autoEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Config */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-5 mb-5">
        {/* Entity selector */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Process Entities</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ENTITY_OPTIONS.map(e => (
              <button key={e.id} onClick={() => toggleEntity(e.id)}
                className={`text-left p-3 rounded-xl border transition-all ${selectedEntities.includes(e.id) ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/30'}`}>
                <p className="font-bold text-sm">{e.label}</p>
                <p className="text-[10px] text-muted-foreground">{e.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Limit slider */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            Items per run: <span className="text-accent font-black">{limit}</span>
          </label>
          <input type="range" min={5} max={100} step={5} value={limit}
            onChange={e => setLimit(parseInt(e.target.value))}
            className="w-full accent-accent" />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>5 (fast)</span><span>50</span><span>100 (thorough)</span>
          </div>
        </div>

        {/* Image quality info */}
        <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
          <p className="font-bold text-foreground text-xs">🎯 Smart Filtering Active</p>
          <p>✅ Prefers: exterior shots, real locations, landmarks, natural lighting</p>
          <p>❌ Rejects: studio shots, white backgrounds, staged stock photos, watermarks</p>
          <p>🏆 Scoring: resolution + relevance + uniqueness (no duplicate images)</p>
        </div>

        <button onClick={run} disabled={running || !selectedEntities.length}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 transition-opacity">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? 'Processing…' : 'Run Now — Fill Missing Images'}
        </button>
      </div>

      {/* Results */}
      {result && !result.error && (
        <div className="bg-card border border-border rounded-2xl p-5 mb-5">
          <h2 className="font-bold mb-3">Run Results</h2>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-emerald-600">{result.updated}</p>
              <p className="text-[10px] text-emerald-700 font-bold">Updated</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-red-500">{result.failed}</p>
              <p className="text-[10px] text-red-600 font-bold">Failed</p>
            </div>
            <div className="bg-secondary rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-muted-foreground">{result.skipped}</p>
              <p className="text-[10px] text-muted-foreground font-bold">Skipped</p>
            </div>
          </div>

          {/* Filter tabs */}
          {result.details?.length > 0 && (
            <>
              <div className="flex gap-2 mb-3 flex-wrap">
                {['all', 'high', 'medium', 'failed'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all capitalize ${filter === f ? 'bg-accent text-accent-foreground border-accent' : 'border-border'}`}>
                    {f === 'high' ? '🟢 High Confidence' : f === 'medium' ? '🟡 Medium' : f === 'failed' ? '🔴 Failed' : 'All'}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredDetails.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 bg-secondary/40 rounded-xl p-2.5">
                    {d.status === 'updated'
                      ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{d.name} <span className="text-muted-foreground font-normal">({d.entity})</span></p>
                      {d.source && <p className="text-[10px] text-muted-foreground">{d.source}</p>}
                    </div>
                    {d.confidence && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${CONFIDENCE_COLORS[d.confidence]}`}>
                        {d.confidence}
                      </span>
                    )}
                    {d.url && (
                      <img src={d.url} alt="" className="w-10 h-7 object-cover rounded shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <button onClick={run} disabled={running}
            className="mt-4 w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-sm font-bold hover:bg-secondary transition-colors">
            <RefreshCw className="w-4 h-4" /> Reprocess Missing Images
          </button>
        </div>
      )}

      {result?.error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-5">
          ❌ Error: {result.error}
        </div>
      )}

      {/* Recent run history */}
      {logs.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Runs</h2>
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-secondary/40 rounded-xl px-3 py-2">
                <span className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                <span className="text-emerald-600 font-bold">+{log.updated} updated</span>
                {log.failed > 0 && <span className="text-red-500">{log.failed} failed</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}