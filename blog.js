// Rich Text Editor
function initRichTextEditor() {
    const toolbar = document.querySelector('.editor-toolbar');
    const editor = document.getElementById('editor-content');
    
    if (!toolbar || !editor) return;
    
    toolbar.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const command = button.dataset.command;
            
            if (command === 'createLink') {
                const url = prompt('Enter the link URL:');
                if (url) document.execCommand(command, false, url);
            } else if (command === 'insertImage') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            document.execCommand('insertImage', false, e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            } else {
                document.execCommand(command, false, null);
            }
        });
    });
}

// Media Preview
function initMediaPreview() {
    const mediaInput = document.getElementById('blog-media');
    const previewContainer = document.getElementById('media-preview');
    
    if (!mediaInput || !previewContainer) return;
    
    mediaInput.addEventListener('change', (e) => {
        previewContainer.innerHTML = '';
        
        [...e.target.files].forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const element = file.type.startsWith('video')
                    ? document.createElement('video')
                    : document.createElement('img');
                    
                element.src = e.target.result;
                if (element instanceof HTMLVideoElement) {
                    element.controls = true;
                }
                previewContainer.appendChild(element);
            };
            reader.readAsDataURL(file);
        });
    });
}

// Blog Posts Management
let currentPage = 1;
const postsPerPage = 9;
let allPosts = [];

// API functions
async function getBlogPosts(filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.sort) queryParams.append('sort', filters.sort);
        
        const response = await fetch(`/api/blog?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return await response.json();
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

async function getBlogPost(id) {
    try {
        const response = await fetch(`/api/blog?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        return await response.json();
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

async function createBlogPost(postData) {
    try {
        const response = await fetch('/api/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) throw new Error('Failed to create post');
        return await response.json();
    } catch (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }
}

async function updateBlogPost(id, postData) {
    try {
        const response = await fetch(`/api/blog?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
        if (!response.ok) throw new Error('Failed to update post');
        return await response.json();
    } catch (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
}

async function deleteBlogPost(id) {
    try {
        const response = await fetch(`/api/blog?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete post');
        return await response.json();
    } catch (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
}

function loadBlogPosts(page = 1, filters = {}) {
    const start = (page - 1) * postsPerPage;
    const end = start + postsPerPage;
    
    getBlogPosts(filters).then(posts => {
        allPosts = posts;
        renderBlogPosts(posts.slice(start, end));
        updatePagination(posts.length);
    });
}

function renderBlogPosts(posts) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    
    const postsHTML = posts.map(post => `
        <article class="blog-card" data-id="${post.id}">
            ${post.media[0] ? `
                <div class="blog-card-media">
                    ${post.media[0].endsWith('.mp4')
                        ? `<video src="${post.media[0]}" muted loop></video>`
                        : `<img src="${post.media[0]}" alt="${post.title}">`
                    }
                </div>
            ` : ''}
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span>${new Date(post.date).toLocaleDateString()}</span>
                    <span>${post.category}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="blog-tags">
                    ${post.tags.map(tag => `
                        <span class="blog-tag">${tag}</span>
                    `).join('')}
                </div>
            </div>
        </article>
    `).join('');
    
    grid.innerHTML = postsHTML;
    
    // Add click handlers
    grid.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', () => openBlogPost(card.dataset.id));
    });
}

function openBlogPost(postId) {
    const modal = document.getElementById('blog-modal');
    if (!modal) return;
    
    // Find post in allPosts array
    const post = allPosts.find(p => p.id === postId);
    if (!post) {
        console.error('Post not found');
        return;
    }
    
    modal.style.display = 'block';
    
    document.getElementById('modal-title').textContent = post.title;
    modal.querySelector('.post-date').textContent = new Date(post.date).toLocaleDateString();
    modal.querySelector('.post-category').textContent = post.category;
    modal.querySelector('.post-content').innerHTML = post.content;
    
    // Setup media
    const mediaContainer = modal.querySelector('.post-media');
    if (post.media && post.media.length > 0) {
        mediaContainer.innerHTML = post.media.map(media => 
            media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.mov')
                ? `<video src="${media}" controls></video>`
                : `<img src="${media}" alt="">`
        ).join('');
    } else {
        mediaContainer.innerHTML = '';
    }
    
    // Setup tags
    modal.querySelector('.post-tags').innerHTML = post.tags.map(tag =>
        `<span class="blog-tag">${tag}</span>`
    ).join('');
    
    // Load comments
    loadComments(postId);
}

function loadComments(postId) {
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList) return;
    
    // Simulate API call - replace with actual API call
    getComments(postId).then(comments => {
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment">
                <p>${comment.text}</p>
                <div class="comment-meta">
                    <span>${new Date(comment.date).toLocaleDateString()}</span>
                    <button class="like-btn" data-id="${comment.id}">
                        <i class="fas fa-heart"></i>
                        ${comment.likes}
                    </button>
                </div>
            </div>
        `).join('');
    });
}

// Admin Authentication
let isAdmin = false;

function checkAdminStatus() {
    isAdmin = auth.validateSession();
    updateAdminUI();
}

function updateAdminUI() {
    const createBlogBtn = document.getElementById('create-blog-btn');
    const adminSection = document.querySelector('.admin-section');
    const adminLogin = document.getElementById('admin-login');
    const blogEditor = document.getElementById('blog-editor');
    
    if (createBlogBtn) {
        createBlogBtn.style.display = isAdmin ? 'flex' : 'none';
    }
    
    if (adminSection) {
        adminSection.style.display = 'block';
        if (adminLogin) adminLogin.style.display = isAdmin ? 'none' : 'block';
        if (blogEditor) blogEditor.style.display = 'none';
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('admin-password').value;
    const errorDisplay = document.createElement('div');
    errorDisplay.className = 'login-error';
    const form = document.getElementById('admin-login-form');
    
    // Remove any existing error message
    const existingError = form.querySelector('.login-error');
    if (existingError) existingError.remove();
    
    try {
        await auth.login(password);
        isAdmin = true;
        updateAdminUI();
        document.getElementById('admin-password').value = '';
        
        // Show success message
        errorDisplay.style.color = 'var(--primary-color)';
        errorDisplay.textContent = 'Login successful!';
        form.appendChild(errorDisplay);
        
        // Remove success message after 2 seconds
        setTimeout(() => errorDisplay.remove(), 2000);
        
    } catch (error) {
        // Show error message
        errorDisplay.style.color = 'red';
        errorDisplay.textContent = error.message;
        form.appendChild(errorDisplay);
    }
}

function handleLogout() {
    auth.logout();
    isAdmin = false;
    updateAdminUI();
}

function handleCreateBlog() {
    const adminSection = document.querySelector('.admin-section');
    const blogEditor = document.getElementById('blog-editor');
    
    if (adminSection && blogEditor) {
        adminSection.style.display = 'block';
        blogEditor.style.display = 'block';
        
        // Clear form
        document.getElementById('blog-post-form').reset();
        document.getElementById('editor-content').innerHTML = '';
        document.getElementById('media-preview').innerHTML = '';
        
        // Scroll to editor
        blogEditor.scrollIntoView({ behavior: 'smooth' });
    }
}

async function handleBlogPostSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('blog-title').value;
    const category = document.getElementById('blog-category').value;
    const content = document.getElementById('editor-content').innerHTML;
    const tags = document.getElementById('blog-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const mediaFiles = document.getElementById('blog-media').files;
    
    if (!title || !content) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Convert media files to base64 (for demo purposes)
    const media = [];
    for (let file of mediaFiles) {
        const reader = new FileReader();
        reader.onload = (e) => {
            media.push(e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    // Wait for media to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const postData = {
        title,
        category,
        content,
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        tags,
        media,
        author: 'Sizwe Ramokhali'
    };
    
    try {
        await createBlogPost(postData);
        alert('Blog post created successfully!');
        
        // Hide editor and reload posts
        document.querySelector('.admin-section').style.display = 'none';
        loadBlogPosts(currentPage);
        
    } catch (error) {
        console.error('Error creating blog post:', error);
        alert('Failed to create blog post. Please try again.');
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    checkAdminStatus();
    initRichTextEditor();
    initMediaPreview();
    
    // Setup admin login
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Setup create blog button
    const createBlogBtn = document.getElementById('create-blog-btn');
    if (createBlogBtn) {
        createBlogBtn.addEventListener('click', handleCreateBlog);
    }
    
    // Setup blog post form
    const blogPostForm = document.getElementById('blog-post-form');
    if (blogPostForm) {
        blogPostForm.addEventListener('submit', handleBlogPostSubmit);
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Setup search and filters
    const searchInput = document.getElementById('search-blogs');
    const categoryFilter = document.getElementById('category-filter');
    const sortSelect = document.getElementById('sort-by');
    
    const updateFilters = () => {
        const filters = {
            search: searchInput?.value || '',
            category: categoryFilter?.value || '',
            sort: sortSelect?.value || 'newest'
        };
        currentPage = 1;
        loadBlogPosts(currentPage, filters);
    };
    
    searchInput?.addEventListener('input', updateFilters);
    categoryFilter?.addEventListener('change', updateFilters);
    sortSelect?.addEventListener('change', updateFilters);
    
    // Load initial posts
    loadBlogPosts(currentPage);
    
    // Setup load more button
    document.getElementById('load-more')?.addEventListener('click', () => {
        currentPage++;
        loadBlogPosts(currentPage);
    });
    
    // Setup modal close
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        document.getElementById('blog-modal').style.display = 'none';
    });
});
