# Monorepo Architecture

## Tech Stack

- pnpm Workspaces
- NestJS
- React
- TypeScript
- Vite
- TanStack Query
- Zustand
- React Router
- Zod
- shadcn/ui

---

# Goals

- Keep frontend and backend in one repository.
- Share code safely through packages.
- Organize code by business features.
- Reduce duplication.
- Scale without major restructuring.
- Keep applications independently deployable.

---

# Architecture Principles

- Feature-first organization.
- Clear ownership of code.
- Shared code lives in packages.
- Applications communicate through shared contracts.
- No cross-feature internal imports.
- High cohesion, low coupling.

---

# Repository Structure

```text
.
├── apps/
│   ├── backend/
│   └── frontend/
│
├── packages/
│   ├── shared-types/
│   ├── shared-validation/
│   ├── shared-utils/
│   ├── shared-config/
│   ├── eslint-config/
│   └── tsconfig/
│
├── package.json
└── pnpm-workspace.yaml
```

---

# Applications

## Backend

Responsible for:

- REST APIs
- Authentication
- Authorization
- Business Logic
- Database
- Background Jobs
- Third-party Integrations

---

## Frontend

Responsible for:

- UI
- Routing
- Client State
- Server State
- Forms
- API Consumption

---

# Shared Packages

Shared packages should only contain code used by multiple applications.

```text
packages/
├── shared-types/
├── shared-validation/
├── shared-utils/
├── shared-config/
├── eslint-config/
└── tsconfig/
```

---

# Frontend Architecture

```text
apps/frontend/src
│
├── app/
│   ├── App.tsx
│   ├── main.tsx
│   ├── router.tsx
│   └── providers/
│
├── assets/
│
├── features/
│
├── layouts/
│
├── routes/
│
├── shared/
│
├── styles/
│
└── index.css
```

---

# Feature Structure

Each feature owns its implementation.

```text
features/
└── users/
    ├── api/
    ├── components/
    ├── hooks/
    ├── pages/
    ├── schemas/
    ├── store/
    ├── types/
    ├── utils/
    └── index.ts
```

Each feature owns:

- Pages
- Components
- API
- Hooks
- Validation
- State
- Types
- Utilities

Features must not import another feature's internal files.

---

# Shared Folder

Contains reusable frontend code shared across multiple features.

```text
shared/
├── api/
├── components/
├── config/
├── constants/
├── hooks/
├── lib/
├── stores/
├── types/
└── utils/
```

Never place feature-specific code here.

---

# Backend Architecture

```text
apps/backend/src
│
├── common/
├── config/
├── database/
├── modules/
├── app.module.ts
└── main.ts
```

---

# Backend Module Structure

```text
modules/
└── users/
    ├── controllers/
    ├── services/
    ├── repositories/
    ├── dto/
    ├── entities/
    ├── validators/
    ├── users.module.ts
    └── index.ts
```

Each module owns its complete business logic.

---

# Data Flow

## Frontend

```text
Component
    ↓
Hook
    ↓
API
    ↓
Axios Client
    ↓
Backend
```

---

# State Management

| State | Tool |
|--------|------|
| Server State | TanStack Query |
| Global Client State | Zustand |
| Form State | React Hook Form |
| Local State | useState |

---

# Shared Code Rules

Use packages only when code is shared between multiple applications.

Keep application-specific code inside its application.

Never import frontend code into the backend.

Never import backend code into the frontend.

---

# Best Practices

- Organize by feature.
- Keep business logic inside features/modules.
- Share contracts instead of implementations.
- Use barrel exports.
- Prefer absolute imports.
- Centralize configuration.
- Keep reusable code in packages.

---

# Scalability

This architecture supports:

- Small applications
- Medium business applications
- Enterprise systems

It enables:

- Clear ownership
- Easy maintenance
- Independent deployments
- Reusable shared packages
- Predictable project organization