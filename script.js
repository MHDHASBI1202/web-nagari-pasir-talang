/* =============================================
   NAGARI PASIR TALANG - Main Script
   ============================================= */

'use strict';

// ─── Loader ───────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  }
});

// ─── Navbar: Scroll & Active Link ─────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id], div[id]');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    const sectionTop = sec.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
  handleScrollTop();
  revealOnScroll();
});

updateNavbar();

// ─── Hamburger Menu ───────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

if (hamburger && navLinksContainer) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });

  // Close on link click
  navLinksContainer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    }
  });
}

// ─── Smooth Scroll ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Particle Generator ───────────────────────
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 20;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 6 + 2;
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(particle);
  }
}

createParticles();

// ─── Number Counter Animation ─────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    el.textContent = current.toLocaleString('id-ID');

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

// ─── Reveal on Scroll (IntersectionObserver) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

function revealOnScroll() {
  // Legacy fallback (most handled by IntersectionObserver)
}

// Counter Observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target) && !el.dataset.counted) {
        el.dataset.counted = true;
        animateCounter(el, target);
      }
    }
  });
}, { threshold: 0.5 });

// Initialize after DOM
document.addEventListener('DOMContentLoaded', () => {
  // Observe reveal elements
  document.querySelectorAll(
    '.layanan-card, .info-card, .jorong-card, .berita-item, .potensi-card, .galeri-item, .big-stat-card, .stat-chart-card, .apbnag-card, .kontak-card, .footer-col, .wali-card'
  ).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Observe counters (hero stats + big-stat-card)
  document.querySelectorAll('[data-target], .counter').forEach(el => {
    counterObserver.observe(el);
  });
});

// ─── Ticker Duplication ───────────────────────
(function setupTicker() {
  const ticker = document.getElementById('ticker');
  if (!ticker) return;
  // Duplicate items for seamless loop
  ticker.innerHTML += ticker.innerHTML;
})();

// ─── Scroll To Top ────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');

function handleScrollTop() {
  if (scrollTopBtn) {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
}

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Contact Form ─────────────────────────────
const kontakForm = document.getElementById('kontakForm');
const formSuccess = document.getElementById('formSuccess');

if (kontakForm) {
  kontakForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-kirim');
    btn.textContent = 'Mengirim...';
    btn.disabled = true;

    // Simulate submit (replace with actual fetch/API in production)
    setTimeout(() => {
      kontakForm.style.opacity = '0';
      kontakForm.style.transform = 'scale(0.95)';
      setTimeout(() => {
        kontakForm.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      }, 300);
    }, 1200);
  });
}

// ─── Gallery Lightbox (Simple) ────────────────
document.querySelectorAll('.galeri-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const title = item.querySelector('.galeri-title')?.textContent || '';
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9998;
      background: rgba(0,0,0,.92);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 40px;
      cursor: zoom-out;
      animation: fadeIn .3s ease;
    `;

    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    imgEl.alt = title;
    imgEl.style.cssText = `
      max-width: 90%; max-height: 80vh;
      border-radius: 12px;
      box-shadow: 0 20px 80px rgba(0,0,0,.5);
      object-fit: contain;
    `;

    const caption = document.createElement('p');
    caption.textContent = title;
    caption.style.cssText = `
      color: rgba(255,255,255,.8); font-size: 1rem;
      margin-top: 16px; font-weight: 500;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      position: absolute; top: 20px; right: 24px;
      color: #fff; font-size: 2.5rem;
      background: rgba(255,255,255,.1); border: none;
      width: 48px; height: 48px; border-radius: 50%;
      cursor: pointer; line-height: 1;
      display: flex; align-items: center; justify-content: center;
    `;

    overlay.appendChild(imgEl);
    overlay.appendChild(caption);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    };
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay || ev.target === closeBtn) close(); });
    document.addEventListener('keydown', function onKey(ev) {
      if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
    });
  });
});

// CSS for lightbox fadeIn
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
document.head.appendChild(style);

// ─── Active Nav Highlight (initial) ───────────
updateActiveLink();

// ─── Progress Bar Animation ───────────────────
const progObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.prog-bar, .bs-fill').forEach(bar => {
        bar.style.animationPlayState = 'running';
      });
      entry.target.querySelectorAll('.circle').forEach(circle => {
        circle.style.animationPlayState = 'running';
      });
      progObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-chart-card, .big-stat-card').forEach(el => {
  // Pause animations initially
  el.querySelectorAll('.prog-bar, .bs-fill, .circle').forEach(bar => {
    bar.style.animationPlayState = 'paused';
  });
  progObserver.observe(el);
});
