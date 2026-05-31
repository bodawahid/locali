import { useState, useMemo, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Car, ShieldCheck, MapPin, Plus, X, Check, AlertTriangle, User, Flag, Phone, Loader2 } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const CITY_OPTIONS = [
  { id: 'hurghada', label: '🌊 Hurghada' },
  { id: 'sharm-el-sheikh', label: '🤿 Sharm El Sheikh' },
  { id: 'luxor', label: '🏛️ Luxor' },
  { id: 'aswan', label: '🛶 Aswan' },
  { id: 'el-gouna', label: '🏝️ El Gouna' },
];

const LANG_FLAGS = { English: '🇬🇧', Russian: '🇷🇺', German: '🇩🇪', Arabic: '🇪🇬', French: '🇫🇷', Italian: '🇮🇹', Polish: '🇵🇱' };
const LANG_OPTIONS = ['English', 'Arabic', 'Russian', 'German', 'French', 'Italian', 'Polish'];

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({ driver, onClose }) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleReportSubmit = async () => {
    setSubmitting(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=driver_report`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driver_id: driver.id || driver.id_index,
          driver_name: driver.full_name,
          reason: reason
        })
      });
      setDone(true);
    } catch (err) {
      console.error("Error submitting driver report:", err);
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
        {done ? (
          <div className="text-center py-4">
            <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
            <p className="font-bold">Report submitted. Thank you.</p>
            <button onClick={onClose} className="mt-3 text-sm text-gray-500 underline">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm">Report Driver: {driver.full_name}</h3>
              <button onClick={onClose}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Describe the issue. Our team will review within 24 hours.</p>
            <textarea rows={4} value={reason} onChange={e => setReason(e.target.value)}
              placeholder="Describe what happened..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none resize-none mb-3" />
            <button 
              disabled={!reason.trim() || submitting} 
              onClick={handleReportSubmit}
              className="w-full bg-red-500 text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-1"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Driver Card ──────────────────────────────────────────────────────────────
function DriverCard({ driver }) {
  const [showReport, setShowReport] = useState(false);
  const city = CITY_OPTIONS.find(c => c.id === String(driver.city).toLowerCase().trim());
  const whatsappUrl = `https://wa.me/${driver.whatsapp}`;

  const parsedLanguages = typeof driver.languages === 'string' 
    ? JSON.parse(driver.languages || '[]') 
    : (Array.isArray(driver.languages) ? driver.languages : []);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden ${(driver.is_verified && driver.is_verified !== 'false') ? 'border-green-200' : 'border-gray-100'}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border border-gray-50">
            {driver.photo_url ? (
              <img src={driver.photo_url} alt={driver.full_name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-7 h-7 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-extrabold text-base truncate">{driver.full_name}</h3>
              {(driver.is_verified && driver.is_verified !== 'false') && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            {city && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{city.label}
              </p>
            )}
          </div>
        </div>

        {/* Car & Experience */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1"><Car className="w-3 h-3" />{driver.car_model}</span>
          {driver.years_experience && <span>· {driver.years_experience} yrs exp</span>}
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1 mb-3">
          {parsedLanguages.map((lang, i) => (
            <span key={i} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
              {LANG_FLAGS[lang] || '🗣️'} {lang}
            </span>
          ))}
        </div>

        {driver.description && (
          <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{driver.description}</p>
        )}

        {/* CTAs */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity mb-2"
        >
          <Phone className="w-4 h-4" /> Contact on WhatsApp
        </a>
        <button onClick={() => setShowReport(true)}
          className="w-full flex items-center justify-center gap-1.5 border border-red-200 text-red-500 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">
          <Flag className="w-3 h-3" /> Report this driver
        </button>
      </div>

      {showReport && <ReportModal driver={driver} onClose={() => setShowReport(false)} />}
    </div>
  );
}

// ─── Registration Form ────────────────────────────────────────────────────────
function RegisterForm({ onClose }) {
  const [form, setForm] = useState({
    full_name: '', city: '', whatsapp: '', car_model: '',
    years_experience: '', languages: [], description: '', photo_url: '',
  });
  const [done, setDone] = useState(false);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data) => {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=verified_driver`;
      const payload = {
        ...data,
        years_experience: Number(data.years_experience),
        languages: JSON.stringify(data.languages),
        status: 'pending',
        is_verified: 'false'
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to register driver profile");
      return res.json();
    },
    onSuccess: () => { 
      setDone(true); 
      queryClient.invalidateQueries(['local_drivers_infinite']); 
    },
  });

  const toggleLang = (l) => setForm(p => ({
    ...p, languages: p.languages.includes(l) ? p.languages.filter(x => x !== l) : [...p.languages, l],
  }));

  const submit = (e) => {
    e.preventDefault();
    create.mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4"><X className="w-4 h-4 text-gray-400" /></button>
        <h2 className="font-extrabold text-lg mb-1">Register as a Driver</h2>
        <p className="text-xs text-gray-500 mb-4">Tourists will contact you directly via WhatsApp after seeing your profile.</p>

        {done ? (
          <div className="text-center py-8">
            <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-extrabold text-lg mb-1">Application Submitted!</h3>
            <p className="text-xs text-gray-500 mb-4">Our team will review and approve your profile within 48 hours. Once approved, tourists can contact you directly.</p>
            <button onClick={onClose} className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            {[
              { key: 'full_name', label: 'Full Name *', placeholder: 'Mohamed Ahmed' },
              { key: 'whatsapp', label: 'WhatsApp Number * (shown to tourists)', placeholder: '201012345678' },
              { key: 'car_model', label: 'Car Type & Year *', placeholder: 'Toyota Camry 2022' },
              { key: 'years_experience', label: 'Years of Experience *', placeholder: '5', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold mb-1 block">{f.label}</label>
                <input type={f.type || 'text'} required value={form[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>
            ))}

            <div>
              <label className="text-xs font-bold mb-2 block">City *</label>
              <select required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-400 bg-white">
                <option value="">Select city</option>
                {CITY_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold mb-2 block">Languages Spoken *</label>
              <div className="flex flex-wrap gap-1.5">
                {LANG_OPTIONS.map(l => (
                  <button type="button" key={l} onClick={() => toggleLang(l)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${form.languages.includes(l) ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 bg-gray-50'}`}>
                    {LANG_FLAGS[l]} {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold mb-1 block">About You (optional)</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Your experience, areas covered, specialties..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-green-400" />
            </div>

            <div>
              <label className="text-xs font-bold mb-1 block">Profile Photo (optional)</label>
              <ImageUpload value={form.photo_url} onChange={url => setForm(p => ({ ...p, photo_url: url || '' }))} label="Upload Your Photo" />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">By registering, you agree to provide honest service. False information leads to permanent removal.</p>
            </div>

            <button type="submit"
              disabled={create.isPending || !form.full_name || !form.whatsapp || !form.car_model || !form.city || !form.languages.length}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-1">
              {create.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {create.isPending ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VerifiedDrivers() {
  const [cityFilter, setCityFilter] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const queryClient = useQueryClient();

  // 1. تثبيت الـ queryKey واستخدام useInfiniteQuery لضمان سحب ناعم وبدون ريرندر مزعج
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['local_drivers_infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=verified_driver&page=${pageParam}&limit=24`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Failed to fetch verified drivers");
      const resData = await res.json();
      return Array.isArray(resData) ? resData : [];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 24 ? allPages.length + 1 : undefined;
    },
    keepPreviousData: true,
  });

  // 2. تجميع وفلترة السائقين محلياً بالـ useMemo لمنع الرمش واختفاء الكروت
  const filtered = useMemo(() => {
    if (!data?.pages) return [];
    const allDrivers = data.pages.flat();

    return allDrivers.filter(d => {
      const isApproved = d.status === 'approved';
      if (!isApproved) return false;
      
      if (cityFilter) {
        const driverCity = String(d.city).toLowerCase().trim();
        return driverCity === cityFilter;
      }
      return true;
    });
  }, [data, cityFilter]);

  // 3. مراقب السكرول اللانهائي السلس والـ Trigger التلقائي للداتا الجديدة
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Car className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Verified Local Drivers</h1>
          </div>
          <p className="text-sm text-gray-500">Browse trusted drivers · Contact directly via WhatsApp</p>
        </div>
        <button onClick={() => setShowRegister(true)}
          className="shrink-0 flex items-center gap-1.5 bg-green-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
          <Plus className="w-3.5 h-3.5" /> Register as Driver
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <strong>Disclaimer:</strong> Locali Egypt connects tourists with local drivers. We are not responsible for the service provided. Always agree on the price before starting your trip.
        </p>
      </div>

      {/* City Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        <button onClick={() => setCityFilter('')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!cityFilter ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'}`}>
          🌍 All Cities
        </button>
        {CITY_OPTIONS.map(c => (
          <button key={c.id} onClick={() => setCityFilter(c.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cityFilter === c.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-16">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-400 font-medium">Loading drivers network...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 mb-10 bg-card rounded-2xl border border-border">
          <Car className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-bold text-base mb-1">No drivers listed yet</p>
          <p className="text-sm text-muted-foreground mb-4">Be the first verified driver in {cityFilter ? CITY_OPTIONS.find(c => c.id === cityFilter)?.label : 'Egypt'}!</p>
          <button onClick={() => setShowRegister(true)}
            className="bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90">
            Register as Driver →
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-4">{filtered.length} driver{filtered.length !== 1 ? 's' : ''} {cityFilter ? `in ${CITY_OPTIONS.find(c => c.id === cityFilter)?.label}` : 'across Egypt'}</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {filtered.map((d, i) => <DriverCard key={d.id || d.id_index || i} driver={d} />)}
          </div>
          
          {/* مؤشر تحميل ناعم أسفل كروت السائقين عند السكرول */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-6 mt-4">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          )}
        </>
      )}

      {/* Driver CTA */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-center text-white">
        <h3 className="font-extrabold text-lg mb-1">Are you a driver in Egypt?</h3>
        <p className="text-white/80 text-xs mb-4">Register your profile for free. Tourists will contact you directly via WhatsApp.</p>
        <button onClick={() => setShowRegister(true)}
          className="bg-white text-green-600 font-extrabold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
          Register for Free →
        </button>
      </div>

      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
    </div>
  );
}