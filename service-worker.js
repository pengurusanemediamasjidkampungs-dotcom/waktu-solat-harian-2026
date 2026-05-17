const CACHE = 'waktusolat-v3';
const API_CACHE = 'waktusolat-api-v3';
const CDN_CACHE = 'waktusolat-cdn-v3';

const APP_SHELL = [
  '.',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

function isAPI(url) {
  return url.includes('raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/');
}

function isCDN(url) {
  return url.includes('cdn.jsdelivr.net') ||
         url.includes('cdnjs.cloudflare.com') ||
         url.includes('fonts.googleapis.com') ||
         url.includes('fonts.gstatic.com') ||
         url.includes('upload.wikimedia.org');
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll(APP_SHELL).catch(err => {
        console.warn('Pre-cache partial failure:', err);
      })
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names.map(n => {
          if (![CACHE, API_CACHE, CDN_CACHE].includes(n))
            return caches.delete(n);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  if (isAPI(url)) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  if (isCDN(url)) {
    event.respondWith(staleWhileRevalidate(event.request, CDN_CACHE));
    return;
  }

  event.respondWith(cacheFirst(event.request, CACHE));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response('Sambungan internet diperlukan.', { status: 408 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offlinePage = await caches.match('index.html');
    if (offlinePage) return offlinePage;
    return new Response('Tiada sambungan internet.', { status: 408 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);
  return cached || fetchPromise;
}
