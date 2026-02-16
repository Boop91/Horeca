import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-8xl font-extrabold text-gray-200 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Pagina non trovata</h1>
      <p className="text-gray-600 mb-8">
        La pagina che stai cercando non esiste o è stata spostata.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Torna alla Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna indietro
        </button>
      </div>
    </main>
  );
}
