// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-mode');
    const body = document.body;

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('light-mode');
    });

    initTheme();
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initContactForm();
    initParticles();
    initServiceModal();
    initializeGallery();
    initMobileMenu();

    // Setup theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

// Mobile Navigation
function initNavigation() {
    const dockLinks = document.querySelectorAll('.dock-link');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Handle active state for dock links
    dockLinks.forEach(link => {
        if (link.getAttribute('href') === window.location.hash || 
            link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function() {
            dockLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Handle smooth scroll for hash links
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                event.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Handle theme toggle
    let isDark = true;
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        document.body.classList.toggle('light-mode');
        themeToggle.querySelector('i').classList.toggle('fa-sun');
        themeToggle.querySelector('i').classList.toggle('fa-moon');
    });
    
    // Update active state on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 60) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        dockLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });
}

// Typing effect for the subtitle
function initTypingEffect() {
    const text = "I'm Sizwe Ramokhali, crafting digital solutions for tomorrow.";
    const typingText = document.querySelector('.typing-text');
    let i = 0;

    function type() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }

    // Clear and start typing
    if (typingText) {
        typingText.textContent = '';
        setTimeout(type, 1000);
    }
}

// Scroll animations for sections
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.about-card, .service-card');

    // Intersection Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe sections
    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // Intersection Observer for cards
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe cards
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('card-hidden');
        cardObserver.observe(card);
    });
}

// Contact form handling
// Service Modal
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sideDock = document.querySelector('.side-dock');

    if (menuToggle && sideDock) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            sideDock.classList.toggle('open');
        });
    }
}

function initServiceModal() {
    const modalOverlay = document.getElementById('service-modal');
    const serviceCards = document.querySelectorAll('.service-card');

    if (!modalOverlay) return;

    const modalContent = modalOverlay.querySelector('.modal-content');
    const closeButton = modalOverlay.querySelector('.modal-close');
    const titleElement = document.getElementById('modal-title');
    const descriptionElement = document.getElementById('modal-description');
    const iconContainer = document.getElementById('modal-icon-container');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.dataset.title;
            const description = card.dataset.description;
            const iconHTML = card.querySelector('i').outerHTML;

            titleElement.textContent = title;
            descriptionElement.textContent = description;
            iconContainer.innerHTML = iconHTML;

            modalOverlay.classList.remove('hidden');
        });
    });

    function closeModal() {
        modalOverlay.classList.add('hidden');
    }

    closeButton.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate form submission (replace with actual form submission)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            form.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Particle background effect
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;
    
    if (particlesContainer) {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and animation duration
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = 3 + Math.random() * 5 + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            particlesContainer.appendChild(particle);
        }
    }
}

// Project Gallery Functions
function initializeGallery() {
    const projectsGrid = document.getElementById('projects-grid');
    const searchInput = document.getElementById('search-projects');
    const sortSelect = document.getElementById('sort-by');
    
    if (!projectsGrid) return; // Only run on project pages
    
    // Load and display projects
    loadProjects().then(projects => {
        renderProjects(projects);
        
        // Setup search functionality
        searchInput?.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProjects = projects.filter(project => 
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm)
            );
            renderProjects(filteredProjects);
        });
        
        // Setup sorting
        sortSelect?.addEventListener('change', (e) => {
            const sortedProjects = [...projects].sort((a, b) => {
                switch(e.target.value) {
                    case 'rating':
                        return b.rating - a.rating;
                    case 'popular':
                        return (b.comments?.length || 0) - (a.comments?.length || 0);
                    case 'newest':
                    default:
                        return new Date(b.date) - new Date(a.date);
                }
            });
            renderProjects(sortedProjects);
        });
    });
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    grid.innerHTML = projects.map(project => `
        <div class="project-card" data-id="${project.id}">
            <div class="project-media">
                ${project.media[0]?.endsWith('.mp4') 
                    ? `<video src="${project.media[0]}" muted loop></video>`
                    : `<img src="${project.media[0]}" alt="${project.title}">`
                }
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 100)}...</p>
                <div class="project-rating">
                    ${createStarRating(project.rating)}
                    <span>(${project.ratings?.length || 0})</span>
                </div>
                <button class="btn view-project" data-id="${project.id}">View Details</button>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for project cards
    document.querySelectorAll('.view-project').forEach(btn => {
        btn.addEventListener('click', () => openProjectModal(btn.dataset.id));
    });
}

function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const project = projects.find(p => p.id === parseInt(projectId));
    if (!modal || !project) return;
    
    modal.style.display = 'block';
    
    // Populate modal content
    document.getElementById('modal-title').textContent = project.title;
    
    // Setup media carousel
    const mediaContainer = modal.querySelector('.project-media');
    mediaContainer.innerHTML = project.media.map(media => 
        media.endsWith('.mp4')
            ? `<video src="${media}" controls></video>`
            : `<img src="${media}" alt="${project.title}">`
    ).join('');
    
    // Setup rating functionality
    const stars = modal.querySelectorAll('.star-rating i');
    stars.forEach(star => {
        star.addEventListener('click', () => rateProject(projectId, parseInt(star.dataset.rating)));
    });
    
    // Load comments
    loadComments(projectId);
    
    // Setup comment form
    const commentForm = document.getElementById('comment-form');
    commentForm.onsubmit = (e) => {
        e.preventDefault();
        const comment = commentForm.querySelector('textarea').value;
        addComment(projectId, comment);
        commentForm.reset();
    };
}

function rateProject(projectId, rating) {
    const project = projects.find(p => p.id === parseInt(projectId));
    if (!project) return;
    
    project.ratings = project.ratings || [];
    project.ratings.push(rating);
    project.rating = project.ratings.reduce((a, b) => a + b) / project.ratings.length;
    
    // Update UI
    document.querySelector('.rating-count').textContent = 
        `(${project.ratings.length} rating${project.ratings.length === 1 ? '' : 's'})`;
    updateStarRating(rating);
    
    // Save to storage
    saveProjects();
}

function addComment(projectId, text) {
    const project = projects.find(p => p.id === parseInt(projectId));
    if (!project) return;
    
    project.comments = project.comments || [];
    const comment = {
        id: Date.now(),
        text,
        date: new Date().toISOString(),
        likes: 0
    };
    
    project.comments.unshift(comment);
    loadComments(projectId); // Refresh comments display
    saveProjects();
}

function loadComments(projectId) {
    const project = projects.find(p => p.id === parseInt(projectId));
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList || !project?.comments) return;
    
    commentsList.innerHTML = project.comments.map(comment => `
        <div class="comment">
            <p>${comment.text}</p>
            <div class="comment-meta">
                <span>${new Date(comment.date).toLocaleDateString()}</span>
                <button class="like-btn" data-id="${comment.id}">
                    <i class="fas fa-heart"></i> ${comment.likes}
                </button>
            </div>
        </div>
    `).join('');
    
    // Add like functionality
    commentsList.querySelectorAll('.like-btn').forEach(btn => {
        btn.onclick = () => likeComment(projectId, parseInt(btn.dataset.id));
    });
}

function likeComment(projectId, commentId) {
    const project = projects.find(p => p.id === parseInt(projectId));
    if (!project) return;
    
    const comment = project.comments.find(c => c.id === commentId);
    if (comment) {
        comment.likes++;
        loadComments(projectId); // Refresh comments
        saveProjects();
    }
}

// Add some CSS for new animations
const style = document.createElement('style');
style.textContent = `
    .section-hidden {
        opacity: 0;
        transform: translateY(50px);
        transition: all 1s;
    }
    
    .visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .card-hidden {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.5s ease-out;
    }
    
    .card-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        background: var(--primary-color);
        color: var(--dark-bg);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.error {
        background: #ff4444;
        color: white;
    }
    
    .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--primary-color);
        border-radius: 50%;
        animation: float linear infinite;
        opacity: 0.5;
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
        }
        100% {
            transform: translateY(-100vh) scale(0);
            opacity: 0;
        }
    }
    
    .navbar.scroll-down {
        transform: translateY(-100%);
    }
    
    .navbar.scroll-up {
        transform: translateY(0);
    }
    
    .navbar {
        transition: transform 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.95);
            padding: 1rem;
            backdrop-filter: blur(10px);
        }
    }
`;

document.head.appendChild(style);
