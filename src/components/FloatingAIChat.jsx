import { useState, useEffect, useRef, useCallback } from 'react';
import ChatCurrencyTicker from './ChatCurrencyTicker';
import { base44 } from '@/api/base44Client';
import { Bot, X, Send, Sparkles, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const QUICK_PROMPTS = [
  { label: '🗓️ Plan my trip', text: 'I want to plan a trip to Egypt. Can you help?' },
  { label: '🍽️ Best restaurants', text: 'What are the best restaurants near me in Egypt?' },
  { label: '💱 USD → EGP', text: 'What is the current USD to EGP exchange rate?' },
  { label: '🏛️ Top sights Luxor', text: 'What are the top sightseeing spots in Luxor?' },
  { label: '🚗 Ride to Cairo', text: 'I need a shared ride to Cairo. What are my options?' },
  { label: '🔒 Is it safe now?', text: 'Is Egypt safe for tourists right now?' },
];

function TypingIndicator() {
  return (
    <div className="flex gap-2.5 justify-start">
      <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-1">
        <Bot className="w-3.5 h-3.5 text-accent" />
      </div>
      <div className="bg-white dark:bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

function Bubble({ message }) {
  const isUser = message.role === 'user';
  if (!message.content && !message.tool_calls?.length) return null;

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-3.5 h-3.5 text-accent" />
        </div>
      )}
      <div className={`max-w-[82%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        {message.content && (
          <div className={`rounded-2xl px-3.5 py-2.5 text-sm ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-white dark:bg-card border border-border/50 rounded-tl-sm'
          }`}>
            {isUser ? (
              <p className="leading-relaxed">{message.content}</p>
            ) : (
              <ReactMarkdown
                className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 text-sm"
                components={{
                  p: ({ children }) => <p className="my-0.5 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                  li: ({ children }) => <li className="my-0.5">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  h3: ({ children }) => <h3 className="text-sm font-bold my-1">{children}</h3>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
        {message.tool_calls?.length > 0 && (
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Sparkles className="w-2.5 h-2.5 text-accent" />
            Searching Localli database…
          </div>
        )}
      </div>
    </div>
  );
}

const SNAP_MARGIN = 16;

function useDraggable() {
  const getSaved = () => {
    try { return JSON.parse(sessionStorage.getItem('ai_btn_pos')); } catch { return null; }
  };
  const getDefault = () => ({ x: window.innerWidth - 72, y: window.innerHeight - 100 });

  const [pos, setPos] = useState(() => getSaved() || getDefault());
  const dragging = useRef(false);
  const startOffset = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  const snapToEdge = useCallback((x, y) => {
    const btnSize = 56;
    const midX = window.innerWidth / 2;
    const snappedX = x + btnSize / 2 < midX ? SNAP_MARGIN : window.innerWidth - btnSize - SNAP_MARGIN;
    const clampedY = Math.max(80, Math.min(y, window.innerHeight - btnSize - SNAP_MARGIN));
    return { x: snappedX, y: clampedY };
  }, []);

  const onPointerDown = useCallback((e) => {
    dragging.current = true;
    moved.current = false;
    startOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [pos]);

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    moved.current = true;
    const x = Math.max(0, Math.min(e.clientX - startOffset.current.x, window.innerWidth - 56));
    const y = Math.max(80, Math.min(e.clientY - startOffset.current.y, window.innerHeight - 56));
    setPos({ x, y });
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!dragging.current) return;
    dragging.current = false;
    if (moved.current) {
      const snapped = snapToEdge(pos.x, pos.y);
      setPos(snapped);
      sessionStorage.setItem('ai_btn_pos', JSON.stringify(snapped));
    }
    return !moved.current; // returns true if it was a tap
  }, [pos, snapToEdge]);

  return { pos, onPointerDown, onPointerMove, onPointerUp, wasDrag: () => moved.current };
}

export default function FloatingAIChat({ externalOpen, onExternalOpenHandled }) {
  const [open, setOpen] = useState(false);
  const { pos, onPointerDown, onPointerMove, onPointerUp, wasDrag } = useDraggable();

  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
      if (onExternalOpenHandled) onExternalOpenHandled();
    }
  }, [externalOpen]);
  const [conversation, setConversation] = useState(null);
  const conversationRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open && !initialized) {
      initChat();
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const initChat = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'egypt_guide',
      metadata: { name: 'Floating Chat' },
    });
    setConversation(conv);
    conversationRef.current = conv;
    setInitialized(true);

    base44.agents.subscribeToConversation(conv.id, (data) => {
      const msgs = data.messages || [];
      setMessages(msgs);
      // Resolve loading: stop when last message is assistant with content
      // Also stop if there's been any assistant message (even tool-calls only) for >1s
      const last = msgs[msgs.length - 1];
      if (last?.role === 'assistant') {
        if (last?.content) {
          setLoading(false);
        } else {
          // Tool call in progress — will resolve when content arrives
          // Set a safety timeout to avoid permanent spinner
          setTimeout(() => setLoading(false), 30000);
        }
      }
    });
  };

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    // Auto-init if conversation not ready
    let conv = conversationRef.current;
    if (!conv) {
      setLoading(true);
      try {
        await initChat();
        conv = conversationRef.current;
      } catch (err) {
        console.error('[AI] Init failed:', err);
        setLoading(false);
        setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Unable to connect to AI assistant. Please try again.' }]);
        return;
      }
    }

    setInput('');
    setLoading(true);

    // Safety timeout — never leave user with infinite spinner
    const timeout = setTimeout(() => {
      setLoading(false);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role !== 'assistant' || !last?.content) {
          return [...prev, { role: 'assistant', content: '⚠️ The assistant took too long to respond. Please try again.' }];
        }
        return prev;
      });
    }, 45000);

    try {
      await base44.agents.addMessage(conv, { role: 'user', content: msg });
    } catch (err) {
      clearTimeout(timeout);
      console.error('[AI] Send failed:', err);
      setLoading(false);
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Failed to send message. Please check your connection and try again.' }]);
      return;
    }

    // Clear timeout when subscription resolves loading
    const checkDone = setInterval(() => {
      // loading state managed by subscription — clear safety interval
    }, 1000);
    setTimeout(() => clearInterval(checkDone), 50000);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const visibleMessages = messages.filter(m => m.content || m.tool_calls?.length);

  return (
    <>
      {/* Draggable floating button */}
      <div
        style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999, touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => {
          const wasTap = onPointerUp(e);
          if (!wasDrag()) setOpen(o => !o);
        }}
      >
        <button
          className="w-14 h-14 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center select-none"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25), 0 0 0 4px hsl(var(--accent)/0.2)' }}
          aria-label="Open AI Assistant"
        >
          {open ? <X className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-accent text-accent-foreground shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <p className="font-bold text-sm leading-none">Localli Guide</p>
                <p className="text-[10px] opacity-80 mt-0.5">Your Egypt smart assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-bold">LIVE</span>
              </div>
              <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100">
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <ChatCurrencyTicker />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-secondary/20">
            {visibleMessages.length === 0 && !loading && (
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="bg-white dark:bg-card border border-border/50 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm max-w-[82%]">
                    <p className="leading-relaxed">👋 <strong>Hi! I'm Localli Guide.</strong><br/>Ask me about restaurants, pharmacies, rides, prices, safety — anything about Egypt! 🇪🇬</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {QUICK_PROMPTS.map((p, i) => (
                    <button key={i} onClick={() => send(p.text)}
                      className="text-left text-[11px] font-medium px-2.5 py-2 bg-white dark:bg-card border border-border/50 rounded-xl hover:border-accent/30 hover:bg-accent/5 transition-all leading-snug">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {visibleMessages.map((msg, i) => <Bubble key={i} message={msg} />)}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-border/50 bg-card shrink-0">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask about restaurants, rides, prices…"
                className="flex-1 px-3 py-2 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-accent text-accent-foreground rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-muted-foreground mt-1.5 text-center">English · Русский · Deutsch · العربية</p>
          </div>
        </div>
      )}
    </>
  );
}