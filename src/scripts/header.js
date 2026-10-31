// Transparent over the hero. Past it, hides on scroll down and returns solid on scroll up.
export function initHeader() {
  const header = document.querySelector('[data-header]');
  const firstSection = document.querySelector('#ways');
  if (!header || !firstSection) return;

  const STEP = 6;
  let last = scrollY;

  function update() {
    const y = scrollY;
    const pastHero = firstSection.getBoundingClientRect().top <= header.offsetHeight;
    header.classList.toggle('is-solid', pastHero);
    if (!pastHero) header.classList.remove('is-hidden');
    else if (y > last + STEP) header.classList.add('is-hidden');
    else if (y < last - STEP) header.classList.remove('is-hidden');
    if (Math.abs(y - last) > STEP) last = y;
  }

  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}
