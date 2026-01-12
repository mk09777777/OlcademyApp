1. ##Objectives##

•Eliminate UI blocking on GPS
•Minimize battery and network usage
•Ensure consistent location across the app
•Keep changes low-churn
•Make backend the single source of computation

2. Design Principles

•Cached location is the default
•GPS is never used synchronously on UI paths
•Location updates are event- and distance-driven
•Manual location selection overrides device location
•Backend performs all heavy location logic

3. Single Source of Truth
•All location access must go through LocationContext
•No screen may call GPS directly
•No independent lat/lon state outside LocationContext

4. Cached-First Startup Flow
•Read cached location from storage
•Hydrate context immediately
•Render UI using cached data
•Refresh location only if freshness rules require

5. Freshness & Expiry Rules
•Skip refresh if location age < 5 minutes
•Background refresh if age is 5–30 minutes
•Force refresh if age > 30 minutes
•Fetch once if no cached location exists

6. Distance-Based Update Gate
•Update only if movement >= 75 meters
•Applied to foreground and background refresh

7. Accuracy Strategy
•Balanced accuracy for initial fetch
•Low accuracy for background refresh
•Exact location for manual selection
•High accuracy reserved for future live tracking

8. Manual Location Selection
•Manual selection overrides device GPS
•Cached immediately with source marked manual
•Device GPS disabled until reset

9. Allowed Refresh Triggers
•App launch
•App foreground
•Manual location change
•Location expiry
•Distance threshold crossed

10. Backend Contract
•Client sends lat/lon only
•Backend handles distance, ETA, filtering, clustering
•Client performs no heavy computation

11. Failure & Fallback Handling:
•Use cached location if GPS denied
•Fallback to network-based location on timeout
•Prompt manual selection if all fails

12. Execution Phases:
•Phase 1: Enforce context + caching
•Phase 2: Add freshness and distance gating
•Phase 3: Hardening and fallback handling


13. Final Target State:

•Cached-First
•Event-Driven
•Battery-Safe
•Production-Ready