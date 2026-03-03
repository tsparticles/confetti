Architecture Overview

High-level

- This repository is a small static site project. The architecture is single-page/static assets with build-time templating.
- No backend services — all logic runs in the browser or in Node.js build scripts.

Runtime flow

1. Author edits templates (`confetti-modes.handlebars`) and static assets (`public/` and `public/js/`).
2. Build step (optional): `npm run build` generates `public/js/confetti-modes.js` via Handlebars.
3. Deployed static assets served by GitHub Pages or another static host.

Components

- Templates: `confetti-modes.handlebars` — Handlebars template for confetti modes.
- Static JavaScript: `public/js/*.js` — runtime scripts that implement confetti behavior (e.g. `main.js`, `explosions.js`, `shapes.js`).
- Build & Deploy scripts: `deploy.cjs`, `package.json` scripts, GitHub Actions.

Entry points

- `public/index.html` — main HTML file served to the browser.
- `public/js/main.js` — attaches behavior to the page and uses other JS files in `public/js/`.

Data flow

- No server-side data flow. All data is either static (templates/assets) or generated at build-time.

Scalability

- Current architecture suits small static sites. For dynamic features, add a backend or serverless functions.

Observations

- Clear separation between build-time templates and runtime static assets.
- Consider adding source JS (ES modules) if future development introduces complex client-side logic; currently runtime JS appears to be plain concatenated files in `public/js/`.

Suggestions for migrating to a source-based workflow

- Introduce a `src/` directory for authoring ES modules (e.g. `src/index.js`, `src/modes/*.js`) and move hand-authored logic out of `public/js/`.
- Use a fast bundler (esbuild) to bundle and minify modules into `public/js/` as part of the build step. Example `package.json` scripts:

  ```json
  "scripts": {
    "build": "esbuild src/index.js --bundle --minify --outfile=public/js/main.js",
    "build:ci": "npm run build"
  }
  ```

- Keep `confetti-modes.handlebars` as the source for generated modes; consider generating `src/modes.js` from the template if modes evolve programmatically.
- Add source maps for easier debugging in development: `esbuild --sourcemap` or use `--dev` options for your chosen bundler.


Useful paths

- `public/index.html`
- `public/js/main.js`
- `confetti-modes.handlebars`
- `deploy.cjs`
