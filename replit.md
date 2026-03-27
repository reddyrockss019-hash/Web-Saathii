# WebSaathii – AI Guided Website Builder

## Overview

A beginner-friendly platform where non-technical users can create a website step-by-step with AI guidance.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/websaathii)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect with PKCE)
- **AI**: OpenAI via Replit AI Integrations (no API key needed)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
workspace/
├── artifacts/
│   ├── websaathii/         # React+Vite frontend (served at /)
│   └── api-server/         # Express API server (served at /api)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   ├── replit-auth-web/    # Browser auth hook (useAuth)
│   └── integrations-openai-ai-server/ # OpenAI client
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Application Flow

1. **Login Page** (`/`) — "Sign in with Google" via Replit Auth
2. **Dashboard** (`/dashboard`) — Greets user, shows "Create New Website" button
3. **Builder** (`/builder`) — 4-step wizard:
   - Step 1: Business Name, Business Type, Location
   - Step 2: Select Services (hardcoded per business type)
   - Step 3: Language (English, Hindi, Telugu)
   - Step 4: Generate
4. **Preview** (`/preview`) — Split layout: controls on left, HTML preview on right

## Key API Endpoints

- `GET /api/auth/user` — Get current user
- `GET /api/login` — Start OIDC login flow
- `GET /api/logout` — Logout
- `POST /api/generate` — AI website generation (requires auth)

## Environment Variables

Set automatically:
- `DATABASE_URL` — PostgreSQL connection
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — OpenAI proxy URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — OpenAI proxy key
- `REPL_ID`, `REPLIT_DOMAINS` — Replit environment

## Development Commands

```bash
# Start frontend
pnpm --filter @workspace/websaathii run dev

# Start API server
pnpm --filter @workspace/api-server run dev

# Run codegen after API spec changes
pnpm --filter @workspace/api-spec run codegen

# Push DB schema
pnpm --filter @workspace/db run push
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists composite lib packages as project references.

## AI Integration

Uses Replit AI Integrations for OpenAI access — no user API key required. Charges billed to Replit credits.
