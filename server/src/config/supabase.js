import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export let supabase = null;
export let supabaseAdmin = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    if (supabaseServiceKey) {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    }
    console.log("⚡ Supabase client initialized successfully");
  } catch (err) {
    console.warn("⚠️ Supabase initialization warning:", err.message);
  }
} else {
  console.log("ℹ️ Supabase credentials not fully configured; ModelForge is operating in Local Store / Guest Persistence mode.");
}
