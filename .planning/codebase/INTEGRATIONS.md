External Integrations

Summary

- This project is a static website; integration points are primarily hosting and CI/CD.

Detected integrations

- GitHub repository: remote at `https://github.com/matteobruni/confetti.git` (see `package.json` `repository`)
- GitHub Pages: `gh-pages` devDependency and `.github/workflows/deploy.yml` indicate deployment to GitHub Pages
- Static hosting: `homepage` field set to `https://confetti.js.org`

Auth / APIs

- No external API keys or third-party API clients found in the repository files scanned.

Datastores

- No databases or persistent datastores detected — site is static assets only.

Webhooks / External services

- No explicit webhooks or external services configured in repo (no server-side code).

CI/CD

- GitHub Actions workflows present: `.github/workflows/nodejs.yml` and `.github/workflows/deploy.yml` manage testing/build and deployment.

Recommendations

- If releasing from CI, ensure deployment secrets (GH_TOKEN or similar) are stored in GitHub Actions secrets, not in repo.
- Document the required GitHub secret names used by `.github/workflows/deploy.yml` in this document for future maintainers.

Useful paths

- `package.json` - repository/homepage metadata
- `.github/workflows/deploy.yml` - deployment workflow
- `.github/workflows/nodejs.yml` - CI/test workflow
