import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useStoreProducts } from '../../lib/storefrontStore';
import productFallbackImage from '../../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';

const FALLBACK_IMAGE = productFallbackImage;
const CAROUSEL_TARGET_ITEMS = 8;
const CARDS_PER_VIEW = 4;
const CARD_SHIFT_PX = 324; // 300 width + 24 gap

interface CarouselProduct {
  id: string;
  slug: string;
  name: string;
  categoryLabel: string;
  image: string;
  price: number;
  oldPrice: number;
  isNew: boolean;
  isOffer: boolean;
}

const euroFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatPrice(value: number) {
  return euroFormatter.format(value);
}

function toCategoryLabel(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function pickProducts(products: ReturnType<typeof useStoreProducts>) {
  if (products.length <= CAROUSEL_TARGET_ITEMS) return products;

  const step = Math.floor(products.length / CAROUSEL_TARGET_ITEMS);
  const picked = Array.from({ length: CAROUSEL_TARGET_ITEMS }, (_, index) => products[index * step]);
  return picked.filter(Boolean);
}

function ProductCard({
  product,
  index,
  isPriorityImage,
}: {
  product: CarouselProduct;
  index: number;
  isPriorityImage: boolean;
}) {
  const cardStyle = { '--home-v2-card-order': index } as CSSProperties;

  return (
    <Link
      to={`/prodotto/${product.slug}`}
      className="home-v2-product-card-link"
      data-testid={`home-v2-product-card-${product.slug}`}
      style={cardStyle}
    >
      <article className="home-v2-product-card">
        <div className="home-v2-product-media">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="home-v2-product-media-image"
            loading={isPriorityImage ? 'eager' : 'lazy'}
            decoding="async"
          />

          <div className="home-v2-product-badges-left">
            {product.isNew && <span className="home-v2-badge home-v2-badge-new">Nuovo</span>}
            {product.isOffer && <span className="home-v2-badge home-v2-badge-offer">Offerta</span>}
          </div>

          <span className="home-v2-badge home-v2-badge-best">Best seller</span>
        </div>

        <div className="home-v2-product-body">
          <div className="home-v2-product-main">
            <span className="home-v2-badge home-v2-badge-category">{product.categoryLabel}</span>
            <h3 className="home-v2-product-title">{product.name}</h3>
          </div>

          <div className="home-v2-product-footer">
            <div className="home-v2-price-wrap">
              <span className="home-v2-price-main">{formatPrice(product.price)}</span>
              <span className="home-v2-price-old">{formatPrice(product.oldPrice)}</span>
            </div>

            <span className="home-v2-buy-button">acquista</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function HomeV2Products() {
  const storeProducts = useStoreProducts();

  const carouselProducts = useMemo<CarouselProduct[]>(
    () =>
      pickProducts(storeProducts).map((product) => {
        const originalGross = product.originalPriceNet
          ? Math.round(product.originalPriceNet * 1.22 * 100) / 100
          : Math.round(product.priceGross * 1.18 * 100) / 100;

        return {
          id: product.id,
          slug: product.slug,
          name: product.name,
          categoryLabel: toCategoryLabel(product.categorySlug),
          image: product.images[0] || FALLBACK_IMAGE,
          price: product.priceGross,
          oldPrice: Math.max(originalGross, Math.round(product.priceGross * 1.05 * 100) / 100),
          isNew: Boolean(product.isNew),
          isOffer: Boolean(product.isOnSale || product.originalPriceNet),
        };
      }),
    [storeProducts],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = Math.max(0, carouselProducts.length - CARDS_PER_VIEW);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const trackStyle: CSSProperties = {
    transform: `translate3d(-${currentIndex * CARD_SHIFT_PX}px, 0, 0)`,
  };

  return (
    <section className="home-v2-products-block" data-node-id="7718:6731">
      <div className="home-v2-products-heading-wrap">
        <p className="home-v2-products-kicker">Selezione Bianchipro</p>
        <h2 className="home-v2-products-heading">Linea Freddo Prodotti</h2>
        <p className="home-v2-products-description">
          Refrigerazione e conservazione professionale: frigoriferi, congelatori, abbattitori, vetrine e tavoli
          refrigerati.
        </p>
      </div>

      <div className="home-v2-products-carousel-area" data-node-id="7718:6735">
        <button
          type="button"
          className="home-v2-carousel-arrow home-v2-carousel-arrow-left"
          aria-label="Scorri a sinistra"
          onClick={goPrev}
          data-testid="home-v2-carousel-left"
          disabled={maxIndex === 0}
        >
          <span className="home-v2-carousel-arrow-icon" aria-hidden="true">
            {'\uf060'}
          </span>
        </button>

        <div className="home-v2-products-carousel-viewport">
          <div
            className="home-v2-products-carousel-track"
            data-node-id="7718:6736"
            data-testid="home-v2-products-track"
            style={trackStyle}
          >
            {carouselProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isPriorityImage={index < CARDS_PER_VIEW}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="home-v2-carousel-arrow home-v2-carousel-arrow-right"
          aria-label="Scorri a destra"
          onClick={goNext}
          data-testid="home-v2-carousel-right"
          disabled={maxIndex === 0}
        >
          <span className="home-v2-carousel-arrow-icon" aria-hidden="true">
            {'\uf061'}
          </span>
        </button>
      </div>
    </section>
  );
}
