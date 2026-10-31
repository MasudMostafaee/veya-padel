import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createHeat } from './heat.js';

function initCourt(section, { reduced }) {
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
}

// Foreground and background drift apart a little with the pointer, for a sense of depth.
function initDepth(section) {
  if (!matchMedia('(hover: hover)').matches) return;
  const near = gsap.quickTo('.hero-player', 'x', { duration: 0.9, ease: 'expo.out' });
  const far = gsap.quickTo('.hero-bg', 'x', { duration: 0.9, ease: 'expo.out' });
  section.addEventListener('pointermove', (e) => {
    const offset = e.clientX / innerWidth - 0.5;
    near(offset * -18); far(offset * 8);
  }, { passive: true });
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
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.columns span', { scaleY: 0, transformOrigin: '50% 0', duration: 1.4, ease: 'power2.inOut', stagger: 0.08 }, 0)
    .from('.hero-bg', { scale: 1.14, duration: 2 }, 0)
    .from('.hero-player', { opacity: 0, y: 40, duration: 1.4 }, 0.35)
    .from('.hero .l > span', { yPercent: 110, duration: 1.1, stagger: 0.09 }, 0.45)
    .from('.eyebrow, .hero .stats > div, .hero .actions > *, [data-header] > *', { opacity: 0, y: 14, duration: 0.8, stagger: 0.05 }, 0.85);
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

function initSlider() {
  const ghost = document.querySelector('[data-ghost]');
  const track = document.querySelector('[data-slider]');
  if (!ghost || !track) return;
  const shift = gsap.quickTo(ghost, 'x', { duration: 0.6, ease: 'expo.out' });
  track.addEventListener('scroll', () => shift(track.scrollLeft * -0.08), { passive: true });
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

  initCourt(document.querySelector('[data-paint-top]'), { reduced });
  initCourt(document.querySelector('[data-paint]'), { reduced });
  if (reduced) return;

  initSmoothScroll();
  initHeroIntro();
  initReveals();
  initDepth(document.querySelector('[data-paint-top]'));
  initSlider();
  initZoom();
  initParallax();

  let timer;
  document.addEventListener('toggle', () => {
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 400);
  }, true);
}
