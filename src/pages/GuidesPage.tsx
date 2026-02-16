/**
 * GuidesPage.tsx — Pagina lista guide professionali
 *
 * Mostra tutte le guide disponibili in una griglia responsive con
 * filtro per categoria. Ogni scheda (card) include immagine placeholder,
 * badge categoria, titolo, estratto, tempo di lettura e link alla guida.
 *
 * Rotta: /guide
 * Dati: importati da src/data/guides.ts
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, ChevronRight, Clock } from 'lucide-react';
import { guides } from '../data/guides';

/* ── Categorie disponibili per il filtro ───────────────────────────── */
const TUTTE = 'Tutte';
const categories = [TUTTE, "Guida all'acquisto", 'Guida operativa', 'Manutenzione'];

export default function GuidesPage() {
  /* Stato del filtro categoria attivo */
  const [activeCategory, setActiveCategory] = useState(TUTTE);

  /* Guide filtrate in base alla categoria selezionata */
  const filteredGuides =
    activeCategory === TUTTE
      ? guides
      : guides.filter((g) => g.category === activeCategory);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mb-20">

      {/* ── Breadcrumb di navigazione ──────────────────────────────── */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">Guide</span>
      </nav>

      {/* ── Intestazione della pagina ──────────────────────────────── */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Le Guide di BianchiPro
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Approfondimenti, consigli e guide tecniche per scegliere le
          attrezzature giuste per la tua attivita Ho.Re.Ca.
        </p>
      </div>

      {/* ── Filtro per categoria (pill / badge cliccabili) ─────────── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Griglia delle guide (1 col mobile, 2 tablet, 3 desktop) ── */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guide/${guide.slug}`}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-green-300 transition-all flex flex-col"
          >
            {/* Placeholder immagine copertina */}
            <div className="h-44 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-green-300" />
            </div>

            {/* Corpo della card */}
            <div className="p-6 flex flex-col flex-1">
              {/* Badge categoria */}
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                {guide.category}
              </span>

              {/* Titolo */}
              <h2 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                {guide.title}
              </h2>

              {/* Estratto */}
              <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">
                {guide.excerpt}
              </p>

              {/* Footer: tempo di lettura + link */}
              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  {guide.readTime} min di lettura
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
                  Leggi la guida <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Messaggio se nessuna guida corrisponde al filtro ────────── */}
      {filteredGuides.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          Nessuna guida disponibile per questa categoria.
        </p>
      )}
    </main>
  );
}
