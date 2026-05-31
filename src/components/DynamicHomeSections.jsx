import { Link } from 'react-router-dom';

const COLOR_CLASSES = {
  accent: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'bg-cyan-100' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'bg-amber-100' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'bg-emerald-100' },
  danger: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'bg-red-100' },
  gold: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'bg-yellow-100' },
  dark: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', icon: 'bg-slate-100' },
  default: { bg: 'bg-white', border: 'border-border', text: 'text-foreground', icon: 'bg-secondary' },
};

// Banner strip
export function DynamicBanners({ banners }) {
  if (!banners?.length) return null;
  return (
    <div className="space-y-2">
      {banners.map(b => {
        const c = COLOR_CLASSES[b.color_scheme] || COLOR_CLASSES.default;
        const inner = (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.bg} ${c.border}`}>
            {b.icon && <span className="text-xl shrink-0">{b.icon}</span>}
            <div className="flex-1">
              {b.title && <p className={`text-sm font-bold ${c.text}`}>{b.title}</p>}
              {b.description && <p className="text-xs text-muted-foreground">{b.description}</p>}
            </div>
            {b.button_text && <span className={`text-xs font-bold ${c.text} shrink-0`}>{b.button_text} →</span>}
          </div>
        );
        return b.button_link
          ? <Link key={b.id || b.section_key} to={b.button_link}>{inner}</Link>
          : <div key={b.id || b.section_key}>{inner}</div>;
      })}
    </div>
  );
}

// City pills from DB
export function DynamicCityPills({ cityPills }) {
  if (!cityPills?.length) return null;
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      {cityPills.map(p => (
        <Link key={p.id || p.section_key}
          to={p.button_link || '#'}
          className="shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:border-accent hover:text-accent transition-all shadow-sm flex items-center gap-1">
          {p.icon && <span>{p.icon}</span>}
          {p.title}
        </Link>
      ))}
    </div>
  );
}

// Feature cards from DB
export function DynamicFeatureCards({ featureCards }) {
  if (!featureCards?.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {featureCards.map(card => {
        const c = COLOR_CLASSES[card.color_scheme] || COLOR_CLASSES.default;
        const inner = (
          <div className={`rounded-2xl border p-4 h-full transition-all hover:shadow-md ${c.bg} ${c.border}`}>
            {card.icon && (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.icon}`}>
                <span className="text-xl">{card.icon}</span>
              </div>
            )}
            {card.image_url && !card.icon && (
              <img src={card.image_url} alt={card.title} className="w-full h-20 object-cover rounded-xl mb-3" />
            )}
            <h3 className={`text-sm font-bold ${c.text}`}>{card.title}</h3>
            {card.description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.description}</p>}
            {card.badge_text && (
              <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>{card.badge_text}</span>
            )}
            {card.button_text && (
              <p className={`mt-2 text-xs font-bold ${c.text}`}>{card.button_text} →</p>
            )}
          </div>
        );
        return card.button_link
          ? <Link key={card.id || card.section_key} to={card.button_link}>{inner}</Link>
          : <div key={card.id || card.section_key}>{inner}</div>;
      })}
    </div>
  );
}

// Tip cards
export function DynamicTipCards({ tipCards }) {
  if (!tipCards?.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {tipCards.map(tip => {
        const c = COLOR_CLASSES[tip.color_scheme] || COLOR_CLASSES.warning;
        return (
          <div key={tip.id || tip.section_key} className={`rounded-xl border p-4 ${c.bg} ${c.border}`}>
            <div className="flex items-start gap-3">
              {tip.icon && <span className="text-xl shrink-0">{tip.icon}</span>}
              <div>
                {tip.title && <p className={`text-xs font-bold ${c.text}`}>{tip.title}</p>}
                {tip.description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tip.description}</p>}
              </div>
            </div>
            {tip.button_text && tip.button_link && (
              <Link to={tip.button_link} className={`mt-2 inline-block text-xs font-bold ${c.text}`}>{tip.button_text} →</Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Text blocks
export function DynamicTextBlocks({ textBlocks }) {
  if (!textBlocks?.length) return null;
  return (
    <div className="space-y-3">
      {textBlocks.map(b => (
        <div key={b.id || b.section_key} className="prose prose-sm max-w-none">
          {b.title && <h2 className="text-lg font-bold">{b.title}</h2>}
          {b.subtitle && <h3 className="text-base font-semibold text-muted-foreground">{b.subtitle}</h3>}
          {b.description && <p className="text-sm text-muted-foreground">{b.description}</p>}
        </div>
      ))}
    </div>
  );
}

// Image blocks
export function DynamicImageBlocks({ imageBlocks }) {
  if (!imageBlocks?.length) return null;
  return (
    <div className="space-y-3">
      {imageBlocks.map(b => (
        <div key={b.id || b.section_key}>
          {b.title && <p className="text-sm font-bold mb-2">{b.title}</p>}
          <img src={b.image_url} alt={b.title || ''} className="w-full rounded-2xl object-cover max-h-64" />
          {b.description && <p className="text-xs text-muted-foreground mt-1">{b.description}</p>}
        </div>
      ))}
    </div>
  );
}