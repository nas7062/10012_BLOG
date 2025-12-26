import type { IPost } from "../(wide)/write/_components/WirtePageClient";
import { getSupabaseClient } from "../api/supabase";

const PAGE_SIZE = 5;

export async function getPostList(
  page: number,
  pageSize: number = PAGE_SIZE
): Promise<IPost[]> {
  const supabase = getSupabaseClient();

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from("Post")
    .select("*")
    .range(from, to)
    .order("createdAt", { ascending: false }); // 최신순

  if (error) {
    console.error("데이터 패칭 실패", error);
    return [];
  }

  return (data as IPost[]) ?? [];
}

export { PAGE_SIZE };
