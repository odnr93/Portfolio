/* =============================================
   MODAL-GALLERY.JS — Galerie modale 2ème année
   ============================================= */

(function () {
  const modal       = document.getElementById('modal-gallery-2');
  const backdrop    = document.getElementById('modal-gallery-backdrop');
  const closeBtn    = document.getElementById('modal-gallery-close');
  const mainImg     = document.getElementById('modal-main-img');
  const caption     = document.getElementById('modal-caption');
  const counter     = document.getElementById('modal-counter');
  const thumbs      = document.querySelectorAll('.modal-thumb');
  const prevBtn     = document.getElementById('modal-prev');
  const nextBtn     = document.getElementById('modal-next');

  // ── Bouton déclencheur ──────────────────────────────────────────────────
  // On cible le bouton par son id OU par la classe btn-gallery-open
  const openBtn = document.getElementById('btn-gallery-open-2')
                || document.querySelector('.btn-gallery-open');

  if (!modal || !openBtn) return; // sécurité si éléments absents

  let currentIndex = 0;
  const total = thumbs.length;

  // ── Ouvrir ──────────────────────────────────────────────────────────────
  function openModal(index = 0) {
    currentIndex = index;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadImage(currentIndex);
    updateThumbs();
  }

  // ── Fermer ──────────────────────────────────────────────────────────────
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ── Charger une image ────────────────────────────────────────────────────
  function loadImage(index) {
    const thumb = thumbs[index];
    if (!thumb) return;
    const src  = thumb.dataset.src;
    const cap  = thumb.dataset.caption || '';
    mainImg.src = src;
    mainImg.alt = cap;
    caption.textContent = cap;
    counter.textContent = `${index + 1} / ${total}`;
    updateNavButtons();
  }

  // ── Mettre à jour les miniatures ─────────────────────────────────────────
  function updateThumbs() {
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === currentIndex);
    });
  }

  // ── Activer / désactiver les flèches ─────────────────────────────────────
  function updateNavButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === total - 1;
    updateThumbs();
  }

  // ── Événements ───────────────────────────────────────────────────────────
  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openModal(0);
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; loadImage(currentIndex); updateThumbs(); }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < total - 1) { currentIndex++; loadImage(currentIndex); updateThumbs(); }
  });

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      currentIndex = i;
      loadImage(currentIndex);
      updateThumbs();
    });
  });

  // ── Clavier ──────────────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft'  && currentIndex > 0)          { currentIndex--; loadImage(currentIndex); updateThumbs(); }
    if (e.key === 'ArrowRight' && currentIndex < total - 1)  { currentIndex++; loadImage(currentIndex); updateThumbs(); }
    if (e.key === 'Escape')                                   { closeModal(); }
  });

})();