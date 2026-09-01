/* Cache-first for Samsung Demo gallery — speeds up repeat opens / flip during demos. */
var CACHE = 'samsung-demo-v4';

self.addEventListener('install', function (event) {
  event.waitUntil(
    fetch('manifest.json')
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        var images = Array.isArray(data.images) ? data.images : [];
        var urls = [
          './',
          'index.html',
          'styles.css',
          'app-logic.js',
          'app.js',
          'manifest.json',
          'sw.js',
        ].concat(
          images.map(function (name) {
            return 'images/' + name;
          })
        );
        return caches.open(CACHE).then(function (cache) {
          return cache.addAll(urls);
        });
      })
      .then(function () {
        return self.skipWaiting();
      })
      .catch(function () {
        // First install may race; fetch handler still fills cache.
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE) return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        var copy = res.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(req, copy);
        });
        return res;
      });
    })
  );
});
