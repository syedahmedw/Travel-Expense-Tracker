self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open("expense-cache-v2")
      .then((cache) =>
        cache.addAll([
          "index.html",
          "summary.html",
          "style.css",
          "script.js",
          "utils.js",
          "manifest.json",
        ])
      )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
