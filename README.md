# Towatt

## Overview
- Single-page application that converts microwave heating time between different wattages.
- Target wattage can be supplied via query parameter (for example, `?target=600`) enabling bookmarkable presets.
- Built with TypeScript, esbuild, and vanilla-extract. The final deliverable is a single HTML file with inlined CSS/JS.

## Features
- Offers preset wattages (1500W / 700W / 600W / 500W) and manual input for label wattage selection.
- Four-digit keypad normalizes minutes and seconds, then calculates the required heating time for the target wattage.
- Mobile-first layout with large controls and `aria-live` support for assistive technologies.
- When accessed with a target wattage, the app loads directly into the conversion view; otherwise it guides users through setup.

## Project Structure
```
├─ docs/                # Requirements and implementation notes
├─ scripts/             # Build helper scripts (Node.js ES modules)
├─ src/                 # HTML / TypeScript / vanilla-extract styles
├─ package.json         # Scripts and dependencies
├─ tsconfig.json        # TypeScript compiler options
└─ (build|dist)/        # Generated artifacts
```

See `docs/requirements.md` for detailed specifications.

## Setup
### Prerequisites
- Node.js 22 LTS or later
- npm (bundled with Node.js)

### Installation
```bash
npm install
```

## Usage
1. `npm run build` bundles TypeScript and styles into `build/main.js` and `build/main.css` (IIFE output).
2. `npm run inline-css` inlines the compiled CSS into `build/index.html`.
3. `npm run bundle-html` inlines the JavaScript and produces `dist/index.html` for distribution.
4. `npm run dist` executes the entire pipeline (`clean → build → inline-css → bundle-html`).

Open `dist/index.html` directly in a browser or serve it with a static file server such as:
```bash
npx serve dist
```

## Calculation Logic
- Uses the energy equivalence formula `sourcePower * sourceTime = targetPower * targetTime`.
- Accepts four-digit keypad input representing minutes and seconds, then normalizes to total seconds.
- Conversion result is rendered in `mm:ss` format, with additional total seconds displayed in the UI.

## npm Scripts
- `npm run clean` — Remove `build/` and `dist/` directories.
- `npm run build` — Bundle TypeScript and styles with esbuild.
- `npm run inline-css` — Inline CSS into the HTML template.
- `npm run bundle-html` — Inline JavaScript into the HTML template.
- `npm run dist` — Execute the full clean/build/inline pipeline.
- `npm test` — Run the Vitest suite once.
- `npm test -- --coverage` — Run tests with coverage reporting.

## License
ISC (see `package.json`).

