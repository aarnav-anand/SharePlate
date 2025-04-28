// ...existing code...

// Function to render posts
function renderPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.description}</p>
            <a href="post.html?id=${post.post_id}" class="view-details">View Details</a>
        `;

        postsContainer.appendChild(postElement);
    });
}

// Fetch posts from Supabase
async function fetchPosts() {
    const { data: posts, error } = await window.supabase
        .from('posts')
        .select('*');

    if (error) {
        console.error('Error fetching posts:', error);
        return;
    }

    renderPosts(posts);
}

// Initialize
fetchPosts();
