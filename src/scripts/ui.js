// Mobile menu and concept dialog both use native <dialog>, which gives us
// focus containment, Esc and focus return without extra code.
function emitOverlay(open) {
  document.dispatchEvent(new CustomEvent('veya:overlay', { detail: { open } }));
}

function wire(dialog) {
  dialog.addEventListener('close', () => emitOverlay(false));
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog && dialog.matches('[data-concept-dialog]')) dialog.close();
  });
}

function open(dialog) {
  dialog.showModal();
  emitOverlay(true);
}

function initCoachingRequest() {
  const dialog = document.querySelector('[data-request-dialog]');
  const form = dialog.querySelector('[data-request-form]');
  const done = dialog.querySelector('[data-request-done]');
  wire(dialog);

  function setError(field, invalid) {
    field.setAttribute('aria-invalid', String(invalid));
    field.parentElement.querySelector('small').hidden = !invalid;
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-request]');
    if (trigger) {
      form.reset();
      form.hidden = false;
      done.hidden = true;
      form.querySelectorAll('[required]').forEach((f) => setError(f, false));
      form.elements.program.value = trigger.dataset.request;
      open(dialog);
      form.elements.name.focus();
    }
    if (e.target.closest('[data-request-cancel]')) dialog.close();
  });

  form.addEventListener('input', (e) => {
    if (e.target.required && e.target.value.trim()) setError(e.target, false);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('[required]')];
    const invalid = fields.filter((f) => !f.value.trim());
    fields.forEach((f) => setError(f, invalid.includes(f)));
    if (invalid.length) { invalid[0].focus(); return; }
    done.querySelector('[data-request-name]').textContent = form.elements.name.value.trim();
    form.reset();
    form.hidden = true;
    done.hidden = false;
    done.querySelector('button').focus();
  });
}

function initTabs() {
  const root = document.querySelector('[data-tabs]');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = [...root.querySelectorAll('[role="tabpanel"]')];

  function select(index) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].classList.toggle('active', i === index);
    });
    tabs[index].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      select((i + step + tabs.length) % tabs.length);
    });
  });
}

function initGallery() {
  const track = document.querySelector('[data-slider]');
  const prev = document.querySelector('[data-slider-prev]');
  const next = document.querySelector('[data-slider-next]');
  const items = [...track.children];

  const step = () => items[0].offsetWidth + 16;
  function sync() {
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  }
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync);
  sync();

  // drag with a mouse; touch and trackpads already scroll natively
  let start = null;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    start = { x: e.clientX, left: track.scrollLeft };
  });
  addEventListener('pointermove', (e) => {
    if (!start) return;
    if (Math.abs(e.clientX - start.x) > 4) track.classList.add('is-dragging');
    track.scrollLeft = start.left - (e.clientX - start.x);
  });
  addEventListener('pointerup', () => { start = null; track.classList.remove('is-dragging'); });

  // no hover on touch screens, so the photo most in view takes the colour
  if (matchMedia('(hover: none)').matches) {
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-active', entry.isIntersecting));
    }, { root: track, threshold: 0.7 });
    items.forEach((item) => seen.observe(item));
  }
}

function initPricing() {
  const root = document.querySelector('[data-pricing]');
  const prices = JSON.parse(root.dataset.prices);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render() {
    const minutes = root.querySelector('[name="duration"]:checked').value;
    const mode = root.querySelector('[name="price-mode"]:checked').value;
    root.querySelectorAll('[data-plan]').forEach((plan) => {
      const { court, player } = prices[minutes][plan.dataset.plan];
      const amount = plan.querySelector('[data-amount]');
      amount.textContent = `$${mode === 'player' ? player : court}`;
      plan.querySelector('[data-unit]').textContent = mode === 'player' ? '/ player (4 players)' : '/ court';
      plan.querySelector('[data-total]').textContent = mode === 'player'
        ? `Total Court: $${court} for ${minutes} min`
        : `Equal to $${player} per player for ${minutes} min`;
      if (!reduced) amount.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 250, easing: 'cubic-bezier(.16,1,.3,1)' });
    });
  }

  root.querySelectorAll('input[type="radio"]').forEach((input) => input.addEventListener('change', render));
}

export function initUi() {
  const menu = document.querySelector('[data-menu]');
  const concept = document.querySelector('[data-concept-dialog]');
  const conceptText = document.querySelector('[data-concept-text]');
  [menu, concept].forEach(wire);

  document.querySelector('[data-menu-open]').addEventListener('click', () => open(menu));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) menu.close();
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-concept]');
    if (!trigger) return;
    if (menu.open) menu.close();
    conceptText.textContent = trigger.dataset.concept;
    open(concept);
  });

  initCoachingRequest();
  initTabs();
  initPricing();
  initGallery();

  // a phone rotated to landscape has the menu's trigger hidden, so close it
  matchMedia('(min-width: 761px)').addEventListener('change', (e) => {
    if (e.matches && menu.open) menu.close();
  });
}
