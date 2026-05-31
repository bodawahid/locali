import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Car, ShieldCheck, Star, MapPin, Lock, User, Languages,
  Plus, X, Check, CreditCard, AlertTriangle, Bell, Clock,
  MessageCircle, Send, Phone, Navigation, Zap, ChevronRight,
  Flag, TriangleAlert, ThumbsUp, Radio, Eye, EyeOff
} from 'lucide-react';
import { useSEO } from '../lib/seo';
import { generateTrackingCode } from '../lib/constants';

const CITY_LABELS = {
  hurghada: '🌊 Hurghada',
  'sharm-el-sheikh': '🤿 Sharm El Sheikh',
  luxor: '🏛️ Luxor',
  aswan: '🛶 Aswan',
  'el-gouna': '🏝️ El Gouna',
  cairo: '🏙️ Cairo',
};

const LANG_FLAGS = { English: '🇬🇧', Russian: '🇷🇺', German: '🇩🇪', Arabic: '🇪🇬', French: '🇫🇷', Italian: '🇮🇹', Polish: '🇵🇱' };

const QUICK_MESSAGES = [
  { emoji: '📍', text: "I'm at the pickup point" },
  { emoji: '⏱️', text: 'Please wait 5 minutes' },
  { emoji: '✅', text: "I can see your car" },
  { emoji: '🚗', text: "I'm on my way" },
  { emoji: '🆘', text: 'I need help' },
];

const SAMPLE_DRIVERS = [
  {
    id: 'd1', full_name: 'Local Verified Driver', is_verified: true, status: 'approved',
    photo_url: '',
    cities_covered: ['hurghada', 'el-gouna', 'luxor'],
    languages: ['Arabic', 'English', 'Russian'],
    car_model: 'Toyota Camry', car_color: 'White', car_year: 2022,
    description: 'Professional driver with 8 years experience. Always on time, AC always cold.',
    avg_rating: 4.9, review_count: 147, total_rides: 892, response_time: '< 3 min',
    price_routes: [
      { route: 'Hurghada Airport → Marina', price_egp: 250, duration_min: 25 },
      { route: 'Hurghada → El Gouna', price_egp: 350, duration_min: 35 },
      { route: 'Hurghada → Luxor (day trip)', price_egp: 2200, duration_min: 210 },
      { route: 'Hurghada City Tour (half day)', price_egp: 600, duration_min: 240 },
      { route: 'Hurghada Airport → Sahl Hasheesh', price_egp: 380, duration_min: 40 },
    ],
  },
  {
    id: 'd2', full_name: 'Local Verified Driver', is_verified: true, status: 'approved',
    photo_url: '',
    cities_covered: ['sharm-el-sheikh'],
    languages: ['Arabic', 'English', 'German'],
    car_model: 'Hyundai Tucson', car_color: 'Silver', car_year: 2021,
    description: 'Certified tourist transport driver. No hidden fees ever.',
    avg_rating: 4.8, review_count: 93, total_rides: 541, response_time: '< 5 min',
    price_routes: [
      { route: 'Sharm Airport → Naama Bay', price_egp: 200, duration_min: 20 },
      { route: 'Sharm Airport → Sharks Bay', price_egp: 220, duration_min: 25 },
      { route: 'Sharm → St Catherine Monastery', price_egp: 1800, duration_min: 180 },
      { route: 'Sharm City Tour (full day)', price_egp: 900, duration_min: 480 },
    ],
  },
  {
    id: 'd3', full_name: 'Local Verified Driver', is_verified: true, status: 'approved',
    photo_url: '',
    cities_covered: ['luxor', 'aswan'],
    languages: ['Arabic', 'English', 'French', 'Italian'],
    car_model: 'Kia Sportage', car_color: 'Black', car_year: 2023,
    description: 'Upper Egypt specialist. Licensed tourism driver since 2012.',
    avg_rating: 4.9, review_count: 78, total_rides: 410, response_time: '< 4 min',
    price_routes: [
      { route: 'Luxor Airport → Corniche Hotels', price_egp: 180, duration_min: 20 },
      { route: 'Luxor West Bank temples (half day)', price_egp: 700, duration_min: 240 },
      { route: 'Luxor → Aswan (private)', price_egp: 2800, duration_min: 270 },
      { route: 'Aswan Airport → Corniche Hotels', price_egp: 160, duration_min: 15 },
      { route: 'Aswan Nubian Village Tour', price_egp: 450, duration_min: 180 },
    ],
  },
  {
    id: 'd4', full_name: 'Local Verified Driver', is_verified: false, status: 'approved',
    photo_url: '',
    cities_covered: ['hurghada', 'el-gouna'],
    languages: ['Arabic', 'English', 'Russian', 'Polish'],
    car_model: 'Skoda Octavia', car_color: 'Grey', car_year: 2020,
    description: 'Friendly 24/7 driver. Hurghada local — I know all the best spots.',
    avg_rating: 4.6, review_count: 54, total_rides: 223, response_time: '< 8 min',
    price_routes: [
      { route: 'Hurghada Airport → Sahl Hasheesh', price_egp: 380, duration_min: 40 },
      { route: 'Hurghada Airport → El Gouna', price_egp: 420, duration_min: 45 },
      { route: 'Hurghada → Soma Bay', price_egp: 500, duration_min: 55 },
    ],
  },
];

// ─── SOS Modal ────────────────────────────────────────────────────────────────
function SOSModal({ onClose, driver }) {
  const [sent, setSent] = useState(false);
  const send = () => { setSent(true); setTimeout(onClose, 3000); };

  return (
    <div className="fixed inset-0 bg-red-900/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-card w-full max-w-xs rounded-2xl border-2 border-red-500 p-6 text-center">
        {sent ? (
          <>
            <Check className="w-12 h-12 text-success mx-auto mb-3" />
            <h2 className="font-extrabold text-lg mb-1">SOS Sent</h2>
            <p className="text-xs text-muted-foreground">Your location has been sent to Locali Egypt admin and your emergency contact. Help is on the way.</p>
          </>
        ) : (
          <>
            <TriangleAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="font-extrabold text-lg mb-2 text-red-600">EMERGENCY SOS</h2>
            <p className="text-xs text-muted-foreground mb-4">This will immediately send your live location to Locali Egypt admin and your emergency contact. Use only in genuine emergency.</p>
            {driver && <p className="text-xs bg-secondary rounded-xl p-2 mb-4">Ride with: <strong>{driver.full_name}</strong> · {driver.car_model} {driver.car_color}</p>}
            <button onClick={send} className="w-full bg-red-600 text-white py-3 rounded-xl font-extrabold text-base mb-2">
              🆘 SEND SOS NOW
            </button>
            <button onClick={onClose} className="w-full text-xs text-muted-foreground py-2">Cancel — I'm safe</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Live Tracking Screen ─────────────────────────────────────────────────────
function LiveTrackingScreen({ booking, onComplete }) {
  const [showChat, setShowChat] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'driver', text: "Hello! I'm on my way to your pickup point. I'll be there soon.", time: 'now', translated: true },
  ]);
  const [input, setInput] = useState('');
  const [translating, setTranslating] = useState(false);
  const [eta, setEta] = useState(booking.route?.duration_min || 15);
  const [rideStatus, setRideStatus] = useState('en_route'); // en_route | arrived | in_ride | completed
  const chatEndRef = useRef(null);

  // Simulate ETA countdown
  useEffect(() => {
    if (rideStatus !== 'en_route') return;
    const t = setInterval(() => setEta(e => {
      if (e <= 1) { setRideStatus('arrived'); clearInterval(t); return 0; }
      return e - 1;
    }), 8000);
    return () => clearInterval(t);
  }, [rideStatus]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setInput('');
    const userMsg = { from: 'tourist', text, time: 'now' };
    setMessages(p => [...p, userMsg]);
    setTranslating(true);
    // Auto-translate via AI
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Translate this tourist message to Arabic for the driver, then write a natural Arabic driver reply, then translate that reply back to English. 
Tourist message: "${text}"
Respond as JSON: {"arabic_message": "...", "driver_reply_arabic": "...", "driver_reply_english": "..."}`,
      response_json_schema: {
        type: 'object',
        properties: {
          arabic_message: { type: 'string' },
          driver_reply_arabic: { type: 'string' },
          driver_reply_english: { type: 'string' },
        },
      },
    }).catch(() => null);
    setTranslating(false);
    if (res?.driver_reply_english) {
      setTimeout(() => {
        setMessages(p => [...p, {
          from: 'driver',
          text: res.driver_reply_english,
          arabic: res.driver_reply_arabic,
          time: 'now',
          translated: true,
        }]);
      }, 800);
    }
  };

  const statusLabels = {
    en_route: { label: `Driver arriving in ~${eta} min`, color: 'bg-amber-500', dot: 'animate-pulse' },
    arrived: { label: 'Driver has arrived! 🚗', color: 'bg-success', dot: '' },
    in_ride: { label: 'Ride in progress', color: 'bg-blue-500', dot: 'animate-pulse' },
    completed: { label: 'Ride completed ✓', color: 'bg-success', dot: '' },
  };
  const status = statusLabels[rideStatus];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col max-w-md mx-auto">
      {/* Status bar */}
      <div className={`${status.color} px-4 py-3 flex items-center gap-2`}>
        <div className={`w-2 h-2 rounded-full bg-white ${status.dot}`} />
        <span className="text-white font-bold text-sm flex-1">{status.label}</span>
        <button onClick={() => setShowSOS(true)} className="bg-red-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full">🆘 SOS</button>
      </div>

      {/* Map placeholder */}
      <div className="relative bg-slate-100 dark:bg-slate-800 flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #f59e0b 2px, transparent 2px), radial-gradient(circle at 70% 60%, #10b981 3px, transparent 3px)', backgroundSize: '60px 60px' }} />
        <div className="text-center z-10">
          <div className="text-6xl mb-2">{rideStatus === 'en_route' ? '🚗' : rideStatus === 'arrived' ? '🚖' : '🗺️'}</div>
          <p className="text-sm font-bold text-muted-foreground">Live tracking active</p>
          <p className="text-xs text-muted-foreground">{rideStatus === 'en_route' ? `ETA: ~${eta} minutes` : rideStatus === 'arrived' ? 'Driver at pickup point' : 'Ride in progress'}</p>
        </div>
        {/* Floating driver card */}
        <div className="absolute bottom-4 left-4 right-4 bg-card rounded-2xl border border-border/50 p-3 shadow-lg">
          <div className="flex items-center gap-3">
            {booking.driver?.photo_url ? (
              <img src={booking.driver.photo_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-sm">{booking.driver?.full_name}</p>
                {booking.driver?.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-success" />}
              </div>
              <p className="text-xs text-muted-foreground">{booking.driver?.car_model} · {booking.driver?.car_color}</p>
              {rideStatus !== 'en_route' && (
                <p className="text-xs font-bold text-accent">Plate: {booking.plateNumber}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowChat(true)}
                className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-accent" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border bg-card space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground bg-secondary/50 rounded-xl px-3 py-2">
          <span>Route: <strong>{booking.route?.route}</strong></span>
          <span className="font-extrabold text-accent">{booking.route?.price_egp?.toLocaleString()} EGP</span>
        </div>
        {rideStatus === 'arrived' && (
          <button onClick={() => setRideStatus('in_ride')}
            className="w-full bg-success text-success-foreground py-3 rounded-xl font-bold text-sm">
            ✅ I'm in the car — Start Ride
          </button>
        )}
        {rideStatus === 'in_ride' && (
          <button onClick={() => { setRideStatus('completed'); setTimeout(onComplete, 1500); }}
            className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm">
            🏁 Confirm Arrival — Complete Ride
          </button>
        )}
        {(rideStatus === 'en_route') && (
          <button onClick={() => setShowChat(true)}
            className="w-full flex items-center justify-center gap-2 bg-card border border-border py-2.5 rounded-xl text-sm font-bold">
            <MessageCircle className="w-4 h-4" /> Chat with Driver
          </button>
        )}
      </div>

      {/* Chat panel */}
      {showChat && (
        <div className="absolute inset-0 bg-background flex flex-col z-10">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
            <button onClick={() => setShowChat(false)}><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 flex-1">
              {booking.driver?.photo_url && <img src={booking.driver.photo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />}
              <div>
                <p className="font-bold text-sm">{booking.driver?.full_name}</p>
                <p className="text-[10px] text-success">Auto-translation enabled 🌐</p>
              </div>
            </div>
            <button onClick={() => setShowSOS(true)} className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-full">🆘</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'tourist' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${m.from === 'tourist' ? 'bg-accent text-accent-foreground' : 'bg-card border border-border'}`}>
                  <p className="text-sm">{m.text}</p>
                  {m.arabic && <p className="text-[10px] opacity-60 mt-0.5">🇪🇬 {m.arabic}</p>}
                  {m.translated && m.from === 'driver' && <p className="text-[9px] opacity-50 mt-0.5">Auto-translated</p>}
                </div>
              </div>
            ))}
            {translating && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Quick messages */}
          <div className="px-3 py-2 flex gap-2 overflow-x-auto hide-scrollbar border-t border-border">
            {QUICK_MESSAGES.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q.text)}
                className="shrink-0 text-[10px] bg-secondary px-2 py-1.5 rounded-full font-medium whitespace-nowrap">
                {q.emoji} {q.text}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Type in any language..." className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm outline-none" />
            <button onClick={() => sendMessage(input)} disabled={!input.trim()}
              className="w-10 h-10 bg-accent text-accent-foreground rounded-xl flex items-center justify-center disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showSOS && <SOSModal driver={booking.driver} onClose={() => setShowSOS(false)} />}
    </div>
  );
}

// ─── Rating Screen ─────────────────────────────────────────────────────────────
function RatingScreen({ booking, onDone }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => { setSubmitted(true); setTimeout(onDone, 2000); };

  if (submitted) return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-8 text-center">
      <ThumbsUp className="w-16 h-16 text-success mb-4" />
      <h2 className="text-2xl font-extrabold mb-2">Thanks for rating!</h2>
      <p className="text-muted-foreground text-sm">Your review helps other tourists find trusted drivers.</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <h2 className="text-xl font-extrabold mb-1">How was your ride?</h2>
      <p className="text-sm text-muted-foreground mb-6">Rate your driver: <strong>{booking.driver?.full_name}</strong></p>
      {booking.driver?.photo_url && (
        <img src={booking.driver.photo_url} alt="" className="w-20 h-20 rounded-2xl object-cover mb-4" />
      )}
      <div className="flex gap-3 mb-6">
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} onClick={() => setRating(s)}>
            <Star className={`w-10 h-10 transition-colors ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-border'}`} />
          </button>
        ))}
      </div>
      <textarea value={review} onChange={e => setReview(e.target.value)} rows={3}
        placeholder="Share your experience (optional)..."
        className="w-full bg-secondary rounded-2xl px-4 py-3 text-sm outline-none resize-none mb-4" />
      <div className="bg-secondary/50 rounded-xl p-3 mb-4 text-xs text-muted-foreground w-full">
        Ride: {booking.route?.route} · {booking.route?.price_egp?.toLocaleString()} EGP · Ref: {booking.code}
      </div>
      <button onClick={submit} disabled={!rating}
        className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-extrabold text-base disabled:opacity-40">
        Submit Rating
      </button>
      <button onClick={onDone} className="mt-2 text-xs text-muted-foreground">Skip for now</button>
    </div>
  );
}

// ─── Booking Confirmation Modal ───────────────────────────────────────────────
function BookingModal({ driver, route, onClose, onConfirmed }) {
  const [step, setStep] = useState('form'); // form | waiting | confirmed
  const [form, setForm] = useState({ date: '', time: '', name: '', email: '', note: '' });
  const [code] = useState(() => generateTrackingCode(driver.cities_covered?.[0] || 'egy', 'RDE'));
  const commission = Math.round((route?.price_egp || 0) * 0.10);
  const plateNumber = `ABC-${Math.floor(Math.random() * 9000 + 1000)}`;

  const submit = (e) => {
    e.preventDefault();
    setStep('waiting');
    // Simulate driver acceptance after 3 seconds
    setTimeout(() => { setStep('confirmed'); }, 3000);
  };

  const startTracking = () => {
    onConfirmed({ driver, route, code, plateNumber, form });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-sm rounded-2xl border border-border my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-extrabold text-sm">Book Locali Ride</h2>
            {route && <p className="text-[10px] text-muted-foreground">{route.route}</p>}
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        {step === 'waiting' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            <h3 className="font-extrabold mb-1">Waiting for Driver…</h3>
            <p className="text-xs text-muted-foreground">Notifying {driver.full_name}. Drivers respond within 10 minutes.</p>
            <div className="mt-4 flex justify-center gap-1">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}

        {step === 'confirmed' && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-extrabold">Driver Confirmed! 🎉</h3>
                <p className="text-xs text-success">Arriving in ~{route.duration_min} min</p>
              </div>
            </div>
            <div className="bg-secondary/60 rounded-xl p-4 space-y-2 mb-4">
              <div className="flex items-center gap-3">
                {driver.photo_url && <img src={driver.photo_url} alt="" className="w-12 h-12 rounded-xl object-cover" />}
                <div>
                  <p className="font-bold text-sm">{driver.full_name}</p>
                  <p className="text-xs text-muted-foreground">{driver.car_model} · {driver.car_color}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold">{driver.avg_rating}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-border/30 pt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground text-[10px]">Car Plate</p>
                  <p className="font-extrabold text-accent">{plateNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px]">Price (Fixed)</p>
                  <p className="font-extrabold">{route.price_egp.toLocaleString()} EGP</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-[10px]">Booking Ref</p>
                  <p className="font-mono font-bold">{code}</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-[10px] text-amber-700 mb-3">
              🔒 Driver's contact details are kept private by Locali Egypt for your safety.
            </div>
            <button onClick={startTracking}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" /> Open Live Tracking
            </button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div className="bg-secondary/60 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                {driver.photo_url && <img src={driver.photo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                <div>
                  <p className="font-bold text-sm">{driver.full_name}</p>
                  <p className="text-xs text-muted-foreground">{driver.car_model} · {driver.car_color}</p>
                </div>
              </div>
              {route && (
                <div className="flex justify-between text-xs mt-2 pt-2 border-t border-border/30">
                  <span className="text-muted-foreground">{route.route}</span>
                  <span className="font-extrabold text-accent">{route.price_egp.toLocaleString()} EGP</span>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">
                Locali 10% fee: {commission} EGP · Driver receives {(route.price_egp - commission).toLocaleString()} EGP
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold mb-1 block">Date *</label>
                <input type="date" required value={form.date} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold mb-1 block">Time *</label>
                <input type="time" required value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1 block">Your Name *</label>
              <input type="text" required value={form.name} placeholder="Full name"
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1 block">Email *</label>
              <input type="email" required value={form.email} placeholder="your@email.com"
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1 block">Pickup Note (optional)</label>
              <textarea rows={2} value={form.note} placeholder="Flight number, hotel name, special needs..."
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none resize-none" />
            </div>
            <div className="flex items-center gap-2 bg-success/10 border border-success/20 rounded-xl p-2 text-[10px] text-success">
              <Lock className="w-3 h-3 shrink-0" />
              Fixed price guaranteed. Driver cannot charge more.
            </div>
            <button type="submit" disabled={!form.date || !form.time || !form.name || !form.email}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
              Confirm Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Driver Card ──────────────────────────────────────────────────────────────
function DriverCard({ driver, onBook }) {
  const [selectedRoute, setSelectedRoute] = useState(null);

  return (
    <div className={`bg-card rounded-2xl border overflow-hidden ${driver.is_verified ? 'border-accent/30' : 'border-border/50'}`}>
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start gap-3 mb-3">
          {driver.photo_url ? (
            <img src={driver.photo_url} alt={driver.full_name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-extrabold text-base">{driver.full_name}</h3>
              {driver.is_verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-1">{driver.car_model} · <span className="font-semibold">{driver.car_color}</span></p>
            <div className="flex items-center gap-3 text-xs">
              {driver.avg_rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <strong>{driver.avg_rating}</strong>
                  <span className="text-muted-foreground">({driver.review_count})</span>
                </span>
              )}
              <span className="text-muted-foreground">{driver.total_rides?.toLocaleString()} rides</span>
              {driver.response_time && (
                <span className="flex items-center gap-0.5 text-success text-[10px] font-bold">
                  <Clock className="w-2.5 h-2.5" />{driver.response_time}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {driver.languages?.map((lang, i) => (
            <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
              {LANG_FLAGS[lang] || '🗣️'} {lang}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {driver.cities_covered?.map((c, i) => (
            <span key={i} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <MapPin className="w-2 h-2" />{CITY_LABELS[c] || c}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{driver.description}</p>
      </div>

      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-1.5 mb-3">
          <Lock className="w-3 h-3 text-muted-foreground" />
          <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Fixed Prices — Locked · No Negotiation</p>
        </div>
        <div className="space-y-1.5">
          {driver.price_routes?.map((r, i) => (
            <button key={i} onClick={() => setSelectedRoute(selectedRoute === r ? null : r)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${selectedRoute === r ? 'bg-accent/10 border border-accent/30' : 'bg-secondary/50 hover:bg-secondary'}`}>
              <div className="text-left">
                <p className="font-semibold">{r.route}</p>
                {r.duration_min && <p className="text-[10px] text-muted-foreground">~{r.duration_min >= 60 ? `${Math.floor(r.duration_min / 60)}h ${r.duration_min % 60 > 0 ? r.duration_min % 60 + 'min' : ''}` : `${r.duration_min} min`}</p>}
              </div>
              <span className="font-extrabold text-accent shrink-0 ml-3">{r.price_egp.toLocaleString()} EGP</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <button onClick={() => selectedRoute && onBook(driver, selectedRoute)} disabled={!selectedRoute}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
          <Car className="w-4 h-4" />
          {selectedRoute ? `Request Ride — ${selectedRoute.price_egp.toLocaleString()} EGP` : 'Select a Route Above'}
        </button>
        {selectedRoute && (
          <p className="text-[10px] text-center text-muted-foreground mt-1.5">
            ✅ Fixed price. Pay cash directly to driver after the trip.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Driver Registration Form ─────────────────────────────────────────────────
function DriverRegisterForm({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: '', whatsapp: '', car_model: '', car_color: '', car_year: '',
    national_id_last4: '', description: '', cities_covered: [], languages: [],
    price_routes: [{ route: '', price_egp: '', duration_min: '' }],
  });
  const queryClient = useQueryClient();
  const create = useMutation({
    mutationFn: (data) => base44.entities.VerifiedDriver.create({ ...data, status: 'pending', is_verified: false }),
    onSuccess: () => { setSubmitted(true); queryClient.invalidateQueries(['drivers']); },
  });

  const toggleCity = (c) => setForm(p => ({ ...p, cities_covered: p.cities_covered.includes(c) ? p.cities_covered.filter(x => x !== c) : [...p.cities_covered, c] }));
  const toggleLang = (l) => setForm(p => ({ ...p, languages: p.languages.includes(l) ? p.languages.filter(x => x !== l) : [...p.languages, l] }));
  const addRoute = () => setForm(p => ({ ...p, price_routes: [...p.price_routes, { route: '', price_egp: '', duration_min: '' }] }));
  const updateRoute = (i, k, v) => setForm(p => { const r = [...p.price_routes]; r[i] = { ...r[i], [k]: v }; return { ...p, price_routes: r }; });
  const removeRoute = (i) => setForm(p => ({ ...p, price_routes: p.price_routes.filter((_, idx) => idx !== i) }));

  const submit = (e) => {
    e.preventDefault();
    create.mutate({ ...form, car_year: +form.car_year, price_routes: form.price_routes.map(r => ({ ...r, price_egp: +r.price_egp, duration_min: +r.duration_min })) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-extrabold text-sm">Register as Locali Verified Driver</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        {submitted ? (
          <div className="p-6 text-center">
            <Check className="w-10 h-10 text-success mx-auto mb-3" />
            <h3 className="font-extrabold mb-1">Application Submitted!</h3>
            <p className="text-xs text-muted-foreground">Team reviews within 48h. Once approved, your prices are locked. You keep 90% of every ride.</p>
            <button onClick={onClose} className="mt-4 bg-accent text-accent-foreground px-5 py-2 rounded-xl font-bold text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">90/10 split:</strong> You keep 90% per ride. Locali Egypt takes 10%. Prices locked after approval. All rides tracked for safety.
            </div>
            {[
              { key: 'full_name', label: 'Full Name *', placeholder: 'Mohamed Ahmed' },
              { key: 'whatsapp', label: 'WhatsApp * (internal only — released to tourist after confirmation)', placeholder: '201012345678' },
              { key: 'car_model', label: 'Car Model & Make *', placeholder: 'Toyota Camry 2022' },
              { key: 'car_color', label: 'Car Color *', placeholder: 'White' },
              { key: 'car_year', label: 'Car Year *', placeholder: '2022', type: 'number' },
              { key: 'national_id_last4', label: 'National ID Last 4 Digits * (admin verification only)', placeholder: '1234' },
              { key: 'description', label: 'About You *', placeholder: 'Years of experience, specialities...', textarea: true },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[10px] font-bold mb-1 block">{f.label}</label>
                {f.textarea ? (
                  <textarea rows={2} required value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none resize-none" />
                ) : (
                  <input type={f.type || 'text'} required value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
                )}
              </div>
            ))}
            <div>
              <label className="text-[10px] font-bold mb-2 block">Cities Covered *</label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(CITY_LABELS).map(([v, l]) => (
                  <button type="button" key={v} onClick={() => toggleCity(v)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${form.cities_covered.includes(v) ? 'bg-accent text-accent-foreground border-accent' : 'border-border bg-secondary/50'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold mb-2 block">Languages Spoken *</label>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(LANG_FLAGS).map(l => (
                  <button type="button" key={l} onClick={() => toggleLang(l)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${form.languages.includes(l) ? 'bg-accent text-accent-foreground border-accent' : 'border-border bg-secondary/50'}`}>
                    {LANG_FLAGS[l]} {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold">Fixed Price Routes * (locked after approval)</label>
                <button type="button" onClick={addRoute} className="text-[10px] font-bold text-accent flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {form.price_routes.map((r, i) => (
                  <div key={i} className="bg-secondary/50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground">Route {i + 1}</span>
                      {form.price_routes.length > 1 && <button type="button" onClick={() => removeRoute(i)}><X className="w-3 h-3 text-muted-foreground" /></button>}
                    </div>
                    <input type="text" required value={r.route} placeholder="From → To"
                      onChange={e => updateRoute(i, 'route', e.target.value)}
                      className="w-full bg-card rounded-xl px-3 py-1.5 text-xs outline-none" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" required min={50} value={r.price_egp} placeholder="Price (EGP)"
                        onChange={e => updateRoute(i, 'price_egp', e.target.value)}
                        className="w-full bg-card rounded-xl px-3 py-1.5 text-xs outline-none" />
                      <input type="number" min={1} value={r.duration_min} placeholder="Duration (min)"
                        onChange={e => updateRoute(i, 'duration_min', e.target.value)}
                        className="w-full bg-card rounded-xl px-3 py-1.5 text-xs outline-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-[10px] text-amber-700">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              Drivers below 3.5 stars are automatically suspended. 3 complaints trigger immediate review.
            </div>
            <button type="submit"
              disabled={create.isPending || !form.full_name || !form.whatsapp || !form.car_model || !form.national_id_last4 || !form.cities_covered.length || !form.languages.length}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
              {create.isPending ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LocaliRide() {
  const { lang } = useOutletContext();
  const [cityFilter, setCityFilter] = useState('');
  const [bookingState, setBookingState] = useState(null); // { driver, route }
  const [activeRide, setActiveRide] = useState(null);
  const [completedRide, setCompletedRide] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useSEO({
    title: 'Safe Private Drivers for Tourists in Egypt — Fixed Prices, Verified Drivers, No Scam — Locali Ride',
    description: 'Book verified private drivers in Egypt. Fixed prices, no negotiation, no scams. Hurghada, Sharm El Sheikh, Luxor, Aswan. Airport transfers, day trips. Live tracking + in-app chat. Locali Ride.',
  });

  const { data: dbDrivers = [] } = useQuery({
    queryKey: ['drivers', cityFilter],
    queryFn: () => base44.entities.VerifiedDriver.filter({ status: 'approved' }),
  });

  const allDrivers = [...SAMPLE_DRIVERS, ...dbDrivers];
  const filtered = cityFilter ? allDrivers.filter(d => d.cities_covered?.includes(cityFilter)) : allDrivers;

  if (activeRide) return (
    <LiveTrackingScreen
      booking={activeRide}
      onComplete={() => { setCompletedRide(activeRide); setActiveRide(null); }}
    />
  );

  if (completedRide) return (
    <RatingScreen booking={completedRide} onDone={() => setCompletedRide(null)} />
  );

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5 bg-accent/10 px-2 py-1 rounded-xl">
              <Car className="w-5 h-5 text-accent" />
              <span className="font-black text-accent text-lg tracking-tight">Locali Ride</span>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">Safe Private Drivers — Fixed Prices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Verified drivers · No negotiation · No scams · Live tracking · In-app chat · 10% platform fee</p>
        </div>
        <button onClick={() => setShowRegister(true)}
          className="shrink-0 flex items-center gap-1.5 bg-card border border-border px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
          <Plus className="w-3.5 h-3.5" /> Become a Driver
        </button>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { icon: Lock, label: 'Prices Locked', desc: 'Set once, never changed', color: 'text-success' },
          { icon: ShieldCheck, label: 'ID Verified', desc: 'National ID checked by admin', color: 'text-blue-500' },
          { icon: Navigation, label: 'Live Tracking', desc: 'Real-time ride visibility', color: 'text-accent' },
        ].map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-3 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${b.color}`} />
              <p className="text-[10px] font-extrabold">{b.label}</p>
              <p className="text-[9px] text-muted-foreground">{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Features highlight */}
      <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 mb-6">
        <p className="text-xs font-extrabold mb-2 text-accent uppercase tracking-wider">What makes Locali Ride different</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            '🔒 Fixed prices — driver cannot charge more',
            '🚗 See driver photo, car color, plate on confirmation',
            '📍 Live map tracking during your ride',
            '💬 In-app chat with auto-translation',
            '🆘 SOS emergency button always visible',
            '⭐ Rating system — bad drivers suspended',
            '🌐 Drivers speak your language',
            '📱 No phone numbers exchanged until confirmed',
          ].map((f, i) => (
            <p key={i} className="text-[10px] text-muted-foreground">{f}</p>
          ))}
        </div>
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        <button onClick={() => setCityFilter('')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!cityFilter ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
          🌍 All Cities
        </button>
        {Object.entries(CITY_LABELS).map(([id, label]) => (
          <button key={id} onClick={() => setCityFilter(id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cityFilter === id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        {filtered.length} verified driver{filtered.length !== 1 ? 's' : ''} {cityFilter ? `covering ${CITY_LABELS[cityFilter]}` : 'across Egypt'}
      </p>

      <div className="space-y-4 mb-8">
        {filtered.map((d, i) => (
          <DriverCard key={d.id || i} driver={d} onBook={(driver, route) => setBookingState({ driver, route })} />
        ))}
      </div>

      {/* Driver CTA */}
      <div className="bg-secondary/50 rounded-2xl p-5 text-center">
        <Car className="w-8 h-8 text-accent mx-auto mb-2" />
        <p className="font-bold text-sm mb-1">Are you a driver in Egypt?</p>
        <p className="text-xs text-muted-foreground mb-3">Join Locali Ride. Set your fixed prices. Reach thousands of international tourists. Keep <strong>90%</strong> of every ride.</p>
        <button onClick={() => setShowRegister(true)}
          className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-bold text-sm">
          Register as a Driver →
        </button>
      </div>

      {/* Booking modal */}
      {bookingState && (
        <BookingModal
          driver={bookingState.driver}
          route={bookingState.route}
          onClose={() => setBookingState(null)}
          onConfirmed={(rideData) => { setBookingState(null); setActiveRide(rideData); }}
        />
      )}

      {showRegister && <DriverRegisterForm onClose={() => setShowRegister(false)} />}
    </div>
  );
}