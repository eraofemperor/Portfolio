// Notify IndexNow-supporting engines (Bing, Yandex, Seznam, Naver; Yahoo uses Bing's index) of all sitemap URLs.
// Run AFTER deploying: node build/indexnow.mjs
import { DOMAIN, PAGES, INDEXNOW_KEY } from './site.mjs';

const host = new URL(DOMAIN).host;
const body = {
  host,
  key: INDEXNOW_KEY,
  keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`,
  urlList: Object.values(PAGES).map((p) => DOMAIN + p.path),
};
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
console.log(`IndexNow responded ${res.status} (200/202 = accepted) for ${body.urlList.length} URLs`);
