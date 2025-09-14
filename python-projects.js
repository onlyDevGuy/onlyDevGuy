// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeUploadForm();
    initializeProjects();
    initializeModal();
});

// Sample projects data (replace with backend storage later)
let projects = [
    {
        id: 1,
        title: "Machine Learning Image Classifier",
        description: "A Python project using TensorFlow for image classification",
        media: ["project1.jpg"],
        rating: 4.5,
        ratings: [],
        comments: [
            { user: "John", text: "Great project!", date: "2024-01-20" }
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
        const mediaFiles = [...mediaInput.files].map(file => URL.createObjectURL(file));

        // Add new project
        const project = {
            id: Date.now(),
            title,
            description,
            media: mediaFiles,
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
    card.innerHTML = `
        <div class="project-media">
            ${project.media[0].endsWith('.mp4')
                ? `<video src="${project.media[0]}" controls></video>`
                : `<img src="${project.media[0]}" alt="${project.title}">`
            }
        </div>
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
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
    modal.querySelector('#modal-description').textContent = project.description;
    
    // Render media
    const mediaContainer = modal.querySelector('#modal-media');
    mediaContainer.innerHTML = project.media.map(media => 
        media.endsWith('.mp4')
            ? `<video src="${media}" controls></video>`
            : `<img src="${media}" alt="${project.title}">`
    ).join('');

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
