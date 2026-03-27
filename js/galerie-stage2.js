/* ── Lightbox ───────────────────────────────────────────────────────── */
(function () {
  const cards    = Array.from(document.querySelectorAll('.gallery-card'));
  const backdrop = document.getElementById('lb-backdrop');
  const lb       = document.getElementById('lb');
  const img      = document.getElementById('lb-img');
  const caption  = document.getElementById('lb-caption');
  const counter  = document.getElementById('lb-counter');
  const closeBtn = document.getElementById('lb-close');
  const prevBtn  = document.getElementById('lb-prev');
  const nextBtn  = document.getElementById('lb-next');

  // Filtrer les cartes qui ont une image valide (non placeholder)
  const validCards = cards.filter(c => !c.classList.contains('placeholder-card'));
  let current = 0;

  function open(index) {
    current = index;
    load(current);
    backdrop.classList.add('active');
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    backdrop.classList.remove('active');
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  function load(index) {
    const card = validCards[index];
    img.src        = card.dataset.src;
    img.alt        = card.dataset.caption || '';
    caption.textContent = card.dataset.caption || '';
    counter.textContent = `${index + 1} / ${validCards.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === validCards.length - 1;
  }

  cards.forEach((card) => {
    if (card.classList.contains('placeholder-card')) return;
    card.addEventListener('click', () => {
      const idx = validCards.indexOf(card);
      if (idx !== -1) open(idx);
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  prevBtn.addEventListener('click', () => { if (current > 0) { current--; load(current); } });
  nextBtn.addEventListener('click', () => { if (current < validCards.length - 1) { current++; load(current); } });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'ArrowLeft'  && current > 0)                    { current--; load(current); }
    if (e.key === 'ArrowRight' && current < validCards.length - 1) { current++; load(current); }
    if (e.key === 'Escape') close();
  });
})();