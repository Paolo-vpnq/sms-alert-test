const CACHE_NAME = 'hse-alert-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './assets/nne-logo-white.png',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    // Never cache API calls (Power Automate endpoint)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    );
});
