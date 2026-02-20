import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  CircleDollarSign,
  Globe,
  Package,
  Pickaxe,
  Truck,
  Wrench,
} from 'lucide-react';

const plusCards = [
  {
    id: 'competitive-prices',
    title: 'Abbiamo prezzi super competitivi',
    cta: 'Scopri i prodotti',
    to: '/categoria/linea-caldo',
    icon: (
      <span className="home-v2-plus-icon-stack">
        <Package className="home-v2-plus-icon-main" strokeWidth={2.2} />
        <span className="home-v2-plus-icon-badge">
          <BadgeCheck className="home-v2-plus-icon-badge-symbol" strokeWidth={2.4} />
        </span>
      </span>
    ),
  },
  {
    id: 'fast-shipping',
    title: 'Spedizioni e consegne rapide',
    cta: 'Prepara il tuo ordine',
    to: '/categoria/linea-freddo',
    icon: <Truck className="home-v2-plus-icon-main" strokeWidth={2.2} />,
  },
  {
    id: 'install-services',
    title: 'Installazione e servizi aggiuntivi',
    cta: 'Scopri di piu',
    to: '/contatti',
    icon: <Wrench className="home-v2-plus-icon-main" strokeWidth={2.2} />,
  },
  {
    id: 'consulting',
    title: 'Reali consulenze specializzate',
    cta: 'Come lavoriamo',
    to: '/chi-siamo',
    icon: <Pickaxe className="home-v2-plus-icon-main" strokeWidth={2.2} />,
  },
  {
    id: 'catalog',
    title: 'Vasto e selezionato catalogo prodotti',
    cta: 'Inizia i tuoi acquisti',
    to: '/categoria/linea-freddo',
    icon: <Globe className="home-v2-plus-icon-main" strokeWidth={2.2} />,
  },
  {
    id: 'secure-payments',
    title: 'Transazioni e pagamenti sicuri',
    cta: 'Domande Frequenti',
    to: '/faq',
    icon: <CircleDollarSign className="home-v2-plus-icon-main" strokeWidth={2.2} />,
  },
];

export default function HomeV2PlusSection() {
  return (
    <section className="home-v2-plus-section" data-node-id="4607:15308">
      <header className="home-v2-plus-header">
        <h2 className="home-v2-plus-title">Prodotti selezionati</h2>
      </header>

      <div className="home-v2-plus-cards-row" role="list" aria-label="Punti di forza Bianchipro">
        {plusCards.map((card) => (
          <article key={card.id} className="home-v2-plus-card" role="listitem">
            <div className="home-v2-plus-card-icon">{card.icon}</div>
            <h3 className="home-v2-plus-card-title">{card.title}</h3>
            <Link to={card.to} className="home-v2-plus-card-link">
              {card.cta} <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
