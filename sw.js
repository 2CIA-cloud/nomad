const CACHE_NAME = 'azimute-pmmg-v3.2-icons';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './dados.json',
  './manifest.webmanifest',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './icon-192x192.png',
  './icon-512x512.png',
  './icon-maskable-512x512.png',
  './og-image.png'
];

// Instala e guarda os arquivos principais na memória do celular (Modo Avião)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Limpa caches antigos automaticamente quando sobe atualização (força atualização dos ícones)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia Network-First para dados.json, manifest.webmanifest e index.html
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        const resClone = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(req, resClone);
        });
        return networkRes;
      })
      .catch(() => {
        return caches.match(req);
      })
  );
});
