Repository Structure

Top-level
- `package.json` — scripts, dependencies, metadata
- `confetti-modes.handlebars` — build-time template
- `deploy.cjs` — deployment script
- `public/` — compiled static site (served to users)
- `.github/workflows/` — CI and deployment workflows

`public/` breakdown
- `public/index.html` — site entry HTML
- `public/js/` — runtime JavaScript files (e.g. `main.js`, `explosions.js`, `confetti-modes.js`)
- `public/css/` — stylesheets (e.g. `main.css`, `more.css`)
- `public/ads.txt`, `CNAME`, `sitemap.xml` — hosting/SEO files

Build artifacts vs source
- The repo stores runtime assets in `public/` and the Handlebars template used to generate `public/js/confetti-modes.js`.
- There isn't a separate `src/` directory for client source files; JS appears authored directly in `public/js/` and templates.

Conventions
- Naming: files in `public/js/` use descriptive names: `main.js`, `explosions.js`, `shapes.js`, etc.
- Tests: no dedicated `test/` directory found.

Files of interest
- `public/js/main.js` — primary runtime script
- `confetti-modes.handlebars` — mode definitions template
- `.github/workflows/deploy.yml` — deployment pipeline

Recommendations
- If adding non-trivial client-side logic, adopt a `src/` → `dist/` structure and a bundler to compile/minify files into `public/`.
- Add a `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` if community contributions are expected.
