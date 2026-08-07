const fs = require('fs');
const path = require('path');

const IMAGE_RE = /\.(jpe?g|png|webp)$/i;

function filterImageNames(names) {
  return names.filter(function (name) {
    if (!name || name.startsWith('.')) return false;
    return IMAGE_RE.test(name);
  });
}

function buildManifest(filenames, title) {
  var images = filterImageNames(filenames.slice()).sort(function (a, b) {
    return a.localeCompare(b, 'en');
  });
  return {
    title: title || '我的相册',
    images: images,
  };
}

function writeManifest(projectRoot) {
  var imagesDir = path.join(projectRoot, 'images');
  var names = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];
  var manifest = buildManifest(names);
  var outPath = path.join(projectRoot, 'manifest.json');
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  return { outPath: outPath, manifest: manifest };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    filterImageNames: filterImageNames,
    buildManifest: buildManifest,
    writeManifest: writeManifest,
  };
}

if (require.main === module) {
  var root = path.join(__dirname, '..');
  var result = writeManifest(root);
  console.log(
    'Wrote',
    result.outPath,
    '(' + result.manifest.images.length + ' images)'
  );
}
