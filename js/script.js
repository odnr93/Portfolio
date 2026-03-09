// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 50
      ? 'rgba(13,13,13,0.98)'
      : 'rgba(13,13,13,0.9)';
  });
}

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ===== ACTIVE NAV LINK (based on current page) =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) link.classList.add('active');
});

// ===== SCROLL REVEAL =====
document.querySelectorAll('.reveal').forEach(el => {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }).observe(el);
});

// ===== PDF MODAL (using PDF.js) =====
let pdfDocs = {};
let currentPages = {};

async function openModal(modalId, pdfDataUri) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (!pdfDocs[modalId]) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    pdfDocs[modalId] = await pdfjsLib.getDocument(pdfDataUri).promise;
    currentPages[modalId] = 1;
  }
  renderPage(modalId);
}

async function renderPage(modalId) {
  const doc = pdfDocs[modalId];
  const pageNum = currentPages[modalId];
  const container = document.getElementById(modalId + '-canvas-container');
  const pageInfo = document.getElementById(modalId + '-pageinfo');
  if (!doc || !container) return;

  container.innerHTML = '';
  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement('canvas');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  container.appendChild(canvas);
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  if (pageInfo) pageInfo.textContent = `Page ${pageNum} / ${doc.numPages}`;
}

function prevPage(modalId) {
  if (currentPages[modalId] > 1) { currentPages[modalId]--; renderPage(modalId); }
}
function nextPage(modalId) {
  const doc = pdfDocs[modalId];
  if (doc && currentPages[modalId] < doc.numPages) { currentPages[modalId]++; renderPage(modalId); }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active'); document.body.style.overflow = '';
    });
  }
});

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const notice = document.getElementById('form-notice');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.innerHTML = '<span>Envoi en cours...</span> <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    try {
      const res = await fetch(form.action, { method:'POST', body: new FormData(form), headers:{'Accept':'application/json'} });
      if (res.ok) {
        notice.textContent = '✅ Message envoyé ! Je vous répondrai rapidement.';
        notice.style.color = '#4caf50';
        form.reset();
      } else throw new Error();
    } catch {
      notice.textContent = "❌ Erreur lors de l'envoi. Contactez-moi directement par email.";
      notice.style.color = '#f44336';
    }
    btn.innerHTML = '<span>Envoyer le message</span> <i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
  });
}