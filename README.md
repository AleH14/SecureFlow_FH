<div>

# 🛡️ SISTEMA SECUREFLOW_FH - SGSI ISO 27001
![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=fff&style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=node.js&logoColor=fff&style=for-the-badge)
![Express](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff&style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000?logo=jsonwebtokens&logoColor=fff&style=for-the-badge)

**Sistema de Gestión de Seguridad de la Información · Control de Cambios · Gestión de Activos**

</div>

## 📋 DESCRIPCIÓN GENERAL

Sistema de Gestión de Seguridad de la Información (SGSI) desarrollado bajo los estándares ISO 27001 para la gestión de activos de información y control de cambios en organizaciones. Implementa un proceso formal de solicitud, aprobación y trazabilidad de modificaciones a activos críticos.

---

## 🏗️ ESTRUCTURA DEL PROYECTO
```
SECUREFLOW/
├── 📁 backend/
│ ├── 📁 src/
│ │ ├── 📁 config/
│ │ │ └── database.js           # Configuración de conexión a la base de datos MongoDB
│ │ ├── 📁 middleware/
│ │ │ ├── auth.js               # Middleware de autenticación y autorización JWT
│ │ │ └── errorHandler.js       # Manejo centralizado de errores HTTP
│ │ ├── 📁 models/              # modelos de colecciones para base de datos
│ │ │ ├── activo.js
│ │ │ ├── index.js
│ │ │ ├── solicitudCambio.js
│ │ │ └── user.js
│ │ ├── 📁 routes/           
│ │ │ ├── index.js              # Enrutador principal que importa todas las rutas
│ │ │ ├── auth.js               # Rutas de autenticación (login, registro, logout)
│ │ │ ├── users.js              # Rutas CRUD para gestión de usuarios
│ │ │ ├── activos.js            # Rutas CRUD para gestión de activos
│ │ │ └── solicitudes.js        # Rutas para gestión de solicitudes de cambio
│ │ └── 📁 utils/
│ │ └── helpers.js              # Funciones auxilires de generación de código e inputs
│ ├── package.json
│ ├── .env.example
│ └── README.md
│
└── 📁 frontend/
├── 📁 app/
│ ├── layout.jsx                # Plantilla principal de configuración
│ ├── page.jsx                  # Home, página principal 
│ └── 📁 admin/
│ └── page.jsx
├── 📁 components/
│ ├── 📁 ui/                   # componentes reutilizables de interfacez
│ ├── 📁 shared/               # interfacez compartidas entre roles
│ ├── 📁 admin/                # Contiene vistas de administrador
│ ├── 📁 auditor/              # Contiene vistas de auditor
│ ├── 📁 seguridad/            # Contiene vistas de responsable de seguridad
│ └── 📁 usuario/              # Contiene vistas de usuario lector
├── 📁 services/
│   ├── api.js                 # Configuración base de Axios (interceptores, headers)
│   ├── index.js               # Archivo índice para exportar todos los servicios
│   ├── authService.js         # Funciones para autenticación (login, logout, registro)
│   ├── userService.js         # Funciones para manejo  de usuarios
│   ├── activoService.js       # Funciones para manejo de activos
│   └── requestService.js      # Funciones para gestión de solicitudes
├── 📁 middleware/
│ └── ProtectedRoute.jsx       # Componente para proteger rutas por roles
├── package.json
├── .env.local.example
└── README.md
```

---

## 🔧 TECNOLOGÍAS UTILIZADAS

### BACKEND
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación por tokens
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Control de acceso entre dominios

### FRONTEND
- **Next.js 14** - Framework React con App Router
- **React.js** - Biblioteca para interfaces
- **React Bootstrap** - Componentes UI
- **Axios** - Cliente HTTP
- **React Icons** - Iconografía
- **Context API** - Gestión de estado

---

## 🎯 OBJETIVOS DEL SISTEMA

### 1. GESTIÓN DE ACTIVOS
- Mantener inventario de activos de información
- Clasificar activos por categorías (Datos, Sistemas, Infraestructura, Personas)
- Asignar responsables por activo
- Control de cambios de activos

### 2. CONTROL DE CAMBIOS ISO 27001
- Implementar proceso formal de solicitud de cambios
- Establecer flujo de aprobación según roles
- Mantener trazabilidad completa de modificaciones
- Generar comentario de auditorías

### 3. GESTIÓN DE USUARIOS Y ROLES
- Definir perfiles de acceso (Administrador, Responsable de Seguridad, Auditor, Usuario)
- Controlar permisos por rol de usuario
- Gestionar estados de cuenta (activo/inactivo)

---

## 📊 FUNCIONALIDADES PRINCIPALES

### PARA ADMINISTRADORES
- Gestión completa de usuarios (CRUD)
- Visualización de activos del sistema
- Reasignación de activos entre usuarios
- Visualización de hisotorial de activos

### PARA RESPONSABLES DE SEGURIDAD
- Revisión y aprobación de solicitudes de cambio
- Evaluación de impacto de modificaciones
- Comentarios y justificaciones de decisiones
- Historial de aprobaciones
- Visualización de activos del sistema

### PARA AUDITORES
- Consulta de solicitudes y cambios
- Adición de comentarios de auditoría
- Visualización de activos del sistema

### PARA USUARIOS
- Creación de nuevos activos
- Modificación de activos asignados
- Seguimiento de solicitudes propias
- Consulta de historial de cambios

---


### FLUJO DE APROBACIÓN DE CAMBIOS
- Usuario → Solicita cambio → Genera solicitud
- Responsable de Seguridad revisa → Aprueba/Rechaza
- Si aprobado: Se aplica cambio
- Auditor puede comentar → Historial registrado


---

## 🚀 INSTALACIÓN Y CONFIGURACIÓN

### PREREQUISITOS
- Node.js v16 o superior
- MongoDB (local)
- npm o yarn
- Git

### PASO 1: CLONAR REPOSITORIO
```bash
git clone https://github.com/tu-usuario/secureflow.git
cd secureflow
```
### PASO 2: CONFIGURAR BACKEND
```
cd backend
npm install
cp .env.example .env
```
#### Iniciar backend
```
npm run dev
```

### PASO 3: CONFIGURAR FRONTEND
```
cd frontend
npm install
```
#### Iniciar frontend
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 🔗 API Endpoints

### Health Check
- `GET /health` - Server health status

### API Base
- `GET /api` - API information and available endpoints

### Authentication 
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

## 🔐 CONSIDERACIONES DE SEGURIDAD

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request rate limiting
- **Input Validation** - Request validation 
- **JWT Authentication** - Token-based authentication 

### 1. AUTENTICACIÓN Y AUTORIZACIÓN
- Tokens JWT con expiración
- Hash de contraseñas con bcrypt
- Validación de roles en cada endpoint
- Middleware de autenticación global

### VALIDACIÓN DE DATOS
- Sanitización de inputs
- Validación de formatos (email, teléfono)
- Verificación de permisos por recurso
- Control de acceso según departamento

### TRAZABILIDAD
- Log de todas las operaciones
- Historial completo de cambios
- Información de usuario y timestamp
- Comentarios obligatorios para modificaciones

## 🗃️ File Structure Style

```
src/styles/
├── index.css          # Main entry point - imports all other style files
├── variables.css      # Color palette and CSS custom properties
├── buttons.css        # Button styles and variants
├── forms.css          # Input, select, and form-related styles
├── components.css     # Card, alert, and component styles
├── layouts.css        # Page layouts and containers
└── responsive.css     # Media queries and responsive styles
```
## Color Palette

The application uses a consistent color palette defined in `variables.css`:
- **Navy**: `#000080` (Primary)
- **Crayola Blue**: `#2c75ff` (Secondary)
- **Silver**: `#c6bfbf` (Neutral)
- **Black**: `#000000`
- **White**: `#ffffff`


## 📊 CUMPLIMIENTO ISO 27001
EVIDENCIA GENERADA
- Registro de cambios con fecha/hora y usuario
- Justificación documentada para cada modificación
- Aprobaciones por rol autorizado (Responsable Seguridad)
- Historial completo de cada activo
- Trazabilidad usuario → responsable → cambios

