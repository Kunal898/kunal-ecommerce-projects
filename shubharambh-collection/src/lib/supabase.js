import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a function to get the supabase client to prevent crashing during build time
// if environment variables are missing (e.g. on Netlify build servers)
const createSupabaseClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a mock or handle the error gracefully during build
        console.warn("⚠️ Supabase URL or Anon Key missing. Ignoring during build...");
        return null; 
    }
    return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();
