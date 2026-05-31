import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Send, RefreshCw, Clock, CheckCircle2, User, Loader2 } from 'lucide-react';

const PERSONAS = [
  { id: 'gb', flag: '🇬🇧', name: 'Sarah M.', city: 'Hurghada', nationality: 'British' },
  { id: 'ru', flag: '🇷🇺', name: 'Dmitri K.', city: 'Hurghada', nationality: 'Russian' },
  { id: 'fr', flag: '🇫🇷', name: 'Amélie D.', city: 'Luxor', nationality: 'French' },
  { id: 'de', flag: '🇩🇪', name: 'Klaus B.', city: 'El Gouna', nationality: 'German' },
  { id: 'it', flag: '🇮🇹', name: 'Marco F.', city: 'Sharm El Sheikh', nationality: 'Italian' },
  { id: 'es', flag: '🇪🇸', name: 'Carmen R.', city: 'Aswan', nationality: 'Spanish' },
  { id: 'cn', flag: '🇨🇳', name: 'Wei L.', city: 'Cairo / Hurghada', nationality: 'Chinese' },
];

function QuestionCard({ question, onAnswered }) {
  const [answer, setAnswer] = useState(question.answer_text || '');
  const [selectedPersona, setSelectedPersona] = useState(
    PERSONAS.find(p => p.id === question.assigned_persona_id) || PERSONAS[0]
  );
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!answer.trim()) return;
    setSaving(true);
    await base44.entities.LocalQuestion.update(question.id, {
      answer_text: answer,
      assigned_persona_id: selectedPersona.id,
      persona_name: selectedPersona.name,
      persona_flag: selectedPersona.flag,
      persona_city: selectedPersona.city,
      status: 'answered',
    });
    setSaving(false);
    onAnswered();
  };

  const isAnswered = question.status === 'answered';

  return (
    <div className={`bg-card border rounded-2xl p-4 ${isAnswered ? 'border-success/30 bg-success/5' : 'border-amber-300/60 bg-amber-50/40'}`}>
      {/* Question meta */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{question.user_flag}</span>
            <span className="text-[10px] font-bold text-muted-foreground">{question.user_nationality}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isAnswered ? 'bg-success/15 text-success' : 'bg-amber-100 text-amber-700'}`}>
              {isAnswered ? '✓ Answered' : '⏳ Pending'}
            </span>
          </div>
          <p className="text-sm font-semibold">"{question.question_text}"</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {new Date(question.created_date).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Persona selector */}
      <div className="mb-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Reply as persona:</p>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {PERSONAS.map(p => (
            <button key={p.id} onClick={() => setSelectedPersona(p)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                selectedPersona.id === p.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/40'
              }`}>
              <span>{p.flag}</span> {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Replying as: <strong>{selectedPersona.flag} {selectedPersona.name}</strong> · {selectedPersona.city} · {selectedPersona.nationality}
        </p>
      </div>

      {/* Answer input */}
      <textarea
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        rows={4}
        placeholder={`Write the answer as ${selectedPersona.name} would say it — casual, local tone, first person...`}
        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 mb-3"
      />

      <button onClick={submit} disabled={!answer.trim() || saving}
        className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isAnswered ? 'Update Answer' : 'Send as ' + selectedPersona.name.split(' ')[0]}
      </button>
    </div>
  );
}

export default function AdminLocalPersonas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const load = useCallback(async () => {
    setLoading(true);
    const all = await base44.entities.LocalQuestion.list('-created_date', 100);
    setQuestions(all);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Shield className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-bold">Admin Access Required</h1>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold">Go Home</button>
      </div>
    );
  }

  const filtered = filter === 'all' ? questions : questions.filter(q => q.status === filter);
  const pendingCount = questions.filter(q => q.status === 'pending').length;

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Local Persona Inbox</h1>
          <p className="text-sm text-muted-foreground">Reply to visitor questions as a local persona</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 border border-border px-3 py-2 rounded-xl text-xs font-bold hover:bg-secondary transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total', value: questions.length, icon: User, color: 'text-accent' },
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-600' },
          { label: 'Answered', value: questions.length - pendingCount, icon: CheckCircle2, color: 'text-success' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
            <p className="text-xl font-black">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['pending', 'answered', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {f} {f === 'pending' && pendingCount > 0 && <span className="ml-1 bg-amber-500 text-white rounded-full px-1.5 py-0.5 text-[9px]">{pendingCount}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No {filter} questions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(q => (
            <QuestionCard key={q.id} question={q} onAnswered={load} />
          ))}
        </div>
      )}
    </div>
  );
}