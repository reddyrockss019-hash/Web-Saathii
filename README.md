# WebSaathii — AI Guided Website Builder

Build a complete business website in minutes. No coding skills needed.  
Supports **English**, **Hindi**, and **Telugu**.

---

## Project Structure

```
websaathii/
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/     # landing.tsx, builder.tsx, preview.tsx
│   │   ├── hooks/     # use-generate.ts
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Express + OpenAI
│   ├── src/
│   │   ├── routes/    # generate.ts, health.ts
│   │   ├── app.ts
│   │   └── index.ts
│   └── package.json
└── vercel.json        # Deployment config
```

---

## Local Development

### 1. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. Configure backend env

```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

> **No OpenAI key?** The app still works — it uses a built-in fallback HTML generator. Great for demos.

### 3. Run backend

```bash
cd backend
npm run dev
# Running on http://localhost:3001
```

### 4. Run frontend

```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

The Vite dev server proxies `/api/*` to `localhost:3001` automatically.

---

## Deployment on Vercel

### Option A — Deploy both frontend + backend together

1. Push this folder to a GitHub repo
2. Import the repo in Vercel
3. Set **Root Directory** to `.` (the root)
4. Add environment variable: `OPENAI_API_KEY=sk-...`
5. Deploy ✅

The `vercel.json` handles routing:
- `/api/*` → backend serverless function
- `/*` → frontend static build

### Option B — Deploy separately (recommended for production)

**Backend on Railway / Render:**
1. Connect your repo, set root to `backend/`
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Add env: `OPENAI_API_KEY=sk-...` and `PORT=3001`
5. Note the deployed URL (e.g. `https://websaathii-api.railway.app`)

**Frontend on Vercel:**
1. Set root to `frontend/`
2. Build command: `npm run build`
3. Add env: `VITE_API_URL=https://websaathii-api.railway.app`
4. Deploy ✅

---

## User Flow

1. **Landing page** → Click "Build My Website"
2. **Step 1** → Enter business name, type, location
3. **Step 2** → Select services from hardcoded suggestions (no AI used here)
4. **Step 3** → Choose language (English / Hindi / Telugu)
5. **Step 4** → Review & Generate
6. **Preview** → View, edit HTML, regenerate, download

---

## Key Fixes Applied

| Problem | Fix |
|---|---|
| `vite.config.ts` crashed without `PORT`/`BASE_PATH` | Made them optional with sensible defaults |
| `@workspace/replit-auth-web` — Replit-only package | Removed entirely, no auth required |
| `openid-client` dependency | Removed — entire auth system stripped |
| `req.isAuthenticated()` blocked the generate endpoint | Removed — endpoint is now open |
| Wrong OpenAI model `gpt-5-mini` | Fixed to `gpt-4o-mini` |
| `@workspace/*` monorepo deps on Vercel | All replaced with standard npm packages |
| DB dependency in backend (sessions) | Removed — stateless backend |
| No fallback when OpenAI key missing | Added — app works even without a key |