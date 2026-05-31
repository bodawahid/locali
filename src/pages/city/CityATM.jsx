import { useParams } from 'react-router-dom';
import { CITY_META, CITY_ATM } from '../../lib/cityContent';
import { useSEO, buildFAQSchema } from '../../lib/seo';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { CreditCard, CheckCircle2, XCircle, TrendingDown, AlertTriangle } from 'lucide-react';

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'Can I pay by card in Sharm El Sheikh?', a: 'Hotels, large restaurants, and diving centers accept cards. Markets, taxis, small cafés, and beach vendors are cash only. Always carry 300–500 EGP in cash at minimum.' },
    { q: 'What is the ATM withdrawal limit in Egypt?', a: 'Most ATMs in Egypt limit withdrawals to 3,000–5,000 EGP per transaction, up to 10,000 EGP per day per card. You can do multiple transactions at different ATMs.' },
    { q: 'Should I exchange money at Sharm El Sheikh airport?', a: 'Rates are worse at the airport but the difference is small. Get 300–500 EGP at the airport for immediate needs (taxi, food), then use bank ATMs in town for the rest.' },
    { q: 'Is it safe to use ATMs in Sharm El Sheikh?', a: 'Yes, especially ATMs inside bank branches and hotels. Avoid standalone ATMs in isolated locations. Shield your PIN. Card skimming is uncommon but not unknown.' },
  ],
  hurghada: [
    { q: 'Where are the best ATMs in Hurghada?', a: 'Banque Misr and CIB ATMs in the Marina and Sahl Hasheesh are the most reliable. Avoid standalone ATMs without a bank branch nearby and airport kiosks.' },
    { q: 'Should I exchange money at Hurghada airport?', a: 'Only for emergency cash. Airport rates are 5–10% worse than bank rates in the city. Use a bank ATM for main withdrawals.' },
    { q: 'Can I use Revolut or N26 cards in Hurghada?', a: 'Yes. Revolut and N26 both work at Egyptian ATMs. You\'ll still pay local ATM fees (usually 10–20 EGP per transaction). These cards have better base exchange rates.' },
    { q: 'Do all-inclusive hotels accept cards in Hurghada?', a: 'The hotel bill is almost always card-friendly. But internal shops, tours, tips, and excursions booked through the hotel may require cash. Carry 200–400 EGP daily.' },
  ],
  luxor: [
    { q: 'Are there ATMs on the West Bank in Luxor?', a: 'No reliable ATMs exist near the temples on the West Bank. Withdraw all necessary cash from ATMs on the East Bank Corniche before taking the ferry.' },
    { q: 'What currency should I use in Luxor?', a: 'Always pay in Egyptian Pounds (EGP). Vendors accepting USD use unfavorable rates. Temple tickets are set in EGP. The Luxor Pass is the only thing priced in USD officially.' },
    { q: 'How much cash should I carry in Luxor per day?', a: 'A typical sightseeing day costs 600–1,200 EGP (temple entry + guide + transport + food + tips). Carry at least 1,500 EGP to be comfortable, especially on West Bank days.' },
    { q: 'Is tipping expected in Luxor?', a: 'Yes. Tipping is important in Luxor — guides, drivers, temple guards showing you "extra" features, toilet attendants. Budget 50–100 EGP per day in small bills (5, 10, 20 EGP).' },
  ],
  aswan: [
    { q: 'Are there ATMs in Abu Simbel?', a: 'No. There are no ATMs at Abu Simbel. Bring all cash for the day — entry tickets (360 EGP), food, and any souvenirs — before you leave Aswan.' },
    { q: 'Can I use my card in Aswan?', a: 'Hotels generally accept cards. Feluccas, markets, temples, restaurants, and the Nile ferry are all cash only. Withdraw enough on the Corniche before heading anywhere.' },
    { q: 'How much does a day cost in Aswan?', a: 'Aswan is cheaper than Luxor. A comfortable day: 500–800 EGP (Philae ticket + boat + lunch + felucca + transport). Budget travelers manage on 300–400 EGP/day.' },
    { q: 'Is there a currency exchange in Aswan?', a: 'Yes, on the Corniche. Rates are similar to ATM rates. Always count your money before leaving the exchange desk — counting errors are common.' },
  ],
};

const HOW_MUCH_TO_CARRY = {
  'sharm-el-sheikh': { daily: '400–700 EGP', emergencyBuffer: '1,000 EGP', tipping: '100–200 EGP' },
  hurghada: { daily: '300–600 EGP', emergencyBuffer: '800 EGP', tipping: '80–150 EGP' },
  luxor: { daily: '600–1,200 EGP', emergencyBuffer: '1,500 EGP', tipping: '100–200 EGP' },
  aswan: { daily: '300–600 EGP', emergencyBuffer: '800 EGP', tipping: '60–100 EGP' },
};

export default function CityATM() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const atmData = CITY_ATM[cityId];
  const faqs = FAQS[cityId] || [];
  const cashGuide = HOW_MUCH_TO_CARRY[cityId];

  useSEO({
    title: meta ? `ATMs & Currency in ${meta.name} 2025 — Where to Get Cash, Best Exchange Rates` : 'Egypt ATM Guide',
    description: meta ? `Complete ATM and currency guide for ${meta.name}. Best ATMs, exchange rates, how much cash to carry, money scams to avoid. Practical 2025 advice.` : '',
    jsonLd: faqs.length ? buildFAQSchema(faqs) : undefined,
  });

  if (!meta || !atmData) return <div className="p-4">City not found</div>;

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          ATMs &amp; Currency in {meta.name} — 2025 Complete Guide
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          {atmData.intro} Cash is essential in {meta.name}. This guide tells you where to get it, what it costs, and how to avoid losing money in exchange scams.
        </p>

        {/* Exchange Rate */}
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-accent" />
            <span className="font-bold text-sm">Current Approximate Rate</span>
          </div>
          <p className="text-2xl font-extrabold text-accent">{atmData.rate}</p>
          <p className="text-xs text-muted-foreground mt-1">Check <a href="https://www.xe.com" target="_blank" rel="noopener noreferrer" className="underline">xe.com</a> for the live rate before you travel. Rates in Egypt can fluctuate significantly.</p>
        </div>

        {/* How much cash section */}
        {cashGuide && (
          <>
            <h2 className="text-xl font-extrabold mb-4">How Much Cash to Carry in {meta.name}</h2>
            <div className="grid grid-cols-3 gap-3 mb-10">
              <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
                <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold">Daily Budget</p>
                <p className="font-extrabold text-accent text-sm">{cashGuide.daily}</p>
                <p className="text-[10px] text-muted-foreground mt-1">EGP</p>
              </div>
              <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
                <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold">Emergency</p>
                <p className="font-extrabold text-accent text-sm">{cashGuide.emergencyBuffer}</p>
                <p className="text-[10px] text-muted-foreground mt-1">EGP reserve</p>
              </div>
              <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
                <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold">Tips/Day</p>
                <p className="font-extrabold text-accent text-sm">{cashGuide.tipping}</p>
                <p className="text-[10px] text-muted-foreground mt-1">EGP</p>
              </div>
            </div>
          </>
        )}

        {/* Money tips */}
        <h2 className="text-xl font-extrabold mb-4">Money Tips for {meta.name}</h2>
        <div className="space-y-2 mb-10">
          {atmData.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-card rounded-2xl border border-border/50 p-4">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>

        {/* Best/worst ATMs */}
        <h2 className="text-xl font-extrabold mb-4">Best ATMs in {meta.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-success/5 border border-success/20 rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Use These ATMs
            </h3>
            <ul className="space-y-2">
              {atmData.bestATMs.map((atm, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                  {atm}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Avoid / Be Cautious
            </h3>
            <ul className="space-y-2">
              {atmData.avoidList.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Exchange rate warning */}
        <h2 className="text-xl font-extrabold mb-4">Currency Exchange — Do This, Not That</h2>
        <div className="space-y-3 mb-10">
          {[
            { type: 'do', text: 'Use bank ATMs inside branch premises. Banque Misr, CIB, and NBE are reliable nationwide.' },
            { type: 'do', text: 'Exchange at official banks or hotel exchange desks. Rates are regulated and reliable.' },
            { type: 'do', text: 'Count every note you receive at the exchange window before stepping away.' },
            { type: 'dont', text: 'Exchange money with street touts or unofficial "money changers." Always illegal, often counterfeit.' },
            { type: 'dont', text: 'Use standalone ATMs with no bank branding — risk of skimming devices.' },
            { type: 'dont', text: 'Accept large denomination EGP notes without checking — counterfeit 200 and 100 EGP notes exist.' },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-2xl border p-4 ${item.type === 'do' ? 'bg-success/5 border-success/20' : 'bg-red-500/5 border-red-500/20'}`}>
              {item.type === 'do'
                ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              }
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8 space-y-3">
          <SafeNextStep
            title={`Real Prices in ${meta.name}`}
            description="Know exactly how much cash you'll need for each expense"
            to={`/city/${cityId}/prices`}
          />
          <SafeNextStep
            title="Egypt Cost Calculator"
            description="Plan your full trip budget in advance"
            to="/cost-calculator"
          />
        </div>
      </div>
    </div>
  );
}