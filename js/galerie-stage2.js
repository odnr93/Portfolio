/**
 * galerie-stage2.js — Galerie & Lightbox page Galerie Stage 2ème année
 * Odnerson ORIENTALE — Portfolio BTS SIO SLAM
 */

(function () {
  'use strict';

  const lightbox  = document.getElementById('glightbox');
  const backdrop  = document.getElementById('glightbox-backdrop');
  const btnClose  = document.getElementById('glightbox-close');
  const btnPrev   = document.getElementById('glightbox-prev');
  const btnNext   = document.getElementById('glightbox-next');
  const mainImg   = document.getElementById('glightbox-img');
  const caption   = document.getElementById('glightbox-caption');
  const counter   = document.getElementById('glightbox-counter');

  let items   = [];
  let current = 0;

  // ─── Collecter tous les items de la galerie ───────────────────
  function collectItems() {
    items = Array.from(document.querySelectorAll('.galerie-item'));
  }

  // ─── Ouvrir le lightbox ───────────────────────────────────────
  function open(index) {
    collectItems();
    if (!items.length) return;
    current = index;
    update();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ─── Fermer ───────────────────────────────────────────────────
  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { mainImg.src = ''; }, 300);
  }

  // ─── Mettre à jour l'image affichée ──────────────────────────
  function update() {
    const item = items[current];
    const src  = item.dataset.src;
    const cap  = item.dataset.caption || '';

    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = src;
      mainImg.alt = cap;
      mainImg.style.opacity = '1';
    }, 120);

    caption.textContent = cap;
    counter.textContent = (current + 1) + ' / ' + items.length;
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === items.length - 1;
  }

  // ─── Événements ──────────────────────────────────────────────
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.galerie-item');
    if (!item) return;
    collectItems();
    open(items.indexOf(item));
  });

  btnClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  btnPrev.addEventListener('click', () => { if (current > 0) { current--; update(); } });
  btnNext.addEventListener('click', () => { if (current < items.length - 1) { current++; update(); } });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft'  && current > 0)              { current--; update(); }
    if (e.key === 'ArrowRight' && current < items.length - 1) { current++; update(); }
  });

  // Swipe mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) {
      if (delta < 0 && current < items.length - 1) { current++; update(); }
      if (delta > 0 && current > 0)                { current--; update(); }
    }
  }, { passive: true });

})();