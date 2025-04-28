document.addEventListener('DOMContentLoaded', async () => {
    // Check if Supabase client is initialized
    if (!window.supabase) {
        console.error('Supabase client not initialized');
        document.getElementById('post-details').innerHTML = '<p>Error: Application not properly initialized. Please try again later.</p>';
        return;
    }

    const postDetailsContainer = document.getElementById('post-details');
    const passwordModal = document.getElementById('password-modal');
    const passwordForm = document.getElementById('password-form');
    const cancelButton = document.getElementById('cancel-button');

    // Get the post ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postDetailsContainer.innerHTML = '<p class="error-message">Invalid post ID.</p>';
        return;
    }

    try {
        const { data: post, error } = await window.supabase
            .from('posts')
            .select('*')
            .eq('post_id', postId)
            .single();

        if (error || !post) {
            throw new Error('Post not found');
        }

        postDetailsContainer.innerHTML = `
            <div class="post-details">
                <h1 class="post-title">${post.title}</h1>
                <p class="post-description"><strong>Description:</strong> ${post.description}</p>
                <p class="post-address"><strong>Address:</strong> ${post.address}</p>
                <div class="button-container">
                    <a href="index.html" class="button">Back to Browse</a>
                    <button id="edit-button" class="button">Edit</button>
                </div>
            </div>
        `;

        // Add event listener for the "Edit" button
        const editButton = document.getElementById('edit-button');
        editButton.addEventListener('click', () => {
            passwordModal.style.display = 'block';
        });
    } catch (err) {
        console.error('Error fetching post details:', err);
        postDetailsContainer.innerHTML = '<p class="error-message">Error loading post. Please try again later.</p>';
    }

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
        } catch (error) {
            alert(error.message || 'An error occurred. Please try again.');
        } finally {
            passwordModal.style.display = 'none';
        }
    });

    // Initialize
    fetchPostDetails();
});