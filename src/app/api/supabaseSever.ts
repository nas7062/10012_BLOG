import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
import type { Database } from "../type/supabase";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // ✅ RSC에서는 async

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL! || process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string): string | undefined {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options?: CookieOptions) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );
}
