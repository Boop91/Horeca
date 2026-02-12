import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { CatalogMenuItem } from '../data/catalogMenu';
import heroImage from '../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';

interface CategoryPageProps {
  category: CatalogMenuItem;
  onOpenProduct: () => void;
}

export default function CategoryPage({ category, onOpenProduct }: CategoryPageProps) {
  const sections = useMemo(() => category.groups.flatMap((group) => group.sections), [category]);
  const [selectedSection, setSelectedSection] = useState(sections[0]?.title || '');
  const currentSection = sections.find((section) => section.title === selectedSection) || sections[0];

  const products = (currentSection?.items || []).map((item, index) => ({
    id: `${category.key}-${index}`,
    title: item,
    price: 790 + index * 120,
    isForno: item.toLowerCase().includes('forni') || item.toLowerCase().includes('fornetti') || item.toLowerCase().includes('microonde'),
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-5 flex items-center gap-2 text-sm text-slate-600">
        <span>Home</span>
        <ChevronRight className="h-4 w-4" />
        <span className="font-semibold text-slate-900">{category.label}</span>
      </nav>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">{category.label}</h1>
        <p className="mt-1 text-sm text-slate-600">Seleziona la sotto-categoria e poi il livello successivo per visualizzare la griglia prodotti.</p>

        <div className="mt-6 grid gap-4 lg:grid-cols-[280px,1fr]">
          <aside className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Prima sotto-categoria</p>
            {sections.map((section) => (
              <button
                key={section.title}
                type="button"
                onClick={() => setSelectedSection(section.title)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                  selectedSection === section.title
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {section.title}
              </button>
            ))}
          </aside>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Seconda sotto-categoria</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentSection?.items.map((item) => (
                <span key={item} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {item}
                </span>
              ))}
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">Griglia prodotti</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img src={heroImage} alt={product.title} className="h-36 w-full object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-semibold text-emerald-700">{currentSection?.title}</p>
                    <h3 className="mt-1 min-h-10 text-sm font-bold text-slate-800">{product.title}</h3>
                    <p className="mt-1 text-lg font-extrabold text-slate-900">€ {product.price.toFixed(2)}</p>
                    <button
                      type="button"
                      onClick={onOpenProduct}
                      className="mt-2 w-full rounded-xl bg-slate-900 py-2 text-sm font-bold text-white hover:bg-slate-800"
                    >
                      {product.isForno ? 'Apri forno' : 'Apri prodotto'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
