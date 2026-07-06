self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("story-shortcut-v1").then((cache) => {
      return cache.addAll(["./index.html", "./manifest.webmanifest", "./icon.svg"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
