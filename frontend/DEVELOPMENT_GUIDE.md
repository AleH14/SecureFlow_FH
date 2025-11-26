# 📖 Guía de Desarrollo - SecureFlow FH Frontend

## 🏗️ Arquitectura del Proyecto

Este documento explica la estructura del proyecto, cómo funcionan las pantallas actuales y cómo agregar nuevas funcionalidades siguiendo las mejores prácticas establecidas.

---

## 📁 Estructura de Carpetas

### 🎨 **src/styles/** - Estilos Organizados
```
src/styles/
├── index.css          # Punto de entrada - importa todos los estilos
├── variables.css      # Paleta de colores y variables CSS
├── buttons.css        # Estilos de botones y variantes
├── forms.css          # Campos de entrada, selects y formularios
├── components.css     # Tarjetas, alertas y componentes
├── layouts.css        # Layouts de páginas y contenedores
├── responsive.css     # Media queries y animaciones
└── README.md          # Documentación de estilos
```

**¿Qué agregar en cada archivo?**
- **`variables.css`**: Nuevos colores, variables CSS globales
- **`buttons.css`**: Nuevos tipos de botones (ej: btn-danger, btn-warning)
- **`forms.css`**: Estilos para nuevos tipos de inputs (ej: textarea, radio)
- **`components.css`**: Estilos para nuevos componentes UI
- **`layouts.css`**: Backgrounds y layouts para nuevas páginas
- **`responsive.css`**: Media queries específicas y animaciones

---

### 🧩 **src/components/ui/** - Componentes Reutilizables
```
src/components/ui/
├── Input.js           # Campo de entrada con validación
├── Button.js          # Botón con estados de carga y variantes
├── Card.js            # Contenedor con header, body, footer
├── Select.js          # Dropdown con opciones
├── Alert.js           # Mensajes de éxito/error
└── index.js           # Exporta todos los componentes UI
```

**¿Qué agregar aquí?**
- Componentes **pequeños y reutilizables**
- Elementos que se usan en **múltiples pantallas**
- Componentes **sin lógica de negocio**

**Ejemplos de componentes para agregar:**
```javascript
// Textarea.js - Campo de texto multilínea
// Modal.js - Ventana modal reutilizable
// Badge.js - Etiquetas de estado
// Spinner.js - Indicador de carga
// Tooltip.js - Información adicional
// Checkbox.js - Casilla de verificación personalizada
```

---

### 🏠 **src/components/** - Componentes de Pantalla
```
src/components/
├── LoginForm.js       # Formulario completo de inicio de sesión
├── RegisterForm.js    # Formulario completo de registro
├── ui/                # Carpeta de componentes reutilizables
└── index.js           # Exporta componentes principales + UI
```

**¿Qué agregar aquí?**
- Componentes **específicos de pantalla**
- Formularios **completos**
- Componentes con **lógica de negocio**
- Componentes que **combinan múltiples elementos UI**

**Ejemplos de componentes para agregar:**
```javascript
// UserProfile.js - Perfil de usuario
// Dashboard.js - Panel principal
// UsersList.js - Lista de usuarios
// AuditLog.js - Registro de auditoría
// SecuritySettings.js - Configuración de seguridad
```

---

### 📄 **src/components/index.js** - Archivo de Exportaciones
```javascript
// Main Components exports
export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';

// UI Components re-exports
export * from './ui';
```

**¿Para qué sirve?**
- **Centraliza las importaciones**
- **Simplifica el uso** de componentes
- **Mejora la organización** del código

**Cómo usarlo:**
```javascript
// ❌ Antes (múltiples imports)
import LoginForm from './components/LoginForm';
import { Button, Input } from './components/ui';

// ✅ Después (import único)
import { LoginForm, Button, Input } from './components';
```

---

### 🚀 **src/app/** - Páginas y Rutas (App Router de Next.js)
```
src/app/
├── globals.css        # Estilos base globales
├── layout.js          # Layout principal (común a todas las páginas)
├── page.js            # Página principal (/)
├── login/
│   └── page.js        # Página de login (/login)
└── register/
    └── page.js        # Página de registro (/register)
```

**¿Por qué esta estructura?**
- **Next.js 13+ App Router**: Cada carpeta = ruta automática
- **Organización clara**: Una carpeta por página
- **Layouts anidados**: Posibles layouts específicos por sección

**Ejemplos de páginas para agregar:**
```
src/app/
├── dashboard/
│   └── page.js        # Panel principal (/dashboard)
├── users/
│   ├── page.js        # Lista de usuarios (/users)
│   └── [id]/
│       └── page.js    # Detalle de usuario (/users/123)
├── audit/
│   └── page.js        # Auditoría (/audit)
└── settings/
    └── page.js        # Configuración (/settings)
```

---

## 🛠️ Pantallas Actuales

### 1. **Página Principal** (`/`)
- **Archivo**: `src/app/page.js`
- **Componente**: Página simple con enlaces
- **Funcionalidad**: Navegación a login y register

### 2. **Login** (`/login`)
- **Archivo**: `src/app/login/page.js`
- **Componente**: `LoginForm` 
- **Funcionalidad**: 
  - Validación de email y password
  - Estados de carga
  - Manejo de errores
  - "Remember me" y "Forgot password"

### 3. **Register** (`/register`)
- **Archivo**: `src/app/register/page.js`
- **Componente**: `RegisterForm`
- **Funcionalidad**:
  - Formulario completo para crear usuarios
  - Validación de campos
  - Selección de roles y departamentos
  - Confirmación de password

---

## 🎯 Guía Paso a Paso: Agregar Nueva Pantalla

### **Ejemplo: Crear página de Dashboard**

#### **Paso 1: Crear la estructura de la página**
```bash
# Crear carpeta para la nueva ruta
mkdir src/app/dashboard
```

#### **Paso 2: Crear el archivo de página**
```javascript
// src/app/dashboard/page.js
import React from 'react';
import Dashboard from '../../components/Dashboard';

export const metadata = {
  title: 'Dashboard - SecureFlow FH',
  description: 'Panel de control principal',
};

const DashboardPage = () => {
  return <Dashboard />;
};

export default DashboardPage;
```

#### **Paso 3: Crear componentes UI necesarios (si los necesita)**
```javascript
// src/components/ui/StatCard.js
import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <Card className={`custom-card stat-card-${color}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`stat-icon text-${color}`}>
            <i className={icon}></i>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
```

#### **Paso 4: Actualizar index de UI components**
```javascript
// src/components/ui/index.js
export { default as Input } from './Input';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Select } from './Select';
export { default as Alert } from './Alert';
export { default as StatCard } from './StatCard'; // ← Nueva línea
```

#### **Paso 5: Crear el componente principal**
```javascript
// src/components/Dashboard.js
'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { StatCard, Button } from './ui';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    auditLogs: 0,
    securityAlerts: 0
  });

  useEffect(() => {
    // Simulación de carga de datos
    setStats({
      totalUsers: 156,
      activeUsers: 142,
      auditLogs: 1203,
      securityAlerts: 3
    });
  }, []);

  return (
    <Container fluid className="dashboard-container">
      <div className="p-4">
        <h1 className="text-navy fw-bold mb-4">Dashboard</h1>
        
        <Row>
          <Col md={3} className="mb-3">
            <StatCard 
              title="Total Users" 
              value={stats.totalUsers}
              icon="bi bi-people-fill"
              color="primary"
            />
          </Col>
          <Col md={3} className="mb-3">
            <StatCard 
              title="Active Users" 
              value={stats.activeUsers}
              icon="bi bi-person-check-fill"
              color="success"
            />
          </Col>
          <Col md={3} className="mb-3">
            <StatCard 
              title="Audit Logs" 
              value={stats.auditLogs}
              icon="bi bi-journal-text"
              color="info"
            />
          </Col>
          <Col md={3} className="mb-3">
            <StatCard 
              title="Security Alerts" 
              value={stats.securityAlerts}
              icon="bi bi-shield-exclamation"
              color="warning"
            />
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Dashboard;
```

#### **Paso 6: Actualizar index de components principales**
```javascript
// src/components/index.js
// Main Components exports
export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';
export { default as Dashboard } from './Dashboard'; // ← Nueva línea

// UI Components re-exports
export * from './ui';
```

#### **Paso 7: Agregar estilos específicos**
```css
/* src/styles/components.css */
/* Agregar al final del archivo */

/* Dashboard Styles */
.dashboard-container {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.stat-card-primary {
  border-left: 4px solid var(--color-navy);
}

.stat-card-success {
  border-left: 4px solid #198754;
}

.stat-card-info {
  border-left: 4px solid #0dcaf0;
}

.stat-card-warning {
  border-left: 4px solid #ffc107;
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}
```

#### **Paso 8: Agregar navegación (opcional)**
```javascript
// src/app/page.js - Agregar enlace
<Link href="/dashboard" className="btn btn-custom-outline btn-lg">
  Go to Dashboard
</Link>
```

---

## ✅ Checklist para Nueva Pantalla

- [ ] **Crear carpeta** en `src/app/[nombre-pagina]/`
- [ ] **Crear `page.js`** con metadata y componente
- [ ] **Identificar componentes UI** necesarios
- [ ] **Crear componentes UI** en `src/components/ui/`
- [ ] **Actualizar `ui/index.js`** con exports
- [ ] **Crear componente principal** en `src/components/`
- [ ] **Actualizar `components/index.js`** con export
- [ ] **Agregar estilos** específicos en archivos correspondientes
- [ ] **Agregar navegación** desde otras páginas
- [ ] **Probar funcionalidad** y responsive design

---

## 🎨 Paleta de Colores Disponible

```css
/* Colores principales del sistema */
--color-navy: #000080;           /* Primario */
--color-crayola-blue: #2c75ff;   /* Secundario */
--color-silver: #c6bfbf;         /* Neutro */
--color-black: #000000;          /* Texto */
--color-white: #ffffff;          /* Fondo */
```

**Clases CSS disponibles:**
- `.text-navy`, `.bg-navy`
- `.text-crayola-blue`, `.bg-crayola-blue`
- `.text-primary-custom`

---

## 🚀 Comandos Útiles

```bash
# Iniciar desarrollo
npm run dev

# Crear nueva carpeta de página
mkdir src/app/[nombre-pagina]

# Crear nuevo componente UI
touch src/components/ui/[NombreComponente].js

# Crear nuevo componente principal  
touch src/components/[NombreComponente].js
```

---

## 📚 Recursos Adicionales

- **Next.js App Router**: [Documentación oficial](https://nextjs.org/docs/app)
- **React Bootstrap**: [Componentes disponibles](https://react-bootstrap.github.io/)
- **Bootstrap Icons**: [Iconos disponibles](https://icons.getbootstrap.com/)

---

**¡Feliz desarrollo! 🎉**