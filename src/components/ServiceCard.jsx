import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Phone, MessageCircle, Pencil, Navigation } from 'lucide-react';
import SmartImage from './SmartImage';
import AdminImageUploadOverlay from './AdminImageUploadOverlay';

const CATEGORY_LABELS = {
  restaurant: '🍽️ Restaurant',
  medical: '🏥 Medical',
  transport: '🚗 Transport',
  activities: '🏄 Activities',
  kids_family: '👨‍👩‍👧 Kids & Family',
  sim_internet: '📶 SIM & Internet',
  nightlife: '🎉 Nightlife',
  remote_work: '💻 Remote Work',
  long_stay: '🏠 Long Stay',
  other: '📌 Other',
};

export default function ServiceCard({ service: initialService, isAdmin, onEdit }) {
  const [service, setService] = useState(initialService);

  const mapsUrl = service.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.name + ' ' + (service.address || '') + ' Egypt')}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.name + ' Egypt')}`;

  const waNumber = service.phone?.replace(/[^0-9]/g, '');

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {isAdmin && (
        <button
          onClick={(e) => { e.preventDefault(); onEdit?.(); }}
          className="absolute top-2 right-2 z-20 bg-white/90 border border-gray-200 text-gray-500 p-1.5 rounded-lg shadow-sm hover:bg-teal-50 hover:text-teal-600 transition-all"
          title="Edit listing"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Image */}
      <AdminImageUploadOverlay
        entityName="Service"
        recordId={service.id || service.id_index}
        onUploaded={(url) => setService(prev => ({ ...prev, main_image: url }))}
        className="relative h-40 overflow-hidden bg-gray-100"
      >
        <Link to={`/service/${service.id || service.id_index}`}>
          <SmartImage
            place={service}
            width={600}
            height={300}
            className="w-full h-full object-cover"
            alt={service.name}
            entityName="Service"
            recordId={service.id || service.id_index}
            onUploaded={(url) => setService(prev => ({ ...prev, main_image: url }))}
          />
        </Link>
        {(service.is_verified && service.is_verified !== 'false') && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-teal-500 text-white px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase">Verified</span>
          </div>
        )}
        {(service.is_featured && service.is_featured !== 'false') && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 rounded-full">
            <span className="text-[10px] font-bold uppercase">Featured</span>
          </div>
        )}
      </AdminImageUploadOverlay>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Category chip */}
        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full self-start mb-1">
          {CATEGORY_LABELS[service.category] || service.category}
        </span>

        {/* Business name */}
        <Link to={`/service/${service.id || service.id_index}`}>
          <h3 className="font-black text-gray-900 text-base leading-tight mb-1 hover:text-teal-600 transition-colors line-clamp-1">
            {service.name}
          </h3>
        </Link>

        {/* Area / Address */}
        {service.address && (
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-500 truncate">{service.address}</span>
          </div>
        )}

        {/* Rating — مؤمنة بالكامل الحين ضد الـ String والـ Null */}
        {Number(service.avg_rating || 0) > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span className="text-sm font-bold text-gray-800">
              {Number(service.avg_rating).toFixed(1)}
            </span>
            {Number(service.review_count || 0) > 0 && (
              <span className="text-xs text-gray-400">({service.review_count})</span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          {/* Google Maps — always shown */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 flex-1 justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            Maps
          </a>

          {/* Phone — only if real phone exists */}
          {service.phone && (
            <a
              href={`tel:${service.phone}`}
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 flex-1 justify-center bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
          )}

          {/* WhatsApp — only if phone exists */}
          {service.phone && (
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 flex-1 justify-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WA
            </a>
          )}
        </div>
      </div>
    </div>
  );
}