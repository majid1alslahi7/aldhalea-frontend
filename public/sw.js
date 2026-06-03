const CACHE_VERSION = 'aldhalea-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/brand/aldhalea-mark.png',
  '/brand/aldhalea-logo-full.png',
  '/brand/aldhalea-logo-night.png',
  '/brand/og-image.png',
  '/icons/pwa-192.png',
  '/icons/pwa-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith(fetch(request).catch(() => caches.match('/')));
    return;
  }

  if (url.origin === self.location.origin && /\.(?:png|ico|webmanifest|css|js|woff2?)$/i.test(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
  }
});
