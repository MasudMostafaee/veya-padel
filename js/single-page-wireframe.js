/**
 * Single-Page Padel Wireframe Interactive Controller (v2.2)
 * Handles:
 * 1. UX Annotation visibility toggle (Client Review Mode)
 * 2. Section Jump navigation
 * 3. Dynamic Pricing Calculator (Stacked segmented pills)
 * 4. Section 02 Interactive Tabs (Gear, Rules, Intro)
 * 5. Coaching Assessment Request Modal
 * 6. Playtomic Deep Link Explainer Modal
 * 7. Interactive FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. UX NOTES TOGGLE
  // --------------------------------------------------------------------------
  const toggleNotesBtn = document.getElementById('toggle-notes-btn');
  let notesVisible = true;

  if (toggleNotesBtn) {
    toggleNotesBtn.addEventListener('click', () => {
      notesVisible = !notesVisible;
      document.body.classList.toggle('hide-ux-notes', !notesVisible);
      toggleNotesBtn.classList.toggle('active', notesVisible);
      toggleNotesBtn.innerHTML = notesVisible 
        ? '<span>📝</span> UX Notes: ON' 
        : '<span>📝</span> UX Notes: OFF';
    });
  }

  // --------------------------------------------------------------------------
  // 2. QUICK JUMP TO SECTION
  // --------------------------------------------------------------------------
  const jumpSelect = document.getElementById('section-jump-select');
  if (jumpSelect) {
    jumpSelect.addEventListener('change', (e) => {
      const targetId = e.target.value;
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. SECTION 02 INTERACTIVE TABS
  // --------------------------------------------------------------------------
  const tabBtns = document.querySelectorAll('.wf-tab-btn');
  const tabPanes = document.querySelectorAll('.wf-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. PRICING CALCULATOR (Stacked Segmented Pills)
  // --------------------------------------------------------------------------
  const durationBtns = document.querySelectorAll('[data-duration]');
  const priceModeBtns = document.querySelectorAll('[data-price-mode]');
  
  const offPeakBigPrice = document.getElementById('offpeak-big-price');
  const offPeakUnit = document.getElementById('offpeak-unit');
  const offPeakSub = document.getElementById('offpeak-sub');

  const peakBigPrice = document.getElementById('peak-big-price');
  const peakUnit = document.getElementById('peak-unit');
  const peakSub = document.getElementById('peak-sub');

  // Pricing matrix [duration][mode]
  const pricingData = {
    90: {
      offpeak: { court: 64, perPlayer: 16 },
      peak: { court: 96, perPlayer: 24 }
    },
    60: {
      offpeak: { court: 44, perPlayer: 11 },
      peak: { court: 68, perPlayer: 17 }
    }
  };

  let currentDuration = 90;
  let currentMode = 'player'; // 'player' or 'court'

  function updatePricingDisplay() {
    const data = pricingData[currentDuration];
    
    if (currentMode === 'player') {
      if (offPeakBigPrice) offPeakBigPrice.textContent = `$${data.offpeak.perPlayer}`;
      if (offPeakUnit) offPeakUnit.textContent = `/ player (4 players)`;
      if (offPeakSub) offPeakSub.textContent = `Total Court: $${data.offpeak.court} for ${currentDuration} min`;

      if (peakBigPrice) peakBigPrice.textContent = `$${data.peak.perPlayer}`;
      if (peakUnit) peakUnit.textContent = `/ player (4 players)`;
      if (peakSub) peakSub.textContent = `Total Court: $${data.peak.court} for ${currentDuration} min`;
    } else {
      if (offPeakBigPrice) offPeakBigPrice.textContent = `$${data.offpeak.court}`;
      if (offPeakUnit) offPeakUnit.textContent = `/ total court`;
      if (offPeakSub) offPeakSub.textContent = `Equal to $${data.offpeak.perPlayer} per player for ${currentDuration} min`;

      if (peakBigPrice) peakBigPrice.textContent = `$${data.peak.court}`;
      if (peakUnit) peakUnit.textContent = `/ total court`;
      if (peakSub) peakSub.textContent = `Equal to $${data.peak.perPlayer} per player for ${currentDuration} min`;
    }
  }

  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDuration = parseInt(btn.getAttribute('data-duration'), 10);
      updatePricingDisplay();
    });
  });

  priceModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      priceModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.getAttribute('data-price-mode');
      updatePricingDisplay();
    });
  });

  // --------------------------------------------------------------------------
  // 5. MODALS (Coaching Assessment Form & Playtomic Explainer)
  // --------------------------------------------------------------------------
  const coachingModal = document.getElementById('coaching-modal');
  const playtomicModal = document.getElementById('playtomic-modal');
  const targetProgramInput = document.getElementById('target-program-input');
  
  function openModal(modal) {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Open Coaching Assessment Modal
  document.querySelectorAll('[data-trigger="coaching-modal"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const programName = el.getAttribute('data-program');
      if (programName && targetProgramInput) {
        targetProgramInput.value = programName;
      }
      openModal(coachingModal);
    });
  });

  // Open Playtomic Modal Triggers
  document.querySelectorAll('[data-trigger="playtomic-modal"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(playtomicModal);
    });
  });

  // Close triggers
  document.querySelectorAll('.wf-modal-close, [data-dismiss="modal"]').forEach(el => {
    el.addEventListener('click', () => {
      closeModal(coachingModal);
      closeModal(playtomicModal);
    });
  });

  // Backdrop click close
  [coachingModal, playtomicModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // ESC key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(coachingModal);
      closeModal(playtomicModal);
    }
  });

  // --------------------------------------------------------------------------
  // 6. FAQ ACCORDION
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.wf-faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.wf-faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
});
