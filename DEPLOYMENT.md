# Deployment Checklist (Vercel + GitHub)

## 1) Prepare GitHub OAuth app

Create a GitHub OAuth app and configure:

- Homepage URL: your production domain (example: `https://majoolify.dev`)
- Authorization callback URL: `https://<your-domain>/api/auth/callback/github`

Copy values:

- Client ID -> `GITHUB_ID`
- Client secret -> `GITHUB_SECRET`

## 2) Prepare GitHub publishing token

Create a fine-grained personal access token for the portfolio repository with:

- Repository access: only the portfolio repo
- Permissions: `Contents` read and write

Set:

- `GITHUB_CONTENTS_TOKEN`
- `GITHUB_REPO_OWNER`
- `GITHUB_REPO_NAME`
- optional `GITHUB_REPO_BRANCH` (defaults to `main`)

## 3) Configure Vercel project env vars

Set in Vercel (Production environment):

- `AUTH_SECRET` (long random string)
- `NEXTAUTH_URL=https://<your-domain>`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `GITHUB_ADMIN_USERS` (comma-separated GitHub logins)
- `GITHUB_CONTENTS_TOKEN`
- `GITHUB_REPO_OWNER`
- `GITHUB_REPO_NAME`
- `GITHUB_REPO_BRANCH` (optional)
- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

Do not set development-only toggles in production:

- `ADMIN_BYPASS_TOKEN`
- `ADMIN_PUBLISH_DRY_RUN`

## 4) Configure Resend sender

- Verify the sending domain in Resend.
- Ensure `CONTACT_FROM_EMAIL` belongs to that verified domain.
- Test an inquiry submission from `/en` or `/fr`.

## 5) Deploy

1. Connect repo to Vercel.
2. Confirm build command is `npm run build`.
3. Confirm output is Next.js default.
4. Deploy to production.

## 6) Post-deploy checks

1. Open `/admin` and sign in with allowed GitHub account.
2. Confirm Runtime setup panel shows `Ready` for:
- GitHub admin auth
- Git publish backend
- Contact email delivery
3. Edit one text field in admin and publish.
4. Verify content appears on `/en` and `/fr`.
5. Submit contact form and confirm email receipt.

## 7) Rollback strategy

- Content changes are committed through GitHub API; revert by restoring previous Git commit.
- If admin publishing should stop immediately, rotate `GITHUB_CONTENTS_TOKEN` and redeploy.
