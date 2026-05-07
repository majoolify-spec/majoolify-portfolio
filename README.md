# Majoolify Portfolio

Agency-first portfolio for **Majoolify** (Ahmed Majoul), built with Next.js App Router and a live Git-backed backoffice.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Auth.js (GitHub OAuth)
- Zod validation
- MDX case-study bodies
- Resend contact delivery

## Routes

- `/` redirects to `/en`
- `/en` and `/fr` localized homepage
- `/[locale]/work/[slug]` case-study detail page
- `/admin` backoffice
- `/admin/case-studies/[slug]` case-study editor
- `/api/contact` inquiry endpoint

## Content structure

- `content/site.json`
- `content/locales/en/home.json`
- `content/locales/fr/home.json`
- `content/case-studies/<slug>/meta.json`
- `content/case-studies/<slug>/en.mdx`
- `content/case-studies/<slug>/fr.mdx`
- `public/uploads/portfolio/*`

## Local setup

1. Install dependencies:
```bash
nvm use
npm ci
```
2. Create local environment file:
```bash
cp .env.example .env.local
```
3. Start dev server:
```bash
npm run dev
```
4. Open [http://localhost:3000/en](http://localhost:3000/en).

## Environment variables

Required for production auth:
- `AUTH_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `GITHUB_ADMIN_USERS`

Required for GitHub content publishing:
- `GITHUB_CONTENTS_TOKEN`
- `GITHUB_REPO_OWNER`
- `GITHUB_REPO_NAME`
- optional: `GITHUB_REPO_BRANCH`

Required for contact email delivery:
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

Development-only helpers:
- `ADMIN_BYPASS_TOKEN`
- `ADMIN_PUBLISH_DRY_RUN`

## Backoffice publishing modes

- `github` mode: pushes content updates through GitHub Contents API.
- `dry-run` mode (`ADMIN_PUBLISH_DRY_RUN=1`): validates writes without persisting.
- `local` fallback mode: writes to local filesystem (useful for local development only).

## Verification

```bash
npm run verify
npm run e2e:smoke
```

`npm run verify` runs lint, typecheck, unit tests, and production build.

The repository expects Node `22.13.0` from [.nvmrc](</C:/Users/majou/Desktop/Figma projects/majoolify-portfolio/.nvmrc>) to avoid install-time engine warnings from the current lint toolchain.

## Deployment

Use [DEPLOYMENT.md](C:\Users\majou\Desktop\Figma projects\majoolify-portfolio\DEPLOYMENT.md) for a step-by-step Vercel and GitHub setup checklist.
