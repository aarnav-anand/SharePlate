document.addEventListener('DOMContentLoaded', async () => {
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
        console.log('Password entered:', password);
        console.log('Post password:', post.password);

        const action = e.submitter.value; // Only "delete" remains
        console.log('Action:', action);

        try {
            // Verify the password
            if (post.password !== password) {
                console.log('Incorrect password');
                throw new Error('Incorrect password');
            }

            if (action === 'delete') {
                console.log('Deleting post...');
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
            console.error('Error:', err);
            alert(err.message || 'An error occurred. Please try again.');
        }
    };

    const cancelButton = document.getElementById('cancel-button');
    cancelButton.onclick = () => {
        modal.style.display = 'none';
    };
}