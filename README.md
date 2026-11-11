# Full-Stack Todo App

A production-grade, secure, and containerized task management platform built with modern TypeScript ecosystems across both frontend and backend. Designed with an emphasis on defense-in-depth security, optimistic UI patterns, strict runtime validation, and scalable container orchestration.

---

## 1. Project Overview

This application delivers a high-performance, resilient task tracking solution engineered using enterprise architectural patterns. It features an isolated **Express.js** REST API backed by **PostgreSQL** via **Sequelize**, paired with a **Next.js (App Router)** client leveraging **TanStack Query v5**. The entire stack is fully containerized with **Docker** and orchestrated via **Docker Compose**, enabling single-command provisioning from local development to production readiness.

---

## 2. Architectural Highlights & Features

### Defense-in-Depth Security
- **Cookie-Based Authentication**: Authentication tokens (JWT) are stored and transmitted exclusively within `httpOnly`, `SameSite=Strict`, and `Secure` (production) cookies. Tokens are never exposed to browser runtime contexts, completely mitigating Cross-Site Scripting (XSS) token exfiltration.
- **Strict Insecure Direct Object Reference (IDOR) Mitigation**: Every task mutation (read, update, delete) strictly enforces compound database queries scoped to the authenticated user ID (`where: { id, userId: req.user.id }`).
- **Cryptographic Standards**: Salted password hashing via `bcrypt` with work factor 12.
- **Session Expiration Interception**: Centralized HTTP client interceptor detects `401 Unauthorized` responses on authenticated endpoints, instantly purging client-side caches and routing to authentication entrypoints without triggering full-page reload loops on invalid credentials.

### UX & Advanced State Management
- **Optimistic UI Updates with Automatic Rollback**: Task status transitions mutate the TanStack Query cache instantly for zero-latency user feedback. If the network request fails, the cache automatically rolls back to the snapshot captured prior to mutation, displaying context-aware toast alerts.
- **Race Condition Prevention**: Mutation flight states (`isPending`) map directly to trigger controls, disabling buttons and preventing duplicate payloads or network spamming.

### URL-Driven Application State
- **Context-Preserving Routing**: Task filters (`all`, `todo`, `in progress`, `done`) synchronize bi-directionally with URL search parameters (`?status=...`) using Next.js navigation hooks (`useSearchParams`, `useRouter`). This preserves filtering state across browser refreshes, back/forward history navigation, and shareable links without relying on volatile local component state.

### End-to-End Data Integrity
- **Unified Validation Schemas**: Mirror-matched schemas powered by **Zod** execute on both client (React Hook Form resolver) and server (Express middleware).
- **String Sanitization & Length Bounds**: All string inputs enforce mandatory `.trim()` transformation prior to `.min()` and `.max(255)` length checks, eliminating whitespace-only payloads and preventing database-level truncation panics (`character varying(255)` errors).

### Infrastructure & Containerization
- **Multi-Stage Docker Builds**: Both client and server utilize multi-stage build workflows on lightweight Alpine Linux (`node:20-alpine`, `postgres:16-alpine`), pruning devDependencies and build-time tooling to yield minimal footprint, secure production images.
- **Health-Checked Orchestration**: Docker Compose uses native PostgreSQL healthchecks (`pg_isready`) combined with condition-aware startup sequences to eliminate initialization race conditions on cold boots.

---

## 3. Tech Stack

| Layer | Technology | Key Libraries / Frameworks |
|---|---|---|
| **Frontend** | Next.js (App Router, React 19) | TanStack Query v5, React Hook Form, Zod, Tailwind CSS v4, Axios, Lucide React |
| **Backend** | Node.js (v20 LTS), Express.js | Sequelize ORM, PostgreSQL Driver (`pg`), JWT, Bcrypt, Cookie-Parser, Zod |
| **Database** | PostgreSQL 16 | Relational persistence, UUID primary keys, foreign key constraints with cascade rules |
| **DevOps** | Docker & Docker Compose | Multi-stage image builds, named volume persistence, health checks, bridge networking |
| **Language** | TypeScript | Strict type checking (`noImplicitAny`, `strictNullChecks`), end-to-end typed contracts |

---

## 4. Environment Variables

### Backend Configuration (`server/.env`)
```bash
PORT=5000
CLIENT_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_db
DB_USER=postgres
DB_PASSWORD=password

JWT_SECRET=super_secret_jwt_key_for_production_and_dev
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend Configuration (`client/.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 5. Getting Started (Docker — Recommended)

The simplest and most reliable way to run the entire application stack is with Docker Compose. This automatically spins up PostgreSQL, applies database migrations/synchronizations, and builds both the backend and frontend.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Docker Engine 20.10+ and Compose V2)

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fullstack-todo-app
   ```

2. **Boot the complete stack:**
   ```bash
   docker compose up --build -d
   ```

3. **Verify running containers:**
   ```bash
   docker compose ps
   ```

4. **Access the application:**
   - **Client Application**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
   - **PostgreSQL Database**: `localhost:5432`

5. **Tear down:**
   ```bash
   # Stop services
   docker compose down

   # Stop services and remove persistent database volume
   docker compose down -v
   ```

---

## 6. Getting Started (Local Development)

If you prefer to run services bare-metal without Docker:

### Prerequisites
- **Node.js**: v20+ LTS
- **npm**: v10+
- **PostgreSQL**: v14+ running locally on port `5432`

---

### Step 1: Database Setup
Ensure PostgreSQL is active and create the database:
```sql
CREATE DATABASE todo_db;
```

---

### Step 2: Backend Setup (`/server`)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env to verify your local PostgreSQL credentials
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   *The server runs on [http://localhost:5000](http://localhost:5000) and automatically syncs database models.*

---

### Step 3: Frontend Setup (`/client`)

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify environment configuration:
   Create or verify `client/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```
   *The Next.js client runs on [http://localhost:3000](http://localhost:3000).*

---

## 7. API Reference Overview

| HTTP Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create user, hash password, issue `httpOnly` cookie |
| `POST` | `/api/auth/login` | Public | Authenticate credentials, issue `httpOnly` cookie |
| `POST` | `/api/auth/logout` | Public | Clear authentication cookie |
| `GET` | `/api/auth/me` | Bearer/Cookie | Return authenticated user identity |
| `GET` | `/api/tasks` | Authenticated | Retrieve all tasks owned by user (supports `?status=...`) |
| `GET` | `/api/tasks/:id` | Authenticated | Retrieve specific task (IDOR guarded) |
| `POST` | `/api/tasks` | Authenticated | Create a new task (Zod validated) |
| `PUT` | `/api/tasks/:id` | Authenticated | Update task attributes (Zod validated, 404 on 0 affected) |
| `DELETE` | `/api/tasks/:id` | Authenticated | Delete task (IDOR guarded, 404 on 0 affected) |

