# Deployment

This guide covers deploying the personal website to production using **Cloudflare Pages** for static hosting, with **GitHub Actions** for CI/CD automation.

## Table of Contents

1. [Overview](#overview)
2. [Cloudflare Pages Setup](#cloudflare-pages-setup)
3. [GitHub Actions CI/CD](#github-actions-cicd)
4. [Environment Variables](#environment-variables)

## Overview

The deployment pipeline consists of three parts:

| Component | Purpose |
|-----------|---------|
| **Firebase** | Authentication, Firestore database, and security rules |
| **Cloudflare Pages** | Static site hosting with global CDN |
| **GitHub Actions** | Automated build, test, and deploy on push |

```
Developer → Push to GitHub → GitHub Actions → Build → Deploy to Cloudflare Pages
```

## Cloudflare Pages Setup

[Cloudflare Pages](https://pages.cloudflare.com/) hosts the statically exported Next.js site with a global CDN, automatic HTTPS, and fast deployments.

### 1. Create a Cloudflare Account

1. Sign up at [cloudflare.com](https://www.cloudflare.com/)
2. Navigate to **Workers & Pages** in the dashboard

### 2. Create a Pages Project

1. Click **Create application** → **Pages** → **Connect to Git**
2. Select your GitHub repository
3. Configure the build settings:

| Setting | Value |
|---------|-------|
| **Framework preset** | `Next.js (Static Export)` |
| **Build command** | `npm run build` |
| **Build output directory** | `out` |

> **Note**: If your Next.js app uses `output: "export"` in `next.config.ts`, the output directory is `out`. If using the default server mode with `@cloudflare/next-on-pages`, follow Cloudflare's [Next.js on Pages guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/).

### 3. Custom Domain (Optional)

1. Go to **Custom domains** in your Pages project
2. Add your domain (e.g., `yourdomain.com`)
3. Follow the DNS configuration instructions

## GitHub Actions CI/CD

GitHub Actions automates building, testing, and deploying on every push. The project includes CI workflows for both `main` and `develop` branches.

### Workflow Overview

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci-main.yml` | Push to `main` | Lint, test, build — production pipeline |
| `ci-develop.yml` | Push to `develop` | Lint, test, build — development pipeline |
| `ci-pull-requests.yml` | Pull requests | Lint, test — PR validation |

### Required GitHub Secrets

Add these secrets in your repository under **Settings** → **Secrets and variables** → **Actions**:

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token (for Pages deployment) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

### Deploy Step Example

To deploy to Cloudflare Pages from GitHub Actions, add a deploy step to your workflow:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: pages deploy out --project-name=your-project-name
```

## Environment Variables

### Local Development

For local development, copy `.env.development` and fill in your values:

```bash
cp .env.development .env.local
```

Edit `.env.local` with your configuration values. This file is git-ignored and safe for local secrets.

### Production

For production builds, set any required environment variables as **GitHub Actions secrets**. They are injected at build time and embedded into the static output — no additional configuration is needed in Cloudflare Pages.
