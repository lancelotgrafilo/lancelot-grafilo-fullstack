# Full-Stack Portfolio

![CI](https://github.com/lancelotgrafilo/lancelot-grafilo-fullstack/actions/workflows/ci.yml/badge.svg)

A portfolio that is itself a full-stack application: a React frontend, an Express REST API, a PostgreSQL database, and a Docker-based development and deployment setup, all built from scratch, phase by phase.

**Live site:** coming soon
**Built by:** Lancelot Grafilo

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Vite |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT (httpOnly cookies), bcrypt, CSRF protection |
| Infrastructure | Docker, Docker Compose, GitHub Actions CI |
| Testing | Vitest, Supertest, React Testing Library |

## Features

- Public site with project listings, filtering and search, project detail pages, skills, experience, and a contact form
- Secure contact form with server-side validation, input sanitization, rate limiting, and spam protection
- Admin dashboard (authenticated) for managing projects, skills, experience, and incoming messages
- Dark/light theme toggle with persisted preference
- Fully responsive layout with accessibility support (keyboard navigation, skip links, ARIA landmarks)
- Automated tests covering the API and key frontend components, run on every push via CI

## Security

This project treats security as a first-class requirement, not an afterthought:

- Parameterized SQL queries throughout (no string-built queries)
- Passwords hashed with bcrypt, never stored in plain text
- Authentication via JWT in httpOnly, SameSite cookies, not accessible to client-side JavaScript
- CSRF protection on every state-changing request
- Input sanitization and strict validation on all public-facing forms
- Rate limiting on authentication and contact endpoints
- Security headers via Helmet, locked-down CORS policy
- Dependency auditing and a documented, test-covered codebase

## Running it locally

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
git clone https://github.com/lancelotgrafilo/lancelot-grafilo-fullstack.git
cd lancelot-grafilo-fullstack
cp .env.example .env   # then fill in real values
docker compose up -d
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:4000/api/health](http://localhost:4000/api/health)

## Running the tests

```bash
cd server && npm test
cd client && npm test
```

## Project structure
portfolio/
├── client/ React frontend (Vite)
├── server/ Express API
├── docker-compose.yml
└── .github/workflows/ci.yml

## About this project

This portfolio was built in deliberate, incremental phases, from the Docker foundation and database design through authentication, the admin dashboard, accessibility and polish, automated testing, and production deployment. It was built to demonstrate practical, end-to-end full-stack development, not just a frontend demo.