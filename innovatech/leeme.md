# Innovatech Solutions — Plataforma de Microservicios

## Stack
- **Frontend**: React + Vite
- **API Gateway**: Node.js + Express + JWT + Circuit Breaker (opossum)
- **Microservicios**: Node.js + Express + Prisma ORM
- **Base de datos**: PostgreSQL (una por servicio)
- **Infraestructura**: Docker + Docker Compose

---

## Arquitectura

```
React (5173)
    └── API Gateway (3000)   ← JWT + Circuit Breaker
            ├── ms-proyectos (3001) ← Prisma → PostgreSQL (5432)
            ├── ms-recursos  (3002) ← Prisma → PostgreSQL (5433)
            └── ms-analitica (3003) ← Prisma → PostgreSQL (5434)
```

---

## Cómo levantar el proyecto

### Opción 1 — Docker Compose (recomendado)

```bash
docker-compose up --build
```

Accede a:
- Frontend:    http://localhost:5173
- API Gateway: http://localhost:3000

### Opción 2 — Desarrollo local (sin Docker)

Necesitas PostgreSQL instalado localmente. Luego:

```bash
# 1. Levanta solo las bases de datos con Docker
docker-compose up db-proyectos db-recursos db-analitica

# 2. En cada microservicio:
cd services/ms-proyectos
npm install
npx prisma migrate dev --name init
npm run dev

# 3. Repite para ms-recursos, ms-analitica y api-gateway

# 4. Frontend
cd frontend
npm install
npm run dev
```

---

## Variables de entorno

Cada servicio tiene su propio `.env`. Cambia los valores para producción:

| Servicio      | Variable       | Valor por defecto                                      |
|---------------|----------------|--------------------------------------------------------|
| ms-proyectos  | DATABASE_URL   | postgresql://postgres:secret@db-proyectos:5432/...     |
| ms-recursos   | DATABASE_URL   | postgresql://postgres:secret@db-recursos:5433/...      |
| ms-analitica  | DATABASE_URL   | postgresql://postgres:secret@db-analitica:5434/...     |
| api-gateway   | JWT_SECRET     | innovatech_secret_key_2024 ← **cambiar en producción** |
| frontend      | VITE_API_URL   | http://localhost:3000                                  |

---

## Usuarios demo

| Email                     | Contraseña  | Rol         |
|---------------------------|-------------|-------------|
| admin@innovatech.com      | admin123    | ADMIN       |
| gestor@innovatech.com     | gestor123   | GESTOR      |
| colab@innovatech.com      | colab123    | COLABORADOR |

---

## Endpoints disponibles

### API Gateway (http://localhost:3000)
| Método | Ruta              | Descripción                  | Auth |
|--------|-------------------|------------------------------|------|
| POST   | /auth/login       | Obtiene JWT                  | No   |
| GET    | /proyectos/proyectos | Lista proyectos            | JWT  |
| POST   | /proyectos/proyectos | Crea proyecto              | JWT  |
| GET    | /recursos/empleados  | Lista empleados            | JWT  |
| POST   | /recursos/empleados  | Crea empleado              | JWT  |
| GET    | /analitica/kpis      | KPIs en tiempo real        | JWT  |
| GET    | /analitica/kpis/historial | Historial KPIs        | JWT  |

---

## Patrones implementados

- **Database per Service**: cada microservicio tiene su propia PostgreSQL
- **API Gateway**: único punto de entrada con JWT
- **Circuit Breaker**: opossum en el gateway (abre si >50% fallos en 5s)
- **Repository Pattern**: toda la lógica de BD encapsulada en `repository.js`

---
