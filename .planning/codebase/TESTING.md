Testing & Test Strategy

Current state

- No test framework or test files detected in the repository.
- CI workflow `.github/workflows/nodejs.yml` exists but appears minimal; open it to confirm whether tests run.

Recommendations

1. Add minimal test setup if project logic grows: use `vitest` or `jest` for Node/browser-shared logic.
2. Add `npm run test` script and integrate it into CI (`.github/workflows/nodejs.yml`).
3. For UI/visual regressions consider snapshot testing or chromatic-like tools if the site becomes more complex.

Testing patterns

- Unit tests: isolate pure functions from `public/js/` into modules under `src/` and test with `vitest`.
- E2E / smoke tests: add a simple Puppeteer/Playwright smoke test to verify `public/index.html` loads and main script runs.

Useful paths

- `.github/workflows/nodejs.yml` — integrate test step here
- `public/js/` — candidate code to extract for unit tests
