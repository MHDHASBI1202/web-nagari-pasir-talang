'use strict';

// ─── Loader ───────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 800);
});

// ─── Toast Notification ───────────────────────
function showToast(message, type = 'info', duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ─── Modal Berita ─────────────────────────────
function openModal(data) {
  const overlay   = document.getElementById('beritaModal');
  const img       = document.getElementById('modalImg');
  const cat       = document.getElementById('modalCatBadge');
  const date      = document.getElementById('modalDate');
  const author    = document.getElementById('modalAuthor');
  const title     = document.getElementById('modalTitle');
  const body      = document.getElementById('modalBody');
  if (!overlay) return;

  img.src         = data.img    || '';
  img.alt         = data.title  || '';
  cat.textContent = data.cat    || '';
  date.textContent= '📅 ' + (data.date   || '');
  author.textContent = '👤 ' + (data.author || '');
  title.textContent  = data.title || '';
  body.textContent   = data.body  || '';

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('beritaModal');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function hubungiWA() {
  const title = document.getElementById('modalTitle')?.textContent || '';
  const msg = encodeURIComponent(`Assalamualaikum, saya ingin info lebih lanjut mengenai: "${title}"`);
  window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank', 'noopener');
}

document.addEventListener('DOMContentLoaded', () => {
  // Attach modal events to berita items
  document.querySelectorAll('[data-modal="true"]').forEach(el => {
    const open = () => openModal({
      img:    el.dataset.img,
      cat:    el.dataset.cat,
      date:   el.dataset.date,
      author: el.dataset.author,
      title:  el.dataset.title,
      body:   el.dataset.body,
    });
    el.addEventListener('click', open);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  // Modal close button
  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  document.getElementById('beritaModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('beritaModal')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Coming soon social media buttons
  document.querySelectorAll('.coming-soon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform || 'Media Sosial';
      showToast(`Akun ${platform} Nagari Pasir Talang segera hadir! 🚀`, 'warn', 3000);
    });
  });

  // Reveal observers
  document.querySelectorAll(
    '.layanan-card, .info-card, .jorong-card, .berita-item, .potensi-card, .galeri-item, .big-stat-card, .stat-chart-card, .apbnag-card, .kontak-card, .footer-col, .wali-card'
  ).forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

  document.querySelectorAll('[data-target], .counter').forEach(el => counterObserver.observe(el));

  // Progress bar animation observer
  document.querySelectorAll('.stat-chart-card, .big-stat-card').forEach(el => {
    el.querySelectorAll('.prog-bar, .bs-fill, .circle').forEach(bar => {
      bar.style.animationPlayState = 'paused';
    });
    progObserver.observe(el);
  });
});

// ─── Navbar: Scroll & Active Link ─────────────
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
}

function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
  handleScrollTop();
});
updateNavbar();

// ─── Hamburger Menu ───────────────────────────
const hamburger          = document.getElementById('hamburger');
const navLinksContainer  = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer?.classList.toggle('open');
});
navLinksContainer?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinksContainer?.classList.remove('open');
  });
});
document.addEventListener('click', e => {
  if (!hamburger?.contains(e.target) && !navLinksContainer?.contains(e.target)) {
    hamburger?.classList.remove('open');
    navLinksContainer?.classList.remove('open');
  }
});

// ─── Smooth Scroll ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

// ─── Particles ────────────────────────────────
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p   = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 6 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s;opacity:${Math.random()*.5+.1};`;
    container.appendChild(p);
  }
}
createParticles();

// ─── Counter Animation ────────────────────────
function animateCounter(el, target, duration = 1800) {
  const startTime = performance.now();
  const step = now => {
    const p = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target).toLocaleString('id-ID');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ─── Intersection Observers ───────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target) && !el.dataset.counted) {
        el.dataset.counted = true;
        animateCounter(el, target);
      }
    }
  });
}, { threshold: 0.5 });

const progObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.prog-bar, .bs-fill, .circle').forEach(b => b.style.animationPlayState = 'running');
      progObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

// ─── Ticker Duplication ───────────────────────
(function () {
  const ticker = document.getElementById('ticker');
  if (ticker) ticker.innerHTML += ticker.innerHTML;
})();

// ─── Scroll To Top ────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');
function handleScrollTop() {
  scrollTopBtn?.classList.toggle('visible', window.scrollY > 500);
}
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── Gallery Lightbox ─────────────────────────
document.querySelectorAll('.galeri-item').forEach(item => {
  const open = () => {
    const img   = item.querySelector('img');
    const title = item.querySelector('.galeri-title')?.textContent || '';
    if (!img) return;

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;cursor:zoom-out;animation:fadeIn .3s ease;';
    const imgEl = document.createElement('img');
    imgEl.src = img.src; imgEl.alt = title;
    imgEl.style.cssText = 'max-width:90%;max-height:80vh;border-radius:12px;box-shadow:0 20px 80px rgba(0,0,0,.5);object-fit:contain;';
    const caption = document.createElement('p');
    caption.textContent = title;
    caption.style.cssText = 'color:rgba(255,255,255,.8);font-size:1rem;margin-top:16px;font-weight:500;';
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'position:absolute;top:20px;right:24px;color:#fff;font-size:2.5rem;background:rgba(255,255,255,.1);border:none;width:48px;height:48px;border-radius:50%;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;';
    overlay.append(imgEl, caption, closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    const close = () => { document.body.removeChild(overlay); document.body.style.overflow = ''; };
    overlay.addEventListener('click', ev => { if (ev.target === overlay || ev.target === closeBtn) close(); });
    document.addEventListener('keydown', function onKey(ev) { if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } });
  };
  item.addEventListener('click', open);
  item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
});

// CSS for lightbox
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
document.head.appendChild(style);

// ─── Contact Form ─────────────────────────────
const kontakForm  = document.getElementById('kontakForm');
const formSuccess = document.getElementById('formSuccess');

kontakForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('btn-kirim');
  const origText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Mengirim...';
  btn.style.opacity = '.7';

  setTimeout(() => {
    kontakForm.style.transition = 'opacity .3s, transform .3s';
    kontakForm.style.opacity    = '0';
    kontakForm.style.transform  = 'scale(.97)';
    setTimeout(() => {
      kontakForm.style.display = 'none';
      formSuccess?.classList.add('show');
      showToast('Pesan Anda berhasil dikirim! ✅', 'success');
    }, 300);
  }, 1400);
});

function resetForm() {
  if (kontakForm && formSuccess) {
    kontakForm.reset();
    kontakForm.style.display  = '';
    kontakForm.style.opacity  = '1';
    kontakForm.style.transform = '';
    formSuccess.classList.remove('show');
    const btn = document.getElementById('btn-kirim');
    if (btn) { btn.disabled = false; btn.style.opacity = ''; }
  }
}
