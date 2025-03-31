# 🚀 Frontend Angular 19 - Cliente Alianza

La aplicación Cliente Alianza en Angular 19, se puede ejecutarse en **modo desarrollo** o **modo producción con Docker**.

## 📌 Requisitos Previos

Antes de ejecutar, asegúrate de tener instalados los siguientes programas:

- **Node.js** (v18+ recomendado)
- **Angular CLI** (v19)
- **Docker** y **Docker Compose** (para la opción de producción)

---

## 🛠 Clonar el repositorio
```
git clone https://github.com/wilmercado87/front-alianza.git
cd front-alianza
```

## 🛠 Opción 1: Modo Local (Desarrollo)

### 📌 1️⃣ Instalar dependencias
```sh
npm install
```

Nota: Para el ambiente desarrollo, el item apiUrl del archivo enviroment.ts debe contener 'api/clients'

### 📌 2️⃣ Ejecutar la aplicación en modo desarrollo
```sh
ng serve --configuration=development --proxy-config proxy.conf.json
```
Por defecto, la aplicación se ejecutará en:  
👉 **http://localhost:4200**

📌 **Si necesitas cambiar el puerto**, usa:
```sh
ng serve --configuration=development --proxy-config proxy.conf.json --port=4300
```

---

## 🚀 Opción 2: Modo Producción con Docker

Nota: Para el ambiente docker, el item apiUrl del archivo enviroment.ts debe contener 'http://localhost:8080/api/clients'


### 📌 1 Construir la imagen Docker
```sh
docker build -t front-alianza .
```

### 📌 2 Ejecutar el contenedor
```sh
docker run -p 4200:4200 front-alianza
```
Esto expondrá la aplicación en 👉 **http://127.0.0.1:4200/index.html**

---

## 📄 Dockerfile Usado

Si deseas personalizar el entorno de producción, aquí está el `Dockerfile` utilizado:

```dockerfile
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
```

---

## 🐳 Opción 3: Usando Docker Compose (Opcional)

Si prefieres usar `docker-compose`, puedes crear un archivo `docker-compose.yml` y ejecutar el contenedor más fácilmente.

### 📌 1️⃣ Crear `docker-compose.yml`
```yaml
version: "3"
services:
  frontend:
    image: front-alianza
    build: .
    ports:
      - "4200:4200"
```

### 📌 2️⃣ Construir y levantar la aplicación con un solo comando
```sh
docker-compose up --build
```

---

---

## 🧪 Pruebas Unitarias con Jest
```Ejecutar todas los test
npm test
```
```Ejecutar un test unitario
npx jest ${file}.spec.ts
```
```
Ver reporte de cobertura
- npx http-server coverage/lcov-report
- Acceso: http://localhost:8081
```
---