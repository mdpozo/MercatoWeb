/* Logica del carrusel, contador de ofertas, formulario de contacto, buscador y tema oscuro */

/* Carrusel de la pagina de inicio */
const Carousel = {
  init() {
    this.track = document.getElementById('sliderTrack');
    if (!this.track) return;
    this.isAnimating = false;
    this.gap = 20;
    document.querySelector('.next-btn')?.addEventListener('click', () => this.moveNext());
    document.querySelector('.prev-btn')?.addEventListener('click', () => this.movePrev());
  },

  // Siguiente tarjeta
  moveNext() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const firstCard = this.track.firstElementChild;
    const dist = firstCard.offsetWidth + this.gap;
    this.track.style.transition = 'transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)';
    this.track.style.transform = `translateX(-${dist}px)`;
    setTimeout(() => {
      this.track.style.transition = 'none';
      this.track.style.transform = 'translateX(0)';
      this.track.appendChild(firstCard);
      this.isAnimating = false;
    }, 290);
  },

  // Tarjeta anterior
  movePrev() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const lastCard = this.track.lastElementChild;
    const dist = lastCard.offsetWidth + this.gap;
    this.track.prepend(lastCard);
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${dist}px)`;
    void this.track.offsetWidth;
    this.track.style.transition = 'transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)';
    this.track.style.transform = 'translateX(0)';
    setTimeout(() => { this.isAnimating = false; }, 290);
  }
};

/* Reloj de Ofertas Flash */
const FlashTimer = {
  init() {
    const timerElement = document.getElementById('flash-countdown');
    if (!timerElement) return;

    // Empezar cuenta atras en 4h 22m 15s
    let totalSeconds = (4 * 3600) + (22 * 60) + 15;

    setInterval(() => {
      if (totalSeconds <= 0) return;
      totalSeconds--;
      
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      
      timerElement.textContent = 
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
  }
};

/* Formulario de contacto */
const ContactForm = {
  init() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('input[required], textarea[required]').forEach(f => {
        if (!f.value.trim()) {
          f.style.borderColor = '#cc0c39';
          valid = false;
        } else {
          f.style.borderColor = '';
        }
      });
      if (valid) {
        UI.notify('¡Mensaje enviado! Te contactaremos pronto.', 'success');
        form.reset();
      } else {
        UI.notify('Completa todos los campos obligatorios.', 'error');
      }
    });
  }
};

/* Buscador en la cabecera */
const SearchEngine = {
  init() {
    const searchInput = document.querySelector('.search-box input');
    const searchBox = document.querySelector('.search-box');
    if (!searchInput || !searchBox) return;

    const suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions';
    searchBox.appendChild(suggestions);

    searchInput.addEventListener('input', () => this.handleSearch(searchInput.value, suggestions));
    searchInput.addEventListener('focus', () => this.handleSearch(searchInput.value, suggestions));

    document.addEventListener('click', (e) => {
      if (!searchBox.contains(e.target)) {
        suggestions.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') suggestions.classList.remove('active');
    });
  },

  handleSearch(query, container) {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      container.classList.remove('active');
      return;
    }

    const matches = MOCK_DATA.filter(p => 
      p.title.toLowerCase().includes(cleanQuery) || 
      p.category.toLowerCase().includes(cleanQuery)
    );

    if (matches.length === 0) {
      container.innerHTML = `<div class="suggestion-no-results">No se encontraron productos</div>`;
      container.classList.add('active');
      return;
    }

    container.innerHTML = matches.map(p => `
      <a href="detalle.html?id=${p.id}" class="suggestion-item">
        <img src="${p.image}" alt="${p.title}">
        <div class="suggestion-info">
          <span class="suggestion-title">${p.title}</span>
          <span class="suggestion-category">${p.category}</span>
        </div>
        <span class="suggestion-price">${p.price.toFixed(2).replace('.', ',')}€</span>
      </a>
    `).join('');
    container.classList.add('active');
  }
};

/* Switch del modo oscuro */
const Theme = {
  init() {
    const savedTheme = localStorage.getItem('mercato_theme');
    const isDark = savedTheme === 'dark';

    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const wrapper = document.createElement('label');
    wrapper.className = 'ui-switch';
    wrapper.setAttribute('aria-label', 'Alternar modo oscuro');
    wrapper.innerHTML = `
      <input type="checkbox" id="theme-checkbox" ${isDark ? 'checked' : ''}>
      <div class="slider">
        <div class="circle"></div>
      </div>
    `;
    
    navLinks.appendChild(wrapper);

    const checkbox = wrapper.querySelector('input');
    checkbox.addEventListener('change', () => {
      const active = checkbox.checked;
      document.body.classList.toggle('dark-mode', active);
      localStorage.setItem('mercato_theme', active ? 'dark' : 'light');
      UI.notify(active ? 'Modo Oscuro activado 🌙' : 'Modo Claro activado ☀️', 'success');
    });
  }
};
