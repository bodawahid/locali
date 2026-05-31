import { Clock, AlertCircle } from 'lucide-react';

// Reusable component to display data freshness and last update time
export default function DataTimestamp({ lastUpdated, isStale, ageHours, source }) {
  if (!lastUpdated) return null;

  return (
    <div className={`text-[10px] flex items-center gap-1.5 px-2 py-1 rounded-lg ${
      isStale
        ? 'bg-amber-50 text-amber-700 border border-amber-200'
        : 'bg-green-50 text-green-700 border border-green-200'
    }`}>
      {isStale ? (
        <AlertCircle className="w-3 h-3 shrink-0" />
      ) : (
        <Clock className="w-3 h-3 shrink-0" />
      )}
      <span className="font-bold">
        {isStale ? '⚠️ Stale' : '✓ Fresh'}
      </span>
      <span>
        {ageHours ? `${Math.round(ageHours)}h ago` : lastUpdated}
      </span>
      {source && <span className="text-[9px] opacity-70">({source})</span>}
    </div>
  );
}