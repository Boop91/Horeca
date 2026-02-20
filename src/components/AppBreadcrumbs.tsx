import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { catalogMenu } from '../data/catalogMenu';
import { businessTypes } from '../data/businessTypes';
import { useStoreBlogArticles, useStoreProducts } from '../lib/storefrontStore';
import { formatCatalogLabel, resolveCatalogTrail } from '../utils/catalogRouting';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

const staticPages: Record<string, string> = {
  'chi-siamo': 'Chi siamo',
  contatti: 'Contatti',
  faq: 'FAQ',
  glossario: 'Glossario',
  'condizioni-vendita': 'Condizioni di vendita',
  carrello: 'Carrello',
  checkout: 'Checkout',
  wallet: 'Wallet',
};

const accountPages: Record<string, string> = {
  profilo: 'Profilo',
  indirizzi: 'Indirizzi',
  ordini: 'Ordini',
  fatture: 'Fatture',
  pagamenti: 'Pagamenti',
  preventivi: 'Preventivi',
  preferiti: 'Preferiti',
  assistenza: 'Assistenza',
};

const adminPages: Record<string, string> = {
  prodotti: 'Prodotti',
  blog: 'Blog',
  home: 'Home',
  ordini: 'Ordini',
  clienti: 'Clienti',
  impostazioni: 'Impostazioni',
};

function buildCategoryBreadcrumbs(parts: string[]): BreadcrumbItem[] {
  const categorySlug = parts[1];
  if (!categorySlug) {
    return [{ label: 'Catalogo' }];
  }

  const category = catalogMenu.find(
    (item) =>
      item.key.toLowerCase() === categorySlug.toLowerCase() ||
      item.slug.toLowerCase() === categorySlug.toLowerCase(),
  );

  if (!category) {
    return [{ label: formatCatalogLabel(categorySlug) }];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: category.label, to: `/categoria/${category.key}` },
  ];

  const groupSlug = parts[2];
  if (!groupSlug) return breadcrumbs;

  const group = category.groups.find((item) => item.slug.toLowerCase() === groupSlug.toLowerCase());
  if (!group) {
    breadcrumbs.push({ label: formatCatalogLabel(groupSlug) });
    return breadcrumbs;
  }

  breadcrumbs.push({
    label: group.title,
    to: `/categoria/${category.key}/${group.slug}`,
  });

  const sectionSlug = parts[3];
  if (!sectionSlug) return breadcrumbs;

  const section = group.sections.find((item) => item.slug.toLowerCase() === sectionSlug.toLowerCase());
  if (!section) {
    breadcrumbs.push({ label: formatCatalogLabel(sectionSlug) });
    return breadcrumbs;
  }

  breadcrumbs.push({
    label: section.title,
    to: `/categoria/${category.key}/${group.slug}/${section.slug}`,
  });

  return breadcrumbs;
}

export default function AppBreadcrumbs() {
  const { pathname } = useLocation();
  const storeProducts = useStoreProducts();
  const blogArticles = useStoreBlogArticles(false);

  const breadcrumbs = useMemo(() => {
    const normalizedPath = pathname.replace(/\/+$/, '') || '/';
    if (normalizedPath === '/') return [] as BreadcrumbItem[];

    const parts = normalizedPath.split('/').filter(Boolean);
    if (parts.length === 0) return [] as BreadcrumbItem[];

    const first = parts[0];
    let trail: BreadcrumbItem[] = [];

    switch (first) {
      case 'categoria': {
        trail = buildCategoryBreadcrumbs(parts);
        break;
      }
      case 'prodotto': {
        const productSlug = parts[1];
        const product = productSlug
          ? storeProducts.find((item) => item.slug.toLowerCase() === productSlug.toLowerCase())
          : undefined;

        if (product) {
          const catalogTrail = resolveCatalogTrail(product.categorySlug);
          if (catalogTrail) {
            trail.push({
              label: catalogTrail.category.label,
              to: catalogTrail.category.path,
            });
            if (catalogTrail.group) {
              trail.push({
                label: catalogTrail.group.label,
                to: catalogTrail.group.path,
              });
            }
            if (catalogTrail.section) {
              trail.push({
                label: catalogTrail.section.label,
                to: catalogTrail.section.path,
              });
            }
          } else {
            trail.push({ label: 'Catalogo', to: '/categoria/linea-caldo' });
          }

          trail.push({ label: product.name });
        } else {
          trail = [{ label: 'Prodotto' }];
        }
        break;
      }
      case 'guide': {
        trail = [{ label: 'Guide', to: '/guide' }];
        const guideSlug = parts[1];
        if (guideSlug) {
          const article = blogArticles.find((item) => item.slug.toLowerCase() === guideSlug.toLowerCase());
          trail.push({ label: article?.title || formatCatalogLabel(guideSlug) });
        }
        break;
      }
      case 'per-attivita': {
        const activitySlug = parts[1];
        if (activitySlug) {
          const activity = businessTypes.find((item) => item.slug.toLowerCase() === activitySlug.toLowerCase());
          trail = [{ label: activity?.name || formatCatalogLabel(activitySlug) }];
        } else {
          trail = [{ label: 'Per attivita' }];
        }
        break;
      }
      case 'account': {
        trail = [{ label: 'Account', to: '/account' }];
        const section = parts[1];
        if (section) {
          trail.push({ label: accountPages[section] || formatCatalogLabel(section) });
        }
        break;
      }
      case 'admin': {
        trail = [{ label: 'Admin', to: '/admin' }];
        const section = parts[1];
        if (section) {
          trail.push({ label: adminPages[section] || formatCatalogLabel(section) });
        }
        break;
      }
      default: {
        trail = [{ label: staticPages[first] || formatCatalogLabel(first) }];
        if (parts[1]) {
          trail.push({ label: formatCatalogLabel(parts[1]) });
        }
      }
    }

    return [{ label: 'Home', to: '/' }, ...trail];
  }, [pathname, storeProducts, blogArticles]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Percorso di navigazione"
      className="mx-auto mb-4 mt-6 flex max-w-7xl flex-wrap items-center gap-2 px-4 text-sm sm:px-6 lg:px-8"
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-2">
            {crumb.to && !isLast ? (
              <Link to={crumb.to} className="text-gray-600 transition-colors hover:text-green-600">
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-gray-900' : 'text-gray-600'}>
                {crumb.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4 text-gray-400" />}
          </span>
        );
      })}
    </nav>
  );
}
