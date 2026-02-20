import { Link } from 'react-router-dom';

const promoCards = [
  {
    id: 'promo-1',
    title: 'Forni combinati pronta consegna',
    description: 'Configurazioni professionali con avviamento tecnico e lista prezzi dedicata alle nuove aperture.',
    ctaLabel: 'Scopri linea caldo',
    to: '/categoria/linea-caldo',
    image: 'https://www.figma.com/api/mcp/asset/a23a07c0-80a2-411a-9155-b3b7b44660ae',
    buttonClass: 'home-v2-promo-card-cta-warm',
  },
  {
    id: 'promo-2',
    title: 'Refrigerazione affidabile 24/7',
    description: 'Soluzioni per conservazione e stoccaggio con consumi ridotti e assistenza continuativa.',
    ctaLabel: 'Esplora linea freddo',
    to: '/categoria/linea-freddo',
    image: 'https://www.figma.com/api/mcp/asset/6147f1e5-0059-46f1-ba4b-cd23f3aa7de8',
    buttonClass: 'home-v2-promo-card-cta-lilac',
  },
  {
    id: 'promo-3',
    title: 'Preparazione ad alta produttivita',
    description: 'Mixer, planetarie e attrezzature di preparazione per aumentare resa e costanza operativa.',
    ctaLabel: 'Vedi area preparazione',
    to: '/categoria/preparazione',
    image: 'https://www.figma.com/api/mcp/asset/ab1e7d7a-56a9-4222-acb0-234f8ddda316',
    buttonClass: 'home-v2-promo-card-cta-cold',
  },
];

export default function HomeV2PromoSection() {
  return (
    <section className="home-v2-promo-cards-section" data-node-id="4609:15521">
      <div className="home-v2-promo-cards-shell">
        <header className="home-v2-promo-cards-header">
          <h2 className="home-v2-promo-cards-title">Scopri le nostre proposte</h2>
          <p className="home-v2-promo-cards-subtitle">Migliori offerte selezionate</p>
        </header>

        <div className="home-v2-promo-cards-grid">
          {promoCards.map((card) => (
            <article key={card.id} className="home-v2-promo-card">
              <img
                src={card.image}
                alt={card.title}
                className="home-v2-promo-card-image"
                loading="lazy"
                decoding="async"
              />
              <div className="home-v2-promo-card-body">
                <h3 className="home-v2-promo-card-title">{card.title}</h3>
                <p className="home-v2-promo-card-description">{card.description}</p>
                <Link to={card.to} className={`home-v2-promo-card-cta ${card.buttonClass}`}>
                  {card.ctaLabel}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
