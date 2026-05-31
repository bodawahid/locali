export default function GoogleReviewsButton({ name, className = '' }) {
  const url = `https://www.google.com/maps/search/${encodeURIComponent(name + ' Egypt')}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 w-full border border-border bg-white/50 hover:bg-secondary/60 text-foreground py-2.5 rounded-xl text-xs font-bold transition-colors ${className}`}
    >
      ⭐ See reviews on Google →
    </a>
  );
}