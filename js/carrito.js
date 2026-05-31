/* Gestion del carrito de compras y pagina del carrito */

const Cart = {
  KEY: 'mercato_cart',

  // Obtener items del localStorage
  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  // Guardar items y actualizar badge
  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  // Agregar un producto
  add(productId, qty = 1) {
    const product = MOCK_DATA.find(p => p.id === productId);
    if (!product) return;
    const items = this.get();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: product.id, title: product.title, category: product.category, price: product.price, image: product.image, qty });
    }
    this.save(items);
    UI.notify(`"${product.title}" añadido a la cesta`, 'success');
  },

  // Eliminar producto
  remove(productId) {
    this.save(this.get().filter(i => i.id !== productId));
  },

  // Cambiar cantidad
  updateQty(productId, newQty) {
    const items = this.get();
    const item = items.find(i => i.id === productId);
    if (item) { item.qty = Math.max(1, newQty); this.save(items); }
  },

  // Calcular precio total
  total() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },

  // Contar cantidad de items
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },

  // Actualizar el numerito del carrito en el header
  updateBadge() {
    const badge = document.querySelector('.cart-badge');
    const n = this.count();
    if (badge) {
      badge.textContent = n;
      badge.style.display = n > 0 ? 'inline-flex' : 'none';
      
      // Animacion de escala
      badge.classList.remove('badge-pop');
      void badge.offsetWidth; 
      badge.classList.add('badge-pop');
    }
  }
};

/* Pagina del carrito */
const CartPage = {
  init() {
    const container = document.getElementById('cart-container');
    if (!container) return;
    this.container = container;
    this.render();
  },

  // Pintar los productos en el HTML
  render() {
    const items = Cart.get();

    // Si no hay productos
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

    // Si hay productos
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
              <div class="cart-item__qty">
                <button class="qty-btn" onclick="CartPage.changeQty(${item.id}, -1)">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="CartPage.changeQty(${item.id}, 1)">+</button>
              </div>
              <button class="cart-item__remove" onclick="CartPage.remove(${item.id})">Eliminar</button>
            </div>
            <span class="cart-item__price">${(item.price * item.qty).toFixed(2).replace('.', ',')}€</span>
          </div>
        `).join('')}
      </div>`;

    // Resumen de la compra
    const subtotal = Cart.total();
    const envio = subtotal >= 50 ? 0 : 3.99;
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

  // Simular la compra y vaciar carrito
  checkout() {
    const items = Cart.get();
    if (items.length === 0) return;

    // Crear el modal flotante de pago
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

    // Guardar los articulos comprados en el historial
    let orders = JSON.parse(localStorage.getItem('mercato_orders')) || [];
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('es-ES', options);

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
      orders.unshift(newOrder);
    });

    localStorage.setItem('mercato_orders', JSON.stringify(orders));

    // Vaciar el carrito
    localStorage.removeItem('mercato_cart');
    Cart.updateBadge();

    // Redirigir a pedidos
    setTimeout(() => {
      overlay.remove();
      window.location.href = 'pedidos.html';
    }, 3000);
  },

  // Modificar cantidad del producto
  changeQty(id, delta) {
    const items = Cart.get();
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.qty + delta < 1) { this.remove(id); return; }
    Cart.updateQty(id, item.qty + delta);
    this.render();
  },

  // Quitar producto del carrito
  remove(id) {
    Cart.remove(id);
    this.render();
  }
};
