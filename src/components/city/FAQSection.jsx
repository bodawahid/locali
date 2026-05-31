import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQSection({ faqs, city }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-accent" />
        <h2 id="faq-heading" className="text-xl font-extrabold tracking-tight">
          Frequently Asked Questions — {city}
        </h2>
      </div>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              aria-expanded={openIdx === i}
            >
              <span className="font-semibold text-sm pr-4">{faq.q}</span>
              {openIdx === i
                ? <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              }
            </button>
            {openIdx === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}