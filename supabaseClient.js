// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export the client for use in other files
window.supabase = supabaseClient;

// Verify client initialization
if (!window.supabase) {
    console.error('Error: Supabase client failed to initialize');
} else {
    console.log('Supabase client initialized successfully');
} 