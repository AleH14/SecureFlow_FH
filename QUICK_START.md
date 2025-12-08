# 🚀 Guía de Inicio Rápido - SecureFlow

## Instalación en PC Nueva (Con Docker)

### Prerequisitos
- **Docker Desktop** instalado y corriendo
  - Windows: [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - macOS: [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Linux: [Instalar Docker Engine](https://docs.docker.com/engine/install/)
- **Git** instalado

### Pasos de Instalación (3 comandos)

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/AleH14/SecureFlow_FH.git
cd SecureFlow_FH
```

#### 2. Iniciar la Aplicación
```bash
docker-compose up -d
```

**¡Eso es todo!** Docker se encargará de:
- ✅ Descargar las imágenes base (Node.js, MongoDB)
- ✅ Instalar todas las dependencias (npm packages)
- ✅ Configurar la red entre servicios
- ✅ Crear la base de datos
- ✅ Iniciar todos los servicios

**Tiempo estimado:** 2-5 minutos (depende de tu conexión a internet)

#### 3. Verificar que Todo Funciona
```bash
# Ver el estado de los servicios
docker-compose ps

# Deberías ver:
# secureflow-frontend   Up   0.0.0.0:3000->3000/tcp
# secureflow-backend    Up   0.0.0.0:5000->5000/tcp
# secureflow-mongodb    Up   0.0.0.0:27017->27017/tcp
```

### Acceder a la Aplicación

1. **Frontend:** Abre tu navegador en [http://localhost:3000](http://localhost:3000)
2. **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
3. **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

### Credenciales del Administrador

El sistema crea automáticamente un usuario administrador:

```
📧 Email:      administrador@gmail.com
🔑 Contraseña: nti104
```

⚠️ **Importante:** Cambia esta contraseña después del primer acceso.

---

## Comandos Útiles

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Detener la aplicación
```bash
docker-compose down
```

### Reiniciar servicios
```bash
docker-compose restart
```

### Ver uso de recursos
```bash
docker stats
```

---

## ¿Necesitas Actualizar el Código?

Si haces `git pull` para obtener nuevas versiones:

```bash
# Detener servicios
docker-compose down

# Obtener últimos cambios
git pull

# Reiniciar (Docker reconstruirá solo si hay cambios en Dockerfiles)
docker-compose up -d
```

---

## Instalación sin Docker (Manual)

Si prefieres no usar Docker, consulta la [guía completa en README.md](./README.md#-instalación-y-configuración)

---

## ¿Problemas?

1. **Verifica que Docker esté corriendo:**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Revisa los logs:**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs mongodb
   ```

3. **Limpieza completa (si algo falla):**
   ```bash
   docker-compose down -v
   docker system prune -f
   docker-compose up -d
   ```

4. **Consulta la guía completa de troubleshooting:**
   - [DOCKER_COMMANDS.md](./DOCKER_COMMANDS.md) - Solución de problemas comunes
   - [README.md](./README.md) - Instalación manual detallada

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                  Usuario (Navegador)                 │
│              http://localhost:3000                   │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              Frontend (Next.js/React)                │
│              Container: secureflow-frontend          │
│              Puerto: 3000                            │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP/API Calls
                      ▼
┌─────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)               │
│              Container: secureflow-backend           │
│              Puerto: 5000                            │
└─────────────────────┬───────────────────────────────┘
                      │ MongoDB Connection
                      ▼
┌─────────────────────────────────────────────────────┐
│              MongoDB Database                        │
│              Container: secureflow-mongodb           │
│              Puerto: 27017                           │
│              Volumen: mongodb-data                   │
└─────────────────────────────────────────────────────┘
```

---

## Estructura de Carpetas

```
SecureFlow_FH/
├── backend/              # API REST (Node.js + Express)
│   ├── src/
│   ├── Dockerfile       # ← Configuración del contenedor backend
│   └── package.json
│
├── frontend/            # Interfaz Web (Next.js + React)
│   ├── src/
│   ├── Dockerfile       # ← Configuración del contenedor frontend
│   └── package.json
│
├── docker-compose.yml   # ← Orquestación de servicios
├── QUICK_START.md       # ← Este archivo
├── README.md            # Documentación completa
└── DOCKER_COMMANDS.md   # Comandos Docker avanzados
```

---

## FAQ (Preguntas Frecuentes)

### ¿Por qué Docker?
- **Portabilidad:** Funciona igual en Windows, macOS y Linux
- **Aislamiento:** No contamina tu sistema con dependencias
- **Facilidad:** Un comando para instalar todo
- **Consistencia:** Todos trabajan con el mismo entorno

### ¿Debo usar `docker-compose build`?
**No, normalmente NO es necesario.** Solo en casos especiales:
- Modificaste un Dockerfile
- Actualizaste dependencias en package.json
- Hay problemas con el caché

### ¿Pierdo los datos al hacer `docker-compose down`?
**No**, los datos de MongoDB están en un volumen persistente (`mongodb-data`).

**Solo pierdes datos si ejecutas:**
```bash
docker-compose down -v  # ← El flag -v elimina volúmenes
```

### ¿Cómo hago backup de la base de datos?
```bash
# Backup
docker-compose exec mongodb mongodump --out /data/backup

# Copiar backup a tu PC
docker cp secureflow-mongodb:/data/backup ./backup

# Restaurar
docker cp ./backup secureflow-mongodb:/data/backup
docker-compose exec mongodb mongorestore /data/backup
```

### ¿Puedo desarrollar mientras Docker corre?
**Sí**, los cambios en el código se reflejan automáticamente:
- **Frontend:** Hot reload con Next.js
- **Backend:** Hot reload con nodemon

Solo guarda tus archivos y los cambios se aplicarán instantáneamente.

---

**¿Listo para comenzar?** Ejecuta `docker-compose up -d` y visita [http://localhost:3000](http://localhost:3000) 🚀
