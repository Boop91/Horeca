/* ═══════════════════════════════════════════════════════════════════════════
 *  Header.tsx — Barra di navigazione principale con mega menu professionale
 *
 *  Struttura dell'header (dall'alto verso il basso):
 *    1. Linea sottile verde (2px) accento superiore
 *    2. Banner informativo P.IVA (sfondo verde-50, testo verde-800)
 *    3. Riga principale: Logo "BIANCHI PRO" + Ricerca (desktop) + Icone azione
 *    4. Barra categorie con mega menu al hover (desktop)
 *    5. Linea accento inferiore (verde-700)
 *
 *  Mega menu desktop:
 *    - Al HOVER su una categoria si apre un pannello bianco sotto la barra
 *    - Il pannello mostra i GRUPPI disposti in colonne
 *    - Ogni gruppo elenca le sue SEZIONI come link cliccabili
 *    - URL generato: /categoria/{cat-slug}/{group-slug}/{section-slug}
 *    - Ritardo di 150ms prima della chiusura (anti-flicker)
 *
 *  Menu mobile:
 *    - Hamburger apre overlay a schermo intero
 *    - Accordion: tap su categoria espande i gruppi
 *    - Tap su gruppo espande le sezioni
 *    - Una sola categoria aperta alla volta (principio Baymard)
 *    - Barra di ricerca sempre visibile in cima al menu mobile
 *
 *  Palette colori (dalla pagina abbattitore):
 *    - Verde CTA: bg-green-500 / hover:bg-green-600
 *    - Blu secondario: text-[#6B9BD1] / bg-[#E3F0FC]
 *    - Testi: text-gray-900, text-gray-800, text-gray-600, text-gray-500
 *    - Bordi: border-gray-200, border-gray-300
 *    - Focus: focus:border-green-400 focus:ring-green-200
 *    - Sfondi: white, bg-gray-50
 *    - MAI usare emerald o slate
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Flame,
  Snowflake,
  ChefHat,
  Package,
  Hotel,
  ShieldPlus,
  Wrench,
  ChevronDown,
  ChevronRight,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { catalogMenu } from '../data/catalogMenu';
import type { CatalogMenuItem, CatalogGroup } from '../data/catalogMenu';

/* ── Interfaccia delle props del componente Header ── */
interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
}

/* ══════════════════════════════════════════════════════════════════════════
 *  Mappa icone: associa ogni chiave di categoria a un'icona Lucide
 * ══════════════════════════════════════════════════════════════════════════ */
const iconByKey: Record<string, typeof Flame> = {
  'linea-caldo': Flame,
  'linea-freddo': Snowflake,
  preparazione: ChefHat,
  'carrelli-arredo': Package,
  hotellerie: Hotel,
  igiene: ShieldPlus,
  ricambi: Wrench,
  'seconda-scelta': Package,
};

/* ══════════════════════════════════════════════════════════════════════════
 *  Componente Header principale
 *  Gestisce: navigazione catalogo, ricerca, account, preferiti, carrello
 * ══════════════════════════════════════════════════════════════════════════ */
export default function Header({
  cartItemCount,
  onCartClick,
  favoritesCount,
  onFavoritesClick,
}: HeaderProps) {
  /* ── Hook di contesto e navigazione ── */
  const { user, logout } = useAuth();
  const { setAuthModalOpen } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  /* ══════════════════════════════════════════════════════════════════════
   *  Stato dell'interfaccia
   * ══════════════════════════════════════════════════════════════════════ */

  /* Dropdown del menu utente (account) */
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /* Chiave della categoria attiva nel mega menu desktop (null = chiuso) */
  const [activeCatalogKey, setActiveCatalogKey] = useState<string | null>(null);

  /* Stato del menu mobile (aperto/chiuso) */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Accordion mobile: quale categoria e quale gruppo sono espansi */
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);

  /* ── Riferimenti DOM ── */
  const headerRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ══════════════════════════════════════════════════════════════════════
   *  Effetti collaterali (useEffect)
   * ══════════════════════════════════════════════════════════════════════ */

  /* Chiudi tutti i menu quando l'utente clicca fuori dall'header */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false);
        setActiveCatalogKey(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Chiudi il menu mobile e resetta gli stati quando cambia la rotta */
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileExpandedCat(null);
    setMobileExpandedGroup(null);
    setActiveCatalogKey(null);
  }, [location.pathname]);

  /* Pulisci il timeout del mega menu quando il componente viene smontato */
  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    };
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
   *  Ruoli utente: determina il tipo di account per lo stile visivo
   * ══════════════════════════════════════════════════════════════════════ */
  const isPro = user?.role === 'pro';
  const isAdmin = user?.role === 'admin';

  /* ══════════════════════════════════════════════════════════════════════
   *  Mega menu desktop: gestione hover con ritardo anti-flicker
   *
   *  - handleCategoryEnter: apre immediatamente il mega menu
   *  - handleCategoryLeave: ritardo di 150ms prima di chiudere
   *  - handleMegaMenuEnter: cancella il timeout (il menu resta aperto)
   *  - handleMegaMenuLeave: chiude il mega menu
   * ══════════════════════════════════════════════════════════════════════ */

  /* Recupera l'oggetto della categoria attiva per renderizzare il pannello */
  const activeCatalog: CatalogMenuItem | null =
    catalogMenu.find((item) => item.key === activeCatalogKey) ?? null;

  /* Apertura immediata del mega menu sulla categoria */
  const handleCategoryEnter = useCallback((key: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setActiveCatalogKey(key);
  }, []);

  /* Chiusura ritardata (150ms) per dare tempo all'utente di raggiungere il pannello */
  const handleCategoryLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveCatalogKey(null);
    }, 150);
  }, []);

  /* Il mouse e' entrato nel pannello: cancella la chiusura */
  const handleMegaMenuEnter = useCallback(() => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
  }, []);

  /* Il mouse ha lasciato il pannello: chiudi il mega menu */
  const handleMegaMenuLeave = useCallback(() => {
    setActiveCatalogKey(null);
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
   *  Handler per le azioni utente
   * ══════════════════════════════════════════════════════════════════════ */

  /* Click sull'icona account: apre il dropdown se loggato, altrimenti apre il modale auth */
  const handleAccountClick = () => {
    if (user) {
      setUserMenuOpen(!userMenuOpen);
    } else {
      setAuthModalOpen(true);
    }
  };

  /* ══════════════════════════════════════════════════════════════════════
   *  Accordion mobile: toggle delle categorie e dei gruppi
   *  Solo una categoria alla volta puo' essere espansa (principio UX)
   * ══════════════════════════════════════════════════════════════════════ */

  /* Espande/chiude una categoria nel menu mobile */
  const toggleMobileCat = (key: string) => {
    if (mobileExpandedCat === key) {
      setMobileExpandedCat(null);
      setMobileExpandedGroup(null);
    } else {
      setMobileExpandedCat(key);
      setMobileExpandedGroup(null);
    }
  };

  /* Espande/chiude un gruppo dentro la categoria mobile espansa */
  const toggleMobileGroup = (slug: string) => {
    setMobileExpandedGroup(mobileExpandedGroup === slug ? null : slug);
  };

  /* ══════════════════════════════════════════════════════════════════════
   *  RENDER — Struttura completa dell'header
   * ══════════════════════════════════════════════════════════════════════ */
  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white shadow-md">
      {/* ══════════════════════════════════════════════════════════════════
       *  LINEA 1 — Accento superiore verde (2px)
       * ══════════════════════════════════════════════════════════════════ */}
      <div className="h-[2px] bg-green-500" />

      {/* ══════════════════════════════════════════════════════════════════
       *  RIGA 2 — Banner informativo "Vendita riservata a P.IVA"
       *  Sfondo verde chiaro (green-50), testo green-800, font piccolo
       * ══════════════════════════════════════════════════════════════════ */}
      <div className="border-b border-gray-200 bg-green-50 py-1.5 text-center text-[11px] font-semibold tracking-wide text-green-800">
        Vendita riservata a possessori di Partita IVA
      </div>

      {/* ══════════════════════════════════════════════════════════════════
       *  RIGA 3 — Barra principale: Logo | Ricerca | Icone utente
       *  Sfondo bianco, layout flex con logo a sinistra, ricerca al centro,
       *  icone a destra. Su mobile il hamburger appare a sinistra.
       * ══════════════════════════════════════════════════════════════════ */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* ── Pulsante hamburger — visibile solo su mobile ── */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-600 hover:text-gray-900 md:hidden"
              aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* ── Logo "BIANCHI PRO" — cliccabile, porta alla home ── */}
            <Link
              to="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              {/* Icona circolare verde con la lettera B */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 shadow-sm">
                <span className="text-base font-bold text-white">B</span>
              </div>
              {/* Nome del brand */}
              <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                BIANCHI PRO
              </span>
            </Link>

            {/* ── Barra di ricerca — prominente, solo desktop (lg+) ── */}
            <div className="mx-4 hidden flex-1 items-center lg:flex" style={{ maxWidth: '480px' }}>
              <div className="relative w-full">
                {/* Icona lente dentro il campo */}
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca prodotti, categorie, marchi..."
                  className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-24 text-sm font-medium text-gray-800 placeholder-gray-400 transition-colors focus:border-green-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                {/* Pulsante "Cerca" interno al campo */}
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-green-500 px-5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-600">
                  Cerca
                </button>
              </div>
            </div>

            {/* ── Icone azioni utente: Account, Preferiti, Carrello ── */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Pulsante account — colore diverso per ruolo utente */}
              <button
                onClick={handleAccountClick}
                className={`relative flex items-center justify-center rounded-full p-2 transition-colors ${
                  user
                    ? isPro
                      ? 'text-amber-600 hover:bg-amber-50'
                      : isAdmin
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-green-600 hover:bg-green-50'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                aria-label="Account"
              >
                <User className="h-5 w-5" />
                {/* Pallino verde: indica che l'utente e' loggato */}
                {user && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                )}
              </button>

              {/* Pulsante preferiti — cuore pieno se ci sono favoriti */}
              <button
                onClick={onFavoritesClick}
                className="relative p-2 text-gray-500 transition-colors hover:text-gray-900"
                aria-label="Preferiti"
              >
                <Heart
                  className={`h-5 w-5 ${
                    favoritesCount > 0 ? 'fill-rose-400 text-rose-500' : ''
                  }`}
                />
                {/* Badge con il conteggio dei preferiti */}
                {favoritesCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Pulsante carrello — badge verde con il conteggio articoli */}
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-500 transition-colors hover:text-gray-900"
                aria-label="Carrello"
              >
                <ShoppingCart className="h-5 w-5" />
                {/* Badge con il conteggio degli articoli nel carrello */}
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-green-500 px-1 text-xs font-bold text-white shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* ── Dropdown menu utente (posizione assoluta) ── */}
            {userMenuOpen && user && (
              <div className="absolute right-4 top-[88px] z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                {/* Intestazione colorata in base al ruolo */}
                <div
                  className={`p-3 ${
                    isPro
                      ? 'bg-amber-50'
                      : isAdmin
                        ? 'bg-gray-50'
                        : 'bg-green-50'
                  }`}
                >
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {isPro ? 'Account Pro' : isAdmin ? 'Admin' : 'Cliente'}
                  </p>
                </div>
                {/* Voci del menu utente */}
                <div className="p-1">
                  {/* Link al profilo */}
                  <Link
                    to="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 text-gray-500" />
                    Il mio account
                  </Link>
                  {/* Link admin — visibile solo per gli admin */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                    >
                      <Shield className="h-4 w-4 text-gray-500" />
                      Pannello Admin
                    </Link>
                  )}
                  {/* Pulsante logout */}
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Esci
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
       *  RIGA 4 — Barra di navigazione catalogo (DESKTOP)
       *
       *  Sfondo scuro (gray-900) con testo bianco per le categorie.
       *  Le categorie sono disposte orizzontalmente con icona e freccia.
       *  Al hover sulla categoria si apre il mega menu a dropdown.
       * ══════════════════════════════════════════════════════════════════ */}
      <nav className="hidden bg-gray-900 md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-0">
            {catalogMenu.map(({ key, label }) => {
              const Icon = iconByKey[key] || Package;
              const isActive = activeCatalogKey === key;

              return (
                <li
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleCategoryEnter(key)}
                  onMouseLeave={handleCategoryLeave}
                >
                  {/* Link cliccabile della categoria — porta alla pagina categoria */}
                  <Link
                    to={`/categoria/${key}`}
                    onClick={() => setActiveCatalogKey(null)}
                    className={`inline-flex items-center gap-1.5 px-4 py-3 text-[13px] font-semibold uppercase tracking-wide transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-green-500 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        isActive ? 'rotate-180' : ''
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
       *  MEGA MENU DESKTOP — Pannello dropdown
       *
       *  Si apre sotto la barra categorie quando activeCatalog non e' null.
       *  Contiene:
       *    - Intestazione con titolo categoria + link "Vedi tutto"
       *    - Griglia di colonne: ogni colonna e' un GRUPPO
       *    - Dentro ogni gruppo: lista delle SEZIONI come link
       *
       *  Il pannello cattura gli eventi mouse per restare aperto quando
       *  l'utente sposta il cursore dalla barra al pannello.
       * ══════════════════════════════════════════════════════════════════ */}
      {activeCatalog && (
        <div
          className="absolute left-0 right-0 z-40 hidden border-b border-gray-200 bg-white shadow-lg md:block"
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            {/* ── Intestazione del mega menu: titolo + descrizione + link ── */}
            <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {activeCatalog.label}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {activeCatalog.description}
                </p>
              </div>
              {/* Link "Vedi tutto" per navigare all'intera categoria */}
              <Link
                to={`/categoria/${activeCatalog.slug}`}
                onClick={() => setActiveCatalogKey(null)}
                className="whitespace-nowrap text-xs font-semibold text-[#6B9BD1] transition-colors hover:text-[#5A8AC0] hover:underline"
              >
                Vedi tutto &rarr;
              </Link>
            </div>

            {/* ── Griglia dei gruppi — layout multi-colonna responsivo ── */}
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeCatalog.groups.map((group: CatalogGroup) => (
                <div key={group.slug}>
                  {/* Titolo del gruppo — link alla pagina del gruppo */}
                  <Link
                    to={`/categoria/${activeCatalog.slug}/${group.slug}`}
                    onClick={() => setActiveCatalogKey(null)}
                    className="inline-block border-b-2 border-green-500 pb-1 text-sm font-bold text-gray-900 transition-colors hover:text-green-600"
                  >
                    {group.title}
                  </Link>

                  {/* Lista delle sezioni (sottocategorie) del gruppo */}
                  <ul className="mt-2.5 space-y-1">
                    {group.sections.map((section) => (
                      <li key={section.slug}>
                        <Link
                          to={`/categoria/${activeCatalog.slug}/${group.slug}/${section.slug}`}
                          onClick={() => setActiveCatalogKey(null)}
                          className="block py-0.5 text-[13px] text-gray-600 transition-all hover:pl-1 hover:text-green-600"
                        >
                          {section.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
       *  LINEA 5 — Accento inferiore verde-700 (sottile)
       * ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden h-[2px] bg-green-700 md:block" />

      {/* ══════════════════════════════════════════════════════════════════
       *  MENU MOBILE — Overlay a schermo intero con accordion
       *
       *  Visibile solo quando mobileMenuOpen e' true e sotto il breakpoint md.
       *  Struttura:
       *    1. Barra di ricerca (sempre visibile in cima)
       *    2. Lista categorie con accordion a 2 livelli
       *       - Tap su categoria: espande/chiude i gruppi
       *       - Tap su gruppo: espande/chiude le sezioni
       *    3. Link secondari in fondo (Guide, Chi Siamo, ecc.)
       *
       *  Principio UX: solo una categoria alla volta puo' essere espansa
       *  per evitare sovraccarico cognitivo (Baymard).
       * ══════════════════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div className="max-h-[85vh] overflow-y-auto border-t border-gray-200 bg-white shadow-lg md:hidden">
          <div className="space-y-1 p-4">
            {/* ── Barra di ricerca mobile ── */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca prodotti, categorie, marchi..."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            {/* ── Lista categorie con accordion ── */}
            {catalogMenu.map(({ key, label, slug, groups }) => {
              const Icon = iconByKey[key] || Package;
              const isCatExpanded = mobileExpandedCat === key;

              return (
                <div
                  key={key}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  {/* Riga della categoria: tap per espandere/chiudere */}
                  <button
                    onClick={() => toggleMobileCat(key)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                      isCatExpanded
                        ? 'bg-green-50 text-green-800'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 ${
                          isCatExpanded ? 'text-green-600' : 'text-gray-500'
                        }`}
                      />
                      {label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isCatExpanded
                          ? 'rotate-180 text-green-600'
                          : 'text-gray-500'
                      }`}
                    />
                  </button>

                  {/* Contenuto espanso: gruppi della categoria */}
                  {isCatExpanded && (
                    <div className="pb-2 pl-4">
                      {/* Link rapido per vedere tutta la categoria */}
                      <Link
                        to={`/categoria/${slug}`}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#6B9BD1] hover:text-[#5A8AC0]"
                      >
                        Vedi tutto {label} &rarr;
                      </Link>

                      {/* Elenco dei gruppi con sotto-accordion */}
                      {groups.map((group) => {
                        const isGroupExpanded =
                          mobileExpandedGroup === group.slug;

                        return (
                          <div key={group.slug}>
                            {/* Riga del gruppo: tap per espandere le sezioni */}
                            <button
                              onClick={() => toggleMobileGroup(group.slug)}
                              className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isGroupExpanded
                                  ? 'bg-gray-50 text-gray-900'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {group.title}
                              <ChevronRight
                                className={`h-3.5 w-3.5 text-gray-500 transition-transform ${
                                  isGroupExpanded ? 'rotate-90' : ''
                                }`}
                              />
                            </button>

                            {/* Sezioni del gruppo — terzo livello di navigazione */}
                            {isGroupExpanded && (
                              <div className="pb-1 pl-4">
                                {group.sections.map((section) => (
                                  <Link
                                    key={section.slug}
                                    to={`/categoria/${slug}/${group.slug}/${section.slug}`}
                                    className="block px-3 py-1.5 text-xs text-gray-600 transition-colors hover:text-green-600"
                                  >
                                    {section.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── Separatore e link secondari ── */}
            <div className="my-2 h-px bg-gray-200" />
            <Link
              to="/guide"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-green-600"
            >
              Guide
            </Link>
            <Link
              to="/chi-siamo"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-green-600"
            >
              Chi Siamo
            </Link>
            <Link
              to="/contatti"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-green-600"
            >
              Contatti
            </Link>
            <Link
              to="/faq"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-green-600"
            >
              FAQ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
