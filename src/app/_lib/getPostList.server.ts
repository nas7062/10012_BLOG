import { IPost } from "../(wide)/write/_components/WirtePageClient";
import { createSupabaseServerClient } from "../api/supabaseSever";

const PAGE_SIZE = 5;

export async function getPostListServer(): Promise<IPost[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Post")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(PAGE_SIZE);

  if (error) throw error;
  return data ?? [];
}

export { PAGE_SIZE };
