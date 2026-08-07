const assert = require('assert');
const {
  nextIndex,
  prevIndex,
  clampIndex,
  imageUrl,
  formatCounter,
} = require('../app-logic.js');

assert.strictEqual(nextIndex(0, 3), 1);
assert.strictEqual(nextIndex(2, 3), 0);
assert.strictEqual(prevIndex(0, 3), 2);
assert.strictEqual(prevIndex(1, 3), 0);
assert.strictEqual(clampIndex(5, 3), 2);
assert.strictEqual(clampIndex(-1, 3), 0);
assert.strictEqual(clampIndex(1, 0), 0);
assert.strictEqual(imageUrl('a.jpg'), 'images/a.jpg');
assert.strictEqual(formatCounter(0, 3), '1 / 3');
assert.strictEqual(formatCounter(0, 0), '0 / 0');
console.log('gallery-logic tests passed');
