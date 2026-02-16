/**
 * GuidePage.tsx — Pagina singola guida professionale
 *
 * Carica la guida in base allo slug presente nell'URL (useParams),
 * mostra il contenuto completo con breadcrumb, metadati (autore, data,
 * tempo di lettura), categorie correlate e una sezione di guide
 * suggerite in fondo alla pagina.
 *
 * Rotta: /guide/:slug
 * Dati: importati da src/data/guides.ts (getGuideBySlug, guides)
 */

import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Clock, ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import { getGuideBySlug, guides } from '../data/guides';

export default function GuidePage() {
  /* ── Recupera lo slug dall'URL ───────────────────────────────────── */
  const { slug } = useParams<{ slug: string }>();

  /* ── Cerca la guida corrispondente ───────────────────────────────── */
  const guide = slug ? getGuideBySlug(slug) : undefined;

  /* ── Stato: guida non trovata ────────────────────────────────────── */
  if (!guide) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 mb-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Guida non trovata
        </h1>
        <p className="text-gray-600 mb-8">
          La guida che stai cercando non esiste o e stata rimossa.
          Controlla l&apos;URL oppure torna alla lista completa.
        </p>
        <Link
          to="/guide"
          className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="w-4 h-4" /> Torna alle guide
        </Link>
      </main>
    );
  }

  /* ── Guide correlate (max 3, escludendo la guida corrente) ───────── */
  const relatedGuides = guides
    .filter((g) => g.slug !== guide.slug)
    .slice(0, 3);

  /* ── Formatta la data di pubblicazione in italiano ───────────────── */
  const formattedDate = new Date(guide.publishedAt).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 mb-20">

      {/* ── Breadcrumb di navigazione ──────────────────────────────── */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <Link to="/guide" className="text-gray-600 hover:text-green-600">Guide</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium line-clamp-1">{guide.title}</span>
      </nav>

      {/* ── Articolo principale ────────────────────────────────────── */}
      <article className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">

        {/* Badge categoria */}
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 mb-4">
          {guide.category}
        </span>

        {/* Titolo della guida */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
          {guide.title}
        </h1>

        {/* Metadati: autore, data, tempo di lettura */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
          <span className="inline-flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {guide.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {guide.readTime} min di lettura
          </span>
        </div>

        {/* Contenuto completo della guida (whitespace-pre-line per i paragrafi) */}
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">
          {guide.content}
        </div>

        {/* ── Categorie correlate (link al catalogo) ─────────────── */}
        {guide.relatedCategories.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-600" />
              Categorie correlate
            </h3>
            <div className="flex flex-wrap gap-2">
              {guide.relatedCategories.map((catSlug) => (
                <Link
                  key={catSlug}
                  to={`/categoria/${catSlug}`}
                  className="inline-block px-3 py-1.5 rounded-lg text-sm bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors border border-gray-200"
                >
                  {/* Mostra lo slug in formato leggibile */}
                  {catSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* ── Link per tornare alla lista ────────────────────────────── */}
      <Link
        to="/guide"
        className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600"
      >
        <ArrowLeft className="w-4 h-4" /> Torna alle guide
      </Link>

      {/* ── Sezione "Guide correlate" (max 3 guide suggerite) ──────── */}
      {relatedGuides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Guide correlate
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedGuides.map((rg) => (
              <Link
                key={rg.slug}
                to={`/guide/${rg.slug}`}
                className="group bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-green-300 transition-all"
              >
                {/* Badge categoria */}
                <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                  {rg.category}
                </span>

                {/* Titolo */}
                <h3 className="mt-1.5 text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
                  {rg.title}
                </h3>

                {/* Estratto breve */}
                <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
                  {rg.excerpt}
                </p>

                {/* Tempo di lettura */}
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {rg.readTime} min
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
