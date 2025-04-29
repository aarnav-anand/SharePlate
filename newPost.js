document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-post-form');
    const successModal = document.getElementById('success-modal');
    const closeSuccessModal = document.getElementById('close-success-modal');

    // Handle close button click
    closeSuccessModal.addEventListener('click', () => {
        successModal.style.display = 'none';
        // Reset form
        form.reset();
        form.style.display = 'block';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const address = document.getElementById('address').value;
        const password = document.getElementById('password').value;
        console.log('Form submitted with values:', { title, description, address, password });

        try {
            // Insert post into database
            console.log('Starting post creation...');
            const { data: post, error } = await window.supabase
                .from('posts')
                .insert([
                    {
                        title,
                        description,
                        address,
                        is_active: true,
                        password: password
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Post creation error:', error);
                throw error;
            }

            console.log('Post created successfully:', post);

            // Show success modal
            form.style.display = 'none';
            successModal.style.display = 'block';

        } catch (error) {
            console.error('Error in form submission:', error);
            alert(`Error creating post: ${error.message}. Please try again.`);
        }
    });
});
