import { IPost } from "../(wide)/write/_components/WirtePageClient";
import { getSupabaseClient } from "../api/supabase";

export async function getFollowPosts(userId: string) {
  const supabase = getSupabaseClient();

  // 1. 내가 팔로우하는 사람들 (following)
  const { data: followingRows, error: followingError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (followingError) {
    console.error("팔로잉 목록 조회 오류", followingError);
    return null;
  }

  const followingIds =
    followingRows?.map((row: { following_id: string }) => row.following_id) ??
    [];

  let followingPosts: IPost[] = [];
  if (followingIds.length > 0) {
    const { data, error } = await supabase
      .from("Post")
      .select("*")
      .in("userId", followingIds);

    if (error) {
      console.error("  유저 정보 조회 오류", error);
      return null;
    }
    followingPosts = data ?? [];
  }

  return followingPosts;
}
