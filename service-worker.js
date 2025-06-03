const CACHE_NAME = "hq-tracker-v1";
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

// Install event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Fetch event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

// Activate event - optional cleanup
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});
