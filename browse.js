document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('posts-container');

    try {
        const { data: posts, error } = await window.supabase
            .from('posts')
            .select('*');

        if (error) {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
            return;
        }

        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts available at the moment.</p>';
            return;
        }

        postsContainer.innerHTML = posts
            .map(
                (post) => `
                <div class="post">
                    <h2>${post.title}</h2>
                    <p>${post.description}</p>
                    <p><strong>Status:</strong> ${post.is_booked ? '<strong>Booked</strong>' : '<strong>Not Booked</strong>'}</p>
                    <a href="post.html?id=${post.post_id}" class="view-details">View Details</a>
                </div>
            `
            )
            .join('');
    } catch (err) {
        console.error('Error:', err);
        postsContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
});
