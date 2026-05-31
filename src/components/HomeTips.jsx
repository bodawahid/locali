import { Link } from 'react-router-dom';
import { AlertTriangle, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react';

const TIPS = [
  {
    icon: AlertTriangle,
    title: 'Common Scams',
    desc: 'Know the tricks before they happen. Real reports from real tourists.',
    path: '/scam-map',
    color: 'bg-red-500/10 text-red-500',
  },
  {
    icon: DollarSign,
    title: 'Real Prices',
    desc: 'Stop overpaying. Know what locals actually pay.',
    path: '/price-checker',
    color: 'bg-accent/10 text-accent',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Services',
    desc: 'Trusted providers vetted by the community.',
    path: '/services',
    color: 'bg-emerald-500/10 text-emerald-600',
  },
];

export default function HomeTips() {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-extrabold tracking-tight">Stay Sharp</h2>
      {TIPS.map((tip) => {
        const Icon = tip.icon;
        return (
          <Link
            key={tip.path}
            to={tip.path}
            className="group flex items-center gap-4 bg-card rounded-2xl border border-border/50 p-4 hover:shadow-lg transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl ${tip.color} flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">{tip.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{tip.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        );
      })}
    </div>
  );
}