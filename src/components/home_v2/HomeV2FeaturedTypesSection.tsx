import { Link } from 'react-router-dom';

interface FeaturedTypeCard {
  id: string;
  title: string;
  to: string;
  image: string;
}

const featuredTypeCards: FeaturedTypeCard[] = [
  {
    id: 'contact-cooking',
    title: 'Cottura a contatto',
    to: '/categoria/linea-caldo/cottura-a-contatto',
    image: 'https://www.figma.com/api/mcp/asset/5645c5a9-e0d1-4bd4-86bd-b42e136ac1e5',
  },
  {
    id: 'professional-ovens',
    title: 'Forni professionali',
    to: '/categoria/linea-caldo/forni-professionali',
    image: 'https://www.figma.com/api/mcp/asset/bdee6f7c-7c70-45bc-9a10-0392371cbf4f',
  },
  {
    id: 'immersion-cooking',
    title: 'Cottura per immersione',
    to: '/categoria/linea-caldo/cottura-per-immersione',
    image: 'https://www.figma.com/api/mcp/asset/a4e52a74-0b7c-43d3-b22e-e911306ea090',
  },
  {
    id: 'refrigeration',
    title: 'Refrigerazione',
    to: '/categoria/linea-freddo/refrigerazione',
    image: 'https://www.figma.com/api/mcp/asset/2c8dea52-7076-462e-8a60-2185f9a76fd4',
  },
  {
    id: 'refrigerated-tables',
    title: 'Tavoli refrigeranti',
    to: '/categoria/linea-freddo/tavoli-refrigerati',
    image: 'https://www.figma.com/api/mcp/asset/a910477e-bb74-4d72-9e15-c35ceb476db7',
  },
  {
    id: 'meat-and-cheese',
    title: 'Carne e formaggio',
    to: '/categoria/preparazione/carne-e-formaggio',
    image: 'https://www.figma.com/api/mcp/asset/89331ecb-b4b3-4e39-8731-34976224c442',
  },
  {
    id: 'mix-peeling-cutting',
    title: 'Mixer, pelatura e taglio',
    to: '/categoria/preparazione/mixer-pelatura-e-taglio',
    image: 'https://www.figma.com/api/mcp/asset/d0797c66-a884-4c9d-83bd-366a5f5deb9a',
  },
  {
    id: 'pasta-processing',
    title: 'Lavorazione pasta',
    to: '/categoria/preparazione/lavorazione-pasta',
    image: 'https://www.figma.com/api/mcp/asset/2816bd56-8a78-4705-bc12-78c3c8ef9f61',
  },
  {
    id: 'neutral-carts',
    title: 'Carrelli neutri',
    to: '/categoria/carrelli-arredo/carrelli-neutri',
    image: 'https://www.figma.com/api/mcp/asset/0d2ab0e2-c5ac-49c7-9584-b45c5cb17b38',
  },
  {
    id: 'hot-cold-carts',
    title: 'Carrelli caldi e freddi',
    to: '/categoria/carrelli-arredo/carrelli-caldi-e-freddi',
    image: 'https://www.figma.com/api/mcp/asset/4e243b66-a4b3-437f-a633-64060ffc3b08',
  },
];

export default function HomeV2FeaturedTypesSection() {
  return (
    <section className="home-v2-featured-types-section" data-node-id="4618:15262">
      <div className="home-v2-featured-types-shell">
        <header className="home-v2-featured-types-header">
          <h2 className="home-v2-featured-types-title">Categorie in evidenza</h2>
          <p className="home-v2-featured-types-subtitle">Inizia il tuo shopping da qui</p>
        </header>

        <div className="home-v2-featured-types-grid" role="list" aria-label="Categorie in evidenza per tipologia">
          {featuredTypeCards.map((card) => (
            <article key={card.id} className="home-v2-featured-types-item" role="listitem">
              <Link to={card.to} className="home-v2-featured-types-link">
                <div className="home-v2-featured-types-image-wrap">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="home-v2-featured-types-image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="home-v2-featured-types-name">{card.title}</h3>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
