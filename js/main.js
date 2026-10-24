/**
 * VEYA PADEL CLUB — Interactive JavaScript
 * Handles micro-interactions, modal, FAQ accordion, carousel & pricing tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Interactive FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current
      item.classList.toggle('active', !isOpen);
    });
  });

  // 3. Pricing Tabs Interaction
  const pricingTabs = document.querySelectorAll('.tab-btn');
  const pricingCards = document.querySelectorAll('.pricing-card');

  // Realistic template data for the toggle
  const pricingData = {
    standard: [
      {
        name: "OFF-PEAK SESSION",
        desc: "Monday to Friday · 07:00 – 16:00",
        price: "40",
        period: "per 90-min court",
        features: ["Full 90 minutes court time", "4 players included (no extra fees)", "High-grade balls included", "Access to locker room & showers"]
      },
      {
        name: "PEAK SESSION",
        desc: "Evenings & Weekends · Prime Lighting",
        price: "60",
        period: "per 90-min court",
        features: ["Full 90 minutes court time", "4 players included", "Tournament quality lighting", "Complimentary bottle of water per player", "Priority re-booking window"]
      },
      {
        name: "OPEN MATCH TICKET",
        desc: "Solo Players · Playtomic Verified",
        price: "15",
        period: "per player / match",
        features: ["Matched by verified skill level", "Balls provided", "Points tracked on global ranking", "Free racket rental for 1st match"]
      }
    ],
    passes: [
      {
        name: "5-SESSION PASS",
        desc: "Flexible timing · Valid 3 months",
        price: "185",
        period: "save €15 total",
        features: ["5 x 90-min court sessions", "Off-peak & Peak eligible", "Shareable with friends", "Complimentary racket rental"]
      },
      {
        name: "10-SESSION PACK",
        desc: "Our most popular regular player pack",
        price: "340",
        period: "save €60 total",
        features: ["10 x 90-min court sessions", "14-day advance booking window", "1 Free 1-on-1 coaching clinic", "15% discount at Pro Shop"]
      },
      {
        name: "MONTHLY CLUB ACCESS",
        desc: "Unlimited daytime courts + perks",
        price: "120",
        period: "per month / member",
        features: ["Unlimited off-peak play", "Free entry to weekend King of Court", "Locker storage included", "Guest passes (2 per month)"]
      }
    ]
  };

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pricingTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const planType = tab.getAttribute('data-tab');
      const data = pricingData[planType] || pricingData.standard;

      pricingCards.forEach((card, idx) => {
        if (data[idx]) {
          const item = data[idx];
          card.querySelector('.pricing-plan-name').textContent = item.name;
          card.querySelector('.pricing-plan-desc').textContent = item.desc;
          card.querySelector('.pricing-amount').textContent = item.price;
          card.querySelector('.pricing-period').textContent = item.period;

          const featuresUl = card.querySelector('.pricing-features-list');
          featuresUl.innerHTML = item.features.map(f => `
            <li class="pricing-feature-item">
              <svg class="pricing-feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${f}</span>
            </li>
          `).join('');
        }
      });
    });
  });

  // 4. Gallery Carousel Next/Prev Controls
  const carousel = document.querySelector('.gallery-carousel');
  const prevBtn = document.querySelector('.carousel-arrow-btn.prev');
  const nextBtn = document.querySelector('.carousel-arrow-btn.next');

  if (carousel && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -320, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  // 5. Interactive Court Booking Modal
  const modalOverlay = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const bookBtns = document.querySelectorAll('[data-trigger="book-modal"]');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  const courtSelect = document.getElementById('courtSelect');
  const racketAddon = document.getElementById('racketAddon');
  const summaryTotal = document.getElementById('summaryTotal');
  const confirmBookingBtn = document.getElementById('confirmBookingBtn');

  function openModal() {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Time slot selection & total computation
  let basePrice = 50; // default standard court
  let racketPrice = 0;

  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const isPeak = btn.getAttribute('data-peak') === 'true';
      basePrice = isPeak ? 60 : 40;
      updateTotal();
    });
  });

  if (racketAddon) {
    racketAddon.addEventListener('change', () => {
      racketPrice = racketAddon.checked ? 10 : 0;
      updateTotal();
    });
  }

  function updateTotal() {
    if (summaryTotal) {
      summaryTotal.textContent = `€${basePrice + racketPrice}`;
    }
  }

  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      const selectedSlot = document.querySelector('.time-slot-btn.selected');
      const timeText = selectedSlot ? selectedSlot.textContent : "18:00";
      
      confirmBookingBtn.innerHTML = `✓ Court Reserved! (${timeText})`;
      confirmBookingBtn.style.backgroundColor = '#ffffff';
      confirmBookingBtn.style.color = '#000000';
      
      setTimeout(() => {
        closeModal();
        confirmBookingBtn.innerHTML = `Confirm & Reserve Court <span class="btn-arrow">→</span>`;
        confirmBookingBtn.style.backgroundColor = '';
        confirmBookingBtn.style.color = '';
      }, 1400);
    });
  }

  // 6. Newsletter Form Submit
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value) {
        const btn = newsletterForm.querySelector('button');
        const originalContent = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:18px;height:18px"><polyline points="20 6 9 17 4 12"/></svg>`;
        input.value = "You're on the priority list!";
        input.disabled = true;
        setTimeout(() => {
          btn.innerHTML = originalContent;
          input.disabled = false;
          input.value = "";
        }, 3000);
      }
    });
  }
});
