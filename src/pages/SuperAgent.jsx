import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Bot, Send, Plus, Trash2, Zap, FileText, TrendingUp, Settings, ChevronRight, Loader2 } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';

const QUICK_ACTIONS = [
  {
    icon: FileText,
    label: 'اكتب مقال SEO',
    prompt: 'ابحث عن أكثر الكلمات بحثاً عن السفر إلى مصر هذا الشهر، واكتب مقالاً متوافقاً مع SEO عن "أفضل الأماكن السياحية في مصر" بالعربي والإنجليزي.',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    icon: Plus,
    label: 'أضف خدمة جديدة',
    prompt: 'أضف خدمة جديدة لمنصة Locali Egypt. اسألني عن التفاصيل المطلوبة.',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    icon: TrendingUp,
    label: 'تحليل الأداء',
    prompt: 'حلل بيانات الخدمات والصفقات الموجودة في المنصة وقدم توصيات لتحسين الأداء.',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    icon: Zap,
    label: 'محتوى سوشيال ميديا',
    prompt: 'اكتب لي 5 منشورات جاهزة لوسائل التواصل الاجتماعي (فيسبوك وإنستجرام) بالعربي والإنجليزي تروّج لخدمات Locali Egypt.',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    icon: Settings,
    label: 'تحديث الصفقات',
    prompt: 'راجع الصفقات السياحية الموجودة وأخبرني أيها تحتاج تحديث أو تفعيل.',
    color: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    icon: FileText,
    label: 'نصوص إعلانية',
    prompt: 'اكتب لي 3 نصوص إعلانية (Ad Copy) لـ Google Ads تستهدف السياح الأجانب الراغبين في زيارة مصر، مع اقتراح الكلمات المفتاحية.',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
];

export default function SuperAgent() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!activeConv) return;
    const unsub = base44.agents.subscribeToConversation(activeConv.id, (data) => {
      setMessages(data.messages || []);
    });
    return unsub;
  }, [activeConv?.id]);

  const loadConversations = async () => {
    setLoadingConvs(true);
    const convs = await base44.agents.listConversations({ agent_name: 'super_agent' });
    setConversations(convs || []);
    setLoadingConvs(false);
  };

  const createConversation = async (firstMessage = null) => {
    const conv = await base44.agents.createConversation({
      agent_name: 'super_agent',
      metadata: { name: firstMessage ? firstMessage.slice(0, 40) + '…' : 'محادثة جديدة' },
    });
    setConversations(prev => [conv, ...prev]);
    setActiveConv(conv);
    setMessages([]);
    if (firstMessage) {
      await sendMessage(firstMessage, conv);
    }
  };

  const sendMessage = async (text, conv = activeConv) => {
    if (!text.trim() || !conv) return;
    setSending(true);
    setInput('');
    await base44.agents.addMessage(conv, { role: 'user', content: text });
    setSending(false);
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConv?.id === convId) { setActiveConv(null); setMessages([]); }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] max-w-6xl mx-auto">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold">Super Agent</p>
              <p className="text-[10px] text-muted-foreground">Locali Egypt AI</p>
            </div>
          </div>
          <button
            onClick={() => createConversation()}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-bold hover:opacity-90 transition"
          >
            <Plus className="w-3.5 h-3.5" /> محادثة جديدة
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingConvs ? (
            <div className="flex justify-center py-6"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
          ) : conversations.length === 0 ? (
            <p className="text-[10px] text-center text-muted-foreground py-6">لا توجد محادثات بعد</p>
          ) : conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => { setActiveConv(conv); setMessages(conv.messages || []); }}
              className={`w-full text-right flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-all group ${activeConv?.id === conv.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-foreground'}`}
            >
              <span className="truncate flex-1">{conv.metadata?.name || 'محادثة'}</span>
              <button onClick={(e) => deleteConversation(conv.id, e)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition">
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {!activeConv ? (
          /* Welcome screen */
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-violet-500 flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-black mb-2">Super Agent 🚀</h1>
                <p className="text-sm text-muted-foreground">مساعدك الذكي لإدارة Locali Egypt — محتوى، تسويق، وعمليات تلقائية</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {QUICK_ACTIONS.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => createConversation(action.prompt)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:shadow-md ${action.color}`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold">{action.label}</p>
                        <p className="text-[10px] opacity-70 mt-0.5 line-clamp-2">{action.prompt.slice(0, 60)}…</p>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
                    </button>
                  );
                })}
              </div>

              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 text-center">
                <p className="text-xs text-violet-700 font-bold mb-1">💡 قدرات Super Agent</p>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {['كتابة SEO', 'إدارة الخدمات', 'تحليل البيانات', 'محتوى سوشيال', 'نصوص إعلانية', 'تحديث المنصة'].map(cap => (
                    <span key={cap} className="text-[10px] bg-white border border-violet-200 text-violet-700 px-2 py-1 rounded-lg font-bold">{cap}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat view */
          <>
            <div className="border-b border-border px-4 py-3 flex items-center gap-2 bg-card">
              <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-sm font-bold truncate flex-1">{activeConv.metadata?.name || 'محادثة'}</p>
              <button onClick={() => { setActiveConv(null); setMessages([]); }} className="text-xs text-muted-foreground hover:text-foreground transition">← رجوع</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>ابدأ المحادثة…</p>
                </div>
              )}
              {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
              {sending && (
                <div className="flex gap-2 items-center text-xs text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> جاري الإرسال…
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border p-3 bg-card">
              {/* Quick action pills */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-2">
                {QUICK_ACTIONS.map((a, i) => (
                  <button key={i} onClick={() => sendMessage(a.prompt)}
                    className="shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full border border-border bg-secondary hover:bg-primary hover:text-primary-foreground transition">
                    {a.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="اكتب طلبك هنا…"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ direction: 'rtl' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-xl bg-violet-500 text-white flex items-center justify-center hover:bg-violet-600 disabled:opacity-40 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}