(function () {
  var logic = window.GalleryLogic;
  var photo = document.getElementById('photo');
  var statusEl = document.getElementById('status');

  var images = [];
  var index = 0;
  var loadToken = 0;
  var preloadCache = Object.create(null);

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

  function preloadAround(i) {
    if (!images.length) return;
    preload(logic.imageUrl(images[logic.prevIndex(i, images.length)]));
    preload(logic.imageUrl(images[logic.nextIndex(i, images.length)]));
  }

  /** After first image is up, warm the rest so client demos flip instantly. */
  function warmAll() {
    for (var i = 0; i < images.length; i++) {
      preload(logic.imageUrl(images[i]));
    }
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
    preloadAround(index);

    var img = new Image();
    img.onload = function () {
      if (token !== loadToken) return;
      photo.src = url;
      photo.alt = images[index];
      photo.hidden = false;
      setStatus('');
      preloadAround(index);
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
        // Defer full warm so first paint wins.
        setTimeout(warmAll, 300);
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
