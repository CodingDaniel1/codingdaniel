const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const site = path.join(__dirname, '..', 'public');

function page(queries) {
  const pending = [];
  const results = {innerHTML: '', scrollIntoView() {}};
  const wrapper = {classList: {add() {}, remove() {}}};
  const browser = {
    console,
    prompt: () => queries.shift(),
    localStorage: {getItem: () => null},
    matchMedia: () => ({matches: false, addEventListener() {}}),
    document: {
      documentElement: {classList: {remove() {}}, getAttribute: () => 'en'},
      head: {
        querySelector: () => null,
        appendChild: script => pending.push(script),
      },
      querySelector: selector => selector.includes('wrapper') ? wrapper : results,
      createElement: () => ({}),
    },
  };
  browser.window = browser;
  vm.createContext(browser);
  vm.runInContext(fs.readFileSync(path.join(site, 'js/zola-theme.min.js'), 'utf8'), browser);
  const patch = path.join(site, 'js/search-fix.js');
  if (fs.existsSync(patch)) vm.runInContext(fs.readFileSync(patch, 'utf8'), browser);
  browser.zolaTheme.search.init({
    scripts: [
      'https://codingdaniel.pages.dev/search_index.en.js',
      'https://codingdaniel.pages.dev/elasticlunr.min.js',
    ],
    arg: {w: '#linkita-search-wrapper', r: '#linkita-search-results'},
  });
  const complete = script => {
    const asset = new URL(script.src).pathname;
    vm.runInContext(fs.readFileSync(path.join(site, asset), 'utf8'), browser);
    script.onload();
  };
  return {browser, pending, results, complete};
}

const flush = async () => {
  for (let i = 0; i < 4; i++) await new Promise(setImmediate);
};

test('search waits for the full index when queried twice', async () => {
  const p = page(['programming', 'zzzz-no-results']);
  p.browser.zolaTheme.search.toggle();
  await flush();
  p.complete(p.pending[0]);
  await flush();
  assert.doesNotThrow(() => p.browser.zolaTheme.search.toggle());
  assert.equal(p.pending.length, 2);
  p.complete(p.pending[1]);
  await flush();
  assert.match(p.results.innerHTML, /for <code>zzzz-no-results<\/code>/);
});

test('a failed index download shows an error without continuing', async () => {
  const p = page(['programming']);
  p.browser.zolaTheme.search.toggle();
  await flush();
  p.pending[0].onerror();
  await flush();
  assert.match(p.results.innerHTML, /Search file not found/);
  assert.equal(p.browser.zolaTheme.search.index, undefined);
});

test('search retries after a failed download', async () => {
  const p = page(['retry', 'retry']);
  const search = p.browser.zolaTheme.search;
  search.toggle();
  await flush();
  p.pending[0].onerror();
  await flush();
  assert.match(p.results.innerHTML, /Search file not found/);
  assert.equal(search.index, undefined);
  search.toggle();
  await flush();
  assert.equal(p.pending.length, 2);
  assert.equal(p.pending[1].src, p.pending[0].src);
  p.complete(p.pending[1]);
  await flush();
  p.complete(p.pending[2]);
  await flush();
  assert.notEqual(search.index, undefined);
  assert.doesNotMatch(p.results.innerHTML, /Search file not found/);
  assert.match(p.results.innerHTML, /for <code>retry<\/code>/);
});

test('results scroll with the standard DOM method', () => {
  const p = page([]);
  p.browser.zolaTheme.search.index = {search: () => []};
  assert.doesNotThrow(() => p.browser.zolaTheme.search.act('missing'));
  assert.match(p.results.innerHTML, /No search results/);
});
