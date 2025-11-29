# Documentación de Componentes - SecureFlow FH

Esta documentación describe todos los componentes personalizados creados para el sistema SecureFlow FH, incluyendo sus propiedades (props), ejemplos de uso y mejores prácticas.

## Índice

- [Componentes UI](#componentes-ui)
  - [Modal](#modal)
  - [Button](#button)
  - [Input](#input)
  - [Table](#table)
  - [Card](#card)
  - [Alert](#alert)
  - [Select](#select)
- [Componentes de Formulario](#componentes-de-formulario)
  - [LoginForm](#loginform)
  - [RegisterForm](#registerform)

---

## Componentes UI

### Modal

Componente modal generalizado y reutilizable para confirmaciones, alertas y formularios.

#### Props

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

#### Ejemplos de Uso

**Modal de Confirmación Básico:**
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

**Modal con Recuadro de Valores:**
```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Información del Usuario"
  question="¿Deseas continuar con esta acción?"
  showValueBox={true}
  valueBoxTitle="Usuario seleccionado:"
  valueBoxSubtitle="Juan Pérez - juan@example.com"
  informativeText="Esta acción no se puede deshacer."
/>
```

**Modal Personalizado para Auditoría:**
```jsx
<Modal
  isOpen={showCommentModal}
  onClose={() => setShowCommentModal(false)}
  title="Agregar Comentario de Auditoría"
  question="¿Deseas agregar un comentario a este registro?"
  headerBgColor="#17a2b8"
  buttonColor="#17a2b8"
  acceptText="Agregar Comentario"
  showValueBox={true}
  valueBoxTitle="Registro seleccionado:"
  valueBoxSubtitle={`${selectedRecord.nombre} - ${selectedRecord.fecha}`}
/>
```

---

### Button

Componente de botón personalizable basado en Bootstrap con estados de carga.

#### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `children` | `ReactNode` | - | ✅ | Contenido del botón |
| `variant` | `string` | `'primary'` | ❌ | Variante del botón: `'primary'`, `'secondary'`, `'outline'` |
| `size` | `string` | `'md'` | ❌ | Tamaño del botón: `'sm'`, `'md'`, `'lg'` |
| `loading` | `boolean` | `false` | ❌ | Muestra estado de carga con spinner |
| `disabled` | `boolean` | `false` | ❌ | Desactiva el botón |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |
| `onClick` | `function` | - | ❌ | Función ejecutada al hacer clic |
| `type` | `string` | `'button'` | ❌ | Tipo de botón HTML |

#### Ejemplos de Uso

**Botón Primario:**
```jsx
import { Button } from '@/components/ui';

<Button 
  variant="primary" 
  onClick={() => handleSave()}
>
  Guardar
</Button>
```

**Botón con Estado de Carga:**
```jsx
<Button 
  variant="primary"
  size="lg"
  loading={isLoading}
  disabled={isLoading}
  onClick={handleSubmit}
>
  Enviar Formulario
</Button>
```

**Botón de Contorno:**
```jsx
<Button 
  variant="outline"
  onClick={() => handleCancel()}
  className="me-3"
>
  <FaArrowLeft className="me-2" />
  Regresar
</Button>
```

---

### Input

Componente de entrada de texto personalizado con validaciones y iconos.

#### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `type` | `string` | `'text'` | ❌ | Tipo de input HTML |
| `placeholder` | `string` | - | ❌ | Texto placeholder |
| `label` | `string` | - | ❌ | Etiqueta del campo |
| `error` | `string` | - | ❌ | Mensaje de error a mostrar |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |
| `required` | `boolean` | `false` | ❌ | Marca el campo como requerido |
| `icon` | `ReactNode` | - | ❌ | Icono izquierdo |
| `rightIcon` | `ReactNode` | - | ❌ | Icono derecho |

#### Ejemplos de Uso

**Input Básico:**
```jsx
import { Input } from '@/components/ui';

<Input
  type="email"
  name="email"
  label="Correo Electrónico"
  placeholder="Ingresa tu correo"
  value={formData.email}
  onChange={handleChange}
  required
/>
```

**Input con Error:**
```jsx
<Input
  type="password"
  name="password"
  label="Contraseña"
  placeholder="Ingresa tu contraseña"
  value={formData.password}
  onChange={handleChange}
  error={errors.password}
  required
/>
```

**Input con Iconos:**
```jsx
import { FaUser, FaEye } from 'react-icons/fa';

<Input
  type="text"
  placeholder="Buscar usuario"
  icon={<FaUser />}
  rightIcon={<FaEye />}
/>
```

---

### Table

Componente de tabla flexible y personalizable para mostrar datos tabulares.

#### Props

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

#### Estructura de Columnas

```javascript
const columns = [
  {
    key: 'nombre',           // Clave del dato
    label: 'Nombre',         // Texto del header
    render: (row) => {},     // Función de renderizado personalizada (opcional)
    headerStyle: {},         // Estilos específicos del header (opcional)
    cellStyle: {}            // Estilos específicos de la celda (opcional)
  }
];
```

#### Ejemplos de Uso

**Tabla Básica:**
```jsx
import { Table } from '@/components/ui';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'rol', label: 'Rol' }
];

const users = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Admin' },
  { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Usuario' }
];

<Table
  title="Lista de Usuarios"
  columns={columns}
  data={users}
/>
```

**Tabla con Renderizado Personalizado:**
```jsx
const columns = [
  { key: 'nombre', label: 'Nombre' },
  { 
    key: 'estado', 
    label: 'Estado',
    render: (row) => (
      <span className={`badge ${row.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
        {row.estado}
      </span>
    )
  },
  {
    key: 'acciones',
    label: 'Acciones',
    render: (row) => (
      <div>
        <Button size="sm" onClick={() => handleEdit(row.id)}>Editar</Button>
        <Button variant="outline" size="sm" onClick={() => handleDelete(row.id)}>
          Eliminar
        </Button>
      </div>
    )
  }
];
```

**Tabla con Datos Complejos:**
```jsx
const columns = [
  { key: 'fecha', label: 'Fecha' },
  {
    key: 'solicitud_de_cambio',
    label: 'Solicitud de cambio',
    render: (row) => (
      <div className="scv-cell-content">
        <span className="scv-label">Nombre:</span> 
        <span className="scv-value">{row.solicitud.nombre}</span><br/>
        <span className="scv-label">Categoría:</span> 
        <span className="scv-value">{row.solicitud.categoria}</span>
      </div>
    )
  }
];
```

---

### Card

Componente de tarjeta basado en Bootstrap con subcomponentes.

#### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `children` | `ReactNode` | - | ✅ | Contenido de la tarjeta |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |

#### Subcomponentes

- `Card.Header` - Header de la tarjeta
- `Card.Body` - Cuerpo principal de la tarjeta  
- `Card.Footer` - Footer de la tarjeta

#### Ejemplos de Uso

**Card Básica:**
```jsx
import { Card } from '@/components/ui';

<Card>
  <Card.Body>
    <h5>Título de la tarjeta</h5>
    <p>Contenido de la tarjeta</p>
  </Card.Body>
</Card>
```

**Card Completa:**
```jsx
<Card className="shadow-lg">
  <Card.Header>
    <h4>Dashboard</h4>
  </Card.Header>
  <Card.Body>
    <p>Información del dashboard</p>
  </Card.Body>
  <Card.Footer>
    <small className="text-muted">Última actualización: {new Date().toLocaleDateString()}</small>
  </Card.Footer>
</Card>
```

---

### Alert

Componente de alerta personalizable basado en Bootstrap.

#### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `children` | `ReactNode` | - | ✅ | Contenido de la alerta |
| `variant` | `string` | `'info'` | ❌ | Tipo de alerta: `'success'`, `'danger'`, `'warning'`, `'info'` |
| `dismissible` | `boolean` | `false` | ❌ | Permite cerrar la alerta |
| `onClose` | `function` | - | ❌ | Función llamada al cerrar |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |
| `show` | `boolean` | `true` | ❌ | Controla la visibilidad |

#### Ejemplos de Uso

**Alert de Éxito:**
```jsx
import { Alert } from '@/components/ui';

<Alert variant="success">
  ¡Usuario creado exitosamente!
</Alert>
```

**Alert Dismissible:**
```jsx
const [showAlert, setShowAlert] = useState(true);

<Alert 
  variant="warning"
  dismissible
  show={showAlert}
  onClose={() => setShowAlert(false)}
>
  Atención: Esta acción no se puede deshacer.
</Alert>
```

---

### Select

Componente de selección personalizado con validaciones.

#### Props

| Prop | Tipo | Default | Requerido | Descripción |
|------|------|---------|-----------|-------------|
| `options` | `Array` | `[]` | ✅ | Opciones del select |
| `placeholder` | `string` | `'Selecciona una opción'` | ❌ | Texto placeholder |
| `label` | `string` | - | ❌ | Etiqueta del campo |
| `error` | `string` | - | ❌ | Mensaje de error |
| `className` | `string` | `''` | ❌ | Clases CSS adicionales |
| `required` | `boolean` | `false` | ❌ | Campo requerido |

#### Estructura de Opciones

```javascript
const options = [
  { value: 'valor1', label: 'Etiqueta 1' },
  { value: 'valor2', label: 'Etiqueta 2' }
];
```

#### Ejemplos de Uso

**Select Básico:**
```jsx
import { Select } from '@/components/ui';

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuario' },
  { value: 'auditor', label: 'Auditor' }
];

<Select
  label="Rol del Usuario"
  options={roles}
  value={formData.rol}
  onChange={handleChange}
  placeholder="Selecciona un rol"
  required
/>
```

**Select con Error:**
```jsx
<Select
  label="Categoría"
  options={categorias}
  value={formData.categoria}
  onChange={handleChange}
  error={errors.categoria}
  required
/>
```

---

## Componentes de Formulario

### LoginForm

Componente completo de formulario de inicio de sesión con validaciones.

#### Props

Este componente no recibe props, maneja su propio estado interno.

#### Características

- ✅ Validación de email y contraseña
- ✅ Estados de carga
- ✅ Manejo de errores
- ✅ Diseño responsive
- ✅ Integración con componentes UI

#### Ejemplo de Uso

```jsx
import { LoginForm } from '@/components';

// En tu página de login
export default function LoginPage() {
  return <LoginForm />;
}
```

#### Estados Internos

```javascript
// Estados manejados internamente
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
```

#### Validaciones

- **Email**: Requerido y formato válido
- **Contraseña**: Requerida y mínimo 6 caracteres

---

### RegisterForm

Componente completo de formulario de registro de usuarios.

#### Props

Similar al LoginForm, maneja su estado interno sin props externos.

#### Características

- ✅ Validaciones completas
- ✅ Estados de carga
- ✅ Manejo de errores
- ✅ Diseño responsive

---

## Mejores Prácticas

### Uso de Componentes

1. **Importación**: Siempre importa desde el índice principal
   ```jsx
   import { Modal, Button, Input } from '@/components/ui';
   ```

2. **Props Requeridas**: Siempre proporciona las props marcadas como requeridas
   
3. **Manejo de Estado**: Usa useState para controlar la visibilidad de modales
   
4. **Validaciones**: Implementa validaciones consistentes en todos los formularios

### Estilos

1. **CSS Personalizado**: Los estilos están en `/src/styles/`
2. **Clases Bootstrap**: Se mantiene compatibilidad con Bootstrap
3. **Variables CSS**: Usa las variables definidas en `variables.css`

### Accesibilidad

1. **Labels**: Siempre proporciona labels para inputs
2. **ARIA**: Los componentes incluyen atributos ARIA apropiados
3. **Keyboard Navigation**: Todos los componentes son navegables por teclado

---

## Estructura de Archivos

```
src/
├── components/
│   ├── ui/
│   │   ├── Modal.jsx
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Table.jsx
│   │   ├── Card.js
│   │   ├── Alert.js
│   │   ├── Select.js
│   │   └── index.js
│   ├── LoginForm.js
│   ├── RegisterForm.js
│   └── index.js
└── styles/
    ├── modal.css
    ├── components.css
    ├── forms.css
    └── variables.css
```

---

## Contribución

Al agregar nuevos componentes:

1. Sigue la estructura de props establecida
2. Documenta todas las props con sus tipos
3. Incluye ejemplos de uso
4. Mantén la consistencia con el diseño existente
5. Agrega estilos en archivos CSS separados
6. Actualiza esta documentación

---

*Documentación actualizada: Noviembre 2025*