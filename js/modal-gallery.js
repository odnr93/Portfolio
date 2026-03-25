/**
 * modal-gallery.js — Modale galerie captures 2ème année
 * Odnerson ORIENTALE — Portfolio BTS SIO SLAM
 */

(function () {
  'use strict';

  const modal      = document.getElementById('modal-gallery-2');
  const backdrop   = document.getElementById('modal-gallery-backdrop');
  const btnOpen    = document.getElementById('btn-open-gallery-2');
  const btnClose   = document.getElementById('modal-gallery-close');
  const btnPrev    = document.getElementById('modal-prev');
  const btnNext    = document.getElementById('modal-next');
  const mainImg    = document.getElementById('modal-main-img');
  const caption    = document.getElementById('modal-caption');
  const counter    = document.getElementById('modal-counter');
  const thumbsWrap = document.getElementById('modal-thumbs');
  const thumbs     = Array.from(thumbsWrap.querySelectorAll('.modal-thumb'));

  let current = 0;

  mainImg.style.transition = 'opacity 0.12s ease';

  // ─── Afficher une image par index ────────────────────────────────────────────
  function show(index) {
    current = Math.max(0, Math.min(index, thumbs.length - 1));
    const t = thumbs[current];

    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = t.dataset.src;
      mainImg.alt = t.querySelector('img').alt;
      mainImg.style.opacity = '1';
    }, 120);

    caption.textContent  = t.dataset.caption || '';
    counter.textContent  = (current + 1) + ' / ' + thumbs.length;

    thumbs.forEach((el, i) => el.classList.toggle('active', i === current));
    t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });

    btnPrev.disabled = current === 0;
    btnNext.disabled = current === thumbs.length - 1;
  }

  // ─── Ouvrir / Fermer ─────────────────────────────────────────────────────────
  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    show(0);
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ─── Événements ──────────────────────────────────────────────────────────────
  btnOpen.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));

  thumbs.forEach((t, i) => t.addEventListener('click', () => show(i)));

  // Clavier
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Swipe mobile
  let touchStartX = 0;
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 50) show(delta < 0 ? current + 1 : current - 1);
  }, { passive: true });

})();