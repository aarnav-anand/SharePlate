document.addEventListener('DOMContentLoaded', async () => {
    // Check if Supabase client is initialized
    if (!window.supabase) {
        console.error('Supabase client not initialized');
        document.getElementById('post-details').innerHTML = '<p>Error: Application not properly initialized. Please try again later.</p>';
        return;
    }

    const postDetails = document.getElementById('post-details');
    const editButton = document.getElementById('edit-button');
    const passwordModal = document.getElementById('password-modal');
    const passwordForm = document.getElementById('password-form');
    const cancelButton = document.getElementById('cancel-button');

    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postDetails.innerHTML = '<p>Error: No post ID provided. Please go back to the main page and try again.</p>';
        return;
    }

    try {
        // Fetch post details
        const { data: post, error } = await window.supabase
            .from('posts')
            .select('*')
            .eq('post_id', postId)
            .single();

        if (error) throw error;

        if (!post) {
            postDetails.innerHTML = '<p>Post not found.</p>';
            return;
        }

        // Display post details
        postDetails.innerHTML = `
            <div class="post-card">
                <h2>${post.title}</h2>
                <p class="address">${post.address}</p>
                <p class="description">${post.description}</p>
                ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}">` : ''}
                <p class="timestamp">Posted on: ${new Date(post.created_at).toLocaleString()}</p>
                ${post.is_active ? '' : '<p class="status">This food has been taken.</p>'}
            </div>
        `;

        // Show edit button if post is active
        if (post.is_active) {
            editButton.style.display = 'block';
        }

    } catch (error) {
        console.error('Error fetching post:', error);
        postDetails.innerHTML = '<p>Error loading post. Please try again later.</p>';
    }

    // Handle edit button click
    editButton.addEventListener('click', () => {
        passwordModal.style.display = 'block';
    });

    // Handle cancel button click
    cancelButton.addEventListener('click', () => {
        passwordModal.style.display = 'none';
    });

    // Handle password form submission
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = document.getElementById('post-password').value;
        const action = e.submitter.value;

        try {
            // First verify the password
            const { data: post, error: verifyError } = await window.supabase
                .from('posts')
                .select('post_id')
                .eq('post_id', postId)
                .eq('password', password)
                .single();

            if (verifyError || !post) {
                throw new Error('Incorrect password');
            }

            if (action === 'mark-taken') {
                // Mark post as taken
                const { error } = await window.supabase
                    .from('posts')
                    .update({ is_active: false })
                    .eq('post_id', postId)
                    .eq('password', password);

                if (error) throw error;
                alert('Post marked as taken successfully!');
                window.location.reload();
            } else if (action === 'delete') {
                // Delete post
                const { error } = await window.supabase
                    .from('posts')
                    .delete()
                    .eq('post_id', postId)
                    .eq('password', password);

                if (error) throw error;
                alert('Post deleted successfully!');
                window.location.href = 'index.html';
            }

            // Close modal
            passwordModal.style.display = 'none';

        } catch (error) {
            console.error('Error managing post:', error);
            alert('Error: ' + error.message);
        }
    });
}); 
