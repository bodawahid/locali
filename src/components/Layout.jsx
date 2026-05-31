import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import FloatingAIChat from './FloatingAIChat';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

import useLanguage from '../hooks/useLanguage';
import useTranslate, { isRTL } from '../hooks/useTranslate';

export default function Layout() {
  const { lang, changeLang } = useLanguage();
  const [openChat, setOpenChat] = useState(false);
  const { tx } = useTranslate(lang);

  return (
    <div className="min-h-screen bg-white" dir={isRTL(lang) ? 'rtl' : 'ltr'}>
      <TopBar lang={lang} onLangChange={changeLang} />
      <main className="pb-20 md:pb-0">
        <Outlet context={{ lang, changeLang, tx, openAIChat: () => setOpenChat(true) }} />
      </main>

      <FloatingAIChat externalOpen={openChat} onExternalOpenHandled={() => setOpenChat(false)} />
      <Footer lang={lang} />
      <BottomNav />
    </div>
  );
}