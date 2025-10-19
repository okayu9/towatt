# Test Improvement Plan

## Current Status
- Running `npm test -- --coverage` previously yielded only 25% statement coverage.
- DOM- and event-driven modules such as `src/app/render.ts`, `src/app/privacy.ts`, `src/app/dom.ts`, and `src/app/analytics.ts` had little or no automated coverage.
- Generated artifacts (for example `build/main.js`) were counted in the report, dragging the overall numbers down.

## Targets
- **Statements:** 70% or higher
- **Branches:** 60% or higher
- Establish broad unit coverage for key UI logic (renderer, controller, privacy module).

## Actions
1. Configure Vitest `coverage.exclude` to drop generated outputs and build scripts from the report.
2. Add DOM-backed unit tests that verify:
   - `createRenderer` updates the DOM for each application state.
   - `initializePrivacyPolicy` manages modal interactions and focus trapping.
   - `hydratePresetButtons` rebuilds the preset keypad correctly.
3. Expand `createAppController` tests to guard the primary user flow.
4. Enforce minimum coverage with Vitest thresholds and, if necessary, GitHub Actions checks.

## Roadmap
- **Short term (one iteration):** Add the missing UI-focused unit tests and refine coverage exclusions.
- **Mid term:** Grow the test suite until coverage reliably exceeds the targets above.
- **Long term:** Integrate Playwright (or similar) E2E flows and Lighthouse/Axe audits into CI for regression protection.

