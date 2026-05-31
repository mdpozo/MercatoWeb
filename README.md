# 🛒 Mercato — Marketplace E-Commerce Premium
Proyecto final de Lenguaje de Marcas. Un e-commerce y marketplace interactivo de primer nivel comercial, desarrollado enteramente con **HTML5 semántico**, **CSS3 avanzado (arquitectura moderna de variables y diseño adaptativo)** y **JavaScript Vanilla ES6+ orientado a objetos**.

El proyecto ha evolucionado de un prototipo de 5 páginas estáticas a una **aplicación web interactiva completa de 8 páginas**, que incluye un gestor de estado en memoria persistente, pasarela de pago interactiva, buscador reactivo en tiempo real y micro-interacciones animadas importadas de los mejores diseñadores de **UIverse.io**.

---

## 📐 Arquitectura de Directorios y Estructura del Proyecto

El sitio web está estructurado de manera modular y limpia siguiendo los estándares profesionales de desarrollo web moderno:

```
MercatoWeb/
├── index.html            → Portal de Bienvenida y Home. Contiene el slider infinito y ofertas flash.
├── productos.html        → Catálogo completo de artículos con filtros laterales de precio, categoría y rating.
├── detalle.html          → Ficha técnica detallada de producto, selector de cantidad y módulo de opiniones.
├── carrito.html          → Gestor interactivo de la cesta de la compra con totales automáticos y checkout.
├── pedidos.html          → Historial dinámico de compras con buscador de pedidos en tiempo real.
├── login.html            → Pantalla de acceso de usuario con validación avanzada y efectos visuales.
├── nosotros.html         → Sección institucional con estadísticas animadas por scroll e historia del equipo.
├── contacto.html         → Formulario de ayuda validado en tiempo real con alertas accesibles (ARIA).
├── css/
│   └── styles.css        → Core de Estilos. Hoja única organizada en tokens, variables y componentes (~2100 líneas).
└── js/
    └── main.js           → Core de Lógica. JS modular basado en namespaces, promesas y estados (~930 líneas).
```

---

## 🎨 Sistema de Diseño y Estética Visual Premium

El apartado visual se ha diseñado para ofrecer una experiencia que compita directamente con colosos como Amazon, Apple o Stripe. Cuenta con **soporte completo de Modo Claro y Modo Oscuro nativo e instantáneo**.

### 🌟 Paleta de Tokens CSS (Variables)
El diseño se rige por un esquema de variables de CSS centralizadas en `:root` que cambian instantáneamente al inyectar la clase `.dark-mode` en el `<body>`:

| Token CSS | Valor (Modo Claro) | Valor (Modo Oscuro) | Propósito de UI/UX |
| :--- | :--- | :--- | :--- |
| `--bg` | `#ffffff` (Blanco Puro) | `#0b0f19` (Azul Noche Profundo) | Fondo principal que reduce la carga cognitiva. |
| `--surface` | `#ffffff` | `#151e2e` (Gris Azulado de Grado) | Contenedor de tarjetas, paneles y modales. |
| `--border` | `#e2e8f0` (Gris Suave) | `#26354a` (Azul Cenizo) | Líneas divisorias finas no invasivas. |
| `--text` | `#0f172a` (Pizarra Oscuro) | `#f8fafc` (Blanco Nieve) | Contraste de texto optimizado para legibilidad (AAA). |
| `--text-muted` | `#64748b` (Gris Neutro) | `#94a3b8` (Gris Claro) | Subtítulos, fechas y datos secundarios. |
| `--brand` | `#ff9900` (Naranja Mercato) | `#ff9900` | Color primario de acción/conversión (CTAs). |
| `--brand-hover` | `#e07b00` | `#ffaa33` | Estado hover de botones y elementos accionables. |
| `--price` | `#b12704` (Rojo Amazon) | `#f97316` (Naranja Neón) | Color de alta visibilidad exclusivo para el precio. |
| `--star` | `#ffa41c` (Amarillo Oro) | `#fbbf24` | Valoraciones y estrellas de satisfacción. |
| `--link` | `#007185` | `#38bdf8` (Azul Cielo Eléctrico) | Enlaces e interacciones secundarias. |

---

## 🧠 Estado y Lógica del Sistema (JavaScript Vanilla ES6+)

El motor del sitio web (`js/main.js`) está estructurado como una biblioteca de componentes autogestionados mediante objetos literales de JavaScript (namespaces). Esto previene la contaminación del ámbito global y garantiza modularidad absoluta.

### 1. 🛒 Gestor del Carrito de Compra (`Cart` y `CartPage`)
Implementa un motor de persistencia del estado en el lado del cliente utilizando la API `localStorage`.
*   **Añadir con Acumulación:** Al pulsar "Añadir a la cesta", el sistema comprueba si el artículo ya existe en la memoria (`localStorage.getItem('mercato_cart')`). Si existe, incrementa la propiedad `qty` en lugar de duplicar la fila; si no existe, lo inyecta con cantidad inicial de `1`.
*   **Contador del Header Reactivo:** Cada mutación en la cesta dispara `Cart.updateBadge()`, el cual refresca al instante el indicador numérico naranja de la cesta de forma global en cualquier página.
*   **Cálculo Dinámico de Totales:** En `carrito.html`, el sistema computa el subtotal sumando `precio * cantidad` de cada fila. Se aplica una regla de negocio dinámica: **envío gratuito para compras mayores o iguales a 50€**, de lo contrario, se cargan automáticamente `3,99€`.
*   **Selector de Cantidad Sincronizado:** Permite aumentar o disminuir unidades desde la propia tabla del carrito. Si la cantidad baja de 1, el script dispara un borrado preventivo automático, redibujando el DOM con una transición suave.

### 2. 🔐 Autenticación y Sesión de Usuario (`Auth`)
El sistema emula una suite de autenticación real de extremo a extremo:
*   **Auth State Guard (Guardianes de Ruta):** Las páginas privadas como `pedidos.html` incorporan un script de bloqueo síncrono al principio de su `<head>`. Si no existe `mercato_user` en el almacenamiento local, se ejecuta un `window.location.replace('login.html')`. Al usar `replace`, se destruye la página en el historial, impidiendo que el usuario pueda pulsar el botón "Atrás" de su navegador para colarse.
*   **Menu Dropdown Dinámico:** En lugar de mostrar opciones genéricas, el menú del header cambia dinámicamente si hay sesión iniciada: dibuja el mensaje de bienvenida personalizado *"Hola, [Nombre]"* y despliega un submenú flotante interactivo con enlace a sus pedidos y un botón de **"Cerrar sesión"**.

### 3. 📦 Historial de Pedidos y Buscador Reactivo (`Orders`)
Conecta de forma brillante el flujo de compra con el panel del perfil de usuario:
*   **Base de Datos Inicial Auto-Poblada:** Si el usuario no tiene historial de compras registrado, el módulo inyecta en `localStorage` dos pedidos ficticios por defecto (Smartwatch FitPro y Zapatillas Urban Flow) para que la interfaz luzca completa e instructiva.
*   **Buscador Indexado al Vuelo:** La barra superior de búsqueda de pedidos no es estática. Captura el evento `'input'` y filtra la base de datos de objetos en memoria en milisegundos buscando coincidencias parciales (case-insensitive) en el **título del artículo**, **número de pedido** o **tienda proveedora**, repintando el DOM instantáneamente. Si no hay coincidencias, inyecta un estado vacío decorado.

---

## ⚡ Componentes e Interacciones Premium (Estilo UIverse)

Se han diseñado e implementado micro-interacciones visuales interactivas y avanzadas:

### ☀️🌙 Interruptor Día/Noche Animado (`Theme`)
Ubicado en el menú secundario, sustituye al clásico botón plano por un switch físico animado en 3D importado de la estética de UIverse:
*   **Modo Día:** Muestra un cielo azul claro con nubes tridimensionales translúcidas en la parte inferior. El disparador es una bola dorada brillante que representa el Sol.
*   **Transición Elástica:** Al hacer clic, el Sol se desplaza a la derecha mediante una transición de curva Bézier elástica (`cubic-bezier(0.4, 0, 0.2, 1)`).
*   **Modo Noche:** Durante el trayecto, la bola se transforma en una luna plateada con sombras internas que emulan cráteres. Paralelamente, las nubes se hunden y desaparecen de la vista, y el fondo del switch se funde a negro espacial revelando un cielo estrellado con constelaciones que emergen desde la parte inferior.

### 💳 Pasarela de Pago y Checkout Modal
En la página del carrito, al tramitar el pedido se dispara `CartPage.checkout()`:
*   **Overlay Esmerilado:** Inyecta un contenedor a pantalla completa con desenfoque de cristal flotado de alta gama (`backdrop-filter: blur(12px)`).
*   **SVG Checkmark Autodibujable:** El modal muestra un círculo de confirmación animado. El checkmark verde de su interior se dibuja de forma fluida animando la propiedad CSS `stroke-dashoffset` en combinación con un halo exterior translúcido que realiza una animación de pulsación infinita (`pulse-glow`).
*   **Barra de Carga Inferior:** Una barra de neón en degradado avanza a lo ancho de la tarjeta durante 3 segundos. Al completarse, vacía la cesta de la compra, añade los artículos como nuevos pedidos al historial de la cuenta, elimina el modal y redirige sutilmente al usuario a `pedidos.html`.

### 🛍️ Botón de Compra Líquido (Liquid Sweep Effect)
El botón `.btn-cart` ("Añadir a la cesta") cuenta con un fondo pseudo-elemental doble de ancho (`200%`) configurado con un degradado dinámico de cuatro colores. Al pasar el ratón, el degradado se desplaza horizontalmente recreando un flujo de líquido brillante y empujando el botón hacia arriba con un halo de luz naranja resplandeciente.

### 🎠 Amazon Infinite Slider (Física de Arrastre e Inercia)
Ubicado en la home, es un carrusel de productos infinito de alto rendimiento comercial:
*   **Navegación Multicanal:** Se puede controlar mediante las flechas de navegación, la rueda del ratón, gestos táctiles (deslizar en móviles) o arrastre directo del puntero (drag-and-drop con física de arrastre).
*   **Cálculo de Inercia:** Si el usuario arrastra la lista con el ratón y la suelta bruscamente, el slider calcula la velocidad final y prolonga el desplazamiento reduciendo la aceleración gradualmente para una sensación orgánica ultra suave.

### ⏱️ Temporizador de Ofertas Flash (`FlashTimer`)
Un reloj digital de cuenta atrás persistente que se calcula restando la hora actual al final del día. Se actualiza cada segundo y muestra el formato `HH:MM:SS` para generar urgencia y aumentar el CTR (conversión de compra).

---

## ♿ Accesibilidad (A11y) y Semántica HTML5
*   **Semántica Estricta:** Uso estricto de etiquetas contenedoras descriptivas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<time>`).
*   **Breadcrumbs SEO:** Rutas de navegación con jerarquía semántica estructurada para indexación en buscadores.
*   **Alertas ARIA Activas:** El formulario de contacto (`contacto.html`) inyecta mensajes de error con el atributo `aria-live="polite"` permitiendo que los lectores de pantalla los leen inmediatamente sin interrumpir la navegación del usuario.
*   **Teclado Accesible:** Todos los elementos interactivos cuentan con un estilo de enfoque visible (`:focus-visible`) que los bordea en color naranja brillante al navegar con la tecla Tabulador.
*   **Imágenes Accesibles:** Atributos `alt` obligatorios y descriptivos en todas las imágenes comerciales; iconos decorativos ocultados a lectores mediante `aria-hidden="true"`.

---

## 🛠️ Tecnologías Empleadas
1.  **HTML5 Semántico:** Estructura web estándar adaptada a SEO y accesibilidad.
2.  **CSS3 Puro (Vanilla CSS):** Arquitectura modular sin dependencias (Tailwind/Bootstrap), basada en variables, flexbox, grid, animaciones de fotogramas clave (`@keyframes`) y transformaciones tridimensionales.
3.  **JavaScript Vanilla (ES6+):** Código nativo sin frameworks, haciendo uso de APIs avanzadas de navegación como `localStorage`, `IntersectionObserver` y animaciones sincronizadas de GPU.
4.  **Google Fonts:** Fuentes tipográficas premium de alto rendimiento: *Inter* y *Outfit*.
5.  **Unsplash & UIverse:** Recursos gráficos de alta fidelidad y micro-interacciones de diseño UI/UX comercial.

---
*Desarrollado con pasión como proyecto de Lenguaje de Marcas. Mercato representa la sinergia perfecta entre ingeniería de software nativa y diseño visual premium.*
