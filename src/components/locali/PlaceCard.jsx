import { MapPin, Star, MessageCircle } from 'lucide-react';
import PlaceImageGrid from './PlaceImageGrid';

const CITY_LABELS = {
  hurghada: 'Hurghada', 'sharm-el-sheikh': 'Sharm El Sheikh', cairo: 'Cairo',
  luxor: 'Luxor', aswan: 'Aswan', 'el-gouna': 'El Gouna', dahab: 'Dahab', alexandria: 'Alexandria'
};

const CATEGORY_ICONS = { hotel: '🏨', apartment: '🏠', experience: '🎯', service: '🛎️' };

const UNIT_LABELS = {
  per_night: '/ night', per_service: '/ service', per_person: '/ person'
};

export default function PlaceCard({ place }) {
  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in "${place.title}" (${place.price} EGP ${UNIT_LABELS[place.price_unit] || '/ night'}). Location: ${place.address || place.city}. Please share more details.`
  );

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
      {/* Airbnb-style image grid */}
      <div className="relative">
        <PlaceImageGrid place={place} className="rounded-none" />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full capitalize">
            {CATEGORY_ICONS[place.category]} {place.category}
          </span>
          {place.is_featured && (
            <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">★ Featured</span>
          )}
        </div>

        {!place.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="bg-white text-gray-800 font-bold text-sm px-4 py-2 rounded-full">Not Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">{place.title}</h3>
          {place.rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-gray-700">{Number(place.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>{CITY_LABELS[place.city] || place.city}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-black text-gray-900 text-base">{place.price?.toLocaleString()} EGP</span>
            <span className="text-gray-400 text-xs ml-1">{UNIT_LABELS[place.price_unit] || '/ night'}</span>
          </div>
          <div className="flex gap-2">
            {place.google_maps_link && (
              <a href={place.google_maps_link} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={e => e.stopPropagation()} title="Open in Maps">
                <MapPin className="w-3.5 h-3.5 text-gray-600" />
              </a>
            )}
            {place.whatsapp && (
              <a href={`https://wa.me/${place.whatsapp.replace(/\D/g,'')}?text=${whatsappMsg}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                onClick={e => e.stopPropagation()}>
                <MessageCircle className="w-3.5 h-3.5" />
                Book
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}