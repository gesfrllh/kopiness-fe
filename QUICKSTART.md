# 🚀 Quick Start: CI/CD Pipeline

## TL;DR - 3 Steps to Deploy

### Step 1: Local Setup (2 minutes)
```bash
# Install and setup
bash scripts/setup-cicd.sh

# OR manually
npm i -g vercel
vercel login
vercel link
```

### Step 2: Get Vercel Credentials
```bash
# Get these 3 values
cat .vercel/project.json
vercel whoami

# Go to https://vercel.com/account/tokens and create token
```

### Step 3: Add GitHub Secrets
**Repository → Settings → Secrets and variables → Actions**

```
VERCEL_TOKEN = <your_token>
VERCEL_PROJECT_ID = <from_step_2>
VERCEL_ORG_ID = <from_step_2>
NEXT_PUBLIC_API_BASE_URL = https://api.kopiness.com
```

---

## Done! 🎉

Now every push to `main` → deployes to Production  
Every push to `development` → deploys to Preview

---

## What Gets Checked

```
Your Push ↓
├─ yarn lint ✅
├─ yarn tsc --noEmit ✅
├─ yarn build ✅
└─ Deploy to Vercel 🚀
```

---

## Common Commands

```bash
# Check locally before pushing
yarn lint
yarn build

# View deployments
vercel list

# Manual deploy
vercel --prod
```

---

## Already Have Issues?

Check: `CI-CD-SETUP.md` (detailed) or `CICD-CHECKLIST.md` (full checklist)

---

## Workflows

- **`ci-cd.yml`** - Main: Lint + Build + Auto Deploy (needs Vercel secrets)
- **`quick-check.yml`** - Alternative: Just Lint + Build (no secrets needed)

Default: `ci-cd.yml` runs on `main` and `development` branches  
Fallback: `quick-check.yml` runs on ALL branches/PRs

---

That's it! Questions? Read the setup docs or check GitHub Actions logs. 🚀
