Coding Conventions

Style and Formatting
- Language: JavaScript for both runtime and build scripts. Code style appears conventional; no linter config found (e.g. ESLint) in repository root.
- Whitespace & formatting: repository contains hand-authored JS in `public/js/` with mixed styles. Consider adding a formatting tool (Prettier) and linter (ESLint).

Naming
- Files use kebab/camel style depending on context (e.g. `main.js`, `confetti-modes.handlebars`). Keep to consistent kebab-case for filenames.

Error handling
- Build scripts like `deploy.cjs` should handle errors and exit with non-zero codes; review for robust error messages.

Documentation
- `README.md` is present at repo root but could be expanded with development setup, build, and deployment steps.

Recommended additions
1. Add ESLint + Prettier configuration to standardize style. Example files:
   - `.eslintrc.json`
   - `.prettierrc`
2. Introduce `npm run lint` and `npm run format` scripts.
3. Document Node.js engine in `package.json` `engines` field.

Useful paths
- `public/js/` — runtime code to standardize
- `deploy.cjs` — build/deploy scripts
- `package.json` — add lint/format scripts here
