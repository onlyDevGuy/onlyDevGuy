# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in:
   - **Repository name**: `sizwe-web-profile`
   - **Description**: `Personal web profile with blog functionality`
   - **Visibility**: Public
   - **Initialize**: Leave unchecked (we have files already)
5. Click "Create repository"

## Step 2: Upload Your Files

### Option A: Using GitHub Web Interface (Easiest)

1. In your new repository, click "uploading an existing file"
2. Drag and drop all your project files:
   - `index.html`
   - `blog.html`
   - `python-projects.html`
   - `javascript-projects.html`
   - `vbnet-projects.html`
   - `web-projects.html`
   - `styles.css`
   - `blog.css`
   - `scripts.js`
   - `blog.js`
   - `auth.js`
   - `package.json`
   - `README.md`
   - `deploy.md`
   - `staticwebapp.config.json`
   - `.github/workflows/azure-static-web-apps.yml` (create .github folder first)
   - `api/blog.js` (create api folder first)
   - `api/blog-posts.json`
   - `assets/` folder with your images

3. Add a commit message: "Initial commit - Web Profile with Blog"
4. Click "Commit changes"

### Option B: Using Git Commands

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Web Profile with Blog"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/YOURUSERNAME/sizwe-web-profile.git

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Upload

1. Check that all files are in your repository
2. Make sure the folder structure looks correct:
   ```
   sizwe-web-profile/
   ├── .github/workflows/
   ├── api/
   ├── assets/
   ├── index.html
   ├── blog.html
   └── ... (other files)
   ```

## Next Step: Azure Setup

Once your GitHub repository is ready, proceed to Azure Static Web Apps setup as described in `deploy.md`.

## Important Notes

- Keep your GitHub token private
- The Azure deployment token is different from your GitHub token
- You'll get the Azure token during the Static Web App creation process
