# CI/CD Pipeline Setup Guide

## Overview
Pipeline ini melakukan:
1. ✅ **Lint** - Check code quality dengan ESLint
2. ✅ **Type Check** - Validate TypeScript
3. ✅ **Build** - Build Next.js production
4. 🚀 **Deploy to Vercel** - Auto deploy ke Vercel

**Branches:**
- `main` → Deploy ke **Production**
- `development` → Deploy ke **Preview** (staging)

---

## Setup Instructions

### 1. Vercel Project Setup

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Link project ke Vercel
vercel link

# Selesai! Vercel akan create `.vercel` folder dengan config
```

#### Option B: Manual Setup
Jika udah ada Vercel project, ambil credentials dari Vercel dashboard:

### 2. GitHub Secrets Configuration

Tambahkan secrets ini ke repository GitHub:

**Settings → Secrets and variables → Actions**

| Secret Name | Value | How to Find |
|---|---|---|
| `VERCEL_TOKEN` | Vercel API Token | [Create Token](https://vercel.com/account/tokens) |
| `VERCEL_PROJECT_ID` | Project ID | `.vercel/project.json` atau Vercel dashboard |
| `VERCEL_ORG_ID` | Organization ID | `vercel whoami` atau Vercel dashboard |
| `NEXT_PUBLIC_API_BASE_URL` | API URL | Your backend API URL (e.g., `https://api.example.com`) |

**Example Settings Page:**
```
VERCEL_TOKEN = vercel_xxxxxxxxxxxxx
VERCEL_PROJECT_ID = prj_xxxxxxxxxxxxx
VERCEL_ORG_ID = team_xxxxxxxxxxxxx
NEXT_PUBLIC_API_BASE_URL = https://api.kopiness.com
```

---

## How to Get Vercel Credentials

### Step 1: Get VERCEL_TOKEN
1. Go to [https://vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token

### Step 2: Get PROJECT_ID & ORG_ID
```bash
# Run this command
vercel projects list

# Or check in .vercel/project.json after running `vercel link`
cat .vercel/project.json
```

---

## Pipeline Flow

```
Push to GitHub (main or development)
         ↓
   ⚡ Lint & Build Job
   - Install dependencies
   - Run ESLint
   - TypeScript check
   - Build Next.js
         ↓
   🚀 Deploy Job (needs: lint-and-build)
   - If main branch → Deploy to production
   - If development → Deploy to preview
   - Comment PR with deployment URL
```

---

## ENV Variables

Your app uses these environment variables:

**`.env.local` (Local Development)**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

**GitHub Secrets (CI/CD)**
```
NEXT_PUBLIC_API_BASE_URL=https://api.kopiness.com
```

---

## Manual Deployment (Optional)

Jika ingin test deployment secara manual:

```bash
# Deploy preview
vercel

# Deploy production
vercel --prod
```

---

## Troubleshooting

### ❌ "Deployment failed with status 1"
- Check `VERCEL_TOKEN` is valid
- Ensure `VERCEL_PROJECT_ID` dan `VERCEL_ORG_ID` are correct

### ❌ "Build failed"
- Check logs di GitHub Actions
- Run `yarn build` locally untuk test
- Verify `NEXT_PUBLIC_API_BASE_URL` env var terset

### ❌ "Lint errors block deploy"
- Pipeline tetap akan build meskipun lint error (continue-on-error: true)
- Tapi best practice: fix lint errors untuk code quality

---

## Next Steps

1. ✅ Uncomment/update `next.config.ts` jika ada special config
2. ✅ Setup environment variables di GitHub
3. ✅ Make a test push ke `development` branch
4. ✅ Check Actions tab untuk lihat pipeline running
5. ✅ Verify deployment di Vercel dashboard

---

## Example: View Pipeline Status

**GitHub Repository → Actions Tab**
- Lihat semua workflow runs
- Click workflow untuk lihat detail logs
- Deployment status muncul di PR comments

**Vercel Dashboard**
- Lihat deployment history
- Preview links untuk setiap deployment
- Logs dan error details

---

## Quick Commands

```bash
# Run linting locally untuk verify sebelum push
yarn lint

# Build locally
yarn build

# Check what will be deployed
yarn start

# View Vercel deployments
vercel list

# Purge Vercel cache
vercel env pull
```
