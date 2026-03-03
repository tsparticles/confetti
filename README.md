# tsParticles confetti website

tsParticles official confetti website

<https://confetti.js.org>

Development
-----------

Install dependencies (uses pnpm):

```bash
pnpm install
```

Common commands:

- `pnpm run build` — generate `public/js/confetti-modes.js` from `confetti-modes.handlebars`
- `pnpm run deploy` — run the deploy script (`deploy.cjs`)
- `pnpm run lint` — run ESLint for `public/js`
- `pnpm run lint:fix` — run ESLint with `--fix` on `public/js`
- `pnpm run format` — run Prettier to format the repository

CI
--

The repository includes a GitHub Actions workflow `.github/workflows/lint.yml` that runs `pnpm install`, `pnpm run lint`, and `pnpm run format:check` on pushes and PRs. ESLint treats certain rules as errors (e.g. `no-unused-vars`) while warnings are left permissive.
