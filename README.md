# S2Q Interview Test

This repository is a take-home interview codebase. It contains a small multi-tenant logistics app built with React, NestJS, PostgreSQL, TypeORM, and Ant Design.

Candidates should extend the existing app by adding the RFP Lane Notes feature and list filtering/pagination behavior described in `docs/CANDIDATE_ASSIGNMENT.md`.

## Stack

- Backend: NestJS, TypeORM, PostgreSQL, JWT auth
- Frontend: Vite, React, TypeScript, Ant Design
- Database: PostgreSQL via Docker Compose

## Setup

```bash
npm install
docker compose up -d
npm run migration:run --workspace backend
npm run seed --workspace backend
```

## Run

```bash
npm run start:dev --workspace backend
npm run dev --workspace frontend
```

Backend: `http://localhost:3000`

Frontend: `http://localhost:5173`

## Seeded Users

All seeded users use the password `Password123!`.

| Tenant | Role | Email |
| --- | --- | --- |
| Acme Logistics | admin | `admin@acme.test` |
| Acme Logistics | user | `user@acme.test` |
| Bluebird Freight | admin | `admin@bluebird.test` |
| Bluebird Freight | user | `user@bluebird.test` |

The seed data includes multiple RFPs and enough varied lanes per RFP to exercise filtering and pagination.

## Useful Commands

```bash
npm run migration:run --workspace backend
npm run seed --workspace backend
npm test --workspace backend
npm run build --workspace backend
npm run build --workspace frontend
```

## Documentation

- `docs/CANDIDATE_ASSIGNMENT.md`: candidate task
