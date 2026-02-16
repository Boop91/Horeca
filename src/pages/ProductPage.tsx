import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductGallery from '../components/ProductGallery';
import ProductDetails from '../components/ProductDetails';
import ProductTabs from '../components/ProductTabs';
import TrustBadges from '../components/TrustBadges';
import FeedatyReviews from '../components/FeedatyReviews';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { accessories } from '../components/CompactAccessories';
import { getProductBySlug, getAllProducts } from '../data/products/realProducts';
import mainImage from '../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';
import { toast } from 'sonner';

/**
 * Mappa dei categorySlug alle etichette leggibili per i breadcrumb.
 * Copre tutte le categorie presenti nei prodotti reali.
 */
const categoryLabels: Record<string, string> = {
  'abbattitori': 'Abbattitori',
  'forni-per-pizza': 'Forni per Pizza',
  'friggitrici': 'Friggitrici',
  'frigoriferi-professionali': 'Frigoriferi Professionali',
  'fry-top': 'Fry Top',
  'forni-a-convezione': 'Forni a Convezione',
};

/**
 * Mappa delle categorie alle macro-categorie del catalogo (per il breadcrumb).
 */
const categoryToParent: Record<string, { label: string; slug: string }> = {
  'abbattitori': { label: 'Linea Freddo', slug: 'linea-freddo' },
  'frigoriferi-professionali': { label: 'Linea Freddo', slug: 'linea-freddo' },
  'forni-per-pizza': { label: 'Linea Caldo', slug: 'linea-caldo' },
  'friggitrici': { label: 'Linea Caldo', slug: 'linea-caldo' },
  'fry-top': { label: 'Linea Caldo', slug: 'linea-caldo' },
  'forni-a-convezione': { label: 'Linea Caldo', slug: 'linea-caldo' },
};

/**
 * Formatta un numero come prezzo in euro con virgola decimale.
 * Esempio: 4106.52 → "4.106,52"
 */
function formatPrice(value: number): string {
  return value.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProductPage() {
  const { slug } = useParams();

  // Stato configurazione prodotto (stessa interfaccia originale di ProductDetails)
  const [quantity, setQuantity] = useState(1);
  const [capacity, setCapacity] = useState('5-teglie');
  const [probe, setProbe] = useState('standard');
  const [selectedAccessories, setSelectedAccessories] = useState<number[]>([]);

  const { addItem } = useCart();
  const { toggleItem, isFavorite } = useFavorites();

  // Carica il prodotto dallo slug dell'URL
  const product = slug ? getProductBySlug(slug) : undefined;

  // Pagina 404 se il prodotto non esiste
  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-16 mb-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Prodotto non trovato</h1>
        <p className="text-gray-600 mb-8">
          Il prodotto che stai cercando non esiste o non e piu disponibile.
        </p>
        <Link
          to="/categoria/linea-freddo"
          className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
        >
          Torna al Catalogo
        </Link>
      </main>
    );
  }

  // Immagine principale del prodotto (usa fallback se non disponibile)
  const productImage = product.images[0] || mainImage;

  // Verifica se il prodotto corrente e nei preferiti
  const isCurrentFavorite = isFavorite(product.id);

  // Gestisce il toggle dei preferiti per questo prodotto
  const handleToggleFavorite = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.priceNet,
      image: productImage,
      brand: product.brand,
    });
  };

  // Aggiunge il prodotto al carrello con quantita e opzioni selezionate
  const handleAddToCart = () => {
    const probePrice = probe === 'doppia' ? 120 : probe === 'wireless' ? 180 : 0;

    const selectedAccessoriesData = accessories
      .filter(acc => selectedAccessories.includes(acc.id))
      .map(acc => ({ name: acc.name, price: acc.price }));

    const options = [
      `Capacita: ${capacity.replace('-teglie', ' teglie')}`,
      `Sonda: ${probe.charAt(0).toUpperCase() + probe.slice(1)}`,
    ];

    addItem({
      id: `product-${product.id}-${Date.now()}`,
      name: product.name,
      price: product.priceNet + probePrice,
      quantity,
      image: productImage,
      options,
      accessories: selectedAccessoriesData.length > 0 ? selectedAccessoriesData : undefined,
    });

    toast.success('Prodotto aggiunto al carrello');
  };

  // Aggiunge un accessorio singolo al carrello
  const handleAddAccessoryToCart = (accessory: { id: number; name: string; price: number; img: string | null }) => {
    addItem({
      id: `accessory-${accessory.id}-${Date.now()}`,
      name: accessory.name,
      price: accessory.price,
      quantity: 1,
      image: accessory.img || productImage,
    });
    toast.success(`${accessory.name}`, { description: 'Aggiunto al carrello', duration: 2000 });
  };

  // Dati per il breadcrumb dinamico
  const parentCategory = categoryToParent[product.categorySlug];
  const categoryLabel = categoryLabels[product.categorySlug] || product.categorySlug;

  // Prodotti correlati: stessa categoria, escluso il prodotto corrente (max 4)
  const relatedProducts = getAllProducts()
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-8 mb-20">
      {/* Breadcrumb di navigazione dinamico */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        {parentCategory && (
          <>
            <Link
              to={`/categoria/${parentCategory.slug}`}
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              {parentCategory.label}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </>
        )}
        <Link
          to={`/categoria/${product.categorySlug}`}
          className="text-gray-600 hover:text-green-600 transition-colors"
        >
          {categoryLabel}
        </Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Sezione prodotto principale: galleria a sinistra, dettagli a destra */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8 lg:items-start">
          {/* Galleria immagini (interfaccia originale non modificata) */}
          <ProductGallery
            isFavorite={isCurrentFavorite}
            onToggleFavorite={handleToggleFavorite}
          />
          {/* Dettagli prodotto (interfaccia originale non modificata) */}
          <ProductDetails
            quantity={quantity}
            setQuantity={setQuantity}
            capacity={capacity}
            setCapacity={setCapacity}
            probe={probe}
            setProbe={setProbe}
            selectedAccessories={selectedAccessories}
            setSelectedAccessories={setSelectedAccessories}
            onAddToCart={handleAddToCart}
            onAddAccessoryToCart={handleAddAccessoryToCart}
            isFavorite={isCurrentFavorite}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      {/* Badge di fiducia (spedizione, garanzia, ecc.) */}
      <div className="mb-12">
        <TrustBadges />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12" />

      {/* Tab con descrizione, specifiche e documenti */}
      <div className="mb-12">
        <ProductTabs />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12" />

      {/* Recensioni Feedaty */}
      <div className="mb-12">
        <FeedatyReviews />
      </div>

      {/* Sezione prodotti correlati dalla stessa categoria */}
      {relatedProducts.length > 0 && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12" />
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Prodotti Correlati</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/prodotto/${related.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Immagine del prodotto correlato */}
                  <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={related.images[0] || mainImage}
                      alt={related.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = mainImage;
                      }}
                    />
                  </div>
                  {/* Info del prodotto correlato */}
                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{related.brand}</p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors mb-2">
                      {related.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      &euro;{formatPrice(related.priceNet)}
                      <span className="text-xs font-normal text-gray-500 ml-1">(ex IVA)</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
