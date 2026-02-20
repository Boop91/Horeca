import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useStoreBlogArticles } from '../../lib/storefrontStore';
import blogHeroFallback from '../../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';

const heroImage = blogHeroFallback;

const FEATURED_GUIDE_SLUGS = [
  'come-scegliere-abbattitore',
  'forno-pizza-elettrico-gas',
  'come-attrezzare-pizzeria',
  'manutenzione-frigorifero-professionale',
] as const;

const FALLBACK_BLOG_IMAGE = blogHeroFallback;

export default function HomeV2BlogPreviews() {
  const allArticles = useStoreBlogArticles(false);

  const featuredGuides = useMemo(
    () => {
      const featured = FEATURED_GUIDE_SLUGS
        .map((slug) => allArticles.find((article) => article.slug === slug))
        .filter((article): article is (typeof allArticles)[number] => Boolean(article));

      const featuredSlugSet = new Set<string>(FEATURED_GUIDE_SLUGS);
      const fallback = allArticles.filter((article) => !featuredSlugSet.has(article.slug));

      return [...featured, ...fallback].slice(0, 8);
    },
    [allArticles],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: featuredGuides.length > 1,
    align: 'start',
    dragFree: false,
    skipSnaps: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(featuredGuides.length > 1);

  useEffect(() => {
    if (!emblaApi) return;

    const syncArrows = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    syncArrows();
    emblaApi.on('select', syncArrows);
    emblaApi.on('reInit', syncArrows);

    return () => {
      emblaApi.off('select', syncArrows);
      emblaApi.off('reInit', syncArrows);
    };
  }, [emblaApi, featuredGuides.length]);

  useEffect(() => {
    if (!emblaApi || featuredGuides.length < 2) return;
    const timerId = window.setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
        return;
      }
      emblaApi.scrollTo(0);
    }, 5200);
    return () => window.clearInterval(timerId);
  }, [emblaApi, featuredGuides.length]);

  return (
    <section className="home-v2-blog-section" data-node-id="4568:15758">
      <div className="home-v2-blog-wrapper">
        <div className="home-v2-blog-hero">
          <img
            src={heroImage}
            alt="Dietro le quinte della ristorazione professionale"
            className="home-v2-blog-hero-image"
            loading="lazy"
            decoding="async"
          />

          <div className="home-v2-blog-overlay">
            <p className="home-v2-blog-kicker">Bianchipro</p>
            <h2 className="home-v2-blog-title">
              Dietro le quinte
              <br />
              del mondo della
              <br />
              ristorazione
            </h2>
            <p className="home-v2-blog-description">
              Scopri il nostro blog e leggi tutti gli articoli e le guide utili dedicati al mondo Ho.Re.Ca. Idee,
              tecniche ed innovazioni utili a rendere la tua attivita piu efficiente, sostenibile e pronta ad
              affrontare tutte le sfide del mondo della ristorazione.
            </p>
            <Link to="/guide" className="home-v2-blog-cta" style={{ textDecoration: 'none' }}>
              Vedi tutti gli articoli
              <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </Link>
          </div>
        </div>

        <div className="home-v2-blog-cards-shell">
          <button
            type="button"
            className="home-v2-blog-arrow home-v2-blog-arrow-left"
            aria-label="Scorri anteprime blog a sinistra"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!emblaApi || !canScrollPrev}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div className="home-v2-blog-cards-viewport" ref={emblaRef}>
            <div className="home-v2-blog-cards-track">
              {featuredGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/guide/${guide.slug}`}
                  className="home-v2-blog-card"
                  style={{ textDecoration: 'none' }}
                  data-testid={`home-v2-blog-card-${guide.slug}`}
                >
                <div className="home-v2-blog-card-image-wrap">
                  <img
                    src={guide.image || FALLBACK_BLOG_IMAGE}
                    alt={guide.title}
                    className="home-v2-blog-card-image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="home-v2-blog-card-title">{guide.title}</h3>
              </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="home-v2-blog-arrow home-v2-blog-arrow-right"
            aria-label="Scorri anteprime blog a destra"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!emblaApi || !canScrollNext}
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
