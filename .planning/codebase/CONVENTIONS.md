Coding Conventions

Style and Formatting

- Language: JavaScript for both runtime and build scripts. Project now includes ESLint (flat config) and Prettier for formatting.
- Formatting: Prettier is configured (`.prettierrc`) and applied across the repo. Use `pnpm dlx prettier --write .` or `npm run format` to reformat files.

Linting

- ESLint is configured using a flat config `eslint.config.cjs` and targets `public/js` by default. Run `pnpm dlx eslint public/js --ext .js` or `npm run lint`.
- CI: a GitHub Actions workflow `.github/workflows/lint.yml` runs `pnpm install`, `pnpm run lint`, and `pnpm run format:check` on pushes and PRs. ESLint is configured to treat `no-unused-vars` as an error; warnings are allowed.

Notes

- The generated file `public/js/confetti-modes.js` is ignored by ESLint via `eslint.config.cjs` because it is output from Handlebars templates. Keep generated files excluded from linting to avoid false positives.
  Naming

- Files use kebab/camel style depending on context (e.g. `main.js`, `confetti-modes.handlebars`). Keep to consistent kebab-case for filenames.

Error handling

- Build scripts like `deploy.cjs` should handle errors and exit with non-zero codes; review for robust error messages.

Documentation

- `README.md` is present at repo root but could be expanded with development setup, build, and deployment steps.

Recommended additions

1. Keep CI green: ensure contributors run `pnpm install` and `npm run lint` locally before pushing.
2. Document Node.js engine in `package.json` `engines` field if CI requires a specific runtime (recommended: Node 18+).

Useful paths

- `public/js/` — runtime code to standardize
- `deploy.cjs` — build/deploy scripts
- `package.json` — add lint/format scripts here
 - `.prettierrc`, `eslint.config.cjs`, `.github/workflows/lint.yml` — added to repo to enforce style and CI checks

Pre-commit hooks

- The project uses `husky` + `lint-staged` to run formatting and lint fixes before commits.
- Pre-commit hook runs: `pnpm run format`, `pnpm run lint:fix`, then `pnpm run lint` (commit will fail if ESLint reports errors).
- `lint-staged` targets `public/js/**/*.js` (runs `lint:fix` + `prettier --write`) and formats changed files of other types.
- To enable hooks locally run `pnpm install` (the `prepare` script runs `husky install`).

- `.prettierrc`, `eslint.config.cjs`, `.github/workflows/lint.yml` — added to repo to enforce style and CI checks
