# Full-Stack Portfolio

![CI](https://github.com/lancelotgrafilo/lancelot-grafilo-fullstack/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-informational)

Most portfolios are a static page describing a developer's skills. This one is the skills, running live: a React frontend, an Express REST API, a PostgreSQL database, and a Docker-based deployment pipeline, all built from the ground up, phase by phase, and shipped to production.

**Live site:** [portfolio-lancelotgrafilo.onrender.com](https://portfolio-lancelotgrafilo.onrender.com)
**Author:** Lancelot Grafilo

---

## Why this project exists

I wanted a portfolio that didn't just claim full-stack experience, it had to demonstrate it. Every section of this README maps to something real in the codebase: a tested API, an authenticated admin panel, a CI pipeline that actually gates deploys, and security practices applied the way they'd need to be on a production system, not skipped because "it's just a portfolio."

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Vite |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT in httpOnly cookies, bcrypt, CSRF protection |
| Infrastructure | Docker, Docker Compose, GitHub Actions CI, Render, Neon |
| Testing | Vitest, Supertest, React Testing Library |

## What it does

- **Public site** — project listings with tech-stack filtering and search, individual project detail pages, skills grouped by category, a work/learning timeline, and a contact form
- **Admin dashboard** (authenticated) — full CRUD for projects, skills, and experience, plus a live inbox for incoming contact messages
- **Theming** — dark/light toggle with the preference persisted across visits
- **Responsive and accessible** — mobile navigation, keyboard support, skip-to-content link, ARIA landmarks, visible focus states
- **Tested and automated** — a real test suite for the API and key components, run automatically on every push via CI before anything ships

## Security

Security was treated as a requirement throughout the build, not bolted on at the end:

- Parameterized SQL everywhere — no string-built queries, ever
- Passwords hashed with bcrypt; plaintext never touches storage or logs
- Sessions via JWT in httpOnly, SameSite cookies — inaccessible to client-side JavaScript
- CSRF protection (double-submit cookie pattern) on every state-changing request
- Input sanitization and server-side validation on all public-facing forms, independent of client-side checks
- Rate limiting on authentication and contact endpoints, with a honeypot field against bots
- Security headers via Helmet, a locked-down CORS allowlist, and correct reverse-proxy trust configuration in production
- Dependency auditing and a test-covered codebase, verified in CI before deploy

## Running it locally

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
git clone https://github.com/lancelotgrafilo/lancelot-grafilo-fullstack.git
cd lancelot-grafilo-fullstack
cp .env.example .env   # fill in real values
docker compose up -d
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- API health check: [http://localhost:4000/api/health](http://localhost:4000/api/health)

## Running the tests

```bash
cd server && npm test
cd client && npm test
```

Both suites run automatically on every push via GitHub Actions, see the badge above.

## Project structure

portfolio/
├── client/ React frontend (Vite)
├── server/ Express API
├── docker-compose.yml Local development environment
└── .github/workflows/ci.yml Test and build pipeline


## How it was built

This project was built in ten deliberate phases rather than all at once: planning and design, the Docker and database foundation, a public API, a React design system, wiring the public pages to real data, a secure contact flow, authentication and an admin dashboard, accessibility and polish, automated testing, and finally production deployment. Each phase ended with something that actually ran end to end before the next one began.

## Contact

Questions, feedback, or just want to connect? Reach out through the [contact form](https://portfolio-lancelotgrafilo.onrender.com/contact) on the live site, or find me on [GitHub](https://github.com/lancelotgrafilo).
