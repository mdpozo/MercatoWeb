/* Historial de pedidos y buscador de pedidos */

const Orders = {
  init() {
    const listContainer = document.getElementById('orders-list');
    if (!listContainer) return;
    this.container = listContainer;

    // Pedidos falsos iniciales si no hay nada guardado
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

    // Escuchar el input del buscador de pedidos
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

  // Renderizar la lista de pedidos
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
