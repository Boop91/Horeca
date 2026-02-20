import { catalogMenu } from '../data/catalogMenu';

interface InternalTrail {
  category: { key: string; label: string };
  group?: { slug: string; title: string };
  section?: { slug: string; title: string };
}

export interface CatalogTrail {
  category: { key: string; label: string; path: string };
  group?: { slug: string; label: string; path: string };
  section?: { slug: string; label: string; path: string };
}

const SLUG_ALIASES: Record<string, string> = {
  friggitrici: 'friggitrici-professionali',
  'lievitatori-per-forni-gastronomia': 'lievitatori',
};

const PATH_ALIASES: Record<string, string> = {
  'sfogliatrici-stendipizza': '/categoria/preparazione',
  lavastoviglie: '/categoria/igiene',
  casseforti: '/categoria/hotellerie',
  'linea-cortesia': '/categoria/hotellerie',
  'carrelli-per-dolci-formaggi-e-antipasti': '/categoria/carrelli-arredo',
};

const categoryPaths = new Map<string, string>();
const groupPaths = new Map<string, string>();
const sectionPaths = new Map<string, string>();
const itemPaths = new Map<string, string>();

const categoryTrails = new Map<string, InternalTrail>();
const groupTrails = new Map<string, InternalTrail>();
const sectionTrails = new Map<string, InternalTrail>();
const itemTrails = new Map<string, InternalTrail>();

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function canonicalSlug(value: string) {
  const normalized = normalize(value);
  return SLUG_ALIASES[normalized] || normalized;
}

function toCatalogTrail(trail: InternalTrail): CatalogTrail {
  const categoryPath = `/categoria/${trail.category.key}`;

  return {
    category: {
      key: trail.category.key,
      label: trail.category.label,
      path: categoryPath,
    },
    group: trail.group
      ? {
        slug: trail.group.slug,
        label: trail.group.title,
        path: `${categoryPath}/${trail.group.slug}`,
      }
      : undefined,
    section: trail.group && trail.section
      ? {
        slug: trail.section.slug,
        label: trail.section.title,
        path: `${categoryPath}/${trail.group.slug}/${trail.section.slug}`,
      }
      : undefined,
  };
}

function setOnce<T>(map: Map<string, T>, key: string, value: T) {
  if (!map.has(key)) {
    map.set(key, value);
  }
}

for (const category of catalogMenu) {
  const categoryPath = `/categoria/${category.key}`;
  const categoryTrail: InternalTrail = {
    category: { key: category.key, label: category.label },
  };

  setOnce(categoryPaths, normalize(category.key), categoryPath);
  setOnce(categoryPaths, normalize(category.slug), categoryPath);
  setOnce(categoryTrails, normalize(category.key), categoryTrail);
  setOnce(categoryTrails, normalize(category.slug), categoryTrail);

  for (const group of category.groups) {
    const groupPath = `${categoryPath}/${group.slug}`;
    const groupTrail: InternalTrail = {
      ...categoryTrail,
      group: { slug: group.slug, title: group.title },
    };

    setOnce(groupPaths, normalize(group.slug), groupPath);
    setOnce(groupTrails, normalize(group.slug), groupTrail);

    for (const section of group.sections) {
      const sectionPath = `${groupPath}/${section.slug}`;
      const sectionTrail: InternalTrail = {
        ...groupTrail,
        section: { slug: section.slug, title: section.title },
      };

      setOnce(sectionPaths, normalize(section.slug), sectionPath);
      setOnce(sectionTrails, normalize(section.slug), sectionTrail);

      for (const item of section.items) {
        setOnce(itemPaths, normalize(item.slug), sectionPath);
        setOnce(itemTrails, normalize(item.slug), sectionTrail);
      }
    }
  }
}

function resolveTrailFromPath(path: string): InternalTrail | null {
  const parts = path.split('/').filter(Boolean);
  if (parts[0] !== 'categoria' || !parts[1]) return null;

  const category = catalogMenu.find(
    (entry) => normalize(entry.key) === normalize(parts[1]) || normalize(entry.slug) === normalize(parts[1]),
  );
  if (!category) return null;

  const base: InternalTrail = {
    category: { key: category.key, label: category.label },
  };

  if (!parts[2]) return base;
  const group = category.groups.find((entry) => normalize(entry.slug) === normalize(parts[2]));
  if (!group) return base;

  const withGroup: InternalTrail = {
    ...base,
    group: { slug: group.slug, title: group.title },
  };

  if (!parts[3]) return withGroup;
  const section = group.sections.find((entry) => normalize(entry.slug) === normalize(parts[3]));
  if (!section) return withGroup;

  return {
    ...withGroup,
    section: { slug: section.slug, title: section.title },
  };
}

export function resolveCatalogPath(slugOrKey: string): string | null {
  if (!slugOrKey) return null;
  const slug = canonicalSlug(slugOrKey);

  return (
    PATH_ALIASES[slug] ||
    categoryPaths.get(slug) ||
    itemPaths.get(slug) ||
    sectionPaths.get(slug) ||
    groupPaths.get(slug) ||
    null
  );
}

export function resolveCatalogTrail(slugOrKey: string): CatalogTrail | null {
  if (!slugOrKey) return null;
  const slug = canonicalSlug(slugOrKey);

  const direct =
    itemTrails.get(slug) ||
    sectionTrails.get(slug) ||
    groupTrails.get(slug) ||
    categoryTrails.get(slug) ||
    null;

  if (direct) return toCatalogTrail(direct);

  const aliasedPath = PATH_ALIASES[slug];
  if (!aliasedPath) return null;

  const fromPath = resolveTrailFromPath(aliasedPath);
  return fromPath ? toCatalogTrail(fromPath) : null;
}

export function formatCatalogLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
