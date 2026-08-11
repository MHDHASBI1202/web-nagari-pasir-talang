/**
 * settings-loader.js
 * Membaca data dari Firestore collection 'settings', document 'nagari'
 * dan mengupdate elemen-elemen di halaman publik (index.html).
 * Jika tidak ada data di Firestore, biarkan nilai default HTML.
 */
(function () {
  'use strict';

  function applySettings(d) {
    // ── Foto Wali ────────────────────────────────────────────
    if (d.waliFoto) {
      var imgEl = document.getElementById('waliImg');
      if (imgEl) imgEl.src = d.waliFoto;
    }

    // ── Label / Jabatan ──────────────────────────────────────
    if (d.waliLabel) {
      var labelEl = document.getElementById('waliLabel');
      if (labelEl) labelEl.textContent = d.waliLabel;
    }

    // ── Nama Wali ────────────────────────────────────────────
    if (d.waliNama) {
      var nameEl = document.getElementById('waliName');
      if (nameEl) nameEl.textContent = d.waliNama;
    }

    // ── Periode ──────────────────────────────────────────────
    if (d.waliPeriode) {
      var periodeEl = document.getElementById('waliPeriode');
      if (periodeEl) periodeEl.textContent = d.waliPeriode;
    }

    // ── Quote / Kutipan ──────────────────────────────────────
    if (d.waliQuote) {
      var quoteEl = document.getElementById('waliQuote');
      if (quoteEl) quoteEl.textContent = d.waliQuote;
    }

    // ── Email Kontak ─────────────────────────────────────────
    if (d.kontakEmail) {
      var emailTextEl = document.getElementById('kontakEmailText');
      if (emailTextEl) emailTextEl.textContent = d.kontakEmail;

      // Update link mailto kontak utama
      var emailLinkEl = document.getElementById('kontak-email');
      if (emailLinkEl) emailLinkEl.href = 'mailto:' + d.kontakEmail;

      // Update link email di footer (cari a[href^="mailto:"])
      var footerEmailLinks = document.querySelectorAll('a[href^="mailto:"]');
      for (var i = 0; i < footerEmailLinks.length; i++) {
        footerEmailLinks[i].href = 'mailto:' + d.kontakEmail;
        if (footerEmailLinks[i].textContent.indexOf('@') !== -1) {
          footerEmailLinks[i].textContent = d.kontakEmail;
        }
      }
    }

    // ── Alamat Kantor ─────────────────────────────────────────
    if (d.kontakAlamat) {
      var alamatEl = document.getElementById('kontakAlamatText');
      if (alamatEl) {
        alamatEl.innerHTML = d.kontakAlamat.replace(/\n/g, '<br>');
      }
    }

    // ── URL Google Maps ──────────────────────────────────────
    if (d.kontakMaps) {
      var mapsEl = document.getElementById('kontak-address');
      if (mapsEl) mapsEl.href = d.kontakMaps;
    }

    // ── WhatsApp Button ──────────────────────────────────────
    if (d.waliWa) {
      var waText = encodeURIComponent('Assalamualaikum, saya ingin menghubungi Wali Nagari Pasir Talang.');
      var waUrl = 'https://wa.me/' + d.waliWa + '?text=' + waText;
      var waBtns = document.querySelectorAll('.btn-wali-wa');
      for (var j = 0; j < waBtns.length; j++) {
        waBtns[j].href = waUrl;
      }
    }

    // ── Instagram ────────────────────────────────────────────
    if (d.instagram) {
      var igLinks = document.querySelectorAll('a[href*="instagram.com"], a.footer-social-ig, a[data-social="instagram"]');
      for (var k = 0; k < igLinks.length; k++) {
        igLinks[k].href = d.instagram;
      }
    }

    // ── TikTok ───────────────────────────────────────────────
    if (d.tiktok) {
      var ttLinks = document.querySelectorAll('a[href*="tiktok.com"], a.footer-social-tt, a[data-social="tiktok"]');
      for (var l = 0; l < ttLinks.length; l++) {
        ttLinks[l].href = d.tiktok;
      }
    }

    // ── Jam Operasional Senin-Kamis ──────────────────────────
    if (d.jamSenKam) {
      var jamSKEl = document.getElementById('jamSenKam');
      if (jamSKEl) jamSKEl.textContent = d.jamSenKam;
    }

    // ── Jam Operasional Jumat ────────────────────────────────
    if (d.jamJumat) {
      var jamJumEl = document.getElementById('jamJumat');
      if (jamJumEl) jamJumEl.textContent = d.jamJumat;
    }
  }

  function loadSettings() {
    if (typeof db === 'undefined') {
      console.warn('settings-loader: db belum tersedia.');
      return;
    }
    db.collection('settings').doc('nagari').get()
      .then(function (doc) {
        if (!doc.exists) return;
        applySettings(doc.data());
      })
      .catch(function (err) {
        console.warn('settings-loader: gagal memuat settings.', err);
      });
  }

  // Jalankan setelah DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSettings);
  } else {
    loadSettings();
  }
})();
