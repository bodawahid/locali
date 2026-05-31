import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, MapPin, Star, Phone, MessageCircle, Globe, Loader2, X } from 'lucide-react';
import DataTimestamp from '../components/DataTimestamp';

const CITIES = ['cairo', 'giza', 'alexandria', 'hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'el-gouna'];
const CATEGORIES = ['hotel', 'restaurant', 'tour', 'guide', 'driver', 'transportation', 'company', 'activity', 'attraction'];
const CITY_LABELS = { cairo: '🏛️ Cairo', giza: '🐪 Giza', alexandria: '⛵ Alexandria', hurghada: '🌊 Hurghada', 'sharm-el-sheikh': '⛰️ Sharm El Sheikh', luxor: '👑 Luxor', aswan: '🏛️ Aswan', 'el-gouna': '🏖️ El Gouna' };
const CAT_ICONS = { hotel: '🏨', restaurant: '🍽️', tour: '🧳', guide: '🧭', driver: '🚗', transportation: '🚌', company: '🏢', activity: '⛹️', attraction: '🗺️' };

function ListingCard({ listing }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
      {listing.image && (
        <div className="relative h-40 overflow-hidden">
          <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-white/90 rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold">{listing.rating}</span>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xl">{CAT_ICONS[listing.category]}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm line-clamp-2">{listing.name}</h3>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.city}
            </p>
          </div>
        </div>

        {listing.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">{listing.description}</p>
        )}

        <div className="text-[10px] text-gray-500 mb-3">
          {listing.review_count > 0 && <p>{listing.review_count} reviews</p>}
          {listing.last_synced && (
            <DataTimestamp
              lastUpdated={new Date(listing.last_synced).toLocaleDateString()}
              isStale={false}
              source="Google Places"
            />
          )}
        </div>

        <div className="flex gap-2">
          <a href={listing.google_maps_link} target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition-all text-center">
            📍 Maps
          </a>
          {listing.whatsapp && (
            <a href={`https://wa.me/${listing.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-1">
              <MessageCircle className="w-3 h-3" /> Chat
            </a>
          )}
          {listing.website && (
            <a href={listing.website} target="_blank" rel="noopener noreferrer"
              className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-gray-700 transition-all text-center">
              🌐
            </a>
          )}
        </div>

        {listing.is_featured && (
          <div className="mt-2 text-center bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-lg">
            ⭐ FEATURED
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnifiedSearch() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minRating, setMinRating] = useState(4);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['unified-listings'],
    queryFn: () => base44.entities.Listing.list('-rating', 500),
  });

  const filtered = useMemo(() => {
    return listings.filter(l => {
      const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase());
      const matchCity = !selectedCity || l.city === selectedCity;
      const matchCategory = !selectedCategory || l.category === selectedCategory;
      const matchRating = l.rating >= minRating;
      return matchSearch && matchCity && matchCategory && matchRating;
    });
  }, [listings, search, selectedCity, selectedCategory, minRating]);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">🌍 Locali Egypt Unified Directory</h1>
        <p className="text-gray-600 text-sm">Hotels • Restaurants • Tours • Guides • Activities • All verified from Google Places</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">City</label>
            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Cities</option>
              {CITIES.map(c => <option key={c} value={c}>{CITY_LABELS[c]}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Category</label>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Min Rating</label>
            <select value={minRating} onChange={e => setMinRating(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="4">4.0+</option>
              <option value="4.3">4.3+</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Results</label>
            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold bg-blue-50 text-blue-700">
              {filtered.length} listings
            </div>
          </div>
        </div>

        {(search || selectedCity || selectedCategory || minRating !== 4) && (
          <button onClick={() => { setSearch(''); setSelectedCity(''); setSelectedCategory(''); setMinRating(4); }}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all filters
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-gray-600">Loading unified listings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-bold mb-1">No listings found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 text-center">
        <p className="text-sm text-blue-800">
          ✅ All data automatically synced from Google Places API every 24 hours • Only verified businesses with 4.0+ rating
        </p>
      </div>
    </div>
  );
}