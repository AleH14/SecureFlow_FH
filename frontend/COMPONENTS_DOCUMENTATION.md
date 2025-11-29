# Documentación de Componentes - SecureFlow FH

Esta documentación describe los componentes principales del sistema SecureFlow FH, incluyendo sus propiedades (props), ejemplos de uso con JSON y mejores prácticas.

## Índice

- [CardActivo](#cardactivo)
- [GradientLayout](#gradientlayout)
- [Header](#header)
- [Modal](#modal)
- [SearchBar](#searchbar)
- [SideBar](#sidebar)
- [Table](#table)

---

## CardActivo

Componente para mostrar información de un activo del sistema con botón de historial.

### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `activo` | `object` | - | ✅ | Objeto con información del activo |
| `onHistorialClick` | `function` | `() => {}` | ❌ | Función ejecutada al hacer clic en historial |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |

### Estructura del JSON de Activo

```javascript
const activoExample = {
  nombre: "Servidor Web Principal",
  codigo: "SWP-001",
  categoria: "Infraestructura",
  descripcion: "Servidor web para aplicaciones corporativas con balanceador de carga",
  responsable: "Juan Pérez",
  version: "2.1.0",
  ubicacion: "Sala 5 - Dep TI",
  estado: "Activo", // "Activo", "Mantenimiento", "Inactivo", "En revision"
  fecha_creacion: "2024-01-15"
};
```

### Ejemplos de Uso

**Uso Básico:**
```jsx
import { CardActivo } from '@/components/ui';

const activo = {
  nombre: "Servidor Web Principal",
  codigo: "SWP-001",
  categoria: "Infraestructura", 
  descripcion: "Servidor para aplicaciones web",
  responsable: "Juan Pérez",
  estado: "Activo",
  ubicacion: "Datacenter A",
  fecha_creacion: "2024-01-15"
};

<CardActivo 
  activo={activo}
  onHistorialClick={(activo) => console.log('Ver historial de:', activo.nombre)}
/>
```

**Con Navegación a SCV:**
```jsx
const handleHistorialClick = (activo) => {
  setSelectedActivo(activo);
  setShowSCV(true);
};

<CardActivo 
  activo={activo}
  onHistorialClick={handleHistorialClick}
  className="mb-3"
/>
```

---

## GradientLayout

Componente contenedor con diseño de fondo degradado para layouts principales.

### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `children` | `ReactNode` | - | ✅ | Contenido del layout |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |

### Ejemplos de Uso

**Layout Principal:**
```jsx
import { GradientLayout } from '@/components/ui';

<GradientLayout>
  <div className="main-content">
    <h1>Página Principal</h1>
    <p>Contenido de la aplicación</p>
  </div>
</GradientLayout>
```

**Con Clases Personalizadas:**
```jsx
<GradientLayout className="admin-layout">
  <AdminDashboard />
</GradientLayout>
```

---

## Header

Componente de encabezado con título y información de usuario opcionales.

### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `children` | `ReactNode` | - | ❌ | Contenido adicional del header |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |
| `showTitle` | `boolean` | `true` | ❌ | Muestra/oculta el título principal |
| `userName` | `string` | - | ❌ | Nombre del usuario logueado |
| `userIcon` | `ReactNode` | - | ❌ | Icono del usuario |
| `showUser` | `boolean` | `false` | ❌ | Muestra/oculta información de usuario |

### Ejemplos de Uso

**Header Básico:**
```jsx
import { Header } from '@/components/ui';

<Header showTitle={true} />
```

**Header con Usuario:**
```jsx
import { FaUser } from 'react-icons/fa';

<Header 
  showTitle={true}
  showUser={true}
  userName="Juan Pérez"
  userIcon={<FaUser />}
/>
```

**Header con Contenido Personalizado:**
```jsx
<Header className="admin-header">
  <div className="header-actions">
    <button>Configuración</button>
    <button>Notificaciones</button>
  </div>
</Header>
```

---

## Modal

Componente modal generalizado y reutilizable para confirmaciones, alertas y formularios.

### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `isOpen` | `boolean` | - | ✅ | Controla si el modal está visible |
| `onClose` | `function` | - | ✅ | Función llamada al cerrar el modal |
| `title` | `string` | `"Título del Modal"` | ❌ | Título mostrado en el header |
| `question` | `string` | `"¿Estás seguro?"` | ❌ | Pregunta principal del modal |
| `informativeText` | `string` | `""` | ❌ | Texto informativo adicional |
| `valueBoxTitle` | `string` | `""` | ❌ | Título del recuadro de valores |
| `valueBoxSubtitle` | `string` | `""` | ❌ | Subtítulo del recuadro de valores |
| `showValueBox` | `boolean` | `false` | ❌ | Muestra/oculta el recuadro de valores |
| `cancelText` | `string` | `"Cancelar"` | ❌ | Texto del botón cancelar |
| `acceptText` | `string` | `"Aceptar"` | ❌ | Texto del botón aceptar |
| `onCancel` | `function` | - | ❌ | Función llamada al cancelar |
| `onAccept` | `function` | - | ❌ | Función llamada al aceptar |
| `headerBgColor` | `string` | `"var(--color-navy)"` | ❌ | Color de fondo del header |
| `buttonColor` | `string` | `"var(--color-navy)"` | ❌ | Color del botón aceptar |

### Ejemplos de Uso

**Modal de Confirmación:**
```jsx
import { Modal } from '@/components/ui';

const [showModal, setShowModal] = useState(false);

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirmar Eliminación"
  question="¿Estás seguro de que deseas eliminar este usuario?"
  onAccept={() => {
    handleDelete();
    setShowModal(false);
  }}
  acceptText="Eliminar"
  headerBgColor="#dc3545"
  buttonColor="#dc3545"
/>
```

**Modal con Información de Activo:**
```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Información del Activo"
  question="¿Deseas continuar con esta acción?"
  showValueBox={true}
  valueBoxTitle="Activo seleccionado:"
  valueBoxSubtitle={`${selectedActivo.nombre} - ${selectedActivo.codigo}`}
  informativeText="Esta acción afectará el historial del activo."
/>
```

---

## SearchBar

Componente de barra de búsqueda configurable con múltiples campos y filtros.

### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `fields` | `Array` | `[]` | ✅ | Configuración de campos de búsqueda |
| `onFilter` | `function` | `() => {}` | ❌ | Función ejecutada cuando cambian los filtros |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |

### Estructura del JSON de Fields

```javascript
const fieldsExample = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    placeholder: "Buscar por nombre..."
  },
  {
    name: "categoria", 
    label: "Categoría",
    type: "select",
    options: [
      { value: "infraestructura", label: "Infraestructura" },
      { value: "software", label: "Software" },
      { value: "hardware", label: "Hardware" }
    ]
  },
  {
    name: "estado",
    label: "Estado", 
    type: "select",
    options: [
      { value: "activo", label: "Activo" },
      { value: "inactivo", label: "Inactivo" },
      { value: "mantenimiento", label: "Mantenimiento" }
    ]
  }
];
```

### Ejemplos de Uso

**Búsqueda de Activos:**
```jsx
import { SearchBar } from '@/components/ui';

const searchFields = [
  {
    name: "nombre",
    label: "Nombre del Activo",
    type: "text", 
    placeholder: "Buscar activo..."
  },
  {
    name: "responsable",
    label: "Responsable",
    type: "text",
    placeholder: "Buscar responsable..."
  },
  {
    name: "estado",
    label: "Estado",
    type: "select",
    options: [
      { value: "activo", label: "Activo" },
      { value: "inactivo", label: "Inactivo" },
      { value: "mantenimiento", label: "Mantenimiento" }
    ]
  }
];

const handleFilter = (filters) => {
  console.log('Filtros aplicados:', filters);
  // Aplicar filtros a los datos
};

<SearchBar 
  fields={searchFields}
  onFilter={handleFilter}
/>
```

**Búsqueda de Usuarios:**
```jsx
const userSearchFields = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    placeholder: "Nombre del usuario..."
  },
  {
    name: "email", 
    label: "Email",
    type: "email",
    placeholder: "Correo electrónico..."
  },
  {
    name: "rol",
    label: "Rol",
    type: "select",
    options: [
      { value: "admin", label: "Administrador" },
      { value: "user", label: "Usuario" },
      { value: "auditor", label: "Auditor" }
    ]
  }
];
```

---

## SideBar

Componente de barra lateral de navegación con pestañas configurables.

### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `tabs` | `Array` | `[]` | ✅ | Configuración de pestañas |
| `defaultActiveTab` | `string` | `null` | ❌ | ID de la pestaña activa por defecto |
| `onTabChange` | `function` | `() => {}` | ❌ | Función ejecutada al cambiar pestaña |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |

### Estructura del JSON de Tabs

```javascript
const tabsExample = [
  {
    id: "users",
    name: "Gestión de Usuarios", 
    iconName: "FaUsers"
  },
  {
    id: "assets",
    name: "Gestión de Activos",
    iconName: "FaBoxes"
  },
  {
    id: "reports", 
    name: "Reportes",
    iconName: "FaChartBar"
  },
  {
    id: "settings",
    name: "Configuración",
    iconName: "FaCog"
  }
];
```

### Iconos Disponibles

- `FaUsers` - Usuarios
- `FaBoxes` - Activos/Inventario
- `FaCog` - Configuración
- `FaChartBar` - Reportes/Gráficos
- `FaFileAlt` - Documentos
- `FaShieldAlt` - Seguridad
- `FaUserPlus` - Agregar Usuario

### Ejemplos de Uso

**SideBar de Administrador:**
```jsx
import { Sidebar } from '@/components/ui';

const adminTabs = [
  {
    id: "users",
    name: "Gestión de Usuarios",
    iconName: "FaUsers"
  },
  {
    id: "assets", 
    name: "Gestión de Activos",
    iconName: "FaBoxes"
  },
  {
    id: "reports",
    name: "Reportes",
    iconName: "FaChartBar"
  },
  {
    id: "settings",
    name: "Configuración", 
    iconName: "FaCog"
  }
];

const handleTabChange = (tabId) => {
  console.log('Pestaña seleccionada:', tabId);
  setActiveView(tabId);
};

<Sidebar 
  tabs={adminTabs}
  defaultActiveTab="users"
  onTabChange={handleTabChange}
/>
```

**SideBar de Auditor:**
```jsx
const auditorTabs = [
  {
    id: "inventory",
    name: "Inventario de Activos",
    iconName: "FaBoxes"
  },
  {
    id: "audit",
    name: "Control de Versiones", 
    iconName: "FaShieldAlt"
  },
  {
    id: "reports",
    name: "Reportes de Auditoría",
    iconName: "FaFileAlt"
  }
];
```

---

## Table

Componente de tabla flexible y personalizable para mostrar datos tabulares.

### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `columns` | `Array` | `[]` | ✅ | Definición de columnas |
| `data` | `Array` | `[]` | ✅ | Datos a mostrar |
| `title` | `string` | - | ❌ | Título de la tabla |
| `icon` | `ReactNode` | - | ❌ | Icono junto al título |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |
| `headerStyle` | `object` | `{}` | ❌ | Estilos para el header |
| `rowStyle` | `object` | `{}` | ❌ | Estilos para las filas |
| `cellStyle` | `object` | `{}` | ❌ | Estilos para las celdas |

### Estructura del JSON de Columns

```javascript
const columnsExample = [
  {
    key: 'nombre',           // Clave del dato
    label: 'Nombre',         // Texto del header
    render: (row) => {},     // Función de renderizado personalizada (opcional)
    headerStyle: {},         // Estilos específicos del header (opcional)
    cellStyle: {}            // Estilos específicos de la celda (opcional)
  }
];
```

### Estructura del JSON de Data

```javascript
const dataExample = [
  {
    id: 1,
    nombre: "Juan Pérez", 
    email: "juan@example.com",
    rol: "Administrador",
    estado: "Activo",
    fecha_creacion: "2024-01-15"
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria@example.com", 
    rol: "Usuario",
    estado: "Activo",
    fecha_creacion: "2024-02-20"
  }
];
```

### Ejemplos de Uso

**Tabla de Usuarios:**
```jsx
import { Table } from '@/components/ui';

const userColumns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'rol', label: 'Rol' },
  { 
    key: 'estado', 
    label: 'Estado',
    render: (row) => (
      <span className={`badge ${row.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
        {row.estado}
      </span>
    )
  }
];

const users = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com", 
    rol: "Admin",
    estado: "Activo"
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria@example.com",
    rol: "Usuario", 
    estado: "Inactivo"
  }
];

<Table
  title="Lista de Usuarios"
  columns={userColumns}
  data={users}
/>
```

**Tabla SCV (Control de Versiones):**
```jsx
const scvColumns = [
  { key: 'fecha', label: 'Fecha' },
  {
    key: 'solicitud_de_cambio',
    label: 'Solicitud de cambio',
    render: (row) => (
      <div className="scv-cell-content">
        <span className="scv-label">Nombre:</span> 
        <span className="scv-value">{row.solicitud_de_cambio.nombre}</span><br/>
        <span className="scv-label">Categoría:</span> 
        <span className="scv-value">{row.solicitud_de_cambio.categoria}</span><br/>
        <span className="scv-label">Responsable:</span> 
        <span className="scv-value">{row.solicitud_de_cambio.responsable}</span>
      </div>
    )
  },
  { key: 'comentario', label: 'Comentario' },
  {
    key: 'estado',
    label: 'Estado', 
    render: (row) => (
      <span className={`estado-badge estado-${row.estado.toLowerCase()}`}>
        {row.estado}
      </span>
    )
  }
];

const scvData = [
  {
    id: 1,
    fecha: "2025-11-23",
    solicitud_de_cambio: {
      nombre: "Servidor Web Principal",
      categoria: "Infraestructura", 
      responsable: "Juan Pérez"
    },
    comentario: "Actualización de seguridad",
    estado: "Aprobado"
  }
];
```

---

## Mejores Prácticas

### Uso de Componentes

1. **Importación Consistente:**
   ```jsx
   import { CardActivo, Table, Modal } from '@/components/ui';
   ```

2. **Estructura de JSON:** Mantén consistencia en la estructura de datos
3. **Manejo de Estados:** Usa useState para controlar visibilidad y datos
4. **Callbacks:** Implementa funciones de callback apropiadas

### Configuración JSON

1. **Validación:** Siempre valida la estructura JSON antes de usar
2. **Fallbacks:** Proporciona valores por defecto cuando sea necesario
3. **Tipos:** Mantén consistencia en los tipos de datos

### Performance

1. **Memoización:** Usa useMemo para JSON complejos
2. **Keys:** Siempre proporciona keys únicas en listas
3. **Optimización:** Evita recrear objetos en cada render

---

## Estructura de Archivos

```
src/
├── components/
│   └── ui/
│       ├── CardActivo.jsx
│       ├── GradientLayout.jsx
│       ├── Header.jsx
│       ├── Modal.jsx
│       ├── SearchBar.jsx
│       ├── SideBar.jsx
│       ├── Table.jsx
│       └── index.js
└── styles/
    ├── modal.css
    ├── components.css
    └── variables.css
```

---

*Documentación actualizada: Noviembre 2025*