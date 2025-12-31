# Future Plan – Sequenced Remediation Roadmap

This roadmap tracks the production-readiness remediation work for OlcademyApp, executed as strictly ordered phases with one focused commit per phase.

## Status
- ✅ Phase 0: Secrets & repo hygiene (complete)
- ✅ Phase 1: Router filesystem gaps (complete)
- ✅ Phase 2: Production-host correctness + notifications delete fix (complete)
- ✅ Phase 3: Remaining hardcoded host cleanup (complete)
- ✅ Phase 4: Runtime stability & lint/build blockers (complete)
- ✅ Phase 5: Observability, performance, and log hygiene (complete)
- ✅ Phase 6: Release hardening and pre-prod checklist (complete)
- ✅ Phase 7: Post-launch correctness hotfixes (complete)
- ✅ Phase 8: Minimal Jest regression harness (complete)
- ✅ Phase 9: PII-safe error reporting (complete)
- ✅ Phase 10: Async cancellation + stale-response guards (complete)
- ✅ Phase 11: Remaining async hotspots + rapid-navigation safety (complete)
- ✅ Phase 12: Maintainability and ownership (complete)
- ⏳ Phase 13: Secrets and config hygiene (in progress)

## Phase 7 — Post-launch Correctness Hotfixes
Goal: address high-impact correctness issues found after release without changing UX.

Scope (keep tight):
- Fix request signatures and missing imports causing runtime crashes.
- Prevent destructive auth state changes on transient network failures.
- Normalize API error behavior across runtime environments to avoid silent failures.

Validation:
- Targeted flows still work (favorites, collections, cart, auth bootstrap).
- No new red-screens introduced.

## Phase 8 — Minimal Jest Regression Harness
Goal: add a small safety net for pure logic without UI snapshot testing.

Scope:
- Introduce `jest-expo` config and a non-watch `test` script.
- Add unit tests only for deterministic pure helpers.

Validation:
- `npm test` passes in CI/local.

## Phase 9 — PII-safe Error Reporting
Goal: improve observability while avoiding PII and noisy logs.

Scope:
- Centralize error normalization/redaction.
- Wire UI boundary errors to structured reporting.

Validation:
- No request/response bodies or credentials are logged.

## Phase 10 — Async Cancellation + Stale-response Guards
Goal: prevent setState-after-unmount and out-of-order response overwrites during rapid navigation.

Scope:
- Use `AbortController`, request-id gating, and mounted guards for in-flight requests.
- Ensure debounced timers and pending work are cleaned up on unmount.

Validation:
- Rapid navigation and poor network conditions do not trigger warnings or stale UI.

## Phase 11 — Remaining Async Hotspots + Rapid-navigation Safety
Goal: apply the same cancellation/order-safety patterns to the remaining highest-risk screens.

Scope (keep tight):
- Identify hotspots that use timers/debounces + async requests and can race (e.g., search, pagination, initial load).
- Add abort + request-id gating + mounted guards.
- Ensure cleanup on unmount and on navigation-triggering actions.

Validation:
- Rapid typing + navigating away does not set state after unmount.
- Rapid pull-to-refresh + pagination does not overwrite newer results.
- `npm test` passes.

## Phase 12 — Maintainability and Ownership
Goal: reduce contributor error rate by clarifying folder responsibilities and explicitly labeling ambiguous/unused code paths.

Scope (documentation/annotation only):
- Document folder responsibilities and preferred import locations.
- Document known duplicate component families (e.g., `components/` vs `Card/`).
- Mark verifiably-unused or ambiguous providers/hooks as deprecated (no removals).

Validation:
- No runtime behavior changes.
- `npm test` passes.

## Phase 13 — Secrets and Config Hygiene
Goal: eliminate committed secrets/credentials and make environment configuration explicit and repeatable.

Scope (keep tight):
- Remove hard-coded credentials from scripts/docs.
- Ensure `.env.example` documents required variables (no real secrets).
- Ensure common local artifacts/virtualenvs are ignored.
- Expand preflight scanning to catch secrets in scripts.

Validation:
- No runtime feature changes.
- `npm test` passes.

## Phase 4 — Runtime Stability & Lint/Build Blockers
Goal: remove production crashers and unblock `expo lint` / bundling errors with minimal diffs.

Scope (keep tight):
- Fix any runtime crashers observed in device logs (e.g., “Text strings must be rendered within a <Text> component”).
- Fix high-signal lint/build blockers that prevent the app from starting (missing imports, `no-undef`, broken module paths).
- Avoid broad refactors; patch only what is required for stability.

Validation:
- `expo start` should load without red-screen crashers.
- `npm run lint` should not fail on critical errors for touched files.

## Phase 5 — Observability, Performance, and Logging Hygiene
Goal: reduce noise and improve debuggability without changing UX.

Scope:
- Replace noisy `console.log` spam with guarded logging (dev-only) where it causes performance or privacy issues.
- Address known RN perf warnings where feasible (e.g., nested lists) without redesigning screens.

Validation:
- No repeated log spam during normal navigation.
- Performance warnings reduced for primary flows.

## Phase 6 — Release Hardening Checklist
Goal: align config and environment for a predictable build/release.

Scope:
- Confirm environment configuration is production-safe (no `localhost` / LAN IP assumptions).
- Verify notifications strategy (Expo Go limitations vs dev build behavior) is documented.
- Run smoke tests on the most critical flows (auth, cart/checkout, booking, notifications).

Validation:
- App launches cleanly on real device builds.
- Backend calls resolve against the configured base URL.
