# Usar la imagen oficial de Node.js
FROM node:18 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package.json y pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar las dependencias con pnpm
RUN pnpm install

# Copiar todo el código fuente al contenedor
COPY . .

# Construir el proyecto para producción (Vite genera los archivos en dist/)
RUN pnpm run build

# Usar una imagen ligera de Nginx para servir la aplicación
FROM nginx:alpine

# Crear configuración personalizada de Nginx
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copiar los archivos generados desde la etapa anterior al contenedor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 8080
EXPOSE 8080

# Comando para ejecutar el servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
