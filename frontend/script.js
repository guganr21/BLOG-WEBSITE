const API_URL = 'https://blog-website-4wt9.vercel.app/blogs';
const blogForm = document.getElementById('blogForm');
const blogList = document.getElementById('blogList');
const loading = document.getElementById('loading');

// Fetch and display blogs
async function fetchBlogs() {
    loading.classList.remove('hidden');
    try {
        const res = await fetch(API_URL);
        const blogs = await res.json();
        blogList.innerHTML = blogs.map(blog => `
            <div class="blog-card">
                <h3>${blog.title}</h3>
                <small>By ${blog.author} | ${new Date(blog.createdAt).toLocaleDateString()}</small>
                <p>${blog.content}</p>
                <button class="btn-edit" onclick="editBlog('${blog._id}', '${blog.title}', '${blog.author}', '${escape(blog.content)}')">Edit</button>
                <button class="btn-delete" onclick="deleteBlog('${blog._id}')">Delete</button>
            </div>
        `).join('');
    } catch (err) {
        alert("Failed to load blogs");
    } finally {
        loading.classList.add('hidden');
    }
}

// Handle Form Submit (Create or Update)
blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('blogId').value;
    const data = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        content: document.getElementById('content').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        blogForm.reset();
        document.getElementById('blogId').value = '';
        fetchBlogs();
        alert(id ? "Blog Updated!" : "Blog Posted!");
    } catch (err) {
        alert("Action failed");
    }
});

async function deleteBlog(id) {
    if (confirm("Delete this blog?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchBlogs();
    }
}

function editBlog(id, title, author, content) {
    document.getElementById('blogId').value = id;
    document.getElementById('title').value = title;
    document.getElementById('author').value = author;
    document.getElementById('content').value = unescape(content);
    document.getElementById('submitBtn').innerText = "Update Blog";
}

fetchBlogs();
