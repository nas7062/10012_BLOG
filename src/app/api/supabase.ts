import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL! || process.env.SUPABASE_URL!;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.SUPABASE_ANON_KEY!;

export function getSupabaseClient() {
  if (!supabaseUrl) {
    throw new Error(
      "supabaseUrl is required. Please set NEXT_PUBLIC_SUPABASE_URL in .env.local"
    );
  }
  if (!supabaseAnonKey) {
    throw new Error(
      "supabaseKey is required. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
