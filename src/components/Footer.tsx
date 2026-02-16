import { Link } from 'react-router-dom';
import { Headphones, Truck, CheckCircle, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

const benefits = [
  { icon: Headphones, title: 'Esperti al tuo fianco', desc: 'Assistenza professionale dedicata' },
  { icon: Truck, title: 'Spedizioni tracciabili', desc: 'Consegna rapida in tutta Italia' },
  { icon: CheckCircle, title: 'Prodotti selezionati', desc: 'Solo i migliori brand professionali' },
  { icon: ShieldCheck, title: 'Pagamenti sicuri', desc: 'Transazioni protette e garantite' },
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
  { label: 'Ricambi', to: '/categoria/ricambi' },
];

const utilityLinks = [
  { label: 'Guide', to: '/guide' },
  { label: 'Glossario', to: '/glossario' },
  { label: 'Area Cliente', to: '/account' },
  { label: 'Spedizioni', to: '/contatti' },
  { label: 'Resi e Garanzie', to: '/condizioni-vendita' },
];

export default function Footer() {
  return (
    <footer className="mt-16">
      {/* ── Benefits Bar ── */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="bg-[#1a2332] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Col 1: Restiamo in contatto */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold tracking-tight">BIANCHI PRO</span>
              </Link>
              <h3 className="font-bold text-base mb-4">Restiamo in contatto</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>OMNIA SRL Unipersonale<br />Via Giordano Bruno 10<br />47822 Santarcangelo di Romagna (RN)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <a href="tel:+390541123456" className="hover:text-white transition-colors">+39 0541 123 456</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <a href="mailto:info@bianchipro.it" className="hover:text-white transition-colors">info@bianchipro.it</a>
                </li>
              </ul>
            </div>

            {/* Col 2: Informazioni */}
            <div>
              <h3 className="font-bold text-base mb-4">Informazioni</h3>
              <ul className="space-y-2.5 text-sm text-gray-400">
                {infoLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: I nostri prodotti */}
            <div>
              <h3 className="font-bold text-base mb-4">I nostri prodotti</h3>
              <ul className="space-y-2.5 text-sm text-gray-400">
                {productLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Utilità */}
            <div>
              <h3 className="font-bold text-base mb-4">Utilità</h3>
              <ul className="space-y-2.5 text-sm text-gray-400">
                {utilityLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/contatti"
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors inline-block"
              >
                Contattaci
              </Link>
            </div>
          </div>
        </div>

        {/* ── Copyright + Payment Methods ── */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} OMNIA SRL Unipersonale — Tutti i diritti riservati. P.IVA IT03434940403
            </p>
            <div className="flex items-center gap-3">
              {/* Payment method icons as simple styled boxes */}
              {['Visa', 'Mastercard', 'PayPal', 'Bonifico', 'Stripe'].map((method) => (
                <span
                  key={method}
                  className="bg-[#2a3542] text-gray-400 text-[10px] font-medium px-3 py-1.5 rounded"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
