# Monorepo Architecture Guide

> **Monorepo Stack**
>
> * pnpm Workspaces
> * NestJS (Backend)
> * React 19+
> * TypeScript
> * Vite
> * TanStack Query
> * Zustand
> * React Hook Form
> * Zod
> * shadcn/ui
> * Axios
> * React Router

---

# Goals

This architecture is designed to:

* Keep frontend and backend in a single repository.
* Share code safely between applications.
* Keep business domains isolated.
* Reduce duplication.
* Scale easily as the application grows.
* Improve developer onboarding.
* Enable independent deployment of applications.

---

# Architecture Principles

The repository follows a **Monorepo + Feature-Based Architecture**.

* Each application owns its implementation.
* Shared code lives in reusable packages.
* Features own their business logic.
* Applications communicate through shared contracts, not internal implementation.

---

# Project Structure

```text
.
│
├── apps/
│   ├── backend/
│   │
│   └── frontend/
│
├── packages/
│   ├── shared-types/
│   ├── shared-config/
│   ├── shared-utils/
│   ├── shared-validation/
│   ├── eslint-config/
│   └── tsconfig/
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md
```

---

# Applications

## apps/backend

NestJS application.

Responsible for:

* REST API
* Authentication
* Database
* Business logic
* Authorization
* Background jobs
* Integrations

---

## apps/frontend

React application.

Responsible for:

* UI
* Routing
* Forms
* Client-side state
* API consumption
* User experience

---

# Shared Packages

Only place code here if it is used by **multiple applications**.

```text
packages/

shared-types/
shared-utils/
shared-config/
shared-validation/

eslint-config/
tsconfig/
```

---

## shared-types

Shared interfaces and types.

Example:

```text
packages/shared-types/

user.ts
auth.ts
pagination.ts
api.ts
```

Used by:

* Backend
* Frontend

---

## shared-utils

Framework-independent helper functions.

Examples:

```text
packages/shared-utils/

formatDate.ts
formatCurrency.ts
slugify.ts
```

Should not depend on React or NestJS.

---

## shared-config

Shared constants.

Examples:

```text
roles.ts
permissions.ts
routes.ts
```

---

## shared-validation

Validation schemas shared across applications.

Example:

```text
user.schema.ts
login.schema.ts
```

Useful when both frontend and backend use Zod.

---

## eslint-config

Reusable ESLint configuration.

---

## tsconfig

Shared TypeScript configuration.

---

# Frontend Structure

```text
apps/frontend/src
│
├── app/
│   ├── App.tsx
│   ├── main.tsx
│   ├── providers.tsx
│   ├── router.tsx
│   └── query-client.ts
│
├── assets/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── users/
│   ├── products/
│   └── orders/
│
├── layouts/
├── routes/
│
├── shared/
│   ├── api/
│   ├── components/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── stores/
│   ├── types/
│   └── utils/
│
├── styles/
│
└── index.css
```

---

# Frontend Feature Structure

Every feature owns its implementation.

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

* API
* Components
* Hooks
* Forms
* Validation
* Types
* Store (if required)

Features should not access another feature's internal files.

---

# Backend Structure

```text
apps/backend/src
│
├── main.ts
├── app.module.ts
│
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── filters/
│   ├── interceptors/
│   ├── pipes/
│   └── utils/
│
├── config/
│
├── database/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── products/
│   └── orders/
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
    ├── interfaces/
    ├── validators/
    ├── users.module.ts
    └── index.ts
```

Each module owns:

* Controller
* Service
* Repository
* DTOs
* Validation
* Business logic

---

# Frontend Shared Folder

Contains reusable code used by multiple frontend features.

Never place feature-specific code here.

```text
shared/
    api/
    components/
    hooks/
    lib/
    utils/
    stores/
```

---

# utils vs lib

## utils/

Contains pure helper functions.

Examples:

```text
formatDate.ts
formatCurrency.ts
capitalize.ts
```

These functions are:

* Stateless
* Reusable
* Framework-independent

---

## lib/

Contains wrappers around libraries or platform APIs.

Examples:

```text
cn.ts
storage.ts
axios.ts
date.ts
logger.ts
```

Think of **utils** as reusable functions.

Think of **lib** as shared infrastructure.

---

# Routing

Keep route definitions modular.

```text
routes/

auth.tsx
dashboard.tsx
users.tsx
products.tsx
```

Combine them centrally.

---

# API Layer

Components never call Axios directly.

```text
Component
    ↓
Custom Hook
    ↓
API Function
    ↓
Axios Client
```

Example:

```text
features/users/api/get-users.ts
```

```ts
export const getUsers = () => api.get("/users");
```

---

# TanStack Query

TanStack Query is the source of truth for **server state**.

Use it for:

* Fetching
* Caching
* Pagination
* Infinite Scroll
* Mutations
* Background refetching

Do **not** duplicate server data in Zustand.

---

# Zustand

Use Zustand only for client-side state.

Examples:

* Authentication
* Theme
* Sidebar
* Language
* Cart
* UI Preferences

Avoid storing:

* Users
* Products
* Orders
* API responses

Those belong in TanStack Query.

---

# React Hook Form

Each feature owns its forms.

Example:

```text
users/

components/
    UserForm.tsx

schemas/
    user.schema.ts
```

---

# Environment Variables

Never access environment variables directly throughout the application.

Frontend:

```text
shared/config/env.ts
```

```ts
export const env = {
    apiUrl: import.meta.env.VITE_API_URL,
};
```

Backend:

```ts
export const env = {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
};
```

Centralizing configuration improves consistency and testing.

---

# Absolute Imports

Frontend:

```text
@/features
@/shared
@/layouts
```

Workspace packages:

```text
@repo/shared-types
@repo/shared-utils
@repo/shared-validation
@repo/shared-config
```

Avoid long relative imports.

---

# State Management Rules

| State               | Tool            |
| ------------------- | --------------- |
| Server State        | TanStack Query  |
| Global Client State | Zustand         |
| Form State          | React Hook Form |
| Local UI State      | useState        |
| Derived State       | useMemo         |

---

# Provider Order

```tsx
<QueryClientProvider>
    <ThemeProvider>
        <BrowserRouter>
            <TooltipProvider>
                <App />
            </TooltipProvider>
        </BrowserRouter>
    </ThemeProvider>
</QueryClientProvider>
```

---

# Naming Conventions

## Components

```text
UserCard.tsx
ProductTable.tsx
LoginForm.tsx
```

---

## Hooks

```text
useUsers.ts
useLogin.ts
```

---

## API

```text
get-users.ts
create-user.ts
delete-user.ts
```

---

## Schemas

```text
user.schema.ts
login.schema.ts
```

---

## Stores

```text
auth.store.ts
theme.store.ts
```

---

## Types

```text
user.ts
product.ts
```

---

# Barrel Exports

Each feature should expose a public API.

```text
users/

index.ts
```

```ts
export * from "./api";
export * from "./components";
export * from "./hooks";
```

Import like:

```ts
import { useUsers } from "@/features/users";
```

Instead of:

```ts
import { useUsers } from "@/features/users/hooks/useUsers";
```

---

# pnpm Workspaces

Use workspaces to share code instead of copying files.

Example:

```text
apps/frontend
        │
        ├──────────────┐
apps/backend           │
        │              │
        ▼              ▼

packages/
    shared-types
    shared-utils
    shared-config
```

Benefits:

* Single lockfile
* Shared dependencies
* Consistent TypeScript types
* Faster installs
* Easier refactoring

---

# What Belongs Where?

| Code                | Location                                   |
| ------------------- | ------------------------------------------ |
| React Components    | apps/frontend                              |
| NestJS Modules      | apps/backend                               |
| Shared DTOs / Types | packages/shared-types                      |
| Shared Zod Schemas  | packages/shared-validation                 |
| Shared Utilities    | packages/shared-utils                      |
| Shared Constants    | packages/shared-config                     |
| Axios Client        | frontend/shared/api                        |
| React Hooks         | frontend/features or frontend/shared/hooks |

---

# Best Practices

✅ Keep frontend and backend independent.

✅ Share contracts, not implementations.

✅ Keep business logic inside features/modules.

✅ Use TanStack Query for server state.

✅ Use Zustand only for client state.

✅ Keep reusable code inside workspace packages.

✅ Prefer feature-based organization.

✅ Keep types close to their owner unless shared.

✅ Use barrel exports.

✅ Prefer absolute imports.

✅ Centralize configuration.

---

# Things to Avoid

❌ Importing frontend code into the backend.

❌ Importing backend code into the frontend.

❌ Duplicating shared types.

❌ Copy-pasting validation logic.

❌ Calling Axios directly from React components.

❌ Storing server state in Zustand.

❌ Massive shared folders containing feature logic.

❌ Circular dependencies between packages.

❌ One giant global store.

❌ Mixing UI, API, validation, and business logic inside components.

---

# Scalability

This architecture supports:

* Small applications
* Medium business applications
* Large enterprise systems

It promotes:

* Clear ownership
* High cohesion
* Low coupling
* Shared contracts
* Better testing
* Easier maintenance
* Faster onboarding
* Predictable project organization

As the system grows, frontend, backend, and shared packages remain independently maintainable while benefiting from a single, well-organized monorepo.
