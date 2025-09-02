# MiniShop (Vite + React + Tailwind)

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

### Vercel
- Push this folder to GitHub
- Import in Vercel, Framework: Vite
- No special build settings; rewrites handled via `vercel.json`

### Netlify
- New site from Git
- Build command: `npm run build`
- Publish directory: `dist`
- Redirects: `_redirects` already configured for SPA

## Analytics (optional)
- Create a GA4 property and get Measurement ID (looks like `G-XXXXXXXXXX`).
- Create `.env` in project root with:
  - `VITE_GA_ID=G-XXXXXXXXXX`
- Rebuild and deploy.
