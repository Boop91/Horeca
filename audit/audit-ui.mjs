import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const url = process.argv[2];
if (!url) {
  console.error('USO: node audit/audit-ui.mjs http://127.0.0.1:3000');
  process.exit(2);
}

const outDir = path.resolve('audit', 'out');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

// Punto chiave: creare un contesto esplicito, poi la pagina DAL contesto
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(url, { waitUntil: 'load', timeout: 120_000 });

const results = await new AxeBuilder({ page }).analyze();

const safeName = url.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
const outFile = path.join(outDir, `axe_${safeName}.json`);

await fs.writeFile(outFile, JSON.stringify(results, null, 2), 'utf8');

await page.close();
await context.close();
await browser.close();

console.log(`OK: report salvato in ${outFile}`);
