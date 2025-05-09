const CACHE_NAME = "bad-tripp-cache-v1";
const urlsToCache = [
  "/resource-production-calculator-mobile.html",
  "/manifest.json",
  "/bad_tripp_logo.png",
  "/service-worker.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
