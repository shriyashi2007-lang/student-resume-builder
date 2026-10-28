# Resumify

Resumify is a polished student resume builder with a React/Vite client and an Express/Node.js API. It guides students through eight content sections, renders five real resume templates, autosaves guest drafts, runs practical ATS-friendly checks, and exports selectable-text PDFs.

## What works

- Eight-step resume editor with validation and removable skill tags
- Live A4 preview with zoom, print, multi-page guides, and responsive Editor/Preview tabs
- Five templates: ATS Classic, Modern Professional, Minimal Elegance, Tech Developer, and Creative Graduate
- Design controls for font, size, accent, section order, and visibility
- Guest draft autosave in `localStorage`
- Completeness score, ATS-friendly checks, and offline writing suggestions
- Express endpoints for validation/insights and PDF generation
- Shared, HTML-escaped renderer used by the preview and Chromium PDF service
- Dark and light themes with reduced-motion support

## Local setup

Requirements: Node.js 20.19 or newer. MongoDB is not required for the current guest workflow.

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. The API runs at `http://127.0.0.1:5000`.

Copy `.env.example` to `.env` when you need to change ports or deployment URLs. Never commit the resulting `.env` file.

## Useful commands

```bash
npm run dev       # web client and API
npm run build     # production client build
npm run lint      # client lint
npm test          # server tests
npm run verify    # lint, build, and tests
```

## API

- `GET /api/health`
- `POST /api/resumes/inspect`
- `POST /api/resumes/pdf`

The PDF route uses Puppeteer/Chromium in Linux production. On Windows development it uses a selectable-text portable PDF fallback by default; set `FORCE_CHROMIUM_PDF=true` to test Chromium locally.

## Deployment

Deploy `client` to Vercel and set `VITE_API_URL` to the Render API URL ending in `/api`. Deploy the root repository to Render with [render.yaml](render.yaml). Configure `CLIENT_URL` with the exact Vercel origin.

The current release supports the complete guest builder flow. Account authentication, MongoDB resume syncing, and the dashboard are the next backend milestone; the navigation keeps those destinations visible for the planned expansion.
