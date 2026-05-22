# Portfolio Kyllian Le Guen — PRD

## Problem Statement
Portfolio professionnel d'étudiant en ingénierie 3D fusionnant le style graphique Wix (dark + orange, Syne/Inter, custom cursor, marquee) avec un contenu dynamique HTML + les données réelles extraites du CV PDF. Édition simple via fichier JSON + sélecteur de police + couleur d'accent dans l'admin.

## User Persona
- **Owner / Admin**: Kyllian Le Guen (étudiant BUT GMP, alternance Chantiers de l'Atlantique)
- **Visitors**: recruteurs, entreprises industrielles, écoles d'ingénieur

## Architecture
- **Backend**: FastAPI + MongoDB (Motor). Single `db.config` collection (key="content" / key="settings"), `db.messages` for inbox.
- **Auth**: simple password (`ADMIN_PASSWORD` env, default `kyllian2026`) → in-memory token in `ACTIVE_TOKENS` set, sent via `Authorization: Bearer`.
- **Frontend**: React 19 + React Router 7 + Tailwind + Shadcn primitives. `PortfolioContext` loads content+settings, injects Google Fonts dynamically, applies CSS variables for font/accent.

## Core Features (Implemented)
- 7 public pages: Accueil, Projets (6 projets, filtres catégorie), Parcours (timeline 6 formations), Expériences (4, filtres type), Compétences (logiciels, programmation, scientifiques, soft skills, langues), Passions (sports + voyages), Contact (form DB + mailto).
- Visual: hero "Kyllian / Le Guen" (italic orange), custom cursor + ring, marquee infini, eyebrows tirets, fond grid + noise + halo orange, animation reveal-on-scroll, sticky nav avec blur.
- Admin `/admin/login` (pwd kyllian2026) + `/admin` avec 3 onglets:
  - **Contenu**: éditeur JSON brut + Import/Export/Reset
  - **Apparence**: sélecteur police titres + texte (12 Google Fonts) + color picker accent + 8 presets + aperçu live
  - **Messages**: inbox (marquer lu / supprimer)
- CV PDF utilisé : URL réelle uploadée par l'utilisateur (`site.cvUrl`).
- Données : extraites du PDF (Chantiers de l'Atlantique, Halle 6, BUT GMP, etc.) fusionnées avec la version HTML (6 projets, marquee, structure).

## API Endpoints
- `GET/PUT /api/portfolio/content` · `POST /api/portfolio/content/reset`
- `GET/PUT /api/portfolio/settings`
- `POST /api/portfolio/login` · `POST /api/portfolio/logout` · `GET /api/portfolio/verify`
- `POST /api/contact`
- `GET /api/admin/messages` · `DELETE /api/admin/messages/{id}` · `PATCH /api/admin/messages/{id}/read`

## Testing
- Backend: 17/17 pytest passing (`/app/backend/tests/test_portfolio_api.py`)
- Frontend: e2e Playwright OK (hero, filtres, contact submit, admin login + 3 onglets)

## Backlog / Next
- **P1**: Page de détail projet (route `/projets/:id`) avec galerie d'images
- **P1**: SEO meta tags par page (Open Graph, Twitter cards) pour partage LinkedIn
- **P2**: Mode clair / thème alternatif
- **P2**: Persister les tokens admin (JWT) si déploiement multi-instance
- **P2**: Ajouter analytics simple (Plausible / Umami) pour stats visites
