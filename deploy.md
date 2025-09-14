# Deployment Guide

## Quick Start Deployment

### 1. GitHub Repository Setup

1. **Create a new repository on GitHub:**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it: `sizwe-web-profile` (or your preferred name)
   - Make it public
   - Don't initialize with README (we already have one)

2. **Upload your code:**
   ```bash
   # Initialize git in your project folder
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Web Profile with Blog"
   
   # Add remote origin (replace with your repository URL)
   git remote add origin https://github.com/yourusername/sizwe-web-profile.git
   
   # Push to GitHub
   git push -u origin main
   ```

### 2. Azure Static Web Apps Setup

1. **Go to Azure Portal:**
   - Visit [portal.azure.com](https://portal.azure.com)
   - Sign in with your Microsoft account

2. **Create Static Web App:**
   - Search for "Static Web Apps" in the search bar
   - Click "Create" → "Static Web App"
   - Choose "Free" pricing tier
   - Select your subscription
   - Create a new resource group or use existing
   - Name: `sizwe-web-profile` (or your preferred name)
   - Region: Choose closest to your location
   - Source: GitHub
   - Sign in to GitHub and select your repository
   - Branch: `main`
   - Build Presets: Custom
   - App location: `/`
   - API location: `/api`
   - Output location: (leave empty)

3. **Deploy:**
   - Click "Review + Create"
   - Click "Create"
   - Wait for deployment to complete (5-10 minutes)

### 3. Get Your Live URL

1. Once deployment is complete, go to your Static Web App resource
2. Click on "URL" to get your live website link
3. Your site will be available at: `https://your-app-name.azurestaticapps.net`

### 4. Test Your Blog

1. Visit your live site
2. Go to the Blog section
3. Click "Create New Blog"
4. Login with password: `Sizwe@Admin2025`
5. Create a test blog post
6. Verify it appears on your blog

## Features After Deployment

✅ **Free Hosting**: No subscription required  
✅ **Custom Domain**: Can be added later  
✅ **SSL Certificate**: Automatically provided  
✅ **Global CDN**: Fast loading worldwide  
✅ **GitHub Integration**: Auto-deploy on code changes  
✅ **Blog Functionality**: Create, edit, delete posts  
✅ **Admin Authentication**: Secure admin access  
✅ **Responsive Design**: Works on all devices  

## Troubleshooting

### If deployment fails:
1. Check GitHub Actions tab for error details
2. Ensure all files are committed and pushed
3. Verify the API token is correctly set in GitHub secrets

### If blog doesn't work:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Test with a simple blog post first

### If admin login fails:
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Verify password: `Sizwe@Admin2025`

## Next Steps

1. **Custom Domain**: Add your own domain name
2. **Analytics**: Add Google Analytics or similar
3. **SEO**: Optimize meta tags and descriptions
4. **Backup**: Regular backups of your blog posts
5. **Content**: Start creating your blog content!

## Support

If you encounter any issues:
- Check the GitHub repository issues
- Contact: SizweRamokhali246@gmail.com
- LinkedIn: [Sizwe Ramokhali](https://www.linkedin.com/in/sizweware)
