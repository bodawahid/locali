import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Shield, ExternalLink, Zap } from 'lucide-react';
import { buildLokiContext } from '@/lib/loki/contextBuilder';
import { preloadLokiContext } from '@/lib/loki/contextCache';

const WELCOME = 'أهلاً! أنا **LOKI** — دليلك الشامل للسياحة في مصر 🛡️\n\n**قطارات • مواصلات • فنادق • مطاعم • أسعار عادل • خرائط • أمان**\n\nمعلومات من أكتر من 847+ مسافر عبر Telegram • Facebook • EgyptTrains • Numbeo\n\n**قولّي إنت فين؟ أو اسأل عن إيه؟**';

const QUICK = [
  { label: '🚂 Cairo → Luxor train', text: 'How much is the train from Cairo to Luxor? Where to book?' },
  { label: '🚕 Fair taxi Hurghada', text: 'Fair taxi price Hurghada airport to Marina?' },
  { label: '��️ Restaurants Sharm', text: 'Best restaurants in Sharm Old Market with prices and maps?' },
  { label: '🏨 Hotels El Gouna', text: 'Recommended hotels in El Gouna with price range?' },
];

function isTourismRelated(text) {
  const t = text.toLowerCase();
  const keys = ['taxi', 'train', 'hotel', 'restaurant', 'price', 'scam', 'egypt', 'hurghada', 'sharm', 'luxor', 'aswan', 'gouna', 'map', 'transfer', 'bus', 'food', 'تاكسي', 'قطار', 'فندق', 'مطعم', 'سعر', 'مواصلات', 'شرم', 'الغردقة', 'أقصر', 'أسوان', 'جونة'];
  return keys.some((k) => t.includes(k)) || t.length < 40;
}

function Bubble({ message, streaming }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/20">
          <Shield className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
        isUser
          ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-tr-md shadow-md'
          : 'bg-white/95 backdrop-blur border border-slate-100 text-slate-800 rounded-tl-md shadow-sm hover:shadow-md transition-shadow'
      }`}>
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-teal-600 [&_a]:font-semibold [&_a]:underline [&_strong]:text-teal-900 [&_strong]:font-bold"
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 hover:opacity-80">
                  {children}<ExternalLink className="w-3 h-3 inline" />
                </a>
              ),
              p: ({ children }) => <p className="my-1.5">{children}</p>,
              ul: ({ children }) => <ul className="my-1 ml-3 list-disc space-y-0.5">{children}</ul>,
              li: ({ children }) => <li className="my-0">{children}</li>,
              strong: ({ children }) => <strong className="font-bold text-teal-900">{children}</strong>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {streaming && <span className="inline-block w-1.5 h-4 bg-teal-500 animate-pulse ml-0.5 rounded-sm" />}
      </div>
    </div>
  );
}

export default function LokiChat({ compact = false }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { preloadLokiContext(null); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamText, isLoading]);

  const sendMessage = useCallback(async (textOverride) => {
    const userMsg = (textOverride || input).trim();
    if (!userMsg || isLoading) return;

    if (!isTourismRelated(userMsg)) {
      setMessages((p) => [...p, { role: 'user', content: userMsg }, { role: 'assistant', content: 'أنا LOKI — سياحة مصر فقط 🛡️\n\nاسأل عن:\n• 🚂 القطارات\n• 🚕 المواصلات\n• 🏨 الفنادق\n• 🍽️ المطاعم\n• 💰 الأسعار\n• 🛡️ الأمان' }]);
      setInput('');
      return;
    }

    setMessages((p) => [...p, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);
    setStreamText('');
    setError('');

    try {
      const { contextBlock, intent } = await buildLokiContext(userMsg);
      const res = await fetch('/api/loki/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, contextBlock, intent, history: messages.slice(-6) }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Backend chat failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const part = decoder.decode(value, { stream: true });
        full += part;
        setStreamText(full);
      }

      setMessages((p) => [...p, { role: 'assistant', content: full || '⚠️ مفيش رد من Grok حالياً.' }]);
      setStreamText('');
    } catch (err) {
      console.error('[LOKI Error]', err);
      const errMsg = err.message || 'حدث خطأ. جرّب مرة أخرى.';
      setError(errMsg);
      setMessages((p) => [...p, { role: 'assistant', content: `⚠️ ${errMsg}` }]);
      setStreamText('');
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  return (
    <div className={`flex flex-col h-full ${compact ? '' : 'max-w-lg mx-auto rounded-3xl border border-slate-200 shadow-2xl overflow-hidden min-h-[520px] mt-8'}`}>
      {!compact && (
        <div className="shrink-0 px-5 py-4 bg-gradient-to-r from-slate-900 via-teal-900 to-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">LOKI Intelligence</p>
              <p className="text-[11px] text-teal-200/90">Trains · Transport · Hotels · Maps · Community data</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 min-h-0 bg-gradient-to-b from-slate-50 to-white overscroll-contain scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {messages.map((msg, i) => <Bubble key={i} message={msg} />)}
        {streamText && <Bubble message={{ role: 'assistant', content: streamText }} streaming />}
        {isLoading && !streamText && (
          <div className="flex gap-2.5 items-center text-xs text-slate-400 px-2 animate-pulse">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>LOKI جاهز يجمع البيانات من Telegram • Facebook • EgyptTrains...</span>
          </div>
        )}
        {messages.length <= 1 && !isLoading && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {QUICK.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendMessage(q.text)}
                className="text-left text-[11px] font-semibold px-3 py-3 bg-white border border-slate-200 rounded-2xl hover:border-teal-400 hover:bg-teal-50 hover:shadow-md active:scale-[0.98] transition-all duration-200"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        className="shrink-0 p-3 bg-white/80 backdrop-blur-xl border-t border-slate-100"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && input.trim() && !isLoading) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={compact ? 'Ask LOKI...' : 'مواصلات، قطارات، فنادق، مطاعم...'}
            disabled={isLoading}
            autoFocus={!compact}
            className="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center disabled:opacity-40 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 active:scale-95 transition-all"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
