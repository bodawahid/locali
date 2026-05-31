import { useState, useRef, useEffect } from 'react';
import { localApi } from '@/api/localApi';
import {
  Search, MapPin, Phone, Globe, Star, Clock, Loader2,
  X, ChevronRight, ExternalLink, MessageCircle
} from 'lucide-react';

const TYPE_ICONS = {
  lodging: '🏨', restaurant: '🍽️', tourist_attraction: '🗺️',
  museum: '🏛️', spa: '💆', gym: '🏋️', cafe: '☕',
  bar: '🍸', night_club: '🎵', shopping_mall: '🛍️',
};

function getIcon(types = []) {
  for (const t of types) {
    if (TYPE_ICONS[t]) return TYPE_ICONS[t];
  }
  return '📍';
}

function StarRow({ rating, total }) {
  if (!rating) return null;
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className={`w-3.5 h-3.5 ${i <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
        ))}
      </div>
      <span className="text-sm font-bold">{rating}</span>
      {total > 0 && <span className="text-xs text-gray-400">({total.toLocaleString()} reviews)</span>}
    </div>
  );
}

function MapEmbed({ lat, lng, name, placeId }) {
  if (!lat || !lng) return null;
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
      <div className="bg-gray-100 flex flex-col items-center justify-center h-52 gap-3 relative">
        <div className="text-4xl">🗺️</div>
        <p className="text-sm font-bold text-gray-700 text-center px-4">{name}</p>
        <p className="text-xs text-gray-500 text-center px-4">
          📍 {lat?.toFixed(5)}, {lng?.toFixed(5)}
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${placeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" /> Open in Google Maps
        </a>
      </div>
    </div>
  );
}

function PlaceDetailPanel({ place, onClose }) {
  const whatsappNumber = place.phone
    ? place.phone.replace(/\D/g, '').replace(/^0/, '20')
    : null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
      {/* Header image */}
      {place.photo_url && (
        <div className="h-52 overflow-hidden">
          <img src={place.photo_url} alt={place.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{getIcon(place.types)}</span>
              <h2 className="text-xl font-black leading-tight">{place.name}</h2>
            </div>
            <StarRow rating={place.rating} total={place.user_ratings_total} />
            {place.is_open_now !== null && (
              <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${place.is_open_now ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {place.is_open_now ? '✅ Open Now' : '🔴 Closed Now'}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all shrink-0">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">{place.address}</p>
        </div>

        {/* Phone */}
        {place.phone && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Phone className="w-4 h-4 text-green-500 shrink-0" />
            <a href={`tel:${place.phone}`} className="text-sm font-bold text-gray-800 hover:text-green-600">
              {place.phone}
            </a>
          </div>
        )}

        {/* Website */}
        {place.website && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Globe className="w-4 h-4 text-purple-500 shrink-0" />
            <a href={place.website} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline truncate">
              {place.website.replace(/^https?:\/\/(www\.)?/, '').slice(0, 40)}...
            </a>
          </div>
        )}

        {/* Opening Hours */}
        {place.opening_hours?.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-bold text-gray-700">Opening Hours</p>
            </div>
            <div className="space-y-0.5">
              {place.opening_hours.map((h, i) => (
                <p key={i} className="text-xs text-gray-600">{h}</p>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <MapEmbed lat={place.lat} lng={place.lng} name={place.name} placeId={place.place_id} />

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all">
            <ExternalLink className="w-4 h-4" /> Google Maps
          </a>
          {whatsappNumber ? (
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-all">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          ) : (
            <a href={`tel:${place.phone}`}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${place.phone ? 'bg-gray-800 text-white hover:bg-gray-900' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              <Phone className="w-4 h-4" /> {place.phone ? 'Call' : 'No Phone'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlaceSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreSuggestions, setHasMoreSuggestions] = useState(false);
  const [suggestionPage, setSuggestionPage] = useState(1);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const latestRequestRef = useRef(0);

  const fetchSuggestionsPage = async (searchValue, page, append = false) => {
    if (!searchValue.trim()) return;
    const requestId = Date.now();
    latestRequestRef.current = requestId;

    if (append) setLoadingMore(true);
    else setSearching(true);

    try {
      const res = await localApi.functions.invoke('googlePlaces', {
        action: 'search',
        query: searchValue,
        page,
        limit: 8,
      });

      if (latestRequestRef.current !== requestId) return;

      const incoming = Array.isArray(res.data?.results) ? res.data.results : [];
      const hasMore = typeof res.data?.hasMore === 'boolean'
        ? res.data.hasMore
        : incoming.length >= 8;

      setSuggestions((prev) => {
        if (!append) return incoming;
        const existingIds = new Set(prev.map((item) => item.place_id));
        const merged = [...prev];
        incoming.forEach((item) => {
          if (!existingIds.has(item.place_id)) merged.push(item);
        });
        return merged;
      });
      setHasMoreSuggestions(hasMore);
      setSuggestionPage(page);
    } catch (err) {
      if (!append) setSuggestions([]);
      setHasMoreSuggestions(false);
      console.error('Search failed:', err);
    } finally {
      if (append) setLoadingMore(false);
      else setSearching(false);
    }
  };

  const handleSearch = (val) => {
    setQuery(val);
    setShowSuggestions(true);
    clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setHasMoreSuggestions(false);
      setSuggestionPage(1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      fetchSuggestionsPage(val, 1, false);
    }, 400);
  };

  const handleSelect = async (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
    setLoadingDetails(true);
    setSelectedPlace(null);

    try {
      const res = await localApi.functions.invoke('googlePlaces', { action: 'details', placeId: suggestion.place_id });
      setSelectedPlace(res.data?.place || null);
    } catch (err) {
      console.error('Details failed:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setHasMoreSuggestions(false);
    setSuggestionPage(1);
    setSelectedPlace(null);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!showSuggestions || !hasMoreSuggestions || searching || loadingMore || query.trim().length < 2) return;
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        fetchSuggestionsPage(query, suggestionPage + 1, true);
      },
      { root: null, rootMargin: '0px 0px 200px 0px', threshold: 0.1 }
    );
    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [showSuggestions, hasMoreSuggestions, searching, loadingMore, query, suggestionPage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">🔍</p>
          <h1 className="text-3xl font-black mb-1">Find Any Place in Egypt</h1>
          <p className="text-gray-500 text-sm">Real data from Google Places — address, phone, hours, map</p>
        </div>

        {/* Search Box */}
        <div className="relative mb-6">
          <div className="flex items-center bg-white border-2 border-blue-200 rounded-2xl shadow-lg px-4 py-3 gap-3 focus-within:border-blue-500 transition-all">
            <Search className="w-5 h-5 text-blue-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search restaurant, hotel, activity in Egypt..."
              className="flex-1 text-base focus:outline-none bg-transparent"
            />
            {searching && <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />}
            {query && !searching && (
              <button onClick={handleClear}>
                <X className="w-4 h-4 text-gray-400 hover:text-gray-700" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s.place_id}
                  onClick={() => handleSelect(s)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-all text-left border-b border-gray-50 last:border-0"
                >
                  <span className="text-xl shrink-0">{getIcon(s.types)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{s.name}</p>
                    <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {s.address}
                    </p>
                  </div>
                  {s.rating && (
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold">{s.rating}</span>
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              ))}
              {(loadingMore || hasMoreSuggestions || !hasMoreSuggestions) && (
                <div ref={sentinelRef} className="py-3 border-t border-gray-50">
                  {loadingMore ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Loading more places...
                    </div>
                  ) : hasMoreSuggestions ? (
                    <p className="text-center text-[11px] text-gray-400">Scroll for more results</p>
                  ) : (
                    <p className="text-center text-[11px] text-gray-400">No more places found</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading details */}
        {loadingDetails && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Fetching place details from Google...</p>
          </div>
        )}

        {/* Place Detail Panel */}
        {selectedPlace && !loadingDetails && (
          <PlaceDetailPanel place={selectedPlace} onClose={() => setSelectedPlace(null)} />
        )}

        {/* Empty state hint */}
        {!query && !selectedPlace && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {['Nino Restaurant Hurghada', 'Marriott Cairo', 'Luxor Temple', 'Sharm diving center'].map(hint => (
              <button key={hint} onClick={() => handleSearch(hint)}
                className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all text-left shadow-sm">
                🔎 {hint}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}