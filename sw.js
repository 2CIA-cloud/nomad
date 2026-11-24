/* AZIMUTE PMMG — Service Worker v4.0
   - APP_CACHE: App Shell (Network-First, atualiza rápido a cada deploy no GitHub)
   - MAP_CACHE: tiles/estilos/sprites/glyphs de mapa (Cache-First, NUNCA apagado em atualização do app)
   - APIs dinâmicas (clima, busca de endereço, rotas, MQTT) passam direto pela rede, sem cache. */
const APP_CACHE = 'azimute-app-shell-v4.0';
const MAP_CACHE = 'azimute-map-tiles-v1';
const MAP_MAX_ITEMS = 3500;
const MAP_TRIM_EVERY = 40;

const APP_SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  './dados.json'
];

const MAP_HOST_RULES = [
  /(^|\.)tiles\.openfreemap\.org$/i,
  /(^|\.)openfreemap\.org$/i,
  /^server\.arcgisonline\.com$/i,
  /^services\.arcgisonline\.com$/i,
  /(^|\.)basemaps\.cartocdn\.com$/i,
  /(^|\.)tile\.openstreetmap\.org$/i,
  /(^|\.)tile\.opentopomap\.org$/i
];

const DYNAMIC_API_RULES = [
  /open-meteo\.com$/i,
  /nominatim\.openstreetmap\.org$/i,
  /photon\.komoot\.io$/i,
  /router\.project-osrm\.org$/i,
  /overpass/i,
  /^wss?:$/i
];

let mapPutCounter = 0;

function isMapHost(hostname) {
  return MAP_HOST_RULES.some(function (re) { return re.test(hostname); });
}

function isDynamicApi(url) {
  if (url.protocol === 'ws:' || url.protocol === 'wss:') return true;
  return DYNAMIC_API_RULES.some(function (re) { return re.test(url.hostname); });
}

self.addEventListener('install', function (event) {
  event.waitUntil((async function () {
    const cache = await caches.open(APP_CACHE);
    // Instalação resiliente: um 404 (ex.: ./dados.json) nunca aborta o Service Worker
    await Promise.all(APP_SHELL_ASSETS.map(async function (asset) {
      try {
        const res = await fetch(asset, { cache: 'no-store' });
        if (res && res.ok) await cache.put(asset, res.clone());
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.map(function (key) {
      if (key === APP_CACHE || key === MAP_CACHE) return Promise.resolve();
      return caches.delete(key); // remove versões antigas (ex.: azimute-pmmg-v3.2); preserva sempre o MAP_CACHE
    }));
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(APP_CACHE);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok && fresh.status === 200 && fresh.type === 'basic') {
      cache.put(request, fresh.clone()).catch(function () {});
    }
    return fresh;
  } catch (err) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = (await cache.match('./index.html')) || (await cache.match('./'));
      if (shell) return shell;
    }
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

async function trimMapCache() {
  try {
    const cache = await caches.open(MAP_CACHE);
    const keys = await cache.keys();
    const excess = keys.length - MAP_MAX_ITEMS;
    if (excess > 0) {
      // keys() retorna em ordem de inserção: remove primeiro os mais antigos
      for (let i = 0; i < excess; i++) {
        await cache.delete(keys[i]);
      }
    }
  } catch (_) {}
}

async function cacheFirstMap(request, event) {
  const cache = await caches.open(MAP_CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  try {
    const res = await fetch(request);
    // Só guarda respostas válidas com CORS limpo (nunca opacas: inflam a cota do Chrome)
    if (res && res.ok && res.status === 200 && res.type !== 'opaque') {
      const copy = res.clone();
      event.waitUntil((async function () {
        try {
          const len = parseInt(copy.headers.get('content-length') || '0', 10);
          const blob = await copy.blob();
          const headers = new Headers(copy.headers);
          headers.set('x-az-size', String(len || blob.size));
          await cache.put(request, new Response(blob, { status: 200, statusText: 'OK', headers: headers }));
          mapPutCounter++;
          if (mapPutCounter % MAP_TRIM_EVERY === 0) await trimMapCache();
        } catch (_) {}
      })());
    }
    return res;
  } catch (err) {
    return Response.error();
  }
}

self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch (_) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // APIs dinâmicas: direto para a rede (nunca congelar busca/telemetria)
  if (isDynamicApi(url)) return;

  // Mapas: Cache-First na gaveta exclusiva
  if (isMapHost(url.hostname)) {
    event.respondWith(cacheFirstMap(request, event));
    return;
  }

  // App Shell / JSON local (mesma origem): Network-First com fallback offline
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
  }
  // Demais origens (CDNs de bibliotecas etc.): comportamento padrão do navegador
});

async function getMapCacheStats() {
  const cache = await caches.open(MAP_CACHE);
  const keys = await cache.keys();
  let bytes = 0;
  const BATCH = 200;
  for (let i = 0; i < keys.length; i += BATCH) {
    const slice = keys.slice(i, i + BATCH);
    const results = await Promise.all(slice.map(function (req) {
      return cache.match(req).then(function (res) {
        if (!res) return 0;
        const v = parseInt(res.headers.get('x-az-size') || res.headers.get('content-length') || '0', 10);
        return v > 0 ? v : 30000;
      }).catch(function () { return 0; });
    }));
    results.forEach(function (n) { bytes += n; });
  }
  return { count: keys.length, bytes: bytes, mb: Math.round((bytes / 1048576) * 10) / 10, max: MAP_MAX_ITEMS };
}

self.addEventListener('message', function (event) {
  const data = event.data || {};
  const replyPort = event.ports && event.ports[0];
  function reply(payload) {
    if (replyPort) replyPort.postMessage(payload);
    else if (event.source && event.source.postMessage) event.source.postMessage(payload);
  }
  if (data.type === 'GET_MAP_CACHE_STATS') {
    event.waitUntil(getMapCacheStats().then(function (stats) {
      reply({ type: 'MAP_CACHE_STATS', ok: true, stats: stats });
    }).catch(function () {
      reply({ type: 'MAP_CACHE_STATS', ok: false, stats: { count: 0, bytes: 0, mb: 0, max: MAP_MAX_ITEMS } });
    }));
  } else if (data.type === 'CLEAR_MAP_CACHE') {
    event.waitUntil(caches.delete(MAP_CACHE).then(function () {
      reply({ type: 'MAP_CACHE_CLEARED', ok: true });
    }).catch(function () {
      reply({ type: 'MAP_CACHE_CLEARED', ok: false });
    }));
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
