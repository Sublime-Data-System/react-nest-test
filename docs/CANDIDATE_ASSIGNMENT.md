# Candidate Assignment: RFP Lane Notes

## Context

This repository contains a small multi-tenant logistics application inspired by S2Q workflows. Users belong to tenant companies, and each tenant has RFPs with lanes.

Your task is to complete two related pieces of work:

1. Add **RFP Lane Notes** to the existing codebase.
2. Add filtering, indexing, and pagination for the lane and note lists.

You should extend the app. Do not rebuild the foundation.

## Task 1: RFP Lane Notes

Users need to add operational notes to an RFP lane.

Both admin and normal users can:

- View lane notes.
- Create lane notes.
- Edit lane notes.

Only admin users can:

- Delete lane notes.

The backend must enforce this permission rule. Hiding a button in the frontend is not enough.

### Database Requirements

Design the database changes needed for lane notes and add them through a TypeORM migration.

Expectations:

- Use TypeORM entities and migrations.
- Choose fields that support the feature requirements cleanly.
- Model relationships to the existing tenant, lane, and user data.
- Add constraints and indexes that protect tenant isolation and support common lookups.
- Do not use schema sync.
- Do not rely on manual database changes.

### Backend Requirements

Add these APIs:

- `GET /tenants/:tenantId/rfp-lanes/:laneId/notes`
- `POST /tenants/:tenantId/rfp-lanes/:laneId/notes`
- `PATCH /tenants/:tenantId/rfp-lanes/:laneId/notes/:noteId`
- `DELETE /tenants/:tenantId/rfp-lanes/:laneId/notes/:noteId`

Access rules:

- Admin and normal users can list, create, and edit notes.
- Only admins can delete notes.
- All routes must require tenant membership.
- All database queries must be scoped to the current tenant.
- Cross-tenant access must be rejected.

### Frontend Requirements

Add lane notes UI to the RFP lane detail screen.

Required behavior:

- Admin and normal users can view notes.
- Admin and normal users can create notes.
- Admin and normal users can edit notes.
- Admin users can see and use delete controls.
- Normal users cannot see delete controls.
- API errors, loading states, empty states, and validation errors are handled.

Use Ant Design components such as:

- Table or List
- Form
- Input
- Select
- Button
- Modal or Drawer
- Popconfirm
- Tag
- Alert or message notification

## Task 2: Filtering, Indexing, and Pagination

The seeded dataset contains enough lanes to make list behavior meaningful. Add backend-backed filtering and pagination for both:

- The existing RFP lane list.
- The new RFP Lane Notes list.

Expected lane filters:

- Status
- Equipment type
- Origin state
- Destination state

Expected note filters:

- Status
- Priority
- Category

Requirements:

- Filtering and pagination must be handled by the backend, not only in frontend memory.
- All filtered and paginated queries must remain tenant-scoped.
- The frontend should wire Ant Design table filter and pagination state to API query parameters.
- Choose a pagination response shape and sensible defaults.
- Protect APIs from unbounded list requests.
- Handle invalid filter or pagination parameters deliberately.
- Add database indexes that support your chosen query patterns through migrations.
- Explain your pagination defaults, maximum limits, response shape, and indexing choices in your pull request notes.

## Setup

```bash
npm install
docker compose up -d
npm run migration:run --workspace backend
npm run seed --workspace backend
npm run start:dev --workspace backend
npm run dev --workspace frontend
```

## Seeded Accounts

All seeded accounts use `Password123!`.

- `admin@acme.test`
- `user@acme.test`
- `admin@bluebird.test`
- `user@bluebird.test`

## Submission Expectations

Your submission should include:

- A feature branch created from the provided base branch.
- A pull request with your completed implementation.
- The database migration.
- Backend entity, module, service, controller, and DTOs.
- Frontend API functions and UI.
- Filtering and pagination for RFP lanes and lane notes.
- Migrations for any new indexes you add.
- Tests or clear manual verification notes.
- No unrelated rewrites.

Focus on correctness, tenant isolation, role authorization, query design, frontend state management, and clean integration with the existing codebase.

## Git Workflow

Create a new branch for your work:

```bash
git checkout -b feature/rfp-lane-notes
```

When your implementation is ready:

- Commit your changes.
- Push your branch.
- Open a pull request against the provided base branch.
- Include setup, migration, test, and manual verification notes in the pull request description.
