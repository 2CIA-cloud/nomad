/* AZIMUTE PMMG — Service Worker v4.0
   - APP_CACHE: App Shell (Network-First, atualiza rápido a cada deploy no GitHub)
   - MAP_CACHE: tiles/estilos/sprites/glyphs de mapa (Cache-First, NUNCA apagado em atualização do app)
   - APIs dinâmicas (clima, busca de endereço, rotas, MQTT) passam direto pela rede, sem cache. */
const APP_CACHE = 'azimute-app-shell-v4.2';
const MAP_CACHE = 'azimute-map-tiles-v1';
const SAT_OPAQUE_CACHE = 'azimute-sat-opaque-v1';
const MAP_MAX_ITEMS = 3500;
const SAT_OPAQUE_MAX_ITEMS = 60;
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
  /(^|\.)tile\.opentopomap\.org$/i,
  /^mt[0-3]\.google\.com$/i
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
      if (key === APP_CACHE || key === MAP_CACHE || key === SAT_OPAQUE_CACHE) return Promise.resolve();
      return caches.delete(key); // remove versões antigas; preserva sempre os caches de mapa
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

async function trimCacheTo(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    const excess = keys.length - maxItems;
    if (excess > 0) {
      for (let i = 0; i < excess; i++) {
        await cache.delete(keys[i]);
      }
    }
  } catch (_) {}
}

async function cacheFirstMap(request, event) {
  const mapCache = await caches.open(MAP_CACHE);
  const hit = await mapCache.match(request);
  if (hit) return hit;
  const satCache = await caches.open(SAT_OPAQUE_CACHE);
  const satHit = await satCache.match(request);
  if (satHit) return satHit;
  try {
    const res = await fetch(request);
    if (res && res.type === 'opaque') {
      const satCopy = res.clone();
      event.waitUntil((async function () {
        try {
          await satCache.put(request, satCopy);
          await trimCacheTo(SAT_OPAQUE_CACHE, SAT_OPAQUE_MAX_ITEMS);
        } catch (_) {}
      })());
    } else if (res && res.ok && res.status === 200) {
      const copy = res.clone();
      event.waitUntil((async function () {
        try {
          const len = parseInt(copy.headers.get('content-length') || '0', 10);
          const blob = await copy.blob();
          const headers = new Headers(copy.headers);
          headers.set('x-az-size', String(len || blob.size));
          await mapCache.put(request, new Response(blob, { status: 200, statusText: 'OK', headers: headers }));
          mapPutCounter++;
          if (mapPutCounter % MAP_TRIM_EVERY === 0) await trimCacheTo(MAP_CACHE, MAP_MAX_ITEMS);
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
    event.waitUntil(Promise.all([caches.delete(MAP_CACHE), caches.delete(SAT_OPAQUE_CACHE)]).then(function () {
      reply({ type: 'MAP_CACHE_CLEARED', ok: true });
    }).catch(function () {
      reply({ type: 'MAP_CACHE_CLEARED', ok: false });
    }));
  } else if (data.type === 'PRECACHE_MAP_URLS' && Array.isArray(data.urls)) {
    event.waitUntil((async function () {
      const cache = await caches.open(MAP_CACHE);
      const urls = data.urls.slice(0, 600);
      let done = 0, saved = 0;
      const BATCH = 2;
      for (let i = 0; i < urls.length; i += BATCH) {
        const chunk = urls.slice(i, i + BATCH);
        await Promise.all(chunk.map(async function (u) {
          try {
            const hit = await cache.match(u);
            if (!hit) {
              const res = await fetch(u, { mode: 'cors' });
              if (res && res.ok && res.status === 200 && res.type !== 'opaque') {
                const len = parseInt(res.headers.get('content-length') || '0', 10);
                const blob = await res.blob();
                const headers = new Headers(res.headers);
                headers.set('x-az-size', String(len || blob.size));
                await cache.put(u, new Response(blob, { status: 200, statusText: 'OK', headers: headers }));
                saved++;
              }
            }
          } catch (_) {}
          done++;
        }));
      }
      if (saved > 0) await trimCacheTo(MAP_CACHE, MAP_MAX_ITEMS);
      reply({ type: 'PRECACHE_DONE', ok: true, done: done, saved: saved });
    })());
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
