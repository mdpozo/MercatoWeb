/* Manejo de sesiones de usuario y login */

const Auth = {
  // Inicializar modulo
  init() {
    this.updateUI();
    this.bindEvents();
  },

  // Obtener el mail de la sesion
  getUser() {
    return localStorage.getItem('mercato_user');
  },

  // Guardar sesion
  login(email) {
    localStorage.setItem('mercato_user', email);
    window.location.href = 'index.html';
  },

  // Borrar sesion
  logout() {
    localStorage.removeItem('mercato_user');
    window.location.reload();
  },

  // Actualizar menu superior si hay usuario
  updateUI() {
    const user = this.getUser();
    const loginLinks = document.querySelectorAll('a[href="login.html"]');
    
    if (user) {
      const name = user.split('@')[0];
      
      loginLinks.forEach(link => {
        const small = link.querySelector('small');
        if (small) small.textContent = `Hola, ${name}`;
        
        const strong = link.querySelector('strong');
        if (strong) strong.textContent = 'Mi Cuenta';

        // Si ya se creo el wrapper del menu, no hacer nada
        if (link.parentNode.classList.contains('user-menu-wrapper')) return;

        // Crear wrapper para el desplegable hover
        const wrapper = document.createElement('div');
        wrapper.className = 'user-menu-wrapper';
        link.parentNode.insertBefore(wrapper, link);
        wrapper.appendChild(link);
        
        // Contenido del dropdown
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
        wrapper.appendChild(dropdown);
        
        // Evento de cerrar sesion
        const logoutBtn = dropdown.querySelector('#logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
          });
        }
        
        // Evitar que el link lleve a login.html
        link.href = '#';
        link.onclick = (e) => e.preventDefault();
      });
    }
  },

  // Escuchar formulario de login
  bindEvents() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (email) this.login(email);
      });
    }
  }
};
