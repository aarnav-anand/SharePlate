// Function to fetch and display posts
async function fetchAndDisplayPosts() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '<p>Loading posts...</p>';

    try {
        // Verify Supabase client is available
        if (!window.supabase) {
            throw new Error('Supabase client not initialized');
        }

        // Fetch active posts from Supabase
        const { data: posts, error } = await window.supabase
            .from('posts')
            .select('post_id, title, description, address, image_url, created_at')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts available at the moment.</p>';
            return;
        }

        // Clear loading message
        postsContainer.innerHTML = '';

        // Create and append post cards
        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            
            postCard.innerHTML = `
                <h2>${post.title}</h2>
                <p class="address">${post.address}</p>
                <p class="description">${post.description}</p>
                ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}">` : ''}
                <p class="timestamp">Posted: ${new Date(post.created_at).toLocaleString()}</p>
                <a href="post.html?id=${post.post_id}" class="view-details">View Details</a>
            `;

            postsContainer.appendChild(postCard);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        postsContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
}

// Fetch posts when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayPosts); 