import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1a2332] text-white mt-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Logo and Description */}
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center space-x-2 mb-3 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold tracking-tight">BIANCHI PRO</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Attrezzature professionali per la ristorazione<br />e l'hotellerie dagli anni '60.
            </p>
            <Link to="/contatti" className="bg-[#2a3542] hover:bg-[#364252] text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors inline-block">
              Contattaci
            </Link>
          </div>

          {/* Azienda */}
          <div className="md:col-span-2">
            <h3 className="font-bold mb-4 text-base">Azienda</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/chi-siamo" className="hover:text-white transition-colors">Chi Siamo</Link></li>
              <li><Link to="/contatti" className="hover:text-white transition-colors">Contatti</Link></li>
              <li><Link to="/guide" className="hover:text-white transition-colors">Guide</Link></li>
              <li><Link to="/glossario" className="hover:text-white transition-colors">Glossario</Link></li>
            </ul>
          </div>

          {/* Supporto */}
          <div className="md:col-span-2">
            <h3 className="font-bold mb-4 text-base">Supporto</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contatti" className="hover:text-white transition-colors">Spedizioni</Link></li>
              <li><Link to="/condizioni-vendita" className="hover:text-white transition-colors">Resi e Garanzie</Link></li>
              <li><Link to="/categoria/ricambi" className="hover:text-white transition-colors">Ricambi</Link></li>
            </ul>
          </div>

          {/* Legale */}
          <div className="md:col-span-2">
            <h3 className="font-bold mb-4 text-base">Legale</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/condizioni-vendita" className="hover:text-white transition-colors">Condizioni di Vendita</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Area Account */}
          <div className="md:col-span-2 flex justify-start md:justify-end items-start">
            <Link to="/account" className="bg-[#2a3542] hover:bg-[#364252] text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors inline-block">
              Area Cliente
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6">
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} OMNIA SRL Unipersonale — Tutti i diritti riservati. P.IVA IT03434940403 — Via Giordano Bruno 10, 47822 Santarcangelo di Romagna (RN)
          </p>
        </div>
      </div>
    </footer>
  );
}
