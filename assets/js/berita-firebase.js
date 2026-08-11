/* ============================================================
   berita-firebase.js
   Memuat berita publik dari Firestore — Nagari Pasir Talang
   ============================================================ */
(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────────────
  var allDocs  = [];
  var activeKat = '';

  // ── Helpers ──────────────────────────────────────────────────────────
  function fmtTanggal(ts) {
    if (!ts) return '';
    var d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('id-ID', {
      day   : '2-digit',
      month : 'long',
      year  : 'numeric'
    });
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function placeholderImg() {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"%3E'
      + '%3Crect width="400" height="220" fill="%23e2e8f0"/%3E'
      + '%3Ctext x="200" y="118" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2394a3b8"%3EFoto Berita%3C/text%3E'
      + '%3C/svg%3E';
  }

  // ── Card Berita Utama (featured — besar) ─────────────────────────────
  function cardFeatured(doc) {
    var d   = doc.data();
    var id  = doc.id;
    var img = d.foto || placeholderImg();
    return '<div class="berita-featured" onclick="bukaBeritaModal(\'' + id + '\')">'
      + '<div class="berita-featured-img">'
      +   '<img src="' + esc(img) + '" alt="' + esc(d.judul) + '" loading="lazy" onerror="this.src=\'' + placeholderImg() + '\'">'
      + '</div>'
      + '<div class="berita-featured-body">'
      +   '<span class="berita-kat">' + esc(d.kategori || 'Umum') + '</span>'
      +   '<h3 class="berita-judul">' + esc(d.judul) + '</h3>'
      +   '<p class="berita-ringkasan">'
      +     esc(d.ringkasan ? d.ringkasan.substring(0, 140) + (d.ringkasan.length > 140 ? '...' : '') : '')
      +   '</p>'
      +   '<div class="berita-meta">'
      +     '<span>✍️ ' + esc(d.penulis || 'Admin') + '</span>'
      +     '<span>📅 ' + fmtTanggal(d.createdAt) + '</span>'
      +   '</div>'
      +   '<button class="berita-readmore">Baca Selengkapnya →</button>'
      + '</div>'
      + '</div>';
  }

  // ── Card Berita Kecil (list samping) ─────────────────────────────────
  function cardItem(doc) {
    var d   = doc.data();
    var id  = doc.id;
    var img = d.foto || placeholderImg();
    return '<div class="berita-item" onclick="bukaBeritaModal(\'' + id + '\')">'
      + '<div class="berita-item-img">'
      +   '<img src="' + esc(img) + '" alt="' + esc(d.judul) + '" loading="lazy" onerror="this.src=\'' + placeholderImg() + '\'">'
      + '</div>'
      + '<div class="berita-item-body">'
      +   '<span class="berita-kat">' + esc(d.kategori || 'Umum') + '</span>'
      +   '<p class="berita-judul">' + esc(d.judul) + '</p>'
      +   '<p class="berita-ringkasan-sm">'
      +     esc(d.ringkasan ? d.ringkasan.substring(0, 80) + (d.ringkasan.length > 80 ? '...' : '') : '')
      +   '</p>'
      +   '<span style="font-size:.75rem;color:#94a3b8">📅 ' + fmtTanggal(d.createdAt) + '</span>'
      + '</div>'
      + '</div>';
  }

  // ── Render Grid ──────────────────────────────────────────────────────
  function renderGrid(docs) {
    var loadingEl  = document.getElementById('beritaLoading');
    var contentEl  = document.getElementById('beritaContent');
    var emptyEl    = document.getElementById('beritaEmpty');
    var gridEl     = document.getElementById('beritaGrid');

    if (!gridEl) return;

    if (loadingEl)  loadingEl.style.display  = 'none';

    if (!docs || docs.length === 0) {
      if (contentEl) contentEl.style.display = 'none';
      if (emptyEl)   emptyEl.style.display   = '';
      return;
    }

    if (emptyEl)   emptyEl.style.display   = 'none';
    if (contentEl) contentEl.style.display = '';

    // Berita pertama → featured, sisanya → list
    var featured = docs[0];
    var rest     = docs.slice(1);

    var html = '<div class="berita-grid">'
      + '<div>' + cardFeatured(featured) + '</div>'
      + '<div class="berita-list">';

    for (var i = 0; i < rest.length; i++) {
      html += cardItem(rest[i]);
    }

    html += '</div></div>';
    gridEl.innerHTML = html;
  }

  // ── Filter ───────────────────────────────────────────────────────────
  function applyFilter(kat) {
    activeKat = kat || 'semua';

    // Update tombol aktif
    var btns = document.querySelectorAll('.filter-btn');
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      var katVal = btn.dataset.kat || '';
      if (katVal === activeKat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }

    var filtered;
    if (!activeKat || activeKat === 'semua') {
      filtered = allDocs;
    } else {
      filtered = allDocs.filter(function (doc) {
        var d = doc.data();
        return (d.kategori || '').toLowerCase() === activeKat.toLowerCase();
      });
    }

    renderGrid(filtered);
  }

  // ── Init Filter Buttons ──────────────────────────────────────────────
  function initFilterBtns() {
    var filterEl = document.getElementById('beritaFilter');
    if (!filterEl) return;

    var btns = filterEl.querySelectorAll('.filter-btn');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          applyFilter(btn.dataset.kat);
        });
      })(btns[i]);
    }
  }

  // ── Load Berita dari Firestore ───────────────────────────────────────
  function loadBerita() {
    var loadingEl = document.getElementById('beritaLoading');
    var gridEl    = document.getElementById('beritaGrid');
    if (!gridEl) return;
    if (loadingEl) loadingEl.style.display = '';

    // Timeout fallback: jika 8 detik tidak ada respons, tampilkan empty state
    var timeoutId = setTimeout(function() {
      if (loadingEl) loadingEl.style.display = 'none';
      var emptyEl = document.getElementById('beritaEmpty');
      if (emptyEl && (!allDocs || allDocs.length === 0)) {
        emptyEl.style.display = '';
      }
    }, 8000);

    function onSuccess(snapshot) {
      clearTimeout(timeoutId);
      allDocs = snapshot.docs;
      applyFilter(activeKat);
    }

    function onError(err) {
      clearTimeout(timeoutId);
      console.warn('[berita-firebase] Query error, trying fallback:', err.message);
      // Fallback: query tanpa orderBy (tidak butuh composite index)
      db.collection('berita')
        .where('status', '==', 'published')
        .get()
        .then(function(snap) {
          // Sort client-side by createdAt desc
          var docs = snap.docs.sort(function(a, b) {
            var ta = a.data().createdAt ? a.data().createdAt.toMillis() : 0;
            var tb = b.data().createdAt ? b.data().createdAt.toMillis() : 0;
            return tb - ta;
          });
          allDocs = docs.slice(0, 10);
          applyFilter(activeKat);
        })
        .catch(function(e2) {
          console.error('[berita-firebase] Fallback error:', e2);
          if (loadingEl) loadingEl.style.display = 'none';
          var emptyEl = document.getElementById('beritaEmpty');
          if (emptyEl) emptyEl.style.display = '';
        });
    }

    try {
      db.collection('berita')
        .where('status', '==', 'published')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .onSnapshot(onSuccess, onError);
    } catch(e) {
      onError(e);
    }
  }

  // ── Modal Baca Berita Lengkap ────────────────────────────────────────
  window.bukaBeritaModal = function (id) {
    // Cari dari cache lokal
    var doc = null;
    for (var i = 0; i < allDocs.length; i++) {
      if (allDocs[i].id === id) { doc = allDocs[i]; break; }
    }

    if (!doc) {
      // Fallback: ambil dari Firestore langsung
      db.collection('berita').doc(id).get().then(function (snap) {
        if (snap.exists) { renderModal({ id: snap.id, data: function() { return snap.data(); } }); }
      });
      return;
    }
    renderModal(doc);
  };

  function renderModal(doc) {
    var d   = doc.data();
    var img = d.foto || '';

    // Buat overlay
    var overlay = document.createElement('div');
    overlay.id = 'berita-modal-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:fadeInOverlay .2s ease;';

    // Isi paragraf isi berita — pecah per \n
    var paraHtml = '';
    var lines = (d.isi || 'Konten tidak tersedia.').split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line) {
        paraHtml += '<p style="margin:0 0 14px;line-height:1.8;font-size:.95rem;color:#374151">' + esc(line) + '</p>';
      }
    }

    overlay.innerHTML = '<div style="'
      + 'background:#fff;border-radius:20px;max-width:700px;width:100%;'
      + 'max-height:88vh;overflow-y:auto;box-shadow:0 32px 64px rgba(0,0,0,.35);'
      + 'animation:slideUpModal .25s cubic-bezier(.34,1.56,.64,1);position:relative">'

      // Close button
      + '<button onclick="document.getElementById(\'berita-modal-overlay\').remove()" style="'
      +   'position:sticky;top:0;float:right;background:#fff;border:none;font-size:22px;'
      +   'cursor:pointer;color:#64748b;padding:16px;line-height:1;z-index:1;border-radius:0 20px 0 0">✕</button>'

      // Gambar
      + (img ? '<img src="' + esc(img) + '" alt="' + esc(d.judul) + '" style="width:100%;max-height:280px;object-fit:cover;display:block;border-radius:20px 20px 0 0;margin-top:-50px" onerror="this.style.display=\'none\'">' : '')

      // Body
      + '<div style="padding:28px 32px">'
      +   '<span class="berita-kat" style="margin-bottom:10px">' + esc(d.kategori || 'Umum') + '</span>'
      +   '<h2 style="font-size:1.35rem;font-weight:800;color:#0f172a;line-height:1.35;margin:10px 0 14px">' + esc(d.judul) + '</h2>'
      +   '<div class="berita-meta" style="margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid #e2e8f0">'
      +     '<span>✍️ ' + esc(d.penulis || 'Admin') + '</span>'
      +     '<span>📅 ' + fmtTanggal(d.createdAt) + '</span>'
      +   '</div>'
      +   '<div>' + paraHtml + '</div>'
      + '</div>'
      + '</div>';

    // Inject style keyframes sekali
    if (!document.getElementById('berita-modal-style')) {
      var style = document.createElement('style');
      style.id = 'berita-modal-style';
      style.textContent = '@keyframes fadeInOverlay{from{opacity:0}to{opacity:1}}'
        + '@keyframes slideUpModal{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}';
      document.head.appendChild(style);
    }

    // Tutup saat klik overlay
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });

    // Tutup dengan Escape
    function onEsc(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onEsc); }
    }
    document.addEventListener('keydown', onEsc);

    // Hapus overlay lama jika ada
    var existing = document.getElementById('berita-modal-overlay');
    if (existing) existing.remove();

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Kembalikan scroll saat modal ditutup
    var observer = new MutationObserver(function () {
      if (!document.getElementById('berita-modal-overlay')) {
        document.body.style.overflow = '';
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
  }

  // ── Init ─────────────────────────────────────────────────────────────
  function init() {
    initFilterBtns();
    loadBerita();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
