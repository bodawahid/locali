import { useState, lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import PageTransition from './PageTransition';

import useLanguage from '../hooks/useLanguage';
import useTranslate, { isRTL } from '../hooks/useTranslate';

const LokiFloatingWidget = lazy(() => import('./loki/LokiFloatingWidget'));

function ChatLoader() {
  return null;
}

export default function Layout() {
  const { lang, changeLang } = useLanguage();
  const [openChat, setOpenChat] = useState(false);
  const { tx } = useTranslate(lang);

  return (
    <div className="min-h-screen bg-white" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
      <TopBar lang={lang} onLangChange={changeLang} onOpenChat={() => setOpenChat(true)} />
      <main className="pb-20 md:pb-0">
        <PageTransition>
          <Outlet context={{ lang, changeLang, tx, openAIChat: () => setOpenChat(true) }} />
        </PageTransition>
      </main>

      {/* LOKI AI Floating Widget — Available on all pages */}
      <Suspense fallback={<ChatLoader />}>
        <LokiFloatingWidget externalOpen={openChat} onExternalOpenHandled={() => setOpenChat(false)} />
      </Suspense>
      
      <Footer lang={lang} />
      <BottomNav />
    </div>
  );
}
