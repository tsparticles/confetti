Project Technology Stack

Summary

- Primary language: JavaScript (browser + Node.js build scripts)
- Runtime: browser (static site) and Node.js for build/deploy tasks
- Frameworks/libraries: `tsparticles` (runtime confetti lib), `handlebars` (templating)

Key files

- `package.json` - project metadata and scripts
- `confetti-modes.handlebars` - source template used at build time
- `public/js/*.js` - compiled/static JavaScript used at runtime (e.g. `public/js/main.js`)
- `deploy.cjs` - deployment script used by `npm run deploy`

Dependencies (from `package.json`)

- runtime: `tsparticles` ^3.0.3
- dev: `handlebars`, `gh-pages`, `rimraf`

Environment and build

- Build step: `npm run build` — runs Handlebars to generate `public/js/confetti-modes.js`
- Deploy step: `npm run deploy` — clears cache and runs `node deploy.cjs`
- Site is a static website hosted (see `homepage` in `package.json` and `.github/workflows/deploy.yml`)

Browser support

- Code targets modern browsers (no polyfills found). Verify support matrix if older browsers are required.

Observations / Recommendations

- Consider pinning dev-tool versions in a `pnpm-lock.yaml` (already present) and documenting Node.js engine in `package.json`.
- Add an explicit `engines.node` field if CI requires a specific Node version: e.g. "engines": { "node": "^18" }.
- If the project grows, consider introducing a minimal bundler (esbuild/rollup) for module management and minification.

Useful paths

- `package.json`
- `confetti-modes.handlebars`
- `public/js/` (runtime assets)
