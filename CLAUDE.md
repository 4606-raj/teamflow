# TeamFlow

Monorepo (pnpm + turbo) for a project/task management app. This is a personal learning
project: the owner writes the code and uses Claude as a mentor. Follow the `learning-pair`
skill for any build/fix/review request.

## Stack

- `apps/api`: NestJS 11, Prisma 7 (MariaDB/MySQL adapter currently), JWT + Google OAuth, Zod and class-validator
- `apps/web`: React 19, Vite, TanStack Query, Zustand, React Hook Form, react-router-dom 7, Tailwind 4, shadcn-style UI on @base-ui
- `packages/types`: shared Zod schemas and response types (`@teamflow/types`)

## Commands

- `pnpm dev` runs API and web together
- API: `pnpm --filter api test`, `pnpm --filter api lint`, `pnpm --filter api seed`
- Web: `pnpm --filter web lint`, `pnpm --filter web build`
- Prisma: run from `apps/api` (`prisma migrate dev`, then `prisma generate`; generate and seed are not automatic)

## Conventions

- Read `docs/Architecture.md` and `docs/development guideline.md` before suggesting structure.
- API layering: controller -> service -> repository. Prisma only inside repositories.
- Web layering: component -> hook -> api function -> `shared/api/http.ts`.
- Responses are wrapped by `ResponseInterceptor` as `{ success, message, data }`; the axios interceptor unwraps `data`.
- Commit messages: `type(module): short message` (see `docs/DEVELOPMENT.md`).
- Use `@/` aliases, not deep relative imports.

## Security rules (non-negotiable when reviewing or suggesting code)

- Scope every read and write on tenant data by organization or project membership.
- Never trust ids or fields from the request body when a route param or the JWT already defines them.
- Use `crypto.randomBytes` for tokens; never `Math.random()`.
- Do not log users, tokens or secrets.
- Validate `postMessage` origins; never post to `'*'` with auth-relevant data.

## Known open items (learning backlog)

1. Tenant scoping for projects and tasks (no `organizationId` on `Project`, list endpoints are global)
2. `PUT /tasks/:id` uses the body id, not the route param, and has no authorization check
3. Refresh token storage: bcrypt over a JWT is weak (72-byte limit); consider a SHA-256 hash
4. Invitation tokens use `Math.random()`; invitation delete/accept lack role checks
5. OAuth popup `postMessage(..., '*')`
6. `console.log(user)` in `PermissionGuard`; `JWT_REFRESH_EXPIRES_IN` mismatch between `jwt.config.ts` and env validation
7. Prisma provider is `mysql`; docs say PostgreSQL. Plan the migration
8. Kanban uses hardcoded data; wire it to the tasks API
9. `cn` helper is a plain join; consider `clsx` + `tailwind-merge`
