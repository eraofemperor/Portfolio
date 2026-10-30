// Post-build validation: JSON-LD parses, one H1, unique titles, internal links resolve, sitemap coverage.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const toFile = (p) => (p.endsWith('/') ? p.slice(1) + 'index.html' : p.slice(1));
let problems = 0;
const titles = new Set();
const sitemap = rd('sitemap.xml');

for (const page of Object.values(PAGES)) {
  const f = toFile(page.path);
  const h = rd(f);
  const ld = [...h.matchAll(/ld\+json">([\s\S]*?)<\/script>/g)];
  ld.forEach((m) => JSON.parse(m[1]));
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  const title = h.match(/<title>(.*?)<\/title>/)[1];
  const canon = h.match(/rel="canonical" href="(.*?)"/)[1];
  if (h1 !== 1) { console.log('H1 count', f, h1); problems++; }
  if (titles.has(title)) { console.log('Duplicate title', f); problems++; }
  titles.add(title);
  if (!sitemap.includes(`<loc>${canon}</loc>`)) { console.log('Not in sitemap', canon); problems++; }
  for (const l of new Set([...h.matchAll(/href="(\/[^"#]*)/g)].map((m) => m[1]))) {
    if (!fs.existsSync(path.join(ROOT, toFile(l)))) { console.log('BROKEN LINK', f, l); problems++; }
  }
  const imgs = [...h.matchAll(/<img [^>]*>/g)].filter((m) => !/alt="[^"]+"/.test(m[0]));
  if (imgs.length) { console.log('Missing alt', f); problems++; }
  console.log(`${f}: h1=${h1} jsonld=${ld.length} title=${title.length}ch OK`);
}
console.log(problems ? `PROBLEMS: ${problems}` : 'All checks passed');
process.exit(problems ? 1 : 0);
