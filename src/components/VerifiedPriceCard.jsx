/**
 * VerifiedPriceCard v2 — Safe Pricing Display
 * Always shows: range + confidence + source label
 * Never shows a single exact price as truth
 */
import { ShieldCheck, Users, Database, Zap, AlertTriangle, RefreshCw, Clock } from 'lucide-react';

const SOURCE_CONFIG = {
  crowd_verified: {
    label: 'Crowdsourced Data',
    icon: Users,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  baseline_model: {
    label: 'City Baseline Model',
    icon: Database,
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    dot: 'bg-blue-400',
    badge: 'bg-blue-100 text-blue-800',
  },
  ai_estimated: {
    label: 'AI Estimated',
    icon: Zap,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-800',
  },
};

const CONFIDENCE_CONFIG = {
  high:      { bar: 'w-[85%]',  color: 'bg-emerald-500', text: 'High',      dot: '🟢' },
  medium:    { bar: 'w-[55%]',  color: 'bg-blue-400',    text: 'Medium',    dot: '🟡' },
  low:       { bar: 'w-[30%]',  color: 'bg-orange-400',  text: 'Low',       dot: '🟠' },
  estimated: { bar: 'w-[20%]',  color: 'bg-red-400',     text: 'Estimated', dot: '🔴' },
};

function ConfidenceBar({ confidence, score }) {
  const cfg = CONFIDENCE_CONFIG[confidence] || CONFIDENCE_CONFIG.estimated;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Confidence</span>
        <span className="text-[10px] font-extrabold">
          {cfg.dot} {cfg.text} {score != null ? `(${Math.round(score * 100)}%)` : ''}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-black/8 overflow-hidden">
        <div className={`h-full rounded-full ${cfg.bar} ${cfg.color} transition-all`} />
      </div>
    </div>
  );
}

export default function VerifiedPriceCard({ result, compact = false, onRefresh }) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 border border-border rounded-xl text-xs text-muted-foreground">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
        <span>⚠️ Price not verified yet in this location</span>
      </div>
    );
  }

  const src = SOURCE_CONFIG[result.source] || SOURCE_CONFIG.ai_estimated;
  const SrcIcon = src.icon;
  const isEstimated = result.source === 'ai_estimated' || result.confidence === 'estimated';
  const isLowConf = result.confidence === 'low' || result.confidence === 'estimated';

  const updatedText = result.updated
    ? (() => {
        const h = Math.floor((Date.now() - new Date(result.updated).getTime()) / 3600_000);
        return h < 1 ? 'Just updated' : h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
      })()
    : null;

  // ── Compact mode ──
  if (compact) {
    return (
      <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs ${src.bg}`}>
        <span className={`w-2 h-2 rounded-full shrink-0 ${src.dot}`} />
        <span className="font-extrabold text-foreground">
          {result.min}–{result.max} {result.currency || 'EGP'}
        </span>
        <span className={`text-[10px] font-semibold ${src.color}`}>· {src.label}</span>
        {updatedText && <span className="text-muted-foreground ml-auto text-[10px]">🕒 {updatedText}</span>}
      </div>
    );
  }

  // ── Full mode ──
  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${src.bg}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-extrabold text-sm text-foreground">{result.item}</p>
          {result.city && (
            <p className="text-[10px] text-muted-foreground capitalize">
              📍 {result.city.replace(/-/g, ' ')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${src.badge}`}>
            <SrcIcon className="w-2.5 h-2.5" />
            {src.label}
          </span>
          {onRefresh && (
            <button onClick={onRefresh}
              className="w-6 h-6 rounded-lg hover:bg-white/60 flex items-center justify-center">
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Price Range — ALWAYS a range, never exact */}
      <div className="bg-white/70 rounded-xl px-4 py-3 text-center">
        {isLowConf && (
          <p className="text-[10px] text-amber-600 font-bold mb-1">
            ⚠️ {isEstimated ? 'AI Estimated — No verified data' : 'Low confidence range'}
          </p>
        )}
        <p className="text-2xl font-black tracking-tight text-foreground">
          {result.min} – {result.max}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {result.currency || 'EGP'} · estimated range, not exact price
        </p>
      </div>

      {/* Confidence bar */}
      <ConfidenceBar confidence={result.confidence} score={result.confidence_score} />

      {/* Sources */}
      <div className="space-y-1">
        {result.source_labels?.includes('crowd') && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <Users className="w-3 h-3 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">
              {result.source_count > 1 ? `${result.source_count} user reports` : 'User report'}
            </span>
          </div>
        )}
        {result.source_labels?.includes('baseline') && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <Database className="w-3 h-3 text-blue-500" />
            <span className="text-blue-700 font-semibold">City baseline model</span>
          </div>
        )}
        {result.source_labels?.includes('ai') && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-amber-700 font-semibold">AI estimation (last resort)</span>
          </div>
        )}
        {updatedText && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Clock className="w-2.5 h-2.5" />
            {updatedText}
            {result.from_cache && <span className="ml-1 text-muted-foreground/60">· cached</span>}
          </div>
        )}
      </div>

      {/* AI note */}
      {result.ai_note && (
        <p className="text-[11px] text-muted-foreground italic border-t border-black/5 pt-2">
          💡 {result.ai_note}
        </p>
      )}

      {/* Safe mode disclaimer */}
      <p className="text-[10px] text-muted-foreground/60 italic">
        Prices are estimates based on multiple signals — not a guaranteed exact price.
      </p>
    </div>
  );
}