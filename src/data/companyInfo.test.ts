// @vitest-environment node
/**
 * @file companyInfo.test.ts
 * @description Test per i dati aziendali di BianchiPro.
 *
 * Verifica che i dati aziendali reali siano completi e corretti:
 *   - Ragione sociale, P.IVA, nome commerciale
 *   - Indirizzo completo (via, città, CAP, provincia)
 *   - Contatti (telefono, email, WhatsApp)
 *   - Informazioni spedizioni e pagamenti
 */

import { companyInfo } from './companyInfo';

describe('companyInfo — dati aziendali BianchiPro', () => {
  it('ha il nome commerciale corretto', () => {
    expect(companyInfo.tradeName).toBe('BianchiPro');
  });

  it('ha la ragione sociale legale', () => {
    expect(companyInfo.legalEntity).toBe('OMNIA SRL Unipersonale');
  });

  it('ha la Partita IVA corretta', () => {
    expect(companyInfo.vatNumber).toBe('IT03434940403');
  });

  it('ha l\'indirizzo completo', () => {
    expect(companyInfo.address.street).toBeTruthy();
    expect(companyInfo.address.city).toBe('Santarcangelo di Romagna');
    expect(companyInfo.address.cap).toBe('47822');
    expect(companyInfo.address.province).toBe('Rimini');
  });

  it('ha i contatti configurati', () => {
    expect(companyInfo.contacts.phone).toContain('+39');
    expect(companyInfo.contacts.email).toContain('@');
    expect(companyInfo.contacts.whatsapp).toBeTruthy();
  });

  it('ha i metodi di pagamento', () => {
    expect(companyInfo.payment.methods.length).toBeGreaterThan(0);
    expect(companyInfo.payment.cards.length).toBeGreaterThan(0);
  });

  it('ha i corrieri di spedizione', () => {
    expect(companyInfo.shipping.carriers.length).toBeGreaterThan(0);
    expect(companyInfo.shipping.carriers).toContain('SDA');
    expect(companyInfo.shipping.carriers).toContain('GLS');
  });

  it('ha la garanzia professionale di 12 mesi', () => {
    expect(companyInfo.warranty.professional).toBe('12 mesi');
  });

  it('ha le informazioni sulla fatturazione', () => {
    expect(companyInfo.invoicing.electronic).toBe(true);
    expect(companyInfo.invoicing.mepa).toBe(false);
  });
});
