import { useState } from 'react';
import { useSEO } from '../lib/seo';
import { ShieldCheck, CheckCircle2, Clock, Star, Phone, Globe, MapPin, AlertCircle } from 'lucide-react';

const REQUIREMENTS = [
  { label: 'Valid Egyptian trade license (سجل تجاري)', required: true },
  { label: 'Consistent positive reviews (min. 4.0 average)', required: true },
  { label: 'Verifiable physical address', required: true },
  { label: 'Active phone number (WhatsApp preferred)', required: true },
  { label: 'At least 3 months of business operation', required: true },
  { label: 'No unresolved scam reports in our system', required: true },
  { label: 'Tourist-facing pricing transparency', required: false },
  { label: 'English or multilingual staff (bonus)', required: false },
];

const BENEFITS = [
  { icon: ShieldCheck, text: 'Verified badge visible on all listings' },
  { icon: Star, text: 'Featured placement in search results' },
  { icon: CheckCircle2, text: 'Trust signal for international tourists' },
  { icon: Globe, text: 'Listed in our verified-only filter' },
];

const CATEGORIES = [
  'Restaurant / Café',
  'Dive Center',
  'Tour Operator',
  'Hotel / Accommodation',
  'Transport / Taxi',
  'Medical Clinic',
  'Money Exchange',
  'Shopping / Retail',
  'Other',
];

const EMPTY = { business_name: '', category: '', city: '', phone: '', email: '', website: '', address: '', license_number: '', notes: '' };

export default function VerifyApply() {
  useSEO({
    title: 'Apply for Verified Badge — Egypt Tourist Guide',
    description: 'Service providers in Egypt can apply for a verified badge. Requirements, process, and application form. Build trust with international tourists.',
  });

  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would save to a VerificationApplication entity
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="px-4 py-16 max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-black mb-2">Application Submitted</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We'll review your application within 5–7 business days. We may contact you via WhatsApp for document verification.
        </p>
        <div className="bg-card border border-border/50 rounded-2xl p-5 text-left space-y-2">
          <p className="text-xs font-bold text-muted-foreground">What happens next:</p>
          {[
            'Our team reviews your trade license and reviews',
            'We may visit or call to verify your address',
            'If approved, badge appears on your listing within 48h',
            'You receive WhatsApp confirmation when active',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-secondary font-bold text-[10px] flex items-center justify-center shrink-0">{i+1}</span>
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Apply for Verified Badge</h1>
          <p className="text-sm text-muted-foreground">For service providers serving tourists in Egypt</p>
        </div>
      </div>

      {/* What it means */}
      <div className="bg-success/10 border border-success/20 rounded-2xl p-5 mb-6">
        <h2 className="font-extrabold mb-3">What the Verified Badge Means</h2>
        <div className="grid grid-cols-2 gap-3">
          {BENEFITS.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-2">
              <Icon className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-card border border-border/50 rounded-2xl p-5 mb-6">
        <h2 className="font-extrabold mb-4">Requirements</h2>
        <div className="space-y-2">
          {REQUIREMENTS.map((req, i) => (
            <div key={i} className="flex items-start gap-3">
              {req.required
                ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                : <Star className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              }
              <div>
                <p className="text-sm">{req.label}</p>
                {!req.required && <p className="text-[10px] text-muted-foreground">Bonus — not mandatory</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 bg-secondary/60 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">Verification is free and permanent unless reviews drop below 3.5 or a scam report is verified against you.</p>
        </div>
      </div>

      {/* Process */}
      <div className="bg-card border border-border/50 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-accent" />
          <h2 className="font-extrabold">Process & Timeline</h2>
        </div>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Submit application', desc: 'Fill in the form below with your business details and license number.' },
            { step: '2', title: 'Review (5–7 days)', desc: 'Our team verifies your license, reviews, and may call to confirm address.' },
            { step: '3', title: 'Badge activated', desc: 'Verified badge appears on your listing. You receive WhatsApp confirmation.' },
          ].map(item => (
            <div key={item.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground font-black text-sm flex items-center justify-center shrink-0">{item.step}</div>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
        <h2 className="font-extrabold">Application Form</h2>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">Business Name *</label>
          <input value={form.business_name} onChange={e => update('business_name', e.target.value)} required placeholder="Official registered name" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1 block">Category *</label>
            <select value={form.category} onChange={e => update('category', e.target.value)} required className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="">Select...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1 block">City *</label>
            <select value={form.city} onChange={e => update('city', e.target.value)} required className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="">Select...</option>
              {['Sharm El Sheikh', 'Hurghada', 'Luxor', 'Aswan', 'Cairo'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">Trade License Number *</label>
          <input value={form.license_number} onChange={e => update('license_number', e.target.value)} required placeholder="Egyptian trade license / سجل تجاري" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">WhatsApp / Phone *</label>
          <input value={form.phone} onChange={e => update('phone', e.target.value)} required placeholder="+20 1XX XXX XXXX" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">Email *</label>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="your@email.com" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">Business Address *</label>
          <input value={form.address} onChange={e => update('address', e.target.value)} required placeholder="Street, area, city" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">Website / Social Media</label>
          <input value={form.website} onChange={e => update('website', e.target.value)} placeholder="https:// or Facebook page" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">Anything else to add?</label>
          <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="TripAdvisor links, certifications, specializations..." rows={3} className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
        </div>

        <button type="submit" className="w-full py-4 bg-accent text-accent-foreground rounded-xl font-bold flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Submit Verification Application
        </button>
      </form>
    </div>
  );
}