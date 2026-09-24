import { createClient } from "@supabase/supabase-js";

// Read from Vite env variables or fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Mock / Guest user for instant access
 */
export const GUEST_USER = {
  id: "usr_modelforge_researcher",
  email: "developer@modelforge.ai",
  user_metadata: {
    full_name: "Lead AI Researcher",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  role: "Lead Researcher"
};
