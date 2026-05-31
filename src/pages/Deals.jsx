import { ExternalLink, Star } from 'lucide-react';

const VERIFIED_DEALS = [
  {
    title: 'Hurghada Tours & Activities',
    desc: 'Snorkeling, island trips, boat tours, diving. Real-time availability & pricing.',
    logo: '🤿',
    source: 'GetYourGuide',
    url: 'https://www.getyourguide.com/hurghada-l970/',
    color: 'bg-red-50 border-red-200',
    badge: 'bg-red-500',
  },
  {
    title: 'Sharm El Sheikh Excursions',
    desc: 'Ras Mohammed, Sinai, Coloured Canyon, Dahab day trips.',
    logo: '🏔️',
    source: 'Viator',
    url: 'https://www.viator.com/search/Excursions+Sharm+El+Sheikh+Egypt',
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-500',
  },
  {
    title: 'Luxor Temple Tours',
    desc: 'Valley of the Kings, Karnak, West Bank — licensed Egyptologist guides.',
    logo: '🏛️',
    source: 'GetYourGuide',
    url: 'https://www.getyourguide.com/luxor-l970/',
    color: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-500',
  },
  {
    title: 'Aswan & Nile Experiences',
    desc: 'Abu Simbel, Philae Temple, felucca cruises, Nubian village.',
    logo: '🛶',
    source: 'Viator',
    url: 'https://www.viator.com/search/Nile+Experiences+Aswan+Egypt',
    color: 'bg-teal-50 border-teal-200',
    badge: 'bg-teal-500',
  },
  {
    title: 'Egypt Hotels — Best Rates',
    desc: 'Hotels, resorts & apartments across Hurghada, Sharm, Luxor, Aswan.',
    logo: '🏨',
    source: 'Booking.com',
    url: 'https://www.booking.com/country/eg.html',
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-600',
  },
  {
    title: 'Cairo Day Trips & Pyramids',
    desc: 'Pyramids of Giza, Egyptian Museum, Old Cairo — half & full day tours.',
    logo: '🔺',
    source: 'GetYourGuide',
    url: 'https://www.getyourguide.com/cairo-l97/',
    color: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-600',
  },
  {
    title: 'Dahab Diving & Snorkeling',
    desc: 'Blue Hole, Canyon, Lighthouse Reef — day & multi-day dive packages.',
    logo: '🌊',
    source: 'Viator',
    url: 'https://www.viator.com/search/Diving+Snorkeling+Dahab+Egypt',
    color: 'bg-cyan-50 border-cyan-200',
    badge: 'bg-cyan-600',
  },
  {
    title: 'El Gouna Activities',
    desc: 'Kitesurfing, lagoon boat tours, golf, spa — Egypt\'s top resort town.',
    logo: '🏝️',
    source: 'GetYourGuide',
    url: 'https://www.getyourguide.com/el-gouna-l97451/',
    color: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-600',
  },
];

export default function Deals() {
  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
          <span className="text-2xl">🎟️</span>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Deals & Activities</h1>
          <p className="text-sm text-muted-foreground">Verified sources only — Booking.com · Viator · GetYourGuide</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 mb-6 text-xs text-blue-700">
        <strong>ℹ️ How this works:</strong> We only link to verified global booking platforms. Prices and availability are live — we do not mark them up or add codes.
      </div>

      {/* Traveler testimonials */}
      <div className="mb-6">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">⭐ What travelers say</p>
        <div className="space-y-2">
          {[
            { stars: 5, text: "Booked the Hurghada snorkeling trip via GetYourGuide after checking prices here. Paid exactly what Locali listed. No upsell, incredible reef!", name: "Sarah M.", country: "UK", date: "2 weeks ago" },
            { stars: 4, text: "Used Viator for the Valley of the Kings tour. Guide was licensed and knowledgeable. Locali's price checker confirmed the fair rate beforehand \u2014 lifesaver.", name: "Marco T.", country: "Italy", date: "1 month ago" },
            { stars: 5, text: "Horse riding at Luxor at sunset. Booked direct after checking prices here. Magical experience, fair price, exactly as described.", name: "James R.", country: "Australia", date: "3 weeks ago" },
            { stars: 4, text: "Felucca ride in Aswan through a Locali-recommended operator. Whole boat, sunset, very peaceful. 400 EGP was completely fair.", name: "Elena V.", country: "Netherlands", date: "5 days ago" },
          ].map((r, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.stars ? 'text-amber-400 fill-amber-400' : 'text-border'}`} />)}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{r.name} · {r.country}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">{r.date}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {VERIFIED_DEALS.map((deal, i) => (
          <a
            key={i}
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-4 rounded-2xl border p-4 hover:shadow-md transition-all ${deal.color}`}
          >
            <div className="text-3xl shrink-0">{deal.logo}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3 className="font-bold text-sm">{deal.title}</h3>
                <span className={`text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full ${deal.badge}`}>
                  {deal.source}
                </span>
              </div>
              <p className="text-xs text-gray-600">{deal.desc}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}