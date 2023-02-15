import { createClient } from "@supabase/supabase-js";

const supabaseURL = 'https://qgyxsidhznpwqzyexawr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFneXhzaWRoem5wd3F6eWV4YXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYwODM1NDYsImV4cCI6MTk5MTY1OTU0Nn0.3EoeecfXprKlTOZjXw6tLIMDM8cU8AWz1Oyd4zxywAE';

export const supabase = createClient(supabaseURL, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    }
});