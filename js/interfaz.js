/* Control del menu movil, animaciones y notificaciones */

const UI = {
  // Inicializacion de las funciones de UI
  init() {
    this.initMobileNav();
    this.observe();
    document.querySelectorAll('a.cart-btn').forEach(btn => {
      if (!btn.href || btn.getAttribute('href') === '#') btn.href = 'carrito.html';
    });
  },

  // Logica para el menu hamburguesa movil
  initMobileNav() {
    const burger = document.querySelector('.nav-hamburger');
    const nav = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    if (!burger || !nav) return;

    const toggle = () => {
      const open = nav.classList.toggle('active');
      burger.classList.toggle('active');
      overlay?.classList.toggle('active');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', toggle);
    overlay?.addEventListener('click', toggle);
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (nav.classList.contains('active')) toggle();
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('active')) toggle();
    });
  },

  // Animaciones al hacer scroll usando IntersectionObserver
  observe() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate').forEach(el => obs.observe(el));
  },

  // Alertas toast flotantes
  notify(msg, type = 'success') {
    document.querySelector('.mercato-toast')?.remove();
    const t = document.createElement('div');
    t.className = 'mercato-toast';
    t.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;background:${type === 'success' ? '#131a22' : '#cc0c39'};color:#fff;padding:1rem 1.5rem;border-radius:10px;display:flex;align-items:center;gap:10px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.35);font-size:.95rem;font-weight:500;max-width:380px;`;
    t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span>${msg}`;
    document.body.appendChild(t);
    
    setTimeout(() => {
      t.style.transition = '.3s';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3500);
  }
};
