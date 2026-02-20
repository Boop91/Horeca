import { Link } from 'react-router-dom';
import { Facebook, Instagram, Send, Youtube } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';
import './Footer.css';

const infoLinks = [
  { label: 'Contattaci', to: '/contatti' },
  { label: 'Condizioni di Vendita', to: '/condizioni-vendita' },
  { label: 'Chi siamo', to: '/chi-siamo' },
  { label: 'I nostri Brand', to: '/chi-siamo' },
  { label: 'Privacy Policy', to: '/condizioni-vendita#privacy' },
  { label: 'Cookie Policy', to: '/condizioni-vendita#cookie' },
];

const productLinks = [
  { label: 'Linea Caldo', to: '/categoria/linea-caldo' },
  { label: 'Linea Freddo', to: '/categoria/linea-freddo' },
  { label: 'Preparazione', to: '/categoria/preparazione' },
  { label: 'Carrelli e Mobili', to: '/categoria/carrelli-arredo' },
  { label: 'Igiene e Pulizia', to: '/categoria/igiene' },
  { label: 'Hotellerie', to: '/categoria/hotellerie' },
  { label: 'Ricambi', to: '/categoria/ricambi' },
];

const utilityLinks = [
  { label: 'Domande Frequenti', to: '/faq' },
  { label: 'Blog e guide utili', to: '/guide' },
  { label: 'Glossario', to: '/glossario' },
  { label: 'Mappa del sito', to: '/' },
  { label: 'Pagamenti', to: '/account/pagamenti' },
  { label: 'Noleggio operativo', to: '/contatti' },
  { label: 'Spedizioni', to: '/contatti' },
  { label: 'I nostri video', to: '/guide' },
  { label: 'Sigep', to: '/guide' },
];

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: Instagram },
  { label: 'YouTube', href: 'https://www.bianchipro.it/it/content/54-i-nostri-video', icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="horeca-footer">
      <section className="horeca-footer-newsletter" aria-label="Newsletter e social">
        <div className="horeca-footer-container horeca-footer-newsletter-row">
          <div className="horeca-footer-newsletter-copy">
            <h2 className="horeca-footer-newsletter-title">Newsletter professionale</h2>
            <p className="horeca-footer-newsletter-subtitle">
              Ricevi anteprime esclusive, guide e promozioni dedicate. Contattaci e attiviamo l&apos;iscrizione.
            </p>
          </div>

          <Link to="/contatti?oggetto=newsletter" className="horeca-footer-newsletter-cta">
            <Send className="h-4 w-4" strokeWidth={2.3} />
            Richiedi iscrizione
          </Link>

          <div className="horeca-footer-social-wrap">
            <p className="horeca-footer-social-label">Seguici</p>
            <div className="horeca-footer-social-icons">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="horeca-footer-social-link"
                >
                  <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="horeca-footer-main" aria-label="Link utili e contatti">
        <div className="horeca-footer-container horeca-footer-main-column">
          <div className="horeca-footer-links-grid">
            <section className="horeca-footer-link-column">
              <h4 className="horeca-footer-link-title">Restiamo in contatto</h4>
              <p className="horeca-footer-contact-legal">{companyInfo.legalEntity}</p>
              <p className="horeca-footer-contact-line">{companyInfo.address.street}</p>
              <p className="horeca-footer-contact-line">
                {companyInfo.address.cap} - {companyInfo.address.city} ({companyInfo.address.province}) Italia
              </p>
              <p className="horeca-footer-contact-line">
                Telefono <a href={`tel:${companyInfo.contacts.phone.replace(/\s+/g, '')}`}>{companyInfo.contacts.phone}</a>
              </p>
              <p className="horeca-footer-contact-line">
                Whatsapp{' '}
                <a href={`https://wa.me/${companyInfo.contacts.whatsapp.replace(/[^\d]/g, '')}`}>
                  {companyInfo.contacts.whatsapp}
                </a>
              </p>
              <p className="horeca-footer-contact-mail">
                <a href={`mailto:${companyInfo.contacts.email}`}>{companyInfo.contacts.email}</a>
              </p>
              <p className="horeca-footer-vat">P. IVA {companyInfo.vatNumber}</p>
            </section>

            <section className="horeca-footer-link-column">
              <h4 className="horeca-footer-link-title">Informazioni</h4>
              <ul className="horeca-footer-link-list">
                {infoLinks.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="horeca-footer-link-column">
              <h4 className="horeca-footer-link-title">I nostri prodotti</h4>
              <ul className="horeca-footer-link-list">
                {productLinks.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="horeca-footer-link-column">
              <h4 className="horeca-footer-link-title">Utilita</h4>
              <ul className="horeca-footer-link-list">
                {utilityLinks.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </footer>
  );
}
