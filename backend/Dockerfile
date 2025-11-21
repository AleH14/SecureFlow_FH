FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 5000

# Comando para desarrollo con nodemon (hot reload)
# -L flag para usar legacy watch mode (mejor para Docker en Windows)
CMD ["npx", "nodemon", "-L", "src/app.js"]
