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
    conceptText.textContent = trigger.dataset.concept;
    open(concept);
  });

  // a phone rotated to landscape has the menu's trigger hidden, so close it
  matchMedia('(min-width: 761px)').addEventListener('change', (e) => {
    if (e.matches && menu.open) menu.close();
  });
}
