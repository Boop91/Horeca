import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { businessTypes } from '../data/businessTypes';

export default function BusinessTypePage() {
  const { mestiere } = useParams();
  const businessType = businessTypes.find(bt => bt.slug === mestiere);

  if (!businessType) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Attività non trovata</h1>
        <p className="text-gray-600 mb-6">La tipologia di attività richiesta non esiste.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
          Torna alla Home
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">{businessType.name}</span>
      </nav>

      {/* Hero */}
      <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{businessType.name}</h1>
        <p className="text-lg text-gray-600 max-w-3xl">{businessType.longDescription}</p>
      </section>

      {/* Essential Equipment */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Attrezzature Essenziali</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businessType.essentialEquipment.map((equip) => (
            <div key={equip} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                <span className="text-green-600 text-xl font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900">{equip}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorie Correlate</h2>
        <div className="flex flex-wrap gap-3">
          {businessType.essentialCategories.map((catSlug) => (
            <Link
              key={catSlug}
              to={`/categoria/${catSlug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
            >
              {catSlug.replace(/-/g, ' ')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* Guide CTA */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-3">{businessType.guideTitle}</h2>
        <p className="text-green-100 mb-6">Scopri la nostra guida completa per attrezzare al meglio la tua attività.</p>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors">
          Leggi la guida
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </main>
  );
}
