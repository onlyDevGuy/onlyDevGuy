// Simple API for blog posts using JSON storage
// This works with Azure Static Web Apps without requiring a database subscription

const fs = require('fs');
const path = require('path');

const BLOG_DATA_PATH = path.join(__dirname, 'blog-posts.json');

// Helper function to read blog data
function readBlogData() {
  try {
    const data = fs.readFileSync(BLOG_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blog data:', error);
    return { posts: [], nextId: 1 };
  }
}

// Helper function to write blog data
function writeBlogData(data) {
  try {
    fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing blog data:', error);
    return false;
  }
}

// Get all blog posts
module.exports = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const blogData = readBlogData();
    
    if (req.method === 'GET') {
      // Get all posts or filter by query parameters
      let posts = blogData.posts;
      
      // Apply filters
      const { category, search, sort = 'newest' } = req.query;
      
      if (category) {
        posts = posts.filter(post => post.category === category);
      }
      
      if (search) {
        const searchTerm = search.toLowerCase();
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply sorting
      switch (sort) {
        case 'oldest':
          posts.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'popular':
          posts.sort((a, b) => b.likes - a.likes);
          break;
        case 'newest':
        default:
          posts.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
      }
      
      res.status(200).json(posts);
      
    } else if (req.method === 'POST') {
      // Create new blog post
      const newPost = {
        id: blogData.nextId.toString(),
        ...req.body,
        date: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      
      blogData.posts.push(newPost);
      blogData.nextId++;
      
      if (writeBlogData(blogData)) {
        res.status(201).json(newPost);
      } else {
        res.status(500).json({ error: 'Failed to save blog post' });
      }
      
    } else if (req.method === 'PUT') {
      // Update existing blog post
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'Post ID is required' });
        return;
      }
      
      const postIndex = blogData.posts.findIndex(post => post.id === id);
      if (postIndex === -1) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      
      blogData.posts[postIndex] = {
        ...blogData.posts[postIndex],
        ...req.body,
        id: id, // Ensure ID doesn't change
        date: blogData.posts[postIndex].date // Preserve original date
      };
      
      if (writeBlogData(blogData)) {
        res.status(200).json(blogData.posts[postIndex]);
      } else {
        res.status(500).json({ error: 'Failed to update blog post' });
      }
      
    } else if (req.method === 'DELETE') {
      // Delete blog post
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'Post ID is required' });
        return;
      }
      
      const postIndex = blogData.posts.findIndex(post => post.id === id);
      if (postIndex === -1) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      
      blogData.posts.splice(postIndex, 1);
      
      if (writeBlogData(blogData)) {
        res.status(200).json({ message: 'Post deleted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to delete blog post' });
      }
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};