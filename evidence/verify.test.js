// Reproducible checks for claims in Report.md that do not depend on the
// chat-session code. Run: node --test evidence/verify.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

class ValidationError extends Error {}

const MAX_TITLE_LENGTH = 100;

// Report §2.3, Mã 2 as first published (commit eec2a5a).
function validateTitleOld(title) {
  const clean = (title ?? '').trim();
  if (!clean) throw new ValidationError('Title is required');
  if (clean.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(`Title must be at most ${MAX_TITLE_LENGTH} characters`);
  }
  return clean;
}

// Report §2.3, Mã 2 after the fix.
function validateTitle(title) {
  if (typeof title !== 'string') {
    throw new ValidationError('Title must be a string');
  }
  const clean = title.trim();
  if (!clean) throw new ValidationError('Title is required');
  if (clean.length > MAX_TITLE_LENGTH) {
    throw new ValidationError(`Title must be at most ${MAX_TITLE_LENGTH} characters`);
  }
  return clean;
}

const NON_STRINGS = [undefined, null, 42, {}, ['x']];

test('§2.3 old version: a numeric title leaks a raw TypeError', () => {
  assert.throws(() => validateTitleOld(42), TypeError);
});

test('§2.3 Mã 2b: non-string titles are rejected with ValidationError', () => {
  for (const bad of NON_STRINGS) {
    assert.throws(() => validateTitle(bad), ValidationError);
  }
});

test('§2.3 test list: trim, empty, boundary 100/101', () => {
  assert.equal(validateTitle('   Fix login   '), 'Fix login');
  assert.throws(() => validateTitle('   '), ValidationError);
  assert.equal(validateTitle('a'.repeat(100)).length, 100);
  assert.throws(() => validateTitle('a'.repeat(101)), ValidationError);
});

test('§2.3 Ghi chú 2: length counts UTF-16 code units', () => {
  assert.equal('😀'.length, 2);
  assert.equal('ế'.normalize('NFC').length, 1);
  assert.equal('ế'.normalize('NFD').length, 3); // Bảng 7: AI claimed 2
  assert.doesNotThrow(() => validateTitle('😀'.repeat(50)));
  assert.throws(() => validateTitle('a' + '😀'.repeat(50)), ValidationError);
});

test('§6.3 / Bảng 7: mock.method is bypassed by a destructured import', (t) => {
  const { readFileSync } = fs; // captured before the mock is installed
  t.mock.method(fs, 'readFileSync', () => 'mocked');
  assert.equal(fs.readFileSync(__filename, 'utf8'), 'mocked');
  assert.notEqual(readFileSync(__filename, 'utf8'), 'mocked');
});
