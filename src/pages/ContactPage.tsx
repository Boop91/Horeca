/**
 * ContactPage.tsx — Pagina "Contattaci"
 *
 * Mostra tutte le informazioni di contatto reali di BianchiPro:
 * - Telefono, WhatsApp, email, sede fisica, orari
 * - Form di contatto con selezione dell'oggetto (preventivo, assistenza, ecc.)
 * - Dati aziendali (ragione sociale, P.IVA)
 * - Informazione sul ritiro in sede
 *
 * Dati reali estratti da bianchipro.it:
 * Sede: Via Giordano Bruno 10, 47822 Santarcangelo di Romagna (RN)
 * Tel: +39 0541 620526 | Email: clienti@bianchipro.it
 *
 * Rotta: /contatti
 */
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mb-20">
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">Contatti</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Contattaci</h1>
      <p className="text-lg text-gray-600 mb-8">
        Siamo a tua disposizione per consulenze, preventivi personalizzati e assistenza post-vendita.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Phone, title: 'Telefono', content: '+39 0541 620526', desc: 'Lun-Ven 8:30-18:00, Sab 9:00-13:00' },
            { icon: MessageCircle, title: 'WhatsApp', content: '+39 0541 620526', desc: 'Scrivici su WhatsApp per risposte rapide' },
            { icon: Mail, title: 'Email', content: 'clienti@bianchipro.it', desc: 'Rispondiamo entro 24 ore lavorative' },
            { icon: MapPin, title: 'Sede e Punto Vendita', content: 'Via Giordano Bruno 10', desc: '47822 Santarcangelo di Romagna (Rimini)' },
            { icon: Clock, title: 'Orari', content: 'Lun-Ven 8:30-18:00', desc: 'Sabato 9:00-13:00 — Ritiro merce disponibile' },
          ].map(({ icon: Icon, title, content, desc }) => (
            <div key={title} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="text-gray-700">{content}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}

          <div className="bg-green-50 rounded-xl border border-green-200 p-5 mt-4">
            <h3 className="font-bold text-green-900 mb-2">Ritiro in sede</h3>
            <p className="text-sm text-green-700">
              Puoi ritirare personalmente la maggior parte dei prodotti presso il nostro punto vendita
              a Santarcangelo di Romagna. Versando un acconto anticipato come prenotazione,
              potrai effettuare il saldo al momento del ritiro.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Inviaci un messaggio</h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome e Cognome</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Azienda</label>
                  <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input type="tel" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oggetto</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="">Seleziona...</option>
                  <option value="preventivo">Richiesta preventivo</option>
                  <option value="info-prodotto">Informazioni prodotto</option>
                  <option value="assistenza">Assistenza post-vendita</option>
                  <option value="ricambi">Richiesta ricambi</option>
                  <option value="spedizione">Informazioni spedizione</option>
                  <option value="altro">Altro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Messaggio</label>
                <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              </div>
              <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
                Invia messaggio
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-2">Dati aziendali</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-700">Ragione Sociale:</span> OMNIA SRL Unipersonale</p>
              <p><span className="font-medium text-gray-700">P.IVA:</span> IT03434940403</p>
              <p><span className="font-medium text-gray-700">Sede:</span> Via Giordano Bruno 10, 47822 Santarcangelo di Romagna (RN)</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
