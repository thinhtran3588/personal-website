# Deployment

This guide covers deploying the Next.js Starter Kit to production using **Firebase** for backend services and **Cloudflare Pages** for static hosting, with **GitHub Actions** for CI/CD automation.

## Table of Contents

1. [Overview](#overview)
2. [Firebase Setup](#firebase-setup)
3. [Cloudflare Pages Setup](#cloudflare-pages-setup)
4. [GitHub Actions CI/CD](#github-actions-cicd)
5. [Environment Variables](#environment-variables)

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

## Firebase Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** and follow the wizard
3. Enable **Google Analytics** if desired (used by the Analytics module)

### 2. Enable Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Enable the providers you need:
   - **Email/Password** — required for email sign-in/sign-up
   - **Google** — required for "Continue with Google" flow
3. Under **Authorized domains**, add your production domain (e.g., `yourdomain.com`)

### 3. Create a Firestore Database

1. Navigate to **Firestore Database** → **Create database**
2. Choose a region close to your users
3. Start in **production mode** (rules will be deployed separately)

### 4. Get Firebase Client Configuration

1. Navigate to **Project settings** → **General**
2. Under **Your apps**, click the **Web** icon (`</>`) to register a web app
3. Copy the Firebase config object as a JSON string:

```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "measurementId": "..."
}
```

4. This entire JSON object is stored as a single environment variable `NEXT_PUBLIC_FIREBASE_CONFIG` (see [Environment Variables](#environment-variables))

### 5. Deploy Firestore Security Rules

Firestore security rules live in `firestore.rules` at the project root. Deploy them manually through the [Firebase Console](https://console.firebase.google.com/):

1. Navigate to **Firestore Database** → **Rules**
2. Copy the contents of `firestore.rules` into the editor
3. Click **Publish**

> **Note**: Security rules rarely change, so manual deployment through the console is sufficient.

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
| `NEXT_PUBLIC_FIREBASE_CONFIG` | Firebase web config JSON (see [Firebase Setup](#4-get-firebase-client-configuration)) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token (for Pages deployment) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

> **Note**: You do **not** need to add environment variables in the Cloudflare Pages dashboard. The `NEXT_PUBLIC_FIREBASE_CONFIG` secret is injected during the GitHub Actions build step, so the values are embedded into the static site at build time.

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

The Firebase configuration is provided through a single environment variable containing the full web config as a JSON string.

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_CONFIG` | Firebase web config JSON | `{"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"...","measurementId":"..."}` |

This variable is prefixed with `NEXT_PUBLIC_` so it is embedded into the static site at build time.

### Local Development

For local development, copy `.env.development` and fill in your value:

```bash
cp .env.development .env.local
```

Edit `.env.local` with your Firebase config JSON. This file is git-ignored and safe for local secrets.

### Production

For production builds, set `NEXT_PUBLIC_FIREBASE_CONFIG` as a **GitHub Actions secret**. It is injected at build time and embedded into the static output — no additional configuration is needed in Cloudflare Pages.
