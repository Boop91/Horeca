import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products/sampleProducts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import './ProductListingCard.css';

interface ProductListingCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const euroFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function toCategoryLabel(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProductListingCard({ product, onAddToCart }: ProductListingCardProps) {
  const hasDiscount = Boolean(product.originalPriceNet && product.originalPriceNet > product.priceNet);

  return (
    <article className="listing-product-card" data-testid={`listing-product-card-${product.slug}`}>
      <div className="listing-product-media-shell">
        <div className="listing-product-badges-left">
          {product.isNew && <span className="listing-product-badge listing-product-badge-new">Nuovo</span>}
          {product.isOnSale && <span className="listing-product-badge listing-product-badge-offer">Offerta</span>}
        </div>
        <span className="listing-product-badge listing-product-badge-best">Best seller</span>

        <Link to={`/prodotto/${product.slug}`} className="listing-product-media-link">
          <div className="listing-product-media">
            {product.images[0] ? (
              <ImageWithFallback
                src={product.images[0]}
                alt={product.name}
                className="listing-product-media-image"
                loading="lazy"
              />
            ) : (
              <div className="listing-product-media-fallback">
                <PackageSearch className="h-12 w-12 text-gray-300" />
              </div>
            )}
          </div>
        </Link>
      </div>

      <div className="listing-product-body">
        <span className="listing-product-category">{toCategoryLabel(product.categorySlug)}</span>

        <Link to={`/prodotto/${product.slug}`} className="listing-product-title-link">
          <h3 className="listing-product-title">{product.name}</h3>
        </Link>

        <div className="listing-product-footer">
          <div className="listing-product-price-wrap">
            <p className="listing-product-price-main">{euroFormatter.format(product.priceNet)}</p>
            {hasDiscount ? (
              <p className="listing-product-price-old">{euroFormatter.format(product.originalPriceNet!)}</p>
            ) : (
              <p className="listing-product-price-old listing-product-price-old-empty">&nbsp;</p>
            )}
          </div>

          <button type="button" onClick={() => onAddToCart(product)} className="listing-product-buy">
            Aggiungi
          </button>
        </div>
      </div>
    </article>
  );
}
