import { X, MapPin, ExternalLink } from 'lucide-react';
import BookingButtons from './BookingButtons';

/**
 * PlaceDetailModal — reusable detail popup for any place/location.
 * Props:
 *   place: { name, description, photo, city, type: 'activity'|'hotel'|'place' }
 *   onClose: fn
 */
export default function PlaceDetailModal({ place, onClose }) {
  if (!place) return null;

  const { name, description, photo, city = 'Egypt', type = 'activity' } = place;

  // Fallback image from Unsplash if no photo
  const heroImage = photo || `https://source.unsplash.com/featured/800x400/?${encodeURIComponent(name + ' Egypt')}`;

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(name + ' Egypt')}`;
  const bookingUrl = `https://www.booking.com/search.html?ss=${encodeURIComponent(name + ' ' + city + ' Egypt')}`;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative h-52 sm:h-64 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
          <img
            src={heroImage}
            alt={name}
            className="w-full h-full object-cover"
            onError={e => {
              e.target.src = `https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&q=80`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-12">
            <h2 className="text-white font-extrabold text-xl leading-tight drop-shadow">{name}</h2>
            {city && city !== 'Egypt' && (
              <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{city}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          )}

          {/* Google Maps */}
          <button
            onClick={() => window.open(mapsUrl, '_blank')}
            className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            📍 View on Google Maps →
          </button>

          {/* Booking links */}
          {type === 'hotel' ? (
            <div className="space-y-2">
              <button
                onClick={() => window.open(bookingUrl, '_blank')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90"
              >
                <ExternalLink className="w-4 h-4" /> Book on Booking.com →
              </button>
              <BookingButtons activity={name} city={city} />
            </div>
          ) : type !== 'place' ? (
            <BookingButtons activity={name} city={city} />
          ) : null}
        </div>
      </div>
    </div>
  );
}