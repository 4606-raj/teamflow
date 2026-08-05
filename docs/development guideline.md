# Development Guidelines

## Feature Ownership

Each feature should own its implementation.

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

A feature owns:

- API
- Components
- Hooks
- Pages
- Validation
- State
- Types
- Utilities

Do not import another feature's internal files. Use its public `index.ts` exports instead.

---

# API Layer

React components should never call Axios directly.

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

```ts
// api/get-users.ts
export const getUsers = () => api.get("/users");
```

---

# Server State

Use **TanStack Query** for all server state.

Use it for:

- Fetching
- Caching
- Pagination
- Infinite Scroll
- Mutations
- Background Refetching

Never duplicate server data in Zustand.

---

# Client State

Use **Zustand** only for global client state.

Good examples:

- Authentication
- Theme
- Sidebar
- UI Preferences
- Language

Avoid storing:

- Users
- Products
- Orders
- API Responses

---

# Form Management

Use **React Hook Form** for forms.

Keep forms inside their owning feature.

```text
users/
├── components/
│   └── UserForm.tsx
└── schemas/
    └── user.schema.ts
```

---

# Validation

Use **Zod** for validation.

- Keep feature-specific schemas inside the feature.
- Move schemas to `packages/shared-validation` only when shared between frontend and backend.

---

# Environment Variables

Never access environment variables directly.

Frontend:

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

Always access configuration through a single file.

---

# Providers

Keep application providers under `app/providers`.

Example:

```text
app/
└── providers/
    ├── Providers.tsx
    ├── QueryProvider.tsx
    ├── ThemeProvider.tsx
    ├── AuthProvider.tsx
    ├── query-client.ts
    └── index.ts
```

Compose providers in one place.

```tsx
<Providers>
    <App />
</Providers>
```

---

# Routing

Keep route definitions modular.

```text
routes/
├── auth.tsx
├── dashboard.tsx
├── users.tsx
└── index.tsx
```

Compose all routes in a central router.

---

# Absolute Imports

Prefer aliases over relative imports.

```text
@/app
@/features
@/layouts
@/shared
```

Workspace packages:

```text
@repo/shared-types
@repo/shared-validation
@repo/shared-utils
@repo/shared-config
```

Avoid deep relative imports like:

```ts
../../../../components/Button
```

---

# Barrel Exports

Expose only a feature's public API.

```ts
export * from "./api";
export * from "./components";
export * from "./hooks";
```

Prefer:

```ts
import { useUsers } from "@/features/users";
```

Instead of:

```ts
import { useUsers } from "@/features/users/hooks/useUsers";
```

---

# State Management Rules

| State | Tool |
|--------|------|
| Server State | TanStack Query |
| Global Client State | Zustand |
| Form State | React Hook Form |
| Local Component State | useState |
| Derived State | useMemo |

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

# Code Sharing Rules

Move code to `packages` only when it is shared by multiple applications.

Keep application-specific code inside its application.

Avoid creating shared packages prematurely.

---

# Best Practices

- Keep components small and focused.
- Keep business logic out of UI components.
- Prefer composition over inheritance.
- Keep features independent.
- Keep shared code framework-agnostic where possible.
- Prefer custom hooks for reusable logic.
- Centralize configuration.
- Use absolute imports.
- Export only public APIs.

---

# Avoid

- Calling APIs directly from components.
- Storing server state in Zustand.
- Importing another feature's internal files.
- Duplicating validation logic.
- Duplicating shared types.
- Creating large shared folders with feature logic.
- Circular dependencies.
- One massive global store.
- Mixing UI, business logic, and API calls in the same component.