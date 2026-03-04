const CACHE_NAME = "road-assist-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./services.html",
  "./prices.html",
  "./contact.html",
  "./assets/css/styles.css",
  "./assets/js/main.js",
  "./manifest.webmanifest",
  "./assets/img/icon-192.svg",
  "./assets/img/icon-512.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const requestUrl = new URL(event.request.url);
          if (requestUrl.origin !== self.location.origin) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone));

          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    }),
  );
});
