import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function SafeNextStep({ title, description, to }) {
  return (
    <Link
      to={to}
      className="group block bg-success/5 border border-success/20 rounded-2xl p-5 hover:bg-success/10 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-success shrink-0 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}