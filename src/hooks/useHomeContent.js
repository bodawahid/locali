import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Static fallback content when DB has nothing
const FALLBACK = {
  hero: { title: 'Navigate Egypt.', subtitle: 'Like a Local.', description: "Real prices. Scam alerts. Verified services. Your survival guide for Egypt.", image_url: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&q=80' },
  cityPills: [
    { title: 'Hurghada', icon: '🌊', button_link: '/city-guide/hurghada' },
    { title: 'Sharm El Sheikh', icon: '⛰️', button_link: '/city-guide/sharm' },
    { title: 'Luxor', icon: '👑', button_link: '/city-guide/luxor' },
    { title: 'Aswan', icon: '🏛️', button_link: '/city-guide/aswan' },
    { title: 'El Gouna', icon: '🏝️', button_link: '/city-guide/el-gouna' },
  ],
  featureCards: [
    { title: 'Safety Guide', description: 'Real-time scam alerts and emergency contacts.', icon: '🛡️', button_link: '/safety-guide', color_scheme: 'danger' },
    { title: 'Price Checker', description: 'Know the real price before you pay.', icon: '💰', button_link: '/price-checker', color_scheme: 'success' },
    { title: 'Verified Drivers', description: 'ID-verified, rated local drivers.', icon: '🚗', button_link: '/drivers', color_scheme: 'accent' },
    { title: 'Deals & Offers', description: 'Exclusive tourist discounts.', icon: '🎯', button_link: '/deals', color_scheme: 'gold' },
  ],
  tipCards: [
    { title: 'Taxi tip', description: 'Always agree on price before getting in. Fair rate: 50-80 EGP.', icon: '🚕' },
    { title: 'SIM Card', description: 'Buy at Vodafone airport store. 200 EGP = 30GB data.', icon: '📱' },
  ],
};

export default function useHomeContent() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    const init = async () => {
      const data = await base44.entities.HomeContent.list('sort_order', 500);
      setSections(data);
      setLoading(false);
    };
    init();

    // Real-time subscription
    unsub = base44.entities.HomeContent.subscribe((event) => {
      setSections(prev => {
        if (event.type === 'create') return [...prev, event.data].sort((a, b) => (a.sort_order||0) - (b.sort_order||0));
        if (event.type === 'update') return prev.map(s => s.id === event.id ? event.data : s).sort((a, b) => (a.sort_order||0) - (b.sort_order||0));
        if (event.type === 'delete') return prev.filter(s => s.id !== event.id);
        return prev;
      });
    });

    return () => { if (unsub) unsub(); };
  }, []);

  const active = sections.filter(s => s.is_active !== false);
  const hasDB = sections.length > 0;

  const byType = (type) => active.filter(s => s.section_type === type);

  const hero = byType('hero')[0] || (hasDB ? null : FALLBACK.hero);
  const cityPills = byType('city_pill').length > 0 ? byType('city_pill') : (!hasDB ? FALLBACK.cityPills : []);
  const featureCards = byType('feature_card').length > 0 ? byType('feature_card') : (!hasDB ? FALLBACK.featureCards : []);
  const tipCards = byType('tip_card').length > 0 ? byType('tip_card') : (!hasDB ? FALLBACK.tipCards : []);
  const banners = byType('banner');
  const ctaButtons = byType('cta_button');
  const textBlocks = byType('text_block');
  const imageBlocks = byType('image_block');

  return { loading, hasDB, hero, cityPills, featureCards, tipCards, banners, ctaButtons, textBlocks, imageBlocks, all: active };
}