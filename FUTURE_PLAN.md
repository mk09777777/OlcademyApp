# Future Plan – Sequenced Remediation Roadmap

This roadmap tracks the production-readiness remediation work for OlcademyApp, executed as strictly ordered phases with one focused commit per phase.

## Status
- ✅ Phase 0: Secrets & repo hygiene (complete)
- ✅ Phase 1: Router filesystem gaps (complete)
- ✅ Phase 2: Production-host correctness + notifications delete fix (complete)
- ✅ Phase 3: Remaining hardcoded host cleanup (complete)
- ⏳ Phase 4: Runtime stability & lint/build blockers (next)
- ⏳ Phase 5: Observability, performance, and log hygiene (pending)
- ⏳ Phase 6: Release hardening and pre-prod checklist (pending)

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
