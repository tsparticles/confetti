# tsParticles confetti website

tsParticles official confetti website

<https://confetti.js.org>

## Development

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

## CI

The repository includes a GitHub Actions workflow `.github/workflows/lint.yml` that runs `pnpm install`, `pnpm run lint`, and `pnpm run format:check` on pushes and PRs. ESLint treats certain rules as errors (e.g. `no-unused-vars`) while warnings are left permissive.

## Contributing

Quick checklist for contributors:

- Fork the repo and create a feature branch: `git checkout -b feat/your-change`
- Install dependencies: `pnpm install`
- Before committing run:
  - `pnpm run format` to apply Prettier formatting
  - `pnpm run lint` to run ESLint (fix issues with `pnpm run lint:fix`)
- Commit changes with a clear message and push your branch
- Open a Pull Request describing the change and linking relevant issues

Notes:

- Generated files (e.g. `public/js/confetti-modes.js`) are ignored by ESLint and should not be edited directly; update the source `confetti-modes.handlebars` and run the build.
- Maintain code style by running `pnpm run format` and `pnpm run lint` locally.

## Node version

This project requires a Node.js LTS release. We recommend using `nvm` to manage Node versions and to install the current LTS:

```bash
nvm install --lts
nvm use --lts
```

After switching Node versions, run `pnpm install` to ensure dependencies are installed for the correct environment.

## Husky & local hooks

Husky is used to run pre-commit hooks that format code and run ESLint auto-fixes. To enable hooks locally, simply run:

```bash
pnpm install
# or if hooks are not installed: pnpm dlx husky install
```

If a pre-commit hook blocks your commit and you need to bypass it for an emergency, you can use `git commit --no-verify`, but avoid doing this routinely.
