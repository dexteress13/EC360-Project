const test = require('node:test');
const assert = require('node:assert');
const { findBestMatch } = require('../utils/matching');

const reviewers = [
  { name: 'Albert', expertise: ['machine learning', 'signal processing'] },
  { name: 'Sara', expertise: ['databases'] },
  { name: 'Omar', expertise: ['Machine Learning', 'databases', 'networks'] },
];

test('picks the reviewer with the most matching keywords', () => {
  const r = findBestMatch(['machine learning', 'databases', 'networks'], reviewers);
  assert.strictEqual(r.bestMatch.name, 'Omar');
  assert.strictEqual(r.highestScore, 3);
});

test('matching is case-insensitive', () => {
  const r = findBestMatch(['MACHINE LEARNING'], [reviewers[0]]);
  assert.strictEqual(r.bestMatch.name, 'Albert');
  assert.deepStrictEqual(r.bestMatchedKeywords, ['MACHINE LEARNING']);
});

test('returns no match when nothing overlaps', () => {
  const r = findBestMatch(['quantum computing'], reviewers);
  assert.strictEqual(r.bestMatch, null);
  assert.strictEqual(r.highestScore, 0);
});

test('returns no match for an empty reviewer list', () => {
  const r = findBestMatch(['databases'], []);
  assert.strictEqual(r.bestMatch, null);
});

test('first reviewer wins a tie', () => {
  const r = findBestMatch(['databases'], [reviewers[1], reviewers[2]]);
  assert.strictEqual(r.bestMatch.name, 'Sara');
});
