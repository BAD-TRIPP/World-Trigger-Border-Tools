const CACHE_NAME = "badtripp-hq-v1";
const ASSETS_TO_CACHE = [
  "/hq-upgrade-tracker-mobile.html",
  "/bad_tripp_logo.png",
  "/manifest.json",
  "/scripts/hq-upgrade-tracker.js",
  "/scripts/license-check.js",
  "/data/hq_levels.json",
  "/data/hq_levels_chart.json",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
];

// Install: cache core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Fetch: serve from cache first
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

// Activate: cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});
