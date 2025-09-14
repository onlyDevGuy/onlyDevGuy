// Check if current user is admin
function isAdmin() {
    // Check if admin token exists in localStorage
    return localStorage.getItem('adminToken') === 'your-secure-admin-token';
}

// Initialize admin login
function initializeAdminLogin() {
    const loginSection = document.getElementById('admin-login');
    const loginForm = document.getElementById('admin-login-form');
    
    // Show login form if not admin
    if (!isAdmin()) {
        loginSection.style.display = 'block';
    }
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        
        // Replace this with your actual admin password
        if (password === 'your-admin-password') {
            localStorage.setItem('adminToken', 'your-secure-admin-token');
            loginSection.style.display = 'none';
            document.querySelector('.upload-section').style.display = 'block';
            initializeUploadForm();
            showNotification('Logged in as admin successfully!');
        } else {
            showNotification('Invalid admin password!', 'error');
        }
        
        loginForm.reset();
    });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const uploadSection = document.querySelector('.upload-section');
    
    // Only show upload form for admin
    if (isAdmin()) {
        uploadSection.style.display = 'block';
        initializeUploadForm();
    } else {
        uploadSection.style.display = 'none';
    }
    
    initializeAdminLogin();
    initializeProjects();
    initializeModal();
    initializeFilters();
});

// Sample projects data (replace with backend storage later)
let projects = [
    {
        id: 1,
        title: "E-commerce Platform",
        description: "A full-featured e-commerce platform with product management, shopping cart, and payment integration",
        projectType: "ecommerce",
        frontend: ["html5", "css3", "javascript", "react"],
        backend: ["nodejs"],
        database: ["mongodb"],
        features: ["responsive", "auth", "payment", "analytics"],
        media: ["ecommerce-preview.jpg"],
        websiteUrl: "https://example-shop.com",
        sourceUrl: "https://github.com/example/shop",
        rating: 4.5,
        ratings: [],
        comments: [
            { user: "Alex", text: "Great UI/UX design!", date: "2024-01-20" }
        ]
    }
];

// Handle file upload and preview
function initializeUploadForm() {
    const form = document.getElementById('project-upload-form');
    const mediaInput = document.getElementById('project-media');
    const preview = document.getElementById('media-preview');

    mediaInput.addEventListener('change', () => {
        preview.innerHTML = '';
        [...mediaInput.files].forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const element = file.type.startsWith('image/') 
                    ? createImagePreview(e.target.result)
                    : createVideoPreview(e.target.result);
                preview.appendChild(element);
            };
            reader.readAsDataURL(file);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const projectType = form.querySelector('input[name="project-type"]:checked').value;
        
        const frontend = [...form.querySelectorAll('.frontend-tags input:checked')].map(input => input.value);
        const backend = [...form.querySelectorAll('.backend-tags input:checked')].map(input => input.value);
        const database = [...form.querySelectorAll('.database-tags input:checked')].map(input => input.value);
        const features = [...form.querySelectorAll('.feature-tags input:checked')].map(input => input.value);
        
        const mediaFiles = [...mediaInput.files].map(file => URL.createObjectURL(file));
        const websiteUrl = document.getElementById('project-url').value;
        const sourceUrl = document.getElementById('project-source').value;

        // Add new project
        const project = {
            id: Date.now(),
            title,
            description,
            projectType,
            frontend,
            backend,
            database,
            features,
            media: mediaFiles,
            websiteUrl,
            sourceUrl,
            rating: 0,
            ratings: [],
            comments: []
        };

        projects.unshift(project);
        renderProjects();
        form.reset();
        preview.innerHTML = '';
        showNotification('Project uploaded successfully!');
    });
}

// Initialize filters
function initializeFilters() {
    const typeButtons = document.querySelectorAll('.type-filter .filter-btn');
    const techSelect = document.getElementById('tech-select');
    const featureSelect = document.getElementById('feature-select');
    
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects();
        });
    });
    
    techSelect.addEventListener('change', filterProjects);
    featureSelect.addEventListener('change', filterProjects);
}

// Filter projects
function filterProjects() {
    const selectedType = document.querySelector('.type-filter .filter-btn.active').dataset.type;
    const selectedTech = document.getElementById('tech-select').value;
    const selectedFeature = document.getElementById('feature-select').value;
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const typeMatch = selectedType === 'all' || card.dataset.type === selectedType;
        const techMatch = selectedTech === 'all' || card.dataset.tech.includes(selectedTech);
        const featureMatch = selectedFeature === 'all' || card.dataset.features.includes(selectedFeature);
        
        card.style.display = typeMatch && techMatch && featureMatch ? 'block' : 'none';
    });
}

// Create preview elements
function createImagePreview(src) {
    const img = document.createElement('img');
    img.src = src;
    return img;
}

function createVideoPreview(src) {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    return video;
}

// Initialize and render projects
function initializeProjects() {
    renderProjects();
}

function renderProjects() {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';

    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
}

// Create project card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.type = project.projectType;
    card.dataset.tech = [...project.frontend, ...project.backend, ...project.database].join(',');
    card.dataset.features = project.features.join(',');
    
    card.innerHTML = `
        <div class="project-media">
            ${project.media[0].endsWith('.mp4')
                ? `<video src="${project.media[0]}" controls></video>`
                : `<img src="${project.media[0]}" alt="${project.title}">`
            }
        </div>
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <div class="project-meta">
                <div class="tech-stack-tag ${project.frontend[0]}">${formatTechName(project.frontend[0])}</div>
                ${project.backend[0] ? `<div class="tech-stack-tag ${project.backend[0]}">${formatTechName(project.backend[0])}</div>` : ''}
                ${project.database[0] ? `<div class="tech-stack-tag ${project.database[0]}">${formatTechName(project.database[0])}</div>` : ''}
            </div>
            <p class="project-description">${project.description.substring(0, 100)}...</p>
            <div class="project-features">
                ${project.features.slice(0, 3).map(feature => 
                    `<span class="feature-tag">${formatFeatureName(feature)}</span>`
                ).join('')}
                ${project.features.length > 3 ? `<span class="feature-tag">+${project.features.length - 3} more</span>` : ''}
            </div>
            <div class="project-rating">
                ${createStarRating(project.rating)}
                <span>(${project.ratings.length} ratings)</span>
            </div>
            <button class="view-btn" onclick="openProjectModal(${project.id})">View Project</button>
        </div>
    `;
    return card;
}

// Format names for display
function formatTechName(tech) {
    const names = {
        'html5': 'HTML5',
        'css3': 'CSS3',
        'javascript': 'JavaScript',
        'react': 'React',
        'vue': 'Vue.js',
        'angular': 'Angular',
        'nodejs': 'Node.js',
        'php': 'PHP',
        'python': 'Python',
        'ruby': 'Ruby',
        'java': 'Java',
        'dotnet': '.NET',
        'mysql': 'MySQL',
        'mongodb': 'MongoDB',
        'postgresql': 'PostgreSQL',
        'firebase': 'Firebase'
    };
    return names[tech] || tech;
}

function formatFeatureName(feature) {
    const features = {
        'responsive': 'Responsive Design',
        'pwa': 'Progressive Web App',
        'auth': 'Authentication',
        'api': 'API Integration',
        'payment': 'Payment Gateway',
        'analytics': 'Analytics',
        'seo': 'SEO Optimized',
        'multilingual': 'Multilingual'
    };
    return features[feature] || feature;
}

// Create star rating HTML
function createStarRating(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const starClass = i <= rating ? 'fas' : 'far';
        stars.push(`<i class="${starClass} fa-star"></i>`);
    }
    return stars.join('');
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = modal.querySelector('.close-modal');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Initialize rating functionality
    const stars = modal.querySelectorAll('.stars i');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            const projectId = modal.dataset.projectId;
            submitRating(projectId, rating);
        });
    });

    // Initialize comment form
    const commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectId = modal.dataset.projectId;
        const comment = {
            user: 'Anonymous',
            text: commentForm.querySelector('textarea').value,
            date: new Date().toISOString().split('T')[0]
        };
        submitComment(projectId, comment);
        commentForm.reset();
    });
}

// Open project modal
function openProjectModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    const modal = document.getElementById('project-modal');
    
    modal.dataset.projectId = projectId;
    modal.querySelector('#modal-title').textContent = project.title;
    
    // Set project type and tech stack
    modal.querySelector('#modal-type').className = `tech-stack-tag ${project.projectType}`;
    modal.querySelector('#modal-type').textContent = formatProjectType(project.projectType);
    
    // Set frontend stack
    modal.querySelector('#modal-frontend').innerHTML = project.frontend.map(tech =>
        `<span class="tech-stack-tag ${tech}">${formatTechName(tech)}</span>`
    ).join('');
    
    // Set backend stack
    modal.querySelector('#modal-backend').innerHTML = project.backend.map(tech =>
        `<span class="tech-stack-tag ${tech}">${formatTechName(tech)}</span>`
    ).join('');
    
    // Set database stack
    modal.querySelector('#modal-database').innerHTML = project.database.map(tech =>
        `<span class="tech-stack-tag ${tech}">${formatTechName(tech)}</span>`
    ).join('');
    
    // Set media
    const mediaContainer = modal.querySelector('#modal-media');
    mediaContainer.innerHTML = project.media.map(media => 
        media.endsWith('.mp4')
            ? `<video src="${media}" controls></video>`
            : `<img src="${media}" alt="${project.title}">`
    ).join('');
    
    // Set description and features
    modal.querySelector('#modal-description').textContent = project.description;
    modal.querySelector('.features-list').innerHTML = project.features.map(feature =>
        `<div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>${formatFeatureName(feature)}</span>
        </div>`
    ).join('');
    
    // Set links
    const websiteLink = modal.querySelector('#website-link');
    const sourceLink = modal.querySelector('#source-link');
    
    if (project.websiteUrl) {
        websiteLink.href = project.websiteUrl;
        websiteLink.style.display = 'flex';
    } else {
        websiteLink.style.display = 'none';
    }
    
    if (project.sourceUrl) {
        sourceLink.href = project.sourceUrl;
        sourceLink.style.display = 'flex';
    } else {
        sourceLink.style.display = 'none';
    }

    // Render comments
    renderComments(project.comments);

    modal.style.display = 'block';
}

// Format project type
function formatProjectType(type) {
    const types = {
        'website': 'Website',
        'webapp': 'Web Application',
        'ecommerce': 'E-commerce',
        'portfolio': 'Portfolio',
        'blog': 'Blog'
    };
    return types[type] || type;
}

// Submit rating
function submitRating(projectId, rating) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        // Add new rating to the ratings array
        project.ratings.push(rating);
        // Calculate average rating
        project.rating = project.ratings.reduce((a, b) => a + b, 0) / project.ratings.length;
        // Update UI
        const ratingDisplay = document.querySelector(`#project-${projectId} .project-rating`);
        if (ratingDisplay) {
            ratingDisplay.innerHTML = createStarRating(project.rating);
        }
        // Update modal if open
        const modalRating = document.querySelector('#project-modal .project-rating');
        if (modalRating) {
            modalRating.innerHTML = createStarRating(project.rating);
        }
        showNotification('Rating submitted successfully!');
    }
}

// Submit comment
function submitComment(projectId, commentText) {
    if (!commentText.trim()) {
        showNotification('Please enter a comment!', 'error');
        return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const newComment = {
            id: Date.now(),
            user: 'Anonymous', // Could be replaced with actual user name if authentication is added
            text: commentText,
            date: new Date().toISOString().split('T')[0],
            likes: 0
        };
        project.comments.unshift(newComment);
        renderComments(project.comments);
        showNotification('Comment added successfully!');
    }
}

// Render comments
function renderComments(comments) {
    const commentsContainer = document.querySelector('#project-modal .comments-section');
    if (!commentsContainer) return;

    commentsContainer.innerHTML = comments.length === 0 
        ? '<p>No comments yet. Be the first to comment!</p>'
        : comments.map(comment => `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <span class="comment-user">${comment.user}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button class="like-btn" onclick="likeComment(${comment.id})">
                        <i class="fas fa-thumbs-up"></i> ${comment.likes}
                    </button>
                </div>
            </div>
        `).join('');
}

// Like a comment
function likeComment(commentId) {
    const modalContent = document.querySelector('#project-modal .modal-content');
    const projectId = parseInt(modalContent.getAttribute('data-project-id'));
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
        const comment = project.comments.find(c => c.id === commentId);
        if (comment) {
            comment.likes++;
            renderComments(project.comments);
        }
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
