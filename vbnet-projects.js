// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeUploadForm();
    initializeProjects();
    initializeModal();
    initializeFilters();
});

// Sample projects data (replace with backend storage later)
let projects = [
    {
        id: 1,
        title: "Inventory Management System",
        description: "A comprehensive Windows Forms application for managing inventory, sales, and reporting",
        appType: "winforms",
        features: ["database", "reporting", "excel"],
        media: ["inventory-app.jpg"],
        downloadUrl: "https://example.com/download/inventory",
        sourceUrl: "https://github.com/example/inventory",
        rating: 4.5,
        ratings: [],
        comments: [
            { user: "Mike", text: "Great for small businesses!", date: "2024-01-20" }
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
        const appType = form.querySelector('input[name="app-type"]:checked').value;
        const features = [...form.querySelectorAll('.feature-tag input:checked')].map(input => input.value);
        const mediaFiles = [...mediaInput.files].map(file => URL.createObjectURL(file));
        const downloadUrl = document.getElementById('project-download').value;
        const sourceUrl = document.getElementById('project-source').value;

        // Add new project
        const project = {
            id: Date.now(),
            title,
            description,
            appType,
            features,
            media: mediaFiles,
            downloadUrl,
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
    const appTypeButtons = document.querySelectorAll('.app-type-filter .filter-btn');
    const featureSelect = document.getElementById('feature-select');
    
    appTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            appTypeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects();
        });
    });
    
    featureSelect.addEventListener('change', filterProjects);
}

// Filter projects
function filterProjects() {
    const selectedType = document.querySelector('.app-type-filter .filter-btn.active').dataset.type;
    const selectedFeature = document.getElementById('feature-select').value;
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const typeMatch = selectedType === 'all' || card.dataset.type === selectedType;
        const featureMatch = selectedFeature === 'all' || card.dataset.features.includes(selectedFeature);
        
        card.style.display = typeMatch && featureMatch ? 'block' : 'none';
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
    card.dataset.type = project.appType;
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
            <div class="project-tags">
                <div class="app-type-tag ${project.appType}">${formatAppType(project.appType)}</div>
                ${project.features.slice(0, 3).map(feature => 
                    `<span class="feature-tag">${formatFeatureName(feature)}</span>`
                ).join('')}
                ${project.features.length > 3 ? `<span class="feature-tag">+${project.features.length - 3} more</span>` : ''}
            </div>
            <p class="project-description">${project.description.substring(0, 100)}...</p>
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
function formatAppType(type) {
    const types = {
        'winforms': 'Windows Forms',
        'wpf': 'WPF',
        'console': 'Console App',
        'service': 'Windows Service'
    };
    return types[type] || type;
}

function formatFeatureName(feature) {
    const features = {
        'database': 'Database',
        'reporting': 'Reporting',
        'api': 'API',
        'excel': 'Excel',
        'charts': 'Charts',
        'printing': 'Printing'
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
    
    // Set app type and features
    modal.querySelector('#modal-app-type').className = `app-type-tag ${project.appType}`;
    modal.querySelector('#modal-app-type').textContent = formatAppType(project.appType);
    
    modal.querySelector('#modal-features').innerHTML = project.features.map(feature =>
        `<span class="feature-tag">${formatFeatureName(feature)}</span>`
    ).join('');
    
    // Set media
    const mediaContainer = modal.querySelector('#modal-media');
    mediaContainer.innerHTML = project.media.map(media => 
        media.endsWith('.mp4')
            ? `<video src="${media}" controls></video>`
            : `<img src="${media}" alt="${project.title}">`
    ).join('');
    
    // Set description and links
    modal.querySelector('#modal-description').textContent = project.description;
    
    const downloadLink = modal.querySelector('#download-link');
    const sourceLink = modal.querySelector('#source-link');
    
    if (project.downloadUrl) {
        downloadLink.href = project.downloadUrl;
        downloadLink.style.display = 'flex';
    } else {
        downloadLink.style.display = 'none';
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

// Submit rating
function submitRating(projectId, rating) {
    const project = projects.find(p => p.id === parseInt(projectId));
    project.ratings.push(parseInt(rating));
    project.rating = project.ratings.reduce((a, b) => a + b) / project.ratings.length;

    const message = document.querySelector('.rating-message');
    message.textContent = 'Thank you for your feedback!';
    message.classList.add('show');

    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);

    renderProjects();
}

// Submit comment
function submitComment(projectId, comment) {
    const project = projects.find(p => p.id === parseInt(projectId));
    project.comments.unshift(comment);
    renderComments(project.comments);
    showNotification('Comment posted successfully!');
}

// Render comments
function renderComments(comments) {
    const commentsList = document.querySelector('.comments-list');
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <span>${comment.user}</span>
                <span>${comment.date}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
        </div>
    `).join('');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
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
