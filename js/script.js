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
const currentPage = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html');
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = decodeURIComponent(link.getAttribute('href'));
  if (href === currentPage) link.classList.add('active');
});

// ===== SCROLL REVEAL =====
document.querySelectorAll('.reveal').forEach(el => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
  observer.observe(el);
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