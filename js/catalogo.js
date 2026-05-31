/* Renderizado de productos, filtros y detalle del producto */

const API = {
  // Cargar catalogo segun la pagina
  initCatalog() {
    const container = document.getElementById('products-container');
    if (!container) return;
    const isHome = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    
    if (isHome) {
      this.render(MOCK_DATA, container, 4);
    } else {
      this.render(MOCK_DATA, container, MOCK_DATA.length);
      this.bindFilters(container);
    }
  },

  // Logica de los filtros laterales
  bindFilters(container) {
    const catCheckboxes = document.querySelectorAll('.cat-filter');
    const priceRadios = document.querySelectorAll('.price-filter');
    if (catCheckboxes.length === 0 && priceRadios.length === 0) return;

    const applyFilters = () => {
      // Categorias marcadas
      const selectedCats = Array.from(catCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      // Rango de precio
      const selectedPriceRange = Array.from(priceRadios).find(r => r.checked)?.value || 'all';

      // Filtrado de la lista
      const filtered = MOCK_DATA.filter(p => {
        const matchCat = selectedCats.length === 0 || selectedCats.includes(p.category);

        let matchPrice = true;
        if (selectedPriceRange === 'under50') {
          matchPrice = p.price < 50;
        } else if (selectedPriceRange === '50to100') {
          matchPrice = p.price >= 50 && p.price <= 100;
        } else if (selectedPriceRange === 'over100') {
          matchPrice = p.price > 100;
        }

        return matchCat && matchPrice;
      });

      // Dibujar productos filtrados
      this.render(filtered, container, filtered.length);
    };

    // Escuchar cambios en los inputs
    catCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
    priceRadios.forEach(radio => radio.addEventListener('change', applyFilters));
  },

  // Obtener producto por la ID de la URL
  initProductDetail() {
    const container = document.getElementById('single-product-container');
    if (!container) return;
    const id = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
    const product = MOCK_DATA.find(p => p.id === id) || MOCK_DATA[0];
    this.renderDetail(product, container);
  },

  // Pintar las tarjetas de producto en el grid
  render(data, container, limit) {
    container.innerHTML = data.slice(0, limit).map(p => `
      <article class="product-card animate" data-id="${p.id}">
        <div class="product-card__media">
          ${p.badge ? `<span class="product-card__badge badge--${p.badge.type}">${p.badge.text}</span>` : ''}
          <img src="${p.image}" alt="${p.title}" loading="lazy" class="product-card__img">
        </div>
        <div class="product-card__content">
          <p class="product-card__meta">${p.category}</p>
          <h3 class="product-card__title"><a href="detalle.html?id=${p.id}">${p.title}</a></h3>
          <div class="product-card__rating">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffa41c" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span class="count">${p.rating} (${p.reviews.toLocaleString()})</span>
          </div>
          <div class="product-card__price-row" style="margin-bottom:10px;">
            <span class="price-current">${p.price.toFixed(2).replace('.', ',')}€</span>
            ${p.oldPrice ? `<span class="price-old">${p.oldPrice.toFixed(2).replace('.', ',')}€</span>` : ''}
          </div>
          <button class="btn btn-cart" style="width:100%; padding:8px; font-size:0.85rem;" onclick="Cart.add(${p.id})">Añadir a cesta</button>
        </div>
      </article>
    `).join('');
    UI.observe();
  },

  // Pintar la ficha de detalle
  renderDetail(p, container) {
    const bc = document.getElementById('breadcrumb-title');
    if (bc) bc.textContent = p.title;
    container.innerHTML = `
      <div class="detail-grid">
        <div class="detail-gallery animate"><img src="${p.image}" alt="${p.title}"></div>
        <div class="detail-info animate">
          ${p.badge ? `<span style="display:inline-block;background:${p.badge.type === 'new' ? '#067d62' : '#cc0c39'};color:#fff;padding:3px 10px;border-radius:4px;font-size:.8rem;font-weight:700;margin-bottom:.8rem;">${p.badge.text}</span>` : ''}
          <h1>${p.title}</h1>
          <div class="detail-rating">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffa41c" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>${p.rating} &middot; ${p.reviews.toLocaleString()} valoraciones</span>
          </div>
          <div class="detail-pricebox">
            <span class="price-current" style="font-size:2.2rem;">${p.price.toFixed(2).replace('.', ',')}€</span>
            ${p.oldPrice ? `<span class="price-old">${p.oldPrice.toFixed(2).replace('.', ',')}€</span>` : ''}
          </div>
          <p class="detail-desc">${p.desc}</p>
          <div class="detail-actions">
            <button class="btn btn-cart" onclick="Cart.add(${p.id})">Añadir a la cesta</button>
            <button class="btn btn-primary btn-block" onclick="Cart.add(${p.id}); window.location.href='carrito.html'">Comprar ahora</button>
          </div>
        </div>
      </div>`;
    UI.observe();
  }
};
