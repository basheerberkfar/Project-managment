# AGENTS.md

## Role

Act as a senior frontend engineer maintaining an existing React 19 + Vite + TypeScript codebase. Optimize for safe, minimal changes that fit the repository as it already works today.

## Core Working Rules

- Adapt to existing patterns before introducing new ones.
- Inspect similar nearby files before creating or editing anything.
- Preserve existing naming conventions, import style, file organization, and route patterns.
- Keep changes minimal, scoped, and easy to review.
- Reuse shared UI, common components, existing hooks, Zustand stores, helpers, and services before creating new abstractions.
- Only add files when the current structure truly needs them.
- When asked to create a feature, use the local `create-feature` skill if the task is feature work for this repository.

## Repository Architecture

- App bootstrap lives in `src/app/main.tsx`, `src/app/App.tsx`, and `src/app/router.tsx`.
- Routes are declared centrally in `src/app/router.tsx` with lazy-loaded feature pages and nested protected/public route wrappers.
- Most user-facing work is organized under `src/features/<feature-name>`.
- Shared or reference-data APIs that are reused across multiple features often live under `src/services/<entity-name>`.
- Shared UI primitives live under `src/components/ui`.
- Shared composed components live under `src/components/common`.
- Layout and navigation live under `src/components/layout/components`.
- Cross-feature hooks live under `src/hooks`.
- Shared stores live under `src/store`.
- Shared constants, types, and helpers live under `src/constants`, `src/types`, and `src/utils`.
- Localization is centralized under `src/i18n` with JSON files in `src/i18n/locales/en` and `src/i18n/locales/ar`.

## Observed Feature Patterns

- Feature entry pages commonly live in `src/features/<feature>/page/index.tsx`.
- CRUD features frequently add `page/form/index.tsx`, `page/form/schema/index.ts`, `page/view/index.tsx`, `components/*`, `hooks/*`, and `service/*`.
- List pages often manage filter/search/modal state either with feature-local reducer files in `page/state/*` or a page hook such as `use-products-page.tsx`.
- Section-based feature hubs such as `types` and `settings` render sub-sections from navigation config instead of creating separate top-level routes for every small subsection.

## Service Layer Rules

- Inspect the nearest comparable service first.
- Match the existing service split already used in that area.
- Feature-local services commonly use `*.routes.ts`, `*.endpoints.ts`, `*.keys.ts`, `*.query.ts(x)`, `*.types.ts`, and `index.ts`.
- Some settings services intentionally keep related query/api/types together in a single `index.ts`.
- Keep React Query key shapes and invalidation behavior aligned with nearby modules.
- Prefer existing `api` client usage from `src/libs/axios.ts`.
- Preserve current response normalization patterns such as `res.data`, `res.data.result`, or `payload.data ?? payload.result`.

## UI and Page Rules

- Reuse `src/components/ui` primitives and `src/components/common` composites before building new components.
- Follow existing page composition patterns for tables, filters, pagination, modals, permissions, forms, skeletons, and toast/error handling.
- Keep Tailwind utility style consistent with nearby files and reuse existing design tokens from `src/styles/globals.css`.
- Preserve permission-aware behavior using existing helpers/components such as `Can`, `hasPermission`, and `hasPermissionKey`.

## Routing Rules

- Add or update routes in `src/app/router.tsx`.
- Keep lazy imports, route nesting, and protected/public route structure consistent with existing entries.
- For navigation-driven areas, also inspect related navigation config such as sidebar schemas or section navigation item files.

## Localization Rules

- Check which namespace the surrounding feature already uses before adding text.
- Prefer extending an existing namespace (`common`, `sidebar`, `auth`, `products`, `clients`, `settings`, `usersRoles`, `types`) instead of inventing a new one.
- When a new translation key is needed, add it in both `src/i18n/locales/en/*.json` and `src/i18n/locales/ar/*.json`.
- If a truly new namespace is required, update both `src/i18n/resources.ts` and `src/i18n/index.ts`.

## Feature Creation Workflow

1. Inspect a similar existing feature in the same area of the repo.
2. Mirror its folders before proposing any new structure.
3. Reuse existing services, hooks, and components where possible.
4. Only introduce new modules when the analogous feature already needs that separation.
5. Wire routes, navigation, permissions, and translations using the same patterns as neighboring features.

## Product Status Change Permission

- The product table's status toggle uses the `products.change_status` permission to control whether users can change product status.
- This is implemented in `src/features/products/hooks/use-products-page.tsx` using `hasPermission(PERMISSION_GROUPS.products, PERMISSION_ACTIONS.change_status)`.
- The `canChangeStatus` value is passed to `useProductsTableColumns` and applied to the `StatusToggle` component's `disabled` prop.
- This follows the same pattern used in the users table for `users.change_status`.

## File Creation Heuristics

- Prefer editing an existing feature module over creating a new abstraction.
- Add a new hook only when page/component logic is already factored that way nearby.
- Add a new `service/` folder only when the feature owns distinct API behavior.
- Add schemas under `page/form/schema` when the feature has a dedicated form page.
- Add `page/state/*` only when reducer-driven page state matches comparable pages in the same domain.
