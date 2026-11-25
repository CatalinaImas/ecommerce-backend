# Urban Plant Cookies — Backend

API REST del e-commerce **Urban Plant Cookies** (tercera entrega del proyecto integrador). Se conecta con el frontend en React: [ecommerce-frontend](https://github.com/CatalinaImas/ecommerce-frontend).

## Tecnologías

Node.js · Express · MongoDB Atlas (Mongoose) · JWT · bcrypt · Multer + Cloudinary · MercadoPago (Checkout Pro) · CORS · dotenv

## Cómo correrlo

Requisito: Node.js 18 o superior.

```bash
git clone https://github.com/CatalinaImas/ecommerce-backend
cd ecommerce-backend
npm install
```

1. Copiar `.env.example` como `.env` y completar los valores (MongoDB, JWT, Cloudinary y MercadoPago).
2. Cargar los usuarios de prueba, las categorías y los productos de ejemplo:

```bash
npm run seed
```

3. Iniciar el servidor:

```bash
npm run dev     # desarrollo (nodemon)
npm start       # producción
```

El servidor queda en `http://localhost:3000`.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor |
| `MONGODB_URI` | Connection string de MongoDB Atlas |
| `JWT_SECRET` | Clave para firmar los tokens |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Credenciales de Cloudinary |
| `MP_ACCESS_TOKEN` | Access Token de MercadoPago (solo vive en el backend) |
| `FRONTEND_URL` | URL del frontend (a donde vuelve MercadoPago) |
| `BACKEND_URL` | URL pública de este backend (webhook de MercadoPago) |

## Usuarios de prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| Admin | admin@admin.com | 1234 |
| Cliente | cliente@cliente.com | 1234 |

Las contraseñas se guardan hasheadas con bcrypt.

## Endpoints

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/api/users` | admin | Listar usuarios |
| GET | `/api/users/:id` | token | Usuario por ID (el propio o admin) |
| POST | `/api/users` | — | Registro (con avatar opcional) |
| POST | `/api/users/login` | — | Login, devuelve `{ token, user }` |
| PUT | `/api/users/:id` | token | Actualizar usuario (con imagen) |
| DELETE | `/api/users/:id` | admin | Eliminar usuario |
| GET | `/api/products` | — | Listar productos |
| GET | `/api/products/:id` | — | Producto por ID |
| POST | `/api/products` | admin | Crear producto (imagen → Cloudinary) |
| PUT | `/api/products/:id` | admin | Actualizar producto |
| DELETE | `/api/products/:id` | admin | Eliminar producto |
| GET | `/api/categories` | — | Listar categorías |
| POST / PUT / DELETE | `/api/categories[/:id]` | admin | Gestionar categorías |
| GET | `/api/orders` | token | Órdenes (admin: todas; cliente: las suyas) |
| POST | `/api/orders` | token | Crear orden (precios tomados de la base de datos) |
| POST | `/api/payments/create-preference` | token | Crea la preferencia de MercadoPago y devuelve `init_point` |
| POST | `/api/payments/webhook` | — | Notificaciones de MercadoPago (actualiza el estado de la orden) |

Las rutas protegidas esperan el header `Authorization: Bearer <token>`.

## Estructura

```
├── index.js
├── seed.js
└── src/
    ├── config/        db.js, cloudinary.js
    ├── middlewares/   auth, admin, upload (Multer + Cloudinary)
    ├── models/        User, Product, Category, Order
    ├── controllers/
    ├── routes/
    └── utils/
```

## Autora

Catalina Imas — [GitHub](https://github.com/CatalinaImas)
