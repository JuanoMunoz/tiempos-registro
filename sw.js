const CACHE_NAME = "static-v12";
const urlsToCache = [
  "/tiempos-registro/manifest.json",
  "/tiempos-registro/index.html",
  "/tiempos-registro/src/jquery.js",
  "/tiempos-registro/src/index.js",
  "/tiempos-registro/src/xlsx.js",
  "/tiempos-registro/src/styles.css",
  "/tiempos-registro/images/logo.webp",
  "/tiempos-registro/images/logotiempos3.webp",
  "/tiempos-registro/images/logo-android.png"
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error("Cache failed:", err))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});
