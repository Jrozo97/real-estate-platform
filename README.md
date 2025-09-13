# 🏡 Real Estate App

Aplicación **Full-Stack** para gestión y visualización de propiedades inmobiliarias, construida con:

- **Backend:** .NET 8 + MongoDB
- **Frontend:** Next.js 15 + TypeScript + TailwindCSS + Shadcn/UI
- **Base de datos:** MongoDB con seed inicial vía Docker Compose

---

## 📂 Estructura del Monorepo

```
REAL-ESTATE/
├── backend/                 # Proyecto Backend en .NET
│   └── src/
│       ├── RealEstate.Application   # Lógica de aplicación y casos de uso
│       ├── RealEstate.Domain        # Entidades y modelos de dominio
│       ├── RealEstate.Infrastructure # Persistencia (MongoDB)
│       └── RealEstate.WebApi        # API REST con endpoints
│
├── frontend/                # Proyecto Frontend en Next.js
│   └── src/
│       ├── app/             # Rutas de la aplicación
│       ├── components/      # Componentes globales (UI, Providers, etc.)
│       ├── lib/             # Configuración (axios, queryKeys, utils)
│       ├── modules/         # Módulos de negocio (properties, etc.)
│       └── types/           # Definiciones TypeScript compartidas
│
├── mongo/                   # Configuración y seed para MongoDB
│   ├── 01-seed.js           # Script para datos iniciales
│   └── docker-compose.yml   # Servicios de MongoDB
│
```

---

## 🚀 Tecnologías Principales

### Backend
- [.NET 8](https://dotnet.microsoft.com/)
- ASP.NET Core Web API
- [MongoDB](https://www.mongodb.com/) con `MongoDB.Driver`
- Arquitectura por capas (Application, Domain, Infrastructure, WebApi)

### Frontend
- [Next.js 15](https://nextjs.org/)
- [React Query (TanStack Query)](https://tanstack.com/query/latest)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

### DevOps
- [Docker Compose](https://docs.docker.com/compose/) para levantar MongoDB
- Seed de datos iniciales (`mongo/01-seed.js`)

---

## ⚙️ Configuración del Proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/real-estate.git
cd real-estate
```

### 2. Backend (.NET)
```bash
cd backend/src/RealEstate.WebApi
dotnet restore
dotnet run
```
El backend quedará disponible en:
```
http://localhost:5000
```

### 3. Base de datos (MongoDB)
```bash
cd mongo
docker-compose up -d
```
Esto levanta un contenedor con MongoDB y ejecuta el **seed inicial**.

### 4. Frontend (Next.js)
```bash
cd frontend
pnpm install   # o npm install / yarn install
pnpm dev
```
El frontend quedará disponible en:
```
http://localhost:3000
```

---

## 📌 Funcionalidades

- **Listado de propiedades** con paginación
- **Filtros avanzados** por nombre, dirección y rango de precios
- **Detalle de propiedad** con galería de imágenes y trazas históricas
- **UI responsive** optimizada para escritorio y móvil

---

## 🧪 Tests
> En progreso (pruebas unitarias y de integración por definir).

---

## 👨‍💻 Autor

Jimmy Rozo – Frontend Engineer & Fullstack Developer  
📍 Colombia

---

## 📜 Licencia

Este proyecto está bajo la licencia MIT.
