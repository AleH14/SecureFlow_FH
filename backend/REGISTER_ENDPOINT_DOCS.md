# Endpoint de Registro de Usuario

## **POST** `/api/auth/register`

Este endpoint permite registrar un nuevo usuario en el sistema SecureFlow.

---

## **URL Completa**
```
POST http://localhost:5000/api/auth/register
```

---

## **Headers Requeridos**
```json
{
  "Content-Type": "application/json"
}
```

---

## **Body de la Petición (JSON)**

### **Campos Requeridos:**
```json
{
  "nombre": "string",           // Nombre del usuario
  "apellido": "string",         // Apellido del usuario
  "email": "string",            // Email único (formato válido)
  "telefono": "string",         // Número de teléfono
  "departamento": "string",     // Departamento (ver valores válidos)
  "rol": "string",             // Rol del usuario (opcional)
  "contrasena": "string",       // Contraseña (ver validaciones)
  "confirmarContrasena": "string" // Confirmación de contraseña
}
```

### **Ejemplo de Petición:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@empresa.com",
  "telefono": "+503 7000-1234",
  "departamento": "Tecnologia_de_la_Informacion",
  "rol": "usuario",
  "contrasena": "MiPassword123",
  "confirmarContrasena": "MiPassword123"
}
```

---

## **Valores Válidos**

### **Departamentos Permitidos:**
- `Tecnologia_de_la_Informacion`
- `recursos_humanos`
- `seguridad`
- `auditoria`
- `finanzas`
- `operaciones`
- `legal_y_cumplimiento`

### **Roles Permitidos:**
- `administrador`
- `responsable_seguridad`
- `auditor`
- `usuario` (valor por defecto)

---

## **Validaciones de Contraseña**

La contraseña debe cumplir los siguientes requisitos:
- **Mínimo 8 caracteres**
- **Al menos 1 letra mayúscula**
- **Al menos 1 letra minúscula**
- **Al menos 1 número**
- **Caracteres especiales permitidos:** `@$!%*?&`

### **Ejemplos de contraseñas válidas:**
- `Password123`
- `MiClave456`
- `Segura2025!`

---

## **Respuestas del Servidor**

### **✅ Éxito (201 Created)**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "674a1b2c3d4e5f6789012345",
    "codigo": "USR-2025-1234",
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@empresa.com",
    "telefono": "+503 7000-1234",
    "departamento": "Tecnologia_de_la_Informacion",
    "rol": "usuario",
    "fechaCreacion": "2025-11-29T14:30:00.000Z"
  },
  "timestamp": "2025-11-29T14:30:00.123Z"
}
```

### **❌ Errores Comunes**

#### **400 Bad Request - Campos Faltantes**
```json
{
  "success": false,
  "message": "Todos los campos son requeridos",
  "timestamp": "2025-11-29T14:30:00.123Z"
}
```

#### **400 Bad Request - Email Inválido**
```json
{
  "success": false,
  "message": "Formato de email inválido",
  "timestamp": "2025-11-29T14:30:00.123Z"
}
```

#### **400 Bad Request - Contraseña Débil**
```json
{
  "success": false,
  "message": "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
  "timestamp": "2025-11-29T14:30:00.123Z"
}
```

#### **400 Bad Request - Contraseñas No Coinciden**
```json
{
  "success": false,
  "message": "Las contraseñas no coinciden",
  "timestamp": "2025-11-29T14:30:00.123Z"
}
```

#### **409 Conflict - Usuario Ya Existe**
```json
{
  "success": false,
  "message": "Ya existe un usuario con este email",
  "timestamp": "2025-11-29T14:30:00.123Z"
}
```

#### **400 Bad Request - Departamento Inválido**
```json
{
  "success": false,
  "message": "Departamento inválido",
  "timestamp": "2025-11-29T14:30:00.123Z"
}
```

---

## **Ejemplos de Uso**

### **Con curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María",
    "apellido": "García",
    "email": "maria.garcia@empresa.com",
    "telefono": "+503 7000-5678",
    "departamento": "recursos_humanos",
    "rol": "auditor",
    "contrasena": "Segura123",
    "confirmarContrasena": "Segura123"
  }'
```

### **Con JavaScript (fetch):**
```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@empresa.com',
    telefono: '+503 7000-9012',
    departamento: 'seguridad',
    rol: 'responsable_seguridad',
    contrasena: 'MiClave456',
    confirmarContrasena: 'MiClave456'
  })
});

const data = await response.json();
console.log(data);
```

### **Con Postman:**
1. **Método:** POST
2. **URL:** `http://localhost:5000/api/auth/register`
3. **Headers:** 
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body:** Seleccionar "raw" y "JSON", luego pegar el JSON de ejemplo

---

## **Características Adicionales**

### **🔐 Seguridad Implementada:**
- **Hash de contraseña** con bcryptjs (12 salt rounds)
- **Sanitización** de todos los inputs
- **Validación** de email y contraseña
- **Generación automática** de código único de usuario

### **📊 Base de Datos:**
- Se crea automáticamente la base de datos `secureflow_dev`
- El usuario se almacena en la colección `users`
- Se generan automáticamente: `_id`, `codigo`, `fechaCreacion`

### **🔧 Funcionalidades:**
- **Código único:** Formato `USR-YYYY-XXXX` (ej: `USR-2025-1234`)
- **Email único:** No se permiten emails duplicados
- **Campos opcionales:** `rol` (default: "usuario")
- **Timestamp:** Fecha y hora de creación automática

---

## **Notas Importantes**

1. **MongoDB debe estar ejecutándose** en `localhost:27017`
2. **El servidor backend** debe estar en `localhost:5000`
3. **La contraseña** nunca se devuelve en las respuestas
4. **El código de usuario** se genera automáticamente y es único
5. **Todos los campos** son sanitizados para prevenir XSS