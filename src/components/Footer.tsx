import { Link } from 'react-router-dom';
import { Headphones, Truck, CheckCircle, ShieldCheck, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

/* ── Dati statici ── */
const benefits = [
  { icon: Headphones, title: 'Esperti al tuo fianco' },
  { icon: Truck, title: 'Spedizioni tracciabili' },
  { icon: CheckCircle, title: 'Prodotti selezionati' },
  { icon: ShieldCheck, title: 'Pagamenti sicuri' },
];

const infoLinks = [
  { label: 'Chi Siamo', to: '/chi-siamo' },
  { label: 'Contatti', to: '/contatti' },
  { label: 'Condizioni di Vendita', to: '/condizioni-vendita' },
  { label: 'Privacy Policy', to: '#' },
  { label: 'Cookie Policy', to: '#' },
  { label: 'FAQ', to: '/faq' },
];

const productLinks = [
  { label: 'Linea Caldo', to: '/categoria/linea-caldo' },
  { label: 'Linea Freddo', to: '/categoria/linea-freddo' },
  { label: 'Preparazione', to: '/categoria/preparazione' },
  { label: 'Carrelli ed Arredo', to: '/categoria/carrelli-arredo' },
  { label: 'Hotellerie', to: '/categoria/hotellerie' },
  { label: 'Igiene e Pulizia', to: '/categoria/igiene' },
];

const utilityLinks = [
  { label: 'Guide', to: '/guide' },
  { label: 'Glossario', to: '/glossario' },
  { label: 'Area Cliente', to: '/account' },
  { label: 'Spedizioni', to: '/contatti' },
  { label: 'Resi e Garanzie', to: '/condizioni-vendita' },
  { label: 'Blog', to: '/guide' },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a2332] text-white mt-16">
      {/* ── Riga 1: Benefits orizzontale compatta ── */}
      <div className="border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {benefits.map((b) => (
              <div key={b.title} className="flex items-center gap-2 flex-shrink-0">
                <b.icon className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold text-gray-300 whitespace-nowrap">{b.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Riga 2: Colonne link + contatti — layout orizzontale 5 colonne ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Col 1: Contatti */}
          <div>
            <Link to="/" className="inline-block mb-3 hover:opacity-80 transition-opacity">
              <span className="text-lg font-bold tracking-tight">BIANCHI</span>
            </Link>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-green-600 flex-shrink-0" />
                <span className="text-xs leading-relaxed">OMNIA SRL Unipersonale<br />Via Giordano Bruno 10<br />47822 Santarcangelo di R. (RN)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <a href="tel:+390541123456" className="text-xs hover:text-white transition-colors">+39 0541 123 456</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <a href="mailto:info@bianchipro.it" className="text-xs hover:text-white transition-colors">info@bianchipro.it</a>
              </li>
            </ul>
          </div>

          {/* Col 2: Informazioni */}
          <div>
            <h4 className="font-bold text-sm mb-3">Informazioni</h4>
            <ul className="space-y-1.5">
              {infoLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Prodotti */}
          <div>
            <h4 className="font-bold text-sm mb-3">I nostri prodotti</h4>
            <ul className="space-y-1.5">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Utilità */}
          <div>
            <h4 className="font-bold text-sm mb-3">Utilità</h4>
            <ul className="space-y-1.5">
              {utilityLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-xs text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Social + Contattaci */}
          <div>
            <h4 className="font-bold text-sm mb-3">Seguici</h4>
            <div className="flex gap-2 mb-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:border-green-600 hover:text-white transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <Link
              to="/contatti"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-xs font-bold transition-colors inline-block"
            >
              Contattaci
            </Link>
          </div>
        </div>
      </div>

      {/* ── Riga 3: Copyright + pagamenti — una riga compatta ── */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500">
            © {new Date().getFullYear()} OMNIA SRL Unipersonale — P.IVA IT03434940403 — Tutti i diritti riservati
          </p>
          <div className="flex items-center gap-2">
            {['Visa', 'Mastercard', 'PayPal', 'Bonifico', 'Stripe'].map((method) => (
              <span
                key={method}
                className="bg-[#2a3542] text-gray-500 text-[10px] font-medium px-2.5 py-1 rounded"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
