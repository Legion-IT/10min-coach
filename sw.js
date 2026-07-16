/* Service Worker — офлайн-режим для «10-минутный тренер» */
var CACHE = 'coach-v10';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/styles.css?v=10',
  './assets/js/data.js?v=10',
  './assets/js/app.js?v=10',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/audio/music-morning.mp3',
  './assets/audio/music-day.mp3',
  './assets/audio/music-evening.mp3'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // не валим установку, если какой-то файл недоступен
      return Promise.allSettled(ASSETS.map(function (u) { return c.add(u); }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // навигация — network-first, чтобы подхватывать обновления, но работать офлайн
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (r) {
        var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        return r;
      }).catch(function () { return caches.match('./index.html'); })
    );
    return;
  }

  // остальное — cache-first
  e.respondWith(
    caches.match(req).then(function (cached) {
      return cached || fetch(req).then(function (r) {
        if (r && r.status === 200) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return r;
      }).catch(function () { return cached; });
    })
  );
});
