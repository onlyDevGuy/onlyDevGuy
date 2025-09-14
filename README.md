# Sizwe Ramokhali - Web Profile

A modern, responsive web profile showcasing my skills in Python, JavaScript, VB.NET, and Web Development. Features a personal blog with admin functionality for creating and managing posts.

## Features

- **Responsive Design**: Modern, mobile-first design with smooth animations
- **Portfolio Sections**: 
  - Python Projects
  - JavaScript Projects
  - VB.NET Projects
  - Web Projects
- **Personal Blog**: 
  - Create, edit, and delete blog posts
  - Rich text editor with media support
  - Category filtering and search
  - Admin authentication system
- **Contact Form**: Integrated contact functionality
- **Dark/Light Theme**: Toggle between themes

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS, Custom CSS
- **Icons**: Font Awesome
- **Backend**: Azure Static Web Apps API
- **Database**: JSON-based storage (no subscription required)

## Deployment

### Prerequisites

- GitHub account
- Azure account (free tier available)
- Git installed locally

### Step 1: GitHub Setup

1. Create a new repository on GitHub
2. Clone the repository locally:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

3. Copy all project files to the repository directory
4. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Step 2: Azure Static Web Apps Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Static Web Apps" and create a new resource
3. Choose "Free" pricing tier
4. Connect to your GitHub repository
5. Configure build settings:
   - **App location**: `/`
   - **API location**: `/api`
   - **Output location**: (leave empty for static sites)

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secret:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: Copy from Azure Static Web Apps deployment token

### Step 4: Deploy

1. The deployment will automatically trigger when you push to the main branch
2. Monitor the deployment in the Actions tab of your GitHub repository
3. Once deployed, your site will be available at the provided Azure URL

## Local Development

1. Clone the repository
2. Open `index.html` in a web browser
3. For API testing, you can use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## Admin Access

- **Password**: `Sizwe@Admin2025`
- Access the admin panel by clicking "Create New Blog" on the blog page
- Login to create, edit, and delete blog posts

## File Structure

```
├── index.html              # Main homepage
├── blog.html              # Blog page
├── python-projects.html   # Python projects showcase
├── javascript-projects.html # JavaScript projects showcase
├── vbnet-projects.html    # VB.NET projects showcase
├── web-projects.html      # Web projects showcase
├── styles.css             # Main stylesheet
├── blog.css              # Blog-specific styles
├── scripts.js            # Main JavaScript functionality
├── blog.js               # Blog functionality
├── auth.js               # Authentication system
├── api/
│   ├── blog.js           # Blog API endpoint
│   └── blog-posts.json   # Blog posts storage
├── assets/               # Images and media files
└── .github/workflows/    # GitHub Actions for deployment
```

## Customization

### Adding New Projects

1. Update the respective project HTML file
2. Add project data to the corresponding JavaScript file
3. Update navigation links if needed

### Modifying Blog Categories

1. Edit the category options in `blog.html` (lines 71-77)
2. Update the filter options in `blog.html` (lines 129-136)

### Changing Admin Password

1. Open `auth.js`
2. Update the `passwordHash` variable (line 10)
3. Generate a new hash using the `hashPassword` method

## Support

For questions or issues, please contact:
- Email: SizweRamokhali246@gmail.com
- LinkedIn: [Sizwe Ramokhali](https://www.linkedin.com/in/sizweware)

## License

This project is open source and available under the [MIT License](LICENSE).
