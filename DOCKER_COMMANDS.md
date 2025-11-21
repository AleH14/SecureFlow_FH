# 🐳 Comandos Docker - Guía de Referencia

Esta guía contiene los comandos de Docker más importantes para el desarrollo del proyecto SecureFlow.

## 📦 Docker Compose - Comandos Principales

### Iniciar servicios
```bash
# Iniciar todos los servicios
docker-compose up

# Iniciar en segundo plano (detached)
docker-compose up -d

# Iniciar servicios específicos
docker-compose up frontend backend
```

### Construir y reconstruir
```bash
# Construir imágenes antes de iniciar
docker-compose up --build

# Forzar reconstrucción sin caché
docker-compose build --no-cache

# Reconstruir un servicio específico
docker-compose build frontend
```

### Detener y limpiar
```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO: elimina datos de BD!)
docker-compose down -v

# Detener y eliminar imágenes
docker-compose down --rmi all

# Detener y limpiar todo (volúmenes, redes, imágenes)
docker-compose down -v --rmi all --remove-orphans
```

## 🔍 Monitoreo y Debugging

### Ver logs
```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongodb

# Ver últimas 50 líneas de logs
docker-compose logs --tail=50 frontend
```

### Estado de servicios
```bash
# Ver servicios corriendo
docker-compose ps

# Ver servicios con más detalles
docker-compose ps -a

# Ver uso de recursos
docker stats
```

## 🛠️ Comandos de Desarrollo

### Ejecutar comandos en contenedores
```bash
# Abrir terminal interactiva en backend
docker-compose exec backend sh

# Abrir terminal interactiva en frontend
docker-compose exec frontend sh

# Ejecutar comandos específicos
docker-compose exec backend npm install
docker-compose exec frontend npm test
docker-compose exec backend npm run lint
```

### Testing - Frontend y Backend
```bash
# FRONTEND - Ejecutar tests
docker-compose exec frontend npm test
docker-compose exec frontend npm run test:watch
docker-compose exec frontend npm run test:coverage

# BACKEND - Ejecutar tests
docker-compose exec backend npm test
docker-compose exec backend npm run test:watch

# BACKEND - ESLint (linting)
docker-compose exec backend npm run lint
docker-compose exec backend npm run lint:fix

# Ejecutar todos los tests del proyecto
docker-compose exec frontend npm test && docker-compose exec backend npm test

# Ver cobertura de código (frontend)
docker-compose exec frontend npm run test:coverage
# El reporte se guarda en frontend/coverage/

# Tests en modo interactivo (para debugging)
docker-compose exec -it frontend npm test
docker-compose exec -it backend npm test
```

### Reinstalar dependencias
```bash
# Eliminar node_modules y reinstalar (backend)
docker-compose exec backend rm -rf node_modules
docker-compose exec backend npm install

# Eliminar node_modules y reinstalar (frontend)
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install
```

## 🐳 Docker - Comandos de Contenedores

### Listar contenedores
```bash
# Contenedores activos
docker ps

# Todos los contenedores (activos e inactivos)
docker ps -a

# Contenedores con tamaños
docker ps -s
```

### Gestionar contenedores
```bash
# Detener contenedor específico
docker stop secureflow-frontend

# Iniciar contenedor detenido
docker start secureflow-backend

# Reiniciar contenedor
docker restart secureflow-mongodb

# Eliminar contenedor
docker rm secureflow-frontend
```

### Acceso a contenedores
```bash
# Ejecutar comando en contenedor
docker exec -it secureflow-backend sh
docker exec -it secureflow-frontend npm test

# Copiar archivos desde/hacia contenedor
docker cp archivo.txt secureflow-backend:/app/
docker cp secureflow-backend:/app/logs/ ./logs/
```

## 🖼️ Gestión de Imágenes

### Listar imágenes
```bash
# Ver todas las imágenes
docker images

# Ver imágenes con filtros
docker images --filter "dangling=true"
docker images secureflow*
```

### Limpiar imágenes
```bash
# Eliminar imagen específica
docker rmi secureflow_backend

# Eliminar imágenes sin usar
docker image prune

# Eliminar todas las imágenes sin usar (¡CUIDADO!)
docker image prune -a

# Forzar eliminación
docker rmi -f image_id
```

## 💾 Gestión de Volúmenes

### Listar volúmenes
```bash
# Ver todos los volúmenes
docker volume ls

# Inspeccionar volumen específico
docker volume inspect secureflow_mongodb-data
```

### Limpiar volúmenes
```bash
# Eliminar volúmenes sin usar
docker volume prune

# Eliminar volumen específico (¡CUIDADO: elimina datos!)
docker volume rm secureflow_mongodb-data
```

## 🌐 Gestión de Redes

### Listar redes
```bash
# Ver todas las redes
docker network ls

# Inspeccionar red específica
docker network inspect secureflow_secureflow-network
```

### Gestionar redes
```bash
# Crear red personalizada
docker network create mi-red

# Eliminar redes sin usar
docker network prune
```

## 🧹 Comandos de Limpieza

### Limpieza general
```bash
# Limpiar todo lo no utilizado (contenedores, redes, imágenes, caché)
docker system prune

# Limpieza agresiva (incluye volúmenes)
docker system prune -a --volumes

# Ver espacio utilizado por Docker
docker system df
```

### Limpieza específica
```bash
# Solo contenedores detenidos
docker container prune

# Solo imágenes sin usar
docker image prune

# Solo redes sin usar
docker network prune

# Solo volúmenes sin usar
docker volume prune
```

## 🚀 Comandos Útiles para Desarrollo

### Testing y Calidad de Código
```bash
# Ejecutar suite completa de tests
docker-compose exec frontend npm test -- --coverage --watchAll=false
docker-compose exec backend npm test -- --coverage --verbose

# Tests específicos por archivo
docker-compose exec frontend npm test -- page.test.js
docker-compose exec backend npm test -- app.test.js

# Linting automático
docker-compose exec backend npm run lint:fix
docker-compose exec frontend npm run lint

# Ejecutar tests y linting juntos (CI/CD simulation)
docker-compose exec backend npm run lint && npm test
docker-compose exec frontend npm run lint && npm test

# Tests con reporte detallado
docker-compose exec frontend npm test -- --verbose --coverage
docker-compose exec backend npm test -- --verbose --detectOpenHandles
```

### MongoDB
```bash
# Conectar a MongoDB desde contenedor
docker-compose exec mongodb mongosh

# Backup de base de datos
docker-compose exec mongodb mongodump --out /data/backup

# Restaurar base de datos
docker-compose exec mongodb mongorestore /data/backup
```

### Debugging de red
```bash
# Ver IPs de contenedores
docker network inspect secureflow_secureflow-network

# Ping entre contenedores
docker-compose exec backend ping frontend
docker-compose exec frontend ping mongodb
```

### Performance
```bash
# Ver uso de recursos en tiempo real
docker stats

# Ver logs de sistema Docker
docker system events

# Información detallada del sistema Docker
docker system info
```

## ⚠️ Comandos Peligrosos (Usar con Precaución)

```bash
# ¡ELIMINA TODOS LOS CONTENEDORES!
docker rm -f $(docker ps -aq)

# ¡ELIMINA TODAS LAS IMÁGENES!
docker rmi -f $(docker images -q)

# ¡LIMPIEZA TOTAL DEL SISTEMA!
docker system prune -a --volumes -f
```

## 📋 Tips Útiles

1. **Siempre usa `docker-compose` para este proyecto** - Es más fácil que comandos docker individuales
2. **Logs son tu amigo** - `docker-compose logs -f` te ayudará a debuggear
3. **Reconstruye cuando cambies Dockerfile** - `docker-compose up --build`
4. **Usa `-d` para desarrollo** - Los servicios corren en segundo plano
5. **Copia de seguridad antes de `down -v`** - Los volúmenes contienen tu base de datos
6. **Ejecuta tests regularmente** - `npm test` en ambos servicios antes de hacer commits
7. **Usa `--coverage` para ver qué código falta testear** - Especialmente útil en frontend
8. **El flag `--watchAll=false`** evita que Jest se quede esperando en CI/CD
9. **ESLint arregla automáticamente** - Usa `npm run lint:fix` antes de commitear

## 🔗 Puertos del Proyecto

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000  
- **MongoDB**: localhost:27017

## 🧪 Scripts de Testing Disponibles

### Frontend (Next.js + Jest)
```json
"test": "jest"                    // Ejecutar todos los tests
"test:watch": "jest --watch"      // Tests en modo watch
"test:coverage": "jest --coverage" // Con reporte de cobertura
```

### Backend (Node.js + Jest + ESLint)
```json
"test": "jest"                    // Ejecutar todos los tests
"test:watch": "jest --watch"      // Tests en modo watch
"lint": "eslint src/**/*.js"      // Revisar código con ESLint
"lint:fix": "eslint src/**/*.js --fix" // Arreglar automáticamente
```

## 🏃‍♂️ Flujo de Desarrollo Recomendado

```bash
# 1. Levantar servicios
docker-compose up -d

# 2. Hacer cambios en el código
# (Los cambios se reflejan automáticamente con hot reload)

# 3. Ejecutar tests antes de commit
docker-compose exec frontend npm test
docker-compose exec backend npm run lint && npm test

# 4. Ver cobertura de tests (opcional)
docker-compose exec frontend npm run test:coverage

# 5. Commit y push
git add . && git commit -m "feat: nueva funcionalidad"
```

---
*Guía creada para el proyecto SecureFlow - Mantén este archivo actualizado con nuevos comandos útiles*