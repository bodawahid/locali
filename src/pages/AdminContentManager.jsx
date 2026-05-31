import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Bot, Send, RefreshCw, Database, Search, CheckCircle2,
  AlertTriangle, Zap, Globe, TrendingUp, MapPin, Loader2,
  ChevronDown, ChevronRight, Star, Clock, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const QUICK_COMMANDS = [
  { label: '🔍 Audit all prices', prompt: 'Review all current prices in the database and tell me which ones look outdated or incorrect based on April 2026 market rates. Use web search to verify.' },
  { label: '🏨 Update hotel prices', prompt: 'Search for current hotel prices in Hurghada and Sharm El Sheikh for April 2026 and update the PriceGuide database with accurate rates.' },
  { label: '🍽️ Find new restaurants', prompt: 'Search for top-rated restaurants in Hurghada that opened or became popular in 2025-2026 and add them to the Service database.' },
  { label: '⚠️ Latest scam alerts', prompt: 'Search for recent tourist scam reports in Egypt 2026 and add any new scam patterns to the ScamReport database for Hurghada and Sharm El Sheikh.' },
  { label: '📊 Live situation update', prompt: 'Search for current weather, events, and tourist conditions in Hurghada and Sharm El Sheikh for April 2026 and update the LiveSituation records.' },
  { label: '🤿 Activity prices', prompt: 'Search for current prices for diving, snorkeling, and desert safari activities in Hurghada and Sharm El Sheikh April 2026 and update PriceGuide.' },
  { label: '🔎 Verify all phones', prompt: 'Read all Service records and identify any with missing or incorrectly formatted phone numbers. List them for correction.' },
  { label: '🗑️ Find duplicates', prompt: 'Search the Service database for any duplicate listings (same name or very similar names in the same city) and report them.' },
];

const AUTO_TASKS = [
  { id: 'prices', label: 'Price Monitor', desc: 'Checks hotel & activity prices weekly', status: 'active', lastRun: '2026-04-07' },
  { id: 'scams', label: 'Scam Alert Scanner', desc: 'Scans for new scam reports daily', status: 'active', lastRun: '2026-04-08' },
  { id: 'live', label: 'Live Situation', desc: 'Updates weather & events daily', status: 'active', lastRun: '2026-04-08' },
  { id: 'quality', label: 'Content Quality Check', desc: 'Reviews listings for placeholder text weekly', status: 'paused', lastRun: '2026-04-01' },
];

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-accent" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        {message.content && (
          <div className={`rounded-2xl px-4 py-2.5 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50'}`}>
            {isUser ? (
              <p className="text-sm">{message.content}</p>
            ) : (
              <ReactMarkdown className="text-sm prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
        {message.tool_calls?.length > 0 && (
          <div className="mt-1 space-y-1">
            {message.tool_calls.map((tc, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-xl text-xs text-muted-foreground">
                {tc.status === 'completed' ? <CheckCircle2 className="w-3 h-3 text-success" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                <span className="font-mono">{tc.name?.split('.').reverse().join(' ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminContentManager() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ services: 0, scams: 0, prices: 0 });
  const [tab, setTab] = useState('chat');
  const messagesEndRef = useRef(null);

  // Load stats
  useEffect(() => {
    Promise.all([
      base44.entities.Service.list('-updated_date', 1),
      base44.entities.ScamReport.list('-updated_date', 1),
      base44.entities.PriceGuide.list('-updated_date', 1),
    ]).then(([s, sc, p]) => {
      // Just trigger to verify entities exist
    }).catch(() => {});

    base44.entities.Service.list('-updated_date', 200).then(s => setStats(prev => ({ ...prev, services: s.length })));
    base44.entities.ScamReport.list('-updated_date', 100).then(s => setStats(prev => ({ ...prev, scams: s.length })));
    base44.entities.PriceGuide.list('-updated_date', 200).then(s => setStats(prev => ({ ...prev, prices: s.length })));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startOrSend = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setLoading(true);

    let conv = conversation;
    if (!conv) {
      conv = await base44.agents.createConversation({
        agent_name: 'content_manager',
        metadata: { name: `Content Session ${new Date().toLocaleString()}` },
      });
      setConversation(conv);
    }

    const updated = await base44.agents.addMessage(conv, { role: 'user', content: msg });
    setConversation(updated);

    // Subscribe to streaming
    const unsub = base44.agents.subscribeToConversation(updated.id, (data) => {
      setMessages(data.messages || []);
    });

    // Wait for completion
    await new Promise(resolve => setTimeout(resolve, 15000));
    unsub();

    // Final fetch
    const final = await base44.agents.getConversation(updated.id);
    setMessages(final.messages || []);
    setConversation(final);
    setLoading(false);
  };

  const newSession = () => {
    setConversation(null);
    setMessages([]);
  };

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">AI Content Manager</h1>
            <p className="text-sm text-muted-foreground">Locali Egypt — Automated data management · April 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-success/10 border border-success/20 rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold text-success">ACTIVE</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Services', value: stats.services, icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Scam Alerts', value: stats.scams, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Price Guides', value: stats.prices, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`rounded-2xl border border-border/50 p-4 text-center ${s.bg}`}>
              <Icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label} in DB</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { id: 'chat', label: '🤖 AI Manager' },
          { id: 'tasks', label: '⚡ Auto Tasks' },
          { id: 'quick', label: '🚀 Quick Commands' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CHAT TAB ── */}
      {tab === 'chat' && (
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          {/* Messages */}
          <div className="h-[420px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">AI Content Manager ready</p>
                <p className="text-xs text-muted-foreground mt-1">Ask me to update prices, add services, check data quality, or search for new businesses.</p>
              </div>
            )}
            {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  <span className="text-xs text-muted-foreground">Working on it...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border/30 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && startOrSend()}
              placeholder="e.g. Search for new restaurants in Hurghada and add them..."
              className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-accent/50"
            />
            <button onClick={() => startOrSend()} disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-40 shrink-0">
              <Send className="w-4 h-4" />
            </button>
            {messages.length > 0 && (
              <button onClick={newSession} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0" title="New session">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── AUTO TASKS TAB ── */}
      {tab === 'tasks' && (
        <div className="space-y-3">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs text-amber-700">
            ⚡ Scheduled auto-tasks require <strong>Builder+ subscription</strong> for backend functions. Currently running manually via AI agent.
          </div>
          {AUTO_TASKS.map((task, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${task.status === 'active' ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                <div>
                  <p className="font-bold text-sm">{task.label}</p>
                  <p className="text-xs text-muted-foreground">{task.desc}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" /> Last run: {task.lastRun}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTab('chat');
                  const prompts = {
                    prices: QUICK_COMMANDS[1].prompt,
                    scams: QUICK_COMMANDS[3].prompt,
                    live: QUICK_COMMANDS[4].prompt,
                    quality: QUICK_COMMANDS[6].prompt,
                  };
                  setTimeout(() => startOrSend(prompts[task.id]), 100);
                }}
                className="flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
                <Zap className="w-3 h-3" /> Run Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── QUICK COMMANDS TAB ── */}
      {tab === 'quick' && (
        <div className="grid sm:grid-cols-2 gap-3">
          {QUICK_COMMANDS.map((cmd, i) => (
            <button key={i} onClick={() => { setTab('chat'); setTimeout(() => startOrSend(cmd.prompt), 100); }}
              className="bg-card rounded-2xl border border-border/50 p-4 text-left hover:border-accent/40 transition-all group">
              <p className="font-bold text-sm mb-1 group-hover:text-accent transition-colors">{cmd.label}</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{cmd.prompt}</p>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 bg-secondary/50 rounded-2xl p-4 text-xs text-muted-foreground text-center">
        🔒 Admin only · All changes are logged in the database · AI uses web search for verified data
      </div>
    </div>
  );
}