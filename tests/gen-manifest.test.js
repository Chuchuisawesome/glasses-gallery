const assert = require('assert');
const {
  buildManifest,
  filterImageNames,
} = require('../scripts/gen-manifest.js');

assert.deepStrictEqual(
  filterImageNames(['a.jpg', 'b.PNG', 'c.txt', '.DS_Store', 'd.webp']),
  ['a.jpg', 'b.PNG', 'd.webp']
);
assert.deepStrictEqual(buildManifest(['02.jpg', '01.jpg']), {
  title: '我的相册',
  images: ['01.jpg', '02.jpg'],
});
console.log('gen-manifest tests passed');
