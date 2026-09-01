(function () {
  var logic = window.GalleryLogic;
  var photo = document.getElementById('photo');
  var statusEl = document.getElementById('status');

  var images = [];
  var index = 0;
  var loadToken = 0;
  var preloadCache = {};

  function setStatus(text) {
    if (text) {
      statusEl.textContent = text;
      statusEl.hidden = false;
    } else {
      statusEl.textContent = '';
      statusEl.hidden = true;
    }
  }

  function preload(url) {
    if (!url || preloadCache[url]) return;
    var img = new Image();
    preloadCache[url] = img;
    img.src = url;
  }

  function preloadNeighbors() {
    if (!images.length) return;
    var prev = logic.prevIndex(index, images.length);
    var next = logic.nextIndex(index, images.length);
    preload(logic.imageUrl(images[prev]));
    preload(logic.imageUrl(images[next]));
    // Warm a couple further ahead for smoother demos
    var next2 = logic.nextIndex(next, images.length);
    preload(logic.imageUrl(images[next2]));
  }

  function warmAllInBackground() {
    if (!images.length) return;
    var i = 0;
    function step() {
      if (i >= images.length) return;
      preload(logic.imageUrl(images[i]));
      i += 1;
      setTimeout(step, 80);
    }
    setTimeout(step, 300);
  }

  function showImage() {
    if (!images.length) {
      photo.hidden = true;
      photo.removeAttribute('src');
      setStatus('还没有图片');
      return;
    }

    var token = ++loadToken;
    var url = logic.imageUrl(images[index]);
    setStatus('加载中…');
    photo.hidden = true;

    var img = new Image();
    img.onload = function () {
      if (token !== loadToken) return;
      photo.src = url;
      photo.alt = images[index];
      photo.hidden = false;
      setStatus('');
      preloadNeighbors();
    };
    img.onerror = function () {
      if (token !== loadToken) return;
      photo.hidden = true;
      photo.removeAttribute('src');
      setStatus('加载失败');
    };
    img.src = url;
  }

  function loadManifest() {
    setStatus('加载中…');
    return fetch('manifest.json')
      .then(function (res) {
        if (!res.ok) throw new Error('manifest http ' + res.status);
        return res.json();
      })
      .then(function (data) {
        images = Array.isArray(data.images) ? data.images.slice() : [];
        if (data.title) document.title = data.title;
        index = logic.clampIndex(index, images.length);
        showImage();
        warmAllInBackground();
      })
      .catch(function () {
        images = [];
        photo.hidden = true;
        photo.removeAttribute('src');
        setStatus('无法加载相册');
      });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (!images.length) return;
      index = logic.prevIndex(index, images.length);
      showImage();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (!images.length) return;
      index = logic.nextIndex(index, images.length);
      showImage();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      loadManifest();
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }

  loadManifest();
})();
