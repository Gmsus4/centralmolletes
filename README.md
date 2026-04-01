# ☕ Central Molletes — Sitio Web con Panel de Administración

Plataforma web completa para **Central Molletes**, una cafetería artesanal. Permite a los visitantes explorar el menú, conocer ubicaciones y horarios, leer el blog y contactar al negocio. Incluye un panel de administración privado para gestionar todo el contenido sin necesidad de conocimientos técnicos.

---

## 🚀 Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Lenguaje | TypeScript 5 |
| Base de datos | PostgreSQL + [Prisma ORM v7](https://www.prisma.io/) |
| Autenticación | [NextAuth.js v5](https://authjs.dev/) — JWT Strategy |
| Imágenes | [Cloudinary](https://cloudinary.com/) + next-cloudinary |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI v5](https://daisyui.com/) |
| Validación | [Zod v4](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) |
| Encriptación | bcryptjs |

---

## 📁 Estructura del Proyecto

```
central-molletes/
├── app/
│   ├── (public)/          # Rutas públicas (inicio, productos, blog, contacto…)
│   ├── admin/             # Panel de administración (protegido)
│   ├── login/             # Página de inicio de sesión
│   └── api/               # API Routes (products, categories, blog, contact…)
├── components/            # Componentes reutilizables de UI
├── data/                  # Datos estáticos / helpers de datos
├── lib/                   # Cliente Prisma y utilidades compartidas
├── prisma/
│   ├── schema.prisma      # Esquema de la base de datos
│   ├── migrations/        # Migraciones generadas por Prisma
│   └── seed.ts            # Script de datos iniciales
├── public/                # Archivos estáticos (imágenes, favicon…)
├── auth.ts                # Configuración de NextAuth
├── middleware.ts          # Protección de rutas y APIs
├── next.config.ts         # Configuración de Next.js
└── prisma.config.ts       # Configuración de Prisma CLI
```

---

## ⚙️ Instalación y Configuración Local

### Prerrequisitos

- Node.js 20+
- PostgreSQL 14+ corriendo localmente o en la nube

### 1. Clonar el repositorio

```bash
git clone https://github.com/Gmsus4/central-molletes.git
cd central-molletes
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/central_molletes"

# NextAuth — genera un secret seguro con: openssl rand -base64 32
AUTH_SECRET="tu_secret_aqui"

# Cloudinary — obtén estos valores en cloudinary.com/console
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"

# Entorno
NODE_ENV="development"
```

### 4. Configurar la base de datos

```bash
# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Poblar con datos iniciales
npx prisma db seed

# (Opcional) Abrir Prisma Studio para explorar la BD
npx prisma studio
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📜 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo con hot-reload
npm run build      # Genera el cliente Prisma y compila para producción
npm run start      # Inicia el servidor en modo producción
npm run lint       # Ejecuta ESLint sobre el proyecto
```

---

## 🗺️ Rutas de la Aplicación

### Área Pública

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio con productos destacados, anuncios y promociones |
| `/products` | Menú completo organizado por categoría |
| `/blog` | Entradas del blog de Central Molletes |
| `/blog/[slug]` | Detalle de una entrada del blog |
| `/locations` | Ubicaciones y puntos de venta |
| `/schedule` | Horarios de atención |
| `/contact` | Formulario de contacto |

### Área Privada

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión del administrador |
| `/admin` | Panel de control principal |
| `/admin/products` | Gestión de productos del menú |
| `/admin/categories` | Gestión de categorías |
| `/admin/promotions` | Gestión de promociones |
| `/admin/announcements` | Gestión de anuncios |
| `/admin/blog` | Gestión de entradas del blog |
| `/admin/locations` | Gestión de ubicaciones |
| `/admin/schedule` | Gestión de horarios |
| `/admin/contact` | Mensajes recibidos del formulario |
| `/admin/theme` | Configuración de tema visual |

---

## 🔒 Seguridad

- Las rutas `/admin/*` redirigen a `/login` si no hay sesión activa.
- Si ya hay sesión activa y se accede a `/login`, redirige a `/admin`.
- Las operaciones de escritura (`POST`, `PUT`, `DELETE`) en todas las APIs requieren token JWT válido — responden `401` si no está autenticado.
- Las contraseñas se almacenan encriptadas con **bcryptjs** (nunca en texto plano).
- El cliente Prisma generado se ignora en Git (`/lib/generated/prisma`, `/app/generated/prisma`).

---

## ☁️ Despliegue en Vercel

La forma más sencilla de desplegar este proyecto es con [Vercel](https://vercel.com):

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new).
2. Agrega las variables de entorno del paso 3 en el panel de Vercel.
3. Vercel ejecutará `npm run build` automáticamente (`prisma generate && next build`).

> **Nota:** Asegúrate de que tu base de datos PostgreSQL sea accesible desde los servidores de Vercel. Se recomiendan servicios como [Neon](https://neon.tech), [Supabase](https://supabase.com) o [Railway](https://railway.app).

---

## 🤝 Contribuciones

1. Haz un fork del repositorio.
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -m 'feat: agrega nueva funcionalidad'`
4. Haz push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request.

---

## 📄 Licencia

ISC — consulta el archivo `package.json` para más detalles.