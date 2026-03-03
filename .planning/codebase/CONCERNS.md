Technical Concerns & Risks

Immediate observations

- No automated tests or linter — risk of regressions when editing runtime JS in `public/js/`.
- Runtime JS lives directly in `public/js/` with no module system or bundling; this can make maintenance harder as complexity grows.

Security

- Repository contains no server-side code and no credentials detected. Ensure GitHub Actions secrets are used for deployment keys.

Performance

- Static assets are served as-is. Consider minification for JS/CSS and adding caching headers via hosting configuration.

Maintainability

- Lack of `src/` directory and build pipeline for JS: recommend moving authoring files to `src/` and using a bundler.
- Lack of code quality tools: add ESLint, Prettier, and tests to reduce accidental breakage.

Areas likely to cause friction

- Hand-edited `public/js/` files can diverge in style and quality; onboarding new contributors may be harder.
- Build/deploy steps rely on `deploy.cjs` and GitHub Actions; ensure these scripts are documented and their required secrets are described in repo docs.

Next action items

1. Add linting and basic tests (low-effort) to CI.
2. Document deployment secrets and any required environment variables in `README.md` or a secure internal doc.
3. Consider simple bundling/minification step for production assets.

Useful paths

- `public/js/`
- `deploy.cjs`
- `.github/workflows/deploy.yml`
