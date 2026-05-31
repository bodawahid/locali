import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp, MapPin, Star, DollarSign, Eye, Bell,
  ShieldCheck, Tag, Users, Building2, BadgeCheck,
  BarChart2, Zap, Car, Hotel, Percent
} from 'lucide-react';

// ─── Simulated subscription counts ───────────────────────────────────────────
const SUBS = {
  guides: 20,          // $8/mo
  operators: 10,       // $25/mo
  featured: 10,        // $15/mo
  activity_comm: 200,  // $USD from 7% activity commissions
  transfer_comm: 80,   // $USD from 10% transfer commissions
  booking_aff: 100,    // $USD from Booking.com 4-6% affiliate
  usd_to_egp: 54.5,
};

const mrr_phase1 = SUBS.guides * 8 + SUBS.operators * 25 + SUBS.featured * 15 + SUBS.activity_comm + SUBS.transfer_comm + SUBS.booking_aff;

const PROJECTIONS = [
  {
    phase: 'Month 1–3', subtitle: 'Building phase',
    guides: 20, operators: 10, featured: 10,
    activities: 200, transfers: 0, booking: 100,
    get total() { return this.guides * 8 + this.operators * 25 + this.featured * 15 + this.activities + this.transfers + this.booking; },
  },
  {
    phase: 'Month 6–12', subtitle: 'Growth phase',
    guides: 50, operators: 25, featured: 20,
    activities: 500, transfers: 200, booking: 300,
    get total() { return this.guides * 8 + this.operators * 25 + this.featured * 15 + this.activities + this.transfers + this.booking; },
  },
];

const MONTHLY_GROWTH = [
  { month: 'Nov', usd: 180 }, { month: 'Dec', usd: 340 }, { month: 'Jan', usd: 520 },
  { month: 'Feb', usd: 710 }, { month: 'Mar', usd: 940 }, { month: 'Apr', usd: mrr_phase1 },
];
const maxUsd = Math.max(...MONTHLY_GROWTH.map(m => m.usd));

const REVENUE_STREAMS = [
  { label: 'Guide Subscriptions', sublabel: `${SUBS.guides} active × $8/mo`, icon: Users, usd: SUBS.guides * 8, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Operator Subscriptions', sublabel: `${SUBS.operators} active × $25/mo`, icon: Building2, usd: SUBS.operators * 25, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { label: 'Featured Listings', sublabel: `${SUBS.featured} active × $15/mo`, icon: Star, usd: SUBS.featured * 15, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Activity Commissions (7%)', sublabel: 'Snorkeling, diving, tours, safaris', icon: Percent, usd: SUBS.activity_comm, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { label: 'Transfer Commissions (10%)', sublabel: 'Airport transfers, city-to-city', icon: Car, usd: SUBS.transfer_comm, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Booking.com Affiliate (4–6%)', sublabel: 'Hotel clicks → Booking.com', icon: Hotel, usd: SUBS.booking_aff, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

const CITY_REVENUE = [
  { city: 'Hurghada', usd: 480, pct: 90, color: 'bg-blue-500' },
  { city: 'Sharm El Sheikh', usd: 340, pct: 64, color: 'bg-teal-500' },
  { city: 'El Gouna', usd: 210, pct: 40, color: 'bg-violet-500' },
  { city: 'Luxor', usd: 180, pct: 34, color: 'bg-amber-500' },
  { city: 'Aswan', usd: 120, pct: 23, color: 'bg-orange-500' },
];

const TOP_ACTIVITIES = [
  { name: 'Red Sea Snorkeling', city: 'Hurghada', bookings: 89, commission_egp: 6503 },
  { name: 'Ras Mohammed Diving', city: 'Sharm', bookings: 74, commission_egp: 9744 },
  { name: 'Valley of the Kings Tour', city: 'Luxor', bookings: 61, commission_egp: 7381 },
  { name: 'Abu Simbel Day Trip', city: 'Aswan', bookings: 48, commission_egp: 9504 },
  { name: 'El Gouna Kite Course', city: 'El Gouna', bookings: 31, commission_egp: 3584 },
];

const DISCOUNT_STATS = [
  { listing: 'Red Sea Snorkeling', city: 'Hurghada', views: 1240, claims: 312 },
  { listing: 'Valley of the Kings Tour', city: 'Luxor', views: 980, claims: 241 },
  { listing: 'Ras Mohammed Diving', city: 'Sharm', views: 876, claims: 198 },
  { listing: 'Abu Simbel Day Trip', city: 'Aswan', views: 731, claims: 175 },
  { listing: 'El Gouna Kite Course', city: 'El Gouna', views: 412, claims: 88 },
];

const NOTIFICATIONS = [
  { msg: '💳 New guide subscription: Ahmed Hassan — Luxor Egyptologist', time: '15 min ago' },
  { msg: '✅ Activity booking confirmed: Ras Mohammed diving — LOC-SHA-DIV-C3Z1P (7% = 84 EGP)', time: '1 hour ago' },
  { msg: '🏨 Hotel affiliate click: Steigenberger Hurghada → Booking.com', time: '2 hours ago' },
  { msg: '💳 New operator subscription: Nile Discovery Luxor', time: '3 hours ago' },
  { msg: '🚗 Transfer booked: Hurghada airport → Sahl Hasheesh (10% = 15 EGP)', time: '4 hours ago' },
  { msg: '⭐ New featured listing: Sinai Stars Travel (Sharm)', time: '5 hours ago' },
];

const TABS = ['Overview', 'Projections', 'Discounts', 'Activity'];

export default function AnalyticsDashboard() {
  const { lang } = useOutletContext();
  const [tab, setTab] = useState('Overview');

  const totalUsd = mrr_phase1;
  const totalEgp = totalUsd * SUBS.usd_to_egp;

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
          <BarChart2 className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Revenue Dashboard</h1>
          <p className="text-sm text-muted-foreground">Locali Egypt — Admin Only · Subscriptions · Commissions · Affiliates</p>
        </div>
      </div>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2 mb-6 text-xs text-muted-foreground">
        📊 Simulation mode — representative data. Connect backend for live figures.
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
      {tab === 'Overview' && (
        <>
          {/* MRR hero */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Monthly Revenue (Current)</p>
              <p className="text-3xl font-black text-accent">${totalUsd.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">≈ {totalEgp.toLocaleString()} EGP/mo</p>
              <span className="text-[10px] font-bold text-success">+18% vs last month</span>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Annual Run Rate</p>
              <p className="text-3xl font-black text-foreground">${(totalUsd * 12).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">≈ {(totalEgp * 12).toLocaleString()} EGP/yr</p>
              <span className="text-[10px] font-bold text-success">All revenue streams</span>
            </div>
          </div>

          {/* Revenue streams breakdown */}
          <h2 className="text-base font-extrabold mb-3">Revenue Streams This Month</h2>
          <div className="space-y-2 mb-6">
            {REVENUE_STREAMS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border border-border/40 ${s.bg}`}>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${s.color} shrink-0`} />
                    <div>
                      <p className="text-xs font-bold">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground">{s.sublabel}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-extrabold ${s.color}`}>${s.usd}</p>
                    <p className="text-[10px] text-muted-foreground">{(s.usd * SUBS.usd_to_egp).toLocaleString()} EGP</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Growth chart */}
          <h2 className="text-base font-extrabold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" /> Monthly Revenue Growth
          </h2>
          <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
            <div className="flex items-end gap-2 h-32">
              {MONTHLY_GROWTH.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-accent">${m.usd}</span>
                  <div className="w-full rounded-t-lg bg-accent/80"
                    style={{ height: `${Math.round((m.usd / maxUsd) * 100)}%`, minHeight: 4 }} />
                  <span className="text-[9px] text-muted-foreground">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by city */}
          <h2 className="text-base font-extrabold mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" /> Revenue by City
          </h2>
          <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
            <div className="space-y-3">
              {CITY_REVENUE.map((c, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold">{c.city}</span>
                    <span className="font-extrabold text-accent">${c.usd}/mo</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Free traffic services note */}
          <div className="bg-secondary/50 border border-border/50 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <Eye className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold mb-0.5">Free Traffic Listings (No Revenue — Build Trust)</p>
              <p className="text-[11px] text-muted-foreground">Hotels (Booking.com affiliate), pharmacies, medical centers, nightlife, supermarkets, SIM cards, ride-sharing — all listed free to bring tourists to the platform. Revenue comes from activity bookings and upgrades.</p>
            </div>
          </div>

          {/* 7% commission prep */}
          <div className="bg-secondary/50 border border-border/50 rounded-2xl p-4 flex items-start gap-3">
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold mb-0.5">Commission Fields — Live on All Listings (Admin Only)</p>
              <p className="text-[11px] text-muted-foreground">Every listing has a commission_rate field (default 0% = inactive). Activate per-listing individually when ready. All bookings carry tracking codes. Future Stripe/PayPal integration prepared.</p>
            </div>
          </div>
        </>
      )}

      {/* ── PROJECTIONS ───────────────────────────────────────────────── */}
      {tab === 'Projections' && (
        <>
          <div className="bg-secondary/50 rounded-2xl border border-border/50 p-3 mb-5 text-[11px] text-muted-foreground">
            🔒 Admin reference only — not shown publicly.
          </div>
          {PROJECTIONS.map((p, pi) => (
            <div key={pi} className={`rounded-2xl border p-5 mb-4 ${pi === 0 ? 'border-accent/30 bg-accent/5' : 'border-success/30 bg-success/5'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-base">{p.phase}</h3>
                  <p className="text-xs text-muted-foreground">{p.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${pi === 0 ? 'text-accent' : 'text-success'}`}>${p.total.toLocaleString()}/mo</p>
                  <p className="text-xs text-muted-foreground">≈ {(p.total * 50).toLocaleString()} EGP</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: `Guide subscriptions (${p.guides} × $8)`, usd: p.guides * 8, icon: Users },
                  { label: `Operator subscriptions (${p.operators} × $25)`, usd: p.operators * 25, icon: Building2 },
                  { label: `Featured listings (${p.featured} × $15)`, usd: p.featured * 15, icon: Star },
                  { label: 'Activity commissions (7%)', usd: p.activities, icon: Percent },
                  { label: 'Transfer commissions (10%)', usd: p.transfers, icon: Car },
                  { label: 'Booking.com affiliate (4–6%)', usd: p.booking, icon: Hotel },
                ].map((line, i) => {
                  const Icon = line.icon;
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Icon className="w-3 h-3" />{line.label}
                      </span>
                      <span className="font-bold">${line.usd}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Future streams */}
          <div className="bg-secondary/50 border border-border/50 rounded-2xl p-4">
            <p className="text-xs font-bold mb-2 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Future Streams — Prepared, Not Active</p>
            <div className="space-y-1.5">
              {[
                { label: 'Verified Badge ($6/mo)', desc: 'Business profile upgrade — ready to launch' },
                { label: 'Sponsored Content', desc: 'Tourism brand partnerships — coming soon' },
                { label: 'Tourist Premium ($5/mo)', desc: 'Extra discounts, AI itinerary, priority matching' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className="text-amber-500 mt-0.5">○</span>
                  <div>
                    <strong className="text-foreground">{f.label}</strong>
                    <span className="text-muted-foreground ml-1">— {f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── DISCOUNTS ─────────────────────────────────────────────────── */}
      {tab === 'Discounts' && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Code Views', value: '4,239', icon: Eye, color: 'text-blue-500' },
              { label: 'Claims', value: '1,014', icon: Tag, color: 'text-amber-500' },
              { label: 'Claim Rate', value: '23.9%', icon: TrendingUp, color: 'text-success' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4 text-xs text-muted-foreground">
            <strong className="text-foreground">Code LOCALI</strong> — 10% discount on activities, tours, bazaars & first tour operator booking. Hotels/pharmacies/medical centers excluded (free traffic listings).
          </div>
          <h2 className="text-base font-extrabold mb-3">Top Listings by Claims</h2>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="grid grid-cols-4 px-4 py-2 bg-secondary/50 text-[10px] font-bold text-muted-foreground uppercase">
              <span className="col-span-2">Listing</span>
              <span className="text-center">Views</span>
              <span className="text-right">Claims</span>
            </div>
            {DISCOUNT_STATS.map((d, i) => (
              <div key={i} className="grid grid-cols-4 px-4 py-3 border-t border-border/20 items-center">
                <div className="col-span-2">
                  <p className="font-semibold text-xs">{d.listing}</p>
                  <p className="text-[10px] text-muted-foreground">{d.city}</p>
                </div>
                <p className="text-xs text-center text-muted-foreground">{d.views.toLocaleString()}</p>
                <p className="text-xs text-right font-extrabold text-accent">{d.claims}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── ACTIVITY ──────────────────────────────────────────────────── */}
      {tab === 'Activity' && (
        <>
          <h2 className="text-base font-extrabold mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Most Booked Activities (7% Commission)
          </h2>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-6">
            <div className="grid grid-cols-4 px-4 py-2 bg-secondary/50 text-[10px] font-bold text-muted-foreground uppercase">
              <span className="col-span-2">Activity</span>
              <span className="text-center">Bookings</span>
              <span className="text-right">Commission</span>
            </div>
            {TOP_ACTIVITIES.map((a, i) => (
              <div key={i} className="grid grid-cols-4 px-4 py-3 border-t border-border/20 items-center">
                <div className="col-span-2">
                  <p className="font-semibold text-xs">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground">{a.city}</p>
                </div>
                <p className="text-xs text-center font-bold">{a.bookings}</p>
                <p className="text-xs text-right font-extrabold text-accent">{a.commission_egp.toLocaleString()} EGP</p>
              </div>
            ))}
          </div>

          <h2 className="text-base font-extrabold mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent" /> Recent Activity
          </h2>
          <div className="space-y-2">
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 px-4 py-3 flex items-start justify-between gap-3">
                <p className="text-xs">{n.msg}</p>
                <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}