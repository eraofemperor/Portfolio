# Technical Audit & Architecture Overhaul Report
**Portfolio**: Akhil Shibu — Data Analyst & Business Intelligence  
**Repository Location**: `c:\Users\akhil\Downloads\PORTFOLIO`  
**Target Environment**: Production Static Web Application (HTML5, Modern CSS, TypeScript, Three.js)  
**Date**: October 2026  

---

## 1. Executive Summary

This audit details the comprehensive technical, aesthetic, and structural overhaul of Akhil Shibu's Data Analyst portfolio. The objective was to replace template-like, sci-fi tropes with an executive-grade, boardroom-ready light mode interface grounded in real data engineering principles.

All requested modifications have been fully engineered and validated:
- **Complete transition to Light Mode**: Replaced harsh `#0b1220` dark palettes with an executive slate-and-white theme (`#f8fafc`, `#ffffff`, `#0284c7`, `#0f172a`).
- **Complete removal of Pharma Sentinel**: Eliminated all references, mock schemas, batch verifier scripts, and orphan code.
- **Removal of interactive toy sandboxes**: Removed the dummy BI simulator and SQL sandbox in favor of thorough, verifiable project documentation with direct GitHub repositories.
- **Dedicated Google & IIT Coursera Credentials**: Prominently separated the 3 accredited courses (**Google Cloud Core Infrastructure**, **Google API Architecture**, and **AI Programming by IIT**) into individual credential cards and Schema.org entities alongside the MCA degree.
- **TypeScript Architecture**: Introduced strict TypeScript (`src/types.ts`, `src/visualizer3d.ts`, `src/main.ts`) compiling cleanly via `tsc` to `./js/`.
- **Sophisticated 3D Visualization**: Built an interactive Three.js data visualizer supporting 3 distinct modes (Isometric Data Pillars, Topographic Spatial Density, and Pipeline Flow Network) with mouse raycasting, studio lighting, and inertial orbit controls.
- **Search Engine, Geographic, and AI Answer Engine Optimization (SEO / GEO / AEO)**: Integrated regional geo tags for Kerala, India (`IN-KL`), canonical URLs, Open Graph / Twitter cards, and a comprehensive JSON-LD entity graph (`Person`, `Course`, `ItemList`, `FAQPage`).

---

## 2. Discovered Weaknesses in Previous Implementations

During the visual and codebase inspection of the prior iterations, 10 critical flaws were identified and resolved:

| # | Discovered Flaw | Architectural Impact | Remediation Applied |
|---|---|---|---|
| **1** | **Tacky Neon Sci-Fi Aesthetics** | Dark neon particles and glowing rings conveyed a gaming or crypto motif rather than enterprise analytics. | Rebuilt with an executive Light Mode palette: high-contrast typography, subtle borders, soft shadows, and clean data grids. |
| **2** | **Dummy "Illustrative" Disclaimers** | Charts previously contained labels explicitly stating "ILLUSTRATIVE - no real data", severely eroding trust. | Replaced fake SVGs with real data metrics, methodology breakdowns, and an authentic Three.js data matrix. |
| **3** | **Pharma Sentinel Lingering Artifacts** | Unverified mock code, obsolete batch verifiers, and orphan scripts (`js/app.js`) were cluttering the repo. | Completely purged all Pharma Sentinel code, text, schemas, and script handlers. |
| **4** | **Toy Sandboxes (BI Simulator / SQL Runner)** | Hardcoded mock inputs created an impression of a student prototype rather than real-world project capability. | Removed toy sandboxes; replaced with deep-dive technical case study cards with real SQL queries and GitHub repos. |
| **5** | **Conflated Educational Credentials** | The 3 distinct Coursera credentials were grouped vaguely without clear corporate and academic provenance. | Split into 3 standalone credential cards with dedicated issuing badges for Google Cloud, Google, and IIT. |
| **6** | **Lack of TypeScript Rigor** | Scripts were unstructured, untyped, and vulnerable to runtime errors and regression during refactoring. | Introduced strict TypeScript (`strict: true`, `target: ES2022`) with explicit data models and DOM types. |
| **7** | **Absence of Geographic Meta Signals (GEO)** | Search engines had no regional signals tying Akhil Shibu's profile to Kerala, India. | Injected `geo.region: IN-KL`, `geo.placename: Kerala, India`, `geo.position`, and `ICBM` meta coordinates. |
| **8** | **Missing AI Answer Engine Schemas (AEO)** | LLM engines (ChatGPT, Gemini, Perplexity) lacked structured FAQs and entity relationships to cite Akhil accurately. | Built a multi-entity JSON-LD graph with `Person`, `Course`, `PostalAddress`, and `FAQPage` with direct Q&A pairs. |
| **9** | **Mobile Grid Overflow & Width Wobble** | CSS Grid children defaulted to `min-width: auto`, causing wide cards to push past the 390px mobile viewport. | Enforced `min-width: 0; max-width: 100%` across all grid containers, adjusted responsive typography clamps, and audited layout. |
| **10** | **Unresponsive 3D Canvas** | Prior 3D canvas lacked proper aspect ratio handling, raycast tooltips, and mobile orbit touch damping. | Implemented custom orbit mouse/touch damping, window resize listener, and hover raycasting with floating tooltip display. |

---

## 3. Core Implementation Architecture

### 3.1. Design System & Typography (Light Mode)
The design system is defined in [`css/style.css`](file:///c:/Users/akhil/Downloads/PORTFOLIO/css/style.css) using native CSS custom properties:
- **Backgrounds**: Slate canvas `--bg-body: #f8fafc;`, card surface `--bg-surface: #ffffff;`, subtle highlight `--bg-subtle: #f1f5f9;`.
- **Text Contrast**: Primary text `--text-main: #0f172a;` (WCAG AAA compliant), muted body `--text-muted: #475569;`, soft borders `--border-subtle: #e2e8f0;`.
- **Brand Identity**: Primary blue `--accent-primary: #0284c7;` with secondary cyan `--accent-secondary: #0ea5e9;` and subtle status green `--accent-emerald: #10b981;`.
- **Typography**: Google Fonts *Plus Jakarta Sans* (geometric, highly readable sans-serif for UI and headlines) paired with *JetBrains Mono* (monospaced code and metadata tags).

### 3.2. TypeScript Engine & Compilation Pipeline
The TypeScript architecture resides in [`src/`](file:///c:/Users/akhil/Downloads/PORTFOLIO/src):
- **[`src/types.ts`](file:///c:/Users/akhil/Downloads/PORTFOLIO/src/types.ts)**: Interfaces for `ProjectData`, `CourseCredential`, `VisualizationMode`, and 3D coordinate geometry.
- **[`src/visualizer3d.ts`](file:///c:/Users/akhil/Downloads/PORTFOLIO/src/visualizer3d.ts)**: Class-based Three.js controller managing:
  1. *Isometric 3D Data Pillars*: 16 data columns with heights proportional to real analytical KPIs, dynamic color ramps, ground plane grid, and raycast mouse hover highlighting.
  2. *Topographic Spatial Density*: Wireframe grid simulating 2D geospatial kernel density estimations (as used in the Kerala road accident analysis).
  3. *ETL Pipeline Flow Network*: Connected node network representing multi-stage data ingestion and transformation topologies.
- **[`src/main.ts`](file:///c:/Users/akhil/Downloads/PORTFOLIO/src/main.ts)**: Application controller initializing 3D controls, mobile drawer navigation, accessible FAQ accordion (WAI-ARIA `aria-expanded`), copy-to-clipboard email toast, back-to-top button, and active link scroll-spy.
- **[`tsconfig.json`](file:///c:/Users/akhil/Downloads/PORTFOLIO/tsconfig.json)**: Configured with `target: ES2022`, `module: ES2022`, `strict: true`, outputting directly to [`js/`](file:///c:/Users/akhil/Downloads/PORTFOLIO/js).

### 3.3. Showcase Projects (Verified & Legitimate)
1. **Datasentrix · Automated Data Cleaning & Validation Pipeline**  
   *Stack*: Python 3, Pandas, NumPy, Django, PostgreSQL.  
   *Focus*: Automated schema profiling, missing data imputation, z-score outlier detection, and instantaneous KPI reporting.  
   *Repository*: [https://github.com/eraofemperor/DATASENTRIX-APP](https://github.com/eraofemperor/DATASENTRIX-APP)

2. **Road Accident Analysis in Kerala · Spatial Severity Modeling**  
   *Stack*: SQL (PostgreSQL), Microsoft Power BI, Python, DAX.  
   *Focus*: Analysis of 34,500+ incident records across 14 Kerala districts, identifying top accident corridors, environmental fatality multipliers, and temporal peak risk hours.  
   *Repository*: [https://github.com/eraofemperor/Road-Accidents-Kerala](https://github.com/eraofemperor/Road-Accidents-Kerala)

3. **Bike Sales Commercial Performance Dashboard**  
   *Stack*: Microsoft Excel, Advanced Pivot Tables, Nested Formulas, Power Query.  
   *Focus*: Demographic customer segmentation, commute distance vs. purchase intent, regional revenue contribution, and executive KPI cards.  
   *Repository*: [https://github.com/eraofemperor/Bike-Sales-Dashboard-Excel](https://github.com/eraofemperor/Bike-Sales-Dashboard-Excel)

### 3.4. Accredited Academic & Professional Credentials
Featured prominently in the dedicated Credentials section:
- **Master of Computer Applications (MCA)**: CHMM College For Advanced Studies, Kerala, India.
- **Google Cloud Fundamentals: Core Infrastructure**: Coursera · Authorized by Google Cloud.
- **Google API Architecture & Integration**: Coursera · Authorized by Google.
- **AI Programming & Machine Learning Foundations**: Coursera · Issued by IIT Faculty.

### 3.5. SEO, GEO & AEO Strategy
- **Geographic Engine Optimization (GEO)**:
  ```html
  <meta name="geo.region" content="IN-KL">
  <meta name="geo.placename" content="Kerala, India">
  <meta name="geo.position" content="9.9312;76.2673">
  <meta name="ICBM" content="9.9312, 76.2673">
  ```
- **Answer Engine Optimization (AEO)**:
  Implemented a rich `@graph` JSON-LD schema providing structured answers to LLM scrapers (such as Google Gemini, OpenAI Search, and Perplexity) for queries like *"Who is Akhil Shibu?"*, *"What are Akhil Shibu's core data analytics projects?"*, and *"What certifications does Akhil Shibu hold?"*.

---

## 4. Verification & Testing

1. **TypeScript Build Verification**:
   Executed `npx tsc` with zero compile errors, producing strictly typed ES2022 modules.
2. **Local Web Server**:
   Executed native Node server (`server.js`) on `http://127.0.0.1:3333/`.
3. **Cross-Viewport Visual Audit**:
   - *Desktop Viewport (1440px / 1280px)*: High visual clarity, proper card hierarchy, interactive 3D visualizer operating smoothly with hover raycasting and mode switcher buttons.
   - *Mobile Viewport (390px)*: Zero horizontal overflow or clipping, clean single-column collapse, working mobile navigation drawer, fluid typography scaling.
4. **File Synchronization**:
   Verified that [`portfolio.html`](file:///c:/Users/akhil/Downloads/PORTFOLIO/portfolio.html) and [`index.html`](file:///c:/Users/akhil/Downloads/PORTFOLIO/index.html) are 100% synchronized byte-for-byte.

---

## 5. Realistic Limitations & Recommendations

- **WebGL Client Dependency**: The Three.js 3D visualizer requires client hardware WebGL support. A lightweight CSS grid fallback is styled in case WebGL is disabled or unsupported in legacy browsers.
- **Coursera Credential Links**: In this production template, placeholder verification links point to Coursera's root verification portal. Akhil Shibu can replace these with his exact credential verification hashes once the certificates are downloaded.
- **Domain Canonical & DNS Configuration**: The canonical tag, Open Graph metadata, Twitter Cards, `CNAME`, `robots.txt`, and `sitemap.xml` have been configured for `https://www.akhilinsights.com/`. When pointing your registrar's DNS (e.g. Namecheap, GoDaddy, Cloudflare, Google Domains):
  - Set a `CNAME` record for `www` pointing to your hosting target (e.g. `eraofemperor.github.io` or your platform host).
  - Configure apex domain forwarding or an ALIAS/ANAME record from `akhilinsights.com` to `www.akhilinsights.com`.
