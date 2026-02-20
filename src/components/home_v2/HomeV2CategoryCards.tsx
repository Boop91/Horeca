import { useMemo, useState, type CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { catalogMenu } from '../../data/catalogMenu';
import categoryCardPlaceholder from '../../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';

const categoryCardImage = categoryCardPlaceholder;

interface CategoryCardData {
  slug: string;
  label: string;
  description: string;
  chips: Array<{ label: string; to: string }>;
}

function buildCategoryCards(): CategoryCardData[] {
  return catalogMenu.map((category) => {
    const chips = category.groups
      .flatMap((group) =>
        group.sections.map((section) => ({
          label: section.title,
          to: `/categoria/${category.key}/${group.slug}/${section.slug}`,
        })),
      )
      .slice(0, 8);

    return {
      slug: category.key,
      label: category.label,
      description: category.description,
      chips,
    };
  });
}

export default function HomeV2CategoryCards() {
  const navigate = useNavigate();
  const [expandedCardSlugs, setExpandedCardSlugs] = useState<string[]>([]);
  const categoryCards = useMemo(() => buildCategoryCards().slice(0, 6), []);

  const toggleExpanded = (slug: string) => {
    setExpandedCardSlugs((prev) =>
      prev.includes(slug) ? prev.filter((entry) => entry !== slug) : [...prev, slug],
    );
  };

  return (
    <section className="home-v2-category-cards-section" data-node-id="7720:6626">
      <div className="home-v2-category-cards-heading">
        <h2 className="home-v2-category-cards-title">Esplora tutte le sottocategorie</h2>
        <p className="home-v2-category-cards-subtitle">
          Naviga rapidamente ogni area del catalogo e accedi alla categoria dedicata con un click.
        </p>
      </div>

      <div className="home-v2-category-cards-canvas" data-node-id="7720:6629">
        {categoryCards.map((card) => {
          const expanded = expandedCardSlugs.includes(card.slug);
          const baseChips = card.chips.slice(0, 4);
          const extraChips = card.chips.slice(4, 8);
          const hasExtraChips = extraChips.length > 0;

          return (
            <article
              key={card.slug}
              className={`home-v2-category-card${expanded ? ' home-v2-category-card-expanded' : ''}`}
              data-testid={`home-v2-category-card-${card.slug}`}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/categoria/${card.slug}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/categoria/${card.slug}`);
                }
              }}
            >
              <Link
                to={`/categoria/${card.slug}`}
                className="home-v2-category-card-top-link"
                style={{ textDecoration: 'none' }}
              >
                <div className="home-v2-category-card-top">
                  <div className="home-v2-category-card-image-wrap">
                    <img
                      src={categoryCardImage}
                      alt={card.label}
                      className="home-v2-category-card-image"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="home-v2-category-card-copy">
                    <h3 className="home-v2-category-card-title">{card.label}</h3>
                    <p className="home-v2-category-card-description">{card.description}</p>
                  </div>
                </div>
              </Link>

              <div className="home-v2-category-card-chips">
                {baseChips.map((chip) => (
                  <Link
                    key={chip.to}
                    to={chip.to.replace('//', '/')}
                    className="home-v2-category-card-chip"
                    style={{ textDecoration: 'none' }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>

              <div
                className={`home-v2-category-card-extra-wrap${expanded ? ' home-v2-category-card-extra-wrap-open' : ''}`}
                aria-hidden={!expanded}
              >
                <div className="home-v2-category-card-chips home-v2-category-card-chips-extra">
                  {extraChips.map((chip, index) => (
                    <Link
                      key={chip.to}
                      to={chip.to.replace('//', '/')}
                      className="home-v2-category-card-chip home-v2-category-card-chip-extra"
                      style={
                        {
                          textDecoration: 'none',
                          '--home-v2-chip-delay': `${index * 45}ms`,
                        } as CSSProperties
                      }
                      onClick={(event) => event.stopPropagation()}
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="home-v2-category-card-actions">
                <Link
                  to={`/categoria/${card.slug}`}
                  className="home-v2-category-card-button home-v2-category-card-button-primary"
                  style={{ textDecoration: 'none' }}
                >
                  vai categoria <span aria-hidden="true">→</span>
                </Link>

                {hasExtraChips && (
                  <button
                    type="button"
                    className="home-v2-category-card-button home-v2-category-card-button-secondary"
                    aria-expanded={expanded}
                    data-testid={`home-v2-category-toggle-${card.slug}`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleExpanded(card.slug);
                    }}
                  >
                    {expanded ? 'mostra meno' : 'visualizza tutto'} <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
