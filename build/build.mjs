// Static site generator: node build/build.mjs
// Outputs real HTML pages (no JS needed to read content), sitemap, robots, llms.txt and WebP images.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { DOMAIN, BUILD_DATE, PERSON, PROJECTS, FAQS, HOME_FAQS, ABOUT_FAQS, RESUME_FAQS, CORE_KEYWORDS, ARTICLES, PAGES, INDEXNOW_KEY, BING_VERIFICATION, EXPERIENCE, EDUCATION, CERTIFICATES, SKILLS_CATEGORIES } from './site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (p) => DOMAIN + p;
const write = (rel, content) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
};
const errors = [];
const warns = [];

/* ------------------------------ images ------------------------------ */
async function buildImages() {
  const src = path.join(ROOT, 'assets/akhil-profile.jpg');
  const tmp = fs.readFileSync(src); // read into memory so we can safely overwrite
  await sharp(tmp).resize(500, 625, { fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(path.join(ROOT, 'assets/akhil-profile-500.webp'));
  await sharp(tmp).resize(250, 312, { fit: 'cover', position: 'top' }).webp({ quality: 78 }).toFile(path.join(ROOT, 'assets/akhil-profile-250.webp'));
  // Social preview must stay JPEG/PNG for crawlers; right-sized to 1200x630.
  await sharp(tmp).resize(1200, 630, { fit: 'cover', position: 'top' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(ROOT, 'assets/akhil-og-image.tmp.jpg'));
  fs.renameSync(path.join(ROOT, 'assets/akhil-og-image.tmp.jpg'), path.join(ROOT, 'assets/akhil-og-image.jpg'));
  await sharp(tmp).resize(500, 625, { fit: 'inside' }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(ROOT, 'assets/akhil-profile-500.jpg'));
  // PWA icons referenced by manifest.json
  for (const s of [192, 512]) {
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2563EB"/><stop offset="1" stop-color="#0D9488"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#g)"/><path d="M6 22l6-8 5 4 9-11" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="26" cy="7" r="3" fill="#F59E0B"/></svg>`);
    await sharp(svg).png().toFile(path.join(ROOT, `assets/icon-${s}.png`));
  }
  // Project thumbnails (WebP). A real screenshot dropped into assets/screenshots/<slug>.(png|jpg|webp)
  // is used automatically; otherwise a schematic built only from published figures is generated.
  for (const p of PROJECTS) {
    const shot = ['png', 'jpg', 'jpeg', 'webp'].map((e) => path.join(ROOT, `assets/screenshots/${p.slug}.${e}`)).find((f) => fs.existsSync(f));
    const input = shot ? fs.readFileSync(shot) : Buffer.from(thumbSvg(p.slug));
    for (const w of [320, 640]) {
      await sharp(input).resize(w, Math.round((w * 9) / 16), { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(path.join(ROOT, `assets/thumb-${p.slug}-${w}.webp`));
    }
  }
}

function thumbSvg(slug) {
  const bg = '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EFF6FF"/><stop offset="1" stop-color="#F0FDFA"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/>';
  const wrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" font-family="Arial, Helvetica, sans-serif">${bg}${inner}</svg>`;
  if (slug === 'kerala-road-accident-analysis') {
    return wrap(`<text x="32" y="58" font-size="21" font-weight="700" fill="#0F172A">Kerala road accidents &#183; 34,500+ crash records</text>
<rect x="32" y="96" width="276" height="170" rx="16" fill="#fff" stroke="#BFDBFE" stroke-width="2"/><text x="170" y="180" text-anchor="middle" font-size="56" font-weight="800" fill="#2563EB">29.1%</text><text x="170" y="216" text-anchor="middle" font-size="15" fill="#475569">of fatal crashes in 2 districts</text>
<rect x="332" y="96" width="276" height="170" rx="16" fill="#fff" stroke="#99F6E4" stroke-width="2"/><text x="470" y="180" text-anchor="middle" font-size="56" font-weight="800" fill="#0F766E">+64.2%</text><text x="470" y="216" text-anchor="middle" font-size="15" fill="#475569">night fatality severity ratio</text>
<text x="32" y="320" font-size="16" fill="#475569">SQL window functions &#183; Power BI &#183; Pandas</text>`);
  }
  if (slug === 'datasentrix') {
    const steps = ['Upload', 'Validate', 'Drop nulls', 'Z-score', 'KPI report'];
    const boxes = steps.map((s, i) => `<rect x="${30 + i * 120}" y="150" width="100" height="64" rx="12" fill="#fff" stroke="${i === 4 ? '#0D9488' : '#2563EB'}" stroke-width="2"/><text x="${80 + i * 120}" y="188" text-anchor="middle" font-size="14" font-weight="700" fill="#0F172A">${s}</text>${i < 4 ? `<path d="M${132 + i * 120} 182h16" stroke="#2563EB" stroke-width="2"/>` : ''}`).join('');
    return wrap(`<text x="32" y="58" font-size="21" font-weight="700" fill="#0F172A">Datasentrix &#183; automated data cleaning pipeline</text>${boxes}<text x="32" y="320" font-size="16" fill="#475569">Python &#183; Django &#183; SQL</text>`);
  }
  const bars = [90, 140, 110, 170, 130, 190].map((h, i) => `<rect x="${44 + i * 40}" y="${290 - h}" width="26" height="${h}" rx="4" fill="${i % 2 ? '#0D9488' : '#2563EB'}" opacity=".85"/>`).join('');
  const kpis = ['Revenue', 'Gross margin', 'Regions'].map((k, i) => `<rect x="${320 + i * 100}" y="96" width="88" height="64" rx="10" fill="#fff" stroke="#BFDBFE" stroke-width="2"/><text x="${364 + i * 100}" y="134" text-anchor="middle" font-size="13" font-weight="700" fill="#0F172A">${k}</text>`).join('');
  return wrap(`<text x="32" y="58" font-size="21" font-weight="700" fill="#0F172A">Bike sales &#183; Excel dashboard</text>${kpis}<rect x="320" y="184" width="288" height="104" rx="12" fill="#fff" stroke="#E2E8F0" stroke-width="2"/><path d="M340 262l50-34 50 20 60-48 50 14 40-30" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${bars}<text x="32" y="326" font-size="16" fill="#475569">Pivot tables &#183; XLOOKUP &#183; Slicers</text>`);
}

/* ------------------------------ schema ------------------------------ */
const personNode = () => ({
  '@type': 'Person',
  '@id': url('/#akhil'),
  name: PERSON.name,
  givenName: PERSON.givenName,
  familyName: PERSON.familyName,
  alternateName: PERSON.alternateNames,
  url: url('/'),
  image: url('/assets/akhil-profile-500.jpg'),
  email: PERSON.email,
  telephone: PERSON.phoneHref,
  jobTitle: 'Fresher Data Analyst, Business Intelligence Analyst & Business Analyst',
  description: PERSON.bio,
  nationality: { '@type': 'Country', name: 'India' },
  knowsLanguage: ['English'],
  address: { '@type': 'PostalAddress', addressLocality: PERSON.locality, addressRegion: PERSON.region, addressCountry: PERSON.country },
  homeLocation: { '@type': 'Place', name: 'Thiruvananthapuram, Kerala, India' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: PERSON.college },
    { '@type': 'CollegeOrUniversity', name: PERSON.university },
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'Master of Computer Applications (MCA) — Overall CGPA 8.48', recognizedBy: { '@type': 'CollegeOrUniversity', name: PERSON.university } },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'Bachelor of Computer Applications (BCA) — Overall CGPA 7.4', recognizedBy: { '@type': 'CollegeOrUniversity', name: PERSON.university } },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'Google AI Essentials', recognizedBy: { '@type': 'Organization', name: 'Coursera / Google' } },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'Prompt Engineering', recognizedBy: { '@type': 'Organization', name: 'Infosys Springboard' } },
  ],
  knowsAbout: [
    'SQL', 'SQL joins', 'SQL subqueries', 'CTEs', 'SQL window functions', 'SQL for data analysis',
    'Power BI', 'DAX', 'Star Schema', 'Power Query', 'KPI Dashboards',
    'Python', 'Python for data analysis', 'Pandas', 'NumPy', 'Matplotlib', 'Django',
    'Microsoft Excel', 'Advanced Excel', 'Excel dashboards', 'Pivot Tables', 'VLOOKUP', 'XLOOKUP', 'Google Sheets',
    'ETL', 'ETL Pipelines', 'Data Cleaning', 'Data Validation', 'Data Modeling', 'Exploratory Data Analysis',
    'Statistical Analysis', 'Variance Analysis', 'Root Cause Analysis', 'Cohort Analysis',
    'Data Storytelling', 'Data Visualization', 'Business Intelligence', 'Business Analysis', 'KPI Reporting', 'MIS Reporting',
    'PostgreSQL', 'MySQL', 'SQLite', 'ECharts', 'REST API Testing', 'Postman', 'Functional Testing', 'Quality Assurance',
  ],
  sameAs: [PERSON.github, PERSON.linkedin, ...PERSON.extraSameAs],
  hasOccupation: [
    { '@type': 'Occupation', name: 'Data Analyst', occupationLocation: { '@type': 'Country', name: 'India' }, skills: 'SQL, Power BI, Python, Microsoft Excel, Data Cleaning, ETL, EDA' },
    { '@type': 'Occupation', name: 'Business Intelligence Analyst', occupationLocation: { '@type': 'Country', name: 'India' }, skills: 'Power BI, DAX, Star Schema, KPI Dashboards, Data Modeling, SQL' },
    { '@type': 'Occupation', name: 'Business Analyst', occupationLocation: { '@type': 'Country', name: 'India' }, skills: 'KPI reporting, Variance Analysis, Requirements Gathering, SQL, Power BI, Excel' },
    { '@type': 'Occupation', name: 'Power BI Developer', occupationLocation: { '@type': 'Country', name: 'India' }, skills: 'Power BI, DAX Measures, Power Query, Slicers, Interactive Dashboards' },
  ],
  mainEntityOfPage: url('/about/'),
});
const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': url('/#website'),
  url: url('/'),
  name: 'Akhil Insights',
  alternateName: [`${PERSON.name} | Data Analytics & Business Intelligence`, 'Akhil Shibu Portfolio', 'Akhil Data Analyst Portfolio'],
  inLanguage: 'en',
  about: { '@id': url('/#akhil') },
  author: { '@id': url('/#akhil') },
  publisher: { '@id': url('/#akhil') },
  keywords: CORE_KEYWORDS.join(', '),
});
const webPageNode = (page, type = 'WebPage') => ({
  '@type': type,
  '@id': url(page.path) + '#webpage',
  url: url(page.path),
  name: page.title,
  description: page.description,
  inLanguage: 'en',
  isPartOf: { '@id': url('/#website') },
  about: { '@id': url('/#akhil') },
  author: { '@id': url('/#akhil') },
  dateModified: BUILD_DATE,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.speakable-text', '.answer-box', '.entity-statement'],
  },
});
const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url(p) })),
});
const faqNode = (page, faqs) => ({
  '@type': 'FAQPage',
  '@id': url(page.path) + '#faq',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a + (f.more ? ' ' + f.more : '') } })),
});

/* ------------------------------ layout ------------------------------ */
const NAV = [
  ['/', 'Home'],
  ['/about/', 'About'],
  ['/projects/', 'Projects'],
  ['/articles/', 'Articles'],
  ['/faq/', 'FAQ'],
  ['/about/#contact', 'Contact'],
];

function head(page, { graph, preload = '', ogType = 'website', extraKeywords = [] }) {
  if (page.title.length > 60) errors.push(`Title >60 (${page.title.length}): ${page.title}`);
  if (page.description.length > 155 || page.description.length < 140) errors.push(`Description ${page.description.length} chars (want 140-155): ${page.path}`);
  const kw = [...new Set([...extraKeywords, ...CORE_KEYWORDS])].join(', ');
  const profileMeta = ogType === 'profile'
    ? `\n  <meta property="profile:first_name" content="${PERSON.givenName}">\n  <meta property="profile:last_name" content="${PERSON.familyName}">\n  <meta property="profile:username" content="akhilshibu">`
    : '';
  const jsonld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="keywords" content="${esc(kw)}">
  <meta name="author" content="${PERSON.name}">${BING_VERIFICATION ? `\n  <meta name="msvalidate.01" content="${BING_VERIFICATION}">` : ''}
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="geo.region" content="IN-KL">
  <meta name="geo.placename" content="Thiruvananthapuram, Kerala, India">
  <meta name="geo.position" content="8.5241;76.9366">
  <meta name="ICBM" content="8.5241, 76.9366">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${url(page.path)}">
  <link rel="author" href="${DOMAIN}/about/">
  <link rel="me" href="${PERSON.github}">
  <link rel="me" href="${PERSON.linkedin}">
  <link rel="help" type="text/plain" title="LLM Context" href="/llms.txt">
  <link rel="icon" href="/assets/icon-192.png" type="image/png">
  <link rel="manifest" href="/manifest.json">
  <link rel="alternate" type="application/rss+xml" title="Akhil Insights RSS Feed" href="${DOMAIN}/feed.xml">

  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="Akhil Insights">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:url" content="${url(page.path)}">
  <meta property="og:image" content="${DOMAIN}/assets/akhil-og-image.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Akhil Shibu, Data Analyst and Power BI specialist from Kerala">
  <meta property="og:locale" content="en_IN">${profileMeta}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.description)}">
  <meta name="twitter:image" content="${DOMAIN}/assets/akhil-og-image.jpg">

  <link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/outfit-latin.woff2" as="font" type="font/woff2" crossorigin>
  <script>document.documentElement.classList.add('js')</script>
${preload}  <link rel="stylesheet" href="/css/style.css">

  <script type="application/ld+json">
${jsonld}
  </script>
</head>`;
}

// Pages that carry an on-page #contact section; Contact scrolls to it there, else links to the About page.
const HAS_CONTACT = new Set(['/', '/about/', '/faq/', '/resume/']);
// Home-page nav items that track the section currently in view (scroll-spy).
const SPY = { '/': 'home', '/projects/': 'projects', '/faq/': 'faq-teaser', '/about/#contact': 'contact' };

function header(current) {
  const links = NAV.map(([href, label]) => {
    const active = href === current ? ' active" aria-current="page' : '';
    const target = href === '/about/#contact' && HAS_CONTACT.has(current) ? '#contact' : href;
    const spy = current === '/' && SPY[href] ? ` data-section="${SPY[href]}"` : '';
    return `        <li><a class="nav-link${active}" href="${target}"${spy}>${label}</a></li>`;
  }).join('\n');
  return `<body>
  <a class="skip-link" href="#mainContent">Skip to main content</a>
  <header class="site-header">
    <nav class="container site-nav" aria-label="Main Navigation">
      <a class="nav-brand" href="/">
        <span class="brand-badge" aria-hidden="true"><svg viewBox="0 0 36 36" width="36" height="36" focusable="false"><defs><linearGradient id="bmk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2563EB"/><stop offset="1" stop-color="#0D9488"/></linearGradient></defs><rect width="36" height="36" rx="10" fill="url(#bmk)"/><text x="18" y="20" text-anchor="middle" font-family="Outfit, Inter, sans-serif" font-size="15" font-weight="800" fill="#fff" letter-spacing="-0.5">AS</text><path d="M8 28l6-4 5 2 9-6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/><circle cx="28" cy="20" r="2" fill="#F59E0B"/></svg></span>
        <span class="brand-text">Akhil Insights</span>
        <span class="brand-sub">Data Analyst</span>
      </a>
      <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="navMenu" aria-label="Toggle navigation menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <ul class="nav-menu" id="navMenu">
${links}
        <li><a class="nav-cta" href="/assets/Akhil_Shibu_Data_Analyst_CV.pdf" download>Resume</a></li>
      </ul>
    </nav>
  </header>
`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="container footer-inner">
      <div><strong>${PERSON.name}</strong> &middot; ${PERSON.role}</div>
      <nav class="footer-nav" aria-label="Footer Navigation">
        <a href="/about/">About Akhil Shibu</a>
        <a href="/resume/">Online resume</a>
        <a href="/projects/">Data analyst portfolio projects</a>
        <a href="/articles/">Articles</a>
        <a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a>
        <a href="/projects/datasentrix/">Datasentrix</a>
        <a href="/projects/bike-sales-dashboard/">Bike sales dashboard</a>
        <a href="/faq/">FAQ</a>
        <a href="${PERSON.github}" rel="me noopener">GitHub</a>
        <a href="${PERSON.linkedin}" rel="me noopener">LinkedIn</a>
      </nav>
      <div>&copy; <span id="currentYear">2026</span> ${PERSON.name}. All rights reserved.</div>
    </div>
    <div class="container"><p class="entity-statement">${PERSON.intro}</p></div>
  </footer>
  <a class="mobile-cta" href="/assets/Akhil_Shibu_Data_Analyst_CV.pdf" download>Download resume (PDF)</a>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
  <button id="backToTop" class="back-to-top" type="button" aria-label="Back to top">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
  </button>
  <script type="module" src="/js/main.js"></script>
</body>
</html>
`;
}

const breadcrumbHtml = (items) =>
  `<nav class="breadcrumb container" aria-label="Breadcrumb"><ol>${items
    .map(([n, p], i) => (i === items.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${p}">${esc(n)}</a></li>`))
    .join('')}</ol></nav>`;

const contactBlock = (id = 'contact') => `
    <section id="${id}" class="container">
      <div class="contact-card">
        <h2 class="contact-title">Contact Akhil Shibu</h2>
        <p class="contact-desc">Hiring a fresher data analyst, business analyst or Power BI developer, or need a freelance dashboard? Email is the fastest way to reach me.</p>
        <div class="contact-meta">
          <span>${PERSON.email}</span>
          <span>Thiruvananthapuram, Kerala, India</span>
        </div>
        <div class="hero-actions" style="justify-content:center;">
          <a class="btn btn-primary" href="mailto:${PERSON.email}">Send Email</a>
          <button type="button" class="btn btn-secondary" id="copyEmailBtn">Copy Email Address</button>
          <a class="btn btn-ghost" href="${PERSON.linkedin}" target="_blank" rel="me noopener noreferrer">LinkedIn</a>
          <a class="btn btn-ghost" href="${PERSON.github}" target="_blank" rel="me noopener noreferrer">GitHub</a>
        </div>
      </div>
    </section>`;

const faqHtml = (faqs, { open = false } = {}) =>
  `<div class="faq-list">\n${faqs
    .map((f) => {
      const words = f.a.split(/\s+/).length;
      if (words < 35 || words > 65) warns.push(`FAQ answer ${words} words: ${f.q}`);
      return `        <details class="faq-item"${open ? '' : ''}>
          <summary class="faq-trigger"><span>${esc(f.q)}</span><span class="faq-icon" aria-hidden="true">+</span></summary>
          <div class="faq-content">
            <p>${esc(f.a + (f.more ? ' ' + f.more : ''))}</p>${f.link ? `
            <p>Related: <a href="${f.link[0]}">${esc(f.link[1])}</a></p>` : ''}
          </div>
        </details>`;
    })
    .join('\n')}\n      </div>`;

/* ------------------------------ figures ------------------------------ */
function pipelineSvg(steps, label) {
  const w = 160, gap = 24, h = 84;
  const total = steps.length * w + (steps.length - 1) * gap;
  const boxes = steps
    .map((s, i) => {
      const x = i * (w + gap);
      return `<g><rect x="${x}" y="8" width="${w}" height="${h - 16}" rx="10" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5"/><text x="${x + w / 2}" y="${h / 2 + 3}" text-anchor="middle" font-size="13" font-weight="600" fill="#0f172a">${esc(s)}</text>${i < steps.length - 1 ? `<path d="M${x + w + 4} ${h / 2} h${gap - 8}" stroke="#0284c7" stroke-width="2" marker-end="url(#a)"/>` : ''}</g>`;
    })
    .join('');
  return `<figure class="case-figure"><div class="figure-scroll"><svg viewBox="0 0 ${total} ${h}" width="${total}" height="${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#0284c7"/></marker></defs>${boxes}</svg></div><figcaption>${esc(label)}</figcaption></figure>`;
}

// Only the two headline numbers from the analysis; no derived or invented values.
// Replace with real Power BI screenshots when available.
function keralaFigure() {
  const label = 'Key findings: 29.1% of fatal crashes occurred in Thiruvananthapuram and Ernakulam, and crashes between 20:00 and 04:00 had a 64.2% higher fatality severity ratio.';
  return `<figure class="case-figure"><svg viewBox="0 0 640 120" width="100%" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="310" height="110" rx="10" fill="#f0f9ff" stroke="#0284c7"/><text x="155" y="55" text-anchor="middle" font-size="38" font-weight="800" fill="#0284c7">29.1%</text><text x="155" y="85" text-anchor="middle" font-size="12" fill="#334155">of fatal crashes: Thiruvananthapuram + Ernakulam</text>
    <rect x="330" y="0" width="310" height="110" rx="10" fill="#eef2ff" stroke="#4f46e5"/><text x="485" y="55" text-anchor="middle" font-size="38" font-weight="800" fill="#4f46e5">+64.2%</text><text x="485" y="85" text-anchor="middle" font-size="12" fill="#334155">fatality severity ratio, 20:00-04:00 crashes</text>
  </svg><figcaption>${esc(label)}</figcaption></figure>`;
}

/* ------------------------------ pages ------------------------------ */
const projectCard = (p, i) => `
        <article class="project-card flagship reveal">
          <a class="project-thumb" href="/projects/${p.slug}/" tabindex="-1" aria-hidden="true">
            <img src="/assets/thumb-${p.slug}-640.webp" srcset="/assets/thumb-${p.slug}-320.webp 320w, /assets/thumb-${p.slug}-640.webp 640w" sizes="(max-width: 980px) 92vw, 380px" width="640" height="360" loading="lazy" decoding="async" alt="${esc(p.short)} case study preview">
          </a>
          <div class="project-body">
            <div class="project-badge-row"><span class="project-category">0${i + 1} &middot; ${esc(p.category)}</span></div>
            <h3 class="project-title"><a href="/projects/${p.slug}/">${esc(p.name)}</a></h3>
            <p class="project-summary">${esc(p.summary)}</p>
            <ul class="metric-row" aria-label="Outcomes">${p.metrics.map(([v, l]) => `<li><strong>${esc(v)}</strong><span>${esc(l)}</span></li>`).join('')}</ul>
          </div>
          <div class="project-foot">
            <div class="tech-pills">${p.tools.map((t) => `<span class="tech-pill">${esc(t)}</span>`).join('')}</div>
            <div class="project-links">
              <a class="btn btn-sm btn-primary" href="/projects/${p.slug}/">Case study<span class="sr-only">: ${esc(p.short)}</span></a>
              <a class="btn btn-sm btn-secondary" href="${p.repo}" target="_blank" rel="noopener noreferrer">${esc(p.repoLabel)}<span class="sr-only"> for ${esc(p.short)} (opens in a new tab)</span></a>
            </div>
          </div>
        </article>`;

const icon = (d) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
const ICONS = {
  target: icon('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>'),
  search: icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  clean: icon('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'),
  transform: icon('<path d="M4 7h12l-3-3M20 17H8l3 3"/>'),
  database: icon('<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'),
  chart: icon('<path d="M5 20V11M11 20V4M17 20v-6M3 20h18"/>'),
  diagnose: icon('<path d="M7 3v6a4 4 0 0 0 8 0V3M5 3h4M13 3h4M11 13v2a4 4 0 0 0 8 0v-1"/><circle cx="19" cy="12" r="2"/>'),
  flag: icon('<path d="M5 21V4M5 4h12l-2.5 4L17 12H5"/>'),
};

const WORKFLOW = [
  ['01 &middot; UNDERSTAND', 'Business Objective', 'Clarify stakeholder KPIs, decision bottlenecks and success criteria.', 'target'],
  ['02 &middot; INSPECT', 'Schema &amp; Quality', 'Audit raw schemas, data types, cardinality, nulls and duplicates.', 'search'],
  ['03 &middot; CLEAN', 'Validation', 'Apply validation rules, impute or drop invalid records, isolate outliers.', 'clean'],
  ['04 &middot; TRANSFORM', 'Feature Engineering', 'Build calculated dimensions, time lags and star schemas.', 'transform'],
  ['05 &middot; ANALYZE', 'SQL &amp; Modeling', 'Run multi-level aggregations, window ranks and variance checks.', 'database'],
  ['06 &middot; VISUALIZE', 'BI Dashboarding', 'Build dashboards with slicers and drill-downs.', 'chart'],
  ['07 &middot; DIAGNOSE', 'Root Cause', 'Separate seasonal noise from structural shifts.', 'diagnose'],
  ['08 &middot; ACT', 'Recommendation', 'Turn findings into prioritised operational decisions.', 'flag'],
];

const CERTS = CERTIFICATES.map((c) => [c.title, c.issuer]);

function homePage() {
  const page = PAGES.home;
  const graph = [websiteNode(), webPageNode(page), personNode()];
  const hero = `
  <main id="mainContent">
    <section id="home" class="hero-section container">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="hero-status-pill"><span class="pulse-indicator"></span><span>MCA 2026 (CGPA 8.48) &middot; Open to Data Analyst &amp; Business Analyst roles</span></div>
          <h1 class="hero-title">${PERSON.name} <span class="accent-text">&mdash; Fresher Data Analyst &amp; Power BI Developer</span></h1>
          <p class="hero-value speakable-text">I turn messy business data into clean datasets, KPIs and dashboards that managers can act on.</p>
          <ul class="hero-stats" aria-label="Portfolio highlights">
            <li><strong>34,500+</strong><span>crash records analysed</span></li>
            <li><strong>200,000</strong><span>rows tested in DataSentrix</span></li>
            <li><strong>8.48 CGPA</strong><span>MCA 2026 &middot; Kerala Univ</span></li>
          </ul>
          <div class="hero-actions">
            <a class="btn btn-cta" href="/projects/">View case studies</a>
            <a class="btn btn-secondary" href="/assets/Akhil_Shibu_Data_Analyst_CV.pdf" download>Download resume</a>
            <a class="btn btn-ghost" href="#contact">Contact Akhil</a>
          </div>
          <p class="hero-description">${PERSON.bio} <strong>Akhil Insights</strong> is my portfolio of case studies: raw, messy business records turned into cleaned datasets, KPIs and dashboards that support real decisions.</p>
          <p class="hero-location"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-right:4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Akhilandom, Puthukkari, Chirayinkeezhu, Kerala &middot; Open to Technopark, Infopark Kochi, pan-India and remote roles</p>
        </div>

        <div class="hero-visual">
          <figure class="hero-photo">
            <picture>
              <source type="image/webp" srcset="/assets/akhil-profile-250.webp 250w, /assets/akhil-profile-500.webp 500w" sizes="(max-width: 980px) 240px, 380px">
              <img src="/assets/akhil-profile-500.jpg" alt="Portrait of Akhil Shibu, fresher data analyst and Power BI specialist from Kerala" width="500" height="625" fetchpriority="high" decoding="async">
            </picture>
          </figure>
          <a class="hero-findings" href="/projects/kerala-road-accident-analysis/">
            <span class="hf-tag">Featured case study</span>
            <span class="hf-grid"><span><strong>29.1%</strong>of fatal crashes in 2 districts</span><span><strong>+64.2%</strong>night-time fatality severity</span></span>
            <span class="hf-link">Kerala road accident analysis &rarr;</span>
          </a>
        </div>
      </div>
    </section>

    <section class="glance container" aria-labelledby="glanceTitle">
      <h2 id="glanceTitle" class="sr-only">At a glance</h2>
      <dl class="glance-grid reveal">
        <div><dt>Location</dt><dd>Chirayinkeezhu, Kerala &middot; open to relocation</dd></div>
        <div><dt>Availability</dt><dd>Open to full-time, trainee and remote roles</dd></div>
        <div><dt>Core stack</dt><dd>Power BI &middot; SQL &middot; Python &middot; Excel</dd></div>
        <div><dt>Education</dt><dd>MCA (8.48 CGPA) &middot; BCA (7.4) &middot; Kerala Univ</dd></div>
      </dl>
      <div class="cert-row reveal">
        <span class="cert-label">Certificates &amp; Credentials</span>
        <ul class="cert-list">${CERTS.map(([t, by]) => `<li><strong>${esc(t)}</strong><span>${esc(by)}</span></li>`).join('')}</ul>
        <a class="cert-link" href="/about/#credentials">All credentials &rarr;</a>
      </div>
    </section>

    <section id="projects" class="container">
      <div class="section-header">
        <span class="section-tag">Case Studies</span>
        <h2 class="section-title">Featured data analytics projects</h2>
        <p class="section-desc">Three projects, each with its own page covering the problem, tools, method and results.</p>
      </div>
      <div class="projects-grid">${PROJECTS.map(projectCard).join('')}
      </div>
      <p class="more-link"><a href="/projects/">See all data analytics projects &rarr;</a></p>
    </section>

    <section id="matrix" class="container matrix-section">
      <div class="matrix-grid">
        <div class="section-header">
          <span class="section-tag">Interactive</span>
          <h2 class="section-title">Explore the data in 3D</h2>
          <p class="section-desc">Bars, a surface and a data pipeline rendered in WebGL. It loads on demand, so it never slows the page down.</p>
        </div>
        <aside class="v3d-card" aria-label="Interactive 3D data visualizer">
          <div class="v3d-header">
            <span class="v3d-badge"><span class="pulse-indicator"></span>3D Analytical Matrix</span>
            <div class="v3d-modes" hidden id="v3dModes">
              <button type="button" class="v3d-mode-btn active" data-mode="bars">Data Bars</button>
              <button type="button" class="v3d-mode-btn" data-mode="terrain">Surface</button>
              <button type="button" class="v3d-mode-btn" data-mode="network">Pipeline</button>
            </div>
          </div>
          <div class="v3d-canvas-wrap">
            <div id="v3dCanvasContainer" class="v3d-canvas-container">
              <div class="v3d-poster" id="v3dPoster">
                <svg viewBox="0 0 320 200" aria-hidden="true" focusable="false"><g fill="#2563EB"><rect x="40" y="110" width="30" height="60" rx="3" opacity=".55"/><rect x="85" y="80" width="30" height="90" rx="3" opacity=".7"/><rect x="130" y="50" width="30" height="120" rx="3"/><rect x="175" y="95" width="30" height="75" rx="3" opacity=".7"/><rect x="220" y="65" width="30" height="105" rx="3" fill="#0D9488"/></g><line x1="25" y1="170" x2="295" y2="170" stroke="#cbd5e1" stroke-width="2"/></svg>
                <button type="button" class="btn btn-sm btn-secondary" id="v3dLoadBtn">Load interactive 3D view</button>
              </div>
            </div>
            <div id="v3dTooltip" class="v3d-tooltip"></div>
          </div>
          <div class="v3d-footer"><span>Drag to rotate &middot; Hover to inspect</span><span style="color:var(--accent-primary)">WebGL</span></div>
        </aside>
      </div>
    </section>

    <section id="who-is-akhil-shibu" class="container">
      <div class="section-header">
        <span class="section-tag">Entity Profile</span>
        <h2 class="section-title">Who is Akhil Shibu?</h2>
        <p class="section-desc">Direct summary of Akhil (Akhil Shibu) and Akhil Insights for recruiters, hiring managers and search engines.</p>
      </div>
      <div class="prose">
        <p class="answer-box speakable-text">${esc(PERSON.whoIsAkhil)}</p>
        <p><strong>Akhil Shibu</strong> combines postgraduate training in computer applications (MCA, Overall CGPA 8.48; BCA, Overall CGPA 7.4, CHMM College for Advanced Studies, University of Kerala) with practical industry internships in software engineering (Python &amp; Django) and quality assurance (manual, functional, and Postman API testing). Across his portfolio on <strong>Akhil Insights</strong>, Akhil demonstrates end-to-end ownership of the analytics lifecycle: extracting structured tables from raw PDFs and spreadsheets, writing repeatable Python and SQL validation pipelines, modelling star schemas, authoring DAX measures in Power BI, and designing executive Excel and BI dashboards. View his <a href="/about/">full biography</a> or <a href="/resume/">ATS-friendly single-page resume</a>.</p>
      </div>
    </section>

    <section id="roles" class="container">
      <div class="section-header">
        <span class="section-tag">Open to roles</span>
        <h2 class="section-title">Which roles and locations is Akhil Shibu looking for?</h2>
        <p class="section-desc">Fresher and entry-level data analyst, business analyst and Power BI roles in Kerala, across India and remote.</p>
      </div>
      <div class="prose">
        <p>Akhil is a fresher looking for entry level data analyst, junior data analyst and data analyst trainee roles, as well as associate business analyst, junior business analyst and business analyst trainee roles. He also fits Power BI developer fresher, SQL analyst, BI analyst, reporting analyst and MIS analyst openings. He is an MCA graduate (2026), so MCA fresher data analyst resumes and applications are welcome.</p>
        <p>He is looking for data analyst jobs in Thiruvananthapuram (Trivandrum), Kochi and Ernakulam, including data analyst roles at Technopark, Infopark, and Cyberpark Kozhikode, plus pan-India analytics hubs such as Bengaluru (Bangalore), Chennai, Hyderabad, Pune, Mumbai, and Delhi NCR, alongside remote data analyst roles worldwide. Companies can hire a data analyst in Kerala for full-time or trainee roles, or contact Akhil Shibu as a freelance Power BI developer in India for dashboard and reporting work.</p>
        <p>His skills cover advanced Excel (Excel dashboards, Power Query, VLOOKUP and XLOOKUP, pivot tables, slicers), SQL for data analysis (joins, subqueries, CTEs and window functions in PostgreSQL, MySQL, and SQLite), Python for data analysis and data cleaning in Python (Pandas, NumPy, Matplotlib, Django), data modeling, ETL, statistical analysis with Z-scores, and data storytelling through KPI dashboards.</p>
        <p>See the proof in the <a href="/projects/">data analyst portfolio projects</a>: Power BI dashboard examples, a Kerala accident data analysis (road accident analysis for India with a real SQL dataset), an Excel sales dashboard project and a Python data cleaning platform. Short <a href="/articles/">articles</a> explain the method.</p>
      </div>
    </section>

    <section id="skills" class="container">
      <div class="section-header">
        <span class="section-tag">Capabilities</span>
        <h2 class="section-title">What tools does Akhil Shibu use?</h2>
        <p class="section-desc">SQL, Power BI, Excel, Python, Business Analysis and QA testing applied to cleaning, modelling and reporting.</p>
      </div>
      <div class="skills-grid skills-grid--four">
        <div class="skill-card"><h3>Data analytics &amp; hygiene</h3><div class="skill-tags">${['Data cleaning', 'Schema validation', 'Exploratory analysis', 'Z-score outlier detection', 'KPI design', 'Trend & cohort analysis', 'Statistical analysis', 'Data storytelling', 'Data modeling', 'ETL pipelines'].map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div></div>
        <div class="skill-card"><h3>Business intelligence</h3><div class="skill-tags">${['Power BI', 'DAX measures', 'Star-schema modelling', 'KPI cards', 'Slicers & drill-downs', 'Power Query', 'Excel pivot tables', 'Advanced Excel', 'Excel dashboards', 'VLOOKUP & XLOOKUP'].map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div></div>
        <div class="skill-card"><h3>Languages &amp; frameworks</h3><div class="skill-tags">${['SQL (PostgreSQL, MySQL, SQLite)', 'SQL joins & subqueries', 'CTEs & window functions', 'Python for data analysis', 'Pandas & NumPy', 'Matplotlib & ECharts', 'Django'].map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div></div>
        <div class="skill-card"><h3>Business analysis &amp; QA</h3><div class="skill-tags">${['Requirements gathering', 'Stakeholder reporting', 'MIS reporting', 'Variance & root-cause analysis', 'Manual & functional testing', 'REST API testing (Postman)', 'Defect documentation', 'UAT', 'Google Sheets', 'Git & GitHub'].map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div></div>
      </div>
    </section>

    <section id="workflow" class="container">
      <div class="section-header">
        <span class="section-tag">Methodology</span>
        <h2 class="section-title">How does Akhil turn raw data into decisions?</h2>
        <p class="section-desc">Every project follows the same eight steps, from business question to recommendation.</p>
      </div>
      <ol class="stepper">${WORKFLOW.map(([n, t, d, ic]) => `<li class="step reveal"><span class="step-icon">${ICONS[ic]}</span><div class="step-num">${n}</div><div class="step-title">${t}</div><div class="step-desc">${d}</div></li>`).join('')}</ol>
    </section>

    <section id="faq-teaser" class="container">
      <div class="section-header">
        <span class="section-tag">Quick answers</span>
        <h2 class="section-title">Frequently asked questions</h2>
      </div>
      ${faqHtml(HOME_FAQS)}
      <p class="more-link"><a href="/faq/">Read all questions about Akhil Shibu &rarr;</a></p>
    </section>
${contactBlock()}
  </main>`;
  graph.push(faqNode(page, HOME_FAQS));
  const redirect = `  <script>
    // Old single-page anchors now live on real pages. #projects/#contact exist on this page, so they are left alone.
    (function(){var m={'#about':'/about/','#faq':'/faq/','#credentials':'/about/#credentials'};var t=m[location.hash];if(t)location.replace(t);})();
  </script>
`;
  return head(page, { graph, preload: `  <link rel="preload" as="image" type="image/webp" href="/assets/akhil-profile-500.webp" imagesrcset="/assets/akhil-profile-250.webp 250w, /assets/akhil-profile-500.webp 500w" imagesizes="(max-width: 980px) 240px, 380px" fetchpriority="high">\n` }).replace('</head>', redirect + '</head>') + header('/') + hero + footer();
}

function aboutPage() {
  const page = PAGES.about;
  const bc = [['Home', '/'], ['About', '/about/']];
  const graph = [
    websiteNode(),
    { ...webPageNode(page, 'ProfilePage'), mainEntity: { '@id': url('/#akhil') } },
    personNode(),
    crumbs(bc),
    faqNode(page, ABOUT_FAQS),
  ];
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <section class="container about-intro">
      <div class="section-header">
        <span class="section-tag">Analytical profile</span>
        <h1 class="section-title">About Akhil Shibu, Fresher Data Analyst in Kerala</h1>
        <p class="section-desc">${PERSON.bio}</p>
      </div>
      <div class="about-grid">
        <aside class="profile-card">
          <div class="profile-img-wrap">
            <picture>
              <source type="image/webp" srcset="/assets/akhil-profile-250.webp 250w, /assets/akhil-profile-500.webp 500w" sizes="250px">
              <img src="/assets/akhil-profile-500.jpg" alt="Portrait of Akhil Shibu, data analyst and Power BI specialist from Kerala" width="250" height="312" class="profile-img" fetchpriority="high" decoding="async">
            </picture>
          </div>
          <h2 class="profile-name">${PERSON.name}</h2>
          <p class="profile-role">${PERSON.role}</p>
          <div class="profile-meta">
            <div class="profile-meta-item"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-right:6px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>Chirayinkeezhu, Thiruvananthapuram, Kerala</span></div>
            <div class="profile-meta-item"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-right:6px;"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg><span>MCA (CGPA 8.48) &middot; BCA (CGPA 7.4)</span></div>
            <div class="profile-meta-item"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-right:6px;"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg><span>Open to full-time, trainee &amp; remote</span></div>
          </div>
          <div class="profile-actions"><a class="btn btn-sm btn-primary" href="/assets/Akhil_Shibu_Data_Analyst_CV.pdf" download>Download resume (PDF)</a> <a class="btn btn-sm btn-secondary" href="/resume/">View online resume</a></div>
        </aside>
        <div class="prose">
          <h2>Who is Akhil Shibu?</h2>
          <p class="answer-box speakable-text">${esc(PERSON.whoIsAkhil)}</p>
          <p>MCA graduate from Kerala University (2026, Overall CGPA: 8.48) with hands-on experience in data analysis, data cleaning, SQL, Python, Power BI, and Microsoft Excel. Skilled in extracting and processing data from PDF reports, performing exploratory data analysis, building interactive dashboards, and validating data quality.</p>
          <p>Developed DataSentrix, a web-based data analytics platform tested on a 200,000-row dataset with defined data quality rules. Also experienced in API testing and functional testing through internships. Seeking opportunities as a Data Analyst, Business Intelligence Analyst, or Business Analyst.</p>

          <div class="table-wrap"><table class="facts-table">
            <caption>Akhil Shibu &mdash; Entity &amp; Career Quick Facts</caption>
            <tbody>
              <tr><th scope="row">Full name</th><td><strong>Akhil Shibu</strong> (also searched as <em>Akhil</em> &middot; <em>Akhil Insights</em>)</td></tr>
              <tr><th scope="row">Target roles</th><td>${esc(PERSON.targetRoles.join(', '))}</td></tr>
              <tr><th scope="row">Core stack</th><td>SQL (PostgreSQL, MySQL, SQLite), Power BI (DAX, Star Schema), Microsoft Excel (Power Query, Pivot Tables, XLOOKUP), Python (Pandas, NumPy, Matplotlib, Django)</td></tr>
              <tr><th scope="row">Education</th><td>MCA (2024&ndash;2026, CGPA 8.48) &amp; BCA (2021&ndash;2024, CGPA 7.4), CHMM College for Advanced Studies, University of Kerala</td></tr>
              <tr><th scope="row">Base location</th><td>Chirayinkeezhu, Thiruvananthapuram (Trivandrum), Kerala, India</td></tr>
              <tr><th scope="row">Preferred hubs</th><td>${esc(PERSON.targetLocations.join(', '))}</td></tr>
              <tr><th scope="row">Resume</th><td><a href="/resume/">Online ATS Resume</a> &middot; <a href="/assets/Akhil_Shibu_Data_Analyst_CV.pdf" download>Download 1-Page PDF</a></td></tr>
            </tbody>
          </table></div>

          <h2>Professional Experience</h2>
          ${EXPERIENCE.map((e) => `
          <div style="margin-bottom:1.5rem;">
            <h3 style="margin-bottom:0.25rem;">${esc(e.role)} &mdash; ${esc(e.company)}</h3>
            <p style="font-size:0.875rem;color:var(--text-muted);margin-bottom:0.5rem;">${esc(e.period)} &middot; ${esc(e.location)}</p>
            <ul class="principles">
              ${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
            </ul>
          </div>
          `).join('')}

          <h2>What principles guide the work?</h2>
          <ul class="principles">
            <li><strong>Data hygiene first.</strong> Audit schema drift, nulls and outliers before drawing conclusions.</li>
            <li><strong>Decision-centric reporting.</strong> Build KPI scorecards that answer a specific management question.</li>
            <li><strong>Automated and repeatable.</strong> Prefer SQL scripts and Python pipelines over manual steps, as in <a href="/projects/datasentrix/">Datasentrix</a>.</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="faq" class="container">
      <div class="section-header"><h2 class="section-title">Quick answers about Akhil Shibu</h2></div>
      ${faqHtml(ABOUT_FAQS)}
      <p class="more-link"><a href="/faq/">Read all questions about Akhil Shibu &rarr;</a></p>
    </section>

    <section id="credentials" class="container">
      <div class="section-header"><h2 class="section-title">Education &amp; Certificates</h2></div>
      ${EDUCATION.map((ed) => `
      <div class="credential-main" style="margin-bottom:1.25rem;">
        <h3>${esc(ed.degree)}</h3>
        <p class="cred-sub">${esc(ed.institution)} &middot; ${esc(ed.period)} &middot; <strong>Overall CGPA: ${esc(ed.cgpa)}</strong></p>
        <p>${esc(ed.details)}</p>
      </div>
      `).join('')}
      <div class="table-wrap"><table>
        <caption>Certificates &amp; Achievements</caption>
        <thead><tr><th>Certificate / Event</th><th>Issuer</th><th>Type</th></tr></thead>
        <tbody>
          ${CERTIFICATES.map((c) => `<tr><td><strong>${esc(c.title)}</strong></td><td>${esc(c.issuer)}</td><td>${esc(c.type)}</td></tr>`).join('')}
        </tbody></table></div>
      <p class="note">Course completion credentials and hackathon participation verifying practical technical capability.</p>
    </section>
${contactBlock()}
  </main>`;
  return head(page, { graph, ogType: 'profile', preload: `  <link rel="preload" as="image" type="image/webp" href="/assets/akhil-profile-500.webp" imagesrcset="/assets/akhil-profile-250.webp 250w, /assets/akhil-profile-500.webp 500w" imagesizes="250px" fetchpriority="high">\n` }) + header('/about/') + body + footer();
}

function projectsIndex() {
  const page = PAGES.projects;
  const bc = [['Home', '/'], ['Projects', '/projects/']];
  const graph = [
    websiteNode(),
    { ...webPageNode(page, 'CollectionPage'), mainEntity: { '@id': url('/projects/') + '#list' } },
    personNode(),
    crumbs(bc),
    {
      '@type': 'ItemList',
      '@id': url('/projects/') + '#list',
      name: 'Data analytics case studies by Akhil Shibu',
      itemListElement: PROJECTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: url(`/projects/${p.slug}/`) })),
    },
  ];
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <section class="container">
      <div class="section-header">
        <span class="section-tag">Case studies</span>
        <h1 class="section-title">Data analyst portfolio projects and case studies</h1>
        <p class="section-desc">Each project has its own page with the problem, tools, method, results and an FAQ. Start with the Kerala road accident analysis if you want the most data-heavy example.</p>
        <p class="section-desc">These data analyst portfolio projects include Power BI dashboard examples, a SQL project with a real dataset (the Kerala accident data analysis, a road accident analysis for India), an Excel sales dashboard project and a Python data cleaning platform. Each one works as a data analyst case study.</p>
      </div>
      <div class="projects-grid">${PROJECTS.map(projectCard).join('')}
      </div>
      <h2 class="sub-title">Which project should I read first?</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>If you care about&hellip;</th><th>Read</th><th>Main tools</th></tr></thead>
        <tbody>
          <tr><td>Large public datasets and SQL</td><td><a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a></td><td>SQL, Power BI, Pandas</td></tr>
          <tr><td>Automated data cleaning and Python</td><td><a href="/projects/datasentrix/">Datasentrix platform</a></td><td>Python, Django, SQL</td></tr>
          <tr><td>Commercial reporting in Excel</td><td><a href="/projects/bike-sales-dashboard/">Bike sales Excel dashboard</a></td><td>Excel, pivot tables, slicers</td></tr>
        </tbody></table></div>
      <p class="more-link">Questions? See the <a href="/faq/">FAQ about Akhil Shibu</a> or <a href="/about/#contact">get in touch</a>.</p>
    </section>
  </main>`;
  return head(page, { graph }) + header('/projects/') + body + footer();
}

const CASES = {
  'kerala-road-accident-analysis': {
    h1: 'Kerala Road Accident Analysis: 34,500+ Crash Records',
    answer:
      'This case study analyses 34,500+ road crash records from all 14 Kerala districts using SQL window functions and Power BI. Thiruvananthapuram and Ernakulam account for 29.1% of fatal crashes, and crashes between 20:00 and 04:00 have a 64.2% higher fatality severity ratio.',
    facts: [['Role', 'Analyst (solo portfolio project)'], ['Data', '34,500+ crash records, MoRTH public data'], ['Coverage', 'All 14 Kerala districts'], ['Tools', 'SQL window functions, Power BI, Excel, Pandas'], ['Status', 'Completed analysis']],
    problem: 'Where, when and why do severe road accidents occur across Kerala\'s highways and rural roads? Without a district and time-of-day breakdown, safety effort is spread evenly instead of aimed at the highest-risk places and hours.',
    method: [
      'Collected public crash records (MoRTH data) and profiled the schema for nulls and inconsistent district names.',
      'Cleaned and standardised the records with Pandas and Excel.',
      'Ranked districts with SQL window functions such as <code>RANK() OVER</code>.',
      'Built a severity-weighting index combining fatal and severe-injury counts.',
      'Visualised district-level results as Power BI heat maps with time-of-day slicers.',
    ],
    results: [['Thiruvananthapuram + Ernakulam share of fatal crashes', '29.1%'], ['Night crashes (20:00-04:00) fatality severity ratio vs. rest of day', '+64.2%'], ['Records analysed', '34,500+'], ['Districts covered', '14 of 14']],
    figure: keralaFigure(),
    extra: `<h2>What does "fatality severity ratio" mean?</h2>
      <p><strong>Fatality severity ratio</strong> compares how deadly crashes are, not how many there are. It is the share of crashes that end in a death, calculated for one time window and divided by the same share for the rest of the day. Night-time crashes (20:00-04:00) scored 64.2% higher on this measure.</p>
      <h2>Which districts did the analysis cover?</h2>
      <p>All 14: Thiruvananthapuram, Kollam, Pathanamthitta, Alappuzha, Kottayam, Idukki, Ernakulam, Thrissur, Palakkad, Malappuram, Kozhikode, Wayanad, Kannur and Kasaragod.</p>
      <h2>Why is this a useful data analyst case study?</h2>
      <p>It is an end-to-end SQL project with a real dataset: cleaning, window-function ranking, a severity index and a Power BI dashboard. It doubles as a road accident analysis for India that other analysts can reuse on their own state data. Follow the method step by step in the <a href="/articles/kerala-road-accident-analysis-sql-window-functions/">SQL window functions article</a>.</p>`,
    figAlt: null,
    faqs: [
      { q: 'What data was used for the Kerala road accident analysis?', a: 'The analysis uses 34,500+ crash records from public road-accident data published through MoRTH, covering all 14 Kerala districts. Records were profiled and cleaned for missing values and inconsistent district names before any ranking or severity calculation was run.', more: 'Cleaned outputs feed the Power BI dashboard.' },
      { q: 'Which Kerala districts have the most fatal road accidents?', a: 'In this dataset, Thiruvananthapuram and Ernakulam together account for 29.1% of all fatal crashes, the highest concentration of the 14 districts. The result comes from ranking districts by fatal incident counts with SQL window functions and checking them against a severity-weighted index.', more: 'Counts are not adjusted for traffic volume or population.' },
      { q: 'Are night-time road accidents more deadly in Kerala?', a: 'Yes, in this data. Crashes between 20:00 and 04:00 show a fatality severity ratio 64.2% higher than crashes in the remaining hours. That means a night crash was more likely to be fatal, even though the number of crashes alone does not tell the whole story.', more: 'Possible drivers such as lighting, speed and fatigue were not measured in the dataset.' },
    ],
    pipeline: ['Clean records', 'Rank with SQL', 'Severity index', 'Power BI heat map'],
    pipelineLabel: 'Workflow diagram: clean crash records, rank districts with SQL, calculate a severity index, then visualise in a Power BI heat map.',
  },
  datasentrix: {
    h1: 'Datasentrix: Automated Data Cleaning and Reporting Platform',
    answer:
      'Datasentrix is a Python and Django platform that automates the work analysts repeat before every dashboard. It validates uploaded spreadsheets, drops records with null primary keys, isolates outliers with Z-scores, aggregates cohort retention and generates KPI reports, so cleaning becomes repeatable instead of manual.',
    facts: [['Role', 'Designer and developer (solo portfolio project)'], ['Stack', 'Python, Django, SQL'], ['Input', 'Multi-source spreadsheets'], ['Output', 'Cleaned data, validation yield and KPI reports'], ['Code', 'Repository to be published on GitHub']],
    problem: 'Ad-hoc data preparation in commercial teams leads to errors that cannot be repeated, schema drift between files, and dashboards that disagree with each other because each analyst cleaned the data differently.',
    method: [
      'Ingest spreadsheets from several sources and check them against an expected schema.',
      'Drop records whose primary key is null and log how many were removed.',
      'Isolate outliers with Z-scores instead of deleting them silently.',
      'Run cohort retention aggregations on the cleaned data.',
      'Generate KPI outputs and report the validation yield (share of records kept).',
    ],
    results: [['Validation rules', 'Null primary keys, schema checks, Z-score outliers'], ['Reporting outputs', 'KPI summary and cohort retention'], ['Reusability', 'Same rules re-run on every new file'], ['Lesson learned', 'Track validation yield end to end']],
    figure: null,
    extra: `<h2>What is a Z-score outlier check?</h2>
      <p>A <strong>Z-score</strong> measures how many standard deviations a value sits from the column average. Values far from the mean are flagged for review, which isolates data-entry errors without distorting trend lines.</p>
      <p>See how the same cleaning discipline applies to public data in the <a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a>.</p>
      <h2>Why does data cleaning in Python matter for analysts?</h2>
      <p>Python for data analysis lets an analyst turn cleaning steps into repeatable ETL code instead of manual spreadsheet edits. Datasentrix shows data cleaning in Python as a portfolio project: the rules are written once and re-run on every new file.</p>`,
    faqs: [
      { q: 'What is Datasentrix?', a: 'Datasentrix is an automated data hygiene and reporting platform built with Python, Django and SQL. It validates spreadsheets against a schema, removes records with null primary keys, flags outliers with Z-scores and produces KPI and cohort reports, replacing repeated manual cleaning with rules that can be re-run.', more: '' },
      { q: 'What problem does Datasentrix solve?', a: 'It solves unrepeatable data preparation. When each analyst cleans a spreadsheet by hand, schema drift and silent errors creep in and dashboards stop agreeing. Datasentrix applies the same documented validation rules to every file and reports how many records passed.', more: '' },
      { q: 'What technologies does Datasentrix use?', a: 'Datasentrix is written in Python and uses the Django framework for the web layer, with SQL for storage and aggregation. Data validation, Z-score outlier detection and cohort modelling are implemented as Python pipeline steps. The project is being prepared for publication on GitHub.', more: '' },
    ],
    pipeline: ['Upload', 'Validate schema', 'Drop nulls', 'Z-score outliers', 'KPI report'],
    pipelineLabel: 'Pipeline diagram of Datasentrix: upload, validate schema, drop null primary keys, isolate Z-score outliers, produce KPI report.',
  },
  'bike-sales-dashboard': {
    h1: 'Bike Sales Excel Dashboard: Margin and Region Analysis',
    answer:
      'This case study is a multi-sheet Microsoft Excel workbook that answers which bike products, categories and regions drive sales and gross margin. It uses XLOOKUP, dynamic pivot tables, slicer timelines and KPI scorecards so a manager can filter by period, region or customer group in seconds.',
    facts: [['Role', 'Analyst (solo portfolio project)'], ['Tool', 'Microsoft Excel'], ['Techniques', 'XLOOKUP, pivot tables, slicers, KPI cards'], ['Focus', 'Sales, margin, category and regional trends'], ['Code', `<a href="https://github.com/eraofemperor/Bike-Sales-Excel-Dashboard" rel="noopener">github.com/eraofemperor/Bike-Sales-Excel-Dashboard</a>`]],
    problem: 'Which products, categories and regional distribution tiers drive sales performance and gross margin, and how do customer demographics change what people buy?',
    method: [
      'Cleaned the sales data and standardised categories and demographic fields.',
      'Joined lookup tables with XLOOKUP and conditional logic.',
      'Built dynamic pivot tables for product, category and region drill-downs.',
      'Added slicer timelines so any view can be filtered by period.',
      'Summarised results in KPI scorecards for revenue and margin.',
    ],
    results: [['Dashboard views', 'Sales performance, category and product drill-down'], ['Dimensions', 'Region, customer demographics, time'], ['Interactivity', 'Slicers and timeline filters'], ['Output', 'KPI summary scorecards']],
    figure: null,
    extra: `<h2>Why Excel instead of Power BI?</h2>
      <p>Many small teams already work in Excel. A well-modelled workbook with pivot tables and slicers gives them interactive analysis without new software. For larger data and shared reporting, the same approach moves to Power BI, as in the <a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a>.</p>
      <h2>What makes this a good Excel sales dashboard project?</h2>
      <p>It uses advanced Excel features recruiters filter for: VLOOKUP and XLOOKUP joins, pivot tables, slicers and an Excel dashboard with KPI cards, all tied to one business question about margin and region.</p>`,
    faqs: [
      { q: 'What does the bike sales Excel dashboard show?', a: 'The workbook shows sales performance, product and category drill-downs, regional and demographic variance, and revenue trends over time. Slicers and a timeline let a user filter every pivot table together, and KPI cards summarise revenue and gross margin at the top.', more: '' },
      { q: 'Which Excel features does the dashboard use?', a: 'It uses XLOOKUP for joining lookup tables, conditional logic for categories, dynamic pivot tables for drill-downs, slicer timelines for filtering and KPI summary scorecards. Together they turn a flat sales table into an interactive dashboard that needs no macros.', more: '' },
    ],
    pipeline: ['Clean data', 'XLOOKUP joins', 'Pivot tables', 'Slicers', 'KPI cards'],
    pipelineLabel: 'Workflow diagram of the bike sales dashboard: clean data, join with XLOOKUP, build pivot tables, add slicers, show KPI cards.',
  },
};

function casePage(slug) {
  const proj = PROJECTS.find((p) => p.slug === slug);
  const c = CASES[slug];
  const page = PAGES[slug];
  const bc = [['Home', '/'], ['Projects', '/projects/'], [proj.name, page.path]];
  const others = PROJECTS.filter((p) => p.slug !== slug);
  const about =
    slug === 'datasentrix'
      ? { '@type': 'SoftwareApplication', name: proj.name, applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: c.answer, codeRepository: proj.repo }
      : { '@type': 'CreativeWork', name: proj.name, description: c.answer };
  const graph = [
    websiteNode(),
    { ...webPageNode(page, 'WebPage'), mainEntity: { '@id': url(page.path) + '#project' } },
    personNode(),
    crumbs(bc),
    { '@id': url(page.path) + '#project', ...about, url: url(page.path), creator: { '@id': url('/#akhil') }, dateModified: BUILD_DATE, keywords: [...proj.tools, ...proj.keywords].join(', ') },
    faqNode(page, c.faqs),
  ];
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <article class="container case-study">
      <header class="section-header">
        <span class="section-tag">Case study</span>
        <h1 class="section-title">${esc(c.h1)}</h1>
        <p class="answer-box speakable-text">${esc(c.answer)}</p>
      </header>
      <div class="table-wrap"><table class="facts-table"><caption>Project facts</caption><tbody>${c.facts.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table></div>

      <h2>What problem does this project solve?</h2>
      <p>${esc(c.problem)}</p>

      <h2>How was it built? (method)</h2>
      <ol class="steps">${c.method.map((m) => `<li>${m}</li>`).join('')}</ol>
      ${pipelineSvg(c.pipeline, c.pipelineLabel)}

      <h2>What were the results?</h2>
      <div class="table-wrap"><table><thead><tr><th>Measure</th><th>Result</th></tr></thead><tbody>${c.results.map(([k, v]) => `<tr><td>${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join('')}</tbody></table></div>
      ${c.figure || ''}
      ${c.extra}

      <h2>Which tools were used?</h2>
      <div class="tech-pills">${proj.tools.map((t) => `<span class="tech-pill">${esc(t)}</span>`).join('')}</div>
      <p><a class="btn btn-sm btn-primary" href="${proj.repo}" target="_blank" rel="noopener noreferrer">View ${esc(proj.short)} on GitHub</a></p>

      <h2>Frequently asked questions</h2>
      ${faqHtml(c.faqs)}

      <h2>About the analyst: Akhil Shibu</h2>
      <p><strong><a href="/about/">Akhil Shibu</a></strong> is a fresher Data Analyst, Business Intelligence Analyst, and Business Analyst (MCA 2026, CGPA 8.48, University of Kerala) based in Thiruvananthapuram, Kerala, India. View his <a href="/resume/">single-page ATS resume</a> or <a href="/about/#contact">contact Akhil Shibu</a> for full-time, trainee, or remote analytics roles.</p>

      <h2>More case studies</h2>
      <ul class="related">${others.map((o) => `<li><a href="/projects/${o.slug}/">${esc(o.name)}: ${esc(o.summary)}</a></li>`).join('')}
        <li><a href="/about/">About Akhil Shibu</a> and <a href="/about/#contact">how to contact him</a></li></ul>
    </article>
  </main>`;
  return head(page, { graph, ogType: 'article' }) + header('/projects/') + body + footer();
}

function faqPage() {
  const page = PAGES.faq;
  const bc = [['Home', '/'], ['FAQ', '/faq/']];
  const graph = [websiteNode(), webPageNode(page, 'FAQPage'), personNode(), crumbs(bc), faqNode(page, FAQS)];
  const gloss = [
    ['ETL pipeline', 'Extract, Transform, Load: an automated process that pulls raw records, validates and cleans them, and loads them into a reporting store.'],
    ['DAX measure', 'A Power BI formula that calculates context-aware values such as year-over-year change or KPI variance.'],
    ['Star schema', 'A model that separates numeric facts (sales, crashes) from descriptive dimensions (date, district, product) for fast queries.'],
    ['Z-score', 'How many standard deviations a value is from the average. Used to flag outliers.'],
    ['Fatality severity ratio', 'The share of crashes that were fatal in one time window divided by the same share for the rest of the day.'],
    ['SQL window function', 'An analytical SQL clause such as RANK() OVER or PARTITION BY that computes rankings, running totals, or period comparisons without collapsing detail rows.'],
    ['Power Query', 'The data transformation and ETL engine in Power BI and Microsoft Excel used to clean, merge, reshape, and automate repeatable data imports.'],
    ['XLOOKUP & VLOOKUP', 'Excel lookup functions that join reference attributes across tables; XLOOKUP supports bidirectional lookups, defaults, and exact matching by default.'],
    ['KPI variance analysis', 'Comparing actual business metrics against targets or prior periods (YoY, MoM) to isolate root causes of revenue, cost, or operational shifts.'],
    ['Exploratory data analysis (EDA)', 'Profiling distributions, missing values, duplicates, cardinality, and correlations in a raw dataset before formal modelling or dashboarding.'],
  ];
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <section class="container">
      <div class="section-header">
        <span class="section-tag">Answers</span>
        <h1 class="section-title">Fresher data analyst FAQ: skills, tools and hiring</h1>
        <p class="section-desc">Short answers first, details below. Everything here is about Akhil Shibu and his portfolio work.</p>
      </div>
      ${faqHtml(FAQS)}
      <h2 class="sub-title">Analytics glossary</h2>
      <dl class="glossary-grid">${gloss.map(([t, d]) => `<div class="glossary-card"><dt><dfn>${t}</dfn></dt><dd>${d}</dd></div>`).join('')}</dl>
      <p class="more-link">See the work: <a href="/projects/">data analytics projects</a> &middot; <a href="/about/">about Akhil Shibu</a></p>
    </section>
${contactBlock()}
  </main>`;
  return head(page, { graph }) + header('/faq/') + body + footer();
}

function resumePage() {
  const page = PAGES.resume;
  const bc = [['Home', '/'], ['Resume', '/resume/']];
  const graph = [
    websiteNode(),
    { ...webPageNode(page, 'ProfilePage'), mainEntity: { '@id': url('/#akhil') } },
    personNode(),
    crumbs(bc),
    faqNode(page, RESUME_FAQS),
  ];
  const resumeProjects = ['datasentrix', 'kerala-road-accident-analysis', 'bike-sales-dashboard'].map((s) => PROJECTS.find((p) => p.slug === s));
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <section class="container resume-page-header">
      <div class="resume-controls">
        <a class="btn btn-primary" href="/assets/Akhil_Shibu_Data_Analyst_CV.pdf" download><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-right:6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download resume (PDF)</a>
        <button class="btn btn-secondary" onclick="window.print()" type="button"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:inline-block;vertical-align:-2px;margin-right:6px;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Print / Save PDF</button>
        <a class="btn btn-ghost" href="#contact">Contact Akhil</a>
      </div>
    </section>

    <article class="container resume-paper" id="resumeDocument">
      <header class="resume-header">
        <h1 class="resume-name">${esc(PERSON.name.toUpperCase())}</h1>
        <p class="resume-subtitle">${esc(PERSON.resumeSubtitle)}</p>
        <div class="resume-contact-lines">
          <div class="resume-contact-row">
            <a href="mailto:${PERSON.email}">${esc(PERSON.email)}</a>
            <span class="resume-sep" aria-hidden="true">|</span>
            <a href="tel:${PERSON.phoneHref}">${esc(PERSON.phone)}</a>
            <span class="resume-sep" aria-hidden="true">|</span>
            <a href="${DOMAIN}">www.akhilinsights.com</a>
          </div>
          <div class="resume-contact-row">
            <span>Chirayinkeezhu, Thiruvananthapuram, Kerala</span>
            <span class="resume-sep" aria-hidden="true">|</span>
            <a href="${PERSON.linkedin}" rel="me noopener">linkedin.com/in/-akhilshibu</a>
            <span class="resume-sep" aria-hidden="true">|</span>
            <a href="${PERSON.github}" rel="me noopener">github.com/eraofemperor</a>
          </div>
        </div>
      </header>

      <div class="resume-grid">
        <div class="resume-col-sidebar">
          <section class="resume-sec">
            <h2 class="resume-sec-title">SUMMARY</h2>
            <p class="resume-summary">${esc(PERSON.resumeSummary)}</p>
          </section>

          <section class="resume-sec">
            <h2 class="resume-sec-title">SKILLS</h2>
            ${SKILLS_CATEGORIES.map((s) => `<div class="resume-skill-group">
              <h3 class="resume-group-title">${esc(s.area)}:</h3>
              <p>${esc(s.skills)}</p>
            </div>`).join('\n            ')}
          </section>

          <section class="resume-sec">
            <h2 class="resume-sec-title">CERTIFICATES</h2>
            <ul class="resume-cert-list">
              ${CERTIFICATES.map((c) => `<li><strong>${esc(c.title)}:</strong> ${esc(c.issuer)}</li>`).join('\n              ')}
            </ul>
          </section>
        </div>

        <div class="resume-col-main">
          <section class="resume-sec">
            <h2 class="resume-sec-title">PROFESSIONAL EXPERIENCE</h2>
            ${EXPERIENCE.map((e) => `<div class="resume-entry">
              <div class="resume-entry-header">
                <h3 class="resume-entry-role">${esc(e.role)}</h3> <span class="resume-entry-date">${esc(e.period)}</span>
              </div>
              <div class="resume-entry-org">${esc(e.company)} &middot; ${esc(e.location)}</div>
              <ul class="resume-bullets">
                ${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
              </ul>
            </div>`).join('\n            ')}
          </section>

          <section class="resume-sec">
            <h2 class="resume-sec-title">EDUCATION</h2>
            ${EDUCATION.map((ed) => `<div class="resume-entry">
              <div class="resume-entry-header">
                <h3 class="resume-entry-role">${esc(ed.degree)}</h3> <span class="resume-entry-date">${esc(ed.period)}</span>
              </div>
              <div class="resume-entry-inst">${esc(ed.institution)} &middot; <strong class="resume-nowrap">Overall CGPA: ${esc(ed.cgpa)}</strong></div>
            </div>`).join('\n            ')}
          </section>

          <section class="resume-sec">
            <h2 class="resume-sec-title">PROJECTS</h2>
            ${resumeProjects.map((p) => `<div class="resume-entry">
              <div class="resume-entry-header">
                <h3 class="resume-entry-role"><a href="/projects/${p.slug}/">${esc(p.name)}</a></h3> <span class="resume-entry-date">${esc(p.period)}</span>
              </div>
              <div class="resume-entry-tools">${esc(p.tools.join(', '))}</div>
              <ul class="resume-bullets">
                ${p.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}
              </ul>
            </div>`).join('\n            ')}
          </section>
        </div>
      </div>
    </article>

    <section class="container resume-seo-supplement" aria-labelledby="atsProfileHeading">
      <div class="section-header">
        <span class="section-tag">Recruiter &amp; ATS Summary</span>
        <h2 id="atsProfileHeading" class="section-title">Who is Akhil Shibu? &mdash; ATS Competency &amp; Role Alignment</h2>
        <p class="section-desc">Structured profile summary for recruiters, applicant tracking systems (ATS) and hiring teams evaluating Akhil Shibu.</p>
      </div>
      <div class="prose">
        <p class="answer-box speakable-text">${esc(PERSON.whoIsAkhil)}</p>
        <h3>Target Job Titles</h3>
        <div class="tech-pills">${PERSON.targetRoles.map((r) => `<span class="tech-pill">${esc(r)}</span>`).join('')}</div>
        <h3>Preferred Locations &amp; Work Modes</h3>
        <div class="tech-pills">${PERSON.targetLocations.map((l) => `<span class="tech-pill">${esc(l)}</span>`).join('')}</div>
      </div>
      <div style="margin-top:2rem;">
        <h3 style="margin-bottom:1rem;">Resume &amp; Hiring FAQs</h3>
        ${faqHtml(RESUME_FAQS)}
      </div>
    </section>
${contactBlock()}
  </main>`;
  return head(page, {
    graph,
    ogType: 'profile',
    extraKeywords: ['Akhil Shibu CV', 'Akhil Shibu ATS Resume', 'Data Analyst Resume PDF', 'Fresher Business Analyst Resume India', 'MCA Data Analyst Resume'],
  }) + header('/resume/') + body + footer();
}

function articlesIndex() {
  const page = PAGES.articles;
  const bc = [['Home', '/'], ['Articles', '/articles/']];
  const graph = [
    websiteNode(),
    { ...webPageNode(page, 'CollectionPage'), mainEntity: { '@id': url('/articles/') + '#list' } },
    personNode(),
    crumbs(bc),
    {
      '@type': 'ItemList',
      '@id': url('/articles/') + '#list',
      name: 'Data analyst articles by Akhil Shibu',
      itemListElement: ARTICLES.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.h1, url: url(a.path) })),
    },
  ];
  const cards = ARTICLES.map((a) => `
        <article class="project-card project-card--plain flagship">
          <div>
            <h2 class="project-title"><a href="${a.path}">${esc(a.h1)}</a></h2>
            <p class="project-summary">${esc(a.answer)}</p>
          </div>
          <div class="project-links"><a class="btn btn-sm btn-primary" href="${a.path}">Read the article</a></div>
        </article>`).join('');
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <section class="container">
      <div class="section-header">
        <span class="section-tag">Articles</span>
        <h1 class="section-title">Data analyst articles: SQL, Power BI and fresher skills</h1>
        <p class="section-desc">Short, answer-first guides written by Akhil Shibu from his own portfolio projects.</p>
      </div>
      <div class="projects-grid">${cards}
      </div>
      <p class="more-link">See the work behind them: <a href="/projects/">data analyst portfolio projects</a> &middot; <a href="/faq/">FAQ</a>.</p>
    </section>
  </main>`;
  return head(page, { graph }) + header('/articles/') + body + footer();
}

function articlePage(a) {
  const page = PAGES['article-' + a.slug];
  const bc = [['Home', '/'], ['Articles', '/articles/'], [a.h1, a.path]];
  const graph = [
    websiteNode(),
    { ...webPageNode(page, 'WebPage'), mainEntity: { '@id': url(a.path) + '#article' } },
    personNode(),
    crumbs(bc),
    {
      '@type': 'Article',
      '@id': url(a.path) + '#article',
      headline: a.h1,
      description: a.description,
      inLanguage: 'en',
      image: url('/assets/akhil-og-image.jpg'),
      author: { '@id': url('/#akhil') },
      publisher: { '@id': url('/#akhil') },
      datePublished: a.published,
      dateModified: BUILD_DATE,
      mainEntityOfPage: url(a.path),
    },
  ];
  const others = ARTICLES.filter((o) => o.slug !== a.slug);
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <article class="container case-study">
      <header class="section-header">
        <span class="section-tag">Article</span>
        <h1 class="section-title">${esc(a.h1)}</h1>
        <p class="answer-box speakable-text">${esc(a.answer)}</p>
        <p class="note">By <a href="/about/">${PERSON.name}</a>, fresher data analyst &middot; Published ${a.published}</p>
      </header>${a.body}

      <h2>About the author: Akhil Shibu</h2>
      <p><strong><a href="/about/">Akhil Shibu</a></strong> (MCA 2026, CGPA 8.48, University of Kerala) is a Data Analyst, Business Intelligence Analyst, and Business Analyst from Thiruvananthapuram, Kerala, India. Explore his <a href="/projects/">analytics case studies</a> or <a href="/resume/">ATS-friendly single-page resume</a>.</p>

      <h2>Related</h2>
      <ul class="related">
        <li><a href="${a.related[0]}">${esc(a.related[1])}</a></li>${others.map((o) => `
        <li><a href="${o.path}">${esc(o.h1)}</a></li>`).join('')}
        <li><a href="/about/#contact">Hire Akhil Shibu as a data analyst</a></li>
      </ul>
    </article>
  </main>`;
  return head(page, { graph, ogType: 'article' }) + header('/articles/') + body + footer();
}

/* ------------------------------ static files ------------------------------ */
function sitemap() {
  const extra = ['/assets/Akhil_Shibu_Data_Analyst_CV.pdf', '/llms.txt', '/llms-full.txt'];
  const urls = [
    ...Object.values(PAGES).map((p) => `  <url>\n    <loc>${url(p.path)}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>`),
    ...extra.map((p) => `  <url>\n    <loc>${url(p)}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
const robots = () => `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;
const humans = () => `/* TEAM */
  Data Analyst, Business Intelligence & Business Analyst: ${PERSON.name}
  Brand: ${PERSON.brand}
  Contact: ${PERSON.email}
  Location: ${PERSON.locality}, ${PERSON.region}, India
  LinkedIn: ${PERSON.linkedin}
  GitHub: ${PERSON.github}
  Resume: ${url('/resume/')}

/* SITE */
  Standards: HTML5, CSS3, Pure TypeScript (ES2022), Schema.org JSON-LD
  Optimization: Core Web Vitals (CWV), SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), ATS Resume Architecture
  LLM Context: ${url('/llms.txt')} & ${url('/llms-full.txt')}
  Domain: ${DOMAIN}
`;
const llms = () => `# Akhil Insights — Akhil Shibu (Data Analyst, Business Intelligence & Business Analyst)

> ${PERSON.whoIsAkhil}

## Who is Akhil Shibu?
- **Full Name**: ${PERSON.name} (also searched as "Akhil" and "${PERSON.brand}")
- **Roles**: ${PERSON.targetRoles.join(', ')}
- **Education**: MCA (2024–2026, Overall CGPA ${PERSON.mcaCgpa}) & BCA (2021–2024, Overall CGPA ${PERSON.bcaCgpa}), ${PERSON.college}, ${PERSON.university}
- **Location**: ${PERSON.address}, ${PERSON.locality}, ${PERSON.region}, India
- **Open To**: ${PERSON.targetLocations.join(', ')}

## Core Pages
- [Home — Akhil Insights](${url('/')}): Portfolio overview, highlights, methodology, skills and role availability.
- [About ${PERSON.name}](${url('/about/')}): Full biography, internships, MCA/BCA credentials, certificates and contact details.
- [Single-Page ATS Resume (HTML)](${url('/resume/')}): Complete resume of Akhil Shibu in semantic HTML.
- [Single-Page ATS Resume (PDF)](${url('/assets/Akhil_Shibu_Data_Analyst_CV.pdf')}): Downloadable A4 PDF resume.
- [FAQ — Answers about Akhil Shibu](${url('/faq/')}): Direct answers to recruiter, technical and hiring questions.
- [Full LLM Reference](${url('/llms-full.txt')}): Complete expanded skills, experience, projects and Q&A corpus for AI engines.

## Projects
${PROJECTS.map((p) => `- [${p.name}](${url(`/projects/${p.slug}/`)}) (${p.tools.join(', ')}): ${p.summary}`).join('\n')}

## Articles
${ARTICLES.map((a) => `- [${a.h1}](${url(a.path)}): ${a.description}`).join('\n')}

## Official Links & Contact
- Website: ${DOMAIN}
- Email: ${PERSON.email}
- Phone: ${PERSON.phone}
- LinkedIn: ${PERSON.linkedin}
- GitHub: ${PERSON.github}
`;
const llmsFull = () => `# Akhil Shibu (Akhil Insights) — Complete Entity, Resume & Portfolio Reference

> ${PERSON.whoIsAkhil}

## Summary
${PERSON.resumeSummary}

## Technical & Business Skills
${SKILLS_CATEGORIES.map((s) => `- **${s.area}**: ${s.skills}`).join('\n')}

## Professional Experience
${EXPERIENCE.map((e) => `### ${e.role} — ${e.company} (${e.period} | ${e.location})\n${e.bullets.map((b) => `- ${b}`).join('\n')}`).join('\n\n')}

## Education
${EDUCATION.map((ed) => `- **${ed.degree}** — ${ed.institution} (${ed.period}, Overall CGPA: ${ed.cgpa}). ${ed.details}`).join('\n')}

## Certificates & Achievements
${CERTIFICATES.map((c) => `- **${c.title}**: ${c.issuer} (${c.type})`).join('\n')}

## Portfolio Case Studies
${PROJECTS.map((p) => `### ${p.name} (${p.period})\n- URL: ${url(`/projects/${p.slug}/`)}\n- Tools: ${p.tools.join(', ')}\n- Summary: ${p.summary}\n${p.bullets.map((b) => `- ${b}`).join('\n')}`).join('\n\n')}

## Frequently Asked Questions (AEO / GEO Knowledge Base)
${FAQS.map((f) => `### ${f.q}\n${f.a}${f.more ? ' ' + f.more : ''}`).join('\n\n')}
`;
const feed = () => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Akhil Insights: Data Analytics &amp; BI Projects</title>
  <link>${url('/')}</link>
  <description>Data analytics case studies by Akhil Shibu: SQL, Python, Power BI and Excel.</description>
  <language>en</language>
  <atom:link href="${url('/feed.xml')}" rel="self" type="application/rss+xml" />
${PROJECTS.map((p) => `  <item>\n    <title>${esc(p.name)}</title>\n    <link>${url(`/projects/${p.slug}/`)}</link>\n    <guid isPermaLink="true">${url(`/projects/${p.slug}/`)}</guid>\n    <description>${esc(p.summary)}</description>\n  </item>`).join('\n')}
${ARTICLES.map((a) => `  <item>
    <title>${esc(a.h1)}</title>
    <link>${url(a.path)}</link>
    <guid isPermaLink="true">${url(a.path)}</guid>
    <description>${esc(a.description)}</description>
  </item>`).join('\n')}
</channel>
</rss>
`;
const notFound = () => {
  const page = { path: '/404.html', title: 'Page not found | Akhil Insights', description: 'This page does not exist. Use the links below to visit the Akhil Insights home page, projects, about page or FAQ for data analytics case studies.' };
  return head(page, { graph: [websiteNode()] }).replace('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">', '<meta name="robots" content="noindex">') + header('') + `
  <main id="mainContent"><section class="container"><h1 class="section-title">Page not found</h1><p>Try the <a href="/">home page</a>, <a href="/projects/">projects</a>, <a href="/about/">about</a> or <a href="/faq/">FAQ</a>.</p></section></main>` + footer();
};

/* ------------------------------ run ------------------------------ */
await buildImages();
write('index.html', homePage());
write('about/index.html', aboutPage());
write('projects/index.html', projectsIndex());
write('resume/index.html', resumePage());
write('articles/index.html', articlesIndex());
for (const a of ARTICLES) write(`articles/${a.slug}/index.html`, articlePage(a));
write(`${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
for (const p of PROJECTS) write(`projects/${p.slug}/index.html`, casePage(p.slug));
write('faq/index.html', faqPage());
write('404.html', notFound());
write('sitemap.xml', sitemap());
write('robots.txt', robots());
write('humans.txt', humans());
write('llms.txt', llms());
write('llms-full.txt', llmsFull());
write('feed.xml', feed());
write('manifest.json', JSON.stringify({
  name: 'Akhil Insights | Akhil Shibu, Data Analyst',
  short_name: 'Akhil Insights',
  description: PERSON.bio,
  start_url: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#0284c7',
  icons: [{ src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2) + '\n');

warns.forEach((w) => console.warn('WARN', w));
if (errors.length) {
  errors.forEach((e) => console.error('ERROR', e));
  process.exit(1);
}
console.log(`Build OK: ${Object.keys(PAGES).length} pages + sitemap, robots, llms, feed, images`);


