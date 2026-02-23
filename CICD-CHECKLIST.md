# 🚀 CI/CD Pipeline Setup Checklist

## Files Created
- ✅ `.github/workflows/ci-cd.yml` - Main GitHub Actions workflow
- ✅ `CI-CD-SETUP.md` - Detailed setup guide
- ✅ `.lintstagedrc.json` - Lint-staged config for pre-commit
- ✅ `scripts/setup-cicd.sh` - Automated setup script

---

## Setup Checklist

### Phase 1: Local Setup (Do This First)
- [ ] Run setup script:
  ```bash
  bash scripts/setup-cicd.sh
  ```
  OR manually:
  ```bash
  yarn install
  yarn husky install
  npx husky add .husky/pre-commit "yarn lint-staged"
  ```

- [ ] Test locally:
  ```bash
  yarn lint        # Check linting
  yarn tsc --noEmit  # Check types
  yarn build       # Build project
  ```

### Phase 2: Vercel Setup
- [ ] Install Vercel CLI:
  ```bash
  npm i -g vercel
  ```

- [ ] Link Vercel project:
  ```bash
  vercel login
  vercel link
  ```
  This creates `.vercel/project.json` with your credentials.

- [ ] Verify it works:
  ```bash
  vercel
  ```

### Phase 3: GitHub Secrets Setup
Go to: **GitHub Repository → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret | How to Get |
|--------|-----------|
| `VERCEL_TOKEN` | [Create here](https://vercel.com/account/tokens) - click "Create Token" |
| `VERCEL_PROJECT_ID` | Run: `cat .vercel/project.json` or check `.vercel/project.json` |
| `VERCEL_ORG_ID` | Run: `vercel whoami` or check `.vercel/project.json` |
| `NEXT_PUBLIC_API_BASE_URL` | Your API endpoint (e.g., `https://api.kopiness.com`) |

**Quick Copy:**
```bash
# Get all values
cat .vercel/project.json
echo "Org: $(vercel whoami)"

# Get/create token
open https://vercel.com/account/tokens
```

### Phase 4: Test Pipeline
- [ ] Push to `development` branch:
  ```bash
  git checkout development
  git add .
  git commit -m "chore: add CI/CD pipeline"
  git push origin development
  ```

- [ ] Check GitHub Actions:
  1. Go to **GitHub Repository → Actions**
  2. Look for "CI/CD Pipeline" workflow
  3. Click to see logs
  4. Should see: ✅ Lint ✅ Build ✅ Deploy

- [ ] Verify Vercel deployment:
  - Check [Vercel Dashboard](https://vercel.com/dashboard)
  - Should show deployment running
  - Wait for ✅ Complete

---

## Pipeline Flow

```
Your Push → GitHub Actions
    ↓
┌─────────────────────────┐
│  Job 1: Lint & Build    │
├─────────────────────────┤
│ 1. Install deps         │ ~30sec
│ 2. Run ESLint           │ ~5sec
│ 3. TypeScript check     │ ~10sec
│ 4. Build Next.js        │ ~60sec
└─────────────────────────┘
    ↓ (if success)
┌─────────────────────────┐
│ Job 2: Deploy to Vercel │
├─────────────────────────┤
│ If main branch:         │
│   → Deploy Production   │ ~2-3min
│                         │
│ If development branch:  │
│   → Deploy Preview      │ ~2-3min
└─────────────────────────┘
    ↓
✅ Done! Check Vercel dashboard or PR comments
```

---

## Branch Strategy

| Branch | What Happens | Deploy To |
|--------|-------------|-----------|
| `development` | Runs on every push | Vercel Preview (staging) |
| `main` | Runs on every push | Vercel Production |
| Other branches | Runs on PR | No auto-deploy |

---

## Useful Commands

```bash
# Run all checks locally before committing
yarn lint
yarn tsc --noEmit
yarn build

# View pipeline status
git log --oneline  # See your commits
# Then go to GitHub Actions to view

# Deploy manually (optional)
vercel          # Preview deployment
vercel --prod   # Production deployment

# View Vercel deployments
vercel list

# Check Husky hooks
cat .husky/pre-commit
```

---

## Troubleshooting

### ❌ GitHub Action fails with "npm ERR!"
- Check `package.json` has all required scripts
- Solution: `yarn add --lock-only` and push

### ❌ "NEXT_PUBLIC_API_BASE_URL" is undefined
- Go to GitHub Secrets and add the variable
- Solution: See Phase 3 above

### ❌ "Vercel deploy failed"
- Check VERCEL_TOKEN is valid (not expired)
- Solution: Create new token at https://vercel.com/account/tokens

### ❌ Lint-staged not running before commit
- Solution: Run `yarn husky install` again
- Verify: `ls -la .husky/pre-commit`

---

## What's Happening Behind the Scenes

### GitHub Actions Workflow
```yaml
On: push to main/development or PR to main/development
Then:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (yarn)
4. Run: yarn lint
5. Run: yarn tsc --noEmit (type check)
6. Run: yarn build
7. If success → Deploy to Vercel
```

### Pre-commit Hook (Husky)
```
When you: git commit
Then:
1. Run: yaml lint-staged
2. Which runs: yarn lint on changed files
3. Auto-fix issues with ESLint
4. If errors remain: commit is blocked
5. Otherwise: commit accepted
```

---

## Next Steps

1. ✅ Complete all checklist items above
2. ✅ Make a test commit and push
3. ✅ Monitor GitHub Actions for first run
4. ✅ Check Vercel deployment
5. ✅ Create PR from `development` to `main`
6. ✅ Test that PR shows deployment status in comments

---

## FAQ

**Q: Can I disable auto-deployment?**
A: Yes, remove the `deploy-vercel` job from `.github/workflows/ci-cd.yml`

**Q: Where do I see deployment logs?**
A: 
- GitHub Actions → Job logs
- Vercel Dashboard → Deployment details

**Q: How do I rollback a deployment?**
A: On Vercel Dashboard, click the previous deployment and "Promote to Production"

**Q: Can I deploy manually without GitHub?**
A: Yes! Run `vercel --prod` from your terminal

**Q: I forgot my VERCEL_TOKEN**
A: Generate a new one at https://vercel.com/account/tokens

---

## Support

For issues with:
- **GitHub Actions**: Check workflow logs in GitHub Actions tab
- **Vercel**: Check Vercel Dashboard or [Vercel Docs](https://vercel.com/docs)
- **ESLint**: Run `yarn lint --debug` locally
- **TypeScript**: Run `yarn tsc --noEmit` locally

---

Last Updated: 2024
Status: ✅ Ready to Deploy
