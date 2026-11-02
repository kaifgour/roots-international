/* ============================================
   ROOTS INTERNATIONAL — script.js
   ============================================ */

// ─── Header scroll state ─────────────────────
const header = document.getElementById('header');

function updateHeaderOnScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

updateHeaderOnScroll();
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });


// ─── Mobile navigation ────────────────────────
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

function openMobileNav() {
  mobileNav.classList.add('open');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  burger.setAttribute('aria-label', 'Close navigation menu');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open navigation menu');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  if (mobileNav.classList.contains('open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
    closeMobileNav();
  }
});

// Expose closeMobileNav for inline onclick attributes
window.closeMobileNav = closeMobileNav;


// ─── Scroll-reveal animation ──────────────────
const revealItems = document.querySelectorAll('.reveal');

if (revealItems.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}


// ─── Enquiry form (no real backend) ──────────
const enrolForm = document.querySelector('.enrol form');

if (enrolForm) {
  enrolForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = enrolForm.querySelector('#submit-btn');
    const originalText = btn.innerHTML;

    // Indicate submission
    btn.disabled = true;
    btn.innerHTML = '<i class="ph-bold ph-spinner"></i> Sending…';

    // Simulate a short delay then show confirmation
    setTimeout(() => {
      btn.innerHTML = '<span>🎉</span> Enquiry Sent!';
      btn.style.background = 'var(--yellow)';
      btn.style.color = 'var(--teal)';

      // Reset after 4 seconds
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
        enrolForm.reset();
      }, 4000);
    }, 1200);
  });
}


// ─── Active nav link on scroll ────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let currentId = '';

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });


// ─── Gallery: Lazy loading via IntersectionObserver ───────────────────
const lazyImgs = document.querySelectorAll('.lazy-img');

if (lazyImgs.length) {
  const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      const src = img.dataset.src;
      if (!src) return;

      img.src = src;
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      }, { once: true });
      // Fallback: if already cached the load event fires before listener
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
      }

      observer.unobserve(img);
    });
  }, {
    rootMargin: '200px 0px',   // start loading 200px before viewport
    threshold: 0
  });

  lazyImgs.forEach((img) => imgObserver.observe(img));
}


// ─── Gallery Lightbox ─────────────────────────────────────────────────
(function () {
  const lightbox     = document.getElementById('galleryLightbox');
  const lbImg        = document.getElementById('lightboxImg');
  const lbCaption    = document.getElementById('lightboxCaption');
  const lbClose      = document.getElementById('lightboxClose');
  const lbPrev       = document.getElementById('lightboxPrev');
  const lbNext       = document.getElementById('lightboxNext');

  if (!lightbox) return;

  // Collect all zoom buttons in order
  const zoomBtns = Array.from(document.querySelectorAll('.gallery-zoom-btn'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const btn = zoomBtns[index];
    lbImg.src        = btn.dataset.img;
    lbImg.alt        = btn.dataset.caption;
    lbCaption.textContent = btn.dataset.caption;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    // Return focus to the triggering button
    zoomBtns[currentIndex].focus();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + zoomBtns.length) % zoomBtns.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % zoomBtns.length;
    openLightbox(currentIndex);
  }

  // Open on zoom button click
  zoomBtns.forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(i);
    });
  });

  // Also open when clicking the gallery item itself (not just button)
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  // Click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
}());
