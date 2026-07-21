# Project

- React Router v8 (Framework Mode)
- TypeScript v5
- Redux Toolkit + RTK Query
- CSS Modules
- i18next (`react-i18next` + `remix-i18next`)
- Zod v4
- ESLint
- Prettier
- Yarn

---

## Architecture & Conventions

- Follow the existing project architecture and conventions.
- Keep features isolated.
- Reuse existing abstractions before introducing new ones.
- Extend existing patterns instead of creating new ones.
- Prefer consistency with the existing codebase over personal preference.
- Do not invent new project conventions.
- Inspect similar implementations before introducing a new pattern.
- Do not introduce new dependencies unless explicitly requested.

---

## Routing

- This project uses React Router Framework Mode.
- `@react-router/fs-routes` is the source of truth for routing.
- Create, move, and remove routes using the established file-system routing conventions.
- Do not replace `fs-routes` with manual route configuration.

### Generated Route Types

React Router generates route types automatically.

When creating, renaming, or removing route modules:

1. Update the route module.
2. Generate route types by running either:
   - `yarn type-check`
   - `yarn dev` (if the development server is already running)
3. Continue implementation only after route types have been generated.

Never manually create, modify, or maintain generated route types.

---

---

## Data Fetching

- RTK Query is the only solution for client-server communication.
- Redux Toolkit is the only global state solution.
- Do not use React Router `action` or `clientAction`.
- Do not replace RTK Query with another data-fetching solution.

---

## Styling

- CSS Modules are the standard styling solution.

---

## Validation

- Zod is the standard runtime validation library.

---

## Localization

- All user-facing text must be localized.
- Translation is performed only inside React components.
- Never translate inside `loader`.
- Never translate inside `clientLoader`.
- Never translate inside `meta`.
- Never translate inside `action`.
- Never translate inside `clientAction`.
- Follow the Localization skill for implementation details.

---

## Quality Gates

Unless explicitly instructed otherwise:

1. Run `yarn type-check`.
2. Run `yarn eslint`.
3. Run `yarn eslint --fix` when applicable.
4. Run `yarn format`.
5. Resolve all errors.
6. Remove unused imports, variables, dead code, and unnecessary comments.
7. Do not leave TODOs or placeholders unless explicitly requested.
