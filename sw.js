/* Entrena tu temario — funcionamiento sin conexión. Versión: 202609272006 */
const CACHE = 'ett-202609272006';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
  './fonts/montserrat-latin.woff2', './fonts/montserrat-latin-ext.woff2', './fonts/opensans-latin.woff2', './fonts/opensans-latin-ext.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const put = r => { if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; };
  if (url.origin === location.origin) {
    // Primero la red (para recibir las actualizaciones del temario); sin conexión, la copia guardada.
    e.respondWith(fetch(req).then(put).catch(() => caches.match(req).then(m => m || caches.match('./index.html'))));
  }
});
