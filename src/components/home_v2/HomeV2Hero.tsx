import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHomeContentConfig } from '../../lib/storefrontStore';
import heroFallbackImage from '../../assets/f4ed0b934aabb9cdf06af64854509a5ac97f8256.png';

export default function HomeV2Hero() {
  const homeContent = useHomeContentConfig();
  const [heroImageSrc, setHeroImageSrc] = useState(homeContent.heroImage || heroFallbackImage);

  useEffect(() => {
    setHeroImageSrc(homeContent.heroImage || heroFallbackImage);
  }, [homeContent.heroImage]);

  return (
    <section className="home-v2-hero" data-node-id="7718:6713">
      <img
        src={heroImageSrc}
        alt="Cucina professionale"
        className="home-v2-hero-image"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onError={() => setHeroImageSrc(heroFallbackImage)}
      />

      <div className="home-v2-hero-overlay-container" data-node-id="7718:6715">
        <div className="home-v2-hero-overlay-inner">
          <div className="home-v2-hero-overlay-card" data-node-id="7718:6716">
            <span className="home-v2-hero-eyebrow">{homeContent.heroKicker}</span>

            <h1 className="home-v2-hero-title">{homeContent.heroTitle}</h1>

            <p className="home-v2-hero-description">{homeContent.heroDescription}</p>

            <Link
              to={homeContent.heroCtaPath}
              className="home-v2-hero-link"
              style={{ textDecoration: 'none' }}
              data-testid="home-v2-hero-cta"
            >
              {homeContent.heroCtaLabel}
              <span className="home-v2-hero-link-icon" aria-hidden="true">
                {'\uf061'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
