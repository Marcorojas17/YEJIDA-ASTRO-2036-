// ============================================
// YEJIDÁ ASTRO 2036 — Service Worker PWA
// ============================================

const CACHE = "yejida-v1.0.0";

const ARCHIVOS_BASE = [
  "./",
  "./index.html",
  "./niveles.html",
  "./gatitos.html",
  "./dashboard.html",
  "./muro-padrinos.html",
  "./404.html",
  "./manifest.json",
  "./style/base.css",
  "./style/fondo-vivo.css",
  "./style/hub.css",
  "./style/niveles.css",
  "./style/dashboard.css",
  "./js/shared.js",
  "./js/visual/fondo-vivo.js",
  "./js/niveles/mercadopago.js",
  "./js/niveles/tracker.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ARCHIVOS_BASE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (!e.request.url.startsWith("http")) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const red = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === "basic") {
          const clon = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clon));
        }
        return res;
      }).catch(() => cached);
      return cached || red;
    })
  );
});
