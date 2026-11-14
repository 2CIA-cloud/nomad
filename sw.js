const CACHE_NAME = 'azimute-v4.1-atu001';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './dados.json',
  './manifest.json'
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

// Limpa caches antigos automaticamente quando você sobe atualização no GitHub
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

// Estratégia Network-First para dados.json e index.html (sempre busca a versão mais nova se tiver internet; se estiver sem sinal no beco/estádio, usa a memória offline)
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
