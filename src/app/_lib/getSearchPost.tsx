import { getSupabaseClient } from "../api/supabase";
import { IPost } from "../type";

export const SEARCH_PAGE_SIZE = 4;

export async function getSearchPost({
  q = "",
  page,
  pageSize = SEARCH_PAGE_SIZE,
}: {
  q: string;
  page: number;
  pageSize?: number;
}): Promise<IPost[]> {
  const supabase = getSupabaseClient();

  if (!q) return [];

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from("Post")
    .select("*")
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("데이터 패칭 실패", error);
    return [];
  }

  return (data as IPost[]) ?? [];
}
