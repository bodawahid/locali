import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, Bot, Sparkles, MapPin, Phone, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const QUICK_PROMPTS = [
  { label: '🍽️ Best restaurants in Hurghada', text: 'What are the best restaurants in Hurghada?' },
  { label: '💊 24hr pharmacy Sharm', text: 'Where can I find a 24-hour pharmacy in Sharm El Sheikh?' },
  { label: '🏥 English-speaking doctor Luxor', text: 'I need an English-speaking doctor in Luxor.' },
  { label: '💱 Currency rates today', text: 'What are today\'s currency exchange rates USD to EGP?' },
  { label: '🚗 Ride from Hurghada to Cairo', text: 'I need a shared ride from Hurghada to Cairo.' },
  { label: '🛒 Supermarket near Naama Bay', text: 'Where is the nearest supermarket to Naama Bay Sharm?' },
  { label: '🔒 Is Aswan safe right now?', text: 'Is Aswan safe for tourists right now?' },
  { label: '💰 Fair taxi price Luxor Temple', text: 'What is a fair taxi price from the train station to Luxor Temple?' },
];

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-accent" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        {message.content && (
          <div className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border/50'
          }`}>
            {isUser ? (
              <p className="text-sm leading-relaxed">{message.content}</p>
            ) : (
              <ReactMarkdown
                className="text-sm prose prose-sm prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                components={{
                  p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
                  li: ({ children }) => <li className="my-0.5">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  h1: ({ children }) => <h1 className="text-base font-bold my-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-sm font-bold my-1.5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold my-1">{children}</h3>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
        {/* Tool calls */}
        {message.tool_calls?.length > 0 && (
          <div className="mt-1.5 space-y-1">
            {message.tool_calls.map((tc, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground bg-secondary/50 rounded-lg px-2 py-1">
                <Sparkles className="w-3 h-3 text-accent" />
                <span>Searching {tc.name?.replace('_', ' ')} database…</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initConversation = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: 'egypt_guide',
      metadata: { name: 'Localli Guide Session' },
    });
    setConversation(conv);
    setInitializing(false);

    base44.agents.subscribeToConversation(conv.id, (data) => {
      setMessages(data.messages || []);
      if (data.messages?.length > 0) {
        const last = data.messages[data.messages.length - 1];
        if (last.role === 'assistant' && last.content) setLoading(false);
      }
    });
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || !conversation || loading) return;
    setInput('');
    setLoading(true);
    await base44.agents.addMessage(conversation, { role: 'user', content: msg });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="font-extrabold text-base">Localli Guide</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Your smart Egypt travel assistant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Welcome state */}
        {messages.filter(m => m.content).length === 0 && !initializing && (
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
                <Bot className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-xl font-black mb-1">Hi! I'm Localli Guide 🇪🇬</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Your personal smart guide for Egypt. Ask me anything about restaurants, safety, prices, hospitals, rides, and more.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2 text-center">Quick questions:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => sendMessage(p.text)}
                    className="text-left px-3 py-2.5 bg-card border border-border/50 rounded-xl text-xs font-medium hover:border-accent/30 hover:bg-accent/5 transition-all">
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-4">
              <p className="text-xs font-bold mb-2">I can help with:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  '🍽️ Restaurants & Cafes',
                  '💊 Pharmacies & Hospitals',
                  '🛒 Supermarkets',
                  '🚗 Shared Rides',
                  '💰 Prices & Currency',
                  '🔒 Safety & Live Status',
                  '🔧 Home Repair Services',
                  '🏨 Long Stay Help',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {initializing && (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-muted-foreground">Starting your guide…</p>
            </div>
          </div>
        )}

        {messages.filter(m => m.content || m.tool_calls?.length > 0).map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-accent" />
            </div>
            <div className="bg-card border border-border/50 rounded-2xl px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-muted-foreground">Searching Localli database…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/50 bg-card/50">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about restaurants, safety, prices, hospitals…"
            rows={1}
            disabled={loading || initializing}
            className="flex-1 resize-none px-4 py-3 bg-background border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 min-h-[48px] max-h-32"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading || initializing}
            className="w-12 h-12 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Localli Guide searches our verified database first, then trusted external sources.
        </p>
      </div>
    </div>
  );
}