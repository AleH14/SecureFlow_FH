# Documentación del Frontend - SecureFlow

## 📑 Índice de Contenidos

### [Descripción General](#descripción-general)

### [1. Estructura del Proyecto](#1-estructura-del-proyecto)
- [Tecnologías Principales](#tecnologías-principales)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Características Principales](#características-principales)
  - [Sistema de Autenticación](#1-sistema-de-autenticación)
  - [Control de Acceso Basado en Roles (RBAC)](#2-control-de-acceso-basado-en-roles-rbac)
  - [Gestión de Activos](#3-gestión-de-activos)
  - [Sistema de Solicitudes de Cambio](#4-sistema-de-solicitudes-de-cambio)
  - [Interfaz de Usuario Moderna](#5-interfaz-de-usuario-moderna)

### [2. Servicios de API](#2-servicios-de-api)
- [2.1. api.js - Configuración de Axios](#21-apiservicejs)
- [2.2. authService.js - Autenticación](#22-authservicejs)
  - [login()](#login)
  - [register()](#register)
  - [logout()](#logout)
  - [getCurrentUser()](#getcurrentuser)
- [2.3. userService.js - Gestión de Usuarios](#23-userservicejs)
  - [getUsers()](#getusers)
  - [createUser()](#createuser)
  - [updateUser()](#updateuser)
  - [deleteUser()](#deleteuser)
  - [getUserById()](#getuserbyid)
- [2.4. activoService.js - Gestión de Activos](#24-activoservicejs)
  - [getActivos()](#getactivos)
  - [getActivoById()](#getactivobyid)
  - [createActivo()](#createactivo)
  - [updateActivo()](#updateactivo)
  - [deleteActivo()](#deleteactivo)
  - [getActivosByUser()](#getactivosbyuser)
  - [getActivoHistory()](#getactivohistory)
  - [assignActivo()](#assignactivo)
  - [getActivoCambios()](#getactivocambios)
- [2.5. requestService.js - Gestión de Solicitudes](#25-requestservicejs)
  - [getSolicitudes()](#getsolicitudes)
  - [createSolicitud()](#createsolicitud)
  - [updateSolicitudStatus()](#updatesolicitudstatus)
  - [getSolicitudById()](#getsolicitudbyid)
- [2.6. index.js - Exportaciones Centralizadas](#26-indexjs)

### [3. Middleware](#3-middleware)
- [3.1. ProtectedRoute.jsx](#31-protectedroutejsx)
  - [Descripción](#descripción)
  - [Props](#props)
  - [Flujo de Autenticación](#flujo-de-autenticación)
  - [Ejemplos de Uso](#ejemplos-de-uso)
  - [Consideraciones de Seguridad](#consideraciones-de-seguridad)

### [4. Componentes UI](#4-componentes-ui)
- [4.1. Componentes de Formulario](#41-componentes-de-formulario)
  - [Input.js](#inputjs)
  - [Button.js](#buttonjs)
  - [Select.js](#selectjs)
- [4.2. Componentes de Layout](#42-componentes-de-layout)
  - [Header.jsx](#headerjsx)
  - [Sidebar.jsx](#sidebarjsx)
  - [GradientLayout.jsx](#gradientlayoutjsx)
  - [PageLayout.jsx](#pagelayoutjsx)
  - [HeaderTitle.jsx](#headertitlejsx)
  - [UserHeader.jsx](#userheaderjsx)
- [4.3. Componentes de Datos](#43-componentes-de-datos)
  - [Table.jsx](#tablejsx)
  - [SearchBar.jsx](#searchbarjsx)
  - [Card.js](#cardjs)
  - [CardActivo.jsx](#cardactivojsx)
- [4.4. Componentes de Feedback](#44-componentes-de-feedback)
  - [Alert.js](#alertjs)
  - [Toast.jsx](#toastjsx)
  - [Modal.jsx](#modaljsx)
- [4.5. Componentes Compartidos](#45-componentes-compartidos)
  - [InventoryBase.jsx](#inventorybasejsx)
  - [SCVBase.jsx](#scvbasejsx)

### [5. Módulos por Rol](#5-módulos-por-rol)
- [5.1. Panel de Administrador](#51-panel-de-administrador)
  - [Funcionalidades](#funcionalidades)
  - [Rutas](#rutas)
  - [Componentes Principales](#componentes-principales)
  - [Flujos de Usuario](#flujos-de-usuario)
- [5.2. Panel de Responsable de Seguridad](#52-panel-de-responsable-de-seguridad)
  - [Funcionalidades](#funcionalidades-1)
  - [Rutas](#rutas-1)
  - [Componentes Principales](#componentes-principales-1)
  - [Flujo de Revisión](#flujo-de-revisión)
- [5.3. Panel de Auditor](#53-panel-de-auditor)
  - [Funcionalidades](#funcionalidades-2)
  - [Rutas](#rutas-2)
  - [Componentes Principales](#componentes-principales-2)
  - [Características Especiales](#características-especiales)
- [5.4. Panel de Usuario](#54-panel-de-usuario)
  - [Funcionalidades](#funcionalidades-3)
  - [Rutas](#rutas-3)
  - [Componentes Principales](#componentes-principales-3)
  - [Gestión de Solicitudes](#gestión-de-solicitudes)
- [5.5. Flujo Completo de Solicitud de Cambio](#-flujo-completo-de-solicitud-de-cambio)
- [5.6. Resumen de Permisos por Rol](#-resumen-de-permisos-por-rol)

### [6. Sistema de Estilos](#6-sistema-de-estilos)
- [Estructura de Archivos](#-estructura-de-archivos)
- [Paleta de Colores](#-paleta-de-colores)
  - [Colores Principales](#colores-principales)
  - [Dark Mode Support](#dark-mode-support)
  - [Clases de Utilidad](#clases-de-utilidad)
- [Estilos de Botones](#️-estilos-de-botones-buttonscss)
  - [.btn-custom-primary](#btn-custom-primary)
  - [.btn-custom-secondary](#btn-custom-secondary)
  - [.btn-custom-outline](#btn-custom-outline)
- [Estilos de Formularios](#-estilos-de-formularios-formscss)
  - [.custom-input](#custom-input)
  - [.custom-select](#custom-select)
  - [.form-check-input](#form-check-input-checkboxes)
- [Estilos de Componentes](#-estilos-de-componentes-componentscss)
  - [.custom-card](#custom-card)
  - [.custom-alert](#custom-alert)
- [Estilos de Layouts](#-estilos-de-layouts-layoutscss)
  - [.auth-gradient-container](#auth-gradient-container)
  - [.gradient-layout-container](#gradient-layout-container)
- [Estilos Responsivos](#-estilos-responsivos-responsivecss)
- [Estilos de Modales](#-estilos-de-modales-modalcss)
- [Uso del Sistema de Estilos](#-uso-del-sistema-de-estilos)
  - [Importación en la Aplicación](#importación-en-la-aplicación)
  - [Uso en Componentes](#uso-en-componentes)
- [Buenas Prácticas](#-buenas-prácticas)
- [Ejemplo Completo: Página de Login](#-ejemplo-completo-página-de-login)
- [Resumen de Variables CSS](#-resumen-de-variables-css)

---

## Descripción General

SecureFlow Frontend es una aplicación web moderna construida con Next.js y React que proporciona una interfaz de usuario intuitiva para la gestión de activos y solicitudes de cambio. La aplicación implementa autenticación segura, control de acceso basado en roles y una experiencia de usuario optimizada con componentes reutilizables.

## Tecnologías Principales

- **Next.js** (16.0.7): Framework de React para aplicaciones web con renderizado del lado del servidor
- **React** (19.2.0): Biblioteca de JavaScript para construir interfaces de usuario
- **React Bootstrap** (2.10.10): Componentes de Bootstrap para React
- **Axios** (1.13.2): Cliente HTTP para peticiones a la API
- **React Icons** (5.5.0): Biblioteca de iconos para React
- **Bootstrap** (5.3.8): Framework CSS para diseño responsivo

## 1. Estructura del Proyecto

### Arquitectura del Proyecto

SecureFlow Frontend sigue la arquitectura de Next.js App Router, organizando el código en una estructura modular y escalable:

```
frontend/
├── src/
│   ├── app/                    # Rutas y páginas de la aplicación (App Router)
│   │   ├── admin/             # Panel de administrador
│   │   ├── auditor/           # Panel de auditor
│   │   ├── seguridad/         # Panel de responsable de seguridad
│   │   ├── usuario/           # Panel de usuario estándar
│   │   ├── login/             # Página de inicio de sesión
│   │   ├── register/          # Página de registro
│   │   ├── layout.js          # Layout principal de la aplicación
│   │   ├── page.js            # Página de inicio (login)
│   │   └── globals.css        # Estilos globales
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Componentes de interfaz de usuario
│   │   ├── shared/           # Componentes compartidos entre roles
│   │   ├── LoginForm.js      # Formulario de inicio de sesión
│   │   └── RegisterForm.js   # Formulario de registro
│   │
│   ├── services/             # Servicios de comunicación con la API
│   │   ├── api.js           # Configuración base de Axios
│   │   ├── authService.js   # Autenticación y autorización
│   │   ├── userService.js   # Gestión de usuarios
│   │   ├── activoService.js # Gestión de activos
│   │   └── requestService.js # Gestión de solicitudes de cambio
│   │
│   ├── middleware/           # Middleware de Next.js
│   │   └── ProtectedRoute.jsx # Protección de rutas
│   │
│   ├── styles/              # Estilos CSS modulares
│   │   ├── variables.css    # Variables CSS globales
│   │   ├── buttons.css      # Estilos de botones
│   │   ├── forms.css        # Estilos de formularios
│   │   ├── layouts.css      # Estilos de layouts
│   │   ├── components.css   # Estilos de componentes
│   │   ├── modal.css        # Estilos de modales
│   │   └── responsive.css   # Estilos responsivos
│   │
│   ├── contexts/            # Contextos de React (estado global)
│   │
│   └── colors/              # Paleta de colores del proyecto
│       └── palette.txt
│
├── public/                  # Archivos estáticos
│   └── icons/              # Iconos de la aplicación
│
├── __tests__/              # Pruebas automatizadas
│   ├── api.test.js        # Tests de servicios API
│   ├── components.test.js # Tests de componentes
│   └── page.test.js       # Tests de páginas
│
├── package.json           # Dependencias y scripts
├── next.config.mjs       # Configuración de Next.js
├── jest.config.js        # Configuración de Jest (testing)
└── eslint.config.mjs     # Configuración de ESLint
```

## Características Principales

### 1. **Sistema de Autenticación**
- Inicio de sesión con email y contraseña
- Gestión de tokens JWT almacenados en localStorage
- Cierre de sesión automático al expirar el token
- Redirección automática según el rol del usuario

### 2. **Control de Acceso Basado en Roles (RBAC)**

La aplicación soporta cuatro roles de usuario, cada uno con su propio panel y permisos:

| Rol | Código | Panel | Permisos Principales |
|-----|--------|-------|---------------------|
| **Administrador** | `ADM` | `/admin` | Gestión completa de usuarios, activos y solicitudes |
| **Responsable de Seguridad** | `SEG` | `/seguridad` | Gestión de activos, revisión y aprobación de solicitudes |
| **Auditor** | `AUD` | `/auditor` | Visualización de inventario y solicitudes (solo lectura) |
| **Usuario Estándar** | `USU` | `/usuario` | Creación de solicitudes, visualización de activos asignados |

### 3. **Gestión de Activos**
- Visualización de inventario de activos tecnológicos
- Búsqueda y filtrado de activos
- Asignación de activos a usuarios
- Historial de cambios en activos

### 4. **Sistema de Solicitudes de Cambio**
- Creación de solicitudes de cambio en activos
- Flujo de aprobación multi-nivel
- Estados: Pendiente, En Revisión, Aprobada, Rechazada
- Historial de revisiones y comentarios

### 5. **Interfaz de Usuario Responsiva**
- Diseño adaptable a dispositivos móviles, tablets y escritorio
- Componentes reutilizables y consistentes
- Sidebar de navegación con menús contextuales por rol
- Headers personalizados con información del usuario

## Flujo de Navegación

```
┌─────────────────────────────────────────────────────────────┐
│                     Página de Inicio (/)                     │
│                      LoginForm.js                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ├─ Login exitoso
                        │
                        ▼
            ┌───────────────────────┐
            │   Validación de Rol   │
            └───────────┬───────────┘
                        │
        ────────────────┼────────────────────
        │               │               │     │
        ▼               ▼               ▼     ▼
    /admin       /seguridad       /auditor   /usuario
    ┌─────┐       ┌─────┐         ┌─────┐   ┌─────┐
    │ ADM │       │ SEG │         │ AUD │   │ USU │
    └─────┘       └─────┘         └─────┘   └─────┘
        │               │               │     │
        ├─ Users        ├─ Inventory    │     ├─ Inventory
        ├─ Inventory    ├─ SCV          │     ├─ SCV
        ├─ SCV          ├─ Solicitudes  │     ├─ Solicitudes
        └─ Register     └─ Revisión     │     └─ Activos
                                        │
                                        └─ (Solo lectura de SCV y comentar)
```

## Comunicación con el Backend

La aplicación se comunica con el backend a través de servicios centralizados ubicados en `/src/services/`:

### Configuración Base (api.js)
```javascript
// URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Instancia de Axios con configuración por defecto
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir token JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Servicios Disponibles

| Servicio | Archivo | Responsabilidad |
|----------|---------|-----------------|
| **Auth Service** | `authService.js` | Login, registro, logout, validación de sesión |
| **User Service** | `userService.js` | CRUD de usuarios, actualización de perfiles |
| **Activo Service** | `activoService.js` | Gestión de activos, búsqueda, asignación |
| **Request Service** | `requestService.js` | Solicitudes de cambio, aprobaciones, rechazos |

## Sistema de Estilos

El proyecto utiliza un sistema de estilos modular y escalable:

### Variables CSS Globales (`variables.css`)
Define colores, tipografías, espaciados y transiciones consistentes en toda la aplicación:

```css
:root {
  /* Colores principales */
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  
  /* Espaciados */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### Organización de Estilos
- **variables.css**: Variables y tokens de diseño
- **buttons.css**: Estilos de botones y acciones
- **forms.css**: Inputs, selects, formularios
- **layouts.css**: Estructuras de página (sidebars, headers)
- **components.css**: Componentes específicos (cards, tables)
- **modal.css**: Modales y overlays
- **responsive.css**: Media queries y adaptabilidad

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en http://localhost:3000

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Testing
npm run test         # Ejecuta las pruebas
npm run test:watch   # Ejecuta las pruebas en modo watch
npm run test:coverage # Genera reporte de cobertura

# Linting
npm run lint         # Verifica el código con ESLint
```

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto frontend:

```env
# URL de la API del backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Otras configuraciones
NEXT_PUBLIC_APP_NAME=SecureFlow
```

## Componentes Reutilizables

El proyecto incluye una biblioteca de componentes UI consistentes y reutilizables:

### Componentes UI (`/src/components/ui/`)
- **Button**: Botones con variantes (primary, secondary, danger, success)
- **Input**: Campos de entrada con validación
- **Select**: Selectores desplegables
- **Card**: Tarjetas de contenido
- **Table**: Tablas de datos con paginación
- **Modal**: Modales y diálogos
- **Alert**: Mensajes de alerta
- **Toast**: Notificaciones temporales
- **Header**: Encabezados de página
- **Sidebar**: Menú lateral de navegación

### Componentes Compartidos (`/src/components/shared/`)
- **InventoryBase**: Componente base para inventario (reutilizable entre roles)
- **SCVBase**: Componente base para Sistema de Control de Versiones

## Flujo de Datos

```
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Componente  │────▶│   Service    │────▶│   Backend    │
│  React/Next  │     │   (Axios)    │     │   API REST   │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │                     ▲
       │                     │
       ▼                     │
┌──────────────┐             │
│   Estado     │─────────────┘
│   Local      │
└──────────────┘
```

## Seguridad

### Protección de Rutas
Todas las rutas protegidas utilizan el componente `ProtectedRoute.jsx` que:
- Verifica la existencia del token JWT
- Valida el rol del usuario
- Redirige a login si no está autenticado
- Redirige a la página apropiada si no tiene permisos

### Buenas Prácticas Implementadas
- Tokens JWT almacenados en localStorage (considerar httpOnly cookies en producción)
- Validación de roles en cliente y servidor
- Sanitización de inputs
- Prevención de XSS con React (escapa automáticamente)
- HTTPS en producción

## Testing

El proyecto utiliza Jest y React Testing Library para pruebas:

```javascript
// Ejemplo de test de componente
import { render, screen } from '@testing-library/react';
import LoginForm from '@/components/LoginForm';

test('renders login form', () => {
  render(<LoginForm />);
  const emailInput = screen.getByLabelText(/email/i);
  expect(emailInput).toBeInTheDocument();
});
```

## Recomendaciones para Desarrollo

1. **Componentes**: Mantener componentes pequeños y reutilizables
2. **Estilos**: Usar variables CSS para mantener consistencia
3. **Servicios**: Centralizar toda comunicación con API en `/services/`
4. **Estados**: Considerar Context API o Zustand para estado global complejo
5. **Testing**: Escribir tests para componentes críticos y servicios
6. **Performance**: Usar `React.memo()` y `useMemo()` cuando sea necesario
7. **SEO**: Aprovechar metadata de Next.js para optimización

---

---

## 📁 Carpeta: `/src/services/`

Los servicios son módulos que encapsulan toda la comunicación con el backend API. Cada servicio está especializado en un dominio específico (autenticación, usuarios, activos, solicitudes) y proporciona funciones reutilizables para realizar peticiones HTTP.

### Arquitectura de Servicios

```
services/
├── api.js              # Configuración base de Axios
├── authService.js      # Autenticación y sesiones
├── userService.js      # Gestión de usuarios
├── activoService.js    # Gestión de activos
├── requestService.js   # Gestión de solicitudes de cambio
└── index.js            # Exportación centralizada
```

---

## `api.js`

**Ubicación**: `/src/services/api.js`

**Propósito**: Configurar y exportar una instancia de Axios con configuración base y interceptores para todas las peticiones HTTP a la API.

### Código Completo

```javascript
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000,
})

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
```

### Configuración

| Propiedad | Valor | Descripción |
|-----------|-------|-------------|
| **baseURL** | `process.env.NEXT_PUBLIC_API_BASE_URL` | URL base de la API del backend |
| **timeout** | `10000` (10 segundos) | Tiempo máximo de espera para peticiones |

### Interceptor de Peticiones

**Función**: Añade automáticamente el token JWT a todas las peticiones salientes.

**Flujo**:
1. Recupera el token de `localStorage`
2. Si existe, añade header `Authorization: Bearer <token>`
3. Envía la petición con el token incluido

### Variables de Entorno Necesarias

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Uso en Otros Servicios

```javascript
import api from "./api";

// Todas las peticiones usarán la configuración base
const response = await api.get("/users");
const response = await api.post("/auth/login", { email, contrasena });
```

---

## `authService.js`

**Ubicación**: `/src/services/authService.js`

**Propósito**: Gestionar la autenticación de usuarios, registro, inicio de sesión, cierre de sesión y obtención del usuario actual.

### Funciones Exportadas

#### 1. `login(email, contrasena)`

Inicia sesión de un usuario con credenciales.

**Parámetros**:
- `email` (string): Correo electrónico del usuario
- `contrasena` (string): Contraseña del usuario

**Retorna**: 
```javascript
{
  success: true,
  message: "Login exitoso",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      _id: "673abc123...",
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan@example.com",
      rol: "USU",
      codigo: "USU-001234"
    }
  }
}
```

**Errores Comunes**:
- `400 Bad Request`: Credenciales inválidas
- `401 Unauthorized`: Usuario no encontrado o contraseña incorrecta
- `404 Not Found`: Email no registrado

**Ejemplo de Uso**:
```javascript
import { login } from '@/services/authService';

try {
  const response = await login('usuario@example.com', 'password123');
  
  // Guardar token y usuario en localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  // Redirigir según rol
  if (response.data.user.rol === 'ADM') {
    router.push('/admin');
  }
} catch (error) {
  console.error('Error en login:', error.response?.data?.message);
}
```

---

#### 2. `register(nombre, apellido, email, telefono, departamento, contrasena, confirmarContrasena, rol)`

Registra un nuevo usuario en el sistema (solo administradores).

**Parámetros**:
- `nombre` (string): Nombre del usuario
- `apellido` (string): Apellido del usuario
- `email` (string): Correo electrónico único
- `telefono` (string): Número de teléfono
- `departamento` (string): Departamento de trabajo
- `contrasena` (string): Contraseña (mínimo 8 caracteres)
- `confirmarContrasena` (string): Confirmación de contraseña
- `rol` (string): Rol del usuario (`ADM`, `SEG`, `AUD`, `USU`)

**Retorna**:
```javascript
{
  success: true,
  message: "Usuario registrado exitosamente",
  data: {
    user: {
      _id: "673def456...",
      nombre: "María",
      apellido: "García",
      email: "maria@example.com",
      rol: "USU",
      codigo: "USU-002345",
      activo: true
    }
  }
}
```

**Validaciones**:
- Email no debe estar registrado
- Contraseñas deben coincidir
- Contraseña mínimo 8 caracteres
- Rol debe ser válido

**Ejemplo de Uso**:
```javascript
import { register } from '@/services/authService';

try {
  const response = await register(
    'María',
    'García',
    'maria@example.com',
    '555-1234',
    'TI',
    'Password123',
    'Password123',
    'USU'
  );
  
  alert('Usuario registrado exitosamente: ' + response.data.user.codigo);
} catch (error) {
  console.error('Error en registro:', error.response?.data?.message);
}
```

---

#### 3. `logout()`

Cierra la sesión del usuario actual eliminando el token y datos del usuario.

**Parámetros**: Ninguno

**Retorna**: `void` (no retorna valor)

**Efecto**: Elimina `token` y `user` de `localStorage`

**Ejemplo de Uso**:
```javascript
import { logout } from '@/services/authService';

const handleLogout = () => {
  logout();
  router.push('/login');
};
```

---

#### 4. `getCurrentUser()`

Obtiene los datos del usuario actualmente autenticado desde el backend.

**Parámetros**: Ninguno (usa el token de `localStorage`)

**Retorna**:
```javascript
{
  _id: "673abc123...",
  nombre: "Juan",
  apellido: "Pérez",
  email: "juan@example.com",
  rol: "USU",
  codigo: "USU-001234",
  telefono: "555-1234",
  departamento: "TI",
  activo: true
}
```

**Comportamiento Especial**:
- Si no hay token, retorna `null`
- Si el token es inválido (401), ejecuta `logout()` automáticamente

**Ejemplo de Uso**:
```javascript
import { getCurrentUser } from '@/services/authService';

useEffect(() => {
  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setUserData(user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      router.push('/login');
    }
  };
  
  fetchUser();
}, []);
```

---

## `userService.js`

**Ubicación**: `/src/services/userService.js`

**Propósito**: Gestionar operaciones CRUD de usuarios (obtener, actualizar, eliminar, reactivar).

### Funciones Exportadas

#### 1. `getCurrentUser()`

Obtiene el usuario actual autenticado (similar a authService pero con estructura de respuesta diferente).

**Parámetros**: Ninguno

**Retorna**:
```javascript
{
  success: true,
  message: "Usuario actual obtenido",
  data: {
    _id: "673abc123...",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@example.com",
    rol: "USU",
    codigo: "USU-001234"
  }
}
```

**Ejemplo de Uso**:
```javascript
import { getCurrentUser } from '@/services/userService';

const user = await getCurrentUser();
console.log(user.data.nombre); // "Juan"
```

---

#### 2. `getUsers(includeInactive = false)`

Obtiene lista de todos los usuarios del sistema.

**Parámetros**:
- `includeInactive` (boolean): Si es `true`, incluye usuarios inactivos. Por defecto `false`.

**Retorna**:
```javascript
{
  success: true,
  message: "Usuarios obtenidos exitosamente",
  data: [
    {
      _id: "673abc123...",
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan@example.com",
      rol: "USU",
      codigo: "USU-001234",
      activo: true,
      telefono: "555-1234",
      departamento: "TI"
    },
    // ... más usuarios
  ],
  timestamp: "2025-12-07T10:30:00.000Z"
}
```

**Ejemplo de Uso**:
```javascript
import { getUsers } from '@/services/userService';

// Obtener solo usuarios activos
const activeUsers = await getUsers();

// Obtener todos los usuarios (incluyendo inactivos)
const allUsers = await getUsers(true);

console.log(activeUsers.data); // Array de usuarios activos
```

---

#### 3. `deleteUser(userId)`

Desactiva un usuario (eliminación lógica, no física).

**Parámetros**:
- `userId` (string): ID del usuario a desactivar

**Retorna**:
```javascript
{
  success: true,
  message: "Usuario desactivado exitosamente",
  data: {
    _id: "673abc123...",
    activo: false
  }
}
```

**Importante**: No elimina el usuario de la base de datos, solo cambia `activo: false`.

**Ejemplo de Uso**:
```javascript
import { deleteUser } from '@/services/userService';

const handleDelete = async (userId) => {
  if (confirm('¿Está seguro de desactivar este usuario?')) {
    try {
      await deleteUser(userId);
      alert('Usuario desactivado exitosamente');
      // Refrescar lista de usuarios
    } catch (error) {
      console.error('Error desactivando usuario:', error);
    }
  }
};
```

---

#### 4. `updateUser(userId, userData)`

Actualiza los datos de un usuario existente.

**Parámetros**:
- `userId` (string): ID del usuario a actualizar
- `userData` (object): Datos a actualizar

**Estructura de `userData`**:
```javascript
{
  nombre: "Juan",
  apellido: "Pérez",
  email: "juan@example.com",
  telefono: "555-1234",
  departamento: "TI",
  rol: "USU" // Opcional, solo administradores pueden cambiar
}
```

**Retorna**:
```javascript
{
  success: true,
  message: "Usuario actualizado exitosamente",
  data: {
    _id: "673abc123...",
    nombre: "Juan",
    apellido: "Pérez",
    // ... datos actualizados
  }
}
```

**Ejemplo de Uso**:
```javascript
import { updateUser } from '@/services/userService';

const handleUpdate = async () => {
  try {
    const updatedData = {
      nombre: 'Juan Carlos',
      telefono: '555-5678'
    };
    
    const response = await updateUser('673abc123...', updatedData);
    alert('Usuario actualizado exitosamente');
  } catch (error) {
    console.error('Error actualizando usuario:', error);
  }
};
```

---

#### 5. `reactivateUser(userId)`

Reactiva un usuario previamente desactivado.

**Parámetros**:
- `userId` (string): ID del usuario a reactivar

**Retorna**:
```javascript
{
  success: true,
  message: "Usuario reactivado exitosamente",
  data: {
    _id: "673abc123...",
    activo: true
  }
}
```

**Ejemplo de Uso**:
```javascript
import { reactivateUser } from '@/services/userService';

const handleReactivate = async (userId) => {
  try {
    await reactivateUser(userId);
    alert('Usuario reactivado exitosamente');
    // Refrescar lista
  } catch (error) {
    console.error('Error reactivando usuario:', error);
  }
};
```

---

## `activoService.js`

**Ubicación**: `/src/services/activoService.js`

**Propósito**: Gestionar operaciones relacionadas con activos tecnológicos (crear, leer, actualizar, historial).

### Funciones Exportadas

#### 1. `createActivo(activoData)`

Crea un nuevo activo en el sistema.

**Parámetros**:
- `activoData` (object): Datos del activo a crear

**Estructura de `activoData`**:
```javascript
{
  nombre: "Laptop Dell Latitude",
  tipo: "Hardware",
  marca: "Dell",
  modelo: "Latitude 5520",
  numeroSerie: "DL123456789",
  ubicacion: "Oficina Principal - Piso 3",
  responsable: "673abc123...", // ID del usuario responsable
  estado: "Activo",
  descripcion: "Laptop para desarrollo"
}
```

**Retorna**:
```javascript
{
  activo: {
    _id: "674xyz789...",
    nombre: "Laptop Dell Latitude",
    tipo: "Hardware",
    codigo: "ACT-000001",
    // ... más campos
  },
  solicitud: {
    _id: "675abc456...",
    tipo: "CREACION",
    estado: "APROBADA",
    activo: "674xyz789..."
  }
}
```

**Nota**: Al crear un activo, automáticamente se crea una solicitud de cambio de tipo "CREACION".

**Ejemplo de Uso**:
```javascript
import { createActivo } from '@/services/activoService';

const handleCreate = async () => {
  try {
    const newActivo = {
      nombre: 'Laptop HP ProBook',
      tipo: 'Hardware',
      marca: 'HP',
      modelo: 'ProBook 450',
      numeroSerie: 'HP987654321',
      ubicacion: 'Oficina TI',
      responsable: userId,
      estado: 'Activo',
      descripcion: 'Laptop para testing'
    };
    
    const response = await createActivo(newActivo);
    alert(`Activo creado: ${response.activo.codigo}`);
  } catch (error) {
    console.error('Error creando activo:', error);
  }
};
```

---

#### 2. `getActivos()`

Obtiene lista de todos los activos del sistema.

**Parámetros**: Ninguno

**Retorna**:
```javascript
{
  success: true,
  message: "Activos obtenidos exitosamente",
  data: [
    {
      _id: "674xyz789...",
      nombre: "Laptop Dell Latitude",
      tipo: "Hardware",
      codigo: "ACT-000001",
      marca: "Dell",
      modelo: "Latitude 5520",
      numeroSerie: "DL123456789",
      ubicacion: "Oficina Principal",
      estado: "Activo",
      responsable: {
        _id: "673abc123...",
        nombre: "Juan",
        apellido: "Pérez",
        codigo: "USU-001234"
      }
    },
    // ... más activos
  ],
  timestamp: "2025-12-07T10:30:00.000Z"
}
```

**Ejemplo de Uso**:
```javascript
import { getActivos } from '@/services/activoService';

const [activos, setActivos] = useState([]);

useEffect(() => {
  const fetchActivos = async () => {
    try {
      const response = await getActivos();
      setActivos(response.data);
    } catch (error) {
      console.error('Error obteniendo activos:', error);
    }
  };
  
  fetchActivos();
}, []);
```

---

#### 3. `getActivoById(id)`

Obtiene los detalles de un activo específico por su ID.

**Parámetros**:
- `id` (string): ID del activo

**Retorna**: Objeto del activo (maneja diferentes estructuras de respuesta del backend)

```javascript
{
  _id: "674xyz789...",
  nombre: "Laptop Dell Latitude",
  tipo: "Hardware",
  codigo: "ACT-000001",
  marca: "Dell",
  modelo: "Latitude 5520",
  numeroSerie: "DL123456789",
  ubicacion: "Oficina Principal",
  estado: "Activo",
  responsable: {
    _id: "673abc123...",
    nombre: "Juan",
    apellido: "Pérez"
  },
  descripcion: "Laptop para desarrollo",
  createdAt: "2025-01-01T10:00:00.000Z",
  updatedAt: "2025-12-07T10:30:00.000Z"
}
```

**Manejo de Estructuras**: Esta función normaliza diferentes formatos de respuesta del backend.

**Ejemplo de Uso**:
```javascript
import { getActivoById } from '@/services/activoService';

const [activo, setActivo] = useState(null);

useEffect(() => {
  const fetchActivo = async () => {
    try {
      const activoData = await getActivoById('674xyz789...');
      setActivo(activoData);
    } catch (error) {
      console.error('Error obteniendo activo:', error);
    }
  };
  
  fetchActivo();
}, [id]);
```

---

#### 4. `updateActivo(id, activoData)`

Actualiza los datos de un activo existente.

**Parámetros**:
- `id` (string): ID del activo a actualizar
- `activoData` (object): Datos a actualizar

**Estructura de `activoData`**:
```javascript
{
  nombre: "Laptop Dell Latitude 5530",
  ubicacion: "Oficina Principal - Piso 4",
  estado: "En Mantenimiento",
  descripcion: "Actualización de ubicación y estado"
}
```

**Retorna**:
```javascript
{
  activo: {
    _id: "674xyz789...",
    // ... datos actualizados
  },
  solicitud: {
    _id: "675def123...",
    tipo: "MODIFICACION",
    estado: "PENDIENTE",
    cambiosPropuestos: { /* cambios */ }
  }
}
```

**Nota**: Al actualizar un activo, se crea automáticamente una solicitud de cambio de tipo "MODIFICACION".

**Ejemplo de Uso**:
```javascript
import { updateActivo } from '@/services/activoService';

const handleUpdate = async () => {
  try {
    const updates = {
      ubicacion: 'Oficina TI - Sala 2',
      estado: 'En Mantenimiento'
    };
    
    const response = await updateActivo('674xyz789...', updates);
    alert('Solicitud de cambio creada: ' + response.solicitud._id);
  } catch (error) {
    console.error('Error actualizando activo:', error);
  }
};
```

---

#### 5. `historyCommentsByActivoId(id)`

Obtiene el historial de comentarios de un activo.

**Parámetros**:
- `id` (string): ID del activo

**Retorna**: Array de comentarios

```javascript
[
  {
    usuario: {
      nombre: "María",
      apellido: "García",
      rol: "SEG"
    },
    comentario: "Activo revisado y aprobado",
    fecha: "2025-12-01T10:00:00.000Z"
  },
  // ... más comentarios
]
```

**Ejemplo de Uso**:
```javascript
import { historyCommentsByActivoId } from '@/services/activoService';

const [comments, setComments] = useState([]);

const fetchComments = async () => {
  const comentarios = await historyCommentsByActivoId('674xyz789...');
  setComments(comentarios);
};
```

---

#### 6. `historyCompleteRequestByActivoId(id)`

Obtiene el historial completo de solicitudes de cambio de un activo.

**Parámetros**:
- `id` (string): ID del activo

**Retorna**:
```javascript
{
  success: true,
  message: "Historial de solicitudes obtenido",
  data: [
    {
      _id: "675abc456...",
      tipo: "CREACION",
      estado: "APROBADA",
      solicitante: {
        nombre: "Juan",
        apellido: "Pérez"
      },
      revisadoPor: {
        nombre: "María",
        apellido: "García"
      },
      cambiosPropuestos: {},
      cambiosAplicados: {},
      createdAt: "2025-01-01T10:00:00.000Z"
    },
    // ... más solicitudes
  ]
}
```

**Ejemplo de Uso**:
```javascript
import { historyCompleteRequestByActivoId } from '@/services/activoService';

const [historial, setHistorial] = useState([]);

const fetchHistorial = async () => {
  try {
    const response = await historyCompleteRequestByActivoId('674xyz789...');
    setHistorial(response.data);
  } catch (error) {
    console.error('Error obteniendo historial:', error);
  }
};
```

---

#### 7. `getResponsablesDisponibles()`

Obtiene lista de usuarios que pueden ser asignados como responsables de activos.

**Parámetros**: Ninguno

**Retorna**: Array de usuarios disponibles

```javascript
[
  {
    _id: "673abc123...",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@example.com",
    rol: "USU",
    codigo: "USU-001234",
    departamento: "TI"
  },
  // ... más usuarios
]
```

**Ejemplo de Uso**:
```javascript
import { getResponsablesDisponibles } from '@/services/activoService';

const [responsables, setResponsables] = useState([]);

useEffect(() => {
  const fetchResponsables = async () => {
    const users = await getResponsablesDisponibles();
    setResponsables(users);
  };
  
  fetchResponsables();
}, []);
```

---

#### 8. `getActivosByResponsable(responsableId, params = {})`

Obtiene activos asignados a un responsable específico.

**Parámetros**:
- `responsableId` (string): ID del usuario responsable
- `params` (object): Parámetros adicionales de query

**Estructura de `params`**:
```javascript
{
  limit: 10,
  page: 1,
  estado: "Activo"
}
```

**Retorna**:
```javascript
{
  success: true,
  data: {
    activos: [
      {
        _id: "674xyz789...",
        nombre: "Laptop Dell",
        responsable: "673abc123..."
      }
    ],
    total: 5
  }
}
```

**Ejemplo de Uso**:
```javascript
import { getActivosByResponsable } from '@/services/activoService';

const activos = await getActivosByResponsable('673abc123...', { limit: 20 });
console.log(activos.data.activos);
```

---

#### 9. `hasActivosAsignados(responsableId)`

Verifica si un usuario tiene activos asignados.

**Parámetros**:
- `responsableId` (string): ID del usuario

**Retorna**: `boolean` - `true` si tiene activos, `false` si no

**Ejemplo de Uso**:
```javascript
import { hasActivosAsignados } from '@/services/activoService';

const canDeleteUser = async (userId) => {
  const hasActivos = await hasActivosAsignados(userId);
  
  if (hasActivos) {
    alert('No se puede eliminar: usuario tiene activos asignados');
    return false;
  }
  
  return true;
};
```

---

## `requestService.js`

**Ubicación**: `/src/services/requestService.js`

**Propósito**: Gestionar solicitudes de cambio (obtener, revisar, añadir comentarios de auditoría).

### Funciones Exportadas

#### 1. `getRequests()`

Obtiene lista de todas las solicitudes de cambio del sistema.

**Parámetros**: Ninguno

**Retorna**:
```javascript
{
  success: true,
  message: "Solicitudes obtenidas exitosamente",
  data: [
    {
      _id: "675abc456...",
      tipo: "CREACION",
      estado: "PENDIENTE",
      solicitante: {
        _id: "673abc123...",
        nombre: "Juan",
        apellido: "Pérez",
        codigo: "USU-001234"
      },
      activo: {
        _id: "674xyz789...",
        nombre: "Laptop Dell Latitude",
        codigo: "ACT-000001"
      },
      cambiosPropuestos: {
        nombre: "Laptop Dell Latitude",
        tipo: "Hardware",
        // ... más cambios
      },
      createdAt: "2025-12-07T10:00:00.000Z",
      updatedAt: "2025-12-07T10:00:00.000Z"
    },
    // ... más solicitudes
  ],
  timestamp: "2025-12-07T10:30:00.000Z"
}
```

**Estados Posibles**:
- `PENDIENTE`: Solicitud creada, esperando revisión
- `EN_REVISION`: Siendo revisada por responsable de seguridad
- `APROBADA`: Aprobada y cambios aplicados
- `RECHAZADA`: Rechazada por responsable de seguridad

**Tipos Posibles**:
- `CREACION`: Creación de nuevo activo
- `MODIFICACION`: Modificación de activo existente

**Ejemplo de Uso**:
```javascript
import { getRequests } from '@/services/requestService';

const [solicitudes, setSolicitudes] = useState([]);

useEffect(() => {
  const fetchSolicitudes = async () => {
    try {
      const response = await getRequests();
      setSolicitudes(response.data);
    } catch (error) {
      console.error('Error obteniendo solicitudes:', error);
    }
  };
  
  fetchSolicitudes();
}, []);
```

---

#### 2. `getRequestById(id)`

Obtiene los detalles de una solicitud específica por su ID.

**Parámetros**:
- `id` (string): ID de la solicitud

**Retorna**:
```javascript
{
  success: true,
  message: "Solicitud obtenida exitosamente",
  data: {
    _id: "675abc456...",
    tipo: "MODIFICACION",
    estado: "EN_REVISION",
    solicitante: {
      _id: "673abc123...",
      nombre: "Juan",
      apellido: "Pérez",
      email: "juan@example.com",
      rol: "USU",
      codigo: "USU-001234"
    },
    activo: {
      _id: "674xyz789...",
      nombre: "Laptop Dell Latitude",
      codigo: "ACT-000001",
      tipo: "Hardware",
      marca: "Dell",
      estado: "Activo"
    },
    cambiosPropuestos: {
      ubicacion: "Oficina Principal - Piso 4",
      estado: "En Mantenimiento"
    },
    cambiosAplicados: null, // Se llena cuando se aprueba
    revisadoPor: null, // Se llena cuando se revisa
    comentariosRevision: [],
    createdAt: "2025-12-07T10:00:00.000Z",
    updatedAt: "2025-12-07T10:30:00.000Z"
  }
}
```

**Ejemplo de Uso**:
```javascript
import { getRequestById } from '@/services/requestService';

const [solicitud, setSolicitud] = useState(null);

useEffect(() => {
  const fetchSolicitud = async () => {
    try {
      const response = await getRequestById('675abc456...');
      setSolicitud(response.data);
    } catch (error) {
      console.error('Error obteniendo solicitud:', error);
    }
  };
  
  fetchSolicitud();
}, [id]);
```

---

#### 3. `reviewRequest(id, estado, comentario)`

Revisa y aprueba/rechaza una solicitud de cambio (solo Responsable de Seguridad).

**Parámetros**:
- `id` (string): ID de la solicitud a revisar
- `estado` (string): Nuevo estado - `"APROBADA"` o `"RECHAZADA"`
- `comentario` (string): Comentario de la revisión

**Retorna**:
```javascript
{
  success: true,
  message: "Solicitud revisada exitosamente",
  data: {
    _id: "675abc456...",
    estado: "APROBADA",
    revisadoPor: {
      _id: "674seg789...",
      nombre: "María",
      apellido: "García",
      rol: "SEG"
    },
    comentariosRevision: [
      {
        usuario: {
          nombre: "María",
          apellido: "García"
        },
        comentario: "Cambios aprobados, activo actualizado",
        fecha: "2025-12-07T11:00:00.000Z",
        rol: "SEG"
      }
    ],
    cambiosAplicados: {
      ubicacion: "Oficina Principal - Piso 4",
      estado: "En Mantenimiento"
    }
  }
}
```

**Validaciones**:
- Solo usuarios con rol `SEG` pueden revisar
- Estado debe ser `"APROBADA"` o `"RECHAZADA"`
- Comentario es obligatorio

**Ejemplo de Uso**:
```javascript
import { reviewRequest } from '@/services/requestService';

const handleApprove = async (solicitudId) => {
  try {
    const response = await reviewRequest(
      solicitudId,
      'APROBADA',
      'Cambios revisados y aprobados. Todo correcto.'
    );
    
    alert('Solicitud aprobada exitosamente');
    // Refrescar lista de solicitudes
  } catch (error) {
    console.error('Error aprobando solicitud:', error);
  }
};

const handleReject = async (solicitudId) => {
  const motivo = prompt('Ingrese motivo de rechazo:');
  
  if (motivo) {
    try {
      await reviewRequest(solicitudId, 'RECHAZADA', motivo);
      alert('Solicitud rechazada');
    } catch (error) {
      console.error('Error rechazando solicitud:', error);
    }
  }
};
```

---

#### 4. `addCommentToRequestByAuditory(id, comentario)`

Añade un comentario de auditoría a una solicitud (solo Auditor).

**Parámetros**:
- `id` (string): ID de la solicitud
- `comentario` (string): Comentario de auditoría

**Retorna**:
```javascript
{
  success: true,
  message: "Comentario de auditoría añadido",
  data: {
    _id: "675abc456...",
    comentariosRevision: [
      {
        usuario: {
          _id: "674aud123...",
          nombre: "Carlos",
          apellido: "Martínez",
          rol: "AUD"
        },
        comentario: "Revisión de auditoría: cumple con políticas de seguridad",
        fecha: "2025-12-07T11:30:00.000Z",
        rol: "AUD"
      }
    ]
  }
}
```

**Validaciones**:
- Solo usuarios con rol `AUD` pueden añadir comentarios de auditoría
- Comentario no puede estar vacío

**Ejemplo de Uso**:
```javascript
import { addCommentToRequestByAuditory } from '@/services/requestService';

const handleAddAuditComment = async (solicitudId) => {
  const comentario = prompt('Ingrese comentario de auditoría:');
  
  if (comentario) {
    try {
      await addCommentToRequestByAuditory(solicitudId, comentario);
      alert('Comentario de auditoría añadido exitosamente');
      // Refrescar detalles de solicitud
    } catch (error) {
      console.error('Error añadiendo comentario:', error);
    }
  }
};
```

---

## `index.js`

**Ubicación**: `/src/services/index.js`

**Propósito**: Exportación centralizada de todos los servicios para facilitar importaciones.

### Código Completo

```javascript
export * as AuthService from "./authService";
export * as UserService from "./userService";
export * as ActivoService from "./activoService";
export * as RequestService from "./requestService";
```

### Ventajas de la Exportación Centralizada

1. **Importaciones Simplificadas**: Un solo punto de entrada
2. **Namespacing**: Agrupa funciones por dominio
3. **Mantenibilidad**: Fácil reorganizar estructura interna

### Uso Recomendado

```javascript
// ✅ Forma recomendada
import { AuthService, UserService } from '@/services';

await AuthService.login(email, password);
await UserService.getUsers();
```

```javascript
// ❌ Forma alternativa (no recomendada)
import { login } from '@/services/authService';
import { getUsers } from '@/services/userService';
```

---

## Manejo de Errores en Servicios

Todos los servicios siguen el mismo patrón de manejo de errores:

### Estructura de Errores

```javascript
try {
  const response = await someService();
} catch (error) {
  // error.response contiene la respuesta del backend
  console.error('Error:', error.response?.data?.message);
  
  // Estructura típica de error del backend:
  // {
  //   success: false,
  //   message: "Descripción del error",
  //   error: "Detalles técnicos"
  // }
}
```

### Códigos de Estado HTTP Comunes

| Código | Significado | Acción Recomendada |
|--------|-------------|-------------------|
| **200** | OK | Operación exitosa |
| **201** | Created | Recurso creado exitosamente |
| **400** | Bad Request | Validar datos enviados |
| **401** | Unauthorized | Redirigir a login |
| **403** | Forbidden | Usuario sin permisos |
| **404** | Not Found | Recurso no encontrado |
| **500** | Internal Server Error | Mostrar error genérico |

### Ejemplo de Manejo Completo

```javascript
import { login } from '@/services/authService';
import { useRouter } from 'next/navigation';

const handleLogin = async () => {
  try {
    const response = await login(email, password);
    
    // Éxito: guardar token y redirigir
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    router.push('/dashboard');
    
  } catch (error) {
    // Error de red
    if (!error.response) {
      setError('Error de conexión. Verifique su red.');
      return;
    }
    
    // Error del backend
    const status = error.response.status;
    const message = error.response.data?.message || 'Error desconocido';
    
    switch (status) {
      case 400:
      case 401:
        setError('Credenciales inválidas');
        break;
      case 404:
        setError('Usuario no encontrado');
        break;
      case 500:
        setError('Error del servidor. Intente más tarde.');
        break;
      default:
        setError(message);
    }
  }
};
```

---

## Buenas Prácticas para Usar Servicios

### 1. Usar try-catch siempre
```javascript
// ✅ Correcto
try {
  await someService();
} catch (error) {
  handleError(error);
}

// ❌ Incorrecto
await someService(); // Puede romper la aplicación
```

### 2. Mostrar feedback al usuario
```javascript
const handleDelete = async (id) => {
  setLoading(true);
  try {
    await deleteUser(id);
    setSuccess('Usuario eliminado exitosamente');
  } catch (error) {
    setError('Error eliminando usuario');
  } finally {
    setLoading(false);
  }
};
```

### 3. Validar datos antes de enviar
```javascript
const handleSubmit = async () => {
  // Validar antes de enviar
  if (!email || !password) {
    setError('Campos requeridos');
    return;
  }
  
  if (password.length < 8) {
    setError('Contraseña muy corta');
    return;
  }
  
  // Enviar después de validar
  await login(email, password);
};
```

### 4. Limpiar estados al desmontar
```javascript
useEffect(() => {
  const fetchData = async () => {
    const data = await getUsers();
    if (mounted) setUsers(data);
  };
  
  let mounted = true;
  fetchData();
  
  return () => { mounted = false; }; // Cleanup
}, []);
```

---

## 📁 Carpeta: `/src/middleware/`

El middleware de Next.js en SecureFlow se utiliza para proteger rutas y controlar el acceso basado en roles de usuario. Garantiza que solo usuarios autenticados y autorizados puedan acceder a páginas específicas.

---

## `ProtectedRoute.jsx`

**Ubicación**: `/src/middleware/ProtectedRoute.jsx`

**Propósito**: Componente HOC (Higher-Order Component) que protege rutas verificando la autenticación del usuario y validando sus permisos según el rol.

### Características Principales

1. **Verificación de Token JWT**: Valida la existencia del token en localStorage
2. **Validación de Usuario**: Consulta el backend para verificar la sesión activa
3. **Control de Acceso por Roles**: Permite acceso solo a roles específicos
4. **Redirección Automática**: Redirige a usuarios no autorizados a su dashboard correspondiente
5. **Estado de Carga**: Muestra pantalla de carga durante la verificación

### Código Completo

```jsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/userService';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay token
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        // Obtener información del usuario actual
        const response = await getCurrentUser();
        
        if (!response.success || !response.data) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        const userRole = response.data.rol;

        // Verificar si el rol del usuario está permitido
        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          // Redirigir según el rol del usuario a su dashboard correcto
          switch (userRole) {
            case 'administrador':
              router.push('/admin');
              break;
            case 'usuario':
              router.push('/usuario');
              break;
            case 'responsable_seguridad':
              router.push('/seguridad');
              break;
            case 'auditor':
              router.push('/auditor');
              break;
            default:
              router.push('/login');
          }
          return;
        }

        // Usuario autorizado
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### Props del Componente

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| **children** | ReactNode | ✅ Sí | - | Contenido de la página protegida |
| **allowedRoles** | string[] | ❌ No | `[]` | Array de roles permitidos. Si está vacío, permite cualquier usuario autenticado |

### Roles Válidos

| Rol | Código | Dashboard | Descripción |
|-----|--------|-----------|-------------|
| **Administrador** | `administrador` | `/admin` | Acceso completo al sistema |
| **Responsable de Seguridad** | `responsable_seguridad` | `/seguridad` | Gestión de activos y solicitudes |
| **Auditor** | `auditor` | `/auditor` | Visualización de inventario (solo lectura) |
| **Usuario** | `usuario` | `/usuario` | Solicitudes y activos asignados |

### Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│              Usuario accede a ruta protegida                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │  ¿Existe token en localStorage? │
          └──────────┬───────────────────┘
                     │
         ┌───────────┴───────────┐
         │ NO                    │ SÍ
         ▼                       ▼
    ┌─────────┐         ┌──────────────────┐
    │ /login  │         │ Llamar API:       │
    └─────────┘         │ getCurrentUser()  │
                        └──────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │ ¿Usuario válido?     │
                    └──────┬───────────────┘
                           │
              ┌────────────┴────────────┐
              │ NO                      │ SÍ
              ▼                         ▼
         ┌─────────┐           ┌──────────────────┐
         │ Limpiar │           │ ¿Rol permitido?   │
         │ token   │           └──────┬───────────┘
         │ /login  │                  │
         └─────────┘       ┌──────────┴──────────┐
                           │ NO                  │ SÍ
                           ▼                     ▼
                 ┌──────────────────┐    ┌─────────────┐
                 │ Redirigir a su   │    │ Autorizado  │
                 │ dashboard correcto│    │ Mostrar     │
                 └──────────────────┘    │ contenido   │
                                         └─────────────┘
```

### Estados del Componente

#### 1. **isLoading** (boolean)
- **Propósito**: Controla si se está verificando la autenticación
- **Estado Inicial**: `true`
- **Se activa**: Cuando se está consultando el backend
- **Se desactiva**: Después de recibir respuesta (éxito o error)

#### 2. **isAuthorized** (boolean)
- **Propósito**: Indica si el usuario tiene permiso para ver el contenido
- **Estado Inicial**: `false`
- **Se activa**: Cuando el usuario está autenticado y autorizado
- **Se desactiva**: Si hay error de autenticación o permisos insuficientes

### Casos de Uso

#### Caso 1: Proteger Ruta para un Rol Específico

```jsx
// Página solo para administradores
// app/admin/page.jsx
import ProtectedRoute from '@/middleware/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['administrador']}>
      <div>
        <h1>Panel de Administrador</h1>
        {/* Contenido solo para admins */}
      </div>
    </ProtectedRoute>
  );
}
```

#### Caso 2: Proteger Ruta para Múltiples Roles

```jsx
// Página accesible para Responsable de Seguridad y Auditor
// app/seguridad/inventory/page.jsx
import ProtectedRoute from '@/middleware/ProtectedRoute';

export default function InventoryPage() {
  return (
    <ProtectedRoute allowedRoles={['responsable_seguridad', 'auditor']}>
      <div>
        <h1>Inventario de Activos</h1>
        {/* Contenido para SEG y AUD */}
      </div>
    </ProtectedRoute>
  );
}
```

#### Caso 3: Proteger Ruta para Cualquier Usuario Autenticado

```jsx
// Página accesible para cualquier usuario con sesión válida
// app/dashboard/page.jsx
import ProtectedRoute from '@/middleware/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[]}>
      {/* allowedRoles vacío = cualquier usuario autenticado */}
      <div>
        <h1>Dashboard General</h1>
        {/* Contenido para todos */}
      </div>
    </ProtectedRoute>
  );
}
```

#### Caso 4: Implementación en Layout

```jsx
// app/admin/layout.js
import ProtectedRoute from '@/middleware/ProtectedRoute';
import Sidebar from '@/components/ui/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['administrador']}>
      <div className="admin-layout">
        <Sidebar />
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
```

### Comportamiento por Escenario

| Escenario | Token | Usuario Válido | Rol | Acción |
|-----------|-------|----------------|-----|--------|
| 1 | ❌ No existe | - | - | Redirige a `/login` |
| 2 | ✅ Existe | ❌ Inválido | - | Limpia token, redirige a `/login` |
| 3 | ✅ Existe | ✅ Válido | ❌ No permitido | Redirige a su dashboard |
| 4 | ✅ Existe | ✅ Válido | ✅ Permitido | Muestra contenido |
| 5 | ✅ Existe | ✅ Válido | `allowedRoles = []` | Muestra contenido (cualquier rol) |

### Pantalla de Carga

Mientras se verifica la autenticación, se muestra una pantalla con:

- **Fondo**: Gradiente púrpura (`#667eea` → `#764ba2`)
- **Spinner**: Bootstrap spinner de 3rem
- **Texto**: "Verificando acceso..."
- **Centrado**: Vertical y horizontal

```jsx
<div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}}>
  <div style={{ textAlign: 'center', color: 'white' }}>
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
    <p>Verificando acceso...</p>
  </div>
</div>
```

### Manejo de Errores

#### Error 1: Sin Token
```javascript
if (!token) {
  router.push('/login');
  return;
}
```

#### Error 2: Respuesta Inválida del Backend
```javascript
if (!response.success || !response.data) {
  localStorage.removeItem('token');
  router.push('/login');
  return;
}
```

#### Error 3: Token Expirado o Inválido
```javascript
catch (error) {
  console.error('Error verificando autenticación:', error);
  localStorage.removeItem('token');
  router.push('/login');
}
```

#### Error 4: Permisos Insuficientes
```javascript
if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
  // Redirigir según rol
  switch (userRole) {
    case 'administrador':
      router.push('/admin');
      break;
    // ... más casos
  }
  return;
}
```

### Redirección por Rol

Cuando un usuario intenta acceder a una ruta para la que no tiene permisos, es redirigido automáticamente a su panel correspondiente:

```javascript
switch (userRole) {
  case 'administrador':
    router.push('/admin');
    break;
  case 'usuario':
    router.push('/usuario');
    break;
  case 'responsable_seguridad':
    router.push('/seguridad');
    break;
  case 'auditor':
    router.push('/auditor');
    break;
  default:
    router.push('/login');
}
```

### Dependencias Utilizadas

| Dependencia | Propósito | Importación |
|-------------|-----------|-------------|
| **useState** | Manejo de estados locales | `react` |
| **useEffect** | Ejecutar verificación al montar | `react` |
| **useRouter** | Navegación y redirección | `next/navigation` |
| **getCurrentUser** | Obtener usuario desde API | `@/services/userService` |

### Consideraciones de Seguridad

#### ✅ Buenas Prácticas Implementadas

1. **Verificación Doble**: Token + llamada al backend
2. **Limpieza de Token**: Se elimina si es inválido
3. **Redirección Automática**: No muestra contenido no autorizado
4. **Verificación en Servidor**: El backend valida el token (no confía solo en el cliente)

#### ⚠️ Limitaciones

1. **localStorage**: No es el método más seguro (vulnerable a XSS)
   - **Recomendación**: En producción considerar httpOnly cookies
2. **Client-Side Only**: La verificación es en cliente
   - **Solución**: El backend también valida en cada petición

### Mejoras Recomendadas (Producción)

```jsx
// 1. Usar httpOnly cookies en lugar de localStorage
const token = getCookie('token'); // Más seguro que localStorage

// 2. Agregar timeout para la verificación
const timeoutId = setTimeout(() => {
  setError('Tiempo de espera agotado');
  router.push('/login');
}, 10000); // 10 segundos

// 3. Retry logic para errores de red
const checkAuth = async (retries = 3) => {
  try {
    // ... verificación
  } catch (error) {
    if (retries > 0 && isNetworkError(error)) {
      await delay(1000);
      return checkAuth(retries - 1);
    }
    router.push('/login');
  }
};

// 4. Refrescar token automáticamente
if (tokenExpiresIn < 5 * 60 * 1000) { // 5 minutos
  await refreshToken();
}
```

### Testing

#### Ejemplo de Test con Jest

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { getCurrentUser } from '@/services/userService';

jest.mock('@/services/userService');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('ProtectedRoute', () => {
  it('muestra spinner mientras carga', () => {
    getCurrentUser.mockImplementation(() => new Promise(() => {}));
    
    render(
      <ProtectedRoute allowedRoles={['administrador']}>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Verificando acceso...')).toBeInTheDocument();
  });

  it('muestra contenido si el usuario está autorizado', async () => {
    getCurrentUser.mockResolvedValue({
      success: true,
      data: { rol: 'administrador' }
    });
    
    render(
      <ProtectedRoute allowedRoles={['administrador']}>
        <div>Contenido protegido</div>
      </ProtectedRoute>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
    });
  });
});
```

### Integración con Next.js App Router

En Next.js 13+ con App Router, este middleware se usa como wrapper de componentes, no como middleware de Next.js tradicional (`middleware.js` en la raíz).

#### Diferencias Clave

| Middleware Tradicional | ProtectedRoute Component |
|----------------------|--------------------------|
| Archivo `middleware.js` en raíz | Componente React en `src/middleware/` |
| Ejecuta en Edge Runtime | Ejecuta en cliente (CSR) |
| Intercepts todas las requests | Wrap de componentes específicos |
| Sin acceso a React hooks | Usa React hooks (useState, useEffect) |

---

## Resumen de Middleware

### Propósito General
El sistema de middleware de SecureFlow asegura que:
- Solo usuarios autenticados accedan a rutas protegidas
- Los usuarios solo vean contenido autorizado para su rol
- Se valide la sesión en cada carga de página protegida
- Se proporcione feedback visual durante la verificación

### Arquitectura de Protección

```
┌──────────────────────────────────────────────────────────┐
│                     Aplicación Next.js                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Rutas Públicas                         │ │
│  │  /login, /register                                  │ │
│  │  (Sin ProtectedRoute)                               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Rutas Protegidas                       │ │
│  │  /admin, /seguridad, /auditor, /usuario            │ │
│  │  (Con ProtectedRoute + allowedRoles)               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Matriz de Acceso por Rol

| Ruta | Administrador | Responsable Seg. | Auditor | Usuario |
|------|---------------|------------------|---------|---------|
| `/admin/*` | ✅ | ❌ | ❌ | ❌ |
| `/seguridad/*` | ❌ | ✅ | ❌ | ❌ |
| `/auditor/*` | ❌ | ❌ | ✅ | ❌ |
| `/usuario/*` | ❌ | ❌ | ❌ | ✅ |
| `/login` | ✅ | ✅ | ✅ | ✅ |

---

## 📁 Carpeta: `/src/components/ui/`

Los componentes UI son elementos reutilizables de interfaz de usuario que mantienen consistencia visual y funcional en toda la aplicación. Están construidos sobre React Bootstrap y personalizados con estilos propios de SecureFlow.

### Arquitectura de Componentes UI

```
components/ui/
├── Componentes de Formulario
│   ├── Input.js          # Campos de entrada
│   ├── Select.js         # Selectores desplegables
│   └── Button.js         # Botones con variantes
│
├── Componentes de Layout
│   ├── GradientLayout.jsx    # Layout con fondo gradiente
│   ├── Header.jsx            # Header principal
│   ├── HeaderTitle.jsx       # Título y logo
│   ├── UserHeader.jsx        # Info de usuario + logout
│   ├── SideBar.jsx           # Menú lateral de navegación
│   └── PageLayout.jsx        # Layout de página
│
├── Componentes de Datos
│   ├── Card.js              # Tarjetas de contenido
│   ├── CardActivo.jsx       # Tarjeta especializada para activos
│   ├── Table.jsx            # Tablas de datos
│   └── SearchBar.jsx        # Barra de búsqueda y filtros
│
├── Componentes de Feedback
│   ├── Alert.js            # Alertas informativas
│   ├── Toast.jsx           # Notificaciones temporales
│   └── Modal.jsx           # Diálogos modales
│
└── index.js                # Exportación centralizada
```

---

## 📝 Componentes de Formulario

### `Input.js`

**Propósito**: Campo de entrada reutilizable con soporte para iconos, validación y etiquetas.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **type** | string | `'text'` | Tipo de input (text, email, password, number, etc.) |
| **label** | string | - | Etiqueta del campo |
| **placeholder** | string | - | Texto placeholder |
| **error** | string | - | Mensaje de error de validación |
| **required** | boolean | `false` | Indica si el campo es requerido (muestra *) |
| **icon** | ReactNode | - | Icono a la izquierda del input |
| **rightIcon** | ReactNode | - | Icono a la derecha del input |
| **className** | string | `''` | Clases CSS adicionales |

#### Características

- ✅ Soporte para React Hook Form (forwardRef)
- ✅ Validación visual con Bootstrap
- ✅ Iconos izquierda y derecha
- ✅ Indicador de campo requerido (*)

#### Ejemplo de Uso

```jsx
import { Input } from '@/components/ui';
import { FaEnvelope, FaLock } from 'react-icons/fa';

// Input básico
<Input
  label="Email"
  type="email"
  placeholder="tucorreo@example.com"
  required
/>

// Input con icono izquierdo
<Input
  label="Email"
  type="email"
  placeholder="tucorreo@example.com"
  icon={<FaEnvelope />}
/>

// Input con validación de error
<Input
  label="Contraseña"
  type="password"
  error="La contraseña debe tener al menos 8 caracteres"
  icon={<FaLock />}
/>

// Con React Hook Form
import { useForm } from 'react-hook-form';

const { register, formState: { errors } } = useForm();

<Input
  label="Nombre"
  {...register('nombre', { required: 'Campo requerido' })}
  error={errors.nombre?.message}
  required
/>
```

---

### `Select.js`

**Propósito**: Selector desplegable reutilizable con soporte para validación y opciones dinámicas.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **options** | array | `[]` | Array de opciones `{ value, label }` |
| **label** | string | - | Etiqueta del selector |
| **placeholder** | string | `'Selecciona una opción'` | Texto de la opción por defecto |
| **error** | string | - | Mensaje de error de validación |
| **required** | boolean | `false` | Indica si el campo es requerido |
| **className** | string | `''` | Clases CSS adicionales |

#### Ejemplo de Uso

```jsx
import { Select } from '@/components/ui';

// Select básico
<Select
  label="Departamento"
  placeholder="Seleccione un departamento"
  options={[
    { value: 'TI', label: 'Tecnología de la Información' },
    { value: 'RRHH', label: 'Recursos Humanos' },
    { value: 'FIN', label: 'Finanzas' }
  ]}
  required
/>

// Con validación
<Select
  label="Rol"
  options={roles}
  error={errors.rol?.message}
  {...register('rol', { required: 'Seleccione un rol' })}
/>

// Dinámico desde estado
const [departamentos, setDepartamentos] = useState([]);

useEffect(() => {
  // Cargar departamentos desde API
  const fetchDepartamentos = async () => {
    const data = await getDepartamentos();
    setDepartamentos(data.map(d => ({ 
      value: d.id, 
      label: d.nombre 
    })));
  };
  fetchDepartamentos();
}, []);

<Select
  label="Departamento"
  options={departamentos}
/>
```

---

### `Button.js`

**Propósito**: Botón reutilizable con variantes de estilo y estado de carga.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **variant** | string | `'primary'` | Variante de estilo: `primary`, `secondary`, `outline`, etc. |
| **size** | string | `'md'` | Tamaño: `sm`, `md`, `lg` |
| **loading** | boolean | `false` | Muestra spinner y deshabilita el botón |
| **disabled** | boolean | `false` | Deshabilita el botón |
| **type** | string | `'button'` | Tipo de botón: `button`, `submit`, `reset` |
| **onClick** | function | - | Manejador de clic |
| **className** | string | `''` | Clases CSS adicionales |

#### Variantes Disponibles

| Variante | Clase CSS | Uso Recomendado |
|----------|-----------|-----------------|
| **primary** | `btn-custom-primary` | Acción principal (guardar, crear) |
| **secondary** | `btn-custom-secondary` | Acción secundaria (cancelar, volver) |
| **outline** | `btn-custom-outline` | Acción terciaria (opciones) |

#### Ejemplo de Uso

```jsx
import { Button } from '@/components/ui';

// Botón primario básico
<Button variant="primary" onClick={handleSubmit}>
  Guardar
</Button>

// Botón con estado de carga
<Button 
  variant="primary" 
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Registrar Usuario
</Button>

// Botón deshabilitado
<Button 
  variant="secondary" 
  disabled={!isValid}
  onClick={handleNext}
>
  Continuar
</Button>

// Botón tipo submit en formulario
<form onSubmit={handleSubmit}>
  <Input name="email" />
  <Button type="submit" variant="primary">
    Iniciar Sesión
  </Button>
</form>

// Botones en grupo
<div style={{ display: 'flex', gap: '10px' }}>
  <Button variant="secondary" onClick={handleCancel}>
    Cancelar
  </Button>
  <Button variant="primary" onClick={handleSave}>
    Guardar Cambios
  </Button>
</div>
```

---

## 🎨 Componentes de Layout

### `GradientLayout.jsx`

**Propósito**: Contenedor con fondo gradiente para páginas de autenticación y pantallas especiales.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **children** | ReactNode | - | Contenido a renderizar |
| **className** | string | `''` | Clases CSS adicionales |

#### Ejemplo de Uso

```jsx
import GradientLayout from '@/components/ui/GradientLayout';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <GradientLayout>
      <LoginForm />
    </GradientLayout>
  );
}
```

---

### `Header.jsx`

**Propósito**: Encabezado principal de la aplicación que combina logo, contenido personalizado y usuario.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **children** | ReactNode | - | Contenido personalizado del header |
| **showTitle** | boolean | `true` | Muestra el logo y título de SecureFlow |
| **showUser** | boolean | `false` | Muestra información del usuario |
| **userName** | string | - | Nombre del usuario |
| **userRole** | string | - | Rol del usuario |
| **userIcon** | ReactComponent | - | Icono del usuario |
| **className** | string | `''` | Clases CSS adicionales |

#### Ejemplo de Uso

```jsx
import { Header } from '@/components/ui';

// Header con título y usuario
<Header 
  showTitle={true}
  showUser={true}
  userName="Juan Pérez"
  userRole="Administrador"
>
  <h2>Panel de Administrador</h2>
</Header>

// Header personalizado sin título
<Header showTitle={false}>
  <div className="custom-header-content">
    <h1>Bienvenido al Sistema</h1>
  </div>
</Header>
```

---

### `HeaderTitle.jsx`

**Propósito**: Muestra el logo y título de SecureFlow FH.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **className** | string | `''` | Clases CSS adicionales |

#### Características

- Logo de 125x125px optimizado con Next.js Image
- Título "SecureFlow FH"
- Subtítulo "Sistemas de Gestión de Seguridad de Información"

#### Ejemplo de Uso

```jsx
import HeaderTitle from '@/components/ui/HeaderTitle';

<div className="login-page">
  <HeaderTitle />
  {/* Resto del contenido */}
</div>
```

---

### `UserHeader.jsx`

**Propósito**: Muestra información del usuario con dropdown para cerrar sesión.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **userName** | string | - | Nombre del usuario (requerido) |
| **userRole** | string | - | Rol del usuario |
| **userIcon** | ReactComponent | `FaUserCircle` | Icono del usuario |
| **showIcon** | boolean | `true` | Muestra el icono |
| **className** | string | `''` | Clases CSS adicionales |

#### Características

- ✅ Dropdown automático con clic
- ✅ Cierra al hacer clic fuera
- ✅ Botón de cerrar sesión
- ✅ Redirección automática a login

#### Ejemplo de Uso

```jsx
import { UserHeader } from '@/components/ui';
import { FaUserCog } from 'react-icons/fa';

// Uso básico
<UserHeader 
  userName="Juan Pérez"
  userRole="Administrador"
/>

// Con icono personalizado
<UserHeader 
  userName="María García"
  userRole="Responsable de Seguridad"
  userIcon={FaUserCog}
/>

// En un layout
export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);
  
  return (
    <div>
      <header>
        <UserHeader 
          userName={`${user?.nombre} ${user?.apellido}`}
          userRole={user?.rol}
        />
      </header>
      <main>{children}</main>
    </div>
  );
}
```

---

### `SideBar.jsx`

**Propósito**: Menú lateral de navegación con tabs y soporte para badges de notificación.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **tabs** | array | `[]` | Array de tabs `{ id, name, iconName, badgeCount }` |
| **defaultActiveTab** | string | Primer tab | ID del tab activo por defecto |
| **onTabChange** | function | `() => {}` | Callback al cambiar de tab |
| **className** | string | `''` | Clases CSS adicionales |

#### Estructura de `tabs`

```javascript
{
  id: 'users',              // Identificador único
  name: 'Usuarios',         // Nombre visible
  iconName: 'FaUsers',      // Nombre del icono de react-icons
  badgeCount: 5             // Número de notificaciones (opcional)
}
```

#### Iconos Disponibles

| iconName | Icono | Uso Recomendado |
|----------|-------|-----------------|
| `FaUsers` | 👥 | Gestión de usuarios |
| `FaBoxes` | 📦 | Inventario de activos |
| `FaCog` | ⚙️ | Configuración |
| `FaChartBar` | 📊 | Estadísticas |
| `FaFileAlt` | 📄 | Solicitudes/Documentos |
| `FaShieldAlt` | 🛡️ | Seguridad |
| `FaUserPlus` | ➕👤 | Registro de usuarios |
| `FaTasks` | ✔️ | Tareas/Revisiones |

#### Ejemplo de Uso

```jsx
import { Sidebar } from '@/components/ui';
import { useState } from 'react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  const tabs = [
    { id: 'users', name: 'Usuarios', iconName: 'FaUsers' },
    { id: 'inventory', name: 'Inventario', iconName: 'FaBoxes' },
    { id: 'requests', name: 'Solicitudes', iconName: 'FaFileAlt', badgeCount: 3 },
    { id: 'register', name: 'Registro', iconName: 'FaUserPlus' }
  ];
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  return (
    <div className="admin-layout">
      <Sidebar 
        tabs={tabs}
        defaultActiveTab="users"
        onTabChange={handleTabChange}
      />
      <main>
        {activeTab === 'users' && <UsersView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'requests' && <RequestsView />}
        {activeTab === 'register' && <RegisterView />}
      </main>
    </div>
  );
};
```

---

## 📊 Componentes de Datos

### `Table.jsx`

**Propósito**: Tabla de datos reutilizable con soporte para columnas personalizadas, renderizado condicional y estados vacíos.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **columns** | array | `[]` | Configuración de columnas (requerido) |
| **data** | array | `[]` | Array de datos a mostrar |
| **title** | string | - | Título de la tabla |
| **icon** | ReactNode | - | Icono del título |
| **hoverEffect** | boolean | `true` | Efecto hover en filas |
| **striped** | boolean | `false` | Filas alternadas |
| **bordered** | boolean | `false` | Bordes en celdas |
| **compact** | boolean | `false` | Tamaño compacto |
| **className** | string | `''` | Clases CSS adicionales |

#### Estructura de `columns`

```javascript
{
  key: 'nombre',              // Clave del dato
  label: 'Nombre',            // Encabezado de columna
  render: (row, index) => {   // Función personalizada (opcional)
    return <strong>{row.nombre}</strong>;
  },
  headerStyle: {},            // Estilos del header (opcional)
  cellStyle: {}               // Estilos de celdas (opcional)
}
```

#### Ejemplo de Uso

```jsx
import { Table } from '@/components/ui';
import { FaUsers } from 'react-icons/fa';

const UsersTable = ({ users }) => {
  const columns = [
    { 
      key: 'codigo', 
      label: 'Código' 
    },
    { 
      key: 'nombre', 
      label: 'Nombre Completo',
      render: (row) => `${row.nombre} ${row.apellido}`
    },
    { 
      key: 'email', 
      label: 'Email' 
    },
    { 
      key: 'rol', 
      label: 'Rol',
      render: (row) => {
        const roles = {
          'ADM': 'Administrador',
          'SEG': 'Responsable Seguridad',
          'AUD': 'Auditor',
          'USU': 'Usuario'
        };
        return roles[row.rol] || row.rol;
      }
    },
    { 
      key: 'activo', 
      label: 'Estado',
      render: (row) => (
        <span className={row.activo ? 'badge-success' : 'badge-danger'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <div>
          <button onClick={() => handleEdit(row)}>Editar</button>
          <button onClick={() => handleDelete(row)}>Eliminar</button>
        </div>
      )
    }
  ];
  
  return (
    <Table
      title="Lista de Usuarios"
      icon={<FaUsers />}
      columns={columns}
      data={users}
      hoverEffect
      striped
    />
  );
};
```

**Estado Vacío**: Cuando no hay datos, muestra automáticamente un mensaje con icono de búsqueda.

---

### `SearchBar.jsx`

**Propósito**: Barra de búsqueda y filtros dinámica con múltiples campos.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **fields** | array | `[]` | Configuración de campos de búsqueda |
| **onFilter** | function | `() => {}` | Callback con los filtros actuales |
| **className** | string | `''` | Clases CSS adicionales |

#### Estructura de `fields`

```javascript
{
  name: 'nombre',              // Nombre del campo
  label: 'Nombre',             // Etiqueta visible
  type: 'text',                // Tipo: text, select, number, date
  placeholder: 'Buscar...',    // Placeholder (opcional)
  options: []                  // Opciones para select (opcional)
}
```

#### Ejemplo de Uso

```jsx
import { SearchBar } from '@/components/ui';
import { useState, useCallback } from 'react';

const InventoryPage = () => {
  const [filteredActivos, setFilteredActivos] = useState([]);
  
  const searchFields = [
    { 
      name: 'nombre', 
      label: 'Nombre', 
      type: 'text',
      placeholder: 'Buscar por nombre...'
    },
    { 
      name: 'tipo', 
      label: 'Tipo', 
      type: 'select',
      options: [
        { value: 'Hardware', label: 'Hardware' },
        { value: 'Software', label: 'Software' },
        { value: 'Red', label: 'Red' }
      ]
    },
    { 
      name: 'estado', 
      label: 'Estado', 
      type: 'select',
      options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'Mantenimiento', label: 'Mantenimiento' },
        { value: 'Inactivo', label: 'Inactivo' }
      ]
    }
  ];
  
  const handleFilter = useCallback((filters) => {
    // Filtrar activos según los filtros
    const filtered = activos.filter(activo => {
      return Object.keys(filters).every(key => {
        if (!filters[key]) return true; // Si el filtro está vacío, no filtrar
        return activo[key]?.toLowerCase().includes(filters[key].toLowerCase());
      });
    });
    
    setFilteredActivos(filtered);
  }, [activos]);
  
  return (
    <div>
      <SearchBar 
        fields={searchFields}
        onFilter={handleFilter}
      />
      <Table data={filteredActivos} columns={columns} />
    </div>
  );
};
```

**Funcionalidad**:
- ✅ Actualiza filtros en tiempo real
- ✅ Botón "Limpiar" para resetear
- ✅ Callback con objeto de filtros `{ nombre: 'laptop', tipo: 'Hardware' }`

---

### `Card.js`

**Propósito**: Tarjeta de contenido genérica con header, body y footer.

#### Subcomponentes

- `Card` - Contenedor principal
- `Card.Header` - Encabezado
- `Card.Body` - Contenido
- `Card.Footer` - Pie de tarjeta

#### Ejemplo de Uso

```jsx
import { Card } from '@/components/ui';

<Card>
  <Card.Header>
    <h4>Información del Activo</h4>
  </Card.Header>
  <Card.Body>
    <p>Nombre: Laptop Dell Latitude</p>
    <p>Código: ACT-000001</p>
    <p>Estado: Activo</p>
  </Card.Body>
  <Card.Footer>
    <button>Ver Detalles</button>
  </Card.Footer>
</Card>
```

---

### `CardActivo.jsx`

**Propósito**: Tarjeta especializada para mostrar información de activos con botones de acción.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **activo** | object | - | Objeto con datos del activo (requerido) |
| **onHistorialClick** | function | `() => {}` | Callback al hacer clic en "Historial" |
| **onModificarClick** | function | `() => {}` | Callback al hacer clic en "Modificar" |
| **showModificarButton** | boolean | `false` | Muestra botón de modificar |
| **className** | string | `''` | Clases CSS adicionales |

#### Estructura de `activo`

```javascript
{
  _id: "674xyz789...",
  nombre: "Laptop Dell Latitude",
  codigo: "ACT-000001",
  categoria: "Hardware",
  descripcion: "Laptop para desarrollo",
  responsable: "Juan Pérez",
  ubicacion: "Oficina Principal",
  estado: "Activo",  // Activo, Mantenimiento, Inactivo, etc.
  fecha_creacion: "2025-01-01"
}
```

#### Estados Soportados

| Estado | Clase CSS | Color |
|--------|-----------|-------|
| Activo | `estado-activo` | Verde |
| Mantenimiento | `estado-mantenimiento` | Amarillo |
| Inactivo | `estado-inactivo` | Gris |
| En Revisión | `estado-revision` | Azul |
| Dado de Baja | `estado-baja` | Rojo |
| Obsoleto | `estado-obsoleto` | Naranja |

#### Ejemplo de Uso

```jsx
import { CardActivo } from '@/components/ui';

const ActivosList = ({ activos }) => {
  const handleHistorial = (activo) => {
    router.push(`/activos/${activo._id}/historial`);
  };
  
  const handleModificar = (activo) => {
    setActivoToEdit(activo);
    setShowModal(true);
  };
  
  return (
    <div className="activos-grid">
      {activos.map(activo => (
        <CardActivo
          key={activo._id}
          activo={activo}
          onHistorialClick={handleHistorial}
          onModificarClick={handleModificar}
          showModificarButton={userRole === 'SEG'}
        />
      ))}
    </div>
  );
};
```

---

## 💬 Componentes de Feedback

### `Alert.js`

**Propósito**: Mensaje de alerta para mostrar información importante al usuario.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **variant** | string | `'info'` | Tipo: `success`, `danger`, `warning`, `info` |
| **dismissible** | boolean | `false` | Permite cerrar la alerta |
| **onClose** | function | - | Callback al cerrar |
| **show** | boolean | `true` | Controla visibilidad |
| **className** | string | `''` | Clases CSS adicionales |

#### Ejemplo de Uso

```jsx
import { Alert } from '@/components/ui';

// Alerta de éxito
<Alert variant="success">
  Usuario registrado exitosamente
</Alert>

// Alerta de error con cierre
<Alert 
  variant="danger" 
  dismissible
  onClose={() => setShowError(false)}
  show={showError}
>
  Error al guardar los cambios
</Alert>

// Alerta de advertencia
<Alert variant="warning">
  Esta acción no se puede deshacer
</Alert>

// Alerta informativa
<Alert variant="info">
  Recuerde guardar los cambios antes de salir
</Alert>
```

---

### `Toast.jsx`

**Propósito**: Notificación temporal que aparece en la esquina superior derecha.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **message** | string | `''` | Mensaje a mostrar |
| **variant** | string | `'info'` | Tipo: `success`, `danger`, `info` |
| **show** | boolean | `true` | Controla visibilidad |
| **autohide** | boolean | `true` | Cierre automático |
| **delay** | number | `5000` | Tiempo de autocierre (ms) |
| **onClose** | function | `() => {}` | Callback al cerrar |

#### Características

- ✅ Renderizado con Portal (sobre todo el contenido)
- ✅ Z-index 99999 (siempre visible)
- ✅ Animación de entrada (slideIn)
- ✅ Cierre automático o manual

#### Ejemplo de Uso

```jsx
import { Toast } from '@/components/ui';
import { useState } from 'react';

const MyComponent = () => {
  const [toast, setToast] = useState({ show: false, message: '', variant: 'info' });
  
  const showToast = (message, variant = 'success') => {
    setToast({ show: true, message, variant });
  };
  
  const handleSave = async () => {
    try {
      await saveData();
      showToast('Datos guardados exitosamente', 'success');
    } catch (error) {
      showToast('Error al guardar datos', 'danger');
    }
  };
  
  return (
    <div>
      <button onClick={handleSave}>Guardar</button>
      
      <Toast
        message={toast.message}
        variant={toast.variant}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        delay={3000}
      />
    </div>
  );
};
```

---

### `Modal.jsx`

**Propósito**: Diálogo modal personalizable para confirmaciones, formularios y contenido extenso.

#### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| **isOpen** | boolean | - | Controla visibilidad (requerido) |
| **onClose** | function | - | Callback al cerrar (requerido) |
| **title** | string | `"Título del Modal"` | Título del header |
| **question** | string | `"¿Estás seguro?"` | Pregunta principal |
| **informativeText** | string | `''` | Texto informativo adicional |
| **showValueBox** | boolean | `false` | Muestra caja de valor destacado |
| **valueBoxTitle** | string | `''` | Título de la caja de valor |
| **valueBoxSubtitle** | string | `''` | Subtítulo de la caja de valor |
| **cancelText** | string | `"Cancelar"` | Texto del botón cancelar |
| **acceptText** | string | `"Aceptar"` | Texto del botón aceptar |
| **onCancel** | function | - | Callback al cancelar |
| **onAccept** | function | - | Callback al aceptar |
| **headerBgColor** | string | `"var(--color-navy)"` | Color del header |
| **buttonColor** | string | `"var(--color-navy)"` | Color del botón aceptar |
| **children** | ReactNode | - | Contenido adicional |
| **modalClassName** | string | `''` | Clases CSS adicionales |
| **maxHeight** | string | `'auto'` | Altura máxima |

#### Características

- ✅ Renderizado con Portal
- ✅ Cierre al hacer clic fuera (backdrop)
- ✅ Scrollable cuando hay mucho contenido
- ✅ Header, body y footer separados
- ✅ Personalizable con children

#### Ejemplo de Uso

```jsx
import { Modal } from '@/components/ui';
import { useState } from 'react';

// Modal de confirmación simple
const [showModal, setShowModal] = useState(false);

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirmar Eliminación"
  question="¿Está seguro que desea eliminar este usuario?"
  informativeText="Esta acción no se puede deshacer."
  cancelText="No, cancelar"
  acceptText="Sí, eliminar"
  onAccept={handleDelete}
  headerBgColor="#dc3545"
  buttonColor="#dc3545"
/>

// Modal con caja de valor
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Información del Activo"
  question="Detalles del activo seleccionado"
  showValueBox={true}
  valueBoxTitle="ACT-000001"
  valueBoxSubtitle="Laptop Dell Latitude"
  acceptText="Entendido"
/>

// Modal con contenido personalizado
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Formulario de Edición"
  question="Editar información del usuario"
  acceptText="Guardar Cambios"
  onAccept={handleSave}
  maxHeight="90vh"
>
  <form>
    <Input label="Nombre" name="nombre" />
    <Input label="Email" name="email" />
    <Select label="Rol" options={roles} />
  </form>
</Modal>

// Modal scrollable con mucho contenido
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Historial de Cambios"
  question="Historial completo del activo"
  modalClassName="top-aligned"
  maxHeight="85vh"
>
  <div className="historial-list">
    {historial.map(item => (
      <div key={item.id} className="historial-item">
        <h5>{item.fecha}</h5>
        <p>{item.descripcion}</p>
      </div>
    ))}
  </div>
</Modal>
```

---

## 📦 Exportación Centralizada (`index.js`)

Todos los componentes UI se exportan desde un archivo central:

```javascript
export { default as Input } from './Input';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Select } from './Select';
export { default as Alert } from './Alert';
export { default as Header } from './Header';
export { default as HeaderTitle } from './HeaderTitle';
export { default as UserHeader } from './UserHeader';
export { default as Sidebar } from './SideBar';
export { default as GradientLayout } from './GradientLayout';
export { default as SearchBar } from './SearchBar';
export { default as Table } from './Table';
export { default as CardActivo } from './CardActivo';
export { default as Modal } from './Modal';
```

### Uso Recomendado

```javascript
// ✅ Importación desde index (recomendado)
import { Input, Button, Card, Table } from '@/components/ui';

// ❌ Importación individual (no recomendado)
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
```

---

## 🎨 Integración con Estilos CSS

Los componentes UI utilizan clases CSS personalizadas definidas en `/src/styles/`:

| Archivo CSS | Componentes Afectados |
|-------------|-----------------------|
| **forms.css** | Input, Select, Button |
| **components.css** | Card, CardActivo, SearchBar |
| **layouts.css** | Header, Sidebar, GradientLayout |
| **modal.css** | Modal |
| **buttons.css** | Button (variantes) |

### Variables CSS Utilizadas

```css
/* Colores principales */
--color-navy: #1e3a8a;
--color-primary: #2563eb;
--color-success: #10b981;
--color-danger: #ef4444;
--color-warning: #f59e0b;

/* Espaciados */
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
```

---

## 🧪 Testing de Componentes UI

### Ejemplo con Jest y React Testing Library

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Input, Modal } from '@/components/ui';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('Input Component', () => {
  it('displays error message', () => {
    render(<Input label="Email" error="Email inválido" />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('shows required asterisk', () => {
    render(<Input label="Nombre" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});

describe('Modal Component', () => {
  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('calls onAccept when accept button is clicked', () => {
    const handleAccept = jest.fn();
    render(
      <Modal 
        isOpen={true} 
        onClose={() => {}}
        onAccept={handleAccept}
        acceptText="Confirmar"
      />
    );
    fireEvent.click(screen.getByText('Confirmar'));
    expect(handleAccept).toHaveBeenCalled();
  });
});
```

---

## 📚 Buenas Prácticas

### 1. Reutilización de Componentes

```jsx
// ✅ Crear componentes wrapper personalizados
const SuccessButton = (props) => (
  <Button variant="primary" {...props} />
);

const DangerButton = (props) => (
  <Button variant="danger" {...props} />
);
```

### 2. Composición de Componentes

```jsx
// ✅ Componer componentes para crear interfaces complejas
<Card>
  <Card.Header>
    <Header showUser userName={user.nombre} userRole={user.rol} />
  </Card.Header>
  <Card.Body>
    <SearchBar fields={fields} onFilter={handleFilter} />
    <Table columns={columns} data={data} />
  </Card.Body>
</Card>
```

### 3. Gestión de Estado

```jsx
// ✅ Usar hooks para gestionar estado de componentes UI
const [showModal, setShowModal] = useState(false);
const [toast, setToast] = useState({ show: false, message: '' });

const handleAction = () => {
  setShowModal(true);
};

const handleSuccess = () => {
  setShowModal(false);
  setToast({ show: true, message: 'Operación exitosa', variant: 'success' });
};
```

### 4. Accesibilidad

```jsx
// ✅ Incluir props de accesibilidad
<Button 
  aria-label="Guardar cambios"
  title="Guardar cambios"
>
  Guardar
</Button>

<Input
  label="Email"
  id="email-input"
  aria-describedby="email-error"
  error="Email inválido"
/>
```

---

## 🎭 Módulos por Rol

SecureFlow organiza su funcionalidad en módulos específicos según el rol del usuario. Cada rol tiene su propio panel con acceso controlado a funcionalidades específicas del sistema.

### Arquitectura de Módulos

```
app/
├── admin/              # Panel de Administrador
│   ├── page.jsx       # Vista principal con tabs
│   ├── user/          # Gestión de usuarios
│   ├── inventory/     # Inventario de activos
│   ├── scv/           # Sistema de Control de Versiones
│   └── edituser/      # Edición de usuarios
│
├── seguridad/         # Panel de Responsable de Seguridad
│   ├── page.jsx       # Vista principal con tabs
│   ├── revision/      # Panel de revisión de solicitudes
│   ├── solicitudes/   # Gestión de solicitudes
│   ├── inventory/     # Inventario de activos
│   └── scv/           # Sistema de Control de Versiones
│
├── auditor/           # Panel de Auditor
│   ├── page.jsx       # Vista principal
│   ├── inventory/     # Inventario (solo lectura)
│   └── scv/           # Historial de versiones
│
└── usuario/           # Panel de Usuario Estándar
    ├── page.jsx       # Vista principal con tabs
    ├── activo/        # Creación/modificación de activos
    ├── solicitudes/   # Mis solicitudes
    ├── inventory/     # Mis activos asignados
    └── scv/           # Historial de mis activos
```

---

## 👨‍💼 Panel de Administrador (`/admin`)

**Ruta**: `/app/admin/`  
**Rol Requerido**: `administrador`  
**Permisos**: Control total sobre usuarios, activos y solicitudes

### Funcionalidades Principales

#### 1. **Gestión de Usuarios**
Administración completa del ciclo de vida de usuarios del sistema.

**Módulo**: `/admin/user/User.jsx`

##### Características

| Funcionalidad | Descripción | Permisos |
|---------------|-------------|----------|
| **Listar Usuarios** | Ver todos los usuarios activos/inactivos | ✅ Lectura |
| **Registrar Usuario** | Crear nuevos usuarios con cualquier rol | ✅ Escritura |
| **Editar Usuario** | Modificar información de usuarios existentes | ✅ Escritura |
| **Desactivar Usuario** | Desactivación lógica (no elimina físicamente) | ✅ Escritura |
| **Reactivar Usuario** | Volver a activar usuarios desactivados | ✅ Escritura |
| **Reasignar Activos** | Transferir activos antes de desactivar usuario | ✅ Escritura |
| **Filtrar Usuarios** | Búsqueda por nombre, código, email, rol | ✅ Lectura |

##### Flujo de Gestión de Usuarios

```
┌─────────────────────────────────────────────────────────────┐
│              Administrador - Gestión de Usuarios             │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌────────┐      ┌────────┐     ┌─────────┐
    │ Crear  │      │ Editar │     │ Eliminar│
    │ Usuario│      │ Usuario│     │ Usuario │
    └────┬───┘      └───┬────┘     └────┬────┘
         │              │               │
         │              │               ├─ ¿Tiene activos?
         │              │               │
         │              │               ├─ SÍ → Reasignar
         │              │               │    Activos
         │              │               │
         ▼              ▼               ▼
    Formulario    Formulario     Confirmar
    de Registro   de Edición     Desactivación
         │              │               │
         ▼              ▼               ▼
    POST /auth/    PUT /users/    DELETE /users/
    register       {id}           {id}
```

##### Componentes Principales

**SearchBar de Usuarios**
```jsx
const searchFields = [
  { 
    name: 'name', 
    label: 'Buscar', 
    type: 'text',
    placeholder: 'Nombre, código o email...'
  },
  { 
    name: 'role', 
    label: 'Rol', 
    type: 'select',
    options: [
      { value: 'administrador', label: 'Administrador' },
      { value: 'responsable_seguridad', label: 'Responsable Seguridad' },
      { value: 'auditor', label: 'Auditor' },
      { value: 'usuario', label: 'Usuario' }
    ]
  }
];
```

**Tabla de Usuarios**
```jsx
const columns = [
  { key: 'codigo', label: 'Código' },
  { 
    key: 'nombreCompleto', 
    label: 'Nombre',
    render: (row) => `${row.nombre} ${row.apellido}`
  },
  { key: 'email', label: 'Email' },
  { 
    key: 'rol', 
    label: 'Rol',
    render: (row) => formatRol(row.rol)
  },
  { 
    key: 'activo', 
    label: 'Estado',
    render: (row) => (
      <span className={row.activo ? 'badge-success' : 'badge-danger'}>
        {row.activo ? 'Activo' : 'Inactivo'}
      </span>
    )
  },
  {
    key: 'acciones',
    label: 'Acciones',
    render: (row) => (
      <>
        <Button onClick={() => handleEdit(row)}>Editar</Button>
        {row.activo ? (
          <Button variant="danger" onClick={() => handleDelete(row)}>
            Desactivar
          </Button>
        ) : (
          <Button variant="success" onClick={() => handleReactivate(row)}>
            Reactivar
          </Button>
        )}
      </>
    )
  }
];
```

##### Proceso de Reasignación de Activos

Cuando un usuario tiene activos asignados, el administrador debe reasignarlos antes de desactivarlo:

**1. Verificación Automática**
```javascript
const handleDelete = async (user) => {
  const tieneActivos = await verificarActivosUsuario(user.id);
  
  if (tieneActivos) {
    // Cargar activos del usuario
    const activos = await cargarActivosUsuario(user.id);
    setActivosDelUsuario(activos);
    
    // Cargar responsables disponibles
    const responsables = await cargarResponsablesDisponibles(user.id);
    setResponsablesDisponibles(responsables);
    
    // Mostrar modal de reasignación
    setShowReasignacionModal(true);
  } else {
    // Proceder con desactivación directa
    setShowDeleteModal(true);
  }
};
```

**2. Modal de Reasignación**
```jsx
<Modal
  isOpen={showReasignacionModal}
  title="Reasignar Activos"
  question={`El usuario ${userToDelete?.nombreCompleto} tiene ${activosDelUsuario.length} activo(s) asignado(s)`}
  informativeText="Debe reasignar estos activos a otro usuario antes de continuar."
>
  <Select
    label="Nuevo Responsable"
    options={responsablesDisponibles}
    value={nuevoResponsableId}
    onChange={(e) => setNuevoResponsableId(e.target.value)}
    required
  />
  
  <Input
    label="Justificación"
    type="textarea"
    value={justificacion}
    onChange={(e) => setJustificacion(e.target.value)}
    required
  />
  
  <Button onClick={handleReasignarYEliminar}>
    Reasignar y Desactivar Usuario
  </Button>
</Modal>
```

**3. Ejecución de Reasignación**
```javascript
const handleReasignarYEliminar = async () => {
  try {
    // Reasignar cada activo
    for (const activo of activosDelUsuario) {
      await ActivoService.updateActivo(activo._id, {
        responsable: nuevoResponsableId,
        justificacion
      });
    }
    
    // Desactivar usuario
    await UserService.deleteUser(userToDelete.id);
    
    showToastMessage('Usuario desactivado y activos reasignados', 'success');
    loadUsers();
  } catch (error) {
    showToastMessage('Error al reasignar activos', 'danger');
  }
};
```

##### Botón de Registro Rápido

En la esquina superior derecha del módulo de usuarios:

```jsx
<Button 
  variant="primary"
  onClick={() => router.push('/admin/register')}
  icon={<FaUserPlus />}
>
  Registrar Nuevo Usuario
</Button>
```

**Navega a**: Formulario de registro completo con validación

---

#### 2. **Inventario de Activos**
Visualización y navegación al historial de versiones de activos.

**Módulo**: `/admin/inventory/Inventory.jsx`

##### Características

| Funcionalidad | Descripción |
|---------------|-------------|
| **Listar Activos** | Ver todos los activos del sistema |
| **Filtrar Activos** | Búsqueda por nombre, tipo, estado, responsable |
| **Ver Detalles** | Información completa del activo |
| **Ver Historial** | Navegar al SCV para ver cambios históricos |

##### Navegación al SCV

```javascript
const handleNavigateToSCV = (activo) => {
  setSelectedActivo(activo);
  setShowSCV(true); // Cambia la vista a SCV
};
```

**Vista previa**: Al hacer clic en "Historial de Versiones", se navega a:

---

#### 3. **Sistema de Control de Versiones (SCV)**
Vista detallada del historial de cambios de un activo.

**Módulo**: `/admin/scv/SCV.jsx`

##### Características

- ✅ Historial completo de solicitudes (creación, modificaciones)
- ✅ Timeline de cambios con fechas
- ✅ Información de solicitante y revisor
- ✅ Estado de cada solicitud (Aprobada, Rechazada, Pendiente)
- ✅ Comparación de cambios (antes/después)
- ✅ Comentarios de revisión

##### Estructura del Historial

```jsx
<div className="scv-timeline">
  {historial.map(solicitud => (
    <div className="timeline-item" key={solicitud._id}>
      <div className="timeline-header">
        <span className="timeline-date">{solicitud.createdAt}</span>
        <span className={`timeline-badge ${solicitud.estado}`}>
          {solicitud.estado}
        </span>
      </div>
      
      <div className="timeline-content">
        <h4>{solicitud.tipo}</h4>
        <p>Solicitado por: {solicitud.solicitante.nombreCompleto}</p>
        
        {solicitud.cambiosPropuestos && (
          <div className="cambios-propuestos">
            <h5>Cambios Propuestos:</h5>
            {Object.entries(solicitud.cambiosPropuestos).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        )}
        
        {solicitud.comentariosRevision?.map(comentario => (
          <div className="comentario" key={comentario._id}>
            <p><strong>{comentario.usuario.nombre}:</strong> {comentario.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
```

##### Botón de Retorno

```jsx
<Button onClick={onNavigateBack}>
  ← Volver al Inventario
</Button>
```

---

### Tabs del Administrador

```jsx
const adminTabs = [
  {
    id: "usuarios",
    name: "Gestión de Usuarios",
    iconName: "FaUsers",
  },
  {
    id: "activos",
    name: "Inventario de Activos",
    iconName: "FaBoxes",
  },
];
```

### Renderizado Condicional

```jsx
const renderContent = () => {
  switch (activeTab) {
    case "usuarios":
      return <User />;
      
    case "activos":
      if (showSCV) {
        return <SCV 
          onNavigateBack={handleNavigateBack}
          selectedActivo={selectedActivo}
        />;
      } else {
        return <Inventory onNavigateToSCV={handleNavigateToSCV} />;
      }
      
    default:
      return <User />;
  }
};
```

---

## 🔒 Panel de Responsable de Seguridad (`/seguridad`)

**Ruta**: `/app/seguridad/`  
**Rol Requerido**: `responsable_seguridad`  
**Permisos**: Revisar solicitudes, aprobar/rechazar cambios, gestionar activos

### Funcionalidades Principales

#### 1. **Panel de Revisión**
Centro de control para revisar y aprobar/rechazar solicitudes de cambio.

**Módulo**: `/seguridad/revision/`

##### Sub-Vistas

| Vista | Componente | Propósito |
|-------|-----------|-----------|
| **Lista de Solicitudes** | `Solicitudes.jsx` | Ver todas las solicitudes pendientes |
| **Revisar Solicitud** | `Revision.jsx` | Aprobar/rechazar solicitudes pendientes |
| **Ver Solicitud** | `RevisionVista.jsx` | Ver solicitudes ya revisadas (solo lectura) |

##### Flujo de Revisión

```
┌──────────────────────────────────────────────────────────┐
│        Responsable Seguridad - Panel de Revisión          │
└───────────────────────┬──────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
    Pendientes    En Revisión    Completadas
         │              │              │
         │              │              │
    Seleccionar    Revisar        Solo Lectura
    Solicitud      Detalles       (Vista)
         │              │
         ▼              │
    ┌────────────┐     │
    │ ¿Aprobar?  │     │
    └─────┬──────┘     │
          │            │
    ┌─────┴─────┐      │
    │ SÍ   │ NO │      │
    ▼      ▼    ▼      ▼
 Aprobar Rechazar  Comentar
    │       │        │
    ▼       ▼        ▼
 Aplicar  No aplicar  Guardar
 Cambios  Cambios    Comentario
```

##### Lista de Solicitudes

```jsx
<Table
  title="Solicitudes de Cambio"
  columns={[
    { key: 'codigo', label: 'Código' },
    { 
      key: 'activo', 
      label: 'Activo',
      render: (row) => row.activo?.nombre
    },
    { 
      key: 'solicitante', 
      label: 'Solicitante',
      render: (row) => row.solicitante?.nombreCompleto
    },
    { key: 'tipo', label: 'Tipo' },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (row) => (
        <span className={`badge-${getEstadoClass(row.estado)}`}>
          {row.estado}
        </span>
      )
    },
    { key: 'createdAt', label: 'Fecha' },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <Button onClick={() => handleVerDetalles(row)}>
          {row.estado === 'Pendiente' ? 'Revisar' : 'Ver Detalles'}
        </Button>
      )
    }
  ]}
  data={solicitudes}
/>
```

##### Componente de Revisión

**Para solicitudes PENDIENTES** (`Revision.jsx`):

```jsx
<div className="revision-container">
  <h2>Revisar Solicitud</h2>
  
  <CardActivo activo={solicitud.activo} />
  
  <div className="cambios-propuestos">
    <h3>Cambios Propuestos</h3>
    {Object.entries(solicitud.cambiosPropuestos).map(([key, value]) => (
      <div key={key} className="cambio-item">
        <strong>{key}:</strong>
        <span className="valor-anterior">{solicitud.activo[key]}</span>
        <span className="arrow">→</span>
        <span className="valor-nuevo">{value}</span>
      </div>
    ))}
  </div>
  
  <div className="decision-area">
    <Input
      label="Comentario de Revisión"
      type="textarea"
      value={comentario}
      onChange={(e) => setComentario(e.target.value)}
      required
    />
    
    <div className="botones-decision">
      <Button 
        variant="danger"
        onClick={() => handleRevisar('RECHAZADA')}
      >
        Rechazar
      </Button>
      
      <Button 
        variant="success"
        onClick={() => handleRevisar('APROBADA')}
      >
        Aprobar
      </Button>
    </div>
  </div>
</div>
```

**Lógica de Aprobación/Rechazo**:

```javascript
const handleRevisar = async (estado) => {
  if (!comentario.trim()) {
    showToastMessage('El comentario es obligatorio', 'danger');
    return;
  }
  
  try {
    await RequestService.reviewRequest(
      solicitud._id,
      estado,
      comentario
    );
    
    const mensaje = estado === 'APROBADA' 
      ? 'Solicitud aprobada y cambios aplicados'
      : 'Solicitud rechazada';
      
    showToastMessage(mensaje, 'success');
    
    // Volver a la lista
    onNavigateBack();
  } catch (error) {
    showToastMessage('Error al revisar solicitud', 'danger');
  }
};
```

**Para solicitudes COMPLETADAS** (`RevisionVista.jsx`):

- Vista de solo lectura
- Muestra el estado final (Aprobada/Rechazada)
- Muestra comentarios de revisión
- No permite edición

##### Badge de Notificaciones

El tab "Panel de Revisión" muestra un contador de solicitudes pendientes:

```jsx
{
  id: "panel-revision",
  name: "Panel de Revisión",
  iconName: "FaTasks",
  badgeCount: pendingRequestsCount // Número en rojo
}
```

**Actualización en Tiempo Real**:

```javascript
useEffect(() => {
  const loadPendingRequestsCount = async () => {
    const response = await RequestService.getRequests();
    const solicitudes = response.data.solicitudes || [];
    const pendingCount = solicitudes.filter(
      solicitud => solicitud.estado === 'Pendiente'
    ).length;
    setPendingRequestsCount(pendingCount);
  };
  
  loadPendingRequestsCount();
}, []);
```

---

#### 2. **Inventario de Activos**
Igual que el módulo del administrador, con acceso al SCV.

**Funcionalidades**:
- Ver todos los activos
- Filtrar y buscar
- Navegar al historial (SCV)

---

### Tabs del Responsable de Seguridad

```jsx
const seguridadTabs = [
  {
    id: "panel-revision",
    name: "Panel de Revisión",
    iconName: "FaTasks",
    badgeCount: pendingRequestsCount // Contador dinámico
  },
  {
    id: "inventario",
    name: "Inventario de Activos",
    iconName: "FaBoxes"
  }
];
```

### Renderizado Condicional

```jsx
const renderContent = () => {
  switch (activeTab) {
    case "panel-revision":
      if (showRevision) {
        return <Revision 
          solicitud={selectedSolicitud}
          onNavigateBack={handleBackToList}
        />;
      } else if (showRevisionVista) {
        return <RevisionVista 
          solicitud={selectedSolicitud}
          onNavigateBack={handleBackToList}
        />;
      } else {
        return <Solicitudes 
          onVerDetalles={handleNavigateToDetalles}
        />;
      }
      
    case "inventario":
      if (showSCV) {
        return <SCV 
          selectedActivo={selectedActivo}
          onNavigateBack={handleNavigateBack}
        />;
      } else {
        return <Inventory onNavigateToSCV={handleNavigateToSCV} />;
      }
      
    default:
      return <Solicitudes />;
  }
};
```

---

## 📊 Panel de Auditor (`/auditor`)

**Ruta**: `/app/auditor/`  
**Rol Requerido**: `auditor`  
**Permisos**: Solo lectura de inventario y solicitudes

### Funcionalidades Principales

#### 1. **Inventario de Activos (Solo Lectura)**
Visualización completa del inventario sin capacidad de edición.

**Módulo**: `/auditor/inventory/Inventory.jsx`

##### Características

- ✅ Ver todos los activos del sistema
- ✅ Filtrar y buscar activos
- ✅ Ver detalles completos
- ✅ Acceder al historial de versiones (SCV)
- ❌ **No puede**: Crear, editar o eliminar activos

##### Diferencias con otros roles

| Acción | Admin | Seguridad | Auditor |
|--------|-------|-----------|---------|
| Ver activos | ✅ | ✅ | ✅ |
| Filtrar activos | ✅ | ✅ | ✅ |
| Ver historial | ✅ | ✅ | ✅ |
| Crear activos | ✅ | ✅ | ❌ |
| Editar activos | ✅ | ✅ | ❌ |
| Añadir comentarios de auditoría | ❌ | ❌ | ✅* |

*El auditor puede añadir comentarios de auditoría a solicitudes mediante `RequestService.addCommentToRequestByAuditory()`

---

#### 2. **Sistema de Control de Versiones (SCV)**
Vista del historial de cambios en modo solo lectura.

**Módulo**: `/auditor/scv/SCV.jsx`

##### Funcionalidad Especial del Auditor

El auditor puede añadir **comentarios de auditoría** a las solicitudes sin modificar su estado:

```jsx
<div className="auditoria-section">
  <h4>Comentario de Auditoría</h4>
  
  <Input
    label="Añadir Observación"
    type="textarea"
    value={comentarioAuditoria}
    onChange={(e) => setComentarioAuditoria(e.target.value)}
    placeholder="Observaciones de auditoría..."
  />
  
  <Button onClick={handleAñadirComentario}>
    Añadir Comentario
  </Button>
</div>
```

**Lógica**:

```javascript
const handleAñadirComentario = async () => {
  if (!comentarioAuditoria.trim()) {
    showToastMessage('El comentario no puede estar vacío', 'warning');
    return;
  }
  
  try {
    await RequestService.addCommentToRequestByAuditory(
      solicitud._id,
      comentarioAuditoria
    );
    
    showToastMessage('Comentario de auditoría añadido', 'success');
    setComentarioAuditoria('');
    
    // Refrescar solicitud
    await loadSolicitud();
  } catch (error) {
    showToastMessage('Error al añadir comentario', 'danger');
  }
};
```

---

### Tabs del Auditor

```jsx
const auditorTabs = [
  {
    id: 'activos',
    name: 'Inventario de Activos',
    iconName: 'FaBoxes'
  }
];
```

**Nota**: El auditor solo tiene un tab porque su función es principalmente de supervisión y auditoría.

### Renderizado Condicional

```jsx
const renderContent = () => {
  if (showSCV) {
    return <SCV 
      selectedActivo={selectedActivo}
      onNavigateBack={handleNavigateBack}
      readOnly={true} // Modo solo lectura
    />;
  } else {
    return <Inventory 
      onNavigateToSCV={handleNavigateToSCV}
      readOnly={true} // Modo solo lectura
    />;
  }
};
```

---

## 👤 Panel de Usuario Estándar (`/usuario`)

**Ruta**: `/app/usuario/`  
**Rol Requerido**: `usuario`  
**Permisos**: Crear solicitudes de activos, ver sus propios activos y solicitudes

### Funcionalidades Principales

#### 1. **Mis Activos**
Vista de activos asignados al usuario con capacidad de solicitar modificaciones.

**Módulo**: `/usuario/inventory/Inventory.jsx`

##### Características

- ✅ Ver solo activos asignados al usuario
- ✅ Filtrar y buscar en mis activos
- ✅ Solicitar creación de nuevos activos
- ✅ Solicitar modificación de activos existentes
- ✅ Ver historial de versiones (SCV)

##### Acciones Disponibles

**Botón "Nuevo Activo"** (esquina superior derecha):

```jsx
<Button 
  variant="primary"
  onClick={handleNuevoActivo}
  icon={<FaPlus />}
>
  Solicitar Nuevo Activo
</Button>
```

**Navega a**: Formulario de creación de activo

---

#### 2. **Solicitar Nuevo Activo**
Formulario para solicitar la creación de un nuevo activo.

**Módulo**: `/usuario/activo/NuevoActivo.jsx`

##### Formulario

```jsx
<form onSubmit={handleSubmit}>
  <Input
    label="Nombre del Activo"
    name="nombre"
    value={formData.nombre}
    onChange={handleChange}
    required
  />
  
  <Select
    label="Tipo"
    name="tipo"
    options={[
      { value: 'Hardware', label: 'Hardware' },
      { value: 'Software', label: 'Software' },
      { value: 'Red', label: 'Red' },
      { value: 'Otro', label: 'Otro' }
    ]}
    value={formData.tipo}
    onChange={handleChange}
    required
  />
  
  <Input
    label="Marca"
    name="marca"
    value={formData.marca}
    onChange={handleChange}
  />
  
  <Input
    label="Modelo"
    name="modelo"
    value={formData.modelo}
    onChange={handleChange}
  />
  
  <Input
    label="Número de Serie"
    name="numeroSerie"
    value={formData.numeroSerie}
    onChange={handleChange}
    required
  />
  
  <Input
    label="Ubicación"
    name="ubicacion"
    value={formData.ubicacion}
    onChange={handleChange}
    required
  />
  
  <Select
    label="Estado"
    name="estado"
    options={[
      { value: 'Activo', label: 'Activo' },
      { value: 'Mantenimiento', label: 'Mantenimiento' },
      { value: 'Inactivo', label: 'Inactivo' }
    ]}
    value={formData.estado}
    onChange={handleChange}
    required
  />
  
  <Input
    label="Descripción"
    name="descripcion"
    type="textarea"
    value={formData.descripcion}
    onChange={handleChange}
  />
  
  <div className="form-buttons">
    <Button variant="secondary" onClick={onCancel}>
      Cancelar
    </Button>
    <Button type="submit" variant="primary" loading={isSubmitting}>
      Solicitar Activo
    </Button>
  </div>
</form>
```

##### Lógica de Envío

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    // El usuario actual se asigna automáticamente como responsable
    const userData = JSON.parse(localStorage.getItem('user'));
    
    const activoData = {
      ...formData,
      responsable: userData._id
    };
    
    const response = await ActivoService.createActivo(activoData);
    
    // Automáticamente crea una solicitud de tipo CREACION
    showToastMessage(
      `Activo creado: ${response.activo.codigo}. Solicitud enviada para revisión.`,
      'success'
    );
    
    onSuccess(); // Volver a "Mis Activos"
  } catch (error) {
    showToastMessage('Error al crear activo', 'danger');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Importante**: Al crear un activo, automáticamente se genera una **solicitud de cambio de tipo CREACION** que debe ser revisada por el Responsable de Seguridad.

---

#### 3. **Solicitar Modificación de Activo**
Formulario para solicitar cambios en un activo existente.

**Módulo**: `/usuario/activo/ModificarActivo.jsx`

##### Trigger

Desde `CardActivo`:

```jsx
<CardActivo
  activo={activo}
  showModificarButton={true}
  onModificarClick={handleModificar}
/>
```

##### Formulario de Modificación

```jsx
<form onSubmit={handleSubmit}>
  <h3>Modificar Activo: {activo.nombre}</h3>
  <p className="text-muted">Código: {activo.codigo}</p>
  
  {/* Solo campos modificables */}
  <Input
    label="Nombre"
    name="nombre"
    value={formData.nombre}
    onChange={handleChange}
  />
  
  <Input
    label="Ubicación"
    name="ubicacion"
    value={formData.ubicacion}
    onChange={handleChange}
  />
  
  <Select
    label="Estado"
    name="estado"
    options={estadosOptions}
    value={formData.estado}
    onChange={handleChange}
  />
  
  <Input
    label="Descripción del Cambio"
    name="descripcionCambio"
    type="textarea"
    value={formData.descripcionCambio}
    onChange={handleChange}
    required
    placeholder="Explique el motivo de la modificación..."
  />
  
  <div className="form-buttons">
    <Button variant="secondary" onClick={onCancel}>
      Cancelar
    </Button>
    <Button type="submit" variant="primary">
      Solicitar Modificación
    </Button>
  </div>
</form>
```

##### Lógica de Modificación

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Solo enviar campos que cambiaron
    const cambios = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== activo[key] && key !== 'descripcionCambio') {
        cambios[key] = formData[key];
      }
    });
    
    if (Object.keys(cambios).length === 0) {
      showToastMessage('No se detectaron cambios', 'warning');
      return;
    }
    
    const response = await ActivoService.updateActivo(activo._id, {
      ...cambios,
      justificacion: formData.descripcionCambio
    });
    
    // Automáticamente crea una solicitud de tipo MODIFICACION
    showToastMessage(
      'Solicitud de modificación enviada para revisión',
      'success'
    );
    
    onSuccess();
  } catch (error) {
    showToastMessage('Error al solicitar modificación', 'danger');
  }
};
```

**Importante**: Al modificar un activo, automáticamente se genera una **solicitud de cambio de tipo MODIFICACION** que debe ser revisada por el Responsable de Seguridad.

---

#### 4. **Mis Solicitudes**
Vista de todas las solicitudes creadas por el usuario.

**Módulo**: `/usuario/solicitudes/Solicitudes.jsx`

##### Características

- ✅ Ver todas mis solicitudes (Pendientes, Aprobadas, Rechazadas)
- ✅ Filtrar por estado
- ✅ Ver detalles de cada solicitud
- ✅ Contador de solicitudes pendientes (badge)

##### Lista de Solicitudes

```jsx
<Table
  title="Mis Solicitudes"
  columns={[
    { 
      key: 'activo', 
      label: 'Activo',
      render: (row) => row.activo?.nombre || 'N/A'
    },
    { 
      key: 'tipo', 
      label: 'Tipo',
      render: (row) => (
        row.tipo === 'CREACION' ? 'Creación' : 'Modificación'
      )
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (row) => (
        <span className={`badge-${getEstadoColor(row.estado)}`}>
          {row.estado}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Fecha',
      render: (row) => formatDate(row.createdAt)
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <Button onClick={() => handleVerDetalles(row)}>
          Ver Detalles
        </Button>
      )
    }
  ]}
  data={solicitudes}
/>
```

##### Estados Visuales

| Estado | Color | Badge | Significado |
|--------|-------|-------|-------------|
| **Pendiente** | 🟡 Amarillo | `badge-warning` | Esperando revisión |
| **En Revisión** | 🔵 Azul | `badge-info` | Siendo revisada |
| **Aprobada** | 🟢 Verde | `badge-success` | Cambios aplicados |
| **Rechazada** | 🔴 Rojo | `badge-danger` | No aprobada |

---

#### 5. **Detalles de Solicitud**
Vista detallada de una solicitud individual.

**Módulo**: `/usuario/solicitudes/SolicitudDetalles.jsx`

##### Información Mostrada

```jsx
<div className="solicitud-detalles">
  <div className="solicitud-header">
    <h2>Solicitud de {solicitud.tipo}</h2>
    <span className={`estado-badge ${solicitud.estado}`}>
      {solicitud.estado}
    </span>
  </div>
  
  <CardActivo activo={solicitud.activo} />
  
  <div className="info-section">
    <h4>Información de la Solicitud</h4>
    <p><strong>Fecha:</strong> {formatDate(solicitud.createdAt)}</p>
    <p><strong>Tipo:</strong> {solicitud.tipo}</p>
    <p><strong>Estado:</strong> {solicitud.estado}</p>
  </div>
  
  {solicitud.cambiosPropuestos && (
    <div className="cambios-section">
      <h4>Cambios Propuestos</h4>
      {Object.entries(solicitud.cambiosPropuestos).map(([key, value]) => (
        <div key={key} className="cambio-item">
          <strong>{key}:</strong> {value}
        </div>
      ))}
    </div>
  )}
  
  {solicitud.estado === 'APROBADA' && solicitud.cambiosAplicados && (
    <Alert variant="success">
      Solicitud aprobada. Los cambios han sido aplicados al activo.
    </Alert>
  )}
  
  {solicitud.estado === 'RECHAZADA' && (
    <Alert variant="danger">
      <h5>Solicitud Rechazada</h5>
      <p><strong>Motivo:</strong></p>
      {solicitud.comentariosRevision?.map(comentario => (
        <div key={comentario._id} className="comentario-rechazo">
          <p>{comentario.comentario}</p>
          <small>Por: {comentario.usuario.nombreCompleto}</small>
        </div>
      ))}
    </Alert>
  )}
  
  {solicitud.comentariosRevision && solicitud.comentariosRevision.length > 0 && (
    <div className="comentarios-section">
      <h4>Comentarios de Revisión</h4>
      {solicitud.comentariosRevision.map(comentario => (
        <div key={comentario._id} className="comentario">
          <p><strong>{comentario.usuario.nombreCompleto} ({comentario.rol}):</strong></p>
          <p>{comentario.comentario}</p>
          <small>{formatDate(comentario.fecha)}</small>
        </div>
      ))}
    </div>
  )}
  
  <Button onClick={onNavigateBack}>
    ← Volver a Mis Solicitudes
  </Button>
</div>
```

##### Manejo de Solicitudes Rechazadas

Cuando una solicitud es rechazada, el usuario puede:
1. Ver el motivo del rechazo
2. Crear una nueva solicitud con los ajustes necesarios
3. El sistema opcionalmente puede mostrar sugerencias del revisor

---

### Tabs del Usuario

```jsx
const usuarioTabs = [
  {
    id: "mis-activos",
    name: "Mis Activos",
    iconName: "FaBoxes",
  },
  {
    id: "mis-solicitudes",
    name: "Mis Solicitudes",
    iconName: "FaFileAlt",
    badgeCount: solicitudesCount > 0 ? solicitudesCount : "" // Contador dinámico
  },
];
```

### Renderizado Condicional

```jsx
const renderContent = () => {
  switch (activeTab) {
    case "mis-activos":
      if (showNuevoActivo) {
        return <NuevoActivo 
          onCancel={handleCancelNuevo}
          onSuccess={handleSuccessNuevo}
        />;
      } else if (showModificarActivo) {
        return <ModificarActivo 
          activo={selectedActivo}
          onCancel={handleCancelModificar}
          onSuccess={handleSuccessModificar}
        />;
      } else if (showSCV) {
        return <SCV 
          selectedActivo={selectedActivo}
          onNavigateBack={handleNavigateBack}
        />;
      } else {
        return <Inventory 
          onNuevoActivo={handleNuevoActivo}
          onModificarActivo={handleModificar}
          onNavigateToSCV={handleNavigateToSCV}
        />;
      }
      
    case "mis-solicitudes":
      if (showSolicitudDetalles) {
        return <SolicitudDetalles 
          solicitud={selectedSolicitud}
          onNavigateBack={handleBackToSolicitudes}
        />;
      } else {
        return <Solicitudes 
          onVerDetalles={handleNavigateToDetalles}
        />;
      }
      
    default:
      return <Inventory />;
  }
};
```

---

## 🔄 Flujo Completo de Solicitud de Cambio

### Ejemplo: Usuario solicita modificar ubicación de un activo

```
1. USUARIO crea solicitud
   ├─ Accede a "Mis Activos"
   ├─ Selecciona activo
   ├─ Clic en "Modificar"
   ├─ Llena formulario (nueva ubicación)
   ├─ Envía solicitud
   └─ Estado: PENDIENTE
         │
         ▼
2. RESPONSABLE SEGURIDAD revisa
   ├─ Recibe notificación (badge contador +1)
   ├─ Accede a "Panel de Revisión"
   ├─ Selecciona solicitud
   ├─ Revisa cambios propuestos
   ├─ Decide: APROBAR o RECHAZAR
   │
   ├─ SI APRUEBA:
   │  ├─ Añade comentario
   │  ├─ Sistema aplica cambios al activo
   │  ├─ Estado: APROBADA
   │  └─ Notifica al usuario
   │
   └─ SI RECHAZA:
      ├─ Añade motivo del rechazo
      ├─ Estado: RECHAZADA
      └─ Notifica al usuario
            │
            ▼
3. USUARIO ve resultado
   ├─ Accede a "Mis Solicitudes"
   ├─ Ve estado actualizado
   │
   ├─ SI APROBADA:
   │  └─ Ve cambios aplicados en "Mis Activos"
   │
   └─ SI RECHAZADA:
      ├─ Lee motivo del rechazo
      └─ Puede crear nueva solicitud ajustada
            │
            ▼
4. AUDITOR supervisa
   ├─ Accede a Inventario
   ├─ Selecciona activo
   ├─ Ve historial en SCV
   ├─ Revisa solicitud y decisión
   └─ Añade comentario de auditoría (opcional)
```

---

## 📋 Resumen de Permisos por Rol

| Funcionalidad | Admin | Seguridad | Auditor | Usuario |
|---------------|-------|-----------|---------|---------|
| **Usuarios** |
| Ver usuarios | ✅ | ❌ | ❌ | ❌ |
| Crear usuarios | ✅ | ❌ | ❌ | ❌ |
| Editar usuarios | ✅ | ❌ | ❌ | ❌ |
| Desactivar usuarios | ✅ | ❌ | ❌ | ❌ |
| Reasignar activos | ✅ | ❌ | ❌ | ❌ |
| **Activos** |
| Ver todos los activos | ✅ | ✅ | ✅ | ❌ |
| Ver mis activos | - | - | - | ✅ |
| Crear activos | ✅ | ✅ | ❌ | ✅* |
| Modificar activos | ✅ | ✅ | ❌ | ✅* |
| Ver historial (SCV) | ✅ | ✅ | ✅ | ✅ |
| **Solicitudes** |
| Ver todas las solicitudes | ✅ | ✅ | ✅ | ❌ |
| Ver mis solicitudes | - | - | - | ✅ |
| Crear solicitudes | ✅ | ✅ | ❌ | ✅ |
| Aprobar/Rechazar | ❌ | ✅ | ❌ | ❌ |
| Comentarios auditoría | ❌ | ❌ | ✅ | ❌ |

*Mediante solicitudes que deben ser aprobadas

---

## 6. Sistema de Estilos

SecureFlow Frontend implementa un sistema de estilos modular y escalable basado en CSS puro, organizado en múltiples archivos temáticos que facilitan el mantenimiento y la consistencia visual de la aplicación.

### 📁 Estructura de Archivos

El sistema de estilos está ubicado en `src/styles/` y consta de 7 archivos CSS principales:

```
src/styles/
├── index.css         # Punto de entrada que importa todos los estilos
├── variables.css     # Variables CSS globales (colores, tipografía)
├── buttons.css       # Estilos de botones personalizados
├── forms.css         # Estilos de formularios (inputs, selects)
├── components.css    # Estilos de componentes (cards, alerts)
├── layouts.css       # Estilos de layouts y gradientes
├── modal.css         # Estilos de modales
└── responsive.css    # Media queries y ajustes responsivos
```

### 🎨 Paleta de Colores

El sistema de diseño se basa en una paleta de colores corporativa definida mediante variables CSS:

#### Colores Principales

```css
:root {
  /* Colores base */
  --color-black: #000000;
  --color-navy: #000080;           /* Color primario - azul marino */
  --color-crayola-blue: #2c75ff;   /* Color secundario - azul brillante */
  --color-silver: #c6bfbf;         /* Color neutro */
  --color-white: #ffffff;
}
```

#### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-black: #ffffff;
    --color-white: #000000;
    /* Las variables se adaptan automáticamente */
  }
}
```

#### Clases de Utilidad

```css
/* Clases de texto */
.text-navy { color: var(--color-navy); }
.text-crayola { color: var(--color-crayola-blue); }

/* Clases de fondo */
.bg-navy { background-color: var(--color-navy); }
.bg-crayola { background-color: var(--color-crayola-blue); }
```

---

### 🖱️ Estilos de Botones (`buttons.css`)

Define tres variantes principales de botones con efectos hover y focus:

#### `.btn-custom-primary`

Botón primario con el color corporativo navy:

```css
.btn-custom-primary {
  background-color: var(--color-navy);
  border-color: var(--color-navy);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-custom-primary:hover {
  background-color: var(--color-crayola-blue);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 128, 0.2);
}
```

**Características:**
- Efecto hover con cambio de color y elevación
- Transiciones suaves (300ms)
- Border-radius redondeado (0.5rem)
- Shadow para profundidad

#### `.btn-custom-secondary`

Botón secundario con color silver:

```css
.btn-custom-secondary {
  background-color: var(--color-silver);
  border-color: var(--color-silver);
  color: var(--color-black);
  font-weight: 500;
}
```

#### `.btn-custom-outline`

Botón outline con borde navy:

```css
.btn-custom-outline {
  background-color: transparent;
  border: 2px solid var(--color-navy);
  color: var(--color-navy);
}

.btn-custom-outline:hover {
  background-color: var(--color-navy);
  color: white;
}
```

---

### 📝 Estilos de Formularios (`forms.css`)

Proporciona estilos consistentes para todos los elementos de formulario:

#### `.custom-input`

```css
.custom-input {
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.custom-input:focus {
  border-color: var(--color-navy);
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 128, 0.1);
}
```

**Características:**
- Borde gris por defecto, navy al enfocar
- Padding generoso (0.75rem 1rem)
- Shadow sutil al enfocar
- Estado de validación `.is-invalid`

#### `.custom-select`

```css
.custom-select {
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: white;
}

.custom-select:focus {
  border-color: var(--color-navy);
  box-shadow: 0 0 0 0.2rem rgba(0, 0, 128, 0.1);
}
```

#### `.form-check-input` (Checkboxes)

```css
.form-check-input:checked {
  background-color: var(--color-navy);
  border-color: var(--color-navy);
}
```

---

### 🎴 Estilos de Componentes (`components.css`)

Define estilos para componentes reutilizables como cards, alerts y títulos:

#### `.custom-card`

```css
.custom-card {
  border: none;
  border-radius: 1rem;
  overflow: hidden;
  min-width: 400px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Características:**
- Sin borde, con border-radius grande (1rem)
- Animación de entrada desde abajo
- Padding interno en `.custom-card-body` (3rem)

#### `.custom-alert`

```css
.alert-success {
  background-color: rgba(25, 135, 84, 0.1);
  border-left: 4px solid #198754;
  color: #146c43;
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  border-left: 4px solid #dc3545;
  color: #b02a37;
}
```

**Características:**
- Fondo translúcido (10% opacity)
- Borde izquierdo grueso (4px) de color sólido
- Colores semánticos (success verde, danger rojo)

---

### 🌌 Estilos de Layouts (`layouts.css`)

El archivo más extenso del sistema, define layouts complejos y gradientes:

#### `.auth-gradient-container`

Layout para páginas de autenticación (login/register):

```css
.auth-gradient-container {
  background: linear-gradient(
    135deg,
    var(--color-crayola-blue) 0%,
    var(--color-navy) 35%,
    #1a1a4d 70%,
    var(--color-black) 100%
  );
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.auth-gradient-container::before {
  content: "";
  position: absolute;
  background: radial-gradient(
    circle at 20% 80%,
    rgba(44, 117, 255, 0.3) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 80% 20%,
    rgba(0, 0, 128, 0.4) 0%,
    transparent 50%
  );
  z-index: 1;
}
```

**Características:**
- Gradiente lineal de 4 colores (135deg)
- Pseudo-elemento `::before` con gradientes radiales para profundidad
- Min-height 100vh para pantalla completa
- Z-index para capas (contenido z-index: 2)

#### `.gradient-layout-container`

Layout universal para todos los paneles de usuario:

```css
.gradient-layout-container {
  background: linear-gradient(
    135deg,
    var(--color-crayola-blue) 0%,
    var(--color-navy) 35%,
    #1a1a4d 70%,
    var(--color-black) 100%
  );
  min-height: 100vh;
}
```

**Uso:**
- Componente `GradientLayout` en `/src/components/ui/GradientLayout.jsx`
- Aplicado en todos los paneles (admin, seguridad, auditor, usuario)

#### Otros Layouts

- `.user-page`: Estilos del panel de usuario
- `.main-content`: Contenedor principal con padding 2rem
- `.gradient-content`: Contenedor interno con z-index 2

---

### 📱 Estilos Responsivos (`responsive.css`)

Define media queries para adaptación móvil:

#### Mobile (max-width: 576px)

```css
@media (max-width: 576px) {
  .custom-card {
    min-width: unset;  /* Elimina ancho mínimo */
  }
  
  .custom-card-body {
    padding: 2rem;      /* Reduce padding */
  }
  
  .login-container {
    padding: 1rem;
  }
}
```

#### Extra Small (max-width: 400px)

```css
@media (max-width: 400px) {
  .custom-card-body {
    padding: 1.5rem;    /* Padding aún más reducido */
  }
}
```

**Estrategia:**
- Mobile-friendly: reduce padding y tamaños mínimos
- Breakpoints alineados con Bootstrap (576px, 768px, 992px, 1200px)
- Prioriza legibilidad y accesibilidad táctil

---

### 🪟 Estilos de Modales (`modal.css`)

Define estilos personalizados para componentes Modal:

**Características principales:**
- Overlay oscuro (rgba opacity)
- Animaciones de entrada/salida
- Z-index elevado (9999+)
- Centrado vertical y horizontal
- Backdrop blur effect

---

### 🔧 Uso del Sistema de Estilos

#### Importación en la Aplicación

Todos los estilos se importan en `src/app/layout.js`:

```javascript
import '../styles/index.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

El archivo `index.css` importa todos los demás:

```css
@import './variables.css';
@import './buttons.css';
@import './forms.css';
@import './components.css';
@import './layouts.css';
@import './responsive.css';
```

#### Uso en Componentes

```jsx
// Ejemplo: Botón con estilos custom
import { Button } from 'react-bootstrap';

<Button className="btn-custom-primary">
  Iniciar Sesión
</Button>

// Ejemplo: Input con estilos custom
<Form.Control
  type="email"
  className="custom-input"
  placeholder="correo@ejemplo.com"
/>

// Ejemplo: Card con estilos custom
<Card className="custom-card">
  <Card.Body className="custom-card-body">
    <h3>Contenido</h3>
  </Card.Body>
</Card>
```

---

### 🎯 Buenas Prácticas

1. **Variables CSS**: Siempre usar variables de color (`var(--color-navy)`) en lugar de valores hardcodeados
2. **Clases Custom**: Prefijo `custom-` para distinguir estilos propios de Bootstrap
3. **Consistencia**: Usar border-radius y padding consistentes (0.5rem, 0.75rem, 1rem)
4. **Transiciones**: Aplicar `transition: all 0.3s ease` para interacciones suaves
5. **Responsividad**: Siempre considerar mobile-first con media queries
6. **Z-index**: Mantener jerarquía clara:
   - Fondo: z-index 1
   - Contenido: z-index 2
   - Sidebar: z-index 1000
   - Modales: z-index 9999+

---

### 🔍 Ejemplo Completo: Página de Login

```jsx
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import '../styles/index.css';

export default function LoginPage() {
  return (
    <div className="auth-gradient-container">  {/* Layout con gradiente */}
      <Container>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col md={6} lg={5}>
            <Card className="custom-card">  {/* Card animada */}
              <Card.Header className="custom-card-header">
                <h2 className="text-center mb-0">SecureFlow</h2>
              </Card.Header>
              <Card.Body className="custom-card-body">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      className="custom-input"  {/* Input custom */}
                      placeholder="correo@ejemplo.com"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      className="custom-input"
                    />
                  </Form.Group>
                  
                  <Button
                    type="submit"
                    className="btn-custom-primary w-100"  {/* Botón custom */}
                  >
                    Iniciar Sesión
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
```

**Resultado visual:**
- Fondo con gradiente azul degradado
- Card blanca centrada con animación de entrada
- Inputs con bordes redondeados y focus azul
- Botón navy con hover interactivo
- Totalmente responsivo

---

### 📊 Resumen de Variables CSS

| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-black` | `#000000` | Texto oscuro, fondos dark mode |
| `--color-navy` | `#000080` | Color primario (botones, headers) |
| `--color-crayola-blue` | `#2c75ff` | Color secundario (hover, acentos) |
| `--color-silver` | `#c6bfbf` | Color neutro (fondos secundarios) |
| `--color-white` | `#ffffff` | Texto claro, fondos claros |

---

**Última actualización**: Diciembre 2025  
**Versión del Frontend**: 0.1.0  
**Mantenido por**: Equipo SecureFlow
