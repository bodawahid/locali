import { useOutletContext } from 'react-router-dom';
import { Shield } from 'lucide-react';

const CONTENT = {
  en: {
    title: 'Terms & Conditions',
    subtitle: 'Last updated: April 2026',
    sections: [
      {
        heading: '1. About Locali Egypt',
        body: 'Locali Egypt ("we", "us", "our") is an independent multilingual travel guide platform for tourists and long-stay visitors in Egypt. We provide information, price guides, scam alerts, and service directories. We are not a travel agency or booking platform — we facilitate connections between users and local services.',
      },
      {
        heading: '2. Information Accuracy',
        body: 'All prices, hours, and service details are provided in good faith and updated regularly. However, we cannot guarantee 100% accuracy at all times. Prices in Egypt (EGP) can change rapidly due to currency fluctuations. Always verify prices directly with service providers before committing.',
      },
      {
        heading: '3. Booking & Commission',
        body: 'When you book a service through Locali Egypt (via our WhatsApp links or referral codes), a 7% commission may be applied. This is included in the price shown. Our tracking codes (LOC-XXX-XXXX) help us track referrals and ensure quality control. Commission revenue allows us to keep this platform free for all users.',
      },
      {
        heading: '4. Verified Badges',
        body: 'Services marked as "Verified" have been reviewed by our team or community. Verification does not constitute a guarantee of service quality. Locali Egypt accepts no liability for disputes between users and service providers.',
      },
      {
        heading: '5. User Content',
        body: 'Reviews, scam reports, and stories submitted by users are moderated. By submitting content, you grant Locali Egypt a non-exclusive license to display and use your content on the platform. We reserve the right to remove content that is false, harmful, or violates community guidelines.',
      },
      {
        heading: '6. Safety Information',
        body: 'All safety guides, emergency contacts, and travel advisories are provided for informational purposes only. Always check your government\'s official travel advisory before traveling. In a genuine emergency, contact local authorities (Tourist Police: 126, Ambulance: 123).',
      },
      {
        heading: '7. Privacy',
        body: 'We do not sell your personal data. We use anonymous analytics to improve the platform. Contact form submissions and WhatsApp interactions are handled by the respective service providers.',
      },
      {
        heading: '8. Intellectual Property',
        body: '© 2026 Locali Egypt – All rights reserved. All content, design, and data on this platform is the intellectual property of Locali Egypt. Reproduction or redistribution without written permission is prohibited.',
      },
      {
        heading: '9. Limitation of Liability',
        body: 'Locali Egypt shall not be liable for any direct, indirect, or consequential damages arising from the use of this platform, including but not limited to financial loss, personal injury, or travel disruptions.',
      },
      {
        heading: '10. Contact',
        body: 'For questions, partnership inquiries, or verified badge requests, contact us via the AI Assistant or through the Emergency page. For verified badge listings ($6/service), use the Verify & Apply page.',
      },
    ],
  },
  fr: {
    title: "Conditions Générales d'Utilisation",
    subtitle: 'Dernière mise à jour : Avril 2026',
    sections: [
      { heading: '1. À propos de Locali Egypt', body: 'Locali Egypt est un guide de voyage multilingue indépendant pour les touristes et résidents en Égypte. Nous fournissons des informations, guides de prix, alertes arnaques et annuaires de services. Nous ne sommes pas une agence de voyage.' },
      { heading: '2. Exactitude des informations', body: 'Toutes les informations sont fournies de bonne foi et mises à jour régulièrement. Vérifiez toujours les prix directement auprès des prestataires.' },
      { heading: '3. Réservation & Commission', body: 'Une commission de 7% peut être appliquée lors de réservations via nos liens WhatsApp. Nos codes de suivi (LOC-XXX-XXXX) permettent de tracer les recommandations.' },
      { heading: '4. Badges Vérifiés', body: 'Les services marqués "Vérifié" ont été examinés par notre équipe. La vérification ne constitue pas une garantie de qualité.' },
      { heading: '5. Contenu Utilisateur', body: "Les avis et signalements d'arnaques sont mod\u00e9r\u00e9s. En soumettant du contenu, vous accordez \u00e0 Locali Egypt une licence non exclusive pour l'afficher." },
      { heading: '6. Propriété Intellectuelle', body: '© 2026 Locali Egypt – Tous droits réservés. Toute reproduction sans autorisation écrite est interdite.' },
    ],
  },
  ru: {
    title: 'Условия использования',
    subtitle: 'Последнее обновление: апрель 2026',
    sections: [
      { heading: '1. О Locali Egypt', body: 'Locali Egypt — независимый многоязычный туристический гид для туристов и долгосрочных жителей в Египте. Мы предоставляем информацию, ценовые справочники и предупреждения о мошенничестве.' },
      { heading: '2. Точность информации', body: 'Вся информация предоставляется добросовестно и регулярно обновляется. Всегда уточняйте цены напрямую у поставщиков услуг.' },
      { heading: '3. Бронирование и комиссия', body: 'При бронировании через наши ссылки WhatsApp может взиматься комиссия 7%. Наши коды отслеживания (LOC-XXX-XXXX) помогают контролировать качество.' },
      { heading: '4. Знак верификации', body: 'Услуги с отметкой «Проверено» прошли проверку нашей командой. Это не гарантия качества обслуживания.' },
      { heading: '5. Интеллектуальная собственность', body: '© 2026 Locali Egypt – Все права защищены. Воспроизведение без письменного разрешения запрещено.' },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen',
    subtitle: 'Zuletzt aktualisiert: April 2026',
    sections: [
      { heading: '1. Über Locali Egypt', body: 'Locali Egypt ist ein unabhängiger mehrsprachiger Reiseführer für Touristen und Langzeitbesucher in Ägypten. Wir bieten Informationen, Preisführer und Betrugs-Warnungen.' },
      { heading: '2. Genauigkeit der Informationen', body: 'Alle Informationen werden nach bestem Wissen bereitgestellt und regelmäßig aktualisiert. Bitte überprüfen Sie Preise direkt beim Anbieter.' },
      { heading: '3. Buchung & Provision', body: 'Bei Buchungen über unsere WhatsApp-Links kann eine Provision von 7% anfallen. Unsere Tracking-Codes (LOC-XXX-XXXX) helfen uns bei der Qualitätskontrolle.' },
      { heading: '4. Verifiziertes Abzeichen', body: 'Als "Verifiziert" markierte Dienste wurden von unserem Team geprüft. Dies stellt keine Qualitätsgarantie dar.' },
      { heading: '5. Geistiges Eigentum', body: '© 2026 Locali Egypt – Alle Rechte vorbehalten. Reproduktion ohne schriftliche Genehmigung ist verboten.' },
    ],
  },
};

export default function Terms() {
  const { lang } = useOutletContext();
  const content = CONTENT[lang] || CONTENT.en;

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{content.title}</h1>
          <p className="text-xs text-muted-foreground">{content.subtitle}</p>
        </div>
      </div>

      <div className="space-y-6">
        {content.sections.map((section, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
            <h2 className="font-extrabold text-sm mb-2">{section.heading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
        <p className="font-extrabold text-sm">© 2026 Locali Egypt</p>
        <p className="text-xs text-muted-foreground mt-1">All rights reserved · Tous droits réservés · Все права защищены · Alle Rechte vorbehalten</p>
      </div>
    </div>
  );
}