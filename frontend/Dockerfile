FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (incluye npm ci para instalación limpia)
RUN npm ci --only=production=false && npm cache clean --force

# Copiar el resto del código
COPY . .

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Crear directorios necesarios con permisos correctos
RUN mkdir -p .next && chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer el puerto
EXPOSE 3000

# Comando para desarrollo con Next.js (hot reload)
# Usar webpack en lugar de turbopack para mejor compatibilidad con Docker en Windows
CMD ["npm", "run", "dev", "--", "--webpack", "-H", "0.0.0.0"]
