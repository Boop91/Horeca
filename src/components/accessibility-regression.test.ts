// @vitest-environment node

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function readSource(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

describe('Accessibility regression checks', () => {
  it('mantiene skip link globale e target di contenuto principale', () => {
    const globalsSource = readSource('src/styles/globals.css');
    const layoutSource = readSource('src/components/Layout.tsx');
    const homeSource = readSource('src/components/home_v2/HomeV2Page.tsx');

    expect(globalsSource).toContain('.skip-link');
    expect(layoutSource).toContain('href="#main-content"');
    expect(layoutSource).toContain('id="main-content"');
    expect(homeSource).toContain('href="#home-main-content"');
    expect(homeSource).toContain('id="home-main-content"');
  });

  it('assicura label associate e validazione accessibile nel form contatti', () => {
    const contactSource = readSource('src/pages/ContactPage.tsx');

    expect(contactSource).toContain('htmlFor="contact-full-name"');
    expect(contactSource).toContain('id="contact-full-name"');
    expect(contactSource).toContain('htmlFor="contact-email"');
    expect(contactSource).toContain('id="contact-email"');
    expect(contactSource).toContain('htmlFor="contact-subject"');
    expect(contactSource).toContain('id="contact-subject"');
    expect(contactSource).toContain('htmlFor="contact-message"');
    expect(contactSource).toContain('id="contact-message"');
    expect(contactSource).toContain('aria-invalid={Boolean(errors.fullName)}');
    expect(contactSource).toContain('aria-invalid={Boolean(errors.email)}');
    expect(contactSource).toContain('aria-invalid={Boolean(errors.subject)}');
    expect(contactSource).toContain('aria-invalid={Boolean(errors.message)}');
  });

  it('traccia submit contatti in caso di successo ed errore', () => {
    const contactSource = readSource('src/pages/ContactPage.tsx');
    const telemetrySource = readSource('src/lib/uxTelemetry.ts');

    expect(contactSource).toContain("trackUxEvent('contact_submit_error'");
    expect(contactSource).toContain("trackUxEvent('contact_submit_success'");
    expect(telemetrySource).toContain("| 'contact_submit_error'");
    expect(telemetrySource).toContain("| 'contact_submit_success'");
  });
});

