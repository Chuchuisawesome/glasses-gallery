/* Samsung Demo gallery — cache shell + images for faster second open. */
var CACHE = 'samsung-demo-v2';

self.addEventListener('install', function (event) {
  event.waitUntil(
    fetch('manifest.json')
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        var urls = ['./', 'index.html', 'styles.css', 'app.js', 'app-logic.js', 'manifest.json', 'sw.js'];
        var images = Array.isArray(data.images) ? data.images : [];
        for (var i = 0; i < images.length; i++) {
          urls.push('images/' + images[i]);
        }
        return caches.open(CACHE).then(function (cache) {
          return cache.addAll(urls);
        });
      })
      .then(function () {
        return self.skipWaiting();
      })
      .catch(function () {
        // First install may fail offline; ignore.
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
        var copy = res.clone();
        if (res.ok) {
          caches.open(CACHE).then(function (cache) {
            cache.put(req, copy);
          });
        }
        return res;
      });
    })
  );
});
