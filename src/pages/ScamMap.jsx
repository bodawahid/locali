import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CITIES, SCAM_CATEGORIES, t, getCityName } from '../lib/constants';
import { AlertTriangle, Plus, ChevronUp, ChevronDown, MapPin, List, Map } from 'lucide-react';
import ScamHeatMap from '../components/ScamHeatMap';
import LiveTrustBadge from '../components/LiveTrustBadge';
import ScamGauge from '../components/ScamGauge';
import SafeNextStep from '../components/SafeNextStep';

export default function ScamMap() {
  const { lang } = useOutletContext();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [viewMode, setViewMode] = useState('list');

  // 1. استدعاء الداتا الحية من الـ PHP API الجديد بتاعك
  const { data: rawData, isLoading, refetch } = useQuery({
    queryKey: ['scamReports', selectedCity, selectedCategory],
    queryFn: async () => {
      // بينادي على جدول scam_report ديناميكياً
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=scam_report`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  // 2. تأمين المصفوفة: لو الجدول فاضي أو الـ API رجع داتا غريبة بياخد مصفوفة فاضية فوراً
  let reports = Array.isArray(rawData) ? rawData : [];

  // 3. عمل الفلترة محلياً (Client-side) بناءً على أزرار الاختيار
  if (selectedCity) {
    reports = reports.filter(r => r.city === selectedCity);
  }
  if (selectedCategory) {
    reports = reports.filter(r => r.category === selectedCategory);
  }

  const highSeverity = reports.filter(r => r.severity === 'high').length;
  const overallRisk = reports.length > 0 ? Math.min(Math.round((highSeverity / reports.length) * 100) + 20, 100) : 0;

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{t('scam_map', lang)}</h1>
            <p className="text-sm text-muted-foreground">{reports.length} reports</p>
            <LiveTrustBadge records={reports} label="verified reports" className="mt-1" />
          </div>
        </div>
        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('report_scam', lang)}
        </button>
      </div>

      {/* Risk Gauge */}
      {reports.length > 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6 flex flex-col items-center">
          <ScamGauge score={overallRisk} size={160} />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Based on {reports.length} community reports
          </p>
        </div>
      )}

      {/* Report Form */}
      {showReportForm && (
        <ScamReportForm
          lang={lang}
          onSubmit={() => { setShowReportForm(false); refetch(); }}
          onCancel={() => setShowReportForm(false)}
        />
      )}

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setSelectedCity('')}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              !selectedCity ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
            }`}
          >
            {t('all_cities', lang)}
          </button>
          {CITIES.map(city => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCity === city.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
              }`}
            >
              {getCityName(city, lang)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              !selectedCategory ? 'bg-accent text-accent-foreground' : 'bg-card border border-border'
            }`}
          >
            All Types
          </button>
          {SCAM_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id ? 'bg-accent text-accent-foreground' : 'bg-card border border-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
          }`}
        >
          <List className="w-3.5 h-3.5" /> List View
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
          }`}
        >
          <Map className="w-3.5 h-3.5" /> Heat Map
        </button>
      </div>

      {/* Reports Render */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : viewMode === 'map' ? (
        <ScamHeatMap reports={reports} />
      ) : reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map(report => (
            <ScamReportCard key={report.id || report.id_index} report={report} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">No scam reports yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Be the first to report</p>
        </div>
      )}

      <div className="mt-8">
        <SafeNextStep
          title="Find Verified Services"
          description="Skip the risk — use trusted providers"
          to="/services"
        />
      </div>
    </div>
  );
}

function ScamReportCard({ report }) {
  const [expanded, setExpanded] = useState(false);
  const severityStyles = {
    high: 'bg-red-500/5 border-red-500/30',
    medium: 'bg-amber-500/5 border-amber-500/30',
    low: 'bg-card border-border/50',
  };

  return (
    <div className={`rounded-2xl border p-4 ${severityStyles[report.severity] || severityStyles.low}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase text-accent">{report.category?.replace('_', ' ')}</span>
            {report.severity === 'high' && (
              <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">HIGH RISK</span>
            )}
            {report.severity === 'medium' && (
              <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full">MODERATE</span>
            )}
          </div>
          <h3 className="font-bold text-sm">{report.title}</h3>
          {report.location_name && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{report.location_name}</span>
            </div>
          )}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="p-1">
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-sm text-muted-foreground">{report.description}</p>
          {report.amount_lost > 0 && (
            <p className="text-xs text-destructive font-bold mt-2">Amount lost: {report.amount_lost} EGP</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-muted-foreground capitalize">{report.city?.replace('-', ' ')}</span>
            <span className="text-[10px] text-muted-foreground">· {report.upvotes || 0} confirmations</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ScamReportForm({ lang, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: '', description: '', city: '', category: '', severity: 'medium', location_name: '', amount_lost: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.city || !form.category) return;
    setSubmitting(true);
    
    try {
      // تعديل إرسال البلاغات ليرمي مباشرة على الـ PHP API بتاعك
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=scam_report`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    } catch (err) {
      console.error("Error creating report:", err);
    }
    
    setSubmitting(false);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-5 mb-6 space-y-4">
      <h3 className="font-bold">{t('report_scam', lang)}</h3>
      <input
        type="text"
        placeholder="What happened? (short title)"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        required
      />
      <textarea
        placeholder="Describe the scam in detail..."
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
        className="w-full px-3 py-3 bg-background rounded-xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <select
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          required
        >
          <option value="">Select city</option>
          {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          required
        >
          <option value="">Scam type</option>
          {SCAM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <select
        value={form.severity}
        onChange={(e) => setForm({ ...form, severity: e.target.value })}
        className="w-full px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <option value="low">Low severity</option>
        <option value="medium">Medium severity</option>
        <option value="high">High severity</option>
      </select>
      <input
        type="text"
        placeholder="Location name (optional)"
        value={form.location_name}
        onChange={(e) => setForm({ ...form, location_name: e.target.value })}
        className="w-full px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-secondary rounded-xl text-sm font-bold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  );
}