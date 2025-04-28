// Supabase configuration
const SUPABASE_URL = 'https://fruqqgibzrjxrbylaorw.supabase.co';  // Replace with your actual Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydXFxZ2lienJqeHJieWxhb3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzM0ODcsImV4cCI6MjA2MTQwOTQ4N30.mJXvnxnvPqn8o7sCQqiBS0CNXwLC9V9vu1sbLC7Wo8g';  // Replace with your actual Supabase anon key

// Verify configuration
if (!SUPABASE_URL || SUPABASE_URL === 'https://your-project-id.supabase.co') {
    console.error('Error: Supabase URL is not configured. Please update config.js with your Supabase project URL.');
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your-anon-key') {
    console.error('Error: Supabase anon key is not configured. Please update config.js with your Supabase anon key.');
} 