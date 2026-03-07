import { getSupabaseClient } from "@/src/app/api/supabase";

export async function deleteComment(id: number) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("Repple")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("삭제 대상 댓글이 없습니다.");
  }

  return data;
}
