import { getSupabaseClient } from "../api/supabase";
import { IUser } from "../type";

export async function getUserById(id: string): Promise<IUser | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle<IUser>();

  if (error) {
    console.error("유저 조회 실패", error);
    return null;
  }

  return data ?? null;
}
