/**
 * Create Art School - Shared Main Script
 * Loaded on every page (type="module").
 * Handles: config → CSS vars, slide-in animation, hamburger menu, nav highlighting, smooth scroll.
 */
import { config } from '../config.js';

/* ------------------------------------------------------------------ */
/*  1. Apply config to CSS custom properties                          */
/* ------------------------------------------------------------------ */
(function applyConfig() {
  const root = document.documentElement;
  root.style.setProperty('--primary', config.primary);
  root.style.setProperty('--secondary', config.secondary);
  root.style.setProperty('--font', `'${config.font}', cursive`);
  document.title = `${config.businessName} — ${document.title || config.category}`;
})();

/* ------------------------------------------------------------------ */
/*  2. Slide Left animation with IntersectionObserver                  */
/* ------------------------------------------------------------------ */
let observerInstance = null;

export function observeSlideIn(container = document) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = container.querySelectorAll ? container.querySelectorAll('.slide-in:not(.slide-in--visible)') : [];

  if (prefersReduced) {
    elements.forEach(el => el.classList.add('slide-in--visible'));
    return;
  }

  if (!observerInstance) {
    observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.dataset.delay, 10) || 0;
            setTimeout(() => {
              el.classList.add('slide-in--visible');
            }, delay);
            observerInstance.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
  }

  elements.forEach((el, index) => {
    if (!el.dataset.delay) {
      el.dataset.delay = String((index % 6) * 100);
    }
    observerInstance.observe(el);
  });
}

// Initial run on DOMContentLoaded or load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => observeSlideIn());
} else {
  observeSlideIn();
}

/* ------------------------------------------------------------------ */
/*  3. Mobile hamburger menu toggle                                    */
/* ------------------------------------------------------------------ */
(function initHamburger() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('navbar__menu--open');
    toggle.classList.toggle('navbar__toggle--active');
  });

  /* Close menu when a link is clicked (mobile) */
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('navbar__menu--open');
      toggle.classList.remove('navbar__toggle--active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ------------------------------------------------------------------ */
/*  4. Active nav link highlighting                                    */
/* ------------------------------------------------------------------ */
(function highlightActiveNav() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
})();

/* ------------------------------------------------------------------ */
/*  5. Smooth scroll for anchor links                                  */
/* ------------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ------------------------------------------------------------------ */
/*  6. Navbar background on scroll                                     */
/* ------------------------------------------------------------------ */
(function navbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }, { passive: true });
})();
