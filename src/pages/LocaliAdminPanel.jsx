// @ts-nocheck
import { useState, useMemo, useRef, useEffect } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { localApi } from '@/api/localApi';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, XCircle, Trash2, Star, Loader2, 
  Shield, MapPin, LayoutDashboard, Settings, 
  PlusCircle, Database, Image, DollarSign, Users, LogOut, ShieldCheck, Home, FileText
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

// استدعاء كافة الكومبوننتس والأدوات بلا استثناء لتفتح في الجنب دايماً
import AdminCMS from './AdminCMS';
import AddService from './AddService';
import AdminPriceManager from './AdminPriceManager';
import AdminContentManager from './AdminContentManager';
import AdminPlaceImageUpdater from './AdminPlaceImageUpdater';
import AdminBulkPopulate from './AdminBulkPopulate';
import AdminVerification from './AdminVerification';
import AdminElGounaFix from './AdminElGounaFix';
import AdminLocalPersonas from './AdminLocalPersonas';
import AdminHomeCMS from './AdminHomeCMS';

const CATEGORY_ICONS = { hotel: '🏨', apartment: '🏠', experience: '🎯', service: '🛎️' };

export default function LocaliAdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // تتبع الموديول النشط حالياً في الجنب اليمين
  const [activeMenu, setActiveMenu] = useState('dashboard'); 
  const [tab, setTab] = useState('pending');
  const [acting, setActing] = useState(null);
  const loadMoreRef = useRef(null);

  // جلب البيانات الأساسية للوحة القيادة
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['admin-places-infinite'],
    queryFn: ({ pageParam = 1 }) => localApi.entities.Place.list('-created_date', 24, pageParam),
    getNextPageParam: (lastPage, allPages) => (
      Array.isArray(lastPage) && lastPage.length === 24 ? allPages.length + 1 : undefined
    ),
    enabled: user?.role === 'admin',
    staleTime: 30000,
  });
  const places = useMemo(() => data?.pages?.flat() ?? [], [data]);

  useEffect(() => {
    if (activeMenu !== 'dashboard') return;
    const node = loadMoreRef.current;
    if (!node || !hasNextPage || isFetchingNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { rootMargin: '0px 0px 280px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [activeMenu, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-gray-200/60 shadow-sm max-w-sm w-full">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-black text-gray-900 mb-1">Admin Access Required</h2>
          <p className="text-xs text-gray-500">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  const tabs = {
    pending: places.filter(p => p.status === 'pending'),
    approved: places.filter(p => p.status === 'approved'),
    rejected: places.filter(p => p.status === 'rejected'),
  };

  const updateStatus = async (id, status) => {
    setActing(id);
    await localApi.entities.Place.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ['admin-places-infinite'] });
    setActing(null);
  };

  const toggleFeatured = async (place) => {
    setActing(place.id);
    await localApi.entities.Place.update(place.id, { is_featured: !place.is_featured });
    queryClient.invalidateQueries({ queryKey: ['admin-places-infinite'] });
    setActing(null);
  };

  const deletePlace = async (id) => {
    if (!confirm('Delete this listing permanently?')) return;
    setActing(id);
    await localApi.entities.Place.delete(id);
    queryClient.invalidateQueries({ queryKey: ['admin-places-infinite'] });
    setActing(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/localiadmin/login');
  };

  const currentPlaces = tabs[tab] || [];
  const stats = {
    total: places.length,
    pending: tabs.pending.length,
    approved: tabs.approved.length,
    featured: places.filter(p => p.is_featured).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-800 font-sans antialiased">
      
      {/* ========================================================= */}
      {/* 1. MASTER SIDEBAR: مضاف إليه الـ 11 زرار كاملين بره ومرتبين */}
      {/* ========================================================= */}
      <aside className="w-64 bg-white border-r border-gray-200/80 flex flex-col shrink-0 sticky top-0 h-screen z-20">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
          <div className="w-7 h-7 bg-gray-900 rounded-xl flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <span className="font-black text-gray-900 block text-xs tracking-tight">Locali Control</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Master Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="px-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Main</p>
          
          <button onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'dashboard' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard Overview
          </button>

          <button onClick={() => setActiveMenu('verification')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'verification' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <ShieldCheck className="w-3.5 h-3.5" /> Verification Queue
          </button>

          <p className="px-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider pt-4 mb-1.5">Platform Content (CMS)</p>
          
          <button onClick={() => setActiveMenu('cms')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'cms' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Database className="w-3.5 h-3.5" /> 27-Table CMS Manager
          </button>

          <button onClick={() => setActiveMenu('add-service')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'add-service' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <PlusCircle className="w-3.5 h-3.5" /> Add New Service
          </button>

          <button onClick={() => setActiveMenu('prices')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'prices' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <DollarSign className="w-3.5 h-3.5" /> Price Manager
          </button>

          <button onClick={() => setActiveMenu('home-cms')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'home-cms' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Home className="w-3.5 h-3.5" /> Home Page CMS
          </button>

          <button onClick={() => setActiveMenu('personas')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'personas' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Users className="w-3.5 h-3.5" /> Local Personas
          </button>

          <button onClick={() => setActiveMenu('el-gouna-fix')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'el-gouna-fix' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <MapPin className="w-3.5 h-3.5" /> Cairo→El Gouna Fix
          </button>

          <button onClick={() => setActiveMenu('images')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'images' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Image className="w-3.5 h-3.5" /> Place Image Updater
          </button>

          <button onClick={() => setActiveMenu('bulk')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'bulk' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Database className="w-3.5 h-3.5" /> Data Bulk Populate
          </button>

          <button onClick={() => setActiveMenu('content-manager')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeMenu === 'content-manager' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
            <FileText className="w-3.5 h-3.5" /> Content Manager
          </button>
        </nav>

        <div className="p-3 border-t border-gray-100 bg-gray-50/50 space-y-0.5">
          <Link to="/" className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Site View
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Secure Sign Out
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE AREA: فرد الفورمز والجداول الجانبية مباشرة */}
      {/* ========================================================= */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto bg-white z-10">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-100 px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Control Panel / {activeMenu.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200/60">Active Admin: {user.username}</span>
          </div>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto flex-1">

          {/* تبويب لوحة القيادة العامة والـ Stats الإفتراضية */}
          {activeMenu === 'dashboard' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-xs text-gray-500 mt-0.5">Application monitoring and listing queues</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Base Records', value: stats.total, color: 'bg-white border border-gray-200 text-gray-900' },
                  { label: 'Pending Verification', value: stats.pending, color: 'bg-amber-500/5 border border-amber-500/10 text-amber-600' },
                  { label: 'Approved Active', value: stats.approved, color: 'bg-emerald-50/5 border border-emerald-50/10 text-emerald-600' },
                  { label: 'Featured Boosted', value: stats.featured, color: 'bg-rose-50/5 border border-rose-50/10 text-rose-600' },
                ].map(s => (
                  <div key={s.label} className={`${s.color} rounded-2xl p-4 shadow-sm`}>
                    <p className="text-2xl font-black tracking-tight">{s.value}</p>
                    <p className="text-[10px] font-bold mt-0.5 opacity-80 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Tabs System */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit border border-gray-200/40">
                {['pending', 'approved', 'rejected'].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}>
                    {t} ({tabs[t].length})
                  </button>
                ))}
              </div>

              {/* Queue Places */}
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : currentPlaces.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400">Clean queue. No items require {tab} moderation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentPlaces.map(place => {
                    const image = place.main_image || place.images?.[0];
                    const isActing = acting === place.id;
                    return (
                      <div key={place.id} className="bg-white rounded-xl border border-gray-200/80 overflow-hidden shadow-sm hover:border-gray-300 transition-all">
                        <div className="flex gap-4 p-4">
                          <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                            {image ? (
                              <img src={image} alt={place.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                {CATEGORY_ICONS[place.category] || '🏠'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm">{place.title}</h3>
                                <p className="text-[11px] text-gray-500 mt-0.5 capitalize">{place.category} · {place.city}</p>
                              </div>
                              <p className="font-black text-gray-900 text-sm">{place.price?.toLocaleString()} EGP</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex bg-gray-50 border-t border-gray-100 divide-x divide-gray-100">
                          {tab === 'pending' && (
                            <>
                              <button onClick={() => updateStatus(place.id, 'approved')} disabled={isActing} className="flex-1 py-2 text-xs font-bold text-emerald-600">Approve</button>
                              <button onClick={() => updateStatus(place.id, 'rejected')} disabled={isActing} className="flex-1 py-2 text-xs font-bold text-red-600">Reject</button>
                            </>
                          )}
                          <button onClick={() => toggleFeatured(place)} disabled={isActing} className="flex-1 py-2 text-xs font-bold text-gray-600">{place.is_featured ? '★ Featured' : '☆ Feature'}</button>
                          <button onClick={() => deletePlace(place.id)} disabled={isActing} className="flex-1 py-2 text-xs font-bold text-red-600">Delete</button>
                        </div>
                      </div>
                    );
                  })}
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  )}
                  {!isFetchingNextPage && !hasNextPage && currentPlaces.length > 0 && (
                    <p className="text-center text-xs font-medium text-gray-400 py-2">No more records</p>
                  )}
                  <div ref={loadMoreRef} className="h-1" />
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* THE WORKING AREA INLINE LOADER: حقن الموديولات لتفتح في الجنب مباشرة دايماً */}
          {/* ========================================================================= */}
          {activeMenu === 'cms' && <AdminCMS />}
          {activeMenu === 'add-service' && <AddService />}
          {activeMenu === 'prices' && <AdminPriceManager />}
          {activeMenu === 'content-manager' && <AdminContentManager />}
          {activeMenu === 'images' && <AdminPlaceImageUpdater />}
          {activeMenu === 'bulk' && <AdminBulkPopulate />}
          {activeMenu === 'verification' && <AdminVerification />}
          {activeMenu === 'personas' && <AdminLocalPersonas />}       {/* تفتح في الجنب */}
          {activeMenu === 'home-cms' && <AdminHomeCMS />}             {/* تفتح في الجنب */}
          {activeMenu === 'el-gouna-fix' && <AdminElGounaFix />}     {/* تفتح في الجنب */}

        </div>
      </main>
    </div>
  );
}