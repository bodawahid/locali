/**
 * WhereToStay — "Where to Stay Like a Local" section.
 * Props: city (string slug: hurghada, sharm-el-sheikh, luxor, aswan, el-gouna)
 */

const CITY_NAMES = {
  hurghada: 'Hurghada',
  'sharm-el-sheikh': 'Sharm El Sheikh',
  luxor: 'Luxor',
  aswan: 'Aswan',
  'el-gouna': 'El Gouna',
};

export default function WhereToStay({ city }) {
  const name = CITY_NAMES[city] || city;
  const enc = encodeURIComponent(name + ' Egypt');

  const options = [
    {
      emoji: '🏠',
      title: 'Apartments',
      desc: 'Rent a full apartment — great for longer stays and groups.',
      btn: 'Find Apartments on Airbnb →',
      url: `https://www.airbnb.com/s/${encodeURIComponent(name)}-Egypt/homes`,
      color: 'bg-rose-500',
    },
    {
      emoji: '🛏️',
      title: 'Hostels',
      desc: 'Budget-friendly beds, meet fellow travellers.',
      btn: 'Find Hostels on Hostelworld →',
      url: `https://www.hostelworld.com/search?search_keywords=${encodeURIComponent(name + ' Egypt')}`,
      color: 'bg-orange-500',
    },
    {
      emoji: '🏡',
      title: 'Guesthouses & Boutique Hotels',
      desc: 'Authentic local stays with personal touches.',
      btn: 'Find Guesthouses on Booking →',
      url: `https://www.booking.com/searchresults.html?ss=${enc}&nflt=ht_id%3D216`,
      color: 'bg-blue-600',
    },
    {
      emoji: '🌿',
      title: 'Eco Lodges',
      desc: 'Sustainable, nature-friendly accommodation.',
      btn: 'Find Eco Lodges on Booking →',
      url: `https://www.booking.com/searchresults.html?ss=${enc}&nflt=ht_id%3D220`,
      color: 'bg-emerald-600',
    },
  ];

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-5">
      <h2 className="font-extrabold text-base text-gray-900 mb-1">🏘️ Where to Stay Like a Local</h2>
      <p className="text-xs text-gray-500 mb-4">Real accommodation options beyond big hotel chains — verified external links, live prices.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{opt.emoji}</span>
              <h3 className="font-bold text-sm text-gray-900">{opt.title}</h3>
            </div>
            <p className="text-xs text-gray-500 flex-1">{opt.desc}</p>
            <a href={opt.url} target="_blank" rel="noopener noreferrer"
              className={`w-full text-center text-white text-xs font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity ${opt.color}`}>
              {opt.btn}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}