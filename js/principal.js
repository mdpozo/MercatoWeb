/* Orquestador principal e inicio de modulos */

// Cargar modo oscuro rapido antes de renderizar la pagina
if (localStorage.getItem('mercato_theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Iniciar todos los modulos cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  Cart.updateBadge();
  Carousel.init();
  API.initCatalog();
  API.initProductDetail();
  CartPage.init();
  ContactForm.init();
  FlashTimer.init();
  Auth.init();
  SearchEngine.init();
  Theme.init();
  Orders.init();
});
