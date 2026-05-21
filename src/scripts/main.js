/* ==========================================================================
   Morning Vietnam — Interactive Behaviors
   Adapted from Happly design patterns
   ========================================================================== */


// ─────────────────────────────────────────────────────────────────────────────
// 1. SCROLL REVEAL — Intersection Observer
// ─────────────────────────────────────────────────────────────────────────────

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal, .stagger').forEach((el) => observer.observe(el));
}


// ─────────────────────────────────────────────────────────────────────────────
// 2. STICKY HEADER — shrink on scroll
// ─────────────────────────────────────────────────────────────────────────────

function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. TOUR SHOWCASE — accordion expand (Happly's .b-showcase)
// ─────────────────────────────────────────────────────────────────────────────

function initShowcase() {
  const items = document.querySelectorAll('.b-showcase__item');
  if (!items.length) return;

  // First item active by default
  items[0].classList.add('active');

  items.forEach((item) => {
    // Desktop: hover
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 768) {
        items.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
      }
    });

    // Mobile/touch: click
    item.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        items.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTIMONIALS SLIDER
// ─────────────────────────────────────────────────────────────────────────────

function initTestimonialsSlider() {
  const slider = document.querySelector('.b-testimonials__items');
  const bullets = document.querySelectorAll('.b-testimonials__pagination__bullet');
  if (!slider || !bullets.length) return;

  let current = 0;
  const total = bullets.length;
  let autoPlay;

  function goTo(index) {
    current = (index + total) % total;
    slider.style.transform = `translateX(-${current * 100}%)`;
    bullets.forEach((b, i) => b.classList.toggle('active', i === current));
  }

  function startAutoPlay() {
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  bullets.forEach((bullet, i) => bullet.addEventListener('click', () => {
    clearInterval(autoPlay);
    goTo(i);
    startAutoPlay();
  }));

  // Pause on hover
  slider.closest('.b-testimonials')?.addEventListener('mouseenter', () => clearInterval(autoPlay));
  slider.closest('.b-testimonials')?.addEventListener('mouseleave', startAutoPlay);

  // Swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      clearInterval(autoPlay);
      goTo(delta > 0 ? current + 1 : current - 1);
      startAutoPlay();
    }
  });

  goTo(0);
  startAutoPlay();
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. HERO PARALLAX — brand text moves on scroll
// ─────────────────────────────────────────────────────────────────────────────

function initHeroParallax() {
  const brandText = document.querySelector('.b-hero__brand-text');
  if (!brandText) return;

  // Only run parallax if user has no motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = brandText.closest('.b-hero');

  window.addEventListener('scroll', () => {
    const heroBottom = hero?.getBoundingClientRect().bottom ?? 0;
    if (heroBottom < 0) return; // hero is off-screen, skip
    brandText.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
}


// ─────────────────────────────────────────────────────────────────────────────
// 6. POPUP / MODAL
// ─────────────────────────────────────────────────────────────────────────────

function initPopup() {
  // Open: any element with [data-popup-trigger="#selector"]
  document.querySelectorAll('[data-popup-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const target = document.querySelector(trigger.dataset.popupTrigger);
      if (!target) return;
      target.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close: [data-popup-close] button OR clicking the backdrop
  function closePopup(popup) {
    popup?.classList.remove('active');
    // Only restore scroll if no other modals are open
    if (!document.querySelector('.b-popup.active, .cart-modal.open')) {
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('[data-popup-close]').forEach((btn) => {
    btn.addEventListener('click', () => closePopup(btn.closest('.b-popup')));
  });

  // Backdrop click
  document.querySelectorAll('.b-popup').forEach((popup) => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closePopup(popup);
    });
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.b-popup.active').forEach(closePopup);
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// 7. CART SLIDE-IN
// ─────────────────────────────────────────────────────────────────────────────

function initCart() {
  const cartModal  = document.querySelector('.cart-modal');
  const cartOverlay = document.querySelector('.cart-overlay');
  if (!cartModal) return;

  function openCart() {
    cartModal.classList.add('open');
    cartOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartModal.classList.remove('open');
    cartOverlay?.classList.remove('open');
    if (!document.querySelector('.b-popup.active')) {
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('[data-cart-open]').forEach((btn)  => btn.addEventListener('click', openCart));
  document.querySelectorAll('[data-cart-close]').forEach((btn) => btn.addEventListener('click', closeCart));
  cartOverlay?.addEventListener('click', closeCart);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal.classList.contains('open')) closeCart();
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// 8. MOBILE HAMBURGER MENU
// ─────────────────────────────────────────────────────────────────────────────

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  function toggle() {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggle);

  // Close on nav link click (SPA-style navigation)
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) toggle();
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// 9. MARQUEE — clone track for seamless infinite loop
// ─────────────────────────────────────────────────────────────────────────────

function initMarquee() {
  document.querySelectorAll('.b-marquee').forEach((marquee) => {
    const track = marquee.querySelector('.b-marquee__track');
    if (!track) return;

    // Only clone if not already duplicated (idempotent on HMR)
    if (!track.nextElementSibling) {
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marquee.appendChild(clone);
    }
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// 10. FAQ ACCORDION
//     Works alongside native <details> — enhances with animated max-height
// ─────────────────────────────────────────────────────────────────────────────

function initFAQ() {
  // Native <details> approach — already works without JS.
  // This adds max-height animation to .faq-item/.faq-question/.faq-answer
  // pattern (non-native version).
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    // Init: ensure closed state
    answer.style.maxHeight = '0';
    answer.style.overflow  = 'hidden';
    answer.style.transition = 'max-height 0.4s cubic-bezier(0.645, 0.045, 0.355, 1)';

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
        const a = openItem.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// 11. TOUR FILTER (Tours page)
// ─────────────────────────────────────────────────────────────────────────────

function initTourFilter() {
  const filters = document.querySelectorAll('[data-filter]');
  const cards   = document.querySelectorAll('[data-tour-region]');
  if (!filters.length || !cards.length) return;

  const ease = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const region = filter.dataset.filter;

      filters.forEach((f) => f.classList.remove('active'));
      filter.classList.add('active');

      cards.forEach((card) => {
        const match = region === 'all' || card.dataset.tourRegion === region;
        card.style.transition     = `opacity 0.4s ${ease}, transform 0.4s ${ease}`;
        card.style.opacity        = match ? '1' : '0.3';
        card.style.transform      = match ? 'scale(1)' : 'scale(0.97)';
        card.style.pointerEvents  = match ? 'all' : 'none';
      });
    });
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// 12. SMOOTH ANCHOR SCROLL
//     Handles <a href="#section"> links with offset for sticky header
// ─────────────────────────────────────────────────────────────────────────────

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '60',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// 13. CTA IMAGES — "New to Morning Vietnam?" scroll-scrubbed animation
//
//     Mechanism: CSS natural positions = fanned state.
//     JS reads each card's fanned position via getBoundingClientRect(),
//     computes the dx/dy offset from its natural position to section center,
//     then lerps transform based on scroll progress.
//
//     progress 0 = section entering from below  → cards stacked at center
//     progress 1 = section top at viewport top  → cards at fanned positions
//     Scrolling up reverses automatically since progress is recomputed every frame.
// ─────────────────────────────────────────────────────────────────────────────

function initCtaImages() {
  const section = document.querySelector('.b-ctaimages');
  if (!section) return;

  const allCards = Array.from(section.querySelectorAll('.b-ctaimages__image'));
  let cardData = [];
  let rafId = null;

  // Gentle per-card parallax after animation completes (Y and X drift factors)
  const driftY = [-0.10, -0.06, -0.13, -0.08, -0.07, -0.11, -0.05, -0.09];
  const driftX = [ 0.02, -0.03,  0.01, -0.02, -0.02,  0.03, -0.01,  0.02];

  function lerp(a, b, t) { return a + (b - a) * t; }

  function computeCardData() {
    const sRect = section.getBoundingClientRect();
    cardData = allCards.map(card => {
      const rotate = parseInt(card.dataset.rotate) || 0;
      const prev = card.style.transform;
      card.style.transform = 'none';
      const kRect = card.getBoundingClientRect();
      card.style.transform = prev;

      const cardCX = kRect.left - sRect.left + kRect.width  / 2;
      const cardCY = kRect.top  - sRect.top  + kRect.height / 2;

      const dx = sRect.width  / 2 - cardCX;
      const dy = sRect.height / 2 - cardCY;

      return { dx, dy, rotate };
    });
  }

  // p=0: animation starts when section top is 35% of vh from viewport top (65% visible)
  // p=1: animation done when section fills the screen (r.top = 0)
  // ~30% shorter range than previous → completes right as section goes full-screen
  function getProgress() {
    const r = section.getBoundingClientRect();
    const startTop = window.innerHeight * 0.35;
    return Math.max(0, Math.min(1, 1 - r.top / startTop));
  }

  function render() {
    rafId = null;
    const r = section.getBoundingClientRect();
    const p = getProgress();
    // Pixels scrolled past "full-screen" state — drives post-completion drift
    const past = Math.max(0, -r.top);

    allCards.forEach((card, i) => {
      const { dx, dy, rotate } = cardData[i];
      const tx    = lerp(dx, 0, p) + past * (driftX[i] ?? 0);
      const ty    = lerp(dy, 0, p) + past * (driftY[i] ?? 0);
      const scale = lerp(1.6, 1.0, p);
      card.style.transform = `translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${scale})`;
    });
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(render);
  }

  requestAnimationFrame(() => {
    computeCardData();
    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { computeCardData(); render(); }, { passive: true });
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// INIT ALL
// ─────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStickyHeader();
  initShowcase();
  initTestimonialsSlider();
  initHeroParallax();
  initPopup();
  initCart();
  initMobileMenu();
  initMarquee();
  initFAQ();
  initTourFilter();
  initSmoothScroll();
  initCtaImages();
});
