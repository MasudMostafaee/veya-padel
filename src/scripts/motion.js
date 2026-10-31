import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createHeat } from './heat.js';

const AT_TOP = 40;

function initCourt(section, { reduced, active }) {
  const canvas = section.querySelector('[data-heat]');
  const ball = section.querySelector('[data-ball]');
  const heat = createHeat(canvas);

  if (reduced) {
    [[0.2, 0.3], [0.3, 0.7], [0.42, 0.5], [0.6, 0.25], [0.72, 0.72], [0.85, 0.45]].forEach(([u, v]) => {
      for (let i = 0; i < 9; i++) heat.add(u, v);
    });
    heat.render();
    return;
  }

  const setX = gsap.quickSetter(ball, 'x', 'px');
  const setY = gsap.quickSetter(ball, 'y', 'px');
  const show = (autoAlpha) => gsap.to(ball, { autoAlpha, duration: 0.2, overwrite: 'auto' });

  function paint(point) {
    if (!active()) return;
    const r = section.getBoundingClientRect();
    const x = point.clientX - r.left, y = point.clientY - r.top;
    setX(x); setY(y);
    heat.add(x / r.width, y / r.height);
    show(1);
  }
  function leave() { heat.lift(); show(0); }

  section.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') paint(e); }, { passive: true });
  section.addEventListener('pointerleave', leave);
  section.addEventListener('touchmove', (e) => paint(e.touches[0]), { passive: true });
  section.addEventListener('touchend', leave);
  addEventListener('scroll', () => { if (!active()) leave(); }, { passive: true });
}

function initSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.addEventListener('veya:overlay', (e) => (e.detail.open ? lenis.stop() : lenis.start()));

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.start();
    lenis.scrollTo(link.getAttribute('href') === '#top' ? 0 : target, { duration: 1.2, offset: target.matches('section') ? 0 : -96 });
    target.focus({ preventScroll: true });
    history.pushState(null, '', link.getAttribute('href'));
  });
}

function initHeroIntro() {
  const lines = document.querySelectorAll('#top .d');
  gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to(lines, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.08 }, 0)
    .from('.player', { opacity: 0, y: 40, duration: 1.4 }, 0.35)
    .from('.hero .l > span', { yPercent: 110, duration: 1.1, stagger: 0.09 }, 0.45)
    .from('.eyebrow, .lead, .actions, .facts, [data-header] > *', { opacity: 0, y: 14, duration: 0.8, stagger: 0.05 }, 0.85);
}

// The intro owns the image and the text children; the scrub owns the wrappers,
// so the two never fight over the same property on the same element.
function initHeroScroll() {
  const hero = document.querySelector('.hero');
  const fade = (targets, duration, at, tl) =>
    tl.fromTo(targets, { opacity: 1 }, { opacity: 0, ease: 'none', duration, immediateRender: false }, at);

  gsap.matchMedia().add('(min-width: 761px)', () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } });
    tl.to('.hero .court', { rotateX: 60, scale: 1.3, yPercent: 8, ease: 'none' }, 0)
      .to('.hero .l:nth-child(1) > span', { xPercent: -30, ease: 'none' }, 0)
      .to('.hero .l:nth-child(2) > span', { xPercent: 14, ease: 'none' }, 0)
      .to('.player', { scale: 1.14, yPercent: -7, ease: 'none' }, 0);
    fade('.eyebrow, .lead, .actions, .facts, .hero .tag', 0.35, 0, tl);
    tl.to('.copy, .player-wrap', { opacity: 0, ease: 'none', duration: 0.3 }, 0.7);
  });
}

function initReveals() {
  const reveal = { y: 40, opacity: 0, duration: 1, ease: 'expo.out' };
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, { ...reveal, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    gsap.from(group.children, { ...reveal, y: 56, stagger: 0.08, scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
  });
}

function initServices() {
  if (!matchMedia('(hover: hover) and (min-width: 761px)').matches) return;
  document.querySelectorAll('[data-service-row]').forEach((row) => {
    const img = row.querySelector('[data-service-img]');
    gsap.set(img, { translate: 'none' });
    const x = gsap.quickTo(img, 'x', { duration: 0.5, ease: 'expo.out' });
    const y = gsap.quickTo(img, 'y', { duration: 0.5, ease: 'expo.out' });
    gsap.set(img, { x: row.clientWidth * 0.62, y: row.clientHeight / 2 });
    row.addEventListener('pointermove', (e) => {
      const r = row.getBoundingClientRect();
      x(e.clientX - r.left + 40); y(e.clientY - r.top);
    }, { passive: true });
  });
}

function initZoom() {
  gsap.utils.toArray('[data-zoom]').forEach((frame) => {
    gsap.fromTo(frame.querySelector('img'), { scale: 1.14 }, {
      scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'center center', scrub: 0.6 },
    });
  });
}

function initParallax() {
  gsap.utils.toArray('[data-parallax]').forEach((frame) => {
    gsap.fromTo(frame.querySelector('img'), { yPercent: -6 }, {
      yPercent: 6, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  });
}

export function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  initCourt(document.querySelector('[data-paint-top]'), { reduced, active: () => scrollY <= AT_TOP });
  initCourt(document.querySelector('[data-paint]'), { reduced, active: () => true });
  if (reduced) return;

  initSmoothScroll();
  initHeroIntro();
  initHeroScroll();
  initReveals();
  initServices();
  initZoom();
  initParallax();

  let timer;
  document.addEventListener('toggle', () => {
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 400);
  }, true);
}
