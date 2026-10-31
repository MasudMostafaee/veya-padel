import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const css = readdirSync(new URL('../dist/_astro/', import.meta.url))
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(new URL(`../dist/_astro/${f}`, import.meta.url), 'utf8'))
  .join('');

test('has the sections in wireframe order', () => {
  const order = ['<header', 'id="top"', 'id="club"', 'id="play"', 'id="new"', 'id="pricing"', 'id="reviews"', 'id="info"', 'id="final"', '<footer'];
  const positions = order.map((s) => html.indexOf(s));
  positions.forEach((p, i) => assert.ok(p >= 0, `missing ${order[i]}`));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test('no placeholder tokens remain', () => {
  assert.ok(!html.includes('[['));
});

test('links with no real destination open the concept dialog', () => {
  for (const label of ['Get Directions', 'Instagram', 'Facebook', 'Privacy Policy', 'Terms &amp; Conditions']) {
    const at = html.indexOf(label);
    assert.ok(at > 0, `missing ${label}`);
    const tag = html.slice(html.lastIndexOf('<', at), at);
    assert.ok(tag.includes('data-concept'), `${label} has no data-concept`);
  }
});

test('faq works without JavaScript', () => {
  assert.equal((html.match(/<details/g) || []).length, 6);
});

test('content is not hidden by static CSS', () => {
  for (const sel of ['.copy', '.why', '.services', '.faq', '.prices', '.quotes']) {
    const rule = new RegExp(`${sel.replace('.', '\\.')}[^{]*\\{[^}]*(opacity:0|visibility:hidden)`);
    assert.ok(!rule.test(css), `${sel} hidden in CSS`);
  }
});

test('page states it is a concept project', () => {
  assert.ok(html.includes('Concept project'));
});
