import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const css = readdirSync(new URL('../dist/_astro/', import.meta.url))
  .filter((f) => f.endsWith('.css'))
  .map((f) => readFileSync(new URL(`../dist/_astro/${f}`, import.meta.url), 'utf8'))
  .join('');
const count = (re) => (html.match(re) || []).length;

test('has the GitHub wireframe sections in order', () => {
  const order = ['<header', 'id="top"', 'id="ways"', 'id="first-time"', 'id="coaching"', 'id="pricing"', 'id="club"', 'id="faq"', 'id="contact"', 'id="final"', '<footer'];
  const positions = order.map((s) => html.indexOf(s));
  positions.forEach((p, i) => assert.ok(p >= 0, `missing ${order[i]}`));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test('uses the GitHub wireframe copy', () => {
  for (const line of ['Good games.', 'Great people.', 'Find a Match', 'Your game. Your way.', 'Bring your crew', 'No partner? No problem.', 'Everybody starts somewhere.', 'Find your next level.', 'Group Coaching by Level', 'Meet Our Certified Coaches', 'Simple to plan. Easy to play.', 'A place to play and connect.', 'Questions? We got you.', 'See you on court.', 'One more game?']) {
    assert.ok(html.includes(line), `missing ${line}`);
  }
});

test('nothing from the old wireframe remains', () => {
  for (const line of ['Why players choose us', 'What members say', 'Bring a friend', 'Learn as you play']) {
    assert.ok(!html.includes(line), `still has ${line}`);
  }
});

test('no placeholder tokens remain', () => {
  assert.ok(!html.includes('[['));
});

test('external actions open the concept dialog', () => {
  for (const label of ['Open in Google Maps', 'WhatsApp Concierge', 'Chat on WhatsApp', 'Book Court on Playtomic', 'Playtomic Club ID #8492']) {
    const at = html.indexOf(label);
    assert.ok(at > 0, `missing ${label}`);
    const tag = html.slice(html.lastIndexOf('<', at), at);
    assert.ok(tag.includes('data-concept'), `${label} has no data-concept`);
  }
  assert.ok(!/href="https?:/.test(html), 'no link leaves the site');
});

test('interactive parts exist', () => {
  assert.equal(count(/<details/g), 5);
  assert.equal(count(/role="tab"/g), 3);
  assert.equal(count(/role="tabpanel"/g), 3);
  assert.equal(count(/data-request=/g), 6);
  assert.equal(count(/name="duration"/g), 2);
  assert.equal(count(/name="price-mode"/g), 2);
});

test('prices match the wireframe matrix', () => {
  const raw = html.match(/data-prices="([^"]+)"/)[1].replaceAll('&quot;', '"');
  assert.deepEqual(JSON.parse(raw), { 90: { offpeak: { court: 64, player: 16 }, peak: { court: 96, player: 24 } }, 60: { offpeak: { court: 44, player: 11 }, peak: { court: 68, player: 17 } } });
});

test('content is not hidden by static CSS', () => {
  for (const sel of ['.copy', '.play', '.levels', '.coaches', '.plans', '.places']) {
    const rule = new RegExp(`${sel.replace('.', '\\.')}[^{]*\\{[^}]*(opacity:0|visibility:hidden)`);
    assert.ok(!rule.test(css), `${sel} hidden in CSS`);
  }
});

test('page states it is a concept project', () => {
  assert.ok(html.includes('Concept project'));
});
