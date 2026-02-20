import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import SupportHelpWidget from './SupportHelpWidget';

const heroImage = 'https://www.figma.com/api/mcp/asset/b16d5f23-9715-4be5-883e-be71d5de87f8';
const productCardImage = 'https://www.figma.com/api/mcp/asset/0e5c6e27-c699-410d-a8d9-4b62d5bda52f';

interface ProductCard {
  id: number;
  title: string;
  price: string;
  originalPrice: string;
}

const selectedProducts: ProductCard[] = [
  {
    id: 1,
    title: 'Nome completo del prodotto disposto su massimo due righe',
    price: '1.250,00€',
    originalPrice: '2.500,00€',
  },
  {
    id: 2,
    title: 'Nome completo del prodotto disposto su massimo due righe',
    price: '1.250,00€',
    originalPrice: '2.500,00€',
  },
  {
    id: 3,
    title: 'Nome completo del prodotto disposto su massimo due righe',
    price: '1.250,00€',
    originalPrice: '2.500,00€',
  },
  {
    id: 4,
    title: 'Nome completo del prodotto disposto su massimo due righe',
    price: '1.250,00€',
    originalPrice: '2.500,00€',
  },
];

function HeroSection() {
  return (
    <section className="relative h-[560px] overflow-hidden md:h-[650px]" data-node-id="7718:6713">
      <img src={heroImage} alt="Cucina professionale" className="absolute inset-0 h-full w-full object-cover" />

      <div className="mx-auto flex h-full w-full max-w-7xl items-center px-4 pb-8 pt-10 sm:px-6 md:px-[24px] md:pb-[43.12px] md:pt-[75.13px]">
        <div
          className="relative flex w-full max-w-[650px] flex-col gap-[16px] rounded-[28px] bg-[rgba(255,255,255,0.85)] px-6 py-8 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-[2px] md:min-w-[650px] md:rounded-[40px] md:px-[48px] md:py-[64px]"
          data-node-id="7718:6716"
        >
          <p className="font-['Manrope'] text-[18px] font-normal leading-[28px] tracking-[0.45px] text-[#28a745]">
            Bianchipro
          </p>

          <h1 className="font-['Manrope'] text-[40px] font-normal leading-[48px] text-[#2c3e50] md:text-[48px] md:leading-[60px]">
            Soluzioni ed attrezzature
            <br />
            professionali per la
            <br />
            ristorazione
          </h1>

          <p className="pt-[16px] font-['Manrope'] text-[16px] font-light italic leading-[26px] text-[#374151] md:text-[18px] md:leading-[29.25px]">
            Siamo orgogliosi del Made in Italy, curiamo ogni dettaglio e puntiamo
            <br className="hidden md:block" />
            alla perfezione. Perché il vostro successo operativo è anche il nostro.
            <br className="hidden md:block" />
            Sempre al vostro fianco, con competenza, visione e responsabilità.
          </p>

          <Link
            to="/categoria/linea-caldo"
            className="inline-flex items-center pt-[15.5px] font-['Manrope'] text-[16px] font-normal leading-[28px] text-[#28a745] transition-colors hover:text-[#23933f] md:text-[18px]"
          >
            Inizia da qui
            <ArrowRight className="ml-[8px] h-[18px] w-[18px]" strokeWidth={2.4} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SelectedProductCard({ product }: { product: ProductCard }) {
  return (
    <article className="flex h-[503px] w-[300px] shrink-0 flex-col overflow-hidden rounded-[28px] bg-white shadow-[0px_10px_30px_rgba(0,0,0,0.05)]">
      <div className="relative h-[280px]">
        <img src={productCardImage} alt="Chef che impiatta" className="absolute inset-0 h-full w-full object-cover" />

        <div className="absolute left-[20px] top-[20px] flex items-start gap-[8px]">
          <span className="rounded-full bg-[#4b90fe] px-[10px] py-[4px] font-['Manrope'] text-[10px] font-extralight leading-[15px] text-white">
            nuovo
          </span>
          <span className="rounded-full bg-[#fdc044] px-[10px] py-[4px] font-['Manrope'] text-[10px] font-extralight leading-[15px] text-white">
            offerta
          </span>
        </div>

        <span className="absolute right-[23.92px] top-[16px] rounded-full bg-[#c2ebcf] px-[10px] py-[3.5px] font-['Manrope'] text-[10px] font-extralight leading-[15px] text-[#347849]">
          best seller
        </span>
      </div>

      <div className="flex h-[223px] flex-col justify-between p-[24px]">
        <div className="flex flex-col gap-[12px] pb-[8px]">
          <span className="w-fit rounded-full bg-[#c2ebcf] px-[10px] py-[4px] font-['Manrope'] text-[10px] font-extralight leading-[15px] text-[#347849]">
            categoria prodotto
          </span>

          <h3 className="font-['Manrope'] text-[18px] font-extralight leading-[24px] text-[#1f2937]">
            {product.title}
          </h3>
        </div>

        <div className="flex items-end justify-between pt-[16px]">
          <div className="flex flex-col">
            <span className="font-['Manrope'] text-[20px] font-extralight leading-[28px] text-[#1f2937]">
              {product.price}
            </span>
            <span className="font-['Manrope'] text-[12px] font-extralight leading-[16px] text-[#d6bbf0]">
              {product.originalPrice}
            </span>
          </div>

          <button
            type="button"
            className="rounded-full bg-[#ade4c2] px-[20px] py-[6px] font-['Manrope'] text-[14px] font-extralight leading-[20px] text-[#2e6b43] transition-opacity hover:opacity-85"
          >
            acquista
          </button>
        </div>
      </div>
    </article>
  );
}

function SelectedProductsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCards = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -324 : 324,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-[#ebeff1] px-4 pb-[132.5px] pt-[33px] sm:px-[16px]" data-node-id="7718:6731">
      <div className="pb-[48px] text-center">
        <h2 className="font-['Manrope'] text-[36px] font-extralight leading-[36px] text-[#303c54] md:text-[40px]">
          Prodotti selezionati
        </h2>
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <div className="relative flex items-center justify-center">
          <div
            ref={scrollRef}
            className="flex w-full gap-[24px] overflow-x-auto px-[16px] py-[24px]"
            style={{ scrollbarWidth: 'none' }}
          >
            {selectedProducts.map((product) => (
              <SelectedProductCard key={product.id} product={product} />
            ))}
          </div>

          <button
            type="button"
            aria-label="Scorri a sinistra"
            onClick={() => scrollCards('left')}
            className="absolute -left-[8px] top-[255.5px] z-10 hidden h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-[#10c060] text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 md:flex"
          >
            <ArrowLeft className="h-[16px] w-[16px]" strokeWidth={2.4} />
          </button>

          <button
            type="button"
            aria-label="Scorri a destra"
            onClick={() => scrollCards('right')}
            className="absolute -right-[8px] top-[255.5px] z-10 hidden h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-full bg-[#10c060] text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90 md:flex"
          >
            <ArrowRight className="h-[16px] w-[16px]" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <SelectedProductsSection />
      </main>
      <SupportHelpWidget />
    </>
  );
}
