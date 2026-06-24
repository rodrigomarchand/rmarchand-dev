// ====================================================================
// S_RUN — Service Worker (cache offline + versão)
// ====================================================================
const VERSION = '0.1.0';
const CACHE = 'srun-cache-v' + VERSION;
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(ASSETS)).catch(() => {})
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Cache-first com atualização em segundo plano
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(cached => {
            const network = fetch(event.request).then(resp => {
                if (resp && resp.status === 200 && resp.type === 'basic') {
                    const copy = resp.clone();
                    caches.open(CACHE).then(c => c.put(event.request, copy));
                }
                return resp;
            }).catch(() => cached);
            return cached || network;
        })
    );
});

// Responde a versão para o badge
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'GET_VERSION') {
        event.source.postMessage({ type: 'VERSION', version: VERSION });
    }
});
