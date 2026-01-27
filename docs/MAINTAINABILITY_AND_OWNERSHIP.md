# Maintainability & Ownership Notes (Phase 12)

This document captures **current conventions** and **known ambiguity points** in the repo to reduce contributor error rate.

Scope constraints:
- Documentation/annotation only.
- No runtime behavior changes.
- No file moves/renames.

## Folder responsibilities

### `app/` (Expo Router)
- Route entrypoints (screens) live here.
- Prefer keeping screens thin: compose UI from `components/` and call data-layer functions from `services/`.

### `components/`
- Shared UI components used across multiple screens.
- This is the preferred location for new reusable UI.

### `Card/`
- Contains card-like UI components that overlap with similarly named components in `components/`.
- Treat this folder as **legacy/compat** until a deliberate consolidation is planned.

Recommended practice:
- For new work, prefer importing from `components/`.
- Avoid creating new duplicates in both `Card/` and `components/`.

### `context/`
- App-wide React Context providers/hooks.
- Contexts should be mounted in `app/_layout.jsx` (or a similarly centralized root) when actively used.

### `hooks/`
- Reusable hooks that are not global state providers.
- Avoid naming hooks that collide with context hook names (see Orders note below).

### `services/`
- Network-facing data layer (API calls) and domain services.
- Prefer keeping HTTP concerns centralized (error normalization, base URL, auth headers).

### `utils/`
- Pure helpers (ideal for unit tests).

## Known duplicates / ambiguity hotspots

The repo currently contains component names that exist in multiple places.
Examples observed in the tree:
- `components/EventCard.jsx` and `Card/EventCard.jsx`
- `components/CollectionCard.jsx` and `Card/CollectionCard.jsx`
- `components/TiffinOrderCard.jsx` and `Card/TiffinOrderCard.jsx`

Guideline:
- When touching these areas, first confirm which version is imported by the screen you’re working on.
- Prefer standardizing imports per feature slice (choose one per flow) rather than mixing.

## Orders ownership note (currently ambiguous)

There are **two different Orders implementations**:
- `context/OrdersContext.jsx` (AsyncStorage-backed local orders)
- `hooks/useOrders.js` (API-backed orders via `tiffinApi`)

As of the Phase 12 inventory, `OrdersProvider` / context `useOrders()` did not appear to be mounted/used by app routes.
Until ownership is clarified:
- Treat both as **deprecated / not currently relied on**.
- If Orders becomes a product requirement, prefer selecting a single source of truth (context vs service hook) and removing ambiguity in a dedicated change.
