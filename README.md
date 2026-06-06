# Let's Football

**FIFA World Cup 2026 prediction game** — predict match scores, answer bonus questions, compete in private leagues, and climb the leaderboard.

---

## Features

- **Match predictions** — submit scorelines and bonus answers before kick-off (IST)
- **Scoring** — up to 8 points per match (exact score, correct result, bonus questions)
- **Private leagues** — create leagues, share invite codes, and compare standings with friends
- **Member insights** — view another player’s predictions and points per fixture
- **Admin masterboard** — enter results and official answers for completed matches
- **Responsive UI** — optimized for mobile and desktop

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | [Nuxt 4](https://nuxt.com), Vue 3, TypeScript |
| Styling | Tailwind CSS, Nuxt UI |
| Backend | Nuxt server routes, Supabase (Auth + Postgres) |
| Icons | Nuxt Icon (Heroicons) |

---

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- A **Supabase** project with the app schema and RLS policies configured

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-key

# Optional — used for canonical URLs, sitemap, and share links in production
NUXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects `/` to `/welcome`.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run generate` | Generate static output (if applicable) |

---

## Project structure

```
app/
  components/     # UI components (fixtures, leagues, dialogs)
  composables/    # Shared state and data fetching
  layouts/        # default (public) and auth (logged-in) shells
  pages/          # Routes (dashboard, leagues, rules, admin, …)
  utils/          # API routes, normalization, scoring helpers
server/
  api/            # REST endpoints (fixtures, groups, admin, profile)
public/           # Static assets (FIFA.jpg, world-cup.svg, robots.txt)
```

---

## Main routes

| Route | Description |
| --- | --- |
| `/welcome` | Landing page |
| `/dashboard` | Fixtures and predictions |
| `/rules` | Scoring rules |
| `/leagues` | Your leagues |
| `/leagues/join?code=…` | Join a league via invite link |
| `/masterboard` | Admin results entry (admin only) |

---

## Deployment

Build the app, set the environment variables on your host, then start the Nuxt server:

```bash
npm run build
npm run preview   # local smoke test
```

See the [Nuxt deployment guide](https://nuxt.com/docs/getting-started/deployment) for platform-specific steps (Vercel, Netlify, Node server, etc.).

---

## License

Private project — all rights reserved unless stated otherwise.
