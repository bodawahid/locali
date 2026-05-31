import { useEffect, useState } from 'react';
import { Home, MapPin, ExternalLink } from 'lucide-react';

function CityCard({ city }) {
  const [expanded, setExpanded] = useState(false);

  // تحويل النصوص اللي جاية من الداتا بيز لمصفوفات حقيقية لو متسجلة كـ JSON string
  // بدّل السطر القديم بتاع الـ neighborhoods بالسطرين دول:
let neighborhoods = [];
try {
  neighborhoods = typeof city.amenities === 'string' ? JSON.parse(city.amenities || '[]') : (Array.isArray(city.amenities) ? city.amenities : []);
} catch (e) {
  neighborhoods = [];
}

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* الصورة الأساسية للشقة من الداتا بيز */}
      <div className="h-48 w-full overflow-hidden bg-gray-100 relative">
        <img 
          src={city.main_image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'} 
          alt={city.title} 
          className="w-full h-full object-cover"
        />
        {city.is_verified === 'true' && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            ✓ Verified
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <h3 className="font-extrabold text-base text-gray-900 leading-tight mb-1">{city.title}</h3>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-500" /> {city.city} {city.area ? `· ${city.area}` : ''}
            </p>
          </div>
        </div>

        {/* تفاصيل الشقة من قاعدة البيانات */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-xl border border-green-100 bg-green-50 p-2 text-center">
            <p className="text-[9px] font-bold text-green-700 uppercase mb-0.5">Price / Night</p>
            <p className="text-[11px] font-black text-green-800">{city.price_per_night_egp} EGP</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-2 text-center">
            <p className="text-[9px] font-bold text-blue-700 uppercase mb-0.5">Bedrooms</p>
            <p className="text-[11px] font-black text-blue-800">{city.bedrooms} Beds</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-2 text-center">
            <p className="text-[9px] font-bold text-amber-700 uppercase mb-0.5">Capacity</p>
            <p className="text-[11px] font-black text-amber-800">{city.capacity} Guests</p>
          </div>
        </div>

        {/* الـ Amenities / المميزات المفرشة */}
        {neighborhoods.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Amenities</p>
            <div className="flex flex-wrap gap-1">
              {neighborhoods.slice(0, 4).map((n) => (
                <span key={n} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* تلميحات المضيف أو الشروط */}
        <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-indigo-600 font-bold mb-3 hover:underline flex items-center gap-1">
          {expanded ? '▲ Hide Rules' : '▼ View House Rules & Tips'}
        </button>
        {expanded && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
            <p className="text-[10px] text-amber-700 leading-relaxed">
              💡 {city.rules || city.description || 'No special rules specified.'}
              <br />
              <span className="font-bold">Min Nights:</span> {city.min_nights} nights.
            </p>
          </div>
        )}

        {/* أزرار الحجز المباشر بالواتساب بناءً على داتا الـ CSV */}
        <div className="space-y-2 pt-1">
          <a href={`https://wa.me/${city.host_phone}?text=Hi%20${city.host_name},%20I'm%20interested%20in%20your%20listing:%20${encodeURIComponent(city.title)}`} 
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
            💬 Contact Host ({city.host_name})
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Apartments() {
  const [dbApartments, setDbApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // سحب الداتا الحية من الـ XAMPP API بتاعك
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=Apartment`;
    
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        // نأكد إن الداتا جاية على شكل مصفوفة عشان الماب ميتعبناش
        setDbApartments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading db apartments:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 px-4 pt-10 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">🏠</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Long Stay & Apartments</h1>
          <p className="text-white/80 text-sm">Real-time DB rentals · Verified prices · Direct from host</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Pro tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-bold text-sm text-amber-800 mb-0.5">Direct Booking System</p>
            <p className="text-xs text-amber-700">These listings are fetched directly from your local MySQL database. Click on any card to contact verified owners instantly via WhatsApp with zero commission fees.</p>
          </div>
        </div>

        {/* الـ Loader */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 font-medium">جاري سحب الشقق الحقيقية من الداتا بيز...</p>
          </div>
        ) : dbApartments.length === 0 ? (
          <div className="text-center py-20 bg-white border rounded-3xl p-6">
            <p className="text-sm text-gray-400 font-bold">مفيش داتا شقق في الجدول حالياً، تأكد من تفعيل الـ API</p>
          </div>
        ) : (
          /* رص كروت الشقق الحقيقية اللى جاية من الـ CSV */
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {dbApartments.map((apartment) => (
              <CityCard key={apartment.id_index} city={apartment} />
            ))}
          </div>
        )}

        {/* Bottom info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-10 text-center shadow-sm">
          <Home className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
          <h3 className="font-extrabold text-base mb-1">Need to add more apartments?</h3>
          <p className="text-xs text-gray-500 mb-3">You can populate tables anytime using your excel files directly into phpMyAdmin without changing code.</p>
        </div>
      </div>
    </div>
  );
}