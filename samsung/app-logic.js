(function (root) {
  function nextIndex(i, n) {
    if (n <= 0) return 0;
    return (i + 1) % n;
  }

  function prevIndex(i, n) {
    if (n <= 0) return 0;
    return (i - 1 + n) % n;
  }

  function clampIndex(i, n) {
    if (n <= 0) return 0;
    if (i < 0) return 0;
    if (i >= n) return n - 1;
    return i;
  }

  function imageUrl(filename) {
    return 'images/' + filename;
  }

  function formatCounter(i, n) {
    if (n <= 0) return '0 / 0';
    return i + 1 + ' / ' + n;
  }

  var api = {
    nextIndex: nextIndex,
    prevIndex: prevIndex,
    clampIndex: clampIndex,
    imageUrl: imageUrl,
    formatCounter: formatCounter,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.GalleryLogic = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
