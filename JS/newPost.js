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
        const imageFile = document.getElementById('image').files[0];

        try {
            let imageUrl = null;

            // Upload image if provided
            if (imageFile) {
                console.log('Starting image upload...');
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await window.supabase.storage
                    .from('food-images')
                    .upload(fileName, imageFile);

                if (uploadError) {
                    console.error('Image upload error:', uploadError);
                    throw uploadError;
                }

                console.log('Image uploaded successfully:', uploadData);

                const { data: { publicUrl } } = window.supabase.storage
                    .from('food-images')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
                console.log('Image URL:', imageUrl);
            }

            // Insert post into database
            console.log('Starting post creation...');
            const { data: post, error } = await window.supabase
                .from('posts')
                .insert([
                    {
                        title,
                        description,
                        address,
                        image_url: imageUrl,
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