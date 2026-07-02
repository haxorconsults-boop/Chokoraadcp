# Chokoraa Movement – Ol Kalou By-Election 2026

The official campaign landing page for Sammy Douglas Kamau Waweru (DCP) for the Ol Kalou By-Election in 2026.

## Overview
This is a high-performance, mobile-first Next.js static site designed to:
- Be incredibly fast and lightweight.
- Collect campaign contributions (KSh 10) via Paystack.
- Showcase live impact statistics and polling data.
- Promote the DCP candidate and the "Chokoraa Movement" grassroots campaign.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS (`globals.css`)
- **Hosting:** GitHub Pages (Static Export)
- **Payments:** Paystack Inline JS

## Development

First, install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment to GitHub Pages

The site is configured for static export. 

1. Run the build command:
   ```bash
   npm run build
   ```
2. The custom `fix-static.js` script automatically runs to clean up the `out/` directory for GitHub Pages compatibility (renaming `_next` to `assets`).
3. Commit and push your changes to the `main` branch.
4. The GitHub Action will automatically deploy to `www.chokaraa.top`.
