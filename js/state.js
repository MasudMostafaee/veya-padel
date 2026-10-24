/**
 * Application State Manager for Padel Club Wireframe Prototype
 */

import { getAvailableDates, OPEN_MATCHES } from './mock-data.js';

const initialDates = getAvailableDates();

export const state = {
  // Navigation
  currentPage: 'home', // 'home' | 'play' | 'find-player' | 'new-to-padel' | 'classes' | 'club'
  
  // UX Tools
  showAnnotations: true,
  deviceMode: 'desktop', // 'desktop' | 'mobile-preview'

  // Booking Flow State
  booking: {
    dates: initialDates,
    selectedDateIso: initialDates[0].iso,
    selectedCourtFilter: 'all', // 'all' | 'indoor' | 'canopy'
    selectedDuration: 60,       // 60 | 90
    selectedSlot: null,         // { id, time, price, courtAssigned, isPeak, duration }
    racketsHired: 0,            // 0 - 4 (£4 each)
    ballsTubes: 0,              // 0 - 2 (£3 each)
    guestDetails: {
      name: '',
      phone: '',
      email: '',
      playerCount: 4,
      notes: ''
    },
    confirmedBooking: null
  },

  // Find a Player State
  findPlayer: {
    activeTab: 'browse', // 'browse' | 'create'
    matches: [...OPEN_MATCHES],
    selectedMatchToJoin: null,
    myMatchRequest: null,
    simulatedStatus: 'pending' // 'pending' | 'matched' | 'refunded'
  },

  // Classes State
  classes: {
    selectedClass: null,
    inquirySubmitted: false
  },

  // Active Modal Dialog
  modal: null // null | 'booking-modal' | 'booking-success' | 'join-match-modal' | 'create-match-success' | 'class-inquiry-modal' | 'sitemap-modal'
};

// Simple event subscriber for state changes
const listeners = [];

export function subscribe(callback) {
  listeners.push(callback);
}

export function notify() {
  listeners.forEach(fn => fn(state));
}

export function setPage(pageName) {
  state.currentPage = pageName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  notify();
}

export function toggleAnnotations() {
  state.showAnnotations = !state.showAnnotations;
  document.body.classList.toggle('show-annotations', state.showAnnotations);
  notify();
}

export function openModal(modalId) {
  state.modal = modalId;
  notify();
}

export function closeModal() {
  state.modal = null;
  notify();
}

export function resetPrototype() {
  state.currentPage = 'home';
  state.booking.selectedDateIso = initialDates[0].iso;
  state.booking.selectedCourtFilter = 'all';
  state.booking.selectedDuration = 60;
  state.booking.selectedSlot = null;
  state.booking.racketsHired = 0;
  state.booking.ballsTubes = 0;
  state.booking.confirmedBooking = null;
  state.findPlayer.matches = [...OPEN_MATCHES];
  state.findPlayer.selectedMatchToJoin = null;
  state.findPlayer.myMatchRequest = null;
  state.findPlayer.simulatedStatus = 'pending';
  state.classes.selectedClass = null;
  state.classes.inquirySubmitted = false;
  state.modal = null;
  notify();
}
