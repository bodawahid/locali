import { useParams, useOutletContext, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShieldCheck, MapPin, Globe, Star } from 'lucide-react';
import ScamGauge from '../components/ScamGauge';
import SafeNextStep from '../components/SafeNextStep';
import ReviewSection from '../components/ReviewSection';

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const { lang } = useOutletContext();

  // 1. الربط مع الـ PHP API لجدول الـ service الحقيقي
  const { data: service, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      // بنبعت الـ ID لملف الـ PHP عشان يجيب الخدمة دي بالظبط
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=service`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch service detail");
      const results = await res.json();
      
      // بنفلتر في الجافا سكريبت عشان نجيب العنصر المطابق للـ ID
      if (Array.isArray(results)) {
        return results.find(item => String(item.id || item.id_index) === String(serviceId));
      }
      return null;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Service not found</p>
        <Link to="/services" className="text-accent font-bold text-sm mt-2 inline-block">Back to Services</Link>
      </div>
    );
  }

  // تأمين مصفوفة الصور لو جاية كـ JSON String من قاعدة البيانات
  let photosArray = [];
  try {
    photosArray = typeof service.photos === 'string' ? JSON.parse(service.photos || '[]') : (Array.isArray(service.photos) ? service.photos : []);
  } catch (e) {
    photosArray = [];
  }
  const mainImage = service.main_image || photosArray[0] || '';

  // تظبيط مسار خرائط جوجل
  const mapsUrl = service.address
    ? `http://maps.google.com/?q=${encodeURIComponent(service.name + ' ' + (service.address || '') + ' Egypt')}`
    : `http://maps.google.com/?q=${encodeURIComponent(service.name + ' Egypt')}`;

  return (
    <div>
      {/* Header Image */}
      <div className="relative h-64 bg-gray-100">
        {mainImage ? (
          <img src={mainImage} alt={service.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-secondary flex items-center justify-center text-muted-foreground/40 text-4xl">🏙️</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <Link to="/services" className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        </div>
        {(service.is_verified && service.is_verified !== 'false') && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider">VERIFIED</span>
          </div>
        )}
      </div>

      <div className="px-4 py-6 max-w-3xl mx-auto space-y-6">
        {/* Info */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">{service.name}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full capitalize">
              {service.category?.replace('_', ' ')}
            </span>
            <span className="text-xs text-muted-foreground capitalize">{service.city?.replace('-', ' ')}</span>
            {Number(service.avg_rating || 0) > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                <span className="text-sm font-bold text-gray-800">{Number(service.avg_rating).toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="flex gap-3">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 py-3 rounded-xl font-bold text-sm min-h-[48px] text-gray-700 transition-colors">
            <MapPin className="w-4 h-4 text-teal-600" />
            Find on Google Maps →
          </a>
          {service.website && (
            <a href={service.website} target="_blank" rel="noopener noreferrer" 
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 py-3 rounded-xl font-bold text-sm min-h-[48px] text-gray-800 transition-all">
              <Globe className="w-4 h-4 text-orange-500" />
              Website
            </a>
          )}
        </div>

        {/* Description */}
        {service.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
          </div>
        )}

        {/* Address */}
        {service.address && (
          <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-600 font-medium">{service.address}</span>
          </div>
        )}

        {/* Scam Score */}
        {Number(service.scam_score || 0) > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center shadow-sm">
            <h3 className="font-bold text-sm text-gray-800 mb-3">Scam Probability</h3>
            <ScamGauge score={Number(service.scam_score)} />
          </div>
        )}

        {/* Reviews */}
        <div>
          <ReviewSection entityId={serviceId} city={service?.city} />
        </div>

        <SafeNextStep
          title="Check Fair Prices"
          description="Make sure you're paying the right amount"
          to="/price-checker"
        />
      </div>
    </div>
  );
}