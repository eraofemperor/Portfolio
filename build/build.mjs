// Static site generator: node build/build.mjs
// Outputs real HTML pages (no JS needed to read content), sitemap, robots, llms.txt and WebP images.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { DOMAIN, BUILD_DATE, PERSON, PROJECTS, FAQS, PAGES, INDEXNOW_KEY } from './site.mjs';

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
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0284c7"/><path d="M6 22l6-8 5 4 9-11" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="26" cy="7" r="3" fill="#38bdf8"/></svg>`);
    await sharp(svg).png().toFile(path.join(ROOT, `assets/icon-${s}.png`));
  }
}

/* ------------------------------ schema ------------------------------ */
const personNode = () => ({
  '@type': 'Person',
  '@id': url('/#akhil'),
  name: PERSON.name,
  url: url('/'),
  image: url('/assets/akhil-profile-500.jpg'),
  jobTitle: 'Data Analyst',
  description: PERSON.bio,
  address: { '@type': 'PostalAddress', addressLocality: PERSON.locality, addressRegion: PERSON.region, addressCountry: PERSON.country },
  alumniOf: { '@type': 'CollegeOrUniversity', name: PERSON.college },
  knowsAbout: ['SQL', 'SQL window functions', 'Power BI', 'DAX', 'Python', 'Pandas', 'Django', 'Microsoft Excel', 'Pivot Tables', 'XLOOKUP', 'ETL', 'Data Cleaning', 'Data Validation', 'Data Visualization'],
  sameAs: [PERSON.github, PERSON.linkedin],
  hasOccupation: { '@type': 'Occupation', name: 'Data Analyst', occupationLocation: { '@type': 'Country', name: 'India' }, skills: 'SQL, Power BI, Python, Excel' },
  mainEntityOfPage: url('/about/'),
});
const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': url('/#website'),
  url: url('/'),
  name: 'Akhil Insights',
  alternateName: `${PERSON.name} | Data Analytics & Business Intelligence`,
  inLanguage: 'en',
  publisher: { '@id': url('/#akhil') },
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
  dateModified: BUILD_DATE,
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
  ['/faq/', 'FAQ'],
  ['/about/#contact', 'Contact'],
];

function head(page, { graph, preload = '', ogType = 'website' }) {
  if (page.title.length > 60) errors.push(`Title >60 (${page.title.length}): ${page.title}`);
  if (page.description.length > 155 || page.description.length < 140) errors.push(`Description ${page.description.length} chars (want 140-155): ${page.path}`);
  const jsonld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="author" content="${PERSON.name}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${url(page.path)}">
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
  <meta property="og:locale" content="en_IN">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.description)}">
  <meta name="twitter:image" content="${DOMAIN}/assets/akhil-og-image.jpg">

  <link rel="preload" href="/assets/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
${preload}  <link rel="stylesheet" href="/css/style.css">

  <script type="application/ld+json">
${jsonld}
  </script>
</head>`;
}

function header(current) {
  const links = NAV.map(([href, label]) => {
    const active = href === current ? ' active" aria-current="page' : '';
    return `        <li><a class="nav-link${active}" href="${href}">${label}</a></li>`;
  }).join('\n');
  return `<body>
  <a class="skip-link" href="#mainContent">Skip to main content</a>
  <header class="site-header">
    <nav class="container site-nav" aria-label="Main Navigation">
      <a class="nav-brand" href="/">
        <span class="brand-badge" aria-hidden="true">AI</span>
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
      <div><strong>${PERSON.name}</strong> · ${PERSON.role}</div>
      <nav class="footer-nav" aria-label="Footer Navigation">
        <a href="/about/">About Akhil Shibu</a>
        <a href="/resume/">Online resume</a>
        <a href="/projects/">Data analytics projects</a>
        <a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a>
        <a href="/projects/datasentrix/">Datasentrix</a>
        <a href="/projects/bike-sales-dashboard/">Bike sales dashboard</a>
        <a href="/faq/">FAQ</a>
        <a href="${PERSON.github}" rel="me noopener">GitHub</a>
        <a href="${PERSON.linkedin}" rel="me noopener">LinkedIn</a>
      </nav>
      <div>© <span id="currentYear">2026</span> ${PERSON.name}. All rights reserved.</div>
    </div>
  </footer>
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
        <p class="contact-desc">Hiring for a data analyst or Power BI role, or have a reporting problem to fix? Email is the fastest way to reach me.</p>
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
        <article class="project-card flagship">
          <div>
            <div class="project-badge-row"><span class="project-category">0${i + 1} · ${esc(p.category)}</span></div>
            <h3 class="project-title"><a href="/projects/${p.slug}/">${esc(p.name)}</a></h3>
            <p class="project-summary">${esc(p.summary)}</p>
          </div>
          <div>
            <div class="tech-pills">${p.tools.map((t) => `<span class="tech-pill">${esc(t)}</span>`).join('')}</div>
            <div class="project-links">
              <a class="btn btn-sm btn-primary" href="/projects/${p.slug}/">Read the ${esc(p.short)} case study</a>
              <a class="btn btn-sm btn-secondary" href="${p.repo}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
            </div>
          </div>
        </article>`;

const WORKFLOW = [
  ['01 · UNDERSTAND', 'Business Objective', 'Clarify stakeholder KPIs, decision bottlenecks and success criteria.'],
  ['02 · INSPECT', 'Schema & Quality', 'Audit raw schemas, data types, cardinality, nulls and duplicates.'],
  ['03 · CLEAN', 'Validation', 'Apply validation rules, impute or drop invalid records, isolate outliers.'],
  ['04 · TRANSFORM', 'Feature Engineering', 'Build calculated dimensions, time lags and star schemas.'],
  ['05 · ANALYZE', 'SQL & Modeling', 'Run multi-level aggregations, window ranks and variance checks.'],
  ['06 · VISUALIZE', 'BI Dashboarding', 'Build dashboards with slicers and drill-downs.'],
  ['07 · DIAGNOSE', 'Root Cause', 'Separate seasonal noise from structural shifts.'],
  ['08 · ACT', 'Recommendation', 'Turn findings into prioritised operational decisions.'],
];

function homePage() {
  const page = PAGES.home;
  const graph = [websiteNode(), webPageNode(page), personNode()];
  const hero = `
  <main id="mainContent">
    <section id="home" class="hero-section container">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="hero-status-pill"><span class="pulse-indicator"></span><span>Open for Data Analyst &amp; BI roles</span></div>
          <h1 class="hero-title">${PERSON.name} <span class="accent-text">— Data Analyst &amp; Power BI Specialist</span></h1>
          <p class="hero-subtitle">Transforming complex data into actionable decisions · SQL · Power BI · Python · Excel</p>
          <p class="hero-description">${PERSON.bio} <strong>Akhil Insights</strong> is my portfolio of case studies: raw, messy business records turned into cleaned datasets, KPIs and dashboards that support real decisions.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="/projects/">View case studies</a>
            <a class="btn btn-secondary" href="/assets/Akhil_Shibu_Data_Analyst_CV.pdf" download>Download resume</a>
            <a class="btn btn-ghost" href="/about/#contact">Contact Akhil</a>
          </div>
          <p class="hero-location">📍 Thiruvananthapuram, Kerala · Open to Technopark, Infopark, pan-India and remote roles</p>
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
                <svg viewBox="0 0 320 200" aria-hidden="true" focusable="false"><g fill="#0284c7"><rect x="40" y="110" width="30" height="60" rx="3" opacity=".55"/><rect x="85" y="80" width="30" height="90" rx="3" opacity=".7"/><rect x="130" y="50" width="30" height="120" rx="3"/><rect x="175" y="95" width="30" height="75" rx="3" opacity=".7"/><rect x="220" y="65" width="30" height="105" rx="3" fill="#4f46e5"/></g><line x1="25" y1="170" x2="295" y2="170" stroke="#cbd5e1" stroke-width="2"/></svg>
                <button type="button" class="btn btn-sm btn-secondary" id="v3dLoadBtn">Load interactive 3D view</button>
              </div>
            </div>
            <div id="v3dTooltip" class="v3d-tooltip"></div>
          </div>
          <div class="v3d-footer"><span>Drag to rotate · Hover to inspect</span><span style="color:var(--accent-primary)">WebGL</span></div>
        </aside>
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
      <p class="more-link"><a href="/projects/">See all data analytics projects →</a></p>
    </section>

    <section id="skills" class="container">
      <div class="section-header">
        <span class="section-tag">Capabilities</span>
        <h2 class="section-title">What tools does Akhil Shibu use?</h2>
        <p class="section-desc">SQL, Power BI, Excel and Python, applied to cleaning, modelling and reporting.</p>
      </div>
      <div class="skills-grid">
        <div class="skill-card"><h3>Data analytics &amp; hygiene</h3><div class="skill-tags">${['Data cleaning', 'Schema validation', 'Exploratory analysis', 'Z-score outlier detection', 'KPI design', 'Trend & cohort analysis'].map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div></div>
        <div class="skill-card"><h3>Business intelligence</h3><div class="skill-tags">${['Power BI', 'DAX measures', 'Star-schema modelling', 'KPI cards', 'Slicers & drill-downs', 'Excel pivot tables'].map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div></div>
        <div class="skill-card"><h3>Languages &amp; frameworks</h3><div class="skill-tags">${['SQL (PostgreSQL, MySQL)', 'CTEs & window functions', 'Python 3', 'Pandas & NumPy', 'Matplotlib', 'Django'].map((t) => `<span class="skill-tag">${t}</span>`).join('')}</div></div>
      </div>
    </section>

    <section id="workflow" class="container">
      <div class="section-header">
        <span class="section-tag">Methodology</span>
        <h2 class="section-title">How does Akhil turn raw data into decisions?</h2>
        <p class="section-desc">Every project follows the same eight steps, from business question to recommendation.</p>
      </div>
      <ol class="workflow-chain">${WORKFLOW.map(([n, t, d]) => `<li class="workflow-step"><div class="step-num">${n}</div><div class="step-title">${t}</div><div class="step-desc">${d}</div></li>`).join('')}</ol>
    </section>

    <section id="faq-teaser" class="container">
      <div class="section-header">
        <span class="section-tag">Quick answers</span>
        <h2 class="section-title">Frequently asked questions</h2>
      </div>
      ${faqHtml(FAQS.slice(0, 3))}
      <p class="more-link"><a href="/faq/">Read all questions about Akhil Shibu →</a></p>
    </section>
${contactBlock()}
  </main>`;
  graph.push(faqNode(page, FAQS.slice(0, 3)));
  const redirect = `  <script>
    // Old single-page anchors (#about, #projects...) now live on real pages.
    (function(){var m={'#about':'/about/','#projects':'/projects/','#faq':'/faq/','#credentials':'/about/#credentials','#contact':'/about/#contact'};var t=m[location.hash];if(t)location.replace(t);})();
  </script>
`;
  return head(page, { graph, preload: '' }).replace('</head>', redirect + '</head>') + header('/') + hero + footer();
}

function aboutPage() {
  const page = PAGES.about;
  const bc = [['Home', '/'], ['About', '/about/']];
  const graph = [
    websiteNode(),
    { ...webPageNode(page, 'ProfilePage'), mainEntity: { '@id': url('/#akhil') } },
    personNode(),
    crumbs(bc),
  ];
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <section class="container about-intro">
      <div class="section-header">
        <span class="section-tag">Analytical profile</span>
        <h1 class="section-title">About Akhil Shibu, Data Analyst in Kerala</h1>
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
            <div class="profile-meta-item"><span>📍 Thiruvananthapuram, Kerala, India</span></div>
            <div class="profile-meta-item"><span>🎓 MCA, Kerala University (2026)</span></div>
            <div class="profile-meta-item"><span>💼 Open to relocation &amp; remote</span></div>
          </div>
          <div class="profile-actions"><a class="btn btn-sm btn-primary" href="/assets/Akhil_Shibu_Data_Analyst_CV.pdf" download>Download resume (PDF)</a> <a class="btn btn-sm btn-secondary" href="/resume/">View online resume</a></div>
        </aside>
        <div class="prose">
          <h2>Who is Akhil Shibu?</h2>
          <p>I am an MCA graduate from ${PERSON.college}, specialising in data analytics, business intelligence and automated ETL pipelines. My work targets real business and public-safety questions: where road accidents concentrate, how to clean messy spreadsheets repeatably, and how to give managers a dashboard they can trust.</p>
          <p>I cover the full lifecycle: scope the question, profile the raw schema, validate and clean records, aggregate with SQL window functions, and build Power BI star-schema models.</p>
          <p>My experience comes from three portfolio projects (see the <a href="/projects/">data analytics case studies</a>).</p>
          <h2>What principles guide the work?</h2>
          <ul class="principles">
            <li><strong>Data hygiene first.</strong> Audit schema drift, nulls and outliers before drawing conclusions.</li>
            <li><strong>Decision-centric reporting.</strong> Build KPI scorecards that answer a specific management question.</li>
            <li><strong>Automated and repeatable.</strong> Prefer SQL scripts and Python pipelines over manual steps, as in <a href="/projects/datasentrix/">Datasentrix</a>.</li>
          </ul>
        </div>
      </div>
    </section>

    <section id="credentials" class="container">
      <div class="section-header"><h2 class="section-title">What education and certificates does Akhil hold?</h2></div>
      <div class="credential-main"><h3>Master of Computer Applications (MCA)</h3><p class="cred-sub">${PERSON.college} · Kerala University · 2026</p><p>Coursework includes relational databases, SQL query optimisation, Python, algorithms and data structures, and web architecture.</p></div>
      <div class="table-wrap"><table>
        <caption>Course certificates (Coursera)</caption>
        <thead><tr><th>Course</th><th>Provider</th></tr></thead>
        <tbody>
          <tr><td>Google Cloud Fundamentals: Core Infrastructure</td><td>Google Cloud, via Coursera</td></tr>
          <tr><td>Google API Architecture &amp; Integration</td><td>Google, via Coursera</td></tr>
          <tr><td>AI Programming &amp; Machine Learning Foundations</td><td>IIT faculty, via Coursera</td></tr>
        </tbody></table></div>
      <p class="note">These are course completion certificates, not Google Cloud professional certification exams.</p>
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
        <h1 class="section-title">Data analytics projects and case studies</h1>
        <p class="section-desc">Each project has its own page with the problem, tools, method, results and an FAQ. Start with the Kerala road accident analysis if you want the most data-heavy example.</p>
      </div>
      <div class="projects-grid">${PROJECTS.map(projectCard).join('')}
      </div>
      <h2 class="sub-title">Which project should I read first?</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>If you care about…</th><th>Read</th><th>Main tools</th></tr></thead>
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
      <p>All 14: Thiruvananthapuram, Kollam, Pathanamthitta, Alappuzha, Kottayam, Idukki, Ernakulam, Thrissur, Palakkad, Malappuram, Kozhikode, Wayanad, Kannur and Kasaragod.</p>`,
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
      <p>See how the same cleaning discipline applies to public data in the <a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a>.</p>`,
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
      <p>Many small teams already work in Excel. A well-modelled workbook with pivot tables and slicers gives them interactive analysis without new software. For larger data and shared reporting, the same approach moves to Power BI, as in the <a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a>.</p>`,
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
    { '@id': url(page.path) + '#project', ...about, url: url(page.path), creator: { '@id': url('/#akhil') }, dateModified: BUILD_DATE, keywords: proj.tools.join(', ') },
    faqNode(page, c.faqs),
  ];
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <article class="container case-study">
      <header class="section-header">
        <span class="section-tag">Case study</span>
        <h1 class="section-title">${esc(c.h1)}</h1>
        <p class="answer-box">${esc(c.answer)}</p>
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
  ];
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <section class="container">
      <div class="section-header">
        <span class="section-tag">Answers</span>
        <h1 class="section-title">Data analyst FAQ: skills, tools and hiring</h1>
        <p class="section-desc">Short answers first, details below. Everything here is about Akhil Shibu and his portfolio work.</p>
      </div>
      ${faqHtml(FAQS)}
      <h2 class="sub-title">Analytics glossary</h2>
      <dl class="glossary-grid">${gloss.map(([t, d]) => `<div class="glossary-card"><dt><dfn>${t}</dfn></dt><dd>${d}</dd></div>`).join('')}</dl>
      <p class="more-link">See the work: <a href="/projects/">data analytics projects</a> · <a href="/about/">about Akhil Shibu</a></p>
    </section>
${contactBlock()}
  </main>`;
  return head(page, { graph }) + header('/faq/') + body + footer();
}

function resumePage() {
  const page = PAGES.resume;
  const bc = [['Home', '/'], ['Resume', '/resume/']];
  const graph = [websiteNode(), { ...webPageNode(page, 'ProfilePage'), mainEntity: { '@id': url('/#akhil') } }, personNode(), crumbs(bc)];
  const body = `
  <main id="mainContent">
    ${breadcrumbHtml(bc)}
    <section class="container about-intro">
      <div class="section-header">
        <span class="section-tag">Resume</span>
        <h1 class="section-title">Akhil Shibu: Data Analyst Resume (SQL, Power BI, Python, Excel)</h1>
        <p class="section-desc">${PERSON.bio} Based in Thiruvananthapuram, Kerala, and open to roles in Kerala, across India and remote. <a href="/assets/Akhil_Shibu_Data_Analyst_CV.pdf" download>Download the PDF version</a>.</p>
      </div>
      <div class="prose">
        <h2>Contact</h2>
        <ul class="principles">
          <li>Email: <a href="mailto:${PERSON.email}">${PERSON.email}</a></li>
          <li>Phone: <a href="tel:${PERSON.phoneHref}">${PERSON.phone}</a></li>
          <li>LinkedIn: <a href="${PERSON.linkedin}" rel="me noopener">${PERSON.linkedin.replace('https://www.', '')}</a></li>
          <li>GitHub: <a href="${PERSON.github}" rel="me noopener">github.com/eraofemperor</a></li>
        </ul>
        <h2>Education</h2>
        <p><strong>Master of Computer Applications (MCA)</strong>, ${PERSON.college}, Kerala University, 2026. Coursework includes relational databases, SQL query optimisation, Python, algorithms and data structures, and web architecture.</p>
        <h2>Skills</h2>
        <div class="table-wrap"><table>
          <thead><tr><th>Area</th><th>Tools and techniques</th><th>Shown in</th></tr></thead>
          <tbody>
            <tr><td>SQL</td><td>CTEs, window functions, aggregation (PostgreSQL, MySQL)</td><td><a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a></td></tr>
            <tr><td>Business intelligence</td><td>Power BI, DAX measures, star-schema modelling, slicers</td><td><a href="/projects/kerala-road-accident-analysis/">Kerala road accident analysis</a></td></tr>
            <tr><td>Excel</td><td>Pivot tables, XLOOKUP, slicer timelines, KPI cards</td><td><a href="/projects/bike-sales-dashboard/">Bike sales dashboard</a></td></tr>
            <tr><td>Python</td><td>Pandas, NumPy, Matplotlib, Django, Z-score outlier checks</td><td><a href="/projects/datasentrix/">Datasentrix</a></td></tr>
          </tbody></table></div>
        <h2>Projects</h2>
        <ul class="principles">${PROJECTS.map((p) => `<li><strong><a href="/projects/${p.slug}/">${esc(p.name)}</a>.</strong> ${esc(p.summary)}</li>`).join('')}</ul>
        <h2>Course certificates</h2>
        <ul class="principles">
          <li>Google Cloud Fundamentals: Core Infrastructure (Google Cloud, Coursera)</li>
          <li>Google API Architecture &amp; Integration (Google, Coursera)</li>
          <li>AI Programming &amp; Machine Learning Foundations (IIT faculty, Coursera)</li>
        </ul>
        <p class="note">These are course completion certificates, not professional certification exams.</p>
      </div>
    </section>
${contactBlock()}
  </main>`;
  return head(page, { graph, ogType: 'profile' }) + header('/resume/') + body + footer();
}

/* ------------------------------ static files ------------------------------ */
function sitemap() {
  const urls = Object.values(PAGES).map((p) => `  <url>\n    <loc>${url(p.path)}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`;
const llms = () => `# Akhil Insights

> ${PERSON.name} is a ${PERSON.role.toLowerCase().replace('data analyst', 'Data Analyst')} based in ${PERSON.locality}, ${PERSON.region}, India. ${PERSON.bio}

## About
- [About ${PERSON.name}](${url('/about/')}): background, MCA education, course certificates, contact.
- [Resume](${url('/resume/')}): skills, education, projects and contact details in plain HTML.
- [FAQ](${url('/faq/')}): short answers about tools, projects, availability.

## Projects
${PROJECTS.map((p) => `- [${p.name}](${url(`/projects/${p.slug}/`)}): ${p.summary}`).join('\n')}

## Links
- GitHub: ${PERSON.github}
- LinkedIn: ${PERSON.linkedin}
- Email: ${PERSON.email}
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
write(`${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);
for (const p of PROJECTS) write(`projects/${p.slug}/index.html`, casePage(p.slug));
write('faq/index.html', faqPage());
write('404.html', notFound());
write('sitemap.xml', sitemap());
write('robots.txt', robots());
write('llms.txt', llms());
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
console.log('Build OK: 7 pages + sitemap, robots, llms, feed, images');


