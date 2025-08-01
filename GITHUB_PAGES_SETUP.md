# GitHub Pages Setup Guide

## Issue: "Resource not accessible by integration"

This error occurs when the GitHub Actions workflow doesn't have sufficient permissions to deploy to GitHub Pages.

## Solution Options

### Option 1: Manual GitHub Pages Setup (Recommended)

1. **Go to your repository on GitHub**
   - Navigate to `https://github.com/[your-username]/OrgR`

2. **Enable GitHub Pages**
   - Go to **Settings** → **Pages** (in the left sidebar)
   - Under **Source**, select "**GitHub Actions**"
   - Click **Save**

3. **Verify Repository Settings**
   - Make sure the repository is **public** (GitHub Pages requires public repos for free accounts)
   - Or ensure you have GitHub Pro/Team if using private repos

### Option 2: Use Personal Access Token (If Option 1 doesn't work)

1. **Create a Personal Access Token**
   - Go to `https://github.com/settings/tokens`
   - Click **Generate new token** → **Generate new token (classic)**
   - Select scopes: `repo`, `workflow`, `write:packages`
   - Copy the token

2. **Add Token to Repository Secrets**
   - Go to your repository **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `GH_TOKEN`
   - Value: [paste your token]

3. **Update Workflow**
   - The workflow will automatically use `secrets.GH_TOKEN` if available

### Option 3: Use Alternative Deployment Method

We've created an alternative workflow file: `.github/workflows/deploy-finclamp-alternative.yml`

This uses the `peaceiris/actions-gh-pages` action which is often more reliable.

To use it:
1. Disable the main workflow temporarily
2. Run the alternative workflow manually from the Actions tab
3. If it works, you can switch to using this method

## Troubleshooting

### If you get "Repository not found" errors:
- Make sure the repository is public
- Check that GitHub Pages is enabled in repository settings

### If you get "Permission denied" errors:
- Use Option 2 (Personal Access Token)
- Make sure the token has the correct scopes

### If builds succeed but deployment fails:
- Check that the `dist` folder is being created correctly
- Verify the path in the workflow matches your build output

## Testing

After setup, you can test by:
1. Making a small change to the finclamp app
2. Pushing to the main branch
3. Checking the Actions tab for deployment status
4. Visiting `https://[your-username].github.io/OrgR/`
