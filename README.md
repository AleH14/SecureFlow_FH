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

#### Software Requerido
- **Node.js** v16 o superior ([Descargar aquí](https://nodejs.org/))
- **MongoDB** v4.4 o superior
- **npm** (incluido con Node.js) o **yarn**
- **Git** ([Descargar aquí](https://git-scm.com/))

#### Verificar Instalaciones
Ejecuta los siguientes comandos para verificar que todo está instalado correctamente:

```bash
node --version    # Debe mostrar v16.x.x o superior
npm --version     # Debe mostrar 8.x.x o superior
git --version     # Debe mostrar 2.x.x o superior
mongo --version   # Debe mostrar 4.4.x o superior (si usas MongoDB local)
```

---

### 📦 INSTALACIÓN DE MONGODB

#### Windows
1. Descarga MongoDB Community Server desde [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Ejecuta el instalador `.msi`
3. Selecciona "Complete" installation
4. Marca "Install MongoDB as a Service"
5. Verifica la instalación:
   ```powershell
   mongod --version
   ```
6. Inicia el servicio (si no se inició automáticamente):
   ```powershell
   net start MongoDB
   ```

#### macOS
Usando Homebrew:
```bash
# Instalar Homebrew (si no lo tienes)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Iniciar MongoDB
brew services start mongodb-community@7.0

# Verificar
mongosh --version
```

#### Linux (Ubuntu/Debian)
```bash
# Importar clave pública
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Crear archivo de lista
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Actualizar paquetes e instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod

# Verificar
mongod --version
```

---

### PASO 1: CLONAR REPOSITORIO

#### Todas las Plataformas
```bash
git clone https://github.com/AleH14/SecureFlow_FH.git
cd SecureFlow_FH
```

**Nota:** Si no tienes acceso al repositorio, solicita permisos al administrador.

---

### PASO 2: CONFIGURAR BACKEND

#### 2.1 Instalar Dependencias

##### Windows (PowerShell/CMD)
```powershell
cd backend
npm install
```

##### macOS/Linux (Terminal)
```bash
cd backend
npm install
```

#### 2.2 Configurar Variables de Entorno

##### Windows (PowerShell)
```powershell
# Copiar archivo de ejemplo
Copy-Item .env.example .env

# Editar con Notepad
notepad .env
```

##### Windows (CMD)
```cmd
# Copiar archivo de ejemplo
copy .env.example .env

# Editar con Notepad
notepad .env
```

##### macOS/Linux
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con nano/vim/vscode
nano .env
# o
code .env
```

#### 2.3 Contenido del archivo `.env`

Edita el archivo `.env` con los siguientes valores:

```env
# Puerto del servidor
PORT=5000

# URL de conexión a MongoDB
# Para MongoDB local:
MONGODB_URI=mongodb://localhost:27017/secureflow

# Para MongoDB Atlas (nube):
# MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/secureflow?retryWrites=true&w=majority

# Secreto para JWT (genera uno aleatorio)
JWT_SECRET=tu_clave_secreta_muy_segura_y_aleatoria_12345

# Tiempo de expiración del token (en días)
JWT_EXPIRE=7d

# Entorno de ejecución
NODE_ENV=development
```

**Generar JWT_SECRET seguro:**

##### Windows (PowerShell)
```powershell
# Generar string aleatorio
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

##### macOS/Linux
```bash
# Generar string aleatorio
openssl rand -base64 32
```

#### 2.4 Iniciar el Backend

##### Windows (PowerShell/CMD)
```powershell
npm run dev
```

##### macOS/Linux
```bash
npm run dev
```

**Salida esperada:**
```
[nodemon] starting `node src/app.js`
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

Si ves errores de conexión a MongoDB, verifica que el servicio esté corriendo:

- **Windows:** `net start MongoDB`
- **macOS:** `brew services list`
- **Linux:** `sudo systemctl status mongod`

---

### PASO 3: CONFIGURAR FRONTEND

#### 3.1 Instalar Dependencias

Abre una **nueva terminal** (deja el backend corriendo) y ejecuta:

##### Windows (PowerShell/CMD)
```powershell
# Desde la raíz del proyecto
cd frontend
npm install
```

##### macOS/Linux
```bash
# Desde la raíz del proyecto
cd frontend
npm install
```

#### 3.2 Configurar Variables de Entorno

##### Windows (PowerShell)
```powershell
# Copiar archivo de ejemplo
Copy-Item .env.local.example .env.local

# Editar con Notepad
notepad .env.local
```

##### Windows (CMD)
```cmd
# Copiar archivo de ejemplo
copy .env.local.example .env.local

# Editar con Notepad
notepad .env.local
```

##### macOS/Linux
```bash
# Copiar archivo de ejemplo
cp .env.local.example .env.local

# Editar con nano/vim/vscode
nano .env.local
# o
code .env.local
```

#### 3.3 Contenido del archivo `.env.local`

```env
# URL de la API del backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Otras configuraciones opcionales
NEXT_PUBLIC_APP_NAME=SecureFlow
NEXT_PUBLIC_VERSION=1.0.0
```

**Nota:** Si el backend corre en un puerto diferente, ajusta la URL.

#### 3.4 Iniciar el Frontend

##### Opción 1: npm
```bash
npm run dev
```

##### Opción 2: yarn
```bash
yarn dev
```

##### Opción 3: pnpm
```bash
pnpm dev
```

##### Opción 4: bun
```bash
bun dev
```

**Salida esperada:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

---

### PASO 4: ACCEDER A LA APLICACIÓN

1. Abre tu navegador web
2. Navega a: **http://localhost:3000**
3. Deberías ver la página de login de SecureFlow

#### Usuario Administrador por Defecto

Al iniciar el backend por primera vez, el sistema **crea automáticamente** un usuario administrador con las siguientes credenciales:

```
📧 Email:      administrador@gmail.com
🔑 Contraseña: nti104
👤 Rol:        Administrador
```

**⚠️ IMPORTANTE:** 
- Cambia esta contraseña después del primer acceso por seguridad
- Este usuario solo se crea si la base de datos está vacía
- Una vez creados otros usuarios, puedes usar este administrador para gestionarlos

---

### 🛠️ SOLUCIÓN DE PROBLEMAS COMUNES

#### Error: "MongoDB connection failed"
**Solución:**
- Verifica que MongoDB esté corriendo:
  - **Windows:** `net start MongoDB`
  - **macOS:** `brew services start mongodb-community@7.0`
  - **Linux:** `sudo systemctl start mongod`
- Verifica la URL en `backend/.env` (debe ser `mongodb://localhost:27017/secureflow`)

#### Error: "Port 5000 already in use"
**Solución:**
- Cambia el puerto en `backend/.env` (ejemplo: `PORT=5001`)
- Mata el proceso que usa el puerto:
  - **Windows:** `netstat -ano | findstr :5000` y luego `taskkill /PID <PID> /F`
  - **macOS/Linux:** `lsof -ti:5000 | xargs kill -9`

#### Error: "Cannot connect to API"
**Solución:**
- Verifica que el backend esté corriendo (`http://localhost:5000/health` debe responder)
- Verifica la URL en `frontend/.env.local`
- Revisa la consola del navegador para ver errores CORS

#### Error: "Module not found"
**Solución:**
- Borra las carpetas `node_modules` y archivos `package-lock.json`
- Reinstala dependencias:
  ```bash
  # Dentro de backend/
  rm -rf node_modules package-lock.json
  npm install
  
  # Dentro de frontend/
  rm -rf node_modules package-lock.json
  npm install
  ```

#### Error: "Permission denied" (Linux/macOS)
**Solución:**
- Usa `sudo` para comandos que requieren permisos de administrador
- O cambia los permisos de las carpetas:
  ```bash
  sudo chown -R $USER:$USER ~/path/to/SecureFlow_FH
  ```

---

### 🔄 SCRIPTS DISPONIBLES

#### Backend
```bash
npm run dev          # Modo desarrollo con nodemon (auto-reload)
npm start            # Modo producción
npm test             # Ejecutar tests
```

#### Frontend
```bash
npm run dev          # Modo desarrollo (http://localhost:3000)
npm run build        # Compilar para producción
npm start            # Servidor de producción
npm run lint         # Verificar código con ESLint
npm test             # Ejecutar tests con Jest
```

---

### 📝 NOTAS ADICIONALES

#### Puertos Predeterminados
- **Backend API:** `http://localhost:5000`
- **Frontend:** `http://localhost:3000`
- **MongoDB:** `localhost:27017`

#### Roles Disponibles
- `administrador` - Acceso completo al sistema
- `responsable_seguridad` - Aprobación de solicitudes
- `auditor` - Solo lectura y comentarios
- `usuario` - Creación de solicitudes

#### Estructura de Base de Datos
Al iniciar por primera vez, MongoDB creará automáticamente:
- Base de datos: `secureflow`
- Colecciones: `users`, `activos`, `solicitudcambios`

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


---

## 👨‍💻 Desarrolladores

Este proyecto fue desarrollado por:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/MelissaFloresA">
        <img src="https://github.com/MelissaFloresA.png" width="100px;" alt="Melissa FLores"/><br />
        <sub><b>Melissa FLores</b></sub>
      </a><br />
      <a href="https://github.com/MelissaFloresA">@MelissaFloresA</a>
    </td>
    <td align="center">
      <a href="https://github.com/AleH14">
        <img src="https://github.com/AleH14.png" width="100px;" alt="Alejandro Hernandez"/><br />
        <sub><b>Alejandro Hernandez</b></sub>
      </a><br />
      <a href="https://github.com/AleH14">@AleH14</a>
    </td>
  </tr>
</table>

---