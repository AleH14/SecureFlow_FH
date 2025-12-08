# Documentación del Backend - SecureFlow

## Descripción General

SecureFlow Backend es una API RESTful construida con Node.js y Express que gestiona el sistema de administración de activos y solicitudes de cambio. Proporciona autenticación segura, control de acceso basado en roles y un sistema completo de gestión de activos tecnológicos.

## Tecnologías Principales

- **Node.js** (>=16.0.0): Entorno de ejecución JavaScript
- **Express.js** (4.18.2): Framework web para Node.js
- **MongoDB**: Base de datos NoSQL para almacenamiento de datos
- **Mongoose** (9.0.0): ODM (Object Data Modeling) para MongoDB
- **JWT**: Autenticación basada en tokens
- **bcryptjs**: Encriptación de contraseñas

---

## 📑 Índice

1. [Archivo Principal: app.js](#-archivo-principal-appjs)
2. [Configuración: /src/config](#-carpeta-srcconfig)
   - [database.js](#databasejs)
   - [initDatabase.js](#initdatabasejs)
3. [Middleware: /src/middleware](#-carpeta-srcmiddleware)
   - [auth.js](#authjs)
   - [errorHandler.js](#errorhandlerjs)
4. [Modelos: /src/models](#-carpeta-srcmodels)
   - [user.js](#userjs)
   - [activo.js](#activojs)
   - [solicitudCambio.js](#solicitudcambiojs)
   - [index.js](#indexjs)
5. [Rutas: /src/routes](#-carpeta-srcroutes)
   - [index.js](#indexjs-1)
   - [auth.js](#authjs-1)
   - [users.js](#usersjs)
   - [activos.js](#activosjs)
   - [solicitudes.js](#solicitudesjs)
6. [Utilidades: /src/utils](#-carpeta-srcutils)
   - [helpers.js](#helpersjs)

---

## 📄 Archivo Principal: `app.js`

**Ubicación**: `/src/app.js`

**Propósito**: Punto de entrada principal de la aplicación que configura Express, middlewares de seguridad, rutas y la conexión a la base de datos.

### Dependencias Importadas

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
```

**Módulos de seguridad**:
- `helmet`: Protección contra vulnerabilidades web comunes
- `cors`: Manejo de Cross-Origin Resource Sharing
- `express-rate-limit`: Limitación de peticiones por IP
- `dotenv`: Carga de variables de entorno

**Módulos de utilidad**:
- `morgan`: Logger de peticiones HTTP
- `compression`: Compresión de respuestas HTTP

### Configuración de Seguridad

#### 1. **Helmet - Seguridad HTTP Headers**

```javascript
app.use(helmet());
```

**Descripción**: Configura headers HTTP seguros automáticamente.

**Headers configurados**:
- `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- `X-Frame-Options: DENY` - Previene clickjacking
- `X-XSS-Protection: 1; mode=block` - Protección XSS en navegadores antiguos
- `Strict-Transport-Security` - Fuerza HTTPS
- Y otros headers de seguridad

---

#### 2. **Rate Limiting - Limitación de Peticiones**

```javascript
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);
```

**Descripción**: Limita el número de peticiones por IP para prevenir ataques de fuerza bruta y DDoS.

**Configuración**:
- `windowMs`: Ventana de tiempo (por defecto: 15 minutos = 900,000 ms)
- `max`: Máximo de peticiones por ventana (por defecto: 100)
- `message`: Mensaje de error cuando se excede el límite

**Variables de entorno**:
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Ejemplo de comportamiento**:
- Usuario hace 100 peticiones en 15 minutos → OK
- Usuario hace petición 101 → Error 429 "Too many requests"
- Después de 15 minutos → Contador se reinicia

---

#### 3. **CORS - Cross-Origin Resource Sharing**

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
```

**Descripción**: Configura qué dominios pueden acceder a la API.

**Opciones configuradas**:

| Opción | Valor | Descripción |
|--------|-------|-------------|
| `origin` | `http://localhost:3000` | Origen permitido (frontend) |
| `credentials` | `true` | Permite envío de cookies/auth headers |
| `methods` | Array | Métodos HTTP permitidos |
| `allowedHeaders` | Array | Headers permitidos en peticiones |
| `optionsSuccessStatus` | `200` | Status para peticiones OPTIONS |

**Métodos permitidos**:
- `GET`: Obtener recursos
- `POST`: Crear recursos
- `PUT`: Actualizar recursos
- `DELETE`: Eliminar recursos
- `OPTIONS`: Preflight requests

**Headers permitidos**:
- `Content-Type`: Tipo de contenido (JSON, etc.)
- `Authorization`: Token JWT para autenticación
- `X-Requested-With`: Identificación de peticiones AJAX

**Variable de entorno**:
```env
CORS_ORIGIN=http://localhost:3000
# En producción: https://tudominio.com
```

---

### Middlewares de Parseo

#### 4. **Body Parsing**

```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

**Descripción**: Parsea el cuerpo de las peticiones HTTP.

**`express.json()`**:
- Parsea peticiones con `Content-Type: application/json`
- Convierte JSON a objeto JavaScript
- Límite: 10MB por petición

**`express.urlencoded()`**:
- Parsea peticiones con `Content-Type: application/x-www-form-urlencoded`
- `extended: true` - Usa librería `qs` para parsing avanzado
- Permite objetos anidados en formularios
- Límite: 10MB por petición

**Ejemplo de uso**:
```javascript
// Cliente envía:
POST /api/users
Content-Type: application/json
{
  "nombre": "Juan",
  "email": "juan@example.com"
}

// Express parsea automáticamente:
req.body = {
  nombre: "Juan",
  email: "juan@example.com"
}
```

---

#### 5. **Compression - Compresión de Respuestas**

```javascript
app.use(compression());
```

**Descripción**: Comprime las respuestas HTTP usando gzip/deflate.

**Ventajas**:
- Reduce tamaño de respuestas (hasta 70-90%)
- Mejora velocidad de carga
- Reduce uso de ancho de banda

**Ejemplo**:
- Respuesta sin comprimir: 500 KB
- Respuesta comprimida: 50-100 KB (80-90% reducción)

---

#### 6. **Morgan - Logger HTTP**

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
```

**Descripción**: Registra todas las peticiones HTTP en consola.

**Modo desarrollo** (`dev`):
```
GET /api/users 200 45.123 ms - 1234
POST /api/auth/login 401 12.456 ms - 89
```
- Formato corto y colorizado
- Muestra método, ruta, status, tiempo y tamaño

**Modo producción** (`combined`):
```
::1 - - [07/Dec/2025:10:30:00 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0..."
```
- Formato Apache estándar
- Incluye IP, timestamp, user-agent
- Ideal para logs de producción

---

### Endpoints del Sistema

#### 7. **Health Check**

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});
```

**Descripción**: Endpoint para verificar que el servidor está funcionando.

**Ruta**: `GET /health`

**Acceso**: Público (no requiere autenticación)

**Response** (200):
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-12-07T10:30:00.000Z",
  "uptime": 3600.123,
  "environment": "development"
}
```

**Campos**:
- `status`: Estado del servidor (siempre "OK")
- `message`: Mensaje descriptivo
- `timestamp`: Fecha/hora actual en formato ISO
- `uptime`: Tiempo en segundos que lleva ejecutándose el proceso
- `environment`: Entorno actual (development/production)

**Uso**:
- Monitoreo de infraestructura
- Load balancers para verificar disponibilidad
- Scripts de health checks automáticos

---

#### 8. **Rutas de la API**

```javascript
app.use(process.env.API_PREFIX || '/api', apiRoutes);
```

**Descripción**: Monta todas las rutas de la API bajo el prefijo `/api`.

**Prefijo**: `/api` (configurable via `API_PREFIX` en `.env`)

**Rutas registradas**:
- `/api/auth` → Autenticación (login, register)
- `/api/users` → Gestión de usuarios
- `/api/activos` → Gestión de activos
- `/api/solicitudes` → Gestión de solicitudes de cambio

**Variable de entorno**:
```env
API_PREFIX=/api
# Cambiar a /v1 o /v2 para versionado
```

---

#### 9. **Handler 404 - Ruta No Encontrada**

```javascript
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});
```

**Descripción**: Captura todas las rutas no definidas y retorna error 404.

**Comportamiento**:
- Se ejecuta cuando ninguna ruta coincide
- `'*'` coincide con cualquier ruta
- Debe estar ANTES del error handler

**Response** (404):
```json
{
  "error": "Route not found",
  "message": "Cannot GET /api/not-existing-route",
  "timestamp": "2025-12-07T10:30:00.000Z"
}
```

**Ejemplo**:
```bash
GET /api/invalid-route
# Response: 404 "Cannot GET /api/invalid-route"

POST /api/wrong/path
# Response: 404 "Cannot POST /api/wrong/path"
```

---

#### 10. **Error Handler Global**

```javascript
app.use(errorHandler);
```

**Descripción**: Middleware de manejo centralizado de errores.

**Ubicación**: `./middleware/errorHandler.js`

**Características**:
- Debe ser el ÚLTIMO middleware registrado
- Captura todos los errores no manejados
- Formatea respuestas de error consistentemente
- Maneja errores de Mongoose, JWT, validación, etc.

**Orden correcto**:
```javascript
// 1. Middlewares normales
app.use(express.json());
app.use(cors());

// 2. Rutas
app.use('/api', apiRoutes);

// 3. 404 handler
app.use('*', handle404);

// 4. Error handler (ÚLTIMO)
app.use(errorHandler);
```

---

### Función de Inicio del Servidor

#### `startServer()`

```javascript
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize database with default admin user if empty
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
```

**Descripción**: Función asíncrona que inicia el servidor en el orden correcto.

**Flujo de inicio**:

1. **Conexión a MongoDB**:
   ```javascript
   await connectDB();
   ```
   - Conecta a la base de datos MongoDB
   - Muestra información de conexión en consola
   - Si falla, termina el proceso con error

2. **Inicialización de base de datos**:
   ```javascript
   await initializeDatabase();
   ```
   - Verifica si la base de datos está vacía
   - Si está vacía, crea usuario administrador por defecto
   - Si ya tiene usuarios, no hace nada

3. **Inicio del servidor HTTP**:
   ```javascript
   app.listen(PORT, () => {
     console.log(`🚀 Server running on port ${PORT}`);
   });
   ```
   - Inicia el servidor en el puerto configurado
   - Por defecto: puerto 5000
   - Muestra mensaje de confirmación

**Mensajes en consola** (inicio exitoso):
```
🔗 Attempting to connect to: mongodb://127.0.0.1:27017/secureflow_dev
🌍 Environment: development
📊 MongoDB Connected: 127.0.0.1
📁 Database: secureflow_dev
✅ Base de datos ya inicializada
🚀 Server running on port 5000
```

**Mensajes en consola** (primera vez):
```
🔗 Attempting to connect to: mongodb://127.0.0.1:27017/secureflow_dev
🌍 Environment: development
📊 MongoDB Connected: 127.0.0.1
📁 Database: secureflow_dev
🔧 Inicializando base de datos...
👤 Creando usuario administrador por defecto...
✅ Usuario administrador creado exitosamente
📧 Email: administrador@gmail.com
🔑 Contraseña: nti104
🆔 Código: ADM-123456
⚠️  IMPORTANTE: Cambia esta contraseña después del primer acceso
🚀 Server running on port 5000
```

**Manejo de errores**:
```javascript
catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
}
```
- Captura cualquier error durante el inicio
- Muestra mensaje de error
- Termina el proceso con código 1 (error)

**Variable de entorno**:
```env
PORT=5000
```

---

### Variables de Entorno

El archivo `.env` debe contener las siguientes variables:

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://127.0.0.1:27017/secureflow_dev

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API
API_PREFIX=/api
```

---

### Exportación del Módulo

```javascript
module.exports = app;
```

**Descripción**: Exporta la aplicación Express para testing.

**Uso en tests**:
```javascript
const app = require('../src/app');
const request = require('supertest');

describe('API Tests', () => {
  it('should return health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });
});
```

---

### Orden de Ejecución de Middlewares

El orden de los middlewares es crítico en Express:

```javascript
1. helmet()              // Seguridad headers
2. rateLimiter()         // Limitación de peticiones
3. cors()                // CORS
4. express.json()        // Parseo JSON
5. express.urlencoded()  // Parseo formularios
6. compression()         // Compresión
7. morgan()              // Logging
8. /health               // Health check
9. /api/*                // Rutas de la API
10. 404 handler          // Rutas no encontradas
11. errorHandler()       // Manejo de errores (ÚLTIMO)
```

**Regla importante**: 
- El error handler SIEMPRE debe ser el último middleware
- El 404 handler debe estar antes del error handler
- Los middlewares se ejecutan en el orden que se registran

---

### Diagrama de Flujo de una Petición

```
Cliente → [Helmet] → [Rate Limiter] → [CORS] → [Body Parser] → 
[Compression] → [Morgan] → [Rutas/Controladores] → 
[Formato de Respuesta] → [Compression] → Cliente

Si hay error en cualquier punto:
→ [Error Handler] → [Formato de Error] → Cliente

Si no hay ruta:
→ [404 Handler] → Cliente
```

---

### Características de Seguridad Implementadas

| Característica | Middleware | Protege contra |
|----------------|------------|----------------|
| HTTP Headers seguros | helmet | XSS, clickjacking, MIME sniffing |
| Rate Limiting | express-rate-limit | Ataques de fuerza bruta, DDoS |
| CORS | cors | Acceso no autorizado desde otros dominios |
| Body Size Limit | express.json/urlencoded | Ataques de payload grandes |
| Input Sanitization | helpers.sanitizeInput | XSS, inyección HTML |
| JWT | jsonwebtoken | Acceso no autorizado |
| Password Hashing | bcryptjs | Robo de contraseñas |

---

### Recomendaciones de Producción

**Configuración de producción**:

1. **Variables de entorno**:
   ```env
   NODE_ENV=production
   PORT=80
   MONGODB_URI=mongodb://usuario:pass@host:puerto/db
   JWT_SECRET=clave_super_segura_aleatoria_de_64_caracteres_minimo
   CORS_ORIGIN=https://tudominio.com
   RATE_LIMIT_MAX_REQUESTS=50
   ```

2. **Seguridad adicional**:
   - Usar HTTPS (SSL/TLS)
   - Configurar firewall
   - Usar reverse proxy (nginx)
   - Habilitar logging a archivos
   - Monitoreo de errores (Sentry, etc.)

3. **Base de datos**:
   - Usar MongoDB Atlas o servidor dedicado
   - Configurar autenticación
   - Hacer backups regulares
   - Usar réplicas para alta disponibilidad

4. **Optimización**:
   - Usar PM2 o similar para gestión de procesos
   - Habilitar clustering
   - Configurar cache (Redis)
   - CDN para assets estáticos

---

## Estructura del Proyecto

```
backend/
│
├── src/                          # Código fuente principal
│   ├── app.js                    # Punto de entrada de la aplicación
│   ├── config/                   # Configuraciones del sistema
│   │   ├── database.js           # Configuración de conexión a MongoDB
│   │   └── initDatabase.js       # Inicialización de base de datos
│   │
│   ├── middleware/               # Middlewares personalizados
│   │   ├── auth.js               # Autenticación y autorización JWT
│   │   └── errorHandler.js       # Manejo centralizado de errores
│   │
│   ├── models/                   # Modelos de datos (Mongoose Schemas)
│   │   ├── user.js               # Modelo de usuarios
│   │   ├── activo.js             # Modelo de activos
│   │   ├── solicitudCambio.js    # Modelo de solicitudes de cambio
│   │   └── index.js              # Exportación centralizada de modelos
│   │
│   ├── routes/                   # Definición de rutas de la API
│   │   ├── auth.js               # Rutas de autenticación (login, register)
│   │   ├── users.js              # Rutas de gestión de usuarios
│   │   ├── activos.js            # Rutas de gestión de activos
│   │   ├── solicitudes.js        # Rutas de solicitudes de cambio
│   │   └── index.js              # Router principal que agrupa todas las rutas
│   │
│   └── utils/                    # Funciones utilitarias
│       └── helpers.js            # Funciones auxiliares reutilizables
│
├── tests/                        # Pruebas automatizadas
│   └── app.test.js               # Tests de la aplicación
│
├── .env                          # Variables de entorno (no versionado)
├── .env.example                  # Plantilla de variables de entorno
├── package.json                  # Dependencias y scripts del proyecto
├── jest.config.json              # Configuración de Jest para testing
├── Dockerfile                    # Configuración para contenedor Docker
└── README.md                     # Documentación básica del proyecto
```

## Descripción de Carpetas y Archivos

### 📁 `/src`
Contiene todo el código fuente de la aplicación.

#### 📄 `app.js`
Archivo principal que:
- Inicializa la aplicación Express
- Configura middlewares de seguridad (Helmet, CORS, Rate Limiting)
- Establece conexión con MongoDB
- Inicializa la base de datos con usuario administrador por defecto
- Registra todas las rutas de la API
- Maneja errores globales

### 📁 `/src/config`
Configuraciones del sistema y servicios externos.

#### 📄 `database.js`
- Gestiona la conexión a MongoDB
- Configura opciones de conexión (timeouts, pools)
- Maneja errores de conexión
- Soporta múltiples entornos (development, production)

#### 📄 `initDatabase.js`
- Verifica si la base de datos está vacía al iniciar el servidor
- Crea automáticamente un usuario administrador por defecto si no existen usuarios
- Credenciales del administrador inicial:
  - **Email**: administrador@gmail.com
  - **Contraseña**: ntil10
  - **Rol**: administrador

### 📁 `/src/middleware`
Funciones intermedias que procesan las peticiones HTTP.

#### 📄 `auth.js`
- **Autenticación JWT**: Verifica tokens en las peticiones protegidas
- **Autorización por roles**: Controla acceso según rol del usuario (administrador, responsable_seguridad, auditor, usuario)
- Extrae información del usuario del token y la adjunta a `req.user`

#### 📄 `errorHandler.js`
- Middleware centralizado para manejo de errores
- Captura errores de validación de Mongoose
- Formatea respuestas de error de manera consistente
- Registra errores en consola para debugging

### 📁 `/src/models`
Define los esquemas de datos usando Mongoose.

#### 📄 `user.js`
Modelo de usuarios del sistema con campos:
- `codigo`: Identificador único del usuario
- `nombre`, `apellido`: Información personal
- `email`: Correo electrónico (único)
- `telefono`: Número de contacto
- `rol`: administrador | responsable_seguridad | auditor | usuario
- `departamento`: Área a la que pertenece
- `contrasenaHash`: Contraseña encriptada
- `estado`: activo | inactivo
- `activosCreados`: Referencia a activos creados por el usuario
- `solicitudes`: Referencia a solicitudes realizadas

#### 📄 `activo.js`
Modelo de activos tecnológicos con campos:
- `codigo`: Identificador único del activo
- `nombre`, `descripcion`: Información básica
- `categoria`: hardware | software | red | otro
- `tipo`: Subtipo específico del activo
- `ubicacion`: Ubicación física o lógica
- `estado`: activo | inactivo | en_mantenimiento | de_baja
- `responsableId`: Usuario responsable del activo
- `creadoPorId`: Usuario que creó el registro
- `fechaCreacion`, `fechaUltimaModificacion`: Timestamps
- `valorEstimado`, `numeroSerie`, `marca`, `modelo`: Datos adicionales

#### 📄 `solicitudCambio.js`
Modelo de solicitudes de cambio con campos:
- `codigoSolicitud`: Identificador único de la solicitud
- `tipoOperacion`: creacion | modificacion | eliminacion
- `tipoSolicitud`: creacion | modificacion | eliminacion (alias)
- `estado`: Pendiente | Aprobado | Rechazado
- `activoId`: Referencia al activo afectado
- `nombreActivo`, `codigoActivo`: Información del activo
- `solicitanteId`: Usuario que solicita el cambio
- `responsableSeguridadId`: Usuario de seguridad que revisa
- `cambios`: Array de cambios solicitados con `campo`, `valorAnterior`, `valorNuevo`
- `justificacion`: Razón del cambio
- `comentarioSeguridad`: Comentario del revisor
- `fechaSolicitud`, `fechaRevision`: Timestamps

#### 📄 `index.js`
Exporta todos los modelos de manera centralizada para facilitar las importaciones.

### 📁 `/src/routes`
Define los endpoints de la API REST.

#### 📄 `auth.js`
Rutas de autenticación:
- `POST /api/auth/register`: Registro de nuevos usuarios
- `POST /api/auth/login`: Inicio de sesión (retorna JWT)

#### 📄 `users.js`
Rutas de gestión de usuarios (requieren autenticación):
- `GET /api/users`: Listar todos los usuarios
- `GET /api/users/:id`: Obtener usuario específico
- `PUT /api/users/:id`: Actualizar usuario
- `DELETE /api/users/:id`: Eliminar usuario (solo administrador)

#### 📄 `activos.js`
Rutas de gestión de activos (requieren autenticación):
- `GET /api/activos`: Listar activos con filtros y paginación
- `GET /api/activos/:id`: Obtener activo específico
- `POST /api/activos`: Crear nuevo activo
- `PUT /api/activos/:id`: Actualizar activo
- `DELETE /api/activos/:id`: Eliminar activo

#### 📄 `solicitudes.js`
Rutas de solicitudes de cambio (requieren autenticación):
- `GET /api/solicitudes`: Listar solicitudes con filtros
- `GET /api/solicitudes/:id`: Obtener solicitud específica con datos poblados
- `POST /api/solicitudes`: Crear nueva solicitud
- `PUT /api/solicitudes/:id`: Actualizar solicitud
- `PUT /api/solicitudes/:id/revisar`: Aprobar/rechazar solicitud (solo seguridad)

#### 📄 `index.js`
Router principal que:
- Agrupa todas las rutas bajo el prefijo `/api`
- Aplica middlewares de autenticación donde sea necesario
- Organiza las rutas por dominio (auth, users, activos, solicitudes)

### 📁 `/src/utils`
Funciones auxiliares y herramientas reutilizables.

#### 📄 `helpers.js`
Contiene funciones utilitarias como:
- Generación de códigos únicos
- Formateo de datos
- Validaciones personalizadas
- Funciones de fecha y tiempo

### 📁 `/tests`
Pruebas automatizadas del sistema.

#### 📄 `app.test.js`
Tests unitarios e integración usando Jest y Supertest:
- Pruebas de endpoints de autenticación
- Pruebas de operaciones CRUD
- Validación de middlewares
- Tests de manejo de errores

## Variables de Entorno

El archivo `.env` contiene configuraciones sensibles:

```env
# Puerto del servidor
PORT=5000

# Entorno de ejecución
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/secureflow_dev

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API
API_PREFIX=/api
```

## Scripts Disponibles

```bash
# Iniciar servidor en producción
npm start

# Iniciar servidor en desarrollo (con auto-reload)
npm run dev

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm test:watch

# Verificar código con ESLint
npm run lint

# Corregir errores de lint automáticamente
npm run lint:fix
```

## Seguridad Implementada

- **Helmet**: Protección contra vulnerabilidades web comunes
- **CORS**: Control de acceso desde orígenes externos
- **Rate Limiting**: Prevención de ataques de fuerza bruta
- **JWT**: Autenticación sin estado
- **bcryptjs**: Hash seguro de contraseñas (10 rounds)
- **Validación de entrada**: Sanitización de datos

## Middleware de Seguridad

1. **Helmet**: Configura headers HTTP seguros
2. **CORS**: Permite peticiones desde el frontend
3. **Rate Limiter**: 100 peticiones por IP cada 15 minutos
4. **Compression**: Comprime respuestas HTTP
5. **Morgan**: Logging de peticiones HTTP
6. **JSON Parser**: Parsea cuerpos de peticiones JSON

## Inicialización del Sistema

Al iniciar el servidor por primera vez:
1. Se conecta a MongoDB
2. Verifica si existen usuarios en la base de datos
3. Si está vacía, crea automáticamente el usuario administrador
4. Inicia el servidor Express en el puerto configurado

## Base de Datos

**MongoDB** se utiliza como base de datos principal:
- **Base de datos de desarrollo**: `secureflow_dev`
- **Base de datos de producción**: `secureflow_prod`
- **Puerto por defecto**: 27017
- **Host**: localhost (127.0.0.1)

---

## Funciones Principales por Archivo

### 📁 Carpeta `/src/config`

Esta carpeta contiene las configuraciones esenciales del sistema, incluyendo la conexión a la base de datos y la inicialización de datos por defecto.

---

#### 📄 `database.js`

**Propósito**: Gestionar la conexión con MongoDB y configurar diferentes ambientes.

##### **Constante: `dbConfig`**
```javascript
const dbConfig = {
  development: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secureflow_dev',
  },
  production: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/secureflow_prod',
  }
};
```
- **Descripción**: Objeto de configuración que almacena las URIs de conexión para diferentes entornos
- **Entornos soportados**:
  - `development`: Base de datos local para desarrollo (`secureflow_dev`)
  - `production`: Base de datos para producción (`secureflow_prod`)
- **Variables de entorno**: Lee `MONGODB_URI` del archivo `.env` si está disponible
- **Valores por defecto**: Conexión a MongoDB local en `127.0.0.1:27017`

##### **Función: `connectDB()`**
```javascript
const connectDB = async () => {
  try {
    const config = dbConfig[process.env.NODE_ENV || 'development'];
    
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    const conn = await mongoose.connect(config.uri, options);
    
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};
```

**Descripción**: Establece la conexión con MongoDB usando Mongoose.

**Parámetros**: Ninguno

**Retorna**: 
- `true` si la conexión es exitosa
- Termina el proceso (`process.exit(1)`) si falla

**Flujo de ejecución**:
1. Selecciona la configuración según `NODE_ENV` (development o production)
2. Muestra en consola el URI de conexión y el entorno
3. Configura opciones de conexión:
   - `serverSelectionTimeoutMS: 5000` - Timeout de 5 segundos para seleccionar servidor
   - `socketTimeoutMS: 45000` - Cierra sockets inactivos después de 45 segundos
4. Intenta conectar a MongoDB usando `mongoose.connect()`
5. Si tiene éxito:
   - Muestra el host conectado
   - Muestra el nombre de la base de datos
   - Retorna `true`
6. Si falla:
   - Captura el error
   - Muestra mensaje de error con detalles
   - Proporciona sugerencias para solucionar el problema
   - Termina el proceso con código de error

**Mensajes de error incluidos**:
- URI intentada
- Instrucciones para ejecutar MongoDB en Windows
- Verificación del servicio MongoDB
- Puerto por defecto (27017)

**Uso típico**:
```javascript
await connectDB();
```

---

#### 📄 `initDatabase.js`

**Propósito**: Inicializar automáticamente la base de datos con un usuario administrador cuando el sistema se ejecuta por primera vez.

##### **Función: `initializeDatabase()`**
```javascript
const initializeDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('✅ Base de datos ya inicializada');
      return;
    }

    const contrasenaHash = await bcrypt.hash('nti104', 10);
    const codigo = `ADM-${Date.now().toString().slice(-6)}`;

    const adminUser = new User({
      codigo: codigo,
      nombre: 'Administrador',
      apellido: 'Principal',
      email: 'administrador@gmail.com',
      telefono: '23301999',
      rol: 'administrador',
      departamento: 'Tecnologia_de_la_Informacion',
      fechaCreacion: new Date(),
      activosCreados: [],
      solicitudes: [],
      contrasenaHash: contrasenaHash,
      estado: 'activo'
    });

    await adminUser.save();

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email: administrador@gmail.com');
    console.log('🔑 Contraseña: nti104');
    console.log('🆔 Código: ' + codigo);
    console.log('⚠️  IMPORTANTE: Cambia esta contraseña después del primer acceso');

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
    throw error;
  }
};
```

**Descripción**: Verifica si la base de datos está vacía y crea automáticamente un usuario administrador por defecto.

**Parámetros**: Ninguno

**Retorna**: 
- `undefined` (void) - Opera por efectos secundarios
- Lanza error si falla la creación

**Flujo de ejecución**:

1. **Verificación de base de datos existente**:
   ```javascript
   const userCount = await User.countDocuments();
   ```
   - Cuenta cuántos usuarios existen en la base de datos
   - Si existe al menos 1 usuario, termina la función (base de datos ya inicializada)

2. **Generación de contraseña segura**:
   ```javascript
   const contrasenaHash = await bcrypt.hash('nti104', 10);
   ```
   - Hashea la contraseña por defecto `nti104` usando bcrypt
   - Usa 10 rondas de salt para seguridad
   - El hash generado es irreversible

3. **Generación de código único**:
   ```javascript
   const codigo = `ADM-${Date.now().toString().slice(-6)}`;
   ```
   - Crea un código único usando timestamp
   - Formato: `ADM-XXXXXX` donde X son los últimos 6 dígitos del timestamp
   - Ejemplo: `ADM-831573`

4. **Creación del usuario administrador**:
   - Crea instancia del modelo User con datos predefinidos:
     - **Email**: `administrador@gmail.com`
     - **Contraseña**: `nti104` (hasheada)
     - **Rol**: `administrador`
     - **Departamento**: `Tecnologia_de_la_Informacion`
     - **Estado**: `activo`

5. **Guardado en base de datos**:
   ```javascript
   await adminUser.save();
   ```
   - Persiste el usuario en MongoDB
   - Valida todos los campos según el schema

6. **Confirmación en consola**:
   - Muestra credenciales del administrador creado
   - Incluye advertencia de seguridad para cambiar la contraseña

**Credenciales del Administrador por Defecto**:
- **Email**: `administrador@gmail.com`
- **Contraseña**: `nti104`
- **Rol**: `administrador`
- **Código**: `ADM-XXXXXX` (generado dinámicamente)

**Manejo de errores**:
- Captura cualquier error durante el proceso
- Muestra mensaje de error en consola
- Propaga el error (`throw error`) para que sea manejado por el código que llama la función

**Cuándo se ejecuta**:
- Se llama automáticamente en `app.js` al iniciar el servidor
- Solo ejecuta acciones si la base de datos está completamente vacía
- Es idempotente: puede ejecutarse múltiples veces sin causar duplicados

**Importancia de seguridad**:
⚠️ **NOTA IMPORTANTE**: La contraseña `nti104` es una excepción a las reglas de seguridad del sistema. Solo debe usarse para acceso inicial. El administrador debe cambiarla inmediatamente después del primer inicio de sesión.

**Uso típico**:
```javascript
// En app.js
await connectDB();
await initializeDatabase(); // Se ejecuta después de la conexión
```

**Dependencias**:
- `bcryptjs`: Para hashear la contraseña
- `../models/user`: Modelo de usuario de Mongoose

---

### 📁 Carpeta `/src/middleware`

Esta carpeta contiene middlewares personalizados que interceptan y procesan las peticiones HTTP antes de que lleguen a los controladores o después de que se genere una respuesta.

---

#### 📄 `auth.js`

**Propósito**: Proporcionar middlewares para autenticación JWT y autorización basada en roles.

**Dependencias**:
- `jsonwebtoken`: Para verificar tokens JWT
- `../models/user`: Modelo de usuario para validación
- `../utils/helpers`: Función `sendError` para respuestas de error

---

##### **Middleware: `auth`**
```javascript
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return sendError(res, 401, 'Acceso denegado. Token no proporcionado');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production');
    
    const user = await User.findOne({ 
      _id: decoded.id, 
      estado: "activo" 
    }).select('-contrasenaHash');
    
    if (!user) {
      return sendError(res, 401, 'Token inválido. Usuario no encontrado');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expirado');
    } else if (error.name === 'JsonWebTokenError') {
      return sendError(res, 401, 'Token inválido');
    }
    return sendError(res, 500, 'Error en autenticación');
  }
};
```

**Descripción**: Middleware principal de autenticación que valida tokens JWT en las peticiones protegidas.

**Parámetros**:
- `req` (Request): Objeto de petición HTTP de Express
- `res` (Response): Objeto de respuesta HTTP de Express
- `next` (Function): Función para pasar al siguiente middleware

**Retorna**: 
- Llama a `next()` si la autenticación es exitosa
- Envía respuesta de error (401, 500) si falla

**Flujo de ejecución**:

1. **Extracción del token**:
   ```javascript
   const token = req.header('Authorization')?.replace('Bearer ', '');
   ```
   - Lee el header `Authorization` de la petición
   - Remueve el prefijo `Bearer ` para obtener solo el token
   - Usa optional chaining (`?.`) para evitar errores si el header no existe

2. **Validación de presencia del token**:
   ```javascript
   if (!token) {
     return sendError(res, 401, 'Acceso denegado. Token no proporcionado');
   }
   ```
   - Si no hay token, retorna error 401 (Unauthorized)
   - Termina la ejecución del middleware

3. **Verificación del token JWT**:
   ```javascript
   const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production');
   ```
   - Verifica la firma del token usando la clave secreta
   - Decodifica el payload del token
   - Lanza excepción si el token es inválido o expiró

4. **Validación del usuario en base de datos**:
   ```javascript
   const user = await User.findOne({ 
     _id: decoded.id, 
     estado: "activo" 
   }).select('-contrasenaHash');
   ```
   - Busca el usuario por ID extraído del token
   - Verifica que el estado sea `activo` (usuarios inactivos no pueden autenticarse)
   - Excluye el campo `contrasenaHash` de la respuesta por seguridad
   - Si el usuario no existe o está inactivo, retorna `null`

5. **Verificación de existencia del usuario**:
   ```javascript
   if (!user) {
     return sendError(res, 401, 'Token inválido. Usuario no encontrado');
   }
   ```
   - Si el usuario no existe o está inactivo, retorna error 401

6. **Adjuntar usuario a la petición**:
   ```javascript
   req.user = user;
   next();
   ```
   - Adjunta el objeto completo del usuario a `req.user`
   - Permite que los controladores accedan a la información del usuario autenticado
   - Llama a `next()` para continuar con el siguiente middleware o controlador

**Manejo de errores específicos**:
- **TokenExpiredError**: Token JWT expirado (401)
- **JsonWebTokenError**: Token JWT malformado o inválido (401)
- **Errores generales**: Error interno del servidor (500)

**Uso en rutas**:
```javascript
router.get('/protected-route', auth, (req, res) => {
  // req.user contiene el usuario autenticado
  res.json({ user: req.user });
});
```

---

##### **Middleware: `admin`**
```javascript
const admin = (req, res, next) => {
  if (req.user && req.user.rol === 'administrador') {
    next();
  } else {
    return sendError(res, 403, 'Acceso denegado. Se requieren privilegios de administrador');
  }
};
```

**Descripción**: Middleware de autorización que verifica si el usuario autenticado tiene rol de administrador.

**Parámetros**:
- `req` (Request): Debe contener `req.user` (establecido por middleware `auth`)
- `res` (Response): Objeto de respuesta HTTP
- `next` (Function): Función para continuar

**Retorna**:
- Llama a `next()` si el usuario es administrador
- Envía error 403 (Forbidden) si no tiene permisos

**Flujo de ejecución**:
1. Verifica que `req.user` existe (el usuario está autenticado)
2. Verifica que `req.user.rol === 'administrador'`
3. Si cumple ambas condiciones: continúa con `next()`
4. Si no cumple: retorna error 403

**Roles permitidos**:
- ✅ `administrador`

**Uso típico**:
```javascript
// Debe usarse DESPUÉS del middleware auth
router.delete('/users/:id', auth, admin, deleteUser);
```

---

##### **Middleware: `responsableSeguridad`**
```javascript
const responsableSeguridad = (req, res, next) => {
  if (req.user && (req.user.rol === 'responsable_seguridad' || req.user.rol === 'administrador')) {
    next();
  } else {
    return sendError(res, 403, 'Acceso denegado. Se requieren privilegios de seguridad');
  }
};
```

**Descripción**: Middleware de autorización que verifica si el usuario tiene rol de responsable de seguridad o administrador.

**Parámetros**:
- `req` (Request): Debe contener `req.user`
- `res` (Response): Objeto de respuesta HTTP
- `next` (Function): Función para continuar

**Retorna**:
- Llama a `next()` si el usuario tiene rol adecuado
- Envía error 403 si no tiene permisos

**Flujo de ejecución**:
1. Verifica que `req.user` existe
2. Verifica que el rol sea `responsable_seguridad` O `administrador`
3. Si cumple: continúa con `next()`
4. Si no cumple: retorna error 403

**Roles permitidos**:
- ✅ `responsable_seguridad`
- ✅ `administrador` (tiene acceso a todo)

**Uso típico**:
```javascript
// Revisar solicitudes de cambio
router.put('/solicitudes/:id/revisar', auth, responsableSeguridad, revisarSolicitud);
```

---

##### **Middleware: `auditor`**
```javascript
const auditor = (req, res, next) => {
  if (req.user && (req.user.rol === 'auditor' || req.user.rol === 'administrador')) {
    next();
  } else {
    return sendError(res, 403, 'Acceso denegado. Se requieren privilegios de auditor');
  }
};
```

**Descripción**: Middleware de autorización que verifica si el usuario tiene rol de auditor o administrador.

**Parámetros**:
- `req` (Request): Debe contener `req.user`
- `res` (Response): Objeto de respuesta HTTP
- `next` (Function): Función para continuar

**Retorna**:
- Llama a `next()` si el usuario tiene rol adecuado
- Envía error 403 si no tiene permisos

**Flujo de ejecución**:
1. Verifica que `req.user` existe
2. Verifica que el rol sea `auditor` O `administrador`
3. Si cumple: continúa con `next()`
4. Si no cumple: retorna error 403

**Roles permitidos**:
- ✅ `auditor`
- ✅ `administrador` (tiene acceso a todo)

**Uso típico**:
```javascript
// Ver reportes de auditoría
router.get('/audits', auth, auditor, getAuditReports);
```

---

#### 📄 `errorHandler.js`

**Propósito**: Middleware global para manejo centralizado de errores en toda la aplicación.

---

##### **Middleware: `errorHandler`**
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

**Descripción**: Middleware que captura todos los errores no manejados en la aplicación y los formatea de manera consistente.

**Parámetros**:
- `err` (Error): Objeto de error capturado
- `req` (Request): Objeto de petición HTTP
- `res` (Response): Objeto de respuesta HTTP
- `next` (Function): Función para pasar al siguiente middleware (no se usa en error handlers)

**Retorna**: 
- Envía respuesta JSON con información del error
- Código de estado HTTP apropiado según el tipo de error

**Flujo de ejecución**:

1. **Clonación del error**:
   ```javascript
   let error = { ...err };
   error.message = err.message;
   ```
   - Crea una copia del objeto error original
   - Preserva el mensaje de error

2. **Logging del error**:
   ```javascript
   console.error('Error:', err);
   ```
   - Registra el error completo en consola para debugging

3. **Detección y transformación de errores específicos**:

   **a) CastError (Mongoose)**:
   ```javascript
   if (err.name === 'CastError') {
     const message = 'Resource not found';
     error = { message, statusCode: 404 };
   }
   ```
   - Ocurre cuando se intenta usar un ObjectId inválido de MongoDB
   - Ejemplo: `/users/invalid-id` con formato de ID incorrecto
   - Retorna: 404 Not Found

   **b) Duplicate Key Error (MongoDB)**:
   ```javascript
   if (err.code === 11000) {
     const message = 'Duplicate field value entered';
     error = { message, statusCode: 400 };
   }
   ```
   - Ocurre cuando se intenta insertar un valor duplicado en un campo único
   - Ejemplo: Registrar un usuario con email ya existente
   - Retorna: 400 Bad Request

   **c) ValidationError (Mongoose)**:
   ```javascript
   if (err.name === 'ValidationError') {
     const message = Object.values(err.errors).map(val => val.message).join(', ');
     error = { message, statusCode: 400 };
   }
   ```
   - Ocurre cuando los datos no cumplen con el schema de Mongoose
   - Combina todos los mensajes de validación en uno solo
   - Ejemplo: "nombre is required, email is required"
   - Retorna: 400 Bad Request

   **d) JsonWebTokenError**:
   ```javascript
   if (err.name === 'JsonWebTokenError') {
     const message = 'Invalid token';
     error = { message, statusCode: 401 };
   }
   ```
   - Ocurre cuando el token JWT es malformado o inválido
   - Retorna: 401 Unauthorized

   **e) TokenExpiredError**:
   ```javascript
   if (err.name === 'TokenExpiredError') {
     const message = 'Token expired';
     error = { message, statusCode: 401 };
   }
   ```
   - Ocurre cuando el token JWT ha expirado
   - Retorna: 401 Unauthorized

4. **Envío de respuesta de error**:
   ```javascript
   res.status(error.statusCode || 500).json({
     success: false,
     error: error.message || 'Server Error',
     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
   });
   ```
   - Establece el código de estado HTTP (o 500 por defecto)
   - Envía JSON con:
     - `success: false`: Indica que la operación falló
     - `error`: Mensaje descriptivo del error
     - `stack` (solo en development): Stack trace completo para debugging

**Formato de respuesta**:

**En producción**:
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**En desarrollo**:
```json
{
  "success": false,
  "error": "Resource not found",
  "stack": "Error: CastError\n    at Model.findById..."
}
```

**Códigos de estado HTTP manejados**:
- `400`: Bad Request (validación, duplicados)
- `401`: Unauthorized (autenticación fallida)
- `404`: Not Found (recurso no encontrado)
- `500`: Internal Server Error (errores no clasificados)

**Registro en app.js**:
```javascript
// Debe ser el ÚLTIMO middleware registrado
app.use(errorHandler);
```

**Importancia**: Este middleware debe registrarse después de todas las rutas para capturar cualquier error que ocurra en ellas.

---

**Jerarquía de Middlewares de Autorización**:

```
administrador (acceso total)
    ├── responsable_seguridad (+ sus funciones específicas)
    ├── auditor (+ sus funciones específicas)
    └── usuario (acceso básico)
```

**Orden correcto de aplicación de middlewares**:
```javascript
// ✅ CORRECTO
router.put('/ruta', auth, admin, controller);

// ❌ INCORRECTO (admin no funcionará sin auth)
router.put('/ruta', admin, auth, controller);
```

---

### 📁 Carpeta `/src/models`

Esta carpeta contiene los modelos de datos definidos con Mongoose, que representan las entidades principales del sistema y sus relaciones en MongoDB.

---

#### 📄 `user.js`

**Propósito**: Define el modelo de usuarios del sistema con sus campos, validaciones y relaciones.

##### **Schema: `UserSchema`**

```javascript
const UserSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  rol: {
    type: String,
    enum: ["administrador", "responsable_seguridad", "auditor", "usuario"],
    default: "usuario",
  },
  departamento: {
    type: String,
    enum: [
      "Tecnologia_de_la_Informacion",
      "recursos_humanos",
      "seguridad",
      "auditoria",
      "finanzas",
      "operaciones",
      "legal_y_cumplimiento"
    ],
    default: "Tecnologia_de_la_Informacion",
  },
  fechaCreacion: { type: Date, default: Date.now },
  activosCreados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activo' }],
  solicitudes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SolicitudCambio' }],
  contrasenaHash: { type: String, required: true },
  ubicacion: { type: String },
  estado: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo"
  }
});
```

**Descripción**: Representa a los usuarios del sistema con sus datos personales, roles y relaciones.

**Campos del Schema**:

| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `codigo` | String | ✅ | ❌ | - | Código identificador único del usuario (ej: `USR-123456`) |
| `nombre` | String | ✅ | ❌ | - | Nombre del usuario |
| `apellido` | String | ✅ | ❌ | - | Apellido del usuario |
| `email` | String | ✅ | ✅ | - | Correo electrónico (único en el sistema) |
| `telefono` | String | ✅ | ❌ | - | Número de teléfono de contacto |
| `rol` | String | ❌ | ❌ | `"usuario"` | Rol del usuario en el sistema |
| `departamento` | String | ❌ | ❌ | `"Tecnologia_de_la_Informacion"` | Departamento al que pertenece |
| `fechaCreacion` | Date | ❌ | ❌ | `Date.now` | Fecha de creación del usuario |
| `activosCreados` | Array[ObjectId] | ❌ | ❌ | `[]` | IDs de activos creados por este usuario |
| `solicitudes` | Array[ObjectId] | ❌ | ❌ | `[]` | IDs de solicitudes realizadas por este usuario |
| `contrasenaHash` | String | ✅ | ❌ | - | Hash bcrypt de la contraseña |
| `ubicacion` | String | ❌ | ❌ | - | Ubicación física del usuario (opcional) |
| `estado` | String | ❌ | ❌ | `"activo"` | Estado actual del usuario |

**Valores enum permitidos**:

**rol**:
- `administrador`: Acceso total al sistema
- `responsable_seguridad`: Gestión de seguridad y aprobación de cambios
- `auditor`: Revisión y auditoría de operaciones
- `usuario`: Usuario estándar con permisos básicos

**departamento**:
- `Tecnologia_de_la_Informacion`: TI/IT
- `recursos_humanos`: RRHH
- `seguridad`: Seguridad
- `auditoria`: Auditoría
- `finanzas`: Finanzas
- `operaciones`: Operaciones
- `legal_y_cumplimiento`: Legal y cumplimiento normativo

**estado**:
- `activo`: Usuario activo (puede iniciar sesión)
- `inactivo`: Usuario desactivado (no puede iniciar sesión)

**Referencias (Populate)**:
- `activosCreados`: Array de referencias al modelo `Activo`
- `solicitudes`: Array de referencias al modelo `SolicitudCambio`

**Índices automáticos**:
- `email`: Índice único automático por la propiedad `unique: true`

**Exportación**:
```javascript
module.exports = mongoose.model("User", UserSchema);
```
- Nombre del modelo: `"User"`
- Nombre de colección en MongoDB: `users` (pluralizado automáticamente)

---

#### 📄 `activo.js`

**Propósito**: Define el modelo de activos tecnológicos con sus características, historial y relaciones.

##### **Schema: `ActivoSchema`**

```javascript
const ActivoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { 
    type: String, 
    required: true,
    enum: ["Datos", "Sistemas", "Infraestructura", "Personas"]
  },
  descripcion: { type: String },
  estado: {
    type: String,
    enum: ["Activo", "Inactivo", "En Mantenimiento", "En Revision"],
    default: "En Revision"
  },
  ubicacion: { type: String },
  fechaCreacion: { type: Date, default: Date.now },
  responsableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  version: { type: String, default: "v1.0.0" },
  idsSolicitudesDeCambio: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SolicitudCambio' 
  }],
  historialComentarios: [{
    comentario: { type: String, required: true },
    usuario: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    fecha: { type: Date, default: Date.now },
    tipoAccion: {
      type: String,
      enum: ['creacion', 'modificacion'],
      required: true
    }
  }]
});
```

**Descripción**: Representa los activos tecnológicos de la organización con su información, estado, responsable y trazabilidad completa.

**Campos del Schema**:

| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `codigo` | String | ✅ | ✅ | - | Código único del activo (ej: `ACT-123456`) |
| `nombre` | String | ✅ | ❌ | - | Nombre descriptivo del activo |
| `categoria` | String | ✅ | ❌ | - | Categoría del activo |
| `descripcion` | String | ❌ | ❌ | - | Descripción detallada del activo |
| `estado` | String | ❌ | ❌ | `"En Revision"` | Estado actual del activo |
| `ubicacion` | String | ❌ | ❌ | - | Ubicación física o lógica |
| `fechaCreacion` | Date | ❌ | ❌ | `Date.now` | Fecha de creación del registro |
| `responsableId` | ObjectId | ✅ | ❌ | - | ID del usuario responsable |
| `version` | String | ❌ | ❌ | `"v1.0.0"` | Versión del activo |
| `idsSolicitudesDeCambio` | Array[ObjectId] | ❌ | ❌ | `[]` | IDs de solicitudes relacionadas |
| `historialComentarios` | Array[Object] | ❌ | ❌ | `[]` | Historial de comentarios y cambios |

**Valores enum permitidos**:

**categoria**:
- `Datos`: Bases de datos, archivos, repositorios de información
- `Sistemas`: Aplicaciones, software, sistemas operativos
- `Infraestructura`: Servidores, redes, hardware
- `Personas`: Recursos humanos, equipos de trabajo

**estado**:
- `Activo`: Activo en uso y operativo
- `Inactivo`: Activo dado de baja o fuera de servicio
- `En Mantenimiento`: Activo en proceso de mantenimiento
- `En Revision`: Activo pendiente de aprobación (estado inicial)

**Sub-schema: `historialComentarios`**

Cada elemento del array contiene:

| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `comentario` | String | ✅ | - | Texto del comentario o descripción del cambio |
| `usuario` | ObjectId | ✅ | - | ID del usuario que realizó el comentario |
| `fecha` | Date | ❌ | `Date.now` | Fecha y hora del comentario |
| `tipoAccion` | String | ✅ | - | Tipo de acción realizada |

**tipoAccion** (enum):
- `creacion`: Comentario al crear el activo
- `modificacion`: Comentario al modificar el activo

**Referencias (Populate)**:
- `responsableId`: Referencia al modelo `User` (usuario responsable del activo)
- `idsSolicitudesDeCambio`: Array de referencias al modelo `SolicitudCambio`
- `historialComentarios[].usuario`: Referencia al modelo `User`

**Índices automáticos**:
- `codigo`: Índice único automático

**Exportación**:
```javascript
module.exports = mongoose.model("Activo", ActivoSchema);
```
- Nombre del modelo: `"Activo"`
- Nombre de colección en MongoDB: `activos` (pluralizado automáticamente)

**Uso del historial**:
El campo `historialComentarios` proporciona trazabilidad completa de todas las acciones realizadas sobre el activo, permitiendo auditoría y seguimiento de cambios.

---

#### 📄 `solicitudCambio.js`

**Propósito**: Define el modelo de solicitudes de cambio para activos, incluyendo aprobaciones y trazabilidad.

##### **Sub-Schema: `CambioSchema`**

```javascript
const CambioSchema = new mongoose.Schema({
  campo: { type: String, required: true },
  valorAnterior: { type: String },
  valorNuevo: { type: String, required: true }
});
```

**Descripción**: Representa un cambio individual en un campo específico del activo.

**Campos**:
- `campo`: Nombre del campo que se modificó (ej: "nombre", "ubicacion", "responsableId")
- `valorAnterior`: Valor antes del cambio (puede ser null para creaciones)
- `valorNuevo`: Nuevo valor propuesto o aplicado

---

##### **Sub-Schema: `AprobacionSchema`**

```javascript
const AprobacionSchema = new mongoose.Schema({
  responsableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  fecha: { type: Date },
  estado: {
    type: String,
    enum: ["Pendiente", "Aprobado", "Rechazado"],
    default: "Pendiente"
  },
  comentario: { type: String }
});
```

**Descripción**: Representa la aprobación o rechazo de una solicitud por parte de un responsable.

**Campos**:
- `responsableId`: Usuario que realiza la aprobación/rechazo
- `fecha`: Fecha de la decisión
- `estado`: Estado de la aprobación
- `comentario`: Comentario justificativo de la decisión

**Nota**: Este schema está definido pero actualmente no se usa en `SolicitudCambioSchema`. Los campos de aprobación están directamente en el schema principal.

---

##### **Schema: `SolicitudCambioSchema`**

```javascript
const SolicitudCambioSchema = new mongoose.Schema({
  codigoSolicitud: { type: String, required: true, unique: true },
  nombreActivo: { type: String, required: true },
  codigoActivo: { type: String, required: true },
  fechaSolicitud: { type: Date, default: Date.now },
  fechaRevision: { type: Date },
  solicitanteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  responsableSeguridadId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  auditorId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  fechaAuditoria: { type: Date },
  comentarioAuditoria: { type: String },
  estado: {
    type: String,
    enum: ["Pendiente", "Aprobado", "Rechazado"],
    default: "Pendiente"
  },
  comentarioSeguridad: { type: String },
  tipoOperacion: {
    type: String,
    enum: ["creacion", "modificacion", "reasignacion"],
    required: true
  },
  activoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Activo', 
    required: true 
  },
  justificacion: { type: String, required: true },
  cambios: [CambioSchema]
});
```

**Descripción**: Representa las solicitudes de cambio sobre activos, incluyendo creación, modificación y reasignación, con flujo de aprobación por seguridad y auditoría.

**Campos del Schema**:

| Campo | Tipo | Requerido | Único | Default | Descripción |
|-------|------|-----------|-------|---------|-------------|
| `codigoSolicitud` | String | ✅ | ✅ | - | Código único de la solicitud (ej: `SOL-123456`) |
| `nombreActivo` | String | ✅ | ❌ | - | Nombre del activo afectado |
| `codigoActivo` | String | ✅ | ❌ | - | Código del activo afectado |
| `fechaSolicitud` | Date | ❌ | ❌ | `Date.now` | Fecha de creación de la solicitud |
| `fechaRevision` | Date | ❌ | ❌ | - | Fecha de revisión por seguridad |
| `solicitanteId` | ObjectId | ✅ | ❌ | - | ID del usuario solicitante |
| `responsableSeguridadId` | ObjectId | ❌ | ❌ | - | ID del responsable que revisó |
| `auditorId` | ObjectId | ❌ | ❌ | - | ID del auditor asignado |
| `fechaAuditoria` | Date | ❌ | ❌ | - | Fecha de auditoría |
| `comentarioAuditoria` | String | ❌ | ❌ | - | Comentario del auditor |
| `estado` | String | ❌ | ❌ | `"Pendiente"` | Estado de la solicitud |
| `comentarioSeguridad` | String | ❌ | ❌ | - | Comentario del responsable de seguridad |
| `tipoOperacion` | String | ✅ | ❌ | - | Tipo de operación solicitada |
| `activoId` | ObjectId | ✅ | ❌ | - | ID del activo relacionado |
| `justificacion` | String | ✅ | ❌ | - | Justificación del cambio solicitado |
| `cambios` | Array[Cambio] | ❌ | ❌ | `[]` | Array de cambios específicos |

**Valores enum permitidos**:

**estado**:
- `Pendiente`: Solicitud creada, esperando revisión
- `Aprobado`: Solicitud aprobada por responsable de seguridad
- `Rechazado`: Solicitud rechazada por responsable de seguridad

**tipoOperacion**:
- `creacion`: Creación de un nuevo activo
- `modificacion`: Modificación de un activo existente
- `reasignacion`: Reasignación de responsable de un activo

**Estructura del array `cambios`**:

Cada elemento es un objeto `CambioSchema` que representa un cambio específico:

```javascript
{
  campo: "nombre",
  valorAnterior: "Servidor Web 1",
  valorNuevo: "Servidor Web Principal"
}
```

**Campos especiales para cambios de responsable**:

Cuando el `campo` es `"responsableId"`, el backend puede agregar campos adicionales poblados:
- `responsableAnteriorInfo`: Objeto con información del responsable anterior
- `responsableNuevoInfo`: Objeto con información del nuevo responsable

Ejemplo:
```javascript
{
  campo: "responsableId",
  valorAnterior: "507f1f77bcf86cd799439011",
  valorNuevo: "507f1f77bcf86cd799439012",
  responsableAnteriorInfo: {
    id: "507f1f77bcf86cd799439011",
    nombreCompleto: "Juan Pérez",
    email: "juan@example.com"
  },
  responsableNuevoInfo: {
    id: "507f1f77bcf86cd799439012",
    nombreCompleto: "María García",
    email: "maria@example.com"
  }
}
```

**Referencias (Populate)**:
- `solicitanteId`: Referencia al modelo `User` (quien solicita)
- `responsableSeguridadId`: Referencia al modelo `User` (quien revisa)
- `auditorId`: Referencia al modelo `User` (auditor)
- `activoId`: Referencia al modelo `Activo` (activo afectado)

**Índices automáticos**:
- `codigoSolicitud`: Índice único automático

**Flujo de estados**:

```
Pendiente → (revisión) → Aprobado
                      ↘ Rechazado
```

1. **Pendiente**: Estado inicial al crear la solicitud
2. **Aprobado**: Responsable de seguridad aprueba el cambio
   - Se actualiza `responsableSeguridadId`
   - Se actualiza `fechaRevision`
   - Opcionalmente se agrega `comentarioSeguridad`
3. **Rechazado**: Responsable de seguridad rechaza el cambio
   - Se actualiza `responsableSeguridadId`
   - Se actualiza `fechaRevision`
   - Requerido agregar `comentarioSeguridad` con la razón del rechazo

**Exportación**:
```javascript
module.exports = mongoose.model("SolicitudCambio", SolicitudCambioSchema);
```
- Nombre del modelo: `"SolicitudCambio"`
- Nombre de colección en MongoDB: `solicitudcambios` (pluralizado automáticamente)

**Campos de trazabilidad**:

La solicitud mantiene trazabilidad completa de:
- Quién solicitó el cambio (`solicitanteId`)
- Cuándo se solicitó (`fechaSolicitud`)
- Quién revisó (`responsableSeguridadId`)
- Cuándo se revisó (`fechaRevision`)
- Qué se cambió (`cambios` array)
- Por qué se rechazó (`comentarioSeguridad`)
- Auditoría opcional (`auditorId`, `fechaAuditoria`, `comentarioAuditoria`)

---

#### 📄 `index.js`

**Propósito**: Exportar todos los modelos de manera centralizada para facilitar las importaciones.

```javascript
const User = require('./user');
const Activo = require('./activo');
const SolicitudCambio = require('./solicitudCambio');

module.exports = {
  User,
  Activo,
  SolicitudCambio
};
```

**Descripción**: Archivo barrel que centraliza las exportaciones de todos los modelos.

**Ventajas de usar este archivo**:

1. **Importaciones más limpias**:
   ```javascript
   // Sin index.js
   const User = require('./models/user');
   const Activo = require('./models/activo');
   const SolicitudCambio = require('./models/solicitudCambio');

   // Con index.js
   const { User, Activo, SolicitudCambio } = require('./models');
   ```

2. **Importación selectiva**:
   ```javascript
   // Solo los modelos necesarios
   const { User, Activo } = require('./models');
   ```

3. **Punto único de control**: Facilita agregar o modificar modelos sin cambiar múltiples importaciones

**Uso típico en rutas o controladores**:
```javascript
const { User, Activo, SolicitudCambio } = require('../models');

// Ahora puedes usar todos los modelos
const user = await User.findById(id);
const activo = await Activo.findOne({ codigo: 'ACT-123' });
const solicitud = await SolicitudCambio.find({ estado: 'Pendiente' });
```

---

## Relaciones entre Modelos

### Diagrama de Relaciones

```
User (usuarios)
  │
  ├──< activosCreados ────────────> Activo (activos)
  │                                    │
  ├──< solicitudes ──────┐             │
  │                      │             │
  └──< responsableId ────┘             │
                                       │
                                       └──< activoId ───> SolicitudCambio
                                              │             (solicitudcambios)
                                              │
                                              └──< idsSolicitudesDeCambio
```

### Relaciones Detalladas

1. **User → Activo** (uno a muchos):
   - Un usuario puede crear múltiples activos
   - Un usuario puede ser responsable de múltiples activos
   - `User.activosCreados` → array de `Activo._id`
   - `Activo.responsableId` → `User._id`

2. **User → SolicitudCambio** (uno a muchos):
   - Un usuario puede crear múltiples solicitudes
   - Un usuario puede revisar múltiples solicitudes (como responsable de seguridad)
   - Un usuario puede auditar múltiples solicitudes (como auditor)
   - `User.solicitudes` → array de `SolicitudCambio._id`
   - `SolicitudCambio.solicitanteId` → `User._id`
   - `SolicitudCambio.responsableSeguridadId` → `User._id`
   - `SolicitudCambio.auditorId` → `User._id`

3. **Activo → SolicitudCambio** (uno a muchos):
   - Un activo puede tener múltiples solicitudes de cambio
   - Cada solicitud afecta a un único activo
   - `Activo.idsSolicitudesDeCambio` → array de `SolicitudCambio._id`
   - `SolicitudCambio.activoId` → `Activo._id`

### Ejemplo de Populate

```javascript
// Obtener solicitud con todos los datos relacionados
const solicitud = await SolicitudCambio.findById(id)
  .populate('solicitanteId', 'nombre apellido email')
  .populate('responsableSeguridadId', 'nombre apellido email')
  .populate('activoId', 'codigo nombre categoria estado')
  .exec();

// Resultado incluirá objetos completos en lugar de solo IDs
```

---

### 📁 Carpeta `/src/routes`

Esta carpeta contiene la definición de todas las rutas (endpoints) de la API REST, organizadas por dominio funcional.

---

#### 📄 `index.js`

**Propósito**: Router principal que agrupa y organiza todas las rutas de la API.

```javascript
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const activoRoutes = require('./activos');
const solicitudRoutes = require('./solicitudes');

// Welcome message for API root
router.get('/', (req, res) => { ... });

// Route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/activos', activoRoutes);
router.use('/solicitudes', solicitudRoutes);
```

**Descripción**: Archivo que centraliza y monta todas las rutas bajo el prefijo `/api`.

**Endpoints registrados**:

| Prefijo | Archivo | Descripción |
|---------|---------|-------------|
| `/auth` | `auth.js` | Autenticación (login, register) |
| `/users` | `users.js` | Gestión de usuarios |
| `/activos` | `activos.js` | Gestión de activos |
| `/solicitudes` | `solicitudes.js` | Gestión de solicitudes de cambio |

**Endpoint raíz**:
- **GET** `/api/` - Mensaje de bienvenida con información de la API
- **Respuesta**:
  ```json
  {
    "message": "Welcome to SecureFlow API",
    "version": "v1",
    "endpoints": {
      "health": "/health",
      "auth": "/api/auth",
      "users": "/api/users",
      "activos": "/api/activos",
      "solicitudes": "/api/solicitudes"
    },
    "documentation": "Coming soon...",
    "timestamp": "2025-12-07T..."
  }
  ```

**Montaje en app.js**:
```javascript
app.use(process.env.API_PREFIX || '/api', apiRoutes);
```

---

#### 📄 `auth.js`

**Propósito**: Gestionar la autenticación de usuarios (login y registro).

**Dependencias**:
- `bcryptjs`: Hash y verificación de contraseñas
- `jsonwebtoken`: Generación de tokens JWT
- `../models/user`: Modelo de usuario
- `../utils/helpers`: Funciones auxiliares de validación

---

##### **POST** `/api/auth/login`

**Descripción**: Iniciar sesión con email y contraseña.

**Acceso**: Público (no requiere autenticación)

**Request Body**:
```json
{
  "email": "usuario@example.com",
  "contrasena": "password123"
}
```

**Flujo de ejecución**:

1. **Validación de campos requeridos**:
   - Verifica que `email` y `contrasena` estén presentes
   - Error 400 si falta alguno

2. **Sanitización y validación de email**:
   - Convierte email a minúsculas
   - Valida formato de email con regex
   - Error 400 si el formato es inválido

3. **Búsqueda del usuario**:
   ```javascript
   const user = await User.findOne({ email: sanitizedEmail });
   ```
   - Busca usuario por email
   - Error 401 si no existe (no revelar si el email existe o no por seguridad)

4. **Verificación de estado del usuario**:
   ```javascript
   if (user.estado !== "activo") {
     return sendError(res, 401, 'Cuenta inactiva contacta al administrador');
   }
   ```
   - Verifica que el usuario esté activo
   - Error 401 si está inactivo

5. **Verificación de contraseña**:
   ```javascript
   const isPasswordValid = await bcrypt.compare(contrasena, user.contrasenaHash);
   ```
   - Compara contraseña con hash almacenado usando bcrypt
   - Error 401 si no coincide

6. **Generación de token JWT**:
   ```javascript
   const tokenPayload = {
     id: user._id,
     email: user.email,
     rol: user.rol,
     codigo: user.codigo
   };
   const token = generateJWTToken(tokenPayload);
   ```
   - Crea payload con información del usuario
   - Genera token firmado con duración configurada

7. **Respuesta exitosa**:
   - Excluye `contrasenaHash` de la respuesta
   - Retorna datos del usuario y token

**Response Success** (200):
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "codigo": "USR-123456",
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@example.com",
      "telefono": "12345678",
      "departamento": "Tecnologia_de_la_Informacion",
      "rol": "usuario",
      "fechaCreacion": "2025-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

**Response Errors**:
- **400**: Email o contraseña faltantes / Formato de email inválido
- **401**: Credenciales inválidas / Cuenta inactiva
- **500**: Error interno del servidor

---

##### **POST** `/api/auth/register`

**Descripción**: Registrar un nuevo usuario en el sistema.

**Acceso**: Público (no requiere autenticación)

**Request Body**:
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "telefono": "12345678",
  "departamento": "Tecnologia_de_la_Informacion",
  "rol": "usuario",
  "contrasena": "SecurePass123!",
  "confirmarContrasena": "SecurePass123!"
}
```

**Flujo de ejecución**:

1. **Validación de campos requeridos**:
   - Verifica que todos los campos estén presentes
   - Error 400 si falta alguno

2. **Sanitización de inputs**:
   - Limpia todos los inputs de caracteres peligrosos
   - Convierte email a minúsculas

3. **Validación de email**:
   - Verifica formato válido de email
   - Error 400 si es inválido

4. **Validación de contraseña**:
   ```javascript
   if (!isValidPassword(contrasena)) {
     return sendError(res, 400, 'La contraseña debe tener al menos 8 caracteres...');
   }
   ```
   - Verifica longitud mínima de 8 caracteres
   - Debe contener mayúscula, minúscula y número
   - Error 400 si no cumple requisitos

5. **Verificación de coincidencia de contraseñas**:
   - Compara `contrasena` con `confirmarContrasena`
   - Error 400 si no coinciden

6. **Verificación de email único**:
   ```javascript
   const existingUser = await User.findOne({ email: sanitizedData.email });
   if (existingUser) {
     return sendError(res, 409, 'Ya existe un usuario con este email');
   }
   ```
   - Error 409 (Conflict) si el email ya existe

7. **Validación de departamento**:
   - Verifica que el departamento esté en la lista válida
   - Error 400 si es inválido

8. **Validación de rol**:
   - Verifica que el rol esté en la lista válida
   - Error 400 si es inválido

9. **Hash de contraseña**:
   ```javascript
   const saltRounds = 12;
   const contrasenaHash = await bcrypt.hash(contrasena, saltRounds);
   ```
   - Genera hash con 12 rondas de sal (muy seguro)

10. **Generación de código único**:
    ```javascript
    let codigo;
    let codigoExists = true;
    while (codigoExists) {
      codigo = generateUserCode();
      const userWithCode = await User.findOne({ codigo });
      if (!userWithCode) {
        codigoExists = false;
      }
    }
    ```
    - Genera código hasta encontrar uno único

11. **Creación y guardado del usuario**:
    - Crea instancia del modelo User
    - Guarda en base de datos
    - Estado inicial: `activo`

12. **Generación de token JWT**:
    - Genera token automáticamente para login directo

**Response Success** (201):
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "codigo": "USR-789012",
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@example.com",
      "telefono": "12345678",
      "departamento": "Tecnologia_de_la_Informacion",
      "rol": "usuario",
      "fechaCreacion": "2025-12-07T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

**Response Errors**:
- **400**: Campos faltantes / Formato inválido / Contraseña débil / Departamento/rol inválido
- **409**: Email ya existe
- **500**: Error interno del servidor

**Departamentos válidos**:
- `Tecnologia_de_la_Informacion`
- `recursos_humanos`
- `seguridad`
- `auditoria`
- `finanzas`
- `operaciones`
- `legal_y_cumplimiento`

**Roles válidos**:
- `administrador`
- `responsable_seguridad`
- `auditor`
- `usuario` (por defecto)

---

#### 📄 `users.js`

**Propósito**: Gestionar operaciones CRUD sobre usuarios del sistema.

**Dependencias**:
- `../middleware/auth`: Middlewares de autenticación y autorización
- `../models/user`: Modelo de usuario
- `../utils/helpers`: Funciones auxiliares

---

##### **GET** `/api/users`

**Descripción**: Obtener lista de usuarios con paginación y filtros.

**Acceso**: Privado - Solo administradores (`auth`, `admin`)

**Query Parameters**:
- `page` (number, default: 1): Página actual
- `limit` (number, default: 10): Usuarios por página
- `departamento` (string): Filtrar por departamento
- `rol` (string): Filtrar por rol
- `search` (string): Búsqueda en nombre, apellido, email, código
- `includeInactive` (boolean): Incluir usuarios inactivos

**Ejemplo de Request**:
```
GET /api/users?page=1&limit=20&rol=usuario&search=juan
```

**Flujo de ejecución**:

1. **Extracción de parámetros de paginación**
2. **Construcción de filtro dinámico**:
   - Por defecto solo muestra usuarios activos
   - Aplica filtros según query params
3. **Búsqueda con populate**
4. **Conteo total para paginación**
5. **Formateo de respuesta** con `nombreCompleto`

**Response Success** (200):
```json
{
  "success": true,
  "message": "15 usuarios obtenidos correctamente",
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "codigo": "USR-123456",
        "nombreCompleto": "Juan Pérez",
        "email": "juan@example.com",
        "telefono": "12345678",
        "departamento": "Tecnologia_de_la_Informacion",
        "rol": "usuario",
        "estado": "activo",
        "fechaCreacion": "2025-01-01T..."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalUsers": 15,
      "usersPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

##### **GET** `/api/users/:id`

**Descripción**: Obtener usuario específico por ID.

**Acceso**: Privado - Usuarios autenticados (`auth`)

**Parámetros de ruta**:
- `id` (ObjectId): ID del usuario

**Response Success** (200):
```json
{
  "success": true,
  "message": "Usuario obtenido correctamente",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "codigo": "USR-123456",
    "nombreCompleto": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "12345678",
    "departamento": "Tecnologia_de_la_Informacion",
    "rol": "usuario",
    "fechaCreacion": "2025-01-01T..."
  }
}
```

**Response Errors**:
- **400**: ID inválido
- **404**: Usuario no encontrado
- **500**: Error interno

---

##### **GET** `/api/users/stats/summary`

**Descripción**: Obtener estadísticas generales de usuarios.

**Acceso**: Privado - Solo administradores (`auth`, `admin`)

**Response Success** (200):
```json
{
  "success": true,
  "message": "Estadísticas obtenidas correctamente",
  "data": {
    "totalUsers": 50,
    "recentUsers": 5,
    "roleDistribution": [
      {
        "rol": "usuario",
        "count": 40,
        "percentage": "80.0"
      },
      {
        "rol": "administrador",
        "count": 5,
        "percentage": "10.0"
      }
    ],
    "departmentDistribution": [
      {
        "departamento": "Tecnologia_de_la_Informacion",
        "count": 25,
        "percentage": "50.0"
      }
    ]
  }
}
```

---

#### 📄 `activos.js`

**Propósito**: Gestionar el ciclo de vida completo de los activos tecnológicos.

**Funciones auxiliares**:

```javascript
const generateActivoCode = (nombreActivo) => {
  const prefijo = nombreActivo.substring(0, 3).toUpperCase().padEnd(3, 'X');
  const correlativo = Math.floor(Math.random() * 999) + 1;
  return `ACT-${prefijo}-${correlativo.toString().padStart(3, '0')}`;
};
```
- Genera códigos únicos basados en el nombre del activo
- Formato: `ACT-XXX-999`

---

##### **POST** `/api/activos`

**Descripción**: Crear un nuevo activo (genera automáticamente solicitud de aprobación).

**Acceso**: Privado - Usuarios autenticados (`auth`)

**Request Body**:
```json
{
  "nombre": "Servidor Web Principal",
  "categoria": "Infraestructura",
  "descripcion": "Servidor para aplicaciones web",
  "ubicacion": "Datacenter Piso 3"
}
```

**Flujo de ejecución**:

1. **Validación de campos** requeridos (nombre, categoría)
2. **Sanitización** de inputs
3. **Validación de categoría**:
   - Valores válidos: `Datos`, `Sistemas`, `Infraestructura`, `Personas`
4. **Generación de código único** del activo
5. **Creación del activo**:
   - Estado inicial: `En Revision`
   - Responsable: Usuario autenticado
   - Versión: `v1.0.0`
   - Historial de comentarios inicial
6. **Generación de solicitud de cambio**:
   - Tipo: `creacion`
   - Estado: `Pendiente`
   - Cambios detallados de todos los campos
7. **Actualización del usuario**: Agrega activo a `activosCreados`
8. **Población de datos** para respuesta

**Response Success** (201):
```json
{
  "success": true,
  "message": "Activo creado y solicitud de aprobación generada",
  "data": {
    "activo": {
      "id": "507f1f77bcf86cd799439011",
      "codigo": "ACT-SER-001",
      "nombre": "Servidor Web Principal",
      "categoria": "Infraestructura",
      "descripcion": "Servidor para aplicaciones web",
      "estado": "En Revision",
      "ubicacion": "Datacenter Piso 3",
      "version": "v1.0.0",
      "fechaCreacion": "2025-12-07T...",
      "responsable": {
        "id": "507f...",
        "codigo": "USR-123",
        "nombreCompleto": "Juan Pérez",
        "email": "juan@example.com"
      }
    },
    "solicitud": {
      "id": "507f...",
      "codigoSolicitud": "SOL-2025-0001",
      "estado": "Pendiente",
      "tipoOperacion": "creacion",
      "fechaSolicitud": "2025-12-07T..."
    }
  }
}
```

**Categorías válidas**:
- `Datos`
- `Sistemas`
- `Infraestructura`
- `Personas`

---

##### **GET** `/api/activos`

**Descripción**: Obtener lista de activos con paginación y filtros.

**Acceso**: Privado - Usuarios autenticados (`auth`)

**Control de acceso por rol**:
- **usuario**: Solo ve activos donde es responsable
- **administrador/responsable_seguridad/auditor**: Ven todos los activos

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `categoria` (string): Filtrar por categoría
- `estado` (string): Filtrar por estado
- `responsable` (ObjectId): Filtrar por responsable
- `nombre` (string): Búsqueda parcial en nombre
- `codigo` (string): Búsqueda parcial en código
- `search` (string): Búsqueda general en nombre, descripción, código

**Response Success** (200):
```json
{
  "success": true,
  "message": "10 activos obtenidos correctamente",
  "data": {
    "activos": [
      {
        "id": "507f...",
        "codigo": "ACT-SER-001",
        "nombre": "Servidor Web Principal",
        "categoria": "Infraestructura",
        "descripcion": "Servidor...",
        "estado": "Activo",
        "ubicacion": "Datacenter Piso 3",
        "version": "v1.0.0",
        "fechaCreacion": "2025-12-07T...",
        "responsable": {
          "id": "507f...",
          "codigo": "USR-123",
          "nombreCompleto": "Juan Pérez",
          "email": "juan@example.com"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalActivos": 47,
      "activosPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

##### **GET** `/api/activos/:id`

**Descripción**: Obtener activo específico por ID con historial completo.

**Acceso**: Privado - Usuarios autenticados (`auth`)

**Control de acceso**:
- Usuarios solo pueden ver activos donde son responsables
- Admin/seguridad/auditor pueden ver todos

**Response incluye**:
- Datos completos del activo
- Información del responsable poblada
- Historial de comentarios con usuarios poblados

---

#### 📄 `solicitudes.js`

**Propósito**: Gestionar el flujo completo de solicitudes de cambio.

**Funciones auxiliares**:

```javascript
const generateSolicitudCode = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `SOL-${year}-${randomNum}`;
};
```
- Genera códigos únicos de solicitud
- Formato: `SOL-YYYY-XXXX`

---

##### **GET** `/api/solicitudes`

**Descripción**: Obtener lista de solicitudes con paginación y filtros.

**Acceso**: Privado - Usuarios autenticados (`auth`)

**Control de acceso por rol**:
- **usuario**: Solo ve sus propias solicitudes
- **responsable_seguridad/administrador**: Ven todas las solicitudes

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `estado` (string): Filtrar por estado (Pendiente/Aprobado/Rechazado)
- `tipoOperacion` (string): Filtrar por tipo (creacion/modificacion/reasignacion)
- `solicitante` (ObjectId): Filtrar por solicitante
- `responsableSeguridad` (ObjectId): Filtrar por responsable de seguridad
- `search` (string): Búsqueda en nombre/código de activo o código de solicitud

**Response Success** (200):
```json
{
  "success": true,
  "message": "8 solicitudes obtenidas correctamente",
  "data": {
    "solicitudes": [
      {
        "id": "507f...",
        "codigoSolicitud": "SOL-2025-0001",
        "nombreActivo": "Servidor Web Principal",
        "codigoActivo": "ACT-SER-001",
        "fechaSolicitud": "2025-12-07T...",
        "fechaRevision": null,
        "estado": "Pendiente",
        "tipoOperacion": "creacion",
        "solicitante": {
          "id": "507f...",
          "codigo": "USR-123",
          "nombreCompleto": "Juan Pérez",
          "email": "juan@example.com"
        },
        "responsableSeguridad": null,
        "comentarioSeguridad": null,
        "justificacion": "Creacion de activo"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalSolicitudes": 8,
      "solicitudesPerPage": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

##### **GET** `/api/solicitudes/:id`

**Descripción**: Obtener solicitud específica con todos los detalles y datos poblados.

**Acceso**: Privado - Usuarios autenticados (`auth`)

**Control de acceso**:
- Solo el solicitante, responsable de seguridad o administrador pueden ver la solicitud
- Error 403 si no tiene permisos

**Características especiales**:

1. **Población de datos relacionados**:
   - Solicitante con datos completos
   - Responsable de seguridad (si existe)
   - Activo relacionado con su responsable

2. **Población de responsables en cambios**:
   ```javascript
   if (cambio.campo === 'responsableId') {
     // Poblar responsableAnteriorInfo
     // Poblar responsableNuevoInfo
   }
   ```
   - Cuando un cambio es de tipo `responsableId`, el backend automáticamente busca los usuarios y agrega objetos `responsableAnteriorInfo` y `responsableNuevoInfo` con:
     - `id`, `codigo`, `nombreCompleto`, `email`

**Response Success** (200):
```json
{
  "success": true,
  "message": "Solicitud obtenida correctamente",
  "data": {
    "id": "507f...",
    "codigoSolicitud": "SOL-2025-0001",
    "nombreActivo": "Servidor Web Principal",
    "codigoActivo": "ACT-SER-001",
    "fechaSolicitud": "2025-12-07T...",
    "fechaRevision": null,
    "estado": "Pendiente",
    "tipoOperacion": "modificacion",
    "solicitante": { ... },
    "responsableSeguridad": null,
    "comentarioSeguridad": null,
    "justificacion": "Cambio de responsable del activo",
    "activo": {
      "id": "507f...",
      "codigo": "ACT-SER-001",
      "nombre": "Servidor Web Principal",
      "categoria": "Infraestructura",
      "estado": "Activo",
      "ubicacion": "Datacenter Piso 3",
      "descripcion": "Servidor...",
      "responsableId": { ... }
    },
    "cambios": [
      {
        "campo": "responsableId",
        "valorAnterior": "507f1f77bcf86cd799439011",
        "valorNuevo": "507f1f77bcf86cd799439012",
        "responsableAnteriorInfo": {
          "id": "507f1f77bcf86cd799439011",
          "codigo": "USR-123",
          "nombreCompleto": "Juan Pérez",
          "email": "juan@example.com"
        },
        "responsableNuevoInfo": {
          "id": "507f1f77bcf86cd799439012",
          "codigo": "USR-456",
          "nombreCompleto": "María García",
          "email": "maria@example.com"
        }
      }
    ]
  }
}
```

---

##### **PUT** `/api/solicitudes/:id/revisar`

**Descripción**: Aprobar o rechazar una solicitud de cambio (solo responsables de seguridad).

**Acceso**: Privado - Solo responsables de seguridad (`auth`, `responsableSeguridad`)

**Parámetros de ruta**:
- `id` (ObjectId): ID de la solicitud

**Request Body**:
```json
{
  "estado": "Aprobado",
  "comentario": "Cambio aprobado. Activo verificado correctamente."
}
```

**Validaciones**:
- `estado` debe ser `Aprobado` o `Rechazado`
- `comentario` es obligatorio
- Solo se pueden revisar solicitudes en estado `Pendiente`

**Flujo de ejecución**:

1. **Validación de parámetros**
2. **Búsqueda de solicitud**
3. **Verificación de estado** (debe ser Pendiente)
4. **Actualización de solicitud**:
   - Cambio de estado
   - Agregar comentario
   - Asignar responsable de seguridad
   - Registrar fecha de revisión
5. **Si es Aprobado**: Aplicar cambios al activo
   - Actualiza campos según array de `cambios`
   - Agrega entrada al historial de comentarios
   - Cambia estado del activo según corresponda
6. **Si es Rechazado**: Solo actualiza la solicitud

**Response Success** (200):
```json
{
  "success": true,
  "message": "Solicitud aprobada exitosamente",
  "data": {
    "solicitud": {
      "id": "507f...",
      "codigoSolicitud": "SOL-2025-0001",
      "estado": "Aprobado",
      "comentarioSeguridad": "Cambio aprobado...",
      "fechaRevision": "2025-12-07T...",
      "responsableSeguridad": { ... }
    },
    "activo": {
      "id": "507f...",
      "codigo": "ACT-SER-001",
      "estado": "Activo",
      "cambiosAplicados": 3
    }
  }
}
```

**Estados posibles de solicitud**:
- `Pendiente` → `Aprobado` (aplica cambios al activo)
- `Pendiente` → `Rechazado` (no aplica cambios)

**Tipos de cambios que se aplican al activo**:
- `nombre`: Actualiza nombre del activo
- `categoria`: Actualiza categoría
- `estado`: Actualiza estado
- `ubicacion`: Actualiza ubicación
- `descripcion`: Actualiza descripción
- `responsableId`: Cambia el responsable del activo

---

## Resumen de Endpoints por Rol

### 👤 Usuario (rol: `usuario`)
- ✅ POST `/api/auth/login` - Login
- ✅ POST `/api/auth/register` - Registro
- ✅ GET `/api/users/:id` - Ver usuario específico
- ✅ POST `/api/activos` - Crear activo (genera solicitud)
- ✅ GET `/api/activos` - Ver sus propios activos
- ✅ GET `/api/activos/:id` - Ver detalle de sus activos
- ✅ GET `/api/solicitudes` - Ver sus propias solicitudes
- ✅ GET `/api/solicitudes/:id` - Ver detalle de sus solicitudes

### 🛡️ Responsable de Seguridad (rol: `responsable_seguridad`)
- ✅ Todos los endpoints de Usuario
- ✅ GET `/api/solicitudes` - Ver TODAS las solicitudes
- ✅ PUT `/api/solicitudes/:id/revisar` - Aprobar/rechazar solicitudes
- ✅ GET `/api/activos` - Ver TODOS los activos

### 📊 Auditor (rol: `auditor`)
- ✅ Todos los endpoints de Usuario
- ✅ GET `/api/activos` - Ver TODOS los activos (solo lectura)
- ✅ GET `/api/solicitudes` - Ver TODAS las solicitudes (solo lectura)

### 👑 Administrador (rol: `administrador`)
- ✅ **ACCESO TOTAL** a todos los endpoints
- ✅ GET `/api/users` - Listar todos los usuarios
- ✅ GET `/api/users/stats/summary` - Estadísticas de usuarios
- ✅ PUT `/api/users/:id` - Actualizar usuarios
- ✅ DELETE `/api/users/:id` - Eliminar usuarios
- ✅ Todos los permisos de Responsable de Seguridad y Auditor

---

## Convenciones de Respuesta

Todas las rutas siguen un formato consistente de respuesta:

**Éxito**:
```json
{
  "success": true,
  "message": "Descripción de la operación",
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "error": "Descripción del error"
}
```

**Códigos HTTP utilizados**:
- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Bad Request (validación fallida)
- `401`: Unauthorized (no autenticado o credenciales inválidas)
- `403`: Forbidden (no autorizado - sin permisos)
- `404`: Not Found (recurso no encontrado)
- `409`: Conflict (recurso duplicado)
- `500`: Internal Server Error (error del servidor)

---

### 📁 Carpeta `/src/utils`

Esta carpeta contiene funciones auxiliares y utilidades reutilizables en toda la aplicación.

---

#### 📄 `helpers.js`

**Propósito**: Proporcionar funciones auxiliares para manejo de respuestas, validaciones, generación de códigos y otras utilidades comunes.

**Dependencias**:
- `jsonwebtoken`: Para generación de tokens JWT

---

##### **Función: `asyncHandler`**

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Descripción**: Wrapper para funciones asíncronas de Express que elimina la necesidad de bloques try-catch.

**Parámetros**:
- `fn` (Function): Función asíncrona del controlador/ruta

**Retorna**:
- Function: Middleware de Express que maneja automáticamente los errores

**Funcionamiento**:
1. Envuelve la función en `Promise.resolve()`
2. Si la promesa se resuelve: continúa normalmente
3. Si la promesa falla: captura el error con `.catch()` y lo pasa a `next(error)`
4. El error es capturado por el middleware `errorHandler`

**Uso típico**:
```javascript
// Sin asyncHandler (requiere try-catch manual)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Con asyncHandler (limpio y automático)
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));
```

**Ventajas**:
- Elimina bloques try-catch repetitivos
- Manejo centralizado de errores
- Código más limpio y legible

---

##### **Función: `sendResponse`**

```javascript
const sendResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};
```

**Descripción**: Helper para enviar respuestas exitosas con formato consistente.

**Parámetros**:
- `res` (Response): Objeto de respuesta de Express
- `statusCode` (number, default: 200): Código de estado HTTP
- `message` (string, default: 'Success'): Mensaje descriptivo de la operación
- `data` (any, default: null): Datos a retornar (objeto, array, etc.)

**Retorna**: void (envía respuesta HTTP)

**Formato de respuesta**:
```json
{
  "success": true,
  "message": "Usuarios obtenidos correctamente",
  "data": {
    "users": [...],
    "pagination": {...}
  },
  "timestamp": "2025-12-07T10:30:00.000Z"
}
```

**Campos de la respuesta**:
- `success`: Siempre `true` (indica operación exitosa)
- `message`: Descripción de lo que se realizó
- `data`: Información retornada (puede ser null)
- `timestamp`: Fecha/hora ISO de la respuesta

**Ejemplos de uso**:
```javascript
// Respuesta simple sin datos
sendResponse(res, 200, 'Operación exitosa');

// Respuesta con datos
sendResponse(res, 200, 'Usuario encontrado', { user: userObject });

// Respuesta de creación
sendResponse(res, 201, 'Activo creado exitosamente', { activo: newActivo });

// Respuesta con múltiples datos
sendResponse(res, 200, 'Consulta exitosa', {
  items: items,
  total: count,
  page: pageNumber
});
```

**Códigos de estado comunes**:
- `200`: OK (operación exitosa)
- `201`: Created (recurso creado)
- `204`: No Content (operación exitosa sin datos)

---

##### **Función: `sendError`**

```javascript
const sendError = (res, statusCode = 500, message = 'Internal Server Error', error = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error;
  }

  res.status(statusCode).json(response);
};
```

**Descripción**: Helper para enviar respuestas de error con formato consistente.

**Parámetros**:
- `res` (Response): Objeto de respuesta de Express
- `statusCode` (number, default: 500): Código de estado HTTP de error
- `message` (string, default: 'Internal Server Error'): Mensaje descriptivo del error
- `error` (any, default: null): Objeto de error detallado (solo en desarrollo)

**Retorna**: void (envía respuesta HTTP)

**Formato de respuesta en producción**:
```json
{
  "success": false,
  "message": "Usuario no encontrado",
  "timestamp": "2025-12-07T10:30:00.000Z"
}
```

**Formato de respuesta en desarrollo**:
```json
{
  "success": false,
  "message": "Usuario no encontrado",
  "timestamp": "2025-12-07T10:30:00.000Z",
  "error": {
    "stack": "Error: Usuario no encontrado\n    at...",
    "details": {...}
  }
}
```

**Campos de la respuesta**:
- `success`: Siempre `false` (indica error)
- `message`: Descripción del error
- `timestamp`: Fecha/hora ISO del error
- `error`: Detalles adicionales (solo en NODE_ENV=development)

**Ejemplos de uso**:
```javascript
// Error 400 - Bad Request
sendError(res, 400, 'Email y contraseña son requeridos');

// Error 401 - Unauthorized
sendError(res, 401, 'Credenciales inválidas');

// Error 403 - Forbidden
sendError(res, 403, 'No tienes permisos para realizar esta acción');

// Error 404 - Not Found
sendError(res, 404, 'Usuario no encontrado');

// Error 409 - Conflict
sendError(res, 409, 'Ya existe un usuario con este email');

// Error 500 - Internal Server Error
sendError(res, 500, 'Error interno del servidor');

// Con objeto de error en desarrollo
sendError(res, 500, 'Error al procesar solicitud', error);
```

**Códigos de estado de error comunes**:
- `400`: Bad Request (validación fallida)
- `401`: Unauthorized (no autenticado)
- `403`: Forbidden (sin permisos)
- `404`: Not Found (recurso no encontrado)
- `409`: Conflict (conflicto/duplicado)
- `500`: Internal Server Error (error del servidor)

**Seguridad**:
- En producción NO expone detalles del error (stack trace)
- Solo incluye información detallada en modo desarrollo
- Previene filtración de información sensible

---

##### **Función: `generateRandomString`**

```javascript
const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
```

**Descripción**: Genera una cadena aleatoria alfanumérica.

**Parámetros**:
- `length` (number, default: 32): Longitud de la cadena a generar

**Retorna**:
- string: Cadena aleatoria de la longitud especificada

**Caracteres utilizados**:
- Letras mayúsculas: A-Z
- Letras minúsculas: a-z
- Números: 0-9

**Ejemplos de uso**:
```javascript
// Generar token de 32 caracteres
const token = generateRandomString();
// Output: "aB3dEf7gHi9jKl1mNo2pQr5sT8uVwXyZ"

// Generar código corto de 8 caracteres
const code = generateRandomString(8);
// Output: "aB3dEf7g"

// Generar identificador único de 16 caracteres
const id = generateRandomString(16);
// Output: "aB3dEf7gHi9jKl1m"
```

**Casos de uso**:
- Tokens de recuperación de contraseña
- Códigos de verificación
- Identificadores únicos temporales
- Claves de sesión

**Nota**: No es criptográficamente seguro. Para aplicaciones que requieren mayor seguridad, usar `crypto.randomBytes()`.

---

##### **Función: `isValidEmail`**

```javascript
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

**Descripción**: Valida el formato de un correo electrónico usando expresión regular.

**Parámetros**:
- `email` (string): Correo electrónico a validar

**Retorna**:
- boolean: `true` si el formato es válido, `false` si no lo es

**Regex utilizado**: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**Validaciones del regex**:
- `^[^\s@]+`: Uno o más caracteres (sin espacios ni @) antes del @
- `@`: Debe contener exactamente un @
- `[^\s@]+`: Uno o más caracteres (sin espacios ni @) después del @
- `\.`: Debe contener un punto
- `[^\s@]+$`: Uno o más caracteres hasta el final

**Ejemplos**:
```javascript
isValidEmail('usuario@example.com');     // true
isValidEmail('juan.perez@empresa.com');  // true
isValidEmail('admin@localhost.local');   // true
isValidEmail('test@mail.co');            // true

isValidEmail('usuario@');                // false (falta dominio)
isValidEmail('@example.com');            // false (falta usuario)
isValidEmail('usuario.example.com');     // false (falta @)
isValidEmail('usuario @example.com');    // false (contiene espacio)
isValidEmail('usuario@example');         // false (falta TLD)
```

**Uso típico**:
```javascript
if (!isValidEmail(email)) {
  return sendError(res, 400, 'Formato de email inválido');
}
```

**Limitaciones**:
- Validación básica de formato
- No verifica si el email existe realmente
- No valida dominios específicos
- Para validación más estricta, considerar librerías como `validator.js`

---

##### **Función: `sanitizeInput`**

```javascript
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};
```

**Descripción**: Sanitiza entradas de usuario para prevenir ataques XSS básicos.

**Parámetros**:
- `input` (any): Valor a sanitizar

**Retorna**:
- string: Cadena sanitizada (si el input es string)
- any: Valor original (si el input no es string)

**Operaciones de sanitización**:

1. **Verificación de tipo**:
   ```javascript
   if (typeof input !== 'string') return input;
   ```
   - Si no es string, retorna el valor sin modificar
   - Evita errores al intentar aplicar métodos de string

2. **Trim (eliminación de espacios)**:
   ```javascript
   input.trim()
   ```
   - Elimina espacios en blanco al inicio y final
   - `"  hola  "` → `"hola"`

3. **Eliminación de caracteres peligrosos**:
   ```javascript
   .replace(/[<>]/g, '')
   ```
   - Elimina caracteres `<` y `>` (usado en tags HTML)
   - Previene inyección básica de HTML/JavaScript
   - `"<script>alert('xss')</script>"` → `"scriptalert('xss')/script"`

**Ejemplos de uso**:
```javascript
// Sanitizar texto normal
sanitizeInput('  Hola Mundo  ');
// Output: "Hola Mundo"

// Sanitizar con caracteres HTML
sanitizeInput('<script>alert("XSS")</script>');
// Output: 'scriptalert("XSS")/script'

// Input con etiquetas HTML
sanitizeInput('Nombre: <b>Juan</b>');
// Output: 'Nombre: bJuan/b'

// Números y otros tipos
sanitizeInput(123);      // Output: 123 (sin cambios)
sanitizeInput(null);     // Output: null (sin cambios)
sanitizeInput({a: 1});   // Output: {a: 1} (sin cambios)

// Uso en rutas
const { nombre, email } = req.body;
const sanitizedData = {
  nombre: sanitizeInput(nombre),
  email: sanitizeInput(email).toLowerCase()
};
```

**Casos de uso típicos**:
```javascript
// Sanitizar datos de registro
const sanitizedData = {
  nombre: sanitizeInput(nombre),
  apellido: sanitizeInput(apellido),
  email: sanitizeInput(email).toLowerCase(),
  telefono: sanitizeInput(telefono)
};

// Sanitizar búsquedas
const searchTerm = sanitizeInput(req.query.search);

// Sanitizar comentarios
const comentario = sanitizeInput(req.body.comentario);
```

**Limitaciones**:
- Sanitización básica (solo `<` y `>`)
- NO protege contra todos los tipos de XSS
- NO protege contra SQL injection (usar queries parametrizadas)
- Para sanitización más robusta, considerar librerías como `DOMPurify` o `sanitize-html`

**Recomendaciones**:
- Usar en combinación con validación de entrada
- Aplicar a TODOS los inputs del usuario
- Complementar con otras medidas de seguridad
- Usar Content Security Policy (CSP) en el frontend

---

##### **Función: `generateUserCode`**

```javascript
const generateUserCode = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `USR-${year}-${randomNum}`;
};
```

**Descripción**: Genera un código único para identificar usuarios.

**Parámetros**: Ninguno

**Retorna**:
- string: Código único en formato `USR-YYYY-XXXX`

**Componentes del código**:

1. **Prefijo fijo**: `USR-`
   - Identifica que es un código de usuario

2. **Año actual**: `YYYY`
   ```javascript
   const year = new Date().getFullYear();
   ```
   - Usa el año actual (ej: 2025)
   - Facilita organización temporal

3. **Número aleatorio**: `XXXX`
   ```javascript
   const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
   ```
   - Genera número aleatorio entre 0 y 9999
   - `Math.floor(Math.random() * 9999)` → número entero de 0 a 9998
   - `.toString()` → convierte a string
   - `.padStart(4, '0')` → rellena con ceros a la izquierda hasta 4 dígitos

**Formato final**: `USR-YYYY-XXXX`

**Ejemplos de códigos generados**:
```javascript
generateUserCode();  // "USR-2025-0001"
generateUserCode();  // "USR-2025-3847"
generateUserCode();  // "USR-2025-9234"
generateUserCode();  // "USR-2025-0056"
```

**Características**:
- Hasta 10,000 códigos únicos por año (0000-9999)
- Formato legible y organizado
- Incluye año para contexto temporal
- Fácil de buscar y filtrar

**Uso en registro de usuarios**:
```javascript
// Generar código único verificando que no exista
let codigo;
let codigoExists = true;

while (codigoExists) {
  codigo = generateUserCode();
  const userWithCode = await User.findOne({ codigo });
  if (!userWithCode) {
    codigoExists = false;
  }
}

// Ahora 'codigo' es único
const newUser = new User({
  codigo,
  nombre,
  apellido,
  // ... otros campos
});
```

**Nota**: Aunque poco probable, pueden ocurrir colisiones. Siempre verificar unicidad en base de datos antes de usar.

---

##### **Función: `isValidPassword`**

```javascript
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
```

**Descripción**: Valida la fortaleza de una contraseña según reglas de seguridad.

**Parámetros**:
- `password` (string): Contraseña a validar

**Retorna**:
- boolean: `true` si cumple requisitos, `false` si no

**Regex utilizado**: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/`

**Requisitos de la contraseña**:

1. **Mínimo 8 caracteres**: `{8,}$`
   - Debe tener al menos 8 caracteres de longitud

2. **Al menos una letra minúscula**: `(?=.*[a-z])`
   - Lookahead positivo que verifica presencia de a-z

3. **Al menos una letra mayúscula**: `(?=.*[A-Z])`
   - Lookahead positivo que verifica presencia de A-Z

4. **Al menos un número**: `(?=.*\d)`
   - Lookahead positivo que verifica presencia de dígito

5. **Caracteres permitidos**: `[A-Za-z\d@$!%*?&]`
   - Letras mayúsculas y minúsculas
   - Números
   - Caracteres especiales: `@ $ ! % * ? &`

**Ejemplos**:
```javascript
// Contraseñas VÁLIDAS ✅
isValidPassword('Password123');       // true
isValidPassword('MyPass123!');        // true
isValidPassword('Secure@2025');       // true
isValidPassword('Admin123$');         // true
isValidPassword('Test1234*');         // true

// Contraseñas INVÁLIDAS ❌
isValidPassword('password');          // false (sin mayúscula ni número)
isValidPassword('PASSWORD123');       // false (sin minúscula)
isValidPassword('Password');          // false (sin número)
isValidPassword('Pass123');           // false (menos de 8 caracteres)
isValidPassword('12345678');          // false (solo números)
isValidPassword('PASSWORD');          // false (sin minúscula ni número)
isValidPassword('Pass 123');          // false (contiene espacio - no permitido)
```

**Uso típico**:
```javascript
if (!isValidPassword(contrasena)) {
  return sendError(
    res, 
    400, 
    'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
  );
}
```

**Fortaleza de seguridad**:
- ✅ Previene contraseñas comunes débiles
- ✅ Requiere mezcla de caracteres
- ✅ Longitud mínima adecuada
- ✅ Permite caracteres especiales opcionales

**Mejoras posibles**:
- Requerir caracteres especiales obligatorios
- Aumentar longitud mínima a 10-12 caracteres
- Verificar contra lista de contraseñas comunes
- Validar que no contenga información del usuario

---

##### **Función: `generateJWTToken`**

```javascript
const generateJWTToken = (payload) => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
    }
  );
};
```

**Descripción**: Genera un token JWT firmado con la información del usuario.

**Parámetros**:
- `payload` (Object): Datos a incluir en el token

**Retorna**:
- string: Token JWT firmado

**Funcionamiento**:

1. **Firma del token**:
   ```javascript
   jwt.sign(payload, secret, options)
   ```
   - Usa el método `sign` de jsonwebtoken
   - Firma el payload con la clave secreta
   - Aplica opciones de configuración

2. **Clave secreta**:
   ```javascript
   process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production'
   ```
   - Lee `JWT_SECRET` del archivo `.env`
   - Usa valor por defecto si no está configurado
   - ⚠️ IMPORTANTE: Cambiar en producción

3. **Tiempo de expiración**:
   ```javascript
   expiresIn: process.env.JWT_EXPIRES_IN || '7d'
   ```
   - Lee `JWT_EXPIRES_IN` del archivo `.env`
   - Por defecto: 7 días
   - Formatos válidos: `60`, `"2 days"`, `"10h"`, `"7d"`

**Estructura típica del payload**:
```javascript
const tokenPayload = {
  id: user._id,
  email: user.email,
  rol: user.rol,
  codigo: user.codigo
};
```

**Campos comunes en el payload**:
- `id`: ID del usuario (para identificación)
- `email`: Email del usuario
- `rol`: Rol para autorización
- `codigo`: Código único del usuario

**Ejemplo de uso completo**:
```javascript
// En ruta de login
const user = await User.findOne({ email });

// Crear payload
const tokenPayload = {
  id: user._id,
  email: user.email,
  rol: user.rol,
  codigo: user.codigo
};

// Generar token
const token = generateJWTToken(tokenPayload);

// Enviar en respuesta
sendResponse(res, 200, 'Login exitoso', {
  user: userResponse,
  token: token,
  expiresIn: '7d'
});
```

**Estructura del token JWT**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbCI6InVzdWFyaW8iLCJjb2RpZ28iOiJVU1ItMjAyNS0wMDAxIiwiaWF0IjoxNzMzNTc4ODAwLCJleHAiOjE3MzQxODM2MDB9.signature
```

**Partes del token** (separadas por `.`):
1. **Header**: Tipo y algoritmo (`HS256`)
2. **Payload**: Datos del usuario + metadata (iat, exp)
3. **Signature**: Firma criptográfica

**Decodificación del token**:
En el middleware `auth`, el token se verifica con:
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// decoded = { id, email, rol, codigo, iat, exp }
```

**Campos automáticos agregados**:
- `iat` (issued at): Timestamp de creación
- `exp` (expires): Timestamp de expiración

**Seguridad**:
- ✅ Token firmado (no puede modificarse sin la clave)
- ✅ Expira automáticamente
- ✅ No almacena información sensible (no incluir contraseñas)
- ⚠️ Cambiar `JWT_SECRET` en producción
- ⚠️ Usar valor largo y aleatorio para `JWT_SECRET`

**Configuración recomendada en `.env`**:
```env
JWT_SECRET=tu_clave_super_secreta_de_al_menos_32_caracteres_aleatorios
JWT_EXPIRES_IN=7d
```

---

## Resumen de Funciones Exportadas

```javascript
module.exports = {
  asyncHandler,        // Wrapper para async/await sin try-catch
  sendResponse,        // Respuestas de éxito consistentes
  sendError,          // Respuestas de error consistentes
  generateRandomString, // Strings aleatorios
  isValidEmail,       // Validación de email
  sanitizeInput,      // Sanitización anti-XSS
  generateUserCode,   // Códigos únicos de usuario
  isValidPassword,    // Validación de contraseña fuerte
  generateJWTToken    // Generación de tokens JWT
};
```

**Uso combinado típico**:
```javascript
const {
  asyncHandler,
  sendResponse,
  sendError,
  isValidEmail,
  sanitizeInput,
  isValidPassword,
  generateJWTToken
} = require('../utils/helpers');

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validar y sanitizar
  if (!isValidEmail(email)) {
    return sendError(res, 400, 'Email inválido');
  }
  
  const sanitizedEmail = sanitizeInput(email).toLowerCase();
  
  // Buscar usuario
  const user = await User.findOne({ email: sanitizedEmail });
  
  if (!user) {
    return sendError(res, 401, 'Credenciales inválidas');
  }
  
  // Generar token
  const token = generateJWTToken({ id: user._id, rol: user.rol });
  
  // Responder
  sendResponse(res, 200, 'Login exitoso', { token });
}));
```

---

**Última actualización**: Diciembre 2025
