# VibeKit Studio

A lightweight no-code page builder. Create landing pages, pick a theme, publish, and share — in minutes.

## Tech Stack

- **Next.js 14** (Pages Router)
- **MongoDB + Mongoose** (database)
- **bcryptjs** (password hashing)
- **jsonwebtoken** (JWT auth)
- **CSS Modules** (styling)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/vibekit-studio
JWT_SECRET=<any-long-random-string>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> Get a free MongoDB cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).  
> Generate a JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL` → set to your Vercel URL (e.g. `https://vibekit.vercel.app`)
4. Deploy

---

## Project Structure

```
vibekit-studio/
├── context/          # React context (ThemeContext for dark/light toggle)
├── components/
│   ├── editor/       # LeftPanel + PreviewPanel (editor UI)
│   ├── DashboardLayout.js
│   └── Toast.js
├── lib/              # db.js, auth.js
├── models/           # Mongoose models (User, Page)
├── pages/
│   ├── api/          # API routes (auth, pages, page/[id], public)
│   ├── app/          # Dashboard + Settings
│   ├── editor/[id]   # Page editor
│   └── p/[slug]      # Public page renderer
├── styles/           # CSS Modules
└── utils/            # api.js (fetch wrapper), slug.js
```

## Features

- **Auth** — signup, login, JWT sessions, protected routes
- **Dashboard** — create, edit, delete pages; skeleton loaders; empty state
- **Editor** — live preview, device toggle (desktop/tablet/mobile), auto-save (3s debounce), manual save
- **6 themes** — Dark, Light, Gradient, Minimal, Neon, Aurora
- **Publish/unpublish** — one-click, saves first
- **Public pages** — SSR, view counter incremented on each visit
- **Dark/light dashboard toggle** — persisted in localStorage
- **Toast notifications** — dismissable, 4 types (success/error/warning/info)
