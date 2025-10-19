# Towatt

## Overview
Towatt is a single-page web application that converts microwave heating time between different wattages. The experience is optimised for mobile browsers so users can keep a bookmark on their device and look up conversions in seconds.

- Built with TypeScript, esbuild, and vanilla-extract. The distributable output is a single HTML file with all CSS and JavaScript inlined for easy static hosting.
- The target wattage is configurable through the `target` query parameter (for example `?target=600`), allowing multiple bookmark presets for different microwaves or households.
- Application state is URL-driven: visiting with a valid target wattage jumps straight into the conversion flow, while first-time visitors are guided through the setup view.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Development Workflow](#development-workflow)
3. [Project Layout](#project-layout)
4. [Runtime Behaviour](#runtime-behaviour)
5. [Testing](#testing)
6. [Build & Deployment](#build--deployment)
7. [Configuration](#configuration)
8. [Accessibility & UX Notes](#accessibility--ux-notes)
9. [Additional Documentation](#additional-documentation)
10. [License](#license)

## Quick Start
```bash
# Install dependencies (Node.js 22 LTS or newer)
npm install

# Produce the production-ready `dist/index.html`
npm run dist

# Preview the output in a browser
npx serve dist
```

Use the on-screen keypad to enter the four-digit label time (minutes + seconds). Once the input is complete the converted time is displayed automatically.

## Development Workflow
The project uses npm scripts to orchestrate the build pipeline. All scripts are defined in [`package.json`](package.json).

| Command | Description |
| --- | --- |
| `npm run clean` | Remove the `build/` and `dist/` directories. |
| `npm run build:bundle` | Compile TypeScript, bundle modules with esbuild, and emit `build/main.js` + `build/main.css`. |
| `npm run build` | Clean previous artifacts and run the bundler. |
| `npm run inline-css` | Inline the compiled CSS into `build/index.html`. |
| `npm run bundle-html` | Inline JavaScript and emit the standalone `dist/index.html`. |
| `npm run dist` | Execute the full pipeline (`clean → build:bundle → inline-css → bundle-html`). |
| `npm run e2e:webserver` | Build the app and serve the `dist/` directory for local E2E testing. |

During development you can execute the scripts individually to inspect intermediate outputs (for example to debug the CSS bundle before inlining).

### Local Preview
To quickly inspect the final HTML locally, build the distribution file and serve it with any static file server:

```bash
npm run dist
npx serve dist
```

Open the printed URL (typically `http://localhost:3000`) in a browser.

## Project Layout
```
├─ docs/                # Requirements and test strategy documents
├─ scripts/             # Build helper scripts (Node.js ES modules)
├─ src/                 # HTML / TypeScript / vanilla-extract styles
├─ tests/               # Vitest unit/integration tests
├─ e2e/                 # Playwright end-to-end specs
├─ package.json         # npm scripts and development dependencies
├─ tsconfig*.json       # TypeScript configuration for app and Playwright
└─ (build|dist)/        # Generated artifacts (not committed)
```

Refer to [`docs/requirements.md`](docs/requirements.md) for the full product specification and [`docs/test-strategy.md`](docs/test-strategy.md) for ongoing quality goals.

## Runtime Behaviour
- Preset wattage buttons (1500 W / 700 W / 600 W / 500 W) and a manual numeric input are available for label wattage selection.
- The keypad accepts a four-digit input representing `mmss`. Once four digits are entered the view transitions automatically to show the conversion result.
- The converted time is displayed in `mm:ss` format with total seconds as a supplement for quick confirmation.
- Application state persists via URL parameters, making bookmarked presets the fastest way to reuse the tool.

The underlying formula uses energy equivalence: `sourcePower * sourceTime = targetPower * targetTime`. The UI normalises keypad input into total seconds before applying the conversion.

## Testing
Automated tests are powered by [Vitest](https://vitest.dev) (unit/integration) and [Playwright](https://playwright.dev) (end-to-end). The roadmap for improving coverage lives in [`docs/test-strategy.md`](docs/test-strategy.md).

| Command | Description |
| --- | --- |
| `npm run test` | Run the Vitest suite once in CI mode. |
| `npm run test:watch` | Start Vitest in watch mode for local development. |
| `npm test -- --coverage` | Collect coverage metrics with V8 instrumentation. |
| `npm run playwright:install` | Install browser binaries required for Playwright. |
| `npm run test:e2e` | Execute Playwright tests (requires the dist webserver). |

End-to-end tests expect a built distribution and can be run against the local server provided by `npm run e2e:webserver`, which builds the app and hosts `dist/` with a lightweight Node.js server.

## Build & Deployment
1. `npm run build` bundles TypeScript and vanilla-extract styles into `build/` outputs.
2. `npm run inline-css` injects the compiled CSS into the HTML shell.
3. `npm run bundle-html` embeds JavaScript to produce a self-contained `dist/index.html`.

The generated HTML file can be deployed to any static host (GitHub Pages, Netlify, S3, etc.). Because all assets are inlined, no additional configuration or asset hosting is required.

## Configuration
### Google Analytics
Set the `GA_MEASUREMENT_ID` environment variable before running `npm run bundle-html` or `npm run dist` to inject the Google Analytics tag. Leaving it unset omits analytics from the build, which keeps the measurement ID out of source control and local previews.

```bash
GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run dist
```

In CI (for example GitHub Actions), store the measurement ID as a secret and expose it only for production builds.

### Target Wattage Presets
Shareable URLs include the desired output wattage, such as `https://example.com/?target=600`. Invalid or missing parameters return the app to setup mode so the user can enter a new target value.

## Accessibility & UX Notes
- Large touch targets and a mobile-first layout support one-handed use on smartphones.
- When the keypad input reaches four digits the app announces the result using `aria-live` regions to keep assistive technology users informed.
- Focus management and privacy notices are handled via dedicated modules that are covered by the testing roadmap.

## Additional Documentation
- [`docs/requirements.md`](docs/requirements.md) — detailed product requirements and input/output rules.
- [`docs/test-strategy.md`](docs/test-strategy.md) — coverage targets and upcoming testing improvements.

## License
ISC (see [`package.json`](package.json)).
