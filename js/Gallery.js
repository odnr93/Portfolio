/**
 * gallery.js — Galerie & Lightbox pour la page Stage
 * Odnerson ORIENTALE — Portfolio BTS SIO SLAM
 */

(function () {
  'use strict';

  // ─── Sélecteurs ──────────────────────────────────────────────────────────────
  const lightbox         = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxImg      = document.getElementById('lightbox-img');
  const lightboxCaption  = document.getElementById('lightbox-caption');
  const lightboxCounter  = document.getElementById('lightbox-counter');
  const btnClose         = document.getElementById('lightbox-close');
  const btnPrev          = document.getElementById('lightbox-prev');
  const btnNext          = document.getElementById('lightbox-next');

  // ─── État ────────────────────────────────────────────────────────────────────
  let currentGallery = [];  // liste des items de la galerie active
  let currentIndex   = 0;

  // ─── Collecte des items d'une galerie ────────────────────────────────────────
  function getGalleryItems(galleryId) {
    return Array.from(
      document.querySelectorAll(`.gallery-item:not(.placeholder)[data-gallery="${galleryId}"]`)
    );
  }

  // ─── Ouvrir le lightbox ───────────────────────────────────────────────────────
  function openLightbox(items, index) {
    if (!items.length) return;
    currentGallery = items;
    currentIndex   = index;
    updateLightbox();
    lightbox.classList.add('active');
    lightboxBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ─── Fermer le lightbox ───────────────────────────────────────────────────────
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    // Petite pause avant de vider l'image (évite le flash)
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxImg.alt = '';
      lightboxCaption.textContent = '';
      lightboxCounter.textContent = '';
    }, 300);
  }

  // ─── Mettre à jour l'image affichée ──────────────────────────────────────────
  function updateLightbox() {
    const item = currentGallery[currentIndex];
    const img  = item.querySelector('img');

    // Transition douce
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src         = img.src;
      lightboxImg.alt         = img.alt;
      lightboxCaption.textContent = img.alt;
      lightboxImg.style.opacity = '1';
    }, 150);

    // Compteur
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;

    // Boutons nav
    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === currentGallery.length - 1;
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────
  function navigate(direction) {
    const next = currentIndex + direction;
    if (next >= 0 && next < currentGallery.length) {
      currentIndex = next;
      updateLightbox();
    }
  }

  // ─── Transition CSS sur l'image ──────────────────────────────────────────────
  lightboxImg.style.transition = 'opacity 0.15s ease';

  // ─── Écouteurs d'événements ──────────────────────────────────────────────────

  // Clic sur les items de galerie
  document.addEventListener('click', function (e) {
    const item = e.target.closest('.gallery-item:not(.placeholder)');
    if (!item) return;

    const galleryId = item.dataset.gallery;
    const index     = parseInt(item.dataset.index, 10);
    const items     = getGalleryItems(galleryId);

    openLightbox(items, index);
  });

  // Fermer
  btnClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  // Navigation
  btnPrev.addEventListener('click', () => navigate(-1));
  btnNext.addEventListener('click', () => navigate(1));

  // Clavier
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });

  // Swipe tactile (mobile)
  let touchStartX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(deltaX) > 50) navigate(deltaX < 0 ? 1 : -1);
  }, { passive: true });

})();