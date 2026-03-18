/* ═══════════════════════════════════════════════════
   SERVICE WORKER — Shivam Singh Portfolio
   Strategy: Cache-first for assets, Network-first for HTML
   ═══════════════════════════════════════════════════ */

const CACHE  = 'portfolio-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/Healthcure.html',
  '/Skillbridge.html',
  '/Styles.css',
  '/Script.js',
  '/public/Shivam_Singh_Resume.pdf',
];

/* Install: pre-cache core assets */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

/* Activate: delete old caches */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Fetch: cache-first for assets, network-first for HTML */
self.addEventListener('fetch', e => {
  const { request } = e;
  // Skip non-GET and cross-origin requests
  if(request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  const isHTML = request.headers.get('accept')?.includes('text/html');

  if(isHTML) {
    // Network-first for HTML so content is always fresh
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // Cache-first for JS/CSS/fonts/images
    e.respondWith(
      caches.match(request).then(cached => {
        if(cached) return cached;
        return fetch(request).then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        });
      })
    );
  }
});
