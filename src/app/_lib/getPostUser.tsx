import { getSupabaseClient } from "../api/supabase";
import { IUser } from "../type";
type PostUserResult = { user: IUser };
export async function getPostUser(
  postId: number
): Promise<PostUserResult | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("Post")
    .select("email")
    .eq("id", postId)
    .maybeSingle<{ email: string }>();

  if (!data?.email) {
    console.warn("해당 Post에서 이메일을 찾을 수 없습니다.");
    return null;
  }
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", data.email)
    .maybeSingle<IUser>();
  if (!user) return null;
  if (userError) {
    console.error("데이터 패칭 실패", error);
    return null;
  }

  return { user: user };
}
