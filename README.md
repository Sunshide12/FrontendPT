# Sistema de Gestión de Pedidos — Frontend

Aplicación web que consume la API REST del backend Laravel para gestionar productos, categorías, clientes, inventario y pedidos. Permite crear pedidos seleccionando un cliente y múltiples productos, controlar el stock desde el módulo de inventario y cambiar el estado de los pedidos directamente desde la tabla.

## Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## Requisitos

- Node.js 18 o superior
- npm
- Backend Laravel corriendo en `http://localhost:8000` (o el puerto que configures)

## Instalación

```bash
# Clonar el repo y entrar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Levantar el servidor de desarrollo
npm run dev
```

Vite levanta en `http://localhost:5173` por defecto.

## Configuración

La URL base del backend está definida en `src/infrastructure/api.js`:

```js
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
```

Si tu backend corre en otro puerto, cambiá el valor de `baseURL` en ese archivo. No hay variables de entorno configuradas para esto — se cambia directamente ahí.

## Módulos

- **Productos** — CRUD completo con búsqueda, paginación del servidor y selector de categoría. Formulario en modal con validación de campos obligatorios.
- **Categorías** — CRUD con creación inline (sin modal) y edición en modal. La paginación se hace en el cliente porque el endpoint devuelve todas las categorías de una sola vez (se necesitan completas para el dropdown de productos).
- **Clientes** — CRUD completo con búsqueda y paginación del servidor. Campos: nombre, email, teléfono.
- **Inventario** — Listado de productos con búsqueda y paginación. Permite ajustar el stock manualmente desde un modal, no se puede guardar stock negativo.
- **Pedidos** — Listado paginado con búsqueda por cliente. Cada pedido muestra el detalle de productos y cantidades. Permite crear pedidos seleccionando un cliente y agregando múltiples productos con cantidad. Calcula el total estimado en tiempo real. El estado (pendiente, completado, cancelado) se cambia desde un dropdown en la tabla. Al eliminar un pedido, el stock se restaura.

## Estructura del proyecto

```
src/
├── application/
│   └── hooks/              # Custom hooks — un hook por módulo, manejan estado y llamadas a la API
│       ├── useProducts.js
│       ├── useCategories.js
│       ├── useClients.js
│       ├── useInventory.js
│       └── useOrders.js
├── domain/
│   └── types.js            # Funciones que mapean la respuesta del backend a objetos del frontend
├── infrastructure/
│   ├── api.js              # Instancia de axios con la URL base del backend
│   ├── productService.js   # Llamadas HTTP para productos (CRUD + búsqueda + filtro por categoría)
│   ├── categoryService.js  # Llamadas HTTP para categorías (CRUD sin paginación)
│   ├── clientService.js    # Llamadas HTTP para clientes (CRUD + búsqueda + listado completo)
│   ├── inventoryService.js # Llamadas HTTP para inventario (listado + ajuste de stock)
│   └── orderSrevice.js     # Llamadas HTTP para pedidos (CRUD + cambio de estado)
├── ui/
│   ├── components/         # Componentes reutilizables
│   │   ├── Modal.jsx       # Overlay con contenedor genérico — recibe título y children
│   │   ├── PageHeader.jsx  # Título + subtítulo + botón de acción opcional
│   │   ├── Pagination.jsx  # Controles anterior/siguiente, consume el objeto de paginación de Laravel
│   │   ├── SearchBar.jsx   # Input de texto controlado con placeholder configurable
│   │   └── Sidebar.jsx     # Navegación lateral con links a cada módulo usando NavLink
│   └── pages/              # Una carpeta por módulo, cada una con su página principal
│       ├── products/ProductsPage.jsx
│       ├── categories/CategoriesPage.jsx
│       ├── clients/ClientsPage.jsx
│       ├── inventory/InventoryPage.jsx
│       └── orders/OrdersPage.jsx
├── App.jsx                 # Rutas y layout principal (sidebar + contenido)
├── main.jsx                # Punto de entrada — monta App en el DOM
└── index.css               # Tailwind directives + reset global + clase .input reutilizable
```

