// Service worker: keeps the app working offline.
// Raise CACHE_VERSION every time you change a file, so phones fetch the new version.
const CACHE_VERSION = 'br-v9';
const APP_FILES = [
  './',
  './index.html',
  './styles.css',
  './config.js',
  './app.js',
  './geo.js',
  './manifest.webmanifest',
  './fonts/Inter-Regular.woff',
  './fonts/Inter-SemiBold.woff',
  './fonts/Inter-Bold.woff',
  './fonts/InterDisplay-Bold.woff',
  './icons/favicon.svg',
  './icons/favicon-32.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // Only our own files; feedback and stats always go straight to the network
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  // Online: always the newest version (and save it). Offline: the saved copy.
  event.respondWith(
    fetch(req).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req.mode === 'navigate' ? './index.html' : req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
