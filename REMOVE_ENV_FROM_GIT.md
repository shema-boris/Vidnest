# Remove .env Files from Git History

Your Frontend `.env` file was previously committed to Git. Here's how to remove it:

## Step 1: Remove from Git tracking (keep local file)

```bash
# From the root of your project
git rm --cached Frontend/.env
git rm --cached backend/.env

# Commit the removal
git add .gitignore
git commit -m "Remove .env files from Git tracking and update .gitignore"
```

## Step 2: Verify .env files are now ignored

```bash
git status
```

You should see that `.env` files are no longer tracked.

## Step 3: (IMPORTANT) Remove from Git history

If the `.env` contained sensitive data (passwords, API keys), you need to remove it from Git history:

### Option A: Using git filter-repo (Recommended)

```bash
# Install git-filter-repo (if not installed)
# Windows: pip install git-filter-repo
# Mac: brew install git-filter-repo

# Remove Frontend/.env from entire history
git filter-repo --path Frontend/.env --invert-paths

# Remove backend/.env from entire history (if it was committed)
git filter-repo --path backend/.env --invert-paths
```

### Option B: Using BFG Repo-Cleaner (Alternative)

```bash
# Download BFG from https://rtyley.github.io/bfg-repo-cleaner/
# Then run:
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## Step 4: Force push (if you've already pushed to remote)

⚠️ **WARNING**: This rewrites history. Coordinate with your team first!

```bash
git push origin --force --all
git push origin --force --tags
```

## Step 5: Rotate any exposed secrets

If your `.env` contained:
- Database passwords → Change them
- API keys → Regenerate them
- JWT secrets → Generate new ones
- SMTP passwords → Update them

**Why?** Once committed to Git, assume the secrets are compromised.

---

## Quick Fix (If no sensitive data was in .env)

If your `.env` files didn't contain real secrets yet:

```bash
# Just remove from tracking
git rm --cached Frontend/.env
git rm --cached backend/.env
git add .gitignore
git commit -m "Remove .env files from tracking"
git push
```

This is sufficient if the `.env` files were empty or only had placeholder values.

---

## Prevent Future Commits

Your `.gitignore` is now updated to prevent this. Always verify before committing:

```bash
git status
```

If you see `.env` files listed, they're NOT being ignored correctly.
