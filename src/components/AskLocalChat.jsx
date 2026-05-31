import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

const QUICK_QUESTIONS = [
  "What's the real taxi price from the airport?",
  'Which restaurants do locals actually go to?',
  'What are the biggest scams I should avoid?',
  'Is it safe to travel alone?',
  'Best time to visit the temples?',
];

export default function AskLocalChat({ local, nationality, flag, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef(null);

  const loadQuestions = async () => {
    // Load this session's questions stored in localStorage
    const ids = JSON.parse(localStorage.getItem('locali_q_ids') || '[]');
    if (!ids.length) return;
    const all = await base44.entities.LocalQuestion.list('-created_date', 50);
    const mine = all.filter(q => ids.includes(q.id));
    setQuestions(mine);
  };

  useEffect(() => {
    loadQuestions();
    const interval = setInterval(loadQuestions, 8000); // poll every 8s for new answers
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [questions]);

  const sendQuestion = async (text) => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    const record = await base44.entities.LocalQuestion.create({
      question_text: text,
      user_nationality: nationality,
      user_flag: flag,
      assigned_persona_id: local.id,
      persona_name: local.name,
      persona_flag: local.flag,
      persona_city: local.city,
      status: 'pending',
    });
    // Save id to localStorage so user sees their own questions
    const ids = JSON.parse(localStorage.getItem('locali_q_ids') || '[]');
    ids.push(record.id);
    localStorage.setItem('locali_q_ids', JSON.stringify(ids));
    setInput('');
    setSubmitting(false);
    await loadQuestions();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-lg">{local.flag}</div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm">{local.name}</p>
                <span className="flex items-center gap-0.5 text-[10px] font-bold bg-success/10 text-success px-1.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified Local
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{local.city} · {local.years} years in Egypt · {local.languages[0]}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 text-lg">✕</button>
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-2">
          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700">This local guide answers through the Locali platform only. No personal contact info is shared.</p>
        </div>

        {/* Intro bubble */}
        <div className="px-4 pt-4 pb-2 flex gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-sm shrink-0">{local.flag}</div>
          <div className="bg-secondary rounded-2xl px-3 py-2 text-sm max-w-[85%]">
            Hi! I'm {local.name}. I've lived in {local.city} for {local.years} years. Ask me anything about Egypt — real tips, no tourist traps. 😊
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-3">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              {/* User question */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl px-3 py-2 text-sm max-w-[80%]">
                  {q.question_text}
                </div>
              </div>
              {/* Answer or pending */}
              {q.status === 'answered' && q.answer_text ? (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-sm shrink-0">{local.flag}</div>
                  <div className="bg-secondary rounded-2xl px-3 py-2 text-sm max-w-[80%] leading-relaxed">
                    {q.answer_text}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-sm shrink-0">{local.flag}</div>
                  <div className="bg-secondary rounded-2xl px-3 py-2 text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {local.name.split(' ')[0]} will reply shortly…
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto hide-scrollbar">
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => sendQuestion(q)}
              className="shrink-0 text-[10px] bg-secondary border border-border px-2 py-1 rounded-full hover:bg-accent/10 hover:border-accent/30 transition-colors whitespace-nowrap">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendQuestion(input)}
            placeholder="Ask anything about Egypt…"
            className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm outline-none"
          />
          <button onClick={() => sendQuestion(input)}
            disabled={!input.trim() || submitting}
            className="w-9 h-9 bg-accent text-accent-foreground rounded-xl flex items-center justify-center disabled:opacity-40">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}