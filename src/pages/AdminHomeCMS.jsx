import { useState, useEffect, useCallback, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff,
  GripVertical, CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
  LayoutDashboard, RefreshCw, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTION_TYPES = [
  { value: 'hero', label: '🦸 Hero Banner', desc: 'Main hero section with big title and CTA' },
  { value: 'banner', label: '📢 Banner / Alert', desc: 'Highlighted info strip' },
  { value: 'feature_card', label: '✨ Feature Card', desc: 'Card in the main feature grid' },
  { value: 'city_pill', label: '🏙️ City Pill', desc: 'Quick-access city navigation pill' },
  { value: 'tip_card', label: '💡 Tip Card', desc: 'Travel tip or advice card' },
  { value: 'category_card', label: '🗂️ Category Card', desc: 'Service category navigation card' },
  { value: 'cta_button', label: '🔘 CTA Button', desc: 'Call-to-action button row' },
  { value: 'image_block', label: '🖼️ Image Block', desc: 'Full-width image or media' },
  { value: 'text_block', label: '📝 Text Block', desc: 'Rich text paragraph or heading' },
  { value: 'custom_html', label: '🛠️ Custom Block', desc: 'Custom content block' },
];

const COLOR_SCHEMES = ['default', 'accent', 'warning', 'success', 'danger', 'gold', 'dark'];

const DEFAULT_SECTIONS = [
  { section_key: 'hero_title', section_type: 'hero', title: 'Navigate Egypt.', subtitle: 'Like a Local.', description: "Real prices. Scam alerts. Verified services. Your survival guide for Egypt.", image_url: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80', sort_order: 0, is_active: true, color_scheme: 'dark' },
  { section_key: 'hero_cta', section_type: 'cta_button', title: 'Ask your smart Egypt guide 🇪🇬', description: 'Restaurants, rides, prices, safety…', button_text: 'Ask AI Guide', button_link: '#ai', sort_order: 1, is_active: true, color_scheme: 'accent' },
  { section_key: 'city_hurghada', section_type: 'city_pill', title: 'Hurghada', icon: '🌊', button_link: '/city-guide/hurghada', sort_order: 2, is_active: true, color_scheme: 'default' },
  { section_key: 'city_sharm', section_type: 'city_pill', title: 'Sharm El Sheikh', icon: '⛰️', button_link: '/city-guide/sharm', sort_order: 3, is_active: true, color_scheme: 'default' },
  { section_key: 'city_luxor', section_type: 'city_pill', title: 'Luxor', icon: '👑', button_link: '/city-guide/luxor', sort_order: 4, is_active: true, color_scheme: 'default' },
  { section_key: 'city_aswan', section_type: 'city_pill', title: 'Aswan', icon: '🏛️', button_link: '/city-guide/aswan', sort_order: 5, is_active: true, color_scheme: 'default' },
  { section_key: 'city_elgouna', section_type: 'city_pill', title: 'El Gouna', icon: '🏝️', button_link: '/city-guide/el-gouna', sort_order: 6, is_active: true, color_scheme: 'default' },
  { section_key: 'feat_safety', section_type: 'feature_card', title: 'Safety Guide', description: 'Stay safe with real-time scam alerts and emergency contacts.', icon: '🛡️', button_link: '/safety-guide', color_scheme: 'danger', sort_order: 10, is_active: true },
  { section_key: 'feat_prices', section_type: 'feature_card', title: 'Price Checker', description: 'Know the real local price before you pay.', icon: '💰', button_link: '/price-checker', color_scheme: 'success', sort_order: 11, is_active: true },
  { section_key: 'feat_drivers', section_type: 'feature_card', title: 'Verified Drivers', description: 'ID-verified, rated local drivers you can trust.', icon: '🚗', button_link: '/drivers', color_scheme: 'accent', sort_order: 12, is_active: true },
  { section_key: 'feat_deals', section_type: 'feature_card', title: 'Deals & Offers', description: 'Exclusive tourist discounts and LOCALI codes.', icon: '🎯', button_link: '/deals', color_scheme: 'gold', sort_order: 13, is_active: true },
  { section_key: 'tip_taxi', section_type: 'tip_card', title: 'Taxi tip', description: 'Always agree on the price before getting in. Fair rate: 50-80 EGP for short rides.', icon: '🚕', sort_order: 20, is_active: true, color_scheme: 'warning' },
  { section_key: 'tip_sim', section_type: 'tip_card', title: 'SIM Card tip', description: 'Buy SIM at the airport Vodafone store. Tourist package 200 EGP = 30GB data.', icon: '📱', sort_order: 21, is_active: true, color_scheme: 'default' },
];

function ToggleSwitch({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-accent' : 'bg-muted'}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
    </button>
  );
}

function SectionTypeIcon({ type }) {
  return <span className="text-base">{SECTION_TYPES.find(t => t.value === type)?.label?.split(' ')[0] || '📄'}</span>;
}

function EditModal({ record, onSave, onClose }) {
  const [form, setForm] = useState({ ...record });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    if (record.id) {
      await base44.entities.HomeContent.update(record.id, form);
    } else {
      await base44.entities.HomeContent.create(form);
    }
    onSave();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-xl max-h-[90vh] rounded-2xl border border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <SectionTypeIcon type={form.section_type} />
            {record.id ? 'Edit' : 'New'} Section
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          {/* Section Type */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Section Type</label>
            <Select value={form.section_type || ''} onValueChange={v => set('section_type', v)}>
              <SelectTrigger className="text-sm h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SECTION_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {/* Section Key */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Section Key <span className="text-red-500">*</span></label>
            <Input value={form.section_key || ''} onChange={e => set('section_key', e.target.value)} placeholder="unique_key_no_spaces" className="h-9 text-sm" />
          </div>
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Title <span className="text-red-500">*</span></label>
            <Input value={form.title || ''} onChange={e => set('title', e.target.value)} placeholder="Main heading" className="h-9 text-sm" />
          </div>
          {/* Subtitle */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Subtitle</label>
            <Input value={form.subtitle || ''} onChange={e => set('subtitle', e.target.value)} placeholder="Sub-heading text" className="h-9 text-sm" />
          </div>
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Description / Body</label>
            <Textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3} className="text-sm" placeholder="Body copy or description" />
          </div>
          {/* Icon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Icon (emoji)</label>
              <Input value={form.icon || ''} onChange={e => set('icon', e.target.value)} placeholder="🏠" className="h-9 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Badge Text</label>
              <Input value={form.badge_text || ''} onChange={e => set('badge_text', e.target.value)} placeholder="NEW" className="h-9 text-sm" />
            </div>
          </div>
          {/* Button */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Button Label</label>
              <Input value={form.button_text || ''} onChange={e => set('button_text', e.target.value)} placeholder="Learn More" className="h-9 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Button Link</label>
              <Input value={form.button_link || ''} onChange={e => set('button_link', e.target.value)} placeholder="/page-path" className="h-9 text-sm" />
            </div>
          </div>
          {/* Image */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Image URL</label>
            <Input value={form.image_url || ''} onChange={e => set('image_url', e.target.value)} placeholder="https://..." className="h-9 text-sm" />
            {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-20 w-full object-cover rounded-lg border border-border" onError={e => e.target.style.display='none'} />}
          </div>
          {/* Color + Order + Active */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Color Scheme</label>
              <Select value={form.color_scheme || 'default'} onValueChange={v => set('color_scheme', v)}>
                <SelectTrigger className="text-sm h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COLOR_SCHEMES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Sort Order</label>
              <Input type="number" value={form.sort_order ?? 0} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} className="h-9 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <ToggleSwitch value={form.is_active !== false} onChange={v => set('is_active', v)} />
            <span className="text-sm font-medium">Visible on Homepage</span>
          </div>
          {/* Extra JSON */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Extra Data (JSON, optional)</label>
            <Textarea value={form.extra_json || ''} onChange={e => set('extra_json', e.target.value)} rows={2} className="text-sm font-mono" placeholder='{"key": "value"}' />
          </div>
        </div>
        <div className="px-5 py-4 border-t border-border flex justify-end gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
            Save Section
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionRow({ item, onEdit, onDelete, onToggle, onMove, isFirst, isLast }) {
  const typeMeta = SECTION_TYPES.find(t => t.value === item.section_type);
  const colorMap = {
    accent: 'bg-cyan-50 border-cyan-200', warning: 'bg-amber-50 border-amber-200',
    success: 'bg-emerald-50 border-emerald-200', danger: 'bg-red-50 border-red-200',
    gold: 'bg-yellow-50 border-yellow-200', dark: 'bg-slate-50 border-slate-200',
    default: 'bg-white border-border',
  };
  const scheme = item.color_scheme || 'default';

  return (
    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-all ${item.is_active ? colorMap[scheme] : 'bg-muted/30 border-border opacity-60'}`}>
      {/* Drag handle / order controls */}
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <button onClick={() => onMove(item.id, 'up')} disabled={isFirst} className="p-0.5 rounded hover:bg-black/10 disabled:opacity-20">
          <ChevronUp className="w-3 h-3" />
        </button>
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50" />
        <button onClick={() => onMove(item.id, 'down')} disabled={isLast} className="p-0.5 rounded hover:bg-black/10 disabled:opacity-20">
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
      {/* Icon */}
      <span className="text-xl shrink-0">{item.icon || typeMeta?.label?.split(' ')[0] || '📄'}</span>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold">{item.title}</span>
          {item.badge_text && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">{item.badge_text}</span>}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{typeMeta?.label || item.section_type}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{item.section_key}</span>
          {item.button_link && (
            <span className="text-[10px] text-accent flex items-center gap-0.5">
              <ExternalLink className="w-2.5 h-2.5" />{item.button_link}
            </span>
          )}
        </div>
        {item.description && <p className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-sm">{item.description}</p>}
      </div>
      {/* Image preview */}
      {item.image_url && (
        <img src={item.image_url} alt="" className="w-14 h-10 object-cover rounded-lg border border-border shrink-0" onError={e => e.target.style.display='none'} />
      )}
      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onToggle(item)} className={`p-1.5 rounded-lg transition-colors ${item.is_active ? 'hover:bg-black/10 text-emerald-600' : 'hover:bg-black/10 text-muted-foreground'}`} title={item.is_active ? 'Visible' : 'Hidden'}>
          {item.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
        <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function AdminHomeCMS() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('all');
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await base44.entities.HomeContent.list('sort_order', 500);
    setSections(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleToggle = async (item) => {
    await base44.entities.HomeContent.update(item.id, { is_active: !item.is_active });
    setSections(prev => prev.map(s => s.id === item.id ? { ...s, is_active: !s.is_active } : s));
    showToast(`Section ${!item.is_active ? 'shown' : 'hidden'}`);
  };

  const handleDelete = async (id) => {
    await base44.entities.HomeContent.delete(id);
    setDeleting(null);
    setSections(prev => prev.filter(s => s.id !== id));
    showToast('Section deleted');
  };

  const handleMove = async (id, direction) => {
    const sorted = [...sections].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const idx = sorted.findIndex(s => s.id === id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sorted.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const a = sorted[idx], b = sorted[swapIdx];
    const aOrder = a.sort_order || 0, bOrder = b.sort_order || 0;
    await Promise.all([
      base44.entities.HomeContent.update(a.id, { sort_order: bOrder }),
      base44.entities.HomeContent.update(b.id, { sort_order: aOrder }),
    ]);
    setSections(prev => prev.map(s => {
      if (s.id === a.id) return { ...s, sort_order: bOrder };
      if (s.id === b.id) return { ...s, sort_order: aOrder };
      return s;
    }));
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    await Promise.all(DEFAULT_SECTIONS.map(s => base44.entities.HomeContent.create(s)));
    showToast('Default sections loaded!');
    load();
    setSeeding(false);
  };

  if (!user || user.role !== 'admin') {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Admin access required.</p></div>;
  }

  const sorted = [...sections].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const filtered = filter === 'all' ? sorted : sorted.filter(s => s.section_type === filter);
  const activeCount = sections.filter(s => s.is_active).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="font-black text-base">Home Page CMS</h1>
          <p className="text-[10px] text-muted-foreground">Manual control — all changes reflect instantly on the live site</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700">{activeCount} Active Sections</span>
          </div>
          <Button size="sm" variant="outline" onClick={load}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.open('/', '_blank')}>
            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Preview
          </Button>
          <Button size="sm" onClick={() => setEditing({ section_key: '', section_type: 'feature_card', title: '', sort_order: sections.length * 10, is_active: true })}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Section
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Seed banner */}
        {sections.length === 0 && !loading && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-amber-800">No Home Page sections yet</h3>
              <p className="text-xs text-amber-700 mt-1">Load the default sections to get started, or add new ones manually.</p>
            </div>
            <Button size="sm" onClick={handleSeedDefaults} disabled={seeding} className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
              {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : '✨ '}
              Load Defaults
            </Button>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
          {[{ value: 'all', label: 'All' }, ...SECTION_TYPES].map(t => (
            <button key={t.value} onClick={() => setFilter(t.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filter === t.value ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-emerald-500" /> Visible</span>
          <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Hidden</span>
          <span className="flex items-center gap-1"><ChevronUp className="w-3 h-3" /><ChevronDown className="w-3 h-3" /> Reorder</span>
          <span className="ml-auto font-semibold text-amber-600">⚡ Manual Override — No AI Credits</span>
        </div>

        {/* Sections list */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading sections…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No sections found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item, idx) => (
              <SectionRow
                key={item.id}
                item={item}
                isFirst={idx === 0}
                isLast={idx === filtered.length - 1}
                onEdit={setEditing}
                onDelete={id => setDeleting(id)}
                onToggle={handleToggle}
                onMove={handleMove}
              />
            ))}
          </div>
        )}

        {/* Add button at bottom */}
        {sections.length > 0 && (
          <button
            onClick={() => setEditing({ section_key: '', section_type: 'feature_card', title: '', sort_order: (sections.length + 1) * 10, is_active: true })}
            className="mt-4 w-full border-2 border-dashed border-border rounded-xl py-4 text-sm text-muted-foreground hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Section
          </button>
        )}
      </div>

      {/* Edit Modal */}
      {editing !== null && (
        <EditModal record={editing} onSave={() => { setEditing(null); showToast('Saved!'); load(); }} onClose={() => setEditing(null)} />
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Delete this section?</h3>
                <p className="text-xs text-muted-foreground">This will hide it from the homepage immediately.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(deleting)}>
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}
    </div>
  );
}