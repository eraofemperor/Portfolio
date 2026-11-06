// Generates assets/Akhil_Shibu_Data_Analyst_CV.pdf directly from resume/index.html + css/style.css
// using headless Microsoft Edge / Chrome so the downloadable PDF and /resume/ page never drift.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DOMAIN } from './site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PDF = path.join(ROOT, 'assets/Akhil_Shibu_Data_Analyst_CV.pdf');

const BROWSERS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

const browser = BROWSERS.find((p) => fs.existsSync(p));
if (!browser) {
  console.error('No Chromium browser (Edge/Chrome) found for PDF generation.');
  process.exit(1);
}

const interB64 = fs.readFileSync(path.join(ROOT, 'assets/fonts/inter-latin.woff2')).toString('base64');
const outfitB64 = fs.readFileSync(path.join(ROOT, 'assets/fonts/outfit-latin.woff2')).toString('base64');

let css = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');
css = css
  .replace('url(../assets/fonts/inter-latin.woff2)', `url(data:font/woff2;base64,${interB64})`)
  .replace('url(../assets/fonts/outfit-latin.woff2)', `url(data:font/woff2;base64,${outfitB64})`);

const resumeHtml = fs.readFileSync(path.join(ROOT, 'resume/index.html'), 'utf8');
const articleMatch = resumeHtml.match(/<article[^>]*id="resumeDocument"[^>]*>[\s\S]*?<\/article>/);
if (!articleMatch) {
  console.error('Could not locate #resumeDocument in resume/index.html');
  process.exit(1);
}

// Convert root-relative project links to canonical HTTPS links inside the standalone PDF
const article = articleMatch[0].replace(/href="(\/[^"]*)"/g, (_, p) => `href="${DOMAIN}${p}"`);

const printDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Akhil Shibu - Data Analyst, Business Intelligence &amp; Business Analyst Resume</title>
  <meta name="author" content="Akhil Shibu">
  <meta name="subject" content="Akhil Shibu ATS Resume - Data Analyst, Power BI Developer, SQL &amp; Python Analyst">
  <meta name="keywords" content="Akhil Shibu, Akhil, Data Analyst, Business Analyst, Power BI, SQL, Python, Advanced Excel, MCA 2026, Kerala, India">
  <style>${css}</style>
</head>
<body>
  <main id="mainContent">${article}</main>
</body>
</html>`;

const tmpDir = path.join(ROOT, '.tmp-pdf');
fs.rmSync(tmpDir, { recursive: true, force: true });
fs.mkdirSync(tmpDir, { recursive: true });
const tmpHtml = path.join(tmpDir, 'resume-print.html');
const userDataDir = path.join(tmpDir, 'edge-profile');
fs.mkdirSync(userDataDir, { recursive: true });
fs.writeFileSync(tmpHtml, printDoc, 'utf8');

try {
  const fileUrl = 'file:///' + tmpHtml.replace(/\\/g, '/');
  execFileSync(
    browser,
    [
      '--headless',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${userDataDir}`,
      '--no-pdf-header-footer',
      '--print-to-pdf-no-header',
      `--print-to-pdf=${OUT_PDF}`,
      fileUrl,
    ],
    { stdio: 'pipe', timeout: 30000 }
  );
  const stat = fs.statSync(OUT_PDF);
  console.log(`Generated ${OUT_PDF} (${stat.size} bytes)`);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
