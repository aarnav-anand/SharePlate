document.addEventListener('DOMContentLoaded', async () => {
    // Check if Supabase client is initialized
    if (!window.supabase) {
        console.error('Supabase client not initialized');
        document.getElementById('post-details').innerHTML = '<p>Error: Application not properly initialized. Please try again later.</p>';
        return;
    }

    const postDetailsContainer = document.getElementById('post-details');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postDetailsContainer.innerHTML = '<p>Error: No post ID provided. Please go back to the main page and try again.</p>';
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
                <h1>${post.title}</h1>
                <p><strong>Description:</strong> ${post.description}</p>
                <p><strong>Address:</strong> ${post.address}</p>
                <div class="button-container">
                    <a href="index.html" class="button">Back to Browse</a>
                    <button id="edit-button" class="button">Edit</button>
                </div>
            </div>
        `;

        // Add event listener for the "Edit" button
        const editButton = document.getElementById('edit-button');
        editButton.addEventListener('click', () => {
            openPasswordModal(post);
        });
    } catch (err) {
        console.error('Error fetching post details:', err);
        postDetailsContainer.innerHTML = '<p>Error loading post. Please try again later.</p>';
    }
});

// Function to open the password modal
function openPasswordModal(post) {
    const modal = document.getElementById('password-modal');
    modal.style.display = 'block';

    const passwordForm = document.getElementById('password-form');
    passwordForm.onsubmit = async (e) => {
        e.preventDefault();

        const password = document.getElementById('post-password').value;
        const action = e.submitter.value; // "mark-taken" or "delete"

        try {
            // Verify the password
            if (post.password !== password) {
                throw new Error('Incorrect password');
            }

            if (action === 'mark-taken') {
                // Mark post as taken
                const { error } = await window.supabase
                    .from('posts')
                    .update({ is_active: false })
                    .eq('post_id', post.post_id);

                if (error) throw error;
                alert('Post marked as taken successfully!');
                modal.style.display = 'none';
                window.location.reload();
            } else if (action === 'delete') {
                // Delete post
                const { error } = await window.supabase
                    .from('posts')
                    .delete()
                    .eq('post_id', post.post_id);

                if (error) throw error;
                alert('Post deleted successfully!');
                modal.style.display = 'none';
                window.location.href = 'index.html';
            }
        } catch (err) {
            alert(err.message || 'An error occurred. Please try again.');
        }
    };

    // Handle cancel button click
    const cancelButton = document.getElementById('cancel-button');
    cancelButton.onclick = () => {
        modal.style.display = 'none';
    };
}