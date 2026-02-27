# CLAUDE.md

This file provides guidance to Claude Code when working with the **fastify-tools** monorepo.

## Project Overview

A full-stack pnpm monorepo application with a Fastify backend API, Next.js frontend, and utility scripts. Key features include Jira issue management, AI chat (Dify integration), file uploads, email service, and JWT+RBAC user authentication.

## Repository Structure

```
fastify-tools/
├── packages/
│   └── shadcn-next/          # Next.js 15 frontend (port 3200 / Docker 4001)
├── services/
│   ├── fastify/              # Fastify 5 backend API (port 3100 / Docker 4000)
│   └── tools/                # Node.js utility scripts
├── db_init_scripts/          # PostgreSQL initialization SQL
├── docs/
│   └── database/
│       └── migrations.md     # Database migration guide
├── dify.json                 # Dify API workflow definitions
├── docker-compose.yml        # Full-stack Docker orchestration
├── .env / .env.example       # Root environment variables
└── pnpm-workspace.yaml       # pnpm workspace configuration
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15.3, React 19, Tailwind CSS 4, shadcn/ui, Zustand |
| Backend | Fastify 5.2, TypeBox, @fastify/swagger + Scalar |
| ORM | Prisma 6.6 (two separate schemas) |
| Database | PostgreSQL 17 |
| Auth | JWT (jsonwebtoken), Bearer Token, RBAC (Role-Permission-Menu) |
| Tools | Excel processing, OpenAI, Firecrawl, Chrome extension |
| Deploy | Docker Compose, PM2 |
| Package Manager | pnpm 10.11.0 |

## Common Development Commands

### Root (Monorepo)

```bash
# Start all services concurrently
pnpm dev:concurrently

# Start all services with pnpm recursive
pnpm dev:all

# Update all dependencies
pnpm update:deps

# Prisma (all workspaces)
pnpm prisma:generate:all      # Generate all Prisma clients
pnpm prisma:deploy:all        # Deploy all migrations
pnpm prisma:seed:all          # Run all seed scripts
pnpm prisma:reset:all         # Reset all databases (destructive)
```

### Backend (services/fastify)

```bash
cd services/fastify

pnpm dev                      # Start development server (port 3100)
pnpm build                    # Compile TypeScript to api/
pnpm start                    # Start production server
pnpm test                     # Run tests (tap)
pnpm lint                     # Run ESLint

# Prisma
pnpm prisma:generate          # Generate Prisma client
pnpm prisma:migrate:dev       # Create and apply migration
pnpm prisma:migrate:deploy    # Apply pending migrations (production)
pnpm prisma:seed              # Seed database
```

### Frontend (packages/shadcn-next)

```bash
cd packages/shadcn-next

pnpm dev                      # Start Next.js dev server (port 3200)
pnpm build                    # Build for production
pnpm start                    # Start production server
pnpm lint                     # Run ESLint

# Prisma
pnpm prisma:generate          # Generate Prisma client
pnpm prisma:migrate:dev       # Create and apply migration
pnpm prisma:seed              # Seed database
```

### Docker

```bash
# Start all services (postgres + fastify + shadcn-next)
docker compose up -d

# Rebuild and start
docker compose up -d --build

# View logs
docker compose logs -f fastify
docker compose logs -f shadcn-next
```

## Architecture

### Backend (services/fastify)

- **Framework**: Fastify 5 with fastify-cli auto-loading
- **Entry**: `src/index.ts` → `src/app.ts` (AutoLoad plugins and routes)
- **Plugin Loading Order** (numeric prefix enforced):
  1. `0-env.ts` — environment variable validation (@fastify/env + TypeBox)
  2. `1-swgger.ts` — Swagger + Scalar API docs
  3. `2-prisma.ts` — Prisma ORM connection
  4. `3-services.ts` — business service registration
  5. `error-handler.ts`, `sensible.ts`, `support.ts`
- **Route Structure**: `src/routes/` mirrors URL paths (Fastify autoload)
- **Schema**: TypeBox schemas in `src/schema/` (type-safe request/response)
- **Services Layer**: `src/services/` for business logic
- **Database**: `fastify_db` schema (EmailTemplate, EmailLog, MagicLink, Subscription)

### Frontend (packages/shadcn-next)

- **Framework**: Next.js 15 App Router
- **Route Groups**:
  - `(auth)/` — login, admin, email verification, error pages
  - `(main)/` — authenticated app (dashboard, jira, aigc, file, settings)
- **State**: Zustand stores in `store/`
- **Data Fetching**: SWR for client-side, Server Actions in `app/actions/`
- **Auth**: JWT middleware in `middleware.ts` with RBAC permission checks
- **Database**: `shadcn_next` schema (User, Role, Permission, Menu, LoginLog, etc.)

### Two-Database Architecture

| Database | Schema | Owner | Models |
|----------|--------|-------|--------|
| `fastify_db` | `services/fastify/prisma/schema.prisma` | Fastify service | EmailTemplate, EmailLog, MagicLink, Subscription |
| `shadcn_next` | `packages/shadcn-next/prisma/schema.prisma` | Next.js frontend | User, Role, Permission, Menu, RoleMenu, LoginLog, etc. |

Both are PostgreSQL 17 databases running in the same Docker container.

## Environment Variables

Copy `.env.example` to `.env` at the project root. Key variables:

```bash
# Database
FASTIFY_DATABASE_URL=postgresql://user:pass@localhost:5433/fastify_db
NEXT_DATABASE_URL=postgresql://user:pass@localhost:5433/shadcn_next

# Auth
JWT_SECRET=                   # JWT signing secret
BEARER_TOKEN=                 # API bearer token for Fastify
INITIAL_USER_PASSWORD=        # Default user password on seed
INITIAL_SUPER_PASSWORD=       # Default superadmin password on seed

# Jira Integration
JIRA_BASE_URL=                # e.g. https://yourorg.atlassian.net
JIRA_USERNAME=
JIRA_PASSWORD=
JIRA_DEFAULT_PROJECT=
JIRA_DEFAULT_ISSUE_TYPE=
JIRA_DEFAULT_COMPONENT=
JIRA_DEFAULT_PRIORITY=

# Email (SMTP)
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false

# AI
DASHSCOPE_API_KEY=            # Alibaba Cloud DashScope (Qwen models)
NEXT_PUBLIC_FAST_API_KEY=     # Frontend Fastify API key

# Docker export ports
EXPORT_PG_PORT=5433
EXPORT_FASTIFY_PORT=4000
EXPORT_NEXT_PORT=4001
```

Each workspace also has its own `.env` / `.env.template` for service-specific variables.

## Key Files

| Path | Purpose |
|------|---------|
| `services/fastify/src/app.ts` | Fastify app setup (AutoLoad config) |
| `services/fastify/src/plugins/0-env.ts` | Environment validation schema |
| `services/fastify/src/routes/jira/` | Jira REST API integration |
| `services/fastify/src/routes/dify/` | Dify AI platform webhook routes |
| `services/fastify/src/utils/crypto.ts` | AES encryption/decryption helpers |
| `services/fastify/src/utils/cache.ts` | LRU cache utility |
| `packages/shadcn-next/middleware.ts` | Auth + RBAC middleware |
| `packages/shadcn-next/app/(main)/jira/` | Jira frontend pages |
| `packages/shadcn-next/app/(main)/aigc/` | AI chat/model/task pages |
| `packages/shadcn-next/prisma/schema.prisma` | User/auth data models |
| `dify.json` | Dify workflow API definitions |
| `docker-compose.yml` | Full-stack container orchestration |
| `docs/database/migrations.md` | Database migration guide |

## Code Conventions

### Backend (Fastify)

- **TypeScript**: strict mode, NodeNext module resolution, path alias `@/*` → `src/*`
- **Schemas**: All routes must define TypeBox request/response schemas
- **Plugin pattern**: Export `fp` (fastify-plugin) wrapped functions with `name` metadata
- **Route files**: Use `FastifyPluginAsyncTypebox` for type-safe route handlers
- **Error handling**: Use `server.httpErrors.*` from `@fastify/sensible`; global handler in `error-handler.ts`
- **Compile output**: TypeScript compiles to `api/` directory

### Frontend (Next.js)

- **TypeScript**: strict mode, bundler module resolution, path alias `@/*` → `./`
- **Styling**: Tailwind CSS 4 with shadcn/ui component library
- **Forms**: react-hook-form + Zod validation
- **State**: Zustand for global state, SWR for server state
- **Server Actions**: In `app/actions/` for database mutations
- **Components**: shadcn/ui components in `components/ui/`, custom in `components/custom/`

### Monorepo

- Use `pnpm -F <package-name> <command>` to run commands in specific workspaces
- `pnpm -r run <script>` runs a script recursively across all workspaces
- ESM (`"type": "module"`) at root level; `services/tools` uses CommonJS

## Testing

The Fastify backend uses `tap` for testing:

```bash
cd services/fastify
pnpm test                     # Run all tests
```

Test files are in `services/fastify/test/` mirroring the `src/` structure.

## API Documentation

When the Fastify service is running, Scalar API docs are available at:
- `http://localhost:3100/docs` (development)
- `http://localhost:4000/docs` (Docker)
