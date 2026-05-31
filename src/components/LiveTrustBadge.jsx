/**
 * LiveTrustBadge — unified trust indicator for all price/data sections.
 *
 * Props:
 *   records      — array of DB records (derives lastUpdated automatically)
 *   lastUpdated  — explicit date string (overrides records-derived date)
 *   reportCount  — number shown as "Based on N+ reports"
 *   label        — custom label e.g. "verified reports" (default: "tourist reports")
 *   className    — extra classes
 */
export default function LiveTrustBadge({
  records,
  lastUpdated,
  reportCount,
  label = 'tourist reports',
  className = '',
}) {
  // Derive last updated from records if not explicit
  let resolvedDate = lastUpdated;
  if (!resolvedDate && records?.length > 0) {
    const dates = records
      .map(r => r.updated_date || r.last_verified_date || r.created_date)
      .filter(Boolean)
      .map(d => new Date(d).getTime());
    if (dates.length > 0) {
      resolvedDate = new Date(Math.max(...dates)).toISOString();
    }
  }

  const daysAgo = resolvedDate
    ? Math.floor((Date.now() - new Date(resolvedDate).getTime()) / 86400000)
    : null;

  const updatedText =
    daysAgo === null ? null :
    daysAgo === 0    ? 'Updated today' :
    daysAgo === 1    ? 'Updated yesterday' :
                       `Updated ${daysAgo}d ago`;

  const count = reportCount ?? (records ? records.length : null);

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {/* Pulse dot + LIVE */}
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] font-extrabold text-emerald-600 tracking-wide">Live</span>
      </span>

      {updatedText && (
        <>
          <span className="text-[10px] text-muted-foreground/50">•</span>
          <span className="text-[11px] text-muted-foreground font-medium">{updatedText}</span>
        </>
      )}

      {count !== null && count > 0 && (
        <>
          <span className="text-[10px] text-muted-foreground/50">•</span>
          <span className="text-[11px] text-muted-foreground font-medium">
            Based on {count >= 100 ? `${Math.floor(count / 10) * 10}+` : count} {label}
          </span>
        </>
      )}
    </div>
  );
}