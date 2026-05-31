/* Simple offline cache so the game works without internet. */
const CACHE = "unicorn-match-v7";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/game.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./sounds/dog-bark.wav",
  "./sounds/cat-meow.wav",
  "./sounds/cow-moo.wav",
  "./sounds/birds-chirping.wav",
  "./sounds/water-drop.wav",
  "./sounds/wave-crash.wav",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => cached))
  );
});
