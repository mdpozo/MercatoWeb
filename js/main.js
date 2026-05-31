/* =========================================================================
   MERCATO - Motor principal v2.3
   -------------------------------------------------------------------------
   Este archivo controla TODA la lógica JavaScript del sitio:
   - Inicialización de módulos al cargar la página
   - Gestión del carrito de compra (con persistencia en localStorage)
   - Renderizado dinámico de productos desde datos simulados
   - Carrusel de ofertas con animación fluida
   - Menú móvil, animaciones de scroll y notificaciones toast
   - Formulario de contacto con validación
   ========================================================================= */

/* =========================================================================
   PRE-INICIALIZACIÓN DEL TEMA (Evita FOUC / Parpadeo blanco)
   Comprueba el almacenamiento local de inmediato cuando se carga el script 
   para activar el modo oscuro antes de que el navegador dibuje la pantalla.
   ========================================================================= */
if (localStorage.getItem('mercato_theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

/* -------------------------------------------------------------------------
   PUNTO DE ENTRADA: se ejecuta cuando el DOM está completamente cargado.
   Inicializa todos los módulos en orden correcto.
   ------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  UI.init();              // Menú hamburguesa + animaciones de scroll
  Cart.updateBadge();    // Muestra el contador de artículos en el icono del carrito
  Carousel.init();       // Activa el slider de ofertas de la home
  API.initCatalog();     // Renderiza las tarjetas de producto en home/catálogo
  API.initProductDetail(); // Renderiza el detalle de producto (detalle.html)
  CartPage.init();       // Renderiza el contenido de la página del carrito
  ContactForm.init();    // Activa la validación del formulario de contacto
  FlashTimer.init();     // Activa el temporizador de ofertas flash
  Auth.init();           // Gestiona la sesión y actualiza la cabecera
  SearchEngine.init();   // Activa el buscador dinámico en tiempo real
  Theme.init();          // Activa y añade el botón del gestor de temas
  Orders.init();         // Activa la gestión y búsqueda dinámica de pedidos
});

/* =========================================================================
   MOCK_DATA — Base de datos simulada de productos
   -------------------------------------------------------------------------
   Array de objetos que representa el catálogo. Cada producto tiene:
     - id        → Identificador único (usado en URLs: detalle.html?id=1)
     - title     → Nombre del producto
     - category  → Categoría (Tecnología, Moda, Accesorios...)
     - price     → Precio actual en euros
     - oldPrice  → Precio anterior (null si no hay descuento)
     - reviews   → Número de valoraciones
     - rating    → Puntuación media (0-5)
     - image     → URL de la imagen (Unsplash)
     - badge     → Etiqueta visual { text, type: 'discount'|'new' } o null
     - desc      → Descripción corta del producto
   ========================================================================= */
const MOCK_DATA = [
  { id: 1, title: "Auriculares Pro Wireless v2", category: "Tecnología", price: 89.99, oldPrice: 109.99, reviews: 1420, rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", badge: { text: "Oferta", type: "discount" }, desc: "Experimenta un sonido superior con cancelación de ruido activa, Bluetooth 5.3 y 40h de batería." },
  { id: 2, title: "SmartWatch Ultra 49mm", category: "Tecnología", price: 249.00, oldPrice: null, reviews: 850, rating: 5.0, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", badge: null, desc: "Pantalla retina siempre activa, resistencia al agua 50m y seguimiento de salud avanzado." },
  { id: 3, title: "Zapatillas Urban Flow", category: "Moda", price: 115.50, oldPrice: null, reviews: 210, rating: 4.2, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", badge: { text: "Nuevo", type: "new" }, desc: "Diseño ergonómico para el día a día con materiales transpirables y suela antideslizante." },
  { id: 4, title: "Mochila Explorer Pro", category: "Accesorios", price: 65.00, oldPrice: 75.00, reviews: 95, rating: 4.5, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", badge: { text: "-15%", type: "discount" }, desc: "Capacidad de 30L, compartimento acolchado para portátil de 15' y múltiples bolsillos." },
  { id: 5, title: "Cafetera Espresso Italiana", category: "Hogar", price: 45.99, oldPrice: 59.99, reviews: 340, rating: 4.6, image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80", badge: { text: "Top Ventas", type: "new" }, desc: "Prepara café espresso tradicional de la mejor calidad. Cuerpo de aluminio resistente y mango ergonómico." },
  { id: 6, title: "Lámpara de Escritorio LED", category: "Hogar", price: 24.99, oldPrice: null, reviews: 180, rating: 4.4, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80", badge: null, desc: "Iluminación LED sin parpadeos, brazo articulado ajustable y 3 modos de temperatura con control táctil." },
  { id: 7, title: "Ratón Gaming RGB 16000 DPI", category: "Gaming", price: 39.00, oldPrice: 49.00, reviews: 620, rating: 4.7, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80", badge: { text: "Descuento", type: "discount" }, desc: "Sensor óptico de alta precisión, iluminación RGB programable y 7 botones configurables." },
  { id: 8, title: "Teclado Mecánico Pro", category: "Gaming", price: 99.99, oldPrice: 119.99, reviews: 540, rating: 4.9, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80", badge: null, desc: "Switches mecánicos táctiles, retroiluminación RGB individual por tecla y reposamuñecas extraíble." },
  { id: 9, title: "Sudadera Classic Sport", category: "Moda", price: 34.99, oldPrice: null, reviews: 110, rating: 4.3, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", badge: null, desc: "Sudadera con capucha unisex de algodón suave, ideal para actividades al aire libre o confort casual." }
];

/* =========================================================================
   CART — Módulo de gestión del carrito de compra
   -------------------------------------------------------------------------
   Persiste los artículos del carrito en localStorage bajo la clave
   'mercato_cart'. El formato almacenado es un array de objetos:
   [{ id, title, category, price, image, qty }, ...]
   ========================================================================= */
const Cart = {
  // Clave bajo la que se guarda el carrito en localStorage
  KEY: 'mercato_cart',

  /* Devuelve el array de artículos del carrito.
     Si no existe o hay un error de parseo, devuelve array vacío. */
  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  /* Guarda el array de artículos en localStorage y actualiza el badge. */
  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge(); // Refresca el contador visual del header
  },

  /* Añade un producto al carrito.
     - Si ya existe, incrementa la cantidad.
     - Si es nuevo, lo añade con los datos mínimos necesarios.
     - Muestra una notificación toast de confirmación. */
  add(productId, qty = 1) {
    const product = MOCK_DATA.find(p => p.id === productId);
    if (!product) return; // Producto no encontrado, no hace nada
    const items = this.get();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty; // Ya estaba → suma cantidad
    } else {
      // Nuevo artículo → solo guardamos los campos necesarios (no toda la info)
      items.push({ id: product.id, title: product.title, category: product.category, price: product.price, image: product.image, qty });
    }
    this.save(items);
    UI.notify(`"${product.title}" añadido a la cesta`, 'success');
  },

  /* Elimina completamente un artículo del carrito por su ID. */
  remove(productId) {
    this.save(this.get().filter(i => i.id !== productId));
  },

  /* Actualiza la cantidad de un artículo. Mínimo siempre 1. */
  updateQty(productId, newQty) {
    const items = this.get();
    const item = items.find(i => i.id === productId);
    if (item) { item.qty = Math.max(1, newQty); this.save(items); }
  },

  /* Calcula el precio total del carrito (suma precio × cantidad de cada artículo). */
  total() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },

  /* Calcula el número total de artículos (sumando cantidades). */
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },

  /* Actualiza el badge numérico del icono de cesta en el header.
     Si hay 0 artículos, oculta el badge (display:none).
     Adicionalmente dispara una micro-animación de escala ("pop") para feedback visual de usuario. */
  updateBadge() {
    const badge = document.querySelector('.cart-badge');
    const n = this.count();
    if (badge) {
      badge.textContent = n;
      badge.style.display = n > 0 ? 'inline-flex' : 'none';
      
      // Reinicia y dispara la animación CSS "badge-pop"
      badge.classList.remove('badge-pop');
      void badge.offsetWidth; // truco de renderizado: fuerza el reflow del elemento en el navegador
      badge.classList.add('badge-pop');
    }
  }
};

/* =========================================================================
   API — Módulo de renderizado de productos
   -------------------------------------------------------------------------
   Simula una capa de API que inyecta productos en el DOM usando MOCK_DATA.
   En un proyecto real, aquí harías fetch() a un servidor real.
   ========================================================================= */
const API = {

  /* Detecta si estamos en la home o en el catálogo y renderiza los productos.
     - Home (index.html): muestra solo los primeros 4 productos
     - Catálogo (productos.html): muestra todos los productos y activa filtros en tiempo real. */
  initCatalog() {
    const container = document.getElementById('products-container');
    if (!container) return; // Si no hay contenedor, no hacer nada (otra página)
    const isHome = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/');
    
    if (isHome) {
      this.render(MOCK_DATA, container, 4);
    } else {
      // Catálogo completo: renderiza todos los elementos y activa los listeners de filtrado
      this.render(MOCK_DATA, container, MOCK_DATA.length);
      this.bindFilters(container);
    }
  },

  /* Bindea y gestiona los filtros dinámicos en la barra lateral del catálogo.
     ¿CÓMO FUNCIONA?
     - Escucha cambios (`change`) en todos los inputs de categoría (`.cat-filter`) y radio de precio (`.price-filter`).
     - Al cambiar cualquier control, evalúa el estado del DOM:
       1. Filtra por categorías activas (si no hay ninguna marcada, asume "todas").
       2. Filtra por el rango de precio seleccionado.
     - Actualiza instantáneamente la rejilla de productos invocando `.render()`.
     
     ¿POR QUÉ SE HIZO ASÍ?
     - Proporciona una experiencia de "Single Page App" sin recargas de página lentas y molestas, 
       lo que emula perfectamente la experiencia de compra ágil de las tiendas web premium. */
  bindFilters(container) {
    const catCheckboxes = document.querySelectorAll('.cat-filter');
    const priceRadios = document.querySelectorAll('.price-filter');
    if (catCheckboxes.length === 0 && priceRadios.length === 0) return;

    const applyFilters = () => {
      // 1. Obtener categorías seleccionadas
      const selectedCats = Array.from(catCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      // 2. Obtener rango de precio seleccionado
      const selectedPriceRange = Array.from(priceRadios).find(r => r.checked)?.value || 'all';

      // 3. Filtrar los productos
      const filtered = MOCK_DATA.filter(p => {
        // Filtro de Categoría: coincide si no hay ninguna marcada, o si la categoría del producto está en el array
        const matchCat = selectedCats.length === 0 || selectedCats.includes(p.category);

        // Filtro de Precio
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

      // 4. Re-renderizar productos en el grid con animación de aparición
      this.render(filtered, container, filtered.length);
    };

    // Añadir escuchadores a todos los elementos del DOM de filtros
    catCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
    priceRadios.forEach(radio => radio.addEventListener('change', applyFilters));
  },

  /* Lee el parámetro ?id= de la URL para cargar el producto correcto.
     Si no hay id o no se encuentra, usa el primer producto como fallback. */
  initProductDetail() {
    const container = document.getElementById('single-product-container');
    if (!container) return; // Solo activo en detalle.html
    const id = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
    const product = MOCK_DATA.find(p => p.id === id) || MOCK_DATA[0];
    this.renderDetail(product, container);
  },

  /* Genera y vuelca las tarjetas de producto en el contenedor dado.
     Usa template literals para construir el HTML de cada tarjeta.
     Al final llama a UI.observe() para activar las animaciones de aparición. */
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
    UI.observe(); // Activa IntersectionObserver sobre los nuevos elementos
  },

  /* Renderiza la vista de detalle completa de un producto.
     Actualiza también el breadcrumb de navegación con el nombre del producto.
     Los botones de compra llaman directamente a Cart.add() */
  renderDetail(p, container) {
    const bc = document.getElementById('breadcrumb-title');
    if (bc) bc.textContent = p.title; // Breadcrumb: Inicio > Catálogo > [nombre]
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

/* =========================================================================
   CartPage — Módulo de renderizado de la página carrito.html
   -------------------------------------------------------------------------
   Solo se activa si existe el elemento #cart-container en la página.
   Lee los datos del carrito desde Cart.get() y los pinta en el DOM.
   ========================================================================= */
const CartPage = {

  /* Punto de entrada: busca el contenedor y lanza el renderizado. */
  init() {
    const container = document.getElementById('cart-container');
    if (!container) return; // No estamos en carrito.html, salir
    this.container = container;
    this.render();
  },

  /* Renderiza el contenido completo del carrito:
     - Si está vacío: muestra mensaje y CTA al catálogo
     - Si tiene artículos: pinta cada item + panel de resumen con totales */
  render() {
    const items = Cart.get();

    // --- CESTA VACÍA ---
    if (items.length === 0) {
      this.container.innerHTML = `
        <div class="cart-empty">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h2>Tu cesta está vacía</h2>
          <p>Explora nuestro catálogo y añade productos que te gusten.</p>
          <a href="productos.html" class="btn btn-primary">Ir al catálogo</a>
        </div>`;
      const layout = document.querySelector('.cart-layout');
      if (layout) layout.classList.add('is-empty');
      return;
    }

    // --- ARTÍCULOS EN EL CARRITO ---
    const layout = document.querySelector('.cart-layout');
    if (layout) layout.classList.remove('is-empty');
    
    this.container.innerHTML = `
      <div class="cart-items-panel">
        <h1 style="font-size:1.6rem;margin-bottom:1.2rem;padding-bottom:1rem;border-bottom:1px solid var(--border);">
          Tu Cesta de la Compra
        </h1>
        ${items.map(item => `
          <div class="cart-item" id="cart-item-${item.id}">
            <img class="cart-item__img" src="${item.image}" alt="${item.title}">
            <div class="cart-item__info">
              <p class="cart-item__category">${item.category}</p>
              <h3>${item.title}</h3>
              <!-- Controles de cantidad: llaman a changeQty con delta +1 o -1 -->
              <div class="cart-item__qty">
                <button class="qty-btn" onclick="CartPage.changeQty(${item.id}, -1)">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="CartPage.changeQty(${item.id}, 1)">+</button>
              </div>
              <button class="cart-item__remove" onclick="CartPage.remove(${item.id})">Eliminar</button>
            </div>
            <!-- Precio total de esta línea = precio unitario × cantidad -->
            <span class="cart-item__price">${(item.price * item.qty).toFixed(2).replace('.', ',')}€</span>
          </div>
        `).join('')}
      </div>`;

    // --- PANEL DE RESUMEN DEL PEDIDO ---
    const subtotal = Cart.total();
    const envio = subtotal >= 50 ? 0 : 3.99; // Envío gratuito a partir de 50€
    const total = subtotal + envio;
    const panel = document.getElementById('cart-summary-panel');
    if (panel) panel.innerHTML = `
      <div class="cart-summary">
        <h2>Resumen del pedido</h2>
        <div class="summary-row">
          <span>Subtotal (${Cart.count()} artículo${Cart.count() > 1 ? 's' : ''})</span>
          <span>${subtotal.toFixed(2).replace('.', ',')}€</span>
        </div>
        <div class="summary-row">
          <span>Envío</span>
          <span>${envio === 0 ? '<span style="color:#067d62;font-weight:700;">GRATIS</span>' : envio.toFixed(2) + '€'}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2).replace('.', ',')}€</span>
        </div>
        ${subtotal < 50 ? `<p style="font-size:.8rem;color:var(--text-muted);margin-top:.5rem;">Añade ${(50 - subtotal).toFixed(2).replace('.', ',')}€ más para envío gratuito</p>` : ''}
        <button class="checkout-btn" onclick="CartPage.checkout()">Tramitar pedido →</button>
        <a href="productos.html" style="display:block;text-align:center;margin-top:1rem;font-size:.9rem;color:var(--link);">← Seguir comprando</a>
      </div>`;
  },

  /* Simula el paso final de pago con el Overlay animado estilo UIverse.
     - Guarda los artículos de la cesta como nuevos pedidos en localStorage.
     - Limpia el carrito.
     - Lanza una animación de checkmark y barra de progreso.
     - Redirige automáticamente a la página de pedidos tras finalizar. */
  checkout() {
    const items = Cart.get();
    if (items.length === 0) return;

    // 1. Crear el overlay modal dinámico de UIverse
    const overlay = document.createElement('div');
    overlay.className = 'checkout-overlay';
    overlay.innerHTML = `
      <div class="checkout-modal">
        <div class="checkmark-wrapper">
          <div class="checkmark-circle"></div>
          <div class="checkmark-circle-glow"></div>
          <svg class="checkmark-svg" viewBox="0 0 52 52">
            <polyline points="14 27 22 35 38 19" />
          </svg>
        </div>
        <h2 style="font-size:1.4rem;margin-bottom:0.5rem;font-weight:700;color:var(--text);">¡Pedido Tramitado!</h2>
        <p style="color:var(--text-muted);font-size:0.95rem;margin-bottom:1.5rem;">Procesando tu pago de forma segura...</p>
        <div class="checkout-progress"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    // 2. Guardar artículos como pedidos en localStorage
    let orders = JSON.parse(localStorage.getItem('mercato_orders')) || [];
    
    // Obtener fecha legible de hoy en castellano
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('es-ES', options);

    // Mapear cada artículo del carrito como un nuevo pedido
    items.forEach(item => {
      const newOrder = {
        id: "ord-" + Math.floor(Math.random() * 1000000),
        date: dateStr,
        total: item.price * item.qty,
        number: `#293-1029302-${Math.floor(100 + Math.random() * 900)}`,
        status: "Preparando envío",
        statusClass: "status-transit",
        title: `${item.title} (${item.qty} ud${item.qty > 1 ? 's' : ''})`,
        image: item.image,
        vendor: "Mercato S.L.",
        btnText: "Rastrear paquete",
        secBtnText: "Cancelar pedido"
      };
      // Colocar los nuevos pedidos al principio del array
      orders.unshift(newOrder);
    });

    localStorage.setItem('mercato_orders', JSON.stringify(orders));

    // 3. Vaciar carrito de la memoria y la interfaz
    localStorage.removeItem('mercato_cart');
    Cart.updateBadge(); // Actualiza contador del menú superior

    // 4. Redirigir tras 3 segundos (tiempo de la barra de progreso)
    setTimeout(() => {
      overlay.remove();
      window.location.href = 'pedidos.html';
    }, 3000);
  },

  /* Modifica la cantidad de un artículo en ±1.
     Si la nueva cantidad sería < 1, elimina el artículo directamente.
     Después de cada cambio, re-renderiza toda la página del carrito. */
  changeQty(id, delta) {
    const items = Cart.get();
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.qty + delta < 1) { this.remove(id); return; } // Eliminar si llega a 0
    Cart.updateQty(id, item.qty + delta);
    this.render(); // Re-pinta el carrito con los nuevos datos
  },

  /* Elimina un artículo del carrito y actualiza la vista. */
  remove(id) {
    Cart.remove(id);
    this.render();
  }
};

/* =========================================================================
   Carousel — Slider de ofertas de la página de inicio
   -------------------------------------------------------------------------
   Técnica: se mueve el contenedor (#sliderTrack) con CSS transform.
   Al completar la animación, se reordena el DOM (mueve el primer/último
   elemento al otro extremo) para crear el efecto de bucle infinito.
   ========================================================================= */
const Carousel = {

  /* Guarda referencias al track y configura los listeners de los botones. */
  init() {
    this.track = document.getElementById('sliderTrack');
    if (!this.track) return; // No estamos en la home
    this.isAnimating = false; // Semáforo para evitar clics durante la animación
    this.gap = 20;            // Debe coincidir con el gap CSS del slider-track
    document.querySelector('.next-btn')?.addEventListener('click', () => this.moveNext());
    document.querySelector('.prev-btn')?.addEventListener('click', () => this.movePrev());
  },

  /* Avanza una carta hacia la izquierda (botón →):
     1. Calcula el desplazamiento = ancho de la primera carta + gap
     2. Aplica transición CSS y mueve el track hacia la izquierda
     3. Al terminar la animación (setTimeout), quita la transición,
        resetea la posición a 0, y mueve la primera carta al final del DOM
        → El usuario no nota el reordenamiento (ocurre instantáneamente) */
  moveNext() {
    if (this.isAnimating) return; // Evita doble clic durante la animación
    this.isAnimating = true;
    const firstCard = this.track.firstElementChild;
    const dist = firstCard.offsetWidth + this.gap;
    this.track.style.transition = 'transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)';
    this.track.style.transform = `translateX(-${dist}px)`;
    setTimeout(() => {
      this.track.style.transition = 'none';       // Desactiva transición momentáneamente
      this.track.style.transform = 'translateX(0)'; // Resetea posición sin animación
      this.track.appendChild(firstCard);           // Mueve primera carta al final
      this.isAnimating = false;                    // Libera el semáforo
    }, 290); // Ligeramente mayor que la duración de la transición CSS
  },

  /* Retrocede una carta hacia la derecha (botón ←):
     Técnica inversa: mueve la última carta al principio del DOM ANTES
     de animar, la desplaza fuera a la izquierda sin transición, luego
     activa la transición para que "entre" desde la izquierda. */
  movePrev() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const lastCard = this.track.lastElementChild;
    const dist = lastCard.offsetWidth + this.gap;
    this.track.prepend(lastCard);                            // Mueve última carta al inicio del DOM
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${dist}px)`;  // La coloca fuera a la izquierda
    void this.track.offsetWidth;                             // Fuerza reflow del navegador (necesario para que la transición funcione)
    this.track.style.transition = 'transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)';
    this.track.style.transform = 'translateX(0)';            // Anima la entrada desde la izquierda
    setTimeout(() => { this.isAnimating = false; }, 290);
  }
};

/* =========================================================================
   UI — Módulo de interfaz de usuario
   -------------------------------------------------------------------------
   Gestiona: menú hamburguesa móvil, animaciones de aparición con scroll
   (IntersectionObserver), y el sistema de notificaciones tipo toast.
   ========================================================================= */
const UI = {

  init() {
    this.initMobileNav(); // Configura el menú hamburguesa
    this.observe();       // Activa animaciones de aparición en scroll
    // Asegura que todos los enlaces con clase .cart-btn apunten a carrito.html
    document.querySelectorAll('a.cart-btn').forEach(btn => {
      if (!btn.href || btn.getAttribute('href') === '#') btn.href = 'carrito.html';
    });
  },

  /* Menú hamburguesa para móvil:
     - El botón .nav-hamburger alterna la clase 'active' en .nav-links
     - El overlay oscuro cierra el menú al hacer clic fuera
     - Los links del menú cierran el menú al navegar
     - La tecla Escape también cierra el menú */
  initMobileNav() {
    const burger = document.querySelector('.nav-hamburger');
    const nav = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');
    if (!burger || !nav) return;
    const toggle = () => {
      const open = nav.classList.toggle('active');
      burger.classList.toggle('active');   // Anima el icono hamburguesa → X
      overlay?.classList.toggle('active'); // Muestra/oculta el fondo oscuro
      document.body.style.overflow = open ? 'hidden' : ''; // Bloquea el scroll del body
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

  /* IntersectionObserver: observa todos los elementos con clase .animate.
     Cuando un elemento entra en el viewport, añade la clase 'visible'
     que activa su transición de opacidad y movimiento (ver CSS .animate).
     Una vez visible, deja de observarlo para liberar memoria. */
  observe() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible'); // Activa la animación CSS
          obs.unobserve(e.target);           // Ya no necesita seguir observándolo
        }
      });
    }, { threshold: 0.1 }); // Se activa cuando el 10% del elemento es visible
    document.querySelectorAll('.animate').forEach(el => obs.observe(el));
  },

  /* Sistema de notificaciones toast:
     - Aparece en la esquina inferior derecha durante 3.5 segundos
     - type 'success' → fondo oscuro azulado
     - type 'error'   → fondo rojo
     - Solo puede haber un toast visible a la vez (elimina el anterior) */
  notify(msg, type = 'success') {
    document.querySelector('.mercato-toast')?.remove(); // Elimina toast anterior si existe
    const t = document.createElement('div');
    t.className = 'mercato-toast';
    t.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;background:${type === 'success' ? '#131a22' : '#cc0c39'};color:#fff;padding:1rem 1.5rem;border-radius:10px;display:flex;align-items:center;gap:10px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.35);font-size:.95rem;font-weight:500;max-width:380px;`;
    t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span>${msg}`;
    document.body.appendChild(t);
    // Tras 3.5s inicia la transición de desvanecimiento y luego lo elimina del DOM
    setTimeout(() => {
      t.style.transition = '.3s';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3500);
  }
};

/* =========================================================================
   AUTH — Módulo de Autenticación
   -------------------------------------------------------------------------
   ¿CÓMO FUNCIONA?
   Este módulo gestiona el inicio y cierre de sesión de forma puramente cliente.
   - Guarda el email en el 'localStorage' del navegador para persistir la sesión.
   - Si detecta sesión activa, reestructura dinámicamente la cabecera (Header) de la web.
   
   ¿POR QUÉ SE HIZO ASÍ?
   1. LocalStorage: En un proyecto 100% frontend (sin backend ni bases de datos activas), 
      esta es la manera estándar e idónea de guardar estados de forma persistente.
   2. Modificación Dinámica del DOM: En lugar de duplicar código HTML o crear dos cabeceras 
      diferentes en cada uno de los 7 archivos HTML del sitio, el JavaScript detecta el 
      enlace a "login.html" en cualquier página, lo envuelve en un contenedor y le inyecta 
      el desplegable flotante automáticamente. Esto ahorra cientos de líneas y facilita el mantenimiento.
   ========================================================================= */
const Auth = {
  // Punto de entrada del módulo de autenticación
  init() {
    this.updateUI();    // Comprueba el estado de la sesión y redibuja la cabecera
    this.bindEvents();  // Asocia eventos al formulario de login (si estamos en login.html)
  },

  // Recupera el usuario logueado del disco local del navegador (devuelve null si no existe)
  getUser() {
    return localStorage.getItem('mercato_user');
  },

  // Inicia sesión: guarda el email en localStorage y redirige a la home de forma inmediata
  login(email) {
    localStorage.setItem('mercato_user', email);
    window.location.href = 'index.html'; // Redirección automática tras login exitoso
  },

  // Cierra sesión: limpia el registro de usuario en localStorage y recarga la página para aplicar cambios
  logout() {
    localStorage.removeItem('mercato_user');
    window.location.reload(); // Fuerza una recarga para limpiar el menú de usuario y volver al estado inicial
  },

  // Redibuja la interfaz de cabecera si hay una sesión activa
  updateUI() {
    const user = this.getUser();
    // Buscamos cualquier enlace que apunte a la página de login
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    
    if (user) {
      // Extraemos el nombre de usuario (ejemplo: si el email es 'manu@gmail.com', extrae 'manu')
      const name = user.split('@')[0];
      
      loginLinks.forEach(link => {
        // Cambiamos el texto superior de la cabecera dinámicamente
        const small = link.querySelector('small');
        if (small) small.textContent = `Hola, ${name}`;
        
        const strong = link.querySelector('strong');
        if (strong) strong.textContent = 'Mi Cuenta';

        // EVITAR DUPLICACIONES: Si el elemento ya fue procesado y envuelto en un renderizado anterior, salimos.
        if (link.parentNode.classList.contains('user-menu-wrapper')) return;

        // ENVOLTURA DINÁMICA (JS Wrapper): Creamos un contenedor div.user-menu-wrapper alrededor de nuestro enlace
        // para poder aplicar la lógica del hover y posicionamiento absoluto del menú desplegable de forma limpia.
        const wrapper = document.createElement('div');
        wrapper.className = 'user-menu-wrapper';
        link.parentNode.insertBefore(wrapper, link); // Inserta el wrapper en el DOM justo antes del enlace
        wrapper.appendChild(link); // Mueve el enlace dentro del wrapper
        
        // MENÚ DESPLEGABLE DINÁMICO: Creamos un bloque flotante que contiene las opciones de la cuenta
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
          <ul>
            <li><a href="pedidos.html">📦 Mis Pedidos</a></li>
            <li><a href="#">👤 Mi Perfil</a></li>
            <li><a href="#">📍 Direcciones de envío</a></li>
            <li><a href="#">💳 Métodos de pago</a></li>
            <li><hr style="border:0; border-top:1px solid var(--border); margin:8px 0;"></li>
            <li><a href="#" id="logout-btn" style="color:#cc0c39; font-weight:600;">🚪 Cerrar Sesión</a></li>
          </ul>
        `;
        wrapper.appendChild(dropdown); // Lo inyectamos dentro del wrapper para que actúe bajo las reglas de hover
        
        // EVENTO LOGOUT: Enlazamos el botón del desplegable para que ejecute el método de cerrar sesión al hacer clic
        const logoutBtn = dropdown.querySelector('#logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
          });
        }
        
        // ANULACIÓN DE ENLACE DIRECTO: Como el usuario ya está logueado, al pulsar sobre "Mi Cuenta" no queremos 
        // que intente navegar a 'login.html' de nuevo. Anulamos su comportamiento predeterminado en JS.
        link.href = '#';
        link.onclick = (e) => e.preventDefault();
      });
    }
  },

  // Captura el submit del formulario de login
  bindEvents() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Detiene el envío real a servidor y recarga nativa
        const email = document.getElementById('email').value;
        if (email) this.login(email); // Valida y guarda en localStorage
      });
    }
  }
};

/* =========================================================================
   FlashTimer — Contador regresivo de Ofertas Flash
   -------------------------------------------------------------------------
   ¿CÓMO FUNCIONA?
   Este módulo inicia un intervalo recurrente que se ejecuta cada 1000ms (1 segundo).
   - Utiliza una variable entera con el total de segundos disponibles (`totalSeconds`).
   - Cada segundo resta 1 unidad y recalcula las horas, minutos y segundos correspondientes.
   - Aplica formato de dos dígitos (`padStart`) y actualiza el texto del DOM.

   ¿POR QUÉ SE HIZO ASÍ?
   1. Simplicidad y Rendimiento: Guardar el contador en una única variable numérica en segundos 
      hace que los cálculos matemáticos internos sean extremadamente ligeros para el navegador.
   2. Experiencia de Compra (FOMO): El segundero activo genera sensación de urgencia al usuario, 
      incentivando la compra por impulso al ver cómo se agota el tiempo restante.
   ========================================================================= */
const FlashTimer = {
  init() {
    const timerElement = document.getElementById('flash-countdown');
    if (!timerElement) return; // Solo se activa si el contador existe en la página actual

    // Iniciamos la cuenta regresiva desde: 4 horas, 22 minutos y 15 segundos
    let totalSeconds = (4 * 3600) + (22 * 60) + 15;

    // Crea el bucle infinito cada 1 segundo (1000ms)
    setInterval(() => {
      if (totalSeconds <= 0) return; // Si llega a cero, el reloj se detiene
      totalSeconds--; // Resta un segundo en cada ciclo
      
      // Cálculo matemático de descomposición temporal
      const h = Math.floor(totalSeconds / 3600); // Horas completas
      const m = Math.floor((totalSeconds % 3600) / 60); // Minutos restantes
      const s = totalSeconds % 60; // Segundos restantes
      
      // FORMATO CON CERO A LA IZQUIERDA: Convertimos a string y usamos `padStart(2, '0')`
      // para asegurar que si da '5' se renderice como '05'. Manteniendo un reloj profesional de tipo '00:00:00'.
      timerElement.textContent = 
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, 1000);
  }
};

/* =========================================================================
   ContactForm — Validación del formulario de contacto
   -------------------------------------------------------------------------
   Intercepta el submit del formulario para hacer validación en el cliente
   antes de enviar. Marca los campos vacíos en rojo y muestra un toast.
   ========================================================================= */
const ContactForm = {
  init() {
    const form = document.getElementById('contact-form');
    if (!form) return; // Solo activo en contacto.html
    form.addEventListener('submit', e => {
      e.preventDefault(); // Evita el envío real del formulario (proyecto demo)
      let valid = true;
      // Recorre todos los campos obligatorios y los valida
      form.querySelectorAll('input[required], textarea[required]').forEach(f => {
        if (!f.value.trim()) {
          f.style.borderColor = '#cc0c39'; // Borde rojo en campos vacíos
          valid = false;
        } else {
          f.style.borderColor = ''; // Restaura borde normal si ya tiene valor
        }
      });
      if (valid) {
        UI.notify('¡Mensaje enviado! Te contactaremos pronto.', 'success');
        form.reset(); // Limpia todos los campos del formulario
      } else {
        UI.notify('Completa todos los campos obligatorios.', 'error');
      }
    });
  }
};

/* =========================================================================
   SearchEngine — Buscador interactivo en tiempo real con autocompletado
   -------------------------------------------------------------------------
   ¿CÓMO FUNCIONA?
   - Escucha los eventos `input` y `focus` en el campo de texto de búsqueda.
   - Si el usuario escribe algo, filtra el array `MOCK_DATA` comparando el título 
     y la categoría con el texto ingresado.
   - Crea dinámicamente un panel flotante (`.search-suggestions`) debajo del buscador
     y lo llena con los productos coincidentes (imagen, título, precio).
   - Oculta el panel cuando el usuario hace clic fuera de la caja de búsqueda.
   
   ¿POR QUÉ SE HIZO ASÍ?
   - Da una experiencia de usuario extremadamente premium, idéntica a la de grandes 
     e-commerces (Amazon, MercadoLibre) reduciendo drásticamente los clics necesarios 
     para acceder a un producto.
   ========================================================================= */
const SearchEngine = {
  init() {
    const searchInput = document.querySelector('.search-box input');
    const searchBox = document.querySelector('.search-box');
    if (!searchInput || !searchBox) return;

    // Crear el contenedor de sugerencias vacío
    const suggestions = document.createElement('div');
    suggestions.className = 'search-suggestions';
    searchBox.appendChild(suggestions);

    // Escuchar cuando el usuario escribe
    searchInput.addEventListener('input', () => this.handleSearch(searchInput.value, suggestions));

    // Escuchar cuando el campo gana foco
    searchInput.addEventListener('focus', () => this.handleSearch(searchInput.value, suggestions));

    // Cerrar sugerencias al hacer clic fuera del buscador
    document.addEventListener('click', (e) => {
      if (!searchBox.contains(e.target)) {
        suggestions.classList.remove('active');
      }
    });

    // Soporte para tecla Esc
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

    // Filtrar coincidencias en mock data
    const matches = MOCK_DATA.filter(p => 
      p.title.toLowerCase().includes(cleanQuery) || 
      p.category.toLowerCase().includes(cleanQuery)
    );

    if (matches.length === 0) {
      container.innerHTML = `<div class="suggestion-no-results">No se encontraron productos</div>`;
      container.classList.add('active');
      return;
    }

    // Renderizar coincidencias
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

/* =========================================================================
   Theme — Gestor de Modo Oscuro (Dark / Light Theme)
   -------------------------------------------------------------------------
   ¿CÓMO FUNCIONA?
   - Al cargar la página, comprueba inmediatamente si hay guardada una preferencia
     de tema oscuro en el almacenamiento local (`localStorage.getItem('mercato_theme')`).
   - Si existe y es 'dark', inyecta la clase `.dark-mode` al `<body>` al instante.
   - Crea dinámicamente el interruptor animado día/noche `.ui-switch` (importado de UIverse) 
     y lo inserta en el extremo derecho de la barra de navegación secundaria (`.nav-links`).
   - Escucha los cambios del checkbox oculto: al alternarse, activa/desactiva la clase `.dark-mode` 
     en el body, lanza una notificación toast de confirmación y persiste el estado en `localStorage`.
     
   ¿POR QUÉ SE HIZO ASÍ?
   - La inyección dinámica por JS evita tener que modificar manualmente cada uno de 
     los 9 archivos HTML del sitio, haciendo el código modular y fácil de mantener.
   - El uso de un interruptor animado interactivo de UIverse (día/noche con sol, luna y estrellas) 
     lleva la experiencia estética visual al máximo nivel del diseño web actual.
   ========================================================================= */
const Theme = {
  init() {
    // 1. Cargar tema preferido guardado de inmediato
    const savedTheme = localStorage.getItem('mercato_theme');
    const isDark = savedTheme === 'dark';

    // 2. Crear e inyectar el switch animado dinámicamente en la barra de enlaces
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return; // Si no hay barra, salir

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

    // 3. Registrar el evento de cambio (change) en el checkbox oculto
    const checkbox = wrapper.querySelector('input');
    checkbox.addEventListener('change', () => {
      const active = checkbox.checked;
      document.body.classList.toggle('dark-mode', active);
      localStorage.setItem('mercato_theme', active ? 'dark' : 'light');
      UI.notify(active ? 'Modo Oscuro activado 🌙' : 'Modo Claro activado ☀️', 'success');
    });
  }
};

/* =========================================================================
   Orders — Gestor Dinámico de Pedidos (Página pedidos.html)
   -------------------------------------------------------------------------
   ¿CÓMO FUNCIONA?
   - Si detecta el contenedor `#orders-list` (solo en `pedidos.html`), inicia el renderizado.
   - Si no hay un registro de pedidos guardado en `localStorage`, pre-inicializa la base 
     de datos local con dos pedidos de prueba por defecto para que la página no esté vacía.
   - Renderiza dinámicamente las tarjetas de pedido con su estado, total, fecha e imagen.
   - Proporciona un buscador interactivo en tiempo real que filtra al escribir por el título 
     del artículo, el vendedor o el número de pedido, repintando el DOM reactivamente.
     
   ¿POR QUÉ SE HIZO ASÍ?
   - Conectar dinámicamente el carrito con la página de pedidos a través de `localStorage` 
     crea una experiencia real de "Full-Stack simulado" (Single Page App feeling) de primer nivel.
   - La inclusión de un buscador instantáneo dinámico añade un valor pedagógico enorme.
   ========================================================================= */
const Orders = {
  init() {
    const listContainer = document.getElementById('orders-list');
    if (!listContainer) return; // No estamos en pedidos.html, salir
    this.container = listContainer;

    // 1. Inicializar con pedidos por defecto si está vacío
    let orders = JSON.parse(localStorage.getItem('mercato_orders'));
    if (!orders || orders.length === 0) {
      orders = [
        {
          id: "ord-1",
          date: "17 de Mayo de 2026",
          total: 115.50,
          number: "#293-1029302-393",
          status: "En reparto hoy",
          statusClass: "status-transit",
          title: "Zapatillas Urban Flow",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
          vendor: "Mercato Moda",
          btnText: "Rastrear paquete",
          secBtnText: "Cancelar pedido"
        },
        {
          id: "ord-2",
          date: "12 de Mayo de 2026",
          total: 39.99,
          number: "#293-1029302-392",
          status: "Entregado el 14 de Mayo",
          statusClass: "status-delivered",
          title: "Smartwatch FitPro",
          image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
          vendor: "Mercato Electrónica",
          btnText: "Rastrear paquete",
          secBtnText: "Devolver producto"
        }
      ];
      localStorage.setItem('mercato_orders', JSON.stringify(orders));
    }

    this.orders = orders;
    this.render(this.orders);

    // 2. Vincular el motor de búsqueda en tiempo real
    const searchInput = document.querySelector('.orders-search input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        const filtered = this.orders.filter(order => 
          order.title.toLowerCase().includes(query) || 
          order.number.toLowerCase().includes(query) ||
          order.vendor.toLowerCase().includes(query)
        );
        this.render(filtered);
      });
    }
  },

  /* Pinta en el DOM la lista de tarjetas de pedidos filtrada. */
  render(ordersList) {
    if (ordersList.length === 0) {
      this.container.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:1rem; opacity:0.6; display: block; margin-left: auto; margin-right: auto;">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          <p style="font-size:1.1rem; font-weight:600; color: var(--text);">No se encontraron pedidos</p>
          <p style="font-size:0.9rem; margin-top:0.25rem;">Intenta realizar otra búsqueda o haz un pedido en la cesta.</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = ordersList.map(order => `
      <div class="order-card animate visible">
        <div class="order-card__header">
          <div>
            <strong>PEDIDO REALIZADO</strong><br>
            ${order.date}
          </div>
          <div>
            <strong>TOTAL</strong><br>
            ${order.total.toFixed(2).replace('.', ',')}€
          </div>
          <div style="text-align: right;">
            <strong>Nº DE PEDIDO</strong><br>
            ${order.number}
          </div>
        </div>
        <div class="order-card__body">
          <img src="${order.image}" alt="${order.title}" class="order-card__img">
          <div class="order-card__info">
            <h3 class="order-card__title">${order.title}</h3>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom: 0.5rem;">Vendido por ${order.vendor}</p>
            <span class="order-card__status ${order.statusClass}">${order.status}</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn-primary" style="padding:8px 16px; font-size:0.9rem;" onclick="UI.notify('Funcionalidad simulada: ' + '${order.btnText}','success')">${order.btnText}</button>
            <button class="btn btn-secondary" style="padding:8px 16px; font-size:0.9rem; background:var(--surface); color:var(--text); border:1px solid var(--border);" onclick="UI.notify('Funcionalidad simulada: ' + '${order.secBtnText}','success')">${order.secBtnText}</button>
          </div>
        </div>
      </div>
    `).join('');
  }
};