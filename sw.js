const CACHE_NAME = "static-v1";
const urlsToCache = [
  "manifest.json",
  "index.html",
  "src/jquery.js",
  "src/index.js",
  "src/styles.css",
  "images/logo.webp",
  "images/logotiempos3.webp",
  "images/logo-android.png"
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
