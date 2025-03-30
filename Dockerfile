# ==============================
# Etapa 1: Construcción de Angular
# ==============================
FROM node:20 AS build
WORKDIR /app

# Definir versión de la app (opcional)
ENV APP_VERSION=1.0.0

# Copiar archivos de dependencias y realizar instalación
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Construir la aplicación Angular en modo producción
RUN npm run build --configuration=production

# ==============================
# Etapa 2: Servir con http-server
# ==============================
FROM node:20 AS runtime
WORKDIR /app

# Instalar http-server globalmente
RUN npm install -g http-server

# Copiar los archivos de build desde la etapa anterior
COPY --from=build /app/dist/front-alianza/browser /app/dist

# Exponer el puerto en el que se servirá la aplicación
EXPOSE 4200

# Ejecutar Angular con proxy (solo para desarrollo en Docker)
CMD ["http-server", "/app/dist", "-p", "4200"]
