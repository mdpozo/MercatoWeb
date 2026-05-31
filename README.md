# 🛒 Mercato — Proyecto Final de Lenguaje de Marcas

Este es mi proyecto final de Lenguaje de Marcas. Consiste en una tienda online interactiva (un e-commerce) creada desde cero utilizando **HTML5**, **CSS3** para el diseño de los estilos y **JavaScript** a mano (sin frameworks) para darle interactividad a las páginas.

El sitio web tiene **8 páginas** en total que están conectadas entre sí y son completamente funcionales en cuanto a navegación, filtros, guardado de productos y simulación de compras.

---

## 📁 Estructura de Carpetas del Proyecto

He organizado el proyecto de forma modular para no tener archivos gigantes con miles de líneas de código, dividiendo los estilos y los scripts por funciones en español:

```
MercatoWeb/
├── index.html            → Pagina de inicio. Tiene el carrusel de productos y las ofertas flash con reloj.
├── productos.html        → Catalogo completo donde se pueden filtrar los productos por precio y categoria.
├── detalle.html          → Ficha detallada de cada producto con su descripcion y boton de compra.
├── carrito.html          → Cesta de la compra con calculo automatico de precios, envio gratis y pago.
├── pedidos.html          → Historial con los pedidos comprados y un buscador en tiempo real.
├── login.html            → Formulario de acceso con validaciones de usuario.
├── nosotros.html         → Pagina informativa sobre quienes somos y nuestra tienda.
├── contacto.html         → Formulario de soporte tecnico y contacto.
├── css/
│   ├── styles.css        → Archivo principal que carga todos los demas modulos de estilos mediante @import.
│   ├── variables.css     → Variables de colores globales para el tema claro y modo oscuro.
│   ├── base.css          → Estilos basicos generales de la web (fuentes, resets, titulos, etc.).
│   ├── componentes.css   → Estilos compartidos de botones y avisos flotantes (toasts).
│   ├── cabecera.css      → Estilos del menu superior, el buscador y el menu desplegable de la cuenta.
│   ├── carrusel.css      → Estilos del slider de ofertas de la pagina principal.
│   ├── catalogo.css      → Estilos del grid de productos, la ficha de detalle y los filtros laterales.
│   ├── paginas.css       → Estilos de paginas concretas (carrito, formulario de login, pie de pagina).
│   └── adaptativo.css    → Reglas media queries para que la web se adapte correctamente a moviles y tablets.
└── js/
    ├── datos.js          → Listado con los productos disponibles de la tienda (mock data).
    ├── interfaz.js       → Lógica del menu movil, animaciones de scroll y las alertas toast.
    ├── carrito.js        → Funciones para añadir, quitar y calcular cantidades del carrito de compras.
    ├── autenticacion.js  → Control de sesion del usuario, login e inyeccion del menu de perfil.
    ├── pedidos.js        → Lógica para guardar las compras y buscarlas en la lista de pedidos.
    ├── catalogo.js       → Inyeccion de productos en el catalogo segun la pagina y ficha de detalle.
    ├── componentes.js    → Funciones del carrusel de ofertas, el temporizador, contacto y modo oscuro.
    └── principal.js      → Codigo que carga primero el modo oscuro y arranca todos los scripts al cargar el DOM.
```

---

## 🛠️ Logica y Funcionamiento General

Toda la interactividad del sitio se maneja con JavaScript de forma local en el navegador, usando almacenamiento interno para simular una base de datos real:

### 1. Carrito de Compras
*   **Guardado local:** Los productos que añades se guardan en la memoria local (`localStorage`), de modo que si cierras el navegador o cambias de página, la cesta no se borra.
*   **Contador reactivo:** Al añadir un producto se actualiza automaticamente el numero que aparece arriba en el carrito de la cabecera, haciendo una animacion elástica en el contador.
*   **Envio Gratuito:** La cesta calcula el total. Si la suma supera los 50€, el envio sale gratis de forma automatica; si no, se añaden 3,99€ de gastos de envio.
*   **Selector de unidades:** Puedes cambiar las unidades dentro del carrito. Si bajas la cantidad a 0, el producto se borra de la lista de forma automatica.

### 2. Control de Sesion y Login
*   **Acceso simulado:** En `login.html`, al escribir tu correo se inicia sesion guardando los datos en `localStorage`.
*   **Menu dinamico:** Al iniciar sesion, el enlace de "Mi Cuenta" arriba en la cabecera cambia y muestra "Hola, [nombre]". Ademas, al pasar el raton se despliega un menu interactivo para ver tus pedidos o cerrar sesion.
*   **Seguridad basica:** En la pagina de pedidos hay un pequeño script de seguridad en el head. Si intentas entrar escribiendo la URL directamente en el navegador pero no has iniciado sesion, te redirige al login automaticamente y limpia el historial para que no puedas volver atras con las flechas del navegador.

### 3. Buscador en Tiempo Real
*   **Sugerencias:** Al escribir en la barra de busqueda de la cabecera, se abre un desplegable debajo que te muestra sugerencias que coinciden con el titulo o la categoria de lo que buscas.
*   **Filtros de catálogo:** En la pagina de productos puedes combinar filtros de categoria (mediante checkboxes) y de precio (mediante botones radio). El listado se actualiza de inmediato sin tener que recargar la pagina completa.

### 4. Modo Oscuro
*   **Cambio visual:** He diseñado un switch animado en la barra superior. Al pulsarlo, se activa la clase `dark-mode` en el body y se cambian todas las variables de color CSS con una transicion muy suave. El tema se queda guardado para que no se resetee al recargar la web.

### 5. Animaciones al hacer Scroll
*   **Aparicion suave:** Los productos y secciones de la web no cargan de golpe, sino que van apareciendo suavemente con un efecto de desplazamiento hacia arriba a medida que bajas con el scroll de la pagina.

---

## 🎨 Tecnologias Utilizadas

1.  **HTML5 Semántico:** Uso correcto de etiquetas para una buena estructura web.
2.  **CSS3 Puro:** Diseño moderno sin usar frameworks externos, basado en Flexbox y Grid Layout, con variables de color CSS y animaciones `@keyframes`.
3.  **JavaScript nativo (ES6+):** Programado sin librerias externas, haciendo uso de herramientas del navegador como `localStorage` e `IntersectionObserver`.
4.  **Google Fonts:** Tipografias externas *Inter* y *Outfit* para darle un aspecto limpio.
